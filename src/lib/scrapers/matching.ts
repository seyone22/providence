// Matching layer — decides which scraped listings are genuinely the same car as
// the target, then ranks the best comparables.
//
// Priority (per product decision): MAKE + MODEL must match first (case-
// insensitive), then trim is applied as a *preference* — if requiring the trim
// would leave nothing, we fall back to model-level rather than showing no
// results. Engine/transmission are soft signals that only affect ranking.
// See memory: sourcing-scraper-spike.

import type { NormalizedListing } from "@/lib/market-stats";

// Normalise for comparison: lowercase, punctuation → spaces, collapse.
// "G-Class" → "g class", "3.0 TD V6" → "3 0 td v6".
function norm(s: string | null | undefined): string {
  return (s ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// Tokens for soft/trim matching. Keeps single-char designators ("g", "m", "3")
// because they are meaningful in car names (G-Class, BMW M, 3 Series).
export function tokenize(s: string): string[] {
  return Array.from(new Set(norm(s).split(" ").filter(Boolean)));
}

// Common short make names → the canonical value the listing sites use.
const MAKE_ALIASES: Record<string, string> = {
  benz: "Mercedes-Benz",
  mercedes: "Mercedes-Benz",
  "mercedes benz": "Mercedes-Benz",
  merc: "Mercedes-Benz",
  vw: "Volkswagen",
  "land-rover": "Land Rover",
  landrover: "Land Rover",
  "range rover": "Land Rover",
  chevy: "Chevrolet",
  "rolls royce": "Rolls-Royce",
};
export function canonicalMake(make: string): string {
  return MAKE_ALIASES[make.toLowerCase().trim()] ?? make.trim();
}

export interface MatchTarget {
  make: string; // e.g. "Porsche" / "Benz" (aliased internally)
  model: string; // e.g. "Macan" / "G-Class"
  trimTokens: string[]; // distinctive trim tokens (model words removed)
  refineTokens: string[]; // engine/transmission — ranking only
  year: number | null;
  mileage: number | null; // miles
}

// The listing's full identity text across all three name fields.
function haystack(l: NormalizedListing): string {
  return norm(`${l.make ?? ""} ${l.model ?? ""} ${l.trim ?? ""}`);
}

// MAKE + MODEL must both match (case-insensitive). Make: either name contains
// the other (handles "Mercedes" vs "Mercedes-Benz"). Model: the normalised model
// string appears as a phrase in the listing text (handles "G Class", "3 Series",
// single letters, and PistonHeads models that append the trim like "Macan Turbo").
export function matchesIdentity(
  l: NormalizedListing,
  target: MatchTarget,
): boolean {
  const tMake = norm(canonicalMake(target.make));
  const lMake = norm(l.make);
  const makeOk =
    tMake === "" ||
    lMake === "" ||
    lMake.includes(tMake) ||
    tMake.includes(lMake);

  const tModel = norm(target.model);
  const modelOk = tModel === "" || haystack(l).includes(tModel);

  return makeOk && modelOk;
}

function withinBands(
  l: NormalizedListing,
  target: MatchTarget,
  band: { yearBand: number; mileagePct: number },
): boolean {
  if (
    target.year != null &&
    l.year != null &&
    Math.abs(l.year - target.year) > band.yearBand
  ) {
    return false;
  }
  if (
    Number.isFinite(band.mileagePct) &&
    target.mileage != null &&
    l.mileage != null &&
    Math.abs(l.mileage - target.mileage) > target.mileage * band.mileagePct
  ) {
    return false;
  }
  return true;
}

export interface FilterResult {
  comparables: NormalizedListing[];
  trimApplied: boolean; // false = trim would have zeroed results, model-level used
}

// Filter to comparable listings: make+model identity + year/mileage bands, then
// prefer the trim-matching subset (all trim tokens present). If applying the
// trim leaves nothing, keep the model-level matches and flag trimApplied=false.
export function filterListings(
  listings: NormalizedListing[],
  target: MatchTarget,
  band: { yearBand: number; mileagePct: number },
): FilterResult {
  const base = listings.filter(
    (l) => matchesIdentity(l, target) && withinBands(l, target, band),
  );

  if (target.trimTokens.length === 0) {
    return { comparables: base, trimApplied: false };
  }
  const trimmed = base.filter((l) => {
    const hay = haystack(l);
    return target.trimTokens.every((t) => hay.includes(t));
  });
  return trimmed.length > 0
    ? { comparables: trimmed, trimApplied: true }
    : { comparables: base, trimApplied: false };
}

// How many engine/transmission tokens the listing matches (0 if none provided).
function refineScore(l: NormalizedListing, refineTokens: string[]): number {
  if (refineTokens.length === 0) return 0;
  const hay = haystack(l);
  return refineTokens.reduce((n, t) => n + (hay.includes(t) ? 1 : 0), 0);
}

// Rank comparables and keep the best `limit`: closest year first, then more
// engine/transmission matches (exact vehicle), then closest mileage.
export function selectTopComparables(
  listings: NormalizedListing[],
  target: MatchTarget,
  limit = 10,
): NormalizedListing[] {
  const { year: ty, mileage: tm, refineTokens } = target;
  const MAX = Number.MAX_VALUE;
  return [...listings]
    .sort((a, b) => {
      if (ty != null) {
        const ay = a.year != null ? Math.abs(a.year - ty) : MAX;
        const by = b.year != null ? Math.abs(b.year - ty) : MAX;
        if (ay !== by) return ay - by;
      }
      const ar = refineScore(a, refineTokens);
      const br = refineScore(b, refineTokens);
      if (ar !== br) return br - ar;
      if (tm != null) {
        const am = a.mileage != null ? Math.abs(a.mileage - tm) : MAX;
        const bm = b.mileage != null ? Math.abs(b.mileage - tm) : MAX;
        if (am !== bm) return am - bm;
      }
      return 0;
    })
    .slice(0, limit);
}
