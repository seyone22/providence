"use client";

import { useRef } from "react";
import { useInViewProgress } from "@/components/useInViewProgress";
import { easeOutCubic, segmentWindow, windowProgress } from "@/lib/motion";
import {
  computeLandedCost,
  type DutyBasis,
  fmtGBP,
  type VatBasis,
} from "@/lib/uk-landed-cost";

/**
 * Animated build-up of a landed cost: the segments grow left to right in the
 * order the money is actually spent, and the total counts up alongside them.
 *
 * The point of the animation is the argument — that the auction price is only
 * part of what a car costs to land, and that duty and VAT stack on top of a CIF
 * figure that already includes freight. A static stacked bar states that; a bar
 * that builds makes you watch it happen.
 *
 * ## Numbers are computed, never written down
 *
 * Every figure comes from `computeLandedCost` in lib/uk-landed-cost.ts — the
 * same HMRC-derived engine the admin sourcing tool uses. Nothing here hardcodes
 * a duty or VAT rate, so this cannot drift from the real calculator, and a
 * change in the tariff model shows up here automatically. Do not replace these
 * with literals.
 */

export type LandedCostBarProps = {
  /** CIF components in the origin currency (JPY for a Japanese auction car). */
  hammerPrice?: number;
  auctionExportFees?: number;
  inlandTransportOrigin?: number;
  oceanFreight?: number;
  marineInsurance?: number;
  /** GBP per 1 unit of the origin currency. */
  fxRate?: number;
  dutyBasis?: DutyBasis;
  vatBasis?: VatBasis;
  /** UK-side costs in GBP. */
  postBorderTotal?: number;
  className?: string;
};

/**
 * A representative Japanese auction purchase. Indicative only — the FX rate in
 * particular is a level, not a forecast, and HMRC uses its own published monthly
 * rate for the official figure.
 */
const EXAMPLE = {
  hammerPrice: 2_400_000,
  auctionExportFees: 180_000,
  inlandTransportOrigin: 45_000,
  oceanFreight: 190_000,
  marineInsurance: 22_000,
  fxRate: 0.0052,
  dutyBasis: "japan_cepa" as DutyBasis,
  vatBasis: "standard" as VatBasis,
  postBorderTotal: 1000,
};

export default function LandedCostBar({
  hammerPrice = EXAMPLE.hammerPrice,
  auctionExportFees = EXAMPLE.auctionExportFees,
  inlandTransportOrigin = EXAMPLE.inlandTransportOrigin,
  oceanFreight = EXAMPLE.oceanFreight,
  marineInsurance = EXAMPLE.marineInsurance,
  fxRate = EXAMPLE.fxRate,
  dutyBasis = EXAMPLE.dutyBasis,
  vatBasis = EXAMPLE.vatBasis,
  postBorderTotal = EXAMPLE.postBorderTotal,
  className = "",
}: LandedCostBarProps) {
  const ref = useRef<HTMLDivElement>(null);
  const progress = useInViewProgress(ref, 2000);

  const result = computeLandedCost({
    currency: "JPY",
    hammerPrice,
    auctionExportFees,
    inlandTransportOrigin,
    oceanFreight,
    marineInsurance,
    fxRate,
    dutyBasis,
    vatBasis,
    postBorderTotal,
  });

  // The CIF is split into "the car" and "getting it to the water" so the bar
  // shows that freight is inside the value duty is charged on, rather than a
  // line item bolted on at the end.
  const carGbp = (hammerPrice + auctionExportFees) * fxRate;
  const freightGbp =
    (inlandTransportOrigin + oceanFreight + marineInsurance) * fxRate;

  const segments = [
    { label: "Vehicle + auction fees", value: carGbp, colour: "#0ea5e9" },
    { label: "Freight + insurance", value: freightGbp, colour: "#2dd4bf" },
    {
      label: `Duty ${(result.dutyRate * 100).toFixed(0)}%`,
      value: result.duty,
      colour: "#8b5cf6",
    },
    {
      label: `Import VAT ${(result.vatEffectiveRate * 100).toFixed(0)}%`,
      value: result.vat,
      colour: "#ec4899",
    },
    {
      label: "UK-side costs",
      value: result.postBorderTotal,
      colour: "#f59e0b",
    },
  ].filter((segment) => segment.value > 0);

  const total = result.totalLanded;
  const eased = easeOutCubic(progress);

  return (
    <div ref={ref} className={className}>
      <div className="mb-3 flex items-baseline justify-between gap-4">
        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400">
          Landed in the UK
        </span>
        <span className="font-semibold text-2xl tabular-nums text-zinc-900">
          {fmtGBP(total * eased)}
        </span>
      </div>

      <div className="flex h-4 w-full overflow-hidden rounded-full bg-zinc-100">
        {segments.map((segment, index) => {
          const slot = segmentWindow(index, segments.length, 0.45);
          const grown = easeOutCubic(windowProgress(progress, slot));
          return (
            <div
              key={segment.label}
              className="h-full"
              style={{
                width: `${(segment.value / total) * 100 * grown}%`,
                background: segment.colour,
              }}
            />
          );
        })}
      </div>

      <ul className="mt-5 grid gap-x-6 gap-y-2 sm:grid-cols-2">
        {segments.map((segment, index) => {
          const slot = segmentWindow(index, segments.length, 0.45);
          const shown = windowProgress(progress, slot);
          return (
            <li
              key={segment.label}
              className="flex items-center justify-between gap-3 text-sm transition-opacity duration-300"
              style={{ opacity: 0.25 + shown * 0.75 }}
            >
              <span className="flex items-center gap-2 text-zinc-600">
                <span
                  aria-hidden
                  className="size-2.5 shrink-0 rounded-full"
                  style={{ background: segment.colour }}
                />
                {segment.label}
              </span>
              <span className="tabular-nums text-zinc-900">
                {fmtGBP(segment.value * easeOutCubic(shown))}
              </span>
            </li>
          );
        })}
      </ul>

      <p className="mt-5 text-xs leading-relaxed text-zinc-400">
        Indicative. Duty and VAT are charged on the customs valuation basis, not
        the purchase price, and the rate depends on origin and the statement of
        origin held. Confirm against the UK Trade Tariff before committing to a
        purchase.
      </p>
    </div>
  );
}
