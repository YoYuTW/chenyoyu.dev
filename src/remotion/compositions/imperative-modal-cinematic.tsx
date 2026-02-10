import React from "react";
import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
} from "remotion";

// ─── Design Tokens ──────────────────────────────────────────────────────────
const COLORS = {
  bg: "#050505",
  red: "#ef4444",
  redGlow: "#dc2626",
  blue: "#60a5fa",
  blueBright: "#3b82f6",
  blueGlow: "#2563eb",
  green: "#34d399",
  teal: "#2dd4bf",
  textPrimary: "#ededed",
  textMuted: "#a3a3a3",
  textDim: "#525252",
  codeBg: "#0d1117",
  lineNumber: "#484f58",
  // Syntax highlighting
  keyword: "#ff7b72",
  func: "#d2a8ff",
  string: "#a5d6ff",
  type: "#79c0ff",
  variable: "#ffa657",
  comment: "#8b949e",
  bracket: "#8b949e",
};

const FONT_MONO =
  "'Geist Mono', 'SF Mono', 'Fira Code', 'Cascadia Code', monospace";
const FONT_SANS = "'Geist', 'Inter', system-ui, sans-serif";

// ─── Deterministic pseudo-random ────────────────────────────────────────────
const seededRandom = (seed: number): number => {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

// ─── Wall of Code Data ──────────────────────────────────────────────────────
// Real-ish React code that represents a modal-heavy component
const WALL_OF_CODE_LINES = [
  "import { useState, useCallback, useEffect } from 'react';",
  "import { Modal, Button, Form, Input } from '@/components';",
  "import { useRouter } from 'next/navigation';",
  "import type { User, Order, Product } from '@/types';",
  "",
  "export function DashboardPage() {",
  "  const router = useRouter();",
  "  const [isConfirmOpen, setIsConfirmOpen] = useState(false);",
  "  const [isEditOpen, setIsEditOpen] = useState(false);",
  "  const [isDeleteOpen, setIsDeleteOpen] = useState(false);",
  "  const [isCreateOpen, setIsCreateOpen] = useState(false);",
  "  const [isPreviewOpen, setIsPreviewOpen] = useState(false);",
  "  const [isShareOpen, setIsShareOpen] = useState(false);",
  "  const [confirmResult, setConfirmResult] = useState<boolean | null>(null);",
  "  const [editData, setEditData] = useState<Partial<Order> | null>(null);",
  "  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);",
  "  const [createData, setCreateData] = useState<Product | null>(null);",
  "  const [previewItem, setPreviewItem] = useState<Order | null>(null);",
  "  const [shareConfig, setShareConfig] = useState<ShareConfig | null>(null);",
  "",
  "  const handleConfirm = useCallback(() => {",
  "    setIsConfirmOpen(true);",
  "  }, []);",
  "",
  "  const handleConfirmResult = useCallback((result: boolean) => {",
  "    setConfirmResult(result);",
  "    setIsConfirmOpen(false);",
  "    if (result) {",
  "      processOrder(editData);",
  "    }",
  "  }, [editData]);",
  "",
  "  const handleEdit = useCallback((order: Order) => {",
  "    setEditData(order);",
  "    setIsEditOpen(true);",
  "  }, []);",
  "",
  "  const handleEditSave = useCallback((data: Partial<Order>) => {",
  "    setEditData(data);",
  "    setIsEditOpen(false);",
  "    setIsConfirmOpen(true);",
  "  }, []);",
  "",
  "  const handleDelete = useCallback((id: string) => {",
  "    setDeleteTarget(id);",
  "    setIsDeleteOpen(true);",
  "  }, []);",
  "",
  "  const handleDeleteConfirm = useCallback(() => {",
  "    if (deleteTarget) {",
  "      deleteOrder(deleteTarget);",
  "    }",
  "    setDeleteTarget(null);",
  "    setIsDeleteOpen(false);",
  "  }, [deleteTarget]);",
  "",
  "  const handleCreate = useCallback(() => {",
  "    setCreateData({} as Product);",
  "    setIsCreateOpen(true);",
  "  }, []);",
  "",
  "  const handlePreview = useCallback((item: Order) => {",
  "    setPreviewItem(item);",
  "    setIsPreviewOpen(true);",
  "  }, []);",
  "",
  "  const handleShare = useCallback((config: ShareConfig) => {",
  "    setShareConfig(config);",
  "    setIsShareOpen(true);",
  "  }, []);",
  "",
  "  useEffect(() => {",
  "    if (confirmResult !== null) {",
  "      setConfirmResult(null);",
  "    }",
  "  }, [confirmResult]);",
  "",
  "  return (",
  "    <div className='dashboard'>",
  "      <OrderList",
  "        onEdit={handleEdit}",
  "        onDelete={handleDelete}",
  "        onPreview={handlePreview}",
  "      />",
  "      <Modal open={isConfirmOpen} onClose={() => setIsConfirmOpen(false)}>",
  "        <ConfirmDialog onResult={handleConfirmResult} />",
  "      </Modal>",
  "      <Modal open={isEditOpen} onClose={() => setIsEditOpen(false)}>",
  "        <EditForm data={editData} onSave={handleEditSave} />",
  "      </Modal>",
  "      <Modal open={isDeleteOpen} onClose={() => setIsDeleteOpen(false)}>",
  "        <DeleteConfirm onConfirm={handleDeleteConfirm} />",
  "      </Modal>",
  "      <Modal open={isCreateOpen} onClose={() => setIsCreateOpen(false)}>",
  "        <CreateForm onSubmit={(data) => setCreateData(data)} />",
  "      </Modal>",
  "      <Modal open={isPreviewOpen} onClose={() => setIsPreviewOpen(false)}>",
  "        <PreviewPanel item={previewItem} />",
  "      </Modal>",
  "      <Modal open={isShareOpen} onClose={() => setIsShareOpen(false)}>",
  "        <ShareDialog config={shareConfig} />",
  "      </Modal>",
  "    </div>",
  "  );",
  "}",
];

// The 12 useState lines (indices 7-18 in WALL_OF_CODE_LINES)
const USE_STATE_START = 7;
const USE_STATE_END = 18;

// ─── The 12 useState lines for Scene 2 close-up ─────────────────────────────
const USE_STATE_LINES = WALL_OF_CODE_LINES.slice(
  USE_STATE_START,
  USE_STATE_END + 1
);

// ─── Clean solution code ────────────────────────────────────────────────────
const CLEAN_CODE_LINES = [
  "import { useModal } from '@/hooks/useModal';",
  "",
  "export function DashboardPage() {",
  "  const { show } = useModal();",
  "",
  "  const handleEdit = async (order: Order) => {",
  "    const result = await show(EditForm, { data: order });",
  "    if (result) {",
  "      const confirmed = await show(ConfirmDialog);",
  "      if (confirmed) processOrder(result);",
  "    }",
  "  };",
  "",
  "  const handleDelete = async (id: string) => {",
  "    const confirmed = await show(ConfirmDialog);",
  "    if (confirmed) deleteOrder(id);",
  "  };",
  "",
  "  return (",
  "    <OrderList",
  "      onEdit={handleEdit}",
  "      onDelete={handleDelete}",
  "    />",
  "  );",
  "}",
];

// ─── Scanline Overlay ───────────────────────────────────────────────────────
const ScanlineOverlay: React.FC<{ opacity?: number }> = ({
  opacity = 0.04,
}) => (
  <div
    style={{
      position: "absolute",
      inset: 0,
      backgroundImage: `repeating-linear-gradient(
        0deg,
        transparent,
        transparent 2px,
        rgba(0, 0, 0, ${opacity}) 2px,
        rgba(0, 0, 0, ${opacity}) 4px
      )`,
      pointerEvents: "none",
      zIndex: 100,
    }}
  />
);

// ─── Chromatic Aberration wrapper ───────────────────────────────────────────
const ChromaticAberration: React.FC<{
  children: React.ReactNode;
  intensity: number;
}> = ({ children, intensity }) => {
  if (intensity < 0.01) {
    return <>{children}</>;
  }

  const offset = intensity * 4;
  return (
    <>
      {/* Red channel — shifted left */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `translateX(${-offset}px)`,
          mixBlendMode: "screen",
          opacity: 0.7,
          filter: "url(#red-channel)",
        }}
      >
        {children}
      </div>
      {/* Green channel — center (base) */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          mixBlendMode: "screen",
          opacity: 0.7,
          filter: "url(#green-channel)",
        }}
      >
        {children}
      </div>
      {/* Blue channel — shifted right */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `translateX(${offset}px)`,
          mixBlendMode: "screen",
          opacity: 0.7,
          filter: "url(#blue-channel)",
        }}
      >
        {children}
      </div>
      {/* SVG filters for color channel separation */}
      <svg style={{ position: "absolute", width: 0, height: 0 }}>
        <defs>
          <filter id="red-channel">
            <feColorMatrix
              type="matrix"
              values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0"
            />
          </filter>
          <filter id="green-channel">
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0"
            />
          </filter>
          <filter id="blue-channel">
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0"
            />
          </filter>
        </defs>
      </svg>
    </>
  );
};

