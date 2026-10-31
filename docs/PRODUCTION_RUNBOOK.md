# Production runbook: homepage, order hardening, enquiry limits, migrations

Covers merging `perf/homepage`, `review/order-endpoint-hardening`,
`chore/prisma-postgres-baseline`, `chore/card-stripe-session-unique`,
`chore/enquiry-attempt-migration` and `fix/enquiry-rate-limit`. Nothing here
runs on its own: the build never runs migrations, and nothing deploys until
you push.

## 1. Environment variables (Vercel → Production), before deploying

| Variable | Needed for | Notes |
|---|---|---|
| `RSVP_IP_SALT` | Enquiry and party-RSVP IP limits | **Set this.** A random string of 32+ characters (e.g. `openssl rand -hex 32`). If unset, `CRON_SECRET` is used; if both are unset, a key derived from `DATABASE_URL` is used and an error is logged on every cold start. Changing it later only resets the 24-hour limit counters. |
| `CRON_SECRET` | Daily cleanup cron (now also deletes enquiry rows after 24h) | Should already be set. Without it the cron refuses to run and enquiry rows pile up. |
| `DATABASE_URL` | App | Unchanged. For the migration steps below, use the **direct or session** connection (port 5432), not the transaction pooler (6543). |
| `EMAIL_DRY_RUN` | — | **Must not be set** in Production. With it, enquiries send nothing and their contents are written to the logs. |
| `RESEND_API_KEY`, `EMAIL_FROM`, `ENQUIRY_EMAIL_TO`, `CHECKOUT_ENABLED`, Stripe keys | — | Unchanged. |

## 2. Database, before deploying the code

The new code needs the `EnquiryAttempt` table (without it, every enquiry answers 503 and
sends nothing). The current production code ignores the new table and the new unique
index, so do the database first. Pick a quiet moment: building the unique index briefly
blocks writes to `Card`.

From a checkout of the merged code, in PowerShell, with `npm install` done:

1. Point Prisma at production for this terminal only:
   ```powershell
   $env:DATABASE_URL = "<production direct connection string, port 5432>"
   ```
2. Read-only: production must match the baseline (`0_init`). It must print `No difference detected.`; otherwise stop.
   ```powershell
   cmd /c "git show c3a4313a:prisma/schema.prisma > %TEMP%\schema-0_init.prisma"
   npx prisma migrate diff --from-url "$env:DATABASE_URL" --to-schema-datamodel "$env:TEMP\schema-0_init.prisma" --exit-code
   ```
3. Read-only: exactly these three must be pending: `0_init`, `20261031000000_card_stripe_session_unique`, `20261031120000_enquiry_attempt`. Any other name means an old `_prisma_migrations` table exists; stop.
   ```powershell
   npx prisma migrate status
   ```
4. Read-only duplicate check, in the Supabase SQL editor. It must return no rows. If it returns any, stop and decide which card in each pair to keep (buyers may hold links to either `shareId`).
   ```sql
   SELECT "stripeSessionId", count(*) FROM "Card"
   WHERE "stripeSessionId" IS NOT NULL
   GROUP BY 1 HAVING count(*) > 1;
   ```
5. Mark the baseline as already applied. This creates `_prisma_migrations` and writes one row; it runs no SQL against the app tables.
   ```powershell
   npx prisma migrate resolve --applied 0_init
   ```
6. In the Supabase SQL editor, keep the new bookkeeping table out of the auto-generated API like the others:
   ```sql
   ALTER TABLE "_prisma_migrations" ENABLE ROW LEVEL SECURITY;
   ```
7. Apply the two real migrations (unique index on `Card.stripeSessionId`, then the `EnquiryAttempt` table with RLS on):
   ```powershell
   npx prisma migrate deploy
   ```
   If it fails with `P3018 … is duplicated`, nothing changed and the enquiry migration was not applied either. Fix the duplicates, then run `npx prisma migrate resolve --rolled-back 20261031000000_card_stripe_session_unique` and `npx prisma migrate deploy` again.
8. Confirm, then clear the variable:
   ```powershell
   npx prisma migrate status
   Remove-Item Env:DATABASE_URL
   ```
   Expected: `Database schema is up to date!`

**Undo before step 7:** `DROP TABLE "_prisma_migrations";` puts the database back exactly as it was.

## 3. Deploy the code

Only when you decide to. Then check:
- `curl -sI https://www.cardroots.com/ | findstr /i "referrer-policy x-content-type"` shows both headers.
- Send one test enquiry from your own address: you get the notification and the confirmation.
- Next day: the cleanup cron log line includes `enquiry rows deleted`.

Rolling the code back is safe: older code ignores `EnquiryAttempt`, `_prisma_migrations` and the unique index.
