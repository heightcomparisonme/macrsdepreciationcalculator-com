# Tool Structure - Visual Quick Reference

## Directory Structure Map

```
project-root/
├── src/
│   ├── components/
│   │   └── Tools/
│   │       ├── testCalculator/                    ← PascalCase component folder
│   │       │   └── index.tsx                      ← Client component
│   │       └── MyAwesomeTool/                     ← New tool components go here
│   │
│   ├── app/
│   │   └── [locale]/
│   │       └── (default)/
│   │           └── tools/
│   │               ├── page.tsx                   ← Tools listing page
│   │               ├── test-calculator/           ← kebab-case folder per tool
│   │               │   └── page.tsx              ← Custom tool page (optional)
│   │               ├── my-awesome-tool/          ← New tool routes go here
│   │               │   └── page.tsx              ← Optional custom page
│   │               └── [slug]/
│   │                   └── page.tsx              ← Fallback dynamic route
│   │
│   ├── i18n/
│   │   ├── messages/
│   │   │   ├── en.json                           ← Global English translations
│   │   │   ├── de.json                           ← Global German translations
│   │   │   └── es.json                           ← Global Spanish translations
│   │   └── pages/
│   │       └── tools/
│   │           ├── en.json                       ← Tools page translations
│   │           ├── de.json
│   │           ├── es.json
│   │           ├── test-calculator/              ← Tool-specific translations
│   │           │   ├── en.json
│   │           │   ├── de.json
│   │           │   └── es.json
│   │           └── my-awesome-tool/              ← New tool translations here
│   │               ├── en.json
│   │               ├── de.json
│   │               └── es.json
│   │
│   └── lib/
│       └── tools-config.ts                       ← Edit here to customize tools
│
└── TOOL_STRUCTURE_PATTERNS.md                    ← Full reference (this file)
```

---

## Naming Convention Quick Reference

### For tool named "my-awesome-tool"

| File/Folder | Naming | Example |
|------------|--------|---------|
| Component folder | **PascalCase** | `MyAwesomeTool` |
| Route folder | **kebab-case** | `my-awesome-tool` |
| Translation folder | **kebab-case** | `my-awesome-tool` |
| Translation key | **dot notation** | `tools.my-awesome-tool.metadata.title` |
| Config slug | **kebab-case** | `"my-awesome-tool"` |

---

## Creating a New Tool - Step by Step

### Step 1️⃣: Component (5 min)

**Create**: `src/components/Tools/MyAwesomeTool/index.tsx`

```typescript
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function MyAwesomeToolComponent() {
  const [input, setInput] = useState("");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <Card>
        <CardHeader>
          <CardTitle>My Awesome Tool</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Your tool UI here */}
          <Button onClick={() => alert("Tool works!")}>Click me</Button>
        </CardContent>
      </Card>
    </div>
  );
}
```

---

### Step 2️⃣: Translations (5 min)

**Create**: `src/i18n/pages/tools/my-awesome-tool/en.json`

```json
{
  "metadata": {
    "title": "My Awesome Tool - Description",
    "description": "A brief description of what this tool does"
  },
  "title": "My Awesome Tool",
  "subtitle": "Short subtitle here",
  "hero": {
    "badge": "Tool Badge",
    "title": "My Awesome Tool",
    "subtitle": "Complete your task faster",
    "description": "This tool helps you achieve amazing things.",
    "cta_primary": "Get Started",
    "cta_secondary": "Learn More"
  },
  "features": {
    "title": "Key Features",
    "simple": {
      "title": "Simple to use",
      "description": "Clean interface anyone can use"
    },
    "fast": {
      "title": "Super fast",
      "description": "Instant results"
    }
  }
}
```

**Create**: `src/i18n/pages/tools/my-awesome-tool/de.json` (German translation)

```json
{
  "metadata": {
    "title": "Mein Großartiges Tool - Beschreibung",
    "description": "Eine kurze Beschreibung, was dieses Tool tut"
  },
  "title": "Mein Großartiges Tool",
  // ... rest of German translations
}
```

**Create**: `src/i18n/pages/tools/my-awesome-tool/es.json` (Spanish translation)

```json
{
  "metadata": {
    "title": "Mi Herramienta Increíble - Descripción",
    "description": "Una breve descripción de lo que hace esta herramienta"
  },
  "title": "Mi Herramienta Increíble",
  // ... rest of Spanish translations
}
```

---

### Step 3️⃣: Configuration (2 min)

**Edit**: `src/lib/tools-config.ts`

Add to `TOOL_OVERRIDES` object:

