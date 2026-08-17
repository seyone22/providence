"use client";

import { useRef } from "react";
import { useInViewProgress } from "@/components/useInViewProgress";
import { digitCount, easeOutCubic, odometerColumn } from "@/lib/motion";

/**
 * A mechanical odometer that rolls up to a figure.
 *
 * Chosen over a plain count-up because the motion is the motif: on a car site an
 * odometer is not decoration, it is the instrument the number would actually
 * come from. It also reads correctly at a glance — the units column blurs while
 * the higher columns sit still and flick over, exactly as a real drum does,
 * which a text counter cannot convey.
 *
 * The per-column rotation is `odometerColumn` in lib/motion.ts: each column is a
 * strip of 0-9 translated by the digit plus the fraction of the way it has
 * turned, so the columns are geared to each other rather than animated
 * independently.
 */

type Props = {
  value: number;
  label?: string;
  /** Rendered before the number, e.g. a currency symbol. */
  prefix?: string;
  suffix?: string;
  /** Thousands separators. */
  grouped?: boolean;
  durationMs?: number;
  className?: string;
};

/** Height of one digit cell, in em, so the strip scales with font size. */
const CELL_EM = 1.15;

/**
 * Two full runs of 0-9, so a column can wrap from 9 round to 0 without the strip
 * snapping back mid-roll. Built once with stable ids — the strip never reorders,
 * it only slides.
 */
const DIGIT_STRIP = Array.from({ length: 20 }, (_, i) => ({
  id: `cell-${i}`,
  digit: i % 10,
}));

export default function OdometerCounter({
  value,
  label,
  prefix,
  suffix,
  grouped = true,
  durationMs = 2200,
  className = "",
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const progress = useInViewProgress(ref, durationMs);
  const current = value * easeOutCubic(progress);

  // Columns are built most-significant first for rendering, but each one's
  // place value counts up from the units end.
  const columns = digitCount(value);
  const places = Array.from({ length: columns }, (_, i) => columns - 1 - i);

  return (
    <div ref={ref} className={className}>
      <div
        className="flex items-baseline font-semibold tabular-nums"
        role="img"
        aria-label={`${prefix ?? ""}${value.toLocaleString("en-GB")}${suffix ?? ""}${label ? ` ${label}` : ""}`}
      >
        {prefix && <span aria-hidden>{prefix}</span>}
        {places.map((place, index) => {
          const offset = odometerColumn(current, place);
          // A separator before every third column from the right.
          const needsSeparator =
            grouped && place > 0 && place % 3 === 0 && index > 0;
          return (
            <span key={place} aria-hidden className="flex items-baseline">
              {needsSeparator && <span className="opacity-40">,</span>}
              <span
                className="relative inline-block overflow-hidden"
                style={{ height: `${CELL_EM}em`, width: "0.62em" }}
              >
                <span
                  className="absolute inset-x-0 top-0 flex flex-col items-center"
                  style={{ transform: `translateY(${-offset * CELL_EM}em)` }}
                >
                  {DIGIT_STRIP.map((cell) => (
                    <span
                      key={cell.id}
                      style={{
                        height: `${CELL_EM}em`,
                        lineHeight: `${CELL_EM}em`,
                      }}
                    >
                      {cell.digit}
                    </span>
                  ))}
                </span>
              </span>
            </span>
          );
        })}
        {suffix && <span aria-hidden>{suffix}</span>}
      </div>
      {label && (
        <p className="mt-1 text-xs uppercase tracking-[0.18em] text-zinc-400">
          {label}
        </p>
      )}
    </div>
  );
}
