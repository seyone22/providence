// Managed-scraper client (Apify). Server-only — reads APIFY_TOKEN and runs an
// actor synchronously, returning its dataset items. Per-source adapters build
// on this. See memory: sourcing-scraper-spike.

// Server-only by construction: reads process.env.APIFY_TOKEN, so it must only be
// imported from server actions / components (never a "use client" module).
import type { NormalizedListing } from "@/lib/market-stats";
import { mapAutoTraderItem } from "@/lib/scrapers/autotrader";
import { canonicalMake } from "@/lib/scrapers/matching";
import { mapPistonHeadsItem } from "@/lib/scrapers/pistonheads";

const APIFY_BASE = "https://api.apify.com/v2";
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

// Run an actor and return its dataset items. `run-sync-get-dataset-items` blocks
// until the run finishes — fine for fast actors (PistonHeads ~14s).
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

// Start an actor run and poll its dataset, returning whatever has been scraped
// once the run finishes OR a time budget elapses. AutoTrader's actor pushes
// items incrementally (~50 by 15s, ~80 by 45s) but takes ~100s to fully finish —
// far longer than a serverless function allows. Bounding the wait keeps the
// request fast and still returns a solid sample. The run finishes server-side.
export async function runApifyActorBounded<T = unknown>(
  actorId: string,
  input: unknown,
  maxWaitMs = 38000,
  pollMs = 4000,
): Promise<T[]> {
  const token = process.env.APIFY_TOKEN;
  if (!token) throw new Error("APIFY_TOKEN is not configured.");

  const startRes = await fetch(
    `${APIFY_BASE}/acts/${actorId}/runs?token=${token}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
      cache: "no-store",
    },
  );
  if (!startRes.ok) {
    const body = await startRes.text();
    throw new Error(
      `Apify ${actorId} start failed ${startRes.status}: ${body.slice(0, 200)}`,
    );
  }
  const run = (await startRes.json()) as {
    data: { id: string; defaultDatasetId: string; status: string };
  };
  const { id: runId, defaultDatasetId: datasetId } = run.data;

  const deadline = Date.now() + maxWaitMs;
  let status = run.data.status;
  while (
    Date.now() < deadline &&
    (status === "RUNNING" || status === "READY")
  ) {
    await sleep(pollMs);
    const sRes = await fetch(
      `${APIFY_BASE}/actor-runs/${runId}?token=${token}`,
      { cache: "no-store" },
    );
    if (sRes.ok) {
      status = ((await sRes.json()) as { data: { status: string } }).data
        .status;
    }
  }

  // Return whatever's in the dataset so far (partial is fine for stats).
  const itemsRes = await fetch(
    `${APIFY_BASE}/datasets/${datasetId}/items?token=${token}`,
    { cache: "no-store" },
  );
  if (!itemsRes.ok) {
    throw new Error(`Apify ${actorId} dataset fetch failed ${itemsRes.status}`);
  }
  return (await itemsRes.json()) as T[];
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
    make: canonicalMake(params.make),
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
  // includeListingDetails:true returns price, year, mileage and the derivative
  // (subtitle) the matcher needs. The actor takes ~100s to fully finish but
  // pushes items as it goes, so we poll for a bounded window and take the
  // partial set — otherwise it overruns the serverless timeout and yields
  // nothing. ~$0.085 per page.
  const items = await runApifyActorBounded<
    Parameters<typeof mapAutoTraderItem>[0]
  >(AUTOTRADER_ACTOR, {
    startUrls: [{ url }],
    includeListingDetails: true,
    proxy: { useApifyProxy: true, apifyProxyGroups: ["RESIDENTIAL"] },
  });
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
      makeUrlName: canonicalMake(params.make)
        .toLowerCase()
        .replace(/\s+/g, "-"),
      modelKeyword: params.model.trim(),
      yearMin: params.yearFrom,
      yearMax: params.yearTo,
      maxItems: params.maxItems ?? 60,
    },
  );
  return items.map(mapPistonHeadsItem);
}
