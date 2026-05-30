"use client";

import { motion, useReducedMotion, type HTMLMotionProps } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Shared Apple-style easing curve. Exported so pages stop redefining it locally.
 */
export const appleEase = [0.16, 1, 0.3, 1] as const;

type RevealTag =
    | "div"
    | "section"
    | "span"
    | "p"
    | "h1"
    | "h2"
    | "h3"
    | "h4"
    | "li"
    | "ul";

type RevealProps = {
    /** Element to render. Defaults to "div". */
    as?: RevealTag;
    /** Vertical offset of the hidden state (px). Default 24. */
    y?: number;
    /** Horizontal offset of the hidden state (px). Default 0. */
    x?: number;
    /** Scale of the hidden state. Default 1 (no scale). */
    scale?: number;
    /** Delay before the animation starts (s). Default 0. */
    delay?: number;
    /** Animation duration (s). Default 0.6. */
    duration?: number;
    /** Fraction of the element that must be visible to trigger (0-1). Default 0.2. */
    amount?: number;
    /** Only animate the first time it enters the viewport. Default true. */
    once?: boolean;
    /**
     * Animate on mount instead of on scroll. Use for above-the-fold content so it
     * appears immediately on load rather than waiting for an intersection.
     */
    immediate?: boolean;
    className?: string;
    children?: ReactNode;
} & Omit<
    HTMLMotionProps<"div">,
    "initial" | "animate" | "whileInView" | "transition" | "viewport" | "children"
>;

/**
 * Reveal — the single appearance-animation primitive for the site.
 *
 * Replaces the ~360 hand-written framer-motion reveal blocks that previously drifted
 * between pages. Key behaviors that fix the mobile glitch:
 *  - `once: true` by default → reveals never re-fire on scroll-up (the B2B glitch).
 *  - visibility-ratio `amount` viewport instead of pixel `margin` → consistent on
 *    short mobile screens, no late/abrupt pop-in.
 *  - honors `prefers-reduced-motion` → motion-sensitive users get an instant fade only.
 *  - `immediate` for hero content so it shows on load instead of scroll-popping.
 */
export function Reveal({
    as = "div",
    y = 16,
    x = 0,
    scale = 1,
    delay = 0,
    duration = 0.5,
    amount = 0.15,
    once = true,
    immediate = false,
    className,
    children,
    ...rest
}: RevealProps) {
    const prefersReduced = useReducedMotion();

    // biome-ignore lint/suspicious/noExplicitAny: motion[tag] union is hard to type; behavior is safe.
    const MotionTag = motion[as] as any;

    const hidden = prefersReduced
        ? { opacity: 0 }
        : { opacity: 0, y, x, scale };
    const shown = { opacity: 1, y: 0, x: 0, scale: 1 };

    const transition = {
        duration: prefersReduced ? 0.01 : duration,
        delay: prefersReduced ? 0 : delay,
        ease: appleEase,
    };

    const motionProps = immediate
        ? { initial: hidden, animate: shown }
        : { initial: hidden, whileInView: shown, viewport: { once, amount } };

    return (
        <MotionTag className={className} transition={transition} {...motionProps} {...rest}>
            {children}
        </MotionTag>
    );
}

export default Reveal;
