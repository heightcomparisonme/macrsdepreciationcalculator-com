# Repository Guidelines & Development Standards

## Project Overview
This is **Mondkalender ** - a Next.js 15 full-stack Mondkalender application template designed to ship AI startups quickly. The template includes complete authentication, payment systems, AI integration, and content management capabilities.

## Project Structure & Module Organization
- `src/app/`: Next.js App Router with internationalized routing (`[locale]/`)
  - `(admin)/`: Admin dashboard and user management
  - `(default)/`: Main application pages (console, pricing, posts, etc.)
  - `(docs)/`: Documentation pages with Fumadocs
  - `(legal)/`: Legal pages (privacy policy, terms of service)
  - `api/`: API routes for backend operations
- `src/components/`: Reusable React components organized by feature
  - `blocks/`: Layout blocks (header, footer, hero, pricing, etc.)
  - `ui/`: Shadcn UI components
  - `console/`: Console dashboard components
  - `dashboard/`: Admin dashboard components
- `src/lib/`: Utility functions and shared libraries
- `src/db/`: Database schema and migrations with Drizzle ORM
- `src/auth/`: NextAuth.js configuration and handlers
- `src/hooks/`: Custom React hooks
- `src/i18n/`: Internationalization setup with next-intl
  - `messages/`: Global translation files (en.json, zh.json)
  - `pages/`: Page-specific translations
- `src/models/`: Data models and database operations
- `src/services/`: Business logic and service layer
- `src/types/`: TypeScript type definitions
- `src/contexts/`: React context providers
- `src/aisdk/`: AI SDK integrations and video generation
  - `kling/`: Kling AI provider implementation
  - `generate-video/`: Video generation utilities
- `src/integrations/`: Third-party service integrations (Stripe, Creem)
- `content/`: MDX content files for documentation
- `messages/`: Root-level translation files for internationalization
- `public/`: Static assets served as-is
- `tests/` or `src/__tests__/`: Unit/integration tests near code

## Build, Test, and Development Commands
This project uses **pnpm** as the package manager. Core development commands:

### Development
- `pnpm dev`: Start development server with Turbopack
- `pnpm build`: Build the application for production
- `pnpm start`: Start production server
- `pnpm lint`: Run ESLint for code quality checks
- `pnpm analyze`: Analyze bundle size with webpack-bundle-analyzer

### Database Operations (Drizzle ORM)
- `pnpm db:generate`: Generate new migration files based on schema changes
- `pnpm db:migrate`: Apply pending migrations to the database
- `pnpm db:push`: Sync schema changes directly to the database (development only)
- `pnpm db:studio`: Open Drizzle Studio for database inspection and management

### Docker Operations
- `pnpm docker:build`: Build Docker image for production deployment

### Content Processing
- `postinstall` automatically runs `fumadocs-mdx` to process MDX content

## Coding Style & Naming Conventions
- Indentation: 2 spaces. Language: TypeScript (`.ts`, `.tsx`).
- Components: PascalCase filenames (e.g., `AiWorkstation.tsx`).
- Hooks/utilities: camelCase files (e.g., `useSession.ts`, `formatDate.ts`).
- Exports: Prefer named exports; default only for single-component files.
- Tools: ESLint + Prettier; run `npm run lint` and `npm run format:check` in CI.

## Testing Guidelines
- Framework: Jest or Vitest (match the configured one in `package.json`).
- File names: `*.test.ts` / `*.test.tsx` alongside source or under `tests/`.
- Coverage: Target ≥80% for changed lines; add edge cases for hooks and render paths.
- Run: `npm test` (append `-- --coverage` for report if supported).

## Commit & Pull Request Guidelines
- Commits: Follow Conventional Commits (e.g., `feat:`, `fix:`, `chore:`). Keep messages imperative and scoped.
- Branches: `feat/<scope>`, `fix/<scope>`, `chore/<scope>`.
- PRs: Include clear description, linked issues (`Closes #123`), screenshots for UI changes, and a brief testing checklist.

## Security & Configuration Tips
- Secrets: Never commit tokens or keys. Use `.env.local` and `.env.example` for placeholders.
- Types: Prefer explicit types on public APIs; avoid `any`.
- Accessibility: Ensure interactive components have keyboard and ARIA support.

---

# New Feature Development Guide

