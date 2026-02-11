"use client";

import { useRef, useState, useEffect, useMemo, useCallback } from "react";
import { motion, type Variants, AnimatePresence } from "framer-motion";
import Link from "next/link";

import { useAnimationConfig } from "@/hooks/useAnimationConfig";
import {
  getVisibleShapes,
  getVisibleConnections,
  type ShapeData,
} from "./shapeData";
import {
  useProximityOrganize,
  DEFAULT_CONFIG,
  type ProximityConfig,
} from "./useProximityOrganize";
import { WorkspaceBlock } from "./WorkspaceBlock";
import { ConnectionLines } from "./ConnectionLines";
import { BlueprintSlot } from "./BlueprintSlot";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** Breakpoint-specific configs */
const DESKTOP_CONFIG: ProximityConfig = {
  ...DEFAULT_CONFIG,
  influenceRadius: 150,
};

const TABLET_CONFIG: ProximityConfig = {
  ...DEFAULT_CONFIG,
  influenceRadius: 120,
};

const MOBILE_CONFIG: ProximityConfig = {
  ...DEFAULT_CONFIG,
  influenceRadius: 150, // Touch radius
};

// ---------------------------------------------------------------------------
// Animation variants — for tagline, CTAs, and workspace glow
// ---------------------------------------------------------------------------

const taglineVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", damping: 25, stiffness: 200, delay: 0.3 },
  },
};

const ctaVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      damping: 25,
      stiffness: 200,
      delay: 0.5 + i * 0.1,
    },
  }),
};

