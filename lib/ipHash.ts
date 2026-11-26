import { createHash, createHmac } from "crypto";

let warnedNoSalt = false;

/**
 * The key for IP hashes. A missing salt used to switch IP rate limits off without a word,
 * so now it falls back to a key derived from DATABASE_URL (a secret every deployment has)
 * and logs an error until RSVP_IP_SALT is set.
 */
function ipSalt(): string {
  const salt = process.env.RSVP_IP_SALT || process.env.CRON_SECRET;
  if (salt) return salt;
  const db = process.env.DATABASE_URL;
  if (!db) throw new Error("RSVP_IP_SALT, CRON_SECRET and DATABASE_URL are all unset, so IP rate limits can't run.");
  if (!warnedNoSalt) {
    warnedNoSalt = true;
    console.error("[IP] RSVP_IP_SALT and CRON_SECRET are unset; IP hashes use a key derived from DATABASE_URL. Set RSVP_IP_SALT.");
  }
  return createHash("sha256").update(`cardroots-ip-salt:${db}`).digest("hex");
}

/** A keyed hash, so the raw IP is never stored and can't be recovered by brute force. */
export function hashIp(ip: string): string;
export function hashIp(ip: string | null): string | null;
export function hashIp(ip: string | null): string | null {
  if (!ip) return null;
  return createHmac("sha256", ipSalt()).update(ip).digest("hex").slice(0, 32);
}

/** Vercel sets x-forwarded-for to the client's address; it is only hashed, never stored. */
export function clientIp(req: Request): string | null {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || null;
}
