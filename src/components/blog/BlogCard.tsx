import Link from "next/link";
import type { BlogPostMeta } from "@/lib/blog";

interface BlogCardProps {
  post: BlogPostMeta;
}

/**
 * Fallback blog card for posts without Before/After transformation data.
 * Shows title, description (2-line clamp), tags, date, and reading time.
 */
export function BlogCard({ post }: BlogCardProps) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group block rounded-xl border border-border bg-bg-surface p-5 transition-all duration-200 ease-out hover:border-border-hover hover:shadow-[0_0_20px_var(--accent-muted)]"
    >
      <h3 className="font-medium text-foreground transition-colors duration-150 group-hover:text-accent">
        {post.title}
      </h3>
      <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-fg-secondary">
        {post.description}
      </p>
      <div className="mt-3 flex flex-wrap items-center gap-2">
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
    </Link>
  );
}
