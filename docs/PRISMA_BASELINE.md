# Prisma migrations: Postgres baseline

## What changed
- The old migrations were SQLite DDL. They created only `CardOrder`, altered a `Card` table that nothing created, and had no `PartyRsvp`. Production was built with `prisma db push` and hand-written SQL, so the migrations could not rebuild it.
- They are replaced by one Postgres baseline, `prisma/migrations/0_init`, generated from `schema.prisma`. It holds all three tables, every index, the `PartyRsvp → Card` foreign key (cascade delete), and the `ENABLE ROW LEVEL SECURITY` lines production has. `migration_lock.toml` now says `postgresql`.
- The build never runs migrations, so merging this changes nothing on production by itself.

## Baseline production (owner, once)
This only tells Prisma that production already has `0_init`. It creates the `_prisma_migrations` table and writes one row. It does not touch `Card`, `CardOrder` or `PartyRsvp`, and it runs no SQL from the migration.

Run these in PowerShell, from a checkout of branch `chore/prisma-postgres-baseline` (or `main` once it's merged), with `npm install` done.

1. Point Prisma at production **for this terminal only**. Use Supabase's direct connection or session pooler (port 5432), not the transaction pooler (port 6543):
   ```powershell
   $env:DATABASE_URL = "<production connection string>"
   ```
2. Read-only check that production matches the schema. It must print `No difference detected.` If it lists changes, stop here.
   ```powershell
   npx prisma migrate diff --from-url "$env:DATABASE_URL" --to-schema-datamodel prisma/schema.prisma --exit-code
   ```
3. Read-only status. Expected: `Following migration have not yet been applied: 0_init`. If it lists any other migration names (an old `_prisma_migrations` table), stop and ask before going on.
   ```powershell
   npx prisma migrate status
   ```
4. Mark the baseline as applied:
   ```powershell
   npx prisma migrate resolve --applied 0_init
   ```
5. Keep the new table out of Supabase's auto-generated API, as with the other tables. Run this in the Supabase SQL editor:
   ```sql
   ALTER TABLE "_prisma_migrations" ENABLE ROW LEVEL SECURITY;
   ```
6. Confirm. Expected: `Database schema is up to date!`
   ```powershell
   npx prisma migrate status
   ```
7. Clear the variable so later commands can't hit production by mistake:
   ```powershell
   Remove-Item Env:DATABASE_URL
   ```

**Undo:** if anything looks wrong after step 4, run `DROP TABLE "_prisma_migrations";` in the SQL editor. That puts the database back exactly as it was.

## New environments and disaster recovery
On an empty Postgres database:
```powershell
npx prisma migrate deploy
```
Then check for drift (needs a second empty database as the shadow DB). It should print `No difference detected.`:
```powershell
npx prisma migrate diff --from-migrations prisma/migrations --to-schema-datamodel prisma/schema.prisma --shadow-database-url "<empty scratch database>" --exit-code
```
From now on, change the schema with `npx prisma migrate dev --name <change>` against a local database, never `db push` on production.

## Follow-up: one Card per Stripe session (branch `chore/card-stripe-session-unique`)
Stacked on the baseline. It makes `Card.stripeSessionId` `@unique` and drops the plain index it replaces (migration `20261031000000_card_stripe_session_unique`). Fulfilment already prevents duplicates with an advisory lock, so this backs that up in the database. NULLs stay allowed. No app code changes.

1. Read-only duplicate check in the Supabase SQL editor. It must return no rows:
   ```sql
   SELECT "stripeSessionId", count(*) FROM "Card"
   WHERE "stripeSessionId" IS NOT NULL
   GROUP BY 1 HAVING count(*) > 1;
   ```
   If it returns rows, decide which card in each pair to keep **before** going on. Buyers may hold links to either `shareId`.
2. Only after the baseline is in place, set `$env:DATABASE_URL` as above and run this from the follow-up branch:
   ```powershell
   npx prisma migrate deploy
   ```
   Building the index briefly blocks writes to `Card`. The table is small, but pick a quiet moment.
3. If it fails with `P3018 … is duplicated`, nothing has changed (the old index is still there). Fix the duplicates, then run:
   ```powershell
   npx prisma migrate resolve --rolled-back 20261031000000_card_stripe_session_unique
   ```
   ```powershell
   npx prisma migrate deploy
   ```

## How this was verified (local throwaway Postgres 17, never production)
- `prisma migrate diff --from-empty --to-schema-datamodel` matches `exports/test-database-setup.sql` line for line, apart from the RLS lines (added by hand).
- `migrate deploy` on an empty database applied `0_init`. Comparing migrations to the schema and the database to the schema both gave `No difference detected`.
- A database built from `exports/test-database-setup.sql` (production's shape, with no `_prisma_migrations`) is identical to the migrated one. `migrate resolve --applied 0_init` then gave `Database schema is up to date!`. RLS stays on for all three tables, and Prisma still works with RLS on `_prisma_migrations`.
- Follow-up: deploys on a clean database. When duplicates exist it fails with P3018 and leaves the old index in place. After removing them, the steps under 3 recover it and leave no drift.
