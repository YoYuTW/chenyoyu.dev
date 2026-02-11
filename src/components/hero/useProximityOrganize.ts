"use client";

import { useRef, useState, useCallback, useEffect, useMemo } from "react";
import { motionValue, type MotionValue } from "framer-motion";

import type { ShapeData } from "./shapeData";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ProximityConfig {
  /** Pixel radius within which the cursor influences shapes */
  influenceRadius: number;
  /** How quickly shapes organize when cursor is near (0–1 per frame, higher = faster) */
  organizeSpeed: number;
  /** How quickly shapes drift back when cursor leaves (0–1 per frame) */
  decaySpeed: number;
  /** Fraction of peak progress retained as "memory" (0–1) */
  memoryFactor: number;
  /** Fraction of shapes that must be >70% organized to trigger auto-complete */
  autoCompleteThreshold: number;
}

export const DEFAULT_CONFIG: ProximityConfig = {
  influenceRadius: 250,
  organizeSpeed: 0.15,
  decaySpeed: 0.02,
  memoryFactor: 0.6,
  autoCompleteThreshold: 0.65,
};

export interface ProximityResult {
  /** MotionValue per shape: 0 = full chaos, 1 = full order */
  progressValues: MotionValue<number>[];
  /** True once auto-complete has triggered */
  isComplete: boolean;
  /** Ref to attach to the workspace container */
  containerRef: React.RefObject<HTMLDivElement | null>;
  /** Attach to workspace onMouseMove */
  handleMouseMove: (e: React.MouseEvent) => void;
  /** Attach to workspace onMouseLeave */
  handleMouseLeave: () => void;
  /** Attach to workspace onTouchMove */
  handleTouchMove: (e: React.TouchEvent) => void;
  /** Attach to workspace onTouchEnd */
  handleTouchEnd: () => void;
  /** Whether the device supports touch (detected on mount) */
  isTouchDevice: boolean;
  /** Imperatively trigger auto-complete (for "tap to organize" button) */
  triggerComplete: () => void;
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

/**
 * Custom hook for cursor-proximity-driven organization of geometric shapes.
 *
 * Tracks the user's cursor (or touch point) relative to a workspace container
 * and updates per-shape MotionValues (0→1) based on proximity. Implements:
 * - Smooth approach: shapes closer to cursor get higher progress
 * - Memory effect: shapes retain a fraction of their peak progress
 * - Auto-complete: when enough shapes are organized, snap all to 1.0
 *
 * Uses requestAnimationFrame for throttling — never causes React re-renders
 * except when `isComplete` changes.
 *
 * @see rerender-use-ref-transient-values — mouse position stored in ref
 * @see client-passive-event-listeners — touch events are passive
 */
export function useProximityOrganize(
  shapes: ShapeData[],
  config: ProximityConfig = DEFAULT_CONFIG,
): ProximityResult {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  // Detect touch device on mount
  useEffect(() => {
    setIsTouchDevice("ontouchstart" in window || navigator.maxTouchPoints > 0);
  }, []);

  // Per-shape MotionValues — created once, stable reference
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const progressValues = useMemo(
    () => shapes.map(() => motionValue(0)),
    // We intentionally key on length only; shapes array is memoized upstream
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [shapes.length],
  );

  // Accumulated "memory" progress per shape — survives across frames
  const accumulatedRef = useRef<number[]>(shapes.map(() => 0));

  // Current pointer position in container-local coordinates
  // { x: -9999, y: -9999 } means "no pointer" (outside container)
  const pointerRef = useRef({ x: -9999, y: -9999 });

  // Whether the animation loop is active
  const isActiveRef = useRef(false);
  const rafIdRef = useRef(0);
  const isCompleteRef = useRef(false);

  // ---------------------------------------------------------------------------
  // Animation loop — runs only while pointer is in container or settling
  // ---------------------------------------------------------------------------
  const tick = useCallback(() => {
    const container = containerRef.current;
    if (!container || isCompleteRef.current) return;

    const { offsetWidth: w, offsetHeight: h } = container;
    const { influenceRadius, organizeSpeed, decaySpeed, memoryFactor, autoCompleteThreshold } = config;

    let organizedCount = 0;
    let anyMoving = false;
    const total = shapes.length;

    for (let i = 0; i < total; i++) {
      const shape = shapes[i];
      // Shape's chaos position in pixels
      const shapePx = (shape.chaosPos.x / 100) * w;
      const shapePy = (shape.chaosPos.y / 100) * h;

      const dx = pointerRef.current.x - shapePx;
      const dy = pointerRef.current.y - shapePy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      const currentProgress = progressValues[i].get();
      let targetProgress: number;

      if (dist < influenceRadius) {
        // Proximity-based target: closer = more organized
        const proximityFactor = 1 - dist / influenceRadius;
        // Ease the factor for more natural feel (quadratic ease-out)
        const eased = proximityFactor * (2 - proximityFactor);
        targetProgress = Math.max(currentProgress, eased);

        // Update memory floor
        accumulatedRef.current[i] = Math.max(
          accumulatedRef.current[i],
          eased * memoryFactor,
        );
      } else {
        // Decay toward memory floor
        targetProgress = accumulatedRef.current[i];
      }

      // Lerp current toward target
      let newProgress: number;
      if (targetProgress > currentProgress) {
        newProgress = currentProgress + (targetProgress - currentProgress) * organizeSpeed;
      } else {
        newProgress = currentProgress + (targetProgress - currentProgress) * decaySpeed;
      }

      // Clamp
      newProgress = Math.max(0, Math.min(1, newProgress));

      // Only update if changed meaningfully (avoid unnecessary MotionValue updates)
      if (Math.abs(newProgress - currentProgress) > 0.001) {
        progressValues[i].set(newProgress);
        anyMoving = true;
      }

      if (newProgress > 0.7) organizedCount++;
    }

    // Check auto-complete threshold
    if (organizedCount >= total * autoCompleteThreshold) {
      isCompleteRef.current = true;
      // Snap all shapes to 1.0
      for (let i = 0; i < total; i++) {
        progressValues[i].set(1);
        accumulatedRef.current[i] = 1;
      }
      setIsComplete(true);
      isActiveRef.current = false;
      return;
    }

    // Continue loop if still moving or pointer is in container
    if (anyMoving || pointerRef.current.x > -9000) {
      rafIdRef.current = requestAnimationFrame(tick);
    } else {
      isActiveRef.current = false;
    }
  }, [shapes, config, progressValues]);

  // Start the animation loop if not already running
  const ensureLoopRunning = useCallback(() => {
    if (!isActiveRef.current && !isCompleteRef.current) {
      isActiveRef.current = true;
      rafIdRef.current = requestAnimationFrame(tick);
    }
  }, [tick]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cancelAnimationFrame(rafIdRef.current);
    };
  }, []);

  // ---------------------------------------------------------------------------
  // Event handlers
  // ---------------------------------------------------------------------------

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      const container = containerRef.current;
      if (!container || isCompleteRef.current) return;
      const rect = container.getBoundingClientRect();
      pointerRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
      ensureLoopRunning();
    },
    [ensureLoopRunning],
  );

  const handleMouseLeave = useCallback(() => {
    pointerRef.current = { x: -9999, y: -9999 };
    // Loop continues to handle decay
    ensureLoopRunning();
  }, [ensureLoopRunning]);

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      const container = containerRef.current;
      if (!container || isCompleteRef.current) return;
      const touch = e.touches[0];
      if (!touch) return;
      const rect = container.getBoundingClientRect();
      pointerRef.current = {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top,
      };
      ensureLoopRunning();
    },
    [ensureLoopRunning],
  );

  const handleTouchEnd = useCallback(() => {
    pointerRef.current = { x: -9999, y: -9999 };
    ensureLoopRunning();
  }, [ensureLoopRunning]);

  const triggerComplete = useCallback(() => {
    if (isCompleteRef.current) return;
    isCompleteRef.current = true;
    for (let i = 0; i < shapes.length; i++) {
      progressValues[i].set(1);
      accumulatedRef.current[i] = 1;
    }
    setIsComplete(true);
  }, [shapes.length, progressValues]);

  return {
    progressValues,
    isComplete,
    containerRef,
    handleMouseMove,
    handleMouseLeave,
    handleTouchMove,
    handleTouchEnd,
    isTouchDevice,
    triggerComplete,
  };
}
