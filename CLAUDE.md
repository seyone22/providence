# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

**Before writing or editing any customer-facing copy** — marketing pages, campaign pages, car pages, blog posts, news articles, sales-profile content, or any claim about what Providence Auto does, where it operates, or what it delivers — read these three at the repo root first:

- `business-context.md` — the central source of truth for the business itself (identity, the presence/source/destination geography split, the customs-clearance and CNF-delivery boundaries, values, offers). It also indexes every other standing doc.
- `brand-position.md` — the position: Providence gives you **direct access** to the world's auctions plus the tools, documentation and people to use it. **You buy the car; we make it possible.** Not a concierge, not "we handle everything".
- `writing-angle.md` — how to phrase it: the customer is the subject of the sentence. Bans "so you don't have to", "we handle everything", "hassle-free", blanket "door-to-door".

These are about *what the site should say*; this file is about *how the site is built*.

**Read all three every time — not "when in doubt".** The August 2026 repositioning had to be done twice because the first pass swept seven files and left the retired vocabulary standing on `/b2c`, `/b2b`, `/request` and the gallery.

**Never change a source-of-truth document on your own authority.** That means these three plus `news-editorial-playbook.md`, `sourcing-analyzer-methodology.md`, `seo-aeo-optimization-guide.md` and `sales-profile-spec.md`. When work shows one of them is wrong, incomplete or self-contradictory, raise it as a numbered question with a recommendation, log it in `brand-position.md` §11.3, and **keep re-raising it until answered** — a pending documented-truth change is carried into the next session, never quietly closed. This is narrow: ordinary suggestions about the site are raised once and dropped if not taken up. Full rule: `brand-position.md` §11.2.

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
- `scripts/create-car-page.mjs` — upserts a spec dossier (a public car page) from a JSON brief, uploading any local images to R2. Supports `--dry-run` and `--publish`; upserts by slug so re-running an edited brief updates the same page. Driven by the `car-landing-page` skill (`/car-landing-page`). Briefs for pages that are meant to exist in every environment are kept in `scripts/briefs/` so the same page can be recreated on staging and production.
- `scripts/optimize-car-images.mjs` — re-encodes a folder of car photographs to WebP at a display width. Car images under `public/` are served as plain `<img>` tags, so nothing resizes them at request time; run this before committing manufacturer JPEGs.
- `scripts/apply-grade-columns.mjs` — adds the grade/steering columns (`drizzle/0004_grade_columns.sql`) to one environment. Read-only until `--apply`.

### Sourcing & Profit Analyzer

The admin tool at `/admin/sourcing-calculator`: landed cost → live UK market comparables → margin and buy/avoid verdict.

**Before changing any rate, filter or formula, read `sourcing-analyzer-methodology.md` at the repo root.** It documents the whole pipeline — the CIF/duty/post-border maths, the reverse solver for the maximum auction bid, how listings are scraped, cleaned, deduped, matched and ranked, how the statistics are trimmed, and every standing assumption.

The rules that most often trip people up:

- **Numbers are computed, prose is generated.** Every figure comes from a pure function (`src/lib/uk-landed-cost.ts`, `src/lib/market-stats.ts`); Gemini only narrates finished numbers. Never let a model produce a price, rate or margin.
- **Duty defaults to 10% MFN**; the only 0% route is Japan-built with a CEPA statement of origin, which is why the statement-of-origin question appears for Japan alone.
- **Import VAT is excluded** from the analyzer's landed cost (the importer reclaims it), via `includeVat: false`. The VAT machinery stays in the engine for consumer-facing surfaces like `LandedCostBar`, which default to including it.
- **30% ROI on landed cost** (`TARGET_MARGIN_PCT`) is the desk minimum and the default, editable per run from the *Minimum ROI* field. Whatever it is set to is enforced in code after the model answers — a car below target can never come back as "source".
- **Resale is compared net of VAT.** Scraped listings are VAT-inclusive; the landed cost is not. The market median is divided by 1.2 (`resaleExVat`) before any profit, ROI or ceiling-bid figure is derived. Never subtract a landed cost from a raw median.

