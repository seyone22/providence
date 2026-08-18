import { describe, expect, it } from "vitest";
import {
  clamp01,
  digitCount,
  easeInOutCubic,
  easeOutCubic,
  odometerColumn,
  quadAngle,
  quadLength,
  quadPoint,
  segmentWindow,
  windowProgress,
} from "@/lib/motion";

describe("easings", () => {
  it("pin both ends", () => {
    for (const ease of [easeOutCubic, easeInOutCubic]) {
      expect(ease(0)).toBeCloseTo(0, 12);
      expect(ease(1)).toBeCloseTo(1, 12);
    }
  });

  it("clamp out-of-range input rather than overshooting", () => {
    for (const ease of [easeOutCubic, easeInOutCubic]) {
      expect(ease(-3)).toBeCloseTo(0, 12);
      expect(ease(4)).toBeCloseTo(1, 12);
    }
  });

  it("increase monotonically", () => {
    for (const ease of [easeOutCubic, easeInOutCubic]) {
      let previous = -1;
      for (let i = 0; i <= 100; i += 1) {
        const value = ease(i / 100);
        expect(value).toBeGreaterThanOrEqual(previous);
        previous = value;
      }
    }
  });

  it("easeOutCubic decelerates — it is past halfway before the midpoint", () => {
    expect(easeOutCubic(0.5)).toBeGreaterThan(0.5);
  });

  it("easeInOutCubic is symmetric about the midpoint", () => {
    expect(easeInOutCubic(0.5)).toBeCloseTo(0.5, 12);
    for (const t of [0.1, 0.25, 0.4]) {
      expect(easeInOutCubic(t) + easeInOutCubic(1 - t)).toBeCloseTo(1, 12);
    }
  });

  it("clamp01 bounds its input", () => {
    expect(clamp01(-1)).toBe(0);
    expect(clamp01(0.3)).toBe(0.3);
    expect(clamp01(9)).toBe(1);
  });
});

describe("segmentWindow", () => {
  it("gives a single item the whole timeline", () => {
    expect(segmentWindow(0, 1)).toEqual({ start: 0, end: 1 });
  });

  it("starts the first item at zero and ends the last at one", () => {
    const count = 5;
    expect(segmentWindow(0, count).start).toBeCloseTo(0, 12);
    expect(segmentWindow(count - 1, count).end).toBeCloseTo(1, 12);
  });

  it("orders windows and keeps them the same length", () => {
    const count = 4;
    const windows = Array.from({ length: count }, (_, i) =>
      segmentWindow(i, count),
    );
    const span = windows[0].end - windows[0].start;
    for (let i = 1; i < count; i += 1) {
      expect(windows[i].start).toBeGreaterThan(windows[i - 1].start);
      expect(windows[i].end - windows[i].start).toBeCloseTo(span, 12);
    }
  });

  it("runs items strictly in sequence at zero overlap", () => {
    const a = segmentWindow(0, 3, 0);
    const b = segmentWindow(1, 3, 0);
    expect(b.start).toBeCloseTo(a.end, 12);
  });

  it("runs everything at once at full overlap", () => {
    for (let i = 0; i < 3; i += 1) {
      const w = segmentWindow(i, 3, 1);
      expect(w.start).toBeCloseTo(0, 12);
      expect(w.end).toBeCloseTo(1, 12);
    }
  });

  it("overlaps neighbours in between, so the sequence is continuous", () => {
    const a = segmentWindow(0, 4, 0.4);
    const b = segmentWindow(1, 4, 0.4);
    expect(b.start).toBeLessThan(a.end);
    expect(b.start).toBeGreaterThan(a.start);
  });
});

describe("windowProgress", () => {
  const window = { start: 0.25, end: 0.75 };

  it("is 0 before, 1 after, and linear within", () => {
    expect(windowProgress(0, window)).toBe(0);
    expect(windowProgress(0.25, window)).toBeCloseTo(0, 12);
    expect(windowProgress(0.5, window)).toBeCloseTo(0.5, 12);
    expect(windowProgress(0.75, window)).toBeCloseTo(1, 12);
    expect(windowProgress(1, window)).toBe(1);
  });

  it("does not divide by zero on a zero-width window", () => {
    const instant = { start: 0.5, end: 0.5 };
    expect(windowProgress(0.4, instant)).toBe(0);
    expect(windowProgress(0.5, instant)).toBe(1);
    expect(windowProgress(0.6, instant)).toBe(1);
  });
});

