import { NextResponse } from "next/server";
import { z } from "zod";
import { LIMITS, isPurchasable } from "../../../lib/catalog";
import { getStripe } from "../../../lib/fulfillment";
import { siteUrl } from "../../../lib/siteUrl";

export const runtime = "nodejs";

const Body = z.object({
  cardKey: z.string().refine(isPurchasable, "That card isn't available"),
  recipient: z
    .string()
    .trim()
    .min(1, "Please add who the card is for")
    .max(LIMITS.recipient, `Keep the name under ${LIMITS.recipient} characters`),
  message: z
    .string()
    .trim()
    .min(1, "Please write a message")
    .max(LIMITS.message, `Keep the message under ${LIMITS.message} characters`),
});

export async function POST(req: Request) {
  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid request" }, { status: 400 });
  }
  const { cardKey, recipient, message } = parsed.data;

  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_PRICE_ID) {
    console.error("[CHECKOUT] STRIPE_SECRET_KEY or STRIPE_PRICE_ID is missing");
    return NextResponse.json({ error: "Payments are not configured" }, { status: 500 });
  }

  const base = siteUrl();
  const successBase = process.env.STRIPE_SUCCESS_URL?.replace(/\/$/, "") || `${base}/success`;
  const successUrl = `${successBase}${successBase.includes("?") ? "&" : "?"}session_id={CHECKOUT_SESSION_ID}`;
  const cancelUrl = process.env.STRIPE_CANCEL_URL?.replace(/\/$/, "") || `${base}/cancel`;

  try {
    const stripe = await getStripe();
    // Price amount and currency live on the Stripe Price (STRIPE_PRICE_ID).
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [{ price: process.env.STRIPE_PRICE_ID, quantity: 1 }],
      success_url: successUrl,
      cancel_url: cancelUrl,
      // Stripe metadata values max out at 500 characters; LIMITS keeps us under.
      metadata: { cardKey, recipient, message },
      payment_intent_data: { description: `CardRoots card: ${cardKey}` },
    });

    if (!session.url) throw new Error("Stripe returned a session without a URL");
    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("[CHECKOUT] Stripe error:", err instanceof Error ? err.message : err);
    return NextResponse.json({ error: "We couldn't start checkout. Please try again." }, { status: 502 });
  }
}
