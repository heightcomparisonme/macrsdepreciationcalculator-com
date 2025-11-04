import Blog from "@/components/blocks/blog";
import { BlogItem, Blog as BlogType } from "@/types/blocks/blog";
import { getPostsByLocale, getPostsByLocaleAndCategory } from "@/models/post";
import {
  CategoryStatus,
  getCategories,
  findCategoryByName,
} from "@/models/category";
import { getTranslations } from "next-intl/server";
import { getBaseUrl } from "@/lib/url";
import { defaultLocale } from "@/i18n/locale";
import { createSocialMetadata } from "@/lib/metadata";
import { Category } from "@/types/category";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations();

  const baseUrl = getBaseUrl();
  const localePrefix = locale === defaultLocale ? "" : `/${locale}`;
  const canonicalUrl = `${baseUrl}${localePrefix}/posts`;
  const social = createSocialMetadata({
    title: t("blog.title"),
    description: t("blog.description"),
    locale,
    path: `${localePrefix}/posts`,
    type: "article",
  });

  return {
    title: t("blog.title"),
    description: t("blog.description"),
    alternates: {
      canonical: canonicalUrl,
    },
    ...social,
  };
}

export default async function PostsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ category?: string }>;
}) {
  const { locale } = await params;
  const { category } = await searchParams;
  const t = await getTranslations();

  const categories = await getCategories({
    status: CategoryStatus.Online,
    page: 1,
    limit: 200,
  });

  let posts;
  if (category) {
    const matched = await findCategoryByName(category);
    posts = matched
      ? await getPostsByLocaleAndCategory(locale, matched.uuid!)
      : [];
  } else {
    posts = await getPostsByLocale(locale);
  }

  const blog: BlogType = {
    title: t("blog.title"),
    description: t("blog.description"),
    items: posts as unknown as BlogItem[],
    read_more_text: t("blog.read_more_text"),
  };

  return (
    <div className="container py-6 md:py-8">
      <Blog
        blog={blog}
        categories={categories as unknown as Category[]}
        category={category as unknown as string}
      />
    </div>
  );
}
