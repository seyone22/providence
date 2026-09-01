// ─────────────────────────────────────────────────────────────────────────────
// Blog content registry — single source of truth for every published guide.
// Drives the blog index, per-post metadata, JSON-LD, internal linking (related
// posts) and the sitemap.
//
// Two groups feed BLOG_POSTS:
//   • IRELAND_POSTS below — the original "Import Cars to Ireland" cluster.
//   • COUNTRY_BLOG_POSTS from ./blog-countries — five posts per source country
//     where we operate an office (see src/config/countries.ts).
//
// Post BODIES live in src/content/blog/<slug>.tsx and are mapped by slug in
// src/content/blog/index.ts. This file holds only the metadata.
//
// Ireland tax/cost figures come from the "Ireland Car Import Research" report
// (2026 Revenue VRT bands, NOx levy, VAT 23%, 0%/10% duty, EU–Japan EPA). The
// report itself notes "verify all figures with Revenue.ie", so tax/cost posts
// carry an indicative-figures disclaimer — as do the source-country posts, whose
// import regimes change frequently.
// ─────────────────────────────────────────────────────────────────────────────

import { COUNTRY_BLOG_POSTS } from "./blog-countries";

export type BlogCluster =
  | "Cost & Cheapest"
  | "Tax & Rules"
  | "Source Country"
  | "Guides"
  // Importing *into* the UK. Deliberately separate from the "United Kingdom"
  // cluster, which is about buying *from* Britain — the reader is a different
  // person with a different question.
  | "UK Registration & IVA"
  // Per-country clusters — one per office in src/config/countries.ts. Posts live
  // in src/config/blog-countries.ts and are appended to BLOG_POSTS below.
  | "Japan"
  | "United Kingdom"
  | "UAE"
  | "India"
  | "Thailand"
  | "Australia"
  | "New Zealand"
  | "Sri Lanka";

export type BlogFAQ = { q: string; a: string };

export type BlogTocItem = { id: string; label: string };

export type BlogPost = {
  slug: string;
  /** Card/listing title. */
  title: string;
  /** On-page <h1>. May differ slightly from the SEO <title>. */
  h1: string;
  /** SEO <title> (absolute — used as-is, no template). */
  seoTitle: string;
  /** Meta description. */
  description: string;
  /** Short listing/teaser line. */
  excerpt: string;
  cluster: BlogCluster;
  /** Primary keyword this post targets. */
  primaryKeyword: string;
  keywords: string[];
  author: string;
  /** ISO date. */
  publishDate: string;
  /** ISO date. */
  updatedDate: string;
  readingTimeMins: number;
  heroImage: string;
  heroAlt: string;
  /**
   * Optional 1200×630 share image. When set, the post's Open Graph and Twitter
   * cards use it with explicit dimensions, which is what Slack, LinkedIn, X and
   * iMessage need to render a preview (see CLAUDE.md, "SEO & AEO"). Omit it and
   * the card falls back to `heroImage` with no declared dimensions.
   */
  ogImage?: string;
  /** Slugs of related posts for internal linking. */
  related: string[];
  /** FAQs — rendered on-page AND emitted as FAQPage JSON-LD. */
  faqs: BlogFAQ[];
  /** In-page table of contents (anchor ids must match headings in the body). */
  toc: BlogTocItem[];
  /**
   * Where the end-of-post CTA's inquiry button should go. Defaults to the
   * Japan/Ireland landing page; set it on posts about another source country
   * so the reader is not sent to an unrelated market's form.
   */
  ctaHref?: string;
  /** Mark the pillar/hub post. */
  isPillar?: boolean;
};

const AUTHOR = "Providence Auto";
const PUBLISHED = "2026-06-26";
const UPDATED = "2026-06-26";

