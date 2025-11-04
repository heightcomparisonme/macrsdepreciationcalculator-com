# Tool Structure Patterns - Complete Reference

## Overview
This document outlines the complete patterns used for creating tools in this codebase. The system uses **automatic discovery** of tools from the filesystem combined with manual configuration overrides.

---

## 1. Naming Conventions

### Component Files (PascalCase)
- **Location**: `src/components/Tools/[ComponentName]/`
- **Pattern**: PascalCase folder name matching the component name
- **Example**: `src/components/Tools/testCalculator/index.tsx`
- **Rule**: Component folder name = PascalCase version of the tool slug
  - `test-calculator` (slug) → `testCalculator` (component folder)

### Page Route Files (kebab-case)
- **Location**: `src/app/[locale]/(default)/tools/[slug]/`
- **Pattern**: kebab-case folder names for URL segments
- **Example**: `src/app/[locale]/(default)/tools/test-calculator/page.tsx`
- **Rule**: Route folder names must use kebab-case (URL-friendly)

### Translation Files (kebab-case)
- **Location**: `src/i18n/pages/tools/[slug]/`
- **Pattern**: kebab-case folder names matching the route slug
- **Files**: `en.json`, `de.json`, `es.json` (and any other supported locales)
- **Example**: `src/i18n/pages/tools/test-calculator/en.json`

---

## 2. Component Structure Pattern

### Location
```
src/components/Tools/[ComponentName]/
└── index.tsx
```

### Example: testCalculator
**File**: `src/components/Tools/testCalculator/index.tsx`

**Key Characteristics**:
- `"use client"` directive (client component)
- Uses React hooks for state management
- Imports UI components from `@/components/ui/`
- Self-contained tool logic
- No dependency on routing or translations (passed as props if needed)

**Basic Structure**:
```typescript
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// ... other imports

export default function ToolComponent() {
  const [state, setState] = useState("");
  
  const handleCalculation = () => {
    // Tool logic here
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      {/* Tool UI */}
    </div>
  );
}
```

---

## 3. Page Structure Pattern

### Location
```
src/app/[locale]/(default)/tools/[slug]/
└── page.tsx
```

### Example: test-calculator page
**File**: `src/app/[locale]/(default)/tools/test-calculator/page.tsx`

**Key Characteristics**:
- Server component (async)
- Handles metadata generation with `generateMetadata`
- Loads translations dynamically
- Wraps component with `ToolPageLayout`
- Generates structured data (Schema.org) for SEO
- Fallback values for missing translations

**Key Patterns**:

1. **Metadata Generation**:
   ```typescript
   const t = await getTranslations({
     locale,
     namespace: "tools"
   });
   
   const titleKey = toolConfig.translationKey
     ? `${toolConfig.translationKey}.metadata.title`
     : `${TOOL_SLUG}.metadata.title`;
   ```

2. **Translation Namespace**:
   - Uses `namespace: "tools"` in `getTranslations`
   - Falls back to hardcoded values if translations missing

3. **Layout Wrapper**:
   ```typescript
   <ToolPageLayout
     toolKey={toolConfig.translationKey || TOOL_SLUG}
     calculator={<ToolComponent />}
     features={features}
     features2={features2}
     containerClassName="bg-gradient-to-b from-[#0a0a1a] via-[#1a1a2e] to-[#16213e]"
     calculatorWrapperClassName="max-w-6xl"
   />
   ```

4. **Structured Data**:
   ```typescript
   const toolSchema = generateToolSchema({ ... });
   const breadcrumbSchema = generateToolBreadcrumbSchema({ ... });
   
   <script type="application/ld+json" dangerouslySetInnerHTML={{ ... }} />
   ```

---

## 4. Translation File Structure

### Location
```
src/i18n/pages/tools/[slug]/
├── en.json
├── de.json
└── es.json
```

### File Organization

**Two Structures Supported**:

#### A. Flat Structure (Current test-calculator pattern)
```json
{
  "metadata": {
    "title": "Page title for SEO",
    "description": "Page description for SEO"
  },
  "title": "Tool Title",
  "subtitle": "Subtitle",
  "input": { ... },
  "button": { ... },
  "hero": { ... },
  "features": { ... },
  "showcase": { ... },
  "features2": { ... },
  "testimonials": { ... },
  "faq": { ... },
  "cta": { ... }
}
```

