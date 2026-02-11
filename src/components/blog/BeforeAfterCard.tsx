import Link from "next/link";
import type { BlogPostMeta } from "@/lib/blog";

interface BeforeAfterCardProps {
  post: BlogPostMeta;
}

/**
 * Signature blog card that presents a post as a Before → After transformation story.
 *
 * Desktop (≥ 768px): Two columns side by side with a dashed vertical divider.
 * Mobile (< 768px): Stacked vertically with a ↓ arrow between columns.
 *
 * Requires post.before and post.after to be defined.
 */
export function BeforeAfterCard({ post }: BeforeAfterCardProps) {
  const { before, after } = post;

  // Guard: this component should only be rendered when before/after exist
  if (!before || !after) return null;

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group block rounded-xl border border-border bg-bg-surface transition-all duration-200 ease-out hover:border-border-hover hover:shadow-[0_0_20px_var(--accent-muted)]"
    >
      {/* Before / After columns */}
      <div className="flex flex-col md:flex-row">
        {/* Before column */}
        <div className="flex-1 rounded-t-xl bg-chaos-muted p-5 md:rounded-l-xl md:rounded-tr-none">
          <span className="text-xs font-semibold uppercase tracking-wider text-fg-tertiary">
            Before
          </span>
          <p className="mt-2 text-xl font-semibold text-foreground">
            {before.summary}
          </p>
          <ul className="mt-3 space-y-1.5">
            {before.points.map((point) => (
              <li key={point} className="flex items-start gap-2 text-sm text-fg-secondary">
                <span className="mt-0.5 text-chaos" aria-hidden="true">●</span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Divider — horizontal on mobile, vertical on desktop */}
        <div className="flex items-center justify-center md:hidden">
          <span className="py-2 text-lg text-fg-tertiary" aria-hidden="true">↓</span>
        </div>
        <div className="hidden border-l border-dashed border-border md:block" />

        {/* After column */}
        <div className="flex-1 rounded-b-xl bg-order-muted p-5 md:rounded-r-xl md:rounded-bl-none">
          <span className="text-xs font-semibold uppercase tracking-wider text-fg-tertiary">
            After
          </span>
          <p className="mt-2 text-xl font-semibold text-foreground">
            {after.summary}
          </p>
          <ul className="mt-3 space-y-1.5">
            {after.points.map((point) => (
              <li key={point} className="flex items-start gap-2 text-sm text-fg-secondary">
                <span className="mt-0.5 text-order" aria-hidden="true">✓</span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Card footer: title, tags, date, reading time */}
      <div className="border-t border-dashed border-border p-5">
        <h3 className="font-medium text-foreground transition-colors duration-150 group-hover:text-accent">
          {post.title}
        </h3>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <ul aria-label="Tags" className="flex flex-wrap items-center gap-2">
            {post.tags.map((tag) => (
              <li
                key={tag}
                className="rounded-full border border-border bg-bg-overlay px-2.5 py-0.5 text-xs text-fg-secondary"
              >
                {tag}
              </li>
            ))}
          </ul>
          <span className="ml-auto flex items-center gap-2 text-xs text-fg-tertiary">
            <time dateTime={post.date}>
              {new Date(post.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </time>
            <span>·</span>
            <span>{post.readingTime}</span>
          </span>
        </div>
      </div>
    </Link>
  );
}
