import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  ToolPageLayout,
  type FeatureItem,
  type Features2Item,
} from "@/components/blocks/tools/ToolPageLayout";
import ToolPlaceholder from "@/components/Tools/ToolPlaceholder";
import { getAllToolSlugs, getToolConfig } from "@/lib/tools-config";
import { type ReactElement } from "react";
import {
  generateToolSchema,
  generateToolBreadcrumbSchema,
  schemaToJsonLd,
} from "@/lib/structured-data";
import { getBaseUrl } from "@/lib/url";
import { defaultLocale } from "@/i18n/locale";
import { createSocialMetadata } from "@/lib/metadata";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateStaticParams() {
  const slugs = getAllToolSlugs();

  // Generate params for all tool slugs
  return slugs.map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const localePrefix = locale === defaultLocale ? "" : `/${locale}`;
  const path = `${localePrefix}/tools/${slug}`;

  // Verify tool exists
  const toolConfig = getToolConfig(slug);
  if (!toolConfig) {
    const social = createSocialMetadata({
      title: "Tool Not Found",
      description: "The requested tool was not found.",
      locale,
      path,
    });

    return {
      title: "Tool Not Found",
      description: "The requested tool was not found.",
      ...social,
    };
  }

  let title = slug.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
  let description = `Discover ${slug.replace(/-/g, " ")} with our advanced tools.`;

  try {
    const t = await getTranslations({
      locale,
      namespace: "tools",
    });

    // Try nested structure first (e.g., tools.example.metadata.title)
    // If translationKey exists, use it, otherwise use slug directly
    const titleKey = toolConfig.translationKey
      ? `${toolConfig.translationKey}.metadata.title`
      : `${slug}.metadata.title`;

    const descriptionKey = toolConfig.translationKey
      ? `${toolConfig.translationKey}.metadata.description`
      : `${slug}.metadata.description`;

    title = t(titleKey);
    description = t(descriptionKey);
  } catch (error) {
    console.warn(`Missing translations for tool: ${slug}`, error);
  }

  const social = createSocialMetadata({
    title,
    description,
    locale,
    path,
  });

  return {
    title,
    description,
    ...social,
  };
}

export default async function ToolPage({ params }: Props) {
  const { locale, slug } = await params;

  // Verify tool exists
  const toolConfig = getToolConfig(slug);
  if (!toolConfig) {
    notFound();
  }

  // TypeScript assertion: toolConfig is guaranteed to be non-null after notFound() check
  // (notFound() throws and never returns, but TypeScript doesn't understand this)
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const config = toolConfig!;

  // Get translations for structured data
  const baseUrl = getBaseUrl();

  // Fallback values
  const fallbackTitle = slug.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase());
  const fallbackDescription = `Discover ${slug.replace(/-/g, " ")} with our advanced tools.`;

  let title = fallbackTitle;
  let description = fallbackDescription;

  // Safely get translations
  const titleKey = config.translationKey
    ? `${config.translationKey}.metadata.title`
    : `${slug}.metadata.title`;

  const descriptionKey = config.translationKey
    ? `${config.translationKey}.metadata.description`
    : `${slug}.metadata.description`;

  try {
    const t = await getTranslations({
      locale,
      namespace: "tools",
    });

    // Try to get title
    try {
      title = t(titleKey);
    } catch (e) {
      console.warn(`Missing title translation for tool ${slug} in locale ${locale}`);
    }

    // Try to get description
    try {
      description = t(descriptionKey);
    } catch (e) {
      console.warn(`Missing description translation for tool ${slug} in locale ${locale}`);
    }
  } catch (error) {
    console.warn(`Could not load translations for tool: ${slug}`, error);
  }

  // Generate structured data
  const toolSchema = generateToolSchema({
    toolSlug: slug,
    toolConfig: config,
    title,
    description,
    locale,
    baseUrl,
  });

  const breadcrumbSchema = generateToolBreadcrumbSchema({
    toolSlug: slug,
    title,
    locale,
    baseUrl,
  });

  // Default features configuration
  const features: FeatureItem[] = [
    {
      icon: "sparkles",
      key: "insights",
      color: "text-purple-400",
    },
    {
      icon: "users",
      key: "personalization",
      color: "text-emerald-400",
    },
    {
      icon: "target",
      key: "recipes",
      color: "text-amber-400",
    },
    {
      icon: "shield",
      key: "credits",
      color: "text-sky-400",
    },
  ];

  const features2: Features2Item[] = [
    {
      icon: "sparkles",
      key: "insights",
      beforeImage: "/imgs/features/5.png",
      afterImage: "/imgs/features/6.png",
    },
    {
      icon: "zap",
      key: "recipes",
      beforeImage: "/imgs/features/3.png",
      afterImage: "/imgs/features/3-after.png",
    },
    {
      icon: "chart",
      key: "workflow",
      beforeImage: "/imgs/features/2.png",
      afterImage: "/imgs/features/2-after.png",
    },
  ];

  // Dynamically load tool component based on slug
  // Map slug to component directory name (e.g., "test-calculator" -> "testCalculator")
  const getToolComponent = async (): Promise<ReactElement> => {
    // Normalize slug to component directory name format (camelCase)
    const componentDir = slug
      .split("-")
      .map((part, index) => 
        index === 0 
          ? part.toLowerCase() 
          : part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()
      )
      .join("");

    try {
      // Try to dynamically import the tool component from the directory
      // Path format: @/components/Tools/{componentDir}/index.tsx
      const toolModule = await import(`@/components/Tools/${componentDir}`);
      const ToolComponent = toolModule.default;

      if (ToolComponent && typeof ToolComponent === "function") {
        return <ToolComponent />;
      }
    } catch (error) {
      // Component doesn't exist, fall back to placeholder
      // This is expected for tools that don't have custom components yet
    }

    // Fall back to placeholder if component doesn't exist
    return <ToolPlaceholder variant="gradient" />;
  };

  const calculatorComponent = await getToolComponent();

  return (
    <>
      {/* Schema.org structured data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: schemaToJsonLd(toolSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: schemaToJsonLd(breadcrumbSchema) }}
      />

      <ToolPageLayout
        toolKey={config.translationKey || slug}
        calculator={calculatorComponent}
        features={features}
        features2={features2}
        containerClassName="bg-gradient-to-b from-[#0a0a1a] via-[#1a1a2e] to-[#16213e]"
        calculatorWrapperClassName="max-w-6xl"
      />
    </>
  );
}
