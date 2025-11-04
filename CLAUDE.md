# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# Project Rules for Claude Code

## Required Workflow (before and after each edit)
1) **Before editing (PLAN)**
   - Open `.same/todos.md`. Under today’s date, add a **Plan** section listing the intended changes, files/modules to touch, potential side effects, and test points.
   - If today’s date section does not exist, create it as: `## YYYY-MM-DD`.

2) **After editing (DONE & NEXT)**
   - Return to the same date in `.same/todos.md` and add:
     - **Done**: bullet points summarizing what actually changed (files, functions, behavior).
     - **Next**: follow-ups and tech debt to address later (carry over any unfinished items).
   - In **Plan**, mark completed checklist items as `[x]`; leave unfinished items as `[ ]`.

3) **Formatting Rules**
   - Only update **today’s** section per session; add sub-items for minor changes when necessary.
   - In **Done**, include a brief key diff summary or highlights (not the full diff).
   - All updates must be **written to the file**, not just described in chat.

## `.same/todos.md` Template (Claude must follow)
### Example (create this for today if missing):
## 2025-08-29
### Plan
- [ ] Purpose: split 1/2/3 combo toggle logic in `components/Hero`
- [ ] Impact: route lazy loading, animation sync
- [ ] Tests: SSR first paint, toggle button usability, accessibility

### Done
- [x] Lifted `hero-one`/`hero-two` state into `HeroSwitcher.tsx`
- [x] Bound the green button to the toggle handler; added 3 unit tests
- Key points: removed redundant side effects; fixed FOUC issue

### Next
- [ ] Collect beta user feedback & analytics
- [ ] Add demo GIF to `/docs/hero-switch.md`

## Claude Behavior Requirements
- **Before starting work**, write/complete **Plan**; **after finishing**, write **Done** and **Next**.
- If today’s section is missing, **create it before touching code**.
- If attempting to commit without updating `.same/todos.md`, warn the user and **update it immediately**.

  
## Development Commands

### Core Development
- `pnpm dev` - Start development server with Turbopack
- `pnpm build` - Build the application for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint for code quality checks
- `pnpm analyze` - Analyze bundle size with webpack-bundle-analyzer

### Database Operations (Drizzle ORM)
- `pnpm db:generate` - Generate new migration files based on schema changes
- `pnpm db:migrate` - Apply pending migrations to the database
- `pnpm db:push` - Sync schema changes directly to the database (development only)
- `pnpm db:studio` - Open Drizzle Studio for database inspection and management

### Docker Operations
- `pnpm docker:build` - Build Docker image for production deployment

### Content Processing
- `postinstall` automatically runs `fumadocs-mdx` to process MDX content

## Project Architecture

This is a **saas** - a Next.js 16 full-stack saas application template designed to ship AI startups quickly.

### Core Stack
- **Framework**: Next.js 15 with App Router and Turbopack
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: NextAuth.js 5 (beta) with social providers (Google, GitHub) and Google One Tap
- **Payments**: Stripe integration with subscription and one-time payments
- **UI**: Radix UI components with TailwindCSS 4.x
- **State Management**: React Context for app state
- **Internationalization**: next-intl with English and Chinese locales
- **Content**: Fumadocs for documentation and MDX for content
- **AI Integration**: AI SDK with multiple providers (OpenAI, Replicate, DeepSeek, OpenRouter)
- **Code Quality**: ESLint and TypeScript for code quality

### Key Directory Structure
- `src/app/` - Next.js app router with internationalized routing
  - `[locale]/` - Locale-specific pages with internationalization
  - `(admin)/` - Admin dashboard and user management
  - `(default)/` - Main application pages (console, pricing, posts, etc.)
  - `(docs)/` - Documentation pages with Fumadocs
  - `(legal)/` - Legal pages (privacy policy, terms of service)
  - `api/` - API routes for backend operations
- `src/components/` - Reusable React components organized by feature
  - `blocks/` - Layout blocks (header, footer, hero, pricing, etc.)
  - `ui/` - Shadcn UI components
  - `console/` - Console dashboard components
  - `dashboard/` - Admin dashboard components
- `src/lib/` - Utility functions and shared libraries
- `src/db/` - Database schema and migrations with Drizzle ORM
- `src/auth/` - NextAuth.js configuration and handlers
- `src/hooks/` - Custom React hooks
- `src/i18n/` - Internationalization setup with next-intl
  - `messages/` - Global translation files (en.json, zh.json)
  - `pages/` - Page-specific translations
- `src/models/` - Data models and database operations
- `src/services/` - Business logic and service layer
- `src/types/` - TypeScript type definitions
- `src/contexts/` - React context providers
- `src/aisdk/` - AI SDK integrations and video generation
  - `kling/` - Kling AI provider implementation
  - `generate-video/` - Video generation utilities
- `src/integrations/` - Third-party service integrations (Stripe, Creem)
- `content/` - MDX content files for documentation
- `messages/` - Root-level translation files for internationalization

### Authentication & User Management
- Uses NextAuth.js 5 (beta) with PostgreSQL integration
- Supports social login (Google, GitHub) and Google One Tap authentication
- Custom user management with UUID-based identification
- Invite code system and affiliate tracking
- Admin dashboard for user management
- User profile management with avatar and locale support

