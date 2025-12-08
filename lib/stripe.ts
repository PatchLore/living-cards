import Stripe from "stripe";

const secret = process.env.STRIPE_SECRET_KEY || "";

if (!secret) {
  console.warn("STRIPE_SECRET_KEY is not set. Stripe client will be created with empty key.");
}

const stripe = new Stripe(secret, {
  apiVersion: "2022-11-15",
});

export default stripe;


