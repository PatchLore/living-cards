import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Called daily by Vercel Cron (vercel.json). Supabase's free plan pauses a
// project after a week without database activity; one query a day prevents it.
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || req.headers.get("authorization") !== `Bearer ${secret}`) {
    return new NextResponse("Unauthorized", { status: 401 });
  }
  try {
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json({ ok: true, at: new Date().toISOString() });
  } catch (err) {
    console.error("[KEEPALIVE] Database ping failed:", err instanceof Error ? err.message : err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
