import { describe, expect, it } from "vitest";
import { getTimerState, toTimestamp } from "@/lib/followUpTimer";

/**
 * `toTimestamp` guards the invariant that caused the admin panel to stop
 * responding to clicks: the values FollowUpTimer feeds into its effect
 * dependency array must be referentially stable across renders when the props
 * have not changed.
 *
 * `new Date(x)` is not stable — two calls with the same input produce two
 * objects that fail Object.is. So the effect re-ran on every render, called
 * setRatio() with a Date.now()-derived value, and re-rendered forever.
 */
describe("toTimestamp", () => {
  it("is referentially stable across calls for the same string input", () => {
    const iso = "2026-08-15T12:00:00.000Z";

    // The regression: this is what the component used to depend on.
    expect(Object.is(new Date(iso), new Date(iso))).toBe(false);

    // The fix: a primitive, so React's dependency comparison sees no change.
    expect(Object.is(toTimestamp(iso), toTimestamp(iso))).toBe(true);
  });

  it("is referentially stable across calls for the same Date input", () => {
    const d = new Date("2026-08-15T12:00:00.000Z");
    expect(Object.is(toTimestamp(d), toTimestamp(d))).toBe(true);
  });

  it("agrees with Date.getTime for both accepted prop shapes", () => {
    const iso = "2026-08-15T12:00:00.000Z";
    const expected = new Date(iso).getTime();

    expect(toTimestamp(iso)).toBe(expected);
    expect(toTimestamp(new Date(iso))).toBe(expected);
  });

  it("returns null for absent values rather than an Invalid Date", () => {
    expect(toTimestamp(null)).toBeNull();
    expect(toTimestamp(undefined)).toBeNull();
    expect(toTimestamp("")).toBeNull();
  });

  it("returns null for an unparseable date instead of NaN", () => {
    // NaN would be especially bad: NaN !== NaN, so it would reintroduce the
    // unstable-dependency loop this whole file exists to prevent.
    expect(toTimestamp("not-a-date")).toBeNull();
    expect(toTimestamp(new Date("not-a-date"))).toBeNull();
  });
});

describe("getTimerState", () => {
  const start = Date.UTC(2026, 6, 1);
  const end = Date.UTC(2026, 6, 11); // a 10-day window

  it("reports a full ratio at the moment the timer is set", () => {
    const s = getTimerState(end, start, start);
    expect(s.ratio).toBe(1);
    expect(s.expired).toBe(false);
  });

  it("reports half remaining at the midpoint", () => {
    const s = getTimerState(end, start, Date.UTC(2026, 6, 6));
    expect(s.ratio).toBeCloseTo(0.5, 10);
    expect(s.expired).toBe(false);
  });

  it("expires exactly at the deadline, not after it", () => {
    const s = getTimerState(end, start, end);
    expect(s.ratio).toBe(0);
    expect(s.expired).toBe(true);
  });

  it("clamps to zero once past the deadline", () => {
    const s = getTimerState(end, start, Date.UTC(2026, 6, 20));
    expect(s.ratio).toBe(0);
    expect(s.remaining).toBeLessThan(0);
    expect(s.expired).toBe(true);
  });

  it("clamps to one if the clock is behind when the timer was set", () => {
    // Client and server clocks can disagree; the ring must not overdraw.
    const s = getTimerState(end, start, Date.UTC(2026, 5, 25));
    expect(s.ratio).toBe(1);
  });

  it("treats a non-positive window as expired rather than dividing by zero", () => {
    const s = getTimerState(start, start, start);
    expect(s.ratio).toBe(0);
    expect(s.total).toBe(0);
    expect(s.expired).toBe(true);
    expect(Number.isNaN(s.ratio)).toBe(false);
  });
});
