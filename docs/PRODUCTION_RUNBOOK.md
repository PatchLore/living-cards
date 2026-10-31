# Production runbook (step by step)

This puts the merged `perf/homepage` work live: the faster homepage, the hardened order
lookup, the business-enquiry limits and the database migrations. Do the parts **in order**.
Every command is shown once, with what it does and what you should see. If you see
something different, **stop**: nothing in Parts A–E changes the live site, and the undo
for each later step is written next to it.

Allow about 45 minutes, at a quiet time of day (early morning UK time is best).

**You need:**
- This repository on your computer, on branch `perf/homepage`, with `npm install` done.
- Access to the Vercel project, the Supabase project and the Stripe dashboard.
- Windows PowerShell (the normal blue terminal).

---

## Part A. Make preview deployments safe (Vercel dashboard, no commands)

Right now every variable except four is set for **All Environments**, so preview
deployments (the ones Vercel builds for every branch you push) use the **production
database, the live Stripe key and the live email key**. Pushing anything, including
this work, creates one. Fix that first.

1. Vercel → your project → **Settings → Environment Variables**.
2. For each of these four, open the ⋯ menu → **Edit**, and untick **Preview** and
   **Development** so only **Production** is ticked:
   - `DATABASE_URL`
   - `STRIPE_SECRET_KEY`
   - `STRIPE_WEBHOOK_SECRET`
   - `RESEND_API_KEY`

   If Vercel won't let you change the environments of a Sensitive variable, delete it and
   add it again with only **Production** ticked. Copy the value fresh from Supabase, Stripe
   or Resend. **Never delete the Production copy without re-adding it**: the next production
   deploy would break checkout or emails.
3. **Settings → Deployment Protection**: check that **Vercel Authentication** is on for
   preview deployments, so only you can open them.

What this changes: previews still show every page, but anything that needs the database,
payments or email fails on a preview. That is what you want. Production is not affected
(variables only apply to new deployments anyway).

## Part B. Add `RSVP_IP_SALT` (Vercel dashboard)

This is the secret key used to scramble visitors' IP addresses for the enquiry and
party-RSVP limits. It is not strictly required: without it the app uses `CRON_SECRET`.
Setting it means rotating `CRON_SECRET` later won't touch it.

1. **Settings → Environment Variables → Add New**.
2. Key: `RSVP_IP_SALT`. Value: a new random string. Make one in PowerShell:
   ```powershell
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```
   Expected: one line of 64 letters and digits. Copy it into Vercel.
3. Environments: **Production** only. Tick **Sensitive**. Save.

Leave `ENQUIRY_EMAIL_TO` unset unless you want enquiries somewhere other than
`info@cardroots.com`. **Never** add `EMAIL_DRY_RUN` to Production.

## Part C. Connect one terminal to the production database

You will type commands that talk to the live database, so do it in a terminal that is
clearly marked and closed afterwards.

1. Open a **new** PowerShell window and go to the repository:
   ```powershell
   cd C:\Dev\Projects\CardRoots\living-cards
   ```
2. Label the window so you can't mistake it for another one:
   ```powershell
   $Host.UI.RawUI.WindowTitle = "PRODUCTION DATABASE - close when done"
   ```
3. Make sure there is no `.env` file. Prisma reads `.env` (not `.env.local`), so the only
   database it can reach is the one you set in step 5.
   ```powershell
   Test-Path .env
   ```
   Expected: `False`. If it says `True`, stop and ask before going on.
