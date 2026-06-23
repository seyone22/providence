// Deterministic market-statistics engine for the Sourcing & Profit tool.
// Every number shown to the operator (high/low/mean/median, spread, histogram)
// is computed here from real scraped listings — never from an LLM. The AI layer
// only narrates these finished figures. See memory: sourcing-scraper-spike.

// A listing after a per-source adapter has normalised it. Prices are GBP and
// mileage is miles, so cross-source figures are directly comparable.
export interface NormalizedListing {
  source: "autotrader" | "cargurus" | "pistonheads";
  url: string | null;
  make: string | null;
  model: string | null;
  trim: string | null;
  year: number | null;
  mileage: number | null; // miles
  price: number | null; // GBP
}

export interface HistogramBucket {
  from: number;
  to: number;
  label: string; // e.g. "£18k–£21k"
  count: number;
}

export interface MarketStats {
  count: number; // listings with a usable price
  min: number;
  max: number;
  mean: number;
  median: number;
  p25: number;
  p75: number;
  stdDev: number;
  histogram: HistogramBucket[];
  trimmedOutliers: number; // how many extreme prices were excluded
}

// Quantile via linear interpolation on a sorted ascending array.
function quantile(sorted: number[], q: number): number {
  if (sorted.length === 0) return 0;
  if (sorted.length === 1) return sorted[0];
  const pos = (sorted.length - 1) * q;
  const base = Math.floor(pos);
  const rest = pos - base;
  const next = sorted[base + 1] ?? sorted[base];
  return sorted[base] + rest * (next - sorted[base]);
}

const roundK = (n: number) =>
  n >= 1000 ? `£${Math.round(n / 1000)}k` : `£${Math.round(n)}`;

// Compute the market statistics for a set of prices (GBP). By default extreme
// outliers (e.g. mis-priced ads, salvage, or a different variant that slipped
// the search) are trimmed with the 1.5×IQR rule so the mean/median reflect the
// real market, not noise. `buckets` controls histogram granularity.
export function computeMarketStats(
  rawPrices: number[],
  opts: { trimOutliers?: boolean; buckets?: number } = {},
): MarketStats {
  const { trimOutliers = true, buckets = 8 } = opts;

  const valid = rawPrices
    .filter((p) => typeof p === "number" && Number.isFinite(p) && p > 0)
    .sort((a, b) => a - b);

  const empty: MarketStats = {
    count: 0,
    min: 0,
    max: 0,
    mean: 0,
    median: 0,
    p25: 0,
    p75: 0,
    stdDev: 0,
    histogram: [],
    trimmedOutliers: 0,
  };
  if (valid.length === 0) return empty;

  // Outlier trimming on the pre-trim quartiles.
  let prices = valid;
  let trimmedOutliers = 0;
  if (trimOutliers && valid.length >= 8) {
    const q1 = quantile(valid, 0.25);
    const q3 = quantile(valid, 0.75);
    const iqr = q3 - q1;
    const lo = q1 - 1.5 * iqr;
    const hi = q3 + 1.5 * iqr;
    const kept = valid.filter((p) => p >= lo && p <= hi);
    trimmedOutliers = valid.length - kept.length;
    if (kept.length > 0) prices = kept;
  }

  const count = prices.length;
  const min = prices[0];
  const max = prices[count - 1];
  const mean = prices.reduce((s, p) => s + p, 0) / count;
  const median = quantile(prices, 0.5);
  const p25 = quantile(prices, 0.25);
  const p75 = quantile(prices, 0.75);
  const variance = prices.reduce((s, p) => s + (p - mean) ** 2, 0) / count;
  const stdDev = Math.sqrt(variance);

  // Histogram across [min, max].
  const histogram: HistogramBucket[] = [];
  const span = max - min;
  if (span === 0) {
    histogram.push({ from: min, to: max, label: roundK(min), count });
  } else {
    const width = span / buckets;
    for (let i = 0; i < buckets; i++) {
      const from = min + i * width;
      const to = i === buckets - 1 ? max : from + width;
      const inBucket = prices.filter((p) =>
        i === buckets - 1 ? p >= from && p <= to : p >= from && p < to,
      ).length;
      histogram.push({
        from,
        to,
        label: `${roundK(from)}–${roundK(to)}`,
        count: inBucket,
      });
    }
  }

  return {
    count,
    min,
    max,
    mean,
    median,
    p25,
    p75,
    stdDev,
    histogram,
    trimmedOutliers,
  };
}
