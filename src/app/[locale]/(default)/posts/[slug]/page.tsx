import { PostStatus, findPostBySlug } from "@/models/post";
import { CategoryStatus, getCategories } from "@/models/category";

import BlogDetail from "@/components/blocks/blog-detail";
import Empty from "@/components/blocks/empty";
import { Post } from "@/types/post";
import { getBaseUrl } from "@/lib/url";
import { defaultLocale } from "@/i18n/locale";
import { createSocialMetadata } from "@/lib/metadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;

  const post = await findPostBySlug(slug, locale);

  const baseUrl = getBaseUrl();
  const localePrefix = locale === defaultLocale ? "" : `/${locale}`;
  const canonicalUrl = `${baseUrl}${localePrefix}/posts/${slug}`;
  const metaTitle = post?.title ?? "Mondkalender Blog";
  const metaDescription =
    post?.description ??
    "Discover moon phase tips, lunar gardening guides, and wellness insights from Mondkalender.";
  const social = createSocialMetadata({
    title: metaTitle,
    description: metaDescription,
    locale,
    path: `${localePrefix}/posts/${slug}`,
    type: "article",
    image: post?.cover_url ?? undefined,
  });

  return {
    title: metaTitle,
    description: metaDescription,
    alternates: {
      canonical: canonicalUrl,
    },
    ...social,
  };
}

export default async function PostDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const post = await findPostBySlug(slug, locale);

  if (!post || post.status !== PostStatus.Online) {
    return <Empty message="Post not found" />;
  }

  const categories = await getCategories({
    status: CategoryStatus.Online,
    page: 1,
    limit: 200,
  });

  const category = categories?.find(
    (category) => category.uuid === post.category_uuid
  );

  return (
    <BlogDetail
      post={post as unknown as Post}
      categories={categories}
      category={category}
    />
  );
}
