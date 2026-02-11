/**
 * Registry of all Remotion compositions for blog posts.
 *
 * Each entry maps a composition slug (matching the blog post slug)
 * to its lazy loader and metadata.
 */

import type { ComponentType } from "react";

/**
 * Lazy-loaded composition registry.
 * Using dynamic imports to keep the main bundle small.
 */
export const COMPOSITIONS: Record<
  string,
  () => Promise<{ default: ComponentType }>
> = {
  "imperative-modal-cinematic": () =>
    import("./imperative-modal-cinematic").then((mod) => ({
      default: mod.ImperativeModalCinematic,
    })),
};

/**
 * Composition metadata (duration, resolution, fps).
 * Kept separate from lazy imports so it can be accessed synchronously.
 */
export const COMPOSITION_META: Record<
  string,
  {
    title: string;
    durationInFrames: number;
    fps: number;
    width: number;
    height: number;
  }
> = {
  "imperative-modal-cinematic": {
    title: "The Imperative Modal Pattern",
    durationInFrames: 600, // 20s at 30fps
    fps: 30,
    width: 1920,
    height: 1080,
  },
};
