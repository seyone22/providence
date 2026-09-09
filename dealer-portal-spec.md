# Dealer Portal — Onboarding Design & Logical Framework

> Status: **design specification, not yet implemented.** Nothing in this document
> is built. It defines the framework the implementation follows.
>
> Companion reading: `business-context.md` (what the business does),
> `brand-position.md` (what we claim), `writing-angle.md` (how copy is phrased),
> `sales-profile-spec.md` (the closest existing precedent — `/team/[slug]` is the
> template a dealer landing page reuses), `CLAUDE.md` (how the codebase is built).

---

## 0. Decisions taken — 2026-09-09

Twelve decisions were put to the business and answered. They are recorded here
because the sections below were drafted before them, and where a decision went
against this document's recommendation that is stated rather than quietly
rewritten.

| # | Decision | Effect |
|---|---|---|
| 1 | **The platform is free.** Per-vehicle price is agreed offline, case by case | No billing build. §5.5 becomes a per-deal record, not a rate calculation |
| 2 | **Dealer pages live at `providenceauto.co.uk/dealers/<handle>`** — the path | Against §6.2's recommendation. Mitigations become load-bearing — see below |
| 3 | **A pending dealer gets full setup plus queued sourcing requests** | §4.4 as specified |
| 4 | **Phase 0 and Phase 1 ship as one release** | §9 reordered |
| 5 | **Widget theming is explicit, with a one-time detected suggestion** | §7.4, Question 1 as recommended |
| 6 | **Both source-of-truth documents are to be updated** | Applied to `business-context.md` §6 and §14.2; logged in its §11 |
| 7 | **Both legal questions reviewed before the first external dealer** | Article 26 arrangement and trade terms start now, in parallel with the build |
| 8 | **A deal stores the agreed figure and its currency** | Drops `commissionRate` derivation and the `$500` fallback |
| 9 | **Every dealer listing is moderated, every time** | §8 — no self-publication |
| 10 | **Published turnaround: two business days** | §4.2, §4.5 |
| 11 | **Applications round-robin across Sales** | §4.5 — with the caveat below |
| 12 | **Approval is scoped to a named list of destination markets** | New field on `dealerAccount`; §4.5 routing |

Three of these need a note.

**Decision 2 went against the recommendation.** §6.2 argued for a separate host on
Google site-reputation-abuse grounds. The path was chosen instead, which is a
legitimate call — the operational saving is real and enforcement in 2024 was
section-scoped rather than domain-wide. But it removes the isolation that made
the SEO risk cheap to contain, so the three mitigations in §6.5 stop being
prudent extras and become the actual defence: **`noindex` by default with an
earned quality gate, `rel="ugc nofollow"` on every dealer-authored outbound
link, and a fixed template with no dealer-authored duty, VAT or delivery copy.**
Decision 9 (moderate everything) strengthens this considerably, since a
human-reviewed page is much closer to the "sufficient input, editorial oversight,
or contribution from the host site" test the policy actually applies. Keep
`/dealers/` a cleanly separable subfolder so the section can still be amputated,
and register it as its own Search Console property view.

**Decision 8 changes the data model, not just a default.** Because price is agreed
per case, there is no rate to multiply. `dealerCommission` stores the figure that
was actually agreed, its ISO 4217 currency, its state and its timestamp.
`commissionRate` stays on the record only as a conversation starting point, and
nothing derives money from it.

**Decision 11 inherits known bugs if implemented naively.** The existing
round-robin in `request-actions.ts:225-249` has three defects: its anchor query
does not exclude drafts, so an abandoned draft advances the rotation and
un-advances it when swept; it is a read-then-write with no lock, so two
concurrent submissions land on the same person; and if the anchor's owner has
since been banned or had their role changed, `findIndex` returns `-1` and the
rotation silently resets to the first person in the pool. Application assignment
must not copy those. Fixing them in place would also improve lead routing.

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

