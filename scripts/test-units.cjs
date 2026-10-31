// Unit checks for timing, retention and text-fit logic. Run with: node -r tsx/cjs scripts/test-units.cjs
const assert = require("node:assert/strict");
const Module = require("node:module");

// The retention job is checked against a stand-in database that records what it was asked to do.
const calls = [];
const enquiryRows = [];
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
  // Enquiry limits run against an in-memory table that understands the few queries they make.
  if (parent?.filename.replaceAll("\\", "/").endsWith("/lib/enquiry.ts") && request === "./prisma") {
    const matches = (row, where = {}) => Object.entries(where).every(([key, value]) =>
      key === "createdAt" ? (!value.gte || row.createdAt >= value.gte) && (!value.lt || row.createdAt < value.lt) : row[key] === value);
    return { __esModule: true, default: { enquiryAttempt: {
      count: async ({ where }) => enquiryRows.filter(r => matches(r, where)).length,
      create: async ({ data }) => { const row = { id: String(enquiryRows.length + 1), confirmationSent: false, createdAt: new Date(), ...data }; enquiryRows.push(row); return row; },
      update: async ({ where, data }) => Object.assign(enquiryRows.find(r => r.id === where.id), data),
      deleteMany: async ({ where }) => { const before = enquiryRows.length; enquiryRows.splice(0, Infinity, ...enquiryRows.filter(r => !matches(r, where))); return { count: before - enquiryRows.length }; },
    } } };
  }
  return load.call(this, request, parent, ...args);
};

const { adventDoorsOpen, londonDate, sleepsUntilAdvent } = require("../lib/adventCalendar.ts");
const { cardLinkExpiresAt, CARD_LINK_MONTHS } = require("../lib/sales.ts");
const { cardLinkExpired, deleteExpiredCardContent } = require("../lib/cardRetention.ts");
const { fitScale, textBoxFits } = require("../lib/fitText.ts");
process.env.RSVP_IP_SALT = "unit-test-salt";
const { hashIp } = require("../lib/ipHash.ts");
const { ENQUIRY_LIMITS, claimEnquirySlot, claimConfirmation, cleanUpEnquiries } = require("../lib/enquiry.ts");
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

  // IP hashes: keyed, stable, never the raw address; a missing salt falls back instead of switching limits off.
  assert.equal(hashIp(null), null);
  assert.equal(hashIp("203.0.113.9"), hashIp("203.0.113.9"));
  assert.notEqual(hashIp("203.0.113.9"), hashIp("203.0.113.10"));
  assert.ok(!hashIp("203.0.113.9").includes("203"));
  const savedSalt = process.env.RSVP_IP_SALT, savedCron = process.env.CRON_SECRET, savedDb = process.env.DATABASE_URL;
  delete process.env.RSVP_IP_SALT; delete process.env.CRON_SECRET; process.env.DATABASE_URL = "postgresql://unit/test";
  const quietError = console.error; console.error = () => {};
  assert.match(hashIp("203.0.113.9"), /^[0-9a-f]{32}$/, "no salt: falls back to a DATABASE_URL-derived key");
  console.error = quietError;
  delete process.env.DATABASE_URL;
  assert.throws(() => hashIp("203.0.113.9"), /IP rate limits/, "no key at all: fails loudly");
  process.env.RSVP_IP_SALT = savedSalt; if (savedCron) process.env.CRON_SECRET = savedCron; if (savedDb) process.env.DATABASE_URL = savedDb;

  // Enquiries: 3 per IP per hour, a daily cap across everyone, and a separate daily cap on confirmations.
  for (let i = 0; i < ENQUIRY_LIMITS.perIpPerHour; i++) assert.equal((await claimEnquirySlot("198.51.100.1")).ok, true);
  const blocked = await claimEnquirySlot("198.51.100.1");
  assert.equal(blocked.ok, false);
  assert.equal(blocked.retryAfterSeconds, 3600);
  assert.equal(enquiryRows.length, ENQUIRY_LIMITS.perIpPerHour, "rejected requests write nothing");
  assert.equal((await claimEnquirySlot("198.51.100.2")).ok, true, "other IPs are unaffected");
  assert.ok(enquiryRows.every(r => /^[0-9a-f]{32}$/.test(r.ipHash)), "only hashes are stored");
  enquiryRows.forEach(r => { r.createdAt = new Date(Date.now() - 61 * 60_000); });
  assert.equal((await claimEnquirySlot("198.51.100.1")).ok, true, "the IP limit resets after an hour");
  // Parallel burst: the re-count after insert never lets more than the limit through.
  const burst = await Promise.all(Array.from({ length: 10 }, () => claimEnquirySlot("198.51.100.3")));
  assert.ok(burst.filter(r => r.ok).length <= ENQUIRY_LIMITS.perIpPerHour);
  enquiryRows.length = 0;
  for (let i = 0; i < ENQUIRY_LIMITS.perDay; i++) enquiryRows.push({ id: `d${i}`, ipHash: `h${i}`, confirmationSent: false, createdAt: new Date() });
  const busy = await claimEnquirySlot("198.51.100.4");
  assert.equal(busy.ok, false, "daily cap across all IPs");
  assert.match(busy.error, /info@cardroots\.com/);
  enquiryRows.length = 0;
  const ids = [];
  for (let i = 0; i < ENQUIRY_LIMITS.confirmationsPerDay + 2; i++) enquiryRows.push({ id: `c${i}`, ipHash: `h${i}`, confirmationSent: false, createdAt: new Date() }), ids.push(`c${i}`);
  const parallel = await Promise.all(ids.map(claimConfirmation));
  assert.ok(parallel.filter(Boolean).length <= ENQUIRY_LIMITS.confirmationsPerDay, "a burst never goes over the cap");
  enquiryRows.forEach(r => { r.confirmationSent = false; });
  const confirmations = [];
  for (const id of ids) confirmations.push(await claimConfirmation(id));
  assert.equal(confirmations.filter(Boolean).length, ENQUIRY_LIMITS.confirmationsPerDay, "confirmations stop at the daily cap");
  assert.equal(enquiryRows.filter(r => r.confirmationSent).length, ENQUIRY_LIMITS.confirmationsPerDay);
  enquiryRows[0].createdAt = new Date(Date.now() - 25 * 3_600_000);
  assert.deepEqual(await cleanUpEnquiries(), { enquiriesDeleted: 1 }, "cleanup drops rows after a day");

  console.log("Unit checks passed: advent UK timing, link expiry, retention job, text fit, IP hashing, enquiry limits.");
}

main().catch((error) => { console.error(error); process.exitCode = 1; }).finally(() => { Module._load = load; });
