"use client";

import {
    type CSSProperties,
    type HTMLAttributes,
    type ReactNode,
    useEffect,
    useRef,
} from "react";

/**
 * Shared Apple-style easing curve. Exported so framer-motion call sites that
 * still need an ease (hero image zoom, button micro-interactions) can reuse it.
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
    | "ul"
    | "a"
    | "button";

type RevealProps = {
    as?: RevealTag;
    /** Initial vertical offset (px). Default 16. */
    y?: number;
    /** Initial horizontal offset (px). Default 0. */
    x?: number;
    /** Initial scale. Default 1. */
    scale?: number;
    /** Delay before the animation starts (s). Default 0. */
    delay?: number;
    /** Animation duration (s). Default 0.5. */
    duration?: number;
    /**
     * Animate on load (CSS keyframe, no JS/observer) instead of on scroll.
     * Use for above-the-fold hero content.
     */
    immediate?: boolean;
    /** Accepted for backwards-compat with old call sites; no longer used. */
    amount?: number;
    once?: boolean;
    /** Anchor pass-throughs (used when `as="a"`). */
    href?: string;
    target?: string;
    children?: ReactNode;
} & HTMLAttributes<HTMLElement>;

/**
 * One shared IntersectionObserver for every scroll reveal on the page.
 * On first intersection it adds `.pa-revealed` and unobserves the element, so a
 * reveal happens exactly once and can NEVER be reverted — no re-appearing
 * glitch, no re-hiding when scrolling back. The motion itself is a pure CSS
 * animation (compositor-only opacity + transform), so it runs no per-frame
 * JavaScript during scroll.
 */
let sharedObserver: IntersectionObserver | null = null;
function getObserver(): IntersectionObserver | null {
    if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
        return null;
    }
    if (!sharedObserver) {
        sharedObserver = new IntersectionObserver(
            (entries, obs) => {
                for (const entry of entries) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("pa-revealed");
                        obs.unobserve(entry.target);
                    }
                }
            },
            { root: null, rootMargin: "0px 0px -6% 0px", threshold: 0.01 },
        );
    }
    return sharedObserver;
}

export function Reveal({
    as = "div",
    y = 16,
    x = 0,
    scale = 1,
    delay = 0,
    duration = 0.5,
    immediate = false,
    className = "",
    style,
    children,
    amount: _amount,
    once: _once,
    ...rest
}: RevealProps) {
    const ref = useRef<HTMLElement>(null);

    useEffect(() => {
        // `immediate` reveals run via a pure-CSS keyframe on load — no observer.
        if (immediate) return;
        const el = ref.current;
        if (!el || el.classList.contains("pa-revealed")) return;

        const obs = getObserver();
        if (!obs) {
            el.classList.add("pa-revealed");
            return;
        }
        obs.observe(el);
        return () => obs.unobserve(el);
    }, [immediate]);

    const vars = {
        "--reveal-y": `${y}px`,
        "--reveal-x": `${x}px`,
        "--reveal-scale": `${scale}`,
        "--reveal-delay": `${delay}s`,
        "--reveal-duration": `${duration}s`,
        ...style,
    } as CSSProperties;

    // biome-ignore lint/suspicious/noExplicitAny: dynamic tag name
    const Comp = as as any;
    return (
        <Comp ref={ref} className={`${immediate ? "pa-reveal-immediate" : "pa-reveal"} ${className}`} style={vars} {...rest}>
            {children}
        </Comp>
    );
}

export default Reveal;
