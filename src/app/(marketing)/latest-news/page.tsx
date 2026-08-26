import { ArrowRight, CalendarClock, Clock } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { getUpcomingCars } from "@/actions/spec-actions";
import BlogCTA from "@/components/blog/BlogCTA";
import MinimalHeader from "@/components/MinimalHeader";
import NewsCard from "@/components/news/NewsCard";
import UpcomingCarCard, {
  type UpcomingCar,
} from "@/components/news/UpcomingCarCard";
import PreferredSourceCallout from "@/components/PreferredSourceCallout";
import { Reveal } from "@/components/Reveal";
import { BLOG_BASE_PATH } from "@/config/blog";
import {
  getLatestPublishDate,
  getNewsArticles,
  getPopulatedCategories,
  getReleaseArticles,
  NEWS_BASE_PATH,
  NEWS_CATEGORY_BASE_PATH,
} from "@/config/news";

const SITE = "https://www.providenceauto.co.uk";

// The upcoming-cars rail reads live dossiers, so the page can't be fully
// static. Five minutes is well inside the cadence at which a coming-soon car
// gets added, and saveSpecDossier revalidates this path explicitly anyway.
export const revalidate = 300;

// The registry is a static module, so the lead story is resolvable at build
// time — which lets the OG/Twitter card carry a real image instead of nothing.
const LEAD = getNewsArticles()[0];

const TITLE =
  "Automotive News — New Car Releases, Industry & Market Analysis | Providence Auto";
const DESCRIPTION =
  "Automotive news covering new car releases, manufacturer and industry moves, auction records, market data and the tax and policy changes that move what a car actually costs — sourced, dated and checked.";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: [
    "automotive news",
    "car industry news",
    "new car releases 2026",
    "car market news",
    "car auction news",
    "car tax and policy news",
    "latest car news",
  ],
  alternates: {
    canonical: NEWS_BASE_PATH,
    types: {
      "application/rss+xml": [
        { url: `${SITE}${NEWS_BASE_PATH}/rss.xml`, title: TITLE },
      ],
    },
  },
  openGraph: {
    type: "website",
    locale: "en_IE",
    url: `${SITE}${NEWS_BASE_PATH}`,
    siteName: "Providence Auto",
    title: TITLE,
    description: DESCRIPTION,
    ...(LEAD ? { images: [{ url: LEAD.heroImage, alt: LEAD.heroAlt }] } : {}),
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    ...(LEAD ? { images: [LEAD.heroImage] } : {}),
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
};

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("en-IE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(iso));
}

