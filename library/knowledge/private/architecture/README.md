---
ai_description: |
  ADRs only. Filenames follow `ADR-<n>-<kebab-slug>.md` where <n> is a
  3-digit zero-padded sequential number (or 4+ digit natural for #1000+).
  Each ADR records a single architectural decision: context, decision,
  consequences, alternatives considered. Never overwrite an ADR after it
  ships — write a new ADR that supersedes the old one.
human_description: |
  Architectural decision records. One decision per file. If a decision changes,
  write a new ADR and mark the old one as superseded at its top.
---

# architecture/

ADRs for `that-git-life`. See Schema v2 §4 for naming.

| ADR | Decision |
|---|---|
| [ADR-001](ADR-001-tech-stack.md) | Tech stack: Node + Fastify + better-sqlite3 + React + Vite + Tailwind + Shadcn |
| [ADR-002](ADR-002-single-package-not-monorepo.md) | Ship as a single npm package, not a monorepo |
| [ADR-003](ADR-003-http-localhost-only.md) | Web UI served over plain HTTP on localhost:3050 |
| [ADR-004](ADR-004-state-sqlite-and-keytar.md) | SQLite for app state; OS keychain (keytar) for secrets |
| [ADR-005](ADR-005-native-auto-start-hooks.md) | Native OS hooks for auto-start (Task Scheduler / launchd / systemd) |
| [ADR-006](ADR-006-ide-prompt-install-one.md) | Install script prompts for one IDE and installs only that one |
| [ADR-007](ADR-007-skills-bundled-plus-remote-sync.md) | Skills/agents bundled in package + periodic remote sync |
| [ADR-008](ADR-008-signup-tabs-plus-blocking-checklist.md) | Affiliate signups open in browser tabs; web UI surfaces a blocking checklist |
| [ADR-009](ADR-009-ssh-key-github-root-and-api-upload.md) | SSH key generated in chosen GitHub root, public key auto-uploaded via GitHub API |
| [ADR-010](ADR-010-library-schema-v2-canonical.md) | Library Schema v2 is the canonical repo template |
