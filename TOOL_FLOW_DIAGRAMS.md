# Tool Architecture - Flow Diagrams

## System Overview Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         TOOL SYSTEM ARCHITECTURE                         │
└─────────────────────────────────────────────────────────────────────────┘

                          BUILD TIME
                          ══════════

1. FILE SYSTEM DISCOVERY
   ┌────────────────────────────────────┐
   │ src/app/[locale]/(default)/tools/  │
   │ ├── test-calculator/               │  ← Scan for directories
   │ ├── my-awesome-tool/               │
   │ ├── another-tool/                  │
   │ ├── page.tsx                       │
   │ └── [slug]/                        │
   └────────────────────────────────────┘
              ↓
   Extract slugs: ["test-calculator", "my-awesome-tool", "another-tool"]


2. CONFIGURATION MERGING
   ┌─────────────────────┐     ┌──────────────────────┐
   │ DEFAULT_CONFIG      │     │ TOOL_OVERRIDES       │
   │ ─────────────────   │     │ ──────────────────   │
   │ icon: Sparkles      │     │ "test-calculator": { │
   │ color: gray         │  +  │   icon: Calculator   │
   │ category: Tools     │     │   color: blue        │
   │ tags: []            │     │   tags: [...]        │
   └─────────────────────┘     │ }                    │
              ↓                └──────────────────────┘
              └────────────┬───────────────┘
                           ↓
              ┌──────────────────────────┐
              │  MERGED TOOL CONFIG      │
              │ ─────────────────────── │
              │ slug: test-calculator    │
              │ icon: Calculator         │
              │ color: blue              │
              │ category: Tools          │
              │ tags: [...]              │
              └──────────────────────────┘


3. TRANSLATION LOADING
   ┌────────────────────────────────────────────┐
   │ src/i18n/pages/tools/test-calculator/      │
   │ ├── en.json  ─┐                            │
   │ ├── de.json  ├─→ Load all locale files    │
   │ └── es.json  ─┘                            │
   └────────────────────────────────────────────┘
              ↓
   Create namespace:
   tools.test-calculator.metadata.title
   tools.test-calculator.hero.title
   tools.test-calculator.features.*
   ... (and all other keys)


4. ROUTE GENERATION
   ┌──────────────────────────────────┐
   │ STATIC ROUTES CREATED            │
   ├──────────────────────────────────┤
   │ /en/tools                        │
   │ /en/tools/test-calculator        │
   │ /en/tools/my-awesome-tool        │
   │ /de/tools                        │
   │ /de/tools/test-calculator        │
   │ /de/tools/my-awesome-tool        │
   │ /es/tools                        │
   │ /es/tools/test-calculator        │
   │ /es/tools/my-awesome-tool        │
   │ ... (all combinations pre-built) │
   └──────────────────────────────────┘


5. COMPONENT COMPILATION
   ┌────────────────────────────┐
   │ src/components/Tools/      │
   │ ├── TestCalculator/        │
   │ ├── MyAwesomeTool/         │
   │ └── ...                    │
   └────────────────────────────┘
              ↓
   Compiled JavaScript bundles
   ├── test-calculator.js
   ├── my-awesome-tool.js
   └── shared-ui.js (shadcn/ui)


6. STATIC HTML GENERATION
   ┌──────────────────────────────────┐
   │ NEXT.JS BUILD OUTPUT             │
   ├──────────────────────────────────┤
   │ /.next/server/pages/en/tools/    │
   │ ├── index.html                   │
   │ ├── test-calculator.html         │
   │ ├── my-awesome-tool.html         │
   │ └── ...                          │
   │                                  │
   │ /.next/server/pages/de/tools/    │
   │ ├── index.html                   │
   │ ├── test-calculator.html         │
   │ └── ...                          │
   │                                  │
   │ /.next/static/chunks/            │
   │ ├── main-*.js                    │
   │ ├── test-calculator-*.js         │
   │ └── ...                          │
   └──────────────────────────────────┘


                          RUNTIME
                          ═══════

7. USER REQUEST
   Browser Request: GET /en/tools/test-calculator
              ↓
   ┌──────────────────────────────────┐
   │ Next.js Server                   │
   │ ├── Find pre-rendered HTML       │
   │ ├── Inject data (translations)   │
   │ └── Stream to browser            │
   └──────────────────────────────────┘
              ↓
   Browser receives HTML + JS
              ↓
   Hydration: React attaches to DOM
              ↓
   ┌──────────────────────────────────┐
   │ Interactive Page                 │
   │ ├── TestCalculator component     │
   │ ├── Event handlers active        │
   │ └── State management ready       │
   └──────────────────────────────────┘