**Translation Key Pattern**:
- `tools.test-calculator.metadata.title`
- `tools.test-calculator.title`
- `tools.test-calculator.features.simple.title`

#### B. Nested Structure (Alternative)
If `translationKey` is set in `tools-config.ts`:
```json
{
  "kochen": {
    "metadata": { ... },
    "title": "...",
    // ... rest of content
  }
}
```

**Translation Key Pattern**:
- `tools.kochen.metadata.title`
- `tools.kochen.title`

### Standard Sections in Translation Files

1. **metadata** (required for SEO):
   - `title`: Page title (for browser tab, SEO)
   - `description`: Page description (for SEO meta tags)

2. **hero** section:
   - `badge`, `title`, `subtitle`, `description`
   - `cta_primary`, `cta_secondary` (call-to-action buttons)

3. **features** section:
   - Array or object of feature items
   - Each feature has `icon`, `title`, `description`

4. **features2** section:
   - Before/after slider features
   - Items with titles and descriptions

5. **testimonials** section:
   - User testimonials with ratings
   - Stats section with metrics

6. **faq** section:
   - Frequently asked questions
   - Items with `title` and `description`

7. **cta** section:
   - Call-to-action section
   - Links to related pages

### Example: en.json
```json
{
  "metadata": {
    "title": "Test Calculator - Simple Addition Tool",
    "description": "A simple test calculator to verify the dynamic tool creation workflow."
  },
  "title": "Test Calculator",
  "subtitle": "Simple Addition Calculator for Testing",
  "input": {
    "title": "Input Numbers",
    "description": "Enter two numbers to add together",
    "number1": "First Number",
    "number2": "Second Number"
  },
  "button": {
    "calculate": "Calculate Sum"
  },
  "hero": {
    "badge": "Test Tool",
    "title": "Test Calculator",
    "subtitle": "Simple addition calculator for testing dynamic tool creation",
    "description": "This calculator demonstrates the automated tool discovery system.",
    "cta_primary": "Try Calculator",
    "cta_secondary": "Learn More"
  },
  "features": {
    "title": "Calculator Features",
    "description": "A simple yet effective tool for testing our dynamic tool system",
    "simple": {
      "title": "Simple Interface",
      "description": "Clean and intuitive design that anyone can use"
    },
    "fast": {
      "title": "Lightning Fast",
      "description": "Instant calculation results with no delays"
    }
  }
}
```

---

## 5. Tool Configuration (tools-config.ts)

### Location
`src/lib/tools-config.ts`

### How It Works

1. **Automatic Discovery**:
   - Scans `src/app/[locale]/(default)/tools/` directory
   - Discovers all directories (excludes `[slug]` and other dynamic routes)
   - Maps directory names to tool slugs (kebab-case)

2. **Default Configuration**:
   ```typescript
   const DEFAULT_TOOL_CONFIG: Omit<ToolConfig, 'slug'> = {
     icon: "Sparkles",           // Lucide icon name
     color: "bg-gradient-to-br from-gray-500 to-gray-600",
     category: "Tools",
     tags: []
   };
   ```

3. **Custom Overrides**:
   ```typescript
   const TOOL_OVERRIDES: Record<string, Partial<Omit<ToolConfig, 'slug'>>> = {
     "test-calculator": {
       icon: "Calculator",
       color: "bg-gradient-to-br from-blue-500 to-blue-600",
       category: "Tools",
       tags: ["calculator", "test", "addition", "math"]
     }
   };
   ```

### ToolConfig Interface
```typescript
interface ToolConfig {
  slug: string;                    // kebab-case tool identifier
  icon: string;                    // Lucide icon name
  color: string;                   // Tailwind gradient class
  category: string;                // Tool category for grouping
  tags: string[];                  // Search/filter tags
  translationKey?: string;         // Optional: nested translation key
}
```

### Key Functions
- `discoverTools()`: Scans filesystem for tool directories
- `generateToolsConfig()`: Merges discovered tools with overrides
- `getToolConfig(slug)`: Get config for specific tool
- `getAllToolSlugs()`: Get all registered tool slugs

