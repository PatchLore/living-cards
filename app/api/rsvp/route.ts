import { NextResponse } from "next/server";
import { recordRsvp } from "../../../lib/rsvp";
import { clientIp } from "../../../lib/ipHash";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** A guest replies to a Kids party invite: { shareId, guestName, attending }. */
export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const shareId = body && typeof body.shareId === "string" ? body.shareId : "";
  if (!/^[A-Za-z0-9_-]{6,64}$/.test(shareId)) return NextResponse.json({ error: "We couldn’t find this invite." }, { status: 404 });

  try {
    const result = await recordRsvp({ shareId, guestName: body.guestName, attending: body.attending, ip: clientIp(req) });
    return "error" in result ? NextResponse.json({ error: result.error }, { status: result.status }) : NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[RSVP] Failed:", err instanceof Error ? err.message : err);
    return NextResponse.json({ error: "We couldn’t send your reply. Please try again." }, { status: 500 });
  }
}
