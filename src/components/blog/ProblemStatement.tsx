/**
 * ProblemStatement — "THE PROBLEM" card displayed above MDX content
 * on blog post pages that have `before` frontmatter data.
 *
 * Design: Section 7.6 of DESIGN_SPEC.md
 * - bg-bg-surface background with 3px left border in chaos (red)
 * - Overline label "THE PROBLEM" in uppercase
 * - Italic summary text
 * - Bullet points with red dots
 */

interface ProblemStatementProps {
  summary: string;
  points?: string[];
}

export function ProblemStatement({ summary, points }: ProblemStatementProps) {
  return (
    <div className="mx-auto max-w-[65ch] mb-10">
      <div className="rounded-xl border-l-[3px] border-l-chaos bg-bg-surface p-6">
        {/* Overline label */}
        <span className="mb-3 block text-xs font-semibold uppercase tracking-widest text-fg-tertiary">
          The Problem
        </span>

        {/* Summary quote */}
        <p className="text-lg italic leading-relaxed text-fg-secondary">
          &ldquo;{summary}&rdquo;
        </p>

        {/* Bullet points */}
        {points && points.length > 0 && (
          <ul className="mt-4 space-y-1.5">
            {points.map((point) => (
              <li
                key={point}
                className="flex items-start gap-2 text-sm text-fg-secondary"
              >
                <span className="mt-1.5 block h-1.5 w-1.5 shrink-0 rounded-full bg-chaos" />
                {point}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
