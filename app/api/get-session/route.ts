import { NextResponse } from "next/server";

// Node runtime required
export const runtime = "nodejs";

export async function POST(req: Request) {
  // Validate required environment variables
  if (!process.env.STRIPE_SECRET_KEY) {
    console.error("❌ [GET-SESSION] STRIPE_SECRET_KEY is missing!");
    return NextResponse.json(
      { error: "Stripe secret key not configured" },
      { status: 500 }
    );
  }

  try {
    const { sessionId } = await req.json();

    if (!sessionId) {
      return NextResponse.json({ error: "Missing sessionId" }, { status: 400 });
    }

    // ⭐ Import Stripe *inside* the function — avoids build-time execution
    const { default: Stripe } = await import("stripe");
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2023-10-16" as any,
    });

    // Retrieve checkout session with metadata
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["customer", "line_items"],
    });

    return NextResponse.json({
      ok: true,
      session: {
        id: session.id,
        amount_total: session.amount_total,
        metadata: session.metadata,
      },
    });
  } catch (error: any) {
    console.error("❌ [GET-SESSION] Error loading session:", error.message);
    return NextResponse.json(
      { error: "Failed to load session" },
      { status: 500 }
    );
  }
}