// ─── Glitch Slice Effect ────────────────────────────────────────────────────
const GlitchSlices: React.FC<{
  intensity: number;
  frame: number;
}> = ({ intensity, frame }) => {
  if (intensity < 0.01) return null;

  const sliceCount = 8;
  return (
    <>
      {Array.from({ length: sliceCount }, (_, i) => {
        const seed1 = seededRandom(frame * 7 + i * 13);
        const seed2 = seededRandom(frame * 11 + i * 17);
        const sliceHeight = 20 + seed1 * 80;
        const sliceY = seed2 * 1080;
        const offsetX = (seededRandom(frame * 3 + i * 23) - 0.5) * 200 * intensity;
        const show = seededRandom(frame * 5 + i * 31) > 0.4;

        if (!show) return null;

        return (
          <div
            key={`glitch-${i}`}
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: sliceY,
              height: sliceHeight,
              transform: `translateX(${offsetX}px)`,
              background: `linear-gradient(90deg, 
                rgba(239, 68, 68, ${0.15 * intensity}) 0%, 
                transparent 30%, 
                transparent 70%, 
                rgba(96, 165, 250, ${0.15 * intensity}) 100%)`,
              overflow: "hidden",
              pointerEvents: "none",
              zIndex: 90,
            }}
          />
        );
      })}
    </>
  );
};

