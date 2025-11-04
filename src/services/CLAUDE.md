# Services Guidelines

- Services coordinate models, integrations, and side effects¡ªkeep them stateless and deterministic.
- Separate pure helpers from I/O layers; inject dependencies where possible for testability.
- Handle billing, credits, and notifications through dedicated helpers; never mix UI concerns here.
- Document new workflows in .claude/docs and add corresponding tests under 	ests/ or alongside the service.
- Keep functions typed explicitly and prefer returning structured result objects over loose primitives.
