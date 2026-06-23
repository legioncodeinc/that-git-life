# Stinger Naming

The Stinger's name mirrors the Bee's name with a suffix swap:

- `<topic>-worker-bee` → `<topic>-stinger`
- Example: `security-worker-bee` → `security-stinger`
- Example: `ux-ui-worker-bee` → `ux-ui-stinger`

## Rules

- All lowercase.
- Hyphens as separators — no spaces, underscores, or camelCase.
- Always ends in `-stinger`.
- The prefix must match the Bee's prefix exactly — no abbreviations, no renaming.

## Why mirror the Bee's name?

- **Discoverability**: the primary Cursor agent and the beekeeper-suit router find the Stinger by convention; breaking the pattern breaks routing.
- **Auditability**: when someone sees `security-worker-bee.md` in `ai-tools/agents/`, they can guess its Stinger lives at `ai-tools/skills/security-stinger/` without a registry lookup.
- **Consistency**: the roster is constantly growing; every deviation from the convention compounds maintenance cost.

## Collisions

Before scaffolding, verify no folder named `<stinger-name>` already exists in `ai-tools/skills/`. If it does, the Bee is not actually new — either you're in Phase 3 of an existing Bee by mistake (hand off to bee-creator), or the prior work should be archived before starting fresh.

## Folder path

The Stinger folder lives at:

```
<repo-root>/ai-tools/skills/<stinger-name>/
```

This is the deployable skills directory. Do not place Stingers in `<repo-root>/legion-ai-tools-factory/skills/` — that folder is for the Factory's own meta-skills (command-center, stinger-forge, bee-creator), not the Stingers they produce.