// ─── Terminal Cursor ────────────────────────────────────────────────────────
const TerminalCursor: React.FC<{
  frame: number;
  visible: boolean;
}> = ({ frame, visible }) => {
  if (!visible) return null;

  const blinkFrames = 16;
  const opacity = interpolate(
    frame % blinkFrames,
    [0, blinkFrames / 2, blinkFrames],
    [1, 0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <span
      style={{
        display: "inline-block",
        width: 14,
        height: 28,
        backgroundColor: COLORS.blue,
        opacity,
        marginLeft: 2,
        verticalAlign: "text-bottom",
        boxShadow: `0 0 8px ${COLORS.blueGlow}`,
      }}
    />
  );
};

// ─── Scene 1: The Codebase — Overhead Shot (0–5s) ───────────────────────────
const CodebaseScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Fade in
  const fadeIn = interpolate(frame, [0, 0.5 * fps], [0, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  // Zoom: start zoomed out (scale 0.35) → zoom into the red cluster (scale 1.2)
  const zoomProgress = interpolate(frame, [0, 5 * fps], [0, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
    easing: Easing.inOut(Easing.quad),
  });
  const scale = interpolate(zoomProgress, [0, 1], [0.35, 1.2]);
  // Pan: shift focus from center of full code to the useState cluster area
  const translateY = interpolate(zoomProgress, [0, 1], [0, -180]);
  const translateX = interpolate(zoomProgress, [0, 1], [0, -60]);

  // Chromatic aberration — stronger at edges, increases as we zoom
  const chromaIntensity = interpolate(zoomProgress, [0, 0.3, 1], [0.3, 0.15, 0.6], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  // Red glow pulsing on the useState cluster
  const glowPulse = Math.sin(frame * 0.08) * 0.3 + 0.7;

  // Subtle vignette
  const vignetteOpacity = interpolate(zoomProgress, [0, 1], [0.3, 0.5], {
    extrapolateRight: "clamp",
  });

  const totalLines = WALL_OF_CODE_LINES.length;
  const lineHeight = 11;
  const codeBlockHeight = totalLines * lineHeight;

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg, opacity: fadeIn }}>
      {/* Code wall container with zoom */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          transform: `scale(${scale}) translate(${translateX}px, ${translateY}px)`,
          transformOrigin: "center center",
        }}
      >
        <ChromaticAberration intensity={chromaIntensity}>
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
              width: 1200,
              fontFamily: FONT_MONO,
              fontSize: 9,
              lineHeight: `${lineHeight}px`,
              color: COLORS.textDim,
              whiteSpace: "pre",
              userSelect: "none",
            }}
          >
            {WALL_OF_CODE_LINES.map((line, i) => {
              const isUseState = i >= USE_STATE_START && i <= USE_STATE_END;
              const stateGlow = isUseState ? glowPulse : 0;

              return (
                <div
                  key={`code-${i}`}
                  style={{
                    color: isUseState
                      ? COLORS.red
                      : i < 4
                        ? COLORS.comment
                        : COLORS.textDim,
                    textShadow: isUseState
                      ? `0 0 ${8 * stateGlow}px ${COLORS.redGlow}, 0 0 ${16 * stateGlow}px rgba(220, 38, 38, 0.3)`
                      : "none",
                    opacity: isUseState ? 0.9 + stateGlow * 0.1 : 0.4,
                    paddingLeft: 40,
                    position: "relative",
                  }}
                >
                  {/* Line number */}
                  <span
                    style={{
                      position: "absolute",
                      left: 0,
                      width: 30,
                      textAlign: "right",
                      color: isUseState
                        ? `rgba(239, 68, 68, ${0.4 + stateGlow * 0.2})`
                        : COLORS.lineNumber,
                      opacity: 0.5,
                    }}
                  >
                    {i + 1}
                  </span>
                  {line}
                </div>
              );
            })}
          </div>
        </ChromaticAberration>

        {/* Red glow halo around the useState cluster */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            // Position at the useState cluster area
            transform: `translate(-50%, calc(-50% + ${(USE_STATE_START + (USE_STATE_END - USE_STATE_START) / 2) * lineHeight - codeBlockHeight / 2}px))`,
            width: 800,
            height: (USE_STATE_END - USE_STATE_START + 4) * lineHeight,
            background: `radial-gradient(ellipse at center, rgba(239, 68, 68, ${0.08 * glowPulse}) 0%, transparent 70%)`,
            pointerEvents: "none",
          }}
        />
      </div>

      {/* Scanline overlay */}
      <ScanlineOverlay opacity={0.03} />

      {/* Vignette */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse at center, transparent 40%, rgba(0, 0, 0, ${vignetteOpacity}) 100%)`,
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};

// ─── Scene 2: The Problem — Close Up (5–10s) ───────────────────────────────
const ProblemScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Fade in from scene 1's zoom
  const fadeIn = interpolate(frame, [0, 0.3 * fps], [0, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  // Each useState line pulses at a different frequency
  const getLinePulse = (index: number) => {
    const freq = 0.1 + seededRandom(index + 100) * 0.15;
    const phase = seededRandom(index + 200) * Math.PI * 2;
    return Math.sin(frame * freq + phase) * 0.3 + 0.7;
  };

  // Dependency connections — dashed animated lines between state fields
  const connections: Array<{
    from: number;
    to: number;
    curve: number;
  }> = [
    { from: 0, to: 6, curve: 30 }, // isConfirmOpen → confirmResult
    { from: 1, to: 7, curve: -25 }, // isEditOpen → editData
    { from: 2, to: 8, curve: 40 }, // isDeleteOpen → deleteTarget
    { from: 3, to: 9, curve: -35 }, // isCreateOpen → createData
    { from: 4, to: 10, curve: 30 }, // isPreviewOpen → previewItem
    { from: 5, to: 11, curve: -20 }, // isShareOpen → shareConfig
    { from: 6, to: 1, curve: 50 }, // confirmResult → isEditOpen (cross-dep)
    { from: 7, to: 0, curve: -45 }, // editData → isConfirmOpen (cross-dep)
    { from: 8, to: 0, curve: 60 }, // deleteTarget → isConfirmOpen
  ];

  const connectionOpacity = interpolate(
    frame,
    [0.5 * fps, 1.5 * fps],
    [0, 0.6],
    { extrapolateRight: "clamp", extrapolateLeft: "clamp" }
  );

  // Comment label typing: "// 12 modal state fields"
  const labelText = "// 12 modal state fields";
  const labelStartFrame = 2 * fps;
  const charFrames = 2;
  const typedChars = Math.min(
    labelText.length,
    Math.max(0, Math.floor((frame - labelStartFrame) / charFrames))
  );
  const typedLabel = labelText.slice(0, typedChars);
  const showCursor = frame >= labelStartFrame;
  const doneTyping = typedChars >= labelText.length;

  // Subtle frame vibration (tension)
  const vibrateX = frame > 1.5 * fps
    ? Math.sin(frame * 1.7) * 1.5 + Math.cos(frame * 2.3) * 0.8
    : 0;
  const vibrateY = frame > 1.5 * fps
    ? Math.cos(frame * 1.9) * 1.2 + Math.sin(frame * 3.1) * 0.5
    : 0;

  const lineHeight = 32;
  const codeLeft = 300;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.bg,
        opacity: fadeIn,
        transform: `translate(${vibrateX}px, ${vibrateY}px)`,
      }}
    >
      {/* Dependency connection lines (SVG) */}
      <svg
        width={1920}
        height={1080}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          opacity: connectionOpacity,
        }}
      >
        {connections.map((conn, idx) => {
          const fromY = 160 + conn.from * lineHeight + lineHeight / 2;
          const toY = 160 + conn.to * lineHeight + lineHeight / 2;
          const fromX = codeLeft - 20;
          const toX = codeLeft - 20;
          const midX = fromX - 60 + conn.curve;
          const midY = (fromY + toY) / 2;

          // Animated dash offset
          const dashOffset = frame * 2;
          const linePulse =
            Math.sin(frame * 0.12 + idx * 0.8) * 0.3 + 0.5;

          return (
            <path
              key={`dep-${idx}`}
              d={`M ${fromX} ${fromY} Q ${midX} ${midY} ${toX} ${toY}`}
              stroke={COLORS.red}
              strokeWidth={1.2}
              fill="none"
              opacity={linePulse}
              strokeDasharray="6 4"
              strokeDashoffset={dashOffset}
            />
          );
        })}
      </svg>

      {/* useState lines */}
      <div
        style={{
          position: "absolute",
          top: 160,
          left: codeLeft,
          fontFamily: FONT_MONO,
          fontSize: 16,
          lineHeight: `${lineHeight}px`,
        }}
      >
        {USE_STATE_LINES.map((line, i) => {
          const pulse = getLinePulse(i);
          // Staggered fade in
          const lineFade = interpolate(
            frame,
            [0.2 * fps + i * 2, 0.5 * fps + i * 2],
            [0, 1],
            { extrapolateRight: "clamp", extrapolateLeft: "clamp" }
          );

          return (
            <div
              key={`state-${i}`}
              style={{
                opacity: lineFade,
                color: COLORS.red,
                textShadow: `0 0 ${10 * pulse}px ${COLORS.redGlow}, 0 0 ${20 * pulse}px rgba(220, 38, 38, 0.25)`,
                position: "relative",
                paddingLeft: 50,
              }}
            >
              {/* Line number */}
              <span
                style={{
                  position: "absolute",
                  left: 0,
                  color: `rgba(239, 68, 68, ${0.3 + pulse * 0.15})`,
                  width: 40,
                  textAlign: "right",
                }}
              >
                {USE_STATE_START + i + 1}
              </span>
              {/* Highlight keywords */}
              <span>
                <span style={{ color: COLORS.keyword }}>const</span>
                <span style={{ color: COLORS.red }}>
                  {line.slice(5, line.indexOf("="))}
                </span>
                <span style={{ color: COLORS.bracket }}>= </span>
                <span style={{ color: COLORS.func }}>useState</span>
                <span style={{ color: COLORS.red }}>
                  {line.slice(line.indexOf("("))}
                </span>
              </span>
            </div>
          );
        })}
      </div>

      {/* Typed comment label */}
      <div
        style={{
          position: "absolute",
          top: 64,
          right: 120,
          fontFamily: FONT_MONO,
          fontSize: 22,
          color: COLORS.comment,
          opacity: showCursor ? 0.8 : 0,
        }}
      >
        <span>{typedLabel}</span>
        <TerminalCursor
          frame={frame}
          visible={showCursor && !doneTyping}
        />
      </div>

      {/* Red ambient glow */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse at 40% 50%, rgba(239, 68, 68, 0.06) 0%, transparent 60%)`,
          pointerEvents: "none",
        }}
      />

      <ScanlineOverlay opacity={0.025} />
    </AbsoluteFill>
  );
};

