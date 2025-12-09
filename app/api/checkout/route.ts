import { NextResponse } from "next/server";
import stripe from "../../../lib/stripe";

export async function POST() {
  // 🔒 Prevent build failures on Vercel — no secret key = no Stripe call
  if (!process.env.STRIPE_SECRET_KEY) {
    console.warn("⚠️ STRIPE_SECRET_KEY missing during build. Returning dummy session ID.");
    return NextResponse.json({ id: "dummy-session-id-build" });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "gbp",
            product_data: {
              name: "Premium Card Export",
            },
            unit_amount: 400, // £4.00
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/cancel`,
    });

    return NextResponse.json({ id: session.id });
  } catch (error) {
    console.error("Stripe checkout error:", error);
    return NextResponse.json({ error: "Stripe error" }, { status: 500 });
  }
}


