// Shared grade model for vehicle dossiers.
//
// A dossier is one *model*; a grade is one *version of that model* — Ti,
// Ti-L, Ti-L Reserve. Rather than publishing a near-duplicate page per grade
// (four pages competing for the same keyword, four sets of photographs to
// keep in step), one page carries the whole ladder and the reader picks the
// rung.
//
// The rule that makes this cheap to author: **a grade stores only what is
// different.** Every spec field is optional and blank means "same as the base
// spec on the dossier". So the admin fills the dossier once, then lists what
// each grade changes — which is also exactly the information the customer is
// trying to find when they compare grades.

export type GradePriceEntry = {
  country: string;
  currency: string;
  amount: number;
  type: string;
};

export type VehicleGrade = {
  /** Stable, URL-safe id derived from the name. Used for selection state. */
  id: string;
  /** Manufacturer's own name for the grade, e.g. "Ti-L Reserve". */
  name: string;
  /** One line on what this grade is for. Optional. */
  summary?: string;
  /** The grade the page opens on. At most one; the first wins otherwise. */
  isDefault?: boolean;

  // --- Spec overrides. Blank/absent means "inherit from the dossier". ------
  engineConfig?: string;
  displacement?: string;
  maxPower?: string;
  maxTorque?: string;
  transmission?: string;
  fuelSystem?: string;
  emissions?: string;

  /** What this grade adds over the one below it — the comparison the reader came for. */
  highlights: string[];
  /** Grade-only feature chips, shown alongside the dossier's standard features. */
  features: string[];
  /** Per-grade landed pricing. Empty falls back to the dossier's own matrix. */
  pricing: GradePriceEntry[];
  /**
   * Index into the dossier's `images` array of the photograph showing this
   * grade, so selecting it swaps the gallery. Undefined means "no grade-
   * specific shot" and the gallery is left where it is.
   */
  imageIndex?: number;
};

/** The dossier fields a grade may override, in the order they're presented. */
export const GRADE_SPEC_FIELDS = [
  { key: "engineConfig", label: "Engine Configuration" },
  { key: "displacement", label: "Displacement" },
  { key: "maxPower", label: "Max Power Output" },
  { key: "maxTorque", label: "Max Torque" },
  { key: "transmission", label: "Transmission" },
  { key: "fuelSystem", label: "Fuel System" },
  { key: "emissions", label: "Emissions Standard" },
] as const;

export type GradeSpecKey = (typeof GRADE_SPEC_FIELDS)[number]["key"];

