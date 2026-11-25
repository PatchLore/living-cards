// Server-side Stripe helper — lazy-import to avoid build-time execution
import type Stripe from "stripe";

export default async function getServerStripe() {
  const { default: Stripe } = await import("stripe");

  const secret = process.env.STRIPE_SECRET_KEY || "";
  if (!secret) {
    console.warn("STRIPE_SECRET_KEY is not set. Server Stripe cannot be initialized.");
    return null;
  }

  const stripe = new Stripe(secret, {
    apiVersion: "2023-10-16" as Stripe.StripeConfig["apiVersion"],
  });

  return stripe;
}


