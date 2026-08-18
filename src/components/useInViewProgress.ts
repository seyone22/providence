"use client";

import {
  type RefObject,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

/**
 * useLayoutEffect warns when React runs it on the server, where it is a no-op.
 * The reset below has to happen before the first client paint, so it genuinely
 * needs the layout phase — this just picks the harmless variant per environment.
 */
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

/**
 * Drives a 0..1 progress value once the element scrolls into view.
 *
 * Shared by the animated marketing components so they all start on the same
 * trigger as <Reveal> does, rather than each inventing its own. Like Reveal, it
 * plays once and stays finished — an element that has already told its story
 * should not replay it every time it passes the viewport.
 *
 * ## Why it starts at 1 and rewinds
 *
 * The obvious shape — start at 0 and count up — makes the server-rendered HTML
 * the *empty* state: a landed-cost bar that says £0, a route with nothing drawn.
 * That is what a crawler indexes and what anyone without JavaScript is left
 * with, and for a component whose whole job is to show a number it is worse than
 * having no animation at all.
 *
 * So the finished state is the default, and the client rewinds to 0 in the
 * layout phase — before the first paint, so there is no flash of the final value
 * — and animates forward from there.
 *
 * Under prefers-reduced-motion it simply never rewinds: the finished state is
 * the information, the animation is only the delivery.
 */
export function useInViewProgress(
  ref: RefObject<HTMLElement | null>,
  durationMs = 1800,
  delayMs = 0,
): number {
  const [progress, setProgress] = useState(1);
  // Held in a ref so the observer callback never re-subscribes on each frame.
  const started = useRef(false);

  useIsomorphicLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;
    if (started.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    setProgress(0);

    let frame = 0;
    let startedAt = 0;
    let cancelled = false;

    const tick = (now: number): void => {
      if (cancelled) return;
      if (!startedAt) startedAt = now;
      const elapsed = now - startedAt - delayMs;
      if (elapsed < 0) {
        frame = requestAnimationFrame(tick);
        return;
      }
      const next = Math.min(1, elapsed / durationMs);
      setProgress(next);
      if (next < 1) frame = requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || started.current) return;
        started.current = true;
        observer.disconnect();
        frame = requestAnimationFrame(tick);
      },
      { rootMargin: "0px 0px -15% 0px" },
    );
    observer.observe(element);

    return () => {
      cancelled = true;
      if (frame) cancelAnimationFrame(frame);
      observer.disconnect();
      // If this unmounts before it ever ran, leave the finished state behind
      // rather than a half-drawn one.
      if (!started.current) setProgress(1);
    };
  }, [ref, durationMs, delayMs]);

  return progress;
}