/** URL-safe id for a grade name. "Ti-L Reserve" → "ti-l-reserve". */
export function gradeSlug(name: string): string {
  return (name || "")
    .toLowerCase()
    .trim()
    .replace(/\+/g, "-plus")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

/** A blank row for the admin builder's "add grade" button. */
export function emptyGrade(): VehicleGrade {
  return {
    id: "",
    name: "",
    summary: "",
    isDefault: false,
    highlights: [],
    features: [],
    pricing: [],
  };
}

function cleanStringList(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((v) => (typeof v === "string" ? v.trim() : ""))
    .filter((v) => v.length > 0);
}

function cleanPricing(value: unknown): GradePriceEntry[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((p): p is Record<string, unknown> => !!p && typeof p === "object")
    .map((p) => ({
      country: typeof p.country === "string" ? p.country : "",
      currency: typeof p.currency === "string" ? p.currency : "USD",
      amount: Number(p.amount),
      type: typeof p.type === "string" ? p.type : "CIF",
    }))
    .filter((p) => p.country.length > 0 && Number.isFinite(p.amount));
}

function optionalText(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

/**
 * Parses whatever came back from the `grades` jsonb column into a clean array.
 * Legacy dossiers have `[]`, and hand-edited rows can contain anything, so
 * every field is defended. Ids are re-derived from the name rather than
 * trusted, and de-duplicated, because selection state keys off them.
 */
export function parseGrades(value: unknown): VehicleGrade[] {
  if (!Array.isArray(value)) return [];
  const seen = new Set<string>();

  return value
    .filter((g): g is Record<string, unknown> => !!g && typeof g === "object")
    .map((g) => ({
      name: typeof g.name === "string" ? g.name.trim() : "",
      raw: g,
    }))
    .filter((g) => g.name.length > 0)
    .map(({ name, raw }, index) => {
      // Two grades named the same is an authoring mistake, but it must not
      // collapse them into one selectable pill.
      let id = gradeSlug(name) || `grade-${index + 1}`;
      while (seen.has(id)) id = `${id}-${index + 1}`;
      seen.add(id);

      return {
        id,
        name,
        summary: optionalText(raw.summary),
        isDefault: raw.isDefault === true,
        engineConfig: optionalText(raw.engineConfig),
        displacement: optionalText(raw.displacement),
        maxPower: optionalText(raw.maxPower),
        maxTorque: optionalText(raw.maxTorque),
        transmission: optionalText(raw.transmission),
        fuelSystem: optionalText(raw.fuelSystem),
        emissions: optionalText(raw.emissions),
        highlights: cleanStringList(raw.highlights),
        features: cleanStringList(raw.features),
        pricing: cleanPricing(raw.pricing),
        imageIndex:
          typeof raw.imageIndex === "number" &&
          Number.isInteger(raw.imageIndex) &&
          raw.imageIndex >= 0
            ? raw.imageIndex
            : undefined,
      } satisfies VehicleGrade;
    });
}

/**
 * The grade a page opens on: the one flagged default, else the first listed.
 * Returns undefined for a dossier with no grades, which is the normal case.
 */
export function defaultGrade(grades: VehicleGrade[]): VehicleGrade | undefined {
  return grades.find((g) => g.isDefault) ?? grades[0];
}

/** Look a grade up by id, falling back to the default rather than to nothing. */
export function findGrade(
  grades: VehicleGrade[],
  id?: string | null,
): VehicleGrade | undefined {
  if (!id) return defaultGrade(grades);
  return grades.find((g) => g.id === id) ?? defaultGrade(grades);
}

/**
 * Resolves one spec field for the selected grade: the grade's own value when
 * it sets one, otherwise the dossier's. This is the whole inheritance rule.
 */
export function gradeSpec(
  base: Partial<Record<GradeSpecKey, string | undefined>>,
  grade: VehicleGrade | undefined,
  key: GradeSpecKey,
): string {
  const override = grade?.[key];
  if (override && override.trim().length > 0) return override.trim();
  return (base[key] || "").trim();
}

/** True when this grade changes at least one spec field off the base. */
export function gradeOverridesSpecs(grade: VehicleGrade): boolean {
  return GRADE_SPEC_FIELDS.some(({ key }) => {
    const value = grade[key];
    return typeof value === "string" && value.trim().length > 0;
  });
}

/**
 * The feature list for a grade: the dossier's standard equipment first, then
 * whatever the grade adds, with duplicates dropped. Base-first ordering keeps
 * the list stable as the reader moves between grades — only the tail changes.
 */
export function gradeFeatures(
  baseFeatures: string[] | undefined,
  grade: VehicleGrade | undefined,
): string[] {
  const merged = [...(baseFeatures ?? []), ...(grade?.features ?? [])];
  const seen = new Set<string>();
  return merged.filter((f) => {
    const key = f.trim().toLowerCase();
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

/** Per-grade pricing when the grade sets any, otherwise the dossier's matrix. */
export function gradePricing<T extends GradePriceEntry>(
  basePricing: T[] | undefined,
  grade: VehicleGrade | undefined,
): (T | GradePriceEntry)[] {
  if (grade && grade.pricing.length > 0) return grade.pricing;
  return basePricing ?? [];
}

/**
 * Drops half-filled rows before saving — an admin who clicked "add grade" and
 * moved on must not publish a nameless pill. Also re-derives ids and clears a
 * photo link that now points past the end of the gallery.
 */
export function cleanGradesForSave(
  grades: VehicleGrade[],
  imageCount: number,
): VehicleGrade[] {
  const named = grades.filter((g) => g.name.trim().length > 0);
  // At most one default. If the admin ticked several, the first one wins.
  const firstDefault = named.findIndex((g) => g.isDefault);

  return named.map((g, index) => ({
    ...g,
    id: gradeSlug(g.name) || `grade-${index + 1}`,
    name: g.name.trim(),
    summary: optionalText(g.summary),
    isDefault: index === firstDefault,
    highlights: cleanStringList(g.highlights),
    features: cleanStringList(g.features),
    pricing: cleanPricing(g.pricing),
    imageIndex:
      typeof g.imageIndex === "number" && g.imageIndex < imageCount
        ? g.imageIndex
        : undefined,
  }));
}