4. Get the connection string: Supabase → your project → **Connect** → **Session pooler**.
   It ends in `pooler.supabase.com:5432/postgres`. Use port **5432**, not 6543 (the
   transaction pooler can't run migrations). Replace `[YOUR-PASSWORD]` with the database
   password.
5. Give it to this window only. `Read-Host` keeps the pasted value out of your command history:
   ```powershell
   $env:DATABASE_URL = Read-Host "Paste the production connection string"
   ```
   Paste and press Enter. Nothing is printed.
6. Check the connection (read-only):
   ```powershell
   npx prisma migrate status
   ```
   Expected, in this order:
   - `Datasource "db": PostgreSQL database "postgres", schema "public" at "aws-1-eu-north-1.pooler.supabase.com:5432"` (that is your production host);
   - `3 migrations found in prisma/migrations`;
   - `Following migrations have not yet been applied:`, then exactly `0_init`, `20261031000000_card_stripe_session_unique` and `20261031120000_enquiry_attempt`.

   Ignore the hint `To apply migrations in development run prisma migrate dev`. **Never run
   `migrate dev`, `migrate reset` or `db push` in this window**: against production they
   can delete data. If other migration names appear, stop.

## Part D. Read-only checks

1. Check that production matches the baseline exactly. The first line saves the baseline
   schema to a temporary file; the second compares the live database to it.
   ```powershell
   cmd /c "git show c3a4313a:prisma/schema.prisma > %TEMP%\schema-0_init.prisma"
   ```
   ```powershell
   npx prisma migrate diff --from-url "$env:DATABASE_URL" --to-schema-datamodel "$env:TEMP\schema-0_init.prisma" --exit-code
   ```
   Expected: `No difference detected.` If it lists changes, stop.
2. Check for duplicate Stripe sessions. Supabase → **SQL Editor** → new query, paste and run:
   ```sql
   SELECT "stripeSessionId", count(*) FROM "Card"
   WHERE "stripeSessionId" IS NOT NULL
   GROUP BY 1 HAVING count(*) > 1;
   ```
   Expected: **Success. No rows returned.** If any rows come back, stop: two cards share one
   payment, and you need to decide which to keep before going on.

## Part E. Back up the database

1. If Supabase shows **Database → Backups** for your plan, note the time of the latest
   backup. Either way, also take your own copy:
2. Make a backup file of the app's tables (`public` schema) in your Documents folder:
   ```powershell
   & "C:\Dev\Lev\tools\pgsql-17.11\pgsql\bin\pg_dump.exe" --dbname="$env:DATABASE_URL" --schema=public --format=custom --no-owner --file="$HOME\Documents\cardroots-backup-before-migrations.dump"
   ```
   Expected: no output, and the prompt comes back. (`pg_dump` is in the portable
   PostgreSQL 17 folder under `C:\Dev\Lev\tools`. If it says the server version is newer,
   stop and ask.)
3. Check the file is readable:
   ```powershell
   & "C:\Dev\Lev\tools\pgsql-17.11\pgsql\bin\pg_restore.exe" --list "$HOME\Documents\cardroots-backup-before-migrations.dump" | Select-String "TABLE DATA"
   ```
   Expected: three lines ending in `TABLE DATA public Card …`, `… CardOrder …` and `… PartyRsvp …`.

This file holds customers' names, messages and email addresses. Keep it private, don't
upload it anywhere, and delete it after about 30 days.

## Part F. Change the database (the only writes)

1. Tell Prisma that production already has the baseline. This creates a small
   bookkeeping table, `_prisma_migrations`, with one row. It does not touch any app table.
   ```powershell
   npx prisma migrate resolve --applied 0_init
   ```
   Expected: `Migration 0_init marked as applied.`

   **Undo** (only if you stop here): Supabase SQL Editor → `DROP TABLE "_prisma_migrations";`
2. Hide that bookkeeping table from Supabase's public API, like the other tables. Supabase
   SQL Editor:
   ```sql
   ALTER TABLE "_prisma_migrations" ENABLE ROW LEVEL SECURITY;
   ```
   Expected: **Success. No rows returned.**
3. Apply the two new migrations: a rule that one Stripe payment can only ever create one
   card, then the new `EnquiryAttempt` table. Adding the rule briefly pauses new orders
   being saved (a second or so on a table this size), which is why this is done at a
   quiet time.
   ```powershell
   npx prisma migrate deploy
   ```
   Expected: `Applying migration `20261031000000_card_stripe_session_unique``, then
   `Applying migration `20261031120000_enquiry_attempt``, then
   `All migrations have been successfully applied.`

   If it fails with `P3018` and the word `duplicated`: nothing changed. Re-run the duplicate
   check from Part D and ask for help.
4. Confirm:
   ```powershell
   npx prisma migrate status
   ```
   Expected: `Database schema is up to date!`

The live site keeps working throughout: the current code ignores the new table and the
new rule.

## Part G. Disconnect the terminal

1. Forget the connection string:
   ```powershell
   Remove-Item Env:DATABASE_URL
   ```
2. Prove it's gone:
   ```powershell
   npx prisma migrate status
   ```
   Expected: an error ending in `Environment variable not found: DATABASE_URL.` That is good.
3. Close the window.

## Part H. Deploy the code

Production deploys from the `christmas-redesign` branch. `perf/homepage` sits directly on
top of it, so this is a fast-forward with no merge.

1. Vercel → **Settings → Git**: check that **Production Branch** is `christmas-redesign`.
2. In a normal PowerShell window (not the production one):
   ```powershell
   cd C:\Dev\Projects\CardRoots\living-cards
   ```
   ```powershell
   git fetch origin
   ```
   ```powershell
   git log -1 --format=%h origin/christmas-redesign
   ```
   Expected: `0fe9d6eb`. If it's different, someone pushed in the meantime; stop and ask.
3. Move `christmas-redesign` forward to the new work and push it. The push is what deploys.
   ```powershell
   git switch christmas-redesign
   ```
   ```powershell
   git merge --ff-only perf/homepage
   ```
   Expected: `Fast-forward` and a list of changed files.
   ```powershell
   git push origin christmas-redesign
   ```
4. Watch Vercel → **Deployments** until the new production deployment shows **Ready**
   (a few minutes).

## Part I. Smoke test (about 5 minutes)

1. Open https://www.cardroots.com on your phone and a computer: the hero card and the card
   grid animate, and the classic cards show their pictures.
2. Check the new security headers:
   ```powershell
   curl.exe -sI https://www.cardroots.com/ | Select-String "referrer-policy|x-content-type"
   ```
   Expected: `Referrer-Policy: strict-origin-when-cross-origin` and `X-Content-Type-Options: nosniff`.
3. Click **Personalise** on any card, fill it in, tick the box and continue: you should
   reach the Stripe payment page. Don't pay; just go back.
4. Send one business enquiry from https://www.cardroots.com/corporate using your own email
   address: `info@cardroots.com` gets the enquiry, and you get the "We've received your
   CardRoots enquiry" confirmation.
5. Vercel → **Logs** (last hour): no lines containing `Rate limit check failed` or `[IP]`.
6. Tomorrow: the 03:30 cleanup cron's log line ends with `enquiry rows deleted: …`.

## Part J. If something goes wrong

- **The site misbehaves after the deploy:** Vercel → **Deployments** → the previous
  production deployment (commit `0fe9d6eb`, also tagged `prod-before-perf-homepage` on your
  computer) → ⋯ → **Instant Rollback**. This is safe: the old code ignores the new
  table and rule, so the database can stay as it is.
- **Enquiries fail with "We couldn't send your enquiry":** the `EnquiryAttempt` table is
  missing or the database is unreachable. Re-check Part F step 4.
- **You need to undo the one-card-per-payment rule** (unlikely: only if saving orders
  fails with a "unique constraint" error). In Supabase SQL Editor:
  ```sql
  DROP INDEX "Card_stripeSessionId_key";
  CREATE INDEX "Card_stripeSessionId_idx" ON "Card"("stripeSessionId");
  DELETE FROM "_prisma_migrations" WHERE migration_name = '20261031000000_card_stripe_session_unique';
  ```
- **Restoring the backup** replaces every order taken since it was made. Only do it with
  help, never as a first response.

---

### Reference: environment variables the code reads

| Variable | Production | If unset |
|---|---|---|
| `DATABASE_URL` | required | Nothing that saves or reads cards works. |
| `STRIPE_SECRET_KEY` | required | Checkout answers "Payments are not configured"; the success page can't confirm payments. |
| `STRIPE_PRICE_ID` | required | Christmas/occasion card checkout fails (Kids checkout has its own prices). |
| `STRIPE_WEBHOOK_SECRET` | required | The webhook answers 500 and Stripe keeps retrying; buyers are still served by the success page. |
| `RESEND_API_KEY` | required | Order and RSVP emails fail (cards are still created); enquiries fail with "please email us". |
| `EMAIL_FROM` | required | Order and RSVP emails fail; enquiries fall back to sending from `info@cardroots.com`. |
| `CHECKOUT_ENABLED` | `true` to sell | Anything else keeps sales closed ("Opening soon"). |
| `CRON_SECRET` | required | The daily cleanup and keep-alive crons refuse to run. |
| `GOODAPI_LIVE`, `GOODAPI_API_KEY` | for real trees | Trees are only planted when `GOODAPI_LIVE=1` and the key is set. |
| `RSVP_IP_SALT` | recommended | Falls back to `CRON_SECRET`; if that is unset too, to a key derived from `DATABASE_URL`, with an error in the logs. Limits keep working. |
| `ENQUIRY_EMAIL_TO` | optional | Enquiries go to `info@cardroots.com`. |
| `SITE_URL`, `NEXT_PUBLIC_SITE_URL` | recommended | Links fall back to `https://www.cardroots.com` (`/success` and `/cancel` fall back to `https://cardroots.com`, which redirects). |
| `STRIPE_SUCCESS_URL`, `STRIPE_CANCEL_URL` | optional | Default to the site's `/success` and `/cancel`. |
| `EMAIL_DRY_RUN` | must be unset | If `1`, no emails are sent and enquiry contents are written to the logs. |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | not used | Only read by `lib/getStripe.ts`, which nothing imports. Harmless. |
