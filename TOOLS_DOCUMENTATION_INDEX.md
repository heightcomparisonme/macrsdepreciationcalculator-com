# Tools Documentation Index

Complete guide to understanding and working with the tool system in this codebase.

---

## Quick Start (Choose Your Path)

### I just want to add a tool quickly ⚡
**Start here**: [`TOOL_STRUCTURE_VISUAL_GUIDE.md`](./TOOL_STRUCTURE_VISUAL_GUIDE.md)
- 5-minute setup guide
- Step-by-step instructions
- Copy-paste templates
- File checklist

### I want to understand how it works 🏗️
**Start here**: [`TOOL_FLOW_DIAGRAMS.md`](./TOOL_FLOW_DIAGRAMS.md)
- System overview diagrams
- Request flow visualization
- Component hierarchy
- Data flow illustrations

### I need complete reference documentation 📚
**Start here**: [`TOOL_STRUCTURE_PATTERNS.md`](./TOOL_STRUCTURE_PATTERNS.md)
- Comprehensive reference
- All patterns explained
- Complete examples
- Advanced patterns

### I want the executive summary 📋
**Start here**: [`TOOL_PATTERNS_SUMMARY.md`](./TOOL_PATTERNS_SUMMARY.md)
- Key patterns at a glance
- Quick reference tables
- Common mistakes & fixes
- Architecture overview

---

## Documentation Files

### 1. `TOOL_PATTERNS_SUMMARY.md` (This is the TL;DR)
**Best for**: Getting the gist quickly

**Contains**:
- Core patterns overview
- Naming conventions table
- 3 required locations
- How it works flow
- Translation structure
- Component structure
- Configuration pattern
- Creating a tool checklist
- Common mistakes
- Quick start (5 minutes)

**Read time**: 10-15 minutes
**Use when**: You need quick answers or a refresher

---

### 2. `TOOL_STRUCTURE_VISUAL_GUIDE.md` (Step-by-step)
**Best for**: Adding your first tool

**Contains**:
- Directory structure map
- Naming convention quick reference
- Step-by-step tool creation (4 steps)
- Optional: Custom tool page
- Translation file structure map
- Config structure reference
- Translation access patterns
- File checklist
- Common patterns by component
- Current tools example
- Troubleshooting

**Read time**: 15-20 minutes
**Use when**: You're actively creating a new tool

---

### 3. `TOOL_STRUCTURE_PATTERNS.md` (Complete reference)
**Best for**: Deep understanding and edge cases

**Contains**:
- Comprehensive overview
- Detailed naming conventions
- Component structure patterns
- Page structure patterns
- Translation file structure (sections explained)
- Tool configuration reference
- Translation request configuration
- Dynamic routes & static generation
- Complete file checklist
- Key patterns summary table
- Special cases & advanced patterns
- Current tools in codebase
- Quick reference
- Important notes

**Read time**: 30-45 minutes
**Use when**: You need to understand everything or handle edge cases

---

### 4. `TOOL_FLOW_DIAGRAMS.md` (Visual reference)
**Best for**: Understanding system architecture

**Contains**:
- System overview diagram
- Request flow (URL to rendered page)
- Tool discovery process
- Translation loading architecture
- Component hierarchy
- Data flow (request → response)
- Multi-locale routing
- File resolution order
- Build & deployment timeline

**Read time**: 20-30 minutes
**Use when**: You want visual understanding or need to debug flow

---

## Core Concepts (Quick Reference)

### The Three Required Locations

For a tool named `my-awesome-tool`:

**1. Component** (PascalCase)
```
src/components/Tools/MyAwesomeTool/
└── index.tsx
```

**2. Route** (kebab-case)
```
src/app/[locale]/(default)/tools/my-awesome-tool/
└── page.tsx (optional)
```

**3. Translations** (kebab-case)
```
src/i18n/pages/tools/my-awesome-tool/
├── en.json
├── de.json
└── es.json
```

**4. Configuration** (kebab-case in config)
```typescript
// src/lib/tools-config.ts
TOOL_OVERRIDES: {
  "my-awesome-tool": { ... }
}
```

---

## Naming Convention Quick Reference

| Item | Pattern | Example |
|------|---------|---------|
| Component folder | **PascalCase** | `MyAwesomeTool` |
| Route folder | **kebab-case** | `my-awesome-tool` |
| Translation folder | **kebab-case** | `my-awesome-tool` |
| Config key | **kebab-case** | `"my-awesome-tool"` |
| Translation key | **dot.notation** | `tools.my-awesome-tool.metadata.title` |

**Critical**: Component folder uses PascalCase because it's a component name. Everything else uses kebab-case because they're web identifiers.

---

## How the System Works (30-Second Version)