// The Ireland import cluster — the original content hub.
const IRELAND_POSTS: BlogPost[] = [
  // ── 1 · PILLAR / HUB ──────────────────────────────────────────────────────
  {
    slug: "importing-cars-to-ireland",
    isPillar: true,
    title: "Importing a Car to Ireland in 2026: The Complete Guide",
    h1: "Importing a Car to Ireland in 2026: Costs, Tax & the Best Cars to Buy",
    seoTitle:
      "Importing Cars to Ireland in 2026: The Complete Guide (Costs, Tax & Best Cars)",
    description:
      "The complete 2026 guide to importing a car to Ireland — customs duty, VAT and VRT explained, what it really costs, the cheapest cars to import, and how to do it without overpaying.",
    excerpt:
      "Everything that decides the price of an Irish import — the three taxes, the best source countries, and the cars that land cheapest — in one place.",
    cluster: "Guides",
    primaryKeyword: "import cars to ireland",
    keywords: [
      "import cars to ireland",
      "importing a car to ireland",
      "import car to ireland 2026",
      "how to import a car to ireland",
      "car import ireland",
    ],
    author: AUTHOR,
    publishDate: PUBLISHED,
    updatedDate: UPDATED,
    readingTimeMins: 12,
    heroImage:
      "https://images.unsplash.com/photo-1502877338535-766e1452684a?q=80&w=2400&auto=format&fit=crop",
    heroAlt: "Car keys handed over — importing a car to Ireland",
    related: [
      "cheapest-cars-to-import-to-ireland",
      "cost-of-importing-a-car-to-ireland",
      "vrt-explained-ireland",
      "import-car-from-japan-or-uk-to-ireland",
    ],
    toc: [
      { id: "three-taxes", label: "The three taxes that decide everything" },
      { id: "customs-duty", label: "Customs duty: 0% or 10%" },
      { id: "vat", label: "VAT at 23%" },
      { id: "vrt", label: "VRT — the controllable cost" },
      { id: "where-to-buy", label: "Where to import from" },
      { id: "best-cars", label: "The best cars to import" },
      { id: "sweet-spot", label: "The age & mileage sweet spot" },
      { id: "steps", label: "The import process, step by step" },
      { id: "faqs", label: "FAQs" },
    ],
    faqs: [
      {
        q: "How much does it cost to import a car to Ireland in 2026?",
        a: "The landed cost is the purchase price plus shipping, customs duty (0% or 10%), VAT at 23% where it applies, Vehicle Registration Tax (VRT, 7%–41% of the car's OMSP based on CO₂), and a NOx levy on petrol and diesel cars. A typical Japanese hybrid lands around €17,000–€18,000 all-in versus €22,000–€26,000 on an Irish forecourt.",
      },
      {
        q: "Is it cheaper to import a car to Ireland than to buy one here?",
        a: "Often yes, for the right car. A low-CO₂, 0%-duty car bought below Irish retail (typically a Japanese hybrid or a UK-built model) can land several thousand euro below the Irish forecourt price even after all taxes. High-CO₂ diesels and EU-built cars from Britain usually do not save money.",
      },
      {
        q: "What is the first step to importing a car to Ireland?",
        a: "Model the full landed cost before you buy anything. Pick a low-emission, right-hand-drive car with proof of origin, run it through a VRT and customs estimate, and only then commit. The headline foreign price is never the real price.",
      },
    ],
  },

  // ── 2 · CHEAPEST CARS (money) ─────────────────────────────────────────────
  {
    slug: "cheapest-cars-to-import-to-ireland",
    title: "The Cheapest Cars to Import to Ireland in 2026",
    h1: "The Cheapest Cars to Import to Ireland in 2026 (Real Landed Costs)",
    seoTitle:
      "The Cheapest Cars to Import to Ireland in 2026 (Real Landed Costs by Model)",
    description:
      "The cheapest cars to import to Ireland in 2026, ranked. Specific makes and models with low VRT bands, 0% customs duty and real landed-cost examples — so you know exactly what lands cheapest.",
    excerpt:
      "Not all imports are cheap. These specific models combine 0% duty, low VRT and genuine auction value — with landed costs to prove it.",
    cluster: "Cost & Cheapest",
    primaryKeyword: "cheapest cars to import to ireland",
    keywords: [
      "cheapest cars to import to ireland",
      "cheapest car to import to ireland",
      "best cars to import to ireland",
      "low vrt cars ireland",
      "cheap japanese imports ireland",
    ],
    author: AUTHOR,
    publishDate: PUBLISHED,
    updatedDate: UPDATED,
    readingTimeMins: 10,
    heroImage:
      "https://images.unsplash.com/photo-1523394397008-7c076b65a890?q=80&w=2400&auto=format&fit=crop",
    heroAlt: "Compact hatchback — a cheap car to import to Ireland",
    related: [
      "cheapest-way-to-import-a-car-to-ireland",
      "cost-of-importing-a-car-to-ireland",
      "importing-cars-to-ireland",
      "vrt-explained-ireland",
    ],
    toc: [
      { id: "what-makes-cheap", label: "What makes a car cheap to import" },
      { id: "the-list", label: "The cheapest cars to import, ranked" },
      { id: "worked-example", label: "A real landed-cost example" },
      { id: "avoid", label: "The cars that are never cheap" },
      { id: "faqs", label: "FAQs" },
    ],
    faqs: [
      {
        q: "What is the cheapest car to import to Ireland?",
        a: "The cheapest cars to import are low-CO₂ Japanese-built hybrids and kei/small petrols — the Toyota Aqua, Suzuki Swift, Honda Fit/Jazz hybrid and Nissan Note e-Power. They combine 0% customs duty (EU–Japan EPA), the lowest VRT bands (7%–12%) and low auction prices, so they land well below Irish retail.",
      },
      {
        q: "Are Japanese imports cheaper than UK imports in Ireland now?",
        a: "Since 1 February 2026 Japanese-built cars enter at 0% customs duty, matching UK-built cars. Japan wins on low-mileage condition and price for hybrids; the UK wins on cheap, fast shipping. Both beat EU-built premium cars bought in Britain, which still pay 10% duty.",
      },
      {
        q: "Do cheap imported cars still have to pay VRT in Ireland?",
        a: "Yes. Every imported car pays VRT, but the rate is set by CO₂ emissions — 7% for EVs up to 41% for high-emission cars. Choosing a low-CO₂ model is the single biggest lever on the final price, which is why efficient hybrids are the cheapest cars to import overall.",
      },
    ],
  },

  // ── 3 · CHEAPEST WAY (money) ──────────────────────────────────────────────
  {
    slug: "cheapest-way-to-import-a-car-to-ireland",
    title: "The Cheapest Way to Import a Car to Ireland",
    h1: "The Cheapest Way to Import a Car to Ireland (Without Cutting Corners)",
    seoTitle:
      "The Cheapest Way to Import a Car to Ireland in 2026 (Without Cutting Corners)",
    description:
      "The cheapest way to import a car to Ireland in 2026 — a legal cost-minimisation playbook covering origin proof, source country, the right age and mileage, and the reliefs that cut your VRT and VAT.",
    excerpt:
      "The cheapest import isn't a trick — it's a sequence of legal decisions. Here's the playbook that keeps duty, VAT and VRT as low as the rules allow.",
    cluster: "Cost & Cheapest",
    primaryKeyword: "cheapest way to import cars to ireland",
    keywords: [
      "cheapest way to import cars to ireland",
      "cheapest way to import a car to ireland",
      "how to import a car cheaply ireland",
      "reduce vrt ireland",
      "avoid customs duty car ireland",
    ],
    author: AUTHOR,
    publishDate: PUBLISHED,
    updatedDate: UPDATED,
    readingTimeMins: 11,
    heroImage:
      "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?q=80&w=2400&auto=format&fit=crop",
    heroAlt: "Calculating the cheapest way to import a car to Ireland",
    related: [
      "cheapest-cars-to-import-to-ireland",
      "cost-of-importing-a-car-to-ireland",
      "vrt-explained-ireland",
      "importing-cars-to-ireland",
    ],
    toc: [
      { id: "rule", label: "The one rule that controls the price" },
      { id: "step-1", label: "1. Pick a 0%-duty car — and prove origin" },
      { id: "step-2", label: "2. Choose the cheapest source country" },
      { id: "step-3", label: "3. Hit the age & mileage sweet spot" },
      { id: "step-4", label: "4. Keep VRT low with CO₂ and NOx" },
      { id: "step-5", label: "5. Use the legal reliefs" },
      { id: "diy-vs-service", label: "DIY vs using an importer" },
      { id: "faqs", label: "FAQs" },
    ],
    faqs: [
      {
        q: "What is the cheapest way to import a car to Ireland?",
        a: "Buy a low-CO₂, right-hand-drive car that qualifies for 0% customs duty (Japanese- or UK-built) with a valid statement of origin, aged 3–8 years with average mileage to keep VRT moderate, and claim any relief you're entitled to (EV VRT relief before end-2026, the 30-year classic rate, or Transfer of Residence relief). Always model the full landed cost before bidding.",
      },
      {
        q: "How can I legally reduce VRT when importing a car to Ireland?",
        a: "VRT is set by CO₂ emissions on the car's OMSP, so the legal levers are: choose a low-emission model, import a battery EV before the VRT relief ends on 31 December 2026, use the flat €200 rate for cars over 30 years old, or appeal an OMSP you can show is too high. Petrol/hybrid also avoids the heavy diesel NOx levy.",
      },
      {
        q: "Is it cheaper to import a car yourself or use an import service?",
        a: "Doing it yourself saves a service fee but exposes you to the expensive mistakes — paying 10% duty for want of an origin document, mis-judging the VRT band, or buying a car that fails the NCT. A good importer prices the full landed cost up front and handles customs, VRT and registration, which usually protects more than it costs.",
      },
    ],
  },

  // ── 4 · TOTAL COST (Cost & Cheapest) ──────────────────────────────────────
  {
    slug: "cost-of-importing-a-car-to-ireland",
    title: "How Much Does It Cost to Import a Car to Ireland?",
    h1: "How Much Does It Cost to Import a Car to Ireland? Full 2026 Breakdown",
    seoTitle:
      "How Much Does It Cost to Import a Car to Ireland? Full 2026 Breakdown",
    description:
      "A line-by-line 2026 breakdown of the cost of importing a car to Ireland — purchase price, shipping, customs duty, VAT, VRT and the NOx levy — with worked examples for Japan and the UK.",
    excerpt:
      "Purchase price is only the start. Here's every line on the bill — duty, VAT, VRT, NOx — with worked totals so there are no surprises at the port.",
    cluster: "Cost & Cheapest",
    primaryKeyword: "cost of importing a car to ireland",
    keywords: [
      "cost of importing a car to ireland",
      "how much to import a car to ireland",
      "import car ireland cost calculator",
      "vrt and vat on imported car ireland",
      "landed cost car ireland",
    ],
    author: AUTHOR,
    publishDate: PUBLISHED,
    updatedDate: UPDATED,
    readingTimeMins: 9,
    heroImage:
      "https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=2400&auto=format&fit=crop",
    heroAlt: "Working out the cost of importing a car to Ireland",
    related: [
      "vrt-explained-ireland",
      "cheapest-cars-to-import-to-ireland",
      "cheapest-way-to-import-a-car-to-ireland",
      "importing-cars-to-ireland",
    ],
    toc: [
      { id: "summary", label: "The short answer" },
      { id: "line-by-line", label: "The cost, line by line" },
      { id: "order", label: "Why the order matters" },
      { id: "examples", label: "Worked examples: Japan vs UK" },
      { id: "calculator", label: "Estimate your own car" },
      { id: "faqs", label: "FAQs" },
    ],
    faqs: [
      {
        q: "How much does it cost to import a car to Ireland?",
        a: "Total landed cost = purchase price + shipping + customs duty (0% or 10%) + VAT at 23% (where it applies) + VRT (7%–41% of OMSP) + NOx levy on petrol/diesel. As an example, an €11,000 Japanese hybrid lands around €17,775 all-in; an EU-built premium car from Britain can exceed €26,000 on the same purchase price because of 10% duty and a higher VRT band.",
      },
      {
        q: "Do you pay both VAT and VRT on an imported car in Ireland?",
        a: "Yes — they are separate charges. VAT at 23% applies to all non-EU imports (Japan, UK/GB) on the landed value plus any duty. VRT is a once-off registration tax charged on the car's Irish OMSP based on CO₂. A used car from the EU or Northern Ireland can be VAT-free but still pays VRT.",
      },
      {
        q: "Is there a calculator for the cost of importing a car to Ireland?",
        a: "Yes. Providence Auto's free Ireland Car Import Cost Calculator estimates customs duty, VAT, VRT and the NOx levy on 2026 Revenue rates using live exchange rates, for cars from the UK, Japan, the EU and beyond.",
      },
    ],
  },

  // ── 5 · VRT EXPLAINED (Tax & Rules / AEO) ─────────────────────────────────
  {
    slug: "vrt-explained-ireland",
    title: "VRT Explained: How Vehicle Registration Tax Works in Ireland",
    h1: "VRT Explained: How Vehicle Registration Tax Is Calculated in Ireland (2026)",
    seoTitle:
      "VRT Explained: How Vehicle Registration Tax Is Calculated in Ireland (2026)",
    description:
      "VRT explained in plain English: how Vehicle Registration Tax is calculated in Ireland in 2026 — OMSP, the CO₂ bands (7%–41%), the NOx levy, and the NEDC-to-WLTP trap that pushes older cars up a band.",
    excerpt:
      "VRT is the biggest and most controllable cost of any Irish import. Here's exactly how Revenue calculates it — and where buyers get caught.",
    cluster: "Tax & Rules",
    primaryKeyword: "vrt ireland",
    keywords: [
      "vrt ireland",
      "how is vrt calculated ireland",
      "vrt rates 2026",
      "what is omsp",
      "vehicle registration tax ireland",
    ],
    author: AUTHOR,
    publishDate: PUBLISHED,
    updatedDate: UPDATED,
    readingTimeMins: 9,
    heroImage:
      "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=2400&auto=format&fit=crop",
    heroAlt: "Paperwork for Vehicle Registration Tax in Ireland",
    related: [
      "cost-of-importing-a-car-to-ireland",
      "cheapest-way-to-import-a-car-to-ireland",
      "importing-cars-to-ireland",
      "cheapest-cars-to-import-to-ireland",
    ],
    toc: [
      { id: "what-is-vrt", label: "What is VRT?" },
      { id: "formula", label: "The VRT formula" },
      { id: "omsp", label: "OMSP — what VRT is charged on" },
      { id: "bands", label: "The 2026 CO₂ bands" },
      { id: "nox", label: "The NOx levy" },
      { id: "nedc-trap", label: "The NEDC-to-WLTP trap" },
      { id: "reliefs", label: "Reliefs and the flat rates" },
      { id: "faqs", label: "FAQs" },
    ],
    faqs: [
      {
        q: "How is VRT calculated in Ireland?",
        a: "VRT = (CO₂ rate % × OMSP) + NOx levy. The CO₂ rate runs from 7% to 41% across 20 bands based on the car's WLTP CO₂ emissions, and it is charged on the OMSP — Revenue's estimate of the car's Irish retail price, not the price you paid abroad. A separate NOx levy is added for petrol and diesel cars.",
      },
      {
        q: "What is OMSP for VRT?",
        a: "OMSP is the Open Market Selling Price — Revenue's estimate of what the car would sell for at Irish retail, adjusted for age, model, mileage and condition. VRT is charged on the OMSP, so a low-mileage car can attract a higher OMSP and therefore more VRT than a higher-mileage equivalent.",
      },
      {
        q: "What is the lowest rate of VRT in Ireland?",
        a: "The lowest VRT rate is 7% of OMSP, for cars in the 0–50 g/km CO₂ band — battery EVs and plug-in hybrids. Battery EVs also pay zero NOx levy and qualify for VRT relief of up to €5,000 until 31 December 2026. Cars over 30 years old pay a flat €200.",
      },
    ],
  },

  // ── 6 · JAPAN vs UK (Source Country) ──────────────────────────────────────
  {
    slug: "import-car-from-japan-or-uk-to-ireland",
    title: "Japan vs the UK: Where Should You Import Your Car From?",
    h1: "Japan vs the UK: Where Should You Import Your Car From in 2026?",
    seoTitle:
      "Import a Car from Japan or the UK to Ireland? The 2026 Comparison",
    description:
      "Japan vs the UK for importing a car to Ireland in 2026: how customs duty, VAT, shipping and stock compare after Brexit and the EU–Japan 0% tariff — and which is cheaper for your car.",
    excerpt:
      "Brexit ended the UK's automatic advantage and Japan just hit 0% duty. Here's how the two best source countries really compare in 2026.",
    cluster: "Source Country",
    primaryKeyword: "import car from japan or uk to ireland",
    keywords: [
      "import car from japan to ireland",
      "import car from uk to ireland",
      "japan vs uk car import ireland",
      "importing car from uk to ireland after brexit",
      "best country to import a car to ireland",
    ],
    author: AUTHOR,
    publishDate: PUBLISHED,
    updatedDate: UPDATED,
    readingTimeMins: 10,
    heroImage:
      "https://images.unsplash.com/photo-1542362567-b07e54358753?q=80&w=2400&auto=format&fit=crop",
    heroAlt: "Choosing between importing a car from Japan or the UK to Ireland",
    related: [
      "cheapest-cars-to-import-to-ireland",
      "cost-of-importing-a-car-to-ireland",
      "importing-cars-to-ireland",
      "vrt-explained-ireland",
    ],
    toc: [
      { id: "headline", label: "The headline: it depends on the car" },
      { id: "duty", label: "Customs duty — the Brexit trap" },
      { id: "vat", label: "VAT — the same either way" },
      { id: "logistics", label: "Shipping & logistics" },
      { id: "stock", label: "Stock, condition & price" },
      { id: "verdict", label: "The verdict" },
      { id: "faqs", label: "FAQs" },
    ],
    faqs: [
      {
        q: "Is it cheaper to import a car from Japan or the UK to Ireland?",
        a: "It depends on the car. Since February 2026 both Japanese-built and UK-built cars enter at 0% customs duty, and both pay 23% VAT. Japan is best for low-mileage hybrids at auction prices; the UK is best for UK-built models where cheap, fast ferry shipping wins. EU-built cars bought in Britain are the trap — they still pay 10% duty.",
      },
      {
        q: "Do I pay customs duty importing a car from the UK to Ireland after Brexit?",
        a: "Only UK-manufactured cars qualify for 0% duty under the EU–UK Trade and Cooperation Agreement, and only with a valid statement of origin. A BMW, Audi, Mercedes or VW bought in Britain was built in the EU and pays the full 10% duty. VAT at 23% applies to every GB import regardless.",
      },
      {
        q: "Why import a car from Japan to Ireland in 2026?",
        a: "Japanese-built cars now enter at 0% customs duty under the EU–Japan EPA, they're right-hand drive, and Japan's shaken inspection regime means low-mileage, well-graded cars sell cheaply at auction. For efficient hybrids in particular, a Japanese import routinely lands below Irish forecourt prices even after VAT and VRT.",
      },
    ],
  },

  // ── 7 · INDIA-BUILT CARS: WHY CHEAPER (Source Country) ────────────────────
  {
    slug: "why-are-indian-manufactured-cars-cheaper",
    // An India post, so the inquiry button belongs on the India landing page.
    ctaHref: "/indian-manufactured-cars#inquiry",
    title:
      "Why Are Indian-Manufactured Cars Cheaper? (And Is the Quality Low?)",
    h1: "Why Are Indian-Manufactured Cars So Much Cheaper — and Is the Quality Low?",
    seoTitle:
      "Why Are Indian-Manufactured Cars Cheaper? The Honest Answer on Price & Quality",
    description:
      "Indian-built cars cost roughly 30% less than the global average. Here's exactly why — the sub-4-metre tax rule, 95% local supply chains, frugal engineering and massive scale — plus the honest answer on whether the quality is low.",
    excerpt:
      "Roughly 30% cheaper than the global average — and it's not corner-cutting. The five real reasons India builds cars for less, and the truth about quality.",
    cluster: "Source Country",
    primaryKeyword: "why are indian manufactured cars cheaper",
    keywords: [
      "why are indian cars cheaper",
      "indian manufactured cars quality",
      "india built cars",
      "are indian cars good quality",
      "bharat ncap safety",
      "import cars from india",
    ],
    author: AUTHOR,
    publishDate: "2026-07-03",
    updatedDate: "2026-07-03",
    readingTimeMins: 9,
    heroImage:
      "https://images.unsplash.com/photo-1685019718640-6e562edc365e?q=80&w=2400&auto=format&fit=crop",
    heroAlt: "Modern Indian-manufactured car",
    related: [],
    toc: [
      { id: "short-answer", label: "The short answer" },
      { id: "sub-4-meter", label: "The sub-4-metre tax rule" },
      { id: "localization", label: "90–95% local supply chains" },
      { id: "labour", label: "Lower labour & operating costs" },
      { id: "frugal-engineering", label: "Frugal engineering" },
      { id: "scale", label: "Massive economies of scale" },
      { id: "quality", label: "So is the quality low?" },
      { id: "providence", label: "How we bridge the gap" },
      { id: "faqs", label: "FAQs" },
    ],
    faqs: [
      {
        q: "Why are cars manufactured in India so cheap?",
        a: "Because India's entire automotive ecosystem is optimised for cost: tax rules that reward compact, efficient design; 90–95% domestically sourced parts; factory operating costs 10–25% below Western plants; engineering targeted at what buyers actually need; and the scale of the world's third-largest car market. India's comparative vehicle price index sits around 70 against a global benchmark of 100 — roughly 30% cheaper by design, not by corner-cutting.",
      },
      {
        q: "Are Indian-manufactured cars low quality?",
        a: "Not any more. Modern Indian plants build global models for Suzuki, Toyota, Hyundai, Kia and the Volkswagen Group on shared worldwide platforms, India-built cars are exported back to demanding markets including Japan and Europe, and the Bharat NCAP crash-test programme now independently rates new models — with Indian brands like Tata and Mahindra scoring five stars. Historic quality gaps have closed while the price advantage has held.",
      },
      {
        q: "Is it safe to import a car manufactured in India?",
        a: "Yes, with proper checks. Buy through a sourcing partner that verifies provenance and inspects every car before export. Providence inspects each India-built car against a multi-point standard — structure, brakes, engine, electronics and safety spec — and shares the report before you pay, so the lower price never means a compromised car.",
      },
    ],
  },
];

