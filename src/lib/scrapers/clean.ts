// Data-hygiene and cross-source deduplication for scraped listings, applied
// before matching/stats. The spike surfaced near-delivery cars (10 mi, missing
// year) skewing figures, and the same car appears on multiple sites.
// See memory: sourcing-scraper-spike.

import type { NormalizedListing } from "@/lib/market-stats";

// Drop listings that can't be trusted in the stats:
//  - no usable price or year (year is needed for the matcher's year window)
//  - implausibly low mileage (< 100 mi) — these are new/delivery cars, a
//    different market from a used import comparison.
export function cleanListings(
  listings: NormalizedListing[],
): NormalizedListing[] {
  return listings.filter((l) => {
    if (!(typeof l.price === "number" && l.price > 0)) return false;
    if (l.year == null) return false;
    if (l.mileage != null && l.mileage < 100) return false;
    return true;
  });
}

// Collapse near-duplicate listings (the same physical car cross-posted on
// AutoTrader, CarGurus and PistonHeads). We rarely get a reg/VIN, so dedupe
// heuristically: same year, mileage within ~500 mi, price within ~£250.
export function dedupeListings(
  listings: NormalizedListing[],
): NormalizedListing[] {
  const seen = new Set<string>();
  const out: NormalizedListing[] = [];
  for (const l of listings) {
    const key = [
      l.year ?? "?",
      Math.round((l.mileage ?? 0) / 500),
      Math.round((l.price ?? 0) / 250),
    ].join("|");
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(l);
  }
  return out;
}