```typescript
const TOOL_OVERRIDES: Record<string, Partial<Omit<ToolConfig, 'slug'>>> = {
  "test-calculator": {
    icon: "Calculator",
    color: "bg-gradient-to-br from-blue-500 to-blue-600",
    category: "Tools",
    tags: ["calculator", "test", "addition", "math"]
  },
  // 👇 ADD YOUR TOOL HERE
  "my-awesome-tool": {
    icon: "Sparkles",                              // Lucide icon name
    color: "bg-gradient-to-br from-purple-500 to-purple-600",
    category: "AI Tools",
    tags: ["awesome", "creative", "ai"]
  }
};
```

**Icon Options** (Lucide icons):
- `Calculator`, `Sparkles`, `Zap`, `Globe`, `Target`, `Shield`, `Users`, `Chart`, `Lock`, `Unlock`, `Eye`, `EyeOff`, `Mail`, `Phone`, `Code`, `GitBranch`, `Database`, `Cloud`, `Settings`, `Menu`, `Bell`, `Search`, `Download`, `Upload`, `Share`, `Copy`, `Edit`, `Trash2`, `Plus`, `Minus`, `Check`, `X`, `ChevronRight`, `ChevronLeft`, `MoreVertical`, `MoreHorizontal`

**Color Patterns** (Tailwind gradients):
- Blue: `bg-gradient-to-br from-blue-500 to-blue-600`
- Purple: `bg-gradient-to-br from-purple-500 to-purple-600`
- Pink: `bg-gradient-to-br from-pink-500 to-pink-600`
- Green: `bg-gradient-to-br from-green-500 to-green-600`
- Red: `bg-gradient-to-br from-red-500 to-red-600`
- Indigo: `bg-gradient-to-br from-indigo-500 to-indigo-600`
- Cyan: `bg-gradient-to-br from-cyan-500 to-cyan-600`
- Amber: `bg-gradient-to-br from-amber-500 to-amber-600`

---

### Step 4️⃣: Test (Done! 🎉)

**That's it!** The tool is now:
- ✅ Auto-discovered by the system
- ✅ Listed on `/tools` page
- ✅ Accessible at `/tools/my-awesome-tool`
- ✅ Available in all locales (en, de, es)
- ✅ Using default dynamic route layout

---

## Optional: Custom Tool Page

If you want full customization beyond the default:

**Create**: `src/app/[locale]/(default)/tools/my-awesome-tool/page.tsx`

```typescript
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import {
  ToolPageLayout,
  type FeatureItem,
  type Features2Item,
} from "@/components/blocks/tools/ToolPageLayout";
import MyAwesomeTool from "@/components/Tools/MyAwesomeTool";
import { getToolConfig } from "@/lib/tools-config";

type Props = {
  params: Promise<{ locale: string }>;
};

const TOOL_SLUG = "my-awesome-tool";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({
    locale,
    namespace: "tools",
  });

  const title = t(`${TOOL_SLUG}.metadata.title`);
  const description = t(`${TOOL_SLUG}.metadata.description`);

  return {
    title,
    description,
  };
}

export default async function MyAwesomeToolPage({ params }: Props) {
  const { locale } = await params;
  const toolConfig = getToolConfig(TOOL_SLUG);

  if (!toolConfig) {
    notFound();
  }

  const features: FeatureItem[] = [
    { icon: "sparkles", key: "feature1", color: "text-purple-400" },
    { icon: "zap", key: "feature2", color: "text-yellow-400" },
  ];

  const features2: Features2Item[] = [
    {
      icon: "sparkles",
      key: "showcase1",
      beforeImage: "/imgs/features/1.png",
      afterImage: "/imgs/features/2.png",
    },
  ];

  return (
    <ToolPageLayout
      toolKey={TOOL_SLUG}
      calculator={<MyAwesomeTool />}
      features={features}
      features2={features2}
      containerClassName="bg-gradient-to-b from-[#0a0a1a] via-[#1a1a2e] to-[#16213e]"
      calculatorWrapperClassName="max-w-6xl"
    />
  );
}
```

---

## Translation File Structure Map

```
en.json (or de.json, es.json)
├── metadata
│   ├── title                    (for SEO, browser tab)
│   └── description              (for SEO meta tags)
├── title                        (main heading)
├── subtitle                     (secondary heading)
├── input
│   ├── title
│   ├── description
│   ├── field1
│   └── field2
├── button
│   └── calculate
├── result
│   ├── title
│   └── description
├── hero
│   ├── badge
│   ├── title
│   ├── subtitle
│   ├── description
│   ├── cta_primary
│   └── cta_secondary
├── features
│   ├── title
│   ├── description
│   ├── simple
│   │   ├── title
│   │   └── description
│   └── fast
│       ├── title
│       └── description
├── showcase
│   ├── badge
│   ├── title
│   ├── description
│   ├── image_url
│   ├── image_alt
│   └── benefits []
├── features2
│   ├── label
│   ├── title
│   ├── description
│   └── items
│       ├── easy
│       ├── precise
│       └── reliable
├── testimonials
│   ├── title
│   ├── description
│   ├── stats
│   └── items []
├── faq
│   ├── title
│   ├── description
│   └── items []
└── cta
    ├── title
    ├── description
    ├── primary_button
    ├── secondary_button
    ├── primary_link
    └── secondary_link
```

