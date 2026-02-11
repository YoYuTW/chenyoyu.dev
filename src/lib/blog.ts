import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";

/**
 * Before/After transformation data for blog post cards.
 * Used to present each post as a transformation story.
 */
export interface BeforeAfter {
  summary: string;
  points: string[];
}

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  description: string;
  tags: string[];
  readingTime: string;
  content: string;
  before?: BeforeAfter;
  after?: BeforeAfter;
}

export interface BlogPostMeta {
  slug: string;
  title: string;
  date: string;
  description: string;
  tags: string[];
  readingTime: string;
  before?: BeforeAfter;
  after?: BeforeAfter;
}

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

/**
 * Parse optional before/after frontmatter data.
 * Returns undefined if the data is missing or malformed.
 */
function parseBeforeAfter(
  data: Record<string, unknown>,
  key: "before" | "after"
): BeforeAfter | undefined {
  const raw = data[key];
  if (
    raw == null ||
    typeof raw !== "object" ||
    !("summary" in (raw as object)) ||
    !("points" in (raw as object))
  ) {
    return undefined;
  }

  const obj = raw as { summary: unknown; points: unknown };
  if (typeof obj.summary !== "string" || !Array.isArray(obj.points)) {
    return undefined;
  }

  return {
    summary: obj.summary,
    points: obj.points.filter((p): p is string => typeof p === "string"),
  };
}

/**
 * Get all blog post metadata, sorted by date (newest first).
 */
export function getAllPosts(): BlogPostMeta[] {
  if (!fs.existsSync(BLOG_DIR)) return [];

  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".mdx"));

  const posts = files.map((filename) => {
    const slug = filename.replace(/\.mdx$/, "");
    const filePath = path.join(BLOG_DIR, filename);
    const raw = fs.readFileSync(filePath, "utf-8");
    const { data, content } = matter(raw);
    const stats = readingTime(content);

    return {
      slug,
      title: data.title ?? slug,
      date: data.date ?? "",
      description: data.description ?? "",
      tags: data.tags ?? [],
      readingTime: stats.text,
      before: parseBeforeAfter(data, "before"),
      after: parseBeforeAfter(data, "after"),
    };
  });

  return posts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

/**
 * Get a single blog post by slug, including the raw MDX content.
 */
export function getPostBySlug(slug: string): BlogPost | null {
  const filePath = path.join(BLOG_DIR, `${slug}.mdx`);

  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);
  const stats = readingTime(content);

  return {
    slug,
    title: data.title ?? slug,
    date: data.date ?? "",
    description: data.description ?? "",
    tags: data.tags ?? [],
    readingTime: stats.text,
    content,
    before: parseBeforeAfter(data, "before"),
    after: parseBeforeAfter(data, "after"),
  };
}
