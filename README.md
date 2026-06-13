# That Git Life

> **Get the Git life.** A one-shot dev-environment installer + always-on local service that keeps your GitHub folder healthy, standardized, and ready to vibe.

`@legioncodeinc/that-git-life` is a globally-installed npm package by [Legion Code Inc.](https://www.legioncodeinc.com). It ships a single-command installer (Windows + macOS + Linux), a background service on `http://localhost:3050`, and a React web UI that runs your day-to-day: standardize new repos, scan existing ones for drift, manage your GitHub root, and sync skills/agents for Cursor or Claude Code.

---

## What this repo is

This repo is the **planning + source of truth** for the product. Cursor (or another AI coding agent) reads the docs here and builds the product against them. Nothing here is shipping code yet — this is the blueprint.

| Where | What's in it |
|---|---|
| [`library/`](library/) | Library Schema v2 scaffold — lifecycle folder structure (knowledge, requirements, issues, notes) with seeded READMEs. |
| [`.cursor/`](.cursor/) | Cursor agent definitions, skills, and project rules. |
| [`prd-execution-prompt.md`](prd-execution-prompt.md) | Orchestration prompt for running all PRDs end-to-end with sub-agents. |
| `README.md` | This file. |
| `LICENSE.md` | License. |

Nothing here is shipping code yet. Cursor picks up [`prd-execution-prompt.md`](prd-execution-prompt.md) and builds the product from the PRDs.

---

## Cursor agent + skill infrastructure

The `.cursor/` directory wires up the agents and project rules active in this repo:

| Path | What it does |
|---|---|
| `.cursor/agents/library-guardian.md` | Agent that owns the full documentation lifecycle: scaffolding, PRD/IRD authoring, knowledge-base docs, sync audits, lifecycle moves. |
| `.cursor/agents/knowledge-guardian.md` | Agent that authors narrative knowledge docs (system overviews, auth architecture, Mermaid diagrams, SQL schemas, etc.) under `library/knowledge/`. |
| `.cursor/skills/library-weapon/` | Skill package for the library-guardian agent — guides, templates, and examples for every documentation workflow. |
| `.cursor/skills/knowledge-weapon/` | Skill package for the knowledge-guardian agent — domain taxonomy, document format guide, analysis workflow, and templates. |
| `.cursor/rules/no-em-dashes.mdc` | Project rule: no em dashes or en dashes in any authored prose. |
| `.cursor/rules/respect-agent-work-boundaries.mdc` | Project rule: agents never modify files owned by another active agent or parallel session. |

---

## License

See [`LICENSE.md`](LICENSE.md).

---

<sub>We are Legion. Vibe with Legion.</sub>
