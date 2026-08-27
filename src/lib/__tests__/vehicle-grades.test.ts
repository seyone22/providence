import { describe, expect, it } from "vitest";
import {
  normalizeSteering,
  parseSteeringOptions,
  steeringLabel,
} from "@/lib/vehicle";
import {
  cleanGradesForSave,
  defaultGrade,
  emptyGrade,
  findGrade,
  gradeFeatures,
  gradeOverridesSpecs,
  gradePricing,
  gradeSlug,
  gradeSpec,
  parseGrades,
  type VehicleGrade,
} from "@/lib/vehicle-grades";

/** A minimal valid grade, for tests that only care about one field. */
function grade(overrides: Partial<VehicleGrade> = {}): VehicleGrade {
  return {
    id: "ti",
    name: "Ti",
    highlights: [],
    features: [],
    pricing: [],
    ...overrides,
  };
}

describe("gradeSlug", () => {
  it("lowercases and hyphenates", () => {
    expect(gradeSlug("Ti-L Reserve")).toBe("ti-l-reserve");
  });

  it("spells out a trailing plus, which would otherwise be dropped", () => {
    expect(gradeSlug("Ti+")).toBe("ti-plus");
    expect(gradeSlug("Ti+")).not.toBe(gradeSlug("Ti"));
  });

  it("strips punctuation and collapses runs of hyphens", () => {
    expect(gradeSlug("  GR  Sport / Premium ")).toBe("gr-sport-premium");
  });
});

describe("parseGrades", () => {
  it("returns an empty array for a dossier that has none", () => {
    expect(parseGrades([])).toEqual([]);
    expect(parseGrades(null)).toEqual([]);
    expect(parseGrades("nonsense")).toEqual([]);
  });

  it("drops entries with no name", () => {
    expect(parseGrades([{ name: "" }, { name: "  " }, { name: "Ti" }])).toEqual(
      [expect.objectContaining({ name: "Ti" })],
    );
  });

  it("derives ids from names rather than trusting stored ones", () => {
    const [parsed] = parseGrades([{ id: "whatever", name: "Ti-L Reserve" }]);
    expect(parsed.id).toBe("ti-l-reserve");
  });

  it("keeps duplicate names separately selectable", () => {
    const parsed = parseGrades([{ name: "Ti" }, { name: "Ti" }]);
    expect(parsed).toHaveLength(2);
    expect(parsed[0].id).not.toBe(parsed[1].id);
  });

  it("treats a blank spec override as inherit, not as an empty value", () => {
    const [parsed] = parseGrades([{ name: "Ti", maxPower: "   " }]);
    expect(parsed.maxPower).toBeUndefined();
  });

  it("defends the list fields against junk", () => {
    const [parsed] = parseGrades([
      {
        name: "Ti",
        highlights: ["18-inch wheels", "", null, 42],
        features: "not an array",
        pricing: [{ country: "UK", currency: "GBP", amount: "nope" }],
      },
    ]);
    expect(parsed.highlights).toEqual(["18-inch wheels"]);
    expect(parsed.features).toEqual([]);
    expect(parsed.pricing).toEqual([]);
  });

  it("only accepts a non-negative integer image index", () => {
    expect(parseGrades([{ name: "Ti", imageIndex: 2 }])[0].imageIndex).toBe(2);
    expect(
      parseGrades([{ name: "Ti", imageIndex: -1 }])[0].imageIndex,
    ).toBeUndefined();
    expect(
      parseGrades([{ name: "Ti", imageIndex: "3" }])[0].imageIndex,
    ).toBeUndefined();
  });
});

describe("defaultGrade / findGrade", () => {
  const grades = [
    grade({ id: "ti", name: "Ti" }),
    grade({ id: "ti-l", name: "Ti-L", isDefault: true }),
  ];

  it("prefers the flagged default over the first entry", () => {
    expect(defaultGrade(grades)?.id).toBe("ti-l");
  });

  it("falls back to the first entry when nothing is flagged", () => {
    expect(defaultGrade([grade({ id: "ti" })])?.id).toBe("ti");
  });

  it("is undefined for a model with no ladder", () => {
    expect(defaultGrade([])).toBeUndefined();
  });

  it("falls back to the default rather than to nothing for a stale id", () => {
    expect(findGrade(grades, "no-such-grade")?.id).toBe("ti-l");
    expect(findGrade(grades, null)?.id).toBe("ti-l");
    expect(findGrade(grades, "ti")?.id).toBe("ti");
  });
});

describe("gradeSpec", () => {
  const base = { maxPower: "298 kW", transmission: "8-speed automatic" };

  it("takes the grade's value when it sets one", () => {
    expect(gradeSpec(base, grade({ maxPower: "317 kW" }), "maxPower")).toBe(
      "317 kW",
    );
  });

  it("inherits the dossier's value when the grade is blank", () => {
    expect(gradeSpec(base, grade(), "maxPower")).toBe("298 kW");
    expect(gradeSpec(base, grade({ maxPower: "  " }), "maxPower")).toBe(
      "298 kW",
    );
  });

  it("inherits when there is no grade at all", () => {
    expect(gradeSpec(base, undefined, "transmission")).toBe(
      "8-speed automatic",
    );
  });

  it("returns an empty string when neither side has a value", () => {
    expect(gradeSpec({}, grade(), "emissions")).toBe("");
  });
});