---

## 6. Translation Request Configuration

### Location
`src/i18n/request.ts`

### How Tools Are Loaded

1. **Tool Discovery Integration**:
   ```typescript
   const toolSlugs = getAllToolSlugs();
   const toolsMapping = toolSlugs.map(slug => ({
     path: `tools/${slug}`,
     key: slug
   }));
   ```

2. **Dynamic Translation Loading**:
   ```typescript
   await Promise.all(
     toolsMapping.map(async ({ path, key }) => {
       const messages = await loadJson(
         () => import(`./pages/${path}/${localeLower}.json`),
         `pages/${path}/${localeLower}.json`
       );
       if (messages) {
         pageTranslations.tools[key] = messages;
       }
     })
   );
   ```

3. **Translation Namespace Structure**:
   - Global messages: `src/i18n/messages/[locale].json`
   - Page messages: `src/i18n/pages/[page]/[locale].json`
   - Tool messages: `src/i18n/pages/tools/[slug]/[locale].json`

4. **Access Pattern in Components**:
   ```typescript
   // In server components
   const t = await getTranslations({
     locale,
     namespace: "tools.test-calculator"
   });
   
   // Or with flat structure
   const t = await getTranslations({
     locale,
     namespace: "tools"
   });
   t("test-calculator.metadata.title");
   ```

---

## 7. Dynamic Routes & Static Generation

### Main Tools Page
**Location**: `src/app/[locale]/(default)/tools/page.tsx`

**Purpose**:
- Lists all available tools
- Uses `TOOLS_CONFIG` to dynamically load all tools
- Fetches translations for each tool's metadata

**Pattern**:
```typescript
const allTools: Tool[] = await Promise.all(
  TOOLS_CONFIG.map(async (config) => {
    // Load translations for each tool
    // Return tool object with title, description, url, etc.
  })
);

return <ToolsPageClient allTools={allTools} trendingTools={trendingTools} />;
```

### Individual Tool Page
**Location**: `src/app/[locale]/(default)/tools/[slug]/page.tsx`

**Purpose**:
- Renders individual tool page
- Handles dynamic routing with `generateStaticParams`
- Validates tool exists via `getToolConfig`

**Pattern**:
```typescript
export async function generateStaticParams() {
  const slugs = getAllToolSlugs();
  return slugs.map((slug) => ({ slug }));
}

// Page renders tool with ToolPageLayout wrapper
// Falls back to placeholder if tool not found
```

### Tool-Specific Page (Optional)
**Location**: `src/app/[locale]/(default)/tools/[tool-slug]/page.tsx`

**Purpose**:
- Custom page for specific tool (e.g., `test-calculator`)
- Can override default layout and behavior
- Uses same translation pattern as dynamic route

---

## 8. Complete File Checklist

To add a new tool named `my-awesome-tool`:

### Step 1: Component
```
✓ src/components/Tools/MyAwesomeTool/
  ✓ index.tsx
```

### Step 2: Pages
```
✓ src/app/[locale]/(default)/tools/my-awesome-tool/
  ✓ page.tsx (optional, can use dynamic route)
```

### Step 3: Translations
```
✓ src/i18n/pages/tools/my-awesome-tool/
  ✓ en.json
  ✓ de.json
  ✓ es.json
  (and any other supported locales)
```

### Step 4: Configuration
```
✓ Edit src/lib/tools-config.ts
  ✓ Add entry to TOOL_OVERRIDES
  ✓ Set icon, color, category, tags
```

---

## 9. Key Patterns Summary

### Naming Patterns
| Item | Pattern | Example |
|------|---------|---------|
| Component folder | PascalCase | `testCalculator` |
| Route folder | kebab-case | `test-calculator` |
| Translation folder | kebab-case | `test-calculator` |
| Translation key | dot-notation | `tools.test-calculator.metadata.title` |
| Config slug | kebab-case | `"test-calculator"` |

### Path Patterns
| Type | Path |
|------|------|
| Component | `src/components/Tools/[PascalCase]/index.tsx` |
| Route | `src/app/[locale]/(default)/tools/[kebab-case]/page.tsx` |
| Translation | `src/i18n/pages/tools/[kebab-case]/[locale].json` |
| Config | `src/lib/tools-config.ts` (manual entries) |

