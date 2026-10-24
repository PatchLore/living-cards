import { NextResponse } from "next/server";
import { cleanUpRsvps } from "../../../../lib/rsvp";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Called daily by Vercel Cron (vercel.json): enforces the party RSVP retention limits.
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || req.headers.get("authorization") !== `Bearer ${secret}`) {
    return new NextResponse("Unauthorized", { status: 401 });
  }
  try {
    const result = await cleanUpRsvps();
    console.log(`[CLEANUP] RSVPs: ${result.deleted} deleted, ${result.hashesCleared} IP hashes cleared`);
    return NextResponse.json({ ok: true, ...result });
  } catch (err) {
    console.error("[CLEANUP] RSVP cleanup failed:", err instanceof Error ? err.message : err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
