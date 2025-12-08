# Living Tree Cards — MVP

A minimal Next.js (App Router) + TypeScript + Tailwind + Stripe starter for sending a digital animated card.

Quick setup:

1. Copy env variables:

   - `STRIPE_SECRET_KEY`
   - `STRIPE_PRICE_ID`
   - `STRIPE_WEBHOOK_SECRET`
   - `NEXT_PUBLIC_SITE_URL` (e.g. `http://localhost:3000`)

2. Install deps and run Prisma migration:

   ```
   npm install
   npx prisma generate
   npx prisma migrate dev --name init
   npm run dev
   ```

3. Add card MP4s to `public/cards/` named:

   - `christmas_tree.mp4`
   - `warm_wishes.mp4`
   - `with_love.mp4`

   These file names are referenced by the site; you can replace them with your real assets.

Stripe webhook:

- Set the webhook endpoint in your Stripe dashboard to:
  `<NEXT_PUBLIC_SITE_URL>/api/stripe-webhook`
- Use the `STRIPE_WEBHOOK_SECRET` for verification.

Notes:

- This MVP uses SQLite (file: `prisma/dev.db`) and Prisma.
- The `shareId` is used for public card URLs: `/card/{shareId}`.


