# Beekeeper-Suit

The master routing skill for the Beekeeper-Suit repository Cursor setup.

Beekeeper-Suit does not perform work. It routes the primary Cursor agent's tasks to the correct Bee (subagent) in the Army, passing along the paired Stinger (skill) so every delegation arrives fully equipped.

## Entry point

- [`SKILL.md`](./SKILL.md): the skill definition Cursor loads.

## Roster

83 Bees registered. The authoritative roster (each Bee's domain, trigger keywords, and guide link) lives in [`SKILL.md`](./SKILL.md). Every Bee has a dedicated, in-depth guide under [`guides/`](./guides/).

## Adding new Bees

The `hive-registrar` skill forges new Bees end to end. To register a new Bee with Beekeeper-Suit after the artifacts exist:

1. Add the Bee to the roster table in [`SKILL.md`](./SKILL.md).
2. Author a new guide under [`guides/`](./guides/) using [`templates/guide-template.md`](./templates/guide-template.md).
3. Update the multi-Bee orchestration section in `SKILL.md` if the new Bee fits an existing sequence.

## Philosophy

See [`references/philosophy.md`](./references/philosophy.md) for the rationale behind routing over generalization.

---

*Part of the Cursor IDE Army curated by [Mario Aldayuz a.k.a @thenotoriousllama](https://github.com/thenotoriousllama).*
