// ─────────────────────────────────────────────────────────────────────────────
// Latest News registry — single source of truth for every published news piece.
//
// Deliberately separate from src/config/blog.ts. The blog is evergreen how-to
// content organised into keyword clusters; news is dated, event-driven
// reporting that ages. Different index page, different schema type
// (NewsArticle rather than BlogPosting), different sitemap cadence.
//
// Scope is general automotive: new-model launches, manufacturer and industry
// moves, auction results, market data and the tax/policy changes that move
// landed cost. Not just the import trade.
//
// Article BODIES live in src/content/news/<slug>.tsx and are mapped by slug in
// src/content/news/index.ts. This file holds only the metadata.
// ─────────────────────────────────────────────────────────────────────────────

import type { BlogFAQ, BlogTocItem } from "./blog";

export type NewsCategory =
  | "Auctions"
  | "Releases"
  | "Market"
  | "Policy & Tax"
  | "Industry"
  | "Providence";

/** External source cited by an article — rendered as a footer source list. */
export type NewsSource = {
  label: string;
  href: string;
  publisher: string;
};

export type NewsArticle = {
  slug: string;
  /** Card/listing title. */
  title: string;
  /** On-page <h1>. */
  h1: string;
  /** SEO <title> (absolute — used as-is, no template). */
  seoTitle: string;
  description: string;
  /** Short listing/teaser line. */
  excerpt: string;
  category: NewsCategory;
  /** One-line dateline shown above the headline, e.g. "Monterey, California". */
  dateline: string;
  keywords: string[];
  author: string;
  /** ISO date — drives ordering on the index. */
  publishDate: string;
  /** ISO date. */
  updatedDate: string;
  readingTimeMins: number;
  heroImage: string;
  heroAlt: string;
  /** Caption under the hero — used to flag illustrative (non-subject) imagery. */
  heroCaption?: string;
  /** In-page table of contents (anchor ids must match headings in the body). */
  toc: BlogTocItem[];
  faqs: BlogFAQ[];
  /** Outbound citations, listed at the foot of the article. */
  sources: NewsSource[];
  /** Slugs of related blog guides for internal linking. */
  relatedGuides: string[];
  /**
   * Slugs of spec-dossier car pages this story announces — a launch piece
   * often covers several debuts, so this is a list rather than a single slug.
   * The link is two-way: the car page carries the article's slug in its
   * `newsSlug` column, and the article renders a "cars in this story" block.
   * Slugs that don't resolve to a live dossier are skipped rather than 404ing.
   */
  linkedVehicleSlugs?: string[];
  /** Pin to the top of the index regardless of date. */
  isFeatured?: boolean;
};

/**
 * Category archive metadata. Each of these gets a real indexable landing page at
 * /latest-news/category/<slug>, which is what actually competes for the
 * head terms ("car industry news", "new car releases") — an index page with a
 * client-side filter would rank for none of them.
 */
export type NewsCategoryMeta = {
  slug: string;
  label: NewsCategory;
  /** Short label for the filter chips. */
  chip: string;
  h1: string;
  seoTitle: string;
  description: string;
  /** One-line intro under the archive H1. */
  blurb: string;
  keywords: string[];
};

export const NEWS_CATEGORIES: NewsCategoryMeta[] = [
  {
    slug: "releases",
    label: "Releases",
    chip: "New releases",
    h1: "New Car Releases & Model Launches",
    seoTitle:
      "New Car Releases 2026 — Launches, Debuts & Reveals | Providence Auto",
    description:
      "Every significant new car release, model launch and world debut, with the specs, prices and on-sale dates that matter — plus whether the car will ever be importable.",
    blurb:
      "World debuts, facelifts and limited runs — with the specification and pricing detail confirmed, not guessed.",
    keywords: [
      "new car releases 2026",
      "new car launches",
      "car reveals 2026",
      "upcoming cars 2026",
      "new supercar releases",
      "world debut cars",
    ],
  },
  {
    slug: "industry",
    label: "Industry",
    chip: "Industry",
    h1: "Automotive Industry News",
    seoTitle:
      "Automotive Industry News — Manufacturers, Tariffs & Market Moves | Providence Auto",
    description:
      "Automotive industry news: manufacturer strategy, tariffs, plant investment, EV transition and the commercial shifts reshaping who sells what, where.",
    blurb:
      "Manufacturers, tariffs, trade and the commercial decisions that reshape what reaches which market.",
    keywords: [
      "automotive industry news",
      "car industry news 2026",
      "car manufacturer news",
      "ev industry news",
      "car tariffs news",
    ],
  },
  {
    slug: "auctions",
    label: "Auctions",
    chip: "Auctions",
    h1: "Car Auction News & Record Results",
    seoTitle:
      "Car Auction News — Record Sales & Results Analysis | Providence Auto",
    description:
      "Car auction news and results analysis from people who bid for a living: record sales, hammer prices in context, and what a headline result actually says about value.",
    blurb:
      "Record sales and hammer prices, put in context by people who bid at auction every week.",
    keywords: [
      "car auction news",
      "record car auction prices",
      "classic car auction results",
      "rm sothebys results",
      "most expensive car sold at auction",
    ],
  },
  {
    slug: "market",
    label: "Market",
    chip: "Market data",
    h1: "Car Market News & Price Data",
    seoTitle:
      "Car Market News — Used Values, Price Data & Trends | Providence Auto",
    description:
      "Car market news and price data: used values, auction indices, currency effects and supply shifts, with the numbers sourced and the caveats stated.",
    blurb:
      "Values, indices, currency and supply — the numbers behind what cars actually cost right now.",
    keywords: [
      "car market news",
      "used car prices 2026",
      "car market analysis",
      "collector car market",
      "used car value trends",
    ],
  },
  {
    slug: "policy-and-tax",
    label: "Policy & Tax",
    chip: "Policy & tax",
    h1: "Car Tax, Policy & Regulation News",
    seoTitle:
      "Car Tax & Motoring Policy News — VRT, ZEV Mandate & Import Rules | Providence Auto",
    description:
      "Motoring tax and policy news for the UK and Ireland: VRT and BIK changes, the ZEV mandate, emissions deadlines and import rule changes — and what each one costs you.",
    blurb:
      "VRT, BIK, the ZEV mandate and import rules — what changed, when it bites, and what it costs.",
    keywords: [
      "car tax news",
      "vrt changes ireland",
      "zev mandate news",
      "car import rule changes",
      "motoring policy uk",
    ],
  },
  {
    slug: "providence",
    label: "Providence",
    chip: "Providence",
    h1: "Providence Auto Company News",
    seoTitle: "Providence Auto Company News & Updates | Providence Auto",
    description:
      "Company news from Providence Auto — new source markets, market openings, service changes and tooling updates.",
    blurb: "What we are building, opening and changing.",
    keywords: ["providence auto news", "car import company news"],
  },
];

const AUTHOR = "Providence Auto";

