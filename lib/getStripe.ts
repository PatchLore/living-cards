import { loadStripe, Stripe } from "@stripe/stripe-js";

let stripePromise: Promise<Stripe | null> | null = null;

export default function getStripe() {
  if (!stripePromise) {
    const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

    if (!key) {
      console.warn("NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is missing.");
      return null;
    }

    stripePromise = loadStripe(key);
  }

  return stripePromise;
}


