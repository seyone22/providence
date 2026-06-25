// ─────────────────────────────────────────────────────────────────────────────
// Blog content registry — single source of truth for the "Import Cars to Ireland"
// content cluster. Drives the blog index, per-post metadata, JSON-LD, internal
// linking (related posts) and the sitemap.
//
// Post BODIES live in src/content/blog/<slug>.tsx and are mapped by slug in
// src/content/blog/index.ts. This file holds only the metadata.
//
// All tax/cost figures referenced in the posts come from the "Ireland Car Import
// Research" report (2026 Revenue VRT bands, NOx levy, VAT 23%, 0%/10% duty,
// EU–Japan EPA). The report itself notes "verify all figures with Revenue.ie",
// so tax/cost posts carry an indicative-figures disclaimer.
// ─────────────────────────────────────────────────────────────────────────────

export type BlogCluster =
  | "Cost & Cheapest"
  | "Tax & Rules"
  | "Source Country"
  | "Guides";

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
  /** Slugs of related posts for internal linking. */
  related: string[];
  /** FAQs — rendered on-page AND emitted as FAQPage JSON-LD. */
  faqs: BlogFAQ[];
  /** In-page table of contents (anchor ids must match headings in the body). */
  toc: BlogTocItem[];
  /** Mark the pillar/hub post. */
  isPillar?: boolean;
};

const AUTHOR = "Providence Auto";
const PUBLISHED = "2026-06-26";
const UPDATED = "2026-06-26";

export const BLOG_POSTS: BlogPost[] = [
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
      "https://images.unsplash.com/photo-1549924231-f129b911e442?q=80&w=2400&auto=format&fit=crop",
    heroAlt: "Compact hybrid hatchback — a cheap car to import to Ireland",
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

export const CLUSTER_ORDER: BlogCluster[] = [
  "Guides",
  "Cost & Cheapest",
  "Tax & Rules",
  "Source Country",
];

export function getPostsByCluster(): { cluster: BlogCluster; posts: BlogPost[] }[] {
  return CLUSTER_ORDER.map((cluster) => ({
    cluster,
    posts: BLOG_POSTS.filter((p) => p.cluster === cluster),
  })).filter((g) => g.posts.length > 0);
}

export const BLOG_BASE_PATH = "/blog";
