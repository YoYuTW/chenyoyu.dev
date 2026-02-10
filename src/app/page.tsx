import Link from "next/link";
import { getAllPosts } from "@/lib/blog";

export default function Home() {
  const recentPosts = getAllPosts().slice(0, 3);

  return (
    <div className="mx-auto max-w-2xl px-6 py-16 sm:py-24">
      {/* Hero */}
      <section className="mb-16">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Hi, I&apos;m YoYu Chen.
        </h1>
        <p className="mt-4 text-lg text-muted leading-relaxed">
          I solve problems with software. I specialise in complex front-end
          applications and full-stack solutions using React, TypeScript, and
          Node.js.
        </p>
        <p className="mt-3 text-lg text-muted leading-relaxed">
          Every project starts with a question:{" "}
          <em className="text-foreground not-italic font-medium">
            &ldquo;What&apos;s the actual problem here?&rdquo;
          </em>
        </p>
        <div className="mt-8 flex items-center gap-4">
          <Link
            href="/blog"
            className="rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background transition-opacity hover:opacity-80"
          >
            Read the Blog
          </Link>
          <Link
            href="/about"
            className="rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-card-bg"
          >
            About Me
          </Link>
        </div>
      </section>

      {/* What I Do */}
      <section className="mb-16">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted mb-6">
          What I Work On
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
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
              className="rounded-lg border border-border bg-card-bg p-4"
            >
              <h3 className="font-medium text-foreground">{title}</h3>
              <p className="mt-1 text-sm text-muted leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Recent Posts */}
      {recentPosts.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted">
              Recent Writing
            </h2>
            <Link
              href="/blog"
              className="text-sm text-accent hover:text-accent-hover transition-colors"
            >
              View all →
            </Link>
          </div>
          <div className="flex flex-col gap-4">
            {recentPosts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group rounded-lg border border-border bg-card-bg p-4 transition-colors hover:border-accent/30"
              >
                <h3 className="font-medium text-foreground group-hover:text-accent transition-colors">
                  {post.title}
                </h3>
                <p className="mt-1 text-sm text-muted line-clamp-2">
                  {post.description}
                </p>
                <div className="mt-2 flex items-center gap-3 text-xs text-muted">
                  <time dateTime={post.date}>
                    {new Date(post.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </time>
                  <span>·</span>
                  <span>{post.readingTime}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
