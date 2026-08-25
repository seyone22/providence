# Providence Auto — News Editorial Playbook

**The doctrine behind `/latest-news`.** What we cover, what we refuse to cover, the lenses we read every story through, the character that writes them, and the fact-checking gate every claim must pass before it publishes.

This is the reference document. The repeatable weekly run that turns it into 20 publish-ready stories lives in `.claude/skills/news-desk/SKILL.md` — invoke it with `/news-desk`.

---

## 1. Who we are writing for

### 1.1 The market

**Destination markets — where the cars land.** Every right-hand-drive country on earth, plus left-hand-drive markets *for luxury vehicles only*.

The 29 destinations we already hold country assets for, and therefore our priority list. This table mirrors `DESTINATION_REGIONS` in `src/app/(marketing)/about-us/page.tsx`, which is canonical — if the two ever disagree, the code is right and this needs updating.

| Region | Markets |
|---|---|
| Europe | Ireland, United Kingdom, Germany, Malta, Cyprus, Jersey |
| Africa | Kenya, Uganda, Zimbabwe, Botswana, Tanzania, Mauritius, Seychelles |
| Caribbean | Jamaica, Trinidad and Tobago, Barbados, Guyana, Bahamas |
| Asia-Pacific | Australia, New Zealand, Hong Kong, Malaysia, Indonesia, Thailand, Pakistan, Bangladesh, Nepal, Singapore, Sri Lanka |

Germany is a destination for **luxury LHD only**, per the exception below.

**Sri Lanka is in scope and should be covered actively** — it has a full blog cluster, a country page and one of the most volatile import regimes we track, which makes it high-value editorial. Write it for both readers per §1.2, and lean on the multi-unit angle at least as hard as the single-car one.

Some markets carry commercial policy that shapes what we promote there without changing what we cover. That policy lives in `business-context.private.md` (untracked, internal) — check it before planning campaign-adjacent coverage, and never restate any of it in an article.

**LHD exception.** We serve left-hand-drive markets only where the vehicle is luxury — this is the `/japanese-luxury-cars-lhd` proposition. A story about a mainstream LHD hatchback in Germany is out of scope. A story about LHD-market allocation of a Lexus LX or a G-Class is in scope.

**Source markets — where we buy.** We buy in **seven** countries — Japan, the United Kingdom, the UAE, India, Thailand, Australia and New Zealand — with reach into 40+ (retail) / 100+ (dealer) markets. Our structural advantage is that when one source market closes, we can price the same car out of another. That advantage should be visible in the copy.

**Presence is a different list from sourcing, and the two must not be swapped.** We have our own people in **eight** countries — the seven above plus **Sri Lanka**, which is a South Asia operations base and a destination market, not somewhere we buy cars. Say "our own teams in eight countries" for presence and "we buy in seven countries" for sourcing. Note also that presence is *not* a claim to a visitable office: only London is that. See `business-context.md` §3.

### 1.2 The two readers

Write every story so both find their answer. If only one does, say which one in the standfirst.

**Reader A — the private importer / enthusiast.**
Buying one car, possibly the most expensive thing they will buy this year after property. Emotionally invested, financially cautious. Has read forum threads that contradict each other. Their fear is not "will I overpay by 5%" — it is **"will this car arrive and turn out to be illegal, undrivable, or hit by a tax bill I didn't know existed."**

What they need from a story: does this apply to my country, does it change my number, is my car still allowed in, and do I need to move now.

**Reader B — the dealer / dealership owner.**
Buying units, not a unit. Thinks in margin, floor-plan, days-to-turn and shipment timing. Already imports or is deciding whether to start. Their fear is **committing capital to stock that arrives into a changed rule, a changed duty rate, or a collapsed residual.**

What they need: volume signal, lead-time risk, which spec to commit to, and what the change does to landed cost per unit at scale.

---

## 2. The relevance gate

### 2.1 The Landed-Cost Test

A story publishes only if we can answer **yes** to at least one:

1. **Price** — does this change what a car costs to buy, ship, or land? **Currency counts here.** A move in a source or destination currency changes the landed cost of every car in that corridor without a single price tag changing.
2. **Permission** — does this change what may legally be imported, by whom, at what age or spec?
3. **Tax** — does this change duty, VAT/GST, excise, or registration tax in a market we serve?
4. **Availability** — does this change what exists to buy: launches, discontinuations, allocation, plant or export capacity?

