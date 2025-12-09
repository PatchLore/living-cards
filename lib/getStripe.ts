import { loadStripe, type Stripe } from "@stripe/stripe-js";

// Shared promise (Stripe recommends this)

let stripePromise: Promise<Stripe | null> | null = null;

export default function getStripe() {
  if (!stripePromise) {
    stripePromise = loadStripe(
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ""
    );
  }
  return stripePromise;
}


