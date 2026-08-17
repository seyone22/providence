import type { ReactNode } from "react";
import { Reveal } from "@/components/Reveal";

// ─────────────────────────────────────────────────────────────────────────────
// News-only prose primitives. The shared kit in components/blog/prose.tsx stays
// as-is — it serves evergreen guides. These are the editorial devices that only
// dated reporting needs: a pull quote, a chronology, a person dossier and an
// explicit confirmed/unconfirmed ledger.
//
// Server-safe (no hooks), same rounded-card / zinc / sky-accent aesthetic.
// ─────────────────────────────────────────────────────────────────────────────

/** Oversized pull quote used to break up a long narrative section. */
export function PullQuote({
  children,
  cite,
}: {
  children: ReactNode;
  cite?: string;
}) {
  return (
    <Reveal y={20} duration={0.6} className="my-10">
      <figure className="border-l-4 border-sky-500 pl-6 md:pl-8">
        <blockquote className="text-2xl md:text-3xl font-bold tracking-tight leading-snug text-black">
          {children}
        </blockquote>
        {cite && (
          <figcaption className="mt-3 text-sm text-zinc-500 font-light">
            &mdash; {cite}
          </figcaption>
        )}
      </figure>
    </Reveal>
  );
}

/** Chronology of an event — the beats of an auction night, a policy timetable. */
export function Timeline({
  items,
}: {
  items: { time: string; title: string; body: ReactNode }[];
}) {
  return (
    <div className="my-10">
      <ol className="relative border-l border-black/10 pl-7 md:pl-8 space-y-8">
        {items.map((item, i) => (
          <Reveal
            as="li"
            key={i}
            y={18}
            delay={i * 0.05}
            duration={0.5}
            className="relative"
          >
            <span className="absolute -left-[35px] md:-left-[39px] mt-1.5 h-3 w-3 rounded-full border-2 border-white bg-sky-500 shadow-[0_0_0_3px_rgba(14,165,233,0.15)]" />
            <p className="text-xs font-bold tracking-[0.2em] uppercase text-sky-600 mb-1.5">
              {item.time}
            </p>
            <p className="text-lg font-bold tracking-tight text-black mb-1.5">
              {item.title}
            </p>
            <div className="text-base leading-relaxed text-zinc-600 font-light">
              {item.body}
            </div>
          </Reveal>
        ))}
      </ol>
    </div>
  );
}

/** Dossier card for the person at the centre of a story. */
export function ProfileCard({
  name,
  subtitle,
  facts,
  children,
}: {
  name: string;
  subtitle?: string;
  facts: { label: string; value: string }[];
  children?: ReactNode;
}) {
  return (
    <Reveal
      y={24}
      duration={0.6}
      className="my-10 overflow-hidden rounded-[1.75rem] border border-black/8 bg-white shadow-[0_20px_40px_rgba(0,0,0,0.06)]"
    >
      <div className="bg-black px-7 py-6">
        <p className="text-xs font-bold tracking-[0.2em] uppercase text-white/40 mb-1.5">
          Who he is
        </p>
        <p className="text-2xl font-bold tracking-tight text-white">{name}</p>
        {subtitle && (
          <p className="text-white/50 text-sm mt-1 font-light">{subtitle}</p>
        )}
      </div>
      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 px-7 py-2">
        {facts.map((f, i) => (
          <div
            key={i}
            className="flex justify-between items-baseline gap-4 py-3.5 border-b border-black/5"
          >
            <dt className="text-sm text-zinc-500 font-light shrink-0">
              {f.label}
            </dt>
            <dd className="text-sm font-bold text-black text-right">
              {f.value}
            </dd>
          </div>
        ))}
      </dl>
      {children && (
        <div className="px-7 py-6 text-base leading-relaxed text-zinc-600 font-light [&>p:last-child]:mb-0 [&_p]:mb-3">
          {children}
        </div>
      )}
    </Reveal>
  );
}

/**
 * Explicit split between what is on the record and what is not. News pieces get
 * scraped and re-reported, so the distinction has to survive being quoted out of
 * context — hence two visually distinct columns rather than a hedging sentence.
 */
export function ConfirmedLedger({
  confirmed,
  unconfirmed,
}: {
  confirmed: ReactNode[];
  unconfirmed: ReactNode[];
}) {
  return (
    <div className="my-10 grid gap-4 md:grid-cols-2">
      <Reveal
        y={20}
        duration={0.5}
        className="rounded-2xl border border-emerald-200/70 bg-emerald-50 p-6"
      >
        <p className="text-xs font-bold tracking-[0.15em] uppercase text-emerald-700 mb-4">
          On the record
        </p>
        <ul className="space-y-3">
          {confirmed.map((item, i) => (
            <li
              key={i}
              className="flex gap-3 text-base leading-relaxed text-zinc-700 font-light"
            >
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </Reveal>
      <Reveal
        y={20}
        delay={0.06}
        duration={0.5}
        className="rounded-2xl border border-amber-200/70 bg-amber-50 p-6"
      >
        <p className="text-xs font-bold tracking-[0.15em] uppercase text-amber-700 mb-4">
          Still not established
        </p>
        <ul className="space-y-3">
          {unconfirmed.map((item, i) => (
            <li
              key={i}
              className="flex gap-3 text-base leading-relaxed text-zinc-700 font-light"
            >
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </Reveal>
    </div>
  );
}
