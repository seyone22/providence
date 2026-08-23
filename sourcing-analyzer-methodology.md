# Sourcing & Profit Analyzer — Methodology

**What the tool at `/admin/sourcing-calculator` actually does under the hood.** Every rate, formula, filter and assumption behind the landed cost, the comparable search, the margin figures and the buy/avoid verdict — written so a sales team member can defend a number to a buyer, and so an engineer can change one without breaking the rest.

The governing principle: **numbers are computed, prose is generated.** Every figure on screen comes out of a pure TypeScript function over real inputs. The AI model reads finished numbers and writes sentences about them. It never produces a price, a margin, a rate or a recommendation that the code did not already determine.

---

## 1. Where the code lives

| Concern | File |
|---|---|
| Rates, constants, landed-cost engine, reverse bid solver | `src/lib/uk-landed-cost.ts` |
| Deterministic price statistics | `src/lib/market-stats.ts` |
| Scraper client (Apify) + per-source search URLs | `src/lib/scrapers/client.ts` |
| Per-source field mapping | `src/lib/scrapers/autotrader.ts`, `src/lib/scrapers/pistonheads.ts` |
| Data hygiene + cross-source dedupe | `src/lib/scrapers/clean.ts` |
| Identity matching + comparable ranking | `src/lib/scrapers/matching.ts` |
| FX, auction-sheet extraction, market orchestration, verdict, persistence | `src/actions/sourcing-actions.ts` |
| The whole UI and the live recompute | `src/app/admin/sourcing-calculator/LandedCostClient.tsx` |
| PDF export | `src/actions/sourcing-pdf-actions.tsx` |
| Tests for the engine | `src/lib/__tests__/uk-landed-cost.test.ts` |

Rates come from the validated HMRC-based reference *"UK Tax Guide for Importing a Car"* (current 23 June 2026). Where a business directive deliberately departs from that guide, it is marked as such below and in the code.

---

## 2. The landed-cost calculation

### 2.1 CIF — what the customs value is built from

CIF ("cost, insurance and freight") is the value the car arrives at the UK border with. It is assembled **in the auction currency** (JPY by default) and only then converted to GBP:

```
CIF_currency = hammer price
             + auction & export agent fees
             + inland transport in the origin country
             + ocean freight to the UK port
             + marine insurance

CIF_GBP = CIF_currency × FX rate
```

Two defaults fill themselves in:

- **Auction & export agent fees — 7% of the hammer price** (`AUCTION_FEE_RATE`). The field auto-recalculates as the hammer price changes, until the operator types over it; from that point it stays fixed and a "Reset to 7%" link appears.
- **Ocean freight — ¥400,000 per car** (`DEFAULT_OCEAN_FREIGHT_JPY`). A per-car figure, not a container split. Editable per shipment.

Freight and insurance sit *inside* the customs value. That is the point of the CIF basis and it is why duty is not charged on the hammer price alone.

### 2.2 FX

The rate is entered as **units per GBP** (¥ per £), because that is how the desk thinks about it, and inverted internally to GBP-per-unit for the engine.

It is prefilled from the ECB daily reference rate via Frankfurter (`getGbpFxRates`, cached 24h, free, no key), with a static indicative fallback if the feed is unreachable. **This is a spot indication, not the official figure** — HMRC uses its own published *monthly* rate for the customs declaration. The field is editable for exactly that reason.

### 2.3 Customs value

```
customs value = CIF_GBP × CUSTOMS_VALUE_FRACTION      // fraction = 1
```

Duty is charged on the **full CIF value**. An earlier business directive charged it on 60% of CIF; that override has been **reverted**. The constant remains in the code as the single knob should it ever return, but it is `1` today, and the UI states that the customs value is the full CIF.

### 2.4 Customs duty

Passenger cars sit under **tariff heading 8703**. The rate is decided by the country of *manufacture* — not the port the car ships from.