---

## Config Structure Reference

```typescript
interface ToolConfig {
  slug: string;              // "my-awesome-tool" (kebab-case)
  icon: string;              // "Sparkles" (Lucide icon)
  color: string;             // "bg-gradient-to-br from-purple-500 to-purple-600"
  category: string;          // "AI Tools" or "Tools"
  tags: string[];            // ["ai", "creative", "awesome"]
  translationKey?: string;   // Optional: for nested translations
}
```

---

## Translation Access Patterns

### In Page Component (Server Component)
```typescript
const t = await getTranslations({
  locale,
  namespace: "tools"
});

// Access translation keys
const title = t("my-awesome-tool.metadata.title");
const description = t("my-awesome-tool.features.simple.title");
```

### In Client Component
```typescript
import { useTranslations } from "next-intl";

export default function MyComponent() {
  const t = useTranslations("tools.my-awesome-tool");
  
  // Keys are relative to namespace
  return <h1>{t("title")}</h1>;
}
```

---

## File Checklist for New Tool

```
☐ Component
  ☐ src/components/Tools/MyAwesomeTool/index.tsx

☐ Translations (REQUIRED - at least English)
  ☐ src/i18n/pages/tools/my-awesome-tool/en.json
  ☐ src/i18n/pages/tools/my-awesome-tool/de.json
  ☐ src/i18n/pages/tools/my-awesome-tool/es.json

☐ Configuration
  ☐ Add to TOOL_OVERRIDES in src/lib/tools-config.ts

☐ Optional: Custom Page
  ☐ src/app/[locale]/(default)/tools/my-awesome-tool/page.tsx

☐ Test
  ☐ Check /tools page shows your tool
  ☐ Click tool card to verify routing
  ☐ Check translations load correctly
```

---

## Common Patterns by Component

### Card-Based Tool
```typescript
<Card>
  <CardHeader>
    <CardTitle>{title}</CardTitle>
    <CardDescription>{description}</CardDescription>
  </CardHeader>
  <CardContent>
    {/* Tool content */}
  </CardContent>
</Card>
```

### Form-Based Tool
```typescript
<form onSubmit={handleSubmit}>
  <Label htmlFor="input">Input Label</Label>
  <Input id="input" value={input} onChange={e => setInput(e.target.value)} />
  <Button type="submit">Submit</Button>
</form>
```

### Grid-Based Results
```typescript
<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Column 1</TableHead>
      <TableHead>Column 2</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {results.map(result => (
      <TableRow key={result.id}>
        <TableCell>{result.value1}</TableCell>
        <TableCell>{result.value2}</TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>
```

---

## Current Tools Example

### test-calculator
- **Route**: `/tools/test-calculator`
- **Component**: `src/components/Tools/testCalculator/index.tsx`
- **Translations**: `src/i18n/pages/tools/test-calculator/{en,de,es}.json`
- **Config**: 
  ```typescript
  "test-calculator": {
    icon: "Calculator",
    color: "bg-gradient-to-br from-blue-500 to-blue-600",
    category: "Tools",
    tags: ["calculator", "test", "addition", "math"]
  }
  ```
- **Features**: Full custom page with structured data, features, testimonials, FAQ

---

## Troubleshooting

### Tool Not Appearing
1. Check folder name is **kebab-case** in `src/app/[locale]/(default)/tools/`
2. Verify component folder exists in `src/components/Tools/` with **PascalCase**
3. Check `tools-config.ts` has entry in `TOOL_OVERRIDES`
4. Run build: `pnpm build` (rebuilds tool discovery)

### Translations Missing
1. Ensure `.json` files exist in `src/i18n/pages/tools/[slug]/`
2. Check JSON syntax is valid (use JSON linter)
3. Verify file names match locale codes: `en.json`, `de.json`, `es.json`
4. Check console for warnings about missing translations

### Icon Not Showing
1. Use exact Lucide icon name in `tools-config.ts`
2. Check icon name case (usually **PascalCase**)
3. Icons list: https://lucide.dev/

### Styling Issues
1. Use Tailwind utility classes only
2. Ensure component uses `"use client"` directive
3. Import UI components from `@/components/ui/`
4. Use built-in gradient patterns for colors

---

## Quick Links

- **Full Reference**: `TOOL_STRUCTURE_PATTERNS.md`
- **Lucide Icons**: https://lucide.dev/
- **Tailwind Colors**: https://tailwindcss.com/docs/customizing-colors
- **Next.js 16 Docs**: https://nextjs.org/docs
- **next-intl Docs**: https://next-intl-docs.vercel.app/
