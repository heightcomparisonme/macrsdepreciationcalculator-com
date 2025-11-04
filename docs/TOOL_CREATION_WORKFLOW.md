# Tool Creation Workflow - Complete Guide

This document outlines the **verified and validated** workflow for creating new tools in the Mondkalender application. This workflow has been tested with the `test-calculator` tool and is **fully automated** with zero manual registration required.

## 🎯 Overview

The tool creation system uses **automatic discovery** based on file system structure. Simply create the required files in the correct locations, and your tool will automatically:
- ✅ Appear in the navigation dropdown
- ✅ Be included in the sitemap for SEO
- ✅ Have proper metadata and structured data
- ✅ Support multiple languages
- ✅ Be accessible via `/tools/{slug}`

## 📁 File Structure

```
src/
├── components/Tools/
│   └── {toolName}/
│       └── index.tsx                    # Tool component (client-side)
├── app/[locale]/(default)/tools/
│   └── {tool-slug}/
│       └── page.tsx                     # Tool page (server-side)
├── i18n/pages/tools/
│   └── {tool-slug}/
│       ├── en.json                      # English translations
│       ├── de.json                      # German translations
│       └── es.json                      # Spanish translations
└── lib/
    └── tools-config.ts                  # Tool configuration (colors, icons, etc.)
```

## 🚀 Step-by-Step Guide

### Step 1: Create Tool Component

Create a new component in `src/components/Tools/{toolName}/index.tsx`:

```tsx
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

export default function YourTool() {
  const t = useTranslations("tools.your-tool-slug");

  // Your tool logic here

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8">
      {/* Your tool UI */}
    </div>
  );
}
```

**Key Points:**
- Must be a `"use client"` component
- Use `useTranslations("tools.{slug}")` for i18n
- Follow existing UI patterns with Card components
- Use Tailwind CSS for styling

### Step 2: Create Tool Page

Create `src/app/[locale]/(default)/tools/{tool-slug}/page.tsx`:

```tsx
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ToolPageLayout } from "@/components/blocks/tools/ToolPageLayout";
import YourTool from "@/components/Tools/yourTool";
import { getToolConfig } from "@/lib/tools-config";
import {
  generateToolSchema,
  generateToolBreadcrumbSchema,
  schemaToJsonLd,
} from "@/lib/structured-data";

type Props = {
  params: Promise<{ locale: string }>;
};

const TOOL_SLUG = "your-tool-slug";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const toolConfig = getToolConfig(TOOL_SLUG);

  if (!toolConfig) {
    return { title: "Tool Not Found" };
  }

  try {
    const t = await getTranslations({ locale, namespace: "tools" });
    const titleKey = toolConfig.translationKey
      ? `${toolConfig.translationKey}.metadata.title`
      : `${TOOL_SLUG}.metadata.title`;
    const descriptionKey = toolConfig.translationKey
      ? `${toolConfig.translationKey}.metadata.description`
      : `${TOOL_SLUG}.metadata.description`;

    return {
      title: t(titleKey),
      description: t(descriptionKey),
    };
  } catch (error) {
    return {
      title: "Your Tool",
      description: "Tool description",
    };
  }
}

export default async function YourToolPage({ params }: Props) {
  const { locale } = await params;
  const toolConfig = getToolConfig(TOOL_SLUG);

  if (!toolConfig) {
    notFound();
  }

  const baseUrl = process.env.NEXT_PUBLIC_WEB_URL ?? "https://mondkalender.app";

  // Get translations safely
  let title = "Your Tool";
  let description = "Tool description";

  try {
    const t = await getTranslations({ locale, namespace: "tools" });
    const titleKey = toolConfig.translationKey
      ? `${toolConfig.translationKey}.metadata.title`
      : `${TOOL_SLUG}.metadata.title`;
    const descriptionKey = toolConfig.translationKey
      ? `${toolConfig.translationKey}.metadata.description`
      : `${TOOL_SLUG}.metadata.description`;

    try { title = t(titleKey); } catch (e) {}
    try { description = t(descriptionKey); } catch (e) {}
  } catch (error) {}

  // Generate structured data for SEO
  const toolSchema = generateToolSchema({
    toolSlug: TOOL_SLUG,
    toolConfig,
    title,
    description,
    locale,
    baseUrl: baseUrl.replace(/\/+$/, ""),
  });

  const breadcrumbSchema = generateToolBreadcrumbSchema({
    toolSlug: TOOL_SLUG,
    title,
    locale,
    baseUrl: baseUrl.replace(/\/+$/, ""),
  });

  return (
    <>
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
        calculator={<YourTool />}
        features={[/* feature config */]}
        features2={[/* feature config */]}
      />
    </>
  );
}
```

**Key Points:**
- Server component (no "use client")
- Implements `generateMetadata` for SEO
- Generates schema.org structured data
- Safe translation loading with fallbacks
- Uses `ToolPageLayout` wrapper

### Step 3: Add Translations

Create translation files for each locale in `src/i18n/pages/tools/{tool-slug}/`:

