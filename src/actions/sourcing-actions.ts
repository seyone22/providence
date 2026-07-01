"use server";

import { headers } from "next/headers";
import {
  computeMarketStats,
  type MarketStats,
  type NormalizedListing,
} from "@/lib/market-stats";
import connectToDatabase from "@/lib/mongoose";
import { cleanListings, dedupeListings } from "@/lib/scrapers/clean";
import { scrapeAutoTrader, scrapePistonHeads } from "@/lib/scrapers/client";
import {
  filterListings,
  type MatchTarget,
  selectTopComparables,
  tokenize,
} from "@/lib/scrapers/matching";
import SourcingAnalysis from "@/models/SourcingAnalysis";
import { auth } from "@/utils/auth";

// Server actions for the admin Sourcing & Profit tool: live FX (JPY→GBP) for
// the landed-cost engine, Gemini auction-sheet extraction, multi-source market
// ingestion (AutoTrader + PistonHeads), the Gemini buy/avoid verdict, and
// persistence of saved runs.

// Models tried in order. gemini-2.5-flash is best but intermittently returns
// 503 (overloaded) on the free tier, and gemini-2.0-flash is quota-capped (429),
// so we fall back to the lite models, which are reliably available and still
// multimodal. All support image input + responseSchema.
const GEMINI_MODELS = [
  "gemini-2.5-flash",
  "gemini-2.5-flash-lite",
  "gemini-flash-lite-latest",
];

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

// Call Gemini generateContent with the given request body, trying each model in
// turn and retrying once on a transient 503. Returns the first response's text,
// or a structured failure with the last status. Centralises the resilience so
// both extraction and the verdict survive an overloaded model.
async function generateGeminiText(
  key: string,
  body: unknown,
): Promise<
  | { ok: true; text: string; tokens: number; model: string }
  | { ok: false; status: number; message: string }
> {
  let lastStatus = 0;
  for (const model of GEMINI_MODELS) {
    for (let attempt = 0; attempt < 2; attempt++) {
      let res: Response;
      try {
        res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
            cache: "no-store",
          },
        );
      } catch (e) {
        lastStatus = 0;
        console.error(`Gemini ${model} network error:`, e);
        break; // try next model
      }

      if (res.ok) {
        const json = (await res.json()) as {
          candidates?: { content?: { parts?: { text?: string }[] } }[];
          usageMetadata?: { totalTokenCount?: number };
        };
        const text = json.candidates?.[0]?.content?.parts?.[0]?.text;
        // Token count is returned by the API for free — no extra cost to read.
        const tokens = json.usageMetadata?.totalTokenCount ?? 0;
        if (text) return { ok: true, text, tokens, model };
        break; // empty content — try next model
      }

      lastStatus = res.status;
      console.error(`Gemini ${model} HTTP ${res.status}`);
      // 503 = transient overload → quick retry on the same model; otherwise
      // (e.g. 429 quota) move straight to the next model.
      if (res.status === 503 && attempt === 0) {
        await sleep(700);
        continue;
      }
      break;
    }
  }
  return {
    ok: false,
    status: lastStatus,
    message: `Gemini unavailable (last status ${lastStatus}). All models busy — try again, or enter details manually.`,
  };
}

export interface GbpFxRates {
  // GBP per 1 unit of the currency (e.g. rates.JPY = GBP per 1 JPY).
  rates: Record<string, number>;
  date: string | null; // ECB reference date (YYYY-MM-DD), or null on fallback
  source: "ecb" | "fallback";
}

// Currencies we accept on the auction-cost side. JPY is the primary one.
// Not exported: a "use server" file may only export async functions.
const SOURCING_CURRENCIES = ["JPY", "USD", "EUR"] as const;

// Indicative GBP-per-unit fallbacks, used before live rates load or if the feed
// is unavailable so the calculator always has usable numbers.
const FALLBACK_GBP_RATES: Record<string, number> = {
  GBP: 1,
  JPY: 0.0053,
  USD: 0.79,
  EUR: 0.85,
};