// Everything the blog renders: the Ireland hub plus the per-source-country
// clusters. Order matters only for the ItemList schema; the index page groups
// by cluster via CLUSTER_ORDER.
// ── Model guides ─────────────────────────────────────────────────────────────
// Evergreen, model-level guides. Deliberately separate from the source-country
// clusters: a Patrol can be bought out of four different corridors, so the
// guide belongs to the car rather than to any one office. Dated reporting on
// the same model lives in /latest-news, not here.
const MODEL_POSTS: BlogPost[] = [
  {
    slug: "how-to-import-a-nissan-patrol",
    title: "How to Import a Nissan Patrol: Corridors, Costs and Approvals",
    h1: "How to Import a Nissan Patrol",
    seoTitle: "How to Import a Nissan Patrol: Costs, Rules & Corridors",
    description:
      "How to import a Nissan Patrol: the four source corridors, the seven-part landed-cost stack, age limits, individual vehicle approval and the documents needed.",
    excerpt:
      "Gulf Patrols are left-hand drive, Australian and Japanese ones are not, and none are sold new in Ireland or the UK. That decides your corridor before the price does.",
    cluster: "Guides",
    primaryKeyword: "how to import a nissan patrol",
    keywords: [
      "how to import a nissan patrol",
      "import nissan patrol",
      "nissan patrol import cost",
      "nissan patrol right hand drive import",
      "can you import a nissan patrol to ireland",
      "where to buy a nissan patrol for export",
      "nissan patrol import age limit",
    ],
    author: AUTHOR,
    publishDate: "2026-08-28",
    updatedDate: "2026-08-28",
    readingTimeMins: 11,
    heroImage: "/cars/nissan-patrol-y63/black-front.webp",
    heroAlt: "Nissan Patrol Y63 photographed front three-quarter",
    related: [
      "nissan-patrol-y63-grades-explained",
      "importing-a-ute-or-4x4-from-australia",
      "how-to-import-a-car-from-australia",
    ],
    faqs: [
      {
        q: "Can you import a Nissan Patrol to Ireland or the UK?",
        a: "You can buy and ship one, but registering it is the hard part. The Patrol is not sold new in Ireland or the United Kingdom, so there is no EU or UK type approval attached to the car. Registration runs through individual vehicle approval — in Ireland an NSAI Individual Vehicle Approval assessed against Irish legislation and inspected at an approved test centre. Revenue will not register a new vehicle without a valid Certificate of Conformity, an EU IVA or an Irish national IVA.",
      },
      {
        q: "Which country is best to import a Nissan Patrol from?",
        a: "It depends on which side of the road your country drives on. Australia and Japan supply right-hand-drive Patrols; the United Arab Emirates supplies left-hand drive. For a right-hand-drive destination the realistic choice is between Australia and Japan, and the deciding factors are usually freight frequency and what specification is available, not the purchase price.",
      },
      {
        q: "Is a Nissan Patrol expensive to import?",
        a: "The purchase price is only part of it. A Patrol is large and tall, so it is expensive on both container and roll-on roll-off freight, and its petrol V6 or V8 sits at or near the top of every CO₂ band and engine-capacity band that exists. In markets that tax by emissions or engine size, the engine costs more over time than the specification does.",
      },
      {
        q: "Do age limits stop you importing a used Nissan Patrol?",
        a: "In several markets, yes. Kenya's eight-year rule is the best known, and similar caps apply elsewhere. A new Patrol clears every age limit by definition; a used Y61 or Y62 may not, depending on its year of first registration and your destination. Confirm the current rule with the destination revenue or transport authority before bidding, because it is a hard gate that condition and specification do not override.",
      },
      {
        q: "What documents are needed to import a Nissan Patrol?",
        a: "Proof of ownership and de-registration in the source market, an export certificate, an invoice matching the money actually paid, a bill of lading, and any pre-shipment inspection certificate the destination requires. Pre-shipment inspection is the one that catches importers out: several markets require an inspection carried out in the source country before loading, and a car that sails without it can be refused or penalised on arrival.",
      },
      {
        q: "Can you import a modified Nissan Patrol?",
        a: "Sometimes, and it has to be established before purchase. Bull bars, lift kits, long-range tanks, aftermarket seats, snorkels, roof racks and winches are common on Australian Patrols, and each one is a registration question in the destination market. Some are accepted, some need engineering certification, and some must be removed before shipment.",
      },
    ],
    toc: [
      { id: "which-patrol", label: "Which Patrol are you buying?" },
      { id: "corridors", label: "The four corridors" },
      { id: "cost-stack", label: "What makes up the landed cost" },
      { id: "engine-tax", label: "Why the engine is the expensive decision" },
      { id: "admissibility", label: "Can it be registered?" },
      { id: "documents", label: "The documents" },
      { id: "timeline", label: "How long it takes" },
    ],
  },
  {
    slug: "nissan-patrol-y63-grades-explained",
    title: "Nissan Patrol Y63 Grades Explained: Ti to Ti-L Reserve",
    h1: "Nissan Patrol Y63 Grades Explained",
    seoTitle: "Nissan Patrol Y63 Grades Explained: Ti to Ti-L Reserve",
    description:
      "All six Nissan Patrol Y63 grades compared — Ti, Ti+, Ti-L, Ti-L+, PRO-4X and Ti-L Reserve — what each adds, and which one is worth importing.",
    excerpt:
      "Every grade shares the same engine and the same four-wheel-drive hardware. What separates them is suspension, wheels and screens — and two of those cost you money forever.",
    cluster: "Guides",
    primaryKeyword: "nissan patrol y63 grades",
    keywords: [
      "nissan patrol y63 grades",
      "nissan patrol ti vs ti-l",
      "nissan patrol ti-l reserve",
      "nissan patrol pro-4x",
      "which nissan patrol grade should i buy",
      "nissan patrol y63 specifications",
      "nissan patrol grade differences",
    ],
    author: AUTHOR,
    publishDate: "2026-08-28",
    updatedDate: "2026-08-28",
    readingTimeMins: 9,
    heroImage: "/cars/nissan-patrol-y63/interior-dashboard.webp",
    heroAlt: "Nissan Patrol Y63 dashboard with dual widescreen displays",
    related: [
      "how-to-import-a-nissan-patrol",
      "best-cars-to-import-from-australia",
      "importing-a-ute-or-4x4-from-australia",
    ],
    faqs: [
      {
        q: "What are the Nissan Patrol Y63 grades?",
        a: "In Australia the Y63 Patrol is sold in six grades: Ti, Ti+, Ti-L, Ti-L+, PRO-4X and Ti-L Reserve. All six share the same 3.5-litre twin-turbo V6 producing 317 kW and 700 Nm, the same nine-speed automatic and the same dual-range four-wheel-drive hardware. Grade structures differ by market — the Australian ladder is not the Japanese, Gulf or New Zealand one.",
      },
      {
        q: "What is the difference between the Patrol Ti and Ti-L?",
        a: "The Ti-L adds dual 14.3-inch displays in place of the Ti's 12.3-inch pair, a 12-speaker Klipsch audio system, a head-up display, e-Damper electric shock absorbers and 20-inch wheels in place of 18-inch. It does not add off-road capability: the dual-range transfer case, terrain modes and locking rear differential are already standard on the Ti.",
      },
      {
        q: "Which Nissan Patrol grade is best for towing?",
        a: "The Ti or the PRO-4X. Every grade carries the same 3,700 kg braked tow rating and the same drivetrain, so the Ti gives you the full capability at the bottom of the range. The PRO-4X adds adaptive air suspension, all-terrain tyres, trailer docking support and an electric brake controller, which are aimed directly at towing and off-road use rather than at cabin comfort.",
      },
      {
        q: "Is the Ti-L Reserve worth the extra money?",
        a: "Only if the second-row screens and the massage seats will genuinely be used. The Ti-L Reserve is the largest price step in the range for the narrowest benefit, and its 22-inch wheels are an active disadvantage in markets where the car will see gravel or poor roads — thinner sidewalls, more damage and slower tyre availability.",
      },
      {
        q: "Does choosing a higher Patrol grade increase import tax?",
        a: "Yes, and by more than the price difference. A higher purchase price raises the CIF value your duty is assessed on, and in most regimes consumption tax is then charged on the duty-inclusive value — so the extra car is taxed and the tax on it is taxed. Where a market bands its tax by price, a single grade can push the car into a higher band, which is a step change rather than a slope.",
      },
    ],
    toc: [
      { id: "ladder", label: "The six grades at a glance" },
      { id: "what-changes", label: "What changes as you go up" },
      { id: "grade-and-tax", label: "Why each rung costs more than it lists" },
      { id: "which-grade", label: "Which grade to import" },
      { id: "markets", label: "The ladder differs by market" },
    ],
  },
];

