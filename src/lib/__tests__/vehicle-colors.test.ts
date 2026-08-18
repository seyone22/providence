import { describe, expect, it } from "vitest";
import {
  colorLabel,
  DEFAULT_COLOR_HEX,
  normalizeHex,
  parseColors,
  swatchStyle,
  type VehicleColor,
} from "@/lib/vehicle-colors";

describe("normalizeHex", () => {
  it("passes through a full hex, lowercased", () => {
    expect(normalizeHex("#C8102E")).toBe("#c8102e");
  });

  it("expands shorthand", () => {
    expect(normalizeHex("#f0a")).toBe("#ff00aa");
  });

  it("adds a missing leading hash", () => {
    expect(normalizeHex("1a2b3c")).toBe("#1a2b3c");
  });

  it("falls back to the default for junk or missing input", () => {
    expect(normalizeHex("not a colour")).toBe(DEFAULT_COLOR_HEX);
    expect(normalizeHex("")).toBe(DEFAULT_COLOR_HEX);
    expect(normalizeHex(undefined)).toBe(DEFAULT_COLOR_HEX);
  });
});

describe("colorLabel", () => {
  it("returns the bare name for a single-tone colour", () => {
    expect(colorLabel({ name: "Sonic Grey", hex: "#666666" })).toBe(
      "Sonic Grey",
    );
  });

  it("joins both tones when a secondary name is set", () => {
    expect(
      colorLabel({
        name: "Emotional Red",
        hex: "#c8102e",
        hex2: "#111111",
        isDualTone: true,
        secondaryName: "Black roof",
      }),
    ).toBe("Emotional Red / Black roof");
  });

  it("marks a two-tone colour even without a secondary name", () => {
    expect(
      colorLabel({ name: "Emotional Red", hex: "#c8102e", isDualTone: true }),
    ).toBe("Emotional Red (two-tone)");
  });
});

describe("parseColors", () => {
  it("returns an empty array for anything that isn't a list", () => {
    expect(parseColors(undefined)).toEqual([]);
    expect(parseColors(null)).toEqual([]);
    expect(parseColors("[]")).toEqual([]);
    expect(parseColors({ name: "Red" })).toEqual([]);
  });

  it("drops entries with no name — a swatch with no label is unusable", () => {
    expect(
      parseColors([
        { name: "", hex: "#ffffff" },
        { name: "   ", hex: "#000000" },
        { hex: "#123456" },
        { name: "Keep me", hex: "#123456" },
      ]),
    ).toHaveLength(1);
  });

  it("survives nulls and non-objects mixed into the array", () => {
    expect(
      parseColors([null, "red", 42, { name: "Real", hex: "#abcdef" }]),
    ).toEqual([
      {
        name: "Real",
        hex: "#abcdef",
        hex2: DEFAULT_COLOR_HEX,
        isDualTone: false,
        secondaryName: "",
      },
    ]);
  });

  it("only treats isDualTone === true as two-tone", () => {
    const parsed = parseColors([
      { name: "A", hex: "#111111", isDualTone: "yes" },
      { name: "B", hex: "#222222", isDualTone: 1 },
      { name: "C", hex: "#333333", isDualTone: true },
    ]);
    expect(parsed.map((c) => c.isDualTone)).toEqual([false, false, true]);
  });

  it("normalises hexes it finds", () => {
    expect(parseColors([{ name: "A", hex: "ABCDEF" }])[0].hex).toBe("#abcdef");
  });
});

describe("swatchStyle", () => {
  it("uses a flat background for a single tone", () => {
    expect(swatchStyle({ name: "Grey", hex: "#666666" })).toEqual({
      backgroundColor: "#666666",
    });
  });

  it("renders two tones as a hard split, not a blend", () => {
    const style = swatchStyle({
      name: "Red",
      hex: "#c8102e",
      hex2: "#111111",
      isDualTone: true,
    });
    // Both stops sit at 50% so the edge stays hard — a soft gradient would
    // read as a third, non-existent colour.
    expect(style.backgroundImage).toBe(
      "linear-gradient(135deg, #c8102e 0%, #c8102e 50%, #111111 50%, #111111 100%)",
    );
    expect(style.backgroundColor).toBeUndefined();
  });

  it("falls back to the default when a two-tone entry has no second hex", () => {
    const color: VehicleColor = {
      name: "Red",
      hex: "#c8102e",
      isDualTone: true,
    };
    expect(swatchStyle(color).backgroundImage).toContain(DEFAULT_COLOR_HEX);
  });
});
