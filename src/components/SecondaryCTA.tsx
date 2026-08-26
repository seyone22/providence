import type { ReactNode } from "react";
import { Reveal } from "@/components/Reveal";

/**
 * The site's standard **secondary** call to action.
 *
 * Use this for a real next step that is not the one the page exists to drive:
 * the preferred-source opt-in, RSS, a newsletter, "browse the guides". The
 * primary CTA on a page stays the black block (`BlogCTA` and its equivalents)
 * — this deliberately sits a rung below it.
 *
 * The surface itself is `.pa-cta-secondary` in globals.css, which carries the
 * sky→violet accent bar, the tinted wash and the lift shadow. Prefer this
 * component over the bare class so heading scale and padding stay consistent
 * across every secondary CTA on the site.
 *
 * Heading language follows CLAUDE.md: one heading says the whole thing, so
 * `title` is a full sentence and there is no eyebrow label above it. `body` is
 * optional and should carry a real fact, not restate the heading.
 */
export default function SecondaryCTA({
  title,
  body,
  action,
  className = "",
}: {
  /** A full sentence. No eyebrow label above it — see CLAUDE.md. */
  title: string;
  /** Optional. A real fact, not a restatement of the title. */
  body?: ReactNode;
  /** The button or link. Sits right on desktop, below the text on mobile. */
  action: ReactNode;
  className?: string;
}) {
  return (
    <Reveal
      as="section"
      y={20}
      duration={0.6}
      className={[
        "pa-cta-secondary flex flex-col gap-5 px-7 pt-7 pb-6 sm:flex-row sm:items-center sm:justify-between sm:gap-8",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div>
        <h2 className="text-lg font-bold tracking-tight text-black">{title}</h2>
        {body && (
          <p className="mt-1.5 text-sm font-light leading-relaxed text-zinc-600">
            {body}
          </p>
        )}
      </div>
      <div className="shrink-0">{action}</div>
    </Reveal>
  );
}
