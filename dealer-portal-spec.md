# Dealer Portal — Onboarding Design & Logical Framework

> Status: **design specification, not yet implemented.** Nothing in this document
> is built. It defines the framework the implementation follows.
>
> Companion reading: `business-context.md` (what the business does),
> `brand-position.md` (what we claim), `writing-angle.md` (how copy is phrased),
> `sales-profile-spec.md` (the closest existing precedent — `/team/[slug]` is the
> template a dealer landing page reuses), `CLAUDE.md` (how the codebase is built).

---

## 1. What this covers

Five capabilities were requested. They are one product, and the order below is
the order they have to be built in, because each depends on the one above it.

| # | Capability | Depends on |
|---|---|---|
| 1 | Apply for a dealer account, wait for internal approval, then sign in | The account model and the approval state machine |
| 2 | A dealer-scoped lead management system, and the dealer's ability to create their own sales users | 1, plus tenant isolation |
| 3 | A dealer landing page on the Providence site at a claimed handle, whose inquiries land in that dealer's lead system | 1, 2 |
| 4 | An inquiry-form snippet for the dealer's own website, styled to their brand | 1, 2 |
| 5 | Providence stock and the dealer's own listings, shown on the landing page and below the embedded form | 2, 3, 4 |

**None of them can ship before §2.** That is not a hardening pass to schedule
afterwards; it is the first phase of this project.

### 1.1 What already exists

The dealer feature is roughly one commit of scaffolding from July 2026 that was
never returned to. It works, in the narrow sense that a dealer can register on
dev and production today and see a dashboard.

- `dealerProfiles` table — `userId` (unique), `dealerId` (`DL-#####`),
  `companyName`, `website`, `commissionRate` (default 10%). `src/db/schema.ts:289`
- `createDealerProfile` and `getDealerDashboardData`. `src/actions/dealer-actions.ts`
- Self-serve signup at `/signup`, no approval step. `src/app/(static)/signup/page.tsx`
- A dark-glass dashboard at `/dealer-dashboard` with four KPI cards, the embed
  snippet, and a leads table. `src/app/(marketing)/dealer-dashboard/page.tsx`
- `public/embed.js` — an iframe injector reading `data-dealer-id`.
- Marketing at `/b2b` and `/saas`, both linking to `/signup`.

Live state as of 2026-09-07: the `dealerprofile` table exists on dev (2 accounts)
and production (0 accounts). **It is missing on staging**, where signup will
create the user, fail to create the profile, and strand the account in a loop.

### 1.2 What this framework changes

The existing scaffolding assumes **one login per dealership and a dealer id that
is both the public embed token and the private tenant key**. Both assumptions
have to go before anything else is built on top:

- `dealerProfiles.userId` is `.unique()`, so a dealership can have exactly one
  user. Requirement 2 asks for dealer-created sales accounts. That is a schema
  change, not a feature.
- `dealerId` is printed into every dealer's public embed snippet *and* used as
  the tenant key for their leads. A public identifier cannot also be a private
  key. Requirement 4 makes this worse by putting the snippet on more sites.

---

## 2. Phase 0 — the security gate

**This is the first phase of the project and it is not optional.** Every finding
below was read directly out of the codebase on 2026-09-07. Today the blast radius
is small because dealer signup is effectively unused (0 rows on production). The
moment external dealers are invited in, each one becomes a live multi-tenant
breach.

A dealer portal is a promise to a business partner that their customer data is
theirs. None of the code below can keep that promise.

### 2.1 Anyone who registers becomes an administrator

`/auth/sign-up` is public and redirects new accounts to `/admin`. The entire
admin console is gated by one line that checks only that a session exists:

```
const session = await auth.api.getSession({ headers: await headers() });
if (!session) redirect("/auth/sign-in");
```
`src/app/admin/layout.tsx:16-17`

`requireAuth()` in `src/actions/admin-actions.ts:110-120` does the same — session
presence, no role. Consequences, each verified:

- `getRequests` (`admin-actions.ts:126`) returns **every lead in the business** —
  names, emails, phone numbers, budgets, notes, payment terms — with CSV export
  available in the UI.
- `getUsers` (`admin-actions.ts:447`) returns every user's name, email, role and
  ban status.
- `updateAdminUser` (`admin-actions.ts:550`) writes an arbitrary role to an
  arbitrary user id. A caller can set their own role to `Admin`.
- `deleteRequest` (`admin-actions.ts:208`) permanently deletes any lead. No role
  gate, no soft delete, no audit entry.

**Fix:** a shared `requireRole()` helper, a role check in the admin layout, and a
role check in every privileged action. The normalisation helper already exists
and is unit-tested — `normalizeRole` / `isAdminRole` / `canOwnProfile` at
`src/actions/sales-profile-actions.ts:59-71`. Promote it to a shared module
rather than writing a fourth one.

### 2.2 Role strings do not match across environments

Six spellings are in circulation: `user`, `User`, `Admin`, `Sales`, `Staff`,
`dealer`. Production stores capitalised values; Better-Auth's default and the
dealer signup path write lowercase. Only two files normalise case
(`sales-profile-actions.ts:59-71`, `request-actions.ts:47-48`).

**Any new literal role comparison written for the dealer portal will silently
miss on production.** Every role check must go through the shared normaliser, and
the `role` column should get an enum or check constraint — it currently has
none, and no index.

### 2.3 `createDealerProfile` is an unauthenticated role write

```
export async function createDealerProfile(data: {
  userId: string; companyName: string; website?: string;
})
```
`src/actions/dealer-actions.ts:39`

No session check. It takes a caller-supplied `userId`, inserts a dealer profile
against it, and executes `db.update(users).set({ role: "dealer" })` on that id
(`:72-76`). It is an exported `"use server"` action, so it is directly invocable.
An anonymous caller can mint dealer profiles against other people's accounts and
overwrite any user's role — including an administrator's.

**Fix:** the action must derive `userId` from the session, never from its
argument, and must not be the thing that grants a role. Under the new model
(§3) role assignment happens on approval, in an admin-gated action.

### 2.4 Tenant isolation is a forgeable string match

Dealer lead scoping is one string comparison:

```
.where(eq(requests.source, profile.dealerId))
```
`src/actions/dealer-actions.ts:124`

`requests.source` is written verbatim from client input at
`src/actions/request-actions.ts:302`, with no validation that the value
corresponds to a real dealer. `dealerId` is `DL-` plus `crypto.randomInt(10000, 99999)`
— 90,000 possible values — and is **published in every dealer's own embed
snippet**, which sits in the HTML of their public website.

So: anyone can attribute leads to any dealer by editing a query string, and
another dealer's id can be enumerated in 90,000 tries or simply read off their
website. Commission is computed directly off that string
(`dealer-actions.ts:142-155`).

