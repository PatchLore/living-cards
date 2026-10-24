import { NextResponse } from "next/server";
import { getCardBySessionId } from "../../../lib/db/cards";
import { NotPaidError, fulfillCheckoutSession, getStripe } from "../../../lib/fulfillment";
import { parseKidsCard } from "../../../lib/kids";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const maskEmail = (email: string | null) => {
  if (!email) return null;
  const [user, domain] = email.split("@");
  return `${user.slice(0, 2)}${"•".repeat(Math.max(1, user.length - 2))}@${domain}`;
};

/**
 * Used by the success page. Returns the buyer's card, fulfilling the order
 * itself if the webhook hasn't arrived yet, so the buyer never waits on it.
 */
export async function GET(req: Request) {
  const sessionId = new URL(req.url).searchParams.get("session_id");
  if (!sessionId || !sessionId.startsWith("cs_")) {
    return NextResponse.json({ status: "error", error: "Missing session" }, { status: 400 });
  }

  try {
    let card = await getCardBySessionId(sessionId);
    if (!card || !card.email_sent) {
      const stripe = await getStripe();
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      try {
        card = await fulfillCheckoutSession(session);
      } catch (err) {
        if (err instanceof NotPaidError) return NextResponse.json({ status: "pending" });
        // Card may exist even if the email failed; show it and let the webhook retry the email.
        console.error(`[ORDER] Fulfilment error for ${sessionId}:`, err);
        card = await getCardBySessionId(sessionId);
        if (!card) throw err;
      }
    }

    const kids = parseKidsCard(card.card_key, card.message);
    return NextResponse.json({
      status: "ready",
      shareId: card.share_id,
      cardKey: card.card_key,
      recipient: card.recipient_name,
      message: kids?.customMessage ?? card.message,
      ...(kids ? { kids } : {}),
      emailedTo: card.email_sent ? maskEmail(card.stripe_customer_email) : null,
      createdAt: card.created_at,
    });
  } catch (err) {
    console.error(`[ORDER] Failed to load ${sessionId}:`, err instanceof Error ? err.message : err);
    return NextResponse.json({ status: "error", error: "We couldn't load your order" }, { status: 500 });
  }
}