```

---

## Request Flow: From URL to Rendered Page

```
┌──────────────────────────────────────────────────────────────────┐
│ USER VISITS: /en/tools/test-calculator                           │
└──────────────────────────────────────────────────────────────────┘
                          ↓
┌──────────────────────────────────────────────────────────────────┐
│ ROUTE MATCHING                                                    │
│ ─────────────────────────────────────────────────────────────────│
│ Pattern: /[locale]/(default)/tools/[slug]/page.tsx              │
│ Locale: en                                                        │
│ Slug: test-calculator                                             │
└──────────────────────────────────────────────────────────────────┘
                          ↓
┌──────────────────────────────────────────────────────────────────┐
│ VERIFY TOOL EXISTS                                                │
│ ─────────────────────────────────────────────────────────────────│
│ getToolConfig("test-calculator")                                 │
│ Returns: ToolConfig { slug, icon, color, ... }                  │
│ If not found → notFound()                                         │
└──────────────────────────────────────────────────────────────────┘
                          ↓
                    ┌─────────────────┐
        ┌───────────→│ Generate Page   │←───────────┐
        │            │ Check exists OK │            │
        │            └─────────────────┘            │
        │                    ↓                      │
        │                                           │
        │            PARALLEL OPERATIONS            │
        │                                           │
    ┌───┴───┐                              ┌──────┴──┐
    │       ↓                              ↓        │
   Load   Generate                    Create    Generate
 Translations Metadata              Schemas   Static Params
    │       ↓                              ↓        │
    │   ┌──────────────┐        ┌──────────────────┐│
    │   │ metadata:    │        │ Structured Data: ││
    │   │ title        │        │ ├─ Schema.org    ││
    │   │ description  │        │ ├─ Breadcrumbs   ││
    │   │ OG tags      │        │ └─ JSON-LD       ││
    │   └──────────────┘        └──────────────────┘│
    │       ↓                              ↓        │
    └───────┴──────────────┬───────────────┘        │
                           ↓                         │
            ┌──────────────────────────────┐        │
            │ RENDER PAGE COMPONENT        │        │
            │ ──────────────────────────── │        │
            │ <TestCalculatorPage />       │        │
            │ └─ Receives:                 │        │
            │   ├─ locale: "en"            │        │
            │   ├─ slug: "test-calculator" │        │
            │   ├─ toolConfig: {...}       │        │
            │   └─ translations loaded     │        │
            └──────────────────────────────┘        │
                           ↓                         │
        ┌──────────────────────────────────┐       │
        │ <ToolPageLayout>                  │       │
        │ ├─ calculator: <TestCalculator /> │       │
        │ ├─ features: [...]                │       │
        │ ├─ features2: [...]               │       │
        │ └─ styles: custom container       │       │
        └──────────────────────────────────┘       │
                           ↓                         │
        ┌──────────────────────────────────┐        │
        │ FINAL HTML OUTPUT                 │        │
        │ ├─ Head:                          │        │
        │ │  ├─ <meta name="title">         │        │
        │ │  ├─ <meta name="description">   │        │
        │ │  ├─ <script type="ld+json">     │        │
        │ │  └─ OG tags                     │        │
        │ ├─ Body:                          │        │
        │ │  ├─ Header + Navigation         │        │
        │ │  ├─ Hero Section                │        │
        │ │  ├─ Calculator Widget           │        │
        │ │  ├─ Features Section            │        │
        │ │  ├─ Testimonials                │        │
        │ │  ├─ FAQ Section                 │        │
        │ │  ├─ CTA Section                 │        │
        │ │  ├─ Footer                      │        │
        │ │  └─ <script src="...js">        │        │
        │ └─ Hydration data                 │        │
        └──────────────────────────────────┘        │
                           ↓                         │
        Send to Browser ──────────────────────────→ │
                                                    │
         ┌────────────────────────────────────────┐│
         │ BROWSER HYDRATION                      ││
         │ ────────────────────────────────────── ││
         │ 1. Parse HTML                          ││
         │ 2. Load React components               ││
         │ 3. Attach event listeners              ││
         │ 4. Initialize state (useState)         ││
         │ 5. Activate interactivity              ││
         └────────────────────────────────────────┘│
                                                    │
         ┌────────────────────────────────────────┐│
         │ INTERACTIVE PAGE READY                 ││
         │ User can:                              ││
         │ ├─ Fill in calculator inputs           ││
         │ ├─ Click buttons                       ││
         │ ├─ See real-time results               ││
         │ └─ Navigate to related tools           ││
         └────────────────────────────────────────┘│
                                                    │
                                                    └─ Hydration complete
