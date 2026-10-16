import type Stripe from "stripe";
import prisma from "./prisma";
import { type Card, createCard } from "./db/cards";
import { sendCardEmail } from "./email/sendCardEmail";
import { TREE_LOCATION, plantTreeForCard } from "./goodapi";

export async function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY is not set");
  const { default: StripeCtor } = await import("stripe");
  return new StripeCtor(key, { apiVersion: "2023-10-16" as Stripe.LatestApiVersion });
}

export class NotPaidError extends Error {}

/**
 * Turns a paid Checkout Session into a card and emails the buyer.
 * Safe to call any number of times, from the webhook and the success page at
 * once: the card is created once and the email is sent once.
 * Throws if the card can't be saved or the email can't be sent, so the webhook
 * answers non-2xx and Stripe retries.
 */
export async function fulfillCheckoutSession(session: Stripe.Checkout.Session): Promise<Card> {
  if (session.payment_status !== "paid") {
    throw new NotPaidError(`Session ${session.id} is ${session.payment_status}`);
  }

  const md = session.metadata ?? {};
  if (!md.cardKey) console.error(`[FULFIL] Session ${session.id} has no cardKey metadata`);

  let card = await createCard({
    cardKey: md.cardKey || "unknown",
    recipientName: md.recipient?.trim() || "you",
    message: md.message?.trim() || "",
    stripeSessionId: session.id,
    stripeCustomerEmail: session.customer_details?.email ?? null,
  });

  // Plant one tree for this card, once. A planting failure must not stop the
  // buyer getting their card, so it's logged and the card is still delivered.
  if (!card.tree_id) {
    try {
      const planted = await plantTreeForCard({ shareId: card.share_id, cardKey: card.card_key });
      if (planted.treeId) {
        await prisma.card.update({
          where: { id: card.id },
          data: { treeId: planted.treeId, treeLocation: TREE_LOCATION, treeDatePlanted: new Date() },
        });
        card = { ...card, tree_id: planted.treeId, tree_location: TREE_LOCATION };
        console.log(`[FULFIL] Tree ${planted.treeId} registered for card ${card.share_id}`);
      } else {
        console.log(`[FULFIL] Tree planting disabled (GOODAPI_LIVE not set); card ${card.share_id} has no tree yet`);
      }
    } catch (err) {
      console.error(`[FULFIL] Tree planting failed for card ${card.share_id}:`, err instanceof Error ? err.message : err);
    }
  }

  const to = session.customer_details?.email;
  if (!to) {
    console.warn(`[FULFIL] No customer email on session ${session.id}; card ${card.share_id} created without email`);
    return card;
  }
  if (card.email_sent) return card;

  // Claim the send so a concurrent caller can't email twice.
  const claimed = await prisma.card.updateMany({
    where: { id: card.id, emailSent: false },
    data: { emailSent: true },
  });
  if (claimed.count === 0) return { ...card, email_sent: true };

  try {
    await sendCardEmail({
      to,
      shareId: card.share_id,
      cardKey: card.card_key,
      recipientName: card.recipient_name,
      treeLocation: card.tree_id ? TREE_LOCATION : undefined,
    });
    console.log(`[FULFIL] Emailed card ${card.share_id} for session ${session.id}`);
  } catch (err) {
    await prisma.card.update({ where: { id: card.id }, data: { emailSent: false } });
    throw err;
  }
  return { ...card, email_sent: true };
}
