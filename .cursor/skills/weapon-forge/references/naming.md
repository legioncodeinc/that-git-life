# Weapon Naming

The Weapon's name mirrors the Angel's name with a suffix swap:

- `<topic>-guardian` → `<topic>-weapon`
- Example: `security-guardian` → `security-weapon`
- Example: `ux-ui-guardian` → `ux-ui-weapon`

## Rules

- All lowercase.
- Hyphens as separators — no spaces, underscores, or camelCase.
- Always ends in `-weapon`.
- The prefix must match the Angel's prefix exactly — no abbreviations, no renaming.

## Why mirror the Angel's name?

- **Discoverability**: the primary Cursor agent and the God router find the Weapon by convention; breaking the pattern breaks routing.
- **Auditability**: when someone sees `security-guardian.md` in `ai-tools/agents/`, they can guess its Weapon lives at `ai-tools/skills/security-weapon/` without a registry lookup.
- **Consistency**: the roster is constantly growing; every deviation from the convention compounds maintenance cost.

## Collisions

Before scaffolding, verify no folder named `<weapon-name>` already exists in `ai-tools/skills/`. If it does, the Angel is not actually new — either you're in Phase 3 of an existing Angel by mistake (hand off to angel-creator), or the prior work should be archived before starting fresh.

## Folder path

The Weapon folder lives at:

```
<repo-root>/ai-tools/skills/<weapon-name>/
```

This is the deployable skills directory. Do not place Weapons in `<repo-root>/legion-ai-tools-factory/skills/` — that folder is for the Factory's own meta-skills (command-center, weapon-forge, angel-creator), not the Weapons they produce.
