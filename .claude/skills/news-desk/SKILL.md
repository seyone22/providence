---
name: news-desk
description: Research, fact-check and produce a weekly slate of 20 publish-ready news articles for /latest-news, SEO and AEO optimised, following the Providence editorial playbook. Use when the user asks to run the news desk, produce the weekly slate, write news articles, refresh latest-news, or asks "what should we publish this week".
---

# News Desk — weekly slate

Produce **20 publish-ready articles** for `/latest-news`, wired into the site and passing typecheck, lint and build.

**Read `news-editorial-playbook.md` at the repo root before doing anything else.** It is the doctrine: the relevance gate, the seven lenses, the Five Doubts, the Landed Desk character, the SEO/AEO spec and the integrity protocol. This file is only the runbook. Where the two disagree, the playbook wins.

## Arguments

- No argument → full slate of 20.
- A number (`/news-desk 5`) → that many, keeping the bucket ratios proportional.
- A theme (`/news-desk kenya`, `/news-desk tariffs`) → bias the slate to it, but still cover at least three buckets.

---

## Phase 1 — Research

Cast wide before filtering. Search across, at minimum:

- **Policy and tax** — Revenue.ie, GOV.UK/HMRC, Kenya Revenue Authority, NZTA, Australian Dept of Infrastructure, Sri Lanka Customs, national customs authorities for the Caribbean markets. Budget announcements, consultations, commencement dates.
- **Source markets** — Japan auction indices and export volumes, UK trade and auction stock, UAE re-export, India and Thailand production and export policy, Australia and NZ compliance rules.
- **Manufacturers** — launches, discontinuations, allocation, RHD programmes, plant and capacity news.
- **Market data** — freight rates, used-value indices, supply.
- **Currency** — both sides. Source currencies (JPY, GBP, AUD, NZD, INR, THB) against destination currencies (EUR, GBP, KES, UGX, LKR, JMD, GYD, MYR, IDR, AUD, NZD). Note the level **and the date observed**. Skip pegged corridors — AED, BSD, BBD and HKD have no independent FX story.
- **Auctions** — results with a genuine market read.

Aim for **35–45 candidates** so the gate has something to reject.

Record for each: headline claim, date, every source URL, and the source tier.

## Phase 2 — Gate and rank

Apply §2 of the playbook.

1. Drop anything failing the Landed-Cost Test.
2. Drop everything on the automatic-reject list — especially motorsport results, non-luxury LHD-only cars, celebrity content, and anything whose only angle is a CTA.
3. Score survivors on the §2.3 table.
4. Select 20 against the §7 bucket quotas.
5. Check the balance rules: source-market rotation ≤40% one market, ≥6 named destination markets, ≥3 dealer-first, ≥2 with a hard deadline, ≤2 about cars over $1m, ≥1 that tells the reader not to buy, and of the two FX stories ≥1 written from the destination side with no more than one anchored to the yen.
6. **Cannibalisation check** — read `src/config/news.ts` and `src/config/blog.ts`. If an existing page owns the primary keyword, update it instead of publishing a rival.

Report the slate to the user as a table before writing: title, category, lenses, primary keyword, destination markets, source count. **Do not write 20 articles before showing the slate.**

## Phase 3 — Verify

Run every check in §6.2 on every story. This phase is not optional and not compressible.

- Recompute all arithmetic by hand; reject internally inconsistent sources.
- Two independent sources for every headline number, or one Tier 1.
- Verify every superlative against the actual record holder.
- Primary-source, date and disclaim every tax figure. **Never infer a rate.**
- Read primary documents, not coverage of them.
- Named individuals need a named publisher.
- **FX:** name the pair, date the level, state which side of the trade it lands on, never forecast a currency, never present spot as the customs conversion rate, and net any claimed gain against auction pass-through. Confirm a corridor actually floats before writing an FX angle on it.

**If a claim cannot be verified, drop the claim and keep the story** — say plainly what could not be confirmed. Never fill a gap with a plausible number.

Backfill from the candidate pool if a story collapses entirely.

## Phase 4 — Write

Per the playbook's §3 lenses, §3.1 Five Doubts, §4 voice and §5 AEO rules.

Each article:
- Landed-Cost Lens plus ≥2 others, decided before drafting
- All Five Doubts answered explicitly
- Answer-first paragraphs under question-shaped H2s
- 4–6 FAQs, each standalone, 40–90 words
- ≥3 sources with real publisher names
- ≥3 internal links including one tool (`/ireland-cost-calculator` or `/request`)
- Exactly 3 `relatedGuides` — **verify each slug exists in `src/content/blog/`**
- Tables for any 3+ item comparison
- One commercial `Callout` at the end, nowhere else
- No banned words, no exclamation marks

Vary structure across the slate. Twenty articles with identical scaffolding read as generated. Use `Timeline` for chronologies, `ConfirmedLedger` where facts are contested, `CostTable` for landed-cost worked examples, `PullQuote` sparingly, `ProfileCard` only for a real named person.

Stagger `publishDate` across the week; set `updatedDate` to the publish day. Only articles inside 48 hours enter the Google News sitemap, so dates must be honest.

## Phase 5 — Wire up

For each story, all three files:

1. `src/config/news.ts` — the `NewsArticle` entry
2. `src/content/news/<slug>.tsx` — the body
3. `src/content/news/index.ts` — the `NEWS_BODIES` registration ← **most commonly forgotten**

If a story introduces a category with no existing archive, confirm it exists in `NEWS_CATEGORIES`. Empty categories 404 by design.

Hero images: reuse Unsplash IDs already present in the codebase or local `/public` assets — **do not invent Unsplash photo IDs**, they 404. Any non-subject image needs a `heroCaption` flagging it as illustrative.

## Phase 6 — Verify the build

```bash
npx tsc --noEmit
```

```bash
npx biome check --write src/config/news.ts src/content/news
```

Do **not** run `npm run format` — it rewrites ~160 unrelated files and buries the diff.

Then build and spot-check:

```bash
npm run build
```

Start the preview, confirm the index, two or three article pages and the affected category archives render, and that `/latest-news/rss.xml` and `/news-sitemap.xml` are valid.

Pre-existing conditions that are **not** your bug: two `.next` validator type errors referencing `api/v1/admin/leads/export/route`, `noArrayIndexKey` lint in `src/components/blog/prose.tsx`, and hydration warnings from the site-wide `Reveal` runtime.

## Phase 7 — Report

Give the user:

- The slate table as published
- Any story dropped in Phase 3 and why
- Any claim published with a stated caveat instead of a number
- Bucket and destination-market coverage against the §7 quotas
- Build and typecheck status

Do **not** commit or push unless asked.

---

## Standing rules

- **A missing number is not a failure. A wrong number is.**
- Never invent a tax rate, an exchange rate, a person, a quote, an Unsplash ID, or a blog slug.
- Never forecast a currency. Report the level, the direction and the mechanics.
- Never publish a superlative you have not checked against the record.
- When the honest answer is "this does not affect you", print it.
