// Offline integration checks: Stripe, database, email and tree planting are mocked.
// Run with: node -r tsx/cjs scripts/test-kids-checkout.cjs
const assert = require("node:assert/strict");
const Module = require("node:module");
const { KIDS_LIMITS, KIDS_SCENES, kidsCardKey, parseKidsCard, parseKidsPersonalisation, serializeKidsPersonalisation } = require("../lib/kids.ts");

const load = Module._load;
const sessions = [];
let stored = null;
let sends = 0;
let plants = 0;
let creates = 0;
let sharedCard = null;

Module._load = function (request, parent, ...args) {
  const filename = parent?.filename.replaceAll("\\", "/") ?? "";
  if (filename.endsWith("/app/c/[shareId]/page.tsx") || filename.endsWith("/app/c/[shareId]/opengraph-image.tsx")) {
    if (request.endsWith("lib/db/cards")) return { getCardByShareId: async () => sharedCard };
    if (request.endsWith("lib/ogImage")) return { OG_SIZE: { width: 1200, height: 630 }, renderCardOg: async (input) => input };
    if (request.endsWith("KidsStudio") || request.endsWith("TreeCertificate") || request === "./SharedCard") return { __esModule: true, default: () => null };
    if (request.endsWith("lib/goodapi")) return { getTreeEvidence: async () => null };
  }
  if (filename.endsWith("/app/api/checkout/route.ts") && request.endsWith("lib/fulfillment")) {
    return { getStripe: async () => ({ checkout: { sessions: { create: async (input) => {
      sessions.push(input);
      return { url: "https://checkout.stripe.test/offline" };
    } } } }) };
  }
  if (filename.endsWith("/lib/fulfillment.ts")) {
    if (request === "./db/cards") return { createCard: async (input) => {
      if (stored) return stored;
      creates++;
      stored = {
        id: "offline-order", share_id: "opaque-token", card_key: input.cardKey,
        recipient_name: input.recipientName, message: input.message,
        stripe_session_id: input.stripeSessionId, stripe_customer_email: input.stripeCustomerEmail,
        email_sent: false, tree_id: null,
      };
      return stored;
    } };
    if (request === "./prisma") return { __esModule: true, default: { card: {
      update: async ({ data }) => {
        if ("treeId" in data) stored.tree_id = data.treeId;
        if ("emailSent" in data) stored.email_sent = data.emailSent;
      },
      updateMany: async () => {
        if (stored.email_sent) return { count: 0 };
        stored.email_sent = true;
        return { count: 1 };
      },
    } } };
    if (request === "./email/sendCardEmail") return { sendCardEmail: async () => { sends++; } };
    if (request === "./goodapi") return { TREE_LOCATION: "Offline test", plantTreeForCard: async () => { plants++; return { treeId: "test-tree" }; } };
  }
  return load.call(this, request, parent, ...args);
};

