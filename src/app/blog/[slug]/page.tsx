import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { getAllPosts, getPostBySlug } from "@/lib/blog";
import { BlogVideoHero } from "@/components/BlogVideoHero";

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
    <article className="mx-auto max-w-2xl px-6 py-16">
      {/* Header */}
      <header className="mb-10">
        <Link
          href="/blog"
          className="text-sm text-muted hover:text-foreground transition-colors mb-6 inline-block"
        >
          ← Back to blog
        </Link>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl leading-tight">
          {post.title}
        </h1>
        <div className="mt-3 flex items-center gap-3 text-sm text-muted">
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
          <div className="mt-3 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-border px-2.5 py-0.5 text-xs text-muted"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </header>

      {/* MDX Content */}
      <div className="prose">{content}</div>

      {/* Footer */}
      <footer className="mt-16 border-t border-border pt-8">
        <Link
          href="/blog"
          className="text-sm text-accent hover:text-accent-hover transition-colors"
        >
          ← Back to all posts
        </Link>
      </footer>
    </article>
  );
}
