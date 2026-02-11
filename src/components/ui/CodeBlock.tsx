import type { ComponentPropsWithoutRef } from "react";

/**
 * Accessible `<pre>` wrapper for MDX code blocks.
 *
 * Adds `tabindex="0"` so scrollable code blocks are keyboard-navigable,
 * and wraps in a `role="region"` with an accessible label.
 *
 * @see DESIGN_SPEC.md Section 9.3 — Code blocks
 */
export function Pre(props: ComponentPropsWithoutRef<"pre">) {
  return (
    <pre {...props} tabIndex={0} role="region" aria-label="Code example" />
  );
}
