import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import MinimalHeader from "@/components/MinimalHeader";
import { Reveal } from "@/components/Reveal";
import {
  BLOG_POSTS,
  getPostsByCluster,
  getPost,
  BLOG_BASE_PATH,
} from "@/config/blog";
import BlogCTA from "@/components/blog/BlogCTA";

const SITE = "https://www.providenceauto.co.uk";
const PATH = "/blog";
const TITLE =
  "Importing a Car to Ireland: Guides on Cost, Tax & the Cheapest Cars";
const DESCRIPTION =
  "Practical guides to importing a car to Ireland in 2026 — what it costs, the cheapest cars and the cheapest way to import, VRT explained, and whether to buy from Japan or the UK.";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: [
    "import cars to ireland",
    "importing a car to ireland",
    "cheapest cars to import to ireland",
    "cheapest way to import a car to ireland",
    "cost of importing a car to ireland",
    "vrt ireland",
  ],
  alternates: { canonical: PATH },
  openGraph: {
    type: "website",
    locale: "en_IE",
    url: `${SITE}${PATH}`,
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

export default function BlogIndexPage() {
  const pillar = getPost("importing-cars-to-ireland");
  const groups = getPostsByCluster();

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
      { "@type": "ListItem", position: 2, name: "Guides", item: `${SITE}${PATH}` },
    ],
  };

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: BLOG_POSTS.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: p.title,
      url: `${SITE}${BLOG_BASE_PATH}/${p.slug}`,
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
            Import Guides
          </Reveal>
          <Reveal
            as="h1"
            immediate
            y={20}
            duration={0.8}
            className="text-4xl md:text-6xl font-bold tracking-tighter leading-[1.1] mb-6"
          >
            Importing a car to Ireland,
            <br className="hidden md:block" /> explained properly.
          </Reveal>
          <Reveal
            immediate
            y={16}
            delay={0.1}
            duration={0.6}
            className="text-xl text-zinc-500 font-light max-w-2xl mx-auto"
          >
            Clear, up-to-date guides on what it costs, the cheapest cars and the
            cheapest way to import, and how the taxes actually work in 2026.
          </Reveal>
        </section>

        {/* ── FEATURED PILLAR ──────────────────────── */}
        {pillar && (
          <section className="px-6 max-w-5xl mx-auto mb-16">
            <Reveal y={24} duration={0.7}>
              <Link
                href={`${BLOG_BASE_PATH}/${pillar.slug}`}
                className="group grid md:grid-cols-2 gap-0 overflow-hidden rounded-[2rem] border border-black/8 bg-white shadow-[0_20px_50px_rgba(0,0,0,0.06)] transition-shadow hover:shadow-[0_30px_60px_rgba(0,0,0,0.1)]"
              >
                {/* biome-ignore lint/performance/noImgElement: remote hero image, intentional <img> per site convention */}
                <img
                  src={pillar.heroImage}
                  alt={pillar.heroAlt}
                  className="h-56 md:h-full w-full object-cover"
                />
                <div className="p-8 md:p-10 flex flex-col justify-center">
                  <p className="text-xs font-bold tracking-[0.2em] uppercase text-sky-600 mb-3">
                    Start here · Complete guide
                  </p>
                  <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-black group-hover:text-sky-600 transition-colors mb-3">
                    {pillar.title}
                  </h2>
                  <p className="text-zinc-500 font-light leading-relaxed mb-5">
                    {pillar.excerpt}
                  </p>
                  <span className="inline-flex items-center gap-2 text-sm font-bold text-sky-600">
                    Read the guide
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

        {/* ── CLUSTERS ─────────────────────────────── */}
        <section className="px-6 max-w-6xl mx-auto pb-12">
          {groups.map((group) => {
            const posts = group.posts.filter((p) => !p.isPillar);
            if (posts.length === 0) return null;
            return (
              <div key={group.cluster} className="mb-16">
                <Reveal y={20} duration={0.5} className="flex items-center gap-4 mb-6">
                  <p className="text-xs font-bold tracking-[0.3em] text-zinc-400 uppercase shrink-0">
                    {group.cluster}
                  </p>
                  <div className="flex-1 h-px bg-black/5" />
                </Reveal>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {posts.map((post, i) => (
                    <Reveal as="div" key={post.slug} y={20} delay={i * 0.05} duration={0.5}>
                      <Link
                        href={`${BLOG_BASE_PATH}/${post.slug}`}
                        className="group flex h-full flex-col overflow-hidden rounded-[1.5rem] border border-black/5 bg-white shadow-[0_10px_30px_rgba(0,0,0,0.03)] transition-all duration-300 hover:border-sky-500/20 hover:shadow-[0_20px_40px_rgba(0,0,0,0.07)]"
                      >
                        {/* biome-ignore lint/performance/noImgElement: remote hero image, intentional <img> per site convention */}
                        <img
                          src={post.heroImage}
                          alt={post.heroAlt}
                          className="h-40 w-full object-cover"
                        />
                        <div className="p-6 flex flex-1 flex-col">
                          <h3 className="text-lg font-bold text-black group-hover:text-sky-600 transition-colors mb-2">
                            {post.title}
                          </h3>
                          <p className="text-sm text-zinc-500 font-light leading-relaxed flex-1">
                            {post.excerpt}
                          </p>
                          <span className="mt-4 inline-flex items-center gap-1.5 text-xs text-zinc-400 font-medium">
                            <Clock size={12} />
                            {post.readingTimeMins} min read
                          </span>
                        </div>
                      </Link>
                    </Reveal>
                  ))}
                </div>
              </div>
            );
          })}
        </section>

        {/* ── CTA ──────────────────────────────────── */}
        <div className="px-6 pb-20 max-w-3xl mx-auto">
          <BlogCTA />
        </div>
      </main>
    </>
  );
}
