/**
 * Pre-defined geometric shape data for the hero chaos→order animation.
 *
 * All positions are percentages (0–100) relative to the workspace container.
 * No Math.random() — deterministic for SSR/CSR consistency.
 *
 * Each shape has:
 * - chaosPos: scattered position + rotation in the "messy" state
 * - orderPos: clean aligned position in the "organized" state
 * - visual properties: type, size, color variant
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type ShapeType = "rect" | "circle";
export type ShapeSize = "lg" | "md" | "sm" | "circle";
export type ShapeColor =
  | "elevated"
  | "accent-muted"
  | "chaos-muted"
  | "accent-secondary-muted"
  | "accent-solid"
  | "chaos-solid"
  | "order-solid"
  | "fg-tertiary";

export interface ShapeData {
  id: string;
  type: ShapeType;
  size: ShapeSize;
  color: ShapeColor;
  /** Width in pixels */
  width: number;
  /** Height in pixels */
  height: number;
  /** Chaos state position (% of container) + rotation (degrees) */
  chaosPos: { x: number; y: number; rotate: number };
  /** Order state position (% of container) */
  orderPos: { x: number; y: number };
  /** z-index for overlapping effect */
  zIndex: number;
  /** Jitter animation speed multiplier (higher = faster jitter) */
  jitterSpeed: number;
  /** Whether this shape is visible on mobile (responsive breakpoint) */
  mobileVisible: boolean;
  /** Whether this shape is visible on tablet (responsive breakpoint) */
  tabletVisible: boolean;
}

export interface ConnectionData {
  id: string;
  /** Index of start shape in the shapes array */
  from: number;
  /** Index of end shape in the shapes array */
  to: number;
  /** Whether this line is a "problem indicator" (red in chaos state) */
  isProblem: boolean;
  /** Chaos state: curve offset for tangled look (px) */
  chaosCurve: number;
}

// ---------------------------------------------------------------------------
// Shape definitions — 18 shapes total
// ---------------------------------------------------------------------------

