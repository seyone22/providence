import { ExternalLink } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import type { NewsSource } from "@/config/news";

// Outbound citation list rendered at the foot of every news article. News
// content makes factual claims about third parties, so the sources behind them
// are shown rather than left implicit.
export default function NewsSources({ sources }: { sources: NewsSource[] }) {
  if (sources.length === 0) return null;

  return (
    <Reveal
      y={20}
      duration={0.6}
      className="mt-14 rounded-[1.75rem] border border-black/8 bg-zinc-50 p-7 md:p-8"
    >
      <p className="text-xs font-bold tracking-[0.2em] uppercase text-zinc-400 mb-5">
        Sources
      </p>
      <ul className="space-y-3">
        {sources.map((source) => (
          <li key={source.href} className="flex gap-3">
            <ExternalLink
              size={14}
              className="mt-1.5 shrink-0 text-zinc-400"
              aria-hidden="true"
            />
            <span className="text-base leading-relaxed text-zinc-600 font-light">
              <a
                href={source.href}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-sky-600 underline decoration-sky-600/30 hover:decoration-sky-600 underline-offset-2 transition"
              >
                {source.label}
              </a>
              <span className="text-zinc-400"> &mdash; {source.publisher}</span>
            </span>
          </li>
        ))}
      </ul>
    </Reveal>
  );
}