export default async function LatestNewsIndexPage() {
  const articles = getNewsArticles();
  const [lead, ...rest] = articles;
  const categories = getPopulatedCategories();
  const latestDate = getLatestPublishDate();

  // Upcoming cars come from the dossier table (they're real, orderable
  // products with their own pages); the release stories come from the static
  // news registry. The section shows both, because a reader arriving on
  // "new model releases" wants the announcement and the car.
  const upcomingResponse = await getUpcomingCars(6);
  const upcomingCars = (
    upcomingResponse.success ? upcomingResponse.data : []
  ) as UpcomingCar[];
  const releaseArticles = getReleaseArticles(3);
  const hasUpcomingSection =
    upcomingCars.length > 0 || releaseArticles.length > 0;

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
      {
        "@type": "ListItem",
        position: 2,
        name: "Automotive News",
        item: `${SITE}${NEWS_BASE_PATH}`,
      },
    ],
  };

  // CollectionPage rather than a bare ItemList: it tells crawlers this is a
  // regularly-updated hub with a publisher behind it, which is what news
  // surfaces look for before they will consider a section for recency ranking.
  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${SITE}${NEWS_BASE_PATH}`,
    name: "Automotive News",
    headline: "Automotive News — Releases, Industry, Market and Policy",
    description: DESCRIPTION,
    url: `${SITE}${NEWS_BASE_PATH}`,
    inLanguage: "en-IE",
    isPartOf: { "@type": "WebSite", name: "Providence Auto", url: `${SITE}/` },
    publisher: {
      "@type": "Organization",
      name: "Providence Auto",
      url: `${SITE}/`,
      logo: { "@type": "ImageObject", url: `${SITE}/logo.png` },
    },
    ...(latestDate ? { dateModified: latestDate } : {}),
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: articles.length,
      itemListElement: articles.map((a, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: `${SITE}${NEWS_BASE_PATH}/${a.slug}`,
        name: a.title,
      })),
    },
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />
      <main className="min-h-screen bg-white text-black font-sans overflow-x-hidden">
        <MinimalHeader />

        {/* ── HERO ─────────────────────────────────── */}
        <section className="px-6 pt-36 md:pt-40 pb-10 max-w-5xl mx-auto text-center">
          <Reveal
            as="p"
            immediate
            y={16}
            duration={0.6}
            className="text-sm font-bold tracking-[0.3em] text-zinc-400 uppercase mb-5"
          >
            Automotive News
          </Reveal>
          <Reveal
            as="h1"
            immediate
            y={20}
            duration={0.8}
            className="text-4xl md:text-6xl font-bold tracking-tighter leading-[1.1] mb-6"
          >
            The industry,
            <br className="hidden md:block" /> read properly.
          </Reveal>
          <Reveal
            immediate
            y={16}
            delay={0.1}
            duration={0.6}
            className="text-xl text-zinc-500 font-light max-w-2xl mx-auto"
          >
            New model launches, manufacturer moves, auction records, market data
            and the tax changes that decide what a car really costs &mdash;
            covered by people who buy cars for a living, with the numbers
            checked and the sources shown.
          </Reveal>
          {latestDate && (
            <Reveal
              as="p"
              immediate
              y={12}
              delay={0.2}
              duration={0.5}
              className="mt-6 text-xs font-medium tracking-wide text-zinc-400"
            >
              Last updated{" "}
              <time dateTime={latestDate}>{formatDate(latestDate)}</time>
            </Reveal>
          )}
        </section>

        {/* ── CATEGORY NAV ─────────────────────────── */}
        {categories.length > 0 && (
          <nav
            aria-label="News categories"
            className="px-6 max-w-5xl mx-auto mb-12"
          >
            <Reveal
              y={16}
              duration={0.5}
              className="flex flex-wrap justify-center gap-2.5"
            >
              {categories.map((c) => (
                <Link
                  key={c.slug}
                  href={`${NEWS_CATEGORY_BASE_PATH}/${c.slug}`}
                  className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-medium text-zinc-600 transition-colors hover:border-sky-500/40 hover:text-sky-600"
                >
                  {c.chip}
                </Link>
              ))}
            </Reveal>
          </nav>
        )}

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
                  width={1200}
                  height={675}
                  fetchPriority="high"
                  className="h-56 md:h-full w-full object-cover"
                />
                <div className="p-8 md:p-10 flex flex-col justify-center">
                  <p className="text-xs font-bold tracking-[0.2em] uppercase text-sky-600 mb-3">
                    {lead.category} &middot;{" "}
                    <time dateTime={lead.publishDate}>
                      {formatDate(lead.publishDate)}
                    </time>
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

        {/* ── UPCOMING CARS & NEW MODEL RELEASES ───── */}
        {hasUpcomingSection && (
          <section
            id="upcoming-cars"
            className="px-6 max-w-6xl mx-auto mb-16 scroll-mt-28"
          >
            <Reveal y={20} duration={0.5} className="mb-8">
              <div className="flex items-center gap-4 mb-4">
                <p className="flex shrink-0 items-center gap-2 text-xs font-bold tracking-[0.3em] text-sky-600 uppercase">
                  <CalendarClock size={14} /> Upcoming cars
                </p>
                <div className="flex-1 h-px bg-black/5" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tighter text-black mb-2">
                Upcoming cars &amp; new model releases
              </h2>
              <p className="text-zinc-500 font-light leading-relaxed max-w-2xl">
                Models that have been announced but aren&rsquo;t on sale yet.
                Register interest now and we&rsquo;ll come back with a landed
                cost for your country as soon as specification and pricing are
                confirmed.
              </p>
            </Reveal>

            {upcomingCars.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {upcomingCars.map((car, i) => (
                  <UpcomingCarCard key={car._id} car={car} index={i} />
                ))}
              </div>
            )}

            {/* The announcements themselves. Shown even when no dossier has
                been built yet, so the section is never empty on a week where
                only the reporting exists. */}
            {releaseArticles.length > 0 && (
              <div className="mt-10">
                <Reveal
                  y={16}
                  duration={0.5}
                  className="flex items-center gap-4 mb-5"
                >
                  <p className="text-xs font-bold tracking-[0.3em] text-zinc-400 uppercase shrink-0">
                    Latest launch reporting
                  </p>
                  <div className="flex-1 h-px bg-black/5" />
                </Reveal>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {releaseArticles.map((article, i) => (
                    <NewsCard key={article.slug} article={article} index={i} />
                  ))}
                </div>
              </div>
            )}

            {/* Only linked when the archive actually has articles — an empty
                category archive 404s by design. */}
            {releaseArticles.length > 0 && (
              <Reveal y={16} duration={0.5} className="mt-8">
                <Link
                  href={`${NEWS_CATEGORY_BASE_PATH}/releases`}
                  className="group inline-flex items-center gap-2 text-sm font-bold text-sky-600 hover:text-sky-700 transition-colors"
                >
                  All new car releases
                  <ArrowRight
                    size={15}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </Link>
              </Reveal>
            )}
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
                <NewsCard key={article.slug} article={article} index={i} />
              ))}
            </div>
          </section>
        )}

        {/* ── BROWSE BY CATEGORY ───────────────────── */}
        {categories.length > 0 && (
          <section className="px-6 max-w-5xl mx-auto pb-12">
            <Reveal
              y={20}
              duration={0.5}
              className="flex items-center gap-4 mb-6"
            >
              <p className="text-xs font-bold tracking-[0.3em] text-zinc-400 uppercase shrink-0">
                Browse by topic
              </p>
              <div className="flex-1 h-px bg-black/5" />
            </Reveal>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {categories.map((c, i) => (
                <Reveal
                  as="div"
                  key={c.slug}
                  y={20}
                  delay={i * 0.05}
                  duration={0.5}
                >
                  <Link
                    href={`${NEWS_CATEGORY_BASE_PATH}/${c.slug}`}
                    className="group flex h-full items-start justify-between gap-4 rounded-[1.5rem] border border-black/8 bg-zinc-50 px-6 py-5 transition-colors hover:border-sky-500/25"
                  >
                    <div>
                      <p className="text-base font-bold tracking-tight text-black group-hover:text-sky-600 transition-colors mb-1">
                        {c.h1}
                      </p>
                      <p className="text-sm text-zinc-500 font-light leading-relaxed">
                        {c.blurb}
                      </p>
                    </div>
                    <ArrowRight
                      size={16}
                      className="mt-1 shrink-0 text-zinc-400 group-hover:translate-x-1 group-hover:text-sky-600 transition-all"
                    />
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

        {/* ── FOLLOW: PREFERRED SOURCE + FEED ──────── */}
        <section className="px-6 max-w-3xl mx-auto pb-8">
          <PreferredSourceCallout />
          <p className="mt-6 text-center text-xs text-zinc-400 font-light">
            <Clock size={11} className="inline mr-1.5 -mt-0.5" />
            Updated as stories break.{" "}
            <a
              href={`${NEWS_BASE_PATH}/rss.xml`}
              className="underline decoration-zinc-300 hover:decoration-zinc-500"
            >
              Subscribe via RSS
            </a>
            .
          </p>
        </section>

        {/* ── CTA ──────────────────────────────────── */}
        <div className="px-6 pb-20 max-w-3xl mx-auto">
          <BlogCTA />
        </div>
      </main>
    </>
  );
}