async function main() {
  process.env.STRIPE_SECRET_KEY = "sk_test_offline";
  process.env.STRIPE_PRICE_ID = "price_legacy_offline";
  const { POST } = require("../app/api/checkout/route.ts");
  const checkout = (body) => POST(new Request("https://cardroots.test/api/checkout", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) }));
  const base = { scene: "santa", recipientName: "Leo", extraDetail: "Kind to friends", customMessage: "Keep shining!", packageType: "single" };

  for (const [scene, price] of [["santa", 500], ["advent", 1000], ["tooth", 500], ["party", 700]]) {
    const input = { ...base, scene, amount: 1, price: 1 };
    assert.equal((await checkout(input)).status, 200);
    const session = sessions.at(-1);
    assert.equal(session.line_items[0].price_data.unit_amount, price);
    assert.equal(session.line_items[0].price_data.currency, "gbp");
    assert.deepEqual(session.metadata, { product: "kids", kidsVersion: "1", cardKey: kidsCardKey(input), ...base, scene });
    assert(!session.success_url.includes("Leo"));
  }
  delete process.env.STRIPE_PRICE_ID;
  assert.equal((await checkout({ ...base, scene: "party", packageType: "bundle" })).status, 200);
  assert.equal(sessions.at(-1).line_items[0].price_data.unit_amount, 1200);
  assert.equal(sessions.at(-1).metadata.scene, "party");

  const bundleWording = { santa: { extraDetail: "Helped at the food bank", customMessage: "Santa saw!" }, advent: { extraDetail: "Loves snow", customMessage: "24 days of fun" }, tooth: { extraDetail: "Tooth #2", customMessage: "So brave!" } };
  const bundleInput = { ...base, scene: "party", packageType: "bundle", bundle: bundleWording };
  assert.equal((await checkout(bundleInput)).status, 200);
  const bundleSession = sessions.at(-1);
  assert.equal(bundleSession.line_items[0].price_data.unit_amount, 1200);
  assert(Object.values(bundleSession.metadata).every((value) => typeof value === "string" && value.length <= 500), "Stripe metadata must stay flat strings");
  assert.equal(bundleSession.metadata.adventMessage, "24 days of fun");
  assert.equal(bundleSession.metadata.santaExtra, "Helped at the food bank");
  const countBeforeBadBundle = sessions.length;
  for (const bundle of [
    { squishy: bundleWording.santa }, // no longer in any bundle
    { party: bundleWording.santa }, // the bought experience uses the top-level fields
    { advent: bundleWording.santa, extra: bundleWording.santa }, // not an experience
    { santa: { extraDetail: "a".repeat(KIDS_LIMITS.extraDetail + 1), customMessage: "" } },
  ]) assert.equal((await checkout({ ...bundleInput, bundle })).status, 400);
  assert.equal(sessions.length, countBeforeBadBundle, "invalid bundles must not call Stripe");
  // A single never carries bundle wording, even if a client sends it.
  assert.equal((await checkout({ ...base, bundle: bundleWording })).status, 200);
  assert.equal(sessions.at(-1).metadata.santaExtra, undefined);

  const countBeforeInvalid = sessions.length;
  for (const input of [
    // Off sale while it's redesigned, as a single or as a bundle's chosen experience.
    { ...base, scene: "squishy" }, { ...base, scene: "squishy", packageType: "bundle" },
    { ...base, scene: "__proto__" }, { ...base, packageType: "free" },
    { ...base, recipientName: " " }, { ...base, recipientName: "a".repeat(KIDS_LIMITS.recipientName + 1) },
    { ...base, extraDetail: "a".repeat(KIDS_LIMITS.extraDetail + 1) },
    { ...base, customMessage: "a".repeat(KIDS_LIMITS.customMessage + 1) },
  ]) assert.equal((await checkout(input)).status, 400);
  assert.equal(sessions.length, countBeforeInvalid, "invalid requests must not call Stripe");

  process.env.STRIPE_PRICE_ID = "price_legacy_offline";
  const oldInput = { cardKey: "live-santa-sleigh", recipient: "Maya", message: "Merry Christmas" };
  assert.equal((await checkout(oldInput)).status, 200);
  assert.deepEqual(sessions.at(-1).line_items, [{ price: "price_legacy_offline", quantity: 1 }]);
  assert.deepEqual(sessions.at(-1).metadata, oldInput);
  assert.equal((await checkout({ ...oldInput, cardKey: "not-a-card" })).status, 400);

  for (const scene of Object.keys(KIDS_SCENES)) {
    const data = { ...base, scene, customMessage: '<img src="x"> & hello' };
    assert.deepEqual(parseKidsCard(kidsCardKey(data), serializeKidsPersonalisation(data)), data);
    assert.equal(parseKidsCard(kidsCardKey(data), JSON.stringify({ ...data, version: 2 })), null);
  }
  assert.equal(parseKidsPersonalisation({ ...base, scene: "constructor" }), null);
  assert.equal(parseKidsCard(kidsCardKey(base), "not json"), null);
  assert.equal(parseKidsCard(kidsCardKey(base), serializeKidsPersonalisation({ ...base, scene: "tooth" })), null);

  const { fulfillCheckoutSession, NotPaidError } = require("../lib/fulfillment.ts");
  const paid = { id: "cs_offline_paid", payment_status: "paid", currency: "gbp", amount_total: 500, customer_details: { email: "buyer@example.test" }, metadata: { product: "kids", kidsVersion: "1", cardKey: kidsCardKey(base), ...base } };
  await assert.rejects(() => fulfillCheckoutSession({ ...paid, payment_status: "unpaid" }), NotPaidError);
  await assert.rejects(() => fulfillCheckoutSession({ ...paid, amount_total: 1 }), /Unexpected kids payment amount/);
  await assert.rejects(() => fulfillCheckoutSession({ ...paid, metadata: { ...paid.metadata, scene: "missing" } }), /Invalid kids personalisation/);
  assert.equal(creates, 0, "unpaid or invalid sessions must not create cards");
  const first = await fulfillCheckoutSession(paid);
  const second = await fulfillCheckoutSession(paid);
  assert.equal(first.share_id, "opaque-token");
  assert.equal(second.share_id, first.share_id);
  assert.deepEqual(parseKidsCard(stored.card_key, stored.message), base);
  assert.equal(creates, 1);
  assert.equal(sends, 1);
  assert.equal(plants, 1);

  stored = null;
  await fulfillCheckoutSession({ ...paid, id: "cs_offline_bundle", amount_total: 1200, metadata: bundleSession.metadata });
  assert.deepEqual(parseKidsCard(stored.card_key, stored.message), { ...base, scene: "party", packageType: "bundle", bundle: bundleWording });

  const { buildCardEmail } = require("../lib/email/sendCardEmail.ts");
  const email = buildCardEmail({ shareId: "opaque-token", cardKey: kidsCardKey({ ...base, packageType: "bundle" }), recipientName: "<img src=x>" });
  assert(email.subject.includes("CardRoots Kids"));
  assert(email.html.includes("Complete Kids Magical Bundle"));
  assert(email.html.includes("&lt;img src=x&gt;"));
  assert(!email.html.includes("<img src=x>"));
  assert(email.cardUrl.endsWith("/c/opaque-token"));
  assert(!email.cardUrl.includes("?"));

  const image = require("../app/c/[shareId]/opengraph-image.tsx").default;
  const { generateMetadata } = require("../app/c/[shareId]/page.tsx");
  const params = { params: Promise.resolve({ shareId: "opaque-token" }) };
  sharedCard = { card_key: kidsCardKey(base), recipient_name: "PrivateChildName" };
  const kidsPreview = await image(params);
  const kidsMetadata = await generateMetadata(params);
  assert.equal(kidsPreview.title, "A letter from the North Pole");
  assert.equal(kidsPreview.posters[0], "/cards/kids/santa.jpg");
  assert.equal(kidsPreview.eyebrow, "CardRoots For Kids");
  assert(!JSON.stringify(kidsPreview).includes("PrivateChildName"));
  assert(!JSON.stringify(kidsMetadata).includes("PrivateChildName"));
  assert.equal(kidsMetadata.referrer, "no-referrer");
  assert.deepEqual(kidsMetadata.robots, { index: false, follow: false, noarchive: true });
  sharedCard = { card_key: "live-santa-sleigh", recipient_name: "Maya" };
  const legacyPreview = await image(params);
  const legacyMetadata = await generateMetadata(params);
  assert.equal(legacyPreview.title, "A card for Maya");
  assert.equal(legacyPreview.eyebrow, "You've got a card");
  assert.equal(legacyMetadata.referrer, undefined);
  assert.deepEqual(legacyMetadata.robots, { index: false, follow: false });
  console.log("Kids checks passed: all prices, bundle, validation, legacy checkout, paid fulfillment, retry idempotency, token payloads, email escaping and private social metadata.");
}

main().catch((error) => { console.error(error); process.exitCode = 1; }).finally(() => { Module._load = load; });
