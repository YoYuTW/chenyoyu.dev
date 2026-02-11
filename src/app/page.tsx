import { getAllPosts } from "@/lib/blog";
import { BeforeAfterCard } from "@/components/blog/BeforeAfterCard";
import { BlogCard } from "@/components/blog/BlogCard";
import { HeroChaosOrder } from "@/components/hero/HeroChaosOrder";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { StaggerGroup } from "@/components/motion/StaggerGroup";

export default function Home() {
  const recentPosts = getAllPosts().slice(0, 3);

  return (
    <div className="mx-auto max-w-5xl px-6 py-16 sm:px-8 sm:py-24">
      {/* Hero: Chaos → Order animation */}
      <HeroChaosOrder />

      {/* What I Work On */}
      <section className="mb-16">
        <SectionHeader label="What I Work On" />
        <StaggerGroup className="grid gap-4 sm:grid-cols-2">
          {[
            {
              title: "Complex Front-End Apps",
              desc: "Interactive, performance-sensitive web applications with rich UI — state management, real-time updates, and pixel-perfect rendering.",
            },
            {
              title: "Server-Side Solutions",
              desc: "Backend services, rendering pipelines, data orchestration, and APIs that keep complex systems running smoothly.",
            },
            {
              title: "Architecture & DX",
              desc: "Clean state management, TDD practices, and developer experience that scales with the team.",
            },
            {
              title: "Full-Stack TypeScript",
              desc: "TypeScript end-to-end. React, Next.js, Node.js — whatever solves the problem best.",
            },
          ].map(({ title, desc }) => (
            <div
              key={title}
              className="rounded-lg border border-border bg-bg-surface p-4"
            >
              <h3 className="font-medium text-foreground">{title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-fg-secondary">
                {desc}
              </p>
            </div>
          ))}
        </StaggerGroup>
      </section>

      {/* Recent Posts */}
      {recentPosts.length > 0 && (
        <section>
          <SectionHeader
            label="Recent Writing"
            action={{ text: "View all →", href: "/blog" }}
          />
          <StaggerGroup className="flex flex-col gap-6">
            {recentPosts.map((post) =>
              post.before && post.after ? (
                <BeforeAfterCard key={post.slug} post={post} />
              ) : (
                <BlogCard key={post.slug} post={post} />
              ),
            )}
          </StaggerGroup>
        </section>
      )}
    </div>
  );
}
