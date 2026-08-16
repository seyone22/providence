import { ArrowRight, Clock } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import BlogCTA from "@/components/blog/BlogCTA";
import Breadcrumbs from "@/components/blog/Breadcrumbs";
import TableOfContents from "@/components/blog/TableOfContents";
import FAQSection from "@/components/faqSection";
import MinimalHeader from "@/components/MinimalHeader";
import { Reveal } from "@/components/Reveal";
import { BLOG_BASE_PATH, getPost } from "@/config/blog";
import type { NewsArticle } from "@/config/news";
import { NEWS_BASE_PATH } from "@/config/news";
import NewsSources from "./NewsSources";

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("en-IE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(iso));
}

// Article scaffold for news pieces. Mirrors the blog ArticleShell layout so the
// two sections feel like one site, but carries the news-specific furniture:
// a dateline, a published date (news ages, guides get updated), an image
// caption slot for illustrative photography, and a sources block.
export default function NewsShell({
  article,
  children,
}: {
  article: NewsArticle;
  children: ReactNode;
}) {
  const relatedGuides = article.relatedGuides
    .map((slug) => getPost(slug))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  return (
    <main className="min-h-screen bg-white text-black font-sans overflow-x-hidden">
      <MinimalHeader />

      {/* ── HEADER ─────────────────────────────────────── */}
      <header className="px-6 pt-32 md:pt-36 pb-10 max-w-3xl mx-auto">
        <Reveal y={16} duration={0.5} className="mb-6">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Latest News", href: NEWS_BASE_PATH },
              { label: article.title },
            ]}
          />
        </Reveal>

        <Reveal
          immediate
          y={16}
          duration={0.6}
          className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-4"
        >
          <span className="text-xs font-bold tracking-[0.2em] uppercase text-sky-600">
            {article.category}
          </span>
          <span className="text-zinc-300">·</span>
          <span className="text-xs font-bold tracking-[0.2em] uppercase text-zinc-400">
            {article.dateline}
          </span>
        </Reveal>

        <Reveal
          as="h1"
          immediate
          y={20}
          duration={0.8}
          className="text-4xl md:text-5xl font-bold tracking-tighter leading-[1.1] text-black mb-6"
        >
          {article.h1}
        </Reveal>

        <Reveal
          immediate
          y={16}
          delay={0.1}
          duration={0.6}
          className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-zinc-500 font-light"
        >
          <span className="font-medium text-zinc-700">{article.author}</span>
          <span className="text-zinc-300">·</span>
          <time dateTime={article.publishDate}>
            {formatDate(article.publishDate)}
          </time>
          <span className="text-zinc-300">·</span>
          <span className="inline-flex items-center gap-1">
            <Clock size={13} className="text-zinc-400" />
            {article.readingTimeMins} min read
          </span>
        </Reveal>
      </header>

      {/* ── HERO IMAGE ─────────────────────────────────── */}
      <Reveal y={24} duration={0.7} className="px-6 max-w-5xl mx-auto mb-12">
        <figure>
          {/* biome-ignore lint/performance/noImgElement: remote hero image, intentional <img> per site convention */}
          <img
            src={article.heroImage}
            alt={article.heroAlt}
            className="w-full aspect-[16/9] object-cover rounded-[2rem] shadow-[0_30px_60px_rgba(0,0,0,0.12)]"
          />
          {article.heroCaption && (
            <figcaption className="mt-3 px-2 text-xs text-zinc-400 font-light leading-relaxed">
              {article.heroCaption}
            </figcaption>
          )}
        </figure>
      </Reveal>

      {/* ── BODY ───────────────────────────────────────── */}
      <div className="px-6 pb-8 max-w-6xl mx-auto">
        <div className="lg:grid lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-12">
          <TableOfContents items={article.toc} />
          <article className="max-w-3xl">
            {children}

            <NewsSources sources={article.sources} />

            <div id="faqs" />
          </article>
        </div>
      </div>

      {/* ── FAQ (full-width band) ──────────────────────── */}
      <FAQSection
        data={{
          title: "Frequently Asked Questions",
          subtitle: "The questions readers are asking about this story.",
          categories: [{ category: "FAQ", items: article.faqs }],
        }}
      />

      {/* ── RELATED GUIDES + CTA ───────────────────────── */}
      <div className="px-6 pb-20 max-w-3xl mx-auto">
        {relatedGuides.length > 0 && (
          <section className="mt-16 border-t border-black/8 pt-12">
            <Reveal
              as="h2"
              y={20}
              duration={0.6}
              className="text-2xl md:text-3xl font-bold tracking-tighter text-black mb-8"
            >
              Related guides
            </Reveal>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {relatedGuides.map((post, i) => (
                <Reveal
                  as="div"
                  key={post.slug}
                  y={20}
                  delay={i * 0.06}
                  duration={0.5}
                >
                  <Link
                    href={`${BLOG_BASE_PATH}/${post.slug}`}
                    className="group flex h-full flex-col rounded-[1.5rem] border border-black/5 bg-white p-6 shadow-[0_10px_30px_rgba(0,0,0,0.03)] transition-all duration-300 hover:border-sky-500/20 hover:shadow-[0_20px_40px_rgba(0,0,0,0.07)]"
                  >
                    <p className="text-xs font-bold tracking-[0.2em] uppercase text-zinc-400 mb-2">
                      {post.cluster}
                    </p>
                    <h3 className="text-lg font-bold text-black group-hover:text-sky-600 transition-colors mb-2">
                      {post.title}
                    </h3>
                    <p className="text-sm text-zinc-500 font-light leading-relaxed flex-1">
                      {post.excerpt}
                    </p>
                    <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-sky-600">
                      Read guide
                      <ArrowRight
                        size={14}
                        className="group-hover:translate-x-1 transition-transform"
                      />
                    </span>
                  </Link>
                </Reveal>
              ))}
            </div>
          </section>
        )}
        <BlogCTA />
      </div>
    </main>
  );
}
