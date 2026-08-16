import { ArrowRight, Clock } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import BlogCTA from "@/components/blog/BlogCTA";
import MinimalHeader from "@/components/MinimalHeader";
import { Reveal } from "@/components/Reveal";
import { BLOG_BASE_PATH } from "@/config/blog";
import { getNewsArticles, NEWS_BASE_PATH } from "@/config/news";

const SITE = "https://www.providenceauto.co.uk";
const TITLE =
  "Latest News — Car Auctions, Import Markets & Industry Analysis | Providence Auto";
const DESCRIPTION =
  "News and analysis from the people who buy cars at auction for a living — record sales, market moves, import rule changes and what they actually mean for dealers and private buyers.";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: [
    "car auction news",
    "car import news",
    "vehicle market analysis",
    "record car auction prices",
    "car import rule changes",
  ],
  alternates: { canonical: NEWS_BASE_PATH },
  openGraph: {
    type: "website",
    locale: "en_IE",
    url: `${SITE}${NEWS_BASE_PATH}`,
    siteName: "Providence Auto",
    title: TITLE,
    description: DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
  robots: { index: true, follow: true },
};

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("en-IE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(iso));
}

export default function LatestNewsIndexPage() {
  const articles = getNewsArticles();
  const [lead, ...rest] = articles;

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
      {
        "@type": "ListItem",
        position: 2,
        name: "Latest News",
        item: `${SITE}${NEWS_BASE_PATH}`,
      },
    ],
  };

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: articles.map((a, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: a.title,
      url: `${SITE}${NEWS_BASE_PATH}/${a.slug}`,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD must be inlined as a script tag for crawlers
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD must be inlined as a script tag for crawlers
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />

      <main className="min-h-screen bg-white text-black font-sans overflow-x-hidden">
        <MinimalHeader />

        {/* ── HERO ─────────────────────────────────── */}
        <section className="px-6 pt-36 md:pt-40 pb-12 max-w-5xl mx-auto text-center">
          <Reveal
            as="p"
            immediate
            y={16}
            duration={0.6}
            className="text-sm font-bold tracking-[0.3em] text-zinc-400 uppercase mb-5"
          >
            Latest News
          </Reveal>
          <Reveal
            as="h1"
            immediate
            y={20}
            duration={0.8}
            className="text-4xl md:text-6xl font-bold tracking-tighter leading-[1.1] mb-6"
          >
            The market,
            <br className="hidden md:block" /> read properly.
          </Reveal>
          <Reveal
            immediate
            y={16}
            delay={0.1}
            duration={0.6}
            className="text-xl text-zinc-500 font-light max-w-2xl mx-auto"
          >
            Record sales, market moves and import rule changes &mdash; covered
            by people who bid at auction every week, with the numbers checked
            and the sources shown.
          </Reveal>
        </section>

        {/* ── LEAD STORY ───────────────────────────── */}
        {lead && (
          <section className="px-6 max-w-5xl mx-auto mb-16">
            <Reveal y={24} duration={0.7}>
              <Link
                href={`${NEWS_BASE_PATH}/${lead.slug}`}
                className="group grid md:grid-cols-2 gap-0 overflow-hidden rounded-[2rem] border border-black/8 bg-white shadow-[0_20px_50px_rgba(0,0,0,0.06)] transition-shadow hover:shadow-[0_30px_60px_rgba(0,0,0,0.1)]"
              >
                {/* biome-ignore lint/performance/noImgElement: remote hero image, intentional <img> per site convention */}
                <img
                  src={lead.heroImage}
                  alt={lead.heroAlt}
                  className="h-56 md:h-full w-full object-cover"
                />
                <div className="p-8 md:p-10 flex flex-col justify-center">
                  <p className="text-xs font-bold tracking-[0.2em] uppercase text-sky-600 mb-3">
                    {lead.category} · {formatDate(lead.publishDate)}
                  </p>
                  <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-black group-hover:text-sky-600 transition-colors mb-3">
                    {lead.title}
                  </h2>
                  <p className="text-zinc-500 font-light leading-relaxed mb-5">
                    {lead.excerpt}
                  </p>
                  <span className="inline-flex items-center gap-2 text-sm font-bold text-sky-600">
                    Read the story
                    <ArrowRight
                      size={15}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  </span>
                </div>
              </Link>
            </Reveal>
          </section>
        )}

        {/* ── MORE STORIES ─────────────────────────── */}
        {rest.length > 0 && (
          <section className="px-6 max-w-6xl mx-auto pb-12">
            <Reveal
              y={20}
              duration={0.5}
              className="flex items-center gap-4 mb-6"
            >
              <p className="text-xs font-bold tracking-[0.3em] text-zinc-400 uppercase shrink-0">
                More stories
              </p>
              <div className="flex-1 h-px bg-black/5" />
            </Reveal>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {rest.map((article, i) => (
                <Reveal
                  as="div"
                  key={article.slug}
                  y={20}
                  delay={i * 0.05}
                  duration={0.5}
                >
                  <Link
                    href={`${NEWS_BASE_PATH}/${article.slug}`}
                    className="group flex h-full flex-col overflow-hidden rounded-[1.5rem] border border-black/5 bg-white shadow-[0_10px_30px_rgba(0,0,0,0.03)] transition-all duration-300 hover:border-sky-500/20 hover:shadow-[0_20px_40px_rgba(0,0,0,0.07)]"
                  >
                    {/* biome-ignore lint/performance/noImgElement: remote hero image, intentional <img> per site convention */}
                    <img
                      src={article.heroImage}
                      alt={article.heroAlt}
                      className="h-40 w-full object-cover"
                    />
                    <div className="p-6 flex flex-1 flex-col">
                      <p className="text-xs font-bold tracking-[0.2em] uppercase text-zinc-400 mb-2">
                        {article.category} · {formatDate(article.publishDate)}
                      </p>
                      <h3 className="text-lg font-bold text-black group-hover:text-sky-600 transition-colors mb-2">
                        {article.title}
                      </h3>
                      <p className="text-sm text-zinc-500 font-light leading-relaxed flex-1">
                        {article.excerpt}
                      </p>
                      <span className="mt-4 inline-flex items-center gap-1.5 text-xs text-zinc-400 font-medium">
                        <Clock size={12} />
                        {article.readingTimeMins} min read
                      </span>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </section>
        )}

        {/* ── CROSS-LINK TO GUIDES ─────────────────── */}
        <section className="px-6 max-w-5xl mx-auto pb-4">
          <Reveal y={20} duration={0.6}>
            <Link
              href={BLOG_BASE_PATH}
              className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-[1.75rem] border border-black/8 bg-zinc-50 px-7 py-6 transition-colors hover:border-sky-500/25"
            >
              <div>
                <p className="text-xs font-bold tracking-[0.2em] uppercase text-zinc-400 mb-1.5">
                  Looking for the how-to?
                </p>
                <p className="text-lg font-bold tracking-tight text-black">
                  Our import guides cover every country we source from
                </p>
              </div>
              <span className="inline-flex shrink-0 items-center gap-2 text-sm font-bold text-sky-600">
                Browse the guides
                <ArrowRight
                  size={15}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </span>
            </Link>
          </Reveal>
        </section>

        {/* ── CTA ──────────────────────────────────── */}
        <div className="px-6 pb-20 max-w-3xl mx-auto">
          <BlogCTA />
        </div>
      </main>
    </>
  );
}
