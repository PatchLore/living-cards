import { stripe } from "../../../lib/stripe";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/cancel`,
    });

    return NextResponse.json({ id: session.id });
  } catch (err) {
    console.error("[STRIPE_CHECKOUT_ERROR]", err);
    return NextResponse.json({ error: "Stripe session error" }, { status: 500 });
  }
}