/** Desktop: all 18, Tablet: 14, Mobile: 10 */
export const SHAPES: ShapeData[] = [
  // ─── Large blocks (4) ───
  {
    id: "lg-1",
    type: "rect",
    size: "lg",
    color: "elevated",
    width: 80,
    height: 60,
    chaosPos: { x: 12, y: 15, rotate: -8 },
    orderPos: { x: 10, y: 20 },
    zIndex: 3,
    jitterSpeed: 1.2,
    mobileVisible: true,
    tabletVisible: true,
  },
  {
    id: "lg-2",
    type: "rect",
    size: "lg",
    color: "elevated",
    width: 80,
    height: 60,
    chaosPos: { x: 65, y: 25, rotate: 12 },
    orderPos: { x: 40, y: 20 },
    zIndex: 2,
    jitterSpeed: 0.9,
    mobileVisible: true,
    tabletVisible: true,
  },
  {
    id: "lg-3",
    type: "rect",
    size: "lg",
    color: "elevated",
    width: 80,
    height: 60,
    chaosPos: { x: 38, y: 70, rotate: -5 },
    orderPos: { x: 70, y: 20 },
    zIndex: 4,
    jitterSpeed: 1.1,
    mobileVisible: true,
    tabletVisible: true,
  },
  {
    id: "lg-4",
    type: "rect",
    size: "lg",
    color: "elevated",
    width: 80,
    height: 60,
    chaosPos: { x: 80, y: 60, rotate: 7 },
    orderPos: { x: 25, y: 55 },
    zIndex: 1,
    jitterSpeed: 1.3,
    mobileVisible: false,
    tabletVisible: true,
  },

  // ─── Medium blocks (6) ───
  {
    id: "md-1",
    type: "rect",
    size: "md",
    color: "accent-muted",
    width: 50,
    height: 35,
    chaosPos: { x: 25, y: 45, rotate: 14 },
    orderPos: { x: 14, y: 42 },
    zIndex: 5,
    jitterSpeed: 1.4,
    mobileVisible: true,
    tabletVisible: true,
  },
  {
    id: "md-2",
    type: "rect",
    size: "md",
    color: "accent-secondary-muted",
    width: 50,
    height: 35,
    chaosPos: { x: 55, y: 10, rotate: -11 },
    orderPos: { x: 44, y: 42 },
    zIndex: 6,
    jitterSpeed: 1.0,
    mobileVisible: true,
    tabletVisible: true,
  },
  {
    id: "md-3",
    type: "rect",
    size: "md",
    color: "accent-muted",
    width: 50,
    height: 35,
    chaosPos: { x: 8, y: 65, rotate: 6 },
    orderPos: { x: 74, y: 42 },
    zIndex: 3,
    jitterSpeed: 1.5,
    mobileVisible: true,
    tabletVisible: true,
  },
  {
    id: "md-4",
    type: "rect",
    size: "md",
    color: "accent-secondary-muted",
    width: 50,
    height: 35,
    chaosPos: { x: 75, y: 40, rotate: -9 },
    orderPos: { x: 55, y: 55 },
    zIndex: 4,
    jitterSpeed: 0.8,
    mobileVisible: false,
    tabletVisible: true,
  },
  {
    id: "md-5",
    type: "rect",
    size: "md",
    color: "accent-muted",
    width: 50,
    height: 35,
    chaosPos: { x: 45, y: 85, rotate: 10 },
    orderPos: { x: 75, y: 55 },
    zIndex: 5,
    jitterSpeed: 1.2,
    mobileVisible: false,
    tabletVisible: false,
  },
  {
    id: "md-6",
    type: "rect",
    size: "md",
    color: "accent-secondary-muted",
    width: 50,
    height: 35,
    chaosPos: { x: 20, y: 80, rotate: -7 },
    orderPos: { x: 14, y: 70 },
    zIndex: 2,
    jitterSpeed: 1.1,
    mobileVisible: false,
    tabletVisible: false,
  },

  // ─── Small blocks (4) ───
  {
    id: "sm-1",
    type: "rect",
    size: "sm",
    color: "chaos-muted",
    width: 30,
    height: 20,
    chaosPos: { x: 50, y: 55, rotate: -15 },
    orderPos: { x: 20, y: 85 },
    zIndex: 7,
    jitterSpeed: 1.6,
    mobileVisible: true,
    tabletVisible: true,
  },
  {
    id: "sm-2",
    type: "rect",
    size: "sm",
    color: "accent-muted",
    width: 30,
    height: 20,
    chaosPos: { x: 30, y: 30, rotate: 13 },
    orderPos: { x: 40, y: 85 },
    zIndex: 8,
    jitterSpeed: 1.3,
    mobileVisible: true,
    tabletVisible: true,
  },
  {
    id: "sm-3",
    type: "rect",
    size: "sm",
    color: "chaos-muted",
    width: 30,
    height: 20,
    chaosPos: { x: 85, y: 15, rotate: -10 },
    orderPos: { x: 60, y: 85 },
    zIndex: 6,
    jitterSpeed: 1.4,
    mobileVisible: false,
    tabletVisible: true,
  },
  {
    id: "sm-4",
    type: "rect",
    size: "sm",
    color: "accent-muted",
    width: 30,
    height: 20,
    chaosPos: { x: 70, y: 75, rotate: 8 },
    orderPos: { x: 80, y: 85 },
    zIndex: 5,
    jitterSpeed: 1.5,
    mobileVisible: false,
    tabletVisible: true,
  },

  // ─── Circles (4) ───
  {
    id: "circle-1",
    type: "circle",
    size: "circle",
    color: "accent-solid",
    width: 16,
    height: 16,
    chaosPos: { x: 42, y: 20, rotate: 0 },
    orderPos: { x: 30, y: 36 },
    zIndex: 9,
    jitterSpeed: 2.0,
    mobileVisible: true,
    tabletVisible: true,
  },
  {
    id: "circle-2",
    type: "circle",
    size: "circle",
    color: "chaos-solid",
    width: 16,
    height: 16,
    chaosPos: { x: 18, y: 42, rotate: 0 },
    orderPos: { x: 60, y: 36 },
    zIndex: 10,
    jitterSpeed: 1.8,
    mobileVisible: true,
    tabletVisible: true,
  },
  {
    id: "circle-3",
    type: "circle",
    size: "circle",
    color: "order-solid",
    width: 16,
    height: 16,
    chaosPos: { x: 72, y: 50, rotate: 0 },
    orderPos: { x: 50, y: 72 },
    zIndex: 9,
    jitterSpeed: 1.9,
    mobileVisible: false,
    tabletVisible: true,
  },
  {
    id: "circle-4",
    type: "circle",
    size: "circle",
    color: "fg-tertiary",
    width: 16,
    height: 16,
    chaosPos: { x: 60, y: 68, rotate: 0 },
    orderPos: { x: 80, y: 72 },
    zIndex: 8,
    jitterSpeed: 2.1,
    mobileVisible: false,
    tabletVisible: false,
  },
];

// ---------------------------------------------------------------------------
// Connection lines — 6 lines connecting shapes
// ---------------------------------------------------------------------------

export const CONNECTIONS: ConnectionData[] = [
  // Large blocks interconnected
  { id: "conn-1", from: 0, to: 1, isProblem: false, chaosCurve: 40 },
  { id: "conn-2", from: 1, to: 2, isProblem: true, chaosCurve: -35 },
  { id: "conn-3", from: 0, to: 4, isProblem: false, chaosCurve: 25 },
  // Medium block connections
  { id: "conn-4", from: 4, to: 5, isProblem: false, chaosCurve: -30 },
  { id: "conn-5", from: 5, to: 6, isProblem: true, chaosCurve: 45 },
  // Cross-group connections
  { id: "conn-6", from: 2, to: 6, isProblem: false, chaosCurve: -20 },
];

// ---------------------------------------------------------------------------
// Responsive filters
// ---------------------------------------------------------------------------

/** Get shapes visible at a given breakpoint */
export function getVisibleShapes(breakpoint: "desktop" | "tablet" | "mobile"): ShapeData[] {
  switch (breakpoint) {
    case "desktop":
      return SHAPES;
    case "tablet":
      return SHAPES.filter((s) => s.tabletVisible);
    case "mobile":
      return SHAPES.filter((s) => s.mobileVisible);
  }
}

/** Get connections that reference only visible shapes */
export function getVisibleConnections(
  visibleShapes: ShapeData[],
): ConnectionData[] {
  const visibleIds = new Set(visibleShapes.map((s) => s.id));
  return CONNECTIONS.filter(
    (c) =>
      visibleIds.has(SHAPES[c.from].id) && visibleIds.has(SHAPES[c.to].id),
  );
}
