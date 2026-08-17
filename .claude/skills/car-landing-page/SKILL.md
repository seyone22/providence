---
name: car-landing-page
description: Build a public car landing page (spec dossier) for a single vehicle from a short prompt — researching the specification from manufacturer sources, using images from a local folder or sourced online, and publishing it via a JSON brief. Use when the user asks to create a car page, add a car to the gallery, build a landing page for a model, or turn a new-model announcement into a car page.
---

# Car landing page

Turn a one-line prompt — *"make a page for the 2026 Toyota GR Yaris Circuit Pack"* — into a live page at `/b2c/gallery/<slug>`, with a real specification, real imagery, colour options, and (where relevant) a link to the news story that announced it.

## What a "car landing page" is here

It is a **spec dossier row in the `specdossier` table**, not a file in the repo. It renders through `GalleryDetailClient`, lists in `/b2c/gallery`, appears in the sitemap, and carries its own inquiry form. So you cannot create one by committing code — you either use the admin UI at `/admin/specs`, or run the seeder described below.

The seeder is the right path when you're working from a prompt, because it lets you research, assemble, review and publish in one pass.

---

## Phase 1 — Pin down the car

From the prompt, establish: **make, model, year, trim**. If any of these are ambiguous, ask before researching — building a page for the wrong trim wastes the whole run.

Then research the specification. Prefer, in this order:

1. **The manufacturer's own press release or market-specific brochure** — this is the only source that settles trim-level detail.
2. **The manufacturer's regional site for a RHD market** (UK, Japan, Australia, Ireland) — we sell RHD, so a US-spec sheet is often the wrong car.
3. **Established motoring press** for figures the manufacturer hasn't published yet.

Fill these fields where the sources support them:

| Field | Notes |
|---|---|
| `engineConfig` | e.g. `1.6L turbocharged inline-3` |
| `displacement`, `maxPower`, `maxTorque` | Quote the manufacturer's units, don't convert silently |
| `transmission`, `fuelSystem`, `steering` | `steering` is `RHD` unless the car is LHD-only |
| `emissions` | e.g. `Euro 6e` |
| `countryOfOrigin` | Where it's built, not where it's sold |
| `features` | Trim-specific hardware, 6–12 items |
| `upholstery`, `infotainment` | Standard fit for this trim |
| `exteriorColors`, `interiorColors` | The factory palette — see below |
| `valuePoints` | 3–4 `{title, description}` pairs: why this car is worth importing |
| `customData` | Anything spec-sheet-shaped the schema has no column for |

**Do not invent numbers.** A missing figure is fine — leave the field out and the page simply doesn't render that row. A wrong figure is a problem: customers quote these back at us. If a source disagrees with another, prefer the manufacturer and note the discrepancy in `notes`.

**Never state a price you haven't sourced.** `pricing` is a landed/CIF matrix per country and drives the "From £X" badge. If pricing isn't confirmed (which is normal for an upcoming car), omit `pricing` entirely rather than estimating.

### Colours

`exteriorColors` and `interiorColors` are arrays of:

```json
{ "name": "Emotional Red", "hex": "#c8102e", "isDualTone": true, "hex2": "#111111", "secondaryName": "Black roof" }
```

- `name` — the manufacturer's own colour name, verbatim.
- `hex` — your closest match to the real paint. This is a swatch, not a colour-match guarantee.
- `isDualTone` + `hex2` + `secondaryName` — for a contrast roof or two-tone cabin. `secondaryName` is what makes a lead readable ("Emotional Red / Black roof"), so always set it when `isDualTone` is true.

Whatever you list becomes the colour picker on this car's inquiry form, and the customer's choice is written onto the lead. An empty palette falls back to a free-text colour field, which is a worse lead — so populate it.

## Phase 2 — Imagery

Order of preference:

1. **A local folder the user names.** List the files, pick the best 5–8, put the strongest three-quarter front shot first (it becomes the hero). Reference them in the brief by path, relative to the brief file.
2. **Manufacturer press imagery**, where the licence permits editorial use.
3. **Stock imagery** for an upcoming model with no press pack yet.

If the image is not the actual car — a stock shot standing in for a model that hasn't been photographed — say so. Put it in `notes`, the same way `heroCaption` flags illustrative imagery on news articles. Passing a stock photo off as the car is the one thing that turns a good page into a complaint.

Ask before downloading images from the internet, and confirm the licence covers commercial use.

## Phase 3 — Write the brief