// Live rates via Frankfurter (ECB daily reference rates, no key, free). Cached
// 24h so all callers share ~one upstream call per day. HMRC's official customs
// figure uses its published *monthly* rate — this live spot is indicative and
// the operator can override it per run.
export async function getGbpFxRates(): Promise<GbpFxRates> {
  const symbols = SOURCING_CURRENCIES.join(",");
  try {
    const res = await fetch(
      `https://api.frankfurter.dev/v1/latest?base=GBP&symbols=${symbols}`,
      { next: { revalidate: 86400 } },
    );
    if (!res.ok) throw new Error(`Frankfurter responded ${res.status}`);

    const json = (await res.json()) as {
      date?: string;
      rates?: Record<string, number>;
    };
    if (!json.rates) throw new Error("Malformed FX response: no rates");

    // Frankfurter quotes units-per-GBP; the calculator wants GBP-per-unit, so
    // invert each rate. GBP is the base and always maps to 1.
    const rates: Record<string, number> = { GBP: 1 };
    for (const code of SOURCING_CURRENCIES) {
      const unitsPerGbp = json.rates[code];
      rates[code] =
        typeof unitsPerGbp === "number" && unitsPerGbp > 0
          ? 1 / unitsPerGbp
          : FALLBACK_GBP_RATES[code];
    }

    return { rates, date: json.date ?? null, source: "ecb" };
  } catch (error: unknown) {
    console.error("GBP FX fetch failed, using fallback:", error);
    return {
      rates: { ...FALLBACK_GBP_RATES },
      date: null,
      source: "fallback",
    };
  }
}

// ─── Auction-sheet extraction (Gemini multimodal) ────────────────────────────

// Structured fields lifted from a Japanese auction sheet. Any field Gemini
// cannot read comes back null so the operator can fill it manually.
export interface AuctionSheetExtract {
  make: string | null;
  model: string | null;
  trimGrade: string | null; // model variant/grade (e.g. "LX570")
  chassisCode: string | null; // e.g. "DBA-URJ201W"
  year: number | null; // western year (Japanese era converted)
  registrationDate: string | null; // human label, e.g. "Dec 2016 (Heisei 28)"
  mileageKm: number | null;
  mileageMiles: number | null;
  displacementCc: number | null;
  fuel: string | null;
  drivetrain: string | null; // e.g. "4WD"
  transmission: string | null;
  seats: number | null;
  exteriorColour: string | null;
  auctionGrade: string | null; // overall condition score (e.g. "5")
  interiorGrade: string | null; // interior letter grade (e.g. "A")
  features: string[]; // notable equipment, translated
  conditionNotes: string | null; // inspector remarks, translated
}

const EXTRACTION_PROMPT = `You are reading a Japanese used-car auction inspection sheet (USS / JAA / TAA style).
Extract the vehicle's details and return them as JSON matching the provided schema.

Rules:
- Translate all Japanese text to English.
- Convert the Japanese-era first-registration date to a Western year (e.g. H28/12 = Heisei 28 = December 2016; R6 = Reiwa 6 = 2024). Put the Western year in "year" and a human label in "registrationDate".
- "mileageKm" is the odometer reading (走行) in kilometres. Also compute "mileageMiles" = round(mileageKm * 0.621371).
- "auctionGrade" is the overall condition score (評価点, e.g. 4, 4.5, 5, R, RA). "interiorGrade" is the interior letter (内装, A/B/C/D).
- "features" = notable equipment / sales points (装備, セールスポイント), each a short English phrase. Do not invent items not on the sheet.
- "conditionNotes" = inspector remarks / damage notes (検査員報告), translated.
- Use null for any field you cannot read with confidence. Never guess prices.`;

