import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import BlogCTA from "@/components/blog/BlogCTA";
import Breadcrumbs from "@/components/blog/Breadcrumbs";
import MinimalHeader from "@/components/MinimalHeader";
import NewsCard from "@/components/news/NewsCard";
import { Reveal } from "@/components/Reveal";
import {
  getCategoryMeta,
  getNewsByCategory,
  getPopulatedCategories,
  NEWS_BASE_PATH,
  NEWS_CATEGORY_BASE_PATH,
} from "@/config/news";

const SITE = "https://www.providenceauto.co.uk";

// Only categories that actually hold articles get a page. An empty archive is a
// thin-content liability, not an extra keyword target.
export function generateStaticParams() {
  return getPopulatedCategories().map((c) => ({ category: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  const meta = getCategoryMeta(category);
  if (!meta) return {};

  const path = `${NEWS_CATEGORY_BASE_PATH}/${meta.slug}`;
  const lead = getNewsByCategory(meta.label)[0];

  return {
    title: { absolute: meta.seoTitle },
    description: meta.description,
    keywords: meta.keywords,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      locale: "en_IE",
      url: `${SITE}${path}`,
      siteName: "Providence Auto",
      title: meta.seoTitle,
      description: meta.description,
      ...(lead ? { images: [{ url: lead.heroImage, alt: lead.heroAlt }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: meta.seoTitle,
      description: meta.description,
      ...(lead ? { images: [lead.heroImage] } : {}),
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
}

export default async function NewsCategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const meta = getCategoryMeta(category);
  if (!meta) notFound();

  const articles = getNewsByCategory(meta.label);
  if (articles.length === 0) notFound();

  const others = getPopulatedCategories().filter((c) => c.slug !== meta.slug);
  const path = `${NEWS_CATEGORY_BASE_PATH}/${meta.slug}`;
  const url = `${SITE}${path}`;
  const latest = articles
    .map((a) => a.updatedDate)
    .sort()
    .reverse()[0];

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
      { "@type": "ListItem", position: 3, name: meta.h1, item: url },
    ],
  };

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": url,
    name: meta.h1,
    headline: meta.h1,
    description: meta.description,
    url,
    inLanguage: "en-IE",
    isPartOf: {
      "@type": "WebSite",
      name: "Providence Auto",
      url: `${SITE}/`,
    },
    publisher: {
      "@type": "Organization",
      name: "Providence Auto",
      url: `${SITE}/`,
      logo: { "@type": "ImageObject", url: `${SITE}/logo.png` },
    },
    ...(latest ? { dateModified: latest } : {}),
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

        <header className="px-6 pt-32 md:pt-36 pb-10 max-w-5xl mx-auto">
          <Reveal y={16} duration={0.5} className="mb-6">
            <Breadcrumbs
              items={[
                { label: "Home", href: "/" },
                { label: "Automotive News", href: NEWS_BASE_PATH },
                { label: meta.chip },
              ]}
            />
          </Reveal>

          <Reveal
            as="p"
            immediate
            y={16}
            duration={0.6}
            className="text-sm font-bold tracking-[0.3em] text-sky-600 uppercase mb-4"
          >
            {meta.label}
          </Reveal>
          <Reveal
            as="h1"
            immediate
            y={20}
            duration={0.8}
            className="text-4xl md:text-5xl font-bold tracking-tighter leading-[1.1] mb-5"
          >
            {meta.h1}
          </Reveal>
          <Reveal
            immediate
            y={16}
            delay={0.1}
            duration={0.6}
            className="text-lg md:text-xl text-zinc-500 font-light max-w-2xl"
          >
            {meta.blurb}
          </Reveal>
        </header>

        <section className="px-6 max-w-6xl mx-auto pb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {articles.map((article, i) => (
              <NewsCard key={article.slug} article={article} index={i} />
            ))}
          </div>
        </section>

        {/* ── OTHER CATEGORIES ─────────────────────── */}
        {others.length > 0 && (
          <section className="px-6 max-w-5xl mx-auto pb-12">
            <Reveal
              y={20}
              duration={0.5}
              className="flex items-center gap-4 mb-6"
            >
              <p className="text-xs font-bold tracking-[0.3em] text-zinc-400 uppercase shrink-0">
                Other topics
              </p>
              <div className="flex-1 h-px bg-black/5" />
            </Reveal>
            <div className="flex flex-wrap gap-2.5">
              {others.map((c) => (
                <Link
                  key={c.slug}
                  href={`${NEWS_CATEGORY_BASE_PATH}/${c.slug}`}
                  className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-medium text-zinc-600 transition-colors hover:border-sky-500/40 hover:text-sky-600"
                >
                  {c.chip}
                </Link>
              ))}
              <Link
                href={NEWS_BASE_PATH}
                className="inline-flex items-center gap-1.5 rounded-full border border-black/10 bg-zinc-50 px-4 py-2 text-sm font-bold text-sky-600 transition-colors hover:border-sky-500/40"
              >
                All news
                <ArrowRight size={14} />
              </Link>
            </div>
          </section>
        )}

        <div className="px-6 pb-20 max-w-3xl mx-auto">
          <BlogCTA />
        </div>
      </main>
    </>
  );
}
