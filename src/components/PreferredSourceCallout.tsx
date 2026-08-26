import PreferredSourceButton from "@/components/PreferredSourceButton";
import { Reveal } from "@/components/Reveal";

/**
 * End-of-article band offering the reader Google's preferred-sources opt-in.
 * Server component so only the button itself ships as client JS.
 *
 * Placement follows Google's guidance to sit it with the other audience CTAs
 * (RSS, social) rather than in the middle of the copy:
 * https://developers.google.com/search/docs/appearance/preferred-sources
 */
export default function PreferredSourceCallout({
  className = "",
}: {
  className?: string;
}) {
  return (
    <Reveal
      as="section"
      y={20}
      duration={0.6}
      className={[
        "flex flex-col gap-5 rounded-[1.75rem] border border-black/8 bg-zinc-50 px-7 py-6 sm:flex-row sm:items-center sm:justify-between",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div>
        <h2 className="text-lg font-bold tracking-tight text-black">
          You can make Providence Auto a preferred source on Google.
        </h2>
        {/* True on every page, not just dated reporting: the opt-in is
            domain-level, so a reader who takes it from a guide or the
            calculator gets the AI-surface badge across the whole site and the
            Top Stories effect on the news. Keep it that way if this is
            reworded — a claim that only holds on /latest-news would be wrong
            everywhere else it now appears. */}
        <p className="mt-1.5 text-sm font-light leading-relaxed text-zinc-500">
          Google then marks our pages as preferred in AI Overviews and AI Mode,
          and shows more of our reporting in your Top Stories.
        </p>
      </div>
      <div className="shrink-0">
        <PreferredSourceButton label="Add us as a preferred source" />
      </div>
    </Reveal>
  );
}
