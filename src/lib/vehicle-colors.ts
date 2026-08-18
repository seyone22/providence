// Shared colour model for vehicle dossiers.
//
// One shape serves both palettes (exterior paint, interior trim) and both
// consumers (the admin builder that authors them, the public car page and
// inquiry form that render them). Kept deliberately small: a name, a hex, and
// an optional second hex for two-tone finishes.

export type VehicleColor = {
  /** Manufacturer name as it should be shown, e.g. "Sonic Grey Pearl". */
  name: string;
  /** Primary swatch, `#rrggbb`. */
  hex: string;
  /**
   * Second swatch for a two-tone finish — a contrast roof on the exterior, a
   * contrast stitch/seat on the interior. Only meaningful when isDualTone.
   */
  hex2?: string;
  /** Whether this entry is a two-tone finish. */
  isDualTone?: boolean;
  /**
   * Optional name for the second tone, e.g. "Black roof". Falls back to a
   * generic label when omitted.
   */
  secondaryName?: string;
  /**
   * Index into the dossier's `images` array of the photograph showing the car
   * in this finish, so picking a swatch on the car page swaps the gallery to
   * the matching shot.
   *
   * Undefined means "no photograph of this finish" — which is the normal case
   * for most of a factory palette, and the swatch stays non-interactive rather
   * than showing a car in the wrong colour.
   */
  imageIndex?: number;
};

export const DEFAULT_COLOR_HEX = "#1a1a1a";

/** A blank entry for the admin builder's "add colour" row. */
export function emptyColor(): VehicleColor {
  return {
    name: "",
    hex: DEFAULT_COLOR_HEX,
    hex2: "#f5f5f5",
    isDualTone: false,
    secondaryName: "",
  };
}

/** Normalises anything hex-ish to `#rrggbb`, falling back to the default. */
export function normalizeHex(input?: string): string {
  const raw = (input || "").trim();
  if (/^#[0-9a-f]{6}$/i.test(raw)) return raw.toLowerCase();
  if (/^#[0-9a-f]{3}$/i.test(raw)) {
    const [r, g, b] = raw.slice(1).split("");
    return `#${r}${r}${g}${g}${b}${b}`.toLowerCase();
  }
  if (/^[0-9a-f]{6}$/i.test(raw)) return `#${raw.toLowerCase()}`;
  return DEFAULT_COLOR_HEX;
}

/**
 * The label a customer sees and that gets written onto the lead. Two-tone
 * entries read as "Primary / Secondary" so a sales agent can act on the row
 * without opening the dossier.
 */
export function colorLabel(color: VehicleColor): string {
  const base = (color.name || "").trim();
  if (!color.isDualTone) return base;
  const second = (color.secondaryName || "").trim();
  return second ? `${base} / ${second}` : `${base} (two-tone)`;
}

/**
 * Parses whatever came back from the `exteriorColors` / `interiorColors` jsonb
 * columns into a clean array. Legacy dossiers have `[]`, and hand-edited rows
 * can contain junk, so every field is defended.
 */
export function parseColors(value: unknown): VehicleColor[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((c): c is Record<string, unknown> => !!c && typeof c === "object")
    .map((c) => ({
      name: typeof c.name === "string" ? c.name : "",
      hex: normalizeHex(typeof c.hex === "string" ? c.hex : undefined),
      hex2: normalizeHex(typeof c.hex2 === "string" ? c.hex2 : undefined),
      isDualTone: c.isDualTone === true,
      secondaryName: typeof c.secondaryName === "string" ? c.secondaryName : "",
      // Only a non-negative integer is a usable index; anything else (null,
      // "", a stray string from a hand-edited row) means "not linked".
      imageIndex:
        typeof c.imageIndex === "number" &&
        Number.isInteger(c.imageIndex) &&
        c.imageIndex >= 0
          ? c.imageIndex
          : undefined,
    }))
    .filter((c) => c.name.trim().length > 0);
}

/**
 * Inline style for a swatch. Two-tone renders as a hard-edged 135° split
 * rather than a gradient — a gradient reads as a single blended colour and
 * misrepresents what the customer is actually ordering.
 */
export function swatchStyle(color: VehicleColor): React.CSSProperties {
  const primary = normalizeHex(color.hex);
  if (!color.isDualTone) return { backgroundColor: primary };
  const secondary = normalizeHex(color.hex2);
  return {
    backgroundImage: `linear-gradient(135deg, ${primary} 0%, ${primary} 50%, ${secondary} 50%, ${secondary} 100%)`,
  };
}