**And** yes to at least one of:

5. **Audience** — does a private importer or a dealer in one of our destination markets act differently after reading it?

A story that passes 1–4 but fails 5 is trade trivia. A story that passes 5 only because we can bolt a CTA onto it fails.

### 2.2 What we do not cover

Be ruthless here. A news section that publishes everything ranks for nothing and reads like a content farm.

**Automatic reject:**

- **Motorsport results.** F1, WRC, Le Mans finishing order. Exception: a homologation road car, or a rule change that produces one.
- **LHD-only vehicles that are not luxury.** A US-market pickup that will never be RHD and is not a luxury LHD candidate is not our story.
- **Recalls and safety notices for models never sold in RHD markets.**
- **Celebrity and influencer car content.** No market read, no landed cost, no reason.
- **Concept cars with no announced production path.** We cover the concept only when it previews a model we will be asked to source.
- **Autonomy and software futurism.** Robotaxi funding rounds do not move a landed cost.
- **Charging-infrastructure news in markets we do not serve.**
- **Manufacturer quarterly financials** — unless the story is a production, allocation or plant consequence.
- **Local traffic law, speed limits, road safety campaigns.**
- **Anything where the only Providence angle is "and we can import cars for you."** If the lens is a CTA, there is no lens.

**Handle with care (publishable, but only with a hard local angle):**

- **EU-only policy.** Most of our destinations are outside the EU. An EU regulation is our story when it changes *supply out of Europe* or hits Ireland/Malta/Cyprus directly — not because it is automotive news.
- **US market news.** In scope when it moves global production, luxury LHD allocation, or the used-export pool. Otherwise out.
- **China domestic news.** In scope via export volumes, tariffs, and the RHD models Chinese makers are now building.

### 2.3 Priority scoring

When more than 20 candidates pass the gate, rank by:

| Factor | Weight |
|---|---|
| Number of our destination markets directly affected | ×3 |
| Changes a number the reader will actually pay | ×3 |
| Has a deadline or a window that closes | ×2 |
| Affects a source market where we hold an office | ×2 |
| Search demand exists and is unmet by a good page | ×2 |
| Only we can write it (trade knowledge, not press release) | ×2 |
| Freshness — breaking within 72 hours | ×1 |

---

## 3. The lenses

**This is the section that matters most.** Anyone can rewrite a press release. Our entire differentiation is that we read every story back to a landed cost in a specific country.

Every article must run through **the Landed-Cost Lens (mandatory) plus at least two others.** State them in the outline before writing a word.

**The Currency lens is mandatory whenever a story quotes a price in a currency the reader does not pay in** — which is most of them. A foreign price without its currency context is not information.

### Lens 1 — Landed Cost *(mandatory on every story)*

> "What does this do to the number on my driveway?"

Never publish a foreign price without translating it into what it means landed. A €550,000 list price in Italy is not information to a buyer in Nairobi or Auckland — the duty, the tax base and the freight are the information.

**Rules:**
- Any price stated in a foreign currency gets context for the reader's side.
- Distinguish **purchase price** from **landed cost** every single time. They are different words and we never blur them.
- Where a change is quantifiable, quantify it per unit. "Duty rises 5 points" is weak. "Roughly €1,900 more on a €38,000 car, before VAT" is the story.
- If we cannot quantify it, say so and say what would have to be known to quantify it.

### Lens 2 — Currency & FX

> "Which way did the exchange rate move, and which side of my transaction was it on?"

Currency is the largest single variable in import pricing and the one buyers understand worst. A 10% move in a source currency does more to a landed cost than most tax changes, and it happens without any announcement.

#### The two-sided trade

An import is not one currency exposure, it is four. Getting this right is the whole lens.

| Leg | Paid in | Effect of that currency weakening |
|---|---|---|
| Hammer price | **Source** currency — JPY, GBP, AED, INR, THB, AUD, NZD | **Good for you.** The car costs less. |
| Auction fees, inland transport, agent fees | **Source** currency | **Good for you.** |
| Ocean freight, marine insurance | Usually **USD** | Depends on your currency against the dollar. |
| Duty, VAT/GST, excise, registration tax | **Destination** currency, at the customs conversion rate | **Bad for you** if your own currency is the one falling. |