| Basis | Rate | When it applies |
|---|---|---|
| `mfn` | **10%** | The default for everything |
| `japan_cepa` | 0% | Japan-built **and** a valid CEPA statement of origin is held |
| `commercial_pickup` | 22% | Reclassified commercial: single cab, no rear passenger comforts |
| `historic` | 0% | 30+ years old, substantially original, commodity code 9705 |

**The standing rule: duty starts at 10% and only ever drops to 0% for a Japanese car with the paperwork in hand.** This is a deliberate departure from the underlying guide, which also recognises EU/UK/Australia/New Zealand preferences. Those preferences are real in law, but they are not underwritten here, because a preference you cannot evidence at clearance becomes 10% on the day — and a margin built on it evaporates. Non-Japanese origins are therefore priced at 10% regardless of what documents are claimed.

Consequences in the UI:

- **The statement-of-origin question only appears when the country of manufacture is Japan** (`ORIGIN_STATEMENT_COUNTRIES`). For every other origin it is not asked, because the answer would not change the number.
- **It defaults to "No / not sure"**, so a fresh analysis prices duty at 10% until someone confirms otherwise.

Two classification rules override origin entirely: a commercial pickup is 22% whatever its origin, and a 30+ year old car is 0% under code 9705 (a *classification*, not a trade preference — which is why it survives the Japan-only rule). Historic status is auto-detected from the Year field and flagged for HMRC confirmation.

```
duty = customs value × duty rate
```

### 2.5 Import VAT — excluded

**Import VAT is not part of the landed cost in this tool.**

A VAT-registered importer reclaims import VAT as input tax. It moves cash, it does not consume margin, and carrying it into the landed figure would understate every margin the analyzer reports and reject cars that are in fact profitable. The engine's `includeVat` flag is set to `false` on this page; the breakdown, the PDF and the verdict prompt all say so explicitly rather than silently omitting a line.

The VAT machinery still exists in `uk-landed-cost.ts` (`VatBasis`, 20% standard / 5% historic / 0% relieved, charged on customs value + duty) and `includeVat` defaults to `true`. That is for consumer-facing surfaces such as `LandedCostBar`, where the buyer is a private individual who genuinely pays it. Do not delete it, and do not flip the analyzer's flag without understanding which audience the surface serves.

### 2.6 Post-border UK costs

Costs incurred *after* the customs border. Outside the customs value, inside the true landed cost.

The figures are the desk's own, taken from the **"JPY Imports Calculator" workbook**, which is the operational source of truth for what a car costs to land and register. They are two groups: base costs that land on every car, and IVA costs that land only when the car has to sit the approval test.

```
POST_BORDER_BASE_ITEMS          POST_BORDER_IVA_ITEMS
  Clearance / admin      £600     IVA inspection      £900
  UK inland transport    £300     IVA transport       £300
  DVLA registration       £55                       ──────
  Road tax (1st-yr VED)  £205     POST_BORDER_IVA   £1,200
  Miscellaneous          £200
                       ──────
  POST_BORDER_BASE     £1,360
```

| IVA required | Post-border total |
|---|---|
| Yes | **£2,560** (£1,360 + £1,200) |
| No | **£1,360** — outside the IVA scheme, an MOT does instead |

**Every line is editable per run**, and the totals are derived from the item maps rather than hard-coded, so changing a figure in `uk-landed-cost.ts` moves the default, the tests and the docs' arithmetic together.

**Whether IVA applies** defaults from age — under 10, or an unknown Year, means yes (`ivaRequiredForAge`); 10 or over means no. It is a **checkbox the operator owns**: the moment they touch it, their answer sticks and the age no longer overrides it. That matters because the real determinant is the clearance timeline, not the car's birthday.