describe("odometerColumn", () => {
  it("reads the digit at each place when the drums are settled", () => {
    // A round number leaves every column parked on a whole digit.
    expect(odometerColumn(4000, 0)).toBeCloseTo(0, 12);
    expect(odometerColumn(4000, 1)).toBeCloseTo(0, 12);
    expect(odometerColumn(4000, 2)).toBeCloseTo(0, 12);
    expect(odometerColumn(4000, 3)).toBeCloseTo(4, 12);
    expect(odometerColumn(4810, 1)).toBeCloseTo(1, 12);
    expect(odometerColumn(4800, 2)).toBeCloseTo(8, 12);
  });

  it("part-turns a column when the one below it is mid-way", () => {
    // The point of a geared drum: at 4812 the tens digit is 1, but the drum has
    // already turned 20% towards 2 because the units are sitting at 2. Reading
    // the tens as a flat 1 would make the columns animate independently, which
    // is what makes cheap odometers look wrong.
    expect(odometerColumn(4812, 0)).toBeCloseTo(2, 12);
    expect(odometerColumn(4812, 1)).toBeCloseTo(1.2, 12);
    expect(odometerColumn(4812, 2)).toBeCloseTo(8.12, 12);
    expect(odometerColumn(4812, 3)).toBeCloseTo(4.812, 12);
  });

  it("carries the fractional turn on the units column", () => {
    expect(odometerColumn(7.5, 0)).toBeCloseTo(7.5, 12);
  });

  it("gears higher columns to turn a tenth as fast", () => {
    // Going from 19 to 20: units make a whole turn, tens make a tenth of one.
    const tensAt19 = odometerColumn(19, 1);
    const tensAt20 = odometerColumn(20, 1);
    expect(tensAt20 - tensAt19).toBeCloseTo(0.1, 12);
  });

  it("wraps 9 to 0 rather than running to 10", () => {
    expect(odometerColumn(9, 0)).toBeCloseTo(9, 12);
    expect(odometerColumn(10, 0)).toBeCloseTo(0, 12);
    expect(odometerColumn(19, 0)).toBeCloseTo(9, 12);
  });

  it("always sits within one drum revolution", () => {
    for (let v = 0; v < 5000; v += 7.3) {
      for (const place of [0, 1, 2, 3]) {
        const column = odometerColumn(v, place);
        expect(column).toBeGreaterThanOrEqual(0);
        expect(column).toBeLessThan(10);
      }
    }
  });

  it("treats negatives as zero rather than rolling backwards", () => {
    expect(odometerColumn(-42, 0)).toBe(0);
  });
});

describe("digitCount", () => {
  it("counts the columns needed", () => {
    expect(digitCount(0)).toBe(1);
    expect(digitCount(7)).toBe(1);
    expect(digitCount(10)).toBe(2);
    expect(digitCount(99)).toBe(2);
    expect(digitCount(100)).toBe(3);
    expect(digitCount(4812)).toBe(4);
  });

  it("never returns fewer than one column", () => {
    expect(digitCount(-5)).toBeGreaterThanOrEqual(1);
    expect(digitCount(0.2)).toBe(1);
  });
});

describe("quadratic Bézier", () => {
  const p0 = { x: 0, y: 100 };
  const p1 = { x: 50, y: 0 };
  const p2 = { x: 100, y: 100 };

  it("starts and ends on the endpoints", () => {
    expect(quadPoint(p0, p1, p2, 0)).toEqual(p0);
    expect(quadPoint(p0, p1, p2, 1)).toEqual(p2);
  });

  it("bows towards the control point without reaching it", () => {
    const mid = quadPoint(p0, p1, p2, 0.5);
    expect(mid.x).toBeCloseTo(50, 12);
    expect(mid.y).toBeCloseTo(50, 12); // halfway to the control point, not at it
    expect(mid.y).toBeGreaterThan(p1.y);
  });

  it("clamps t rather than extrapolating off the curve", () => {
    expect(quadPoint(p0, p1, p2, -1)).toEqual(p0);
    expect(quadPoint(p0, p1, p2, 2)).toEqual(p2);
  });

  it("advances monotonically in x for this control layout", () => {
    let previous = -1;
    for (let i = 0; i <= 50; i += 1) {
      const { x } = quadPoint(p0, p1, p2, i / 50);
      expect(x).toBeGreaterThan(previous);
      previous = x;
    }
  });

  it("points the tangent along the direction of travel", () => {
    // Rising towards the control point, then falling away from it.
    expect(quadAngle(p0, p1, p2, 0.1)).toBeLessThan(0);
    expect(quadAngle(p0, p1, p2, 0.9)).toBeGreaterThan(0);
    // Level at the apex.
    expect(quadAngle(p0, p1, p2, 0.5)).toBeCloseTo(0, 12);
  });

  it("measures a length at least the straight-line distance", () => {
    const straight = Math.hypot(p2.x - p0.x, p2.y - p0.y);
    expect(quadLength(p0, p1, p2)).toBeGreaterThan(straight);
  });

  it("converges as the subdivision gets finer", () => {
    const coarse = quadLength(p0, p1, p2, 16);
    const fine = quadLength(p0, p1, p2, 512);
    expect(Math.abs(fine - coarse) / fine).toBeLessThan(0.01);
    expect(fine).toBeGreaterThanOrEqual(coarse);
  });

  it("degenerates to a straight line when the control point is collinear", () => {
    const a = { x: 0, y: 0 };
    const b = { x: 5, y: 5 };
    const c = { x: 10, y: 10 };
    expect(quadLength(a, b, c)).toBeCloseTo(Math.hypot(10, 10), 6);
  });
});
