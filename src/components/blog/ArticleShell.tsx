import { Clock } from "lucide-react";
import type { ReactNode } from "react";
import FAQSection from "@/components/faqSection";
import MinimalHeader from "@/components/MinimalHeader";
import { Reveal } from "@/components/Reveal";
import type { BlogPost } from "@/config/blog";
import { BLOG_BASE_PATH } from "@/config/blog";
import BlogCTA from "./BlogCTA";
import Breadcrumbs from "./Breadcrumbs";
import RelatedPosts from "./RelatedPosts";
import TableOfContents from "./TableOfContents";

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("en-IE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(iso));
}

// Article scaffold shared by every blog post: header (breadcrumb, title, byline,
// hero), a two-column body (sticky TOC + prose), then FAQs, related posts and CTA.
export default function ArticleShell({
  post,
  children,
}: {
  post: BlogPost;
  children: ReactNode;
}) {
  return (
    <main className="min-h-screen bg-white text-black font-sans overflow-x-hidden">
      <MinimalHeader />

      {/* ── HEADER ─────────────────────────────────────── */}
      <header className="px-6 pt-32 md:pt-36 pb-10 max-w-3xl mx-auto">
        <Reveal y={16} duration={0.5} className="mb-6">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Guides", href: BLOG_BASE_PATH },
              { label: post.title },
            ]}
          />
        </Reveal>

        <Reveal
          as="p"
          immediate
          y={16}
          duration={0.6}
          className="text-xs font-bold tracking-[0.2em] uppercase text-sky-600 mb-4"
        >
          {post.cluster}
        </Reveal>

        <Reveal
          as="h1"
          immediate
          y={20}
          duration={0.8}
          className="text-4xl md:text-5xl font-bold tracking-tighter leading-[1.1] text-black mb-6"
        >
          {post.h1}
        </Reveal>

        <Reveal
          immediate
          y={16}
          delay={0.1}
          duration={0.6}
          className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-zinc-500 font-light"
        >
          <span className="font-medium text-zinc-700">{post.author}</span>
          <span className="text-zinc-300">·</span>
          <time dateTime={post.updatedDate}>
            Updated {formatDate(post.updatedDate)}
          </time>
          <span className="text-zinc-300">·</span>
          <span className="inline-flex items-center gap-1">
            <Clock size={13} className="text-zinc-400" />
            {post.readingTimeMins} min read
          </span>
        </Reveal>
      </header>

      {/* ── HERO IMAGE ─────────────────────────────────── */}
      <Reveal y={24} duration={0.7} className="px-6 max-w-5xl mx-auto mb-12">
        {/* biome-ignore lint/performance/noImgElement: remote hero image, intentional <img> per site convention */}
        <img
          src={post.heroImage}
          alt={post.heroAlt}
          className="w-full aspect-[16/9] object-cover rounded-[2rem] shadow-[0_30px_60px_rgba(0,0,0,0.12)]"
        />
      </Reveal>

      {/* ── BODY ───────────────────────────────────────── */}
      <div className="px-6 pb-8 max-w-6xl mx-auto">
        <div className="lg:grid lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-12">
          <TableOfContents items={post.toc} />
          <article className="max-w-3xl">
            {children}

            <div id="faqs" />
          </article>
        </div>
      </div>

      {/* ── FAQ (full-width band) ──────────────────────── */}
      <FAQSection
        data={{
          title: "Frequently Asked Questions",
          subtitle: `Common questions about ${post.primaryKeyword}.`,
          categories: [{ category: "FAQ", items: post.faqs }],
        }}
      />

      {/* ── RELATED + CTA ──────────────────────────────── */}
      <div className="px-6 pb-20 max-w-3xl mx-auto">
        <RelatedPosts slug={post.slug} />
        <BlogCTA />
      </div>
    </main>
  );
}