**The near-10-year prompt.** A car bought at nine-and-a-bit years old will usually clear customs and reach registration *after* its tenth birthday, by which point the IVA requirement has already fallen away. From age 9 (`IVA_WAIVER_FROM_AGE`) the card shows a note inviting the operator to untick IVA. It is deliberately **never automatic** — it is a judgement about the shipping timeline, which only the person booking the shipment can make.

### 2.7 The total

```
total landed cost = CIF_GBP + duty + post-border total
```

(Plus VAT, for callers that include it.)

The tool's headline badge shows duty as a percentage of CIF.

---

## 3. The market search

### 3.1 Sources, and why in that order

**AutoTrader first, PistonHeads only if AutoTrader is thin.** Both run as managed Apify actors.

- **AutoTrader** (`memo23~autotrader-cheerio`) is the priority source — the deepest UK used-car pool. Its actor pushes results incrementally and takes ~100s to finish, far longer than a serverless function allows, so the client **starts the run, polls the dataset for a bounded window (~38s) and takes the partial set**. The run completes server-side regardless. A partial sample of a large pool is statistically fine; a timeout that yields nothing is not.
- **PistonHeads** (`parseforge~pistonheads-scraper`) is parametric and fast (~14s). It is only invoked when AutoTrader produced **fewer than 6 comparable matches**, so the second source costs credits only when it will actually change the answer.

Search URLs are built at **make + model level, never at trim level**. AutoTrader's derivative filter is unreliable, so the pool is deliberately kept wide and narrowed in the matching layer where the logic is ours and testable.

Two search-URL quirks are handled explicitly: AutoTrader wants `"G Class"` and `"3 Series"` with a space (hyphens return zero results) while keeping hyphens elsewhere like `"CX-5"`, so only those two families are normalised (`autoTraderModelToken`). Common make aliases are canonicalised — `benz`/`merc`/`mercedes` → `Mercedes-Benz`, `vw` → `Volkswagen`, and so on (`canonicalMake`).

### 3.2 Pre-filtering at the source

The source search is pre-filtered wider than the final match band, so the capped results page comes back dense with genuine comparables rather than needing a huge scrape:

- **Year:** ±max(3, configured year band) around the target year.
- **Mileage:** the configured mileage percentage **+ 15 percentage points** of cushion.

The precise band is applied afterwards, locally.

### 3.3 Cleaning

`cleanListings` drops anything that cannot be trusted in the statistics:

- no usable price;
- no year (the matcher needs it for the year window);
- mileage under 100 miles — these are delivery-mileage or new cars, a different market from a used import comparison.

### 3.4 Dedupe

The same physical car is routinely cross-posted on multiple sites, and a registration or VIN is rarely exposed. `dedupeListings` collapses near-duplicates heuristically: **same year, mileage within ~500 miles, price within ~£250**. First one wins.

### 3.5 Identity matching — the hard gate

`matchesIdentity` requires **both**:

- **Make** — either name contains the other after normalisation, so "Mercedes" matches "Mercedes-Benz".
- **Model** — the normalised model string appears as a phrase anywhere across the listing's make + model + trim text. This handles "G Class", "3 Series", single-letter models, and PistonHeads listings that append the trim to the model field ("Macan Turbo").

Normalisation is lowercase, punctuation to spaces, whitespace collapsed. Tokenisation deliberately **keeps single characters**, because "G", "M" and "3" are meaningful in car names.

### 3.6 Bands, trim and ranking

Listings that pass identity are then filtered by the operator's tolerances — **default ±1 year and ±20% mileage**, both editable in the UI.

**Trim is a preference, not a gate.** Distinctive trim tokens are the trim words minus the model words (so model "Macan" + edition "Macan Turbo" yields `["turbo"]`). If listings matching every trim token exist, those are used; if requiring the trim would leave nothing, the model-level set is kept instead and the result is flagged as trim-not-applied. Showing model-level comparables beats showing none.

The surviving set is ranked and the **best 10** kept (`selectTopComparables`), in strict priority order:

1. Closest year to the target.
2. Most engine/transmission tokens matched (the "refine" signal — a `3.0 V6 Automatic` target ranks a `3.0 V6` listing above a `2.0 Manual` one).
3. Closest mileage.

### 3.7 Operator override

The comparable set is editable in the UI and every figure recomputes live from it:

- **Remove** a listing that does not fit.
- **Add** any listing from the full scraped set — it is already in memory from the crawl, so pulling one in **spends no further scraper credits**.

Because the verdict prose is written against a specific set, the set is signed (sorted listing keys, hashed by join). If the set changes after a verdict, the UI says so: the figures are already current, the narrative is not, and a re-run button is offered.

---

## 4. The statistics

`computeMarketStats` is pure, deterministic and never sees an LLM.

**Outlier trimming.** With **8 or more** priced listings, the 1.5×IQR rule is applied on the pre-trim quartiles: anything below `Q1 − 1.5·IQR` or above `Q3 + 1.5·IQR` is excluded. This removes mis-priced ads, salvage, and the occasional different variant that slipped the search. Below 8 listings no trimming happens — with a small sample you cannot tell an outlier from the market. The count of excluded listings is always displayed.

From the kept set: count, min, max, mean, **median**, p25, p75, standard deviation, and an 8-bucket histogram spanning min→max. The bucket containing the landed cost is highlighted in blue on the chart, and each bucket expands into the actual listings inside it, with links.

**The median is the reference price for every margin figure**, not the mean — it is far less sensitive to one absurd asking price in a thin sample.

**Confidence flag.** Fewer than 5 comparables marks the analysis as thin supply / lower confidence, which cascades into the verdict (see §6).

---

## 5. Margin and the ceiling bid

### 5.1 Margin — net against net

Scraped forecourt listings are advertised **VAT-inclusive**. The landed cost on this page deliberately **excludes** import VAT (§2.5), because the importer reclaims it. Comparing a gross asking price against a net cost would overstate every margin by the VAT fraction, so the resale side has the VAT taken back out first:

```
net resale    = market median ÷ 1.2          // RESALE_VAT_DIVISOR = 1 + STANDARD_VAT_RATE
profit (PNL)  = net resale − total landed cost
ROI %         = profit ÷ total landed cost
```

Both halves of the subtraction are now net figures. **Never compare the raw median against the landed cost** — that is the single easiest way to make an unprofitable car look like a buy.

The percentage is measured **against landed cost**, not against the sale price. £5,000 on a £20,000 landed car is 25%, not 20%. Both the money figure and the percentage are displayed, colour-coded against the target, with an explicit "clears / below the target" badge, and the on-screen line shows the arithmetic ("net resale £8,792 (median £10,550 ÷ 1.2) − landed £6,649").

The dark summary panel carries the whole P&L in one column — CIF, duty, VAT (excluded), UK costs, total landed, net resale, profit and ROI, then the ceiling bid — so the decision does not require scrolling.

### 5.2 The target

```
TARGET_MARGIN_PCT = 0.30        // the standing desk minimum, and the default
clampTargetMargin(pct)          // holds any entry inside 0–200%
```

**30% ROI on landed cost is the desk minimum.** It is a business directive held in one constant — but it is also **editable per run** from a *Minimum ROI* field in the summary panel, because the right threshold is a judgement (a thin, risky car may need 35%; a quick flip may not).

Whatever it is set to, it moves **the badge, the ceiling bid, the verdict policy and the PDF together** — the client passes it to `getVerdict` and into the PDF payload rather than each surface reading the constant independently. `clampTargetMargin` guards the entry so a typo cannot silently make every car look like a buy; a non-numeric entry falls back to 30%.

### 5.3 The maximum auction price

The most useful number in the room is not the margin on a bid already placed — it is **the biggest bid that still works**. `maxAuctionPriceForMargin` inverts the engine to produce it.

Landed cost is linear in CIF, so the inversion is exact rather than a search:

```
landed budget      = net resale (median ÷ 1.2) ÷ (1 + target margin)
CIF multiplier     = 1 + f·d + f·(1+d)·r        // f = customs fraction, d = duty rate, r = VAT rate
max CIF (GBP)      = (landed budget − post-border total) ÷ CIF multiplier
max CIF (currency) = max CIF (GBP) ÷ FX rate
max hammer         = (max CIF (currency) − other CIF costs) ÷ (1 + auction fee rate)
```

"Other CIF costs" are inland transport, ocean freight and marine insurance — plus the auction fee itself **when the operator has typed a fixed amount**, in which case the fee rate drops to zero so the fee is not counted twice. When the fee is still auto-deriving at 7%, it stays a rate, because it scales with the very number being solved for.

The result is shown in the auction currency (the number you bid), its GBP equivalent, the landed cost it implies, and — once a hammer price is entered — **the headroom left or the amount over the ceiling**.

**A note on the workbook's version of this formula.** The spreadsheet holds duty fixed at the *actual* car's duty while solving for a lower bid, so its ceiling overshoots by roughly 0.3% and lands just under target. The solver here re-derives duty from the bid being solved for, which is why the round-trip is exact. Where the two disagree, the tool is right; `workbook parity` in `uk-landed-cost.test.ts` pins both.

If fixed costs alone exceed the landed budget, the tool says the target is **unreachable at any bid** rather than printing a negative or a zero. Tests round-trip the solver back through `computeLandedCost` and assert the margin lands exactly on target, with and without VAT.

---

## 6. The verdict

### 6.1 Division of labour

The AI (Gemini) is handed a block of **already-computed facts** and asked for four things only: a recommendation enum, a headline, 2–4 sentences of reasoning, and a confidence level. Response schema is enforced by the API (`responseSchema` with `responseMimeType: application/json`), so parsing is not a guess.

Facts supplied: the vehicle, the landed cost (with an explicit note that VAT is excluded and why), the full market statistics, the net-of-VAT resale figure and how it was derived, the profit in pounds and percent, whether it clears the run's target, the ceiling bid, and the listing count as a liquidity signal.

The margin maths is **not** recomputed server-side from the raw median — `getVerdict` takes `resaleExVatGbp` and `targetMarginPct` from the client, so the prose and the panel can never disagree about which numbers were compared.

### 6.2 Guardrails applied in code, after the model answers

- **The target is enforced, not requested.** A car below the run's target can never come back as "source". If the model says `source` and the margin is short, the recommendation is downgraded to `marginal` on return. The model remains free to go *lower* than that, and free to withhold `source` above target for other reasons — thin supply, a widened match, a suspicious spread.
- **Widened match caps confidence.** Fewer than 5 comparables means fewer exact matches, so `high` confidence is downgraded to `medium`.

The stored `Verdict` therefore always carries `grossMargin`, `marginPct`, `targetMarginPct` and `meetsTarget` alongside the prose — the numbers travel with the narrative, so a saved analysis can be re-audited later without re-running anything.

### 6.3 Recommendation vocabulary

| Verdict | Meaning |
|---|---|
| **source** | Clears 30% with reasonable confidence in the comparables |
| **marginal** | Short of 30% but close, or at/above it with thin supply, low confidence or a widened match |
| **avoid** | Far short of 30%, or negative once reconditioning, selling time and negotiation are allowed for |

---

## 7. Auction-sheet extraction

Uploading a Japanese auction sheet (image or PDF) sends it to Gemini multimodally with a schema-constrained prompt, and pre-fills the vehicle fields: make, model, trim/grade, chassis code, Western year (Japanese era converted — H28/12 → December 2016, R6 → 2024), mileage in km **and** miles, displacement, fuel, drivetrain, transmission, seats, colour, auction grade, interior grade, features and inspector condition notes.

Rules the extractor operates under:

