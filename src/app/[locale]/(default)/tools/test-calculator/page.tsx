import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  ToolPageLayout,
  type FeatureItem,
  type Features2Item,
} from "@/components/blocks/tools/ToolPageLayout";
import TestCalculator from "@/components/Tools/testCalculator";
import { getToolConfig } from "@/lib/tools-config";
import {
  generateToolSchema,
  generateToolBreadcrumbSchema,
  schemaToJsonLd,
} from "@/lib/structured-data";
import { getBaseUrl } from "@/lib/url";
import { defaultLocale } from "@/i18n/locale";
import { createSocialMetadata } from "@/lib/metadata";

type Props = {
  params: Promise<{ locale: string }>;
};

const TOOL_SLUG = "test-calculator";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const localePrefix = locale === defaultLocale ? "" : `/${locale}`;
  const path = `${localePrefix}/tools/${TOOL_SLUG}`;

  // Verify tool exists
  const toolConfig = getToolConfig(TOOL_SLUG);
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

  let title = "Test Calculator";
  let description =
    "A simple test calculator to verify the dynamic tool creation workflow.";

  try {
    const t = await getTranslations({
      locale,
      namespace: "tools",
    });

    const titleKey = toolConfig.translationKey
      ? `${toolConfig.translationKey}.metadata.title`
      : `${TOOL_SLUG}.metadata.title`;

    const descriptionKey = toolConfig.translationKey
      ? `${toolConfig.translationKey}.metadata.description`
      : `${TOOL_SLUG}.metadata.description`;

    title = t(titleKey);
    description = t(descriptionKey);
  } catch (error) {
    console.warn(`Missing translations for tool: ${TOOL_SLUG}`, error);
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

export default async function TestCalculatorPage({ params }: Props) {
  const { locale } = await params;

  // Verify tool exists
  const toolConfig = getToolConfig(TOOL_SLUG);
  if (!toolConfig) {
    notFound();
  }

  // Get translations for structured data
  const baseUrl = getBaseUrl();

  // Fallback values
  const fallbackTitle = "Test Calculator";
  const fallbackDescription = "A simple test calculator to verify the dynamic tool creation workflow.";

  let title = fallbackTitle;
  let description = fallbackDescription;

  // Safely get translations
  const titleKey = toolConfig.translationKey
    ? `${toolConfig.translationKey}.metadata.title`
    : `${TOOL_SLUG}.metadata.title`;

  const descriptionKey = toolConfig.translationKey
    ? `${toolConfig.translationKey}.metadata.description`
    : `${TOOL_SLUG}.metadata.description`;

  try {
    const t = await getTranslations({
      locale,
      namespace: "tools",
    });

    // Try to get title
    try {
      title = t(titleKey);
    } catch (e) {
      console.warn(`Missing title translation for tool ${TOOL_SLUG} in locale ${locale}`);
    }

    // Try to get description
    try {
      description = t(descriptionKey);
    } catch (e) {
      console.warn(`Missing description translation for tool ${TOOL_SLUG} in locale ${locale}`);
    }
  } catch (error) {
    console.warn(`Could not load translations for tool: ${TOOL_SLUG}`, error);
  }

  // Generate structured data
  const toolSchema = generateToolSchema({
    toolSlug: TOOL_SLUG,
    toolConfig,
    title,
    description,
    locale,
    baseUrl,
  });

  const breadcrumbSchema = generateToolBreadcrumbSchema({
    toolSlug: TOOL_SLUG,
    title,
    locale,
    baseUrl,
  });

  // Features configuration for this tool
  const features: FeatureItem[] = [
    {
      icon: "calculator",
      key: "simple",
      color: "text-blue-400",
    },
    {
      icon: "zap",
      key: "fast",
      color: "text-yellow-400",
    },
    {
      icon: "check",
      key: "accurate",
      color: "text-green-400",
    },
    {
      icon: "globe",
      key: "multilingual",
      color: "text-purple-400",
    },
  ];

  const features2: Features2Item[] = [
    {
      icon: "sparkles",
      key: "easy",
      beforeImage: "/imgs/features/5.png",
      afterImage: "/imgs/features/6.png",
    },
    {
      icon: "target",
      key: "precise",
      beforeImage: "/imgs/features/3.png",
      afterImage: "/imgs/features/3-after.png",
    },
    {
      icon: "shield",
      key: "reliable",
      beforeImage: "/imgs/features/2.png",
      afterImage: "/imgs/features/2-after.png",
    },
  ];

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
        toolKey={toolConfig.translationKey || TOOL_SLUG}
        calculator={<TestCalculator />}
        features={features}
        features2={features2}
        containerClassName="bg-gradient-to-b from-[#0a0a1a] via-[#1a1a2e] to-[#16213e]"
        calculatorWrapperClassName="max-w-6xl"
      />
    </>
  );
}
