import { Clock } from "lucide-react";
import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { NEWS_BASE_PATH, type NewsArticle } from "@/config/news";

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("en-IE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(iso));
}

/** Grid card for a news story. Shared by the index and the category archives. */
export default function NewsCard({
  article,
  index = 0,
}: {
  article: NewsArticle;
  index?: number;
}) {
  return (
    <Reveal as="div" y={20} delay={index * 0.05} duration={0.5}>
      <Link
        href={`${NEWS_BASE_PATH}/${article.slug}`}
        className="group flex h-full flex-col overflow-hidden rounded-[1.5rem] border border-black/5 bg-white shadow-[0_10px_30px_rgba(0,0,0,0.03)] transition-all duration-300 hover:border-sky-500/20 hover:shadow-[0_20px_40px_rgba(0,0,0,0.07)]"
      >
        {/* biome-ignore lint/performance/noImgElement: remote hero image, intentional <img> per site convention */}
        <img
          src={article.heroImage}
          alt={article.heroAlt}
          width={800}
          height={450}
          loading="lazy"
          className="h-40 w-full object-cover"
        />
        <div className="p-6 flex flex-1 flex-col">
          <p className="text-xs font-bold tracking-[0.2em] uppercase text-zinc-400 mb-2">
            {article.category} &middot;{" "}
            <time dateTime={article.publishDate}>
              {formatDate(article.publishDate)}
            </time>
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
  );
}
