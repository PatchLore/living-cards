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
  // 1. Log webhook arrival
  const timestamp = new Date().toISOString();
  const url = new URL(req.url);
  console.log(`[STRIPE WEBHOOK] Webhook arrived at ${timestamp}`);
  console.log(`[STRIPE WEBHOOK] Method: ${req.method}`);
  console.log(`[STRIPE WEBHOOK] URL: ${url.pathname}`);

  // 2. Environment safety - Check STRIPE_WEBHOOK_SECRET first
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("[STRIPE WEBHOOK] STRIPE_WEBHOOK_SECRET is missing!");
    return new NextResponse("Webhook secret not configured", { status: 500 });
  }

  // 3. Validate STRIPE_SECRET_KEY
  if (!process.env.STRIPE_SECRET_KEY) {
    console.error("[STRIPE WEBHOOK] STRIPE_SECRET_KEY is missing!");
    return new NextResponse("Stripe secret key not configured", { status: 500 });
  }

  // 4. Get raw body and signature
  const body = await req.text();
  const signature = req.headers.get("stripe-signature") as string;

  if (!signature) {
    console.error("[STRIPE WEBHOOK] No Stripe signature found on webhook request");
    return new NextResponse("Missing Stripe signature", { status: 400 });
  }

  let event: Stripe.Event;

  // 5. Verify Stripe event signature
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      webhookSecret
    );
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    console.error("[STRIPE WEBHOOK] Signature verification failed:", errorMessage);
    return new NextResponse(
      `Webhook Error: Signature verification failed - ${errorMessage}`,
      { status: 400 }
    );
  }

  // 6. Log event details after verification
  console.log(`[STRIPE WEBHOOK] Event verified - ID: ${event.id}, Type: ${event.type}, Livemode: ${event.livemode}`);

  // --- HANDLE EVENTS ---

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;

      // 7. Log session details
      console.log(`[STRIPE WEBHOOK] Processing checkout.session.completed`);
      console.log(`[STRIPE WEBHOOK] Session ID: ${session.id}`);
      console.log(`[STRIPE WEBHOOK] Customer email: ${session.customer_details?.email || "Not provided"}`);

      // Metadata from checkout
      const metadata = session.metadata || {};
      const cardKey = metadata.cardKey;
      const recipient = metadata.recipient;
      const message = metadata.message;

      console.log(`[STRIPE WEBHOOK] Metadata - cardKey: ${cardKey || "MISSING"}, recipient: ${recipient || "MISSING"}`);

      // Validate required metadata
      if (!cardKey || !recipient || !message) {
        console.error(`[STRIPE WEBHOOK] Missing required metadata - cardKey: ${!!cardKey}, recipient: ${!!recipient}, message: ${!!message}`);
        // Return 200 to prevent retries - missing metadata is a data issue, not a transient error
        return NextResponse.json({ received: true }, { status: 200 });
      }

      // 8. Check if card already exists before creation
      try {
        const existingCard = await prisma.card.findFirst({
          where: { stripeSessionId: session.id },
          select: { id: true, shareId: true, emailSent: true },
        });

        if (existingCard) {
          console.log(`[STRIPE WEBHOOK] Card already exists for session ${session.id} - ID: ${existingCard.id}, shareId: ${existingCard.shareId}, emailSent: ${existingCard.emailSent}`);
        } else {
          console.log(`[STRIPE WEBHOOK] No existing card found for session ${session.id}, creating new card`);
        }

        // 9. Create card
        const card = await createCard({
          cardKey,
          recipientName: recipient,
          message,
          stripeSessionId: session.id,
          stripeCustomerEmail: session.customer_details?.email ?? null,
        });

        // 10. Log card creation result
        console.log(`[STRIPE WEBHOOK] Card created/retrieved - ID: ${card.id}, shareId: ${card.share_id}`);

        // 11. Check email status before sending
        const willSendEmail = !card.email_sent && !!session.customer_details?.email;
        console.log(`[STRIPE WEBHOOK] Email status - emailSent: ${card.email_sent}, willSend: ${willSendEmail}`);

        if (willSendEmail) {
          try {
            console.log(`[STRIPE WEBHOOK] Sending email to: ${session.customer_details.email}`);
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

            console.log(`[STRIPE WEBHOOK] Email sent successfully to ${session.customer_details.email}`);
          } catch (emailError: unknown) {
            const errorMessage = emailError instanceof Error ? emailError.message : "Unknown error";
            console.error(`[STRIPE WEBHOOK] Email sending failed: ${errorMessage}`);
            // Don't fail the webhook if email fails - card is already created
            // Log the error but continue
          }
        } else {
          if (card.email_sent) {
            console.log(`[STRIPE WEBHOOK] Email already sent for this card, skipping`);
          } else if (!session.customer_details?.email) {
            console.log(`[STRIPE WEBHOOK] No customer email available, skipping email`);
          }
        }
      } catch (cardError: unknown) {
        const errorMessage = cardError instanceof Error ? cardError.message : "Unknown error";
        console.error(`[STRIPE WEBHOOK] Card creation failed: ${errorMessage}`);
        // Don't throw - return 200 to prevent retries for data errors
        // Log the error but continue
      }

      break;
    }

    default:
      console.log(`[STRIPE WEBHOOK] Unhandled event type: ${event.type}, Event ID: ${event.id}`);
  }

  // 12. Final success log
  console.log(`[STRIPE WEBHOOK] Webhook processing completed successfully`);
  return NextResponse.json({ received: true }, { status: 200 });
}

