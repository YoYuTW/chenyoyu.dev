import { useReducedMotion } from "framer-motion";

/**
 * Reduced-motion-aware animation config hook.
 * Returns spring transition config and a flag to skip animations entirely.
 * See DESIGN_SPEC.md Section 9.2.
 */
export function useAnimationConfig() {
  const prefersReduced = useReducedMotion();
  return {
    /** Spring transition for organic feel; instant for reduced-motion users */
    transition: prefersReduced
      ? { duration: 0 }
      : { type: "spring" as const, damping: 25, stiffness: 200 },
    /** When true, render final state directly — no chaos/convergence */
    skipAnimation: !!prefersReduced,
  };
}
