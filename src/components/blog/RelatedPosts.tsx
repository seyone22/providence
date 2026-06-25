import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { getRelated, BLOG_BASE_PATH } from "@/config/blog";

// Internal-linking block: surfaces the registry `related` posts for the cluster.
export default function RelatedPosts({ slug }: { slug: string }) {
  const related = getRelated(slug);
  if (related.length === 0) return null;

  return (
    <section className="mt-16 border-t border-black/8 pt-12">
      <Reveal
        as="h2"
        y={20}
        duration={0.6}
        className="text-2xl md:text-3xl font-bold tracking-tighter text-black mb-8"
      >
        Keep reading
      </Reveal>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {related.map((post, i) => (
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
  );
}
