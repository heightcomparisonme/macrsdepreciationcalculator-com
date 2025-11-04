import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { TOOLS_CONFIG } from "@/lib/tools-config";
import ToolsPageClient from "@/components/blocks/tools/ToolsPageClient";
import { getBaseUrl } from "@/lib/url";
import { defaultLocale } from "@/i18n/locale";
import { createSocialMetadata } from "@/lib/metadata";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({
    locale,
    namespace: "pages.tools"
  });
  const baseUrl = getBaseUrl();
  const localePrefix = locale === defaultLocale ? "" : `/${locale}`;
  const canonicalUrl = `${baseUrl}${localePrefix}/tools`;
  const social = createSocialMetadata({
    title: t("title"),
    description: t("subtitle"),
    locale,
    path: `${localePrefix}/tools`,
  });

  return {
    title: t("title"),
    description: t("subtitle"),
    alternates: {
      canonical: canonicalUrl,
    },
    ...social,
  };
}

interface Tool {
  title: string;
  description: string;
  url: string;
  icon: string;
  color: string;
  category: string;
  tags: string[];
}

export default async function ToolsPage({ params }: Props) {
  const { locale } = await params;

  // Dynamically load all tools from config and translations
  const allTools: Tool[] = await Promise.all(
    TOOLS_CONFIG.map(async (config) => {
      // Fallback values
      const fallbackTitle = config.slug.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase());
      const fallbackDescription = `Discover ${config.slug}`;

      let title = fallbackTitle;
      let description = fallbackDescription;

      try {
        const t = await getTranslations({
          locale,
          namespace: `tools.${config.slug}`,
        });

        // Use translationKey if provided (nested structure), otherwise flat structure
        const titleKey = config.translationKey
          ? `${config.translationKey}.metadata.title`
          : "metadata.title";

        const descriptionKey = config.translationKey
          ? `${config.translationKey}.metadata.description`
          : "metadata.description";

        // Try to get translations
        try {
          title = t(titleKey);
        } catch (e) {
          console.warn(`Missing title for tool ${config.slug} in locale ${locale}`);
        }

        try {
          description = t(descriptionKey);
        } catch (e) {
          console.warn(`Missing description for tool ${config.slug} in locale ${locale}`);
        }
      } catch (error) {
        // Namespace not found - use fallback
        console.warn(`Missing translation namespace for tool: ${config.slug} in locale ${locale}`);
      }

      return {
        title,
        description,
        url: `/tools/${config.slug}`,
        icon: config.icon,
        color: config.color,
        category: config.category,
        tags: config.tags,
      };
    })
  );

  // Trending tools for sidebar - dynamically generated from available tools
  // Uses the first 5 tools from TOOLS_CONFIG, or all if less than 5
  const trendingTools = allTools.slice(0, 5).map((tool, index) => ({
    title: tool.title,
    url: tool.url,
    icon: tool.icon,
    usageCount: 10000 - (index * 1000), // Simulated usage count (descending)
  }));

  return (
    <ToolsPageClient
      allTools={allTools}
      trendingTools={trendingTools}
    />
  );
}
