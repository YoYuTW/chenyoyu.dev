"use client";

import { useCallback, useMemo } from "react";
import { Player } from "@remotion/player";
import { COMPOSITIONS, COMPOSITION_META } from "@/remotion/compositions";

interface BlogVideoHeroProps {
  /**
   * The composition slug — must match a key in COMPOSITIONS registry.
   * e.g. "imperative-modal"
   */
  composition: string;
}

/**
 * Embeds a Remotion Player as a hero element for blog posts.
 *
 * Uses `lazyComponent` to dynamically import the composition,
 * avoiding SSR issues and keeping the main bundle lean.
 *
 * The player renders at 1920x1080 internally but is responsive,
 * filling the container width with a 16:9 aspect ratio.
 */
export function BlogVideoHero({ composition }: BlogVideoHeroProps) {
  const meta = COMPOSITION_META[composition];
  const loader = COMPOSITIONS[composition];

  const lazyComponent = useCallback(() => {
    if (!loader) {
      return Promise.resolve({
        default: () => (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
              height: "100%",
              backgroundColor: "#0a0a0a",
              color: "#737373",
              fontFamily: "monospace",
              fontSize: 18,
            }}
          >
            Composition &quot;{composition}&quot; not found
          </div>
        ),
      });
    }
    return loader();
  }, [loader, composition]);

  const style = useMemo(
    () =>
      ({
        width: "100%",
        aspectRatio: "16 / 9",
        borderRadius: 12,
        overflow: "hidden",
      }) as const,
    []
  );

  if (!meta) {
    return null;
  }

  return (
    <div
      style={{
        marginBottom: 32,
        borderRadius: 12,
        overflow: "hidden",
        // Subtle border matching the site's design tokens
        border: "1px solid var(--border, #262626)",
      }}
    >
      <Player
        lazyComponent={lazyComponent}
        durationInFrames={meta.durationInFrames}
        compositionWidth={meta.width}
        compositionHeight={meta.height}
        fps={meta.fps}
        style={style}
        controls
        loop
        autoPlay
        initiallyMuted
        acknowledgeRemotionLicense
      />
    </div>
  );
}
