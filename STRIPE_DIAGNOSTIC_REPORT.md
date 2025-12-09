# Stripe Wiring Diagnostic Report

Generated: $(date)

## Summary

This report documents the current state of Stripe integration in the Living Cards project.

---

## 1. Environment Variables Status

### Required Variables Check:

| Variable | Status | Notes |
|----------|--------|-------|
| `STRIPE_SECRET_KEY` | ⚠️ **CHECK REQUIRED** | Used in checkout route. If missing, returns dummy session ID. |
| `STRIPE_PRICE_ID` | ⚠️ **NOT USED** | Defined in README but not used in checkout route |
| `STRIPE_SUCCESS_URL` | ⚠️ **NOT USED** | Not used - checkout uses `NEXT_PUBLIC_SITE_URL` instead |
| `STRIPE_CANCEL_URL` | ⚠️ **NOT USED** | Not used - checkout uses `NEXT_PUBLIC_SITE_URL` instead |
| `NEXT_PUBLIC_SITE_URL` | ✅ **USED** | Used for success/cancel URLs |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | ✅ **USED** | Required for client-side Stripe.js redirect |
| `STRIPE_WEBHOOK_SECRET` | ⚠️ **CHECK REQUIRED** | Referenced in README but no webhook route exists |

**Action Required:** Check your `.env` file to verify which variables are actually set.

---

## 2. Checkout Route Analysis (`/app/api/checkout/route.ts`)

### Current Implementation:

✅ **Working:**
- Stripe instance initializes with `STRIPE_SECRET_KEY`
- `mode: "payment"` is correctly set
- Error handling is in place
- Returns session ID on success

❌ **Issues Found:**

1. **STRIPE_PRICE_ID Not Used**
   - Currently uses `price_data` with hardcoded values:
     - `currency: "gbp"`
     - `unit_amount: 400` (4.00 GBP)
     - `product_data: { name: "Premium Card Export" }`
   - **Fix Needed:** Should use `STRIPE_PRICE_ID` if you want to use pre-configured Stripe prices

2. **STRIPE_SUCCESS_URL / STRIPE_CANCEL_URL Not Used**
   - Currently constructs URLs using `NEXT_PUBLIC_SITE_URL`:
     - `success_url: ${process.env.NEXT_PUBLIC_SITE_URL}/success`
     - `cancel_url: ${process.env.NEXT_PUBLIC_SITE_URL}/cancel`
   - **Fix Needed:** Use `STRIPE_SUCCESS_URL` and `STRIPE_CANCEL_URL` if you want separate env vars

3. **Returns session.id, Not session.url**
   - Current: Returns `{ id: session.id }`
   - **Issue:** Client code expects to use `stripe.redirectToCheckout({ sessionId: id })`
   - **Note:** This is actually correct for the current client implementation, but if you want to redirect directly, you'd need `session.url`

4. **No Metadata Passed**
   - No `metadata` field in checkout session creation
   - **Fix Needed:** Add metadata (e.g., `cardKey`) if you need to track which card was purchased

### Code Review:

```typescript
// Current implementation (lines 17-32)
const session = await stripe.checkout.sessions.create({
  mode: "payment",
  payment_method_types: ["card"],
  line_items: [
    {
      price_data: {  // ⚠️ Should use STRIPE_PRICE_ID instead
        currency: "gbp",
        product_data: { name: "Premium Card Export" },
        unit_amount: 400,
      },
      quantity: 1,
    },
  ],
  success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/success`,  // ⚠️ Should use STRIPE_SUCCESS_URL
  cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/cancel`,    // ⚠️ Should use STRIPE_CANCEL_URL
  // ⚠️ Missing: metadata: { cardKey: ... }
});

return NextResponse.json({ id: session.id });  // ⚠️ Could return session.url instead
```

---

## 3. Client-Side Integration

### Current Implementation (`components/BuyButton.tsx`):