// ─── Scene 3: The Transformation — Glitch Wipe (10–15s) ────────────────────
const TransformationScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Phase timing (all in local frames):
  // 0 – 0.8s: Hard glitch with screen tear
  // 0.8s – 1.3s: Black screen
  // 1.3s – 4s: Code types in character by character
  // 4s – 5s: Blue pulse + hold

  const glitchEnd = 0.8 * fps; // frame 24
  const blackEnd = 1.3 * fps; // frame 39
  const typeStart = blackEnd;
  const typeText = "const result = await show(props);";
  const charRate = 2; // frames per character
  const typeEnd = typeStart + typeText.length * charRate;
  const pulseStart = typeEnd;

  // ── Glitch phase ──
  const glitchIntensity = frame < glitchEnd
    ? interpolate(frame, [0, 0.2 * fps, 0.5 * fps, glitchEnd], [0, 1, 0.8, 0], {
        extrapolateRight: "clamp",
        extrapolateLeft: "clamp",
      })
    : 0;

  // RGB split during glitch
  const rgbSplit = glitchIntensity * 30;

  // Screen tear — horizontal offset of top/bottom halves
  const tearOffset = frame < glitchEnd
    ? (seededRandom(frame * 7) - 0.5) * 100 * glitchIntensity
    : 0;

  // ── Black phase ──
  const blackOpacity = interpolate(
    frame,
    [glitchEnd, glitchEnd + 4, blackEnd - 4, blackEnd],
    [0, 1, 1, 0],
    { extrapolateRight: "clamp", extrapolateLeft: "clamp" }
  );

  // ── Typing phase ──
  const typedChars = frame >= typeStart
    ? Math.min(typeText.length, Math.floor((frame - typeStart) / charRate))
    : 0;
  const typedText = typeText.slice(0, typedChars);
  const isTyping = frame >= typeStart && typedChars < typeText.length;
  const isDoneTyping = typedChars >= typeText.length;

  // Text fade in
  const textOpacity = frame >= typeStart
    ? interpolate(frame, [typeStart, typeStart + 4], [0, 1], {
        extrapolateRight: "clamp",
        extrapolateLeft: "clamp",
      })
    : 0;

  // ── Blue pulse when typing completes ──
  const pulseProgress = frame >= pulseStart
    ? interpolate(frame, [pulseStart, pulseStart + 0.5 * fps], [0, 1], {
        extrapolateRight: "clamp",
        extrapolateLeft: "clamp",
      })
    : 0;

  const pulseGlow = pulseProgress > 0 && pulseProgress < 1
    ? interpolate(pulseProgress, [0, 0.3, 1], [0, 1, 0.3], {
        extrapolateRight: "clamp",
      })
    : pulseProgress >= 1
      ? 0.3
      : 0;

  // Character glow trail — last few characters glow brighter
  const getCharGlow = (charIndex: number): number => {
    if (!isTyping && !isDoneTyping) return 0;
    if (isDoneTyping) return 0.3;
    const distFromCursor = typedChars - charIndex;
    if (distFromCursor < 0) return 0;
    return interpolate(distFromCursor, [0, 6], [1, 0.2], {
      extrapolateRight: "clamp",
    });
  };

  // Syntax color for each character
  const getCharColor = (char: string, index: number): string => {
    // "const result = await show(props);"
    if (index < 5) return COLORS.keyword; // "const"
    if (index >= 6 && index < 12) return COLORS.blue; // "result"
    if (index >= 13 && index < 14) return COLORS.bracket; // "="
    if (index >= 15 && index < 20) return COLORS.keyword; // "await"
    if (index >= 21 && index < 25) return COLORS.func; // "show"
    if (index === 25) return COLORS.bracket; // "("
    if (index >= 26 && index < 31) return COLORS.variable; // "props"
    if (index === 31) return COLORS.bracket; // ")"
    if (index === 32) return COLORS.bracket; // ";"
    return COLORS.textPrimary;
  };

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg }}>
      {/* Glitch tear effect — top half offset */}
      {glitchIntensity > 0.01 && (
        <>
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: 0,
              height: "50%",
              transform: `translateX(${tearOffset}px)`,
              overflow: "hidden",
              backgroundColor: COLORS.bg,
            }}
          >
            {/* RGB split lines */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                transform: `translateX(${rgbSplit}px)`,
                opacity: 0.6 * glitchIntensity,
                background: `linear-gradient(0deg, transparent 48%, rgba(239, 68, 68, 0.5) 49%, transparent 51%)`,
              }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                transform: `translateX(${-rgbSplit}px)`,
                opacity: 0.6 * glitchIntensity,
                background: `linear-gradient(0deg, transparent 48%, rgba(96, 165, 250, 0.5) 49%, transparent 51%)`,
              }}
            />
          </div>

          {/* Glitch slices */}
          <GlitchSlices intensity={glitchIntensity} frame={frame} />

          {/* White flash at peak glitch */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundColor: "#ffffff",
              opacity: glitchIntensity > 0.8
                ? (glitchIntensity - 0.8) * 2
                : 0,
              pointerEvents: "none",
            }}
          />
        </>
      )}

      {/* Black screen */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "#000000",
          opacity: blackOpacity,
          zIndex: 50,
        }}
      />

      {/* Typed code line — centered in darkness */}
      {frame >= typeStart && (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: "50%",
            transform: "translateY(-50%)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            opacity: textOpacity,
            zIndex: 60,
          }}
        >
          <div
            style={{
              fontFamily: FONT_MONO,
              fontSize: 36,
              letterSpacing: "0.02em",
              textShadow: isDoneTyping
                ? `0 0 ${20 + pulseGlow * 40}px rgba(96, 165, 250, ${0.3 + pulseGlow * 0.5}), 0 0 ${60 * pulseGlow}px rgba(96, 165, 250, ${0.15 * pulseGlow})`
                : "none",
            }}
          >
            {/* Render each character with individual glow */}
            {typedText.split("").map((char, i) => {
              const glow = getCharGlow(i);
              const color = getCharColor(char, i);
              return (
                <span
                  key={`char-${i}`}
                  style={{
                    color,
                    textShadow:
                      glow > 0.1
                        ? `0 0 ${8 * glow}px ${COLORS.blueGlow}, 0 0 ${16 * glow}px rgba(37, 99, 235, 0.3)`
                        : "none",
                  }}
                >
                  {char}
                </span>
              );
            })}
            <TerminalCursor frame={frame} visible={isTyping} />
          </div>
        </div>
      )}

      {/* Blue pulse ring when typing completes */}
      {pulseGlow > 0 && (
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            width: 600 + pulseProgress * 400,
            height: 100 + pulseProgress * 200,
            transform: "translate(-50%, -50%)",
            borderRadius: "50%",
            border: `1px solid rgba(96, 165, 250, ${pulseGlow * 0.3})`,
            boxShadow: `0 0 ${40 * pulseGlow}px rgba(96, 165, 250, ${pulseGlow * 0.15})`,
            pointerEvents: "none",
            zIndex: 55,
          }}
        />
      )}

      <ScanlineOverlay opacity={0.02} />
    </AbsoluteFill>
  );
};

