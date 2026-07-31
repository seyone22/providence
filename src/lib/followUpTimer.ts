/**
 * Pure helpers for the leads-table follow-up timer.
 *
 * These live outside the component so they can be unit tested without dragging
 * in the server actions (and therefore the DB client) that FollowUpTimer.tsx
 * imports.
 */

/**
 * Normalise a follow-up prop to plain epoch milliseconds (or null).
 *
 * The point is the *primitive* return value. `new Date(x)` allocates a fresh
 * object every call, so deriving a Date from props on each render and using it
 * in a `useEffect` dependency array means the dependency never compares equal
 * and the effect re-runs forever. See the effect in FollowUpTimer.tsx.
 *
 * Unparseable input returns null rather than NaN — NaN !== NaN, so letting it
 * through would reintroduce exactly the instability this avoids.
 */
export function toTimestamp(
  value: string | Date | null | undefined,
): number | null {
  if (!value) return null;
  const ms =
    value instanceof Date ? value.getTime() : new Date(value).getTime();
  return Number.isNaN(ms) ? null : ms;
}

export interface TimerState {
  ratio: number;
  remaining: number;
  total: number;
  expired: boolean;
}

/**
 * Progress of a follow-up window, as a 0–1 ratio of time remaining.
 * Takes epoch milliseconds so callers are not tempted to pass Date objects.
 */
export function getTimerState(
  followUpAtMs: number,
  followUpSetAtMs: number,
  now: number = Date.now(),
): TimerState {
  const total = followUpAtMs - followUpSetAtMs;
  const remaining = followUpAtMs - now;
  const ratio = total > 0 ? Math.max(0, Math.min(1, remaining / total)) : 0;
  return { ratio, remaining, total, expired: remaining <= 0 };
}
