// Managed-scraper client (Apify). Server-only — reads APIFY_TOKEN and runs an
// actor synchronously, returning its dataset items. Per-source adapters build
// on this. See memory: sourcing-scraper-spike.

// Server-only by construction: reads process.env.APIFY_TOKEN, so it must only be
// imported from server actions / components (never a "use client" module).
import type { NormalizedListing } from "@/lib/market-stats";
import { mapAutoTraderItem } from "@/lib/scrapers/autotrader";
import { mapPistonHeadsItem } from "@/lib/scrapers/pistonheads";

const APIFY_BASE = "https://api.apify.com/v2";

// Run an actor and return its dataset items. `run-sync-get-dataset-items` blocks
// until the run finishes (cheerio actors are fast), so no polling is needed.
export async function runApifyActor<T = unknown>(
  actorId: string,
  input: unknown,
): Promise<T[]> {
  const token = process.env.APIFY_TOKEN;
  if (!token) throw new Error("APIFY_TOKEN is not configured.");

  const res = await fetch(
    `${APIFY_BASE}/acts/${actorId}/run-sync-get-dataset-items?token=${token}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
      cache: "no-store",
    },
  );
  if (!res.ok) {
    const body = await res.text();
    throw new Error(
      `Apify ${actorId} failed ${res.status}: ${body.slice(0, 300)}`,
    );
  }
  return (await res.json()) as T[];
}

// ─── AutoTrader ──────────────────────────────────────────────────────────────

const AUTOTRADER_ACTOR = "memo23~autotrader-cheerio";

// Build a model-level search URL. We deliberately search at make+model level and
// narrow to the exact trim in the matching layer (AutoTrader's derivative filter
// is unreliable), so the result pool is large enough to filter from.
export function buildAutoTraderSearchUrl(params: {
  make: string;
  model: string;
  postcode?: string;
  yearFrom?: number;
  yearTo?: number;
}): string {
  const qs = new URLSearchParams({
    make: params.make,
    model: params.model,
    postcode: params.postcode ?? "M1 1AE",
  });
  if (params.yearFrom) qs.set("year-from", String(params.yearFrom));
  if (params.yearTo) qs.set("year-to", String(params.yearTo));
  return `https://www.autotrader.co.uk/car-search?${qs.toString()}`;
}

export async function scrapeAutoTrader(params: {
  make: string;
  model: string;
  postcode?: string;
  yearFrom?: number;
  yearTo?: number;
}): Promise<NormalizedListing[]> {
  const url = buildAutoTraderSearchUrl(params);
  // includeListingDetails:true is the validated config that returns price, year,
  // mileage and the derivative (subtitle) the matcher needs. ~$0.085 per page.
  const items = await runApifyActor<Parameters<typeof mapAutoTraderItem>[0]>(
    AUTOTRADER_ACTOR,
    {
      startUrls: [{ url }],
      includeListingDetails: true,
      proxy: { useApifyProxy: true, apifyProxyGroups: ["RESIDENTIAL"] },
    },
  );
  return items.map(mapAutoTraderItem);
}

// ─── PistonHeads ─────────────────────────────────────────────────────────────

const PISTONHEADS_ACTOR = "parseforge~pistonheads-scraper";

// Parametric and fast — driven directly by make slug + model keyword + year band.
export async function scrapePistonHeads(params: {
  make: string;
  model: string;
  yearFrom?: number;
  yearTo?: number;
  maxItems?: number;
}): Promise<NormalizedListing[]> {
  const items = await runApifyActor<Parameters<typeof mapPistonHeadsItem>[0]>(
    PISTONHEADS_ACTOR,
    {
      makeUrlName: params.make.toLowerCase().trim(),
      modelKeyword: params.model.trim(),
      yearMin: params.yearFrom,
      yearMax: params.yearTo,
      maxItems: params.maxItems ?? 60,
    },
  );
  return items.map(mapPistonHeadsItem);
}
