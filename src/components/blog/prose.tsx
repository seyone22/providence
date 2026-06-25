import type { ReactNode } from "react";
import Link from "next/link";
import { Reveal } from "@/components/Reveal";

// ─────────────────────────────────────────────────────────────────────────────
// Prose kit — styled primitives for blog post bodies. Server-safe (no hooks):
// uses <Reveal>, which is presentational and driven by the global reveal runtime.
// Keeps every post on the site's rounded-card / zinc / sky-accent aesthetic.
// ─────────────────────────────────────────────────────────────────────────────

export function H2({ id, children }: { id?: string; children: ReactNode }) {
  return (
    <Reveal
      as="h2"
      id={id}
      y={24}
      duration={0.6}
      className="scroll-mt-28 text-3xl md:text-4xl font-bold tracking-tighter text-black mt-16 mb-5"
    >
      {children}
    </Reveal>
  );
}

export function H3({ id, children }: { id?: string; children: ReactNode }) {
  return (
    <h3
      id={id}
      className="scroll-mt-28 text-xl md:text-2xl font-bold tracking-tight text-black mt-10 mb-3"
    >
      {children}
    </h3>
  );
}

export function P({ children }: { children: ReactNode }) {
  return (
    <p className="text-lg leading-relaxed text-zinc-600 font-light mb-5">
      {children}
    </p>
  );
}

/** Larger intro paragraph used right under the H1. */
export function Lead({ children }: { children: ReactNode }) {
  return (
    <p className="text-xl md:text-2xl leading-relaxed text-zinc-700 font-light mb-8">
      {children}
    </p>
  );
}

export function UL({ children }: { children: ReactNode }) {
  return <ul className="mb-6 space-y-3">{children}</ul>;
}

export function OL({ children }: { children: ReactNode }) {
  return (
    <ol className="mb-6 space-y-3 list-decimal pl-5 marker:text-sky-500 marker:font-bold">
      {children}
    </ol>
  );
}

export function LI({ children }: { children: ReactNode }) {
  return (
    <li className="text-lg leading-relaxed text-zinc-600 font-light pl-1">
      {children}
    </li>
  );
}

/** Bulleted list item with a sky check/dot — for unordered lists. */
export function CheckLI({ children }: { children: ReactNode }) {
  return (
    <li className="flex gap-3 text-lg leading-relaxed text-zinc-600 font-light">
      <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-sky-500" />
      <span>{children}</span>
    </li>
  );
}

export function Strong({ children }: { children: ReactNode }) {
  return <strong className="font-semibold text-black">{children}</strong>;
}

/** Inline link — internal links use next/link, external pass-through. */
export function InlineLink({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  const external = href.startsWith("http");
  const cls =
    "font-medium text-sky-600 underline decoration-sky-600/30 hover:decoration-sky-600 underline-offset-2 transition";
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={cls}>
      {children}
    </Link>
  );
}

/** Highlighted callout box. Tone sets the accent colour. */
export function Callout({
  title,
  tone = "sky",
  children,
}: {
  title?: string;
  tone?: "sky" | "amber" | "emerald";
  children: ReactNode;
}) {
  const tones = {
    sky: "bg-sky-50 border-sky-200/70",
    amber: "bg-amber-50 border-amber-200/70",
    emerald: "bg-emerald-50 border-emerald-200/70",
  } as const;
  const titleTones = {
    sky: "text-sky-700",
    amber: "text-amber-700",
    emerald: "text-emerald-700",
  } as const;
  return (
    <Reveal
      y={20}
      duration={0.5}
      className={`my-8 rounded-2xl border ${tones[tone]} p-6`}
    >
      {title && (
        <p
          className={`text-xs font-bold tracking-[0.15em] uppercase mb-2 ${titleTones[tone]}`}
        >
          {title}
        </p>
      )}
      <div className="text-base leading-relaxed text-zinc-700 font-light [&>p:last-child]:mb-0 [&_p]:mb-3">
        {children}
      </div>
    </Reveal>
  );
}

