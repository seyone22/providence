// PistonHeads adapter — maps a raw `parseforge/pistonheads-scraper` dataset item
// to a NormalizedListing. Output is already clean and parametric (driven by
// make/model directly). Prices are GBP and mileage is in miles (UK site), so no
// conversion is needed. See memory: sourcing-scraper-spike.

import type { NormalizedListing } from "@/lib/market-stats";

interface PistonHeadsItem {
  url?: string;
  headline?: string; // e.g. "2016 PORSCHE MACAN (95B) TURBO PDK"
  make?: string;
  model?: string; // includes the trim, e.g. "Macan Turbo"
  year?: number;
  mileage?: number; // miles
  price?: number; // GBP (0 when price-on-application)
  isPriceOnApplication?: boolean;
}

export function mapPistonHeadsItem(raw: PistonHeadsItem): NormalizedListing {
  return {
    source: "pistonheads",
    url: raw.url ?? null,
    make: raw.make ?? null,
    model: raw.model ?? null,
    // The headline carries the most trim detail ("…TURBO PDK"); fall back to the
    // model string (which also includes the trim) so the matcher can find it.
    trim: raw.headline ?? raw.model ?? null,
    year: typeof raw.year === "number" ? raw.year : null,
    mileage: typeof raw.mileage === "number" ? raw.mileage : null,
    price:
      raw.isPriceOnApplication || !raw.price || raw.price <= 0
        ? null
        : raw.price,
  };
}
