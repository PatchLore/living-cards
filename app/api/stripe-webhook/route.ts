import { NextResponse } from "next/server";

// Important: Webhooks must use the Node.js runtime, not Edge
export const runtime = "nodejs";

// Raw body is required for webhook signature verification
export async function POST(req: Request) {
  // Validate required environment variables
  if (!process.env.STRIPE_SECRET_KEY) {
    console.error("❌ [WEBHOOK] STRIPE_SECRET_KEY is missing!");
    return new NextResponse("Stripe secret key not configured", { status: 500 });
  }

  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    console.error("❌ [WEBHOOK] STRIPE_WEBHOOK_SECRET is missing!");
    return new NextResponse("Webhook secret not configured", { status: 500 });
  }

  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    console.error("❌ [WEBHOOK] No Stripe signature found on webhook request");
    return new NextResponse("Missing Stripe signature", { status: 400 });
  }

  // ⭐ Import Stripe *inside* the function — avoids build-time execution
  const { default: Stripe } = await import("stripe");
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2023-10-16" as any,
  });

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err: any) {
    console.error("❌ Webhook signature verification failed:", err.message);
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  // --- HANDLE EVENTS ---

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;

      console.log("✅ Payment completed");
      console.log("Session ID:", session.id);

      // Metadata from checkout
      const metadata = session.metadata || {};

      console.log("📝 Metadata received:");
      console.log("cardKey:", metadata.cardKey);
      console.log("recipient:", metadata.recipient);
      console.log("message:", metadata.message);

      // 👉 In the future, here is where you'd:

      // - Mark card as paid

      // - Store order in DB

      // - Trigger tree planting

      // - Generate final card

      break;
    }

    default:
      console.log(`ℹ️ Unhandled event type: ${event.type}`);
  }

  return new NextResponse("Webhook received", { status: 200 });
}