## 8-Step Feature Development Process
When adding new features (like wallpaper functionality), follow this standardized process:

### 1. Database Schema Design
**Location**: `src/db/schema.ts`

Add your new table definition using Drizzle ORM:
```typescript
export const your_table = pgTable("your_table", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  uuid: varchar({ length: 255 }).notNull().unique(),
  created_at: timestamp({ withTimezone: true }),
  updated_at: timestamp({ withTimezone: true }),
  // Add your specific fields here
  status: varchar({ length: 50 }).notNull().default("active"),
});
```

### 2. TypeScript Interface Definition
**Location**: `src/types/[feature-name].d.ts`

Create comprehensive type definitions:
```typescript
export interface YourFeature {
  id: number;
  uuid: string;
  created_at?: Date | string;
  updated_at?: Date | string;
  // Define your interface fields
  status: string;
}

export interface YourFeatureFilter {
  // Define filter parameters
}

export interface YourFeatureProps {
  // Define component props
}
```

### 3. Database Migration & Verification
Push your schema changes:
```bash
# Push changes directly (development)
pnpm db:push

# Or generate migration files (production)
pnpm db:generate
pnpm db:migrate

# Verify in Drizzle Studio
pnpm db:studio
```

**Verify in Supabase**:
1. Login to Supabase dashboard
2. Navigate to **Table Editor**
3. Verify the new table was created
4. Check column types and constraints

### 4. Data Operations Model (CRUD)
**Location**: `src/models/[feature-name].ts`

Implement complete CRUD operations:
```typescript
import { db } from "@/db";
import { your_table } from "@/db/schema";
import { desc, eq, like } from "drizzle-orm";

export type YourTableRow = typeof your_table.$inferSelect;
export type NewYourTable = typeof your_table.$inferInsert;

// CREATE
export async function createYourRecord(input: NewYourTable): Promise<YourTableRow> {
  const database = db();
  const [row] = await database.insert(your_table).values(input).returning();
  return row;
}

// READ
export async function listYourRecords(page: number = 1, limit: number = 20): Promise<YourTableRow[]> {
  const database = db();
  const offset = (page - 1) * limit;
  return database
    .select()
    .from(your_table)
    .orderBy(desc(your_table.created_at))
    .limit(limit)
    .offset(offset);
}

// UPDATE
export async function updateYourRecord(
  uuid: string, 
  updates: Partial<NewYourTable>
): Promise<YourTableRow | null> {
  const database = db();
  const [row] = await database
    .update(your_table)
    .set(updates)
    .where(eq(your_table.uuid, uuid))
    .returning();
  return row ?? null;
}

// DELETE
export async function deleteYourRecord(uuid: string): Promise<number> {
  const database = db();
  const result = await database
    .delete(your_table)
    .where(eq(your_table.uuid, uuid));
  return (result as unknown as { rowCount?: number }).rowCount ?? 0;
}
```

### 5. OSS Storage Configuration
**Environment Variables** (`.env.local`):
```env
STORAGE_ENDPOINT="https://your-endpoint.r2.cloudflarestorage.com"
STORAGE_ACCESS_KEY="your-access-key"
STORAGE_SECRET_KEY="your-secret-key"
STORAGE_BUCKET="your-bucket"
STORAGE_DOMAIN="your-domain.com"
```

**Usage** (already configured in `src/lib/storage.ts`):
```typescript
import { newStorage } from "@/lib/storage";

const storage = newStorage();
const result = await storage.uploadFile({
  body: buffer,
  key: `your-feature/${filename}`,
  contentType: "image/jpeg",
  disposition: "inline"
});
```

### 6. API Routes with AI Integration
**Location**: `src/app/api/[feature-name]/`

#### Basic CRUD Routes
```typescript
// src/app/api/your-feature/route.ts
import { NextRequest } from "next/server";
import { respData, respErr } from "@/lib/resp";

export async function GET(request: NextRequest) {
  // List records with pagination and filters
}

export async function POST(request: NextRequest) {
  // Create new record
}
```