// ── UK registration & IVA ────────────────────────────────────────────────────
// Importing *into* the United Kingdom. The UK sits in two of our lists — it is
// a source market and a destination market — and these posts serve the second
// reader: someone landing a car at a UK port who now has to get a number plate
// on it. NOVA and DVLA registration are named, in-scope Providence services for
// UK-bound cars (business-context.md §4.3), so the CTA on these is honest.
//
// Every figure below was checked against the primary source on 1 September 2026
// and the source is named in the body. DVSA statutory IVA fees have not moved
// since the fee page was last updated on 13 December 2022.
const UK_IVA_POSTS: BlogPost[] = [
  {
    slug: "iva-test-explained",
    title: "IVA Explained: The UK Approval Test for Imported Cars",
    h1: "What an IVA Test Is, and When an Imported Car Needs One",
    seoTitle: "IVA Test Explained: UK Vehicle Approval for Imports",
    description:
      "What Individual Vehicle Approval is, which imported cars need it, what DVSA inspects, what it costs and how long it takes — checked against GOV.UK on 1 September 2026.",
    excerpt:
      "An imported car with no UK or EU type approval cannot be registered until DVSA has approved it individually. Here is what that test is and when it applies.",
    cluster: "UK Registration & IVA",
    primaryKeyword: "iva test",
    keywords: [
      "iva test",
      "individual vehicle approval",
      "iva test uk",
      "iva test imported car",
      "dvsa iva",
      "what is an iva test",
    ],
    author: AUTHOR,
    publishDate: "2026-09-01",
    updatedDate: "2026-09-01",
    readingTimeMins: 12,
    heroImage:
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=2400&auto=format&fit=crop",
    ogImage:
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1200&h=630&fit=crop&auto=format",
    heroAlt: "Imported car awaiting UK individual vehicle approval",
    // Not flagged `isPillar` on purpose: the blog index filters pillar posts out
    // of their cluster group and features only the hardcoded Ireland hub, so the
    // flag would hide this post from the index entirely.
    ctaHref: "/request",
    related: [
      "do-i-need-an-iva-test",
      "iva-test-cost",
      "iva-test-requirements",
      "registering-an-imported-car-in-the-uk",
    ],
    toc: [
      { id: "what-it-is", label: "What an IVA actually is" },
      { id: "who-needs-it", label: "Which cars need one" },
      { id: "basic-vs-normal", label: "Basic IVA and normal IVA" },
      { id: "what-happens", label: "What happens on the day" },
      { id: "timeline", label: "How long the whole thing takes" },
      { id: "after", label: "What the certificate gets you" },
      { id: "changed", label: "What changed in 2025 and 2026" },
      { id: "faqs", label: "FAQs" },
    ],
    faqs: [
      {
        q: "What is an IVA test?",
        a: "Individual Vehicle Approval is the Driver and Vehicle Standards Agency's inspection of a single vehicle against British construction and environmental standards. It exists for cars that have no type approval covering them — anything built, rebuilt, radically altered, reconstructed from a classic, or imported. Pass it and DVSA issues an Individual Approval Certificate, which DVLA requires before it will register the car.",
      },
      {
        q: "Is an IVA test the same as an MOT?",
        a: "No, and passing one tells you nothing about the other. DVSA states the distinction plainly: the IVA inspection looks at how the vehicle is constructed or adapted, while the MOT looks at whether it is roadworthy. A car can sail through an MOT and fail IVA on its headlamp pattern, its speedometer or a sharp exterior edge, because none of those are MOT items.",
      },
      {
        q: "How long does an IVA test take?",
        a: "DVSA publishes an average inspection length of 60 minutes for normal IVA on a car and 110 minutes for basic IVA. The waiting is the longer part: DVSA aims to respond to an application within 10 working days and to offer an inspection within 20 working days at your chosen test centre.",
      },
      {
        q: "Can an imported car be driven before it passes IVA?",
        a: "Only to a pre-booked MOT or approval test. GOV.UK warns that you can be prosecuted for using the vehicle on a public road before registration is complete, and that journey to a booked test is the single exception. It is not insured-and-taxed driving; it is one permitted trip.",
      },
      {
        q: "What happens if a car fails its IVA inspection?",
        a: "You get a refusal notice listing the failures, fix them and book a re-inspection, which is charged at a lower fee than the full test. If you believe the decision is wrong you can appeal within 14 days for a re-examination by an independent inspector, and the appeal fee is refunded in part or in full if you win. You must not modify the vehicle before an appeal inspection.",
      },
    ],
  },
  {
    slug: "do-i-need-an-iva-test",
    title: "Do You Need an IVA Test? The Exemptions, Plainly",
    h1: "Do You Need an IVA Test? The 10-Year Rule and Four Other Routes",
    seoTitle: "Do I Need an IVA Test? UK Import Approval Rules 2026",
    description:
      "Most imported cars over 10 years old need no vehicle approval at all. Here is the exemption list, the EU certificate-of-conformity route and the GB conversion IVA for left-hand drive.",
    excerpt:
      "The single most valuable question in a UK import is whether the car needs approving at all. For a great many cars, the answer is no.",
    cluster: "UK Registration & IVA",
    primaryKeyword: "do i need an iva test",
    keywords: [
      "do i need an iva test",
      "iva exemption",
      "iva 10 year rule",
      "imported car over 10 years old uk",
      "gb conversion iva",
      "mutual recognition vehicle approval",
    ],
    author: AUTHOR,
    publishDate: "2026-09-01",
    updatedDate: "2026-09-01",
    readingTimeMins: 10,
    heroImage:
      "https://images.unsplash.com/photo-1523394397008-7c076b65a890?q=80&w=2400&auto=format&fit=crop",
    ogImage:
      "https://images.unsplash.com/photo-1523394397008-7c076b65a890?q=80&w=1200&h=630&fit=crop&auto=format",
    heroAlt: "Older imported car of the kind exempt from vehicle approval",
    ctaHref: "/request",
    related: [
      "iva-test-explained",
      "iva-test-cost",
      "registering-an-imported-car-in-the-uk",
      "iva-test-requirements",
    ],
    toc: [
      { id: "the-question", label: "The question that decides the budget" },
      { id: "exempt", label: "The exemption list in full" },
      { id: "ten-year", label: "Reading the 10-year rule properly" },
      { id: "eu-cars", label: "Cars already registered in the EU" },
      { id: "lhd", label: "Left-hand drive and GB conversion IVA" },
      { id: "msva", label: "When it is MSVA rather than IVA" },
      { id: "blocked", label: "The cars that cannot be registered at all" },
      { id: "tax-trap", label: "The exemption that still needs a certificate" },
      { id: "faqs", label: "FAQs" },
    ],
    faqs: [
      {
        q: "Do cars over 10 years old need an IVA test?",
        a: "No. GOV.UK's exemption list states that cars and minibuses with eight passenger seats or less that are over 10 years old do not need vehicle approval, and the import guidance puts it as first registered or manufactured more than 10 years ago. That is why a great deal of Japanese import volume sits deliberately on the far side of that line.",
      },
      {
        q: "Does an EU car need an IVA test to register in the UK?",
        a: "Usually not. For a vehicle already registered in the EU, GOV.UK says to get a European Certificate of Conformity from the manufacturer, which serves as your proof of approval. The exception is a left-hand-drive vehicle, which also needs a certificate of GB conversion Individual Vehicle Approval — a £100 paper application to the Vehicle Certification Agency rather than a test.",
      },
      {
        q: "What is GB conversion IVA?",
        a: "It is the certificate that covers converting an EU-approved, EU-registered left-hand-drive vehicle for British use. You apply to the Vehicle Certification Agency on a form specific to the vehicle type — motorcycle, car, van or motorhome — and the fee is £100. It is not available for lorries or goods vehicles over 3,500kg, which need a full IVA instead.",
      },
      {
        q: "Do I still need vehicle approval to tax an exempt car?",
        a: "Sometimes, and this is the trap in the exemption. GOV.UK states you will need vehicle approval to tax the vehicle if it was first registered on or after 1 March 2001 with EU type approval and it is a light goods vehicle, or a car or minibus of eight seats or less with a CO₂ figure in g/km. If you do not have it, DVLA asks for a covering letter explaining why.",
      },
      {
        q: "Can a written-off or salvage car be imported and registered?",
        a: "Not if it counts as seriously damaged. GOV.UK is explicit that a seriously damaged vehicle cannot be registered or taxed, and that money spent on vehicle approval will not be refunded if you try. For imports, look for wording like statutory write-off, scrapped or non-repairable on the foreign registration certificate, and check with the issuing authority before you buy rather than after.",
      },
    ],
  },
  {
    slug: "iva-test-cost",
    title: "What an IVA Test Costs",
    h1: "What an IVA Test Costs: Every DVSA Fee, Line by Line",
    seoTitle: "IVA Test Cost 2026: Every DVSA Fee, Line by Line",
    description:
      "DVSA's published IVA fees for cars — inspection, re-inspection and appeal, in and out of working hours — plus the £100 mutual recognition certificate and the £55 DVLA registration fee.",
    excerpt:
      "The inspection fee is the small number. Here is the whole published fee table, and the costs that sit either side of it.",
    cluster: "UK Registration & IVA",
    primaryKeyword: "iva test cost",
    keywords: [
      "iva test cost",
      "iva test fee",
      "dvsa iva fees",
      "how much is an iva test",
      "iva re-inspection fee",
      "cost to register an imported car uk",
    ],
    author: AUTHOR,
    publishDate: "2026-09-01",
    updatedDate: "2026-09-01",
    readingTimeMins: 10,
    heroImage:
      "https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=2400&auto=format&fit=crop",
    ogImage:
      "https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=1200&h=630&fit=crop&auto=format",
    heroAlt: "Working out the cost of an IVA test and UK registration",
    ctaHref: "/request",
    related: [
      "iva-test-explained",
      "do-i-need-an-iva-test",
      "registering-an-imported-car-in-the-uk",
      "iva-test-requirements",
    ],
    toc: [
      { id: "headline", label: "The headline number, and its conditions" },
      { id: "statutory", label: "The statutory fee table for cars" },
      { id: "voluntary", label: "Voluntary IVA, and why it carries VAT" },
      { id: "certificates", label: "Certificates and replacements" },
      { id: "around-it", label: "The costs either side of the test" },
      { id: "worked", label: "A worked total for a Japanese import" },
      { id: "not-changed", label: "What has not changed" },
      { id: "faqs", label: "FAQs" },
    ],
    faqs: [
      {
        q: "How much does an IVA test cost for a car?",
        a: "DVSA's published fee for a car inspection is £199 in working hours and £294 outside them, for both normal IVA and basic IVA in the low-volume, hearse, left-hand-drive and personal-import classes. Amateur-built, rebuilt and parts-of-a-registered-vehicle cars are charged at £450 in working hours and £545 outside them. A re-inspection is £40 and £90 respectively.",
      },
      {
        q: "Is there VAT on an IVA test?",
        a: "Not on a statutory one. DVSA's fee table shows statutory IVA fees as single figures with no VAT line, and shows voluntary IVA — the test for a vehicle already registered in the UK — split into a service charge plus VAT. A voluntary car inspection is £213.98 plus £42.80 VAT, £256.78 in total, in working hours.",
      },
      {
        q: "What does it cost to register an imported car in the UK?",
        a: "The DVLA first registration fee is £55, and you tax the vehicle at the same time. That sits on top of any customs duty and import VAT paid at the border, the approval fee if the car needs one, and an MOT if the car is over three years old. Registration itself is the cheapest line in the whole exercise.",
      },
      {
        q: "Do I pay again if my car fails the IVA?",
        a: "You pay a re-inspection fee rather than a second full fee. For a car that is £40 in working hours and £59 outside them in the basic low-volume and personal-import classes, and £90 and £109 for amateur-built and rebuilt vehicles. An appeal is charged at the full inspection fee and refunded in part or in full if the appeal succeeds.",
      },
      {
        q: "Have IVA fees gone up in 2026?",
        a: "No. The GOV.UK page carrying DVSA's IVA fee tables for cars was last updated on 13 December 2022, and the figures on it are the ones in force when we checked on 1 September 2026. Any 2026 figure you see quoted that is not £199, £450 or their out-of-hours equivalents did not come from the published table.",
      },
    ],
  },
  {
    slug: "iva-test-requirements",
    title: "How to Pass an IVA Test",
    h1: "How to Pass an IVA Test: DVSA's Own Top Ten Failure Points",
    seoTitle: "IVA Test Requirements: How to Pass It First Time",
    description:
      "DVSA publishes the top ten reasons cars fail Individual Vehicle Approval — headlamp aim, rear fog lamps, speedometers, brakes and more. Here is the list, and what it means for an import.",
    excerpt:
      "Headlamps that dip the wrong way and a speedometer in km/h fail more imported cars than mechanical faults do. Both are fixable before the car is booked in.",
    cluster: "UK Registration & IVA",
    primaryKeyword: "iva test requirements",
    keywords: [
      "iva test requirements",
      "iva test checklist",
      "how to pass an iva test",
      "iva headlamp requirements",
      "iva rear fog lamp",
      "iva speedometer mph",
    ],
    author: AUTHOR,
    publishDate: "2026-09-01",
    updatedDate: "2026-09-01",
    readingTimeMins: 11,
    heroImage:
      "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=2400&auto=format&fit=crop",
    ogImage:
      "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=1200&h=630&fit=crop&auto=format",
    heroAlt: "Car headlamp detail — the most common IVA failure point",
    ctaHref: "/request",
    related: [
      "iva-test-explained",
      "iva-test-cost",
      "do-i-need-an-iva-test",
      "registering-an-imported-car-in-the-uk",
    ],
    toc: [
      { id: "the-list", label: "DVSA's own top ten" },
      { id: "headlamps", label: "Headlamp aim, the number one failure" },
      { id: "fog", label: "The rear fog lamp an import will not have" },
      { id: "speedo", label: "Speedometers, and why km/h fails" },
      { id: "brakes", label: "The brake efficiency figures" },
      { id: "projections", label: "Exterior projections and the 100mm sphere" },
      { id: "rest", label: "Plates, belts, emissions and interior" },
      { id: "order", label: "The order to do the work in" },
      { id: "faqs", label: "FAQs" },
    ],
    faqs: [
      {
        q: "What is the most common reason cars fail an IVA test?",
        a: "Headlamp aim is first on DVSA's published top-ten list for M1 vehicles. The lamps must produce a clear beam image with the cut-off to the left, and DVSA says headlamps on vehicles imported from countries that drive on the right may need converting or replacing. Masking a headlamp, inside or out, is not accepted.",
      },
      {
        q: "Does an imported car need a rear fog lamp for IVA?",
        a: "Yes, and DVSA expects a car imported from outside the EU not to have one fitted at all. It must sit at the centre or offside rear, be a matched symmetrical pair if two are fitted, carry an 'e' or 'E' approval mark with a 'B' or 'F', have secure insulated wiring and a warning device, and light only when the dipped, main or front fog lamps are on.",
      },
      {
        q: "Does an IVA speedometer have to read in mph?",
        a: "Yes. DVSA's guidance states the speedometer must indicate mph and read accurately, and that accuracy is checked on calibrated rollers between 35 and 70 mph. It has to be readable by the driver at all times, with maximum marked increments of 20 mph. GPS units and bicycle or racing instruments are not accepted.",
      },
      {
        q: "What brake efficiency does an IVA require?",
        a: "DVSA publishes minimums of 60% service brake efficiency, 25% secondary brake performance where testable, and 18% parking brake efficiency, all calculated on design gross weight or calculated laden weight. These are different from MOT requirements, so an MOT pass is an indication rather than a guarantee.",
      },
      {
        q: "Can I do the IVA test by video call?",
        a: "Not for a car. DVSA's video-call option covers vans and light goods vehicles, heavy goods vehicles and trailers — categories N1, N2, N3 and O1 to O4. A passenger car in category M1 has to be presented at a test centre in person.",
      },
    ],
  },
  {
    slug: "registering-an-imported-car-in-the-uk",
    title: "Registering an Imported Car in the UK",
    h1: "Registering an Imported Car in the UK, Step by Step",
    seoTitle: "Registering an Imported Car in the UK: Full Process",
    description:
      "The full sequence for a car imported into the UK: the 14-day NOVA notification, duty and VAT, vehicle approval, the DVLA pack, the £55 fee and the six-week wait for a V5C.",
    excerpt:
      "Six steps, in a fixed order, and each one gates the next. Miss the first and the last cannot happen.",
    cluster: "UK Registration & IVA",
    primaryKeyword: "registering an imported car uk",
    keywords: [
      "registering an imported car uk",
      "nova declaration",
      "import car to uk process",
      "dvla imported vehicle registration",
      "v55 imported car",
      "uk car import duty vat",
    ],
    author: AUTHOR,
    publishDate: "2026-09-01",
    updatedDate: "2026-09-01",
    readingTimeMins: 12,
    heroImage:
      "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=2400&auto=format&fit=crop",
    ogImage:
      "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=1200&h=630&fit=crop&auto=format",
    heroAlt: "Registration paperwork for a car imported into the UK",
    ctaHref: "/request",
    related: [
      "iva-test-explained",
      "do-i-need-an-iva-test",
      "iva-test-cost",
      "iva-test-requirements",
    ],
    toc: [
      { id: "sequence", label: "The sequence, and why order matters" },
      { id: "nova", label: "Telling HMRC within 14 days" },
      { id: "duty-vat", label: "Duty and VAT at the border" },
      { id: "approval", label: "Proving the car is approved" },
      { id: "dvla", label: "The DVLA pack" },
      { id: "mot-tax", label: "MOT, tax and the number plate" },
      { id: "older", label: "Where classics get an easier run" },
      { id: "faqs", label: "FAQs" },
    ],
    faqs: [
      {
        q: "How long do I have to tell HMRC about an imported car?",
        a: "Fourteen days from the vehicle arriving in the UK permanently. GOV.UK is direct about the consequence: you cannot register the vehicle until you have done it, and you may be fined if you are late. The declaration is made through the Notification of Vehicle Arrivals service, by you, your customs agent or HMRC's CARS team.",
      },
      {
        q: "How much is customs duty and VAT on a car imported to the UK?",
        a: "For a used car imported into Great Britain from outside the UK, the UK Integrated Online Tariff shows a third-country duty rate of 10% and VAT at 20%, checked on 1 September 2026. Trade agreements change the duty: a Japanese-built car with valid proof of origin can qualify at 0%, and CPTPP members show a 2% preferential rate. Duty is charged before VAT, and VAT is charged on the total including the duty.",
      },
      {
        q: "How long does DVLA take to register an imported car?",
        a: "GOV.UK says it can take up to six weeks for the V5C registration certificate to arrive, and you need the V5C before number plates can be made up. That six weeks starts after the NOVA declaration is processed, any duty and VAT are paid, and proof of approval is in hand — so it is the last leg of the process, not the whole of it.",
      },
      {
        q: "What documents does DVLA need for an imported vehicle?",
        a: "Originals, not copies: proof of vehicle approval, form V267 if the vehicle is new, evidence of the date the vehicle was collected such as the supplier's invoice, and the original foreign registration certificate showing the manufacture date — which you do not get back. Form V627/3 is added if the vehicle has been structurally modified beyond the manufacturer's specification.",
      },
      {
        q: "Does an imported classic car need an MOT?",
        a: "Not if it was built or first registered more than 40 years ago and has had no substantial changes, such as a replacement chassis, body, axles or engine that changes how it works. Vehicle tax is a separate test: a vehicle built before 1 January 1986 can be put in the historic tax class, and if the build date is unknown, registration before 8 January 1986 does the same.",
      },
    ],
  },
];

