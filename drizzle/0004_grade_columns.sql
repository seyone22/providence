-- Grades / variants of one model, and the steering hands it can be sourced
-- in — plus the two lead columns that record what the customer picked.
--
-- specdossier.grades          the grade ladder (Ti, Ti+, Ti-L, Ti-L Reserve),
--                             each entry storing only what it changes off the
--                             base spec. Shape: src/lib/vehicle-grades.ts.
-- specdossier.steeringOptions every hand this model comes in. Empty falls back
--                             to the existing single "steering" column, which
--                             is what every pre-existing dossier has.
-- request.grade               the grade the customer asked for.
-- request.steering            the hand the customer needs.
--
-- All four are ADD COLUMN IF NOT EXISTS, and the two dossier columns default
-- to empty, so this is safe to apply twice and safe to apply ahead of the
-- deploy — existing dossiers read as "no ladder, one hand" and existing leads
-- as "grade not asked".
--
-- Apply with scripts/apply-grade-columns.mjs rather than scripts/migrate.mjs:
-- the drizzle migrator is unusable while migration 0001 is listed in
-- drizzle/meta/_journal.json without its .sql file (see 0002_loving_sprite.sql).
ALTER TABLE "specdossier" ADD COLUMN IF NOT EXISTS "grades" jsonb DEFAULT '[]'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "specdossier" ADD COLUMN IF NOT EXISTS "steeringOptions" text[] DEFAULT '{}'::text[] NOT NULL;--> statement-breakpoint
ALTER TABLE "request" ADD COLUMN IF NOT EXISTS "grade" text;--> statement-breakpoint
ALTER TABLE "request" ADD COLUMN IF NOT EXISTS "steering" text;
