# i18n Guidelines

- Use next-intl helpers; never reach into locale files with raw imports in components.
- Keep global strings in messages/{locale}.json; page-specific copy belongs under messages/pages/.
- Run pnpm lint after editing JSON to ensure trailing commas and ordering stay intact.
- Update locale metadata (src/i18n/config.ts) when adding languages; remember to localize metadata in routes.
- When changing terminology, document it in content/docs so marketing copy stays aligned.
