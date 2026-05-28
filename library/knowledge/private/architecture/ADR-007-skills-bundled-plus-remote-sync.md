# ADR-007 — Skills bundled in the package + periodic remote sync

- **Status:** Accepted
- **Date:** 2026-05-23
- **Decision owner:** Mario Aldayuz
- **Supersedes:** —

## Context

The brief calls for global skills/agents that match the chosen IDE. We need to decide where the canonical skill set lives, how it ships to user machines, and how updates roll out.

## Decision

Two-tier delivery:

1. **Bundled baseline** ships inside the npm package at `src/skills/bundled/`. On first boot, TGL copies the relevant subset (Cursor or Claude Code, based on ADR-006) into the IDE's global skills directory:
   - Cursor: `~/.cursor/rules/` and/or `~/.cursor/extensions/<ext>/skills/` (TBD — confirmed in PRD-009).
   - Claude Code: `~/.claude/skills/`.
2. **Remote sync** runs daily (and on demand from the web UI) against `github.com/the-notorious-llama/global-skills`. New or updated skills are pulled into a separate folder (`~/.tgl/skills-remote/`) and then merged into the IDE's global directory.

## Why

- **Bundled baseline = works offline, works on first install** with no network race.
- **Remote sync = new skills land without a package release.** Skill authors push to the global-skills repo and users get them within a day.
- **Separation of concerns.** The npm package version is independent of the skill catalog version.

## Sync model

| Aspect | Decision |
|---|---|
| Source repo | `github.com/the-notorious-llama/global-skills` (public, read-only) |
| Pull mechanism | `git clone --depth 1` on first run, `git pull --ff-only` on subsequent syncs |
| Cadence | Daily at 03:00 local + manual "Sync now" button in the UI |
| Conflict policy | Remote always wins for unmodified files. User-edited files (detected by hash) are preserved and flagged in the UI. |
| Opt-out | Settings toggle: "Auto-sync community skills" (default ON). |

## Consequences

- The global-skills repo must exist and follow a predictable folder convention so the sync code can detect which files map to Cursor vs Claude Code. The convention is defined in `library/knowledge/private/skills/remote-sync.md` and the repo's own README.
- We bundle the baseline at build time (`scripts/bundle-skills.ts`) so users without internet still get a working set.
- If GitHub is unreachable, TGL falls back to the bundled set silently. Errors surface in `tgl doctor` and the settings page, not as a startup-blocking modal.

## Alternatives considered

| Alternative | Why rejected |
|---|---|
| Bundle only | Requires a new npm release every time a skill changes. |
| Remote only | First boot fails offline; no determinism on what ships v1.0. |
| User-curated only | Forces every user to discover and install skills manually — defeats the point of TGL. |
| Pull from npm registry | More moving parts (publishing flow, scoped packages); a git repo is simpler and human-editable. |
