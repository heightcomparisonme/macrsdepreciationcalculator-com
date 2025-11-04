# Database Guidelines

- Schema lives in schema.ts; use Drizzle helpers (pgTable, archar, 	imestamp) and include uuid, created_at, updated_at fields.
- Generate migrations with pnpm db:generate and apply via pnpm db:migrate; never edit SQL by hand.
- Mirror schema changes in TypeScript types under src/types/ and models under src/models/.
- Keep naming consistent (snake_case for columns, singular table names when legacy requires).
- Index frequently queried fields and document schema updates in content/docs when they affect users.
