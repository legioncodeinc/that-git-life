# That Git Life

> **Get the Git life.** A one-shot dev-environment installer + always-on local service that keeps your GitHub folder healthy, standardized, and ready to vibe.

`@legioncodeinc/that-git-life` is a globally-installed npm package by [Legion Code Inc.](https://www.legioncodeinc.com). It ships a single-command installer (Windows + macOS + Linux), a background service on `http://localhost:3050`, and a React web UI that runs your day-to-day: standardize new repos, scan existing ones for drift, manage your GitHub root, and sync skills/agents for Cursor or Claude Code.

---

## What this repo is

This repo is the **planning + source of truth** for the product. Cursor (or another AI coding agent) reads the docs in [`library/`](library/) and builds the product against them. Nothing here is shipping code yet — this is the blueprint.

| Where | What's in it |
|---|---|
| [`library/`](library/) | Full documentation library — ADRs, PRDs, standards, domain references. Follows [Library Schema v2](library/knowledge/private/standardizer/schema-v2.md). |
| `README.md` | This file. |
| `LICENSE.md` | License. |

There is no `src/`, `bin/`, or `service/` yet. Those get scaffolded by Cursor when it picks up PRD-001 and walks the backlog in order.

---

## For the human reader (Mario)

You handed me this brief on 2026-05-23. The conversation that produced these docs locked in the following decisions — all captured as ADRs in [`library/knowledge/private/architecture/`](library/knowledge/private/architecture/):

- Single npm package, not a monorepo.
- Node + Fastify backend, React + Vite + Tailwind + Shadcn web UI.
- Plain HTTP on `localhost:3050`.
- SQLite for state, OS keychain for the GitHub PAT.
- Install script prompts for one IDE (Cursor Pro **or** VS Code + Claude Code Max), installs that one only.
- Affiliate signups open as browser tabs during install **and** appear as a blocking checklist in the first-boot web UI.
- SSH key generated in the chosen GitHub root, public key auto-uploaded to GitHub via the API.
- Native OS hooks for auto-start (Task Scheduler / launchd / systemd).
- Skills bundled in the package + periodic sync from `github.com/the-notorious-llama/global-skills`.
- Library Schema v2 is the canonical template for every repo TGL standardizes.

---

## For Cursor

Start here, in order:

1. **Read** [`library/knowledge/private/standards/documentation-framework.md`](library/knowledge/private/standards/documentation-framework.md) and [`coding-conventions.md`](library/knowledge/private/standards/coding-conventions.md).
2. **Read** every ADR in [`library/knowledge/private/architecture/`](library/knowledge/private/architecture/) — these are non-negotiable.
3. **Read** the domain references in [`library/knowledge/private/`](library/knowledge/private/) relevant to the PRD you're about to start.
4. **Pick up** [`prd-001-install-scripts`](library/requirements/backlog/prd-001-install-scripts/) — move the folder to `library/requirements/in-work/` and ship it.
5. **Continue** through the backlog in numeric order. Each PRD has acceptance criteria, file paths to create, and dependency notes.

The 10 PRDs cover the entire build:

| PRD | What you'll build |
|---|---|
| 001 | Install scripts (`install.sh` + `install.ps1`) |
| 002 | Service core (Fastify + SQLite + keytar) |
| 003 | Web onboarding flow |
| 004 | Library Schema v2 standardizer |
| 005 | Repository scanner |
| 006 | Dashboard + day-to-day UI |
| 007 | Auto-start hooks (Task Scheduler / launchd / systemd) |
| 008 | Auto-update + remote skill sync |
| 009 | Bundled skills + agents |
| 010 | Brand application — full Notorious Llama dial |

When you finish a PRD, move its folder to `library/requirements/completed/` and write a QA artifact at `prd-<###>-<slug>/qa/prd-<###>-<slug>-qa.md`.

---

## Installation (when shipped)

Eventually:

```bash
# macOS / Linux
curl -fsSL https://www.thatgitlife.com/install.sh | bash

# Windows (PowerShell)
iwr -useb https://www.thatgitlife.com/install.ps1 | iex
```

Or:

```bash
npm i -g @legioncodeinc/that-git-life
tgl start
```

Then open [http://localhost:3050](http://localhost:3050) and follow the onboarding flow.

---

## License

See [`LICENSE.md`](LICENSE.md).

---

<sub>We are Legion. Vibe with Legion.</sub>
