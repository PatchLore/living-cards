import prisma from "./prisma";
import { CARD_LINK_MONTHS, cardLinkExpiresAt } from "./sales";

/** Whether a card's private link has passed its expiry date. */
export const cardLinkExpired = (createdAt: Date | string, now = new Date()) => cardLinkExpiresAt(createdAt) <= now;

/**
 * Daily: once a card's link expires, delete what identifies anyone (the
 * recipient's name, the message and the buyer's email) and any party replies.
 * The row itself stays, so the order and its tree record remain for accounts.
 */
export async function deleteExpiredCardContent(now = new Date()) {
  const cutoff = new Date(now);
  cutoff.setMonth(cutoff.getMonth() - CARD_LINK_MONTHS);
  const notYetCleared = { OR: [{ recipientName: { not: "" } }, { message: { not: "" } }] };
  const [cards, legacyOrders, rsvps] = await prisma.$transaction([
    prisma.card.updateMany({ where: { createdAt: { lt: cutoff }, OR: [...notYetCleared.OR, { stripeCustomerEmail: { not: null } }] }, data: { recipientName: "", message: "", stripeCustomerEmail: null } }),
    // Orders from the original version of the site hold the same details.
    prisma.cardOrder.updateMany({ where: { createdAt: { lt: cutoff }, ...notYetCleared }, data: { recipientName: "", message: "" } }),
    prisma.partyRsvp.deleteMany({ where: { card: { createdAt: { lt: cutoff } } } }),
  ]);
  return { cardsCleared: cards.count, legacyOrdersCleared: legacyOrders.count, rsvpsDeleted: rsvps.count };
}
