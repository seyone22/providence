# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start Next.js dev server (port 3000)
npm run build     # Production build
npm run start     # Run production server
npm run lint      # Biome check (linting)
npm run format    # Biome format --write
```

No test framework is configured.

## Tech Stack

- **Next.js 16 (App Router)** with React 19 and TypeScript (strict mode)
- **Tailwind CSS 4** — uses the new `@theme` syntax with OkLCh color space; no `tailwind.config`
- **Biome 2** — handles both linting and formatting (replaces ESLint + Prettier)
- **Better-auth** — authentication with MongoDB adapter, social OAuth, and custom email hooks
- **Mongoose** — MongoDB ODM with a global connection pool in `src/lib/mongoose.ts`
- **Resend** — transactional email via React email templates in `src/emails/`
- **shadcn/ui** — New York style, RSC-enabled; primitives live in `src/app/components/ui/`
- **Framer Motion** — animations throughout; uses Apple-style easing `[0.16, 1, 0.3, 1]`

## Architecture

### Route Structure

```
src/app/
├── (static)/         # Marketing pages: /b2b, /b2c, /saas, /signup
├── api/v1/auth/      # Better-auth catch-all handler
├── auth/             # Auth UI: sign-in, sign-up, forgot/reset-password
├── admin/            # Protected admin dashboard (session-gated, server component)
├── dealer-dashboard/ # B2B dealer portal
├── request/          # Multi-step vehicle request form (4-step client component)
└── track/[id]/       # Public request tracking by ID
```

### Data Flow

1. **Request form** (`src/app/request/`) — 4-step client-side form using `react-hook-form` + Zod, submits via the `submitCarRequest()` server action.
2. **Server actions** (`src/actions/`) — thin layer that writes to MongoDB and triggers Resend emails. `request-actions.ts` handles submissions; `admin-actions.ts` handles dashboard queries.
3. **Request model** (`src/models/Request.ts`) — single Mongoose schema that tracks the full lifecycle: inquiry → sourcing → shipping → customs. Key pipeline fields: `status`, `options`, `agreedPrice`, `depositAmount`, `trackingNumber`, `vesselName`, `eta`.
4. **Admin dashboard** (`src/app/admin/`) — server component that checks session first (redirects to `/auth/sign-in` if unauthenticated), renders stats + a client-side `RequestTable` that supports staff assignment and status updates.

### Auth

- Config lives in `src/utils/auth.ts` (server-side) and `src/lib/auth-client.ts` (client-side).
- Social providers: Google, Facebook, Discord.
- User roles: `attendee` (default) and staff/admin roles. Ban system via `isBanned`.
- Email hooks use `src/lib/email.ts`, which mocks (logs) if `RESEND_API_KEY` is absent.

### Email

Templates are React components in `src/emails/`. Three categories sent by `src/lib/email.ts`:
- `auth` — verification and password reset
- `customer-confirmation` — sent to buyer on request submission
- `staff-alert` — notifies internal team of new requests

## Environment Variables

No `.env.example` exists. These variables are required:

| Variable | Purpose |
|---|---|
| `MONGODB_URI` | MongoDB connection string |
| `RESEND_API_KEY` | Resend email API key |
| `NEXT_PUBLIC_BASE_URL` | Public base URL (used by auth client) |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Google OAuth |
| `FACEBOOK_CLIENT_ID` / `FACEBOOK_CLIENT_SECRET` | Facebook OAuth |
| `DISCORD_CLIENT_ID` / `DISCORD_CLIENT_SECRET` | Discord OAuth |

## Key Conventions

- Path alias `@/*` maps to `src/*`.
- Server components are the default; add `"use client"` only when browser APIs or interactivity is needed.
- Global layout (`src/app/layout.tsx`) injects Google Tag Manager (GTM-K7GCCZXQ) and sets all SEO metadata.
- The `from` address in `src/lib/email.ts` (`hello@your-domain.com`) still needs updating to the real domain.
