import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { NotPaidError, fulfillCheckoutSession, getStripe } from "../../../lib/fulfillment";

// Webhooks need the Node.js runtime and the raw request body.
export const runtime = "nodejs";

export async function POST(req: Request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("[WEBHOOK] STRIPE_WEBHOOK_SECRET is missing");
    return new NextResponse("Webhook secret not configured", { status: 500 });
  }

  const signature = req.headers.get("stripe-signature");
  if (!signature) return new NextResponse("Missing Stripe signature", { status: 400 });

  const body = await req.text();
  let event: Stripe.Event;
  try {
    const stripe = await getStripe();
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[WEBHOOK] Signature verification failed:", message);
    return new NextResponse(`Webhook Error: ${message}`, { status: 400 });
  }

  console.log(`[WEBHOOK] ${event.type} ${event.id} (livemode: ${event.livemode})`);

  if (event.type === "checkout.session.completed" || event.type === "checkout.session.async_payment_succeeded") {
    const session = event.data.object as Stripe.Checkout.Session;
    try {
      const card = await fulfillCheckoutSession(session);
      console.log(`[WEBHOOK] Session ${session.id} fulfilled as card ${card.share_id}`);
    } catch (err) {
      if (err instanceof NotPaidError) {
        // e.g. a bank payment still clearing; async_payment_succeeded will follow.
        console.log(`[WEBHOOK] ${err.message}; waiting for payment`);
        return NextResponse.json({ received: true });
      }
      // Non-2xx makes Stripe retry (for up to 3 days); fulfilment is idempotent.
      console.error(`[WEBHOOK] Fulfilment failed for ${session.id}:`, err);
      return NextResponse.json({ error: "Fulfilment failed" }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}