// Gemini responseSchema (OpenAPI subset) for reliable structured output.
const EXTRACTION_SCHEMA = {
  type: "object",
  properties: {
    make: { type: "string", nullable: true },
    model: { type: "string", nullable: true },
    trimGrade: { type: "string", nullable: true },
    chassisCode: { type: "string", nullable: true },
    year: { type: "integer", nullable: true },
    registrationDate: { type: "string", nullable: true },
    mileageKm: { type: "integer", nullable: true },
    mileageMiles: { type: "integer", nullable: true },
    displacementCc: { type: "integer", nullable: true },
    fuel: { type: "string", nullable: true },
    drivetrain: { type: "string", nullable: true },
    transmission: { type: "string", nullable: true },
    seats: { type: "integer", nullable: true },
    exteriorColour: { type: "string", nullable: true },
    auctionGrade: { type: "string", nullable: true },
    interiorGrade: { type: "string", nullable: true },
    features: { type: "array", items: { type: "string" } },
    conditionNotes: { type: "string", nullable: true },
  },
} as const;

export type ExtractResult =
  | { success: true; data: AuctionSheetExtract; tokens: number; model: string }
  | { success: false; message: string };

// Send an uploaded auction sheet (image or PDF, base64) to Gemini and return the
// parsed vehicle details. The data never includes a price — operators enter the
// auction cost themselves.
export async function extractAuctionSheet(input: {
  dataBase64: string;
  mimeType: string;
}): Promise<ExtractResult> {
  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    return { success: false, message: "GEMINI_API_KEY is not configured." };
  }

  try {
    const result = await generateGeminiText(key, {
      contents: [
        {
          parts: [
            { text: EXTRACTION_PROMPT },
            {
              inlineData: { mimeType: input.mimeType, data: input.dataBase64 },
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0,
        responseMimeType: "application/json",
        responseSchema: EXTRACTION_SCHEMA,
      },
    });

    if (!result.ok) {
      return { success: false, message: result.message };
    }

    const parsed = JSON.parse(result.text) as AuctionSheetExtract;

    // Backstop the km→miles conversion if the model omitted it.
    if (
      parsed.mileageMiles == null &&
      typeof parsed.mileageKm === "number" &&
      parsed.mileageKm > 0
    ) {
      parsed.mileageMiles = Math.round(parsed.mileageKm * 0.621371);
    }
    if (!Array.isArray(parsed.features)) parsed.features = [];

    return {
      success: true,
      data: parsed,
      tokens: result.tokens,
      model: result.model,
    };
  } catch (error: unknown) {
    console.error("Auction-sheet extraction error:", error);
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to read the auction sheet.",
    };
  }
}

// ─── Market analysis (Phase 2 orchestration) ─────────────────────────────────

export interface MarketAnalysisInput {
  make: string;
  model: string;
  trim: string; // edition/grade text (e.g. "Turbo", "GTS") — preference, not a gate
  // Soft tokens (engine/transmission) used to rank toward the exact vehicle.
  refineTokens?: string[];
  year: number | null;
  mileage: number | null; // miles
  // Operator-configured match tolerances (default ±1 year, ±20% mileage).
  yearBand?: number;
  mileagePct?: number;
  postcode?: string;
}

export interface MarketAnalysis {
  stats: MarketStats;
  listings: NormalizedListing[]; // matched the configured tolerances
  allListings: NormalizedListing[]; // everything scraped + cleaned (pre-match)
  matchUsed: string; // human label of the match tolerances applied
  widened: boolean; // true when comparables are thin (low confidence)
  totalMatched: number; // matched the tolerances before the top-10 cap
  totalScraped: number;
  totalAfterClean: number;
  sources: string[];
}

export type MarketAnalysisResult =
  | { success: true; data: MarketAnalysis }
  | { success: false; message: string };

// Orchestrates the market side: scrape (AutoTrader first, then PistonHeads only
// if AutoTrader is thin), clean + dedupe, strictly match on make+model+trim,
// then compute the deterministic price statistics. Numbers never come from an LLM.
export async function analyzeMarket(
  input: MarketAnalysisInput,
): Promise<MarketAnalysisResult> {
  try {
    const yearBand = input.yearBand ?? 1;
    const mileagePct = input.mileagePct ?? 0.2;

    // Scrape a slightly wider year window than the match band so the filter has
    // headroom (at least ±3 years, or the configured band if larger).
    const scrapeBand = Math.max(3, yearBand);
    const yearFrom = input.year ? input.year - scrapeBand : undefined;
    const yearTo = input.year ? input.year + scrapeBand : undefined;

    // Pre-filter the source searches by mileage (with a cushion beyond the match
    // band) so the capped results page is denser with genuine comparables.
    const mBuf = mileagePct + 0.15;
    const maxMileage = input.mileage
      ? Math.round(input.mileage * (1 + mBuf))
      : undefined;
    const minMileage = input.mileage
      ? Math.max(0, Math.round(input.mileage * (1 - mBuf)))
      : undefined;

    // Distinctive trim tokens = trim words minus model words (so "Macan Turbo"
    // with model "Macan" → ["turbo"]). Trim is a preference, not a hard gate.
    const modelTokenSet = new Set(tokenize(input.model));
    const trimTokens = tokenize(input.trim).filter(
      (t) => !modelTokenSet.has(t),
    );

    const target: MatchTarget = {
      make: input.make,
      model: input.model,
      trimTokens,
      refineTokens: (input.refineTokens ?? []).map((k) => k.toLowerCase()),
      year: input.year,
      mileage: input.mileage,
    };

    const matchedOf = (rows: NormalizedListing[]) => {
      const cleaned = dedupeListings(cleanListings(rows));
      return {
        cleaned,
        result: filterListings(cleaned, target, { yearBand, mileagePct }),
      };
    };

    const sources: string[] = [];
    let scraped: NormalizedListing[] = [];

    // 1. AutoTrader — the priority source. Wait for it.
    try {
      const at = await scrapeAutoTrader({
        make: input.make,
        model: input.model,
        postcode: input.postcode,
        yearFrom,
        yearTo,
        maxMileage,
      });
      if (at.length > 0) {
        scraped = at;
        sources.push("autotrader");
      }
    } catch (e) {
      console.error("AutoTrader scrape failed:", e);
    }

    // 2. Only fall back to other sources if AutoTrader didn't yield enough
    //    comparable matches on its own.
    const AUTOTRADER_ENOUGH = 6;
    if (matchedOf(scraped).result.comparables.length < AUTOTRADER_ENOUGH) {
      try {
        const ph = await scrapePistonHeads({
          make: input.make,
          model: input.model,
          yearFrom,
          yearTo,
          mileageMin: minMileage,
          mileageMax: maxMileage,
          keywords: input.trim,
        });
        if (ph.length > 0) {
          scraped = scraped.concat(ph);
          sources.push("pistonheads");
        }
      } catch (e) {
        console.error("PistonHeads scrape failed:", e);
      }
    }

    if (sources.length === 0) {
      return {
        success: false,
        message: "No market sources returned any listings.",
      };
    }

    const { cleaned, result } = matchedOf(scraped);
    const matched = result.comparables;
    // Keep the best 10: closest year, then engine/transmission, then mileage.
    const top = selectTopComparables(matched, target, 10);
    const stats = computeMarketStats(top.map((l) => l.price ?? 0));

    return {
      success: true,
      data: {
        stats,
        listings: top,
        allListings: cleaned,
        matchUsed: `±${yearBand}yr · ±${Math.round(mileagePct * 100)}% mileage`,
        widened: top.length < 5, // thin supply → flag lower confidence
        totalMatched: matched.length,
        totalScraped: scraped.length,
        totalAfterClean: cleaned.length,
        sources,
      },
    };
  } catch (error: unknown) {
    console.error("Market analysis error:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Market analysis failed.",
    };
  }
}

// ─── Buy/avoid verdict (Gemini narrates deterministic numbers) ───────────────

export interface VerdictInput {
  vehicle: {
    make: string;
    model: string;
    edition: string;
    year: string;
    mileage: string;
  };
  landedCostGbp: number;
  stats: MarketStats;
  matchUsed: string;
  widened: boolean;
}

export interface Verdict {
  recommendation: "source" | "marginal" | "avoid";
  headline: string;
  reasoning: string;
  confidence: "high" | "medium" | "low";
  // Deterministic figures computed in code (not by the model).
  grossMargin: number; // median market price − landed cost (GBP)
  marginPct: number; // grossMargin / landed cost
}

export type VerdictResult =
  | { success: true; data: Verdict; tokens: number; model: string }
  | { success: false; message: string };

const VERDICT_SCHEMA = {
  type: "object",
  properties: {
    recommendation: { type: "string", enum: ["source", "marginal", "avoid"] },
    headline: { type: "string" },
    reasoning: { type: "string" },
    confidence: { type: "string", enum: ["high", "medium", "low"] },
  },
  required: ["recommendation", "headline", "reasoning", "confidence"],
} as const;

// Compare the landed cost against the live market and produce a sourcing verdict.
// The margin maths is computed here; Gemini only weighs the factors and writes
// the recommendation + prose. Numbers are never invented by the model.
export async function getVerdict(input: VerdictInput): Promise<VerdictResult> {
  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    return { success: false, message: "GEMINI_API_KEY is not configured." };
  }

  const { stats, landedCostGbp } = input;
  const grossMargin = stats.median - landedCostGbp;
  const marginPct = landedCostGbp > 0 ? grossMargin / landedCostGbp : 0;

  const facts = [
    `Vehicle: ${input.vehicle.year} ${input.vehicle.make} ${input.vehicle.model} ${input.vehicle.edition}, ${input.vehicle.mileage} miles.`,
    `Total UK landed cost (already includes duty, VAT, shipping and fees): £${Math.round(landedCostGbp).toLocaleString()}.`,
    `Live UK market for comparable cars (${stats.count} listings${input.widened ? `, match auto-widened to "${input.matchUsed}" — fewer exact comparables, so lower confidence` : ""}):`,
    `  median £${Math.round(stats.median).toLocaleString()}, mean £${Math.round(stats.mean).toLocaleString()}, range £${Math.round(stats.min).toLocaleString()}–£${Math.round(stats.max).toLocaleString()}, interquartile £${Math.round(stats.p25).toLocaleString()}–£${Math.round(stats.p75).toLocaleString()}.`,
    `Gross margin at median resale = £${Math.round(grossMargin).toLocaleString()} (${(marginPct * 100).toFixed(1)}% of landed cost).`,
    `Listing supply (${stats.count}) is a rough liquidity signal: very few listings = thin/illiquid; many = easy to sell but more competition.`,
  ].join("\n");

  const prompt = `You are a used-car import sourcing analyst for a UK dealer. Based ONLY on the figures below, decide whether this car is worth sourcing from a Japanese auction.

${facts}

Guidance:
- "source" = clearly worth buying (healthy margin with reasonable confidence).
- "marginal" = thin margin, low supply, low confidence, or widened match — proceed with caution.
- "avoid" = margin too thin or negative once you account for reconditioning, selling time and price negotiation.
- Be realistic: dealers rarely achieve the full median; allow headroom for haggling and prep.
- Keep "headline" under 12 words. Keep "reasoning" to 2-4 sentences, concrete and numbers-led. Do not restate every figure.`;

  try {
    const result = await generateGeminiText(key, {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.2,
        responseMimeType: "application/json",
        responseSchema: VERDICT_SCHEMA,
      },
    });

    if (!result.ok) {
      return { success: false, message: result.message };
    }

    const parsed = JSON.parse(result.text) as Omit<
      Verdict,
      "grossMargin" | "marginPct"
    >;
    // Guardrail: a widened match means fewer exact comparables, so never let the
    // narrative claim "high" confidence — cap it at medium.
    const confidence =
      input.widened && parsed.confidence === "high"
        ? "medium"
        : parsed.confidence;
    return {
      success: true,
      data: { ...parsed, confidence, grossMargin, marginPct },
      tokens: result.tokens,
      model: result.model,
    };
  } catch (error: unknown) {
    console.error("Verdict error:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to generate verdict.",
    };
  }
}

