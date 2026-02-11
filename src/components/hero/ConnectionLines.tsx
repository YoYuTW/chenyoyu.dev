"use client";

import { memo, useMemo } from "react";
import { motion, useTransform, type MotionValue } from "framer-motion";

import type { ShapeData, ConnectionData } from "./shapeData";
import { SHAPES } from "./shapeData";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ConnectionLinesProps {
  connections: ConnectionData[];
  visibleShapes: ShapeData[];
  progressValues: MotionValue<number>[];
  containerWidth: number;
  containerHeight: number;
  isComplete: boolean;
}

// ---------------------------------------------------------------------------
// Single line component — uses MotionValues to avoid re-renders
// ---------------------------------------------------------------------------

interface SingleLineProps {
  connection: ConnectionData;
  fromShape: ShapeData;
  toShape: ShapeData;
  fromProgress: MotionValue<number>;
  toProgress: MotionValue<number>;
  containerWidth: number;
  containerHeight: number;
  isComplete: boolean;
}

function SingleLine({
  connection,
  fromShape,
  toShape,
  fromProgress,
  toProgress,
  containerWidth,
  containerHeight,
  isComplete,
}: SingleLineProps) {
  // Chaos positions (px) — centers of shapes
  const fromChaosX = (fromShape.chaosPos.x / 100) * containerWidth + fromShape.width / 2;
  const fromChaosY = (fromShape.chaosPos.y / 100) * containerHeight + fromShape.height / 2;
  const toChaosX = (toShape.chaosPos.x / 100) * containerWidth + toShape.width / 2;
  const toChaosY = (toShape.chaosPos.y / 100) * containerHeight + toShape.height / 2;

  // Order positions (px) — centers of shapes
  const fromOrderX = (fromShape.orderPos.x / 100) * containerWidth + fromShape.width / 2;
  const fromOrderY = (fromShape.orderPos.y / 100) * containerHeight + fromShape.height / 2;
  const toOrderX = (toShape.orderPos.x / 100) * containerWidth + toShape.width / 2;
  const toOrderY = (toShape.orderPos.y / 100) * containerHeight + toShape.height / 2;

  // Use the average progress of the two connected shapes
  const fromX = useTransform(fromProgress, [0, 1], [fromChaosX, fromOrderX]);
  const fromY = useTransform(fromProgress, [0, 1], [fromChaosY, fromOrderY]);
  const toX = useTransform(toProgress, [0, 1], [toChaosX, toOrderX]);
  const toY = useTransform(toProgress, [0, 1], [toChaosY, toOrderY]);

  // Curve amount — interpolates from chaos curve to 0 (straight)
  const avgProgress = useTransform(
    [fromProgress, toProgress] as MotionValue<number>[],
    ([fp, tp]: number[]) => (fp + tp) / 2,
  );
  const curveOffset = useTransform(
    avgProgress,
    [0, 1],
    [connection.chaosCurve, 0],
  );

  // Line opacity — more visible as organized
  const lineOpacity = useTransform(avgProgress, [0, 0.3, 1], [0.3, 0.4, 0.7]);

  // Color: problem lines are red in chaos, become normal when organized
  const strokeColor = connection.isProblem
    ? useTransform(
        avgProgress,
        [0, 0.6, 1],
        ["var(--chaos)", "var(--fg-tertiary)", "var(--fg-tertiary)"],
      )
    : "var(--fg-tertiary)";

  // Build SVG path using MotionValues
  const pathD = useTransform(
    [fromX, fromY, toX, toY, curveOffset] as MotionValue<number>[],
    ([fx, fy, tx, ty, curve]: number[]) => {
      // Quadratic bezier with perpendicular control point
      const midX = (fx + tx) / 2;
      const midY = (fy + ty) / 2;
      // Perpendicular offset for curve
      const dx = tx - fx;
      const dy = ty - fy;
      const len = Math.sqrt(dx * dx + dy * dy) || 1;
      const perpX = -dy / len;
      const perpY = dx / len;
      const cpX = midX + perpX * curve;
      const cpY = midY + perpY * curve;
      return `M ${fx} ${fy} Q ${cpX} ${cpY} ${tx} ${ty}`;
    },
  );

  return (
    <motion.path
      d={pathD}
      stroke={strokeColor}
      strokeWidth={connection.isProblem ? 1.5 : 1}
      fill="none"
      opacity={lineOpacity}
      strokeLinecap="round"
      style={{ willChange: "d, opacity" }}
    />
  );
}

const SingleLineMemo = memo(SingleLine);

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

/**
 * SVG overlay for connecting lines between geometric shapes.
 *
 * Lines are quadratic bezier curves that straighten as shapes organize.
 * Problem lines (isProblem=true) start red and fade to neutral.
 *
 * Uses MotionValues to avoid React re-renders — all animation is
 * driven by the progress values from useProximityOrganize.
 */
function ConnectionLinesInner({
  connections,
  visibleShapes,
  progressValues,
  containerWidth,
  containerHeight,
  isComplete,
}: ConnectionLinesProps) {
  // Build a lookup from shape ID to index in the visible shapes array
  const shapeIndexMap = useMemo(() => {
    const map = new Map<string, number>();
    visibleShapes.forEach((s, i) => map.set(s.id, i));
    return map;
  }, [visibleShapes]);

  // Resolve connection endpoints to visible shape indices
  const resolvedConnections = useMemo(
    () =>
      connections
        .map((conn) => {
          const fromShape = SHAPES[conn.from];
          const toShape = SHAPES[conn.to];
          const fromIdx = shapeIndexMap.get(fromShape.id);
          const toIdx = shapeIndexMap.get(toShape.id);
          if (fromIdx === undefined || toIdx === undefined) return null;
          return { conn, fromShape, toShape, fromIdx, toIdx };
        })
        .filter(
          (
            r,
          ): r is {
            conn: ConnectionData;
            fromShape: ShapeData;
            toShape: ShapeData;
            fromIdx: number;
            toIdx: number;
          } => r !== null,
        ),
    [connections, shapeIndexMap],
  );

  if (containerWidth === 0 || containerHeight === 0) return null;

  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full"
      aria-hidden="true"
      style={{ zIndex: 0 }}
    >
      {resolvedConnections.map(({ conn, fromShape, toShape, fromIdx, toIdx }) => (
        <SingleLineMemo
          key={conn.id}
          connection={conn}
          fromShape={fromShape}
          toShape={toShape}
          fromProgress={progressValues[fromIdx]}
          toProgress={progressValues[toIdx]}
          containerWidth={containerWidth}
          containerHeight={containerHeight}
          isComplete={isComplete}
        />
      ))}
    </svg>
  );
}

export const ConnectionLines = memo(ConnectionLinesInner);
