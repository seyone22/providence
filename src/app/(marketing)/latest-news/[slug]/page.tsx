import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCarsForNewsArticle } from "@/actions/spec-actions";
import NewsShell from "@/components/news/NewsShell";
import type { UpcomingCar } from "@/components/news/UpcomingCarCard";
import {
  getAllNewsSlugs,
  getCategoryMetaByLabel,
  getNewsArticle,
  NEWS_BASE_PATH,
  NEWS_CATEGORY_BASE_PATH,
} from "@/config/news";
import { getNewsBody } from "@/content/news";

const SITE = "https://www.providenceauto.co.uk";

export function generateStaticParams() {
  return getAllNewsSlugs().map((slug) => ({ slug }));
}

// The article body is static, but the "cars in this story" block reads live
// dossiers — without ISR, linking a new car page to an existing story would
// never appear until the next deploy.
export const revalidate = 300;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getNewsArticle(slug);
  if (!article) return {};

  const path = `${NEWS_BASE_PATH}/${article.slug}`;
  const url = `${SITE}${path}`;

  return {
    title: { absolute: article.seoTitle },
    description: article.description,
    keywords: article.keywords,
    alternates: { canonical: path },
    openGraph: {
      type: "article",
      locale: "en_IE",
      url,
      siteName: "Providence Auto",
      title: article.seoTitle,
      description: article.description,
      publishedTime: article.publishDate,
      modifiedTime: article.updatedDate,
      authors: [article.author],
      images: [{ url: article.heroImage, alt: article.heroAlt }],
    },
    twitter: {
      card: "summary_large_image",
      title: article.seoTitle,
      description: article.description,
      images: [article.heroImage],
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

export default async function NewsArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getNewsArticle(slug);
  const Body = getNewsBody(slug);
  if (!article || !Body) notFound();

  const path = `${NEWS_BASE_PATH}/${article.slug}`;
  const url = `${SITE}${path}`;

  // Car pages for the models this story announces, if any exist yet.
  const carsResponse = await getCarsForNewsArticle(
    article.slug,
    article.linkedVehicleSlugs ?? [],
  );
  const linkedCars = (
    carsResponse.success ? carsResponse.data : []
  ) as UpcomingCar[];

  const categoryMeta = getCategoryMetaByLabel(article.category);
  const heroImageUrl = article.heroImage.startsWith("http")
    ? article.heroImage
    : `${SITE}${article.heroImage}`;

  // NewsArticle rather than BlogPosting — this is dated reporting, and the
  // citations are surfaced so crawlers and AI search can follow the claims.
  //
  // The extra properties below are what news surfaces specifically look for:
  // isAccessibleForFree (no paywall to negotiate), inLanguage, a publisher with
  // a real logo, speakable regions, and a datePublished carrying a timezone so
  // "how fresh is this" is answerable to the hour rather than the day.
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "@id": `${url}#article`,
    headline: article.h1,
    alternativeHeadline: article.title,
    description: article.description,
    image: [heroImageUrl],
    thumbnailUrl: heroImageUrl,
    datePublished: `${article.publishDate}T08:00:00+01:00`,
    dateModified: `${article.updatedDate}T08:00:00+01:00`,
    articleSection: article.category,
    inLanguage: "en-IE",
    isAccessibleForFree: true,
    wordCount: article.readingTimeMins * 200,
    author: { "@type": "Organization", name: article.author, url: `${SITE}/` },
    publisher: {
      "@type": "Organization",
      name: "Providence Auto",
      url: `${SITE}/`,
      logo: { "@type": "ImageObject", url: `${SITE}/logo.png` },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    isPartOf: categoryMeta
      ? {
          "@type": "CollectionPage",
          "@id": `${SITE}${NEWS_CATEGORY_BASE_PATH}/${categoryMeta.slug}`,
          name: categoryMeta.h1,
        }
      : undefined,
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["h1", "article p"],
    },
    keywords: article.keywords.join(", "),
    citation: article.sources.map((s) => ({
      "@type": "CreativeWork",
      name: s.label,
      url: s.href,
      publisher: { "@type": "Organization", name: s.publisher },
    })),
    url,
  };

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
      ...(categoryMeta
        ? [
            {
              "@type": "ListItem",
              position: 3,
              name: categoryMeta.h1,
              item: `${SITE}${NEWS_CATEGORY_BASE_PATH}/${categoryMeta.slug}`,
            },
          ]
        : []),
      {
        "@type": "ListItem",
        position: categoryMeta ? 4 : 3,
        name: article.title,
        item: url,
      },
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: article.faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD must be inlined as a script tag for crawlers
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD must be inlined as a script tag for crawlers
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD must be inlined as a script tag for crawlers
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <NewsShell article={article} linkedCars={linkedCars}>
        <Body />
      </NewsShell>
    </>
  );
}