export const BLOG_POSTS: BlogPost[] = [
  ...IRELAND_POSTS,
  ...MODEL_POSTS,
  ...UK_IVA_POSTS,
  ...COUNTRY_BLOG_POSTS,
];

// ── Roadmap — remaining cluster posts to build in later batches ──────────────
// Cost & Cheapest:  (covered)
// Tax & Rules:      customs-duty-and-vat-importing-car-ireland
//                   vrt-reliefs-and-loopholes-ireland (TOR, 30-yr classic, EV relief, OMSP appeal, NI bridge)
// Source Country:   import-car-from-uk-to-ireland-after-brexit
//                   import-car-from-japan-to-ireland (or strengthen the existing landing page)
// Guides:           best-hybrid-cars-to-import-to-ireland
//                   importing-an-electric-car-to-ireland-before-2026
//                   importing-a-classic-car-to-ireland-30-year-rule
//                   how-to-import-a-car-to-ireland-step-by-step

// ── Helpers ──────────────────────────────────────────────────────────────────

export function getPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}

export function getAllSlugs(): string[] {
  return BLOG_POSTS.map((p) => p.slug);
}

export function getRelated(slug: string): BlogPost[] {
  const post = getPost(slug);
  if (!post) return [];
  return post.related
    .map((s) => getPost(s))
    .filter((p): p is BlogPost => Boolean(p));
}

