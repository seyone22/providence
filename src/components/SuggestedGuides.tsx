"use client";

import { ArrowRight, BookOpen, Clock } from "lucide-react";
import Link from "next/link";

/**
 * Flat shape the inquiry form receives from `submitContactPreferences`. Kept
 * separate from the full `BlogPost` type on purpose — the blog registry is
 * ~2,000 lines of metadata and has no business in the client bundle.
 */
export type SuggestedGuide = {
  title: string;
  excerpt: string;
  href: string;
  readingTimeMins: number;
};

/**
 * Suggested reading shown on the inquiry form's success screen. A lead is at
 * their most curious right after submitting, so we point them at the guides for
 * their destination country rather than letting the page dead-end.
 */
export default function SuggestedGuides({
  guides,
  destinationCountry,
}: {
  guides: SuggestedGuide[];
  destinationCountry?: string;
}) {
  if (!guides.length) return null;

  return (
    <div className="w-full max-w-2xl mt-12 pt-10 border-t border-black/5 text-left">
      <div className="flex items-center gap-2 mb-2">
        <BookOpen size={18} className="text-[#4da8da]" />
        <h3 className="text-lg font-bold tracking-tight text-black">
          While you wait — worth reading
        </h3>
      </div>
      <p className="text-sm text-zinc-500 mb-6 leading-relaxed">
        {destinationCountry
          ? `Most of what surprises people about importing into ${destinationCountry} is knowable up front. Start here:`
          : "Most of what surprises people about importing is knowable up front. Start here:"}
      </p>

      <div className="flex flex-col gap-3">
        {guides.map((guide) => (
          <Link
            key={guide.href}
            href={guide.href}
            className="group block rounded-2xl border border-black/[0.07] bg-zinc-50/60 hover:bg-white hover:border-black/10 p-5 transition-colors"
          >
            <p className="font-bold text-black text-base leading-snug mb-1 group-hover:text-[#4da8da] transition-colors">
              {guide.title}
            </p>
            <p className="text-sm text-zinc-500 font-light leading-relaxed mb-3">
              {guide.excerpt}
            </p>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-400">
              <Clock size={13} />
              {guide.readingTimeMins} min read
            </span>
          </Link>
        ))}
      </div>

      <Link
        href="/blog"
        className="group mt-6 inline-flex items-center gap-2 text-sm font-bold text-[#4da8da] hover:text-[#3d92c2] transition-colors"
      >
        Browse all import guides
        <ArrowRight
          size={16}
          className="group-hover:translate-x-1 transition-transform"
        />
      </Link>
    </div>
  );
}
