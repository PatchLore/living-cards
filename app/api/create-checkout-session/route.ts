import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";
import stripe from "../../../../lib/stripe";

type Body = {
  recipientName?: string;
  message?: string;
  cardType?: string;
};

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Body;
    const { recipientName, message, cardType } = body;

    if (!recipientName || !message || !cardType) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const priceId = process.env.STRIPE_PRICE_ID;
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
    if (!priceId || !siteUrl) {
      console.error("Missing STRIPE_PRICE_ID or NEXT_PUBLIC_SITE_URL");
      return NextResponse.json({ error: "Server not configured" }, { status: 500 });
    }

    const order = await prisma.cardOrder.create({
      data: {
        recipientName,
        message,
        cardType,
        stripeSessionId: "", // temporary placeholder, will update after session created
      },
    });

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${siteUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/`,
      metadata: {
        orderId: order.id,
      },
    });

    // store stripe session id on the order
    await prisma.cardOrder.update({
      where: { id: order.id },
      data: { stripeSessionId: session.id || "" },
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error("create-checkout-session error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}


