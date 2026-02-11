"use client";

import { Children, useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";

interface StaggerGroupProps {
  /** Delay between each child's entrance in seconds (default 0.1 = 100ms) */
  stagger?: number;
  className?: string;
  children: React.ReactNode;
}

/**
 * Wraps children and staggers their entrance animations.
 * Each child gets a delay = index × stagger.
 * Uses `useInView` with `once: true` — triggers when the group scrolls into view.
 * Respects `prefers-reduced-motion`.
 */
export function StaggerGroup({
  stagger = 0.1,
  className,
  children,
}: StaggerGroupProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const prefersReducedMotion = useReducedMotion();

  return (
    <div ref={ref} className={className}>
      {Children.map(children, (child, index) => {
        if (!child) return null;

        return (
          <motion.div
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
              delay: prefersReducedMotion ? 0 : index * stagger,
            }}
          >
            {child}
          </motion.div>
        );
      })}
    </div>
  );
}