#### AI-Powered Generation Route
```typescript
// src/app/api/your-feature/generate/route.ts
import { generateText2Image } from "@/aisdk/generate-text2image";
import { kling } from "@/aisdk/kling";
import { openai } from "@ai-sdk/openai";
import { replicate } from "@ai-sdk/replicate";

export async function POST(request: NextRequest) {
  // AI generation logic with multi-provider support
  const { prompt, provider = "kling", model, style } = await request.json();
  
  let imageModel;
  switch (provider) {
    case "kling":
      imageModel = kling.image(model || "kling-v1");
      break;
    case "openai":
      imageModel = openai.image(model || "dall-e-3");
      break;
    case "replicate":
      imageModel = replicate.image(model || "stability-ai/sdxl");
      break;
  }
  
  const result = await generateText2Image({
    model: imageModel,
    prompt,
    // other parameters
  });
  
  // Upload to storage and save to database
}
```

### 7. Configuration Constants
**Location**: `src/services/constant.ts`

Add feature-specific constants:
```typescript
export const YourFeatureConfig = {
  Categories: [
    { uuid: "category1", name: "Category 1", name_zh: "分类1", sort: 1 },
  ],
  
  Status: {
    Active: "active",
    Inactive: "inactive",
    Pending: "pending",
  },
  
  // AI Provider Configuration
  AIProviders: {
    kling: {
      name: "Kling AI",
      models: ["kling-v1", "kling-v1.5"],
      cost_per_generation: 10,
    },
    openai: {
      name: "OpenAI DALL-E",
      models: ["dall-e-3", "dall-e-2"],
      cost_per_generation: 15,
    },
  }
};
```

### 8. Frontend Component Design
**Location**: `src/components/blocks/[feature-name]/`

Create reusable, composable components:

#### Main Component Structure
```
src/components/blocks/your-feature/
├── index.tsx              # Main feature component
├── FeatureCard.tsx        # Individual item card
├── FeatureGrid.tsx        # Grid layout
├── FeatureFilter.tsx      # Filter/search component
├── FeatureModal.tsx       # Detail/action modal
├── FeatureUpload.tsx      # Upload functionality
└── CategoryNav.tsx        # Category navigation
```

#### Example Component
```typescript
// src/components/blocks/your-feature/FeatureCard.tsx
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface FeatureCardProps {
  item: YourFeature;
  onAction?: (item: YourFeature) => void;
}

export function FeatureCard({ item, onAction }: FeatureCardProps) {
  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-shadow">
      <CardContent className="p-4">
        <h3 className="font-semibold truncate">{item.title}</h3>
        {item.description && (
          <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
            {item.description}
          </p>
        )}
        <div className="flex items-center justify-between mt-3">
          <Badge variant="secondary">{item.status}</Badge>
          <Button size="sm" onClick={() => onAction?.(item)}>
            Action
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
```

#### Page Integration
```typescript
// src/app/[locale]/(default)/your-feature/page.tsx
import { FeatureGrid } from "@/components/blocks/your-feature/FeatureGrid";
import { FeatureFilter } from "@/components/blocks/your-feature/FeatureFilter";

export default function YourFeaturePage() {
  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="lg:w-64">
          <FeatureFilter />
        </aside>
        <main className="flex-1">
          <FeatureGrid />
        </main>
      </div>
    </div>
  );
}
```

## Best Practices for New Features

### Database Design
- Always use UUIDs for public-facing IDs
- Include `created_at` and `updated_at` timestamps
- Use appropriate data types and constraints
- Consider indexing for frequently queried fields

### API Design
- Follow RESTful conventions
- Use proper HTTP status codes
- Implement comprehensive error handling
- Add input validation with Zod schemas

### Component Architecture
- Keep components small and focused
- Use composition over inheritance
- Make components reusable across features
- Follow existing UI patterns (Radix UI + TailwindCSS)
- Support internationalization (i18n)

### AI Integration
- Support multiple AI providers
- Implement proper credit/billing system
- Handle different output formats (URL, base64, etc.)
- Include comprehensive error handling
- Support async operations and polling

### Testing Your Implementation
1. **Database**: Use `pnpm db:studio` to verify schema
2. **API**: Test endpoints with tools like Postman
3. **Components**: Test responsive design and interactions
4. **Integration**: Test the complete user flow
5. **Performance**: Monitor query performance and bundle size

## Documentation
After implementing a new feature, update:
1. `content/docs/` - Add feature documentation
2. `README.md` - Update feature list and setup instructions
3. `CHANGELOG.md` - Document changes and new features
4. Type definitions - Ensure complete TypeScript coverage

This standardized process ensures consistency, maintainability, and scalability across all new features in the application.