// ── Suggested reading ────────────────────────────────────────────────────────
// Used by the post-inquiry touchpoints (the form's success screen and the
// confirmation email) to keep a fresh lead reading instead of bouncing. Chosen
// by the destination country they picked on the form, because that is the only
// thing we reliably know about them at that moment.

/**
 * Fallback set for destinations we have no cluster for — the pillar guide plus
 * the two questions every first-time importer asks (what does it cost, and
 * where should I buy from).
 */
const DEFAULT_SUGGESTED_SLUGS = [
  "importing-cars-to-ireland",
  "cost-to-import-a-car-from-japan",
  "best-cars-to-import-from-japan",
  "how-to-buy-a-car-at-japanese-auction",
];

/**
 * Destination country (as spelled in the inquiry form's country list) → the
 * guides most useful to someone importing there. Keys are normalised through
 * `normaliseCountry` below, so casing and punctuation don't matter.
 */
const SUGGESTED_BY_DESTINATION: Record<string, string[]> = {
  ireland: [
    "importing-cars-to-ireland",
    "cost-of-importing-a-car-to-ireland",
    "vrt-explained-ireland",
    "cheapest-cars-to-import-to-ireland",
    "import-car-from-japan-or-uk-to-ireland",
  ],
  northernireland: [
    "importing-cars-to-ireland",
    "import-car-from-japan-or-uk-to-ireland",
    "cost-to-import-a-car-from-the-uk",
    "uk-car-history-checks-explained",
  ],
  srilanka: [
    "importing-a-car-to-sri-lanka",
    "sri-lanka-vehicle-import-taxes-explained",
    "best-cars-to-import-to-sri-lanka",
    "importing-hybrids-and-evs-to-sri-lanka",
    "sri-lanka-car-import-documents-explained",
  ],
  // Importing *into* the UK — registration is the step that actually worries
  // a UK-bound buyer, so lead with approval and registration, then the sourcing
  // corridor most of our UK volume comes from.
  unitedkingdom: [
    "registering-an-imported-car-in-the-uk",
    "do-i-need-an-iva-test",
    "iva-test-explained",
    "how-to-buy-a-car-at-japanese-auction",
    "cost-to-import-a-car-from-japan",
  ],
  india: [
    "how-to-import-a-car-from-india",
    "cost-to-import-a-car-from-india",
    "best-cars-to-import-from-india",
    "india-car-export-documents-explained",
  ],
  unitedarabemirates: [
    "how-to-import-a-car-from-the-uae",
    "cost-to-import-a-car-from-the-uae",
    "gcc-spec-cars-explained",
    "best-cars-to-import-from-dubai",
  ],
  australia: [
    "how-to-import-a-car-from-australia",
    "cost-to-import-a-car-from-australia",
    "importing-a-ute-or-4x4-from-australia",
    "best-cars-to-import-from-australia",
  ],
  newzealand: [
    "how-to-import-a-car-from-new-zealand",
    "cost-to-import-a-car-from-new-zealand",
    "new-zealand-vs-japan-for-used-imports",
    "importing-a-used-ev-from-new-zealand",
  ],
  thailand: [
    "how-to-import-a-car-from-thailand",
    "cost-to-import-a-car-from-thailand",
    "best-pickups-to-import-from-thailand",
    "thailand-vs-japan-for-pickup-imports",
  ],
  japan: [
    "how-to-buy-a-car-at-japanese-auction",
    "japanese-auction-grades-explained",
    "cost-to-import-a-car-from-japan",
    "japan-car-export-documents-explained",
  ],
};

