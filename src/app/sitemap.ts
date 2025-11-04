import { MetadataRoute } from "next";

import { defaultLocale, locales } from "@/i18n/locale";
import { getPostsByLocale } from "@/models/post";
import { getAllToolSlugs } from "@/lib/tools-config";
import { getBaseUrl } from "@/lib/url";

const baseUrl = getBaseUrl();

const localizedStaticPaths = [
  "",
  "pricing",
  "posts",
  "showcase",
  "ai-workstation",
  "comingsoon",
  "discord",
  "glossary",
  "weather",
  "docs",
  "tools",
];

const legalPaths = ["privacy-policy", "terms-of-service"];

const MAX_POSTS = 500;

const now = new Date();

function buildUrl(locale: string, path: string) {
  const cleanPath = path.replace(/^\/+|\/+$/g, "");
  const localePrefix = locale === defaultLocale ? "" : locale;
  const joined = [localePrefix, cleanPath].filter(Boolean).join("/");
  return joined ? `${baseUrl}/${joined}` : baseUrl;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];

  // Get all tool slugs dynamically
  const toolSlugs = getAllToolSlugs();

  for (const locale of locales) {
    // Add static paths
    for (const path of localizedStaticPaths) {
      const url = buildUrl(locale, path);
      if (entries.some((entry) => entry.url === url)) {
        continue;
      }

      entries.push({
        url,
        lastModified: now,
        changeFrequency: path === "" ? "daily" : "weekly",
        priority: path === "" ? 1 : 0.7,
      });
    }

    // Add dynamic tool pages
    for (const slug of toolSlugs) {
      const url = buildUrl(locale, `tools/${slug}`);
      if (entries.some((entry) => entry.url === url)) {
        continue;
      }

      entries.push({
        url,
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.7,
      });
    }

    const posts = await getPostsByLocale(locale, 1, MAX_POSTS);

    for (const post of posts ?? []) {
      if (!post.slug) {
        continue;
      }

      entries.push({
        url: buildUrl(locale, `posts/${post.slug}`),
        lastModified: post.updated_at ?? post.created_at ?? now,
        changeFrequency: "monthly",
        priority: 0.6,
      });
    }
  }

  for (const path of legalPaths) {
    const url = `${baseUrl}/${path}`;
    if (entries.some((entry) => entry.url === url)) {
      continue;
    }

    entries.push({
      url,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.4,
    });
  }

  return entries;
}