```
1. BUILD TIME
   ├─ Scan src/app/.../tools/ directory
   ├─ Discover tool folders (e.g., "my-awesome-tool")
   ├─ Load translations from src/i18n/pages/tools/[slug]/
   ├─ Apply config overrides from src/lib/tools-config.ts
   └─ Pre-render all pages to HTML

2. RUNTIME
   ├─ User visits: /en/tools/my-awesome-tool
   ├─ Server sends pre-rendered HTML instantly
   ├─ Browser hydrates React components
   ├─ Tool becomes interactive
   └─ All translations pre-loaded

3. USER INTERACTION
   ├─ Fill calculator inputs
   ├─ Click buttons (client component)
   ├─ See instant results (no page reload)
   └─ Navigate to other tools
```

---

## File Structure Summary

```
project-root/
├── src/
│   ├── components/Tools/
│   │   ├── testCalculator/        ← PascalCase
│   │   │   └── index.tsx
│   │   └── MyAwesomeTool/
│   │       └── index.tsx
│   │
│   ├── app/[locale]/(default)/tools/
│   │   ├── page.tsx               ← Tools listing
│   │   ├── test-calculator/       ← kebab-case
│   │   │   └── page.tsx
│   │   ├── my-awesome-tool/
│   │   │   └── page.tsx
│   │   └── [slug]/
│   │       └── page.tsx           ← Fallback route
│   │
│   ├── i18n/pages/tools/
│   │   ├── test-calculator/       ← kebab-case
│   │   │   ├── en.json
│   │   │   ├── de.json
│   │   │   └── es.json
│   │   └── my-awesome-tool/
│   │       ├── en.json
│   │       ├── de.json
│   │       └── es.json
│   │
│   └── lib/
│       └── tools-config.ts        ← Configuration
│
└── Documentation/
    ├── TOOL_PATTERNS_SUMMARY.md
    ├── TOOL_STRUCTURE_VISUAL_GUIDE.md
    ├── TOOL_STRUCTURE_PATTERNS.md
    └── TOOL_FLOW_DIAGRAMS.md
```

---

## Creating Your First Tool (5 Steps)

### Step 1: Component (src/components/Tools/MyTool/index.tsx)
```typescript
"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function MyTool() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <Card>
        <CardHeader>
          <CardTitle>My Tool</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Your tool UI */}
        </CardContent>
      </Card>
    </div>
  );
}
```

### Step 2: Translations (src/i18n/pages/tools/my-tool/en.json)
```json
{
  "metadata": {
    "title": "My Tool - What It Does",
    "description": "Brief description"
  },
  "title": "My Tool",
  "hero": {
    "title": "My Tool",
    "cta_primary": "Get Started"
  }
}
```

### Step 3: Configuration (src/lib/tools-config.ts)
```typescript
"my-tool": {
  icon: "Sparkles",
  color: "bg-gradient-to-br from-purple-500 to-purple-600",
  category: "Tools",
  tags: ["awesome"]
}
```

### Step 4: Build & Test
```bash
pnpm build      # Discovers tool
pnpm dev        # Test locally
```

### Step 5: Verify
Visit `/tools` and click your tool card

---

## Translation File Sections

Every tool translation file should have these sections:

```json
{
  "metadata": {           // Required for SEO
    "title": "...",
    "description": "..."
  },
  "title": "...",         // Main heading
  "subtitle": "...",      // Secondary heading
  "hero": {               // Hero section
    "badge": "...",
    "title": "...",
    "cta_primary": "..."
  },
  "features": {           // Key features list
    "title": "...",
    "feature1": { "title": "...", "description": "..." }
  },
  "showcase": {           // Showcase with benefits
    "title": "...",
    "benefits": [...]
  },
  "features2": {          // Before/after features
    "title": "...",
    "items": { ... }
  },
  "testimonials": {       // User testimonials
    "title": "...",
    "items": [...]
  },
  "faq": {                // FAQ section
    "title": "...",
    "items": [...]
  },
  "cta": {                // Call to action
    "title": "...",
    "primary_button": "..."
  }
}
```

---

## Common Questions

### Q: Why PascalCase for components but kebab-case for routes?
**A**: React component imports require PascalCase. URLs and file paths are conventionally kebab-case. The system converts between them automatically.

### Q: Can I skip translations?
**A**: No, at least English translation is required. Other locales will fall back to English if missing.

### Q: Do I need a custom page.tsx?
**A**: No. Tools use the fallback dynamic route (`[slug]/page.tsx`) by default. Only create a custom page if you need special behavior.

### Q: How many tools can the system support?
**A**: Unlimited. The system automatically scales. Build time grows linearly with tools (usually <1 second per tool for 3 locales).

### Q: Can I add tools without code?
**A**: No. You need to add component code, but it's minimal (20-50 lines). Configuration is automatic via discovery.

### Q: What happens if I add a folder but forget config?
**A**: Tool appears with default styling (gray background, "Sparkles" icon). Still fully functional. Add config to customize.

### Q: Are all routes pre-rendered?
**A**: Yes. All routes pre-render at build time. Zero dynamic rendering unless you customize the page component.

---

## Debugging Tips

### Tool not appearing
1. Check folder name is kebab-case in `src/app/.../tools/`
2. Ensure component folder exists in PascalCase
3. Check `tools-config.ts` has entry
4. Run `pnpm build` to trigger discovery

