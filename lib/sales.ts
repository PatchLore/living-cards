/**
 * Launch and legal settings shared by checkout, the order forms, the
 * confirmation email and the success page, so their wording always matches.
 */

/** Sales stay closed unless CHECKOUT_ENABLED is exactly "true" (set per Vercel environment). */
export function checkoutOpen() {
  return process.env.CHECKOUT_ENABLED === "true";
}

export const CHECKOUT_CLOSED_MESSAGE = "We’re opening soon. Card sales aren’t open yet, but you can still personalise and preview.";

/**
 * Digital content loses the 14-day cancellation right only with the buyer's
 * express consent and acknowledgement (Consumer Contracts Regulations 2013,
 * reg. 37), which the confirmation must then repeat.
 */
export const IMMEDIATE_SUPPLY_CONSENT = "I want my order made and delivered straight away, and I understand that I lose my 14-day right to cancel once it has been delivered.";
export const IMMEDIATE_SUPPLY_CONFIRMATION = "You asked us to make and deliver your order straight away, and acknowledged that you lose your 14-day right to cancel once it has been delivered. This doesn’t affect your rights if something is wrong with it.";
/** Stored in Stripe metadata as the record of which consent wording the buyer agreed to. */
export const IMMEDIATE_SUPPLY_CONSENT_VERSION = "immediate-supply-v1";

/** How long a card's private link stays open before its name and message are deleted. */
export const CARD_LINK_MONTHS = 12;

export function cardLinkExpiresAt(createdAt: Date | string) {
  const date = new Date(createdAt);
  date.setMonth(date.getMonth() + CARD_LINK_MONTHS);
  return date;
}

export const formatUkDate = (date: Date) => date.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "Europe/London" });
