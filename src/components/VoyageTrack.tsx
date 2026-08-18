"use client";

import { useRef } from "react";
import { useInViewProgress } from "@/components/useInViewProgress";
import {
  easeInOutCubic,
  type Point,
  quadAngle,
  quadLength,
  quadPoint,
} from "@/lib/motion";

/**
 * A shipment drawing its own route: the sea lane strokes on from the origin
 * port, a vessel rides the leading end, and each stage pip lights as it is
 * passed.
 *
 * This is the same reveal idea as the globe's arcs, flattened into a rail that
 * fits a section band. It exists because "where is my car" is the question the
 * tracking page answers, and a rail that draws itself answers it at a glance in
 * a way a list of dates does not.
 *
 * The route is a quadratic Bézier evaluated in lib/motion.ts rather than read
 * back from the DOM with getPointAtLength — that keeps the marker position and
 * the path length computable without a laid-out document, which is what makes
 * the geometry testable.
 */

export type VoyageStage = {
  label: string;
  /** Position along the route, 0 at the origin port and 1 at the destination. */
  at: number;
};

/** Generic import stages. Pass real `statusHistory` to drive this from a request. */
export const DEFAULT_STAGES: VoyageStage[] = [
  { label: "Sourcing", at: 0 },
  { label: "Purchased", at: 0.18 },
  { label: "At origin port", at: 0.36 },
  { label: "At sea", at: 0.62 },
  { label: "Customs cleared", at: 0.84 },
  { label: "Delivered", at: 1 },
];

const WIDTH = 1000;
const HEIGHT = 240;
// A shallow arc, so the lane reads as a crossing rather than a progress bar.
const P0: Point = { x: 60, y: 172 };
const P1: Point = { x: 500, y: 40 };
const P2: Point = { x: 940, y: 172 };

type Props = {
  stages?: VoyageStage[];
  /**
   * Where the shipment actually is, 0..1 — used as given, not eased. Omit to
   * animate the full route once in view instead.
   */
  progress?: number;
  className?: string;
};

export default function VoyageTrack({
  stages = DEFAULT_STAGES,
  progress: fixedProgress,
  className = "",
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const animated = useInViewProgress(ref, 3200);
  // The easing belongs to the animation, not to the value. A caller passing
  // progress={0.35} is stating where the shipment *is*; easing that would draw
  // it at 17% and quietly misreport the voyage.
  const t = fixedProgress ?? easeInOutCubic(animated);

  const length = quadLength(P0, P1, P2);
  const vessel = quadPoint(P0, P1, P2, t);
  const heading = (quadAngle(P0, P1, P2, t) * 180) / Math.PI;
  const path = `M${P0.x},${P0.y} Q${P1.x},${P1.y} ${P2.x},${P2.y}`;

  return (
    <div ref={ref} className={className}>
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="w-full"
        role="img"
        aria-label={`Shipping route progress: ${
          stages.filter((stage) => stage.at <= t).at(-1)?.label ??
          stages[0].label
        }`}
      >
        <title>Shipment route progress</title>
        <defs>
          <linearGradient id="voyage-lane" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#0ea5e9" />
            <stop offset="55%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#ec4899" />
          </linearGradient>
        </defs>

        {/* The unsailed remainder, so the whole journey is visible from the off. */}
        <path
          d={path}
          fill="none"
          stroke="#e4e4e7"
          strokeWidth={2}
          strokeDasharray="6 8"
          strokeLinecap="round"
        />

        {/* The sailed portion. One dash the length of the path, offset back by
            the unsailed remainder — the standard line-drawing trick. */}
        <path
          d={path}
          fill="none"
          stroke="url(#voyage-lane)"
          strokeWidth={3}
          strokeLinecap="round"
          strokeDasharray={length}
          strokeDashoffset={length * (1 - t)}
        />

        {stages.map((stage) => {
          const point = quadPoint(P0, P1, P2, stage.at);
          const passed = t >= stage.at;
          return (
            <g key={stage.label}>
              <circle
                cx={point.x}
                cy={point.y}
                r={passed ? 7 : 5}
                fill={passed ? "#8b5cf6" : "#ffffff"}
                stroke={passed ? "#8b5cf6" : "#d4d4d8"}
                strokeWidth={2}
                className="transition-all duration-300"
              />
              <text
                x={point.x}
                y={point.y + 28}
                textAnchor="middle"
                fontSize={13}
                fill={passed ? "#3f3f46" : "#a1a1aa"}
                className="transition-colors duration-300"
              >
                {stage.label}
              </text>
            </g>
          );
        })}

        {/* The vessel, pointed along the lane. */}
        <g
          transform={`translate(${vessel.x} ${vessel.y}) rotate(${heading})`}
          style={{ opacity: t > 0.001 && t < 0.999 ? 1 : 0 }}
        >
          <circle r={13} fill="#8b5cf6" opacity={0.16} />
          <path
            d="M-9,-5 L7,-5 L11,0 L7,5 L-9,5 Z"
            fill="#8b5cf6"
            stroke="#ffffff"
            strokeWidth={1.5}
          />
        </g>
      </svg>
    </div>
  );
}
