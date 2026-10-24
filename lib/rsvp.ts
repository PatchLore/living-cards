import { createHmac } from "crypto";
import prisma from "./prisma";
import { getCardByShareId } from "./db/cards";
import { parseKidsCardKey } from "./kids";
import { sendRsvpEmail } from "./email/sendRsvpEmail";

/** Party invite RSVPs: a guest's first name and yes/no, nothing else. */
export const RSVP_LIMITS = {
  guestName: 30,
  /** Replies accepted per invite link in any 10 minutes, and in total. */
  perLinkPer10Min: 10,
  perLinkTotal: 150,
  /** Replies accepted from one IP address in any 10 minutes, across all invites. */
  perIpPer10Min: 5,
  /** No structured party date is collected, so replies are kept 90 days from when they were sent. */
  retentionDays: 90,
  /** The IP hash only exists for rate limiting and is cleared after this. */
  ipHashHours: 24,
} as const;

export type RsvpResult =
  | { ok: true }
  | { ok: false; status: 400 | 404 | 429; error: string };

/** Tidies a typed first name; returns null if it isn't one. */
export function cleanGuestName(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const name = value.normalize("NFC").replace(/\p{C}/gu, "").replace(/\s+/g, " ").trim();
  if (!name || Array.from(name).length > RSVP_LIMITS.guestName) return null;
  // A first name never needs a link or an email address; refusing them keeps spam out of buyers' inboxes.
  if (/:\/\/|www\.|@/i.test(name)) return null;
  return name;
}

/** A keyed hash, so the raw IP is never stored and can't be recovered by brute force. */
export function hashIp(ip: string | null): string | null {
  const secret = process.env.RSVP_IP_SALT || process.env.CRON_SECRET;
  if (!ip || !secret) return null;
  return createHmac("sha256", secret).update(ip).digest("hex").slice(0, 32);
}

const minutesAgo = (minutes: number) => new Date(Date.now() - minutes * 60_000);

export async function recordRsvp(input: { shareId: string; guestName: unknown; attending: unknown; ip: string | null }): Promise<RsvpResult> {
  const guestName = cleanGuestName(input.guestName);
  if (!guestName) return { ok: false, status: 400, error: `Please add a first name (up to ${RSVP_LIMITS.guestName} letters).` };
  if (typeof input.attending !== "boolean") return { ok: false, status: 400, error: "Please choose yes or no." };

  const card = await getCardByShareId(input.shareId);
  if (!card || parseKidsCardKey(card.card_key)?.scene !== "party") return { ok: false, status: 404, error: "We couldn’t find this invite." };

  const ipHash = hashIp(input.ip);
  const [recentForLink, totalForLink, recentForIp] = await Promise.all([
    prisma.partyRsvp.count({ where: { cardId: card.id, createdAt: { gte: minutesAgo(10) } } }),
    prisma.partyRsvp.count({ where: { cardId: card.id } }),
    ipHash ? prisma.partyRsvp.count({ where: { ipHash, createdAt: { gte: minutesAgo(10) } } }) : Promise.resolve(0),
  ]);
  if (recentForLink >= RSVP_LIMITS.perLinkPer10Min || totalForLink >= RSVP_LIMITS.perLinkTotal || recentForIp >= RSVP_LIMITS.perIpPer10Min) {
    return { ok: false, status: 429, error: "Lots of replies just now. Please try again in a few minutes." };
  }

  await prisma.partyRsvp.create({ data: { cardId: card.id, guestName, attending: input.attending, ipHash } });

  // The reply is saved either way; a failed email is logged, not shown to the guest.
  if (card.stripe_customer_email) {
    try {
      const [yes, no] = await Promise.all([
        prisma.partyRsvp.count({ where: { cardId: card.id, attending: true } }),
        prisma.partyRsvp.count({ where: { cardId: card.id, attending: false } }),
      ]);
      await sendRsvpEmail({ to: card.stripe_customer_email, childName: card.recipient_name, guestName, attending: input.attending, totals: { yes, no } });
    } catch (err) {
      console.error(`[RSVP] Email for ${card.share_id} failed:`, err instanceof Error ? err.message : err);
    }
  }
  return { ok: true };
}

/** Daily cleanup: drop IP hashes after a day and replies after the retention period. */
export async function cleanUpRsvps() {
  const [hashesCleared, deleted] = await prisma.$transaction([
    prisma.partyRsvp.updateMany({ where: { ipHash: { not: null }, createdAt: { lt: new Date(Date.now() - RSVP_LIMITS.ipHashHours * 3_600_000) } }, data: { ipHash: null } }),
    prisma.partyRsvp.deleteMany({ where: { createdAt: { lt: new Date(Date.now() - RSVP_LIMITS.retentionDays * 86_400_000) } } }),
  ]);
  return { hashesCleared: hashesCleared.count, deleted: deleted.count };
}
