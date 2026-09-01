import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ArticleShell from "@/components/blog/ArticleShell";
import { getAllSlugs, getPost } from "@/config/blog";
import { getBody } from "@/content/blog";

const SITE = "https://www.providenceauto.co.uk";

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};

  const path = `/blog/${post.slug}`;
  const url = `${SITE}${path}`;

  // Slack, LinkedIn, X and iMessage need declared dimensions to render a link
  // preview, so a post with a purpose-built 1200×630 share image declares them.
  // Posts without one fall back to the hero, whose size varies by source.
  const shareImage = post.ogImage
    ? { url: post.ogImage, width: 1200, height: 630, alt: post.heroAlt }
    : { url: post.heroImage, alt: post.heroAlt };

  return {
    title: { absolute: post.seoTitle },
    description: post.description,
    keywords: post.keywords,
    alternates: { canonical: path },
    openGraph: {
      type: "article",
      locale: "en_IE",
      url,
      siteName: "Providence Auto",
      title: post.seoTitle,
      description: post.description,
      publishedTime: post.publishDate,
      modifiedTime: post.updatedDate,
      authors: [post.author],
      images: [shareImage],
    },
    twitter: {
      card: "summary_large_image",
      title: post.seoTitle,
      description: post.description,
      images: [post.ogImage ?? post.heroImage],
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

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);
  const Body = getBody(slug);
  if (!post || !Body) notFound();

  const path = `/blog/${post.slug}`;
  const url = `${SITE}${path}`;

  // ── Structured data for Google rich results + AI search (ChatGPT, Perplexity…)
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.h1,
    description: post.description,
    image: post.heroImage,
    datePublished: post.publishDate,
    dateModified: post.updatedDate,
    author: { "@type": "Organization", name: post.author, url: `${SITE}/` },
    publisher: {
      "@type": "Organization",
      name: "Providence Auto",
      logo: { "@type": "ImageObject", url: `${SITE}/logo.png` },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    keywords: post.keywords.join(", "),
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
        name: "Guides",
        item: `${SITE}/blog`,
      },
      { "@type": "ListItem", position: 3, name: post.title, item: url },
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: post.faqs.map((f) => ({
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
      <ArticleShell post={post}>
        <Body />
      </ArticleShell>
    </>
  );
}
