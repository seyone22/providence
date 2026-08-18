import { describe, expect, it } from "vitest";
import {
  buildSpokes,
  hashNoise,
  maxRadiusFrom,
  mixHex,
  spokeFrame,
} from "@/lib/burst";

const DEFAULTS = {
  rays: 160,
  spread: 200,
  rotation: -90,
  colours: ["#8b5cf6", "#ec4899"] as [string, string],
};

describe("mixHex", () => {
  it("returns the endpoints exactly", () => {
    expect(mixHex("#8b5cf6", "#ec4899", 0)).toEqual([0x8b, 0x5c, 0xf6]);
    expect(mixHex("#8b5cf6", "#ec4899", 1)).toEqual([0xec, 0x48, 0x99]);
  });

  it("interpolates each channel at the midpoint", () => {
    expect(mixHex("#000000", "#ffffff", 0.5)).toEqual([128, 128, 128]);
  });

  it("accepts hex with or without the leading hash", () => {
    expect(mixHex("000000", "#ffffff", 1)).toEqual([255, 255, 255]);
  });

  it("stays in range for every channel", () => {
    for (let i = 0; i <= 10; i += 1) {
      for (const channel of mixHex("#0ea5e9", "#ec4899", i / 10)) {
        expect(channel).toBeGreaterThanOrEqual(0);
        expect(channel).toBeLessThanOrEqual(255);
        expect(Number.isInteger(channel)).toBe(true);
      }
    }
  });
});

describe("hashNoise", () => {
  it("is deterministic — the same index and salt always give the same value", () => {
    expect(hashNoise(7, 2)).toBe(hashNoise(7, 2));
    expect(hashNoise(41, 3)).toBe(hashNoise(41, 3));
  });

  it("stays within [0, 1)", () => {
    for (let i = 0; i < 500; i += 1) {
      for (const salt of [1, 2, 3, 4]) {
        const value = hashNoise(i, salt);
        expect(value).toBeGreaterThanOrEqual(0);
        expect(value).toBeLessThan(1);
      }
    }
  });

  it("decorrelates the salts, so a spoke's four traits differ", () => {
    for (let i = 0; i < 50; i += 1) {
      expect(hashNoise(i, 1)).not.toBe(hashNoise(i, 2));
    }
  });
});

describe("buildSpokes", () => {
  it("builds one spoke per ray", () => {
    expect(buildSpokes(DEFAULTS)).toHaveLength(160);
  });

  it("spans exactly the requested arc, centred on the rotation", () => {
    const spokes = buildSpokes(DEFAULTS);
    const degrees = spokes.map((s) => (s.angle * 180) / Math.PI);
    expect(degrees[0]).toBeCloseTo(-90 - 100, 9);
    expect(degrees[degrees.length - 1]).toBeCloseTo(-90 + 100, 9);
  });

  it("orders spokes monotonically around the fan", () => {
    const spokes = buildSpokes(DEFAULTS);
    for (let i = 1; i < spokes.length; i += 1) {
      expect(spokes[i].angle).toBeGreaterThan(spokes[i - 1].angle);
    }
  });

  it("puts a single ray in the middle rather than at an edge", () => {
    const [only] = buildSpokes({ ...DEFAULTS, rays: 1 });
    expect((only.angle * 180) / Math.PI).toBeCloseTo(-90, 9);
  });

  it("ramps colour from the first to the second across the fan", () => {
    const spokes = buildSpokes(DEFAULTS);
    expect(spokes[0].colour).toEqual([0x8b, 0x5c, 0xf6]);
    expect(spokes[spokes.length - 1].colour).toEqual([0xec, 0x48, 0x99]);
  });

  it("keeps every trait inside its documented band", () => {
    for (const spoke of buildSpokes({ ...DEFAULTS, rays: 400 })) {
      expect(spoke.reach).toBeGreaterThanOrEqual(0.55);
      expect(spoke.reach).toBeLessThan(1);
      expect(spoke.velocity).toBeGreaterThanOrEqual(0.12);
      expect(spoke.velocity).toBeLessThan(0.34);
      expect(spoke.phase).toBeGreaterThanOrEqual(0);
      expect(spoke.phase).toBeLessThan(1);
      expect(spoke.trail).toBeGreaterThanOrEqual(0.1);
      expect(spoke.trail).toBeLessThan(0.32);
    }
  });

  it("is reproducible across calls, so remounts do not reshuffle the fan", () => {
    expect(buildSpokes(DEFAULTS)).toEqual(buildSpokes(DEFAULTS));
  });
});

describe("spokeFrame", () => {
  const [spoke] = buildSpokes({ ...DEFAULTS, rays: 1 });

  it("keeps the trail behind the head and never behind the origin", () => {
    for (let t = 0; t < 20; t += 0.37) {
      const frame = spokeFrame(spoke, t, 1, 500);
      expect(frame.tail).toBeGreaterThanOrEqual(0);
      expect(frame.tail).toBeLessThanOrEqual(frame.head);
    }
  });

  it("never sends the head past the spoke's reach", () => {
    for (let t = 0; t < 20; t += 0.19) {
      const frame = spokeFrame(spoke, t, 1, 500);
      expect(frame.head).toBeLessThanOrEqual(spoke.reach * 500 + 1e-9);
    }
  });

  it("holds life within [0, 1] and fades at both ends of the cycle", () => {
    // Pick the elapsed times that put this spoke at the start, middle and end.
    const atProgress = (p: number) => (p - spoke.phase + 2) / spoke.velocity;
    expect(spokeFrame(spoke, atProgress(0), 1, 500).life).toBeCloseTo(0, 6);
    expect(spokeFrame(spoke, atProgress(0.5), 1, 500).life).toBeCloseTo(1, 6);
    expect(spokeFrame(spoke, atProgress(1), 1, 500).life).toBeCloseTo(0, 6);
  });

  it("handles negative elapsed time without going backwards past the origin", () => {
    const frame = spokeFrame(spoke, -3.2, 1, 500);
    expect(frame.head).toBeGreaterThanOrEqual(0);
    expect(frame.tail).toBeGreaterThanOrEqual(0);
    expect(frame.life).toBeGreaterThanOrEqual(0);
  });

  it("freezes the fan when speed is zero", () => {
    const a = spokeFrame(spoke, 1, 0, 500);
    const b = spokeFrame(spoke, 99, 0, 500);
    expect(a).toEqual(b);
  });
});

describe("maxRadiusFrom", () => {
  it("reaches the far corner from a centred origin", () => {
    expect(maxRadiusFrom(50, 50, 100, 100)).toBeCloseTo(Math.hypot(50, 50), 9);
  });

  it("reaches the opposite corner from an origin in a corner", () => {
    expect(maxRadiusFrom(0, 0, 300, 400)).toBeCloseTo(500, 9);
  });

  it("covers the whole box from a bottom-centre origin", () => {
    // The default <RadialBurst /> origin: must still reach the top corners.
    const r = maxRadiusFrom(500, 400, 1000, 400);
    expect(r).toBeGreaterThanOrEqual(Math.hypot(500, 400));
  });
});
