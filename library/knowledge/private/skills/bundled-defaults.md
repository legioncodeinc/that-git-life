# Bundled skills + agents — defaults

- **Category:** Reference
- **Status:** Canonical
- **Last updated:** 2026-05-23

What ships in the box when a user installs `@thenotoriousllama/that-git-life`. Implements ADR-007 (tier 1: bundled baseline).

---

## Folder layout (inside the package)

```
src/skills/bundled/
  cursor/                          # Cursor format (.cursor/rules/, .cursor/agents/)
    rules/
      <skill-id>/
        SKILL.md
        <supporting files>
    agents/
      <agent-id>/
        AGENT.md
  claude-code/                     # Claude Code format (.claude/skills/)
    skills/
      <skill-id>/
        SKILL.md
        <supporting files>
    agents/
      <agent-id>/
        AGENT.md
  shared/                          # canonical source (markdown + assets)
    <skill-id>/
      SKILL.md                     # platform-agnostic source
      <supporting files>
```

`shared/` is the authoring source of truth. A build step (`scripts/build-skills.ts`) compiles each shared skill into both Cursor and Claude Code formats.

---

## Baseline skill set (v1)

These ship in the package. Cursor sees them at `~/.cursor/rules/<skill-id>/`. Claude Code sees them at `~/.claude/skills/<skill-id>/`.

| Skill ID | Purpose |
|---|---|
| `notorious-llama-design` | Apply the Notorious Llama brand (loud dial) when generating UI or marketing artifacts. Mirrors the existing skill in `The Notorious Llama/`. |
| `library-schema-v2-guardian` | Enforce Schema v2 in any repo Cursor is editing. Refuses to write to `library/notes/`. |
| `prd-author` | Draft PRDs in the Schema v2 PRD template. |
| `ird-author` | Draft IRDs from a GitHub issue. |
| `adr-author` | Draft ADRs using the documentation framework template. |
| `commit-conventions` | Write Conventional Commit messages tied to the active PRD/IRD. |
| `git-hygiene` | Suggest fixes when scanner findings reference unpushed commits / stale branches. |

---

## Baseline agent set (v1)

Agents are the longer-running, higher-autonomy peers of skills. Same dual-format build.

| Agent ID | Role |
|---|---|
| `library-guardian` | Walks any repo and reports drift vs Schema v2. Pairs with TGL's standardizer findings. |
| `repo-doctor` | Reads scanner findings and proposes one PR per finding cluster. |
| `signup-orchestrator` | (Cursor only) Helps the user finish the signup checklist via a chat-driven flow. |

---

## Install behavior

On first boot, after the IDE choice is recorded (ADR-006), TGL:

1. Reads `settings.ide`.
2. Picks the matching format directory (`cursor/` or `claude-code/`).
3. Copies the files to the IDE's global skill/agent directory:
   - Cursor: `~/.cursor/` (subfolders `rules/`, `agents/`).
   - Claude Code: `~/.claude/skills/`, `~/.claude/agents/` (paths may differ — verify at implementation time and update this doc).
4. Records each installed skill/agent in the `skills` table (see service `database-schema.md`).

If a skill with the same ID already exists in the user's IDE directory:

- **Identical content** (hash match): skip silently.
- **User-modified** (hash differs from bundled): keep user version; record a `skill-conflict` finding visible in the settings page.
- **Different version from bundled**: replace, but only after asking the user via the UI.

---

## Authoring guidance for `shared/`

Each shared skill folder contains:

- `SKILL.md` with frontmatter:
  ```yaml
  ---
  id: <kebab-id>
  name: Human Friendly Name
  description: One-line description Cursor/Claude Code will use.
  version: 0.1.0
  formats: [cursor, claude-code]
  ---
  ```
- Optional supporting files referenced by relative path from `SKILL.md`.

The build step:

- Copies the folder to both `cursor/rules/<id>/` and `claude-code/skills/<id>/`.
- Adjusts file paths in `SKILL.md` if the IDE expects a specific layout.
- Computes a content hash and writes it to `_meta.json` per format.

---

## Versioning

- Each skill has its own `version` field in `SKILL.md`.
- A skill update goes out via either (a) a new TGL package release that re-bundles, or (b) the remote sync from `the-notorious-llama/global-skills` (see [`remote-sync.md`](remote-sync.md)).
- The remote-sync repo has the same `shared/` layout. When it pulls in, the same build step runs locally.

---

## What this set is NOT

- Not a marketplace. There's no install/uninstall UI for community skills in v1.
- Not localizable. English-only.
- Not user-authored. Users author skills in their IDE's own conventions; TGL only manages the bundled + remote-synced ones.
