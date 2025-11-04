# Components Guidelines

- Use PascalCase filenames; export React components as named exports unless the file holds a single default export component.
- Favor composition: keep logic in hooks or services, UI in lightweight display components.
- Tailwind classes should align with existing design tokens; reuse Shadcn primitives from @/components/ui.
- Ensure accessibility: keyboard focus states, ria-* attributes, and visible labels.
- Keep text localized; pull copy from messages/ or pass translated strings via props.
- Add stories/docs under content/ or /docs when introducing new blocks.
