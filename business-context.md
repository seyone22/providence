# Providence Auto — Business Context

This is the central source of truth for **what Providence Auto is and how it
operates**, as distinct from `CLAUDE.md`, which documents the codebase. Read
this before writing or editing anything customer-facing — marketing copy, a
campaign page, a blog post, a news article, sales-profile content — and before
answering a question about the business itself.

It was assembled from the codebase (the copy that is actually live, the
`config/` registries that drive it, and the standing docs below) and from the
precision corrections made across this account's working sessions — several of
which exist specifically because a claim on the site had drifted ahead of
what the business actually does. Section 11 logs those corrections and their
reasoning so the same drift doesn't happen twice.

This doc is **prose and facts**, not a copy-paste source. Don't lift sentences
from here directly into a page; write the page in that page's own voice
(§7) and cite this document for the facts, not the wording.

---

## 1. What Providence Auto is

**Providence Auto** is the trading name of **Providence Trading Limited**, a
vehicle sourcing and export group with 15+ years of trading history. It is
not a marketplace and not a broker network: it buys, inspects and ships cars
itself, through its own people, rather than subcontracting to exporters it
never speaks to.

Registered head office: 468 Church Lane, Kingsbury, London NW9 8UA, UK.

**The position, in one sentence:** Providence Auto gives you direct access to
the world's car auctions and dealer networks — plus the tools, documentation
and people on the ground to use that access with confidence. **You buy the
car; we make it possible.**

This is a deliberate move away from the concierge framing the site used until
August 2026 ("we buy your car and deliver it to your door"), for two reasons:
that framing promised more than the operation delivers (§4), and it made
Providence the hero of a transaction that belongs to the customer. The full
reasoning, the four pillars and the competitive frame are in
**`brand-position.md`**; the sentence-level rules for writing it are in
**`writing-angle.md`**. Read both before writing customer-facing copy.

## 2. How the business actually operates

The five-step pipeline, consistent across every source country:

1. **Find it** — the local team searches auction catalogues or dealer networks
   for the exact model, grade, colour and spec requested.
2. **Inspect it** — a multi-point physical inspection (engine, transmission,
   underbody, electronics, panel gaps, interior), photographed. If the car
   doesn't match its grade, it doesn't ship, and the customer isn't charged.
3. **Clear it for export** — deregistration, the export certificate with
   certified mileage, any pre-shipment inspection the destination requires
   (JEVIC, QISJ, KEBS and similar), biosecurity cleaning where needed. This is
   real: Providence's own local office is the exporter of record in every
   source country. **This is export-side clearance in the source country —
   see §4 for the separate, much narrower, import-side claim.**
4. **Load and ship it** — RoRo or container, under marine insurance, with
   milestone tracking.
5. **Land it** — one landed price quoted up front, covering the car, freight,
   marine insurance, duty, and local VAT/GST where applicable.

**Payment protection:** funds are held securely and released only once the
vehicle is confirmed, inspected and cleared for shipment — the customer sees
the inspection before Providence spends their money.

**One named consultant** owns each import from first message through to
arrival, rather than a shared inbox or round-robin handoffs.

## 3. The geography — three different lists, not one