// ─── Scene 4: The Resolution — Pull Back (15–20s) ──────────────────────────
const ResolutionScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Camera pull back: scale from 1.5 (zoomed in on the line) → 1.0
  const pullBackProgress = interpolate(frame, [0, 2 * fps], [0, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
    easing: Easing.out(Easing.quad),
  });
  const scale = interpolate(pullBackProgress, [0, 1], [1.5, 1]);

  // Clean code editor fade in
  const editorOpacity = interpolate(frame, [0.5 * fps, 2 * fps], [0, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  // The solution line (already visible from scene 3, highlighted)
  const solutionLineOpacity = interpolate(frame, [0, 0.5 * fps], [1, 0.9], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  // Counter morph: 12 → 0
  const counterProgress = interpolate(
    frame,
    [1.5 * fps, 3 * fps],
    [0, 1],
    {
      extrapolateRight: "clamp",
      extrapolateLeft: "clamp",
      easing: Easing.inOut(Easing.quad),
    }
  );
  // Display a number from 12 → 0
  const counterValue = Math.round(12 * (1 - counterProgress));

  // Title entrance
  const titleSpring = spring({
    frame: Math.max(0, frame - Math.round(3 * fps)),
    fps,
    config: { damping: 200 },
  });

  const titleOpacity = interpolate(titleSpring, [0, 0.5], [0, 1], {
    extrapolateRight: "clamp",
  });
  const titleY = interpolate(titleSpring, [0, 1], [30, 0], {
    extrapolateRight: "clamp",
  });

  // Lens flare
  const flareOpacity = interpolate(
    frame,
    [3.5 * fps, 4 * fps, 4.5 * fps],
    [0, 0.4, 0.15],
    { extrapolateRight: "clamp", extrapolateLeft: "clamp" }
  );

  const lineHeight = 26;

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `scale(${scale})`,
          transformOrigin: "center center",
        }}
      >
        {/* Clean code editor panel */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            width: 900,
            padding: "40px 50px",
            backgroundColor: COLORS.codeBg,
            borderRadius: 12,
            opacity: editorOpacity,
            boxShadow: "0 0 80px rgba(0, 0, 0, 0.5)",
          }}
        >
          {/* Editor title bar dots */}
          <div
            style={{
              display: "flex",
              gap: 8,
              marginBottom: 24,
              opacity: 0.5,
            }}
          >
            <div
              style={{
                width: 12,
                height: 12,
                borderRadius: "50%",
                backgroundColor: "#ff5f57",
              }}
            />
            <div
              style={{
                width: 12,
                height: 12,
                borderRadius: "50%",
                backgroundColor: "#febc2e",
              }}
            />
            <div
              style={{
                width: 12,
                height: 12,
                borderRadius: "50%",
                backgroundColor: "#28c840",
              }}
            />
          </div>

          {/* Clean code lines */}
          <div
            style={{
              fontFamily: FONT_MONO,
              fontSize: 15,
              lineHeight: `${lineHeight}px`,
            }}
          >
            {CLEAN_CODE_LINES.map((line, i) => {
              // Staggered fade in from top
              const lineFade = interpolate(
                frame,
                [0.8 * fps + i * 2, 1.5 * fps + i * 2],
                [0, 1],
                { extrapolateRight: "clamp", extrapolateLeft: "clamp" }
              );

              // Highlight the key line: "const result = await show(..."
              const isKeyLine = line.includes("await show(");
              const lineColor = isKeyLine
                ? COLORS.blue
                : line.startsWith("  //")
                  ? COLORS.comment
                  : line.includes("import") || line.includes("export") || line.includes("const") || line.includes("async") || line.includes("if")
                    ? COLORS.keyword
                    : line === ""
                      ? "transparent"
                      : COLORS.textMuted;

              return (
                <div
                  key={`clean-${i}`}
                  style={{
                    opacity: lineFade * solutionLineOpacity,
                    color: lineColor,
                    paddingLeft: 40,
                    position: "relative",
                    textShadow: isKeyLine
                      ? `0 0 12px rgba(96, 165, 250, 0.3)`
                      : "none",
                  }}
                >
                  <span
                    style={{
                      position: "absolute",
                      left: 0,
                      width: 30,
                      textAlign: "right",
                      color: COLORS.lineNumber,
                      opacity: 0.4,
                    }}
                  >
                    {i + 1}
                  </span>
                  {/* Basic syntax highlighting */}
                  {line.split(/(const |await |async |if |import |export |function |return |=>)/g).map((part, pi) => {
                    const isKw = [
                      "const ",
                      "await ",
                      "async ",
                      "if ",
                      "import ",
                      "export ",
                      "function ",
                      "return ",
                      "=>",
                    ].includes(part);
                    return (
                      <span
                        key={`part-${i}-${pi}`}
                        style={{
                          color: isKw
                            ? COLORS.keyword
                            : isKeyLine
                              ? COLORS.blue
                              : lineColor,
                        }}
                      >
                        {part}
                      </span>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>

        {/* State fields counter */}
        <div
          style={{
            position: "absolute",
            right: 180,
            top: 200,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            opacity: interpolate(frame, [1.5 * fps, 2 * fps], [0, 1], {
              extrapolateRight: "clamp",
              extrapolateLeft: "clamp",
            }),
          }}
        >
          <span
            style={{
              fontFamily: FONT_MONO,
              fontSize: 72,
              fontWeight: 700,
              color: counterValue > 0 ? COLORS.red : COLORS.green,
              textShadow: counterValue > 0
                ? `0 0 20px ${COLORS.redGlow}`
                : `0 0 20px rgba(52, 211, 153, 0.5)`,
              lineHeight: 1,
            }}
          >
            {counterValue}
          </span>
          <span
            style={{
              fontFamily: FONT_SANS,
              fontSize: 14,
              color: COLORS.textMuted,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              marginTop: 8,
            }}
          >
            state fields
          </span>
        </div>
      </div>

      {/* Title card */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 80,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          opacity: titleOpacity,
          transform: `translateY(${titleY}px)`,
        }}
      >
        <h1
          style={{
            fontFamily: FONT_SANS,
            fontSize: 48,
            fontWeight: 600,
            color: COLORS.textPrimary,
            margin: 0,
            letterSpacing: "-0.02em",
          }}
        >
          The Imperative Modal Pattern
        </h1>
      </div>

      {/* Lens flare */}
      {flareOpacity > 0 && (
        <div
          style={{
            position: "absolute",
            left: "55%",
            top: "30%",
            width: 300,
            height: 300,
            transform: "translate(-50%, -50%)",
            background: `radial-gradient(circle, rgba(255, 255, 255, ${flareOpacity * 0.6}) 0%, rgba(96, 165, 250, ${flareOpacity * 0.2}) 30%, transparent 60%)`,
            pointerEvents: "none",
            zIndex: 80,
          }}
        />
      )}

      {/* Subtle blue ambient glow */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at 50% 50%, rgba(96, 165, 250, 0.03) 0%, transparent 60%)",
          pointerEvents: "none",
        }}
      />

      <ScanlineOverlay opacity={0.015} />
    </AbsoluteFill>
  );
};

// ─── Main Composition ──────────────────────────────────────────────────────
export const ImperativeModalCinematic: React.FC = () => {
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg }}>
      {/* Scene 1: The Codebase — Overhead Shot (0–5s) */}
      <Sequence
        from={0}
        durationInFrames={Math.round(5 * fps)}
        premountFor={Math.round(0.5 * fps)}
      >
        <CodebaseScene />
      </Sequence>

      {/* Scene 2: The Problem — Close Up (5–10s) */}
      <Sequence
        from={Math.round(5 * fps)}
        durationInFrames={Math.round(5 * fps)}
        premountFor={Math.round(0.5 * fps)}
      >
        <ProblemScene />
      </Sequence>

      {/* Scene 3: The Transformation — Glitch Wipe (10–15s) */}
      <Sequence
        from={Math.round(10 * fps)}
        durationInFrames={Math.round(5 * fps)}
        premountFor={Math.round(0.5 * fps)}
      >
        <TransformationScene />
      </Sequence>

      {/* Scene 4: The Resolution — Pull Back (15–20s) */}
      <Sequence
        from={Math.round(15 * fps)}
        durationInFrames={Math.round(5 * fps)}
        premountFor={Math.round(0.5 * fps)}
      >
        <ResolutionScene />
      </Sequence>
    </AbsoluteFill>
  );
};