describe("gradeOverridesSpecs", () => {
  it("is false for a grade that only lists differences in prose", () => {
    expect(gradeOverridesSpecs(grade({ highlights: ["Sunroof"] }))).toBe(false);
  });

  it("is true as soon as one spec field is set", () => {
    expect(gradeOverridesSpecs(grade({ maxTorque: "700 Nm" }))).toBe(true);
  });
});

describe("gradeFeatures", () => {
  it("keeps the base list first so only the tail changes between grades", () => {
    expect(
      gradeFeatures(
        ["Around View Monitor", "Tri-zone climate"],
        grade({
          features: ["Head-Up Display"],
        }),
      ),
    ).toEqual(["Around View Monitor", "Tri-zone climate", "Head-Up Display"]);
  });

  it("drops a grade feature the base list already carries, case-insensitively", () => {
    expect(
      gradeFeatures(
        ["Head-Up Display"],
        grade({ features: ["head-up display"] }),
      ),
    ).toEqual(["Head-Up Display"]);
  });

  it("returns the base list untouched when there is no grade", () => {
    expect(gradeFeatures(["Sunroof"], undefined)).toEqual(["Sunroof"]);
    expect(gradeFeatures(undefined, undefined)).toEqual([]);
  });
});

describe("gradePricing", () => {
  const base = [{ country: "UK", currency: "GBP", amount: 90000, type: "CIF" }];
  const own = [{ country: "UK", currency: "GBP", amount: 120000, type: "CIF" }];

  it("prefers the grade's own matrix", () => {
    expect(gradePricing(base, grade({ pricing: own }))).toBe(own);
  });

  it("falls back to the dossier's when the grade prices nothing", () => {
    expect(gradePricing(base, grade())).toBe(base);
    expect(gradePricing(base, undefined)).toBe(base);
    expect(gradePricing(undefined, grade())).toEqual([]);
  });
});

describe("cleanGradesForSave", () => {
  it("drops the half-filled row an admin left behind", () => {
    expect(
      cleanGradesForSave([emptyGrade(), grade({ name: "Ti" })], 0),
    ).toEqual([expect.objectContaining({ name: "Ti" })]);
  });

  it("leaves exactly one default, keeping the first", () => {
    const saved = cleanGradesForSave(
      [
        grade({ name: "Ti", isDefault: true }),
        grade({ name: "Ti-L", isDefault: true }),
      ],
      0,
    );
    expect(saved.map((g) => g.isDefault)).toEqual([true, false]);
  });

  it("marks nothing as default when the admin flagged nothing", () => {
    const saved = cleanGradesForSave([grade({ name: "Ti" })], 0);
    expect(saved[0].isDefault).toBe(false);
  });

  it("clears a photo link that now points past the end of the gallery", () => {
    expect(
      cleanGradesForSave([grade({ name: "Ti", imageIndex: 5 })], 3)[0]
        .imageIndex,
    ).toBeUndefined();
    expect(
      cleanGradesForSave([grade({ name: "Ti", imageIndex: 1 })], 3)[0]
        .imageIndex,
    ).toBe(1);
  });
});

describe("normalizeSteering", () => {
  it("accepts the codes and the spelt-out forms", () => {
    expect(normalizeSteering("rhd")).toBe("RHD");
    expect(normalizeSteering("Right Hand Drive")).toBe("RHD");
    expect(normalizeSteering("LHD")).toBe("LHD");
    expect(normalizeSteering("left-hand")).toBe("LHD");
  });

  it("is null for anything else", () => {
    expect(normalizeSteering("")).toBeNull();
    expect(normalizeSteering(undefined)).toBeNull();
    expect(normalizeSteering("centre")).toBeNull();
  });
});

describe("parseSteeringOptions", () => {
  it("returns both hands in a stable order regardless of input order", () => {
    expect(parseSteeringOptions(["LHD", "RHD"])).toEqual(["RHD", "LHD"]);
    expect(parseSteeringOptions(["RHD", "LHD"])).toEqual(["RHD", "LHD"]);
  });

  it("de-duplicates", () => {
    expect(parseSteeringOptions(["RHD", "RHD"])).toEqual(["RHD"]);
  });

  it("falls back to the legacy single column for a pre-existing dossier", () => {
    expect(parseSteeringOptions([], "LHD")).toEqual(["LHD"]);
    expect(parseSteeringOptions(undefined, "LHD")).toEqual(["LHD"]);
  });

  it("never returns an empty list", () => {
    expect(parseSteeringOptions([], "")).toEqual(["RHD"]);
    expect(parseSteeringOptions(["nonsense"], undefined)).toEqual(["RHD"]);
  });
});

describe("steeringLabel", () => {
  it("spells the hand out for a spec row or a lead", () => {
    expect(steeringLabel("RHD")).toBe("Right-hand drive (RHD)");
    expect(steeringLabel("LHD")).toBe("Left-hand drive (LHD)");
  });

  it("is empty rather than misleading for an unrecognised value", () => {
    expect(steeringLabel("")).toBe("");
    expect(steeringLabel(undefined)).toBe("");
  });
});
