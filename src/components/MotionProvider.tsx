"use client";

import { MotionConfig } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Makes every framer-motion animation on the site honor the OS
 * `prefers-reduced-motion` setting. With `reducedMotion="user"`, framer-motion
 * disables transform/layout animations (keeping opacity fades) when the user has
 * requested reduced motion — covering even the interactive/AnimatePresence
 * animations that are not wrapped by <Reveal>.
 */
export default function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
