import Link from "next/link";
import { db } from "@/db";
import { posts } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { Calendar } from "lucide-react";

interface RecentPostsProps {
  limit?: number;
  locale?: string;
}

export default async function RecentPosts({ limit = 5, locale = "en" }: RecentPostsProps) {
  const recentPosts = await db()
    .select({
      id: posts.id,
      slug: posts.slug,
      title: posts.title,
      createdAt: posts.created_at,
    })
    .from(posts)
    .where(eq(posts.status, "published"))
    .orderBy(desc(posts.created_at))
    .limit(limit);

  if (recentPosts.length === 0) {
    return null;
  }

  return (
    <div className="rounded-xl border bg-card p-4 shadow-sm">
      <h3 className="font-semibold mb-3 flex items-center gap-2">
        <Calendar className="h-4 w-4" />
        Recent Blog Posts
      </h3>
      <ul className="space-y-3">
        {recentPosts.map((post) => (
          <li key={post.id}>
            <Link
              href={`/posts/${post.slug}`}
              className="text-sm hover:underline hover:text-primary block"
            >
              {post.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}