The rule in one line:

> **A weak source currency makes the car cheaper. A weak destination currency makes everything more expensive.**

The yen is the clean example, and the one readers ask about most. You bid in JPY at a Japanese auction, so when the yen falls against the euro, sterling, the Kenyan shilling or the Australian dollar, the same car costs you less in your own money. Nothing about the car changed — only the currency you converted into to buy it.

Turn it round and the story inverts. A Kenyan or Jamaican importer watching their own currency slide is paying more for every import regardless of what the yen does, because the shilling or the dollar buys fewer yen *and* the duty is assessed on a larger local-currency value. **That story is barely covered anywhere and it is directly relevant to a large part of our destination list.** Write it.

#### Three things almost every FX article gets wrong

**1. Spot is not the rate your tax is calculated at.** Duty and VAT are assessed on a value converted at the **customs authority's published rate**, which in most regimes is fixed for a period — commonly monthly — rather than tracking spot. So "the yen fell yesterday" does not reduce today's tax bill. It reduces what you pay the seller immediately, and reaches your duty calculation only when the customs rate next resets. Always separate the two. Verify the mechanism for the specific destination before describing it.

**2. Pass-through eats part of the gain.** A weak source currency attracts more foreign bidders into the same auction hall, which pushes prices up *in the source currency*. Japan in 2026 is the textbook case: the yen sits near four-decade lows while constant-quality auction prices are up roughly 15% year on year. The importer keeps the difference between the two, not the headline currency move. Never quote an FX gain as if the buyer banks all of it.

**3. Pegs mean some corridors have no FX story at all.** Several of our markets run fixed or tightly managed rates against the US dollar. In those corridors the currency is not a lever, and pretending otherwise is noise.

| Currency | Regime against USD | What it means |
|---|---|---|
| AED (UAE — source) | Pegged, 3.6725 | **You cannot get an FX discount out of Dubai independent of the dollar.** UAE sourcing competes on stock and spec, not currency. |
| BSD (Bahamas) | Pegged 1:1 | No independent FX story. |
| BBD (Barbados) | Pegged 2:1 | No independent FX story. |
| HKD (Hong Kong) | Linked band, ~7.75–7.85 | Effectively no independent FX story. |
| TTD (Trinidad & Tobago), MVR (Maldives) | Tightly managed | Treat as near-fixed; check before writing an FX angle. |
| JPY, GBP, AUD, NZD, INR, THB | Floating | Real FX stories live here. |
| KES, UGX, LKR, JMD, GYD | Floating, often volatile | The **destination-side** stories live here. |

Peg arrangements do change. Verify the regime before publishing, and date the check.

#### The recurring FX story types

These are reliable, repeatable, and nobody else in our space writes them properly:

1. **The corridor read.** "The yen just hit ¥X — here is what it does to a Land Cruiser landed in Nairobi." One car, one corridor, both currencies, a worked number.
2. **The monthly cross-market read.** All seven source currencies against the main destination currencies, with the cheapest corridor named. Highly repeatable, ages into an archive that ranks.
3. **The destination-weakness story.** For readers in Kenya, Uganda, Sri Lanka, Jamaica, Guyana — what a falling home currency does to an import already on the water.
4. **The pass-through story.** Why the currency discount did not reach your invoice.
5. **The customs-rate explainer.** Why the rate on your duty bill is not the rate on your banking app.
6. **The peg explainer.** Why UAE sourcing never gets cheaper on currency alone.

#### Rules for writing FX

- **Always name the pair and date the level.** "JPY/EUR" or "the yen against the euro", plus the date observed. Never a bare "the yen fell".
- **Always say which side of the trade it lands on.** Source or destination. Readers confuse these constantly.
- **Never forecast a currency.** We report levels, direction and mechanics. We do not predict. If we cite someone else's forecast, we attribute and date it, and we call it a forecast.
- **Show the working in both currencies.** A worked example beats a percentage — use `CostTable` or `StatGrid`.
- **Never annualise a short move** or present a single day's move as a trend.
- **State the quote-to-payment gap.** FX moves between the day we quote and the day the car is paid for. That is a real risk to the reader and we say so rather than hiding it.
- **Net it against pass-through and the customs rate** before telling anyone they are better off.

### Lens 3 — Permission

> "Can this car even come in?"

