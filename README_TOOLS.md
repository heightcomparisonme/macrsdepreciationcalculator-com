# Tools System - Quick Start Guide

Welcome! This document gives you the fastest path to understanding and using the tools system.

## What is This?

This codebase has an **automatic tool discovery system** that lets you add new calculator/utility tools without boilerplate.

## 3-Minute Overview

```
Add a tool in 3 steps:

1. Create Component
   src/components/Tools/MyTool/index.tsx

2. Create Translations  
   src/i18n/pages/tools/my-tool/{en,de,es}.json

3. Add Config
   src/lib/tools-config.ts (5 lines)

Done! System auto-discovers it.
```

## The Pattern (Very Simple)

| What | Where | Pattern |
|------|-------|---------|
| Component folder | `src/components/Tools/` | **PascalCase** |
| Route folder | `src/app/.../tools/` | **kebab-case** |
| Translation folder | `src/i18n/pages/tools/` | **kebab-case** |
| Config entry | `src/lib/tools-config.ts` | **kebab-case** |

**Critical Rule**: Component names are PascalCase, everything else is kebab-case.

## Fastest Path to Success

### 1. Read the Index (5 minutes)
```
TOOLS_DOCUMENTATION_INDEX.md
```
Gives you the big picture and points to what you need.

### 2. Follow the Step-by-Step Guide (15 minutes)
```
TOOL_STRUCTURE_VISUAL_GUIDE.md
```
Copy-paste templates, follow 4 steps, done.

### 3. Build Your Tool (30 minutes)
Create component, translations, config. Build & test.

## The Simplest Possible Tool

### Component: `src/components/Tools/MyTool/index.tsx`
```typescript
"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function MyTool() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <Card>
        <CardHeader>
          <CardTitle>My Tool</CardTitle>
        </CardHeader>
        <CardContent>
          <Button>Click me!</Button>
        </CardContent>
      </Card>
    </div>
  );
}
```

### Translations: `src/i18n/pages/tools/my-tool/en.json`
```json
{
  "metadata": {
    "title": "My Tool",
    "description": "My tool description"
  },
  "title": "My Tool",
  "hero": {
    "title": "My Tool",
    "cta_primary": "Get Started"
  }
}
```

### Config: `src/lib/tools-config.ts`
```typescript
const TOOL_OVERRIDES = {
  "my-tool": {
    icon: "Sparkles",
    color: "bg-gradient-to-br from-purple-500 to-purple-600",
    category: "Tools",
    tags: ["awesome"]
  }
};
```

### Test
```bash
pnpm build
pnpm dev
# Visit: http://localhost:3000/tools/my-tool
```

Done! Your tool is live.

## Naming Gotcha (Don't Get This Wrong)

```
Tool Name: my-awesome-thing

Component Folder: src/components/Tools/MyAwesomeThing/
                                       PascalCase

Route Folder: src/app/.../tools/my-awesome-thing/
                                kebab-case

Translation Folder: src/i18n/pages/tools/my-awesome-thing/
                                           kebab-case

Config Key: "my-awesome-thing"
             kebab-case
```

**WHY?** React imports need PascalCase for components. URLs are conventionally kebab-case.

## File Structure

```
project/
├── src/
│   ├── components/Tools/          <- Component files
│   │   ├── TestCalculator/        <- PascalCase
│   │   └── MyTool/
│   │
│   ├── app/[locale]/(default)/tools/
│   │   ├── page.tsx               <- Tools listing
│   │   ├── test-calculator/       <- kebab-case
│   │   ├── my-tool/
│   │   └── [slug]/                <- Fallback route
│   │
│   ├── i18n/pages/tools/
│   │   ├── test-calculator/       <- kebab-case
│   │   │   ├── en.json
│   │   │   ├── de.json
│   │   │   └── es.json
│   │   └── my-tool/
│   │
│   └── lib/
│       └── tools-config.ts        <- Configuration
│
└── Documentation/
    ├── TOOLS_DOCUMENTATION_INDEX.md
    ├── TOOL_PATTERNS_SUMMARY.md
    ├── TOOL_STRUCTURE_VISUAL_GUIDE.md
    ├── TOOL_STRUCTURE_PATTERNS.md
    ├── TOOL_FLOW_DIAGRAMS.md
    └── EXPLORATION_SUMMARY.md
```

## How It Works (30 Seconds)

```
1. BUILD TIME
   Scan: src/app/.../tools/ for folders
   Find: test-calculator, my-awesome-tool, ...
   Load: Translations from src/i18n/pages/tools/
   Apply: Config overrides from tools-config.ts
   Result: Pre-rendered HTML for all routes

2. RUNTIME
   User visits: /en/tools/my-tool
   Server sends: Pre-rendered HTML instantly
   Browser: Hydrates React components
   Result: Interactive tool

3. You get:
   - Auto-discovery (no registration)
   - Multi-locale (en, de, es)
   - SEO optimized (metadata, schema)
   - Pre-rendered (fast)
   - Consistent UX (all tools same layout)
```

## Documentation Map

Choose your path:

