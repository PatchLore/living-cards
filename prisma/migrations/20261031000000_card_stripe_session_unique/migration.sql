-- One Card per Stripe Checkout session. Fulfilment already guarantees this with
-- an advisory lock; this makes the database enforce it too. NULLs stay allowed
-- (Postgres treats them as distinct). Fails, and changes nothing, if any
-- duplicates exist, so run the duplicate check in docs/PRISMA_BASELINE.md first.

-- CreateIndex
CREATE UNIQUE INDEX "Card_stripeSessionId_key" ON "Card"("stripeSessionId");

-- DropIndex (the unique index above replaces it)
DROP INDEX "Card_stripeSessionId_idx";
