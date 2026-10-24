# Launch runbook

## Sales switch
- Checkout is **closed unless `CHECKOUT_ENABLED` is exactly `true`** (per Vercel environment). Closed means `/api/checkout` answers 503 before anything reaches Stripe, and the order forms show "Opening soon".
- Production stays `CHECKOUT_ENABLED=false` until launch. To open sales: set it to `true` for Production and redeploy.
- Older deployments (before the switch existed) have **no** switch: rolling back past it reopens checkout. See Rollback.

## Consumer and privacy rules built into the site
- **Immediate supply (digital content):** every order form has an unticked box with `IMMEDIATE_SUPPLY_CONSENT` (lib/sales.ts). Checkout refuses orders without it (400). The consent version goes into Stripe metadata (`supplyConsent`), and the confirmation email and success page repeat `IMMEDIATE_SUPPLY_CONFIRMATION`.
- **First names only:** every name field says so (card forms, Kids studio, RSVP, business enquiries).
- **Link expiry:** card links stay open for `CARD_LINK_MONTHS` (12) months. The email, success page and card page show the date; expired links show "This card has expired". The daily cleanup cron (`/api/cron/cleanup`) then clears the recipient name, message and buyer email (rows are kept for accounts and tree records) and deletes party replies. Party replies are also deleted 90 days after they're sent, and their IP hashes after 24 hours.
- **Advent timing:** doors open at midnight UK time (Europe/London) from 1 to 24 December, using the server's clock (lib/adventCalendar.ts).

## Preview deployments (testing)
Preview must never use live data. In Vercel → Settings → Environment Variables, the **Preview** scope needs:
- `DATABASE_URL`: a separate test database (not production)
- `STRIPE_SECRET_KEY`, `STRIPE_PRICE_ID`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`: Stripe **test mode** values
- `CHECKOUT_ENABLED=true`
- No `SITE_URL`, `NEXT_PUBLIC_SITE_URL`, `STRIPE_SUCCESS_URL` or `STRIPE_CANCEL_URL`, so links and redirects stay on the preview URL
- No `GOODAPI_LIVE` (no real trees are planted)

Payments complete through the success page (`/api/order`), so a Stripe webhook isn't needed on Preview.

## Rollback
- **Dashboard:** Vercel → Project → Deployments → pick the previous Production deployment → ⋯ → **Instant Rollback** (or **Promote to Production**). New production deploys stop auto-promoting until you promote one again.
- **CLI:** `vercel rollback` (to the previous production deployment) or `vercel rollback <deployment-url>`.
- **Keep sales closed when rolling back:** only roll back to a deployment that includes the sales switch. If you must go further back, first remove `STRIPE_SECRET_KEY` from Production (older code then refuses checkout) and redeploy that deployment.
- The `PartyRsvp` table can stay in the database; older code ignores it.