- **I want quick answers** → `TOOL_PATTERNS_SUMMARY.md`
- **I want to add a tool now** → `TOOL_STRUCTURE_VISUAL_GUIDE.md`
- **I want complete reference** → `TOOL_STRUCTURE_PATTERNS.md`
- **I want to understand flow** → `TOOL_FLOW_DIAGRAMS.md`
- **I want the overview** → `TOOLS_DOCUMENTATION_INDEX.md`

## Common Questions

**Q: Do I need to register the tool?**  
A: No. System auto-discovers it from the folder.

**Q: Do I need all translations?**  
A: At least English. Others default to English if missing.

**Q: Do I need a custom page?**  
A: No. System uses fallback route by default.

**Q: Can I customize styling?**  
A: Yes. Add entry to `TOOL_OVERRIDES` in `tools-config.ts`.

**Q: What icons are available?**  
A: Lucide icons. See: https://lucide.dev/

**Q: What colors work?**  
A: Tailwind gradients. Pattern: `bg-gradient-to-br from-[color]-500 to-[color]-600`

## Icons Quick Reference

Common: `Calculator`, `Sparkles`, `Zap`, `Globe`, `Target`, `Shield`, `Users`, `Chart`, `Lock`, `Code`, `Database`, `Cloud`, `Settings`, `Bell`, `Search`, `Download`, `Upload`, `Share`, `Copy`, `Edit`, `Trash2`, `Plus`, `Check`, `X`

Full list: https://lucide.dev/

## Colors Quick Reference

- Blue: `bg-gradient-to-br from-blue-500 to-blue-600`
- Purple: `bg-gradient-to-br from-purple-500 to-purple-600`
- Pink: `bg-gradient-to-br from-pink-500 to-pink-600`
- Green: `bg-gradient-to-br from-green-500 to-green-600`
- Red: `bg-gradient-to-br from-red-500 to-red-600`

## Checklist: Creating Your First Tool

```
[ ] 1. Create folder: src/components/Tools/MyTool/
[ ] 2. Create file: src/components/Tools/MyTool/index.tsx
[ ] 3. Create folder: src/i18n/pages/tools/my-tool/
[ ] 4. Create file: src/i18n/pages/tools/my-tool/en.json
[ ] 5. Create file: src/i18n/pages/tools/my-tool/de.json
[ ] 6. Create file: src/i18n/pages/tools/my-tool/es.json
[ ] 7. Edit: src/lib/tools-config.ts
[ ] 8. Add entry to TOOL_OVERRIDES
[ ] 9. Run: pnpm build
[ ] 10. Run: pnpm dev
[ ] 11. Visit: http://localhost:3000/tools/my-tool
[ ] 12. Check translations load for all locales
```

## Troubleshooting

**Tool not showing?**
- Check folder name is kebab-case in routes
- Check component folder is PascalCase
- Run `pnpm build` to trigger discovery
- Check console for warnings

**Translations missing?**
- Verify .json files exist
- Check file names: en.json, de.json, es.json
- Validate JSON syntax (no trailing commas)
- Check browser console for errors

**Icon not showing?**
- Use exact name from lucide.dev
- Check icon name case (usually PascalCase)
- Verify icon exists

**Styling wrong?**
- Use Tailwind utility classes
- Add "use client" directive to component
- Import UI from @/components/ui/

## Next Steps

1. **Read**: `TOOL_PATTERNS_SUMMARY.md` (10 min)
2. **Follow**: `TOOL_STRUCTURE_VISUAL_GUIDE.md` (15 min)
3. **Create**: Your first tool (30 min)
4. **Deploy**: It's automatically included!

## Key Files

- `src/lib/tools-config.ts` - Where you customize tools
- `src/i18n/request.ts` - Translation auto-loading
- `src/app/.../tools/page.tsx` - Tools listing page
- `src/app/.../tools/[slug]/page.tsx` - Fallback tool page

## Architecture Benefits

- Automatic discovery (no registration)
- Zero boilerplate (just create folders)
- Multi-locale support (en, de, es)
- SEO optimized (metadata, schema)
- Pre-rendered (fast page loads)
- Consistent UX (all tools use same layout)
- Type safe (full TypeScript)
- Scalable (works with 50+ tools)

## Resources

- **Lucide Icons**: https://lucide.dev/
- **Tailwind Colors**: https://tailwindcss.com/docs/customizing-colors
- **Next.js Docs**: https://nextjs.org/docs
- **next-intl Docs**: https://next-intl-docs.vercel.app/

## Need More Help?

- **Quick answers**: `TOOL_PATTERNS_SUMMARY.md`
- **Step by step**: `TOOL_STRUCTURE_VISUAL_GUIDE.md`
- **Everything**: `TOOL_STRUCTURE_PATTERNS.md`
- **Diagrams**: `TOOL_FLOW_DIAGRAMS.md`
- **Overview**: `TOOLS_DOCUMENTATION_INDEX.md`
- **Details**: `EXPLORATION_SUMMARY.md`

---

**TL;DR**: Create component + translations + config entry, system auto-discovers it. You're done!

Ready to build? Start with `TOOL_STRUCTURE_VISUAL_GUIDE.md` 🚀
