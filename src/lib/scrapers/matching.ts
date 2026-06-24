// Matching layer — filters normalised listings down to ones genuinely
// comparable to the target vehicle, with an auto-widen ladder for thin supply.
// Per the product decision: default "tight", auto-widen + flag when too few.
// See memory: sourcing-scraper-spike.

import type { NormalizedListing } from "@/lib/market-stats";

export type MatchStrictness = "tight" | "medium" | "wide" | "loose";

interface Band {
  yearBand: number; // ± years
  mileagePct: number; // ± fraction of target mileage (Infinity = ignore)
  matchTrim: boolean; // require trim keywords to be present
}

// The ladder widens year/mileage first and keeps the trim constraint as long as
// possible — only "loose" drops it. This avoids the failure seen in the spike
// where widening a rare high-trim (Macan Turbo) jumped straight to base models.
export const MATCH_BANDS: Record<MatchStrictness, Band> = {
  tight: { yearBand: 1, mileagePct: 0.2, matchTrim: true },
  medium: { yearBand: 2, mileagePct: 0.35, matchTrim: true },
  wide: { yearBand: 3, mileagePct: 0.5, matchTrim: true },
  loose: {
    yearBand: 3,
    mileagePct: Number.POSITIVE_INFINITY,
    matchTrim: false, // last resort: model-level, trim dropped
  },
};

const LADDER: MatchStrictness[] = ["tight", "medium", "wide", "loose"];

export interface MatchTarget {
  // Lower-cased keywords that must all appear in a listing's trim string
  // (e.g. ["turbo"] for a Macan Turbo). Empty = no trim constraint.
  trimKeywords: string[];
  year: number | null;
  mileage: number | null; // miles
}

function matchesBand(
  listing: NormalizedListing,
  target: MatchTarget,
  band: Band,
): boolean {
  // Trim keywords (all must be present in the listing trim).
  if (band.matchTrim && target.trimKeywords.length > 0) {
    const hay = (listing.trim ?? "").toLowerCase();
    if (!target.trimKeywords.every((kw) => hay.includes(kw))) return false;
  }
  // Year window.
  if (target.year != null && listing.year != null) {
    if (Math.abs(listing.year - target.year) > band.yearBand) return false;
  }
  // Mileage window (skipped when band is Infinity or data missing).
  if (
    Number.isFinite(band.mileagePct) &&
    target.mileage != null &&
    listing.mileage != null
  ) {
    const tol = target.mileage * band.mileagePct;
    if (Math.abs(listing.mileage - target.mileage) > tol) return false;
  }
  return true;
}

// Filter to listings within explicit, operator-configured year/mileage
// tolerances (keeps the trim constraint). Used when the operator sets the
// market-match parameters by hand instead of relying on the auto-widen ladder.
export function filterListings(
  listings: NormalizedListing[],
  target: MatchTarget,
  band: { yearBand: number; mileagePct: number },
): NormalizedListing[] {
  return listings.filter((l) =>
    matchesBand(l, target, { ...band, matchTrim: true }),
  );
}

export interface MatchResult {
  listings: NormalizedListing[];
  strictnessUsed: MatchStrictness;
  widened: boolean; // true if we relaxed past the requested strictness
  requested: MatchStrictness;
}

// Filter at the requested strictness; if fewer than `minCount` match, step down
// the ladder (tight → medium → loose) until we clear the threshold or run out.
export function selectMatches(
  listings: NormalizedListing[],
  target: MatchTarget,
  requested: MatchStrictness = "tight",
  minCount = 5,
): MatchResult {
  const startIdx = LADDER.indexOf(requested);
  let last: { level: MatchStrictness; matched: NormalizedListing[] } | null =
    null;

  for (let i = startIdx; i < LADDER.length; i++) {
    const level = LADDER[i];
    const matched = listings.filter((l) =>
      matchesBand(l, target, MATCH_BANDS[level]),
    );
    last = { level, matched };
    if (matched.length >= minCount) {
      return {
        listings: matched,
        strictnessUsed: level,
        widened: i > startIdx,
        requested,
      };
    }
  }

  // Never cleared the threshold — return the loosest attempt (best effort).
  return {
    listings: last?.matched ?? [],
    strictnessUsed: last?.level ?? requested,
    widened: (last ? LADDER.indexOf(last.level) : startIdx) > startIdx,
    requested,
  };
}