The failure mode that ruins a private importer is not price, it is a car that cannot be registered. Every story touching a model, an age band, or an emissions standard must address admissibility.

Check: age limits, emissions/homologation standards, RHD/LHD legality, compliance and certification regimes, pre-shipment inspection requirements, and whether the specific model was ever type-approved for that market.

### Lens 4 — Tariff & Tax, by region

> "What does my government take, and did that just change?"

This is the lens with the highest commercial intent and the highest factual risk. **Every figure needs a primary source and a publish-date check** — see §6.

Structure to reason through, per destination:

1. **Customs duty** — rate, and on what base (usually CIF)
2. **Consumption tax** — VAT / GST, and whether it applies on duty-inclusive value
3. **Excise or luxury tax** — often engine-capacity or price-banded
4. **Registration tax** — Ireland's VRT is the archetype: charged on the authority's own valuation, not your invoice
5. **Age and emissions bars** — a hard gate that overrides all pricing
6. **Levies** — inspection, IDF, railway/development levies, environmental charges

> **The rule that catches most people:** in several of our markets the tax base is the authority's assessed value, not what you paid. Ireland assesses VRT on Revenue's OMSP; Kenya uses a published CRSP schedule. A cheap purchase does not proportionally reduce the tax. **Say this whenever it applies.**

**Research map — pointers, not values.** The table below says *where to look*, never *what the rate is*. Rates and thresholds change; nothing here may be published without verification against the primary source at publish time.

| Market | Primary authority to verify against | Volatility |
|---|---|---|
| Ireland | Revenue.ie (VRT, OMSP, VAT on imports) | High — moves at Budget |
| United Kingdom | GOV.UK / HMRC (duty, VAT, IVA, DVLA) | Medium |
| Kenya | Kenya Revenue Authority (CRSP schedule, duty, excise, VAT, age limit) | High — CRSP is re-issued |
| Australia | Dept of Infrastructure (Road Vehicle Standards Act, SEVS register), ATO (LCT) | Medium |
| New Zealand | NZTA / Waka Kotahi (entry certification, emissions), Customs NZ | Medium |
| Sri Lanka | Sri Lanka Customs, Dept of Motor Traffic, Central Bank notices | **Very high** — import regimes have been suspended and reopened |
| Malta / Cyprus | National registration-tax authority + EU customs code | Medium |
| Jamaica, T&T, Barbados, Guyana, Bahamas | National customs authority (age limits, CIF-based duty) | Medium |
| Hong Kong | Transport Dept, first-registration tax | Medium |
| Malaysia / Indonesia / Thailand | National customs + excise authority; AP/permit regimes | High |
| Maldives, Uganda, Zimbabwe | National revenue authority | High |

If a story turns on a rate we cannot verify from a primary source, **we publish the story without the rate** and say what we could not confirm.

### Lens 5 — Timing

> "Do I act now or wait?"

The most valuable thing we can tell a reader is when a window closes. Reliefs with end dates, tapers, consultation deadlines, model runouts, currency positions, and shipping lead times all belong here.

Always net timing against **real lead time**. A relief expiring on 31 December is not a December decision when sea freight from Japan takes weeks and registration queues take longer. Say what the actual last-safe-order date looks like.

### Lens 6 — Substitution

> "If this source closes, which one opens?"

Our eight offices exist so that a rule change in one market is a routing problem, not a dead end. When a story restricts or reprices one source, name the alternatives and what changes about them: spec differences, grade conventions, documentation, freight time, RHD availability.

This is the lens most competitors cannot write. Use it often.

### Lens 7 — Residual

> "What is this worth in three years, in my market?"

Dealers buy on exit value. New-brand entrants, battery-warranty terms, parts-network depth and model discontinuations all belong here. Be honest about uncertainty — a young brand with no depreciation history is a risk premium, and saying so builds more trust than a forecast.

### Lens 8 — Dealer Operations

> "What does this do to my floor-plan?"

Volume, allocation, container economics, days-to-turn, documentation burden, and which specification to commit capital to. Where a story is dealer-only, say so early so private readers do not wade through it.

### 3.1 The Five Doubts

> *"Focus on the questions and doubts the importer would have when they hear the story."*

Every article must explicitly answer all five. Do not imply the answers — write them. Use them as question-shaped H2s or FAQ entries, which also does the AEO work in §5.

