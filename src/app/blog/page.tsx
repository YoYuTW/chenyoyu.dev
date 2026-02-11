import type { Metadata } from "next";
import { getAllPosts } from "@/lib/blog";
import { BeforeAfterCard } from "@/components/blog/BeforeAfterCard";
import { BlogCard } from "@/components/blog/BlogCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { StaggerGroup } from "@/components/motion/StaggerGroup";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Writing about software engineering, architecture decisions, and lessons from building real products.",
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <div className="mx-auto max-w-5xl px-6 py-16 sm:px-8">
      <h1 className="text-3xl font-bold tracking-tight">Blog</h1>
      <p className="mt-2 text-fg-secondary">
        Thoughts on software engineering, architecture, and problem-solving.
      </p>

      <div className="mt-10">
        <SectionHeader label="Posts" />

        {posts.length === 0 && (
          <p className="py-8 text-fg-secondary">
            No posts yet. Check back soon.
          </p>
        )}

        <StaggerGroup className="flex flex-col gap-6">
          {posts.map((post) =>
            post.before && post.after ? (
              <BeforeAfterCard key={post.slug} post={post} />
            ) : (
              <BlogCard key={post.slug} post={post} />
            ),
          )}
        </StaggerGroup>
      </div>
    </div>
  );
}
