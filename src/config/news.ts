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
    updatedDate: "2026-09-10",
    readingTimeMins: 8,
    heroImage: "/import-cars/japan-car-truck.webp",
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
  {
    slug: "range-rover-electric-revealed-specifications-price",
    title: "The first electric Range Rover is here: 550PS, 372 miles, £154,070",
    h1: "The First Electric Range Rover Is Here: 550PS, 372 Miles and £154,070",
    seoTitle: "Range Rover Electric: Specs, Price and Import Read",
    description:
      "JLR revealed the Range Rover Electric on 2 September 2026: 550PS, 850Nm, 372 miles WLTP and £154,070 OTR, built at Solihull. What it means to import one.",
    excerpt:
      "JLR published the specification, both range figures and the price on the same day, which almost never happens. It did not publish a towing figure — and that is the number that settles it for some buyers.",
    category: "Releases",
    dateline: "Solihull, West Midlands",
    keywords: [
      "range rover electric",
      "range rover electric price",
      "range rover electric specifications",
      "range rover electric range miles",
      "how much is the range rover electric",
      "where is the range rover electric built",
      "can you import a range rover electric",
      "how far does the range rover electric go",
    ],
    author: AUTHOR,
    publishDate: "2026-09-03",
    updatedDate: "2026-09-03",
    readingTimeMins: 11,
    heroImage: "/cars/range-rover-electric/front-driving.webp",
    heroAlt:
      "The Range Rover Electric photographed head-on while driving on a mountain road",
    heroCaption:
      "JLR press image of the Range Rover Electric, released 2 September 2026. JLR states that specification, design and availability alter continually and that its material does not constitute an offer for the sale of any particular vehicle.",
    toc: [
      { id: "confirmed", label: "What JLR actually confirmed" },
      { id: "price", label: "What £154,070 is, and is not" },
      { id: "capability", label: "What electric cost, and what it didn't" },
      { id: "applies", label: "Does this apply to you?" },
      { id: "landed-cost", label: "What does it land at?" },
      { id: "timing", label: "Move now or wait?" },
      { id: "unknowns", label: "What is still unknown" },
    ],
    faqs: [
      {
        q: "How much does the Range Rover Electric cost?",
        a: "JLR published a United Kingdom on-the-road price of £154,070 on 2 September 2026, with order books open the same day. That is a British retail figure containing 20% value added tax, the £55 DVLA first registration fee and £10 of first-year vehicle excise duty. Stripping the VAT leaves a vehicle price of £128,337.50 before tax.",
      },
      {
        q: "What is the Range Rover Electric's range?",
        a: "Up to 372 miles on the WLTP cycle, and JLR separately publishes a real-world figure of up to 333 miles, or 535 km. Publishing both is unusual and worth crediting. On a 350 kW rapid charger JLR quotes 10 to 80 per cent in around 22 minutes, or 137 miles added in ten minutes.",
      },
      {
        q: "Where is the Range Rover Electric built?",
        a: "At JLR's Solihull plant in the West Midlands, on the same line as the combustion and hybrid Range Rovers, with battery packs and electric drive units supplied by JLR's Electric Propulsion Manufacturing Centre at Wolverhampton. Solihull has built Range Rovers since 1970, and it is the only place this car is made anywhere in the world.",
      },
      {
        q: "How much can the Range Rover Electric tow?",
        a: "JLR has published no towing figure. Carscoops reports 2,500 kg, against 3,500 kg for the combustion Range Rover and 3,000 kg for the plug-in hybrid. Attribute that figure to Carscoops rather than to JLR. If you tow at the top of the combustion car's range, wait for JLR's own rating before ordering.",
      },
      {
        q: "Is the Range Rover Electric the first electric Range Rover?",
        a: "Yes. It is the first battery-electric car to carry the Range Rover name since the nameplate was introduced in 1970. It is not JLR's first electric vehicle — the Jaguar I-Pace went on sale in 2018 — so coverage describing this as JLR's first EV is wrong by about eight years.",
      },
      {
        q: "Can you import a Range Rover Electric into a right-hand-drive market?",
        a: "Yes. Range Rover is sold in 121 countries in both hands, and the car is built in the United Kingdom, so a right-hand-drive example is the standard specification rather than a special order. Being a new vehicle, the age limits that restrict used imports in Kenya, Sri Lanka and much of the Caribbean do not apply. Confirm the destination's treatment of battery-electric vehicles with its own authority before committing.",
      },
    ],
    sources: [
      {
        label: "Range Rover Electric: A New Era For The Original Luxury SUV",
        href: "https://media.jlr.com/range-rover/news/2026/09/range-rover-electric-new-era-original-luxury-suv",
        publisher: "JLR (Range Rover Media Newsroom)",
      },
      {
        label: "Range Rover Electric: a new era for the original luxury SUV",
        href: "https://www.jlr.com/news/2026/09/range-rover-electric-new-era-original-luxury-suv",
        publisher: "JLR",
      },
      {
        label:
          "The electric Range Rover costs $25,000 more than the gas one and tows a ton less",
        href: "https://www.carscoops.com/2026/09/range-rover-electric-official-launch/",
        publisher: "Carscoops",
      },
      {
        label: "Vehicle tax for electric, zero and low emission vehicles",
        href: "https://www.gov.uk/guidance/vehicle-tax-for-electric-and-low-emissions-vehicles",
        publisher: "GOV.UK",
      },
      {
        label: "Vehicle registration: new registrations fee",
        href: "https://www.gov.uk/vehicle-registration/new-registrations-fee",
        publisher: "GOV.UK (DVLA)",
      },
      {
        label: "Euro foreign exchange reference rates",
        href: "https://www.ecb.europa.eu/stats/policy_and_exchange_rates/euro_reference_exchange_rates/html/index.en.html",
        publisher: "European Central Bank",
      },
    ],
    relatedGuides: [
      "how-to-import-a-car-from-the-uk",
      "cost-to-import-a-car-from-the-uk",
      "best-cars-to-import-from-the-uk",
    ],
    linkedVehicleSlugs: ["range-rover-electric-2026"],
  },
  {
    slug: "range-rover-electric-uk-sourcing-export-vat",
    title: "Sourcing the Range Rover Electric: the 20% inside a £154,070 price",
    h1: "Sourcing the Range Rover Electric Out of the UK: What the Corridor Actually Contains",
    seoTitle: "Importing a Range Rover Electric from the UK",
    description:
      "The Range Rover Electric is built only at Solihull. About £25,700 of its £154,070 price is UK VAT — here is when that comes out, and when it does not.",
    excerpt:
      "One plant, one source market, no second corridor. The VAT is the largest number you can control — and the charging question is the one that should stop some buyers entirely.",
    category: "Market",
    dateline: "London",
    keywords: [
      "import range rover electric from uk",
      "range rover electric export vat",
      "uk export vat zero rating vehicle",
      "range rover electric landed cost",
      "can you buy a car in the uk vat free for export",
      "how much vat is inside a uk car price",
      "range rover electric dealer import",
    ],
    author: AUTHOR,
    publishDate: "2026-09-03",
    updatedDate: "2026-09-03",
    readingTimeMins: 12,
    heroImage: "/cars/range-rover-electric/solihull-body-in-white.webp",
    heroAlt:
      "A Range Rover Electric body shell on the production line at JLR's Solihull plant, with a battery pack on the floor below",
    heroCaption:
      "JLR press image of Range Rover Electric production at Solihull, released 2 September 2026.",
    toc: [
      { id: "source-market", label: "Why there is only one corridor" },
      { id: "vat", label: "The 20% inside the price" },
      { id: "currency", label: "Which way sterling lands" },
      { id: "charging", label: "The question that should stop some buyers" },
      { id: "towing", label: "The tonne it lost" },
      { id: "dealer", label: "The dealer read" },
      { id: "landed", label: "Building the actual number" },
    ],
    faqs: [
      {
        q: "Can you buy a car in the UK VAT-free for export?",
        a: "A supply can be zero-rated where it meets HMRC's export conditions in VAT Notice 703. The goods must leave the United Kingdom within three months and valid evidence of export must be obtained and held within three months. For a motor vehicle on a direct export it must not be used or delivered in the UK beforehand. Fail either test and VAT becomes payable at the UK rate.",
      },
      {
        q: "How much VAT is inside the Range Rover Electric's £154,070 price?",
        a: "About £25,667.50. The £55 DVLA first registration fee and the £10 first-year vehicle excise duty for a zero-emission car sit outside VAT, leaving £154,005 as the VAT-inclusive vehicle price. Divided by 1.2 that is £128,337.50 before tax. This is our arithmetic on JLR's published figure; JLR has published no breakdown of the on-the-road price.",
      },
      {
        q: "What is the Personal Export Scheme, and is it the same thing?",
        a: "No. The Personal Export Scheme under VAT Notice 707 lets a qualifying private individual take delivery of a new vehicle in Britain and use it before export. It needs pre-approval on form VAT410, with HMRC's VAT412 issued before the vehicle is released, and export within 12 months for an overseas visitor or six months for an entitled UK resident. Breaking the conditions makes the VAT payable and the vehicle liable to seizure.",
      },
      {
        q: "Is there anywhere other than the UK to source a Range Rover Electric?",
        a: "Not at the point of manufacture. JLR builds every Range Rover Electric at Solihull. You can buy one through a retailer in another market, but you would be buying the same British car after that market's import duty, consumption tax and retail margin had been added, and paying freight on it a second time.",
      },
      {
        q: "What vehicle excise duty does a Range Rover Electric pay in the UK?",
        a: "A zero-emission car registered on or after 1 April 2025 pays £10 in its first year, then the £200 standard rate. Because its list price exceeds the £50,000 threshold for zero-emission cars, it also pays the £440 expensive car supplement for five years from the second time it is taxed — £640 a year, or £3,200 across the five years. An exported car never enters that regime.",
      },
      {
        q: "Should you import a Range Rover Electric into a market with little charging infrastructure?",
        a: "No. The car's 22-minute rapid-charge claim depends on a 350 kW charger being within range of where it lives, and JLR's own frame of reference is the United Kingdom, Europe and the Tesla Supercharger network in North America. If your market cannot support DC rapid charging or a reliable home charger, buy the plug-in hybrid or combustion Range Rover instead — same plant, same corridor, a drivetrain your market can actually run.",
      },
    ],
    sources: [
      {
        label: "Range Rover Electric: A New Era For The Original Luxury SUV",
        href: "https://media.jlr.com/range-rover/news/2026/09/range-rover-electric-new-era-original-luxury-suv",
        publisher: "JLR (Range Rover Media Newsroom)",
      },
      {
        label: "VAT on goods exported from the UK (VAT Notice 703)",
        href: "https://www.gov.uk/guidance/vat-on-goods-exported-from-the-uk-notice-703",
        publisher: "GOV.UK (HMRC)",
      },
      {
        label: "Personal Export Scheme (VAT Notice 707)",
        href: "https://www.gov.uk/guidance/personal-export-scheme-notice-707",
        publisher: "GOV.UK (HMRC)",
      },
      {
        label: "Vehicle tax rates: cars registered on or after 1 April 2017",
        href: "https://www.gov.uk/vehicle-tax-rate-tables",
        publisher: "GOV.UK",
      },
      {
        label: "Euro foreign exchange reference rates, 2 September 2026",
        href: "https://www.ecb.europa.eu/stats/policy_and_exchange_rates/euro_reference_exchange_rates/html/index.en.html",
        publisher: "European Central Bank",
      },
      {
        label:
          "The electric Range Rover costs $25,000 more than the gas one and tows a ton less",
        href: "https://www.carscoops.com/2026/09/range-rover-electric-official-launch/",
        publisher: "Carscoops",
      },
    ],
    relatedGuides: [
      "uk-car-export-documents-explained",
      "cost-to-import-a-car-from-the-uk",
      "importing-hybrids-and-evs-to-sri-lanka",
    ],
    linkedVehicleSlugs: ["range-rover-electric-2026"],
  },
  {
    slug: "pakistan-used-car-import-age-limit-removed-2026",
    title:
      "Pakistan dropped the age cap on used imports — and the 30% duty is a cut",
    h1: "Pakistan Removed the Age Cap on Commercial Used-Car Imports, and Cut the Duty",
    seoTitle: "Pakistan Used Car Import Rules 2026: Age Cap and Duty",
    description:
      "Pakistan removed the five-year age cap on commercial used-car imports on 1 July 2026 and cut regulatory duty from 40% to 30%. What it does to a landed bill.",
    excerpt:
      "Two liberalisations landed on the same day and most of the coverage read the second one backwards. The 30% in SRO 1065(I)/2026 is ten points lower than the day before, not thirty points higher.",
    category: "Policy & Tax",
    dateline: "Islamabad",
    keywords: [
      "pakistan used car import policy 2026",
      "pakistan commercial import used vehicles",
      "pakistan regulatory duty used cars",
      "import policy order 2022 used vehicles",
      "can dealers import used cars in pakistan",
      "what is the age limit for imported cars in pakistan",
      "how much duty on imported used cars in pakistan",
    ],
    author: AUTHOR,
    publishDate: "2026-09-07",
    updatedDate: "2026-09-07",
    readingTimeMins: 9,
    heroImage:
      "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=2400&auto=format&fit=crop",
    heroAlt:
      "Rows of used vehicles in a storage yard, illustrating commercial used-vehicle importing",
    heroCaption:
      "Illustrative image. Not a photograph of Pakistani import stock or of any vehicle referred to in this article.",
    toc: [
      { id: "what-changed", label: "What actually changed on 1 July" },
      { id: "the-correction", label: "The 30% is a reduction" },
      { id: "landed", label: "What it does to a landed number" },
      { id: "applies", label: "Does this apply to you?" },
      { id: "supply", label: "Where the cars come from" },
      { id: "timing", label: "Move now or wait?" },
      { id: "selling", label: "Is someone selling you something?" },
    ],
    faqs: [
      {
        q: "Can dealers commercially import used cars into Pakistan?",
        a: "Yes. The Ministry of Commerce amended the Import Policy Order, 2022 to create a commercial import route for used vehicles under PCT headings 8702, 8703 and 8704, sitting at clause (xvi) of Serial No. 10 of Appendix-C. Before that amendment, almost all used-vehicle imports ran through the personal baggage, gift and transfer-of-residence schemes, which require an individual overseas Pakistani behind each unit.",
      },
      {
        q: "What is the age limit for commercially imported used cars in Pakistan?",
        a: "There is no longer one on the commercial channel. The scheme as notified applied a five-year maximum vehicle age until 30 June 2026, after which the age limit stands removed. Quality, safety and environmental standards remain in force, with compliance oversight referred to the Engineering Development Board. Personal import schemes are governed separately and were not changed by the same measure.",
      },
      {
        q: "Did Pakistan add a new 30% duty on imported used cars in July 2026?",
        a: "No. SRO 1065(I)/2026 set regulatory duty on commercially imported used vehicles at 30% from 1 July 2026, which is ten percentage points below the 40% that applied until 30 June. Several outlets read the flat 30% in the notification as an additional charge. PakWheels published a fact-check reaching the same conclusion: it is a reduction, not a new tax.",
      },
      {
        q: "How far does Pakistan's regulatory duty on used vehicle imports fall?",
        a: "On the published schedule the rate steps down by roughly ten percentage points a year, reaching zero in the 2029-30 fiscal year. Only the current notification is in force; later years are stated intent rather than legislated entitlement. Duty schedules with multi-year paths have been reset before, so a 2029 margin should not be underwritten on a 2026 notification.",
      },
      {
        q: "Does this change anything for a private buyer in Pakistan?",
        a: "Not directly. The measure governs the commercial import channel, and the personal gift and transfer-of-residence schemes were addressed in a separate notification issued the same day. The indirect effect is that more legal commercial supply usually reaches retail prices eventually, though that takes time and depends on how many dealers actually use the channel.",
      },
    ],
    sources: [
      {
        label:
          "ECC green-lights proposals for commercial import of used vehicles",
        href: "https://www.dawn.com/news/1944359",
        publisher: "Dawn",
      },
      {
        label: "S.R.O. 1065(I)/2026",
        href: "https://download1.fbr.gov.pk/SROs/202663020651815SRO1065.pdf",
        publisher: "Federal Board of Revenue, Government of Pakistan",
      },
      {
        label: "Statutory Regulatory Orders",
        href: "https://www.commerce.gov.pk/sros/",
        publisher: "Ministry of Commerce, Government of Pakistan",
      },
      {
        label:
          "Fact Check: Did Govt Impose Additional 30% Duty on Imported Used Cars?",
        href: "https://www.pakwheels.com/blog/fact-check-did-govt-impose-additional-30-duty-on-imported-used-cars/",
        publisher: "PakWheels",
      },
      {
        label:
          "Imported Used Cars get Costlier in Pakistan as FBR brings new 30% Regulatory Duty",
        href: "https://en.dailypakistan.com.pk/01-Jul-2026/imported-used-cars-get-costlier-in-pakistan-as-fbr-brings-new-30-regulatory-duty",
        publisher: "Daily Pakistan",
      },
    ],
    relatedGuides: [
      "best-cars-to-import-from-japan",
      "japan-car-export-documents-explained",
      "japanese-auction-grades-explained",
    ],
  },
  {
    slug: "hong-kong-ev-first-registration-tax-concession-ends",
    title:
      "Hong Kong's EV tax break has gone, and the transitional window shuts in February",
    h1: "Hong Kong Ended Its Electric Car Tax Concession — One Door Is Open Until 24 February 2027",
    seoTitle: "Hong Kong EV First Registration Tax: Concession Ends",
    description:
      "Hong Kong's EV first registration tax concession expired 31 March 2026. Cars ordered by 25 February 2026 have until 24 February 2027 to apply. What it costs.",
    excerpt:
      "Hong Kong has extended this concession before, which is exactly why the transitional deadline is the number to write down. Applications close on 24 February 2027 and the benefit does not come back.",
    category: "Policy & Tax",
    dateline: "Hong Kong",
    keywords: [
      "hong kong first registration tax electric car",
      "hong kong ev tax concession 2026",
      "importing an electric car to hong kong",
      "hong kong one-for-one replacement scheme",
      "when does the hong kong ev tax concession end",
      "how much is first registration tax in hong kong",
    ],
    author: AUTHOR,
    publishDate: "2026-09-05",
    updatedDate: "2026-09-05",
    readingTimeMins: 8,
    heroImage: "/country/hong-kong.webp",
    heroAlt:
      "Hong Kong skyline, illustrating the Hong Kong vehicle import market",
    heroCaption:
      "Illustrative image of Hong Kong. Not a photograph of any vehicle or registration process referred to in this article.",
    toc: [
      { id: "what-changed", label: "What the Government announced" },
      { id: "deadline", label: "The date that still matters" },
      { id: "landed", label: "What it does to a landed number" },
      { id: "applies", label: "Does this apply to you?" },
      { id: "timing", label: "Move now or wait?" },
      { id: "selling", label: "Is someone selling you something?" },
    ],
    faqs: [
      {
        q: "When did Hong Kong's electric car tax concession end?",
        a: "The first registration tax concession arrangement for electric private cars, including the One-for-One Replacement Scheme, expired on 31 March 2026 and was not extended. Electric private cars with a first-registration application submitted on or after 1 April 2026 are no longer entitled to the concession. The Government confirmed the position in its 2026-27 Budget announcement on 25 February 2026.",
      },
      {
        q: "Is there still a way to get the Hong Kong EV tax concession?",
        a: "Only through the transitional arrangement. It covers electric private cars ordered on or before 25 February 2026, or that owners had arranged to be shipped to Hong Kong for their own use by that date, even if the car was not first registered before 1 April 2026. The application to pay at the pre-adjustment concessionary level must be submitted on or before 24 February 2027.",
      },
      {
        q: "Do electric commercial vehicles still get a Hong Kong tax waiver?",
        a: "Yes. First registration tax on electric commercial vehicles, electric motorcycles and electric motor tricycles continues to be waived in full until 31 March 2028. This announcement concerned electric private cars only, so a business importing an electric van or light goods vehicle is in a materially different position from one importing a passenger car.",
      },
      {
        q: "Is first registration tax charged on what I paid for the car?",
        a: "No. Hong Kong assesses first registration tax on a taxable value determined by the Customs and Excise Department, in progressive bands, rather than on your invoice. A keen purchase price does not proportionally reduce the tax. Confirm the taxable value with the Transport Department before committing funds, not after the vehicle is on the water.",
      },
      {
        q: "Can I still import a used car into Hong Kong?",
        a: "Yes. Nothing about admissibility changed. Hong Kong does not apply an age bar of the kind used in Kenya, Sri Lanka or much of the Caribbean, and right-hand-drive stock from Japan and the United Kingdom remains the natural source. What changed is the tax charged on registering an electric private car once it arrives.",
      },
    ],
    sources: [
      {
        label:
          "First registration tax concession arrangement for electric vehicles",
        href: "https://www.info.gov.hk/gia/general/202602/25/P2026022500288.htm",
        publisher: "Government of the Hong Kong Special Administrative Region",
      },
      {
        label: "The 2026-27 Budget — Budget Speech",
        href: "https://www.budget.gov.hk/2026/eng/budget35.html",
        publisher: "Government of the Hong Kong Special Administrative Region",
      },
      {
        label: "Motor Vehicle First Registration Tax",
        href: "https://www.gov.hk/en/residents/taxes/motortax/index.htm",
        publisher: "GovHK",
      },
      {
        label: "Motor Vehicles First Registration Tax System",
        href: "https://www.customs.gov.hk/en/electronic-services-forms/electronic-services/motor-vehicles-first-registration-tas-system/index.html",
        publisher: "Hong Kong Customs and Excise Department",
      },
    ],
    relatedGuides: [
      "how-to-buy-a-car-at-japanese-auction",
      "japanese-auction-grades-explained",
      "best-cars-to-import-from-japan",
    ],
  },
  {
    slug: "malaysia-cbu-ev-import-rules-cif-power-floor",
    title:
      "Malaysia now wants RM200,000 and 180 kW before it will let an EV in",
    h1: "Malaysia Put a Price Floor and a Power Floor on Imported Electric Cars",
    seoTitle: "Malaysia EV Import Rules 2026: RM200,000 CIF, 180 kW",
    description:
      "From 1 July 2026 an imported CBU electric car in Malaysia must have a CIF value of RM200,000 and make 180 kW. What the specification floor does to sourcing.",
    excerpt:
      "This is not a duty change, it is a specification floor. A car that cannot clear both thresholds is not a margin problem for a Malaysian dealer — it is an admissibility problem.",
    category: "Policy & Tax",
    dateline: "Kuala Lumpur",
    keywords: [
      "malaysia cbu ev import rules 2026",
      "malaysia imported ev cif value",
      "malaysia ev import duty",
      "miti ev policy malaysia",
      "can you import an electric car into malaysia",
      "what is the minimum price for an imported ev in malaysia",
    ],
    author: AUTHOR,
    publishDate: "2026-09-06",
    updatedDate: "2026-09-06",
    readingTimeMins: 9,
    heroImage: "/country/malaysia.webp",
    heroAlt:
      "Malaysian cityscape, illustrating the Malaysian vehicle import market",
    heroCaption:
      "Illustrative image of Malaysia. Not a photograph of any vehicle or import process referred to in this article.",
    toc: [
      { id: "floor", label: "A price floor and a power floor" },
      { id: "why", label: "Why Malaysia has done this" },
      { id: "landed", label: "What it does to a landed number" },
      { id: "applies", label: "Does this apply to you?" },
      { id: "dealer", label: "The dealer read" },
      { id: "timing", label: "Move now or wait?" },
    ],
    faqs: [
      {
        q: "What are Malaysia's new rules for importing an electric car?",
        a: "From 1 July 2026 every completely built-up electric vehicle imported into Malaysia must carry a declared cost, insurance and freight value of at least RM200,000 and produce a minimum of 180 kW, which is 245 PS or 241 hp. Both conditions apply together, so a vehicle has to clear each of them. MITI confirmed the conditions in a media statement on 6 May 2026.",
      },
      {
        q: "Is RM200,000 a retail price floor?",
        a: "No, and the distinction matters. CIF is the value at the Malaysian border before duty is applied, which is a lower and stricter line than a showroom price. A car with a CIF value of RM180,000 that would have retailed comfortably above RM200,000 after duty and tax does not meet the condition. The test is applied at the customs value.",
      },
      {
        q: "Do imported electric cars still get tax exemptions in Malaysia?",
        a: "No. The four-year exemption from import and excise duty on completely built-up electric vehicles under the franchise approved permit scheme ended on 31 December 2025. The July 2026 conditions therefore sit on top of a market already paying duty again. Trade reporting puts the structure at 30% import duty plus 10% excise and 10% sales tax, with import duty at 5% where a free trade agreement applies.",
      },
      {
        q: "Why has Malaysia tightened its imported EV rules?",
        a: "The stated aim is to redirect incentives from importing electric vehicles to assembling them locally, in completely knocked-down form, in order to support jobs, suppliers and industrial capacity. A CIF floor and a power floor push imported electric cars into a bracket where locally assembled vehicles are not competing anyway, leaving the mass market to local assembly.",
      },
      {
        q: "What happens to imported EVs already at a Malaysian port?",
        a: "Reporting indicates existing inventory, port stock and in-transit vehicles may be sold under the previous regulations until exhausted. If you are relying on that treatment, get it confirmed in writing by your forwarder against the specific bills of lading. We have not verified the precise cut-off with Malaysian customs and are not asserting one.",
      },
    ],
    sources: [
      {
        label:
          "MITI confirms changes to CBU EV policy, minimum CIF value of RM200k, at least 245 PS, effective July 1, 2026",
        href: "https://paultan.org/2026/05/06/miti-confirms-changes-to-cbu-ev-policy-minimum-cif-value-of-rm200k-at-least-245-ps-effective-july-1-2026/",
        publisher: "Paul Tan's Automotive News",
      },
      {
        label: "Malaysia tightens norms for imported EVs",
        href: "https://www.electrive.com/2026/05/08/malaysia-tightens-norms-for-imported-evs/",
        publisher: "electrive",
      },
      {
        label:
          "Tax and duties for CBU EVs set at 30%+10%+10% or 5%+10%+10% depending on country of origin, FTA",
        href: "https://paultan.org/2026/01/20/tax-and-duties-for-cbu-evs-set-at-301010-or-51010-depending-on-country-of-origin-fta/",
        publisher: "Paul Tan's Automotive News",
      },
      {
        label:
          "Imported EV incentives tapered down to boost local car industry",
        href: "https://www.freemalaysiatoday.com/category/nation/2026/05/08/imported-ev-incentives-tapered-down-to-boost-local-car-industry-says-source",
        publisher: "Free Malaysia Today",
      },
    ],
    relatedGuides: [
      "cost-to-import-a-car-from-japan",
      "japan-car-export-documents-explained",
      "best-cars-to-import-from-japan",
    ],
  },
  {
    slug: "tanzania-used-vehicle-excise-duty-finance-act-2026",
    title:
      "Tanzania re-banded used-import excise, and cut one band by two points",
    h1: "Tanzania's Finance Act 2026 Redrew the Excise Bands on Imported Used Vehicles",
    seoTitle: "Tanzania Used Car Excise Duty 2026: The New Age Bands",
    description:
      "Tanzania's Finance Act 2026 set used-vehicle excise at 18% for 8-10 year cars from 1 July, with 35% at 10-20 years and a new 5% on sub-1,000cc imports.",
    excerpt:
      "Parliament cut the eight-to-ten-year band from the 20% proposed in the Bill to 18% as enacted. It also brought a band that used to pay nothing into charge for the first time.",
    category: "Policy & Tax",
    dateline: "Dodoma",
    keywords: [
      "tanzania used car import excise duty 2026",
      "tanzania finance act 2026 vehicles",
      "importing a car to tanzania duty",
      "tanzania vehicle age excise bands",
      "how much is excise duty on used cars in tanzania",
      "what is the age limit for imported cars in tanzania",
    ],
    author: AUTHOR,
    publishDate: "2026-09-05",
    updatedDate: "2026-09-05",
    readingTimeMins: 8,
    heroImage:
      "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=2400&auto=format&fit=crop",
    heroAlt:
      "A used saloon car, illustrating the used-vehicle import trade into East Africa",
    heroCaption:
      "Illustrative image. Not a photograph of Tanzanian import stock or of any vehicle referred to in this article.",
    toc: [
      { id: "bands", label: "The bands as enacted" },
      { id: "landed", label: "What it does to a landed number" },
      { id: "1000cc", label: "The small-engine change" },
      { id: "applies", label: "Does this apply to you?" },
      { id: "timing", label: "Move now or wait?" },
    ],
    faqs: [
      {
        q: "What excise duty does Tanzania charge on imported used vehicles?",
        a: "Under the Finance Act 2026, effective 1 July 2026, vehicles aged between eight and ten years attract 18% excise duty. Vehicles aged between ten and twenty years continue at 35%, and those over twenty years at 40%. Vehicles not exceeding 1,000cc, previously exempt, now attract 5%. Verify the applicable band for your specific vehicle with the Tanzania Revenue Authority before importing.",
      },
      {
        q: "Why is the eight-to-ten year rate 18% and not 20%?",
        a: "The Finance Bill 2026 proposed 20% for that band. Parliament amended it downward to 18% before enactment, and the Act was assented to on 30 June 2026 with effect from 1 July. On an assumed dutiable value of US$8,000 the two-point difference is US$160 per unit on the excise line alone, before the compounding effect on VAT is counted.",
      },
      {
        q: "Is there an age limit on importing cars into Tanzania?",
        a: "Nothing in the Finance Act 2026 as reported introduces a new age bar. Vehicles over twenty years remain importable at the 40% excise band rather than being prohibited, so the change is to what they cost rather than to whether they may come. Confirm current admissibility requirements with the Tanzania Revenue Authority before committing to a purchase.",
      },
      {
        q: "Is the age measured when I buy the car or when it arrives?",
        a: "The band that matters is the one applying at import, not at purchase. A vehicle that is seven years and ten months old when you bid may be eight years old when it clears at Dar es Salaam. Sea freight from Japan is measured in weeks and clearance queues add more, so the shipping schedule is part of the tax plan.",
      },
      {
        q: "Does a cheaper purchase price reduce Tanzanian excise duty?",
        a: "Not proportionally. Excise, like customs duty, is charged on a value the revenue authority determines rather than on your invoice, and it stacks with import duty before VAT is applied. Negotiating hard at auction improves your margin and does relatively little to your assessment. Choosing the right age band does far more.",
      },
    ],
    sources: [
      {
        label:
          "Importing a used car now costs more as Finance Act takes effect",
        href: "https://www.thecitizen.co.tz/tanzania/business/importing-a-used-car-now-costs-more-as-finance-act-takes-effect-5514688",
        publisher: "The Citizen (Tanzania)",
      },
      {
        label:
          "Finance Bill 2026 drops agricultural withholding tax, softens used car duties",
        href: "https://www.tanzaniainvest.com/economy/finance-bill-2026-tax-changes",
        publisher: "TanzaniaInvest",
      },
      {
        label:
          "Tanzania enacts Finance Act 2026 with excise, VAT compliance measures",
        href: "https://regfollower.com/tanzania-enacts-finance-act-2026-with-excise-vat-compliance-measures/",
        publisher: "Regfollower",
      },
    ],
    relatedGuides: [
      "how-to-buy-a-car-at-japanese-auction",
      "japan-car-export-documents-explained",
      "japanese-auction-grades-explained",
    ],
  },
  {
    slug: "imo-solas-2026-ro-ro-ev-fire-rules-freight-cost",
    title: "The 2026 ship rules did not put up your freight bill",
    h1: "No, the 2026 SOLAS Amendments Did Not Restrict Electric Vehicles at Sea",
    seoTitle: "RoRo Shipping Rules 2026: What the IMO Actually Changed",
    description:
      "The SOLAS amendments in force from 1 January 2026 cover fire detection and suppression, not electric vehicles. EV-specific IMO rules are not due before 2032.",
    excerpt:
      "Lloyd's Register's summary of MSC.550(108) and MSC.555(108) contains no provisions about electric vehicles at all. If your surcharge cites them, ask which resolution.",
    category: "Market",
    dateline: "London",
    keywords: [
      "roro shipping ev rules 2026",
      "solas 2026 amendments vehicle decks",
      "car carrier freight rates 2026",
      "imo electric vehicle fire regulations",
      "did shipping rules change for electric cars in 2026",
      "why are car shipping rates so high",
    ],
    author: AUTHOR,
    publishDate: "2026-09-08",
    updatedDate: "2026-09-08",
    readingTimeMins: 9,
    heroImage: "/import-cars/japan-car-truck.webp",
    heroAlt:
      "Vehicles being loaded for ocean export, illustrating roll-on roll-off car shipping",
    heroCaption:
      "Illustrative image of vehicle export loading. Not a photograph of any vessel referred to in this article.",
    toc: [
      { id: "what-changed", label: "What entered into force in January" },
      { id: "claim", label: "The claim, and why it is wrong" },
      { id: "why-expensive", label: "So why is car freight expensive?" },
      { id: "applies", label: "Does this apply to you?" },
      { id: "timing", label: "Move now or wait?" },
    ],
    faqs: [
      {
        q: "Did new IMO rules restrict carrying electric vehicles from 2026?",
        a: "No. The amendments that entered into force on 1 January 2026 are IMO resolutions MSC.550(108), amending SOLAS Regulation II-2/20, and MSC.555(108), amending chapters 7 and 9 of the FSS Code. Lloyd's Register's published summary of them contains no provisions relating to electric or alternative-fuel vehicles. They address fire detection, video monitoring and suppression infrastructure.",
      },
      {
        q: "When do IMO rules specific to electric vehicles take effect?",
        a: "Mandatory IMO regulation addressing electric vehicles specifically is still being drafted. A correspondence group reports to the IMO sub-committee SSE 13 in March 2027, and Riviera Maritime Media reported on 8 April 2026 that any agreed SOLAS amendments are expected to enter into force on 1 January 2032 at the earliest. Anything charged to you in 2026 as an EV compliance cost is therefore not the cost of a rule that binds today.",
      },
      {
        q: "Which ships do the 2026 SOLAS amendments apply to?",
        a: "They apply to cargo ships and roll-on roll-off passenger ships with a keel laid on or after 1 January 2026. Existing ro-ro passenger ships must comply not later than the first survey on or after 1 January 2028. The vessel carrying your car this year is very unlikely to be a new-build subject to the requirements.",
      },
      {
        q: "Why are car shipping rates high in 2026 if the rules did not change?",
        a: "Because pure car and truck carrier capacity is tight relative to demand. The fleet was already running close to capacity before Chinese vehicle exports scaled, and newbuild deliveries have not arrived fast enough to absorb the extra volume. That is a supply and demand story with a shipbuilding lead time attached, and it does not need a regulatory explanation.",
      },
      {
        q: "What should I ask a forwarder about a regulatory surcharge?",
        a: "Ask which resolution the surcharge relates to, when the vessel's keel was laid, and whether the charge is a market rate or a compliance cost. A genuine regulatory surcharge can name its instrument. Both market rates and compliance costs are legitimate, but only one of them is negotiable, which is why it matters which you are being charged.",
      },
    ],
    sources: [
      {
        label:
          "Class News 07/2026: SOLAS amendments — Fire Safety Requirements for ro-ro Passenger Ships",
        href: "https://www.lr.org/en/knowledge/class-news/07-26/",
        publisher: "Lloyd's Register",
      },
      {
        label: "EV fire risks draw IMO's attention",
        href: "https://www.rivieramm.com/news-content-hub/ev-fire-risks-draw-imos-attention-88377",
        publisher: "Riviera Maritime Media",
      },
      {
        label: "Summary of new IMO requirements coming into force in 2026",
        href: "https://www.irclass.org/media/8170/encl-1-new-imo-requirements-coming-into-force-untill-2025.pdf",
        publisher: "Indian Register of Shipping",
      },
      {
        label: "RoRo Shipping in 2026: Why Vehicle Shipping Capacity Is Tight",
        href: "https://tgal.us/roro-shipping-2026-vehicle-shipping-capacity/",
        publisher: "TransGlobal",
      },
    ],
    relatedGuides: [
      "cost-to-import-a-car-from-japan",
      "cost-to-import-a-car-from-the-uk",
      "cost-to-import-a-car-from-thailand",
    ],
  },
  {
    slug: "thailand-vehicle-production-exports-2026-dealer-read",
    title: "Thailand is building more cars and exporting fewer of them",
    h1: "Thailand's Production Is Up and Its Export Book Is Shrinking",
    seoTitle: "Thailand Car Production and Exports 2026: Dealer Read",
    description:
      "Thailand built 117,383 vehicles in July 2026, up 6.12%, but exports fell 8.53% over January to May. What a tightening export book does to dealer stock.",
    excerpt:
      "A domestic recovery does not replace an export book. Pickup exports fell 38.79% year-on-year in May, and pickups are the product Thailand's plant network was built around.",
    category: "Market",
    dateline: "Bangkok",
    keywords: [
      "thailand car production exports 2026",
      "thailand pickup export decline",
      "federation of thai industries vehicle production",
      "importing pickups from thailand 2026",
      "why are thai car exports falling",
      "is thailand still a good source for pickups",
    ],
    author: AUTHOR,
    publishDate: "2026-09-07",
    updatedDate: "2026-09-07",
    readingTimeMins: 8,
    heroImage: "/country/thailand.webp",
    heroAlt:
      "Thailand cityscape, illustrating the Thai automotive manufacturing and export market",
    heroCaption:
      "Illustrative image of Thailand. Not a photograph of any plant or vehicle referred to in this article.",
    toc: [
      { id: "numbers", label: "The numbers, in the right order" },
      { id: "pickups", label: "Where the weakness sits" },
      { id: "dealer", label: "What it does to a dealer" },
      { id: "currency", label: "The currency leg" },
      { id: "timing", label: "Move now or wait?" },
    ],
    faqs: [
      {
        q: "How many vehicles did Thailand build in July 2026?",
        a: "117,383 units, up 6.12% year-on-year, according to the Federation of Thai Industries. Finished-vehicle exports that month were 74,169 units, up 2.39%. Over the first seven months of 2026 production reached 834,595 vehicles, down 0.09%. The FTI did not publish a seven-month export total in the reports we could verify; the most recent cumulative figure we could confirm is 333,618 units exported over January to May, down 8.53%.",
      },
      {
        q: "Why are Thai pickup exports falling?",
        a: "The Federation of Thai Industries has attributed much of the decline to weaker demand from Middle Eastern markets. In May 2026 one-tonne pickup production fell 22.68% year-on-year to 65,314 units and pickup exports fell 38.79% to 42,033 units. A second, structural pressure is that Chinese manufacturers have built Thai electric capacity faster than incumbents have converted combustion lines.",
      },
      {
        q: "Does this make Thai-built vehicles cheaper?",
        a: "Not reliably. Production discipline in a soft export market usually protects price rather than discounting it. A weaker baht helps a foreign buyer only to the extent it is not offset at the factory gate. If someone is offering you a deal on the basis that Thailand is quiet and prices are collapsing, ask what the actual invoice says.",
      },
      {
        q: "Should a dealer switch from Thailand to Japan for pickups?",
        a: "Second-source the specification you cannot afford to be short of rather than switching wholesale. Thailand is prioritising a recovering domestic market rather than closing, which is a scheduling risk rather than a supply cliff. Japanese auction stock covers many of the same models, but grade conventions, mileage profiles and documentation differ meaningfully between the two corridors.",
      },
      {
        q: "What is Thailand's 2026 production target?",
        a: "The Federation of Thai Industries expects 1.45 million units for 2026, comprising 550,000 for domestic sale and 900,000 for export. Seven-month production of 834,595 units is a little under 58% of the full-year target with five months to run, so the export half of that target is the number worth watching over the remainder of the year.",
      },
    ],
    sources: [
      {
        label: "Thai car production up 6.1% y/y in July",
        href: "https://www.bangkokpost.com/business/general/3307660/thai-car-production-up-61-yy-in-july",
        publisher: "Bangkok Post",
      },
      {
        label:
          "Thailand Vehicle Production Falls 17.94% to 114,214 Units in May 2026",
        href: "https://www.mreport.co.th/en/news/statistic-and-ranking/551-thailand-automotive-production-may-2026",
        publisher: "M Report",
      },
      {
        label: "Thailand's auto production rises 6.12 pct in July",
        href: "https://english.news.cn/asiapacific/20260825/63077ba9699f449a9bce0fcbadd800f5/c.html",
        publisher: "Xinhua",
      },
      {
        label:
          "Thai car exports fall as parts costs and weak demand weigh on output",
        href: "https://www.nationthailand.com/business/automobile/40066626",
        publisher: "The Nation (Thailand)",
      },
      {
        label: "Euro foreign exchange reference rates",
        href: "https://www.ecb.europa.eu/stats/policy_and_exchange_rates/euro_reference_exchange_rates/html/index.en.html",
        publisher: "European Central Bank",
      },
    ],
    relatedGuides: [
      "best-pickups-to-import-from-thailand",
      "thailand-vs-japan-for-pickup-imports",
      "thailand-car-export-documents-explained",
    ],
  },
  {
    slug: "sri-lanka-vehicle-finance-loan-to-value-cap-2026",
    title: "Sri Lanka capped vehicle finance at 40%, and the deposit tripled",
    h1: "Sri Lanka Reopened Vehicle Imports, Then Capped the Credit That Pays for Them",
    seoTitle: "Sri Lanka Vehicle Finance Cap 2026: 40% Loan to Value",
    description:
      "Sri Lanka capped vehicle financing at 40% of value from 25 May 2026, with 60% for commercial vehicles. Why the deposit, not the tax, is now the binding wall.",
    excerpt:
      "A tax raises the price of the car. A loan-to-value cap raises the price of getting to the car. On a LKR 10,000,000 vehicle the buyer now needs LKR 6,000,000 in cash.",
    category: "Market",
    dateline: "Colombo",
    keywords: [
      "sri lanka vehicle finance cap 2026",
      "sri lanka loan to value vehicle imports",
      "central bank of sri lanka vehicle leasing rules",
      "importing vehicles to sri lanka 2026",
      "how much can you finance a car in sri lanka",
      "why did sri lanka restrict vehicle loans",
    ],
    author: AUTHOR,
    publishDate: "2026-09-06",
    updatedDate: "2026-09-06",
    readingTimeMins: 8,
    heroImage: "/country/sri-lanka.webp",
    heroAlt:
      "Sri Lankan coastline, illustrating the Sri Lankan vehicle import market",
    heroCaption:
      "Illustrative image of Sri Lanka. Not a photograph of any vehicle or transaction referred to in this article.",
    toc: [
      { id: "what-changed", label: "What the directions do" },
      { id: "arithmetic", label: "The arithmetic of a 40% cap" },
      { id: "dealer", label: "The dealer read" },
      { id: "applies", label: "Does this apply to you?" },
      { id: "timing", label: "Move now or wait?" },
    ],
    faqs: [
      {
        q: "How much of a vehicle's value can be financed in Sri Lanka?",
        a: "Under Central Bank of Sri Lanka Act Directions No. 01 of 2026, effective 25 May 2026, financing on most motor cars, SUVs, vans and three-wheelers is capped at 40% of the vehicle's value. Commercial vehicles are reported at a maximum 60% financing ratio. The directions bind licensed commercial banks, licensed specialised banks, licensed finance companies and registered finance leasing establishments.",
      },
      {
        q: "What does a 40% financing cap mean in practice?",
        a: "The buyer has to find 60% of the vehicle's value in cash. On an illustrative LKR 10,000,000 vehicle that is LKR 6,000,000 up front, against LKR 2,000,000 in a market permitting 80% financing. The cap effectively triples the deposit, which is why it works as a demand control and why it bites hardest on marginal buyers.",
      },
      {
        q: "Why has Sri Lanka restricted vehicle financing?",
        a: "To protect foreign reserves. Vehicle imports have historically been one of the largest single sources of pressure on Sri Lanka's reserves, and the staged reopening from February 2025 brought demand back quickly. Restricting credit slows import demand without closing the border again, which is a less visible control than a surcharge or a suspension.",
      },
      {
        q: "Does the cap affect cash buyers in Sri Lanka?",
        a: "No. The directions govern lenders rather than purchases, so a buyer paying cash is unaffected. The practical consequence for dealers is that the segment least affected is the one that was never financed — commercial vehicles, fleet buyers and the top of the range — rather than the volume saloon that normally carries a Sri Lankan showroom.",
      },
      {
        q: "How long will the Sri Lankan financing caps last?",
        a: "No sunset date has been confirmed to us. That is a genuine unknown and it matters, because whether these directions are a cycle measure or a standing regime determines whether a dealer should commit capital to deep stock now or wait. Until it is clear, smaller and faster consignments carry less risk than large ones.",
      },
    ],
    sources: [
      {
        label:
          "Central Bank Tightens Vehicle Finance as Sri Lanka Moves to Contain Import-Led Currency Pressure",
        href: "https://srilankachronicle.com/central-bank-tightens-vehicle-finance-as-sri-lanka-moves-to-contain-import-led-currency-pressure/",
        publisher: "Financial Chronicle (Sri Lanka)",
      },
      {
        label:
          "Loan to Value Ratios for Credit Facilities Granted in Respect of Motor Vehicles",
        href: "https://www.cbsl.gov.lk/en/node/18904",
        publisher: "Central Bank of Sri Lanka",
      },
      {
        label:
          "Sri Lanka central bank ready for vehicle import relaxation: Governor",
        href: "https://economynext.com/sri-lanka-central-bank-ready-for-vehicle-import-relaxation-governor-185986/",
        publisher: "EconomyNext",
      },
      {
        label: "Sri Lanka vehicle imports reach 613 mln USD in Q1",
        href: "https://english.news.cn/20260503/5c7ec6f4af304bd8bf9eda7e4efd83d2/c.html",
        publisher: "Xinhua",
      },
    ],
    relatedGuides: [
      "sri-lanka-vehicle-import-rules-for-dealers",
      "sri-lanka-vehicle-import-taxes-explained",
      "importing-a-car-to-sri-lanka",
    ],
  },
  {
    slug: "yen-intervention-2026-japan-car-import-cost",
    title: "¥15.4 trillion later, the weak-yen discount is unwinding",
    h1: "Japan Intervened, the Yen Turned, and a ¥3,000,000 Car Now Costs €754 More",
    seoTitle: "Yen Intervention 2026: What It Costs to Import a Car",
    description:
      "The euro fell from ¥186.99 on 30 July to ¥178.59 on 9 September 2026 after a ¥15.4 trillion intervention. What that does to a ¥3,000,000 car, netted properly.",
    excerpt:
      "The currency move cost a euro buyer about €314 on the average August car. The auction price fall gave back about €519. Anyone quoting you one without the other is quoting half a number.",
    category: "Market",
    dateline: "Tokyo",
    keywords: [
      "yen exchange rate car import 2026",
      "japan yen intervention 2026",
      "jpy eur exchange rate car auction",
      "uss auction average price 2026",
      "does a strong yen make japanese cars more expensive",
      "what exchange rate is used for import duty",
    ],
    author: AUTHOR,
    publishDate: "2026-09-10",
    updatedDate: "2026-09-10",
    readingTimeMins: 11,
    heroImage:
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=2400&auto=format&fit=crop",
    heroAlt:
      "A car photographed at dusk, illustrating the Japanese used vehicle export market",
    heroCaption:
      "Illustrative image. Not a photograph of any vehicle, auction or transaction referred to in this article.",
    toc: [
      { id: "what-happened", label: "What happened to the yen" },
      { id: "landed", label: "What it does to your driveway" },
      { id: "pass-through", label: "The half nobody prices" },
      { id: "net", label: "Netting the two together" },
      { id: "applies", label: "Does this apply to you?" },
      { id: "timing", label: "Move now or wait?" },
    ],
    faqs: [
      {
        q: "What has the yen done to the cost of importing a Japanese car?",
        a: "It has made it more expensive since late July. The European Central Bank's euro reference rate for the yen was 186.99 on 30 July 2026 and 178.59 on 9 September 2026, a 4.49% fall in what a euro buys. On a hammer price of ¥3,000,000 that is roughly €754 more for exactly the same vehicle, on the purchase leg alone.",
      },
      {
        q: "How large was Japan's 2026 currency intervention?",
        a: "Japan's Ministry of Finance published foreign exchange intervention operations totalling ¥15,399.3 billion for the period 30 July to 26 August 2026, released on 28 August. That is the official total for the window rather than a single day's operation. Estimates of what was spent on any individual session vary widely and we are not repeating them.",
      },
      {
        q: "Did Japanese auction prices fall in August 2026?",
        a: "The USS average contracted price fell from ¥1,345,000 in July to ¥1,248,000 in August, down 7.2%. But USS consignments fell 27.9% over the same period, from 352,947 to 254,517, and August is a short trading month in Japan. Part of that fall is a change in what was in the hall rather than a change in what cars are worth.",
      },
      {
        q: "Does a stronger yen reduce my import duty straight away?",
        a: "No. Duty and VAT or GST are assessed on a value converted at your customs authority's published rate, which in most regimes is fixed for a period rather than tracking spot. A currency move changes what you pay the seller almost immediately, and reaches your duty calculation only when the customs rate next resets. Confirm the mechanism for your own destination.",
      },
      {
        q: "Is there an FX story when sourcing from the UAE?",
        a: "No. The dirham is pegged to the US dollar at 3.6725, so you cannot get a currency discount out of Dubai independent of the dollar. UAE sourcing competes on stock, specification and speed rather than on exchange rates. The same is broadly true of the Bahamian and Barbadian dollars and the Hong Kong dollar's linked band.",
      },
      {
        q: "Where does the yen go next?",
        a: "We do not know and neither does anyone telling you they do. This publication reports levels, direction and mechanics, and does not forecast currencies. What can be said structurally is that intervention changes a level rather than the interest-rate differential underneath it, and Japan's 2022 and 2024 interventions were both followed by a resumption of the previous direction.",
      },
    ],
    sources: [
      {
        label: "Euro foreign exchange reference rates",
        href: "https://www.ecb.europa.eu/stats/policy_and_exchange_rates/euro_reference_exchange_rates/html/index.en.html",
        publisher: "European Central Bank",
      },
      {
        label:
          "Foreign Exchange Intervention Operations (July 30, 2026 – August 26, 2026)",
        href: "https://www.mof.go.jp/english/policy/international_policy/reference/feio/monthly/20260828e.html",
        publisher: "Ministry of Finance, Japan",
      },
      {
        label: "Monthly Data",
        href: "https://www.ussnet.co.jp/en/ir/library/monthly/index.html",
        publisher: "USS Co., Ltd.",
      },
      {
        label: "Japan and US confirm rare joint intervention to prop up yen",
        href: "https://www.aljazeera.com/economy/2026/8/3/japan-and-us-confirm-rare-joint-intervention-to-prop-up-yen",
        publisher: "Al Jazeera",
      },
      {
        label:
          "Japanese yen sinks to 40-year low, keeping intervention risks in focus",
        href: "https://www.cnbc.com/2026/06/30/japan-yen-falls-lowest-level-since-1986-dollar-intervention-risk.html",
        publisher: "CNBC",
      },
    ],
    relatedGuides: [
      "how-to-buy-a-car-at-japanese-auction",
      "cost-to-import-a-car-from-japan",
      "japanese-auction-grades-explained",
    ],
  },
  {
    slug: "destination-currency-customs-exchange-rate-car-import",
    title:
      "Your currency, the customs rate, and why they are not the same number",
    h1: "An Import Is Four Currency Exposures, and Your Own Is the One Nobody Writes About",
    seoTitle: "Customs Exchange Rate vs Spot: Your Import in Your Money",
    description:
      "An import is four currency exposures, not one. The Kenyan shilling sat at KSh 129.43 to the dollar on 9 September 2026 — and your duty uses a different rate.",
    excerpt:
      "Almost every currency article for importers watches the yen. For a buyer in Nairobi, Kampala or Kingston the larger exposure is their own currency — and the Kenyan shilling has done something unusual this year.",
    category: "Market",
    dateline: "Nairobi",
    keywords: [
      "customs exchange rate import duty",
      "destination currency car import cost",
      "kenya shilling car import 2026",
      "how is import duty exchange rate calculated",
      "does a weak currency make car imports expensive",
      "pegged currencies car importing",
    ],
    author: AUTHOR,
    publishDate: "2026-09-10",
    updatedDate: "2026-09-10",
    readingTimeMins: 10,
    heroImage: "/country/uganda.webp",
    heroAlt:
      "East African landscape, illustrating destination markets for vehicle imports",
    heroCaption:
      "Illustrative image. Not a photograph of any vehicle, transaction or currency market referred to in this article.",
    toc: [
      { id: "four-legs", label: "Four currency exposures, not one" },
      { id: "kenya", label: "The Kenyan shilling has been quiet" },
      { id: "customs-rate", label: "Why your duty uses a different rate" },
      { id: "pegs", label: "Corridors with no currency story" },
      { id: "applies", label: "Does this apply to you?" },
      { id: "timing", label: "Move now or wait?" },
    ],
    faqs: [
      {
        q: "How many currency exposures does a car import have?",
        a: "Four. The hammer price and the auction, transport and agent fees are paid in the source currency. Ocean freight and marine insurance are usually contracted in US dollars. Duty, VAT or GST, excise and registration tax are charged in your own currency at your customs authority's conversion rate. They do not all move together and they do not all land on the same side of the trade.",
      },
      {
        q: "Does a weak source currency always make an import cheaper?",
        a: "It makes the car cheaper, which is not the same thing. A weak source currency reduces the hammer price and the source-side fees in your money. It does nothing to freight contracted in dollars, and nothing to the duty your own authority assesses in your own currency. A weak destination currency, by contrast, makes every leg dearer.",
      },
      {
        q: "What was the Kenyan shilling worth in September 2026?",
        a: "The Central Bank of Kenya's mean rates on 9 September 2026 were KSh 129.43 to the US dollar, KSh 175.44 to sterling and KSh 150.50 to the euro. The shilling has traded close to 129 to the dollar for well over a year, with reserves reported at US$15.155 billion on 20 August 2026, about 6.3 months of import cover.",
      },
      {
        q: "Is the exchange rate on my duty bill the same as the spot rate?",
        a: "Usually not. Customs authorities convert foreign-currency invoices at a published administrative rate that is commonly fixed for a period rather than tracking spot. So a favourable move in the source currency reduces what you pay the seller immediately, and reaches your duty calculation only when the customs rate next resets. Confirm the mechanism for your destination with your clearing agent.",
      },
      {
        q: "Which import corridors have no exchange rate story?",
        a: "Those running fixed or tightly managed rates. The UAE dirham is pegged to the US dollar at 3.6725, the Bahamian dollar at 1:1, the Barbados dollar at 2:1, and the Hong Kong dollar trades in a linked band around 7.75 to 7.85. In those corridors currency is not a lever, and presenting it as one is noise.",
      },
    ],
    sources: [
      {
        label: "Forex Exchange Rates",
        href: "https://www.centralbank.go.ke/rates/forex-exchange-rates/",
        publisher: "Central Bank of Kenya",
      },
      {
        label: "Euro foreign exchange reference rates",
        href: "https://www.ecb.europa.eu/stats/policy_and_exchange_rates/euro_reference_exchange_rates/html/index.en.html",
        publisher: "European Central Bank",
      },
      {
        label:
          "Kenyan Shilling Remains Stable As Forex Reserves Hit USD15.2 Billion",
        href: "https://thekenyatimes.com/business/kenyan-shilling-remains-stable-as-forex-reserves-hit-usd15-2-billion/",
        publisher: "The Kenya Times",
      },
    ],
    relatedGuides: [
      "cost-to-import-a-car-from-japan",
      "importing-cars-to-ireland",
      "cost-to-import-a-car-from-the-uk",
    ],
  },
  {
    slug: "toyota-land-cruiser-fj-japan-price-thailand-built",
    title: "Toyota's Land Cruiser FJ is a Japanese car built in Thailand",
    h1: "The Land Cruiser FJ Costs ¥4,500,100 in Japan and Is Assembled at Ban Pho",
    seoTitle: "Toyota Land Cruiser FJ: ¥4,500,100, Built in Thailand",
    description:
      "Toyota launched the Land Cruiser FJ in Japan on 14 May 2026 at ¥4,500,100, built at Toyota Motor Thailand's Ban Pho plant. Can you import one, and at what cost?",
    excerpt:
      "One grade, one price, one named sales market. The production line is in Rayong province and the showroom is in Japan — which is a routing question before it is a buying one.",
    category: "Releases",
    dateline: "Toyota City, Aichi",
    keywords: [
      "toyota land cruiser fj price",
      "land cruiser fj import",
      "land cruiser fj specifications",
      "toyota land cruiser fj japan launch",
      "where is the land cruiser fj built",
      "can you import a land cruiser fj",
      "how much is the toyota land cruiser fj",
    ],
    author: AUTHOR,
    publishDate: "2026-09-08",
    updatedDate: "2026-09-08",
    readingTimeMins: 9,
    heroImage: "/import-cars/prado.webp",
    heroAlt:
      "A Toyota Land Cruiser Prado, shown to illustrate Toyota's ladder-frame four-wheel drive range",
    heroCaption:
      "Illustrative image of a Toyota Land Cruiser Prado. This is not the Land Cruiser FJ described in this article.",
    toc: [
      { id: "confirmed", label: "What Toyota actually confirmed" },
      { id: "thailand", label: "Built in Thailand, sold in Japan" },
      { id: "landed", label: "What does it land at?" },
      { id: "applies", label: "Can you import one?" },
      { id: "timing", label: "Move now or wait?" },
    ],
    faqs: [
      {
        q: "How much does the Toyota Land Cruiser FJ cost?",
        a: "Toyota launched it in Japan on 14 May 2026 at ¥4,500,100 for the single VX grade, including Japanese consumption tax and excluding recycling fees. Consumption tax is charged at 10%, so roughly ¥409,100 of that price is tax. Whether it comes out of an export purchase depends on how the sale is structured, which is a question for your exporter.",
      },
      {
        q: "Where is the Toyota Land Cruiser FJ built?",
        a: "At the Ban Pho Plant of Toyota Motor Thailand Co., Ltd., in Thailand. Toyota's launch announcement lists it as the production plant. The vehicle is then sold in Japan as a domestic-market car, which is normal for the IMV platform family the FJ shares its underpinnings with.",
      },
      {
        q: "What engine does the Land Cruiser FJ have?",
        a: "The 2TR-FE, a 2.7-litre naturally aspirated inline four-cylinder petrol, paired with a 6 Super ECT automatic and part-time four-wheel drive. It produces 120 kW, or 163 PS, and 246 Nm, with 8.7 km/L on the WLTC cycle. The 2TR-FE has served in Hilux and Prado applications for years and has broad parts availability.",
      },
      {
        q: "How big is the Land Cruiser FJ?",
        a: "It is 4,575 mm long and 1,855 mm wide on a 2,580 mm wheelbase, with 795 litres of cargo space rising to 1,607 litres with the rear seats folded. That makes it a genuinely compact ladder-frame vehicle rather than a scaled-down 300 Series, and it competes on footprint with mid-size crossovers while retaining a separate chassis.",
      },
      {
        q: "Can you import a Land Cruiser FJ?",
        a: "It is right-hand drive as a Japanese-market vehicle, and being new it is unaffected by the age limits that restrict used imports into Kenya, Sri Lanka and much of the Caribbean. The real question is emissions certification and type approval in your destination, which varies country by country and takes longer to resolve than shipping does.",
      },
      {
        q: "Will the Land Cruiser FJ be sold outside Japan?",
        a: "Toyota's launch release names Japan as the sales market and we have not seen a wider rollout confirmed. Being assembled in Thailand does not entitle anyone to buy one from a Thai dealer — a plant builds what its export programme allocates and sells what its distributor lists. Confirm the acquisition channel before promising a delivery date.",
      },
    ],
    sources: [
      {
        label: 'Toyota Launches All-New Land Cruiser "FJ" Series in Japan',
        href: "https://global.toyota/en/newsroom/toyota/44331143.html",
        publisher: "Toyota Motor Corporation",
      },
      {
        label: 'New Land Cruiser "FJ" Makes World Premiere',
        href: "https://global.toyota/en/newsroom/toyota/43389422.html",
        publisher: "Toyota Motor Corporation",
      },
      {
        label: "Euro foreign exchange reference rates",
        href: "https://www.ecb.europa.eu/stats/policy_and_exchange_rates/euro_reference_exchange_rates/html/index.en.html",
        publisher: "European Central Bank",
      },
      {
        label:
          "Toyota's $28,500 Land Cruiser FJ Matches A RAV4 On Price, Not On Size",
        href: "https://www.carscoops.com/2026/05/toyota-land-cruiser-fj-japan-pricing/",
        publisher: "Carscoops",
      },
    ],
    relatedGuides: [
      "best-cars-to-import-from-japan",
      "cost-to-import-a-car-from-thailand",
      "thailand-car-export-documents-explained",
    ],
  },
  {
    slug: "kia-sorento-india-launch-price-anantapur-export",
    title: "Kia's Sorento lands in India at ₹27.99 lakh, built at Anantapur",
    h1: "Kia Launched the Sorento in India — an India-Built, Right-Hand-Drive Seven-Seater",
    seoTitle: "Kia Sorento India Price 2026 and the Import Read",
    description:
      "Kia launched the Sorento in India on 4 September 2026 from ₹27.99 lakh, built at Anantapur. A 1.6 strong hybrid, a 442 Nm diesel, and what it means for sourcing.",
    excerpt:
      "The hybrid is the headline and the diesel is the export case. 442 Nm in a seven-seat body, built in right-hand drive at Indian cost, is the specification that travels.",
    category: "Releases",
    dateline: "Anantapur, Andhra Pradesh",
    keywords: [
      "kia sorento india price",
      "kia sorento india launch 2026",
      "india built right hand drive suv",
      "importing an indian built suv",
      "where is the kia sorento made in india",
      "how much is the kia sorento in india",
    ],
    author: AUTHOR,
    publishDate: "2026-09-05",
    updatedDate: "2026-09-05",
    readingTimeMins: 8,
    heroImage: "/import-cars/india-why-import.webp",
    heroAlt:
      "Indian-manufactured vehicles, illustrating India as a right-hand-drive sourcing base",
    heroCaption:
      "Illustrative image of Indian vehicle manufacturing. Not a photograph of the Kia Sorento described in this article.",
    toc: [
      { id: "what-launched", label: "What Kia launched" },
      { id: "india-built", label: "Why Anantapur matters" },
      { id: "landed", label: "What the price means in your money" },
      { id: "applies", label: "Can you import one?" },
      { id: "timing", label: "Move now or wait?" },
    ],
    faqs: [
      {
        q: "How much does the Kia Sorento cost in India?",
        a: "It launched on 4 September 2026 from ₹27.99 lakh ex-showroom, running to ₹40.39 lakh at the top of the range. Indian ex-showroom pricing includes GST but excludes registration, road tax and insurance, so it is not an on-road figure and it is certainly not an export price basis.",
      },
      {
        q: "What engines does the India-spec Kia Sorento have?",
        a: "Two. A 1.6-litre turbo petrol strong hybrid, whose engine is rated 180 PS and 265 Nm and whose motor is rated 65 PS and 264 Nm, offered with all-wheel drive; and a 2.2-litre turbo diesel producing 193 PS and 442 Nm. Kia India has not published a combined system output for the hybrid, and the two peaks cannot simply be added. Both are offered in six and seven-seat layouts.",
      },
      {
        q: "Where is the India-spec Kia Sorento built?",
        a: "At Kia's Anantapur facility in Andhra Pradesh, which has supplied the Indian market since 2019. India builds volume vehicles in right-hand drive as standard for a domestic market large enough that a plant does not need exports to justify itself, which is what makes Indian-built vehicles competitive on cost rather than on specification.",
      },
      {
        q: "Can the Kia Sorento be exported from India?",
        a: "We have not seen an export programme announced, and production at an Indian plant does not by itself mean a vehicle is available for export. Manufacturers allocate export volume separately from domestic volume. Confirm the actual acquisition channel with the manufacturer or a licensed exporter before quoting a customer a delivery date.",
      },
      {
        q: "Should I import a Sorento or buy from a local Kia distributor?",
        a: "If Kia has a distributor in your market, start there. A car supplied through official channels with a manufacturer warranty is usually the better commercial answer than a private import of the same vehicle, particularly for a hybrid whose battery and control unit will need a service network behind them.",
      },
    ],
    sources: [
      {
        label: "India-spec Kia Sorento revealed ahead of September 4 launch",
        href: "https://www.autocarindia.com/car-news/kia-reveals-india-spec-sorento-ahead-of-september-4-launch-440546",
        publisher: "Autocar India",
      },
      {
        label: "Upcoming car launches in September 2026",
        href: "https://www.autocarindia.com/car-news/upcoming-car-launches-in-september-2026-440587",
        publisher: "Autocar India",
      },
      {
        label:
          "Kia Sorento Launched In India At Rs 27.99 Lakh: Diesel, Hybrid And AWD On Offer",
        href: "https://www.motoroids.com/news/kia-sorento-launched-in-india-at-rs-27-99-lakh-diesel-hybrid-and-awd-on-offer/",
        publisher: "Motoroids",
      },
      {
        label: "Euro foreign exchange reference rates",
        href: "https://www.ecb.europa.eu/stats/policy_and_exchange_rates/euro_reference_exchange_rates/html/index.en.html",
        publisher: "European Central Bank",
      },
    ],
    relatedGuides: [
      "best-cars-to-import-from-india",
      "cost-to-import-a-car-from-india",
      "india-car-export-documents-explained",
    ],
  },
  {
    slug: "maruti-baleno-facelift-2026-price-india-export",
    title: "Maruti's new Baleno puts Level 2 driver assistance under ₹6.5 lakh",
    h1: "The 2026 Maruti Baleno Starts at ₹6.10 Lakh and Brings ADAS Down the Price Ladder",
    seoTitle: "Maruti Baleno 2026 Price, Specs and the Import Read",
    description:
      "Maruti launched the facelifted Baleno on 5 September 2026 from ₹6.10 lakh with Level 2 ADAS, 83 hp and 24.77 kmpl claimed. What it means in an import market.",
    excerpt:
      "The specification change worth noticing is not the grille. Adaptive cruise, lane keeping and emergency braking on a car starting at ₹6.10 lakh is a long way down the ladder.",
    category: "Releases",
    dateline: "New Delhi",
    keywords: [
      "maruti baleno 2026 price",
      "maruti baleno facelift specifications",
      "indian hatchback import",
      "baleno adas features",
      "how much is the new maruti baleno",
      "is it worth importing a small indian car",
    ],
    author: AUTHOR,
    publishDate: "2026-09-06",
    updatedDate: "2026-09-06",
    readingTimeMins: 8,
    heroImage: "/import-cars/swift.webp",
    heroAlt:
      "A Suzuki Swift hatchback, shown to illustrate the small Indian-built hatchback segment",
    heroCaption:
      "Illustrative image of a Suzuki Swift. This is not the Maruti Baleno described in this article.",
    toc: [
      { id: "what-changed", label: "What changed" },
      { id: "why-it-matters", label: "Why a small hatchback matters" },
      { id: "landed", label: "What the price means in your money" },
      { id: "applies", label: "Can you import one?" },
      { id: "timing", label: "Move now or wait?" },
    ],
    faqs: [
      {
        q: "How much does the 2026 Maruti Baleno cost?",
        a: "It launched on 5 September 2026 from ₹6.10 lakh ex-showroom, which is ₹20,000 above the car it replaces. Indian ex-showroom prices include GST but exclude registration, road tax and insurance. We have verified the entry price only and have not confirmed the full variant-by-variant ladder.",
      },
      {
        q: "What engine does the new Baleno have?",
        a: "The Z12E, a 1.2-litre three-cylinder naturally aspirated petrol producing 83 hp and 112 Nm, with a five-speed manual or five-speed AMT. A factory-fitted CNG option produces 70 hp and 102 Nm on the five-speed manual. Claimed economy is 23.80 kmpl for the manual and 24.77 kmpl for the AMT.",
      },
      {
        q: "Does the 2026 Baleno have driver assistance systems?",
        a: "Higher grades gain a Level 2 ADAS suite including adaptive cruise control, lane-keep assist, emergency braking and high-beam assist. That is unusually far down the price ladder for such equipment. Note that Level 2 systems need recalibration after a windscreen replacement or front-end repair, which is a service question in markets without a franchised network.",
      },
      {
        q: "Is a small Indian hatchback worth importing?",
        a: "Often not, and it depends entirely on your destination's tax bands. On an expensive vehicle duty and excise are a large fraction of a large number; on a cheap one they are frequently a larger fraction of a small number, because banded charges and fixed levies do not scale down. Run your own band before assuming the small car is the safe import.",
      },
      {
        q: "Can I import a factory CNG car?",
        a: "Check first. Compressed natural gas fuel systems carry their own certification and inspection requirements in several markets, and some will not register a factory CNG installation without local approval. Settle that with your destination authority before ordering, because it is a permission question rather than a price question.",
      },
    ],
    sources: [
      {
        label: "2026 Maruti Baleno facelift launched at Rs 6.10 lakh",
        href: "https://www.autocarindia.com/car-news/2026-maruti-baleno-facelift-launched-at-rs-610-lakh-440667",
        publisher: "Autocar India",
      },
      {
        label: "2026 Maruti Suzuki Baleno Facelift Launched",
        href: "https://www.autobics.com/2026/09/2026-maruti-suzuki-baleno-colors-price/",
        publisher: "Autobics",
      },
      {
        label: "Euro foreign exchange reference rates",
        href: "https://www.ecb.europa.eu/stats/policy_and_exchange_rates/euro_reference_exchange_rates/html/index.en.html",
        publisher: "European Central Bank",
      },
    ],
    relatedGuides: [
      "best-cars-to-import-from-india",
      "why-are-indian-manufactured-cars-cheaper",
      "importing-cars-from-india-for-dealers",
    ],
  },
  {
    slug: "bonhams-goodwood-revival-2026-auction-preview",
    title: "Bonhams brings a £700,000 DB4 to Goodwood on 19 September",
    h1: "Bonhams' Goodwood Revival Catalogue Has a Strong Top and a Thin Middle",
    seoTitle: "Bonhams Goodwood Revival 2026: Lots and Estimates",
    description:
      "Bonhams sells at Goodwood on 19 September 2026, headed by a 1962 Aston Martin DB4 SS Vantage Convertible at £700,000-£900,000. What last year's sale did.",
    excerpt:
      "Four lots above £350,000 and very little underneath them. That shape is the market rather than the catalogue, and it is what the indices have been reporting all year.",
    category: "Auctions",
    dateline: "Chichester, West Sussex",
    keywords: [
      "bonhams goodwood revival 2026 auction",
      "goodwood revival sale estimates",
      "aston martin db4 ss vantage convertible",
      "nissan p35 group c auction",
      "when is the bonhams goodwood revival sale",
      "classic car auction results goodwood",
    ],
    author: AUTHOR,
    publishDate: "2026-09-09",
    updatedDate: "2026-09-09",
    readingTimeMins: 8,
    heroImage: "/import-cars/gtr.webp",
    heroAlt:
      "A performance car, illustrating the collector and historic vehicle market",
    heroCaption:
      "Illustrative image. Not a photograph of any lot in the sale described in this article.",
    toc: [
      { id: "catalogue", label: "What is catalogued" },
      { id: "baseline", label: "What last year's sale did" },
      { id: "landed", label: "What a Goodwood result costs to land" },
      { id: "applies", label: "Does this apply to you?" },
      { id: "timing", label: "Move now or wait?" },
    ],
    faqs: [
      {
        q: "When is the Bonhams Goodwood Revival sale in 2026?",
        a: "Saturday 19 September 2026, starting at 10:30 BST at Goodwood Motor Circuit, Chichester, with viewing from 10:00 BST on Friday 18 September. Bonhams announced the sale in a press release on 3 September 2026. The total number of lots is not stated in that release.",
      },
      {
        q: "What is the top lot at Bonhams Goodwood Revival 2026?",
        a: "A 1962 Aston Martin DB4 SS Vantage Convertible, estimated at £700,000 to £900,000, with lightweight Superleggera aluminium bodywork and the SS 3.7-litre six-cylinder 266hp Vantage engine. Behind it sit a 1936 Aston Martin 2-litre 'Speed' at £500,000-£600,000, a 1993 Nissan P35 at £400,000-£500,000 and a 1991 Jordan-Ford 191 at £350,000-£525,000.",
      },
      {
        q: "What did the 2025 Goodwood Revival sale achieve?",
        a: "Bonhams offered 154 lots on 13 September 2025. The top result was an Aston Martin DB4GT Zagato Sanction III Coupé at £1,079,000 including premium, followed by a 1977 TOJ SC302 at £356,500, a 1951 Jaguar XK120 Competition Roadster at £316,250, a 1973 Ferrari 365 GTB/4 'Daytona' at £309,350 and a 1954 Aston Martin DB2/4 Drophead Coupé at £207,000.",
      },
      {
        q: "Is an auction estimate the same as what I will pay?",
        a: "No. Buyer's premium is charged on top of the hammer price on a published scale, and UK VAT treatment varies by lot — some cars are sold under a margin scheme, some carry VAT on the premium only, some are fully taxable. The 2025 results quoted here include premium; the 2026 estimates do not. Do not compare them as like for like.",
      },
      {
        q: "Do age limits stop me importing a classic car?",
        a: "Generally not, because age limits set a maximum age for modern imports rather than a minimum. What a historic car does not automatically clear is registration: several markets require an inspection, a certificate of conformity or an individual approval before a pre-1970 vehicle can go on the road. Settle admissibility before you settle on a car.",
      },
    ],
    sources: [
      {
        label:
          "Bonhams brings some of the Rarest Collector Cars and Historic Racers to Goodwood Revival Sale",
        href: "https://motorsportsnewswire.com/2026/09/03/start-your-engines-bonhams-brings-some-of-the-rarest-collector-cars-and-historic-racers-to-goodwood-revival-sale/",
        publisher: "Motor Sports NewsWire",
      },
      {
        label: "Goodwood Revival: Collectors' Motor Cars and Automobilia",
        href: "https://cars.bonhams.com/auction/30544/goodwood-revival-collectors-motor-cars-and-automobilia/",
        publisher: "Bonhams Cars",
      },
      {
        label: "Bonhams Car Auction — Goodwood Revival",
        href: "https://www.goodwood.com/motorsport/goodwood-revival/explore/bonhams-auction/",
        publisher: "Goodwood",
      },
      {
        label: "Euro foreign exchange reference rates",
        href: "https://www.ecb.europa.eu/stats/policy_and_exchange_rates/euro_reference_exchange_rates/html/index.en.html",
        publisher: "European Central Bank",
      },
    ],
    relatedGuides: [
      "best-cars-to-import-from-the-uk",
      "cost-to-import-a-car-from-the-uk",
      "uk-car-export-documents-explained",
    ],
  },
  {
    slug: "collector-car-market-15-year-low-2026-not-a-buy-signal",
    title:
      "The collector market is at a 15-year low. That is not a reason to buy",
    h1: "A Fifteen-Year-Low Index Is Not the Same Thing as a Cheap Car",
    seoTitle: "Classic Car Market 2026: Why a Low Index Is Not a Buy",
    description:
      "Hagerty's Market Rating hit 58.28 in January 2026, its lowest in nearly 15 years, and has fallen in 37 of 43 months. Why that does not reach your driveway.",
    excerpt:
      "A reading between 50 and 60 is Hagerty's own flat-market band. A flat market and a falling market require opposite decisions, and most coverage runs them together.",
    category: "Auctions",
    dateline: "London",
    keywords: [
      "classic car market 2026 values",
      "hagerty market rating 2026",
      "are classic car prices falling",
      "importing a classic car costs",
      "is now a good time to buy a classic car",
      "collector car market index",
    ],
    author: AUTHOR,
    publishDate: "2026-09-09",
    updatedDate: "2026-09-09",
    readingTimeMins: 9,
    heroImage:
      "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?q=80&w=2400&auto=format&fit=crop",
    heroAlt: "A classic car, illustrating the collector vehicle market",
    heroCaption:
      "Illustrative image. Not a photograph of any vehicle, index constituent or transaction referred to in this article.",
    toc: [
      { id: "what-the-index-says", label: "What the index actually says" },
      { id: "top-vs-middle", label: "Strong top, soft middle" },
      { id: "landed", label: "Why a fall does not reach your driveway" },
      { id: "dont-buy", label: "The case for not buying" },
      { id: "applies", label: "Does this apply to you?" },
      { id: "timing", label: "Move now or wait?" },
    ],
    faqs: [
      {
        q: "Are classic car prices falling in 2026?",
        a: "Hagerty's Market Rating reached 58.28 in January 2026, reported as the lowest reading in nearly fifteen years, and has declined in 37 of the 43 months since its summer 2022 peak. Hagerty described the rating as still near a fifteen-year low in July 2026. A reading between 50 and 60 is Hagerty's own flat-market territory rather than a crash.",
      },
      {
        q: "Why do record auction results keep happening if the market is down?",
        a: "Because the top and the middle are different markets. A handful of exceptional cars with unrepeatable histories continue to find buyers at any level, because those bidders are not price-sensitive. The broad middle, where most enthusiasts actually transact, has been cooling for three years. A headline result is therefore almost useless as a signal for the car you are considering.",
      },
      {
        q: "Does a fall in classic values reduce what an import costs me?",
        a: "Only on one line. A 10% fall in a car's value reduces the purchase price by 10%. Ocean freight does not fall, marine cover does not fall, and in markets where registration tax is assessed on an authority's own valuation rather than your invoice, the tax does not fall either. Ireland's VRT, Kenya's assessed value and Hong Kong's first registration tax all work this way.",
      },
      {
        q: "Is a soft classic market a good time to buy?",
        a: "Only if you want the specific car, intend to keep it, have confirmed your destination will register it, and the landed figure works at today's number rather than one you are hoping for. A flat market has no urgency in it, so anyone telling you to move before the bottom passes is describing a market shape the data does not show.",
      },
      {
        q: "What actually ruins a classic import?",
        a: "Not overpaying by ten per cent. It is a car that cannot be registered, or that needs an individual approval nobody costed. Condition risk also rises in soft markets, because owners stop spending on cars that are not appreciating — so the cheap car in a weak market is disproportionately likely to be the neglected one.",
      },
    ],
    sources: [
      {
        label: "Hagerty Collector Car Market Rating Sinks to 15-Year Low",
        href: "https://www.hagerty.com/media/market-trends/hagerty-insider/hagerty-collector-car-market-rating-sinks-to-15-year-low/",
        publisher: "Hagerty",
      },
      {
        label: "Monthly Hagerty Market Report: July 2026",
        href: "https://www.hagerty.com/media/market-trends/hagerty-insider/hagerty-market-rating/monthly-hagerty-market-report-july-2026/",
        publisher: "Hagerty",
      },
      {
        label:
          "The 2026 Collector Car Market Has a Strong Top End, But a Soft Underbelly",
        href: "https://www.hagerty.com/media/market-trends/hagerty-insider/the-2026-collector-car-market-has-a-strong-top-end-but-a-soft-underbelly/",
        publisher: "Hagerty",
      },
      {
        label:
          "Hagerty Market Rating Falls to Lowest Level in Nearly 15 Years as Collector Car Values Continue to Slide",
        href: "https://finance.yahoo.com/news/hagerty-market-rating-falls-lowest-160059779.html",
        publisher: "Yahoo Finance",
      },
    ],
    relatedGuides: [
      "uk-car-history-checks-explained",
      "best-cars-to-import-from-the-uk",
      "cost-to-import-a-car-from-the-uk",
    ],
  },
  {
    slug: "jlr-4000-job-cuts-2026-uk-sourcing-read",
    title:
      "JLR is cutting 4,000 jobs. Here is what it does to a UK-sourced Land Rover",
    h1: "JLR Confirmed 4,000 Job Cuts — the Number That Matters to a Buyer Is 300,000",
    seoTitle: "JLR Job Cuts 2026: The UK Land Rover Sourcing Read",
    description:
      "JLR confirmed 4,000 job cuts on 7 September 2026, targeting £1.7bn of savings. What an underloaded plant network means if you import Land Rovers from Britain.",
    excerpt:
      "Cutting 4,000 non-production roles is a cost story. Setting breakeven towards 300,000 vehicles is a volume story, and volume is the half an importer actually feels.",
    category: "Industry",
    dateline: "Coventry, West Midlands",
    keywords: [
      "jlr job cuts 2026",
      "jaguar land rover restructuring",
      "importing a land rover from the uk",
      "jlr solihull halewood production",
      "will land rover prices fall",
      "what do jlr job cuts mean for buyers",
    ],
    author: AUTHOR,
    publishDate: "2026-09-08",
    updatedDate: "2026-09-08",
    readingTimeMins: 9,
    heroImage: "/country/united-kingdom.webp",
    heroAlt:
      "A British street scene, illustrating the United Kingdom as a vehicle sourcing market",
    heroCaption:
      "Illustrative image of the United Kingdom. Not a photograph of any JLR facility or vehicle referred to in this article.",
    toc: [
      { id: "what-was-announced", label: "What was announced" },
      { id: "volume", label: "The number that matters to a buyer" },
      { id: "residual", label: "The residual question" },
      { id: "applies", label: "Does this apply to you?" },
      { id: "timing", label: "Move now or wait?" },
    ],
    faqs: [
      {
        q: "How many jobs is JLR cutting and why?",
        a: "Around 4,000 roles over two years, confirmed on 7 September 2026, targeting £1.7 billion of savings over the same period. CEO PB Balaji framed it as strengthening long-term competitiveness. Reporting attributes the pressure to competition from cheaper Chinese manufacturers, United States tariffs and the cost of the electric transition, with a cyberattack cited in some coverage as part of the recent context.",
      },
      {
        q: "Will JLR job cuts affect production or delivery dates?",
        a: "The cuts are understood to be non-production roles, concentrated at the UK head office, and spread across two years rather than taken at once. That makes a short-term movement in build volume unlikely. If your delivery date does move, ask which line and why rather than assuming this announcement is the cause.",
      },
      {
        q: "When does JLR's voluntary redundancy window close?",
        a: "4 October. JLR is seeking the reduction through voluntary redundancy first, with compulsory redundancies on less generous terms available afterwards if targets are not met. That date belongs to JLR employees rather than to customers, and it is the only firm deadline in this story.",
      },
      {
        q: "Will used Land Rover values fall because of this?",
        a: "Nobody knows, including us. Corporate restructuring is not a reliable predictor of used values in either direction — a manufacturer cutting cost can emerge with better margins and stronger residuals, or it can thin its dealer and parts network in ways that hurt them. Watch your local parts and service position rather than the headcount number.",
      },
      {
        q: "Does this change anything about importing a used Land Rover from the UK?",
        a: "No. Admissibility, VAT treatment and the NOVA and DVLA processes are unchanged. This is a corporate story rather than a regulatory one. If a specific derivative becomes hard to source out of Britain, the alternatives are a Japanese-market equivalent or a Gulf-specification car from the UAE — neither of which is a like-for-like substitute.",
      },
    ],
    sources: [
      {
        label:
          "Jaguar Land Rover to cut 4,000 jobs as European car sector hits skids",
        href: "https://www.bnnbloomberg.ca/business/company-news/2026/09/07/jaguar-land-rover-to-cut-4000-jobs-as-european-car-sector-hits-skids/",
        publisher: "BNN Bloomberg",
      },
      {
        label: "JLR cuts 4000 jobs to fix an underloaded plant network",
        href: "https://www.automotivemanufacturingsolutions.com/strategy/jlr-cuts-4000-jobs-to-fix-an-underloaded-plant-network/2732928",
        publisher: "Automotive Manufacturing Solutions",
      },
      {
        label:
          "Jaguar Land Rover confirms 4,000 jobs to be cut over next two years",
        href: "https://paultan.org/2026/09/09/jaguar-land-rover-4000-job-cuts-over-next-two-years/",
        publisher: "Paul Tan's Automotive News",
      },
      {
        label:
          "Jaguar Land Rover to cut thousands of jobs in cost-saving drive",
        href: "https://www.cnbc.com/2026/09/07/jaguar-land-rover-jlr-job-cuts-autos.html",
        publisher: "CNBC",
      },
    ],
    relatedGuides: [
      "how-to-import-a-car-from-the-uk",
      "cost-to-import-a-car-from-the-uk",
      "registering-an-imported-car-in-the-uk",
    ],
  },
  {
    slug: "changan-rayong-right-hand-drive-thailand-export-base",
    title:
      "Changan builds right-hand drive in Rayong, and that changes your options",
    h1: "A Chinese Manufacturer Is Building Right-Hand-Drive Cars in a Market We Buy In",
    seoTitle: "Chinese Cars Built Right-Hand Drive in Thailand",
    description:
      "Changan's Rayong plant has been building right-hand-drive cars since May 2025, with capacity rising to 200,000 by 2027. What a new RHD source corridor means.",
    excerpt:
      "Thailand has spent forty years as Japan's right-hand-drive factory. A year into Changan's Rayong output, it is becoming China's as well — which widens the supply base for every RHD destination.",
    category: "Industry",
    dateline: "Rayong, Thailand",
    keywords: [
      "chinese cars right hand drive thailand",
      "changan rayong plant",
      "deepal s05 right hand drive",
      "importing chinese cars from thailand",
      "where are chinese right hand drive cars built",
      "should dealers stock chinese evs",
    ],
    author: AUTHOR,
    publishDate: "2026-09-07",
    updatedDate: "2026-09-07",
    readingTimeMins: 9,
    heroImage:
      "https://images.unsplash.com/photo-1663852408695-f57f4d75a536?q=80&w=2400&auto=format&fit=crop",
    heroAlt:
      "An electric vehicle charging, illustrating Chinese electric vehicle manufacturing and export",
    heroCaption:
      "Illustrative image. Not a photograph of the Changan facility or any vehicle referred to in this article.",
    toc: [
      { id: "the-plant", label: "What has been built" },
      { id: "why-thailand", label: "Why Thailand, and why it matters" },
      { id: "dealer", label: "The dealer read" },
      { id: "applies", label: "Does this apply to you?" },
      { id: "timing", label: "Move now or wait?" },
    ],
    faqs: [
      {
        q: "Where do Chinese manufacturers build right-hand-drive cars?",
        a: "Increasingly in Thailand. Changan's Rayong plant began production on 16 May 2025 with a right-hand-drive Deepal S05 as its first vehicle, on a site of about 600 acres in WHA Eastern Seaboard Industrial Estate 4. The plant's stated coverage is the whole of ASEAN plus the global right-hand-drive market.",
      },
      {
        q: "How big is Changan's Thai plant?",
        a: "Initial annual capacity is 100,000 units, planned to expand to 200,000 in 2027, on a reported investment of about 10 billion baht or roughly US$320 million. Construction began in November 2023. Changan targets 68% localisation at the plant, rising to a stated 80% by 2028. Capacity is nameplate rather than actual output.",
      },
      {
        q: "Why has Changan chosen Thailand as an export base?",
        a: "Thailand already has what a Chinese manufacturer entering right-hand-drive markets most needs and cannot buy quickly: a mature supplier base, ports built for vehicle export, free trade agreements across ASEAN and Oceania, and four decades of institutional knowledge about building cars with the steering wheel on the right.",
      },
      {
        q: "Should a dealer stock Thai-built Chinese electric cars?",
        a: "The buy case is specification per pound and a well-served freight route. The risk is residual, and it is not measurable yet, because these brands have no depreciation history in most of our destination markets. Settle the parts, battery service and software support questions before committing stock, not afterwards.",
      },
      {
        q: "Does this compete with Thai-built pickups?",
        a: "Yes, for plant capacity, suppliers and port slots. Thai combustion output has been falling faster than electric output has been rising, and Chinese capacity expansion is part of why. If your business is Thai-built diesel pickups, this expansion is not neutral to you — it is one reason your corridor is tightening.",
      },
    ],
    sources: [
      {
        label: "Chinese carmaker Changan opens Thailand plant",
        href: "https://english.news.cn/20250517/a3534d6f8cfb43e6bc4f54bb7c3d4640/c.html",
        publisher: "Xinhua",
      },
      {
        label:
          "Changan opens its first full-fledged overseas NEV plant in Thailand",
        href: "https://www.electrive.com/2025/05/19/changan-opens-its-first-full-fledged-overseas-nev-plant-in-thailand/",
        publisher: "electrive",
      },
      {
        label:
          "Changan Thailand plant ships 1st batch of export cars to Europe",
        href: "https://cnevpost.com/2025/12/27/changan-thailand-plant-ships-1st-export-cars-europe/",
        publisher: "CnEVPost",
      },
      {
        label:
          "Chinese Automakers to Target Wealthy Buyers in Right-Hand-Drive Markets",
        href: "https://chinaglobalsouth.com/2026/06/18/china-ev-brands-wealthy-right-hand-drive-markets/",
        publisher: "China Global South Project",
      },
    ],
    relatedGuides: [
      "best-pickups-to-import-from-thailand",
      "how-to-import-a-car-from-thailand",
      "thailand-vs-japan-for-pickup-imports",
    ],
  },
  {
    slug: "eu-end-of-life-vehicles-regulation-used-car-exports-2031",
    title:
      "Europe's new vehicle rules put a roadworthiness test on exports from 2031",
    h1: "The EU End-of-Life Vehicles Regulation Is Not a Used-Car Export Ban",
    seoTitle: "EU Used Car Export Rules: Roadworthy Only From 2031",
    description:
      "Regulation (EU) 2026/1738 entered into force on 13 August 2026. From 1 September 2031 only roadworthy vehicles may be exported from the EU. What it changes.",
    excerpt:
      "The rule does not say fewer cars may leave Europe. It says the ones that leave must be able to drive — and roadworthy used vehicles can continue to be exported as normal.",
    category: "Industry",
    dateline: "Brussels",
    keywords: [
      "eu used car export ban 2031 roadworthy",
      "end of life vehicles regulation 2026/1738",
      "exporting used cars from the eu",
      "eu elv regulation recycled content",
      "can you still export used cars from europe",
      "when does the eu export rule start",
    ],
    author: AUTHOR,
    publishDate: "2026-09-09",
    updatedDate: "2026-09-09",
    readingTimeMins: 8,
    heroImage: "/country/ireland.webp",
    heroAlt:
      "An Irish coastal road, illustrating EU member state vehicle markets",
    heroCaption:
      "Illustrative image of Ireland. Not a photograph of any vehicle or export process referred to in this article.",
    toc: [
      { id: "what-it-says", label: "What the Regulation restricts" },
      { id: "who-it-hits", label: "Who this actually reaches" },
      { id: "landed", label: "What it does to a landed cost" },
      { id: "destination-rules", label: "Your market may already do this" },
      { id: "timing", label: "Move now or wait?" },
    ],
    faqs: [
      {
        q: "Is the EU banning used car exports?",
        a: "No. Regulation (EU) 2026/1738 provides that from 1 September 2031, only roadworthy vehicles may be exported outside the EU. The European Commission's own description states that roadworthy used vehicles can continue to be exported as normal. The measure targets end-of-life vehicles being sent abroad papered as second-hand cars, not the used-car trade itself.",
      },
      {
        q: "When did the EU End-of-Life Vehicles Regulation take effect?",
        a: "The Council adopted it on 29 June 2026, it was published in the Official Journal on 24 July 2026, and it entered into force on 13 August 2026. It replaces Directive 2000/53/EC and the 3R Type-Approval Directive 2005/64/EC. Its core obligations apply from 1 September 2028, extended producer responsibility from 1 September 2029, the export condition from 1 September 2031, and the digital circularity vehicle passport from 1 September 2032.",
      },
      {
        q: "Does this apply to cars exported from the United Kingdom?",
        a: "No. Britain left the European Union and this Regulation does not bind it. A used car exported from the UK to Kenya, Jamaica or New Zealand is governed by UK rules. If someone quotes Regulation (EU) 2026/1738 at you on a British car, they have the jurisdiction wrong.",
      },
      {
        q: "Will this raise import costs in Africa or the Caribbean?",
        a: "Not before 1 September 2031, and it creates no duty, levy or charge on an importer at any point. From 2031 the mechanism is indirect: removing the non-roadworthy tail of the EU export flow raises the average quality, and therefore the average price, of what leaves. For buyers of roadworthy stock that is close to neutral.",
      },
      {
        q: "What recycled content does the Regulation require?",
        a: "New vehicles must contain at least 15% recycled plastic from 2032, rising to 25% from 2036. That is a manufacturer obligation rather than an importer one, and it will show up in vehicle specification before the export clause takes effect. For a buyer inside the EU it is the nearer of the two deadlines.",
      },
    ],
    sources: [
      {
        label: "New rules for a more circular European automotive sector",
        href: "https://environment.ec.europa.eu/news/new-rules-more-circular-european-automotive-sector-2026-08-12_en",
        publisher: "European Commission",
      },
      {
        label: "End-of-life vehicles Regulation",
        href: "https://environment.ec.europa.eu/topics/waste-and-recycling/end-life-vehicles/end-life-vehicles-regulation_en",
        publisher: "European Commission",
      },
      {
        label:
          "From 13 August 2026, new EU rules on the end-of-life treatment of cars",
        href: "https://en.ilsole24ore.com/art/warranty-on-recycled-parts-reuse-and-scrapping-latest-news-on-end-of-life-vehicles-AJC5i9k",
        publisher: "Il Sole 24 Ore",
      },
      {
        label: "EU end-of-life vehicle regulation takes effect",
        href: "https://www.just-auto.com/news/eu-end-of-life-vehicle-regulation-takes-effect/",
        publisher: "Just Auto",
      },
    ],
    relatedGuides: [
      "importing-cars-to-ireland",
      "import-car-from-japan-or-uk-to-ireland",
      "cheapest-way-to-import-a-car-to-ireland",
    ],
  },
  {
    slug: "new-zealand-clean-car-standard-2026-used-import-charges",
    title:
      "New Zealand kept the Clean Car Standard and cut the charge to NZ$7.50 a gram",
    h1: "New Zealand's Clean Car Standard Survived Its Review, at a Quarter of the Old Charge",
    seoTitle: "Clean Car Standard 2026: NZ$7.50 a Gram on Used Imports",
    description:
      "New Zealand cut Clean Car Standard charges to NZ$7.50 a gram on used imports from 1 January 2026 and confirmed on 21 August it will keep the scheme to 2028.",
    excerpt:
      "The used-import charge fell from NZ$33.75 to NZ$7.50 a gram. On a vehicle 50 grams over target that is NZ$1,312.50 back — and the reduced rates have a stated end date.",
    category: "Policy & Tax",
    dateline: "Wellington",
    keywords: [
      "clean car standard 2026 used import charge",
      "new zealand clean car standard changes",
      "importing a car to new zealand 2026",
      "nz co2 charge used vehicle imports",
      "how much is the clean car standard charge",
      "is new zealand scrapping the clean car standard",
    ],
    author: AUTHOR,
    publishDate: "2026-09-07",
    updatedDate: "2026-09-07",
    readingTimeMins: 9,
    heroImage: "/country/new-zealand.webp",
    heroAlt:
      "New Zealand landscape, illustrating the New Zealand vehicle import market",
    heroCaption:
      "Illustrative image of New Zealand. Not a photograph of any vehicle or certification process referred to in this article.",
    toc: [
      { id: "what-changed", label: "What changed, and when" },
      { id: "landed", label: "What it does to a landed number" },
      { id: "applies", label: "Does this apply to you?" },
      { id: "legal", label: "Is your car still legal to import?" },
      { id: "timing", label: "Move now or wait?" },
    ],
    faqs: [
      {
        q: "How much is the Clean Car Standard charge in New Zealand?",
        a: "From 1 January 2026, used imported vehicles over the CO2 target are charged NZ$7.50 per gram, reduced from NZ$33.75. New vehicles are charged NZ$15 per gram, reduced from NZ$67.50. The reduced rates apply through 2026 and 2027. Confirm your vehicle's applicable CO2 target with NZTA rather than relying on a published figure.",
      },
      {
        q: "Is New Zealand scrapping the Clean Car Standard?",
        a: "No. On 21 August 2026 the Government confirmed it will retain the standard. Transport Minister Chris Bishop said removing it would be highly disruptive for an industry that has accumulated credits and charges over time. New settings will be developed with the motor industry and take effect on 1 January 2028, with officials reporting back in early 2027.",
      },
      {
        q: "Will used and new imports have the same CO2 target?",
        a: "Not from 2028. The Government has said different targets will be set for used versus new vehicle imports, to reflect the older technology in the used fleet. What those targets will be has explicitly not been decided, so anyone quoting you a 2028 figure is guessing.",
      },
      {
        q: "How much does the charge cut save on a used import?",
        a: "It scales linearly with how far over target the vehicle sits. On a vehicle 20 grams over target the charge falls from NZ$675 to NZ$150. On one 50 grams over, from NZ$1,687.50 to NZ$375 — a saving of NZ$1,312.50. On a small efficient hatchback close to or under target, the charge was never material and the cut changes little.",
      },
      {
        q: "Does the Clean Car Standard stop a car being imported?",
        a: "No. It is a charge rather than a bar — it prices emissions rather than prohibiting them. Admissibility in New Zealand is governed separately, through entry certification, frontal-impact standards, biosecurity inspection and the applicable emissions standard for the vehicle's market of origin. Confirm those with NZTA before committing.",
      },
    ],
    sources: [
      {
        label:
          "Govt to keep Labour's clean car standard for high-emission vehicle imports",
        href: "https://www.1news.co.nz/2026/08/21/govt-to-keep-labours-clean-car-standard-for-high-emission-vehicle-imports/",
        publisher: "1News",
      },
      {
        label: "Easing the cost of new and used imported vehicles",
        href: "https://www.beehive.govt.nz/release/easing-cost-new-and-used-imported-vehicles",
        publisher: "New Zealand Government (Beehive)",
      },
      {
        label: "Clean Car Standard under review, import charges lowered",
        href: "https://www.1news.co.nz/2025/11/17/clean-car-standard-under-review-import-charges-lowered/",
        publisher: "1News",
      },
      {
        label: "NZ Clean Vehicle Standard charges cut to protect consumers",
        href: "https://afma.org.au/nz-clean-vehicle-standard-charges-cut-to-protect-consumers/",
        publisher: "Australasian Fleet Management Association",
      },
    ],
    relatedGuides: [
      "how-to-import-a-car-from-new-zealand",
      "importing-a-used-ev-from-new-zealand",
      "new-zealand-vs-japan-for-used-imports",
    ],
  },
  {
    slug: "kenya-crsp-used-car-valuation-uncertainty-2026",
    title:
      "Kenya's used-car tax base is still contested, and we could not confirm which list is live",
    h1: "Kenya Taxes Imported Cars on a Schedule, Not Your Invoice — and the Schedule Is in Dispute",
    seoTitle: "Kenya CRSP 2026: The Used-Car Tax Base Is Still Contested",
    description:
      "Kenya assesses imported used cars on a depreciated CRSP schedule. The 2025 revision was suspended by the High Court. We could not confirm which list is live.",
    excerpt:
      "It would be straightforward to produce a plausible Kenyan duty calculation and present it confidently. A wrong tax figure on a car someone is about to buy is worse than no figure.",
    category: "Policy & Tax",
    dateline: "Nairobi",
    keywords: [
      "kenya crsp used car import duty 2026",
      "kra current retail selling price schedule",
      "importing a car to kenya duty 2026",
      "kenya used car valuation court case",
      "how does kra calculate import duty on used cars",
      "what is crsp in kenya",
    ],
    author: AUTHOR,
    publishDate: "2026-09-09",
    updatedDate: "2026-09-09",
    readingTimeMins: 9,
    heroImage: "/country/kenya.webp",
    heroAlt: "Kenyan landscape, illustrating the Kenyan vehicle import market",
    heroCaption:
      "Illustrative image of Kenya. Not a photograph of any vehicle, valuation or clearance process referred to in this article.",
    toc: [
      { id: "mechanism", label: "How the Kenyan tax base works" },
      { id: "the-revision", label: "The revision, and the challenge" },
      { id: "unknown", label: "What we could not establish" },
      { id: "what-to-do", label: "What an importer should do" },
      { id: "applies", label: "Does this apply to you?" },
      { id: "timing", label: "Move now or wait?" },
    ],
    faqs: [
      {
        q: "How does Kenya calculate import duty on a used car?",
        a: "The Kenya Revenue Authority calculates the customs value of a used motor vehicle by applying depreciation to the Current Retail Selling Price, based on the number of years since the date of manufacture or the year of first registration. Duty, excise and VAT are then assessed on that customs value rather than on the price you actually paid.",
      },
      {
        q: "What is the CRSP in Kenya?",
        a: "The Current Retail Selling Price is the benchmark retail price of a brand-new vehicle of that model in Kenya, published by the Kenya Revenue Authority as a schedule. It is the starting point for customs valuation of used imports. Because it is a schedule rather than a receipt, two identical cars bought at different prices attract broadly the same assessment.",
      },
      {
        q: "Which CRSP schedule is Kenya using now?",
        a: "We could not confirm this from any source we would publish, and we are not guessing. A revised schedule was notified on 30 May 2025 for application from 1 July 2025, and its implementation was suspended by the High Court following a petition by the Car Importers Association of Kenya alleging inadequate public participation. Ask your clearing agent which schedule they are using.",
      },
      {
        q: "Does negotiating a lower price reduce my Kenyan import tax?",
        a: "Not proportionally. The assessment derives from a published schedule and applied depreciation, not from your invoice. Negotiating hard at auction improves your margin and does relatively little to your tax. Choosing the right model, year and engine capacity is where the tax outcome is actually decided.",
      },
      {
        q: "How should a Kenyan dealer price forward orders right now?",
        a: "With a stated valuation assumption. Until the position settles, any quotation should say which schedule it assumes, because that is the largest single variable in the deal. Keeping exposure short — smaller consignments and firmer clearing timelines — is more defensible than committing deep stock against an unresolved tax base.",
      },
    ],
    sources: [
      {
        label: "Current Retail Selling Price (CRSP) for Used Motor Vehicles",
        href: "https://www.kra.go.ke/news-center/public-notices/2223-current-retail-selling-price-crsp-for-used-motor-vehicles",
        publisher: "Kenya Revenue Authority",
      },
      {
        label:
          "Clarification on Implementation of Revised Current Retail Selling Price (CRSP) List",
        href: "https://www.kra.go.ke/news-center/press-release/2224-clarification-on-implementation-of-revised-current-retail-selling-price-crsp-list-for-used-motor-vehicles",
        publisher: "Kenya Revenue Authority",
      },
      {
        label: "Court suspends KRA's new tax calculator for used vehicles",
        href: "https://www.businessdailyafrica.com/bd/economy/court-suspends-kra-s-new-tax-calculator-for-used-vehicles-5101042",
        publisher: "Business Daily Africa",
      },
      {
        label: "Forex Exchange Rates",
        href: "https://www.centralbank.go.ke/rates/forex-exchange-rates/",
        publisher: "Central Bank of Kenya",
      },
    ],
    relatedGuides: [
      "how-to-buy-a-car-at-japanese-auction",
      "japanese-auction-grades-explained",
      "cost-to-import-a-car-from-japan",
    ],
  },
  {
    slug: "uk-eved-pay-per-mile-2028-ev-import-read",
    title: "Britain's 3p-a-mile EV charge starts in April 2028",
    h1: "The UK Confirmed a 3p-a-Mile Charge on Electric Cars — and It Does Not Follow the Export",
    seoTitle: "UK eVED 2028: 3p a Mile, and the EV Import Read",
    description:
      "The UK confirmed eVED on 13 July 2026 at 3p a mile for EVs and 1.5p for PHEVs from 1 April 2028. Why it does not follow an exported car, but reaches its price.",
    excerpt:
      "eVED is a charge on driving in Britain and it stops at the port. What reaches an importer is the second-order effect on what British buyers will pay for a used EV.",
    category: "Policy & Tax",
    dateline: "London",
    keywords: [
      "eved pay per mile electric car uk",
      "uk electric vehicle excise duty 2028",
      "uk ev road tax per mile",
      "importing a used ev from the uk",
      "how much is the uk pay per mile ev tax",
      "does eved apply to exported cars",
    ],
    author: AUTHOR,
    publishDate: "2026-09-10",
    updatedDate: "2026-09-10",
    readingTimeMins: 9,
    heroImage: "/import-cars/bmw.webp",
    heroAlt:
      "A modern car, illustrating the United Kingdom used vehicle market",
    heroCaption:
      "Illustrative image. Not a photograph of any vehicle or taxation process referred to in this article.",
    toc: [
      { id: "what-was-confirmed", label: "What was confirmed" },
      { id: "cost", label: "What it costs a British driver" },
      { id: "import-read", label: "The part that matters to an importer" },
      { id: "applies", label: "Does this apply to you?" },
      { id: "timing", label: "Move now or wait?" },
    ],
    faqs: [
      {
        q: "How much is the UK's pay-per-mile tax on electric cars?",
        a: "Electric Vehicle Excise Duty is charged at 3 pence per mile for battery-electric cars and 1.5 pence per mile for plug-in hybrids, from 1 April 2028. The rates were confirmed as final in the Government's consultation response published on 13 July 2026, and rise in line with the Consumer Prices Index from the 2029-30 tax year.",
      },
      {
        q: "What does eVED cost at typical annual mileage?",
        a: "At 3 pence a mile, a battery-electric car covering 8,500 miles a year attracts £255, 10,000 miles attracts £300 and 15,000 miles attracts £450. A plug-in hybrid at 1.5 pence a mile attracts half those figures. Standard Vehicle Excise Duty is charged separately and in addition, and its 2028-29 level has not been set.",
      },
      {
        q: "Does eVED apply to a car exported out of the UK?",
        a: "No. It is a charge on driving on British roads and it stops at the port. Nobody will bill you 3 pence a mile in Nairobi or Auckland. What does reach an importer is the second-order effect: a new annual running cost applied to a whole category of vehicle is downward pressure on what British buyers will pay for it.",
      },
      {
        q: "Will eVED make used British electric cars cheaper to import?",
        a: "The mechanism points that way but we are not forecasting a discount. UK used EV prices are moved by lease-return supply, battery health perception, ZEV mandate effects on new-car discounting and finance rates — several of which are larger than a 3 pence charge starting in eighteen months. Do not build a purchase plan on it.",
      },
      {
        q: "How is eVED different from the ZEV mandate?",
        a: "The ZEV mandate places an obligation on manufacturers to sell a rising proportion of zero-emission vehicles, shaping what is available and at what discount. eVED places a charge on the person driving one, shaping what it costs to run. They are separate mechanisms and are frequently confused.",
      },
      {
        q: "What is the nearest EV deadline for an importer?",
        a: "Ireland, not Britain. Ireland's VRT relief of up to €5,000 for qualifying new EVs with an OMSP under €40,000 is legislated to 31 December 2026, and registration — not order, not shipping — must happen by then. That is fifteen months nearer than eVED and it is worth real money.",
      },
    ],
    sources: [
      {
        label:
          "The introduction of Electric Vehicle Excise Duty (eVED): government response",
        href: "https://assets.publishing.service.gov.uk/media/6a5117eda4890e65cce64d2f/eVED_Government_Consultation_Response.pdf",
        publisher: "GOV.UK (HM Treasury)",
      },
      {
        label: "Electric Vehicle Excise Duty (eVED)",
        href: "https://www.gov.uk/government/publications/electric-vehicle-excise-duty-eved/electric-vehicle-excise-duty-eved",
        publisher: "GOV.UK",
      },
      {
        label:
          "Consultation on the Introduction of Electric Vehicle Excise Duty (eVED)",
        href: "https://www.gov.uk/government/consultations/consultation-on-the-introduction-of-electric-vehicle-excise-duty-eved",
        publisher: "GOV.UK",
      },
      {
        label: "Electric vehicle excise duty (eVED)",
        href: "https://commonslibrary.parliament.uk/research-briefings/cbp-10607/",
        publisher: "House of Commons Library",
      },
    ],
    relatedGuides: [
      "how-to-import-a-car-from-the-uk",
      "registering-an-imported-car-in-the-uk",
      "uk-car-history-checks-explained",
    ],
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