1. **"Does this actually apply to me?"** — which countries, which vehicles, which buyers. Name the exclusions.
2. **"Is this going to cost me more?"** — a number, a direction, or an honest "not yet, and here is what would change that." Where currency is doing the work, say which currency and which side of the trade it sits on.
3. **"Is my car still legal to import?"** — admissibility, plainly. If nothing changes, say "nothing changes" — that is a real answer and readers are looking for it.
4. **"Should I move now or wait?"** — a recommendation with the reasoning shown.
5. **"Is this just news, or is someone selling me something?"** — the integrity beat. Name who benefits from the headline framing. Where the honest answer is "this does not affect you", **say that**, even though it costs us the conversion.

Doubt 5 is not decoration. It is the single most trust-building habit available to a commercial publisher, and it is why readers will come back.

---

## 4. The character: The Landed Desk

### 4.1 Byline

Articles are bylined **Providence Auto** and the editorial voice is **The Landed Desk**.

**We do not invent a fictional journalist.** No fake name, no fake headshot, no fabricated bio. Inventing a person to carry authority is a fabrication, it is an E-E-A-T liability if discovered, and it contradicts everything else in this document. The desk is institutional, and its authority comes from a verifiable claim: *we buy cars at auction every week in seven countries.* That is real, and it is stronger than a persona.

Where a specific human contributed genuine expertise — a buyer in Japan, an ops lead in the UAE — attribute it plainly and only if that person actually exists and has agreed.

### 4.2 Who the Desk is

**A trade insider who refuses to hype.**

The Desk is the person on the buying floor who has seen enough auctions to be unimpressed. It has no stake in you feeling excited, and every stake in you not losing money. It talks the way a good broker talks to a client they intend to keep for a decade: numbers first, caveats in the same breath, and a straight answer when the answer is "don't."

**Character traits, in order of importance:**

1. **Numerate by habit.** Reaches for the figure, not the adjective. A number with a source beats a paragraph of enthusiasm.
2. **Anti-hype, actively.** Corrects the distortion in the headline everyone else repeated. When the trade press says "most expensive Ferrari ever" and it is not, we say so and give the actual record.
3. **Comfortable saying "we don't know."** Publishes the unknowns as a first-class part of the story rather than papering over them.
4. **On the reader's side of the table.** Will tell you the import does not make sense. Will tell you the other source market is cheaper this month.
5. **Unimpressed by wealth, interested in mechanism.** A $40m car is interesting because of *how* the price got there, not because it is big.
6. **Dry, never zany.** Wit comes from precision and understatement. Never from exclamation marks.

### 4.3 Tone of voice

**Do:**

- British English. `£`/`€` correctly, DD Month YYYY dates, "tyre", "licence" (noun), "programme".
- **Second person for the reader** ("what you pay"), **first person plural for Providence** ("we bid in Japanese auctions every week"). Never first-person singular.
- Lead the paragraph with the point. Bury nothing.
- One idea per sentence. Short sentences for the important ones.
- State the caveat in the same sentence as the claim, not three paragraphs later.
- Use concrete nouns: "the auction sheet", "the Bill of Lading", "Revenue's OMSP" — the vocabulary of someone who has handled the paperwork.
- Address the reader's scepticism before they voice it.

**Don't:**

- **Banned words:** game-changer, revolutionary, stunning, insane, jaw-dropping, epic, unlock, leverage, seamless, elevate, "you won't believe", "here's why that matters", "in today's fast-paced".
- No exclamation marks in body copy. Ever.
- No rhetorical-question openers ("Ever wondered what it costs to import a car?").
- No hedging stacks: "may potentially possibly".
- No selling inside the article body. The commercial ask lives in one `Callout` at the end and nowhere else.
- Never call a car a "dream car" in editorial. That is marketing copy; this is the news desk.
- No fake urgency. Real deadlines only, and cite them.

**Calibration example.**

> ✗ *"Ferrari's stunning new EV has SHATTERED records at a jaw-dropping auction — and you won't believe who bought it!"*
>
> ✓ *"Ferrari Luce chassis 0 sold for $40,000,000 at RM Sotheby's Monterey on 15 August 2026 — roughly 62 times its list price. It is the most expensive new car ever auctioned. It is not the most expensive Ferrari, and it was not even the top sale of its own week."*

The second version is more interesting *because* it is more accurate. That is the whole voice in one example.