**Use Better-Auth's Organization plugin rather than hand-rolling this.** It is
first-party, compatible with the installed 1.4.19 and the Drizzle adapter, and
supplies the organization / member / invitation model, invitation expiry, seat
limits, role evaluation, lifecycle hooks, and a server-side
`activeOrganizationId` on the session row
([Better-Auth: Organization](https://www.better-auth.com/docs/plugins/organization)).
Map its singular table names to plural Drizzle exports exactly as the repo
already does for `user` → `users` (`src/utils/auth.ts:14-22`).

```
organization             the tenant — a dealership          [plugin]
member                   a person inside a dealership       [plugin]
invitation               a pending seat                     [plugin]

dealerAccount            Providence's dealer-specific fields
  organizationId     ->  organization.id, unique
  publicId               "DL-xxxxx", display only, not a key
  embedKey               rotatable, see §3.2
  status                 draft | submitted | in_review | info_requested
                         | approved | rejected | suspended
  catalogueAccess, tradeAccess       the two capability flags (§4.1)
  approvedMarkets        text[]  destinations this dealer may take delivery in
  commissionRate         default 10.0  (a starting point only — never derives money)
  approvedAt, approvedBy, decisionNote, rejectReason
  assignedAt, firstTouchedAt, decidedAt          SLA instrumentation (§4.5)

dealerRequirement        one row per verification requirement (§4.3)
  dealerAccountId, key, state, errorCode, humanReason
```

**The plugin answers "may this role do X". It never answers "does this row
belong to this tenant".** It scopes none of `requests`, `specDossiers` or
`sourcingAnalyses`. Reading its completeness as tenant isolation is the single
most expensive mistake available here — isolation is §3.5, and it is a separate
workstream.

`users.role` keeps a single coarse value (`dealer`) that says *which console you
land in*. It must never carry the dealership identity — that lives on `member`,
which is the row every dealer-scoped query joins through.

**Roles inside a dealership**

| Role | Leads | Members | Landing page & embed | Billing/commission view |
|---|---|---|---|---|
| `owner` | all | invite, disable, change roles | edit, publish | yes |
| `manager` | all | invite agents | edit | yes |
| `agent` | own assigned only | no | no | no |
| `read-only` | all, read | no | no | no |

Define the ladder once in a shared `permissions.ts` imported by both server and
client. **Get the `read` versus `read-own` distinction right immediately** —
retrofitting per-branch visibility after agents have shared pipelines is a data
model change, not a permission change. Two invariants belong in
`organizationHooks`: no role may grant a permission it does not itself hold, and
a dealership can never be left without an owner.

An `owner` is created by the approval action (§4.5), never by self-service.

`authClient.organization.checkRolePermission` runs synchronously on the client
and excludes dynamic roles — it is for rendering, never for authorisation. Only
`auth.api.hasPermission` on the server decides anything.

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
`member`. A tenant id supplied by the client is never trusted for
authorisation — the pattern to copy is `submitCarRequest`, which already
re-validates a client-supplied `assignedAgentId` against the database and
silently falls back (`src/actions/request-actions.ts:153-170`).

### 3.3 Lead ownership becomes a relation

Dealer ownership of a lead is currently inferred from a string comparison against
the overloaded `requests.source` column. It becomes an explicit, indexed
relation:

```
requests.dealerAccountId   -> dealerAccount.id, nullable, INDEXED
requests.dealerMemberId    -> member.id, nullable         (which of the dealer's people owns it)
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

### 3.5 Isolation is mechanical, or it does not hold

A missing `where` clause is invisible to code review — the reviewer has to
notice a line that *is not there*. Convention does not survive a hotfix. So
isolation is enforced by structure and by CI, not by discipline.

**One scoped data-access layer, built before the first dealer feature.**
`src/db/tenant.ts` exports a `forTenant(orgId)` factory that bakes the tenant
predicate into every read and write. Feature code never imports the
tenant-owned tables directly; a Biome `no-restricted-imports` rule enforces it.
The repo's existing discipline of routing every mutation through
`src/actions/` gives a natural chokepoint most codebases lack — worth using
while there are a handful of dealer actions rather than forty.

**Four rules the layer encodes:**

1. **Resolve the tenant from the session, never from the request.** A tenant id
   in a form payload, query string, header or path segment is a *selector* — it
   must be validated against the member table before it authorises anything.
2. **Fetch by composite key `(organizationId, id)`.** Fetch-then-check invites
   the forgotten-check variant and leaks existence through differing errors.
3. **Cross-tenant access returns a 404-shaped denial, never a 403.** A 403
   confirms the object exists and turns the endpoint into an enumeration oracle.
4. **Cross-tenant staff reads go through a separately named, permission-gated,
   audit-logged path** — `db.asPlatformAdmin()`. Never an optional `orgId`
   parameter that means "all tenants" when omitted; an optional tenant filter
   defaulting to no filter is the bug wearing the costume of the fix.

**A required CI job runs a cross-tenant denial matrix** against a real Postgres:
two seeded tenants, and for every tenant-scoped action and route, a call as
tenant B against tenant A's id asserting denial. It is table-driven, and CI
fails when an action exists that the matrix does not cover. Today's CI —
non-blocking lint, `tsc --noEmit`, a dry `next build` — cannot catch a missing
where clause.

**Postgres RLS is a backstop, not the control.** If it is adopted, it is adopted
properly: a dedicated non-owner, non-`BYPASSRLS` application role with
`DATABASE_URL` repointed at it, `FORCE ROW LEVEL SECURITY`, a `WITH CHECK` on
every policy as well as a `USING` (a `USING`-only policy isolates reads and
leaves writes open), tenant context set with `set_config(..., true)` inside an
explicit transaction, and an unset variable that fails closed. **RLS enabled
while the app still connects as the table owner does nothing at all** — and
looks correct in `pg_policies`, which is the most dangerous possible outcome.
Two consequences specific to this repo: a boot-time assertion should query
`pg_policies` and refuse to start if a tenant-owned table lacks its policy,
because hand-applied per-environment SQL (§3.4) makes "present on staging,
absent on production" the realistic failure; and a pool-reuse test must assert
that two sequential requests for different tenants over a size-1 pool never see
each other's rows.

**Carry tenant context into every asynchronous path** — Resend emails, PDF
generation, scheduled runs — as an explicit argument, and re-check membership at
execution time. A dealer whose access was revoked on Monday must not receive a
Tuesday PDF. Put the tenant id in every cache key whose value varies by tenant,
and treat each new satellite surface (an export, a feed, a webhook, a dealer API
key) as a fresh isolation review behind its own flag, so "turn it off" stays a
real remediation.

One existing surface to revisit here: `/track/[id]` is effectively a capability
URL. That is acceptable for a one-off customer link and not acceptable once
dealer staff have accounts and the id space is enumerable from their own lead
list.

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
| `in_review` | reviewer | "We're running checks. This usually takes two business days." |
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
- **Approval names the markets it covers.** Per Decision 12, an approved dealer
  is cleared for a specific list of destinations, held in
  `dealerAccount.approvedMarkets`, and more can be added later without a fresh
  application. This mirrors Manheim's per-location registration, and it is the
  clean lever for the §14 channel policy — a market simply is not on a dealer's
  list, with nothing to explain in copy.

**Applications round-robin across Sales** (Decision 11), the way leads already
do. Two constraints on that. The queue's default view is still "needs me" rather
than everything, or the SLA has no owner. And the existing rotation in
`request-actions.ts:225-249` must not be copied as-is — its anchor query does not
exclude drafts, it is a read-then-write with no lock so concurrent submissions
collide, and a banned or re-roled anchor owner makes `findIndex` return `-1` and
silently resets the rotation to the first person in the pool. Application
assignment needs a correct version; fixing the lead rotation in the same pass is
the cheaper option.

Because judgement is now distributed across a team rather than held by one
person, **the closed reject-reason enum and the immutable audit log carry more
weight**, not less — they are what keeps decisions consistent and answerable
six months later.

**Instrument the SLA from the first application.** `assignedAt`,
`firstTouchedAt`, `decidedAt`, plus reviewer id and reject reason on every
decision. None of it can be backfilled. Set a tighter internal target than the
published two business days — the industry norm for document-backed dealer
approval is roughly one to seven business days, and minutes where a
machine-readable registry carries it, so two days is comfortably beatable once
Companies House lookups take the volume. That is the point of the number:
publish a window you beat rather than one you miss on the third application.

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

Two copy notes, both settled by Decision 1.

**"Free" survives; "sign up now" does not.** The platform genuinely is free —
per-vehicle price is agreed case by case — so the free claim is accurate and
worth keeping. What breaks is the promise of *immediate self-serve access*: an
approval gate contradicts "Sign up now", not "Free Forever". So the CTA becomes
something like **"Apply for a dealer account — free to join"**, and the page
says plainly that pricing on each vehicle is agreed with you directly. That is
also a better fit for `brand-position.md` §8 than a headline rate would be: the
price is quoted per car, before commitment, by a person.

**State the gate rather than hiding it.** A dealer who discovers the approval
step after filling in a form is a support ticket; one told up front reads it as
diligence. ACV's own guidance notes a verification call may be part of setup —
on a relationship worth tens of thousands per vehicle, saying so on screen is a
feature. With a published two-business-day turnaround (Decision 10), the
application page can carry that number directly.

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
- assignment to one of their own `agent` members

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

### 5.4 Do not copy the admin dashboard's query shape

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

**Decision 8 settles the shape: there is no rate to multiply.** Price is agreed
per vehicle, offline, case by case — so a `dealerCommission` row stores the
figure that was *actually agreed*, its ISO 4217 currency, its state (`accrued` /
`invoiced` / `paid`), the deal it belongs to, and the timestamp. `commissionRate`
stays on the dealer record as a starting point for the conversation, and nothing
derives money from it.

**A number a partner is paid on has to be a record, not a derivation that
silently changes when someone edits a rate.** That is doubly true here: with
per-case pricing, a recomputation would not merely drift, it would be wrong from
the first deal.

The currency is stored per deal rather than fixed, because the source market and
the settlement currency are not always the same conversation. The bare
`DEAL_CURRENCY = "USD"` constant goes; `agreedPrice` gains a currency column
alongside it.

### 5.6 Dealers creating their own users

`/portal/team` — invite by email, assign a role, disable a member. Backed by the
Organization plugin's `invitation` table (§3.1), configured defensively on day
one:

- `requireEmailVerificationOnInvitation: true`
- `cancelPendingInvitationsOnReInvite: true`
- `invitationExpiresIn` shortened from the 48-hour default to about 24 hours
- **never** set `generateId: "serial"` anywhere — it disables ID generation for
  every table, which would make invitation ids enumerable

**One caveat that has to be designed around:** in Better-Auth the accept-invite
link token *is* the invitation row's primary key, stored unhashed. Anyone with
database read — a leaked backup, a log line, an over-broad admin screen — holds
every live invitation. The email-match check on accept is therefore the only
compensating control, and disabling it is a security decision rather than a UX
convenience. Never log an accept-invitation URL or a raw invitation id, and keep
invitation ids off admin screens.

Domain-based auto-join is out of scope for v1. Providence's dealers are
relationship-onboarded by a salesperson, so explicit invitation is both safer and
truer to how the business actually works.

Two things the existing admin user-creation path does that must **not** be
copied: it generates the password with `Math.random()` and emails it in plaintext
(`admin-actions.ts:493`, `:509-513`). Invitees set their own password.

Disabling a member must revoke their live sessions — the pattern exists at
`admin-actions.ts:587`, which deletes the user's session rows.

**Support impersonation**, when it is needed, uses Better-Auth's admin plugin
rather than a bespoke mechanism: it records `impersonatedBy` on the session and
bounds the duration. Layer on a persistent banner naming impersonator,
impersonated user, tenant and time remaining; an audit event on start, stop and
every mutation performed while impersonating; a required reason; and read-only by
default, with write impersonation a separate and rarer permission. Note the
dependency: impersonation gated on a literal role string would silently
mis-evaluate across environments until §2.2 is fixed, and the shared cookie
prefix (§2.7) makes impersonated sessions materially harder to audit.

### 5.7 Notifications

Nothing currently notifies a dealer of anything; the only lead emails go to the
assigned Providence agent and the customer (`request-actions.ts:490-533`).

**The target is a first response inside 15 minutes, and it should be
instrumented.** DAS Technology's study of 1,700 dealerships (Q3–Q4 2024 data)
found 61% already answer retail leads within 15 minutes — so a supplier that
responds more slowly than the dealer's own standard reads as unserious. (Avoid
the "5 minutes = 9× conversion" and "10% per minute" figures that circulate in
automotive marketing posts; they trace back to a general B2B study from around
2011 relabelled as automotive, with no dated primary source.)

That target rules out email as the primary alert. **Notify over a channel with
delivery and read signals** — push, WhatsApp or SMS — with email as the audit
trail. `users.whatsappNumber` already exists (`src/utils/auth.ts:92`) and is
unused for this.

**Make the first automated response carry a real number.** The same study found
74% of dealer responses excluded a price quote and 90% omitted multiple photos.
Providence computes landed cost deterministically, so putting a CNF figure in
the first reply is a differentiator competitors structurally cannot copy.

Every send reuses `src/lib/email.ts`, whose `sendEmail` degrades to
`[EMAIL MOCK]` without `RESEND_API_KEY` and swallows delivery failures — a
missing key is invisible rather than loud, so the portal must surface send
failures rather than inherit that silence.

### 5.8 Feed the dealer's own CRM, do not compete with it

The most consistent complaint about automotive CRMs is friction, and a supplier
portal that becomes a second daily login competes with the system the dealer's
staff already live in — and loses.

**ADF XML is the format the trade already speaks.** A dealer-configurable ADF
endpoint drops Providence leads natively into the VinSolutions, Elead or
DealerSocket instance a dealer already runs, which removes the "we are not
logging into another system" objection outright. Confirm the required-field
matrix against the ADF specification before building; this research did not
verify it.

This does not delete §5.1 — a dealer with no CRM still needs somewhere to see
their leads, and the portal is also where the landing page, embed and commission
live. But **the portal is the fallback and the configuration surface; the feed is
the product.** Build the feed first.

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

### 6.2 Dealer pages get their own host

> **Decided: the path.** `providenceauto.co.uk/dealers/<handle>` (Decision 2).
> The recommendation below was for a separate host; it was not taken. The
> reasoning is kept because it explains why the §6.5 mitigations are now
> load-bearing rather than optional, and what to watch for. Keep `/dealers/` a
> cleanly separable subfolder, and give it its own Search Console property view
> so a change there is visibly distinct from car pages, blog and news.

**Recommendation as drafted: `dealers.providenceauto.co.uk/<handle>` — a separate
host, not a path on the main domain.** This is the one decision here that is
expensive to reverse.

An earlier draft of this document recommended a path, on the operational grounds
that a subdomain needs DNS, a wildcard certificate and an entry in
`trustedOrigins`. The search evidence reverses that, and the operational
objection turns out to be weaker than it looked: **a dealer landing page is
public and unauthenticated, so it does not need the session cookie at all.** A
cookie-less host is not a widening of the cross-subdomain surface flagged in
§2.7 — it is a narrowing.

What changed the recommendation:

- **Google's site reputation abuse policy governs exactly this.** It applies
  "where third-party content is published on a host site mainly because of that
  host's already-established ranking signals", and defines third-party content
  to include "white-label services" and "content created by people not employed
  directly by the host site". The operative test is "whether content on the
  relevant portion of the site is created with sufficient input, editorial
  oversight, or contribution from the host site to be considered fully
  integrated with the main site"
  ([Google: spam policies](https://developers.google.com/search/docs/essentials/spam-policies)).
  A dealer's sales page, authored by a separate commercial entity, on a domain
  that has spent years earning rankings for car-import queries, does not
  obviously pass that test.
- **The user-generated-content carve-out is narrower than it reads.** It exempts
  "sites designed to allow user-generated content, such as a forum website or
  comment sections" — where the UGC *is* the product. A dealer portal bolted
  onto a marketing and editorial site is not that.
- **Enforcement is real and section-scoped.** Manual actions from May 2024
  deindexed subfolders belonging to Forbes Advisor, CNN Underscored, USA Today's
  Reviewed and WSJ Buy Side. All of those publishers had editorial processes;
  light review did not save them. The accepted remedy was removing or
  noindexing the section — which is an argument for keeping dealer pages
  somewhere cleanly separable, so a problem can be amputated.
- **The closest precedent argues for restraint.** Ahrefs' case study puts
  linktr.ee's estimated organic traffic at roughly 6.5M/month in August 2022
  falling to roughly 2.7M/month by May 2023, on a domain of millions of thin
  customer pages. Even Linktree does not push all of its pages at Google.
  (Traffic figures are Ahrefs estimates, not Linktree-reported.)
- **The industry split is not accidental.** Products whose customer pages are
  substantive commercial properties use subdomains — Substack, Shopify, Gumroad.
  Products whose pages are deliberately thin keep them on paths, and
  correspondingly do not try to rank them. A dealer sales page is on the
  Substack side of that line.

Register the dealer host as **its own Search Console property**, so a change in
dealer-page performance is visibly separate from car pages, blog and news. If the
section ever has to be amputated, that data is what makes the decision provable
rather than arguable.

`dealers` is reserved regardless, so that the path form can never be claimed as
a handle later.

### 6.3 Handle rules

Reuse `slugify()` from `sales-profile-actions.ts:12-44` — **do not write a fourth
slug normaliser.** There are already three and they disagree: profiles strip
underscores, dossiers keep them (`sales-profile-actions.ts:41` vs
`spec-actions.ts:43`), and `scripts/create-car-page.mjs:137` carries a fourth.

**Charset: lowercase `a-z`, `0-9` and hyphen. 3–40 characters. No leading,
trailing or doubled hyphen. Not all-numeric.**

- **ASCII only, deliberately.** A permissive Unicode-letter class — Cal.com's
  slugify uses `\p{L}`, which admits every script — makes a Cyrillic lookalike
  of a real dealer's or a marque's handle claimable and visually
  indistinguishable. For a business directory that is a live impersonation
  vector, and restricting to ASCII closes it outright.
- **No periods or underscores.** Periods make a handle look like a domain and
  complicate the per-dealer host; underscores vanish when a URL is underlined in
  an email.
- **Not all-numeric**, so a handle can never collide with a future numeric id
  route.

**Normalise in the field as the dealer types, rather than rejecting.** Dealer
trading names are exactly the input that breaks naive slugifiers — "Ó Briain
Motors", "Müller & Sons", "J.D. Auto". One detail worth copying from Cal.com:
keep a `forDisplayingInput` flag so a *trailing* hyphen survives while someone is
mid-word — typing "north-" on the way to "north-london-motors" should not have
the hyphen yanked out from under the caret. Strip it on save, not on keystroke.

**The reserved list is two layers with two different mechanisms.**

1. **Route collisions, generated — never hand-maintained.** Derive the list from
   the route manifest at build time and add a CI check that fails when a new
   route collides with a live handle. Hand-maintained lists drift the first time
   someone adds a route, and the failure is silent until a dealer's page shadows
   something real. The existing 19-word `RESERVED_SLUGS` has already drifted: it
   is missing `about-us`, `latest-news`, `source-cars-from`, `embed`, `motion-lab`
   and every `import-*` page. GitLab publishes its equivalent list openly and it
   is purely mechanical — `admin`, `api`, `assets`, `favicon.ico`, `robots.txt`,
   `sitemap.xml`, `.well-known` and so on
   ([GitLab: reserved names](https://docs.gitlab.com/user/reserved_names/)).
   Moving dealer pages to their own host (§6.2) shrinks this set considerably —
   handles then collide only with routes on *that* host — but the infrastructure
   names still have to be held back.
2. **A short curated hold list**, hand-written and deliberately small: generic
   high-value terms (`imports`, `jdm`, `auction`, `cars`, `providence` and
   misspellings of it) and marque names. These are reserved, not sold.

**Impersonation is solved at onboarding, not by blocklist.** No blocklist
catches every way to imitate a real business. Providence has a lever consumer
products lack: nothing is open self-serve, so a handle is only claimable by a
verified trading entity with a company or VAT number attached (§4.3). Keep a
terms clause reserving the right to reassign a handle anyway — two legitimate
dealers will eventually want the same word.

**The availability check is advisory; the unique index is the authority.**
Instant local validation first (charset, length, reserved list) with no network
call, then a debounced abortable async check, then a unique constraint at the
database with a graceful conflict message. Two dealers can pass the check
simultaneously; without the constraint one of them gets a 500 at the worst
moment in onboarding. Show five states — checking / available / taken / invalid /
reserved — and make **reserved read differently from taken**, so a dealer does
not go hunting for a phantom owner. Offer suggestions when taken: generic names
collide constantly in this trade, and nudging "citymotors" toward
"citymotors-leeds" also produces handles that read as real businesses. The
dossier editor's `{conflict, slug, suggestedSlug}` return plus a `forceSlug`
retry (`spec-actions.ts:100-124`) is a better model than the profile editor's
flat rejection.

### 6.4 Two defects the template will otherwise pass on

**Renaming a handle 404s every existing link.** There is no `previousSlug` column,
no alias table, no catch-all rewrite and no middleware. The profile editor's
entire mitigation is hint text reading "Changing this breaks old links." A
dealer's handle will be printed on stock lists and sent to customers, so it must
be solved here: keep an alias table of retired handles and answer them with a 308.

The governing policy, which matches what Substack and Shopify both do: **one
self-serve handle change, then support only; the old handle redirects
permanently; and a redirected handle is never released back into the pool.**
Re-issuing a handle silently hands one dealer's inbound links, bookmarks and
printed business cards to a competitor — a customer-confusion problem, and
potentially a legal one, before it is an SEO problem.

The same reasoning covers departure. Write the dormancy and exit policy into the
dealer agreement *before* launch: a suggested twelve months of no login, no edit
and no traffic, an email at ten months, then unpublish — **410, not 404**, which
drops from the index faster — and release only after a further period. On account
closure, unpublish immediately. A departed dealer's page left serving stale stock
and prices is a claim the business no longer stands behind. (Linktree runs the
same multi-signal clock at six months and reserves the right to reclaim "without
notice"; for a B2B relationship where a quiet quarter is normal, twelve months
and an advance email is the better read.)

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
- **Ship `noindex`, and make indexation something a dealer earns.** This is
  Google's own prescription for platforms hosting third-party pages: for users
  without established reputation, "consider adding the `noindex` robots `meta`
  tag on posts that come from new users", and "consider adding a `nofollow` or
  `ugc` `rel` attribute to all links in untrusted content"
  ([Google: prevent abuse](https://developers.google.com/search/docs/monitor-debug/prevent-abuse)).
  The gate: a verified trading entity, every required field present, a minimum
  count of genuinely unique words, at least one real listing with original
  photographs, and a human approval click. Store the result as a boolean on the
  dealer record feeding the page's exported `robots` — no new infrastructure,
  since per-page `robots` is already a standing requirement in `CLAUDE.md`.
  Shipping `noindex` first costs nothing; the publishers deindexed in 2024 had
  to apply exactly this remedy under duress, so doing it up front is the same
  action taken calmly.
- **`rel="ugc nofollow"` on every outbound link in dealer-authored content**,
  permanently rather than only for new accounts. It costs nothing and removes
  the "link scheme" reading of the feature entirely.
- **A fixed template with a themeable shell, never a free-form builder.**
  Dealers control facts that are theirs — name, logo, photographs, stock,
  coverage area, opening hours, contact — plus a small palette of colour and
  layout choices. No free-form HTML, no arbitrary heading structure, no
  unmoderated outbound links. Two reasons beyond consistency. First, **a fixed
  schema is checkable and free-form HTML is not**, which is what makes the
  quality gate above enforceable at all. Second, and more important here:
  **dealers must not author copy about import duty, VAT, registration tax or
  delivery timelines.** Providence's own standing rules forbid inventing a tax
  or duty figure and forbid blanket door-to-door claims (`business-context.md`
  §4, `writing-angle.md` §2) — and a partner-authored page under our domain and
  our brand is the single most likely place those rules get broken.
- **Force real differentiation, or accept the pages are not a search asset.**
  Two hundred pages differing only by town name is the doorway and scaled-content
  pattern Google names explicitly, and it is what a fixed template invites.
  Either each page carries the dealer's actual stock and photographs — in which
  case index the ones that clear the gate — or the pages are a customer-facing
  utility and stay `noindex`. A "generate my dealer profile with AI" button would
  land squarely inside Google's named scaled-content examples; it is out of scope
  by design.
- **Self-canonical, always.** Each page declares an absolute canonical to itself
  on the chosen host. Pointing dealer pages at a hub to consolidate authority
  does not work — Google treats canonical as a hint and ignores obviously wrong
  ones — and a retired handle is a 301, never a canonical.

### 6.6 Attribution from the page

An inquiry submitted on `dealers.providenceauto.co.uk/<handle>` must land in that dealer's CRM. The
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
This is partner-authored content on a Providence domain, and **every listing is
reviewed by a person before it goes live — every time, not just a new dealer's
first batch** (Decision 9). So it carries a moderation state (`draft` /
`pending` / `live` / `rejected`), a queue, and a takedown path.

That is a standing operational load which grows with every dealer, and it is
worth being clear-eyed about: it is also what makes the `noindex` quality gate
in §6.5 enforceable, and what brings these pages closest to the "sufficient
input, editorial oversight, or contribution from the host site" test that
Google's site reputation policy actually applies. Given Decision 2 put dealer
pages on the main domain, that matters more here than it would on a separate
host.

### 8.2 Where they render

- **On the dealer's landing page** — two clearly labelled groups. A buyer must be able to
  tell "sourced to order by Providence" from "in this dealer's stock now", because
  the first is an import lead and the second is a local sale. Blurring them would
  be a claim the business cannot stand behind, and it is the kind of over-claim
  `business-context.md` §4 exists to prevent.
- **Below the embedded form**, in the widget on the dealer's own site — the same
  two groups, in the dealer's accent, with height reported through the resize
  protocol fixed in §7.1.

### 8.3 Structured data

**Do not build against Google's Vehicle Listing structured data.** That feature
was retired on 12 June 2025 and its documentation removed in September 2025 —
there is no rich result and no Search Console reporting, and Google stated the
change does not affect ranking. It was US and English-only anyway, and
explicitly excluded vehicle auctions and auction pricing, so it never fitted an
import sourcing business. Anything written before mid-2025 — tutorials, schema
generator sites, AI answers — still describes it as live.

Emit schema.org `Car` / `Vehicle` JSON-LD anyway, using the archived property
list as the field shape, but justify it as AEO and non-Google-consumer work
rather than as a rich-result play. Two field notes: make
`vehicleIdentificationNumber` optional, since pre-purchase auction stock often
has a chassis number rather than an allocated VIN; and omit `offers.price`
entirely on `isUpcoming` dossiers.

The codebase already has five hand-rolled copies of the same
`dangerouslySetInnerHTML` JSON-LD boilerplate; a sixth should not be typed by
hand — extract a helper.

---

## 9. Build order

Each phase is shippable and leaves the system in a coherent state. The order is
driven by dependency, not by visibility — the phases that show up in a demo are
the last ones.

**Phases 0 and 1 ship together as Release 1** (Decision 4). Phase 0 on its own
has nothing to demonstrate, so pairing it with accounts and approval means the
first release ends with a working application flow rather than an invisible
refactor. The dependency still holds inside the release: none of Phase 1's
surfaces open to an external dealer until §2.8 passes. Note also that most of
Phase 0 fixes holes that are live on production today, dealers or not.

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
- [ ] `src/db/tenant.ts` — the scoped data-access layer, with the Biome
      `no-restricted-imports` rule enforcing it (§3.5)
- [ ] The cross-tenant denial matrix as a required CI job against a real Postgres

### Phase 1 — accounts and approval (requirement 1)

- [ ] SQL: `dealerAccount`, `dealerRequirement`, plus the plugin's own tables;
      backfill the two
      existing dev rows; per-environment (§3.4)
- [ ] Install and configure the Better-Auth Organization plugin, with the
      singular→plural table mapping and the defensive invitation settings (§5.6)
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
- [ ] ADF XML lead feed, and the endpoint configuration UI (§5.8) — **before**
      the portal CRM screens
- [ ] Dealer notifications over a read-receipted channel, with the 15-minute
      first-response target instrumented (§5.7)

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

- [ ] DNS, wildcard certificate and Railway config for the dealer host (§6.2)
- [ ] SQL: handle, published flag, indexable flag, page content, alias table
- [ ] Generate the reserved-route list from the route manifest; add the CI
      collision check; add the curated hold list (§6.3)
- [ ] Handle availability check — five states, debounced, unique index behind it
- [ ] `dealers.providenceauto.co.uk/[handle]` with full metadata, self-canonical
      and JSON-LD, `force-dynamic`
- [ ] `noindex` by default; the quality gate that flips it; `rel="ugc nofollow"`
      on all dealer-authored outbound links (§6.5)
- [ ] 301 for retired handles, 308 for case variants; never re-release a handle
- [ ] Draft preview for the owner
- [ ] Fixed-template page editor — no free-form HTML, no dealer-authored tax,
      duty or delivery copy (§6.5)
- [ ] Register the dealer host as its own Search Console property
- [ ] Dormancy and departure policy written into the dealer agreement (§6.4)

### Phase 5 — listings (requirement 5)

- [ ] SQL: `dealerListing`
- [ ] Providence-stock picker, reusing `listGalleryForPicker`
- [ ] Dealer listing editor with image upload to R2
- [ ] Moderation queue
- [ ] Render on the landing page and below the embedded form
- [ ] `Vehicle` JSON-LD via a shared helper
- [ ] Resolve the `Active` / `Published` status mismatch (§8.1)

---

## 10. The questions, and the answers given

All eight were put to the business on 2026-09-09 and answered; §0 records the
decisions in short form. Each question is kept below with its full reasoning,
because the reasoning is what makes a decision reviewable later — and because
two of them (5 and 6) are answered only in the sense that they were routed to a
qualified adviser, which is not the same as being settled.

| # | Question | Answer |
|---|---|---|
| 1 | Widget colour: detected or configured | Explicit, with a one-time detected suggestion |
| 2 | Dealer page host | The path on the main domain — **against the recommendation** |
| 3 | Commercial model, and "Free Forever" | Platform free; per-vehicle price agreed offline per case |
| 4 | Accountability for dealer listings | Every listing moderated, every time |
| 5 | Joint controller under *Fashion ID* | To counsel, before the first external dealer |
| 6 | Evidencing trade status under CRA s.2(4) | To counsel, before the first external dealer |
| 7 | `business-context.md` §6 | Update it — applied |
| 8 | `business-context.md` §14.2 | Update it — applied |

Questions 5 and 6 remain genuinely open until counsel reports. Nothing in
Phase 0 or Phase 1 depends on them, but the embed (Phase 3) and the first
vehicle sale do.

**1. Does the widget auto-detect the host site's colours, or take them from
configuration?**
*Recommendation:* explicit configuration, with detection offered only as a
suggestion in the snippet builder — "we found #1a3d6b on your site, use it?" —
which the dealer confirms. Auto-detection at runtime reads a page we do not
control, produces unreadable results on hostile backgrounds, and re-themes the
form whenever the dealer restyles their site. Confirming once is more predictable
for both sides.

The research supports this unusually clearly: **no comparable product
auto-detects the host page's brand.** Calendly, Cal.com, Tally, Typeform,
HubSpot, Intercom and Turnstile all terminate in a cross-origin iframe and all
take theming explicitly — URL parameters, a JS token object, data attributes, or
settings in the vendor's own dashboard. Where their APIs say "auto" they mean the
*visitor's* OS colour-scheme preference, never the embedding site's palette. And
inside a cross-origin iframe, host-style sniffing is not even possible unless the
loader script samples the host and forwards it.

What the mature products *do* automate is contrast. Stripe exposes a derived
`accessibleColorOnColorPrimary` token that buttons use by default; Intercom
published its algorithm — clamp the customer's colour in HSL to roughly 0.95
lightness for surfaces and 0.30 for text to hold 4.5:1 — and explicitly rejected
an earlier black-text fallback because overriding the customer's colour felt
broken. That is the half to copy, and it maps onto `contrastInk` in
`src/lib/vehicle-colors.ts`, which already exists.

**2. Do dealer pages get their own host?**
The indexing half of this question is now answered by evidence rather than
judgement — `noindex` by default with an earned quality gate, per Google's own
platform guidance (§6.5). What still needs a decision is the **host**: §6.2
recommends `dealers.providenceauto.co.uk` rather than a path on the main domain,
on site-reputation-abuse grounds, and that is the one choice here that is
expensive to reverse.
*Recommendation:* take the subdomain. The operational cost is DNS, a wildcard
certificate and Railway config; the cost of the alternative is attaching
partner-authored commercial pages to the hostname carrying the car pages, blog
and news. Note that this is a judgement about risk, not a certainty: Google's
enforcement in 2024 was section-scoped, which is precisely why a separable
section is worth having.

**3. What is the commercial model, and what happens to "Free Forever"?**
`/saas` currently ends with a CTA reading **"Sign up now — Free Forever"**, and
`/b2b` offers **"Sign Up for the Platform"**. Both promise immediate self-serve
access. An approval gate contradicts them, and the commission model
(`commissionRate`, the `$500` flat-fee fallback, the bare `DEAL_CURRENCY = "USD"`)
is undocumented anywhere outside the code.
*Recommendation:* decide the model first, then rewrite both CTAs to promise
application rather than instant access. This is a factual claim about what the
business offers, so the answer belongs in `business-context.md` §6 — see
Question 7.

For a starting point, the grammar dealers already understand from Manheim and
BCA is **hybrid**: a modest access subscription plus a per-unit fee banded by
vehicle value and tiered by committed volume. Pure subscription churns in a slow
month; pure per-unit gives no predictable revenue. Auto Trader's published
average revenue per retailer (£2,995/month, FY26) is a useful ceiling anchor for
what a UK dealer already pays a platform — and sourcing is not the dealer's
primary demand channel, so the number should sit well below it.

One option worth weighing on brand grounds rather than commercial ones:
**publishing the rate card.** Manheim's own buying-costs page declines to publish
fee percentages and sends buyers to their local auction centre. Breaking that
norm is cheap, and it aligns with the position in `brand-position.md` §8 — "one
all-in landed figure before you commit anything" — rather than with a black box.

**4. Who is accountable for dealer-authored listings on our domain?**
Dealer stock rendered on `providenceauto.co.uk` is content we host and Google
attributes to us. Pricing accuracy, vehicle-condition claims and consumer-law
exposure all differ between a Providence-sourced car and a dealer's own forecourt
stock.
*Recommendation:* moderation before first publication, a standing takedown route,
and a visible per-listing attribution line naming the dealer as the seller. Legal
review before Phase 5 ships, not after.

**5. The embedded widget is very likely a joint controller arrangement, not a
processor one. Has anyone checked?**
This is the finding in this document with the widest blast radius, and it needs a
qualified adviser rather than a specification. **Nothing here is legal advice.**

The instinctive framing — Providence processes lead data on the dealer's behalf,
so sign them onto a standard Article 28 processor DPA — appears to be wrong.
*Fashion ID* (CJEU C-40/17) is close to the facts: a third-party widget embedded
on another party's site, serving both parties' commercial interests, creates
**joint controllership** over the collection and transmission of the data. A
Providence widget on a dealer's site collects leads for Providence's own
commercial purpose — that is the entire point of it — and the ICO is explicit
that you cannot be both a controller and a processor for the same processing
activity, which closes the hybrid escape route.

Four consequences, if that reading holds:

- **An Article 26 arrangement** is needed, with its main points published, and an
  agreement on who fields data subject rights requests. Agreeing that the dealer
  handles them does not discharge Providence's own obligations — all joint
  controllers remain responsible.
- **Scope it narrowly.** *Fashion ID* holds the opposite of the intuitive
  reading: joint controllership covers collection and transmission **only**, not
  what each party subsequently does. Providence is sole controller in its own
  CRM; the dealer is sole controller in theirs. An arrangement making both
  parties joint controllers for everything downstream creates obligations neither
  can perform.
- **The transparency notice goes inside the widget**, at the point of collection,
  naming Providence as a controller with its purposes, before the customer can
  submit. A link to the dealer's privacy policy in their page footer does not
  discharge this.
- **Providence needs its own lawful basis** for the collection-and-transmission
  phase, independent of the dealer's. If legitimate interests is used, write the
  assessment before launch, not after.

Also unchecked and out of this document's scope: if the widget sets or reads
anything on the visitor's device, PECR applies on top of UK GDPR with its own
consent rule.

The original exit question still stands underneath all this — when a dealership
leaves, what is exported, what is deleted, what is retained. Build export and
deletion in Phase 2 while the data model is being written, and answer the
retention question in the partner terms rather than when the first dealer
leaves.

**6. How is trade status evidenced, rather than asserted?**
Under the Consumer Rights Act 2015, a limited company is never a consumer — but a
sole trader or a director buying in a personal capacity may well be one, and
s.2(4) puts the burden of **disproving** consumer status on the seller. A `role`
column reading `dealer` is not evidence.
*Recommendation:* capture trade status as evidence at application and keep it —
company number, VAT number, declared business purpose, and the trade terms
accepted, timestamped per account and ideally per order. §4.3 already collects
most of this for verification reasons; the point here is that it must be
*retained as a record*, not just checked and discarded. Keep the dealer and
consumer journeys genuinely separate — separate terms, separate forms, separate
entry points — since one widget serving both audiences is the mechanism by which
a trade sale gets recharacterised as a consumer sale. Legal review before the
first external dealer signs anything.

### Source-of-truth questions

Per `brand-position.md` §11.2, questions that would change a source-of-truth
document are raised with a recommendation, logged in that document's §11.3, and
re-raised until answered. Two are raised by this work.

**7. `business-context.md` §6 describes the dealer platform offer as immediate
self-serve.** The row reads "A dealer embeds Providence stock on their own site;
Providence sources and ships, the dealer keeps the commission" — with no
application, approval or vetting step. If requirement 1 ships, that description
becomes incomplete, and `/saas`'s "Free Forever" CTA becomes wrong.
*Recommendation:* once Question 3 is answered, update §6 to state the approval
gate and the commercial model.

**8. `business-context.md` §14.2's focus-list rule does not say whether it
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
