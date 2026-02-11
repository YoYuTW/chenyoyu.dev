"use client";

import { memo } from "react";
import { motion, useTransform, type MotionValue } from "framer-motion";

import type { ShapeData, ShapeColor } from "./shapeData";

// ---------------------------------------------------------------------------
// Color mapping — maps ShapeColor to Tailwind classes
// ---------------------------------------------------------------------------

const BG_CLASSES: Record<ShapeColor, string> = {
  elevated: "bg-bg-elevated",
  "accent-muted": "bg-accent-muted",
  "chaos-muted": "bg-chaos-muted",
  "accent-secondary-muted": "bg-accent-secondary-muted",
  "accent-solid": "bg-accent",
  "chaos-solid": "bg-chaos",
  "order-solid": "bg-order",
  "fg-tertiary": "bg-fg-tertiary",
};

// ---------------------------------------------------------------------------
// Jitter keyframes — pre-computed, no Math.random() at render
// ---------------------------------------------------------------------------

const JITTER_KEYFRAMES_X = [0, 0.8, -0.5, 0.3, -0.8, 0.5, 0];
const JITTER_KEYFRAMES_Y = [0, -0.6, 0.7, -0.4, 0.6, -0.7, 0];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

interface WorkspaceBlockProps {
  shape: ShapeData;
  /** MotionValue 0→1 representing organization progress */
  progress: MotionValue<number>;
  /** Container dimensions for position calculation */
  containerWidth: number;
  containerHeight: number;
  /** Whether the auto-complete animation has triggered */
  isComplete: boolean;
}

/**
 * Individual geometric shape that interpolates between chaos and order positions.
 *
 * Uses `useTransform` to derive x/y/rotate/opacity from the progress MotionValue.
 * This avoids React re-renders — all animation happens in the compositor layer.
 *
 * @see rendering-animate-svg-wrapper — we animate div wrappers, not SVG directly
 * @see rerender-memo — memoized to prevent unnecessary re-renders from parent
 */
function WorkspaceBlockInner({
  shape,
  progress,
  containerWidth,
  containerHeight,
  isComplete,
}: WorkspaceBlockProps) {
  // Convert percentage positions to pixel values
  const chaosX = (shape.chaosPos.x / 100) * containerWidth;
  const chaosY = (shape.chaosPos.y / 100) * containerHeight;
  const orderX = (shape.orderPos.x / 100) * containerWidth;
  const orderY = (shape.orderPos.y / 100) * containerHeight;

  // Derive animated values from progress MotionValue (0→1)
  const x = useTransform(progress, [0, 1], [chaosX, orderX]);
  const y = useTransform(progress, [0, 1], [chaosY, orderY]);
  const rotate = useTransform(progress, [0, 1], [shape.chaosPos.rotate, 0]);
  const opacity = useTransform(progress, [0, 1], [0.6, 1]);
  // Scale pulse on snap: subtle grow at 0.95, settle at 1.0
  const scale = useTransform(progress, [0, 0.8, 0.95, 1], [1, 1, 1.05, 1.02]);

  // Border flash: transparent → accent at snap → settle to normal
  // Only applies to rect shapes (circles have no border)
  const borderColor = useTransform(
    progress,
    [0, 0.9, 0.95, 1],
    [
      "var(--border)",
      "var(--border)",
      "var(--border-accent)",
      "var(--border)",
    ],
  );

  const isCircle = shape.type === "circle";
  const bgClass = BG_CLASSES[shape.color];

  // Determine border and shape-specific classes
  // Border color is driven by borderColor MotionValue for snap flash effect,
  // so we use border-transparent as placeholder and override via style
  const shapeClasses = isCircle
    ? `rounded-full ${bgClass}`
    : shape.size === "lg"
      ? `rounded-lg border-2 ${bgClass}`
      : `rounded-md border ${bgClass}`;

  // Jitter duration based on shape's jitter speed
  const jitterDuration = 2.5 / shape.jitterSpeed;

  return (
    <motion.div
      style={{
        x,
        y,
        rotate,
        opacity,
        scale,
        borderColor: isCircle ? undefined : borderColor,
        width: shape.width,
        height: shape.height,
        zIndex: shape.zIndex,
        willChange: "transform, opacity",
      }}
      className={`absolute ${shapeClasses}`}
      aria-hidden="true"
    >
      {/* Jitter animation — visible only when not complete */}
      {!isComplete && (
        <motion.div
          className="h-full w-full"
          animate={{
            x: JITTER_KEYFRAMES_X,
            y: JITTER_KEYFRAMES_Y,
          }}
          transition={{
            duration: jitterDuration,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{ willChange: "transform" }}
        />
      )}
    </motion.div>
  );
}

/**
 * Memoized workspace block — prevents re-renders when parent state changes.
 * The progress MotionValue drives animation without triggering React re-renders.
 *
 * @see rerender-memo — extract expensive work into memoized components
 */
export const WorkspaceBlock = memo(WorkspaceBlockInner);
