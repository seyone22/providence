// ─────────────────────────────────────────────────────────────────────────────
// Latest News registry — single source of truth for every published news piece.
//
// Deliberately separate from src/config/blog.ts. The blog is evergreen how-to
// content organised into keyword clusters; news is dated, event-driven
// reporting that ages. Different index page, different schema type
// (NewsArticle rather than BlogPosting), different sitemap cadence.
//
// Article BODIES live in src/content/news/<slug>.tsx and are mapped by slug in
// src/content/news/index.ts. This file holds only the metadata.
// ─────────────────────────────────────────────────────────────────────────────

import type { BlogFAQ, BlogTocItem } from "./blog";

export type NewsCategory =
  | "Auctions"
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
  /** Pin to the top of the index regardless of date. */
  isFeatured?: boolean;
};

const AUTHOR = "Providence Auto";

export const NEWS_ARTICLES: NewsArticle[] = [
  {
    slug: "ferrari-luce-chassis-0-40-million-auction",
    isFeatured: true,
    title: "The $40m Ferrari Luce: how a €550,000 EV sold for 62x list",
    h1: "The $40 Million Ferrari Luce: Why Chassis 0 Sold for 62 Times List Price — and Who Bought It",
    seoTitle:
      "Ferrari Luce Chassis 0 Sells for $40 Million: Price Breakdown, Why It Went So High & Who Bought It",
    description:
      "Ferrari's first electric car, Luce chassis 0, sold for $40,000,000 at RM Sotheby's Monterey — 36x its estimate and 62x its list price. A full breakdown of the price against every comparable record, the six reasons it went so high, and what is actually known about the anonymous buyer.",
    excerpt:
      "Ferrari's most criticised car just set the record for the most expensive new car ever auctioned. We break the $40m down against every comparable sale, explain the six forces behind it, and separate what is known about the buyer from what is rumour.",
    category: "Auctions",
    dateline: "Monterey, California",
    keywords: [
      "ferrari luce auction",
      "ferrari luce chassis 0",
      "ferrari luce price",
      "most expensive new car ever sold at auction",
      "rm sothebys monterey 2026",
      "most expensive electric car",
      "ferrari foundation charity auction",
    ],
    author: AUTHOR,
    publishDate: "2026-08-17",
    updatedDate: "2026-08-17",
    readingTimeMins: 9,
    // The actual subject car, photographed at the sale. CC BY-SA 4.0, so the
    // attribution in heroCaption is a licence condition, not a nicety.
    heroImage:
      "https://upload.wikimedia.org/wikipedia/commons/4/49/Ferrari_Luce.jpg",
    heroAlt:
      "Ferrari Luce chassis 0 on display at the RM Sotheby's Monterey auction, finished in one-off Madreperla Semi-Gloss paint",
    heroCaption:
      "Ferrari Luce chassis 0 at RM Sotheby's Monterey, 15 August 2026. Photo by Lcaa9, licensed under CC BY-SA 4.0 via Wikimedia Commons.",
    toc: [
      { id: "what-happened", label: "What actually happened" },
      { id: "the-price", label: "The price, in context" },
      { id: "records", label: "How it compares to every record" },
      { id: "why-so-high", label: "Why it went so high" },
      { id: "who-bought-it", label: "Who bought it" },
      { id: "not-a-market-price", label: "What this is not" },
      { id: "what-it-means", label: "What it means for buyers" },
      { id: "faqs", label: "FAQs" },
    ],
    faqs: [
      {
        q: "How much did the Ferrari Luce sell for at auction?",
        a: "Ferrari Luce chassis 0 sold for $40,000,000 at RM Sotheby's Monterey auction on 15 August 2026. RM Sotheby's waived its buyer's premium, so the full $40m goes to The Ferrari Foundation, a 501(c)(3) charity funding educational initiatives. The pre-sale estimate had been 'in excess of $1.1 million'.",
      },
      {
        q: "Who bought the $40 million Ferrari Luce?",
        a: "The buyer has not been identified. RM Sotheby's recorded the sale to an anonymous bidder and neither the auction house nor Ferrari has named them. Several names have circulated in enthusiast media, but none has been confirmed by any party to the sale, and delivery of the car is not scheduled until Q1 2027.",
      },
      {
        q: "Is the Ferrari Luce the most expensive car ever sold at auction?",
        a: "No. It is the most expensive new car ever sold at public auction, beating the $26m paid for the final Ferrari Daytona SP3 in 2025. The all-time auction record remains the $143m 1955 Mercedes-Benz 300 SLR Uhlenhaut Coupé sold in 2022, and Ferrari's own marque record is the $51.7m 1962 330 LM/250 GTO sold in 2023.",
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
        label: "Ferrari Luce 'Chassis 0' sells for $40 million",
        href: "https://news.dupontregistry.com/blogs/auctions/ferrari-luce-chassis-0-sells-for-40-million",
        publisher: "duPont Registry",
      },
      {
        label: "Ferrari Luce chassis 0 sells for $40m at Monterey auction",
        href: "https://evpowered.co.uk/news/first-ferrari-luce-sells-for-40-million-at-monterey-charity-auction/",
        publisher: "EV Powered",
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
];

export const NEWS_BASE_PATH = "/latest-news";

/** Newest first, with any featured article pinned to the top. */
export function getNewsArticles(): NewsArticle[] {
  return [...NEWS_ARTICLES].sort((a, b) => {
    if (a.isFeatured !== b.isFeatured) return a.isFeatured ? -1 : 1;
    return b.publishDate.localeCompare(a.publishDate);
  });
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
