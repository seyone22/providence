# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Start development server (port 3000)
npm run build      # Production build
npm run lint       # Biome linter check
npm run format     # Biome auto-format (writes changes)
npx tsc --noEmit  # Type-check without emitting

# Database (Drizzle + PostgreSQL)
npx drizzle-kit generate   # Generate a SQL migration from src/db/schema.ts into drizzle/
npx drizzle-kit migrate    # Apply pending migrations
npx drizzle-kit studio     # Open Drizzle Studio to browse data
```

`DATABASE_URL` (Railway-hosted Postgres) must be set for the app, migrations, and the build.

## Environment Variables

Copy `.env.example` to `.env.local` for local dev, and set the same keys on **each Railway service** (dev / staging / production) via the Railway dashboard → service → Variables (or `railway variables --set KEY=value`). A key that is present locally but missing on a Railway service is the usual cause of "works on my machine, broken on the live site".

Required:
- `DATABASE_URL` (+ `DATABASE_URL_STAGING`, `DATABASE_URL_PRODUCTION`) — Postgres connection strings.
- `BETTER_AUTH_SECRET`, `NEXT_PUBLIC_BASE_URL` — auth.
- `GEMINI_API_KEY` — **Sourcing & Profit Analyzer** (admin): Gemini auction-sheet extraction + buy/avoid verdict. Missing → the tool reports "GEMINI_API_KEY is not configured".
- `APIFY_TOKEN` — **Sourcing & Profit Analyzer** (admin): AutoTrader + PistonHeads market data. Missing → "APIFY_TOKEN is not configured".

Optional: `GEMINI_TOKEN_BUDGET` (the AI token allowance the sourcing tool's usage meter measures against — Google exposes no usage API for a key, so the total must be declared; unset just hides the bar. Apify's monthly spend and cap are read live from `/v2/users/me/limits`, so they need no equivalent), `RESEND_API_KEY` (email), `R2_*` (file storage), social-provider client IDs/secrets, and the Meta/Google ad-conversion keys. See `.env.example` for the full list.

## Architecture Overview

**Providence Auto** is a B2B/B2C automotive import sourcing platform built on Next.js App Router with React Server Components.

### Tech Stack

- **Framework:** Next.js 16 (App Router, RSC, Server Actions)
- **Database:** PostgreSQL (Railway hosted) via Drizzle ORM. Schema at `src/db/schema.ts`, connection/`db` export at `src/db/index.ts`, migrations in `drizzle/`, config in `drizzle.config.ts`. (Migrated from MongoDB/Mongoose in PR #61.)
- **Auth:** Better-Auth with the Drizzle adapter (`@better-auth/drizzle-adapter`, `provider: "pg"`) — server config at `src/utils/auth.ts`, client at `src/lib/auth-client.ts`, API at `/api/v1/auth/[...all]`. Better-Auth's singular table names are mapped explicitly to the plural Drizzle schema exports (`user`→`users`, etc.).
- **Styling:** Tailwind CSS v4 + shadcn/ui (new-york style, slate base)
- **Linting/Formatting:** Biome (replaces ESLint + Prettier)
- **Email:** Resend with React Email templates in `src/emails/`
- **File Storage:** AWS S3 (uploads) + Cloudflare R2 (static assets/logos)
- **PDF Generation:** `@react-pdf/renderer` via server actions

### Path Aliases

`@/*` maps to `./src/*`. All imports use this alias.

### Data Layer

Drizzle tables are defined in `src/db/schema.ts`. Import the `db` client and tables from `@/db` and query with drizzle-orm operators (`eq`, `and`, `desc`, `inArray`, …). Application tables:
- **requests** — Car purchase requests from customers (lead tracking, assignment, shipping, docs, payments, UTM/click attribution). `isUpcomingVehicle` flags a pre-order lead; `exteriorColor`/`interiorColor` hold the customer's colour choice as a display label.
- **specDossiers** — Vehicle inventory with multi-country `pricing` matrix and media (JSONB/array columns). Also carries the `exteriorColors`/`interiorColors` palettes and the upcoming-car fields (`isUpcoming`, `expectedAvailability`, `newsSlug`).
- **socialPosts** — Instagram embed posts per page (home/b2c/b2b), ordered via a `page_order_idx`
- **salesProfiles** — Per-agent public sales landing-page profiles
- **sourcingAnalyses** — Saved landed-cost / market analyses from the sourcing tool

Plus the Better-Auth tables (`users`, `sessions`, `accounts`, `verifications`). JSON-shaped fields (`pricing`, `statusHistory`, `documents`, testimonials, etc.) use `jsonb`; list fields use Postgres text arrays.

**Legacy:** `src/lib/mongoose.ts` is now a thin compatibility shim whose `connectToDatabase()` just returns the Drizzle `db` (old call sites still work but no MongoDB connection happens). The Mongoose schemas in `src/models/` are retained only for the one-off `scripts/migrate-mongo-to-pg.js` data migration — do **not** use them for new code.

### Migration scripts

- `scripts/migrate-mongo-to-pg.js` — one-off backfill copying documents from the old MongoDB into Postgres.
- `scripts/migrate.mjs` — runs the generated `drizzle/` SQL migrations against `DATABASE_URL` (SSL configured for the Railway pool).
- `scripts/create-car-page.mjs` — upserts a spec dossier (a public car page) from a JSON brief, uploading any local images to R2. Supports `--dry-run` and `--publish`; upserts by slug so re-running an edited brief updates the same page. Driven by the `car-landing-page` skill (`/car-landing-page`).

### Sourcing & Profit Analyzer

The admin tool at `/admin/sourcing-calculator`: landed cost → live UK market comparables → margin and buy/avoid verdict.

**Before changing any rate, filter or formula, read `sourcing-analyzer-methodology.md` at the repo root.** It documents the whole pipeline — the CIF/duty/post-border maths, the reverse solver for the maximum auction bid, how listings are scraped, cleaned, deduped, matched and ranked, how the statistics are trimmed, and every standing assumption.

The rules that most often trip people up:

- **Numbers are computed, prose is generated.** Every figure comes from a pure function (`src/lib/uk-landed-cost.ts`, `src/lib/market-stats.ts`); Gemini only narrates finished numbers. Never let a model produce a price, rate or margin.
- **Duty defaults to 10% MFN**; the only 0% route is Japan-built with a CEPA statement of origin, which is why the statement-of-origin question appears for Japan alone.
- **Import VAT is excluded** from the analyzer's landed cost (the importer reclaims it), via `includeVat: false`. The VAT machinery stays in the engine for consumer-facing surfaces like `LandedCostBar`, which default to including it.
- **30% gross margin on landed cost** (`TARGET_MARGIN_PCT`) is the desk minimum, enforced in code after the model answers — a car below target can never come back as "source".

### Vehicles: colours and upcoming models

Car pages are **database rows, not files** — they can't be added by committing code. Create them in `/admin/specs` or via `scripts/create-car-page.mjs`.

- **Colours** — `exteriorColors` / `interiorColors` on a dossier are arrays of `{ name, hex, hex2?, isDualTone?, secondaryName? }`. Shared helpers live in `src/lib/vehicle-colors.ts` (`parseColors`, `colorLabel`, `swatchStyle`); use them rather than reading the jsonb directly. A dossier's palette becomes the colour picker on that car's inquiry form, and the customer's choice is written onto the lead as a display label ("Emotional Red / Black roof"). No palette → the form falls back to a free-text colour field.
- **Upcoming cars** — `isUpcoming` on a dossier is orthogonal to `status`: the car is still Active with a real public page, it just sells a pre-order. It adds a Coming Soon badge, reframes the inquiry section, lists the car in the upcoming rail on `/latest-news`, and flags every lead off the page with `isUpcomingVehicle` (shown as an *Upcoming Car* badge in the admin leads table).
- **Car ↔ news linking** is two-way and either side can author it: a dossier's `newsSlug`, or an article's `linkedVehicleSlugs` in `src/config/news.ts`. `getCarsForNewsArticle` unions both and only returns Active dossiers, so unresolved slugs are skipped rather than breaking the article.

### CI/CD

`.github/workflows/ci.yml` enforces a `dev → staging → production` branch pipeline on PRs and runs lint (non-blocking), `tsc --noEmit`, and a dry `next build` (with mock env vars) as required checks.

### Editorial: blog vs news

Two separate content systems, deliberately not merged:

- **`/blog`** — evergreen how-to guides in keyword clusters. Registry `src/config/blog.ts`, bodies `src/content/blog/`, schema `BlogPosting`. Gets updated, does not age.
- **`/latest-news`** — dated automotive reporting: new-model releases, industry moves, auction results, market data, and the tax/policy changes that move landed cost. Registry `src/config/news.ts`, bodies `src/content/news/`, schema `NewsArticle`. Ages, and is fed to Google News.

Adding a news article touches **three** files — `src/config/news.ts`, `src/content/news/<slug>.tsx`, and the `NEWS_BODIES` map in `src/content/news/index.ts`. Missing the third 404s the page.

News-only prose components (`PullQuote`, `Timeline`, `ProfileCard`, `ConfirmedLedger`) live in `src/components/news/newsProse.tsx`; the shared kit stays in `src/components/blog/prose.tsx`.

Feeds and discovery, all automatic: `/news-sitemap.xml` (Google News, 48-hour window), `/latest-news/rss.xml`, and `/latest-news/category/[category]` archives generated from `NEWS_CATEGORIES` (categories with no articles 404 by design).

**Before writing any news article, read `news-editorial-playbook.md` at the repo root.** It defines the target market (all RHD destinations, plus LHD for luxury only), the two reader segments, the relevance gate, the seven landed-cost lenses, the "Landed Desk" voice, the SEO/AEO spec and the mandatory fact-checking protocol. The repeatable weekly run — 20 publish-ready stories — is the `news-desk` skill (`/news-desk`).

Three standing editorial rules: **never invent a tax, duty or registration-tax figure** — cite the revenue authority, date the check and add `<Disclaimer />`; **never forecast a currency** — name the pair, date the level, and say which side of the trade it lands on (a weak *source* currency makes the car cheaper; a weak *destination* currency makes everything dearer); and **a missing number is not a failure, a wrong number is.**

### Route Structure

```
/                          Public marketing home
/(static)/b2b|b2c|saas    Marketing landing pages
/(static)/b2c/gallery      Vehicle gallery + [id] detail
/campaigns/[slug]          Dynamic campaign pages
/auth/*                    Sign-in, sign-up, password reset
/request                   Customer car request form
/track/[id]                Request tracking by ID
/dealer-dashboard          Dealer interface
/ireland-cost-calculator   Landed cost calculator tool
/blog, /blog/[slug]        Evergreen import guides
/latest-news               Automotive news index
/latest-news/[slug]        News article
/latest-news/category/*    News category archives
/latest-news/rss.xml       RSS feed
/news-sitemap.xml          Google News sitemap
/source-cars-from/*        Source-country network pages
/admin/*                   Protected admin dashboard
/api/v1/*                  REST API routes
```

### Server Actions

All mutations go through server actions in `src/actions/`, not API routes. Key actions:
- `submitCarRequest` — creates Request, assigns agent round-robin, sends email alerts
- `admin-actions.ts` — user/request management for admin
- `pdf-actions.tsx` — PDF generation for dossiers
- `spec-actions.ts` — SpecDossier CRUD
- `tracking-actions.ts` — shipping status updates

### Auth & Roles

Better-Auth custom fields on users: `role` (user/Sales/admin), `isBanned`, `badges`, `whatsappNumber`. Social providers: Google, Facebook, Discord. No `middleware.ts` — route protection is handled at the component/action level.

### shadcn Components

Run `npx shadcn@latest add <component>` to add UI components. They land in `src/app/components/ui/` (per `components.json` alias config). Import from `@/app/components/ui/<component>`.

### Server Actions Body Size

`next.config.ts` raises the server action body limit to 32 MB to support large image/PDF uploads.
