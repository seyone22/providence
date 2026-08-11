"use client";

// ─────────────────────────────────────────────────────────────────────────────
// "Where are we landing it?" — the destination country picker used at the top
// of a sourcing landing page, plus the panel that expands underneath it once a
// country is chosen.
//
// Extracted from the Japanese-import page so the India page (and any future
// source-country page) renders the same thing rather than a near-copy that
// drifts. The *content* stays per-page: destination rules are written against
// the country the cars are bought in, and duty that applies to a Japan-built
// car does not necessarily apply to an India-built one.
// ─────────────────────────────────────────────────────────────────────────────

import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Globe2, MapPin } from "lucide-react";
import Link from "next/link";
import type { ComponentType } from "react";

export type Destination = {
  key: string;
  label: string;
  /**
   * Must match an `n` value in the request form's COUNTRIES list so the
   * countryOfImport prefill selects a valid option (and auto-syncs the phone
   * country code). null means "let the customer type it".
   */
  formCountry: string | null;
  headline: string;
  body: string;
  facts: {
    icon: ComponentType<{ size?: number; className?: string }>;
    label: string;
  }[];
  popular: string;
  /** Dedicated guide for this destination. null hides the secondary CTA. */
  readMoreHref: string | null;
  /** Overrides the default "Read more about importing a car to {label}". */
  readMoreLabel?: string;
};

/**
 * The country chips. Sits inside the hero, so the caller supplies its own
 * Reveal wrapper and can override the label styling to suit that hero's
 * background treatment.
 */
export function DestinationChips({
  destinations,
  selected,
  onSelect,
  label = "Where are we landing it?",
  labelClassName = "pa-text-scrim text-xs font-bold tracking-[0.25em] text-zinc-600 uppercase mb-4",
}: {
  destinations: Destination[];
  selected: Destination | null;
  onSelect: (dest: Destination) => void;
  label?: string;
  labelClassName?: string;
}) {
  return (
    <>
      <p className={labelClassName}>{label}</p>
      <div className="flex flex-wrap justify-center gap-2 md:gap-3 max-w-3xl">
        {destinations.map((dest) => (
          <button
            key={dest.key}
            type="button"
            aria-pressed={selected?.key === dest.key}
            onClick={() => onSelect(dest)}
            className={`px-5 py-2.5 rounded-full text-sm font-bold border transition-all duration-300 backdrop-blur-sm ${
              selected?.key === dest.key
                ? "bg-black text-white border-black shadow-[0_10px_30px_rgba(0,0,0,0.2)]"
                : "bg-white/80 text-black border-black/15 hover:border-black/40 hover:-translate-y-0.5"
            }`}
          >
            {dest.label}
          </button>
        ))}
      </div>
    </>
  );
}

/**
 * The panel below the hero. Before a country is picked it explains the service
 * in general terms (`emptyHeadline` / `emptyBody`); after, it swaps to that
 * country's rules, facts and CTA.
 */
export function DestinationPanel({
  destination,
  emptyHeadline,
  emptyBody,
  id = "destination",
  ctaHref = "#inquiry",
}: {
  destination: Destination | null;
  emptyHeadline: string;
  emptyBody: string;
  id?: string;
  ctaHref?: string;
}) {
  return (
    <section
      id={id}
      className="px-6 bg-white relative z-10 border-t border-black/5 scroll-mt-24"
    >
      <div className="max-w-[1100px] mx-auto py-16 md:py-20">
        <AnimatePresence mode="wait">
          {destination ? (
            <motion.div
              key={destination.key}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35 }}
              className="rounded-[2.5rem] border border-black/8 bg-white shadow-[0_20px_50px_rgba(0,0,0,0.06)] p-8 md:p-12"
            >
              <div className="flex items-center gap-2 mb-4 text-zinc-500">
                <MapPin size={16} className="text-black" />
                <span className="text-xs font-bold tracking-[0.25em] uppercase">
                  Importing to {destination.label}
                </span>
              </div>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tighter text-black mb-5">
                {destination.headline}
              </h2>
              <p className="text-lg text-zinc-500 font-light leading-relaxed mb-8 max-w-3xl">
                {destination.body}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                {destination.facts.map((fact) => (
                  <div
                    key={fact.label}
                    className="flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-zinc-50 border border-black/5 text-sm font-medium text-zinc-700"
                  >
                    <fact.icon size={17} className="text-black shrink-0" />
                    {fact.label}
                  </div>
                ))}
              </div>

              <p className="text-sm font-medium text-zinc-400 mb-8">
                {destination.popular}
              </p>

              <div className="flex flex-wrap items-center gap-4">
                <a
                  href={ctaHref}
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-black text-white font-bold hover:scale-105 transition-transform"
                >
                  Start your {destination.label} inquiry
                  <ArrowRight size={17} />
                </a>
                {destination.readMoreHref && (
                  <Link
                    href={destination.readMoreHref}
                    className="inline-flex items-center gap-2 px-8 py-4 rounded-full border border-black/20 font-medium hover:bg-black hover:text-white transition-colors duration-300"
                  >
                    {destination.readMoreLabel ||
                      `Read more about importing a car to ${destination.label}`}
                    <ArrowRight size={17} />
                  </Link>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="unselected"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35 }}
              className="rounded-[2.5rem] border border-dashed border-black/15 bg-zinc-50/60 p-10 md:p-14 text-center"
            >
              <Globe2 size={28} className="mx-auto mb-4 text-zinc-400" />
              <h2 className="text-2xl md:text-4xl font-bold tracking-tighter text-black mb-3">
                {emptyHeadline}
              </h2>
              <p className="text-lg text-zinc-500 font-light max-w-3xl mx-auto">
                {emptyBody}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
