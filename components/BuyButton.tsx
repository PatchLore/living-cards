"use client";

import getStripe from "../lib/getStripe";

export default function BuyButton() {
  const handleBuy = async () => {
    const res = await fetch("/api/checkout", { method: "POST" });
    const { id } = await res.json();

    const stripe = (await getStripe()) as any; // ← bypass Stripe TS issues completely

    if (stripe && typeof stripe.redirectToCheckout === "function") {
      await stripe.redirectToCheckout({ sessionId: id });
    } else {
      console.error("Stripe redirectToCheckout is unavailable");
    }
  };

  return (
    <button
      onClick={handleBuy}
      className="px-4 py-2 bg-blue-600 text-white rounded-lg"
    >
      Buy Premium Export (£4)
    </button>
  );
}