---

## 5. SEO and AEO specification

### 5.1 SEO — structural requirements

Every article ships with:

- **`seoTitle`** ≤ 60 characters where possible, primary keyword within the first 5 words, absolute (no template suffix).
- **`slug`** — lowercase, hyphenated, keyword-bearing, no dates, no stop-words. Stable forever; never rename a published slug.
- **`description`** — 150–160 characters, contains the primary keyword and a number.
- **`keywords`** — 5–9 entries: one head term, two or three mid-tail, and at least two question-shaped long-tail.
- **`toc`** — 5–8 anchors, ids matching body headings exactly.
- **`faqs`** — 4–6, each answer complete and standalone.
- **`sources`** — minimum 3, each with a real publisher name.
- **`relatedGuides`** — exactly 3 existing blog slugs. Verify they exist; a broken related-guide is a build-time landmine.
- **Internal links** — minimum 3 in body: at least one evergreen guide, at least one tool (`/ireland-cost-calculator` or `/request`), and at least one other news article where genuinely relevant.
- **`category`** — one of Auctions, Releases, Market, Policy & Tax, Industry, Providence.

**Cannibalisation rule.** Before creating a slug, check `NEWS_ARTICLES` and `BLOG_POSTS`. If an existing page targets the same primary keyword, **update that page instead of publishing a competitor to it.** Two of our own pages fighting for one term is a self-inflicted ranking loss.

**Evergreen vs news.** Guides live in `/blog` and get updated. Dated reporting lives in `/latest-news` and ages. If the piece will still be true and useful in two years unchanged, it is a guide, not news.

### 5.2 AEO — being the cited answer

Answer engines and AI search extract differently from classic search. These rules are what get us quoted.

- **Answer-first.** Under every question-shaped heading, the first 40–60 words must answer it completely, with no wind-up. Detail follows.
- **Question-shaped H2s.** Mirror how people actually ask: "Does the 2030 ban affect used imports?" not "Regulatory considerations".
- **Self-contained sentences.** Never "as mentioned above" or "this means that". Every sentence must survive being extracted alone.
- **Name entities explicitly.** Repeat "Ferrari Luce chassis 0" rather than "the car". Pronouns break extraction.
- **Tables for comparisons.** Answer engines parse tables reliably. Any comparison of 3+ items belongs in a `Table` with a caption.
- **Date and attribute every claim.** "As of 14 August 2026, according to the Department for Transport…" — extractable provenance is what makes a passage safe to quote.
- **Numbers in their own sentence**, with units and currency spelled out.
- **`KeyTakeaways` near the top** — 4–5 items, each a complete standalone statement.
- **FAQ answers 40–90 words**, each answering without reference to the article body.
- **Publish the unknowns.** The `ConfirmedLedger` component exists for this. Explicit uncertainty is a quality signal to answer engines, not a weakness.

### 5.3 Schema

Handled automatically by `/latest-news/[slug]/page.tsx` — `NewsArticle` with `speakable`, `isAccessibleForFree`, `inLanguage`, `wordCount`, `thumbnailUrl`, timezone-bearing dates, `citation[]` from `sources`, plus `BreadcrumbList` and `FAQPage`. Category archives emit `CollectionPage`.

**Your job is to populate `sources` and `faqs` properly** — those two fields are what the citation and FAQ schema are built from.

### 5.4 Distribution

- Stories inside 48 hours appear automatically in `/news-sitemap.xml` (Google News).
- All stories appear in `/latest-news/rss.xml`.
- Fresh articles are advertised `hourly` / priority 0.9 in `/sitemap.xml`, ageing to `monthly` / 0.7.

Nothing to do manually — but if a publish date is wrong, the Google News window is wrong.

---

## 6. Journalistic integrity protocol

**Non-negotiable. A story that fails any gate does not publish, or publishes without the failing claim.**

### 6.1 Source tiers

**Tier 1 — Primary. Citable alone.**
Government and revenue authorities (Revenue.ie, GOV.UK, HMRC, KRA, NZTA, customs authorities), manufacturer press releases and newsrooms, auction-house lot pages and official results, regulatory filings, central bank data.

**Tier 2 — Established trade and financial press. Citable with a second source for headline numbers.**
Hagerty, Nikkei Asia, CNBC, Reuters, Bloomberg, Autocar, Motor1, Electrek, duPont Registry, Magneto, CAR, Il Sole 24 Ore, SIMI.

