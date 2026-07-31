// @/lib/leadSource.ts
// Single source of truth for turning a stored lead `source` (a Next.js pathname
// or ?ref= value) into a human-readable landing-page label. Used both by the
// inquiry form (per-lead attribution) and the sales-profile stats ("inquiries
// by landing page") so the two never drift apart.

/**
 * Path of the Japanese left-hand-drive luxury landing page. Leads that come
 * through this page are left-hand-drive enquiries: the lead table flags them
 * with a red "LHD" badge and the dashboard has a toggle to show only these.
 */
export const LHD_LANDING_PATH = "/japanese-luxury-cars-lhd";

/** True when a stored lead `source` came through the LHD landing page. */
export function isLhdLead(source?: string): boolean {
  return !!source && source.replace(/\/$/, "") === LHD_LANDING_PATH;
}

/**
 * Convert a stored lead `source` → human-readable display label. Handles both
 * the current format (raw pathname, e.g. "/team/abdallah") and the legacy
 * format (a readable label already, e.g. "Request Page") stored before the
 * pathname-storage fix — legacy values are passed through unchanged.
 */
export function pathnameToSource(pathname: string): string {
  if (!pathname) return "";
  if (pathname === "/") return "Home Page";
  // Legacy format: already a readable label (no leading slash).
  if (!pathname.startsWith("/")) return pathname;
  const slug = pathname.replace(/^\//, "").replace(/\/$/, "");
  if (!slug) return "Home Page";
  const MAP: Record<string, string> = {
    request: "Request Page",
    b2b: "B2B Landing",
    b2c: "B2C Landing",
    "import-japanese-cars-to-ireland": "Import to Ireland",
    "ireland-cost-calculator": "Ireland Calculator",
  };
  if (MAP[slug]) return MAP[slug];
  // Every sales-member profile page (/team/[slug]) reports the same label. The
  // lead is always assigned to that page's owner, so "My Profile Page" reads
  // correctly in the owning member's own lead list and stats.
  if (slug.startsWith("team/")) return "My Profile Page";
  if (slug.startsWith("campaigns/"))
    return `Campaign: ${slug.replace("campaigns/", "")}`;
  // Prettify unknown slugs: kebab-case → Title Case
  return slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}
