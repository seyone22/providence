import type { Metadata } from "next";
import { notFound } from "next/navigation";
import NewsShell from "@/components/news/NewsShell";
import { getAllNewsSlugs, getNewsArticle, NEWS_BASE_PATH } from "@/config/news";
import { getNewsBody } from "@/content/news";

const SITE = "https://www.providenceauto.co.uk";

export function generateStaticParams() {
  return getAllNewsSlugs().map((slug) => ({ slug }));
}

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

  // NewsArticle rather than BlogPosting — this is dated reporting, and the
  // citations are surfaced so crawlers and AI search can follow the claims.
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.h1,
    description: article.description,
    image: article.heroImage,
    datePublished: article.publishDate,
    dateModified: article.updatedDate,
    articleSection: article.category,
    author: { "@type": "Organization", name: article.author, url: `${SITE}/` },
    publisher: {
      "@type": "Organization",
      name: "Providence Auto",
      logo: { "@type": "ImageObject", url: `${SITE}/logo.png` },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
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
        name: "Latest News",
        item: `${SITE}${NEWS_BASE_PATH}`,
      },
      { "@type": "ListItem", position: 3, name: article.title, item: url },
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
      <NewsShell article={article}>
        <Body />
      </NewsShell>
    </>
  );
}