// ─── Persistence (save runs + history) ───────────────────────────────────────

export interface SavedAnalysis {
  id: string;
  make: string;
  vehicleModel: string;
  edition?: string;
  year?: number;
  mileage?: number;
  landedCostGbp: number;
  marketMedian?: number;
  listingCount: number;
  sources: string[];
  widened: boolean;
  recommendation: "source" | "marginal" | "avoid";
  headline?: string;
  grossMargin?: number;
  marginPct?: number;
  createdByName?: string;
  createdAt: string;
}

export interface SaveAnalysisInput {
  make: string;
  model: string;
  edition?: string;
  year?: number;
  mileage?: number;
  landedCostGbp: number;
  currency: string;
  dutyBasis: string;
  vatBasis: string;
  market: MarketAnalysis;
  verdict: Verdict;
}

// Persist a completed analysis, stamping the current user from the session.
export async function saveSourcingAnalysis(
  input: SaveAnalysisInput,
): Promise<
  { success: true; id: string } | { success: false; message: string }
> {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) return { success: false, message: "Not authenticated." };

    await connectToDatabase();
    const doc = await SourcingAnalysis.create({
      make: input.make,
      vehicleModel: input.model,
      edition: input.edition,
      year: input.year,
      mileage: input.mileage,
      landedCostGbp: input.landedCostGbp,
      currency: input.currency,
      dutyBasis: input.dutyBasis,
      vatBasis: input.vatBasis,
      sources: input.market.sources,
      listingCount: input.market.stats.count,
      matchUsed: input.market.matchUsed,
      widened: input.market.widened,
      marketMin: input.market.stats.min,
      marketMedian: input.market.stats.median,
      marketMean: input.market.stats.mean,
      marketMax: input.market.stats.max,
      recommendation: input.verdict.recommendation,
      headline: input.verdict.headline,
      reasoning: input.verdict.reasoning,
      confidence: input.verdict.confidence,
      grossMargin: input.verdict.grossMargin,
      marginPct: input.verdict.marginPct,
      createdById: session.user.id,
      createdByName: session.user.name,
    });
    return { success: true, id: String(doc._id) };
  } catch (error: unknown) {
    console.error("Save analysis error:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to save.",
    };
  }
}

// biome-ignore lint/suspicious/noExplicitAny: lean() returns loosely-typed docs
function toSaved(d: any): SavedAnalysis {
  return {
    id: String(d._id),
    make: d.make,
    vehicleModel: d.vehicleModel,
    edition: d.edition,
    year: d.year,
    mileage: d.mileage,
    landedCostGbp: d.landedCostGbp,
    marketMedian: d.marketMedian,
    listingCount: d.listingCount,
    sources: d.sources ?? [],
    widened: d.widened,
    recommendation: d.recommendation,
    headline: d.headline,
    grossMargin: d.grossMargin,
    marginPct: d.marginPct,
    createdByName: d.createdByName,
    createdAt: (d.createdAt as Date).toISOString(),
  };
}

// Most recent saved analyses, newest first.
export async function getRecentSourcingAnalyses(
  limit = 10,
): Promise<SavedAnalysis[]> {
  try {
    await connectToDatabase();
    const docs = await SourcingAnalysis.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();
    return docs.map(toSaved);
  } catch (error: unknown) {
    console.error("Fetch analyses error:", error);
    return [];
  }
}
