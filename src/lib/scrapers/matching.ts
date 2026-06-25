// Matching layer — filters scraped listings to ones that are genuinely the same
// make + model + trim as the target, within operator-set year/mileage bands,
// then ranks the best comparables. Strictness is deliberate: every required
// keyword (model + trim tokens) must appear in the listing's make+model+trim
// text. Engine/transmission tokens refine the ranking ("exact vehicle").
// See memory: sourcing-scraper-spike.

import type { NormalizedListing } from "@/lib/market-stats";

// Normalise for token matching: lowercase, punctuation → spaces, collapse.
// e.g. "G-Class" → "g class", "3.0 TD V6" → "3 0 td v6".
function norm(s: string | null | undefined): string {
  return (s ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// Split a string into distinct, meaningful tokens (drops 1-char noise).
export function tokenize(s: string): string[] {
  return Array.from(
    new Set(
      norm(s)
        .split(" ")
        .filter((w) => w.length > 1),
    ),
  );
}

export interface MatchTarget {
  // Required identity tokens (model + trim). ALL must appear in the listing's
  // combined make+model+trim text for it to count as comparable.
  keywords: string[];
  // Soft tokens (engine size, transmission) used only to rank toward the exact
  // vehicle — never to exclude, so they can't zero out the results.
  refineTokens: string[];
  year: number | null;
  mileage: number | null; // miles
}

// The full identity text of a listing across all three name fields.
function haystack(l: NormalizedListing): string {
  return norm(`${l.make ?? ""} ${l.model ?? ""} ${l.trim ?? ""}`);
}

function matchesIdentity(l: NormalizedListing, target: MatchTarget): boolean {
  if (target.keywords.length === 0) return true;
  const hay = haystack(l);
  return target.keywords.every((kw) => hay.includes(kw));
}

// Filter to listings that match the identity (make+model+trim) and fall within
// the configured year/mileage tolerances.
export function filterListings(
  listings: NormalizedListing[],
  target: MatchTarget,
  band: { yearBand: number; mileagePct: number },
): NormalizedListing[] {
  return listings.filter((l) => {
    if (!matchesIdentity(l, target)) return false;
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
  });
}

// How many engine/transmission tokens the listing matches (0 if none provided).
function refineScore(l: NormalizedListing, refineTokens: string[]): number {
  if (refineTokens.length === 0) return 0;
  const hay = haystack(l);
  return refineTokens.reduce((n, t) => n + (hay.includes(t) ? 1 : 0), 0);
}

// Rank comparables and keep the best `limit`. Priority: closest year first, then
// engine/transmission match (exact vehicle), then closest mileage.
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
        if (ay !== by) return ay - by; // closest year first
      }
      const ar = refineScore(a, refineTokens);
      const br = refineScore(b, refineTokens);
      if (ar !== br) return br - ar; // more engine/transmission matches first
      if (tm != null) {
        const am = a.mileage != null ? Math.abs(a.mileage - tm) : MAX;
        const bm = b.mileage != null ? Math.abs(b.mileage - tm) : MAX;
        if (am !== bm) return am - bm; // then closest mileage
      }
      return 0;
    })
    .slice(0, limit);
}