export const NEWS_ARTICLES: NewsArticle[] = [
  // ── Auctions ──────────────────────────────────────────────────────────────
  {
    slug: "ferrari-luce-chassis-0-40-million-auction",
    isFeatured: true,
    title:
      "Revealed: the man in the red fedora who paid $40m for Ferrari's most hated car",
    h1: "The Man in the Red Fedora: How Dr Herbert Wertheim Paid $40 Million for the Ferrari Everyone Said Nobody Wanted",
    seoTitle:
      "Who Bought the $40 Million Ferrari Luce? Dr Herbert Wertheim, Revealed — Full Story & Price Breakdown",
    description:
      "The buyer of Ferrari Luce chassis 0 has been named: Dr Herbert 'Herbie' Wertheim, the optometrist-inventor turned billionaire investor who also paid $26m for the one-off Daytona SP3 in 2025. The full story of the $40,000,000 hammer, why it went so high, and what $66m of Ferrari charity lots in two years actually buys.",
    excerpt:
      "For 24 hours the buyer was 'an anonymous bidder'. He isn't anonymous any more — and he's the same man who paid $26m for the one-off Daytona SP3 last year. The full story of a $66 million two-year run.",
    category: "Auctions",
    dateline: "Monterey, California",
    keywords: [
      "who bought the ferrari luce",
      "herbert wertheim ferrari",
      "ferrari luce chassis 0 buyer",
      "ferrari luce auction",
      "ferrari luce price",
      "most expensive new car ever sold at auction",
      "rm sothebys monterey 2026",
      "herbie wertheim net worth",
      "ferrari foundation charity auction",
    ],
    author: AUTHOR,
    publishDate: "2026-08-17",
    updatedDate: "2026-08-17",
    readingTimeMins: 11,
    // The actual subject car, photographed at the sale. CC BY-SA 4.0, so the
    // attribution in heroCaption is a licence condition, not a nicety.
    heroImage:
      "https://upload.wikimedia.org/wikipedia/commons/4/49/Ferrari_Luce.jpg",
    heroAlt:
      "Ferrari Luce chassis 0 on display at the RM Sotheby's Monterey auction, finished in one-off Madreperla Semi-Gloss paint",
    heroCaption:
      "Ferrari Luce chassis 0 at RM Sotheby's Monterey, 15 August 2026. Photo by Lcaa9, licensed under CC BY-SA 4.0 via Wikimedia Commons.",
    toc: [
      { id: "the-reveal", label: "The reveal" },
      { id: "who-he-is", label: "Who Herbert Wertheim is" },
      { id: "the-night", label: "How the night unfolded" },
      { id: "the-price", label: "The price, in context" },
      { id: "records", label: "The records it did and didn't break" },
      { id: "why-so-high", label: "Why it went so high" },
      { id: "the-pattern", label: "The $66m pattern" },
      { id: "not-a-market-price", label: "What this is not" },
      { id: "what-it-means", label: "What it means for buyers" },
      { id: "faqs", label: "FAQs" },
    ],
    faqs: [
      {
        q: "Who bought the $40 million Ferrari Luce?",
        a: "Dr Herbert 'Herbie' Wertheim, the American optometrist, inventor and investor, has been named as the buyer of Ferrari Luce chassis 0. Wertheim founded Brain Power Incorporated in 1970 after inventing UV-filtering tints for plastic eyeglass lenses, and built a fortune estimated at roughly $4.6–5 billion through long-term shareholdings, most famously in aerospace supplier Heico. He is also the buyer of the one-off Daytona SP3 'chassis 599+1' that made $26 million at Monterey in 2025.",
      },
      {
        q: "How much did the Ferrari Luce sell for at auction?",
        a: "Ferrari Luce chassis 0 sold for $40,000,000 at RM Sotheby's Monterey auction on 15 August 2026. RM Sotheby's waived its buyer's premium, so the full $40m goes to The Ferrari Foundation, a 501(c)(3) charity funding educational initiatives. The pre-sale estimate had been 'in excess of $1.1 million'.",
      },
      {
        q: "Is the Ferrari Luce the most expensive car ever sold at auction?",
        a: "No. It is the most expensive new car ever sold at public auction, and almost certainly the most expensive EV, but it was not even the top result of its own week — the 1964 Shelby Cobra Daytona Coupe CSX2300 made $42,905,000 at Gooding Christie's the following Friday. The all-time auction record remains the $143m 1955 Mercedes-Benz 300 SLR Uhlenhaut Coupé sold in 2022.",
      },
      {
        q: "Why would anyone pay 62 times list price for a Ferrari Luce?",
        a: "Because the bid is functionally a charitable donation. With the buyer's premium waived and 100% of proceeds going to a registered 501(c)(3), a US taxpayer's effective net cost is far below the headline figure, and the bidder receives a unique first-of-programme car, a world record and public credit for the gift. Add Ferrari's allocation politics — where client standing determines access to future limited-series cars — and the arithmetic stops looking irrational.",
      },
      {
        q: "Does the $40m sale mean a normal Ferrari Luce is now worth millions?",
        a: "No. This was a no-premium charity lot for the first chassis of the programme, with a one-off Tailor Made specification and a tax-deductible destination for the money. Ordinary Luce cars remain a roughly €550,000 / £440,000 list-price model with a sold-out 2026 allocation of around 500 units. Chassis 0's result says almost nothing about what car number 300 will trade for.",
      },
      {
        q: "What are the Ferrari Luce's specifications?",
        a: "The Luce is Ferrari's first series-production electric car: four permanent-magnet motors, one per wheel, for a combined output of roughly 1,035 hp and 730 lb-ft, 0–100 km/h in 2.5 seconds, a 122 kWh battery on an 880-volt architecture, 350 kW peak charging and more than 530 km of claimed range, in a five-seat body.",
      },
    ],
    sources: [
      {
        label:
          "Revealed: the billionaire who bought Ferrari Luce 'Chassis 0' for $40 million",
        href: "https://news.dupontregistry.com/blogs/news/revealed-the-billionaire-who-bought-ferrari-luce-chassis-0-for-40-million",
        publisher: "duPont Registry",
      },
      {
        label:
          "Revealed: the enigmatic billionaire who bought the one-off Ferrari Daytona SP3 for $26 million",
        href: "https://news.dupontregistry.com/blogs/auctions/revealed-the-enigmatic-billionaire-who-bought-one-off-ferrari-daytona-sp3-for-26-million",
        publisher: "duPont Registry",
      },
      {
        label:
          "2026 Ferrari Luce 'Tailor Made', lot 345 — The Monterey Auction",
        href: "https://rmsothebys.com/auctions/mo26/lots/r0150-2026-ferrari-luce-tailor-made/",
        publisher: "RM Sotheby's",
      },
      {
        label: "First Ferrari Luce EV sells for $40 million, 36x its estimate",
        href: "https://electrek.co/2026/08/16/ferrari-luce-chassis-0-sells-40-million-record/",
        publisher: "Electrek",
      },
      {
        label: "Ferrari Luce chassis 0 sells for $40m at Monterey auction",
        href: "https://evpowered.co.uk/news/first-ferrari-luce-sells-for-40-million-at-monterey-charity-auction/",
        publisher: "EV Powered",
      },
      {
        label: "Herbert Wertheim — profile",
        href: "https://www.forbes.com/profile/herbert-wertheim/",
        publisher: "Forbes",
      },
      {
        label: "Herbert Wertheim — biography",
        href: "https://en.wikipedia.org/wiki/Herbert_Wertheim",
        publisher: "Wikipedia",
      },
      {
        label:
          "Daytona SP3 sets the record for the highest value ever achieved at auction for a new Ferrari",
        href: "https://www.ferrari.com/en-EN/articles/ferrari-daytona-sp3-auction",
        publisher: "Ferrari",
      },
      {
        label: "Ferrari's $640K Luce EV sells out 2026 allocation",
        href: "https://electrek.co/2026/07/29/ferrari-luce-ev-sold-out-2026-allocation/",
        publisher: "Electrek",
      },
      {
        label: "The top 30 most expensive cars ever sold at auction",
        href: "https://www.hagerty.com/media/market-trends/the-top-30-most-expensive-cars-ever-sold-at-auction/",
        publisher: "Hagerty",
      },
    ],
    relatedGuides: [
      "how-to-buy-a-car-at-japanese-auction",
      "japanese-auction-grades-explained",
      "importing-a-used-ev-from-new-zealand",
    ],
  },

  // ── Market ────────────────────────────────────────────────────────────────
  {
    slug: "monterey-2026-auction-week-market-report",
    title:
      "Monterey 2026: a $42.9m Cobra, a $40m EV, and a market changing hands",
    h1: "Monterey Car Week 2026: The Half-Billion-Dollar Forecast, the $42.9m Cobra, and the Generation Quietly Taking Over",
    seoTitle:
      "Monterey Car Week 2026 Auction Results: Record Cobra Daytona, $40m Ferrari Luce & Market Analysis",
    description:
      "Monterey Car Week 2026 results and market analysis: the $42,905,000 Shelby Cobra Daytona Coupe that became the most expensive American car ever auctioned, the $40m Ferrari Luce, Hagerty's half-billion-dollar forecast, and the generational shift moving money out of pre-war metal and into 1990s supercars.",
    excerpt:
      "Two nine-figure-adjacent headline sales, a forecast of $470–500m, and a buyer base that is visibly getting younger. What Monterey 2026 says about where collector money is actually going.",
    category: "Market",
    dateline: "Pebble Beach, California",
    keywords: [
      "monterey car week 2026 results",
      "shelby cobra daytona coupe auction record",
      "most expensive american car ever sold",
      "monterey auction totals 2026",
      "collector car market 2026",
      "pebble beach auction results",
    ],
    author: AUTHOR,
    publishDate: "2026-08-17",
    updatedDate: "2026-08-17",
    readingTimeMins: 8,
    heroImage:
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=2400&auto=format&fit=crop",
    heroAlt:
      "A classic sports car at a concours event, illustrating collector car auction coverage",
    heroCaption:
      "Illustrative image — not a vehicle offered at the 2026 Monterey sales.",
    toc: [
      { id: "headline", label: "The headline numbers" },
      { id: "cobra", label: "The $42.9m Cobra" },
      { id: "forecast", label: "The half-billion forecast" },
      { id: "generation", label: "The generational handover" },
      { id: "what-rose", label: "What rose, what didn't" },
      { id: "reading-it", label: "How to read a week like this" },
      { id: "faqs", label: "FAQs" },
    ],
    faqs: [
      {
        q: "What was the most expensive car sold at Monterey Car Week 2026?",
        a: "The 1964 Shelby Cobra Daytona Coupe, chassis CSX2300, sold for $42,905,000 including buyer's premium at Gooding Christie's Pebble Beach auction. It set three records simultaneously: most expensive American car ever sold at public auction, most expensive Shelby, and the most valuable car ever sold by Gooding Christie's. The Ferrari Luce chassis 0 charity lot at $40,000,000 was the week's second-highest result.",
      },
      {
        q: "How much did Monterey 2026 auctions total?",
        a: "Hagerty forecast $470–500 million ahead of the week, against $432.7 million in 2025 and the standing record of $471 million from 2022. Final audited totals across all houses were still being compiled at the time of publication, and early aggregate figures circulating online disagree with each other — we will update this article when the houses publish reconciled numbers.",
      },
      {
        q: "Is the collector car market still going up in 2026?",
        a: "Selectively. The strength in 2026 is concentrated in limited-production sports cars from the 1990s and 2000s — Ferrari F40, F50 and Enzo, Bugatti Veyron, Koenigsegg, Pagani — as millennial and Gen Z buyers replace baby boomers at the top of the market. Cars whose buyer base is ageing out have not moved in the same way, and provenance premiums have widened rather than narrowed.",
      },
      {
        q: "Why did an American car finally beat the $22m Duesenberg record?",
        a: "CSX2300 is the third of only six Shelby Cobra Daytona Coupes built and the only one Carroll Shelby personally owned, with a period competition record including the 1964 Tour de France Automobile, Daytona, Sebring, the Nürburgring and Reims. Documented racing history plus single-figure production plus a named-owner connection is the exact combination that commands 30–50% premiums at this level.",
      },
    ],
    sources: [
      {
        label:
          "Monterey Car Week auctions could hit a record $500 million, with help from younger buyers",
        href: "https://www.cnbc.com/2026/08/13/monterey-car-week-auctions-sales-estimates.html",
        publisher: "CNBC",
      },
      {
        label:
          "$42.9M Shelby Cobra Daytona Coupe is the most expensive American car ever sold at auction",
        href: "https://www.hagerty.com/media/market-trends/sotw-monterey-edition/",
        publisher: "Hagerty",
      },
      {
        label:
          "Carroll Shelby's former Cobra Daytona Coupe sets $42.9 million world record",
        href: "https://news.dupontregistry.com/blogs/auctions/carroll-shelbys-former-daytona-cobra-coupe-becomes-the-most-expensive-american-car-ever-sold-at-auction-at-42-9-million",
        publisher: "duPont Registry",
      },
      {
        label:
          "Gooding Christie's 2026 Pebble Beach auctions: 1964 Shelby Cobra Daytona Coupe CSX2300",
        href: "https://www.oldcarsweekly.com/gooding-christies-2026-pebble-beach-auctions-1964-shelby-cobra-daytona-coupe-csx2300",
        publisher: "Old Cars Weekly",
      },
      {
        label: "We're live from Monterey Car Week 2026",
        href: "https://www.hagerty.com/media/market-trends/were-live-from-monterey-car-week-2026/",
        publisher: "Hagerty",
      },
      {
        label: "RM Sotheby's The Monterey Auction 2026: top 10 results",
        href: "https://news.dupontregistry.com/blogs/auctions/rm-sothebys-the-monterey-auction-2026-top-10-results-highlights",
        publisher: "duPont Registry",
      },
    ],
    relatedGuides: [
      "how-to-buy-a-car-at-japanese-auction",
      "japanese-auction-grades-explained",
      "uk-car-history-checks-explained",
    ],
  },

  // ── Releases ──────────────────────────────────────────────────────────────
  {
    slug: "monterey-car-week-2026-new-car-debuts",
    title: "Every significant new car revealed at Monterey Car Week 2026",
    h1: "Every Significant New Car Revealed at Monterey Car Week 2026 — And Which Ones You Can Actually Buy",
    seoTitle:
      "Monterey Car Week 2026 New Car Debuts: Every Reveal, Spec & Price | Providence Auto",
    description:
      "The full list of new cars revealed at Monterey Car Week 2026: Lamborghini Revuelto SV and Miura 60° Homage, Bugatti Destrier, Hennessey Blackbird, Eccentrica V12 Roadster, Ferrari CZ26, Acura's concept, Bentley, Cadillac and more — with production numbers, prices and availability.",
    excerpt:
      "The Quail has quietly become the most important launch venue in the industry. Fifteen-plus reveals in one week, from a 1,578 hp one-off Bugatti to an 800 hp manual Hennessey — and a note on which are already sold out.",
    category: "Releases",
    dateline: "Carmel Valley, California",
    keywords: [
      "monterey car week 2026 debuts",
      "new car releases 2026",
      "the quail 2026 reveals",
      "lamborghini revuelto sv",
      "bugatti destrier",
      "hennessey blackbird",
      "pebble beach 2026 new cars",
    ],
    author: AUTHOR,
    publishDate: "2026-08-16",
    updatedDate: "2026-08-17",
    readingTimeMins: 9,
    heroImage:
      "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=2400&auto=format&fit=crop",
    heroAlt:
      "A modern supercar, illustrating coverage of new model launches at Monterey Car Week",
    heroCaption:
      "Illustrative image — not one of the cars revealed at Monterey Car Week 2026.",
    toc: [
      { id: "why-quail", label: "Why The Quail matters now" },
      { id: "hypercars", label: "The hypercars" },
      { id: "limited-runs", label: "Limited runs and restomods" },
      { id: "mainstream", label: "The mainstream reveals" },
      { id: "table", label: "Every reveal at a glance" },
      { id: "importable", label: "Which of these are importable" },
      { id: "faqs", label: "FAQs" },
    ],
    faqs: [
      {
        q: "What cars were revealed at Monterey Car Week 2026?",
        a: "The Quail hosted more than a dozen world premieres on 14 August 2026, including the Lamborghini Revuelto SV, the one-off Bugatti Destrier from the Programme Solitaire, the Hennessey Blackbird, the Eccentrica V12 Roadster, an Acura design-language concept, Bentley's Continental Supersports and Bentayga X, Cadillac's Celestiq Night Test one-off, a new Gordon Murray Special Vehicles supercar and Aston Martin's DB12 S Tribute trio. Ferrari revealed the one-off CZ26 at Pebble Beach, and Lamborghini showed the 99-unit Revuelto Miura 60° Homage.",
      },
      {
        q: "What is the Bugatti Destrier?",
        a: "A road-legal one-off built under Bugatti's Programme Solitaire and shown publicly for the first time at Monterey Car Week 2026. It uses the 8.0-litre quad-turbocharged W16 producing 1,578 hp, stands just 39.4 inches tall, and runs 20-inch front and 21-inch rear wheels. As a Solitaire commission it is a single car built to one client's brief and is not available to order.",
      },
      {
        q: "How much is the Hennessey Blackbird and can I buy one?",
        a: "The Hennessey Blackbird is priced at $2.5 million with 71 units planned, and production is scheduled to start in 2029. It uses a naturally aspirated 6.2-litre V8 producing 800–850 hp with a six-speed manual, weighs under 3,000 lb, and Hennessey quotes 0–60 mph in 2.5 seconds with a 220 mph top speed.",
      },
      {
        q: "Can these new models be imported to Ireland or the UK?",
        a: "Most are US-market or global limited runs, and the practical constraint is allocation rather than shipping. Cars sold in single figures — the Bugatti Destrier, Cadillac Celestiq Night Test, Aston Martin DB12 S Tribute trio — are already spoken for. Series models like the Revuelto SV are ordered through the manufacturer's own dealer network. Where importing genuinely helps is on US-market cars with no European allocation, where the landed cost calculation (duty, VAT, IVA/NCT approval) decides whether it is worth doing.",
      },
    ],
    sources: [
      {
        label:
          "Monterey Car Week 2026: every new supercar, hypercar and concept",
        href: "https://www.motor1.com/features/804418/monterey-car-week-2026-debuts/",
        publisher: "Motor1",
      },
      {
        label:
          "Monterey Car Week 2026 sees the unveiling of a plethora of exciting new models",
        href: "https://www.magnetomagazine.com/articles/monterey-car-week-2026-sees-the-unveiling-of-a-plethora-of-exciting-new-models/",
        publisher: "Magneto",
      },
      {
        label: "Ferrari CZ26 debuts at Pebble Beach",
        href: "https://www.ferrari.com/en-EN/magazine/articles/ferrari-cz26-pebble-beach-debut",
        publisher: "Ferrari",
      },
      {
        label:
          "Acura to reveal concept car previewing next-generation design at 2026 Monterey Car Week",
        href: "https://acuranews.com/en-US/releases/acura-to-reveal-concept-car-previewing-next-generation-design-at-2026-monterey-car-week",
        publisher: "Acura",
      },
      {
        label:
          "Monterey Car Week 2026: California showcases the most exclusive new models",
        href: "https://en.ilsole24ore.com/art/monterey-car-week-2026-forget-the-california-motor-show-the-most-exclusive-new-models-are-on-display-AJDOlIk",
        publisher: "Il Sole 24 Ore",
      },
      {
        label:
          "Monterey Car Week & Pebble Beach Concours d'Elegance returns August 7–16, 2026",
        href: "https://www.prnewswire.com/news-releases/monterey-car-week--pebble-beach-concours-delegance-returns-august-716-2026-302839650.html",
        publisher: "PR Newswire",
      },
    ],
    relatedGuides: [
      "best-cars-to-import-from-the-uk",
      "cost-to-import-a-car-from-the-uk",
      "gcc-spec-cars-explained",
    ],
    // Car pages for the series-production reveals from this story — the ones a
    // customer can realistically be allocated, as opposed to the one-offs
    // (Destrier, Celestiq Night Test, DB12 S Tribute) which are already spoken
    // for. A slug listed here that has no live dossier yet is simply skipped,
    // so these can be authored ahead of the pages being built.
    linkedVehicleSlugs: [
      "lamborghini-revuelto-sv",
      "lamborghini-revuelto-miura-60-homage",
      "hennessey-blackbird",
      "bentley-continental-supersports",
      "bentley-bentayga-x",
    ],
  },

  // ── Policy & Tax ──────────────────────────────────────────────────────────
  {
    slug: "uk-zev-mandate-review-2026-consultation",
    title: "The UK has reopened the 2030 petrol and diesel ban — again",
    h1: "The UK Has Reopened the 2030 Petrol and Diesel Ban: What the New ZEV Mandate Review Actually Changes",
    seoTitle:
      "UK ZEV Mandate Review 2026: 2030 Ban Consultation, Deadlines & What It Means for Buyers",
    description:
      "The Department for Transport launched a fresh ZEV mandate review on 14 August 2026, with responses due by 23 October. What is on the table, the 2026 target of 33%, the hybrid reprieve to 2035, the £7.5bn support package — and what it means if you are buying or importing a car now.",
    excerpt:
      "A new consultation, a 23 October deadline and a 2030 deadline that has now moved twice. What is genuinely settled, what is back in play, and what it changes for anyone buying a car this year.",
    category: "Policy & Tax",
    dateline: "London",
    keywords: [
      "zev mandate review 2026",
      "uk 2030 petrol diesel ban",
      "zev mandate consultation",
      "uk ev policy 2026",
      "electric car grant uk",
      "uk car emissions rules",
    ],
    author: AUTHOR,
    publishDate: "2026-08-15",
    updatedDate: "2026-08-17",
    readingTimeMins: 8,
    heroImage:
      "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?q=80&w=2400&auto=format&fit=crop",
    heroAlt:
      "A car on a UK road, illustrating coverage of UK vehicle emissions policy",
    heroCaption: "Illustrative image.",
    toc: [
      { id: "what-happened", label: "What was announced" },
      { id: "timetable", label: "The timetable" },
      { id: "targets", label: "The targets as they stand" },
      { id: "hybrids", label: "The hybrid reprieve" },
      { id: "money", label: "The £7.5bn behind it" },
      { id: "what-it-means", label: "What it means for buyers" },
      { id: "faqs", label: "FAQs" },
    ],
    faqs: [
      {
        q: "What is the UK ZEV mandate review 2026?",
        a: "On 14 August 2026 the Department for Transport launched a consultation asking manufacturers, suppliers, charge point operators, dealers, consumers and communities for views on the pathway to ending sales of new petrol and diesel cars by 2030 and making all new cars and vans zero emission by 2035. Responses close on 23 October 2026.",
      },
      {
        q: "Is the 2030 petrol and diesel ban still happening?",
        a: "As policy stands, yes. The 2030 end of sale for new pure petrol and diesel cars was restored after having been pushed to 2035, and from 1 January 2030 you will not be able to buy a new car powered solely by petrol or diesel. The current review is about the pathway and flexibilities rather than a proposal to scrap the date — but a live consultation is, by definition, an open question.",
      },
      {
        q: "What percentage of new cars must be electric in 2026?",
        a: "The ZEV mandate target for 2026 is 33% of a manufacturer's new car sales, rising on a stepped path to 80% in 2030 and 100% by 2035. Manufacturers below target rely on flexibilities and borrowing between years rather than paying headline fines, which is why discounting on EVs tends to intensify late in a compliance year.",
      },
      {
        q: "Does the 2030 ban affect used or imported cars?",
        a: "No. The mandate and the 2030 date apply to sales of new vehicles by manufacturers. Buying, selling, importing and registering a used petrol or diesel car remains legal after 2030, and nothing in this review changes that. What it does change is supply: as manufacturers reweight production toward EVs, the used ICE cars worth importing become a finite and slowly ageing pool.",
      },
    ],
    sources: [
      {
        label:
          "Review launched to shape pathway to reach zero emission driving by 2035",
        href: "https://wired-gov.net/wg/news.nsf/articles/Review+launched+to+shape+pathway+to+reach+zero+emission+driving+by+2035+14082026161000?open=",
        publisher: "Department for Transport",
      },
      {
        label:
          "Phasing out sales of new petrol and diesel cars from 2030 and supporting the ZEV transition — government response",
        href: "https://www.gov.uk/government/consultations/phasing-out-sales-of-new-petrol-and-diesel-cars-from-2030-and-supporting-the-zev-transition/outcome/phasing-out-sales-of-new-petrol-and-diesel-cars-from-2030-and-supporting-the-zev-transition-summary-of-responses-and-joint-government-response",
        publisher: "GOV.UK",
      },
      {
        label: "ZEV mandate: 33% of new cars must be electric this year",
        href: "https://www.whatcar.com/advice/buying/what-is-the-zev-mandate/n26196",
        publisher: "What Car?",
      },
      {
        label:
          "UK ZEV mandate: what it means for the automotive industry on the road to 2030",
        href: "https://www.coxautoinc.eu/ev-hub/industry-ev-hub/resources/uk-zev-mandate-what-it-means-for-the-automotive-industry-on-the-road-to-2030/",
        publisher: "Cox Automotive",
      },
    ],
    relatedGuides: [
      "how-to-import-a-car-from-the-uk",
      "cost-to-import-a-car-from-the-uk",
      "uk-car-export-documents-explained",
    ],
  },

  // ── Industry ──────────────────────────────────────────────────────────────
  {
    slug: "chinese-ev-brands-record-europe-market-share-2026",
    title:
      "Chinese EV brands just took a record share of Europe — despite 45% tariffs",
    h1: "Chinese EV Brands Have Taken a Record Share of Europe's Electric Market — and Tariffs Have Not Stopped Them",
    seoTitle:
      "Chinese EVs Hit Record 14.2% of Europe's EV Market in 2026 — Tariffs, Brands & UK Impact",
    description:
      "Chinese brands are on track for a record 14.2% of Europe's battery-electric market in 2026, having overtaken Japanese manufacturers for the number two position overall — despite EU duties reaching up to 45.3%. Why the UK is the single biggest destination, and what it means for residuals.",
    excerpt:
      "BYD, Chery, SAIC and Xpeng sold 171,800 cars in Western Europe in five months. The EU stacked duties up to 45.3% on them. It barely dented the trajectory — and the UK is taking a quarter of the total.",
    category: "Industry",
    dateline: "Brussels",
    keywords: [
      "chinese ev market share europe",
      "byd europe sales 2026",
      "eu tariffs chinese evs",
      "chinese cars uk market share",
      "chinese ev brands europe",
      "automotive industry news 2026",
    ],
    author: AUTHOR,
    publishDate: "2026-08-12",
    updatedDate: "2026-08-17",
    readingTimeMins: 7,
    heroImage:
      "https://images.unsplash.com/photo-1663852408695-f57f4d75a536?q=80&w=2400&auto=format&fit=crop",
    heroAlt:
      "An electric car charging, illustrating coverage of the European EV market",
    heroCaption: "Illustrative image.",
    toc: [
      { id: "numbers", label: "The numbers" },
      { id: "tariffs", label: "The tariffs, brand by brand" },
      { id: "uk", label: "Why the UK is the entry point" },
      { id: "japan", label: "Overtaking Japan" },
      { id: "residuals", label: "What it means for values" },
      { id: "faqs", label: "FAQs" },
    ],
    faqs: [
      {
        q: "What share of the European EV market do Chinese brands have?",
        a: "Chinese brands are on track for a record 14.2% of Europe's battery-electric market in 2026. BYD, Chery, SAIC and Xpeng together sold 171,800 vehicles across Western Europe in the first five months of 2026. Across the total car market — not just EVs — Chinese manufacturers have moved into second place by market share, ahead of Japanese brands for the first time.",
      },
      {
        q: "How much tariff do Chinese EVs pay to enter the EU?",
        a: "On top of the standard 10% import duty, the EU applies manufacturer-specific countervailing duties: roughly 17.0% for BYD, 18.8% for Geely and 35.3% for SAIC. The combined rate therefore reaches up to about 45.3% for the worst-affected manufacturer. Rates differ by company because they reflect each one's assessed subsidy level and degree of cooperation with the EU investigation.",
      },
      {
        q: "Why does the UK buy so many Chinese EVs?",
        a: "Because the UK did not follow the EU in imposing anti-subsidy duties on Chinese electric cars. That single policy divergence makes Britain structurally cheaper to supply than the EU-27, and the UK now accounts for roughly 26% of Chinese EV sales across the 18 largest Western European markets — the biggest single share, ahead of Italy at about 20%.",
      },
      {
        q: "Should the tariff gap change what I import?",
        a: "It should at least be in the calculation. A Chinese-brand EV bought used in the UK carries no EU countervailing duty in its history, but importing it into an EU member state means paying that state's registration tax on arrival — VRT in Ireland's case — on an OMSP the Revenue sets. The tariff story affects new-car list prices; your landed cost is driven by registration tax and residuals, and those are the numbers to model.",
      },
    ],
    sources: [
      {
        label: "Chinese EVs set for record 14.2% share of European market",
        href: "https://eandt.theiet.org/2026/08/10/chinese-ev-sales-hit-record-high-europe-14-2",
        publisher: "Engineering & Technology",
      },
      {
        label:
          "Chinese EVs hit fresh sales highs in western Europe amid EU tariffs",
        href: "https://www.globaltimes.cn/page/202608/1367877.shtml",
        publisher: "Global Times",
      },
      {
        label:
          "Chinese EV brands claim a record 14.2% of Europe's battery car market, despite tariffs",
        href: "https://www.thecooldown.com/green-business/chinese-evs-market-share-europe-2026/",
        publisher: "The Cool Down",
      },
      {
        label:
          "Chinese automakers surpass Japanese brands in Europe for the first time despite 45% tariffs",
        href: "https://finance.biggo.com/news/bbd62c11-37ba-4ab3-8578-0884313b3b40",
        publisher: "BigGo Finance",
      },
    ],
    relatedGuides: [
      "how-to-import-a-car-from-the-uk",
      "importing-cars-to-ireland",
      "importing-a-used-ev-from-new-zealand",
    ],
  },

  {
    slug: "ireland-ev-incentives-taper-2026-2028",
    title: "Ireland's EV incentives start winding down — here's the timetable",
    h1: "Ireland's EV Incentives Are Being Wound Down: The VRT and BIK Timetable to 2028",
    seoTitle:
      "Ireland EV Tax Changes 2026–2028: VRT Relief End Date & BIK Taper Explained",
    description:
      "Ireland's €5,000 VRT relief for electric vehicles now runs to 31 December 2026, and the BIK original market value reduction tapers from €10,000 in 2026 to €5,000 in 2027 and €2,500 in 2028. The full timetable, what it costs, and why it changes when you should import.",
    excerpt:
      "The €5,000 VRT relief has a hard end date. The BIK relief halves, then halves again. If you are planning an EV import or a company car change, the calendar now matters more than the spec.",
    category: "Policy & Tax",
    dateline: "Dublin",
    keywords: [
      "ireland ev vrt relief 2026",
      "vrt relief electric vehicles ireland",
      "bik electric car ireland 2027",
      "ireland ev tax changes",
      "importing an ev to ireland",
      "vrt changes ireland",
    ],
    author: AUTHOR,
    publishDate: "2026-08-10",
    updatedDate: "2026-08-17",
    readingTimeMins: 7,
    heroImage:
      "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=2400&auto=format&fit=crop",
    heroAlt:
      "Vehicle registration paperwork, illustrating coverage of Irish VRT and BIK changes",
    heroCaption: "Illustrative image.",
    toc: [
      { id: "headline", label: "What is changing" },
      { id: "vrt", label: "The VRT relief and its end date" },
      { id: "bik", label: "The BIK taper" },
      { id: "worked", label: "What it costs in practice" },
      { id: "timing", label: "What this does to timing" },
      { id: "faqs", label: "FAQs" },
    ],
    faqs: [
      {
        q: "When does Ireland's VRT relief for electric vehicles end?",
        a: "The VRT relief for electric vehicles — up to €5,000 for a new EV with an OMSP under €40,000 — was due to end on 31 December 2025 and has been extended by one year to 31 December 2026. It has been extended before, so a further extension is possible, but no relief beyond that date is currently legislated. Always confirm the position with Revenue before committing to a purchase.",
      },
      {
        q: "How is BIK on electric company cars in Ireland changing?",
        a: "From 1 January 2026 zero-emission company cars sit in BIK Category A1, with the charge running from 6% to 15% of original market value depending on business mileage. Separately, the temporary universal reduction to OMV remains at €10,000 for 2026, then tapers to €5,000 for 2027 and €2,500 for 2028, ending on 31 December 2028.",
      },
      {
        q: "Should I import an EV to Ireland before the end of 2026?",
        a: "If the car qualifies — a new EV with an OMSP under €40,000 — then registering before 31 December 2026 is worth up to €5,000 that is not currently legislated to exist afterwards. That is a real number and it should be weighed against shipping lead times, which for most of our source markets run to several weeks. For used EVs the relief position differs, so model the specific car rather than assuming.",
      },
      {
        q: "Does the VRT relief apply to used imported EVs?",
        a: "The headline €5,000 relief is framed around new electric vehicles with an OMSP below €40,000, and Revenue assesses VRT on the OMSP it determines for the specific vehicle rather than on what you paid. That means a used EV import needs its own calculation. Our Ireland cost calculator produces the landed figure, but the binding number is always Revenue's.",
      },
    ],
    sources: [
      {
        label: "Vehicle Registration Tax (VRT)",
        href: "https://www.revenue.ie/en/vrt/vehicle-registration-tax/index.aspx",
        publisher: "Revenue.ie",
      },
      {
        label: "Calculating Vehicle Registration Tax (VRT)",
        href: "https://www.revenue.ie/en/vrt/calculating-vrt/applying-tax.aspx",
        publisher: "Revenue.ie",
      },
      {
        label:
          "Electric vehicles in Ireland: tax savings, incentives and what to know",
        href: "https://www.irishtaxhub.ie/blog/electric-vehicles-in-ireland-tax-savings-incentives-and-what-to-know",
        publisher: "Irish Tax Hub",
      },
      {
        label: "Vehicle Registration Tax — motoring information",
        href: "https://www.simi.ie/en/motoring-info/taxation-2021",
        publisher: "SIMI",
      },
    ],
    relatedGuides: [
      "vrt-explained-ireland",
      "cost-of-importing-a-car-to-ireland",
      "importing-cars-to-ireland",
    ],
  },

  // ── Market ────────────────────────────────────────────────────────────────
  {
    slug: "japan-used-car-exports-record-weak-yen-2026",
    title: "Japan exported a record 1.7m used cars — and the weak yen is why",
    h1: "Japan Exported a Record 1.7 Million Used Cars: What the Weak Yen Is Doing to Auction Prices",
    seoTitle:
      "Japan Used Car Exports Hit Record 1.7 Million — Weak Yen, Auction Prices & 2026 Outlook",
    description:
      "Japan's used vehicle exports hit a record of roughly 1.7 million units, up 9.1% and a third consecutive annual high, with the yen near ¥161–162 to the dollar. Why auction prices are rising in yen while still falling in euro and sterling terms, and how long the window stays open.",
    excerpt:
      "A third straight record year of exports, a currency near its weakest since 1986, and auction prices up about 15% in yen. Three numbers that pull in different directions — and only one of them is in your favour.",
    category: "Market",
    dateline: "Tokyo",
    keywords: [
      "japan used car exports record",
      "japan car auction prices 2026",
      "weak yen used car imports",
      "japanese used car market 2026",
      "importing from japan 2026",
      "japan auction price index",
    ],
    author: AUTHOR,
    publishDate: "2026-08-07",
    updatedDate: "2026-08-17",
    readingTimeMins: 8,
    heroImage: "/import-cars/japan-car-truck.jpeg",
    heroAlt:
      "Vehicles loaded for export in Japan, illustrating record Japanese used car export volumes",
    toc: [
      { id: "numbers", label: "The numbers" },
      { id: "yen", label: "What the yen is doing" },
      { id: "prices", label: "Auction prices: the real read" },
      { id: "competition", label: "Who you are bidding against" },
      { id: "window", label: "How long the window stays open" },
      { id: "faqs", label: "FAQs" },
    ],
    faqs: [
      {
        q: "How many used cars does Japan export each year?",
        a: "Japan's used vehicle exports reached a record of roughly 1.7 million units in 2025, up 9.1% year on year and the third consecutive annual record. The largest destinations include Russia, Tanzania, the UAE, New Zealand and South Africa, with African markets combined taking around 136,000 units.",
      },
      {
        q: "Is the weak yen still making Japanese imports cheaper?",
        a: "Partly. As of late June 2026 the yen traded around ¥161–162 to the US dollar, close to its weakest since 1986, which is a substantial discount for any buyer earning in dollars, euro or sterling. But constant-quality auction prices have risen roughly 15% in yen year on year, so a meaningful share of the currency advantage is being absorbed by the yen price of the cars themselves.",
      },
      {
        q: "Why are Japanese auction prices rising if supply is at a record?",
        a: "Because export demand is strong enough to pull the domestic market up with it. Buyers across Africa, the CIS region, South Asia and the Pacific are competing for the same well-maintained stock, and that bidding pressure feeds back into domestic auction halls. Headline average prices also overstate the move — they reflect a richer mix of high-grade cars and fewer cheap, rough ones, with constant-quality inflation closer to 1.7% in a recent month.",
      },
      {
        q: "Does a record export year mean less choice for me?",
        a: "It means more competition per lot rather than less stock overall. Volume is at a record, but so is the number of bidders chasing the grade 4 and above cars that European buyers want. In practice that raises the value of bidding discipline: a walk-away number derived from your own landed-cost model matters more in a hot hall than in a quiet one.",
      },
    ],
    sources: [
      {
        label:
          "Japan's once-affordable used cars threatened by soaring prices, weak yen",
        href: "https://asia.nikkei.com/business/automobiles/japan-s-once-affordable-used-cars-threatened-by-soaring-prices-weak-yen",
        publisher: "Nikkei Asia",
      },
      {
        label: "Japan car auction prices July 2026: insider costs and deals",
        href: "https://blog.japanesecartrade.com/japan-car-auction-price-guide-july-2026-insider-costs-deals/",
        publisher: "Japanese Car Trade",
      },
      {
        label: "Is the weak yen bonus over? A deep dive into used car exports",
        href: "https://providecars.co.jp/blog/japan-used-car-export-2026-2",
        publisher: "Provide Cars",
      },
      {
        label: "Japan used car price index — importer's guide",
        href: "https://providecars.co.jp/blog/may-2026-japan-used-car-price-index-importer-guide",
        publisher: "Provide Cars",
      },
    ],
    relatedGuides: [
      "how-to-buy-a-car-at-japanese-auction",
      "japanese-auction-grades-explained",
      "cost-to-import-a-car-from-japan",
    ],
  },

  // ── Releases ──────────────────────────────────────────────────────────────
  {
    slug: "mercedes-maybach-s-580-e-first-class-uk-spec",
    title:
      "Mercedes-Maybach S 580 e First Class: £206,090, and a CO₂ figure worth reading",
    h1: "Mercedes-Maybach S 580 e First Class: The UK Specification, the £206,090 Price, and the 69 g/km That Sets Your Tax",
    seoTitle: "Mercedes-Maybach S 580 e First Class: UK Spec and Price",
    description:
      "Mercedes-Maybach S 580 e First Class: £206,090 UK on-the-road, 585 hp, 58 miles of electric range, and the 69 g/km CO₂ figure that decides your registration tax.",
    excerpt:
      "A 585 hp plug-in hybrid limousine with a £16,000 paint option and a CO₂ figure higher than plug-in buyers expect. The full UK specification, and why the on-the-road price is not your CIF base.",
    category: "Releases",
    dateline: "London",
    keywords: [
      "mercedes-maybach s 580 e",
      "maybach s 580 e price uk",
      "maybach s-class first class specification",
      "mercedes-maybach s 580 e co2 emissions",
      "maybach s 580 e electric range",
      "how much is the mercedes-maybach s 580 e",
      "can you import a mercedes-maybach s 580 e",
    ],
    author: AUTHOR,
    publishDate: "2026-08-18",
    updatedDate: "2026-08-18",
    readingTimeMins: 10,
    heroImage:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/MERCEDES_MAYBACH_S-CLASS_%28W223%29_China_%2826%29.jpg/1280px-MERCEDES_MAYBACH_S-CLASS_%28W223%29_China_%2826%29.jpg",
    heroAlt:
      "Mercedes-Maybach S-Class (W223) long-wheelbase saloon photographed in Shenzhen, China",
    heroCaption:
      "Illustrative image — a Mercedes-Maybach S-Class (W223) photographed in Shenzhen on 15 January 2026, not the S 580 e First Class specification described here. Photo by Dinkun Chen, licensed under CC BY-SA 4.0 via Wikimedia Commons.",
    toc: [
      { id: "what-it-is", label: "What it actually is" },
      { id: "the-numbers", label: "The specification in full" },
      { id: "co2", label: "Why 69 g/km matters" },
      { id: "landed", label: "The price is not your CIF base" },
      { id: "rhd-lhd", label: "Can you import one?" },
      { id: "who-should-not", label: "Who should not buy it new" },
      { id: "timing", label: "Order now or wait?" },
      { id: "faqs", label: "FAQs" },
    ],
    faqs: [
      {
        q: "How much does the Mercedes-Maybach S 580 e First Class cost in the UK?",
        a: "As configured on the Mercedes-Benz Cars UK site in March 2026, £206,090 on the road. That breaks down as a £190,090 basic price plus £16,000 of selected equipment, which in this configuration is entirely accounted for by the Maybach two-tone paint in obsidian black over velvet brown. The on-the-road figure includes UK VAT at 20%, the road fund licence, a £730 delivery charge, a £55 first registration fee, £50 of fuel and £25 of number plates.",
      },
      {
        q: "What are the Mercedes-Maybach S 580 e specifications?",
        a: "A 2,999 cc petrol inline-six producing 330 kW (449 hp) works with a 120 kW (163 hp) electric motor for a system output of 430 kW (585 hp) and 750 Nm, through a 9G-TRONIC automatic and all-wheel drive. It reaches 62 mph in 4.8 seconds and is limited to 155 mph. The usable battery is 21.96 kWh, giving 58 miles of WLTP electric range, and the car is 5,484 mm long on a 3,396 mm wheelbase.",
      },
      {
        q: "What is the CO2 figure for the Maybach S 580 e, and why does it matter?",
        a: "The Mercedes-Benz UK configurator declares weighted CO₂ of 69 g/km under the Euro 6e-bis standard. It matters because registration tax in many markets is banded by CO₂, and the authority reads the figure from the vehicle's Certificate of Conformity rather than from a brochure. Plug-in hybrids have historically advertised lower figures, so a buyer budgeting from an older number can be caught out by a higher band.",
      },
      {
        q: "Can you import a Mercedes-Maybach S 580 e in right-hand drive?",
        a: "Yes. The car is built and homologated in right-hand drive, which covers Ireland, the United Kingdom, Malta, Cyprus, Kenya, Uganda, Australia, New Zealand, Hong Kong, Malaysia, Sri Lanka and the Caribbean markets. Left-hand drive is also available and is the deeper market for this model, serving continental Europe, the Gulf and China. Age-limit rules that restrict used imports do not apply, because this is a new car.",
      },
      {
        q: "Is the £206,090 UK price what an exporter pays?",
        a: "No, and treating it as a CIF base is the most expensive mistake made with UK price lists. The on-the-road figure bundles UK VAT at 20% plus registration items an exporter never pays. Removing VAT from the £190,090 basic price gives £158,408 on our arithmetic. Zero-rating on export is a procedure that depends on evidence of removal being produced within HMRC's time limits and on the supplying dealer agreeing to handle the sale that way.",
      },
      {
        q: "When are first deliveries of the updated Maybach S 580 e?",
        a: "European pre-orders opened in late March 2026, consistent with the UK configurator print-out generated on 26 March 2026. First UK customer deliveries are expected in September 2026. Mercedes-Benz has not published a UK first-delivery date we can cite, so September is the expectation the trade is working to rather than a manufacturer commitment.",
      },
    ],
    sources: [
      {
        label: "The new Mercedes-Benz S-Class — press kit",
        href: "https://media.mercedes-benz.com/en/s-class-2026",
        publisher: "Mercedes-Benz Media",
      },
      {
        label: "The new Mercedes-Benz S-Class: Refined in every detail",
        href: "https://mercedes-benz-media.co.uk/releases/1674",
        publisher: "Mercedes-Benz Cars UK",
      },
      {
        label:
          "New 2026 Mercedes S-Class facelift: luxury limo redefines car tech",
        href: "https://www.autoexpress.co.uk/mercedes/s-class/368777/new-2026-mercedes-s-class-facelift-luxury-limo-redefines-car-tech",
        publisher: "Auto Express",
      },
      {
        label:
          "Mercedes-Maybach S-Class (W223) — hero image, CC BY-SA 4.0, by Dinkun Chen",
        href: "https://commons.wikimedia.org/wiki/File:MERCEDES_MAYBACH_S-CLASS_(W223)_China_(26).jpg",
        publisher: "Wikimedia Commons",
      },
    ],
    relatedGuides: [
      "how-to-import-a-car-from-the-uk",
      "cost-to-import-a-car-from-the-uk",
      "uk-car-export-documents-explained",
    ],
    linkedVehicleSlugs: [
      "mercedes-maybach-s-580-e-first-class-rhd",
      "mercedes-maybach-s-580-e-first-class-lhd",
    ],
  },

  // ── Policy & Tax ──────────────────────────────────────────────────────────
  {
    slug: "sri-lanka-vehicle-import-surcharge-extended-2026",
    title:
      "Sri Lanka extends the 50% vehicle import surcharge — and the real deadline is 15 November",
    h1: "Sri Lanka Extends the 50% Vehicle Import Duty Surcharge to 31 December 2026",
    seoTitle: "Sri Lanka Vehicle Import Surcharge Extended to 31 Dec 2026",
    description:
      "Sri Lanka's 50% surcharge on vehicle import duty now runs to 31 December 2026. The LC exemption dies if your bill of lading is dated after 15 November.",
    excerpt:
      "Gazette 2501/88 extends the surcharge by four and a half months. It is 50% of the duty, not 50% of the car — and the 90-day registration clock costs dealers more than the surcharge does.",
    category: "Policy & Tax",
    dateline: "Colombo",
    keywords: [
      "sri lanka vehicle import surcharge",
      "sri lanka car import duty 2026",
      "gazette 2501/88 sri lanka",
      "sri lanka vehicle registration 90 days",
      "sri lanka import duty surcharge extended",
      "how much is the sri lanka vehicle import surcharge",
      "when does the sri lanka vehicle surcharge end",
    ],
    author: AUTHOR,
    publishDate: "2026-08-18",
    updatedDate: "2026-08-18",
    readingTimeMins: 11,
    heroImage:
      "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=2400&auto=format&fit=crop",
    heroAlt:
      "Customs and duty paperwork, illustrating coverage of Sri Lanka's vehicle import surcharge",
    heroCaption: "Illustrative image.",
    toc: [
      { id: "what-changed", label: "What the gazette does" },
      { id: "not-fifty-percent", label: "It is not 50% on the car" },
      { id: "the-exemption", label: "The exemption, and how to lose it" },
      { id: "the-deadline", label: "Why 15 November is close" },
      { id: "the-other-clock", label: "The clock that costs more" },
      { id: "what-to-do", label: "What dealers should do now" },
      { id: "private-buyers", label: "Does this affect private buyers?" },
      { id: "faqs", label: "FAQs" },
    ],
    faqs: [
      {
        q: "How long is Sri Lanka's 50% vehicle import surcharge in place?",
        a: "Gazette Extraordinary No. 2501/88, issued on 13 August 2026, extends the 50% surcharge on Customs Import Duty for specified motor vehicles from 15 August 2026 to 31 December 2026. The surcharge was first imposed with effect from 16 May 2026 as a three-month measure. Nothing on the record says what happens after 31 December 2026, and it has already been extended once.",
      },
      {
        q: "Is the Sri Lankan surcharge 50% of the car's value?",
        a: "No. It is 50% of the Customs Import Duty payable, not of the vehicle value. Where a car attracts a 20% duty, a 50% surcharge adds 10 percentage points of CIF and produces an effective duty of 30%. Duty rates vary by HS code, engine capacity and propulsion type, so the correct figure has to be confirmed against your own classification with Sri Lanka Customs.",
      },
      {
        q: "Which vehicles are exempt from the Sri Lankan import surcharge?",
        a: "Vehicles imported under Letters of Credit established on or before 15 May 2026. The exemption is lost if the LC is amended as to the number of vehicles, the vehicle descriptions, the technical specifications or the expiry dates, and it is also lost if the shipped-on-board date on the bill of lading or airway bill falls after 15 November 2026. The loading date governs, not the arrival date.",
      },
      {
        q: "What is Sri Lanka's 90-day vehicle registration rule?",
        a: "Under the Imports and Exports (Control) Regulations at Gazette Extraordinary No. 2421/04, a vehicle must be registered within 90 days of the date of the Customs Declaration. After that the importer pays a monthly late fee of 3% of the CIF value, computed non-compounded and linearly, capped at 45% of CIF, which is reached after fifteen months. Part-months of fewer than 30 days count as full months and no waiver is granted.",
      },
      {
        q: "How old can a car be to import into Sri Lanka?",
        a: "Motor cars are admissible at not more than three years old. Age is measured from the date of manufacture to the date of the bill of lading or airway bill, not to arrival or clearance. Where the manufacturer's certificate states a month, the date of manufacture is deemed to be the fifteenth of that month; where only a year is stated, it is deemed to be 15 January of that year.",
      },
      {
        q: "Can a private buyer import more than one car into Sri Lanka?",
        a: "Not usually. An importer registered with the Department of Motor Traffic as a motor vehicle importer may import the number of vehicles required, subject to the regulations. Any other importer is permitted only one vehicle within a twelve-month period, measured from the date of the Bill of Entry. That limit catches buyers who assume trading through a company name is sufficient.",
      },
    ],
    sources: [
      {
        label: "Sri Lanka extends 50% surcharge on vehicle import duties",
        href: "https://adaderana.lk/news/cmssxqtx40004356qmapl2tjz",
        publisher: "Ada Derana",
      },
      {
        label:
          "Govt imposes 50% surcharge on imported vehicles for three months",
        href: "https://adaderana.lk/news/122574",
        publisher: "Ada Derana",
      },
      {
        label: "50% Vehicle Import Duty Surcharge Extended Until End of 2026",
        href: "https://asianmirror.lk/news/50-vehicle-import-duty-surcharge-extended-until-end-of-2026/",
        publisher: "Asian Mirror",
      },
      {
        label:
          "Sri Lanka vehicle imports hit by 50-pct duty surcharge, EV taxes and new luxury levels",
        href: "https://economynext.com/sri-lanka-vehicle-imports-hit-by-50-pct-duty-surcharge-ev-taxes-and-new-luxury-levels-202669/",
        publisher: "EconomyNext",
      },
      {
        label:
          "Imports and Exports (Control) Regulations — Gazette Extraordinary No. 2421/04",
        href: "https://economynext.com/wp-content/uploads/2025/01/2421-04-vehicle-imports-gazette-EN.pdf",
        publisher: "Government of Sri Lanka (via EconomyNext)",
      },
      {
        label: "Sri Lanka Customs — importing goods",
        href: "https://www.customs.gov.lk/services/importing-goods/",
        publisher: "Sri Lanka Customs",
      },
    ],
    relatedGuides: [
      "sri-lanka-vehicle-import-rules-for-dealers",
      "sri-lanka-vehicle-import-taxes-explained",
      "importing-a-car-to-sri-lanka",
    ],
  },

  // ── Nissan Patrol Y63 ─────────────────────────────────────────────────────
  {
    slug: "nissan-patrol-y63-australia-pricing-confirmed",
    title:
      "Nissan prices the Y63 Patrol in Australia: six grades, A$98,990 to A$145,990",
    h1: "Nissan Patrol Y63 Australian Pricing Confirmed: Six Grades from A$98,990, First Deliveries Early 2027",
    seoTitle: "Nissan Patrol Y63 Australia Price: A$98,990 to A$145,990",
    description:
      "Nissan Australia confirmed Y63 Patrol pricing on 27 August 2026: six grades from A$98,990 to A$145,990, 317 kW twin-turbo V6, 3,700 kg towing, deliveries early 2027.",
    excerpt:
      "Six grades, one engine, and a 3,700 kg tow rating. The number that matters to an importer is not A$98,990 — it is what is left once the Australian taxes inside it come out.",
    category: "Releases",
    dateline: "Melbourne",
    keywords: [
      "nissan patrol y63 price",
      "nissan patrol 2027 australia price",
      "nissan patrol y63 grades",
      "nissan patrol y63 towing capacity",
      "how much is the nissan patrol y63",
      "when does the nissan patrol y63 arrive in australia",
      "can you import a nissan patrol y63",
    ],
    author: AUTHOR,
    publishDate: "2026-08-28",
    updatedDate: "2026-08-28",
    readingTimeMins: 9,
    heroImage: "/cars/nissan-patrol-y63/range-hero.webp",
    heroAlt: "Nissan Patrol Y63 range photographed for the Australian launch",
    heroCaption:
      "Nissan press image of a pre-production Y63 Patrol. Australian-delivered cars may differ in detail from the vehicle shown.",
    toc: [
      { id: "the-prices", label: "What the six grades cost" },
      { id: "not-your-cif", label: "Why A$98,990 is not your landed base" },
      { id: "co2", label: "The number Nissan has not published" },
      { id: "corridors", label: "Which corridor it comes out of" },
      { id: "admissibility", label: "Can you register one?" },
      { id: "timing", label: "Order now or wait?" },
      { id: "faqs", label: "FAQs" },
    ],
    faqs: [
      {
        q: "How much does the Nissan Patrol Y63 cost in Australia?",
        a: "Nissan Australia announced pricing on 27 August 2026. The range runs from A$98,990 for the Ti to A$145,990 for the Ti-L Reserve, with the Ti+ at A$109,480, the Ti-L at A$122,690, the Ti-L+ at A$134,690 and the PRO-4X at A$137,590. All figures are manufacturer's suggested retail prices before on-road costs, so registration, stamp duty and compulsory insurance are additional.",
      },
      {
        q: "How many grades does the Nissan Patrol Y63 have?",
        a: "Six in Australia: Ti, Ti+, Ti-L, Ti-L+, PRO-4X and Ti-L Reserve. The Ti-L+ and PRO-4X are new names in the Australian Patrol range. All six use the same 3.5-litre twin-turbo V6 with 317 kW and 700 Nm, the same nine-speed automatic and the same dual-range four-wheel-drive hardware, so the ladder buys comfort and suspension rather than capability.",
      },
      {
        q: "What is the Nissan Patrol Y63 towing capacity?",
        a: "Nissan Australia rates the Y63 Patrol at 3,700 kg braked towing capacity across the range. CarExpert reports that this is 200 kg more than the Toyota LandCruiser 300, which makes towing the clearest specification difference between the two in the Australian market.",
      },
      {
        q: "When do Nissan Patrol Y63 deliveries start?",
        a: "Order books opened in Australia on 27 August 2026 and first customer deliveries are early 2027. Nissan New Zealand has confirmed a first-quarter 2027 arrival and opened registrations of interest but had not published local pricing or grades as at 28 August 2026. Japan gets the Patrol in the first half of fiscal 2027, meaning April to September 2027.",
      },
      {
        q: "What are the Nissan Patrol Y63 CO2 emissions?",
        a: "Nissan Australia has not published fuel consumption or CO₂ figures for the Y63 Patrol. Figures of around 12.7 L/100 km and 290 g/km circulating in August 2026 are Chasing Cars' extrapolation from United States testing, not an Australian Design Rules result. Until an official figure exists, registration tax in a CO₂-banded market such as Ireland cannot be calculated.",
      },
      {
        q: "Is the Australian list price what an exporter pays?",
        a: "No. An Australian MSRP carries 10% GST inside it and excludes all on-road costs. A sale of goods can be GST-free where the supplier exports them within 60 days of the earlier of payment or invoice, on the Australian Taxation Office's conditions. Australia also levies Luxury Car Tax, and its treatment on an export sale of this model has not been verified, so the ex-GST figure is not automatically the landed base.",
      },
    ],
    sources: [
      {
        label:
          "Nissan announces pricing and key specifications for all-new Patrol in Australia",
        href: "https://www.nissan.com.au/about-nissan/news-and-events/news/2026/august/nissan-announces-pricing-and-key-specifications-for-all-new-patrol-in-australia.html",
        publisher: "Nissan Australia",
      },
      {
        label: "2027 Nissan Patrol Y63 pricing confirmed for Australia",
        href: "https://www.carexpert.com.au/car-news/2027-nissan-patrol-y63-pricing-confirmed-for-australia",
        publisher: "CarExpert",
      },
      {
        label: "2027 Nissan Patrol pricing and specification",
        href: "https://www.carsales.com.au/editorial/details/2027-nissan-patrol-pricing-and-specification-152846/",
        publisher: "carsales",
      },
      {
        label: "Toyota LandCruiser 300 vs Nissan Patrol Y63: spec battle",
        href: "https://www.chasingcars.com.au/news/future-cars/toyota-landcruiser-300-vs-nissan-patrol-y63-spec-battle",
        publisher: "Chasing Cars",
      },
      {
        label: "Exports and GST",
        href: "https://www.ato.gov.au/businesses-and-organisations/international-tax-for-business/australians-doing-business-overseas/exports-and-gst",
        publisher: "Australian Taxation Office",
      },
      {
        label: "IVA — Individual Vehicle Approval",
        href: "https://www.nsai.ie/certification/automotive/national-type-approva/iva/",
        publisher: "NSAI",
      },
    ],
    relatedGuides: [
      "how-to-import-a-nissan-patrol",
      "nissan-patrol-y63-grades-explained",
      "how-to-import-a-car-from-australia",
    ],
    linkedVehicleSlugs: ["nissan-patrol-y63"],
  },
  {
    slug: "nissan-patrol-y63-vs-landcruiser-300-dealer-read",
    title:
      "Patrol Y63 against the LandCruiser 300: the dealer read, not the spec sheet",
    h1: "Nissan Patrol Y63 vs Toyota LandCruiser 300: What It Changes for a Dealer",
    seoTitle: "Patrol Y63 vs LandCruiser 300: The Dealer Read",
    description:
      "The Y63 Patrol opens A$280 under the LandCruiser 300 GX and tows 200 kg more. What that does to a large-SUV floor plan, and which of the six grades to stock.",
    excerpt:
      "Six grades where there were three is a margin ladder, not a specification change. The warranty, not the tow rating, is the largest undisclosed variable in this launch.",
    category: "Market",
    dateline: "Melbourne",
    keywords: [
      "nissan patrol vs landcruiser 300",
      "patrol y63 vs landcruiser price",
      "large suv import margin",
      "nissan patrol y63 warranty",
      "which nissan patrol grade to stock",
      "is the nissan patrol cheaper than the landcruiser",
    ],
    author: AUTHOR,
    publishDate: "2026-08-28",
    updatedDate: "2026-08-28",
    readingTimeMins: 9,
    heroImage: "/cars/nissan-patrol-y63/black-quarry.webp",
    heroAlt: "Nissan Patrol Y63 photographed on loose surface",
    heroCaption:
      "Nissan press image of a pre-production Y63 Patrol. Australian-delivered cars may differ in detail from the vehicle shown.",
    toc: [
      { id: "ladder", label: "The two ladders side by side" },
      { id: "v8", label: "The V8 question" },
      { id: "warranty", label: "The trap in this launch" },
      { id: "residual", label: "Residual: known and guessed" },
      { id: "floor-plan", label: "Floor-plan and freight" },
      { id: "nves", label: "The supply-side constraint" },
      { id: "verdict", label: "What we would commit to" },
      { id: "faqs", label: "FAQs" },
    ],
    faqs: [
      {
        q: "Is the Nissan Patrol Y63 cheaper than the Toyota LandCruiser 300?",
        a: "At the entry point, marginally. The Patrol Ti lists at A$98,990 before on-road costs against a LandCruiser 300 GX at A$99,270 — a gap of A$280. At the top the difference is wider: A$145,990 for the Ti-L Reserve against A$156,990 for the Performance Hybrid GR Sport, a gap of A$11,000. LandCruiser prices are as listed by carsales on 27 August 2026 and move independently of Nissan's.",
      },
      {
        q: "Does the Nissan Patrol Y63 tow more than the LandCruiser 300?",
        a: "Yes. Nissan Australia rates the Y63 Patrol at 3,700 kg braked, which CarExpert reports is 200 kg more than the LandCruiser 300. Towing is the one use case in this segment where buyers regularly change badge, which is why the rating carries more commercial weight than the power figures do.",
      },
      {
        q: "Does the Nissan Patrol warranty apply to an exported car?",
        a: "Unconfirmed, and it should be established in writing before it is advertised. Nissan Australia's 10-year/300,000 km warranty is stated as conditional on the vehicle being serviced at authorised dealers. A servicing-linked Australian warranty on a car serviced overseas may be reduced, may fall back to a shorter global term, or may not travel at all. Confirm the position with Nissan in the destination market.",
      },
      {
        q: "Which Patrol Y63 grade should a dealer stock?",
        a: "The Ti and the PRO-4X are the most defensible. The Ti carries the full four-wheel-drive hardware and the 3,700 kg tow rating at A$98,990, which is what actually sells in fleet and towing demand. The PRO-4X at A$137,590 suits markets where genuine off-road specification commands a premium. The A$145,990 Ti-L Reserve is the most exposed rung to an unproven engine family and a fragmented used pool.",
      },
      {
        q: "How does the New Vehicle Efficiency Standard affect the Patrol?",
        a: "Australia's New Vehicle Efficiency Standard has set CO₂ targets across each supplier's new-vehicle sales since 1 July 2025, with credits for beating the target and a penalty exposure for missing it, and a two-year window to trade or generate units. A large petrol V6 four-wheel drive consumes credits rather than generating them. That is a manufacturer cost rather than a buyer tax, but it shapes supply and pricing.",
      },
    ],
    sources: [
      {
        label:
          "Nissan announces pricing and key specifications for all-new Patrol in Australia",
        href: "https://www.nissan.com.au/about-nissan/news-and-events/news/2026/august/nissan-announces-pricing-and-key-specifications-for-all-new-patrol-in-australia.html",
        publisher: "Nissan Australia",
      },
      {
        label: "2027 Nissan Patrol Y63 pricing confirmed for Australia",
        href: "https://www.carexpert.com.au/car-news/2027-nissan-patrol-y63-pricing-confirmed-for-australia",
        publisher: "CarExpert",
      },
      {
        label:
          "Nissan Patrol Y62 V8 end date confirmed for Australia as V6-powered Y63 waits in the wings",
        href: "https://www.carexpert.com.au/car-news/nissan-patrol-y62-v8-end-date-confirmed-for-australia-as-v6-powered-y63-waits-in-the-wings",
        publisher: "CarExpert",
      },
      {
        label: "2027 Nissan Patrol pricing and specification",
        href: "https://www.carsales.com.au/editorial/details/2027-nissan-patrol-pricing-and-specification-152846/",
        publisher: "carsales",
      },
      {
        label: "What is the New Vehicle Efficiency Standard?",
        href: "https://www.nvesregulator.gov.au/what-new-vehicle-efficiency-standard",
        publisher: "New Vehicle Efficiency Standard Regulator",
      },
    ],
    relatedGuides: [
      "nissan-patrol-y63-grades-explained",
      "how-to-import-a-car-from-australia",
      "cost-to-import-a-car-from-australia",
    ],
    linkedVehicleSlugs: ["nissan-patrol-y63"],
  },
  {
    slug: "nissan-patrol-y63-right-hand-drive-markets",
    title:
      "The Y63 Patrol's right-hand-drive map: Australia first, Japan in fiscal 2027",
    h1: "Which Markets Get the Nissan Patrol Y63, and When",
    seoTitle: "Nissan Patrol Y63: Which Markets Get It, and When",
    description:
      "Australia has Y63 Patrol order books open for early 2027 delivery, New Zealand follows in Q1 2027 and Japan in fiscal 2027. The Gulf cars are left-hand drive.",
    excerpt:
      "Plentiful UAE supply is the most common wasted enquiry we take on this car. Until Japan opens, Australia is the only right-hand-drive corridor there is.",
    category: "Industry",
    dateline: "Yokohama",
    keywords: [
      "nissan patrol y63 right hand drive",
      "nissan patrol japan launch",
      "nissan patrol new zealand 2027",
      "where to buy a nissan patrol y63",
      "is the nissan patrol available in right hand drive",
      "nissan patrol y63 uae left hand drive",
    ],
    author: AUTHOR,
    publishDate: "2026-08-28",
    updatedDate: "2026-08-28",
    readingTimeMins: 8,
    heroImage: "/cars/nissan-patrol-y63/white-front.webp",
    heroAlt: "Nissan Patrol Y63 in white, front three-quarter view",
    heroCaption:
      "Nissan press image of a pre-production Y63 Patrol. Specification varies by market — the car shown is not any one market's confirmed build.",
    toc: [
      { id: "map", label: "The right-hand-drive map" },
      { id: "gulf", label: "Why Gulf supply does not help" },
      { id: "japan", label: "What the Japanese launch opens" },
      { id: "admissibility", label: "Does it change what you can import?" },
      { id: "act", label: "What to do, by market" },
      { id: "faqs", label: "FAQs" },
    ],
    faqs: [
      {
        q: "Is the Nissan Patrol Y63 available in right-hand drive?",
        a: "Yes. Australia is the first right-hand-drive market, with order books opened on 27 August 2026 and first deliveries early 2027. New Zealand follows in the first quarter of 2027, and Japan in the first half of fiscal 2027. The Middle East and North American cars, on sale since late 2024, are left-hand drive.",
      },
      {
        q: "When does the Nissan Patrol launch in Japan?",
        a: "Nissan announced at the 2025 Japan Mobility Show that the Patrol comes to Japan in the first half of fiscal 2027 — April to September 2027 on the Japanese fiscal calendar. It returns Nissan to the large-SUV segment at home for the first time since the Safari ended production in 2007, and it opens a second right-hand-drive export corridor once cars reach the used market.",
      },
      {
        q: "Can you import a Nissan Patrol from Dubai to a right-hand-drive country?",
        a: "No, and it is the most common wasted enquiry on this model. Gulf-market Patrols are left-hand drive, which rules them out for Kenya, Uganda, Tanzania, Mauritius, Jamaica, Trinidad and Tobago, Guyana, Australia, New Zealand, Hong Kong, Malaysia, Sri Lanka, Ireland and the United Kingdom. UAE sourcing is for left-hand-drive luxury destinations.",
      },
      {
        q: "Is it cheaper to buy a Patrol in the UAE because of the exchange rate?",
        a: "No. The UAE dirham is pegged to the US dollar, so there is no independent currency advantage to sourcing out of Dubai — the corridor competes on stock and specification instead. Verify that the peg is still in place with the Central Bank of the UAE before relying on it, because peg arrangements do change, rarely and abruptly.",
      },
      {
        q: "When will the Nissan Patrol Y63 be available in New Zealand?",
        a: "Nissan New Zealand has confirmed a first-quarter 2027 arrival and has opened registrations of interest. New Zealand pricing and grade structure had not been published as at 28 August 2026, so committing to an Australian grade is committing to a ladder that may not be the one offered locally.",
      },
    ],
    sources: [
      {
        label:
          "Nissan announces pricing and key specifications for all-new Patrol in Australia",
        href: "https://www.nissan.com.au/about-nissan/news-and-events/news/2026/august/nissan-announces-pricing-and-key-specifications-for-all-new-patrol-in-australia.html",
        publisher: "Nissan Australia",
      },
      {
        label:
          "Nissan powers up Japan Mobility Show 2025 with icons and EV innovation",
        href: "https://global.nissannews.com/en/releases/nissan-powers-up-jms-2025-with-icons-and-ev-innovation",
        publisher: "Nissan Global Newsroom",
      },
      {
        label:
          "Nissan New Zealand confirms new Patrol will arrive in early 2027",
        href: "https://autotrader.co.nz/showroom/nissan/nissan-new-zealand-confirms-new-patrol-will-arrive-in-early-2027",
        publisher: "AutoTrader New Zealand",
      },
      {
        label:
          "2027 Nissan Patrol Y63: Launch dates set for more luxurious twin-turbo V6 off-road SUV range",
        href: "https://www.carexpert.com.au/car-news/2027-nissan-patrol-y63-launch-dates-set-for-more-luxurious-twin-turbo-v6-off-road-suv-range",
        publisher: "CarExpert",
      },
      {
        label: "2026 Nissan Patrol Y63: Everything you need to know",
        href: "https://www.4x4australia.com.au/news/2026-nissan-patrol-y63-everything-we-know-so-far",
        publisher: "4X4 Australia",
      },
    ],
    relatedGuides: [
      "how-to-import-a-nissan-patrol",
      "gcc-spec-cars-explained",
      "new-zealand-vs-japan-for-used-imports",
    ],
    linkedVehicleSlugs: ["nissan-patrol-y63"],
  },
  {
    slug: "mitsubishi-pajero-revealed-specifications-launch-markets",
    title:
      "Mitsubishi reveals the all-new Pajero: Thai-built, 480 Nm, no price anywhere",
    h1: "The All-New Mitsubishi Pajero Is Revealed: Thai-Built, Seven Seats, and Unpriced in Every Market",
    seoTitle: "New Mitsubishi Pajero Revealed: Specs, Markets and Timing",
    description:
      "Mitsubishi revealed the all-new Pajero on 2 September 2026: Thai-built, 2.4 diesel, 480 Nm, eight-speed automatic, seven seats — and no price in any market.",
    excerpt:
      "Mitsubishi published the dimensions to the millimetre and the approach angle to one decimal place. It published no price and no power output — and the launch order confines the car to three countries until April 2027.",
    category: "Releases",
    dateline: "Tokyo",
    keywords: [
      "new mitsubishi pajero",
      "mitsubishi pajero 2026 specifications",
      "mitsubishi pajero thailand",
      "mitsubishi pajero australia release date",
      "is the new mitsubishi pajero twin turbo",
      "when can you buy the new mitsubishi pajero",
      "can you import a mitsubishi pajero",
    ],
    author: AUTHOR,
    publishDate: "2026-09-02",
    updatedDate: "2026-09-02",
    readingTimeMins: 10,
    heroImage: "/cars/mitsubishi-pajero/off-road-action.webp",
    heroAlt:
      "The all-new Mitsubishi Pajero photographed on a loose surface for its world premiere",
    heroCaption:
      "Mitsubishi Motors press image of a pre-production all-new Pajero. Mitsubishi states that specifications and features may vary by trim level and market.",
    toc: [
      { id: "confirmed", label: "What Mitsubishi actually confirmed" },
      {
        id: "not-published",
        label: "The two numbers Mitsubishi did not publish",
      },
      { id: "launch-order", label: "Why the launch order is the story" },
      { id: "applies", label: "Does this apply to you?" },
      { id: "landed-cost", label: "What it lands at" },
      { id: "timing", label: "Move now or wait?" },
      { id: "nameplate", label: "What the nameplate brings" },
    ],
    faqs: [
      {
        q: "Where is the new Mitsubishi Pajero built?",
        a: "Mitsubishi Motors builds the all-new Pajero at its production base in Thailand, on a ladder frame derived from the Mitsubishi Triton pickup. Mitsubishi confirmed this in its world-premiere release of 2 September 2026. Thailand is also the first market to get the car, ahead of Japan and Australia, which both follow during Mitsubishi's fiscal 2026 — April 2026 to March 2027.",
      },
      {
        q: "How much does the new Mitsubishi Pajero cost?",
        a: "Mitsubishi has not published a price in any market as at 2 September 2026. Thai, Japanese and Australian pricing are all still to be announced. Because the purchase price is the largest single input into a landed cost, no honest landed-cost figure for this car exists yet, and any quote you are shown today is built on a number nobody has.",
      },
      {
        q: "Is the new Mitsubishi Pajero a twin-turbo diesel?",
        a: "No. Mitsubishi's world-premiere release describes a 2.4-litre clean diesel with a wide-range single variable geometry turbocharger, producing 480 Nm of torque, or 470 Nm on select specifications. A great deal of pre-reveal coverage described a bi-turbo engine with a six-speed automatic. Mitsubishi's own release states a single turbocharger and a newly developed eight-speed automatic.",
      },
      {
        q: "What is the new Mitsubishi Pajero's power output and towing capacity?",
        a: "Mitsubishi has published neither. Its release states torque of 480 Nm and says nothing about maximum power or towing. The figures of 150 kW and 3,500 kg braked towing now in circulation come from CarsGuide's reporting on the reveal, not from Mitsubishi. Attribute them to CarsGuide rather than to the manufacturer until Mitsubishi publishes its own.",
      },
      {
        q: "When can you buy the new Mitsubishi Pajero in other countries?",
        a: "Mitsubishi plans to launch the all-new Pajero in approximately 100 countries from fiscal 2027 onward, naming ASEAN, Latin America and the Middle East. Mitsubishi's fiscal 2027 begins in April 2027. Until then, the only markets with the car are Thailand, Japan and Australia, so any earlier arrival elsewhere has to be imported out of one of those three.",
      },
      {
        q: "Can you import a new Mitsubishi Pajero into a right-hand-drive market?",
        a: "All three first-launch markets are right-hand drive, so the car exists in the correct hand for most import destinations. Because it is a new vehicle, the age limits that restrict used imports in Kenya, Sri Lanka and much of the Caribbean do not apply. Type approval does: in Ireland and the United Kingdom, where the Pajero is not sold, registration means individual approval, and no CO2 figure has been published.",
      },
    ],
    sources: [
      {
        label: "Mitsubishi Motors Unveils the All-New Pajero Cross-Country SUV",
        href: "https://www.mitsubishi-motors.com/en/newsroom/newsrelease/2026/20260902_1.html",
        publisher: "Mitsubishi Motors Corporation",
      },
      {
        label:
          "Mitsubishi Motors To Debut the All-New Pajero Cross-Country SUV in Autumn 2026",
        href: "https://www.mitsubishi-motors.com/en/newsroom/newsrelease/2026/20260529_2.html",
        publisher: "Mitsubishi Motors Corporation",
      },
      {
        label:
          "2026 Mitsubishi Pajero 4WD revealed, including engine and towing capacity",
        href: "https://www.carsguide.com.au/car-news/2026-mitsubishi-pajero-4wd-revealed-including-engine-and-towing-capacity-as-it-prepares-to",
        publisher: "CarsGuide",
      },
      {
        label: "2027 Mitsubishi Pajero range leaked",
        href: "https://www.carsales.com.au/editorial/details/2027-mitsubishi-pajero-range-leaked-152370/",
        publisher: "carsales",
      },
      {
        label: "Dakar Rally — Mitsubishi Motors motorsports history",
        href: "https://www.mitsubishi-motors.com/en/brand/motorsports/dakar/",
        publisher: "Mitsubishi Motors Corporation",
      },
      {
        label: "The Revenue Department of Thailand — value added tax",
        href: "https://www.rd.go.th/english/index.html",
        publisher: "Revenue Department of Thailand",
      },
    ],
    relatedGuides: [
      "how-to-import-a-car-from-thailand",
      "cost-to-import-a-car-from-thailand",
      "how-to-import-a-car-from-australia",
    ],
    linkedVehicleSlugs: ["mitsubishi-pajero-2026"],
  },
  {
    slug: "mitsubishi-pajero-thailand-australia-sourcing-corridors",
    title:
      "Two corridors for one Pajero: what Thailand and Australia each put in the price",
    h1: "Sourcing the New Mitsubishi Pajero: What the Thailand and Australia Corridors Actually Contain",
    seoTitle: "Pajero Sourcing: Thailand or Australia, the Dealer Read",
    description:
      "Mitsubishi builds the new Pajero in Thailand and sells it in Australia. Two corridors, 4 Australian grades, 10% GST inside the list price, and no price yet.",
    excerpt:
      "Thailand builds it and sells it first; Australia is the only market with a published range. Neither has a price — and Thai export capacity was cut by 50,000 units on 1 August.",
    category: "Market",
    dateline: "Bangkok",
    keywords: [
      "import mitsubishi pajero from thailand",
      "import mitsubishi pajero from australia",
      "thailand car export excise tax",
      "australia gst free export vehicle",
      "which country to import a pajero from",
      "mitsubishi pajero dealer import margin",
      "thailand vehicle export 2026",
    ],
    author: AUTHOR,
    publishDate: "2026-09-02",
    updatedDate: "2026-09-02",
    readingTimeMins: 10,
    heroImage: "/cars/mitsubishi-pajero/rear-three-quarter.webp",
    heroAlt:
      "The all-new Mitsubishi Pajero photographed from the rear three-quarter on a salt flat",
    heroCaption:
      "Mitsubishi Motors press image of a pre-production all-new Pajero. Mitsubishi states that specifications and features may vary by trim level and market.",
    toc: [
      { id: "thailand", label: "What a Thai price contains" },
      { id: "australia", label: "What an Australian price contains" },
      { id: "comparison", label: "The two corridors, side by side" },
      { id: "freight", label: "The freight risk in the numbers" },
      { id: "which-corridor", label: "Which corridor to commit to" },
      { id: "dont-buy", label: "The case for not buying yet" },
    ],
    faqs: [
      {
        q: "Is it cheaper to import a Mitsubishi Pajero from Thailand or Australia?",
        a: "Neither can be costed yet, because Mitsubishi has published no price in either market. On structure, Thailand should win on unit cost — it is the plant, it is first in the queue, and the freight leg to East Africa, South Asia and the Caribbean is shorter. Australia should win on certainty, because its range structure is already published and its list prices carry a single legible 10% GST.",
      },
      {
        q: "What taxes are inside a Thai new car price?",
        a: "Thailand levies excise tax on motor vehicles as an ad valorem charge calculated on the suggested retail price rather than an ex-works value, with value-added tax on top and exports zero-rated for VAT. A Thai showroom price is therefore not an export base. We are not publishing the rates: the Thai Excise Department's motor-vehicle schedule was not reachable when we checked on 2 September 2026, and a tax figure needs the authority behind it.",
      },
      {
        q: "Is an Australian new car export free of GST?",
        a: "A sale of goods can be GST-free where the supplier exports them within 60 days of the earlier of receiving payment or issuing an invoice, on the Australian Taxation Office's conditions and with its documentary evidence of export. Australia also levies Luxury Car Tax above a threshold the ATO revises annually. We have not verified the 2026-27 threshold or its treatment on an export sale of this model.",
      },
      {
        q: "What grades will the new Mitsubishi Pajero come in?",
        a: "Australian government approval documents, reported by carsales, show four grades across six variants: GLX, GLS, Exceed and GSR. The GLX is approved as a five-seater and the GSR as a seven-seater, with the GLS and Exceed approved in both five- and seven-seat configurations. Mitsubishi has not published what equipment separates the grades, and no other market has a published range structure.",
      },
      {
        q: "Is Thai vehicle export capacity under pressure in 2026?",
        a: "Yes. On 1 August 2026 the Federation of Thai Industries cut Thailand's 2026 production target from 1.5 million vehicles to 1.45 million, with the whole reduction falling on export production — from 950,000 units to 900,000. Thai vehicle exports to the Middle East fell 38.35% in the first half of 2026 as the closure of shipping routes through the Strait of Hormuz continued to disrupt deliveries.",
      },
      {
        q: "Should a dealer commit floor-plan to the new Pajero now?",
        a: "No. There is no published price in either corridor, so unit cost is unknown. The nameplate was discontinued in overseas markets in 2021, so there is no recent residual history in any destination market. And Mitsubishi plans official launches in approximately 100 countries from April 2027, which means imported stock landing in early 2027 may compete with franchised cars carrying a local warranty.",
      },
    ],
    sources: [
      {
        label: "Mitsubishi Motors Unveils the All-New Pajero Cross-Country SUV",
        href: "https://www.mitsubishi-motors.com/en/newsroom/newsrelease/2026/20260902_1.html",
        publisher: "Mitsubishi Motors Corporation",
      },
      {
        label: "The Revenue Department of Thailand — value added tax",
        href: "https://www.rd.go.th/english/index.html",
        publisher: "Revenue Department of Thailand",
      },
      {
        label: "Exports and GST",
        href: "https://www.ato.gov.au/businesses-and-organisations/international-tax-for-business/australians-doing-business-overseas/exports-and-gst",
        publisher: "Australian Taxation Office",
      },
      {
        label: "Thailand cuts 2026 car output target as exports weaken",
        href: "https://www.nationthailand.com/business/manufacturing/40069285",
        publisher: "The Nation Thailand",
      },
      {
        label: "2027 Mitsubishi Pajero range leaked",
        href: "https://www.carsales.com.au/editorial/details/2027-mitsubishi-pajero-range-leaked-152370/",
        publisher: "carsales",
      },
      {
        label:
          "2026 Mitsubishi Pajero 4WD revealed, including engine and towing capacity",
        href: "https://www.carsguide.com.au/car-news/2026-mitsubishi-pajero-4wd-revealed-including-engine-and-towing-capacity-as-it-prepares-to",
        publisher: "CarsGuide",
      },
    ],
    relatedGuides: [
      "best-pickups-to-import-from-thailand",
      "cost-to-import-a-car-from-australia",
      "thailand-vs-japan-for-pickup-imports",
    ],
    linkedVehicleSlugs: ["mitsubishi-pajero-2026"],
  },
];