/** Boxed "key takeaways" / TL;DR list near the top of a post. */
export function KeyTakeaways({ items }: { items: ReactNode[] }) {
  return (
    <Reveal
      y={20}
      duration={0.6}
      className="my-10 rounded-[1.75rem] border border-black/8 bg-zinc-50 p-7 md:p-8"
    >
      <p className="text-xs font-bold tracking-[0.2em] uppercase text-zinc-400 mb-5">
        The short version
      </p>
      <ul className="space-y-3">
        {items.map((item, i) => (
          <li
            key={i}
            className="flex gap-3 text-base md:text-lg leading-relaxed text-zinc-700 font-light"
          >
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-sky-500" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </Reveal>
  );
}

/** Small stat highlight cards in a responsive grid. */
export function StatGrid({
  stats,
}: {
  stats: { value: string; label: string }[];
}) {
  return (
    <div className="my-10 grid grid-cols-2 md:grid-cols-3 gap-4">
      {stats.map((s, i) => (
        <Reveal
          key={i}
          y={20}
          delay={i * 0.06}
          duration={0.5}
          className="rounded-2xl border border-black/8 bg-white p-6 text-center shadow-[0_10px_30px_rgba(0,0,0,0.03)]"
        >
          <p className="text-3xl md:text-4xl font-bold tracking-tight text-black">
            {s.value}
          </p>
          <p className="mt-1 text-sm text-zinc-500 font-light">{s.label}</p>
        </Reveal>
      ))}
    </div>
  );
}

/** Generic data table with a styled header row. */
export function Table({
  head,
  rows,
  caption,
}: {
  head: string[];
  rows: ReactNode[][];
  caption?: string;
}) {
  return (
    <Reveal y={20} duration={0.6} className="my-8">
      <div className="overflow-x-auto rounded-2xl border border-black/8 shadow-[0_10px_30px_rgba(0,0,0,0.03)]">
        <table className="w-full border-collapse text-left text-sm">
          <thead>
            <tr className="bg-black text-white">
              {head.map((h, i) => (
                <th
                  key={i}
                  className="px-4 py-3.5 font-semibold tracking-tight whitespace-nowrap"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, ri) => (
              <tr
                key={ri}
                className="border-t border-black/5 odd:bg-white even:bg-zinc-50/60"
              >
                {row.map((cell, ci) => (
                  <td
                    key={ci}
                    className="px-4 py-3.5 text-zinc-700 font-light align-top"
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {caption && (
        <p className="mt-2 px-1 text-xs text-zinc-400 font-light">{caption}</p>
      )}
    </Reveal>
  );
}

/** A vertical cost breakdown with a bold total — for worked landed-cost examples. */
export function CostTable({
  title,
  subtitle,
  rows,
  total,
}: {
  title: string;
  subtitle?: string;
  rows: { label: string; value: string; green?: boolean }[];
  total: { label: string; value: string };
}) {
  return (
    <Reveal
      y={24}
      duration={0.6}
      className="my-8 overflow-hidden rounded-[1.75rem] border border-black/8 bg-white shadow-[0_20px_40px_rgba(0,0,0,0.06)]"
    >
      <div className="bg-black px-7 py-5">
        <p className="font-bold text-white text-lg">{title}</p>
        {subtitle && <p className="text-white/50 text-sm mt-0.5">{subtitle}</p>}
      </div>
      <div className="px-7 py-5">
        {rows.map((row, i) => (
          <div
            key={i}
            className="flex justify-between items-center gap-4 py-3.5 border-b border-black/5"
          >
            <span className="text-zinc-600 text-sm">{row.label}</span>
            <span
              className={`text-sm font-bold whitespace-nowrap ${row.green ? "text-emerald-600" : "text-black"}`}
            >
              {row.value}
            </span>
          </div>
        ))}
        <div className="flex justify-between items-center gap-4 pt-5 mt-2 border-t-2 border-black">
          <span className="font-bold text-black">{total.label}</span>
          <span className="font-bold text-2xl text-black whitespace-nowrap">
            {total.value}
          </span>
        </div>
      </div>
    </Reveal>
  );
}

/** Indicative-figures / verify-with-Revenue disclaimer. */
export function Disclaimer({ children }: { children?: ReactNode }) {
  return (
    <p className="my-8 rounded-xl border border-black/5 bg-zinc-50 px-5 py-4 text-sm text-zinc-500 font-light leading-relaxed">
      {children ?? (
        <>
          Figures are indicative and for guidance only. Actual VRT is charged on
          Revenue&rsquo;s OMSP and varies by model, year and mileage. Always
          confirm current rates and your specific case with{" "}
          <a
            href="https://www.revenue.ie"
            target="_blank"
            rel="noopener noreferrer"
            className="underline decoration-zinc-300 hover:decoration-zinc-500"
          >
            Revenue.ie
          </a>{" "}
          before committing to a purchase.
        </>
      )}
    </p>
  );
}