**Fix:** §3.2 splits the public embed token from the private tenant key, and
§7.3 validates attribution server-side against a real dealer record.

### 2.5 Mass assignment on lead update

```
const { salesComment = "", ...cleanedPayload } = payload;
const updateData: any = { ...cleanedPayload, status: targetStage };
```
`src/actions/admin-actions.ts:245-250`

Any authenticated caller can write arbitrary columns on any lead — including
`source` (re-attributing a competitor's lead to themselves), `assignedToId`,
`agreedPrice`, and the conversion-ledger columns `metaQualifiedSentAt` /
`metaPurchaseSentAt`, which would permanently suppress or forge conversion
uploads.

**Fix:** an explicit allow-list of updatable columns, per role.

### 2.6 Unauthenticated server actions and API routes

No session check at all:

| Action | File | What it does |
|---|---|---|
| `getTrackingData` | `tracking-actions.ts:9` | Returns a full lead plus the assigned agent record, by id |
| `markLeadAsQualified` | `tracking-actions.ts:113` | Mutates `leadStatus`, fires an internal alert email |
| `markLeadAsOpened` | `tracking-actions.ts:161` | Mutates `leadStatus` |
| `generateDossierPdfAction` | `pdf-actions.tsx:349` | Renders any dossier, including Draft and Archived |
| `extractAuctionSheet`, `getVerdict` | `sourcing-actions.ts:294`, `:604` | Burns `GEMINI_API_KEY` quota on arbitrary input |
| `analyzeMarket` | `sourcing-actions.ts:391` | Burns paid Apify credits — a cheap denial-of-service against the sourcing desk, given the known monthly cap |
| `getRecentSourcingAnalyses` | `sourcing-actions.ts:825` | Leaks landed costs, market medians, margins and buy/avoid verdicts |
| `emailBreakdown` | `calculator-actions.tsx:406` | **Open mail relay** — validates the recipient with a regex, then sends a PDF attachment from the Providence domain to any address |
| All five non-auth API routes | `api/v1/social-posts/*`, `api/v1/leads/discard` | Unauthenticated content injection into public marketing pages; unauthenticated deletion of draft leads |

### 2.7 Authentication settings that undercut the approval model

- **Email verification is sent and then ignored.** `emailVerification.sendOnSignUp`
  is true (`src/utils/auth.ts:42`) but `requireEmailVerification` is absent from
  `emailAndPassword` (`:33-38`). An unverified address can sign in immediately.
  An approval workflow that emails a decision to an unverified address is
  emailing an unowned mailbox.
- **`role` may be settable from the sign-up request body.** None of the four
  `additionalFields` at `src/utils/auth.ts:86-94` sets `input: false`. Better-Auth's
  default is to accept declared additional fields from the client. *This one is
  inferred from the configuration rather than demonstrated by test* — it must be
  probed against a scratch account before the portal opens, and `input: false`
  set regardless.
- **Bans do not revoke live sessions.** The `isBanned` check runs only in
  `databaseHooks.session.create.before` (`:97-114`). With no `session` block
  configured, the default 7-day expiry applies, so a suspended dealer keeps
  working access for up to a week.
- **Trusted social linking auto-links by email** (`:50-56`). Any of Google,
  Facebook or Discord returning an attacker-controlled email for a dealer or
  admin address links straight into that account.
- **Cross-subdomain cookies are on** (`:82-84`). A dealer portal on any
  `*.providenceauto.co.uk` subdomain shares the session cookie namespace with
  `/admin`; an XSS anywhere on the domain reaches the admin session.
- **Invite passwords are `Math.random()`** (`admin-actions.ts:493`) — not
  cryptographically secure — and are emailed in plaintext with no expiry and no
  forced rotation.
- **staging is missing from `trustedOrigins`** (`:24-30`).

### 2.8 Phase 0 exit criteria

The portal does not open to an external dealer until all of these hold:

- [ ] A shared `requireRole()` / `requireDealerScope()` module exists, and every
      server action and route handler calls one of them.
- [ ] `/admin` is gated on staff roles, not session presence.
- [ ] Role comparison goes through the shared normaliser everywhere; the `role`
      column has a constraint.
- [ ] `createDealerProfile` derives identity from the session and no longer
      grants roles.
- [ ] Lead updates use a per-role column allow-list.
- [ ] Every action in §2.6 is gated or deliberately made public with a rate limit.
- [ ] `requireEmailVerification` is on; `input: false` is set on `role`,
      `isBanned` and `badges`.
- [ ] Suspension revokes live sessions.
- [ ] Cross-tenant denial is asserted by integration test, not by inspection.

---

## 3. The account and tenancy model

### 3.1 One dealership, many people

The current model gives a dealership exactly one login, because
`dealerProfiles.userId` is `.unique()` (`src/db/schema.ts:296`). Requirement 2
asks for dealer-created sales accounts, so the one-to-one becomes one-to-many and
the dealership itself becomes the tenant.

```
dealerAccount            the tenant — a dealership
  id                     internal uuid, never public
  publicId               "DL-xxxxx", display only, not a key
  companyName
  status                 draft | submitted | in_review | more_info | approved | rejected | suspended
  ...business details, see §4.2
  commissionRate         default 10.0
  approvedAt, approvedBy, decisionNote
  createdAt, updatedAt

dealerMember             a person inside a dealership
  id
  dealerAccountId    ->  dealerAccount.id
  userId             ->  user.id
  role                   owner | manager | agent
  status                 invited | active | disabled
  invitedBy, invitedAt, acceptedAt
  UNIQUE (dealerAccountId, userId)

dealerInvitation         a pending seat
  id, dealerAccountId, email, role
  tokenHash              never store the raw token
  expiresAt, acceptedAt, revokedAt
```

`users.role` keeps a single coarse value (`dealer`) that says *which console you
land in*. It must never carry the dealership identity — that lives on
`dealerMember`, which is the row every dealer-scoped query joins through.

**Roles inside a dealership**

| Role | Leads | Members | Landing page & embed | Billing/commission view |
|---|---|---|---|---|
| `owner` | all | invite, disable, change roles | edit, publish | yes |
| `manager` | all | invite agents | edit | yes |
| `agent` | own assigned only | no | no | no |

An `owner` is created by the approval action (§4.5), never by self-service.

### 3.2 Two identifiers, and why

The single biggest structural fix. Today `dealerId` is both the public embed
token and the private tenant key (§2.4). They separate into three values:

| Value | Visibility | Purpose | Rotatable |
|---|---|---|---|
| `dealerAccount.id` | never leaves the server | the tenant key every query filters on | no |
| `dealerAccount.publicId` (`DL-xxxxx`) | shown to the dealer and to staff | a human reference in conversation and invoices | no |
| `embedKey` | public, in the snippet on the dealer's site | identifies which dealer a widget submission belongs to | **yes** |

`embedKey` is a high-entropy random token, not a 5-digit number, and it is
scoped by an origin allow-list (§7.3). Because it is rotatable, a leaked or
abused key is a support action rather than an incident.

**Every dealer-scoped query resolves the tenant from the session**, via
`dealerMember`. A tenant id supplied by the client is never trusted for
authorisation — the pattern to copy is `submitCarRequest`, which already
re-validates a client-supplied `assignedAgentId` against the database and
silently falls back (`src/actions/request-actions.ts:153-170`).

### 3.3 Lead ownership becomes a relation

Dealer ownership of a lead is currently inferred from a string comparison against
the overloaded `requests.source` column. It becomes an explicit, indexed
relation:

```
requests.dealerAccountId   -> dealerAccount.id, nullable, INDEXED
requests.dealerMemberId    -> dealerMember.id, nullable   (which of the dealer's people owns it)
requests.origin            'providence' | 'dealer_widget' | 'dealer_page'
```

`requests.source` keeps doing exactly what it does today — recording the landing
page a lead arrived through — and stops being a tenant key. That also fixes the
existing display bug where a `DL-xxxxx` value renders in the admin leads table as
a landing-page label linking to the bare homepage
(`src/lib/leadSource.ts:29`, `src/components/RequestTableClient.tsx:87`).

`requests` currently has **no indexes at all**; the dealer dashboard's
`where source = …` is a sequential scan of the full lead table. The new column
ships with an index.

### 3.4 Migrations

`npx drizzle-kit migrate` is not usable here. Migration `0001_nice_photon` is
listed in `drizzle/meta/_journal.json` with no `.sql` file and no snapshot;
`0002_loving_sprite.sql` exists only as drift recovery for it, guarded with
`IF NOT EXISTS`; `0005`'s own header says to apply it with a bespoke script.

Every schema change in this project ships as **hand-written idempotent SQL,
applied per environment** — `dev`, `staging`, `production` — following
`drizzle/0005_conversion_ledger.sql` and `scripts/apply-grade-columns.mjs`.
Staging is currently missing `dealerprofile` entirely and must be reconciled
before anything else lands.

---

## 4. Requirement 1 — apply, wait for a decision, sign in

This section is grounded in how comparable products actually run approval-gated
onboarding. Sources are cited inline; where a claim could not be confirmed from
the operator's own documentation it is marked unverified and treated as
suggestive rather than as evidence.

### 4.1 Approval flips capabilities on an account that already exists

The mistake to avoid is treating approval as the moment the account is created.
Every operator studied does the opposite: the account exists from submission, and
approval switches on what it can do.

Stripe Connect is the clearest case. It splits access into two independent
capability flags — `charges_enabled` and `payouts_enabled` — rather than one
status, so an account can be live for some purposes and restricted for others
([Stripe: API onboarding](https://docs.stripe.com/connect/api-onboarding)).

Providence's equivalent is two flags on `dealerAccount`:

| Capability | On from | What it governs |
|---|---|---|
| `catalogueAccess` | submission | Browse stock, run landed-cost figures, save a watchlist, set the account up |
| `tradeAccess` | approval | Trade pricing, submitting a sourcing request at trade terms, the landing page, the embed snippet |

Approval sets `tradeAccess`. Nothing the applicant already entered is re-entered,
and the approval email lands them in a portal that already knows them.

This also means the pending state and a permanent browse-only tier are the same
code path, which is worth having regardless.

### 4.2 The application state machine

```
draft ──submit──> submitted ──pick up──> in_review ──┬──> approved ──> suspended
  ^                                                  │        ^            │
  │                                                  ├──> info_requested ──┘
  └────────────── expires after 14 days ─────────────┤        │
                                                     └──> rejected ──reapply──> draft
```

| State | Who acts | What the dealer sees |
|---|---|---|
| `draft` | dealer | A saved, editable application. Self-deletable. |
| `submitted` | system | Acknowledgement with a reference number and the published turnaround. |
| `in_review` | reviewer | "We're running checks. This usually takes one business day." |
| `info_requested` | dealer | **The only state that renders a form** — the exact field that is wrong, and why. |
| `approved` | reviewer | Trade access on, setup checklist continues. |
| `rejected` | reviewer | A reason category, and an *Apply again* action that carries the data forward. |
| `suspended` | reviewer | Scoped per capability — see below. |

Three rules the state names have to obey:

- **The published turnaround is written into the status text**, not into a
  tooltip. Google AdSense does this ("Requires review", with the wait in the
  copy); Mercury states "usually within 0–2 business days"; Faire states 24
  hours; Walmart says "a few minutes to a few business days".
- **Internal vocabulary never leaks.** Nielsen Norman Group's status-tracker
  guidelines name this exact failure — backend words like "fulfilled" or "label
  created" surfacing to the user ([NN/g: order status
  trackers](https://www.nngroup.com/articles/order-status-tracker/)). "KYB
  pending" and "queued for compliance" are internal states only.
- **Suspension is scoped, not binary.** ACV's terms reserve the right to
  "revoke or limit the scope of that approval at any time" and to suspend "all
  or a portion" of a customer's access
  ([ACV ToS](https://www.acvauctions.com/legal/terms-of-service)). A dealer
  whose VAT registration lapses should lose `tradeAccess` while keeping the
  ability to sign in and read their own order history.

### 4.3 What is asked, and when

Stripe names the two strategies and tells platforms to choose deliberately:
**up-front** collects everything at sign-up; **incremental** collects a minimum
and asks for more as the account transacts. Requirements are modelled per field —
`currently_due`, `eventually_due`, `past_due`, `pending_verification` — with
per-field human-readable errors, not as one application status
([Stripe: API onboarding](https://docs.stripe.com/connect/api-onboarding)).

**Step one is four fields and no uploads:**

| Field | Why it earns its place |
|---|---|
| Trading name | Identity |
| Country of operation | Routes the review (§4.5) and sets the destination market |
| Work email | The channel for every subsequent step |
| Company registration number | The fast path — see below |

Everything else — VAT certificate, trade licence, proof of address, bank details,
signed terms — is `eventually_due`, and is asked at the point of first purchase
intent, when the dealer's own motivation is highest.

**A document upload must not be the first ask.** Faire's ladder goes soft to
hard: business address, website, social profiles, photos of the premises — and
only "in certain cases" a business licence, tax licence or lease
([Faire: store verification](https://www.faire.com/support/articles/360035578692)).

**Registry lookup is the fast path.** ACV and Manheim collapsed dealer signup to
two fields by outsourcing credential checks to AuctionACCESS, the North American
dealer credentialing bureau; ACV says this took registration from "up to a few
days" to "only a few minutes"
([ACV](https://www.acvauctions.com/blog/auctionaccess-for-acv),
[Manheim](https://site.manheim.com/en/help/new-dealer-registration.html)).

No such bureau covers Providence's corridor, so the verification has to be built
rather than bought. The reachable equivalent is a registry lookup — Companies
House for UK and Ireland, VIES for EU VAT numbers — as the fast path, with manual
document review as the fallback for registry misses, non-registry jurisdictions
and risk flags. Budget for that gap; it is the single largest piece of unbought
work in this requirement.

**Requirements are rows, not a column.** Each requirement (`company_registration`,
`vat_number`, `trade_licence`, `proof_of_address`) carries its own state and, when
it fails, an error code plus a plain-English reason. The headline status is
*derived* from those rows. A single `approved` boolean fails within a year:
licences expire, VAT registrations lapse, directors change — and Stripe re-runs
verification on any account change precisely because of this.

### 4.4 What a pending dealer can do

This is the load-bearing design decision, and the honest answer from the research
is that the pattern is well established in developer platforms and largely
**absent** in wholesale and dealer portals. B2B Wave's documented flow is an
acknowledgement email, an approval email, and all configuration done by an admin
afterwards. So the choice below is a differentiator, not catching up — and should
be scoped as one.

Mercury publishes an explicit "Things you can do while you wait" list — order a
card, invite team members and assign roles — where each item activates on
approval ([Mercury](https://support.mercury.com/hc/en-us/articles/28771494745364-What-happens-after-I-submit-my-Mercury-business-account-application)).
Providence's equivalent, all available under `catalogueAccess`:

- Invite colleagues and assign them roles (§3.1) — they activate on approval
- Set the destination country and port of arrival
- Set default landed-cost assumptions — duty route, VAT treatment, target margin
- Upload a logo and draft the landing page (§6) — it cannot publish yet
- Build a watchlist and save searches
- Submit a sourcing request, **queued rather than executed**

Two constraints on that list:

- **A held request must be a sourcing request or a quote — never a bid on a live
  lot.** Faire can hold an order for 30 days because wholesale stock restocks; an
  auction lot is one-of-one with a closing time. A hold that expires against a
  closed auction is a broken promise.
- **A pending dealer must not see margin, cost basis, or source-side pricing.**
  Whatever the pending tier shows is scoped to destination-market landed cost,
  not to Providence's buying position.

The pending page itself is a **dated event timeline, not a percentage bar** —
*Application received, Documents received, Company checks started, Decision
recorded* — emitted by the reviewer's own actions, with prior updates kept
visible and dated. NN/g is explicit that a tracker with nothing to say is worse
than no tracker: it teaches the applicant that checking is pointless. If we
cannot emit at least one event beyond "submitted", we send email only and skip
the status page.

Progress is stored **server-side**. Stripe's own onboarding checklist stores
checkbox state in the browser cache, which does not survive a device change and
is invisible to the reviewer — for a dealer portal that is the wrong half of the
trade.

### 4.5 The reviewer's side

Better documented than expected, almost entirely through Stripe Connect.

- **The default view is a work queue, never a list of every application.** Status
  tabs mirroring the applicant-facing states, plus one combined "Needs me" view,
  with filters, saved views and CSV export.
- **One-page review:** submitted data, uploaded documents inline, a computed
  "actions required" list that empties when the application is clean, and prior
  correspondence.
- **The reviewer can submit information on the applicant's behalf.** For a dealer
  we want, correcting a malformed VAT number is better than bouncing the
  application.
- **Reject reasons are a closed enum**, stored as a column: *not a trade buyer /
  could not verify the business / restricted market or channel conflict /
  incomplete documents / other*, with an optional free-text note beside it. Free
  text is unqueryable; six months in, nobody can answer why a market's approval
  rate is low.
- **Every reviewer action is logged immutably** — who opened it, who requested
  information, who decided, when, with what reason — and the log is visible on
  the application record.
- **Routing branches on destination market.** This is required regardless: the
  Sri Lanka channel policy in `business-context.md` §14 means applications from
  some markets follow a different path. That policy is a routing input and never
  appears in portal copy.

**Instrument the SLA from the first application.** `assignedAt`,
`firstTouchedAt`, `decidedAt`, plus reviewer id and reject reason on every
decision. None of it can be backfilled. Set a tighter internal target than the
published promise — the industry norm for document-backed dealer approval is
roughly one to seven business days, and minutes where a machine-readable registry
carries it, so "one business day" is achievable if Companies House lookups take
the volume. Publish a window you can beat rather than one you miss on the third
application.

### 4.6 Email, batched and event-keyed

Three emails minimum, keyed to real events rather than a calendar:

1. **Acknowledgement**, instant — reference number, the four state names, the
   published turnaround.
2. **Action needed**, only when something is genuinely required, deep-linked to
   the exact field. Delivered in two channels at once — email *and* an in-portal
   banner, as Faire does — and worded forgivingly: if the requested evidence does
   not fit how the business operates, send the nearest relevant thing and we will
   follow up. A rigid form rejects legitimate dealers whose paperwork is shaped
   differently in another jurisdiction.
3. **The decision** — carrying the structured reason if declined, and a one-click
   link back into the portal if approved.

`info_requested` carries a deadline with a stated consequence, set at the moment
the request is sent. Walmart closes the account after seven days; for a
low-volume, high-value channel that is disproportionate. **After 14 days the
application expires back to `draft` with everything preserved.**

Automated mail is batched. Per-event notification is how a pending applicant
learns to filter us.

### 4.7 Where the applicant starts

Neither `/b2b` nor `/saas` has a sign-in affordance today, and `MinimalHeader`
carries only a *Begin Inquiry* button. Both pages need two things: a way in for
dealers who already have an account, and an apply CTA that tells the truth about
what happens next.

| Surface | Today | Becomes |
|---|---|---|
| `/b2b` hero secondary | "Sign Up for the Platform" → `/saas` | "Apply for a dealer account" → `/partners/apply` |
| `/b2b` closing | "Ready to scale? / Join the Network" → `/saas` | Unchanged target, retargeted to `/apply` |
| `/saas` closing | "Sign up now — Free Forever" → `/signup` | "Apply for a dealer account" → `/partners/apply` |
| Header | *Begin Inquiry* only | Adds a quiet *Dealer sign in* link |

Two copy notes. **"Free Forever" is a pricing claim** that an approval-gated
product cannot make without qualification — it is raised as an open question in
§10 rather than rewritten here. And the apply CTA states the gate rather than
hiding it: a dealer who discovers the approval step after filling a form is a
support ticket, while one who is told up front reads it as diligence. ACV's own
guidance notes a verification call may be part of setup; on a relationship worth
tens of thousands per vehicle, saying so on screen is a feature.

All replacement copy follows `writing-angle.md` — the dealer is the subject of
the sentence, and no line promises the removal of effort.

### 4.8 What this deliberately does not copy

- **Auto Trader's model — no verification at all.** Trade status there is a
  self-declared toggle ([Auto Trader](https://help.autotrader.co.uk/hc/en-gb/articles/9832386864541-How-do-I-become-a-trade-seller-and-how-much-does-it-cost)),
  which is defensible because the product sells advertising. Providence's portal
  moves vehicles and money, so the gate stays — but the principle transfers:
  **gate by consequence.** Claims that only affect what a dealer can *see* are
  self-declared and instant; only committing money or taking delivery needs
  documents.
- **Freezing the application on submit.** Mercury requires an email to change a
  submitted application, which generates support load for typos. We ship a
  visible *withdraw and edit* action that returns to `draft` and honestly
  restarts the clock.
- **Silent rejection.** Faire's opacity is a documented complaint, not a neutral
  design choice.
- **One approval covering every market.** Manheim requires separate registration
  per auction location; customs, homologation and duty routes differ per
  destination, so approval is scoped to the markets it was granted for.

---

## 5. Requirement 2 — the dealer lead management system

### 5.1 What the dealer sees

A dealer-scoped CRM at `/portal/leads`. Every query filters on
`requests.dealerAccountId = <tenant resolved from the session>`, and an `agent`
additionally filters on `dealerMemberId = self`.

The lead row needs no new shape — `requests` (`src/db/schema.ts:96-186`) already
carries customer, vehicle, colour/grade/steering, contact preferences, both
status columns, `statusHistory`, payments, shipping and attribution. **A dealer
view is a query and a projection, not a second table.**

What the dealer may read is narrower than the row. Explicitly withheld: internal
notes (`adminNotes`), the assigned Providence agent's identity, cost and margin
fields, and the conversion-ledger columns. That projection is defined once, in a
`dealerLeadView()` serialiser, rather than hand-narrowed at each call site the
way `getDealerDashboardData` does today (`dealer-actions.ts:121-180`).

### 5.2 The dealer gets a write path

Today the dealer portal is read-only. A CRM that cannot record what happened is a
report, not a CRM. Dealers may set:

- `leadStatus` — the sales vocabulary, from the existing `SALES_STATUSES`
- a note, appended to `statusHistory` with the dealer member as `performedBy`
- a follow-up time, reusing `setFollowUpTimer` / `clearFollowUpTimer`
  (`src/lib/followUpTimer.ts`, `src/actions/admin-actions.ts:373-445`)
- assignment to one of their own `dealerMember` agents

Dealers may **not** write `status` — the nine-stage delivery pipeline is
Providence's operational truth (sourcing, inspection, shipping), and a dealer
writing to it would corrupt the desk's view. They see it read-only, as progress.

### 5.3 Two status vocabularies, and a third that does not exist

`requests` carries `status` (a nine-stage delivery pipeline) and `leadStatus`
(ten sales labels). Both are defined in `src/lib/leadConversion.ts:25-186`, along
with `leadOutcome()`, `isTeamDecidedStatus()` and `hasReachedPurchaseStage()`.

The current dealer dashboard tests against `"Sourcing"`, `"Inspected"` and
`"Acquired"` (`src/actions/dealer-actions.ts:135`), **none of which are producible
values**. The "Vehicles Sourcing" KPI is therefore structurally always zero. Any
dealer surface must consume the exported vocabularies rather than invent labels —
this is exactly the class of bug `leadConversion.ts` was written to prevent.

Two more defects in the same function, to fix rather than carry forward:

- **Drafts leak into the dealer's list.** `isDraft` is filtered for the three stat
  counters but not for the returned leads array (`dealer-actions.ts:129-140` vs
  `:171`), so an abandoned mid-form draft shows in "Recent Widget Leads" until an
  admin happens to load `/admin` and trigger the 30-minute TTL sweep.
- **No pagination, filter, search or sort** — `getDealerDashboardData` returns
  every matching row.

### 5.4 Performance: do not copy the admin dashboard

`getRequests` ships every non-draft lead in the database to the browser on every
`/admin` load, unpaginated, after a `JSON.parse(JSON.stringify(...))` round trip
(`admin-actions.ts:140-183`). That is the known cause of the admin lock-up and it
grows without bound.

The dealer portal uses the **scoped-stats pattern** instead: parallel `COUNT`/`SUM`
queries against a shared `baseConditions` array, never pulling rows into memory to
count them. It is already written, for the `assignedToId` scope, at
`src/actions/sales-profile-actions.ts:547-610`. Lists paginate server-side via
`src/lib/pagination.ts:28-51`. Export reuses `src/lib/leadsExport.ts:85-247`
verbatim, which already neutralises spreadsheet formulas.

### 5.5 Commission needs a ledger, not a recomputation

Commission is currently recalculated from `commissionRate` on every page load,
with a hardcoded `$500` flat-fee fallback (`dealer-actions.ts:142-155`). There is
no persisted record, no payout state, no invoice link, and no currency —
`agreedPrice` has no currency column and `DEAL_CURRENCY = "USD"` is a bare
constant.

A dealer being paid on these numbers needs a `dealerCommission` row per qualifying
lead: the rate applied, the base figure, the currency, the state (`accrued` /
`invoiced` / `paid`), and the timestamp. **A number a partner is paid on has to be
a record, not a derivation that silently changes when someone edits the rate.**

### 5.6 Dealers creating their own users

`/portal/team` — invite by email, assign `owner` / `manager` / `agent`, disable a
member. Backed by `dealerInvitation` (§3.1): a hashed single-use token, an expiry,
one pending invitation per email per dealership.

Two things the existing admin user-creation path does that must **not** be copied:
it generates the password with `Math.random()` and emails it in plaintext
(`admin-actions.ts:493`, `:509-513`). Invitations here carry a token and the
invitee sets their own password.

Disabling a member must revoke their live sessions — the pattern exists at
`admin-actions.ts:587`, which deletes the user's session rows.

### 5.7 Notifications

Nothing currently notifies a dealer of anything; the only lead emails go to the
assigned Providence agent and the customer (`request-actions.ts:490-533`). A
dealer whose widget produced a lead needs to know quickly, so: an email to the
dealership on new lead and on stage change, per-member preferences, and a digest
option. Every send reuses `src/lib/email.ts`, whose `sendEmail` already degrades
to `[EMAIL MOCK]` without `RESEND_API_KEY` and swallows delivery failures — which
means a missing key is invisible rather than loud, and the portal should surface
send failures rather than inherit that silence.

---

## 6. Requirement 3 — a landing page at a claimed handle

### 6.1 The template already exists

`/team/[slug]` is the working precedent, and it is 99 lines end to end
(`src/app/(marketing)/team/[slug]/page.tsx`). The dealer page reuses its whole
contract:

- a server action `getPublishedDealerPageByHandle(handle)`
- the page calls it once in `generateMetadata` and once in the component
- `notFound()` on miss
- inline JSON-LD
- one client component for the interactive parts
- `listPublishedDealerHandles()` feeding `src/app/sitemap.ts`
- the picker dialog from `listGalleryForPicker` for featured vehicles
- image upload via `uploadProfileImage` to R2 (`src/lib/file-actions.ts:171-204`)

### 6.2 URL shape

**Recommendation: `providenceauto.co.uk/dealers/<handle>` — a path, not a
subdomain.**

A subdomain needs per-tenant DNS and certificates, its own entry in
`trustedOrigins` (`src/utils/auth.ts:24-30`), and would widen exactly the
cross-subdomain cookie surface that §2.7 already flags as a risk. A path costs
none of that and reuses the existing routing, sitemap and metadata machinery
unchanged.

`dealers` must be added to `RESERVED_SLUGS` before the first handle is claimed.

### 6.3 Handle rules

Reuse `slugify()` and `RESERVED_SLUGS` from `sales-profile-actions.ts:12-44` —
**do not write a fourth slug normaliser.** There are already three and they
disagree: profiles strip underscores, dossiers keep them
(`sales-profile-actions.ts:41` vs `spec-actions.ts:43`), and
`scripts/create-car-page.mjs:137` carries a fourth.

The existing 19-word reserved list has drifted from the route tree — it is missing
`about-us`, `latest-news`, `source-cars-from`, `embed`, `dealers` and every
`import-*` page. It is hand-maintained, nothing regenerates it, and nothing tests
it. Extend it, and add a test asserting every top-level route segment is reserved.

Availability check: a debounced async check as the dealer types, with four visible
states — checking / available / taken / reserved — and suggestions when taken. The
dossier editor's `{conflict, slug, suggestedSlug}` return plus a `forceSlug` retry
(`spec-actions.ts:100-124`) is a better model than the profile editor's flat
rejection.

### 6.4 Two defects the template will otherwise pass on

**Renaming a handle 404s every existing link.** There is no `previousSlug` column,
no alias table, no catch-all rewrite and no middleware. The profile editor's
entire mitigation is hint text reading "Changing this breaks old links." A
dealer's handle will be printed on stock lists and sent to customers, so it must
be solved here: keep an alias table of retired handles and answer them with a 308.

**Case variants all return 200.** `getPublishedProfileBySlug` re-slugifies the
incoming parameter (`sales-profile-actions.ts:111`), so `/team/Abdallah`,
`/team/ABDALLAH` and `/team/abd_allah` all render the same page, differing only in
the canonical tag — the duplicate-content shape Search Console has already flagged
on this domain. The gallery solved it with a 308 `permanentRedirect`
(`src/app/(static)/b2c/gallery/[id]/page.tsx:101-103`). Do that here.

Worth fixing while in the area: a draft page cannot be previewed by its own owner,
because the reader hard-filters `isPublished = true` — the "View my page" button
404s until publish (`src/app/admin/my-profile/page.tsx:163-167`).

### 6.5 Rendering and indexing

- **`force-dynamic`, not `revalidate`.** The build container has no database
  access, so a DB-backed route using `revalidate` is prerendered against an
  unreachable database and ships empty on every deploy, self-healing only after
  the first runtime revalidation. `/b2c/gallery` and `/team` both carry this bug
  today (`revalidate = 60`).
- **Full metadata is mandatory**, per `CLAUDE.md`: title under 60 characters,
  description under 155, OG image with explicit 1200×630 dimensions on a reachable
  URL, canonical, explicit `robots`, one H1, and a 40–50 word direct answer for
  AEO. `/team/[slug]` currently ships an OG image with no dimensions — do not copy
  that part.
- **Indexing policy is an open question (§10).** Many thin, partner-authored pages
  on the main domain is a real risk to the parent domain's reputation. The default
  recommended here is `noindex` until a quality threshold is met — a real logo, a
  description over a minimum length, at least one listing — and index after.

### 6.6 Attribution from the page

An inquiry submitted on `/dealers/<handle>` must land in that dealer's CRM. The
form already accepts an `assignedAgentId` prop and the action re-validates it
server-side (`request-actions.ts:153-170`). The dealer page follows the same
shape, except that the action resolves `dealerAccountId` from **the handle in the
route**, never from a client-supplied field.

`requests.source` continues to record the pathname, so `pathnameToSource()` needs
one branch — `if (slug.startsWith("dealers/")) return "Dealer Page"` — matching how
`team/` is handled (`src/lib/leadSource.ts:43`).

---

## 7. Requirement 4 — the embeddable, brand-adapting inquiry form

### 7.1 Fix the widget before theming it

**The embed is broken right now.** `public/embed.js:61-75` installs a listener for
a `providence-resize` postMessage. Nothing in the repository ever sends it — a
repo-wide grep for `providence-resize` returns exactly one hit, the listener
itself, and `postMessage` appears nowhere in `src/`.

So the iframe sits at its hardcoded 750px (`embed.js:49`) with `scrolling="no"`
and `overflow: hidden`, while the form runs from roughly 520px to well past 900px
and grows on step 1 as the mileage slider, colour swatches and grade chips render.
**The form is clipped and partly unreachable on any dealer site running the
snippet today.** That is the first fix, ahead of any theming work.

The iframe also needs `sandbox`, `loading="lazy"` and `referrerpolicy`, none of
which it sets, and the container id `providence-widget` is a hardcoded singleton,
so two widgets cannot coexist on one page.

### 7.2 The embed page must stop loading the whole site

`/embed/request` has no `layout.tsx` of its own, so the iframe pulls in the full
root layout — the GTM container, `MotionProvider`, the sonner `Toaster` and the
inline reveal script (`src/app/layout.tsx:315-347`).

**Providence analytics running unannounced inside a partner's page is the dealer's
consent problem, not only ours.** Add `src/app/embed/layout.tsx` with a minimal
shell.

Worse, the form fetches a third-party CORS proxy (`corsproxy.io`) on every make
selection (`requestForm.tsx:918-922`) — an uncontrolled third-party dependency
executing in the partner's origin, which the dealer never agreed to, and a single
point of failure for the model picker. It must be proxied through our own route
before the widget ships to third-party sites.

### 7.3 Attribution and abuse control

The snippet carries `embedKey` (§3.2), not `DL-xxxxx`. On submission the server:

1. resolves `embedKey` to a `dealerAccount`, rejecting unknown keys rather than
   storing the string;
2. checks the request `Origin` against that dealer's registered origin allow-list,
   recording a mismatch rather than silently accepting it;
3. rate-limits per key and per IP;
4. applies bot protection.

There is **no rate limiting and no bot protection anywhere in the codebase today**
— greps for ratelimit, recaptcha, turnstile, hcaptcha, honeypot and upstash all
return nothing. A public, unauthenticated, cross-origin-embeddable form that writes
a database row and sends two emails per submission (`request-actions.ts:491-533`)
is a spam and email-reputation amplifier.

`submitCarRequest` also performs **no server-side validation at all** — email,
phone, budget and source are accepted as sent (`request-actions.ts:93-330`). All
validation is client-side in `validateStep` and is bypassed by calling the action
directly.

### 7.4 Taking the dealer's brand colour

Honest assessment: **this is wider than it looks.** `#4da8da` is hardcoded 53 times
across 39 lines of `requestForm.tsx`, alongside `#3d92c2`, `#0369a1`, `#f0f9ff`,
`#bae6fd`, `#e6f3fa`, `#f2f8fc` and 19 `sky-*` utilities. The `.pa-range` slider
thumbs carry the colour again in `globals.css:611-653`.

The mechanism to fix it already exists and the form simply does not use it:
Tailwind v4's `@theme inline` block at `globals.css:11-51` already maps semantic
`--color-*` names onto CSS variables. The work is replacing every literal with a
token set on the form's root element.

Five traps, each needing a decision rather than a find-and-replace:

1. **Hover states use a separately hardcoded darker shade** (`#3d92c2`), so one
   accent input must *derive* its hover — `color-mix()` or an oklch shift, not a
   second input field.
2. **Tinted surfaces** (`#f0f9ff`, `#e6f3fa` and the rest) are hand-picked tints of
   the accent and need deriving too.
3. **Shadows embed the colour numerically** as `rgba(77,168,218,0.3)`
   (`requestForm.tsx:2137`, `:2152`), which cannot consume a hex variable without
   restructuring to a channel triplet or `color-mix()`.
4. **Contrast is currently guaranteed by a fixed pair** — white text on `#4da8da`.
   A dealer-supplied pale accent produces unreadable buttons. The foreground has to
   be computed: `contrastInk` in `src/lib/vehicle-colors.ts` already does exactly
   this and the form already uses it at `requestForm.tsx:625`.
5. **A colour field is a CSS injection vector.** The value must be parsed and
   re-serialised server-side into a known-good format before it reaches a style
   attribute — never interpolated as a raw string.

The form is white/glassmorphic only (`bg-white/80 backdrop-blur-xl`) with no dark
handling, so a dealer with a dark site gets a white slab. A `surface` choice
(light / dark / auto) belongs alongside the accent.

### 7.5 Housekeeping

`embed.js:33` and `dealer-dashboard/page.tsx:43` both fall back to
`https://providenceauto.com` when `NEXT_PUBLIC_BASE_URL` is unset. **That is not
the live domain** — the site is `providenceauto.co.uk`. A misconfigured environment
hands dealers a snippet pointing at a domain we do not control, and `embed.js`'s
own origin check for resize messages would then never match.

The `dealerId` query parameter that `embed.js` appends is read by nobody — only
`ref` is consumed (`requestForm.tsx:1120`). Remove it or use it.

---

## 8. Requirement 5 — listings on the page and under the form

### 8.1 Two kinds of listing

**Providence stock** — existing `specDossiers`, chosen with the picker already
built for sales profiles (`listGalleryForPicker`, `sales-profile-actions.ts:492-526`).
The reader re-filters to live statuses at render time, so a car unpublished after
being picked disappears rather than 404ing. Prices and links reuse `getLeadPrice`,
`formatLeadPrice` and `galleryPathForDossier` (`src/lib/vehicle.ts:5-81`) so a
dealer page shows the same "From £x" as the gallery.

One inconsistency to resolve first: `GalleryClient` filters `status === "Active"`
client-side (`src/components/GalleryClient.tsx:105`) while the sitemap, the detail
page and the featured-vehicle resolver all accept `Active` *or* `Published`. A
`Published` dossier is advertised to Google and linkable from a profile but
invisible in the gallery grid.

**The dealer's own stock** — a new `dealerListing` table owned by the tenant: make,
model, year, mileage, price with currency, photos in R2, a status, an optional VIN.
This is partner-authored content on a Providence domain, so it needs a moderation
state (`draft` / `pending` / `live` / `rejected`) and a takedown path.

### 8.2 Where they render

- **On `/dealers/<handle>`** — two clearly labelled groups. A buyer must be able to
  tell "sourced to order by Providence" from "in this dealer's stock now", because
  the first is an import lead and the second is a local sale. Blurring them would
  be a claim the business cannot stand behind, and it is the kind of over-claim
  `business-context.md` §4 exists to prevent.
- **Below the embedded form**, in the widget on the dealer's own site — the same
  two groups, in the dealer's accent, with height reported through the resize
  protocol fixed in §7.1.

### 8.3 Structured data

Vehicle listings on a public page want `Vehicle`/`Car` JSON-LD. The codebase
already has five hand-rolled copies of the same `dangerouslySetInnerHTML` JSON-LD
boilerplate; a sixth should not be typed by hand — extract a helper.

---

## 9. Build order

Each phase is shippable and leaves the system in a coherent state. The order is
driven by dependency, not by visibility — the phases that show up in a demo are
the last ones.

### Phase 0 — close the holes (§2)

Nothing else starts until §2.8 passes. This phase ships no dealer-facing feature
and it is the most important one in the document.

- [ ] `src/lib/authz.ts` — shared `normalizeRole`, `requireRole`,
      `requireDealerScope`, promoted from `sales-profile-actions.ts:59-71`
- [ ] Role gate in `src/app/admin/layout.tsx`; role filtering in
      `src/components/admin-sidebar.tsx`
- [ ] Role check in every privileged action in `src/actions/`
- [ ] Column allow-list in `updateRequestStatus`
- [ ] Gate or rate-limit every action and route in §2.6
- [ ] `createDealerProfile` derives identity from the session
- [ ] `requireEmailVerification: true`; `input: false` on `role`, `isBanned`,
      `badges`
- [ ] Suspension revokes live sessions
- [ ] Add staging to `trustedOrigins`
- [ ] Reconcile the `dealerprofile` table on staging (§3.4)
- [ ] Integration tests asserting cross-tenant and cross-role denial

### Phase 1 — accounts and approval (requirement 1)

- [ ] SQL: `dealerAccount`, `dealerMember`, `dealerInvitation`; backfill the two
      existing dev rows; per-environment (§3.4)
- [ ] `src/actions/dealer-application-actions.ts` — apply, resubmit, withdraw
- [ ] `src/actions/dealer-admin-actions.ts` — the review queue, approve, request
      more information, reject, suspend (admin-gated)
- [ ] `/partners/apply` — the application form
- [ ] `/partners/status` — the pending state
- [ ] `/admin/dealers` — the internal review queue
- [ ] Emails: received, more information needed, approved, rejected
- [ ] `/b2b` and `/saas`: apply and sign-in entry points (§4.7)
- [ ] Sign-in routes a dealer to the portal, not to `/admin`

### Phase 2 — the dealer CRM and team management (requirement 2)

- [ ] SQL: `requests.dealerAccountId`, `requests.dealerMemberId`,
      `requests.origin`, plus indexes
- [ ] Backfill: map existing `source = 'DL-xxxxx'` rows onto `dealerAccountId`
- [ ] `src/actions/dealer-portal-actions.ts` — scoped list, scoped stats, note,
      status, follow-up, assignment
- [ ] `dealerLeadView()` projection
- [ ] `/portal` shell, `/portal/leads`, `/portal/leads/[id]`
- [ ] `/portal/team` — invitations, roles, disable
- [ ] `dealerCommission` ledger
- [ ] Dealer notifications

### Phase 3 — the embed (requirement 4)

- [ ] Send `providence-resize` from the embed page — the missing half of the
      protocol (§7.1)
- [ ] `src/app/embed/layout.tsx` — minimal shell, no GTM
- [ ] Proxy the `corsproxy.io` call through our own route
- [ ] `embedKey` + origin allow-list + rate limit + bot protection
- [ ] Server-side validation in `submitCarRequest`
- [ ] Tokenise `requestForm.tsx` colours; derive hover, tints and shadows;
      `contrastInk` for foreground
- [ ] Snippet builder in the portal, with a live preview
- [ ] Fix the `providenceauto.com` fallback in both places

### Phase 4 — the landing page (requirement 3)

- [ ] SQL: handle, published flag, page content, alias table
- [ ] Extend `RESERVED_SLUGS`; add the route-coverage test
- [ ] Handle availability check
- [ ] `/dealers/[handle]` with full metadata and JSON-LD, `force-dynamic`
- [ ] 308 for case variants and retired handles
- [ ] Draft preview for the owner
- [ ] Page editor in the portal
- [ ] Sitemap entry, gated on the indexing policy (Open question 2)

### Phase 5 — listings (requirement 5)

- [ ] SQL: `dealerListing`
- [ ] Providence-stock picker, reusing `listGalleryForPicker`
- [ ] Dealer listing editor with image upload to R2
- [ ] Moderation queue
- [ ] Render on the landing page and below the embedded form
- [ ] `Vehicle` JSON-LD via a shared helper
- [ ] Resolve the `Active` / `Published` status mismatch (§8.1)

---

## 10. Open questions

These are decisions this document cannot make. Each carries a recommendation so
that silence defaults to something sensible rather than to nothing.

**1. Does the widget auto-detect the host site's colours, or take them from
configuration?**
*Recommendation:* explicit configuration, with detection offered only as a
suggestion in the snippet builder — "we found #1a3d6b on your site, use it?" —
which the dealer confirms. Auto-detection at runtime reads a page we do not
control, produces unreadable results on hostile backgrounds, and re-themes the
form whenever the dealer restyles their site. Confirming once is more predictable
for both sides.

**2. Should dealer landing pages be indexed?**
*Recommendation:* `noindex` until a quality threshold is met (real logo, a
description over a minimum length, at least one listing), then index. Partner-
authored thin pages on the main domain carry a real risk to the parent domain's
reputation, and this domain has already had duplicate-content issues flagged in
Search Console. A `noindex` default costs the dealer nothing while their page is
empty, which is exactly when indexing would hurt.

**3. What is the commercial model, and what happens to "Free Forever"?**
`/saas` currently ends with a CTA reading **"Sign up now — Free Forever"**, and
`/b2b` offers **"Sign Up for the Platform"**. Both promise immediate self-serve
access. An approval gate contradicts them, and the commission model
(`commissionRate`, the `$500` flat-fee fallback, the bare `DEAL_CURRENCY = "USD"`)
is undocumented anywhere outside the code.
*Recommendation:* decide the model first, then rewrite both CTAs to promise
application rather than instant access. This is a factual claim about what the
business offers, so the answer belongs in `business-context.md` §6 — see
Question 6.

**4. Who is accountable for dealer-authored listings on our domain?**
Dealer stock rendered on `providenceauto.co.uk` is content we host and Google
attributes to us. Pricing accuracy, vehicle-condition claims and consumer-law
exposure all differ between a Providence-sourced car and a dealer's own forecourt
stock.
*Recommendation:* moderation before first publication, a standing takedown route,
and a visible per-listing attribution line naming the dealer as the seller. Legal
review before Phase 5 ships, not after.

**5. Is a dealer's data separable on exit?**
When a dealership leaves, who owns the leads their widget generated — and what is
deleted versus retained? This is a UK GDPR question (controller versus processor)
and it should be answered before the first external dealer signs anything, not
when the first one leaves.
*Recommendation:* answer it in the partner terms, and build export and deletion
in Phase 2 while the data model is being written.

### Source-of-truth questions

Per `brand-position.md` §11.2, questions that would change a source-of-truth
document are raised with a recommendation, logged in that document's §11.3, and
re-raised until answered. Two are raised by this work.

**6. `business-context.md` §6 describes the dealer platform offer as immediate
self-serve.** The row reads "A dealer embeds Providence stock on their own site;
Providence sources and ships, the dealer keeps the commission" — with no
application, approval or vetting step. If requirement 1 ships, that description
becomes incomplete, and `/saas`'s "Free Forever" CTA becomes wrong.
*Recommendation:* once Question 3 is answered, update §6 to state the approval
gate and the commercial model.

**7. `business-context.md` §14.2's focus-list rule does not say whether it
applies to dealer-facing surfaces.** §14.1 states plainly that paid **B2B**
acquisition into Sri Lanka is *yes* while paid B2C is *no*; §14.2 then says Sri
Lanka "does not take one of the slots" on any limited country list, without
distinguishing consumer surfaces from trade ones. The dealer portal is precisely
the B2B channel §14.1 endorses, so a country list on `/b2b`, on the application
form, or on a dealer landing page hits a rule written for consumer surfaces.
*Recommendation:* scope §14.2 explicitly to consumer-facing surfaces, and state
that dealer-facing and trade surfaces follow §14.1 instead — where Sri Lanka is
an active B2B market. Until answered, this document assumes the conservative
reading: no Sri Lanka slot on any limited list, dealer-facing included.

---

## 11. What this document does not cover

Named so that their absence is a decision rather than an oversight:

- **Billing and payment collection.** No subscription, invoicing or card handling
  is specified. §5.5 stops at an accrual ledger.
- **A public dealer directory.** `/dealers` as an index page is deliberately out
  of scope until the indexing policy (Question 2) is answered.
- **Inventory feeds.** Bulk import of a dealer's stock from a DMS or a CSV feed
  is a Phase 6 conversation; Phase 5 is manual entry only.
- **Custom domains** for dealer landing pages.
- **The `/saas` and `/b2b` page rewrites** beyond the entry points in §4.7. Both
  pages carry retired concierge-era vocabulary and hype ("The ultimate B2B
  sourcing software", "Your New Unfair Advantage") that a repositioning pass
  should revisit against `writing-angle.md` — a separate piece of work.
