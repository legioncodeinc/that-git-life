# readme-writing-guardian — God's Guide

The God routing skill's record of when to invoke `readme-writing-guardian`. Use this guide to decide whether a user request belongs to this Angel.

**Angel:** [`ai-tools/agents/readme-writing-guardian.md`](../../agents/readme-writing-guardian.md)
**Weapon:** [`ai-tools/skills/readme-writing-weapon/`](../../skills/readme-writing-weapon/)
**Command Brief:** [`ai-tools/command-briefs/readme-writing-guardian-command-brief.md`](../../../command-briefs/readme-writing-guardian-command-brief.md)
**Trigger policy:** proactive

---

## Domain

`readme-writing-guardian` owns the `README.md` as a conversion surface. It authors, audits, and restructures README files so they convert visitors into users in 30 seconds or less. The Angel applies the canonical 2026 section order (title, badges, quickstart, features, install, usage, contributing, license), badge discipline (3–5 status-only badges via Shields.io), and the OSS/internal register split. It also applies README-driven development (RDD) for greenfield projects: write the README before writing code, in present tense, as the API spec that the implementation validates against. The Angel does NOT own full documentation site architecture, per-entity code extraction, or CI badge pipeline wiring.

## Trigger phrases

Route to `readme-writing-guardian` when the user says any of:

- "write a README"
- "audit my README"
- "make my README better"
- "README for this project"
- "README-driven development"
- "my README is too long"
- "badges are broken" or "badges are missing"
- "quickstart doesn't work"
- "README for an OSS library"
- "write the README first"

Or when the user starts a new project and no README exists yet, or when a PR touches the `README.md` file and the PR description asks for a review.

## Do NOT route when

- The user wants a full documentation site (wiki, docs portal, Docusaurus, MkDocs) — route to `library-guardian`.
- The user wants to extract code entities (functions, classes, services) into a wiki — route to `wiki-guardian`.
- The user wants to set up the CI pipeline that generates CI/coverage badges — route to `devops-guardian`.
- The README is for a Ruby gem following strict Ankane-style conventions — route to `ce-ankane-readme-writer`.
- The README is in `.rst` format for a Python project — route to `python-guardian`.

If a request straddles `readme-writing-guardian` and `library-guardian` (e.g., "my README is too long and I need proper docs"), prefer `readme-writing-guardian` first to trim/restructure, then escalate to `library-guardian` if extraction is needed.

## Inputs the Angel needs

Before invoking, ensure the user has provided (or you can infer):

- The `README.md` file path — required; or "no README exists yet" to trigger creation.
- Project type signal — required: OSS library, internal tool, SaaS product, CLI, or monorepo. If ambiguous, `readme-writing-guardian` will ask.
- Target audience — optional; defaults to developer-audience for OSS, teammate-audience for internal.
- Existing badges or CI config — optional; used to generate live badge URLs.
- Inspirational READMEs — optional; links the user wants to emulate.

If the project type cannot be inferred and the user has not specified it, ask before invoking — the wrong classification produces the wrong template.

## Outputs the Angel produces

- **Primary:** An updated or newly created `README.md` written to disk at the specified path.
- **Audit table:** A pass/fail/warn table emitted inline before any rewrite (so the user can confirm before changes are written).
- **Done checklist:** A 12-point validation table emitted at the end confirming every section passes.
- **Optional audit report:** A dated summary at `ai-tools/skills/readme-writing-weapon/reports/YYYY-MM-DD-{project}-readme-audit.md`.

## Multi-Angel sequences this Angel participates in

- **New OSS project launch:** `readme-writing-guardian` (README first, RDD) → implementation → `security-guardian` (audit) → `quality-guardian` (verify plan). `readme-writing-guardian` runs first, before any code.
- **PR review with README changes:** `readme-writing-guardian` audits the README diff as part of any PR that touches `README.md`.
- **Docs escalation:** `readme-writing-guardian` trims/restructures the README → hands off to `library-guardian` when the README exceeds 2,000 words and a full docs site is warranted.

## Critical directives the orchestrator should respect

- Always emit the audit table before rewriting; never silently overwrite the existing README.
- The quickstart block must be copy-paste runnable on a fresh machine; validate mentally before emitting.
- Respect the OSS/internal register split; do not apply OSS tone to an internal tool README.
- Hand off to `library-guardian` when README exceeds 2,000 words rather than restructuring infinitely.

(Full list lives in the Angel file's `## Critical directives` section.)

---

*Part of God's roster. See [`ai-tools/skills/god/SKILL.md`](../SKILL.md) for the full Army.*
