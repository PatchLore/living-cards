import React from "react";
import stripe from "../../lib/stripe";
import prisma from "../../lib/prisma";
import CopyButton from "../../components/CopyButton";

type Props = {
  searchParams?: { [key: string]: string | string[] | undefined };
};

export default async function Success({ searchParams }: Props) {
  const sessionId = typeof searchParams?.session_id === "string" ? searchParams.session_id : undefined;

  if (!sessionId) {
    return (
      <div className="card-panel">
        <h2 className="text-xl font-semibold">Something went wrong</h2>
        <p className="mt-2 text-slate-300">No session id provided.</p>
      </div>
    );
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const order = await prisma.cardOrder.findUnique({ where: { stripeSessionId: session.id } });

    if (!order) {
      return (
        <div className="card-panel">
          <h2 className="text-xl font-semibold">We couldn't find your order</h2>
          <p className="mt-2 text-slate-300">If your payment completed, please wait a moment and refresh.</p>
        </div>
      );
    }

    if (!order.paid) {
      return (
        <div className="card-panel">
          <h2 className="text-xl font-semibold">Processing payment</h2>
          <p className="mt-2 text-slate-300">We are waiting for confirmation from Stripe. Please refresh in a moment.</p>
        </div>
      );
    }

    const site = process.env.NEXT_PUBLIC_SITE_URL || "";
    const shareUrl = `${site}/card/${order.shareId}`;

    return (
      <div className="card-panel">
        <h2 className="text-2xl font-semibold">Your card is ready!</h2>
        <p className="mt-2 text-slate-300">Share this link so the recipient can view their card:</p>
        <div className="mt-4 flex items-center space-x-3">
          <input readOnly value={shareUrl} className="flex-1 rounded-md px-3 py-2 bg-slate-700/40 border border-slate-700" />
          <CopyButton text={shareUrl} />
        </div>
        <p className="mt-4 text-sm text-slate-400">Tip: send via message or email — no account needed.</p>
      </div>
    );
  } catch (err) {
    console.error("success page error:", err);
    return (
      <div className="card-panel">
        <h2 className="text-xl font-semibold">Something went wrong</h2>
        <p className="mt-2 text-slate-300">Please try again or contact support.</p>
      </div>
    );
  }
}


