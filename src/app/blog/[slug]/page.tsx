import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { getAllPosts, getPostBySlug } from "@/lib/blog";
import { BlogVideoHero } from "@/components/BlogVideoHero";
import { ProblemStatement } from "@/components/blog/ProblemStatement";
import { Pre } from "@/components/ui/CodeBlock";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

/**
 * Custom MDX components available in blog posts.
 * Client components like BlogVideoHero are passed here
 * so they can be used directly in MDX content.
 */
const mdxComponents = {
  BlogVideoHero,
  pre: Pre,
};

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.date,
      tags: post.tags,
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const { content } = await compileMDX({
    source: post.content,
    components: mdxComponents,
    options: {
      mdxOptions: {
        remarkPlugins: [remarkGfm],
      },
    },
  });

  return (
    <article className="mx-auto max-w-5xl px-6 py-16 sm:px-8">
      {/* Header */}
      <header className="mx-auto mb-10 max-w-[65ch]">
        <Link
          href="/blog"
          className="mb-6 inline-block text-sm text-fg-secondary transition-colors hover:text-foreground"
        >
          ← Back to blog
        </Link>
        <h1 className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
          {post.title}
        </h1>
        <div className="mt-3 flex items-center gap-3 text-sm text-fg-secondary">
          <time dateTime={post.date}>
            {new Date(post.date).toLocaleDateString("en-AU", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>
          <span>·</span>
          <span>{post.readingTime}</span>
        </div>
        {post.tags.length > 0 && (
          <ul aria-label="Tags" className="mt-3 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <li
                key={tag}
                className="rounded-full border border-border bg-bg-overlay px-2.5 py-0.5 text-xs text-fg-secondary transition-colors hover:border-accent-muted hover:text-accent"
              >
                {tag}
              </li>
            ))}
          </ul>
        )}
      </header>

      {/* Problem Statement Card — shown for posts with before data */}
      {post.before && (
        <ProblemStatement
          summary={post.before.summary}
          points={post.before.points}
        />
      )}

      {/* MDX Content — constrained to 65ch for optimal reading width */}
      <div className="prose mx-auto">{content}</div>

      {/* Footer */}
      <footer className="mx-auto mt-16 max-w-[65ch] border-t border-border pt-8">
        <Link
          href="/blog"
          className="text-sm text-accent transition-colors hover:text-accent-hover"
        >
          ← Back to all posts
        </Link>
      </footer>
    </article>
  );
}
