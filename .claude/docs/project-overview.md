# Project Overview

## Stack Snapshot
- **Framework**: Next.js 15 (App Router, internationalized routing, Server Components)
- **Runtime**: TypeScript with strict settings, pnpm for package management
- **UI**: TailwindCSS + Radix/Shadcn component system
- **Backend**: App Router API routes backed by Drizzle ORM + PostgreSQL
- **Auth**: NextAuth.js 5 beta with social providers and Google One Tap
- **Payments**: Stripe subscriptions, one-time payments, and credit bundles
- **AI**: Multi-provider AI SDK (OpenAI, Replicate, DeepSeek, Kling, OpenRouter)

## Directory Map
- src/app/: Route groups (default), (admin), (docs), (legal), API endpoints, and locale-aware layout
- src/components/: Blocks, console widgets, dashboard UI, and shared Shadcn primitives
- src/db/: Drizzle schema, migrations, and database utilities
- src/models/: Data-layer helpers sitting on top of Drizzle queries
- src/services/: Business logic (billing, AI orchestration, notifications)
- src/aisdk/: Provider bindings (e.g., Kling) and video generation helpers
- src/integrations/: Stripe, Creem, and third-party service adapters
- src/i18n/: next-intl setup plus locale message bundles
- content/: MDX documentation consumed by Fumadocs
- messages/: Global translation overrides (root-level)
- public/: Static assets (logos, favicons, hero imagery)

## Core Systems
- **Authentication**: Social auth, email magic links, role-based access surfaced in (admin)
- **Billing**: Stripe checkout, customer portal, credits ledger, affiliate rewards
- **AI Workflows**: Text-to-image/video pipelines with storage upload, credit metering
- **Content Management**: Blog posts, documentation pages, legal documents via MDX
- **Analytics**: Optional providers (Google Analytics, Plausible, OpenPanel) wired for opt-in

## Database Cheat Sheet
- users, ccounts, sessions, erificationTokens
- orders, subscriptions, credits, 	ransactions
- pikeys, eedbacks, ffiliates
- posts, categories, 	ags, post_translations
- Add tables through Drizzle migrations (pnpm db:generate + pnpm db:migrate) and update types in src/types/

## Frontend Conventions
- Components in src/components/blocks map to marketing/landing use-cases
- Console/dashboard widgets live in src/components/console and src/components/dashboard
- Favor Server Components at the page level; use Client Components only when interactivity is required
- Keep layout text localized (getMessages, useTranslations), and update messages/ files when changing copy

## AI & Storage
- Providers configured in src/aisdk/ with helper utilities in src/aisdk/generate-*
- Storage helpers live in src/lib/storage.ts; upload artifacts with explicit content types and credit ledger updates
- Follow the workflow documented in .claude/docs/ai-workflow.md when touching AI or credit logic

## Testing & Quality
- Run pnpm lint before landing changes; follow ESLint + Prettier defaults
- Co-locate Vitest/Jest tests as *.test.ts(x) or use 	ests/
- Maintain ¡Ý80% coverage on touched files when adding new logic

## Deployment Targets
- Vercel and Cloudflare supported via ercel.json + wrangler.toml
- Dockerfile provides production container build (pnpm docker:build)
- Environment variables belong in .env.local; mirror keys in .env.example

Refer back to this document instead of keeping long-form explanations in front-line prompts.