export const NEWS_BASE_PATH = "/latest-news";
export const NEWS_CATEGORY_BASE_PATH = "/latest-news/category";

/** Newest first, with any featured article pinned to the top. */
export function getNewsArticles(): NewsArticle[] {
  return [...NEWS_ARTICLES].sort((a, b) => {
    if (a.isFeatured !== b.isFeatured) return a.isFeatured ? -1 : 1;
    return b.publishDate.localeCompare(a.publishDate);
  });
}

/** Strictly newest first, ignoring the featured pin — used by the feeds. */
export function getNewsArticlesByDate(): NewsArticle[] {
  return [...NEWS_ARTICLES].sort((a, b) =>
    b.publishDate.localeCompare(a.publishDate),
  );
}

export function getNewsArticle(slug: string): NewsArticle | undefined {
  return NEWS_ARTICLES.find((a) => a.slug === slug);
}

export function getAllNewsSlugs(): string[] {
  return NEWS_ARTICLES.map((a) => a.slug);
}

/** The lead story — used by the footer feature strip and the blog cross-link. */
export function getLeadStory(): NewsArticle | undefined {
  return getNewsArticles()[0];
}

export function getCategoryMeta(slug: string): NewsCategoryMeta | undefined {
  return NEWS_CATEGORIES.find((c) => c.slug === slug);
}

