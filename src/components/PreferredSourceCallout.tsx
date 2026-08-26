import PreferredSourceButton from "@/components/PreferredSourceButton";
import SecondaryCTA from "@/components/SecondaryCTA";

/**
 * The Google preferred-sources opt-in, as a standard secondary CTA.
 *
 * Placement follows Google's guidance to sit it with the other audience CTAs
 * (RSS, social) rather than mid-copy, and never above the page's primary CTA:
 * https://developers.google.com/search/docs/appearance/preferred-sources
 */
export default function PreferredSourceCallout({
  className = "",
}: {
  className?: string;
}) {
  return (
    <SecondaryCTA
      className={className}
      title="You can make Providence Auto a preferred source on Google."
      /* True on every page, not just dated reporting: the opt-in is
         domain-level, so a reader who takes it from a guide or the calculator
         gets the AI-surface badge across the whole site and the Top Stories
         effect on the news. Keep it that way if this is reworded — a claim
         that only holds on /latest-news would be wrong everywhere else it
         now appears. */
      body="Google then marks our pages as preferred in AI Overviews and AI Mode, and shows more of our reporting in your Top Stories."
      action={<PreferredSourceButton label="Add us as a preferred source" />}
    />
  );
}
