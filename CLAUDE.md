# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Start development server (port 3000)
npm run build      # Production build
npm run lint       # Biome linter check
npm run format     # Biome auto-format (writes changes)
npx tsc --noEmit  # Type-check without emitting
```

## Architecture Overview

**Providence Auto** is a B2B/B2C automotive import sourcing platform built on Next.js App Router with React Server Components.

### Tech Stack

- **Framework:** Next.js 16 (App Router, RSC, Server Actions)
- **Database:** MongoDB via Mongoose (Atlas hosted)
- **Auth:** Better-Auth with MongoDB adapter — server config at `src/utils/auth.ts`, client at `src/lib/auth-client.ts`, API at `/api/v1/auth/[...all]`
- **Styling:** Tailwind CSS v4 + shadcn/ui (new-york style, slate base)
- **Linting/Formatting:** Biome (replaces ESLint + Prettier)
- **Email:** Resend with React Email templates in `src/emails/`
- **File Storage:** AWS S3 (uploads) + Cloudflare R2 (static assets/logos)
- **PDF Generation:** `@react-pdf/renderer` via server actions

### Path Aliases

`@/*` maps to `./src/*`. All imports use this alias.

### Data Layer

Three Mongoose models in `src/models/`:
- **Request** — Car purchase requests from customers (lead tracking, assignment, shipping, docs)
- **SpecDossier** — Vehicle inventory with multi-country pricing matrices and media
- **SocialPost** — Instagram embed posts per page (home/b2c/b2b), with ordering

MongoDB connection is cached globally in `src/lib/mongoose.ts` — always call this before any DB operation in server components/actions.

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