**en.json:**
```json
{
  "your-tool-slug": {
    "metadata": {
      "title": "Your Tool - Description",
      "description": "SEO-friendly description of your tool"
    },
    "title": "Your Tool",
    "subtitle": "Tool subtitle",
    "input": {
      "title": "Input Section",
      "description": "Input description"
    },
    "button": {
      "calculate": "Calculate"
    },
    "result": {
      "title": "Result",
      "description": "Result description"
    },
    "info": {
      "title": "About This Tool",
      "description": "Information about the tool"
    }
  }
}
```

Repeat for **de.json** and **es.json** with German and Spanish translations.

### Step 4: Configure Tool in tools-config.ts

Add your tool configuration in `src/lib/tools-config.ts`:

```typescript
const TOOL_OVERRIDES: Record<string, Partial<Omit<ToolConfig, 'slug'>>> = {
  // ... existing tools
  "your-tool-slug": {
    icon: "Calculator",  // Lucide icon name
    color: "bg-gradient-to-br from-blue-500 to-blue-600",  // Tailwind gradient
    category: "Tools",  // or "AI Tools", "Productivity", etc.
    tags: ["calculator", "math", "utility"],
    translationKey: "your-tool-slug"  // Must match folder/file names
  }
};
```

**Available Icons:** Use any Lucide React icon name (Calculator, Sparkles, Target, Zap, etc.)

**Color Patterns:** Use Tailwind gradient classes for visual consistency

## ✨ Automatic Features

Once you create the files above, the system **automatically**:

1. **Discovers the tool** via file system scanning
2. **Generates sitemap entries** for all locales
3. **Adds to navigation dropdown** with proper icon and description
4. **Includes in footer links**
5. **Creates SEO metadata** with translations
6. **Generates schema.org data** (WebApplication + BreadcrumbList)
7. **Routes `/tools/{slug}`** to your tool page

## 🔍 Verification Checklist

After creating a new tool, verify:

- [ ] Directory exists: `src/app/[locale]/(default)/tools/{slug}/`
- [ ] Component exists: `src/components/Tools/{name}/index.tsx`
- [ ] Translations exist: `src/i18n/pages/tools/{slug}/{en,de,es}.json`
- [ ] Config added: `src/lib/tools-config.ts` TOOL_OVERRIDES
- [ ] Clear cache: `rm -rf .next`
- [ ] Restart server: `pnpm dev`
- [ ] Visit: `http://localhost:3000/tools/{slug}`
- [ ] Check navigation: Tool appears in dropdown
- [ ] Check sitemap: Visit `/sitemap.xml`, search for slug

## 🚨 Common Issues

### Issue: Tool not appearing in navigation

**Solution:**
- Verify directory name matches exactly (case-sensitive)
- Check that directory is not a Next.js pattern like `[slug]`
- Restart dev server after creating files

### Issue: Translation errors

**Solution:**
- Ensure `translationKey` in tools-config.ts matches folder name
- Verify JSON structure matches the nested format
- Check that all locales (en/de/es) have translation files

### Issue: Turbopack crash

**Solution:**
```bash
rm -rf .next
pnpm dev
```

## 📝 Example: Test Calculator

See the complete implementation of `test-calculator`:

- Component: `src/components/Tools/testCalculator/index.tsx`
- Page: `src/app/[locale]/(default)/tools/test-calculator/page.tsx`
- Translations: `src/i18n/pages/tools/test-calculator/*.json`
- Config: `src/lib/tools-config.ts` (test-calculator entry)

## 🎨 Naming Conventions

- **Folder names:** Use kebab-case (e.g., `test-calculator`, `moon-phase-tracker`)
- **Component names:** Use PascalCase (e.g., `TestCalculator`, `MoonPhaseTracker`)
- **Translation keys:** Use kebab-case matching folder name
- **Translation namespace:** `tools.{tool-slug}`

## 🌍 Multi-Language Support

All tools must support at minimum:
- **en** - English (required)
- **de** - German (required)
- **es** - Spanish (required)

Add more locales by:
1. Creating `{locale}.json` in translations folder
2. Adding locale to `src/i18n/config.ts`

## 🔒 Important Notes

1. **Do NOT** add tools to hardcoded arrays (navigation, sitemap, etc.)
2. **Do NOT** create folders with brackets `[slug]` - they will be filtered out
3. **Always** provide fallback metadata in case translations are missing
4. **Always** clear `.next` cache after creating new tools
5. **Use** `translationKey` in tools-config.ts for proper namespace resolution

## 📊 SEO Benefits

Each tool automatically gets:
- ✅ Unique meta title and description per locale
- ✅ WebApplication schema.org structured data
- ✅ BreadcrumbList for navigation hierarchy
- ✅ Sitemap entries with proper change frequency
- ✅ Localized URLs (`/en/tools/...`, `/de/tools/...`)

## 🚀 Future Enhancements

Consider creating:
- [ ] CLI scaffold script: `pnpm create-tool {name}`
- [ ] Tool template generator
- [ ] Automated translation using AI
- [ ] Tool usage analytics tracking
- [ ] Featured/trending tool highlighting

---

**Last Updated:** 2025-11-04
**Tested With:** test-calculator (addition calculator)
**Next.js Version:** 16.0.1
**Status:** ✅ Fully Validated
