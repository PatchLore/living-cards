import { loadStripe, type Stripe } from "@stripe/stripe-js";

// The Stripe object returned by loadStripe() has redirectToCheckout.
// Ensure Typescript uses the browser Stripe type.

let stripePromise: Promise<Stripe | null> | null = null;

export default function getStripe() {
  if (!stripePromise) {
    stripePromise = loadStripe(
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ""
    );
  }
  return stripePromise;
}


