import prisma from "./prisma";
import { hashIp } from "./ipHash";

/**
 * Business enquiries email us and send a confirmation to whatever address was typed in,
 * so they are capped: otherwise the form could be looped to email-bomb someone from our
 * domain and hurt the sending reputation order emails depend on.
 */
export const ENQUIRY_LIMITS = {
  /** Enquiries accepted from one IP address in any hour. */
  perIpPerHour: 3,
  /** Enquiries accepted from everyone in any 24 hours (keeps the email quota for orders). */
  perDay: 50,
  /** Confirmations sent to visitor-typed addresses in any 24 hours; past this the enquiry still reaches us. */
  confirmationsPerDay: 20,
  /** Rows only exist for the limits above and are deleted after this. */
  keepHours: 24,
} as const;

export type EnquirySlot = { ok: true; id: string } | { ok: false; error: string; retryAfterSeconds: number };

const hoursAgo = (hours: number) => new Date(Date.now() - hours * 3_600_000);

async function limitReached(ipHash: string, includesThis: boolean): Promise<EnquirySlot | null> {
  const [forIp, forDay] = await Promise.all([
    prisma.enquiryAttempt.count({ where: { ipHash, createdAt: { gte: hoursAgo(1) } } }),
    prisma.enquiryAttempt.count({ where: { createdAt: { gte: hoursAgo(24) } } }),
  ]);
  const self = includesThis ? 1 : 0;
  if (forIp - self >= ENQUIRY_LIMITS.perIpPerHour) {
    return { ok: false, retryAfterSeconds: 3600, error: "You've sent a few enquiries already. Please try again in an hour, or email info@cardroots.com." };
  }
  if (forDay - self >= ENQUIRY_LIMITS.perDay) {
    return { ok: false, retryAfterSeconds: 3600, error: "We're getting a lot of enquiries right now. Please email info@cardroots.com and we'll reply within one working day." };
  }
  return null;
}

/**
 * Takes one enquiry slot for this IP. Rejected requests write nothing; accepted ones are
 * recorded and then re-counted, so a burst of parallel requests can't all slip under the limit.
 */
export async function claimEnquirySlot(ip: string | null): Promise<EnquirySlot> {
  const ipHash = hashIp(ip ?? "unknown");
  const before = await limitReached(ipHash, false);
  if (before) return before;
  const { id } = await prisma.enquiryAttempt.create({ data: { ipHash }, select: { id: true } });
  return (await limitReached(ipHash, true)) ?? { ok: true, id };
}

/** Whether this enquiry may send a confirmation to the visitor-typed address, within the daily cap. */
export async function claimConfirmation(id: string): Promise<boolean> {
  const sentToday = () => prisma.enquiryAttempt.count({ where: { confirmationSent: true, createdAt: { gte: hoursAgo(24) } } });
  if ((await sentToday()) >= ENQUIRY_LIMITS.confirmationsPerDay) return false;
  await prisma.enquiryAttempt.update({ where: { id }, data: { confirmationSent: true } });
  // Re-count with this claim included, so parallel requests can't all send.
  if ((await sentToday()) <= ENQUIRY_LIMITS.confirmationsPerDay) return true;
  await prisma.enquiryAttempt.update({ where: { id }, data: { confirmationSent: false } });
  return false;
}

/** Daily cleanup: enquiry rows are only needed for the limits. */
export async function cleanUpEnquiries() {
  const { count } = await prisma.enquiryAttempt.deleteMany({ where: { createdAt: { lt: hoursAgo(ENQUIRY_LIMITS.keepHours) } } });
  return { enquiriesDeleted: count };
}
