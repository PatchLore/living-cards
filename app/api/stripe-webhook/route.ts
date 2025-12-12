import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createCard } from "../../../lib/db/cards";
import { sendCardEmail } from "../../../lib/email/sendCardEmail";
import prisma from "../../../lib/prisma";

// Important: Webhooks must use the Node.js runtime, not Edge
export const runtime = "nodejs";

// Initialize Stripe client
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20" as any,
});

// Raw body is required for webhook signature verification
export async function POST(req: Request): Promise<NextResponse> {
  // 1. Log webhook route hit
  console.log("🔔 [WEBHOOK] Stripe webhook route hit");
  console.log("🔔 [WEBHOOK] Timestamp:", new Date().toISOString());

  // 2. Environment safety - Check STRIPE_WEBHOOK_SECRET first
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("❌ [WEBHOOK] STRIPE_WEBHOOK_SECRET is missing!");
    console.error("❌ [WEBHOOK] Webhook secret must be set in environment variables");
    return new NextResponse("Webhook secret not configured", { status: 500 });
  } else {
    console.log("✅ [WEBHOOK] STRIPE_WEBHOOK_SECRET is configured (length:", webhookSecret.length, "chars)");
  }

  // 3. Validate STRIPE_SECRET_KEY
  if (!process.env.STRIPE_SECRET_KEY) {
    console.error("❌ [WEBHOOK] STRIPE_SECRET_KEY is missing!");
    return new NextResponse("Stripe secret key not configured", { status: 500 });
  }

  // 4. Get raw body and signature
  const body = await req.text();
  const signature = req.headers.get("stripe-signature") as string;

  // 5. Log signature header (for debugging)
  if (signature) {
    console.log("✅ [WEBHOOK] Stripe-Signature header received");
    console.log("🔍 [WEBHOOK] Signature preview:", signature.substring(0, 20) + "...");
  } else {
    console.error("❌ [WEBHOOK] No Stripe signature found on webhook request");
    console.error("❌ [WEBHOOK] Request headers:", Object.fromEntries(req.headers.entries()));
    return new NextResponse("Missing Stripe signature", { status: 400 });
  }

  // 6. Log body length (for debugging, without storing PII)
  console.log("📦 [WEBHOOK] Request body length:", body.length, "bytes");

  let event: Stripe.Event;

  // 7. Graceful error handling for signature verification
  try {
    console.log("🔐 [WEBHOOK] Verifying webhook signature...");
    event = stripe.webhooks.constructEvent(
      body,
      signature!,
      webhookSecret
    );
    console.log("✅ [WEBHOOK] Signature verification successful");
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    const errorType = err instanceof Error ? err.constructor.name : typeof err;
    
    console.error("❌ [WEBHOOK] Signature verification failed");
    console.error("❌ [WEBHOOK] Error type:", errorType);
    console.error("❌ [WEBHOOK] Error message:", errorMessage);
    console.error("❌ [WEBHOOK] Body preview (first 100 chars):", body.substring(0, 100));
    console.error("❌ [WEBHOOK] Signature used:", signature?.substring(0, 20) + "...");
    
    return new NextResponse(
      `Webhook Error: Signature verification failed - ${errorMessage}`,
      { status: 400 }
    );
  }

  // 8. Log event type after successful verification
  console.log("📨 [WEBHOOK] Event type:", event.type);
  console.log("📨 [WEBHOOK] Event ID:", event.id);
  console.log("📨 [WEBHOOK] Event created:", new Date(event.created * 1000).toISOString());
  
  // 9. Temporary debug return (as requested)
  console.log("🔍 [WEBHOOK] Webhook event received:", event.type);

  // --- HANDLE EVENTS ---

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;

      console.log("✅ [WEBHOOK] Payment completed");
      console.log("✅ [WEBHOOK] Session ID:", session.id);
      console.log("✅ [WEBHOOK] Payment status:", session.payment_status);
      console.log("✅ [WEBHOOK] Customer email:", session.customer_details?.email || "Not provided");

      // Metadata from checkout
      const metadata = session.metadata || {};

      console.log("📝 [WEBHOOK] Metadata received:");
      console.log("📝 [WEBHOOK] - cardKey:", metadata.cardKey || "MISSING");
      console.log("📝 [WEBHOOK] - recipient:", metadata.recipient || "MISSING");
      console.log("📝 [WEBHOOK] - message:", metadata.message ? `${metadata.message.substring(0, 50)}...` : "MISSING");

      // Validate required metadata
      const cardKey = metadata.cardKey;
      const recipient = metadata.recipient;
      const message = metadata.message;

      if (!cardKey || !recipient || !message) {
        console.error("❌ [WEBHOOK] Missing required metadata for card creation");
        console.error("❌ [WEBHOOK] cardKey:", !!cardKey, "recipient:", !!recipient, "message:", !!message);
        // Don't fail the webhook - Stripe will retry if we return an error
        // Log and continue so we can see what's happening
        return new NextResponse("Missing required metadata", { status: 400 });
      }

      // 10. Trigger card creation
      try {
        console.log("🎴 [WEBHOOK] Triggering card creation function...");
        
        const card = await createCard({
          cardKey,
          recipientName: recipient,
          message,
          stripeSessionId: session.id,
          stripeCustomerEmail: session.customer_details?.email ?? null,
        });

        console.log("✅ [WEBHOOK] Card creation function completed successfully");
        console.log("✅ [WEBHOOK] Card created with share_id:", card.share_id);
        console.log("✅ [WEBHOOK] Card ID:", card.id);
        
        // 11. Log confirmation that internal card creation was triggered
        console.log("✅ [WEBHOOK] Internal card creation function was triggered and completed");
        console.log("✅ [WEBHOOK] Card is now available at share_id:", card.share_id);

        // 12. Send email if not already sent
        if (!card.email_sent && session.customer_details?.email) {
          try {
            console.log("📧 [WEBHOOK] Sending email to:", session.customer_details.email);
            await sendCardEmail({
              to: session.customer_details.email,
              shareId: card.share_id,
              recipientName: card.recipient_name,
            });

            // Mark email as sent
            await prisma.card.update({
              where: { id: card.id },
              data: { emailSent: true },
            });

            console.log("✅ [WEBHOOK] Email sent successfully");
          } catch (emailError: unknown) {
            const errorMessage = emailError instanceof Error ? emailError.message : "Unknown error";
            console.error("❌ [WEBHOOK] Email sending failed:", errorMessage);
            // Don't fail the webhook if email fails - card is already created
            // Log the error but continue
          }
        } else {
          if (card.email_sent) {
            console.log("ℹ️ [WEBHOOK] Email already sent for this card, skipping");
          } else if (!session.customer_details?.email) {
            console.log("ℹ️ [WEBHOOK] No customer email available, skipping email");
          }
        }
      } catch (cardError: unknown) {
        const errorMessage = cardError instanceof Error ? cardError.message : "Unknown error";
        console.error("❌ [WEBHOOK] Card creation failed:", errorMessage);
        console.error("❌ [WEBHOOK] Error details:", cardError);
        
        // Return error so Stripe knows to retry
        return new NextResponse(
          `Card creation failed: ${errorMessage}`,
          { status: 500 }
        );
      }

      break;
    }

    default:
      console.log(`ℹ️ [WEBHOOK] Unhandled event type: ${event.type}`);
      console.log(`ℹ️ [WEBHOOK] Event ID: ${event.id}`);
  }

  console.log("✅ [WEBHOOK] Webhook processing completed successfully");
  return new NextResponse("Webhook received", { status: 200 });
}