**Tier 3 — Aggregators, SEO farms, AI-generated content. Never citable alone. Usually not citable at all.**

**Tier 3 red flags — if two or more are present, discard the source entirely:**
- Figures that contradict well-established records
- Internally inconsistent arithmetic
- No named author and no masthead
- Text that reads like a paraphrase of higher-tier reporting with no original detail
- Round numbers everywhere with no methodology

> **Worked example — the case that proves the rule.** While reporting Monterey 2026, one site published "$412M in total sales, a 23% increase over 2025." CNBC put the 2025 total at $432.7M — so $412M would be a *decline*, not a 23% rise. The same page listed a "$48.4M all-time auction record" when the 1955 Mercedes 300 SLR made $143M in 2022. Two independent failures. **We discarded the source and published the market report with no week total**, stating that the tally was still being reconciled. That is the standard. A missing number is not a failure; a wrong number is.

### 6.2 The checks, in order

**1. Arithmetic consistency.** Do the numbers agree with each other and with the baseline they claim to improve on? Percentages, multiples and totals get recomputed by hand. This check alone catches most content-farm output.

**2. Two-source rule.** Any figure in a headline, standfirst, `KeyTakeaways` or `StatGrid` needs two independent sources, or one Tier 1 source. "Independent" means not republishing each other — a wire story on five sites is one source.

**3. Record and superlative check.** Every "most expensive", "first ever", "biggest" gets verified against the actual record holder. Superlatives are where reporting most often goes wrong, and correcting them is a signature move of the Desk.

**4. Named-person rule.** Never assert a private individual's identity, purchase or intent without a named publisher standing behind it. Never repeat rumour as fact, and never launder it with "reports suggest". If several names circulate and none is confirmed, either name none, or name them explicitly *as unconfirmed speculation* with the reasoning shown. When an identification comes from trade reporting rather than the parties themselves, **say which** — as the Ferrari Luce piece does.

**5. Tax and duty rule.** Every tax, duty, levy or threshold figure must (a) cite a primary authority, (b) state the date it was checked, and (c) carry a `<Disclaimer />` where the reader might act on it. **Never estimate, interpolate or infer a tax rate.** If it cannot be verified, the article says the figure could not be confirmed and points at the authority. This mirrors the standing rule for the Ireland calculator: tax tables come from Revenue, never from us.

**6. Primary-document check.** Where a primary document exists — a lot page, a consultation, a press release — read it rather than the coverage of it. Coverage drops caveats.

**7. Currency and date discipline.** State the currency explicitly and name the pair. State the date any rate or price was observed — an undated FX level is worthless within a week. Never convert without saying so. **Never forecast a currency**; report the level, the direction and the mechanics, and attribute any third-party forecast as a forecast. Do not present spot as if it were the customs conversion rate, and do not quote an FX gain without netting it against pass-through.

**8. Illustrative-image rule.** Any hero image that is not the actual subject carries a `heroCaption` saying so. Licensed images carry their attribution as a condition, not a courtesy — as the CC BY-SA hero on the Ferrari piece does.

**9. Forecast labelling.** A forecast is never reported as a result. Attribute it, date it, name the forecaster, and if the outcome is known, report both.

**10. Interest disclosure.** Where we have a commercial interest in the reader's conclusion — and we usually do — the article must still argue against itself where the facts do. If the honest answer is "importing this does not make sense", print it.

### 6.3 Uncertainty is published, not hidden

Use the `ConfirmedLedger` component to split what is on the record from what is not. This is a house style, and it is why our reporting can be trusted on the stories where everyone else is guessing.

### 6.4 Corrections

- Material errors are corrected in place, `updatedDate` bumped, and a short correction note added at the point of the error.
- Never silently rewrite a claim that has been published and shared.
- Never delete an article to make an error disappear.
- When a story's central unknown becomes known, update the article and say when — the Ferrari Luce piece is the template.

---

## 7. Weekly slate: the 20-story mix

A slate of 20 identical stories ranks like one story. Fill these buckets.

