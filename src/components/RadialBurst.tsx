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
 * The whole effect is one parametrisation: a spoke's angle is fixed relative to
 * the fan for the life of the component, and only the particle's radius
 * animates. That is what gives the clean fan of straight lines rather than a
 * scatter — the randomness lives in each spoke's speed, length and starting
 * phase, never in its direction.
 *
 * ## Interactivity
 *
 * The fan as a whole can turn, on top of its fixed per-spoke geometry — the
 * same split DotGlobe uses between the sphere's fixed dot field and its live
 * spin. Two inputs drive it, both horizontal-only per the brief:
 *  - Hovering tilts the fan a few degrees towards the cursor's x position,
 *    easing back to centre when the pointer leaves. This is a direct read of
 *    pointer position, not physics, so it stays on under reduced motion.
 *  - Dragging or a horizontal wheel/trackpad swipe spins the fan with the same
 *    inertia-and-friction model as the globe's drag-to-spin, so a flick keeps
 *    turning and settles rather than snapping back.
 * Both add a runtime radians offset to every spoke's fixed angle at draw time,
 * so buildSpokes' output — and its tests — stay exactly as they were.
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
  /** Cursor tilt and drag/wheel spin. Off for a purely decorative backdrop. */
  interactive?: boolean;
  className?: string;
};

/** Max cursor-follow tilt, in radians (18°). */
const HOVER_MAX = (18 * Math.PI) / 180;
/** How fast the hover tilt eases towards the cursor's current x, per second. */
const HOVER_EASE = 4.5;
/** Radians of spin per pixel dragged. */
const DRAG_SENSITIVITY = 0.006;
/** How hard a drag's release velocity carries the spin on, per second. */
const RELEASE_CARRY = 40;
/** Per-second decay on the spin's release velocity. */
const SPIN_FRICTION = 2.4;
/** Radians/sec of spin per pixel of horizontal wheel delta. */
const WHEEL_SENSITIVITY = 0.0022;

export default function RadialBurst({
  origin = [0.5, 1],
  rays = 160,
  spread = 200,
  rotation = -90,
  colours = ["#8b5cf6", "#ec4899"],
  speed = 1,
  backdrop = true,
  interactive = true,
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

    // Turn state, layered on top of the spokes' fixed geometry — see the
    // "Interactivity" note above. `spin` is the persistent drag/wheel angle
    // (with inertia, like the globe's); `hoverTarget`/`hoverCurrent` are the
    // cursor-follow tilt, eased rather than snapped.
    let spin = 0;
    let spinVelocity = 0;
    let hoverTarget = 0;
    let hoverCurrent = 0;
    let dragging = false;
    let lastPointerX = 0;

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
      // Runtime-only turn on top of each spoke's fixed angle — see the
      // "Interactivity" note above.
      const turn = hoverCurrent + spin;

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
        const cos = Math.cos(spoke.angle + turn);
        const sin = Math.sin(spoke.angle + turn);

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

    let previous = 0;
    const tick = (now: number): void => {
      if (cancelled) return;
      const dt = previous ? Math.min((now - previous) / 1000, 0.05) : 0;
      previous = now;

      // Hover always eases towards its target. The drag/wheel spin only
      // decays while nothing is actively dragging it — a flick should carry
      // on turning after release, not stop the instant the pointer lifts.
      hoverCurrent +=
        (hoverTarget - hoverCurrent) * Math.min(1, dt * HOVER_EASE);
      if (!dragging) {
        spin += spinVelocity * dt;
        spinVelocity *= Math.max(0, 1 - dt * SPIN_FRICTION);
      }

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
          previous = 0;
          frame = requestAnimationFrame(tick);
        } else if (!onScreen && frame) {
          cancelAnimationFrame(frame);
          frame = 0;
        }
      },
      { rootMargin: "120px" },
    );
    visibility.observe(wrap);

    // Hover: hovering the fan aims it a few degrees towards the cursor,
    // horizontally only. Reading pointer position is not itself motion, so
    // this stays live under reduced motion too — it just never visibly moves
    // there, since the rAF loop that would ease it in is off.
    const onPointerEnterOrMove = (event: PointerEvent) => {
      if (dragging) return;
      const rect = wrap.getBoundingClientRect();
      const nx = rect.width
        ? ((event.clientX - rect.left) / rect.width) * 2 - 1
        : 0;
      hoverTarget = Math.max(-1, Math.min(1, nx)) * HOVER_MAX;
    };
    const onPointerLeave = () => {
      hoverTarget = 0;
    };

    // Drag / swipe: same inertia model as <DotGlobe />'s drag-to-spin, applied
    // to the fan's turn instead of a sphere's spin.
    const onPointerDown = (event: PointerEvent) => {
      dragging = true;
      lastPointerX = event.clientX;
      spinVelocity = 0;
      canvas.setPointerCapture(event.pointerId);
    };
    const onPointerMove = (event: PointerEvent) => {
      onPointerEnterOrMove(event);
      if (!dragging) return;
      const delta = event.clientX - lastPointerX;
      lastPointerX = event.clientX;
      spin += delta * DRAG_SENSITIVITY;
      spinVelocity = delta * DRAG_SENSITIVITY * RELEASE_CARRY;
    };
    const onPointerUp = (event: PointerEvent) => {
      if (!dragging) return;
      dragging = false;
      if (canvas.hasPointerCapture(event.pointerId)) {
        canvas.releasePointerCapture(event.pointerId);
      }
    };

    // Horizontal wheel/trackpad swipe: a Shift-modified vertical wheel is the
    // standard way a plain mouse sends a "horizontal" scroll, so it counts too.
    // Never preventDefault — this only reacts to horizontal intent, so it never
    // competes with the page's own vertical scroll.
    const onWheel = (event: WheelEvent) => {
      const dx =
        event.shiftKey && event.deltaX === 0 ? event.deltaY : event.deltaX;
      if (dx === 0) return;
      spinVelocity += dx * WHEEL_SENSITIVITY * RELEASE_CARRY;
    };

    if (interactive && !reduceMotion) {
      wrap.style.touchAction = "pan-y";
      canvas.addEventListener("pointerenter", onPointerEnterOrMove);
      canvas.addEventListener("pointermove", onPointerMove);
      canvas.addEventListener("pointerleave", onPointerLeave);
      canvas.addEventListener("pointerdown", onPointerDown);
      canvas.addEventListener("pointerup", onPointerUp);
      canvas.addEventListener("pointercancel", onPointerUp);
      canvas.addEventListener("wheel", onWheel, { passive: true });
    }

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
      canvas.removeEventListener("pointerenter", onPointerEnterOrMove);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerleave", onPointerLeave);
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointerup", onPointerUp);
      canvas.removeEventListener("pointercancel", onPointerUp);
      canvas.removeEventListener("wheel", onWheel);
    };
    // Depends on the array *contents*, not the array identities. Callers pass
    // these inline (`origin={[0.5, 1]}`), and the defaults above allocate afresh
    // on every render, so depending on the arrays themselves would tear down and
    // rebuild the whole particle system each time the parent re-renders.
  }, [
    interactive,
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
      className={`relative overflow-hidden ${interactive ? "" : "pointer-events-none"} ${className}`}
    >
      {backdrop && <div className="pa-burst-backdrop absolute inset-0" />}
      <canvas
        ref={canvasRef}
        className={`absolute inset-0 ${interactive ? "" : "pointer-events-none"}`}
      />
    </div>
  );
}
