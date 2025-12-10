import { NextResponse } from "next/server";
import crypto from "crypto";

export const runtime = "nodejs";

const getShareSecret = () => {
  const secret = process.env.CARDROOTS_SHARE_SECRET;
  if (!secret) {
    throw new Error("CARDROOTS_SHARE_SECRET is not set");
  }
  return secret;
};

function createShareToken(payload: { cardKey: string; recipient: string; message: string }) {
  const secret = getShareSecret();

  const json = JSON.stringify(payload);
  const payloadB64 = Buffer.from(json).toString("base64url");

  const sig = crypto
    .createHmac("sha256", secret)
    .update(payloadB64)
    .digest("base64url");

  const token = `${payloadB64}.${sig}`;
  return token;
}

export async function POST(req: Request) {
  try {
    const { cardKey, recipient, message } = await req.json();

    if (!cardKey || !recipient || !message) {
      return NextResponse.json(
        { error: "Missing cardKey, recipient, or message" },
        { status: 400 }
      );
    }

    const shareId = createShareToken({ cardKey, recipient, message });

    const origin =
      process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "http://localhost:3000";

    const url = `${origin}/c/${shareId}`;

    return NextResponse.json({ ok: true, shareId, url });
  } catch (error: any) {
    console.error("❌ Error creating share link:", error.message || error);
    return NextResponse.json(
      { ok: false, error: "Failed to create share link" },
      { status: 500 }
    );
  }
}