```

---

## Tool Discovery Process

```
┌─────────────────────────────────────────────────────────────────┐
│ TOOL DISCOVERY FLOW (Build Time)                                 │
└─────────────────────────────────────────────────────────────────┘

BEGIN: pnpm build
  ↓
┌──────────────────────────────────────────────────────────┐
│ discoverTools()                                           │
├──────────────────────────────────────────────────────────┤
│ Read: src/app/[locale]/(default)/tools/                │
│ Entries found:                                           │
│ ├─ page.tsx         ← EXCLUDE (file, not directory)    │
│ ├─ test-calculator/ ← INCLUDE (directory)              │
│ ├─ my-awesome-tool/ ← INCLUDE (directory)              │
│ ├─ [slug]/          ← EXCLUDE (dynamic route pattern)   │
│ └─ [...other]/      ← EXCLUDE (dynamic route pattern)   │
│                                                          │
│ Result: ["test-calculator", "my-awesome-tool"]         │
└──────────────────────────────────────────────────────────┘
  ↓
┌──────────────────────────────────────────────────────────┐
│ generateToolsConfig()                                     │
├──────────────────────────────────────────────────────────┤
│ discovered: ["test-calculator", "my-awesome-tool"]      │
│ overrides:  { "test-calculator": {...}, ... }           │
│                                                          │
│ Merge for each slug:                                     │
│                                                          │
│ test-calculator:                                         │
│   Base: DEFAULT_TOOL_CONFIG                            │
│   Override:                                              │
│     icon: "Calculator"                                   │
│     color: "bg-gradient-to-br from-blue-500..."        │
│   Result: { slug, icon, color, ... }                   │
│                                                          │
│ my-awesome-tool:                                         │
│   Base: DEFAULT_TOOL_CONFIG                            │
│   Override: (not in TOOL_OVERRIDES)                    │
│   Result: { slug, icon: "Sparkles", color: "gray", ... │
└──────────────────────────────────────────────────────────┘
  ↓
┌──────────────────────────────────────────────────────────┐
│ TOOLS_CONFIG Array                                        │
├──────────────────────────────────────────────────────────┤
│ [                                                        │
│   {                                                      │
│     slug: "test-calculator",                            │
│     icon: "Calculator",                                  │
│     color: "bg-gradient-to-br from-blue-500...",       │
│     category: "Tools",                                   │
│     tags: ["calculator", "test", "addition", "math"]   │
│   },                                                     │
│   {                                                      │
│     slug: "my-awesome-tool",                            │
│     icon: "Sparkles",                                    │
│     color: "bg-gradient-to-br from-gray-500...",       │
│     category: "Tools",                                   │
│     tags: []                                             │
│   }                                                      │
│ ]                                                        │
└──────────────────────────────────────────────────────────┘
  ↓
┌──────────────────────────────────────────────────────────┐
│ Used by:                                                  │
├──────────────────────────────────────────────────────────┤
│ 1. getAllToolSlugs()                                     │
│    → ["test-calculator", "my-awesome-tool"]            │
│    → Used in generateStaticParams()                     │
│                                                          │
│ 2. getToolConfig(slug)                                  │
│    → Returns ToolConfig for validation                 │
│    → Used in page components                            │
│                                                          │
│ 3. Translation Loading (src/i18n/request.ts)           │
│    → Discovers which tools to load translations for    │
│    → For each slug, loads:                              │
│      └─ src/i18n/pages/tools/[slug]/[locale].json      │
│                                                          │
│ 4. Tools Listing Page                                   │
│    → Maps TOOLS_CONFIG to generate all tool cards      │
│    → Shows icon, color, tags for each tool             │
└──────────────────────────────────────────────────────────┘
```

---

## Translation Loading Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│ TRANSLATION LOADING (Build + Runtime)                            │
└─────────────────────────────────────────────────────────────────┘

USER VISITS: GET /en/tools/test-calculator
                  ↓
            Next.js Runtime
                  ↓
    getTranslations({ locale, namespace })
                  ↓
src/i18n/request.ts getRequestConfig()
                  ↓
        ┌─────────────────────────────┐
        │ Load Global Messages         │
        ├─────────────────────────────┤
        │ import('./messages/en.json') │
        │                              │
        │ Returns:                     │
        │ {                            │
        │   "navigation": {...},       │
        │   "common": {...},           │
        │   "pages": {...},            │
        │   "tools": {}                │
        │ }                            │
        └─────────────────────────────┘
                  ↓
        ┌──────────────────────────────────────┐
        │ Load Page-Specific Messages          │
        ├──────────────────────────────────────┤
        │ pageMapping = [                       │
        │   { path: "tools", key: "tools" },  │
        │   { path: "tools/test-calculator",   │
        │     key: "test-calculator" },        │
        │   ...                                │
        │ ]                                    │
        │                                      │
        │ For each:                            │
        │   import(`./pages/[path]/en.json`)  │
        │   → messages.pages[key] = loaded    │
        │   → messages.tools[key] = loaded    │
        └──────────────────────────────────────┘
                  ↓
        ┌──────────────────────────────────────┐
        │ Final Message Structure              │
        ├──────────────────────────────────────┤
        │ {                                    │
        │   "navigation": {...},               │
        │   "common": {...},                   │
        │   "pages": {                         │
        │     "tools": {                       │
        │       "title": "All Tools",          │
        │       "subtitle": "...",             │
        │       ...                            │
        │     },                               │
        │     "landing": {...},                │
        │     ...                              │
        │   },                                 │
        │   "tools": {                         │
        │     "test-calculator": {             │
        │       "metadata": {                  │
        │         "title": "...",              │
        │         "description": "..."         │
        │       },                             │
        │       "title": "...",                │
        │       "hero": {...},                 │
        │       "features": {...},             │
        │       ...                            │
        │     },                               │
        │     "my-awesome-tool": {...}         │
        │   }                                  │
        │ }                                    │
        └──────────────────────────────────────┘
                  ↓
     Return to getTranslations()
                  ↓
    Access in Components:
    
    Server Component:
    ───────────────
    const t = await getTranslations({
      locale: "en",
      namespace: "tools.test-calculator"
    });
    
    t("metadata.title")
    → "Test Calculator - Simple Addition Tool"
    
    Client Component:
    ────────────────
    const t = useTranslations("tools.test-calculator");
    
    t("title")
    → "Test Calculator"
```

---

## Component Hierarchy: Tool Page

```
┌──────────────────────────────────────────────────────────────┐
│ <TestCalculatorPage> (Server Component)                       │
│ ──────────────────────────────────────────────────────────── │
│ getTranslations({ namespace: "tools" })                      │
│ generateMetadata()                                            │
│ generateToolSchema() for SEO                                  │
│ Renders:                                                      │
└──────────────────────────────────────────────────────────────┘
                           ↓
┌──────────────────────────────────────────────────────────────┐
│ <ToolPageLayout> (Server Component)                           │
│ ──────────────────────────────────────────────────────────── │
│ Props:                                                        │
│   - toolKey: string (for translations)                       │
│   - calculator: React.ReactNode (tool component)             │
│   - features: FeatureItem[] (benefit list)                   │
│   - features2: Features2Item[] (before/after)               │
│   - containerClassName: string (custom styles)              │
│ Renders:                                                      │
└──────────────────────────────────────────────────────────────┘
                    ↓              ↓                ↓
     ┌──────────────┐   ┌─────────────────┐   ┌──────────────┐
     │   HeroBlock  │   │  ToolComponent  │   │  FeatureBlock│
     │              │   │    (PassThru)   │   │              │
     │ Uses t() to  │   │                 │   │ Maps feature │
     │ translate    │   │ <TestCalc>      │   │ items and    │
     │ hero section │   │ "use client"     │   │ translates   │
     │ content      │   │ Interactive      │   │              │
     │              │   │ State: useState  │   │              │
     └──────────────┘   └─────────────────┘   └──────────────┘
             ↓                   ↓                    ↓
     All use t() from           Button            Feature1
     namespace to get           Input             Feature2
     translated text            Select            Feature3
                                Submit
                                  ↓
                            Calculation
                            Results
                                  ↓
                            Renders Table
                            with Results
                             ↓
     ┌──────────────┐   ┌─────────────────┐   ┌──────────────┐
     │TestimonialBk │   │ ShowcaseBlock   │   │  FAQBlock    │
     │              │   │                 │   │              │
     │ User quotes  │   │ Before/After    │   │ Q&A items    │
     │ Ratings      │   │ Slider demo     │   │ Expandable   │
     │ Avatars      │   │ with images     │   │ Accordion    │
     └──────────────┘   └─────────────────┘   └──────────────┘
             ↓                   ↓                    ↓
     All pull from          All pull from        All pull from
     translations           translations         translations
```

---

## Data Flow: Request → Response

```
REQUEST
  ↓
GET /en/tools/test-calculator
  ↓
Next.js Router
  ├─ locale: "en"
  └─ slug: "test-calculator"
  ↓
getStaticParams()
  ├─ getAllToolSlugs()
  └─ Pre-rendered page exists ✓
  ↓
Page Component: TestCalculatorPage({ params })
  ├─ getToolConfig("test-calculator") ✓
  ├─ getTranslations({ locale: "en", namespace: "tools" })
  │   └─ Loads all tool translations into scope
  ├─ generateMetadata()
  │   ├─ t("test-calculator.metadata.title")
  │   └─ t("test-calculator.metadata.description")
  ├─ generateToolSchema() & generateToolBreadcrumbSchema()
  │   └─ Structured data for SEO
  ├─ Configure features arrays
  └─ Render JSX
  ↓
<ToolPageLayout> (receives all props)
  ├─ <script type="application/ld+json">...</script>
  ├─ <HeroBlock> uses t("test-calculator.hero.*")
  ├─ <TestCalculator> (client component)
  │   └─ "use client" - interactive, state, events
  ├─ <FeatureBlock> uses t("test-calculator.features.*")
  ├─ <ShowcaseBlock> uses t("test-calculator.showcase.*")
  ├─ <TestimonialBlock> uses t("test-calculator.testimonials.*")
  ├─ <FAQBlock> uses t("test-calculator.faq.*")
  └─ <CTABlock> uses t("test-calculator.cta.*")
  ↓
Final HTML
  ├─ <head>
  │   ├─ <title>Test Calculator - Simple Addition Tool</title>
  │   ├─ <meta name="description" content="...">
  │   ├─ <script type="application/ld+json">...</script>
  │   ├─ OG tags for social sharing
  │   └─ Canonical URL
  ├─ <body>
  │   ├─ Pre-rendered HTML sections
  │   ├─ Hydration data
  │   └─ <script src="...js"> (React bundle)
  └─ </html>
  ↓
RESPONSE (to Browser)
  ↓
Browser receives 200 KB HTML
  ├─ Parse HTML
  ├─ Render initial view instantly
  ├─ Start loading JS (React)
  └─ Once JS loaded:
      ├─ Hydrate React components
      ├─ Attach event listeners
      ├─ Activate TestCalculator interactivity
      └─ Ready for user input
  ↓
USER INTERACTION
  ├─ Enters numbers in TestCalculator
  ├─ Clicks "Calculate" button
  ├─ handleCalculation() runs
  ├─ setResults(depreciationSchedule)
  ├─ Component re-renders with results table
  └─ Results visible to user instantly (no page reload)
```

---

## Multi-Locale Routing

```
Same component, different translations:

ENGLISH (en)
────────────────────────────────────────
GET /en/tools/test-calculator
  → Page component loads
  → getTranslations({ locale: "en", namespace: "tools" })
  → Loads: src/i18n/pages/tools/test-calculator/en.json
  → Content: "Test Calculator", "Add two numbers", etc.
  ↓
<html lang="en">
  <title>Test Calculator - Simple Addition Tool</title>
  ...all English text...
</html>
────────────────────────────────────────

GERMAN (de)
────────────────────────────────────────
GET /de/tools/test-calculator
  → Page component loads (SAME CODE)
  → getTranslations({ locale: "de", namespace: "tools" })
  → Loads: src/i18n/pages/tools/test-calculator/de.json
  → Content: "Test-Rechner", "Geben Sie zwei Zahlen ein", etc.
  ↓
<html lang="de">
  <title>Test-Rechner - Einfaches Additions-Tool</title>
  ...all German text...
</html>
────────────────────────────────────────

SPANISH (es)
────────────────────────────────────────
GET /es/tools/test-calculator
  → Page component loads (SAME CODE)
  → getTranslations({ locale: "es", namespace: "tools" })
  → Loads: src/i18n/pages/tools/test-calculator/es.json
  → Content: "Calculadora de Prueba", "Ingrese dos números", etc.
  ↓
<html lang="es">
  <title>Calculadora de Prueba - Herramienta Simple de Suma</title>
  ...all Spanish text...
</html>
────────────────────────────────────────

All three URLs:
- Use IDENTICAL page component code
- Use SAME TestCalculator component
- Load DIFFERENT translation files
- Generate UNIQUE pre-rendered HTML at build time
- Pre-render happens for ALL locale + tool combinations
- Zero runtime translation cost
```

---

## File Resolution Order

```
When accessing: t("test-calculator.metadata.title")

Translation System Resolution:
──────────────────────────────

1. Check namespace: "tools"
   └─ Current messages: messages.tools
   └─ Look for: messages.tools["test-calculator"]

2. File location resolution:
   └─ src/i18n/pages/tools/test-calculator/en.json
   └─ Contains root-level "metadata": { "title": "..." }
   └─ Merged into messages.tools["test-calculator"]

3. Key resolution:
   └─ Look for: .metadata.title
   └─ In: messages.tools["test-calculator"]
   └─ Finds value

4. Return value:
   └─ "Test Calculator - Simple Addition Tool"

Fallback chain (if missing):
────────────────────────────
1. Try requested namespace
2. Try global namespace
3. Try fallback locale (en)
4. Use hardcoded default
5. Return empty string or warning
```

---

## Build & Deployment Timeline

```
┌─────────────────────────────────────────────────────────────┐
│ LOCAL DEVELOPMENT                                             │
└─────────────────────────────────────────────────────────────┘

$ pnpm dev
  ├─ Turbopack starts dev server
  ├─ On-demand rendering
  ├─ Discovery runs once
  ├─ Changes hot-reload
  └─ Slow first load, fast subsequent (cache)


┌─────────────────────────────────────────────────────────────┐
│ PRODUCTION BUILD                                              │
└─────────────────────────────────────────────────────────────┘

$ pnpm build
  ├─ [1/2] Discovery phase (~100ms)
  │   ├─ Scan src/app/[locale]/(default)/tools/
  │   └─ Extract: ["test-calculator", "my-awesome-tool", ...]
  │
  ├─ [2/2] Generation phase (~10-30 seconds)
  │   ├─ For each tool:
  │   │   ├─ For each locale (en, de, es):
  │   │   │   ├─ Load component
  │   │   │   ├─ Load translations
  │   │   │   ├─ Generate metadata
  │   │   │   ├─ Render to HTML
  │   │   │   ├─ Output: /.next/server/pages/[locale]/tools/[slug].html
  │   │   │   └─ Compress: gzip
  │   │   └─ (~50KB per tool, ~150KB total for 3 tools)
  │   │
  │   ├─ Bundle chunks:
  │   │   ├─ main-*.js (shared UI)
  │   │   ├─ test-calculator-*.js (tool component)
  │   │   ├─ my-awesome-tool-*.js (tool component)
  │   │   └─ ... (tree-shaked, code-split)
  │   │
  │   └─ Output: /.next/server/ & /.next/static/
  │
  ├─ Build Summary:
  │   ├─ Routes (pre-rendered): 12 routes
  │   │   ├─ /en/tools (listing)
  │   │   ├─ /en/tools/test-calculator
  │   │   ├─ /en/tools/my-awesome-tool
  │   │   ├─ /de/tools
  │   │   ├─ /de/tools/test-calculator
  │   │   └─ ... (4 more for ES)
  │   ├─ Total size: ~5-10MB (for 2 tools, all locales)
  │   ├─ Time: ~30 seconds
  │   └─ ✅ Optimized
  │
  └─ Output ready for deployment


┌─────────────────────────────────────────────────────────────┐
│ DEPLOYMENT                                                    │
└─────────────────────────────────────────────────────────────┘

$ pnpm start
  ├─ Serve pre-rendered HTML
  ├─ No compilation needed
  ├─ Instant first byte to browser
  ├─ ~50-100ms response time
  └─ Zero dynamic rendering


Or Deploy to Vercel:
────────────────────
$ git push origin main
  └─ Vercel auto-deploys
     ├─ Installs deps: pnpm install
     ├─ Builds: pnpm build
     ├─ Tests: pnpm lint
     ├─ Deploys: .next/ to CDN
     └─ Live at: https://domain.com/tools
```

These diagrams show the complete flow from tool creation through user interaction, illustrating how the automatic discovery system works alongside the translation infrastructure to provide a seamless, scalable tool management experience.
