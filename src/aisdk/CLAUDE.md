# AI SDK Guidelines

- Providers live under src/aisdk; register new ones in providers/ and expose helpers via index exports.
- Keep provider configs declarative: wrap external SDK clients and surface a unified interface.
- Generation utilities (generate-video, future generate-image) should stay pure and stream-aware.
- Log provider usage with identifiers; forward metadata to credit ledger services.
- Update .claude/docs/ai-workflow.md when you change generation steps or storage expectations.
