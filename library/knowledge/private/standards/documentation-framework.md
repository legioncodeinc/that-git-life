# Documentation framework

- **Category:** Standards
- **Status:** Canonical
- **Last updated:** 2026-05-23

This document defines how docs in this repo are written. It applies to every Markdown file under `library/` (and to top-level READMEs).

---

## 1. Two-audience rule

Every long-lived doc serves both an AI agent and a human contributor. Both audiences read the same file. Don't write two versions — write one good one with the right framing for each.

The YAML headmatter on every `README.md` declares both audiences explicitly:

```yaml
---
ai_description: |
  What the AI must know to operate correctly in this folder.
human_description: |
  What the human must know to contribute correctly in this folder.
---
```

Non-README docs (ADRs, PRDs, standards, references) **do not** require the headmatter block — their structure is defined by their type-specific template.

---

## 2. Doc types and where they live

| Type | Lives in | Purpose |
|---|---|---|
| ADR | `library/knowledge/private/architecture/ADR-<n>-<slug>.md` | One architectural decision, frozen in time. |
| PRD | `library/requirements/<lifecycle>/prd-<###>-<slug>/prd-<###>-<slug>-index.md` | A unit of forward-looking work. |
| Sub-PRD | `prd-<###><letter>-<slug>-<feature>.md` | A scoped sub-feature of a parent PRD. |
| IRD | `library/issues/<lifecycle>/ird-<###>-<slug>/ird-<###>-<slug>-index.md` | A scoped bug fix (`<###>` = GitHub issue number). |
| Standard | `library/knowledge/private/standards/<slug>.md` | A writing or coding rule. |
| Reference | `library/knowledge/private/<domain>/<slug>.md` | Long-lived domain knowledge. |
| User doc | `library/knowledge/public/{overview,guides,faqs}/<slug>.md` | End-user-facing material. |
| Report | `library/requirements/reports/<YYYY-MM-DD>-<type>-report.md` | Routine scan output. |

---

## 3. Naming

All naming follows Schema v2 §4. The shortest form:

- Slugs: lowercase kebab, ≤ 60 chars.
- PRD numbers: repo-local sequential, zero-padded to 3 digits (`prd-007-…`).
- IRD numbers: GitHub issue numbers, zero-padded to 3 (or natural if ≥ 1000).
- ADRs: `ADR-<n>-<slug>.md`.
- Sub-PRDs: alphabetical letter suffix, no gaps.

---

## 4. ADR template

```markdown
# ADR-<n> — <decision title>

- **Status:** Proposed | Accepted | Superseded by ADR-<m>
- **Date:** YYYY-MM-DD
- **Decision owner:** <name>
- **Supersedes:** ADR-<k> (if applicable) | —

## Context
Why we're making a decision. Forces at play.

## Decision
The single sentence answer, then specifics.

## Why
The reasoning that justifies the decision.

## Consequences
What changes downstream — positive AND negative.

## Alternatives considered
| Alternative | Why rejected |
|---|---|
```

ADRs are **append-only history**. Don't edit an accepted ADR to reflect a new decision — write a new ADR that supersedes it.

---

## 5. PRD template

```markdown
# PRD-<###>: <Title>

- **Status:** backlog | in-work | completed (location is canonical — this line is a courtesy)
- **Owner:** <name>
- **Depends on:** PRD-<###>, PRD-<###>

## 1. Problem
What user-facing problem this solves. One paragraph.

## 2. Goals
- Bullet, outcome-shaped.

## 3. Non-goals
- Bullet, explicit so scope stays tight.

## 4. User stories
- "As a <user>, I want to <action> so that <outcome>."

## 5. Scope
### In scope
- Bullet.
### Out of scope
- Bullet.

## 6. Acceptance criteria
- Testable bullets. Pass/fail must be unambiguous.

## 7. File-level deliverables
List of files to create/modify with one-line purpose each.

## 8. Sequenced steps
Numbered plan of attack. Optimized for an AI agent picking it up.

## 9. Risks
Known unknowns + mitigations.

## 10. References
Links to ADRs, references, and prior art.
```

Sub-PRDs use a shorter template — see the parent PRD's index for the canonical sub-PRD list and per-sub-PRD acceptance criteria.

---

## 6. Linking

- Internal links use relative paths from the current file.
- Always link to the **deepest** authoritative source. Don't link to a folder if a specific file answers the question.
- Use `[[name]]`-style wikilinks only inside `notes/` (where humans run free). Everywhere else, use real Markdown links.

---

## 7. Writing voice

- Active voice. Short sentences. Avoid throat-clearing ("It is important to note that…").
- Imperative for instructions ("Open the file" not "You should open the file").
- "We" for collective decisions in ADRs and standards. "The user" for product references.
- No emojis unless the file is explicitly user-facing marketing copy (in which case the Notorious Llama brand voice applies — see [`branding.md`](branding.md)).

---

## 8. Code in docs

- Fenced blocks always specify the language: ` ```ts `, ` ```bash `, ` ```yaml `.
- File paths in prose are wrapped in backticks: `src/service/index.ts`.
- Shell snippets that the reader is meant to execute start with `$ ` (bash) or `PS> ` (powershell) **only when** the reader's role might be ambiguous. Inside `installers/` docs, the platform is always explicit.

---

## 9. The headmatter validator

The standardizer (PRD-004) parses every README under `library/` and fails the build if:

- The YAML block is missing.
- `ai_description` or `human_description` is empty.
- An unrecognized top-level key is present.

So: don't skip the headmatter.

---

## 10. Sacred paths reminder

| Path | Rule |
|---|---|
| `library/notes/` | Agents NEVER write. Humans only. |
| `library/requirements/reports/` | Routine scan reports only. |
| `prd-*/qa/` and `ird-*/qa/` | QA content authored only when QA is run. |
| `library/knowledge/private/architecture/` | ADRs only. No other prose. |
