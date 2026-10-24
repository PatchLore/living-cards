// Unit checks for timing, retention and text-fit logic. Run with: node -r tsx/cjs scripts/test-units.cjs
const assert = require("node:assert/strict");
const Module = require("node:module");

// The retention job is checked against a stand-in database that records what it was asked to do.
const calls = [];
const load = Module._load;
Module._load = function (request, parent, ...args) {
  if (parent?.filename.replaceAll("\\", "/").endsWith("/lib/cardRetention.ts") && request === "./prisma") {
    const op = (model, action) => (query) => { calls.push({ model, action, query }); return { count: 1 }; };
    return { __esModule: true, default: {
      card: { updateMany: op("card", "updateMany") },
      cardOrder: { updateMany: op("cardOrder", "updateMany") },
      partyRsvp: { deleteMany: op("partyRsvp", "deleteMany") },
      $transaction: async (ops) => Promise.all(ops),
    } };
  }
  return load.call(this, request, parent, ...args);
};

const { adventDoorsOpen, londonDate, sleepsUntilAdvent } = require("../lib/adventCalendar.ts");
const { cardLinkExpiresAt, CARD_LINK_MONTHS } = require("../lib/sales.ts");
const { cardLinkExpired, deleteExpiredCardContent } = require("../lib/cardRetention.ts");
const { fitScale, textBoxFits } = require("../lib/fitText.ts");
const at = (iso) => Date.parse(iso);

async function main() {
  // Advent: doors follow the calendar date in London, not the viewer's time zone.
  assert.equal(adventDoorsOpen(at("2026-11-30T23:59:59Z")), 0);
  assert.equal(adventDoorsOpen(at("2026-12-01T00:00:00Z")), 1, "door 1 opens at midnight UK time (GMT in December)");
  assert.equal(adventDoorsOpen(at("2026-12-13T23:59:59Z")), 13);
  assert.equal(adventDoorsOpen(at("2026-12-24T09:00:00Z")), 24);
  assert.equal(adventDoorsOpen(at("2026-12-31T12:00:00Z")), 24, "all doors stay open until New Year");
  assert.equal(adventDoorsOpen(at("2027-01-01T00:00:00Z")), 0);
  // British Summer Time: 23:30 UTC on 24 October is already 25 October in London.
  assert.deepEqual(londonDate(at("2026-10-24T23:30:00Z")), { year: 2026, month: 10, day: 25 });
  assert.equal(sleepsUntilAdvent(at("2026-10-24T12:00:00Z")), 38);
  assert.equal(sleepsUntilAdvent(at("2026-11-30T12:00:00Z")), 1);
  assert.equal(sleepsUntilAdvent(at("2026-12-26T12:00:00Z")), 340, "after Christmas it counts to next year");

  // Link expiry: 12 months from purchase.
  assert.equal(CARD_LINK_MONTHS, 12);
  assert.equal(cardLinkExpiresAt("2026-10-24T10:00:00Z").toISOString(), "2027-10-24T10:00:00.000Z");
  assert.equal(cardLinkExpired("2026-10-24T10:00:00Z", new Date("2027-10-24T09:59:59Z")), false);
  assert.equal(cardLinkExpired("2026-10-24T10:00:00Z", new Date("2027-10-24T10:00:00Z")), true);

  // Retention job: clears content (never deletes card rows) for cards older than the link period.
  const result = await deleteExpiredCardContent(new Date("2027-10-24T10:00:00Z"));
  assert.deepEqual(result, { cardsCleared: 1, legacyOrdersCleared: 1, rsvpsDeleted: 1 });
  const card = calls.find(c => c.model === "card");
  assert.equal(card.action, "updateMany");
  assert.equal(card.query.where.createdAt.lt.toISOString(), "2026-10-24T10:00:00.000Z");
  assert.deepEqual(card.query.data, { recipientName: "", message: "", stripeCustomerEmail: null });
  assert.equal(calls.find(c => c.model === "cardOrder").action, "updateMany");
  assert.deepEqual(calls.find(c => c.model === "partyRsvp").query.where, { card: { createdAt: { lt: new Date("2026-10-24T10:00:00Z") } } });

  // Text fit: the largest scale that fits, or null so the text wraps instead.
  const widthAt = (natural) => (scale) => textBoxFits({ scrollWidth: natural * scale, clientWidth: 300, height: 40, lineHeight: 40 }, 1);
  assert.equal(fitScale(widthAt(280)), 1, "short names stay full size");
  assert.equal(fitScale(widthAt(400)), 0.75, "longer names shrink just enough");
  assert.equal(fitScale(widthAt(600)), null, "nothing fits at 60%: caller wraps mid-word");
  assert.equal(textBoxFits({ scrollWidth: 300, clientWidth: 300, height: 80, lineHeight: 40 }, 2), true);
  assert.equal(textBoxFits({ scrollWidth: 300, clientWidth: 300, height: 122, lineHeight: 40 }, 2), false, "three lines don't fit in two");

  console.log("Unit checks passed: advent UK timing, link expiry, retention job, text fit.");
}

main().catch((error) => { console.error(error); process.exitCode = 1; }).finally(() => { Module._load = load; });
