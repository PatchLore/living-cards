import { NextResponse } from "next/server";
import { z } from "zod";
import { LIMITS, isPurchasable } from "../../../lib/catalog";
import { getStripe } from "../../../lib/fulfillment";
import { siteUrl } from "../../../lib/siteUrl";
import { CHECKOUT_CLOSED_MESSAGE, IMMEDIATE_SUPPLY_CONSENT_VERSION, checkoutOpen } from "../../../lib/sales";
import { KIDS_LIMITS, KIDS_SCENES, isKidsSceneForSale, kidsCardKey, kidsCheckoutMetadata, kidsPrice, parseKidsPersonalisation } from "../../../lib/kids";

export const runtime = "nodejs";

const Body = z.object({
  cardKey: z.string().refine(isPurchasable, "That card isn't available"),
  recipient: z
    .string()
    .trim()
    .min(1, "Please add who the card is for")
    .max(LIMITS.recipient, `Keep the name under ${LIMITS.recipient} characters`),
  message: z
    .string()
    .trim()
    .min(1, "Please write a message")
    .max(LIMITS.message, `Keep the message under ${LIMITS.message} characters`),
});

const KidsDetails = z.object({
  extraDetail: z.string().trim().max(KIDS_LIMITS.extraDetail, `Keep each detail under ${KIDS_LIMITS.extraDetail} characters`),
  customMessage: z.string().trim().max(KIDS_LIMITS.customMessage, `Keep each message under ${KIDS_LIMITS.customMessage} characters`),
});

const KidsBody = z.object({
  scene: z.string().refine(isKidsSceneForSale, "Please choose a kids creation"),
  recipientName: z.string().trim().min(1, "Please add the child's first name").max(KIDS_LIMITS.recipientName, `Keep the first name under ${KIDS_LIMITS.recipientName} characters`),
  extraDetail: z.string().trim().max(KIDS_LIMITS.extraDetail, `Keep the detail under ${KIDS_LIMITS.extraDetail} characters`),
  customMessage: z.string().trim().max(KIDS_LIMITS.customMessage, `Keep the message under ${KIDS_LIMITS.customMessage} characters`),
  packageType: z.enum(["single", "bundle"]),
  bundle: z.record(z.string(), KidsDetails).optional(),
});

export async function POST(req: Request) {
  // Sales are closed until launch: refuse before anything reaches Stripe.
  if (!checkoutOpen()) {
    console.warn("[CHECKOUT] Refused: checkout is closed (CHECKOUT_ENABLED is not true)");
    return NextResponse.json({ error: CHECKOUT_CLOSED_MESSAGE, closed: true }, { status: 503 });
  }
  const body = await req.json().catch(() => null);
  // Digital content: the buyer must expressly ask for immediate supply (unticked box on the form).
  if (!body || typeof body !== "object" || body.immediateSupplyConsent !== true) {
    return NextResponse.json({ error: "Please tick the box to confirm you want your order delivered straight away." }, { status: 400 });
  }
  const kidsRequest = body && typeof body === "object" && ("scene" in body || "packageType" in body);
  const parsed = kidsRequest ? KidsBody.safeParse(body) : Body.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid request" }, { status: 400 });
  }
  if (!process.env.STRIPE_SECRET_KEY || (!kidsRequest && !process.env.STRIPE_PRICE_ID)) {
    console.error("[CHECKOUT] Stripe payment configuration is missing");
    return NextResponse.json({ error: "Payments are not configured" }, { status: 500 });
  }

  const base = siteUrl();
  const successBase = process.env.STRIPE_SUCCESS_URL?.replace(/\/$/, "") || `${base}/success`;
  const successUrl = `${successBase}${successBase.includes("?") ? "&" : "?"}session_id={CHECKOUT_SESSION_ID}`;
  const cancelUrl = process.env.STRIPE_CANCEL_URL?.replace(/\/$/, "") || `${base}/cancel`;

  try {
    const stripe = await getStripe();
    const kids = kidsRequest ? KidsBody.parse(parsed.data) : null;
    const legacy = kidsRequest ? null : Body.parse(parsed.data);
    // A kids price is always chosen here, never from a client-supplied amount.
    const product = kids ? parseKidsPersonalisation(kids) : null;
    if (kids && !product) return NextResponse.json({ error: "Please check the bundle personalisation" }, { status: 400 });
    const cardKey = product ? kidsCardKey(product) : legacy!.cardKey;
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: product
        ? [{
            price_data: {
              currency: "gbp",
              unit_amount: kidsPrice(product) * 100,
              product_data: { name: product.packageType === "bundle" ? "CardRoots Complete Kids Magical Bundle" : KIDS_SCENES[product.scene].title },
            },
            quantity: 1,
          }]
        : [{ price: process.env.STRIPE_PRICE_ID, quantity: 1 }],
      success_url: successUrl,
      cancel_url: cancelUrl,
      // Stripe metadata values max out at 500 characters; LIMITS keeps us under.
      metadata: {
        ...(product ? kidsCheckoutMetadata(product) : { cardKey, recipient: legacy!.recipient, message: legacy!.message }),
        // The record of the immediate-supply consent the buyer ticked.
        supplyConsent: IMMEDIATE_SUPPLY_CONSENT_VERSION,
      },
      payment_intent_data: { description: `CardRoots card: ${cardKey}` },
    });

    if (!session.url) throw new Error("Stripe returned a session without a URL");
    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("[CHECKOUT] Stripe error:", err instanceof Error ? err.message : err);
    return NextResponse.json({ error: "We couldn't start checkout. Please try again." }, { status: 502 });
  }
}
