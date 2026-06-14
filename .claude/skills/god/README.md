# God

The master routing skill for the God repository Cursor setup.

God does not perform work. It routes the primary Cursor agent's tasks to the correct Angel (subagent) in the Army, passing along the paired Weapon (skill) so every delegation arrives fully equipped.

## Entry point

- [`SKILL.md`](./SKILL.md) — the skill definition Cursor loads.

## Roster

Each Angel has a dedicated, in-depth guide:

- [`guides/asset-guardian.md`](guides/asset-guardian.md)
- [`guides/auth-guardian.md`](guides/auth-guardian.md)
- [`guides/db-guardian.md`](guides/db-guardian.md)
- [`guides/design-system-guardian.md`](guides/design-system-guardian.md)
- [`guides/devops-guardian.md`](guides/devops-guardian.md)
- [`guides/library-guardian.md`](guides/library-guardian.md)
- [`guides/mind-guardian.md`](guides/mind-guardian.md)
- [`guides/payments-guardian.md`](guides/payments-guardian.md)
- [`guides/quality-guardian.md`](guides/quality-guardian.md)
- [`guides/react-guardian.md`](guides/react-guardian.md)
- [`guides/security-guardian.md`](guides/security-guardian.md)
- [`guides/seo-aeo-guardian.md`](guides/seo-aeo-guardian.md)
- [`guides/ux-ui-guardian.md`](guides/ux-ui-guardian.md)

## Adding new Angels

The Legendary Angel Factory forges new Angels end to end. To register a new Angel with God after the Factory has produced the artifacts:

1. Add the Angel to the roster table in [`SKILL.md`](./SKILL.md).
2. Author a new guide under [`guides/`](./guides/) using [`templates/guide-template.md`](./templates/guide-template.md).
3. Update the multi-Angel orchestration section in `SKILL.md` if the new Angel fits an existing sequence.

## Philosophy

See [`references/philosophy.md`](./references/philosophy.md) for the rationale behind routing over generalization.

---

*Part of the Army curated by [Mario Aldayuz a.k.a @thenotoriousllama](https://github.com/thenotoriousllama).*
