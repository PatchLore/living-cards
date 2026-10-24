import { NextResponse } from "next/server";
import { cleanUpRsvps } from "../../../../lib/rsvp";
import { deleteExpiredCardContent } from "../../../../lib/cardRetention";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Called daily by Vercel Cron (vercel.json): enforces the retention limits for
// party RSVPs and for card content once a card's link has expired.
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || req.headers.get("authorization") !== `Bearer ${secret}`) {
    return new NextResponse("Unauthorized", { status: 401 });
  }
  try {
    const rsvps = await cleanUpRsvps();
    const cards = await deleteExpiredCardContent();
    console.log(`[CLEANUP] RSVPs: ${rsvps.deleted} deleted, ${rsvps.hashesCleared} IP hashes cleared; expired cards cleared: ${cards.cardsCleared} (+${cards.legacyOrdersCleared} legacy), ${cards.rsvpsDeleted} RSVPs`);
    return NextResponse.json({ ok: true, ...rsvps, ...cards });
  } catch (err) {
    console.error("[CLEANUP] Cleanup failed:", err instanceof Error ? err.message : err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
