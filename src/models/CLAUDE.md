# Models Guidelines

- Models wrap Drizzle queries; keep them free of HTTP or UI logic.
- Export CRUD helpers with explicit return types derived from schema (	ypeof table.).
- Handle pagination, sorting, and filtering consistently; reuse helper utilities from src/lib/pagination when available.
- When updating schema, align models and add regression tests to cover edge cases.
- Throw errors on unexpected states instead of returning nullish fallbacks.
