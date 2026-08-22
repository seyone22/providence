/**
 * Timing and geometry helpers shared by the animated marketing components.
 *
 * Pure and framework-free, for the same reason as lib/globe/geo.ts: the preview
 * harness runs zero animation frames, so anything reachable only from inside a
 * requestAnimationFrame callback cannot be verified. Keep the maths here and the
 * components thin.
 */

/** Clamps to 0..1. */
export const clamp01 = (t: number) => Math.max(0, Math.min(1, t));

/** Decelerating ease — fast start, soft landing. The default for reveals. */
export function easeOutCubic(t: number): number {
  const x = clamp01(t);
  return 1 - (1 - x) ** 3;
}

/** Symmetric ease, for things that start and stop in place. */
export function easeInOutCubic(t: number): number {
  const x = clamp01(t);
  return x < 0.5 ? 4 * x ** 3 : 1 - (-2 * x + 2) ** 3 / 2;
}

export type Window = { start: number; end: number };

/**
 * The slice of a 0..1 timeline belonging to item `index` of `count`.
 *
 * `overlap` is how much of each item's window is shared with the next: 0 runs
 * them strictly one after another, 1 runs them all at once. Around 0.4 reads as
 * a sequence while still feeling continuous rather than clacking through steps.
 */
export function segmentWindow(
  index: number,
  count: number,
  overlap = 0.4,
): Window {
  if (count <= 1) return { start: 0, end: 1 };
  const share = 1 / (count - (count - 1) * overlap);
  const step = share * (1 - overlap);
  const start = index * step;
  return { start, end: Math.min(1, start + share) };
}

/** Local 0..1 progress of a window, given overall timeline progress. */
export function windowProgress(t: number, window: Window): number {
  if (window.end <= window.start) return t >= window.end ? 1 : 0;
  return clamp01((t - window.start) / (window.end - window.start));
}

/**
 * The value shown by every column of a mechanical odometer, all at once.
 *
 * Index 0 is the units column, 1 is tens, and so on. Each returned number is
 * the column's digit plus the fraction of the way it has turned towards the
 * next one, so a caller can translate a strip of 0-9 by `offset * digitHeight`.
 *
 * Columns are geared to the one below them the way a real drum counter is:
 * the units column spins continuously, but a higher column only turns during
 * the final stretch of the one below it completing a revolution — its digit
 * sitting on 9, rolling towards 0 — not for the whole time the value is
 * counting up. That is what keeps a column parked on a clean whole digit at
 * rest on *any* value, not just a round one, while a genuine rollover
 * (…999 → …000) still cascades a turn across every column at once, because
 * each column's bleed window only opens once the one below it is already
 * bleeding.
 *
 * (An earlier version derived each column independently from `value / 10^place`,
 * which reads as geared while the value is still climbing but never settles: a
 * finished count landing on, say, 4812 left the tens column parked 20% of the
 * way to 2 forever, because that fraction came from the units digit's raw
 * magnitude rather than from an actual rollover. Chaining the bleed from each
 * column's own resolved offset fixes that — every column is exact once its
 * neighbour below is.)
 */
export function odometerColumns(value: number, columns: number): number[] {
  const v = Math.max(0, value);
  const offsets: number[] = [];
  let below = 0;
  for (let place = 0; place < columns; place += 1) {
    const digit = Math.floor(v / 10 ** place) % 10;
    // Place 0 has nothing below it to gear from, so it just spins with the
    // value's own sub-digit fraction. Every column above only picks up a
    // fraction once the column below has turned past 9 — the last tenth of
    // its revolution.
    const bleed = place === 0 ? v - Math.floor(v) : clamp01(below - 9);
    const offset = digit + bleed;
    offsets.push(offset);
    below = offset;
  }
  return offsets;
}

/** Number of digit columns needed to show `value`. */
export function digitCount(value: number): number {
  return Math.max(1, Math.floor(Math.log10(Math.max(1, Math.abs(value)))) + 1);
}

export type Point = { x: number; y: number };

/**
 * Point at `t` along a quadratic Bézier.
 *
 * Used to place the vessel marker on <VoyageTrack />'s route. Computed rather
 * than read from SVGGeometryElement.getPointAtLength so the position is
 * available without a laid-out DOM — which is what makes the route testable.
 */
export function quadPoint(p0: Point, p1: Point, p2: Point, t: number): Point {
  const x = clamp01(t);
  const inv = 1 - x;
  return {
    x: inv * inv * p0.x + 2 * inv * x * p1.x + x * x * p2.x,
    y: inv * inv * p0.y + 2 * inv * x * p1.y + x * x * p2.y,
  };
}

/** Tangent angle in radians at `t`, for pointing a marker along the route. */
export function quadAngle(p0: Point, p1: Point, p2: Point, t: number): number {
  const x = clamp01(t);
  const inv = 1 - x;
  // Derivative of the quadratic Bézier.
  const dx = 2 * inv * (p1.x - p0.x) + 2 * x * (p2.x - p1.x);
  const dy = 2 * inv * (p1.y - p0.y) + 2 * x * (p2.y - p1.y);
  return Math.atan2(dy, dx);
}

/**
 * Approximate arc length of a quadratic Bézier, by subdivision.
 *
 * Needed for stroke-dasharray: to draw a path on progressively, the dash and the
 * offset both have to be the path's real length, and SVG's getTotalLength is a
 * DOM call.
 */
export function quadLength(
  p0: Point,
  p1: Point,
  p2: Point,
  steps = 64,
): number {
  let length = 0;
  let previous = quadPoint(p0, p1, p2, 0);
  for (let i = 1; i <= steps; i += 1) {
    const current = quadPoint(p0, p1, p2, i / steps);
    length += Math.hypot(current.x - previous.x, current.y - previous.y);
    previous = current;
  }
  return length;
}