A brief is a JSON file. Put it wherever is convenient (a scratch directory is fine — briefs aren't committed).

```json
{
  "make": "Toyota",
  "model": "GR Yaris",
  "year": "2026",
  "trim": "Circuit Pack",
  "slug": "toyota-gr-yaris-circuit-pack",
  "condition": "New",
  "countryOfOrigin": "Japan",
  "steering": "RHD",
  "fuelSystem": "Petrol",
  "engineConfig": "1.6L turbocharged inline-3",
  "displacement": "1618 cc",
  "maxPower": "276 hp @ 6500 rpm",
  "maxTorque": "390 Nm @ 3250 rpm",
  "transmission": "6-speed manual",
  "emissions": "Euro 6e",
  "upholstery": "Black suede and synthetic leather",
  "infotainment": "8-inch Toyota Smart Connect",
  "features": ["GR-Four AWD", "Torsen limited-slip differentials"],
  "searchTags": ["gr-yaris", "hot-hatch", "japan"],
  "exteriorColors": [{ "name": "Platinum White Pearl", "hex": "#f2f2f0" }],
  "interiorColors": [{ "name": "Black Suede", "hex": "#1c1c1c" }],
  "valuePoints": [
    { "title": "Homologation special", "description": "Built to make a rally car legal, not to fill a showroom." }
  ],
  "customData": [{ "label": "Kerb weight", "value": "1280 kg" }],
  "images": ["./photos/front-three-quarter.jpg", "https://example.com/rear.jpg"],
  "notes": "Images are manufacturer press shots, not the specific car.",
  "isUpcoming": true,
  "expectedAvailability": "Q3 2026",
  "newsSlug": "monterey-car-week-2026-new-car-debuts"
}
```

Only `make` and `model` are required. `slug` is derived from make + model + trim if omitted.

### Upcoming cars

Set `isUpcoming: true` when the model has been announced but isn't orderable. It changes real behaviour, not just a badge:

- a **Coming Soon** badge on the gallery card and car page;
- the inquiry section reframes from *Start Your Purchase* to *Register Interest*;
- the car appears in the **Upcoming cars & new model releases** rail on `/latest-news`;
- **every lead from the page is flagged `isUpcomingVehicle`** and shows an *Upcoming Car* badge in the admin leads table, so sales don't promise a delivery date on a car that doesn't exist yet.

`expectedAvailability` is free text shown verbatim (`"Q3 2026"`, `"Deliveries from March 2027"`). Leave it blank if the date isn't confirmed — don't guess.

### Linking to a news announcement

`newsSlug` is the slug of the `/latest-news` article that announced the model. Setting it wires the link **both ways**: the car page gets a *Read the announcement* link, and the article grows a *cars in this story* block.

The reverse direction also works from the news side: add the car's slug to `linkedVehicleSlugs` on the article in `src/config/news.ts`. Use that when one story announces several cars. Slugs that don't resolve to a live dossier are skipped, so you can list them before the pages exist.

Turning a new-model announcement into a car page is the common case: read the article's body in `src/content/news/<slug>.tsx`, take the models it names, and build a page per model with `newsSlug` set to that article.

## Phase 4 — Publish

Dry-run first. It validates the brief, resolves the slug, and prints the exact record without touching anything:

```bash
node --env-file=.env.local scripts/create-car-page.mjs path/to/brief.json --dry-run
```

Then create it as a Draft:

```bash
node --env-file=.env.local scripts/create-car-page.mjs path/to/brief.json
```

Local images upload to R2 on this step (needs `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_ENDPOINT`, `R2_BUCKET_NAME`, `R2_PUBLIC_URL`). Image URLs in the brief pass straight through.

Review the draft at `/admin/specs`, then publish:

```bash
node --env-file=.env.local scripts/create-car-page.mjs path/to/brief.json --publish
```

The script **upserts by slug**, so re-running an edited brief updates the same page rather than creating a duplicate. That's the intended edit loop.

Default to leaving the page as a Draft and telling the user it's ready for review. Only pass `--publish` when they've asked for it — publishing puts the page in the public gallery, the sitemap and Google's index.

## Phase 5 — Check it

- Open `/b2c/gallery/<slug>` and confirm the hero, the colour swatches (two-tone ones should render as a hard diagonal split, not a gradient), and the inquiry form's colour picker.
- If `isUpcoming`, confirm the Coming Soon badge, the *Register Interest* framing, and that the car shows on `/latest-news`.
- If `newsSlug` is set, confirm both directions of the link resolve.

## House rules

- **Never invent a specification, price, tax or duty figure.** Cite or omit. This is the same standard the news desk works to — see `news-editorial-playbook.md`.
- **Never present stock imagery as the actual car** without saying so in `notes`.
- Colour hexes are approximations of real paint; don't describe them as exact matches.
- Confirm before publishing, before downloading third-party images, and before overwriting an existing slug's page.
