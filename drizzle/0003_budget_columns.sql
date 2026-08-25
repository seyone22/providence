-- Budget captured on the inquiry form: the figure the customer entered plus
-- the ISO 4217 code they entered it in.
--
-- Both are ADD COLUMN IF NOT EXISTS and nullable, so this is safe to apply
-- twice and safe to apply ahead of the deploy — existing leads simply have no
-- budget recorded.
--
-- Apply with scripts/apply-budget-columns.mjs rather than scripts/migrate.mjs:
-- the drizzle migrator is unusable while migration 0001 is listed in
-- drizzle/meta/_journal.json without its .sql file (see 0002_loving_sprite.sql).
ALTER TABLE "request" ADD COLUMN IF NOT EXISTS "budgetAmount" double precision;--> statement-breakpoint
ALTER TABLE "request" ADD COLUMN IF NOT EXISTS "budgetCurrency" text;