/** Lowercase and strip everything but letters, so "Sri Lanka" → "srilanka". */
function normaliseCountry(country: string): string {
  return (country || "").toLowerCase().replace(/[^a-z]/g, "");
}

/**
 * Pick a handful of guides to put in front of a lead. Prefers the destination
 * country's cluster, then tops up from the default set so the caller always
 * gets `limit` posts back (deduped, and never more than we actually publish).
 */
export function getSuggestedPosts(options?: {
  /** Destination country as captured on the inquiry form (`countryOfImport`). */
  destinationCountry?: string;
  limit?: number;
}): BlogPost[] {
  const limit = options?.limit ?? 3;
  const keyed =
    SUGGESTED_BY_DESTINATION[
      normaliseCountry(options?.destinationCountry || "")
    ] || [];

  const seen = new Set<string>();
  const picked: BlogPost[] = [];

  for (const slug of [...keyed, ...DEFAULT_SUGGESTED_SLUGS]) {
    if (picked.length >= limit) break;
    if (!slug || seen.has(slug)) continue;
    seen.add(slug);
    const post = getPost(slug);
    if (post) picked.push(post);
  }

  return picked;
}

export const CLUSTER_ORDER: BlogCluster[] = [
  "Guides",
  "Japan",
  "United Kingdom",
  "UK Registration & IVA",
  "UAE",
  "India",
  "Thailand",
  "Australia",
  "New Zealand",
  "Sri Lanka",
  "Cost & Cheapest",
  "Tax & Rules",
  "Source Country",
];

export function getPostsByCluster(): {
  cluster: BlogCluster;
  posts: BlogPost[];
}[] {
  return CLUSTER_ORDER.map((cluster) => ({
    cluster,
    posts: BLOG_POSTS.filter((p) => p.cluster === cluster),
  })).filter((g) => g.posts.length > 0);
}

export const BLOG_BASE_PATH = "/blog";
