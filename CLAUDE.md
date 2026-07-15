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
- **requests** — Car purchase requests from customers (lead tracking, assignment, shipping, docs, payments, UTM/click attribution)
- **specDossiers** — Vehicle inventory with multi-country `pricing` matrix and media (JSONB/array columns)
- **socialPosts** — Instagram embed posts per page (home/b2c/b2b), ordered via a `page_order_idx`
- **salesProfiles** — Per-agent public sales landing-page profiles
- **sourcingAnalyses** — Saved landed-cost / market analyses from the sourcing tool

Plus the Better-Auth tables (`users`, `sessions`, `accounts`, `verifications`). JSON-shaped fields (`pricing`, `statusHistory`, `documents`, testimonials, etc.) use `jsonb`; list fields use Postgres text arrays.

**Legacy:** `src/lib/mongoose.ts` is now a thin compatibility shim whose `connectToDatabase()` just returns the Drizzle `db` (old call sites still work but no MongoDB connection happens). The Mongoose schemas in `src/models/` are retained only for the one-off `scripts/migrate-mongo-to-pg.js` data migration — do **not** use them for new code.

### Migration scripts

- `scripts/migrate-mongo-to-pg.js` — one-off backfill copying documents from the old MongoDB into Postgres.
- `scripts/migrate.mjs` — runs the generated `drizzle/` SQL migrations against `DATABASE_URL` (SSL configured for the Railway pool).

### CI/CD

`.github/workflows/ci.yml` enforces a `dev → staging → production` branch pipeline on PRs and runs lint (non-blocking), `tsc --noEmit`, and a dry `next build` (with mock env vars) as required checks.

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