This is the single most-corrected category of mistake on the site, because
three genuinely different claims share vocabulary ("eight countries", "we
buy", "offices"). They must not be used interchangeably.

| List | Count | What it actually means | Canonical source |
|---|---|---|---|
| **Presence** | 8 | Countries where Providence has its own people/operations teams. Includes Sri Lanka. | `OFFICE_COUNTRIES_SENTENCE`, `COUNTRY_PAGES` in `src/config/countries.ts` |
| **Source** | 7 | Countries Providence actually **buys cars in**. Presence minus Sri Lanka. | `SOURCE_COUNTRIES_SENTENCE`, `SOURCE_COUNTRY_PAGES` in `src/config/countries.ts` |
| **Destination** | 29 (as of 2026-08-25) | Markets Providence ships **to**. Includes Sri Lanka — it is both a destination market and the South-Asia operations base, and a country can be in more than one of these lists (Australia, New Zealand, Thailand and the UK are each in two). | `DESTINATION_REGIONS` in `/about-us` (`src/app/(marketing)/about-us/page.tsx`) |

**Sri Lanka specifically:** the Colombo team runs South Asia operations and
handles Sri Lanka's own (notoriously complex) import process, and we ship into
the market — but Sri Lanka is not a vehicle-manufacturing country and
Providence does not buy cars there. It belongs in the **presence** list and the
**destination** list, never the source list. Added to `DESTINATION_REGIONS` on
2026-08-25, taking the count to 29.

> **Sri Lanka has a market-specific channel policy that is not public.** It is
> recorded in `business-context.private.md` (untracked — see §14). Read that
> file before planning any campaign, ad targeting, focus list or outreach that
> involves Sri Lanka. Nothing in it is ever quoted or paraphrased into public
> copy.

**"Office" language is a presence claim, not a real-estate claim.** The site
does not have a walk-in office the public can visit in all eight presence
countries — only **London** is a registered, visitable head office. Public
copy should say "our own people/teams", not "our offices", except for the UK.
See §5.1.

**Destination-market count is a moving number.** 29 is the count on
`/about-us` as of the Sri Lanka addition (2026-08-25). It is a literal
count of `DESTINATION_REGIONS` — the page derives its own headline and stat
tile from `.length`, so they can't silently disagree with each other again.
Two other lists have **not** been reconciled to that count and are known
stale — see §9.

## 4. What Providence does *not* do — the over-claim boundary

Three service claims have been walked back this cycle because they promised
more than the business actually delivers. This is the standing rule now:

### 4.1 Customs clearance: Ireland only

**Providence directly clears customs in exactly one country: Ireland.**
Ireland's own pages say so plainly — "Ireland is the one market where we take
it the whole way" — and that is accurate. Note the boundary in §4.2 though:
clearing customs is not the same as paying the registration tax.

Everywhere else, the correct claim is **clearance support**, not direct
execution: "clearance support at Mombasa", "we support your car's clearance
through Dar es Salaam" — never "cleared through X for you" or "we clear at
X". This was wrong on the Japan and India campaign pages for nine
destinations (Kenya, Tanzania, Uganda, Mauritius, Seychelles, Trinidad &
Tobago, Jamaica, Grenada, Sri Lanka) plus a blanket "fully cleared" in each
page's empty state, all corrected 2026-08-25.

**Source-side export clearance is a different, accurate claim and is not
affected by this rule** — Providence's own office genuinely does clear cars
for *export* in Japan, the UK, Australia, India and Thailand (§2, step 3).
The distinction is direction: export clearance in the country we buy from is
real; import clearance in the country we ship to is Ireland-only.

### 4.2 Registration taxes are the owner's to pay

**Providence does not pay a customer's registration or import taxes.** VRT,
VAT and duty are charged to the *registered owner*, so the payment is made in
the customer's name — Revenue and its equivalents bill the person the car is
registered to, not the agent.

What we actually do, and what the copy may say: calculate the figure before
the customer commits, prepare and file the declarations, book the NCTS (or
equivalent) appointment, and hand over a completed, checked document pack.

Corrected across the Ireland pages on 2026-08-25, where the copy had said "we
calculate, declare and pay all three on your behalf", "VRT payment. You do
nothing", "Zero forms for you — not one" and "VRT paid".

### 4.3 Delivery: CNF, not door-to-door

Providence quotes and delivers **CNF (Cost and Freight) — to the destination
port**, not door-to-door. The last-mile handover, local registration
paperwork and customs clearance in the buyer's own country are the buyer's
responsibility everywhere except where a page explicitly says otherwise
(Ireland's NCTS registration handling; the UK's NOVA/DVLA handling — those
are real, named, in-scope services, not a general "we do the last mile").

Correct language: "marine cover on the voyage… to the port of arrival", "the
same person, from your first message to arrival", "At destination port →
Handover" (not "Delivered"). Avoid "door-to-door" as a blanket claim outside
the specific pages where it's contractually true.

### 4.4 Presence vs. visitable office

Don't say "you're welcome to visit any of our eight offices." Say Providence
has its own people/teams in eight countries, and that **London** specifically
is visitable. See §5.1 for the corrected FAQ wording.

## 5. Values

Six values, stated on `/about-us`, each with a one-line gloss written to be
concrete rather than aspirational — carry these lines exactly if quoting:

| Value | Line |
|---|---|
| **Trust** | "We earn it before we ask for anything in return. Every conversation, every car." |
| **Reliability** | "When we say we'll call, we call. When we say it's ready, it's ready." |
| **Transparency** | "No hidden fees, no small print. You see the price, the process and the people." |
| **Commitment** | "It doesn't end at handover. We're in it for every mile after the sale." |
| **Honesty** | "What the car needs, and what we'd choose ourselves. Advice over a quick sale." |
| **Relationship** | "We remember your name and what matters to you. Not a transaction — a beginning." |

### 5.1 The FAQ answer to "can I speak to someone in person?"

Current, correct wording (`src/components/faqSection.tsx`):

> "Absolutely. Our head office is in London and you're welcome to arrange a
> visit, and we have our own operations teams in Japan, the UAE, India,
> Thailand, Australia, New Zealand and Sri Lanka — with more markets added as
> our volumes grow. Wherever your car is coming from, we can jump on a video
> call so you can put a face to the name. We're real people, not a faceless
> website."

## 6. What Providence sells — the offers

**B2B and B2C open on the same proposition.** Both audiences are told, first:
*you can source cars directly from the market they come from and ship them to
your own country, and we give you the access, tools and documentation support
to do it.* Only the second line differs — B2C adds the price advantage of
cutting the dealership out (you buy at the price a dealer buys at); B2B adds
stock you don't have to floor-plan. Never open B2C with relief or B2B with
outsourcing. Full treatment in `brand-position.md` §5.


| Offer | Route | Who it's for |
|---|---|---|
| **Direct import (B2C)** | `/b2c`, `/request` | A private buyer sourcing one car for themselves. |
| **Dealer sourcing (B2B)** | `/b2b` | A dealership sourcing inventory it doesn't hold, on request. |
| **Dealer platform (SaaS)** | `/saas` | A dealer embeds Providence stock on their own site; Providence sources and ships, the dealer keeps the commission. |
| **Source-country campaigns** | `/import-japanese-cars`, `/indian-manufactured-cars`, `/japanese-luxury-cars-lhd` | Destination-picker landing pages, one per major source proposition, config in `src/config/landing-pages.ts`. |
| **Ireland-specific route** | `/import-cars-to-ireland`, `/import-japanese-cars-to-ireland`, `/ireland-cost-calculator` | Ireland gets dedicated pages because it's the one market with a full clear-customs claim and a live VRT calculator. |
| **Sales-profile pages** | `/team/[slug]` | A named consultant's personal landing page; leads assigned directly to them, bypassing round-robin. Spec: `sales-profile-spec.md`. |
| **Sourcing & Profit Analyzer** | `/admin/sourcing-calculator` | Internal tool, not customer-facing: landed cost → UK market comparables → buy/avoid verdict, used by the desk to price auction bids. Methodology: `sourcing-analyzer-methodology.md`. |

## 7. Who Providence sells to — and writes for

Two buyer/reader segments, used consistently in both marketing and editorial
copy (`news-editorial-playbook.md` §1.2):

- **The private importer / enthusiast.** Buying one car — often the most
  expensive purchase they'll make this year after property. Financially
  cautious, has read contradictory forum threads. Their real fear isn't
  "will I overpay by 5%", it's **"will this car arrive and turn out to be
  illegal, undrivable, or hit by a tax bill I didn't know existed."**
- **The dealer / dealership owner.** Buying units, thinking in margin,
  floor-plan and days-to-turn. Their fear is committing capital to stock that
  arrives into a changed rule, duty rate, or collapsed residual.

Write so both readers find their answer; if a piece only serves one, say
which in the standfirst.

**Market scope:** every right-hand-drive country on earth, plus left-hand-drive
markets *for luxury vehicles only* (`/japanese-luxury-cars-lhd`). An LHD story
about a mainstream hatchback is out of scope; an LHD story about a Lexus LX or
G-Class allocation is in scope.

## 8. Voice and language rules

These apply to every page, not just the one where a rule was introduced.

- **One heading per section** (`CLAUDE.md`, "Heading language"). The label
  becomes the subject of the sentence rather than a separate eyebrow line
  above it — no `Label:` colon-split either.
- **No filler copy.** Don't add a sub-line that restates the heading,
  describes the design, or editorialises about the company ("Six words the
  whole company is held to."). A line earns its place only if it states a
  fact a reader can act on — a price, a market count, a promise. When in
  doubt, ship the heading alone.
- **Precision over confidence.** Every claim about scale, service or
  geography should be checked against §3 and §4 before publishing — this is
  the exact category of error that has needed repeated correction.
- **News voice — "The Landed Desk"** (`news-editorial-playbook.md` §4).
  Institutional byline (Providence Auto), never a fabricated journalist.
  Numerate, anti-hype, comfortable saying "we don't know," on the reader's
  side of the table. British English, second person for the reader, first
  person plural for Providence, never first-person singular. Banned words:
  *game-changer, revolutionary, stunning, insane, jaw-dropping, epic, unlock,
  leverage, seamless, elevate*, and rhetorical-question openers. No selling
  inside article body copy — the commercial ask lives in one `Callout` at the
  end.
- **Never invent a tax, duty or registration-tax figure** — cite the revenue
  authority, date the check, add `<Disclaimer />`.
- **Never forecast a currency** — name the pair, date the level, state which
  side of the trade it favours.
- **A missing number is not a failure; a wrong number is.**

## 9. Content operations — blog, news, SEO/AEO

Two deliberately separate systems (`CLAUDE.md`, "Editorial: blog vs news"):

- **`/blog`** — evergreen how-to guides in keyword clusters (`src/config/blog.ts`,
  `src/config/blog-countries.ts`). Country clusters currently live: Australia,
  India, Japan, New Zealand, Sri Lanka, Thailand, UAE, United Kingdom. Gets
  updated, does not age.
- **`/latest-news`** — dated reporting: new-model releases, industry moves,
  auction results, market data, tax/policy changes. Categories: Releases,
  Industry, Auctions, Market, Policy & Tax, Providence. Ages, feeds Google
  News. Full spec, voice, relevance gate and fact-checking protocol:
  `news-editorial-playbook.md`. Journalistic instincts live in that doc's §2
  (the relevance gate — a story publishes only if it changes price,
  permission, tax or availability *and* changes reader behaviour) and §6 (the
  fact-checking protocol: source tiers, checks in order, uncertainty
  published rather than hidden, corrections).
- **Every new page** — marketing, campaign, car, blog or news — runs through
  the Phase 1–5 process and pre-publish checklist in
  `seo-aeo-optimization-guide.md`: user intent → keyword/entity research →
  on-page copywriting → technical SEO/structured-data → AEO/LLM
  optimisation. `CLAUDE.md`'s "SEO & AEO" section lists the non-negotiable
  minimum (title tag, meta description, OG image with real dimensions,
  canonical, JSON-LD, one H1, a 40–50 word AEO direct-answer block, explicit
  `robots` metadata).

## 10. The Sourcing & Profit Analyzer — business logic summary

Internal admin tool, not public copy, but the numbers it produces should never
be quoted publicly without the caveats below. Full methodology:
`sourcing-analyzer-methodology.md`.

- **Duty defaults to 10% MFN**; 0% only for Japan-built cars with a CEPA
  statement of origin.
- **Import VAT is excluded** from the landed cost the tool optimises against
  — the importer reclaims it — but resale is scraped **VAT-inclusive**, so
  the market median is divided by 1.2 before any profit or ROI figure is
  derived. Never compare a raw median against the landed cost.
- **30% ROI on landed cost is the desk minimum and default** (`TARGET_MARGIN_PCT`),
  editable per run, enforced in code after the AI model answers — a car below
  target can never come back as "source".
- **Verdict vocabulary:** `source` (clears 30% with reasonable comparable
  confidence), `marginal` (short of 30% but close, or thin supply/low
  confidence), `avoid` (far short, or negative once reconditioning and
  selling costs are allowed for).
- The AI narrates finished numbers; it never computes a price, rate or
  margin — that's always a pure function in `src/lib/uk-landed-cost.ts` /
  `src/lib/market-stats.ts`.

## 11. Business decisions and their reasoning (a running log)

Kept here because "why" is easy to lose once the code is fixed. Add to this,
don't just fix the copy silently.

| Date | Decision | Why |
|---|---|---|
| 2026-08-23 | Sri Lanka and the Maldives removed from the "Where we deliver" Asia-Pacific group; region lists gained Pakistan, Bangladesh, Nepal, Singapore, Tanzania, Mauritius, Seychelles | Sri Lanka is a presence country, not a destination-region entry, and the destination lists were incomplete against what the business actually ships to. |
| 2026-08-24 | "Offices in eight countries" language replaced with "presence" across ~33 files; global FAQ stopped inviting a visit to "any of our eight offices" | Only London is a visitable, registered office. Inviting a visit to all eight overstated a real-estate footprint the business doesn't have. |
| 2026-08-24 | `/about-us` voyage rail changed from "Customs cleared → Delivered" to "At destination port → Handover"; "door-to-door marine insurance" changed to "marine cover… to the port of arrival" | Providence ships CNF, not door-to-door; the last leg past the destination port isn't Providence's to promise. |
| 2026-08-24 | Sri Lanka removed from the `/source-cars-from` sourcing hub, its structured data, and every "we buy in eight countries" sentence; corrected to seven | Sri Lanka is a destination/operations market, not somewhere Providence buys cars. The exclusion had been hand-written per call site and was missing from the hub itself — now centralised as `SOURCE_COUNTRY_PAGES` in `src/config/countries.ts`. |
| 2026-08-25 | Botswana and Germany added to the destinations list; destination count moved 26 → 28 | Both markets are already quoted (request-form dialling codes, admin destination list); the public list was behind reality. |
| 2026-08-25 | Nine destinations on the Japan and India campaign pages, plus each page's empty-state headline, changed from "cleared through X for you" / "fully cleared" to "clearance support at X" | Providence clears customs directly in Ireland only. Elsewhere the business supports the local clearance process; it doesn't execute it. |
| 2026-08-25 | Repositioned from concierge to direct access; `brand-position.md` and `writing-angle.md` created | "We handle everything" kept generating over-claims because the frame requires them. "You buy, we enable" makes the CNF and Ireland-only boundaries features rather than footnotes. |
| 2026-08-25 | Every "we pay your VRT / VRT payment / zero forms / nothing more to do" claim removed from the Ireland pages | VRT and import charges are levied on the **registered owner**, so they are paid in the customer's name. Providence calculates them up front, prepares and files the declarations and books the NCTS appointment — but cannot pay them on the customer's behalf. |
| 2026-08-25 | Second, wider repositioning sweep: /b2c ("White-Glove Logistics", "Mastery of Tax Law"), /b2b ("We Handle the Hard Stuff"), /request ("our concierge will handle"), the gallery ("Our team handles all … customs clearances", "True white-glove service") and the home page ("It arrives cleared") | The first pass swept seven files and missed the rest, so the repositioning did not visibly land. This is why `brand-position.md` §11.1 now says to read the docs every time rather than when in doubt. |
| 2026-08-25 | B2B and B2C fixed to open on one shared value proposition, with the audience-specific advantage second | Splitting the message at the top produced two different brands on one site. |
| 2026-08-25 | /b2c headline changed to "Buy Your Dream Car from Any Market" and given the globe, process rail and odometer counters | The page asserted global reach in prose but showed none of it; the animated elements are the proof, and the headline generalises the Japan page's unlock to every source market. |
| 2026-08-25 | `news-editorial-playbook.md` §1.1 reconciled: 21 → 28 destinations, source markets restated as seven with presence stated separately as eight, and the "eight countries" claims in §3 and §4.1 corrected to seven | It is a source of truth for the news desk and was still carrying the pre-correction geography. The destination table now names `DESTINATION_REGIONS` as canonical so the two cannot drift apart silently. |
| 2026-08-25 | Sri Lanka added to `DESTINATION_REGIONS` (28 → 29 destinations) | It is demonstrably a market we ship into — its own country page calls it "primarily a destination market for us", and both the Japan and India campaign pickers route there. `ca58b48` had removed it on the reasoning that it is a presence country, but presence and destination are not mutually exclusive. Resolves the contradiction logged in `brand-position.md` §11.3. |
| 2026-08-25 | Sri Lanka's channel policy recorded in `business-context.private.md` (untracked) rather than here | The repository is public. The policy concerns dealer relationships, and publishing it would be visible to the dealers it concerns and to competitors. |
| 2026-08-25 | The persist-until-answered rule narrowed to **source-of-truth documents only** | As first written it covered any recommendation, which is not what was asked and would have turned every passing suggestion into a standing obligation. Ordinary suggestions are raised once and dropped if not taken up; only a pending change to a documented truth persists. |

## 12. Known documentation to reconcile

Flagged, not silently rewritten — these are lower-stakes internal docs (not
live site copy) and each needs its own review pass rather than a blind
find-and-replace:

- **`news-editorial-playbook.md` §1.1** still states "21 destinations" and
  lists source markets as the eight-country *presence* set (including Sri
  Lanka) rather than the seven-country *source* set. Both are now stale
  against §3 of this document.
- **`src/config/globe.ts`** (the animated globe on `/about-us`) has its own,
  older `GLOBE_PLACES` destination list (16 entries) that has not been
  reconciled to the 28-market `DESTINATION_REGIONS` list it sits next to on
  the same page. The file's own header comment already documents that the
  two are deliberately decoupled — but 16 vs 28 is a bigger gap than that
  comment anticipated.

## 13. Document map — where everything else lives

| Doc | Covers |
|---|---|
| `CLAUDE.md` | Codebase architecture, commands, route structure, data layer — read this for *how the site is built*. |
| **`business-context.md`** (this file) | What the business is, does, and claims — read this for *what the site should say*. |
| `brand-position.md` | The position itself: access-plus-capability, the four pillars, what we are not, the competitive frame, boilerplate. Read for *what we stand for*. |
| `writing-angle.md` | The sentence-level rules that carry the position: the subject test, banned concierge phrasing, rewrite patterns, the pre-publish check. Read for *how to phrase it*. |
| `sourcing-analyzer-methodology.md` | The admin Sourcing & Profit Analyzer: landed-cost formula, market-comparable pipeline, margin/verdict logic. |
| `news-editorial-playbook.md` | `/latest-news` — market/reader definitions, the relevance gate, the seven landed-cost lenses, "The Landed Desk" voice, SEO/AEO spec, fact-checking protocol, the weekly 20-story slate. |
| `seo-aeo-optimization-guide.md` | The SEO/AEO process every new page runs through, Phase 1–5, plus the pre-publish checklist. |
| `sales-profile-spec.md` | `/team/[slug]` sales-profile pages — data model, lead assignment, admin editor. |
| `indian-manufactured-cars-content-pack.md` | The `/indian-manufactured-cars` campaign page and its companion blog post, as a worked content-pack example. |
| `~/.claude/.../memory/*.md` (this account's persistent memory) | Narrower, dated operational lessons — deploy verification gotchas, formula sources, feedback on how this user likes to work. Several are linked inline above where directly relevant; browse the index (`MEMORY.md`) for the rest. |

---

## 14. Private context — and why this file is not the place for it

**This repository is public** (`github.com/seyone22/providence`). Everything
in this document is readable by customers, dealers and competitors, so it
carries only what we are content to have them read.

Commercial reasoning that would damage a relationship or hand a competitor an
advantage lives in **`business-context.private.md`**, which is untracked via
`.gitignore` and never committed. It currently holds the Sri Lanka channel
policy and the focus-list rule that follows from it.

**Read the private file before** planning a campaign, choosing ad targeting,
building any list of "focus" or "top" markets, or answering a question about
which markets we sell to and how. Its contents are decision inputs only —
they never become a sentence in public copy, an ad, an email or a chat reply.

If it is missing (a fresh clone will not have it), the same content is in this
account's Claude Code memory under `sri-lanka-dealer-channel-only`.

---

**Maintaining this document.** Update §3 and §11 whenever a geography or
service claim changes — those are the two sections that have drifted before.
When CLAUDE.md gains a new "before you do X, read Y" rule for a business
(not code) reason, add a pointer here too, in §13.
