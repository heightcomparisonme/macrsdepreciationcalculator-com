# Internationalization (i18n) Standards

This document defines the standardized approach for implementing multilingual support in new pages.

## Directory Structure

```
src/i18n/
├── messages/          # Global shared translations
│   ├── en.json       # Navigation, common UI elements, error messages
│   └── zh.json       # Global Chinese translations
└── pages/            # Page-specific translations
    └── [pageName]/   # Create a dedicated folder for each page
        ├── en.json   # English translations for this page
        └── zh.json   # Chinese translations for this page
```

## Implementation Guide for New Pages

### 1. Create Translation Files

For each new page, create a dedicated folder under `src/i18n/pages/`:

```bash
mkdir -p src/i18n/pages/[pageName]
touch src/i18n/pages/[pageName]/en.json
touch src/i18n/pages/[pageName]/zh.json
```

### 2. Structure Translation Keys

Follow this consistent JSON structure for page translations:

```json
{
  "[pageName]": {
    "metadata": {
      "title": "Page Title for SEO",
      "description": "Page description for SEO"
    },
    "hero": {
      "title": "Hero section title",
      "description": "Hero section description"
    },
    "sections": {
      "sectionName": {
        "title": "Section title",
        "content": "Section content"
      }
    },
    "buttons": {
      "primary": "Primary Action",
      "secondary": "Secondary Action"
    }
  }
}
```

### 3. Page Component Implementation

In your page component (`src/app/[locale]/(group)/[pageName]/page.tsx`):

```typescript
import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({
    locale,
    namespace: "pages.[pageName]"
  });

  return {
    title: t("[pageName].metadata.title"),
    description: t("[pageName].metadata.description"),
  };
}

export default async function PageName({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({
    locale,
    namespace: "pages.[pageName]"
  });

  return (
    <div>
      <h1>{t("[pageName].hero.title")}</h1>
    </div>
  );
}
```

### 4. Client Component Translation Access

For client components that need translations:

```typescript
"use client";

import { useTranslations } from "next-intl";

export function ClientComponent() {
  const t = useTranslations("pages.[pageName]");

  return (
    <button>{t("[pageName].buttons.primary")}</button>
  );
}
```

### 5. Content Guidelines

#### Global Messages (`src/i18n/messages/`)
- Navigation labels
- Common button texts (Submit, Cancel, etc.)
- Form validation messages
- Error messages
- System notifications
- Shared UI elements

#### Page-specific Messages (`src/i18n/pages/[pageName]/`)
- Page metadata (title, description)
- Hero content
- Section headings and content
- Page-specific CTAs
- Feature descriptions
- Testimonials or quotes

## Example: Discord Page Migration

Before (in global messages):
```json
// src/i18n/messages/en.json
{
  "discord": {
    "metadata": { ... },
    "hero": { ... },
    "servers": { ... }
  }
}
```

After (modular approach):
```json
// src/i18n/pages/discord/en.json
{
  "discord": {
    "metadata": { ... },
    "hero": { ... },
    "servers": { ... }
  }
}
```

Page usage:
```typescript
const t = await getTranslations({
  locale,
  namespace: "pages.discord"
});
```

## Benefits

1. **Maintainability**: Each page's translations are self-contained
2. **Scalability**: Easy to add new pages without cluttering global files
3. **Team Collaboration**: Different team members can work on different pages
4. **Code Splitting**: Smaller translation bundles per page
5. **Clear Separation**: Global vs page-specific content is clearly defined

## Checklist for New Pages

- [ ] Create `src/i18n/pages/[pageName]/` directory
- [ ] Add `en.json` with English translations
- [ ] Add `zh.json` with Chinese translations
- [ ] Use `pages.[pageName]` namespace in page component
- [ ] Implement metadata generation with translations
- [ ] Test language switching functionality
- [ ] Ensure all hardcoded text is replaced with translations
- [ ] Update this document if adding new patterns