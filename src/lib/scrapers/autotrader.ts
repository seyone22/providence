// AutoTrader adapter — maps a raw `memo23/autotrader-cheerio` dataset item to a
// NormalizedListing. AutoTrader's actor output is already well-structured, so
// this is a direct field map (no LLM needed). See memory: sourcing-scraper-spike.

import type { NormalizedListing } from "@/lib/market-stats";

// Minimal shape of the fields we read; the actor returns far more (media,
// finance, tracking) that we deliberately ignore.
interface AutoTraderItem {
  make?: string;
  model?: string;
  subtitle?: string; // derivative/trim, e.g. "3.6T V6 Turbo 5dr PDK"
  year?: number;
  advertId?: string;
  autotraderWebsiteLink?: string;
  pricing?: { mainPrice?: number };
  mileage?: { value?: number; unit?: string };
}

export function mapAutoTraderItem(raw: AutoTraderItem): NormalizedListing {
  const mileage =
    raw.mileage?.unit === "MILE" || raw.mileage?.unit == null
      ? (raw.mileage?.value ?? null)
      : // Defensive: convert km if a future build ever returns km.
        raw.mileage?.value != null
        ? Math.round(raw.mileage.value * 0.621371)
        : null;

  // autotraderWebsiteLink often comes back empty; build the canonical
  // car-details URL from the advertId instead.
  const link = raw.autotraderWebsiteLink?.trim();
  const url = link
    ? link
    : raw.advertId
      ? `https://www.autotrader.co.uk/car-details/${raw.advertId}`
      : null;

  return {
    source: "autotrader",
    url,
    make: raw.make ?? null,
    model: raw.model ?? null,
    trim: raw.subtitle ?? null,
    year: typeof raw.year === "number" ? raw.year : null,
    mileage,
    price: raw.pricing?.mainPrice ?? null,
  };
}
