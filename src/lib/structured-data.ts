import type { ToolConfig } from "./tools-config";

/**
 * Schema.org structured data types for SEO
 */

interface WebApplicationSchema {
  "@context": "https://schema.org";
  "@type": "WebApplication";
  name: string;
  description: string;
  url: string;
  applicationCategory: string;
  operatingSystem: string;
  offers?: {
    "@type": "Offer";
    price: string;
    priceCurrency: string;
  };
  provider?: {
    "@type": "Organization";
    name: string;
    url: string;
  };
  aggregateRating?: {
    "@type": "AggregateRating";
    ratingValue: string;
    ratingCount: string;
    bestRating: string;
  };
}

interface BreadcrumbListSchema {
  "@context": "https://schema.org";
  "@type": "BreadcrumbList";
  itemListElement: Array<{
    "@type": "ListItem";
    position: number;
    name: string;
    item: string;
  }>;
}

/**
 * Generate schema.org structured data for a tool page
 */
export function generateToolSchema({
  toolSlug,
  toolConfig,
  title,
  description,
  locale,
  baseUrl,
}: {
  toolSlug: string;
  toolConfig: ToolConfig;
  title: string;
  description: string;
  locale: string;
  baseUrl: string;
}): WebApplicationSchema {
  const toolUrl = `${baseUrl}${locale === "en" ? "" : `/${locale}`}/tools/${toolSlug}`;

  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: title,
    description: description,
    url: toolUrl,
    applicationCategory: mapCategoryToSchema(toolConfig.category),
    operatingSystem: "Web Browser",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    provider: {
      "@type": "Organization",
      name: "Macrs Depreciation Calculator",
      url: baseUrl,
    },
  };
}

/**
 * Generate breadcrumb structured data for a tool page
 */
export function generateToolBreadcrumbSchema({
  toolSlug,
  title,
  locale,
  baseUrl,
}: {
  toolSlug: string;
  title: string;
  locale: string;
  baseUrl: string;
}): BreadcrumbListSchema {
  const localePrefix = locale === "en" ? "" : `/${locale}`;

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: `${baseUrl}${localePrefix}`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Tools",
        item: `${baseUrl}${localePrefix}/tools`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: title,
        item: `${baseUrl}${localePrefix}/tools/${toolSlug}`,
      },
    ],
  };
}

/**
 * Map tool category to schema.org applicationCategory
 */
function mapCategoryToSchema(category: string): string {
  const categoryMap: Record<string, string> = {
    "AI Tools": "UtilityApplication",
    "Tools": "UtilityApplication",
    "Calculators": "UtilityApplication",
    "Productivity": "BusinessApplication",
    "Entertainment": "EntertainmentApplication",
    "Education": "EducationalApplication",
  };

  return categoryMap[category] || "UtilityApplication";
}

/**
 * Convert schema object to JSON-LD script tag
 */
export function schemaToJsonLd(schema: WebApplicationSchema | BreadcrumbListSchema): string {
  return JSON.stringify(schema, null, 0);
}