### Translations missing
1. Verify `.json` files exist in `src/i18n/pages/tools/[slug]/`
2. Validate JSON syntax (no trailing commas)
3. Check file names match locales: `en.json`, `de.json`, `es.json`
4. Check browser console for translation warnings

### Icon/color not showing
1. Use exact icon name from https://lucide.dev/
2. Use valid Tailwind gradient class
3. Check PascalCase for icon name in config

### Styling issues
1. Use Tailwind utility classes only
2. Ensure component has `"use client"` directive
3. Import UI components from `@/components/ui/`

---

## Key Files to Know

| File | Purpose |
|------|---------|
| `src/lib/tools-config.ts` | Tool discovery + configuration |
| `src/i18n/request.ts` | Translation loading for tools |
| `src/app/.../tools/page.tsx` | Tools listing page |
| `src/app/.../tools/[slug]/page.tsx` | Fallback tool page |
| `src/components/blocks/tools/ToolPageLayout.tsx` | Main layout wrapper |

---

## Architecture Benefits

✅ **Automatic Discovery** - Add folder, system finds it  
✅ **Zero Boilerplate** - No registration needed  
✅ **Multi-Locale** - English, German, Spanish support  
✅ **SEO Optimized** - Metadata, schema, breadcrumbs  
✅ **Pre-Rendered** - All routes built at build time  
✅ **Consistent UX** - All tools use same layout  
✅ **Type Safe** - Full TypeScript support  
✅ **Scalable** - Add 50 tools with minimal overhead  

---

## Tool Examples

### test-calculator
- **What**: MACRS depreciation calculator for tax purposes
- **Location**: `src/components/Tools/testCalculator/index.tsx`
- **Route**: `/tools/test-calculator`
- **Icon**: Calculator
- **Color**: Blue gradient
- **Features**: Full custom page with hero, features, testimonials, FAQ

### How to explore it
1. Check: `src/components/Tools/testCalculator/index.tsx`
2. Read: `src/i18n/pages/tools/test-calculator/en.json`
3. Review: `src/app/.../tools/test-calculator/page.tsx`
4. Examine: `src/lib/tools-config.ts` (look for override)

---

## Next Steps

### To create a tool:
1. Read: `TOOL_STRUCTURE_VISUAL_GUIDE.md` (step-by-step)
2. Follow: 4-step process
3. Use: Checklist to verify

### To understand the system:
1. Read: `TOOL_FLOW_DIAGRAMS.md` (visual overview)
2. Study: `TOOL_STRUCTURE_PATTERNS.md` (detailed reference)
3. Review: Current tools as examples

### To troubleshoot:
1. Check: `TOOL_PATTERNS_SUMMARY.md` (common mistakes)
2. Debug: Using section in this index
3. Consult: `TOOL_STRUCTURE_PATTERNS.md` for details

---

## Key Takeaways

1. **Automatic Discovery**: Just add a folder, system finds it
2. **Naming Matters**: 
   - Components: `PascalCase`
   - Everything else: `kebab-case`
3. **Three Required Locations**:
   - Component: `src/components/Tools/[PascalCase]/`
   - Route: `src/app/.../tools/[kebab-case]/`
   - Translations: `src/i18n/pages/tools/[kebab-case]/`
4. **Configuration is Simple**: Just add entry to `TOOL_OVERRIDES`
5. **Translations are Important**: Needs at least English
6. **Pre-Rendered for Speed**: All routes built at build time
7. **Multi-Locale Built-In**: English, German, Spanish support
8. **Consistent UX**: All tools use same layout

---

## External Resources

- **Lucide Icons**: https://lucide.dev/ (for icon names)
- **Tailwind Colors**: https://tailwindcss.com/docs/customizing-colors
- **Next.js Docs**: https://nextjs.org/docs
- **next-intl**: https://next-intl-docs.vercel.app/
- **shadcn/ui**: https://ui.shadcn.com/ (UI components)

---

## Document Map

```
TOOLS_DOCUMENTATION_INDEX.md (you are here)
│
├─→ TOOL_PATTERNS_SUMMARY.md
│   └─ TL;DR version (10-15 min read)
│   └─ Best for: Quick answers
│
├─→ TOOL_STRUCTURE_VISUAL_GUIDE.md
│   └─ Step-by-step guide (15-20 min read)
│   └─ Best for: Creating tools
│
├─→ TOOL_STRUCTURE_PATTERNS.md
│   └─ Complete reference (30-45 min read)
│   └─ Best for: Deep understanding
│
└─→ TOOL_FLOW_DIAGRAMS.md
    └─ Visual diagrams (20-30 min read)
    └─ Best for: Architecture understanding
```

---

## Final Notes

- **Start Simple**: Begin with a minimal tool and expand
- **Use Examples**: Look at `testCalculator` as reference
- **Test Often**: Build and test after each step
- **Keep Organized**: Follow naming conventions strictly
- **Document Well**: Add helpful translations and descriptions

---

**Last Updated**: 2025-11-04  
**Version**: 1.0  
**Coverage**: All tool patterns and systems  

For questions or updates, refer to the specific documentation files above.
