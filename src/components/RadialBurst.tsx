"use client";

import { useEffect, useRef } from "react";
import { buildSpokes, maxRadiusFrom, spokeFrame } from "@/lib/burst";

/**
 * Canvas ray-burst: particles travelling outward from a single origin along
 * fixed spokes, each leaving a fading trail.
 *
 * This is the cheap cousin of <DotGlobe /> — same idea (a particle field over a
 * gradient, driven by one requestAnimationFrame loop) with none of the sphere
 * maths. Use it as a section backdrop or behind a stat row.
 *
 * The whole effect is one parametrisation: a spoke's angle is fixed for the life
 * of the component, and only the particle's radius animates. That is what gives
 * the clean fan of straight lines rather than a scatter — the randomness lives
 * in each spoke's speed, length and starting phase, never in its direction.
 */

type Props = {
  /** Origin as a fraction of the box: [0,0] is top-left, [0.5, 1] is bottom-centre. */
  origin?: [number, number];
  /** Number of spokes. */
  rays?: number;
  /** Angular span in degrees. 360 is a full starburst; 200 gives the fan shape. */
  spread?: number;
  /** Direction the fan points, in degrees. -90 is straight up. */
  rotation?: number;
  /** Colour ramp across the fan; interpolated per spoke. */
  colours?: [string, string];
  /** Multiplier on particle travel speed. */
  speed?: number;
  /** Draws the warm gradient wash behind the rays. */
  backdrop?: boolean;
  className?: string;
};

export default function RadialBurst({
  origin = [0.5, 1],
  rays = 160,
  spread = 200,
  rotation = -90,
  colours = ["#8b5cf6", "#ec4899"],
  speed = 1,
  backdrop = true,
  className = "",
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let cancelled = false;
    let frame = 0;
    let width = 0;
    let height = 0;
    let onScreen = true;

    const spokes = buildSpokes({ rays, spread, rotation, colours });

    // Arrow consts, not `function` declarations: TypeScript discards the
    // non-null narrowing of `canvas` / `ctx` / `wrap` inside a hoisted
    // declaration, since one could in principle run before the guards above.
    const resize = () => {
      const rect = wrap.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = (elapsed: number) => {
      ctx.clearRect(0, 0, width, height);
      const ox = origin[0] * width;
      const oy = origin[1] * height;
      const maxRadius = maxRadiusFrom(ox, oy, width, height);

      ctx.lineCap = "round";
      for (const spoke of spokes) {
        const { head, tail, life } = spokeFrame(
          spoke,
          elapsed,
          speed,
          maxRadius,
        );
        if (life <= 0.01) continue;

        const rgb = spoke.colour.join(", ");
        const cos = Math.cos(spoke.angle);
        const sin = Math.sin(spoke.angle);

        const gradient = ctx.createLinearGradient(
          ox + cos * tail,
          oy + sin * tail,
          ox + cos * head,
          oy + sin * head,
        );
        gradient.addColorStop(0, `rgba(${rgb}, 0)`);
        gradient.addColorStop(1, `rgba(${rgb}, ${0.55 * life})`);

        ctx.strokeStyle = gradient;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(ox + cos * tail, oy + sin * tail);
        ctx.lineTo(ox + cos * head, oy + sin * head);
        ctx.stroke();

        ctx.fillStyle = `rgba(${rgb}, ${0.9 * life})`;
        ctx.beginPath();
        ctx.arc(ox + cos * head, oy + sin * head, 1.9, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const tick = (now: number): void => {
      if (cancelled) return;
      draw(now / 1000);
      frame = requestAnimationFrame(tick);
    };

    const resizeObserver = new ResizeObserver(() => {
      resize();
      if (reduceMotion || !onScreen) draw(2.4);
    });
    resizeObserver.observe(wrap);

    const visibility = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry.isIntersecting;
        if (reduceMotion) return;
        if (onScreen && !frame) {
          frame = requestAnimationFrame(tick);
        } else if (!onScreen && frame) {
          cancelAnimationFrame(frame);
          frame = 0;
        }
      },
      { rootMargin: "120px" },
    );
    visibility.observe(wrap);

    resize();
    if (reduceMotion) {
      // A single frame mid-cycle: the fan is fully formed, just not moving.
      draw(2.4);
    } else {
      frame = requestAnimationFrame(tick);
    }

    return () => {
      cancelled = true;
      if (frame) cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      visibility.disconnect();
    };
    // Depends on the array *contents*, not the array identities. Callers pass
    // these inline (`origin={[0.5, 1]}`), and the defaults above allocate afresh
    // on every render, so depending on the arrays themselves would tear down and
    // rebuild the whole particle system each time the parent re-renders.
  }, [
    origin[0],
    origin[1],
    rays,
    spread,
    rotation,
    colours[0],
    colours[1],
    speed,
  ]);

  return (
    <div
      ref={wrapRef}
      aria-hidden
      className={`pointer-events-none relative overflow-hidden ${className}`}
    >
      {backdrop && <div className="pa-burst-backdrop absolute inset-0" />}
      <canvas ref={canvasRef} className="absolute inset-0" />
    </div>
  );
}
