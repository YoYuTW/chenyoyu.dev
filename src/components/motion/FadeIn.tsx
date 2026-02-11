"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";

interface FadeInProps {
  /** Additional delay in seconds before the animation starts */
  delay?: number;
  className?: string;
  children: React.ReactNode;
}

/**
 * Wraps children with a scroll-triggered fade-in + slide-up animation.
 * Uses `useInView` with `once: true` so it only animates on first appearance.
 * Respects `prefers-reduced-motion` — skips animation entirely.
 */
export function FadeIn({ delay = 0, className, children }: FadeInProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
      animate={
        isInView
          ? { opacity: 1, y: 0 }
          : prefersReducedMotion
            ? { opacity: 1, y: 0 }
            : { opacity: 0, y: 20 }
      }
      transition={{
        duration: 0.4,
        ease: "easeOut",
        delay,
      }}
    >
      {children}
    </motion.div>
  );
}
