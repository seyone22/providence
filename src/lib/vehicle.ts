// Shared vehicle display helpers used by the gallery card and the
// gallery/detail link-preview metadata so titles stay consistent.

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
