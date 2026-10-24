# CardRoots For Kids

The `/kids` studio adapts the root implementation prompt and HTML reference into the existing Next.js app. The main navigation links to it beside Christmas cards. Live personalisation uses React text bindings; the public page excludes the reference’s developer tools.

## Experiences and prices

| Scene | Single purchase | Interaction |
| --- | ---: | --- |
| `santa` | £5 | Santa letter / Nice List certificate toggle |
| `advent` | £10 | 24 doors telling “Berry’s Lantern”, a personalised 24-chapter story (`components/kids/advent.ts`: title, four-line rhyme, chapter and a real-world “spark” activity per day, `{name}` replaced with the child’s name) with drawn icons (`adventIcons.tsx`, reusing the squishy characters) and an optional browser read-aloud; the studio preview opens the first three doors; purchased links follow the device’s December date, count down the sleeps before 1 December and remember opened doors per link in that browser’s localStorage |
| `squishy` | £6 | Animated Berry the Robin and personalised printable template |
| `tooth` | £5 | Tooth Fairy receipt and note |
| `party` | £7 | Birthday invitation and copyable RSVP replies |

**The paper squishy (`squishy`) is off sale while it is redesigned.** It is listed in `KIDS_HIDDEN_SCENES` in `lib/kids.ts`: the studio hides it, checkout refuses it and bundles no longer include it, but its code and any purchased links still work. Remove it from that list to sell it again.

The £12 Complete Kids Magical Bundle includes Santa’s letter and certificate, the Advent Village and the Tooth Fairy receipt (£20 bought separately). When bought with `tooth` or `party` selected, that creation is included too. A purchased bundle lets the recipient switch between its included scenes. The first name is shared; each included scene has its own detail and message, stored under `bundle` in the saved JSON and sent to Stripe as flat `<scene>Extra` / `<scene>Message` metadata keys (Stripe values are limited to 500 characters).

Every order uses the existing one-tree planting flow, including bundles. This deliberately corrects tree-count claims in the reference to match fulfillment. Printed artwork contains no fabricated tree certificate or planting identifier; verified evidence uses the existing card certificate when available.

## Checkout and saved links

`lib/kids.ts` defines the five prices, bundle price, allowed scenes and personalisation limits. `/api/checkout` validates the payload and computes GBP Stripe amounts on the server; client price fields are ignored. Paid fulfillment validates the amount and metadata, then uses the existing order, email and planting flow.

Purchased creations use the existing opaque `/c/[shareId]` link. A `kids-v1:<scene>:<packageType>` card key and versioned JSON in the existing `Card.message` field preserve personalisation without a database migration. Existing card checkout and recipient routes remain supported.

The studio preview is watermarked, the advent preview opens three doors, and squishy printing unlocks only on a purchased link. The full, unwatermarked experience is served only from a purchased `/c/[shareId]` link. Purchased Kids social previews omit the child’s name. Anyone holding a purchased link can open it.

Party RSVP buttons copy a reply for the guest to send to the organiser. Responses are not saved, counted or delivered automatically.

## Printing

The squishy card opens with the Squishy Workshop (`components/kids/SquishyWorkshop.tsx`): the child picks a shape, face, hat and colour (`workshopDesign.tsx`), squishes the creature three times, and its tummy pocket reveals the personalised message. The finished design is remembered per purchased link in that browser’s localStorage and joins the printable kit first, built through the same `SquishyCharacter` drawing system. Squishy singles and bundles also include a six-character printable kit (Berry the Robin, Rudy the Reindeer, Flurry the Snowman, Pip the Penguin, Ginger the Gingerbread, Fern the Fox) plus an Official Squishy Maker certificate. Characters live in `components/kids/squishyCharacters.tsx`; each is a front and a matching back with the child's maker badge on a 640×300 template (dashed cutting box, centre fold at x=320). Each silhouette's cut line is drawn into the SVG (not CSS), so overlapping parts print as one shape. Print pages are portalled under `<body>` (`.kids-print-root`) so printing shows only them: “Print the whole kit” is 4 A4 pages (two templates per page, then the certificate), “Print just …” is one page. Full Colour / Colour-In Outline applies to both. In the studio preview, printing (including from the browser menu) produces a single locked page.

## Configuration and checks

Reuse existing configuration: `DATABASE_URL`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `RESEND_API_KEY`, `EMAIL_FROM`, `GOODAPI_LIVE`, `GOODAPI_API_KEY`, and `SITE_URL` or `NEXT_PUBLIC_SITE_URL`. Existing optional `STRIPE_SUCCESS_URL` / `STRIPE_CANCEL_URL` overrides still apply. `STRIPE_PRICE_ID` remains necessary for legacy card checkout; Kids checkout uses server-defined amounts. No new Kids-specific secrets are required.

Run from `living-cards`:

```sh
node -r tsx/cjs scripts/test-kids-checkout.cjs
npx tsc --noEmit
npm run build
```

The offline integration checks mock Stripe, database, email and planting. They cover all prices, validation, legacy checkout, paid fulfillment and retries, stored payloads, email escaping and private social metadata. Live external payment, email delivery and tree planting have not been tested as part of this implementation.
