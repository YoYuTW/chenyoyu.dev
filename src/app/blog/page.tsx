import type { Metadata } from "next";
import Link from "next/link";
import { getAllPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Writing about software engineering, architecture decisions, and lessons from building real products.",
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="text-3xl font-bold tracking-tight">Blog</h1>
      <p className="mt-2 text-muted">
        Thoughts on software engineering, architecture, and problem-solving.
      </p>

      <div className="mt-10 flex flex-col gap-1">
        {posts.length === 0 && (
          <p className="text-muted py-8">No posts yet. Check back soon.</p>
        )}

        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group -mx-3 rounded-lg px-3 py-4 transition-colors hover:bg-card-bg"
          >
            <div className="flex flex-col gap-1">
              <h2 className="font-medium text-foreground group-hover:text-accent transition-colors">
                {post.title}
              </h2>
              <p className="text-sm text-muted line-clamp-2">
                {post.description}
              </p>
              <div className="flex items-center gap-3 text-xs text-muted mt-1">
                <time dateTime={post.date}>
                  {new Date(post.date).toLocaleDateString("en-AU", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>
                <span>·</span>
                <span>{post.readingTime}</span>
                {post.tags.length > 0 && (
                  <>
                    <span>·</span>
                    <span>{post.tags.join(", ")}</span>
                  </>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
