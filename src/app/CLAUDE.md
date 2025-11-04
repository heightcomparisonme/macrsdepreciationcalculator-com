# App Router Guidelines

- Routes are locale-aware: every page lives under [locale]/. Keep generateMetadata localized.
- Prefer Server Components for pages/layouts; mark files with 'use client' only when interactivity is required.
- API routes sit in src/app/api/; follow RESTful patterns, validate with Zod, and return helpers from @/lib/resp.
- Co-locate loading.tsx, error.tsx, and 
ot-found.tsx for UX consistency.
- Keep copy in translation files¡ªnever hardcode strings; use getTranslations / useTranslations.
- When adding new routes, update navigation blocks in src/components/blocks and docs under content/ if needed.
