-- The offline-conversion upload ledger.
--
-- Whether a lead has already been reported to Meta / Google Ads used to be
-- inferred from its current sales label, by asking "did the previous label
-- also look qualified?". That inference was wrong in both directions:
--
--   * "Not Qualified" contains the substring "qualified", so a rejected lead
--     both fired a conversion AND marked itself as already-converted;
--   * which then meant a lead rescued from "Not Qualified" to SQL fired
--     nothing at all, because it looked like it had already converted.
--
-- These four columns replace the inference with a record. NULL means "not yet
-- uploaded"; a timestamp means "uploaded, do not send again". Nothing about
-- the lead's current label can change what is already in here.
--
--   request.metaLeadSentAt        Meta CAPI "Lead"          (form submitted)
--   request.metaQualifiedSentAt   Meta CAPI "QualifiedLead" (team qualified it)
--   request.metaPurchaseSentAt    Meta CAPI "Purchase"      (deposit collected)
--   request.googleQualifiedSentAt Google Ads click conversion
--
-- All four are ADD COLUMN IF NOT EXISTS and nullable with no default, so this
-- is safe to apply twice and safe to apply ahead of the deploy: every existing
-- lead reads as "never uploaded", which is the correct starting point.
--
-- Apply with scripts/apply-conversion-columns.mjs rather than
-- scripts/migrate.mjs — the drizzle migrator is unusable while migration 0001
-- is listed in drizzle/meta/_journal.json without its .sql file.
ALTER TABLE "request" ADD COLUMN IF NOT EXISTS "metaLeadSentAt" timestamp;--> statement-breakpoint
ALTER TABLE "request" ADD COLUMN IF NOT EXISTS "metaQualifiedSentAt" timestamp;--> statement-breakpoint
ALTER TABLE "request" ADD COLUMN IF NOT EXISTS "metaPurchaseSentAt" timestamp;--> statement-breakpoint
ALTER TABLE "request" ADD COLUMN IF NOT EXISTS "googleQualifiedSentAt" timestamp;