| Bucket | Count | What it is | Primary reader |
|---|---|---|---|
| **Policy & Tax** | 4 | Duty, VRT/registration tax, age bars, emissions deadlines, consultations | Both — highest intent |
| **Market** | 3 | Auction indices, used values, supply and freight | Both |
| **Currency & FX** | 2 | Corridor reads, destination-currency weakness, pass-through, customs-rate mechanics | Both |
| **Releases** | 3 | Launches, facelifts, discontinuations, limited runs — always with "can it be imported" | Enthusiast |
| **Industry** | 3 | Manufacturer strategy, tariffs, plants, brand entries into RHD markets | Dealer |
| **Auctions** | 2 | Records and results, read for what they say about value | Enthusiast |
| **Destination spotlight** | 2 | One market, deep: what changed there this month | Both |
| **Explainer-hybrid** | 1 | A news hook that justifies a durable explainer | Both |

> **Buckets are planning quotas, not site categories.** Currency & FX and Destination spotlight stories publish under the existing `Market` and `Policy & Tax` categories. The six site categories in `NEWS_CATEGORIES` are fixed — do not invent a seventh to match a bucket.

**Balance rules:**

- **Source-market rotation.** No more than 40% of a slate anchored to a single source market. Japan will always dominate if unmanaged; force UAE, UK, Australia, NZ, India and Thailand into the mix.
- **Destination spread.** Across a slate, cover at least **6 distinct destination markets** by name. Ireland and the UK are the easy defaults — deliberately serve Kenya, Jamaica, New Zealand, Malta, Trinidad, Hong Kong.
- **At least 3 stories must be dealer-first.**
- **At least 2 must carry a hard deadline** the reader can act on.
- **At least 1 of the two FX stories must be written from the destination side** — a reader in Kenya, Uganda, Sri Lanka, Jamaica or Guyana watching their own currency, not a reader in Europe watching the yen.
- **Never fill both FX slots with the yen.** Rotate GBP, AUD, NZD, INR and THB corridors.
- **No more than 2 may be about cars costing over $1m.** Halo stories earn links; they do not earn enquiries.
- **At least 1 must tell the reader not to buy something.**

---

## 8. Production checklist

Each story touches exactly three files. Miss the third and the page 404s.

1. **`src/config/news.ts`** — append a `NewsArticle` entry to `NEWS_ARTICLES`.
2. **`src/content/news/<slug>.tsx`** — the body component, default-exported.
3. **`src/content/news/index.ts`** — register the slug in `NEWS_BODIES`. **This is the step that gets forgotten.**

**Before publishing:**

- [ ] Landed-Cost Lens applied, plus at least two others
- [ ] Currency lens applied if any price is quoted in a currency the reader does not pay in
- [ ] Every FX level names its pair, carries the date observed, and states which side of the trade it lands on
- [ ] No currency forecast presented as our own; pass-through and the customs-rate lag netted off any claimed gain
- [ ] All Five Doubts answered explicitly in the body or FAQs
- [ ] Every headline number two-sourced or Tier 1
- [ ] Every tax figure primary-sourced, dated, and disclaimed
- [ ] Superlatives verified against the actual record
- [ ] Arithmetic recomputed by hand
- [ ] Named individuals attributed to a named publisher
- [ ] `relatedGuides` slugs exist in `src/content/blog/`
- [ ] ≥3 internal links, including one tool
- [ ] `toc` ids match body heading ids exactly
- [ ] No banned words; no exclamation marks; no selling in the body
- [ ] Illustrative hero flagged via `heroCaption`
- [ ] No keyword cannibalisation against existing news or blog pages
- [ ] `npx tsc --noEmit` clean
- [ ] `npx biome check --write <changed paths>` — **not** `npm run format`, which rewrites ~160 unrelated files

**Component vocabulary:** `Lead`, `KeyTakeaways`, `H2`/`H3`, `P`, `UL`/`CheckLI`, `Strong`, `InlineLink`, `Callout`, `StatGrid`, `Table`, `CostTable`, `Disclaimer` from `@/components/blog/prose`; `PullQuote`, `Timeline`, `ProfileCard`, `ConfirmedLedger` from `@/components/news/newsProse`.

---

## 9. The one-line test

Before a story ships, answer this in one sentence without using the word "and":

> **A [private importer / dealer] in [country] should read this because it changes [what they pay / what they can buy / when they must act].**

If the sentence needs an "and", the story is unfocused. If it cannot be written at all, the story fails the gate in §2 and does not publish.