### Payment System
- Stripe integration for subscriptions and one-time payments
- Credit-based system for pay-per-use AI features
- Order management with detailed tracking
- Support for multiple currencies and billing intervals
- Affiliate reward system integration

### AI Features & Integrations
- **AI SDK**: Multi-provider AI integration (OpenAI, Replicate, DeepSeek, OpenRouter)
- **Video Generation**: Kling AI provider for text-to-video generation
- **Image Generation**: Support for multiple AI image generation providers
- **Custom AI Models**: Extensible AI provider system

### Content Management
- **Documentation**: Fumadocs-powered documentation system
- **Blog**: Post management with categories and localization
- **MDX**: Rich content creation with MDX support
- **Internationalization**: Full i18n support for English and Chinese

### Development Workflow
1. Use TypeScript for all new code with strict type checking
2. Follow ESLint rules and consistent code formatting
3. Implement API routes in `src/app/api/`
4. Use React Context for client-side state management
5. Implement database changes through Drizzle migrations
6. Use Radix UI components and Shadcn UI for consistent design
7. Follow the established directory structure and naming conventions
8. Use proper error handling with error.tsx and not-found.tsx
9. Leverage Next.js 15 features like App Router and Server Components
10. Implement internationalization for all user-facing content

## Internationalization Standards for New Pages

When adding new pages with multilingual support, follow this standardized approach:

### File Structure
```
src/i18n/
├── messages/          # Global shared translations (navigation, common UI, errors)
│   ├── en.json
│   └── de.json
└── pages/            # Page-specific translations
    └── [pageName]/   # Create a folder for each new page
        ├── en.json
        └── de.json
```

### Implementation Steps for New Pages

1. **Create Translation Files**
   - Create directory: `src/i18n/pages/[pageName]/`
   - Add `en.json` and `zh.json` with structured translations

2. **Structure Translation Keys**
   ```json
   {
     "[pageName]": {
       "metadata": {
         "title": "Page Title",
         "description": "Page SEO description"
       },
       "sections": {
         // Group translations by component/section
       }
     }
   }
   ```

3. **Use in Page Components**
   ```typescript
   // In page.tsx
   const t = await getTranslations({
     locale,
     namespace: "pages.[pageName]"
   });

   // Access translations
   t("[pageName].metadata.title")
   ```

4. **Component Translation Access**
   ```typescript
   // In client components
   const t = useTranslations("pages.[pageName]");
   ```

5. **Keep Global vs Page-specific Separation**
   - Global: Navigation, buttons, common labels, error messages
   - Page-specific: Content, headings, descriptions unique to that page

### Example: Adding a "Features" Page
```
1. Create: src/i18n/pages/features/en.json
2. Create: src/i18n/pages/features/zh.json
3. In page.tsx: getTranslations({ namespace: "pages.features" })
4. Never mix page content in src/i18n/messages/
```

### Configuration
- **Next.js**: Configuration in `next.config.mjs` with MDX, bundle analyzer, and i18n
- **Database**: Drizzle config in `src/db/config.ts`
- **TypeScript**: Config with path aliases (@/* for src/*)
- **Authentication**: NextAuth.js config in `src/auth/config.ts`
- **Internationalization**: next-intl setup in `src/i18n/`
- **Environment**: Template in `.env.example`

### Database Schema
The application uses PostgreSQL with Drizzle ORM and includes these main tables:
- `users` - User accounts with social auth integration
- `orders` - Payment and subscription tracking
- `credits` - Credit transaction system
- `apikeys` - API key management
- `posts` - Blog content management
- `categories` - Content categorization
- `affiliates` - Affiliate program tracking
- `feedbacks` - User feedback collection

### Code Quality & Tools
- **Linting**: ESLint with Next.js configuration
- **Type Safety**: TypeScript with strict mode
- **UI Components**: Radix UI with TailwindCSS 4.x
- **Form Handling**: React Hook Form with Zod validation
- **State Management**: React Context patterns
- **Icons**: Lucide React and Tabler Icons

## Important Notes

- **Package Manager**: Uses pnpm for dependency management
- **Database**: PostgreSQL with comprehensive schema in `src/db/schema.ts`
- **Themes**: Supports light and dark themes with next-themes
- **Content**: MDX-based content management in `content/` directory
- **Deployment**: Supports both Vercel and Cloudflare deployment
- **Docker**: Production-ready Dockerfile included
- **AI Integration**: Extensible AI provider system with video generation capabilities
- **Internationalization**: Complete i18n support with English and Chinese locales
- **Analytics**: Multiple analytics providers support (Google Analytics, Plausible, OpenPanel)
- **Performance**: Uses Turbopack for fast development builds

## Project Template Information

This is **Mondkalender Template One** - a production-ready Mondkalender boilerplate designed to help developers ship AI startups quickly. The template includes:

- Complete authentication and user management system
- Stripe payment integration with subscription and credit systems
- Multi-provider AI integration capabilities
- Admin dashboard and user console
- Comprehensive internationalization
- Modern UI with Radix UI and TailwindCSS
- Database-driven content management
- SEO-optimized documentation system

For more information, visit [macrsdepreciationcalculator.com](https://macrsdepreciationcalculator.com) and [Documentation](https://docs.macrsdepreciationcalculator.com).