const workspaceGlowVariants: Variants = {
  idle: {
    boxShadow: "0 0 0px transparent",
    borderColor: "var(--border)",
  },
  complete: {
    boxShadow: "0 0 24px var(--accent-muted)",
    borderColor: "var(--border-accent)",
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

// ---------------------------------------------------------------------------
// Dot grid background pattern (CSS-only, no image)
// ---------------------------------------------------------------------------

const DOT_GRID_STYLE: React.CSSProperties = {
  backgroundImage:
    "radial-gradient(circle, var(--fg-tertiary) 0.5px, transparent 0.5px)",
  backgroundSize: "20px 20px",
  opacity: 0.15,
};

// ---------------------------------------------------------------------------
// Breakpoint detection hook
// ---------------------------------------------------------------------------

type Breakpoint = "desktop" | "tablet" | "mobile";

function useBreakpoint(): Breakpoint {
  const [bp, setBp] = useState<Breakpoint>("desktop");

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      if (w < 768) setBp("mobile");
      else if (w < 1024) setBp("tablet");
      else setBp("desktop");
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return bp;
}

// ---------------------------------------------------------------------------
// Container size hook
// ---------------------------------------------------------------------------

function useContainerSize(ref: React.RefObject<HTMLDivElement | null>) {
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        setSize((prev) => {
          if (prev.width === Math.round(width) && prev.height === Math.round(height)) {
            return prev;
          }
          return { width: Math.round(width), height: Math.round(height) };
        });
      }
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, [ref]);

  return size;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * Hero animation — interactive cursor-driven chaos → order.
 *
 * The visitor's cursor is the organizing force. Moving the cursor near
 * scattered geometric shapes causes them to align and organize. Moving
 * away lets them drift back partially (memory effect). When ~80% of
 * shapes are organized, the rest auto-snap to complete the order state.
 *
 * Metaphor: you approach a problem, and it starts becoming clearer.
 *
 * Accessibility:
 * - Reduced motion: shows completed order state directly
 * - Touch devices: tap/drag to organize, with fallback button
 * - Screen readers: descriptive aria-label, live region for completion
 *
 * Performance:
 * - Only animates transform + opacity (compositor-friendly)
 * - Uses requestAnimationFrame for mouse tracking
 * - MotionValues avoid React re-renders during animation
 * - Memoized shape data arrays
 *
 * @see DESIGN_SPEC.md Section 5
 */
export function HeroChaosOrder() {
  const { skipAnimation } = useAnimationConfig();
  const breakpoint = useBreakpoint();

  // Select shapes and config based on breakpoint
  const visibleShapes = useMemo(
    () => getVisibleShapes(breakpoint),
    [breakpoint],
  );
  const visibleConnections = useMemo(
    () => getVisibleConnections(visibleShapes),
    [visibleShapes],
  );
  const config = useMemo(() => {
    switch (breakpoint) {
      case "desktop":
        return DESKTOP_CONFIG;
      case "tablet":
        return TABLET_CONFIG;
      case "mobile":
        return MOBILE_CONFIG;
    }
  }, [breakpoint]);

  // Proximity organize hook
  const {
    progressValues,
    isComplete,
    containerRef,
    handleMouseMove,
    handleMouseLeave,
    handleTouchMove,
    handleTouchEnd,
    isTouchDevice,
    triggerComplete,
  } = useProximityOrganize(visibleShapes, config);

  // Container size for pixel calculations
  const { width: containerWidth, height: containerHeight } =
    useContainerSize(containerRef);

  // Track whether the "tap to organize" hint should be visible
  const [showTapHint, setShowTapHint] = useState(false);
  useEffect(() => {
    if (isTouchDevice && !skipAnimation && !isComplete) {
      // Show hint after a short delay
      const timer = setTimeout(() => setShowTapHint(true), 1500);
      return () => clearTimeout(timer);
    }
    setShowTapHint(false);
  }, [isTouchDevice, skipAnimation, isComplete]);

  // For reduced motion: render complete state directly
  const showComplete = skipAnimation || isComplete;

  // Workspace height based on breakpoint
  const workspaceHeight = breakpoint === "mobile" ? 300 : 400;

  return (
    <section aria-label="Problem solving visualisation" className="relative mb-16">
      {/* ─── Workspace Container ─── */}
      <motion.div
        ref={containerRef}
        variants={workspaceGlowVariants}
        initial={skipAnimation ? "complete" : "idle"}
        animate={showComplete ? "complete" : "idle"}
        onMouseMove={!skipAnimation ? handleMouseMove : undefined}
        onMouseLeave={!skipAnimation ? handleMouseLeave : undefined}
        onTouchMove={!skipAnimation ? handleTouchMove : undefined}
        onTouchEnd={!skipAnimation ? handleTouchEnd : undefined}
        className="relative overflow-hidden rounded-xl border bg-bg-surface"
        style={{
          height: workspaceHeight,
          touchAction: "none", // Prevent scroll while interacting
        }}
      >
        {/* Dot grid background */}
        <div
          className="pointer-events-none absolute inset-0"
          style={DOT_GRID_STYLE}
          aria-hidden="true"
        />

        {/* Blueprint slots (ghost outlines — bottom layer, z-index 0) */}
        {containerWidth > 0 &&
          visibleShapes.map((shape, i) => (
            <BlueprintSlot
              key={`bp-${shape.id}`}
              shape={shape}
              progress={progressValues[i]}
              containerWidth={containerWidth}
              containerHeight={containerHeight}
            />
          ))}

        {/* Connection lines (SVG layer — middle layer, z-index 1) */}
        {containerWidth > 0 && (
          <ConnectionLines
            connections={visibleConnections}
            visibleShapes={visibleShapes}
            progressValues={progressValues}
            containerWidth={containerWidth}
            containerHeight={containerHeight}
            isComplete={showComplete}
          />
        )}

        {/* Geometric shapes (top layer, z-index from shapeData) */}
        {containerWidth > 0 &&
          visibleShapes.map((shape, i) => (
            <WorkspaceBlock
              key={shape.id}
              shape={shape}
              progress={progressValues[i]}
              containerWidth={containerWidth}
              containerHeight={containerHeight}
              isComplete={showComplete}
            />
          ))}

        {/* Touch device hint */}
        <AnimatePresence>
          {showTapHint && !isComplete && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-x-0 bottom-4 flex justify-center"
            >
              <button
                type="button"
                onClick={triggerComplete}
                className="rounded-full border border-border bg-bg-elevated/90 px-4 py-2 text-xs font-medium text-fg-secondary backdrop-blur-sm transition-colors hover:border-border-hover hover:text-foreground"
              >
                Tap &amp; drag to organize — or tap here ✨
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* ─── Below workspace: Name + Tagline + CTAs ─── */}
      <div className="mt-8 space-y-6">
        {/* Tagline — appears after completion */}
        <AnimatePresence>
          {showComplete && (
            <motion.p
              key="tagline"
              variants={taglineVariants}
              initial={skipAnimation ? "visible" : "hidden"}
              animate="visible"
              className="text-center text-xl font-semibold tracking-tight text-foreground sm:text-2xl"
            >
              I turn messy problems into clear solutions.
            </motion.p>
          )}
        </AnimatePresence>

        {/* CTA Buttons — appear after completion with stagger */}
        <AnimatePresence>
          {showComplete && (
            <motion.div
              key="ctas"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-center gap-4"
            >
              <motion.div
                custom={0}
                variants={ctaVariants}
                initial={skipAnimation ? "visible" : "hidden"}
                animate="visible"
              >
                <Link
                  href="/blog"
                  className="inline-flex items-center rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-background transition-all hover:-translate-y-0.5 hover:bg-accent-hover hover:shadow-[0_4px_12px_var(--accent-muted)] active:translate-y-0 active:shadow-none"
                >
                  Read the Blog
                </Link>
              </motion.div>
              <motion.div
                custom={1}
                variants={ctaVariants}
                initial={skipAnimation ? "visible" : "hidden"}
                animate="visible"
              >
                <Link
                  href="/about"
                  className="inline-flex items-center rounded-lg border border-border px-5 py-2.5 text-sm font-medium text-foreground transition-all hover:border-border-hover hover:bg-bg-elevated"
                >
                  About Me
                </Link>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Accessible live region for completion announcement */}
      {showComplete && (
        <div aria-live="polite" className="sr-only">
          Animation complete. I turn messy problems into clear solutions.
        </div>
      )}
    </section>
  );
}
