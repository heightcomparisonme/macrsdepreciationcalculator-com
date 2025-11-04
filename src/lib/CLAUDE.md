# Library Guidelines

- Utilities in src/lib must stay framework-agnostic; no direct React or Next imports.
- Prefer pure functions with clear inputs/outputs; document tricky behavior in JSDoc.
- Reuse existing helpers before adding new ones¡ªsearch the directory first.
- Ensure storage/auth helpers read required env vars defensively and surface clear errors.
- When adding new utils, create accompanying tests and reference them in .claude/docs/project-overview.md if they affect workflows.
