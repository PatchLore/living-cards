import { NextResponse } from "next/server";

export async function POST(req: Request) {
  // 🚫 Prevent build failures on Vercel
  if (!process.env.STRIPE_SECRET_KEY) {
    console.warn("⚠️ STRIPE_SECRET_KEY missing during build. Returning dummy session ID.");
    return NextResponse.json({ id: "dummy-session-id-build" });
  }

  // Validate required environment variables
  if (!process.env.STRIPE_PRICE_ID) {
    console.error("❌ [CHECKOUT] STRIPE_PRICE_ID is missing!");
    return NextResponse.json(
      { error: "STRIPE_PRICE_ID is not configured" },
      { status: 500 }
    );
  }

  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

  try {
    // Parse POST body
    const { cardKey, recipient, message } = await req.json();

    // Basic validation - cardKey is required
    if (!cardKey) {
      return NextResponse.json(
        { error: "Missing required field: cardKey" },
        { status: 400 }
      );
    }

    // ⭐ Import Stripe *inside* the function — avoids build-time execution
    const { default: Stripe } = await import("stripe");
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
      apiVersion: "2023-10-16" as any,
    });

    // Success/cancel: optional STRIPE_SUCCESS_URL / STRIPE_CANCEL_URL (full URL), else build from baseUrl
    const successBase = process.env.STRIPE_SUCCESS_URL?.replace(/\/$/, "") || `${baseUrl}/success`;
    const successUrl = successBase.includes("?")
      ? `${successBase}&session_id={CHECKOUT_SESSION_ID}`
      : `${successBase}?session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = process.env.STRIPE_CANCEL_URL?.replace(/\/$/, "") || `${baseUrl}/cancel`;

    console.log("🔍 [CHECKOUT] Creating session with:", {
      priceId: process.env.STRIPE_PRICE_ID,
      cardKey,
      successUrl,
      cancelUrl,
    });

    // Create Stripe checkout session
    // Price amount (£5.00) and currency (GBP) are set on the Price in Stripe Dashboard (STRIPE_PRICE_ID)
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID!,
          quantity: 1,
        },
      ],
      success_url: successUrl,
      cancel_url: cancelUrl,

      // Attach metadata for webhook + fulfillment
      metadata: {
        cardKey,
        recipient: recipient || "",
        message: message || "",
      },
    });

    console.log("✅ [CHECKOUT] Session created:", {
      id: session.id,
      url: session.url ? "present" : "MISSING",
    });

    if (!session.url) {
      console.error("❌ [CHECKOUT] Session created but url is missing!");
      return NextResponse.json(
        { error: "Session created but URL is missing" },
        { status: 500 }
      );
    }

    // Return checkout URL
    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error("❌ [CHECKOUT] Stripe API error:", {
      type: err?.type,
      code: err?.code,
      message: err?.message,
      raw: err?.raw?.message || err?.raw,
    });

    return NextResponse.json(
      {
        error: "Stripe checkout session failed",
        details: err?.message || "Unknown error",
        code: err?.code,
      },
      { status: 500 }
    );
  }
}