### Translation Patterns
| Use Case | Namespace | Key |
|----------|-----------|-----|
| Flat structure | `tools` | `tools.test-calculator.metadata.title` |
| Page metadata | `tools` | `tools.test-calculator.metadata.*` |
| Component access | `tools.test-calculator` | `metadata.title` |

### Icon & Color Patterns
- **Icons**: Lucide icon names (case-insensitive, use PascalCase in code)
  - Examples: `Calculator`, `Sparkles`, `Zap`, `Globe`
  - Reference: https://lucide.dev/
  
- **Colors**: Tailwind gradient classes
  - Pattern: `bg-gradient-to-br from-[color]-500 to-[color]-600`
  - Examples:
    - Blue: `bg-gradient-to-br from-blue-500 to-blue-600`
    - Purple: `bg-gradient-to-br from-purple-500 to-purple-600`
    - Green: `bg-gradient-to-br from-green-500 to-green-600`

---

## 10. Special Cases & Advanced Patterns

### Dynamic Route Fallback
The `[slug]` dynamic route in `tools/[slug]/page.tsx`:
- Acts as fallback for any tool not with dedicated page
- Renders placeholder component `ToolPlaceholder`
- Uses generic feature configurations
- Safe fallback if tool-specific page missing

### Translation Fallback Strategy
1. Try to load tool-specific translations
2. If missing, use fallback values:
   - Title: slug converted to Title Case
   - Description: "Discover {slug} with our advanced tools"
3. Warnings logged to console for missing translations

### Static Parameter Generation
```typescript
export async function generateStaticParams() {
  const slugs = getAllToolSlugs();
  return slugs.map((slug) => ({ slug }));
}
```
- Ensures all tools pre-rendered at build time
- Automatically discovers new tools via `getAllToolSlugs()`
- No manual static route configuration needed

### Structured Data (Schema.org)
- Tool schema generated for SEO
- Breadcrumb schema for navigation hierarchy
- Injected as JSON-LD in page head
- Functions: `generateToolSchema()`, `generateToolBreadcrumbSchema()`

---

## 11. Current Tools in Codebase

### test-calculator
- **Slug**: `test-calculator`
- **Component**: `testCalculator` (PascalCase)
- **Icon**: Calculator
- **Color**: `bg-gradient-to-br from-blue-500 to-blue-600`
- **Category**: Tools
- **Tags**: `["calculator", "test", "addition", "math"]`
- **Description**: Simple test tool demonstrating dynamic discovery
- **Translations**: Complete (en, de, es)
- **Custom Page**: Yes (`src/app/[locale]/(default)/tools/test-calculator/page.tsx`)

---

## 12. Quick Reference: Creating a New Tool

### Minimal Setup (5 minutes)
1. Create component: `src/components/Tools/MyTool/index.tsx`
2. Create translations: `src/i18n/pages/tools/my-tool/en.json`
3. Add config override:
   ```typescript
   "my-tool": {
     icon: "Sparkles",
     color: "bg-gradient-to-br from-pink-500 to-pink-600",
     category: "AI Tools",
     tags: ["ai", "creative"]
   }
   ```
4. Use dynamic route fallback (tools/[slug]/page.tsx)

### Complete Setup (15 minutes)
1. Follow minimal setup above
2. Add translations for all locales (de, es, etc.)
3. Create custom page: `src/app/[locale]/(default)/tools/my-tool/page.tsx`
4. Configure features and features2 arrays
5. Add structured data generation
6. Test all locales and translations

---

## 13. Important Notes

- **Tool Discovery is Automatic**: Just add a folder and the system detects it
- **Translations are Required**: At least one locale needed (fallback to English if missing)
- **Config Overrides are Optional**: Tools work with defaults but customization is easy
- **Icon Names are Case-Insensitive**: `Calculator` and `calculator` both work
- **All Routes are Pre-rendered**: Build-time static generation for performance
- **Fallback Component**: `ToolPlaceholder` used if component not found
- **Multi-locale Support**: Tools automatically work in all configured locales (en, de, es, zh)
