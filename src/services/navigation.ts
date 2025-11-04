import { getAllToolSlugs, getToolConfig } from "@/lib/tools-config";
import { getTranslations } from "next-intl/server";

/**
 * Navigation service for dynamically generating menu items
 */

interface NavItem {
  title: string;
  description?: string;
  url: string;
  icon: string;
}

/**
 * Safely get translation with fallback
 */
async function safeGetTranslation(
  locale: string,
  namespace: string,
  key: string,
  fallback: string
): Promise<string> {
  try {
    const t = await getTranslations({ locale, namespace });
    return t(key);
  } catch (error) {
    return fallback;
  }
}

/**
 * Generate dynamic navigation items for tools dropdown
 * Reads from TOOLS_CONFIG and translations to create menu items
 */
export async function generateToolsNavigation(
  locale: string,
  maxItems: number = 10
): Promise<NavItem[]> {
  const toolSlugs = getAllToolSlugs();
  const limitedSlugs = toolSlugs.slice(0, maxItems);

  const navItems: NavItem[] = [];

  for (const slug of limitedSlugs) {
    const toolConfig = getToolConfig(slug);
    if (!toolConfig) continue;

    // Generate fallback values
    const fallbackTitle = slug.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase());
    const fallbackDescription = `Discover ${slug.replace(/-/g, " ")}`;

    // Get title and description keys
    const titleKey = toolConfig.translationKey
      ? `${toolConfig.translationKey}.metadata.title`
      : `${slug}.metadata.title`;

    const descriptionKey = toolConfig.translationKey
      ? `${toolConfig.translationKey}.metadata.description`
      : `${slug}.metadata.description`;

    // Safely get translations with fallback
    const title = await safeGetTranslation(locale, "tools", titleKey, fallbackTitle);
    const description = await safeGetTranslation(locale, "tools", descriptionKey, fallbackDescription);

    navItems.push({
      title,
      description,
      url: `/tools/${slug}`,
      icon: toolConfig.icon,
    });
  }

  return navItems;
}
