# End-to-End Payment Flow Audit (CardRoots / living-cards)

**Last updated:** Pre–Valentine launch  
**Flow:** Buy Card → Stripe Checkout → Webhook → Card created → Email delivered

---

## 1. Stripe Configuration (Code)

| Check | Status | Notes |
|-------|--------|--------|
| Stripe secret key from env | ✅ | `process.env.STRIPE_SECRET_KEY` in `app/api/checkout/route.ts` and `app/api/stripe-webhook/route.ts` (not hardcoded) |
| Price amount £5.00 | ⚠️ Dashboard | Amount is defined on the **Stripe Price** (STRIPE_PRICE_ID). In Dashboard the Price should be **500** (pence) for £5.00. |
| Currency GBP | ⚠️ Dashboard | Set on the Stripe Price: `currency: 'gbp'`. |
| Success URL | ✅ | Built from `STRIPE_SUCCESS_URL` (if set) or `NEXT_PUBLIC_SITE_URL` / `VERCEL_URL` + `/success?session_id={CHECKOUT_SESSION_ID}`. Optional env: `STRIPE_SUCCESS_URL=https://living-cards.vercel.app/success` (or your production URL). |
| Cancel URL | ✅ | Built from `STRIPE_CANCEL_URL` (if set) or base URL + `/cancel`. Optional env: `STRIPE_CANCEL_URL=https://living-cards.vercel.app/cancel`. |

**Env vars used by checkout:**

- `STRIPE_SECRET_KEY` – required at runtime
- `STRIPE_PRICE_ID` – required (Price must be £5.00 GBP in Dashboard)
- `NEXT_PUBLIC_SITE_URL` or `VERCEL_URL` – used for success/cancel if `STRIPE_SUCCESS_URL` / `STRIPE_CANCEL_URL` are not set
- Optional: `STRIPE_SUCCESS_URL`, `STRIPE_CANCEL_URL` – full URLs if you want to override (e.g. `https://living-cards.vercel.app/success`)

---

## 2. Stripe Dashboard Checklist

**Test mode (and Live when you go live):**

- [ ] **Product** e.g. “Digital Valentine Card” (or “Digital Card”) exists.
- [ ] **Price** linked to that product: **£5.00** (500 pence), **GBP**, one-time.
- [ ] **STRIPE_PRICE_ID** in Vercel (and .env.local) matches this Price ID (e.g. `price_xxx`).
- [ ] **Webhook endpoint** added in Stripe Dashboard → Developers → Webhooks:
  - **URL:** `https://<your-domain>/api/stripe-webhook`  
    (This app uses **`/api/stripe-webhook`**, not `/api/webhooks/stripe`.)
  - **Events:** `checkout.session.completed`
  - **Signing secret** copied into `STRIPE_WEBHOOK_SECRET` in Vercel and .env.local.

---

## 3. Flow: Buy Card → Email Delivered

1. **User:** Chooses card, enters recipient + message, clicks pay → POST `/api/checkout` with `cardKey`, `recipient`, `message`.
2. **Checkout API:** Creates Stripe Checkout Session (price from STRIPE_PRICE_ID, metadata: cardKey, recipient, message), returns `url` to redirect.
3. **User:** Completes payment on Stripe (test card `4242 4242 4242 4242`).
4. **Stripe:** Redirects to success URL with `?session_id={CHECKOUT_SESSION_ID}`.
5. **Stripe:** Sends `checkout.session.completed` to **`/api/stripe-webhook`**.
6. **Webhook:** Verifies signature with `STRIPE_WEBHOOK_SECRET`, creates card via `createCard()`, sends email via `sendCardEmail()` (Resend), sets `emailSent: true`.
7. **Email:** Link in email uses `SITE_URL` (e.g. `https://www.cardroots.com/c/{shareId}`). Ensure **SITE_URL** is set in Vercel and .env.local (no trailing slash).

**Required env for full flow:**

- Checkout: `STRIPE_SECRET_KEY`, `STRIPE_PRICE_ID`, and base URL (see above).
- Webhook: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `DATABASE_URL`, `RESEND_API_KEY`, `EMAIL_FROM`, `SITE_URL`.

---

## 4. Test Purchase (Stripe Test Mode)

1. Use **Stripe test keys** (pk_test_..., sk_test_...) and a **test webhook** endpoint (or Stripe CLI forward).
2. **Test card:** `4242 4242 4242 4242`  
   - Expiry: any future date  
   - CVC: any 3 digits  
   - ZIP: any
3. Run through: Choose card → Personalize → Pay → complete checkout → check:
   - Redirect to success page with session.
   - Webhook runs (check Vercel logs or Stripe Dashboard → Webhooks).
   - New row in DB (cards table) with correct cardKey, recipient, message, shareId.
   - Customer email receives “Your Cardroots card 🌱” with link to `SITE_URL/c/{shareId}`.
4. Open the link: card view at `/c/[shareId]` should load with the correct video and message.

---

## 5. Quick Reference – Env Vars

| Variable | Used by | Purpose |
|----------|---------|--------|
| `STRIPE_SECRET_KEY` | Checkout, Webhook, get-session | Stripe API (server). |
| `STRIPE_PRICE_ID` | Checkout | Price ID for £5.00 GBP (set in Dashboard). |
| `STRIPE_WEBHOOK_SECRET` | Webhook | Verify webhook signature. |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Client (if any) | Stripe.js / Checkout (client). |
| `NEXT_PUBLIC_SITE_URL` | Checkout (fallback), success/cancel URLs | Base URL for redirects. |
| `STRIPE_SUCCESS_URL` | Checkout (optional) | Full success URL (e.g. `https://living-cards.vercel.app/success`). |
| `STRIPE_CANCEL_URL` | Checkout (optional) | Full cancel URL. |
| `SITE_URL` | sendCardEmail | Base URL for “View your card” link in email (e.g. `https://www.cardroots.com`). |
| `RESEND_API_KEY` | Webhook → sendCardEmail | Send transactional email. |
| `EMAIL_FROM` | sendCardEmail | From address (e.g. `Cardroots <info@cardroots.com>`). |
| `DATABASE_URL` | Webhook, Prisma | Create card record. |

---

## 6. Webhook Path

- **This app:** `POST https://<your-domain>/api/stripe-webhook`
- **Not:** `/api/webhooks/stripe` (that path is not used in this project).

Configure the URL above in Stripe Dashboard → Webhooks and use the same domain as your production or preview URL (e.g. `https://living-cards.vercel.app` or `https://www.cardroots.com`).
