// Shared vehicle display helpers used by the gallery card, the home-page
// gallery preview, and the gallery/detail link-preview metadata so titles
// and prices stay consistent everywhere.

export type PriceEntry = {
  country: string;
  currency: string;
  amount: number;
  type: string;
};

const CURRENCY_SYMBOLS: Record<string, string> = {
  GBP: "£",
  USD: "$",
  EUR: "€",
  JPY: "¥",
  AUD: "A$",
  CAD: "C$",
};

/** True when a dossier is publicly live (published to the gallery). */
export function isLiveStatus(status?: string): boolean {
  return status === "Active" || status === "Published";
}

/**
 * Public gallery path for a dossier.
 *
 * Live templates ALWAYS resolve to their clean slug (`/b2c/gallery/my-car`) so
 * we never expose raw Mongo _id URLs on published pages. Drafts (or anything
 * without a slug yet) fall back to the _id so they stay previewable before a
 * slug is assigned. Returns null when neither a slug nor an _id is available.
 */
export function galleryPathForDossier(d: {
  _id?: string;
  slug?: string;
  status?: string;
}): string | null {
  if (isLiveStatus(d.status) && d.slug) return `/b2c/gallery/${d.slug}`;
  if (d.slug) return `/b2c/gallery/${d.slug}`;
  if (d._id) return `/b2c/gallery/${d._id}`;
  return null;
}

/**
 * Builds a display title, avoiding duplication like "Lexus Lexus LX500d"
 * when the model field already starts with the make.
 */
export function formatVehicleTitle(make?: string, model?: string): string {
  const m = (make || "").trim();
  const mo = (model || "").trim();
  if (!m) return mo;
  if (mo.toLowerCase().startsWith(m.toLowerCase())) return mo;
  return `${m} ${mo}`.trim();
}

// Lowest available price for a card — prefers GBP, then the cheapest entry.
export function getLeadPrice(
  pricing?: PriceEntry[],
): { amount: number; currency: string } | null {
  if (!pricing || pricing.length === 0) return null;
  const gbp = pricing.filter((p) => p.currency?.toUpperCase() === "GBP");
  const pool = gbp.length > 0 ? gbp : pricing;
  const cheapest = pool.reduce(
    (min, p) => (p.amount < min.amount ? p : min),
    pool[0],
  );
  if (!cheapest || !Number.isFinite(cheapest.amount) || cheapest.amount <= 0)
    return null;
  return {
    amount: cheapest.amount,
    currency: cheapest.currency?.toUpperCase() || "USD",
  };
}

export function formatLeadPrice(pricing?: PriceEntry[]): string | null {
  const lead = getLeadPrice(pricing);
  if (!lead) return null;
  const symbol = CURRENCY_SYMBOLS[lead.currency] || `${lead.currency} `;
  return `From ${symbol}${Math.round(lead.amount).toLocaleString()}`;
}
