import Stripe from "stripe";

const secret = process.env.STRIPE_SECRET_KEY || "";

if (!secret) {
  console.warn("STRIPE_SECRET_KEY is not set. Stripe client will be created with empty key.");
}

export const stripe = new Stripe(secret, {
  apiVersion: "2023-10-16" as unknown as any,
});

export default stripe;


