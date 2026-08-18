-- NOTE: the `dealerprofile` statements below are drift recovery, not part of
-- this change. Migration 0001 ("0001_nice_photon") is listed in
-- drizzle/meta/_journal.json but its .sql and snapshot were never committed, so
-- drizzle-kit diffed against the 0000 snapshot and re-emitted the table. Every
-- environment already has `dealerprofile`, hence the IF NOT EXISTS guards —
-- without them this migration would fail on a live database.
CREATE TABLE IF NOT EXISTS "dealerprofile" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"dealerId" text NOT NULL,
	"companyName" text NOT NULL,
	"website" text,
	"commissionRate" double precision DEFAULT 10 NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "dealerprofile_userId_unique" UNIQUE("userId"),
	CONSTRAINT "dealerprofile_dealerId_unique" UNIQUE("dealerId")
);
--> statement-breakpoint
ALTER TABLE "request" ADD COLUMN IF NOT EXISTS "isUpcomingVehicle" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "request" ADD COLUMN IF NOT EXISTS "exteriorColor" text;--> statement-breakpoint
ALTER TABLE "request" ADD COLUMN IF NOT EXISTS "interiorColor" text;--> statement-breakpoint
ALTER TABLE "specdossier" ADD COLUMN IF NOT EXISTS "exteriorColors" jsonb DEFAULT '[]'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "specdossier" ADD COLUMN IF NOT EXISTS "interiorColors" jsonb DEFAULT '[]'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "specdossier" ADD COLUMN IF NOT EXISTS "isUpcoming" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "specdossier" ADD COLUMN IF NOT EXISTS "expectedAvailability" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "specdossier" ADD COLUMN IF NOT EXISTS "newsSlug" text DEFAULT '' NOT NULL;--> statement-breakpoint
DO $$ BEGIN
	ALTER TABLE "dealerprofile" ADD CONSTRAINT "dealerprofile_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
	WHEN duplicate_object THEN NULL;
END $$;
