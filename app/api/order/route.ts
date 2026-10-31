import { NextResponse } from "next/server";
import { getCardBySessionId } from "../../../lib/db/cards";
import { NotPaidError, fulfillCheckoutSession, getStripe } from "../../../lib/fulfillment";
import { parseKidsCard } from "../../../lib/kids";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Lookups accepted from one IP address in any 10 minutes. One success page
 * makes at most ~19 (polling while a payment clears), so this allows a few reloads.
 */
const LOOKUPS_PER_IP_PER_10_MIN = 60;
const WINDOW_MS = 10 * 60_000;

// Kept in memory per server instance: best effort, but it slows a single client
// down without a new table. IPs are never stored or logged.
const recentLookups = new Map<string, number[]>();

function isRateLimited(ip: string | null): boolean {
  if (!ip) return false;
  const now = Date.now();
  if (recentLookups.size > 5_000) {
    for (const [key, times] of recentLookups) if (now - times[times.length - 1] >= WINDOW_MS) recentLookups.delete(key);
    if (recentLookups.size > 5_000) recentLookups.clear();
  }
  const recent = (recentLookups.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= LOOKUPS_PER_IP_PER_10_MIN) {
    recentLookups.set(ip, recent);
    return true;
  }
  recent.push(now);
  recentLookups.set(ip, recent);
  return false;
}

// The response holds the recipient's name and message, so no browser or CDN may keep a copy.
const json = (body: unknown, init?: ResponseInit) => {
  const res = NextResponse.json(body, init);
  res.headers.set("Cache-Control", "no-store, private");
  return res;
};

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
  // Vercel sets x-forwarded-for to the client's address.
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip");
  if (isRateLimited(ip || null)) {
    return json({ status: "error", error: "Too many requests. Please try again in a few minutes." }, { status: 429, headers: { "Retry-After": "600" } });
  }

  const sessionId = new URL(req.url).searchParams.get("session_id");
  if (!sessionId || !sessionId.startsWith("cs_")) {
    return json({ status: "error", error: "Missing session" }, { status: 400 });
  }

  try {
    let card = await getCardBySessionId(sessionId);
    if (!card || !card.email_sent) {
      const stripe = await getStripe();
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      try {
        card = await fulfillCheckoutSession(session);
      } catch (err) {
        if (err instanceof NotPaidError) return json({ status: "pending" });
        // Card may exist even if the email failed; show it and let the webhook retry the email.
        console.error(`[ORDER] Fulfilment error for ${sessionId}:`, err);
        card = await getCardBySessionId(sessionId);
        if (!card) throw err;
      }
    }

    const kids = parseKidsCard(card.card_key, card.message);
    return json({
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
    return json({ status: "error", error: "We couldn't load your order" }, { status: 500 });
  }
}
