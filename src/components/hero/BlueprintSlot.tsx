"use client";

import { memo } from "react";
import { motion, useTransform, type MotionValue } from "framer-motion";

import type { ShapeData } from "./shapeData";

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

interface BlueprintSlotProps {
  shape: ShapeData;
  /** MotionValue 0→1 representing organization progress of the corresponding block */
  progress: MotionValue<number>;
  /** Container dimensions for position calculation */
  containerWidth: number;
  containerHeight: number;
}

/**
 * Ghost outline showing the target position for a shape.
 *
 * Positioned at `shape.orderPos` with dashed border — the "Erdtree" that
 * tells visitors where blocks should end up before they interact.
 *
 * Opacity behaviour:
 * - progress 0→0.3: base opacity 0.1 (faint, always visible)
 * - progress 0.3→0.8: lerps 0.1→0.3 (brightens as block approaches)
 * - progress 0.8→1.0: lerps 0.3→0 (fades as real block arrives)
 *
 * Uses `useTransform` from framer-motion — NO React re-renders.
 *
 * @see rerender-memo — memoized to prevent unnecessary re-renders
 */
function BlueprintSlotInner({
  shape,
  progress,
  containerWidth,
  containerHeight,
}: BlueprintSlotProps) {
  // Target position in pixels (the order position)
  const orderX = (shape.orderPos.x / 100) * containerWidth;
  const orderY = (shape.orderPos.y / 100) * containerHeight;

  // Derive opacity from progress:
  // 0→0.3: steady at 0.1 | 0.3→0.8: 0.1→0.3 | 0.8→1.0: 0.3→0
  const opacity = useTransform(
    progress,
    [0, 0.3, 0.8, 1],
    [0.1, 0.1, 0.3, 0],
  );

  // Scale pulse when block snaps into place (progress near 1.0)
  // Subtle: 1.0 → 1.05 at 0.95, then back to 1.0 at 1.0
  const scale = useTransform(
    progress,
    [0, 0.9, 0.95, 1],
    [1, 1, 1.05, 1],
  );

  const isCircle = shape.type === "circle";

  // Border radius matching the real block
  const borderRadius = isCircle
    ? "9999px"
    : shape.size === "lg"
      ? "0.5rem" // rounded-lg
      : "0.375rem"; // rounded-md

  return (
    <motion.div
      style={{
        x: orderX,
        y: orderY,
        opacity,
        scale,
        width: shape.width,
        height: shape.height,
        borderRadius,
        willChange: "opacity, transform",
      }}
      className="pointer-events-none absolute border border-dashed border-fg-tertiary bg-transparent"
      aria-hidden="true"
    />
  );
}

/**
 * Memoized blueprint slot — prevents re-renders when parent state changes.
 * The progress MotionValue drives animation without triggering React re-renders.
 */
export const BlueprintSlot = memo(BlueprintSlotInner);
