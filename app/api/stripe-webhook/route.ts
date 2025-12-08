import prisma from "../../../../lib/prisma";
import stripe from "../../../../lib/stripe";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature") || "";
  const secret = process.env.STRIPE_WEBHOOK_SECRET || "";
  try {
    const buf = Buffer.from(await req.arrayBuffer());
    const event = stripe.webhooks.constructEvent(buf, sig, secret);

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as any;
      const sessionId = session.id;
      // Mark the order paid
      await prisma.cardOrder.updateMany({
        where: { stripeSessionId: sessionId },
        data: { paid: true },
      });
    }

    return new Response(JSON.stringify({ received: true }), { status: 200 });
  } catch (err: any) {
    console.error("Webhook error:", err?.message || err);
    return new Response(`Webhook Error: ${err?.message || err}`, { status: 400 });
  }
}