✅ **Working:**
- Calls `POST /api/checkout`
- Uses `getStripe()` from `lib/getStripe.ts`
- Redirects using `stripe.redirectToCheckout({ sessionId: id })`

⚠️ **Potential Issues:**
- No error handling for failed checkout API calls
- No loading state
- Assumes `getStripe()` returns a valid Stripe instance

---

## 4. Webhook Route Status

❌ **NOT FOUND**

- No webhook route exists at `/app/api/stripe-webhook/route.ts`
- README mentions webhook setup but route is missing
- `STRIPE_WEBHOOK_SECRET` is referenced but not used

**Action Required:** Create webhook route if you need to handle payment completion events.

---

## 5. Testing Tools Added

### Diagnostic Endpoint:
- **URL:** `GET /api/stripe-diagnostic`
- **Purpose:** Check environment variables and Stripe initialization
- **Usage:** Visit in browser or call via fetch

### Test Buttons (Temporary):
- Added to homepage personalization form
- **"Run Diagnostic"** - Tests environment variables
- **"Test Checkout"** - Tests POST /api/checkout endpoint

**⚠️ REMOVE THESE AFTER TESTING:**
- Delete `/app/api/stripe-diagnostic/route.ts`
- Remove test buttons from `app/page.tsx` (lines 293-340)

---

## 6. Recommended Fixes

### Priority 1: Critical Issues

1. **Verify Environment Variables**
   ```bash
   # Check which variables are set
   # Run diagnostic: GET /api/stripe-diagnostic
   ```

2. **Add Metadata to Checkout**
   ```typescript
   metadata: {
     cardKey: cardKey,  // Pass the selected card key
   }
   ```

3. **Create Webhook Route** (if needed)
   - Create `/app/api/stripe-webhook/route.ts`
   - Use `stripe.webhooks.constructEvent` with `STRIPE_WEBHOOK_SECRET`

### Priority 2: Configuration Improvements

1. **Use STRIPE_PRICE_ID** (if you have pre-configured prices)
   ```typescript
   line_items: [
     {
       price: process.env.STRIPE_PRICE_ID,
       quantity: 1,
     },
   ],
   ```

2. **Use STRIPE_SUCCESS_URL / STRIPE_CANCEL_URL** (if you want separate env vars)
   ```typescript
   success_url: process.env.STRIPE_SUCCESS_URL || `${process.env.NEXT_PUBLIC_SITE_URL}/success`,
   cancel_url: process.env.STRIPE_CANCEL_URL || `${process.env.NEXT_PUBLIC_SITE_URL}/cancel`,
   ```

3. **Return session.url** (if you want direct redirect)
   ```typescript
   return NextResponse.json({ url: session.url });
   ```

---

## 7. Testing Checklist

- [ ] Run diagnostic: `GET /api/stripe-diagnostic`
- [ ] Test checkout: Click "Test Checkout" button
- [ ] Verify environment variables are set
- [ ] Test actual payment flow end-to-end
- [ ] Verify success/cancel redirects work
- [ ] Check Stripe dashboard for test payments
- [ ] Remove diagnostic tools after testing

---

## 8. Current Status Summary

| Component | Status | Notes |
|-----------|--------|-------|
| Stripe Initialization | ✅ Working | Uses STRIPE_SECRET_KEY correctly |
| Checkout Route | ⚠️ Partial | Works but doesn't use all env vars |
| Client Integration | ✅ Working | Uses Stripe.js correctly |
| Webhook Route | ❌ Missing | Not implemented |
| Environment Config | ⚠️ Incomplete | Some vars defined but not used |

---

## Next Steps

1. **Immediate:** Run the diagnostic endpoint to check your environment
2. **Short-term:** Add metadata to checkout if needed
3. **Medium-term:** Create webhook route if payment completion handling is needed
4. **Optional:** Refactor to use STRIPE_PRICE_ID and separate URL env vars

---

**Report Generated By:** Stripe Diagnostic Tool
**Date:** $(date)

