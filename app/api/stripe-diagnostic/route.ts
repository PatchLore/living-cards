// Temporary diagnostic endpoint for Stripe testing
// DELETE THIS FILE after diagnostics are complete

import { NextResponse } from "next/server";

export async function GET() {
  const diagnostics: Record<string, any> = {
    timestamp: new Date().toISOString(),
    environment: {
      STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY ? "Set" : "Missing",
      STRIPE_PRICE_ID: process.env.STRIPE_PRICE_ID ? "Set" : "Missing",
      STRIPE_SUCCESS_URL: process.env.STRIPE_SUCCESS_URL ? "Set" : "Missing",
      STRIPE_CANCEL_URL: process.env.STRIPE_CANCEL_URL ? "Set" : "Missing (using NEXT_PUBLIC_SITE_URL fallback)",
      NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL ? "Set" : "Missing",
      NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ? "Set" : "Missing",
      STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET ? "Set" : "Missing",
    },
    issues: [] as string[],
    checkoutRouteAnalysis: {} as Record<string, any>,
  };

  // Check for missing required variables
  if (!process.env.STRIPE_SECRET_KEY) {
    diagnostics.issues.push("STRIPE_SECRET_KEY is missing - checkout will not work");
  }
  if (!process.env.NEXT_PUBLIC_SITE_URL) {
    diagnostics.issues.push("NEXT_PUBLIC_SITE_URL is missing - success/cancel URLs will be broken");
  }
  if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
    diagnostics.issues.push("NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is missing - client-side redirect will fail");
  }

  // Test Stripe initialization
  if (process.env.STRIPE_SECRET_KEY) {
    try {
      const { default: Stripe } = await import("stripe");
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
        apiVersion: "2023-10-16" as any,
      });
      diagnostics.stripeInitialization = "Success";
    } catch (error: any) {
      diagnostics.stripeInitialization = `Failed: ${error.message}`;
      diagnostics.issues.push(`Stripe initialization failed: ${error.message}`);
    }
  } else {
    diagnostics.stripeInitialization = "Skipped (no STRIPE_SECRET_KEY)";
  }

  // Analyze checkout route configuration
  diagnostics.checkoutRouteAnalysis = {
    usesSTRIPE_SECRET_KEY: true,
    mode: "payment",
    usesSTRIPE_PRICE_ID: false,
    note: "Currently uses price_data instead of STRIPE_PRICE_ID",
    usesSTRIPE_SUCCESS_URL: false,
    note2: "Uses NEXT_PUBLIC_SITE_URL instead of STRIPE_SUCCESS_URL",
    usesSTRIPE_CANCEL_URL: false,
    note3: "Uses NEXT_PUBLIC_SITE_URL instead of STRIPE_CANCEL_URL",
    returnsSessionUrl: false,
    note4: "Only returns session.id, not session.url",
    metadata: "Not set",
    note5: "No metadata (cardKey) is being passed",
  };

  // Check webhook route
  diagnostics.webhookRoute = {
    exists: false,
    path: "/api/stripe-webhook",
    note: "Webhook route not found in /app/api/",
  };

  return NextResponse.json(diagnostics, { status: 200 });
}