- Anything it cannot read with confidence comes back `null` for a human to fill.
- **It never reads or infers a price.** Auction cost is always entered by the operator.
- The km→miles conversion is re-derived in code if the model omits it.
- Everything it extracts is presented as "Extracted — please verify". It is a typing shortcut, not a source of truth.

Model fallback: `gemini-2.5-flash` → `gemini-2.5-flash-lite` → `gemini-flash-lite-latest`, with one quick retry on a 503 (transient overload) and an immediate move to the next model on a 429 (quota). Both the extraction and the verdict share this path.

---

## 8. Standing assumptions

Every one of these is a stated assumption, not a fact about a specific car. They are listed here so a reviewer can attack them directly.

1. **The market median is the achievable resale price.** In practice a dealer rarely gets the full median — there is haggling, prep and time-to-sell. The verdict prompt is told to allow headroom for this; the margin figure itself is not discounted for it.
   - **The car resells at the standard 20% VAT rate.** The net resale figure is a flat median ÷ 1.2. A margin-scheme sale (VAT on the profit only, not the full price) would earn more than the tool credits, so the figure is conservative rather than wrong.
2. **Reconditioning is not in the landed cost.** No paint, no tyres, no service, no warranty provision. A car needing work is worse than the number says.
3. **Selling costs are not in the landed cost.** No advertising, no forecourt time, no finance commission clawback.
4. **The importer is VAT-registered and reclaims import VAT.** If that is ever untrue, the landed figure is understated by roughly 20% of (CIF + duty) and the tool must be reconfigured.
5. **The FX rate is a spot indication.** HMRC's monthly rate governs the actual declaration.
6. **Duty rate is the desk's conservative reading, not a tariff lookup.** Confirm against the live UK Trade Tariff at the 10-digit commodity code before committing.
7. **Post-border figures are business estimates**, not quotes from a clearing agent.
8. **Vehicle age is calendar-year arithmetic** — current year minus the Year field. It does not know the registration month, which is exactly why the IVA decision near the 10-year mark is a human one.
9. **Scraped listings are asking prices, not sold prices.** Asking prices run above transaction prices, and AutoTrader exposes no ad-posted date, so time-on-market cannot be measured. Listing count is the only liquidity signal available.
10. **The comparable set is a snapshot.** Re-running tomorrow can legitimately give a different answer.
11. **Partial AutoTrader results are accepted by design** (see §3.1). The sample is not the whole pool.

---

## 9. Failure modes worth recognising

| Symptom | Usual cause |
|---|---|
| "Market scraper is blocked… monthly usage limit" | The Apify account cap. Raise it in the Apify console — this is not a code bug. See memory `apify-free-tier-cap`. |
| "GEMINI_API_KEY / APIFY_TOKEN is not configured" | The key is set locally but missing on that Railway service. |
| Listings scraped, none matched | The year or mileage band is too tight. A year band of ±0 matches the exact year only. Widen, or add listings manually from the scraped set. |
| Verdict prose disagrees with the figures on screen | The comparable set was edited after the verdict ran. The banner says so; re-run it. |
| Zero results for a Mercedes or BMW model | A model-token quirk in the search URL. `autoTraderModelToken` covers the *Class* and *Series* families; a new pattern may need adding. |

---

## 10. Credit usage

Both paid dependencies are metered in the UI, always visible — the point of a remaining-balance meter is to see it *before* spending.

- **Gemini tokens** are read from `usageMetadata.totalTokenCount` on each response, which costs nothing extra. Google publishes no per-key usage API, so the allowance has to be declared via `GEMINI_TOKEN_BUDGET`; unset simply hides the bar rather than inventing a total.
- **Apify spend and cap** are read live from `/v2/users/me/limits`, a free endpoint that consumes no actor credits.

Two AI calls exist per analysis: the auction-sheet extraction and the verdict. One or two scraper runs exist per crawl. Editing the comparable set costs nothing.