export function getCategoryMetaByLabel(
  label: NewsCategory,
): NewsCategoryMeta | undefined {
  return NEWS_CATEGORIES.find((c) => c.label === label);
}

export function getNewsByCategory(label: NewsCategory): NewsArticle[] {
  return getNewsArticles().filter((a) => a.category === label);
}

/** Only categories that actually have published articles — no empty archives. */
export function getPopulatedCategories(): NewsCategoryMeta[] {
  const used = new Set(NEWS_ARTICLES.map((a) => a.category));
  return NEWS_CATEGORIES.filter((c) => used.has(c.label));
}

/**
 * New-model announcements, newest first — the Releases category. Powers the
 * "Upcoming cars & new model releases" section on the news index.
 */
export function getReleaseArticles(limit?: number): NewsArticle[] {
  const releases = getNewsArticlesByDate().filter(
    (a) => a.category === "Releases",
  );
  return typeof limit === "number" ? releases.slice(0, limit) : releases;
}

/**
 * The announcement a given car page belongs to, if its `newsSlug` resolves.
 * Kept here so the car page doesn't have to know the registry's shape.
 */
export function getArticleForVehicle(
  newsSlug?: string,
): NewsArticle | undefined {
  if (!newsSlug) return undefined;
  return getNewsArticle(newsSlug);
}

/** Most recent publish date across the section — drives the index freshness stamp. */
export function getLatestPublishDate(): string {
  return getNewsArticlesByDate()[0]?.publishDate ?? "";
}