### Vehicles: grades, steering, colours and upcoming models

Car pages are **database rows, not files** — they can't be added by committing code. Create them in `/admin/specs` or via `scripts/create-car-page.mjs`.

- **Colours** — `exteriorColors` / `interiorColors` on a dossier are arrays of `{ name, hex, hex2?, isDualTone?, secondaryName? }`. Shared helpers live in `src/lib/vehicle-colors.ts` (`parseColors`, `colorLabel`, `swatchStyle`); use them rather than reading the jsonb directly. A dossier's palette becomes the colour picker on that car's inquiry form, and the customer's choice is written onto the lead as a display label ("Emotional Red / Black roof"). No palette → the form falls back to a free-text colour field.
- **Upcoming cars** — `isUpcoming` on a dossier is orthogonal to `status`: the car is still Active with a real public page, it just sells a pre-order. It adds a Coming Soon badge, reframes the inquiry section, lists the car in the upcoming rail on `/latest-news`, and flags every lead off the page with `isUpcomingVehicle` (shown as an *Upcoming Car* badge in the admin leads table).
- **Grades** — `grades` on a dossier is the model's ladder (Ti, Ti+, Ti-L, Ti-L Reserve) rather than four near-duplicate pages competing for one keyword. **A grade stores only what it changes**: every spec field is optional and blank means "inherit from the dossier", so authoring a ladder is four short lists of differences. Helpers live in `src/lib/vehicle-grades.ts` (`parseGrades`, `gradeSpec`, `gradeFeatures`, `gradePricing`, `cleanGradesForSave`) — use them rather than reading the jsonb. Selecting a grade on the car page re-resolves the spec table, feature list, pricing and gallery photo, prefills the inquiry form's Grade field, and writes the grade onto the lead beside the make and model. The admin editor is `src/components/GradeEditor.tsx`.
- **Steering** — `steeringOptions` on a dossier lists every hand the model can be sourced in; the legacy single `steering` column stays as the primary and as the fallback for every dossier written before the list existed. Always read it through `parseSteeringOptions` (`src/lib/vehicle.ts`), which never returns an empty list. Offering both puts a Steering selector on the car page and an RHD/LHD field on the inquiry form, and the choice lands on the lead — where it now drives the admin table's LHD badge and the dashboard's LHD filter in preference to inferring the hand from the landing page the lead arrived through.
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

### Heading language: one heading says the whole thing

Section headings carry their own label. Do **not** stack a small eyebrow label
above a heading that then restates the same idea — fold the label into the
heading so one sentence does both jobs.

| Don't | Do |
| --- | --- |
| `Who we are` + `Not a marketplace. Not a broker network.` | `We are not a marketplace, and not a broker network.` |
| `The problem` + `Buying a car still means settling.` | `The problem is, buying a car still means settling.` |
| `How it works` + `Request it. We source it. It ships.` | `Here's how it works — you request it, we source it, it ships.` |
| `Our network` + `Eight offices. Forty-plus markets.` | `Our network is eight offices and forty-plus markets.` |

The rules:

- **One heading per section.** The label ("the problem", "our network", "the
  difference", "who we serve") becomes the subject of the sentence rather than a
  separate line above it.
- **Write it as a natural sentence**, not `Label: the thing`. A colon that just
  re-splits the two halves is the same mistake with different punctuation.
- **Keep it short enough to set at `text-5xl`** — one line of thought, usually
  under twelve words.
- **Replace the eyebrow's visual job with a rule, not with more text.**
  `/about-us` uses a 48 px sky→violet hairline (`SectionRule` in that page) above
  each H2 to keep the visual step down from one section to the next.
- **The one exception is an AEO direct-answer block**, where the eyebrow is the
  *question* a reader or an LLM would ask ("What is Providence Auto?") and the
  body is the 40–50 word answer. That question/answer pair is the whole point of
  the pattern — leave it alone.

This governs every marketing page, campaign page, car page, blog post and news
article written from now on, not just the page where it was introduced.

### Secondary CTAs: one style, and always below the primary

A page has **one primary CTA** — the thing it exists to drive. On editorial
and campaign pages that is the black block (`BlogCTA` and its per-page
equivalents) or the inquiry form. Everything else that asks the reader to act
— the Google preferred-source opt-in, RSS, a newsletter, "browse the guides"
— is a **secondary CTA**, and there is exactly one treatment for it.

**Use `<SecondaryCTA>`** (`src/components/SecondaryCTA.tsx`), which applies the
`.pa-cta-secondary` surface defined in `globals.css`: a sky→violet accent bar,
a tinted wash and a coloured lift shadow. Do not hand-roll another bordered
`bg-zinc-50` panel — that is what the surrounding prose cards already look
like, so a secondary CTA built that way reads as body content and is skipped.
That is the exact failure this style was introduced to fix.

The rules:

- **Never place a secondary CTA above the primary one.** Nothing competes with
  the main CTA. In practice that means after `<BlogCTA />`, after the inquiry
  section, at the foot of the page — not between the article and the CTA, and
  not immediately above a form.
- **One secondary CTA per page.** Two of them is a menu, and a menu converts
  worse than either option alone.
- **It stays light.** The primary CTA owns black. A secondary CTA that also
  went dark would compete with it, which defeats the point.
- **The heading rule above still applies** — `title` is one full sentence, no
  eyebrow label above it, and `body` (optional) carries a real fact rather
  than restating the heading.

### SEO & AEO: standing requirement for every new page

**Before creating or publishing any new page** — marketing/campaign page, car page (spec dossier), blog post, or news article — read `seo-aeo-optimization-guide.md` at the repo root. It is the canonical SEO/AEO playbook: user-intent identification, keyword/entity research, on-page copywriting (title tags, meta descriptions, header hierarchy), the technical SEO checklist, JSON-LD structured-data selection, and AEO/LLM optimization (featured-snippet answers, tables/lists, E-E-A-T). Run every new page through its Phase 1–5 process and the final pre-publishing checklist before treating the page as done.

Every new page ships with all of the following by default — a page missing any of these is incomplete, not "SEO to follow up later":

- **Title tag** — under 60 characters, primary keyword near the front, unique per page. Set via `export const metadata: Metadata`, following the existing pattern in `src/app/(marketing)/*/page.tsx`.
- **Meta description** — under 155 characters, includes a call to action.
- **Open Graph + Twitter Card, with a visible preview image** — `openGraph.images` must include explicit `width`/`height` (1200×630) on a real, reachable image URL. A missing/404 image or one without declared dimensions will fail to render in link previews on Slack/LinkedIn/X/iMessage. Verify with `curl -o /dev/null -w "%{http_code} %{content_type}"` on the exact image URL before shipping.
- **Canonical URL** — `alternates: { canonical: PATH }`.
- **Structured data (JSON-LD)** — match the schema to the page's core entity per the guide's Phase 4 (Product/Service, Article/NewsArticle, FAQPage, LocalBusiness, ItemList, etc.) — see existing examples in `src/app/(marketing)/indian-manufactured-cars/page.tsx` and `src/content/news/`.
- **One H1, hierarchical H2/H3s**, BLUF-style copy (answer the primary question in the first ~100 words), and at least one direct 40–50 word answer to a likely AI/voice query, for AEO.
- **`robots` metadata set explicitly** (`index: true, follow: true`) unless the page is intentionally noindexed.

This is additive to, not a replacement for, the per-content-type rules above — `sourcing-analyzer-methodology.md` still governs the sourcing tool's numbers, and `news-editorial-playbook.md` still governs news articles' voice and fact-checking.

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
