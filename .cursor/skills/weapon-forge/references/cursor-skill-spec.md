# Cursor Skill Specification Reference

Authoritative documentation: https://cursor.com/docs/skills

This file summarizes what weapon-forge needs to know to produce a valid, high-quality Cursor skill. When in doubt, fetch the live documentation — Cursor's skill system is evolving and this summary may drift. Use `WebFetch` on the URL above or search with `web_search_exa` for "cursor skills documentation" to confirm current requirements.

---

## What a Cursor skill is

A Cursor skill is a folder containing a `SKILL.md` file (required) and optional supporting resources. Cursor's orchestrator reads the skill's YAML frontmatter (the `name` and `description` at minimum) to decide whether to invoke the skill based on the user's request. Once invoked, the skill's body is loaded into context.

Skills are the Cursor equivalent of Claude Code skills and follow similar progressive-disclosure patterns: metadata always loaded, body loaded on trigger, supporting files loaded on demand.

---

## Required structure

```
<skill-name>/
└── SKILL.md          (required)
```

That's the minimum. Everything else is optional but recommended for skills that need more than a few hundred lines of instruction.

---

## SKILL.md structure

```markdown
---
name: skill-name
description: A sentence (or two) describing what this skill does and when to use it.
---

# Skill body in markdown
...
```

### Frontmatter rules

- `name` must match the folder name exactly.
- `description` is the trigger. It should specify both **what the skill does** and **when to use it**. Cursor's router uses this text to match against user requests, so precision here determines activation reliability.
- Additional optional fields: `license`, `compatibility`, `version`. Check the live docs before relying on any of these — support varies.

### Body best practices

- Use imperative voice ("Read the input file", not "The input file is read").
- Favor numbered steps for procedures and bulleted lists for rules.
- Keep the body under ~500 lines; move detailed reference content into supporting files and link to them.
- Explain **why** a rule exists when the reason is non-obvious — the model reasons better with context than with bare commands.

---

## Supporting files

Skills can bundle any additional markdown, code, or data files under the skill folder. The ai-tools convention (set by Mario) is:

- `guides/` — procedural instructions, numbered and focused
- `examples/` — worked input/output examples
- `templates/` — reusable stubs and schemas
- `reports/` — output templates and past-run archive
- `research/` — source material and research notes

Cursor does not mandate these names, but ai-tools uses them consistently so Angels know where to look.

---

## Progressive disclosure pattern

The loading hierarchy:

1. **Metadata** (frontmatter) — always in context. Must be tight and descriptive.
2. **SKILL.md body** — loaded when the skill triggers. Should teach the Angel the shape of the work and point at details.
3. **Supporting files** — read on demand via the Angel's `Read` tool calls, following pointers in SKILL.md.

A well-designed SKILL.md is a navigation layer. It tells the Angel _what_ to do at a high level and _where_ to find the details for each sub-task.

---

## Triggering description tips

Good descriptions include:

- The primary verb ("reviews", "audits", "generates", "extracts").
- The domain ("SEO", "database migrations", "accessibility").
- Explicit trigger phrases users might say ("review this PR for SEO issues", "audit this for a11y").
- When _not_ to use the skill, if confusion with another skill is likely.

Bad descriptions are vague ("helps with SEO") or jargon-heavy without the user's actual phrasing. Draft the description from the perspective of a user who hasn't memorized the skill catalog.

---

## Example: a minimal but complete SKILL.md

```markdown
---
name: seo-weapon
description: Reviews pull request diffs for technical SEO regressions — crawlability, indexability, canonical tags, and on-page signals. Use when the user says "review this PR for SEO" or when seo-guardian is invoked.
---

# SEO Weapon

## When to use
Invoke when reviewing a pull request for technical SEO regressions. See `guides/00-principles.md` for the scope boundary.

## Procedure
1. Read the PR diff. Identify SEO-relevant files per `guides/01-file-classification.md`.
2. For each file, apply the matching checklist from `guides/02-checklists/`.
3. Classify findings per `guides/03-severity.md`.
4. Produce a report following the template in `templates/report.md`.
5. Examples of past reports live in `examples/`.

## Critical directives
- Never approve a PR that breaks canonical tags. (See `guides/00-principles.md`.)
- Always cite file and line on every finding.
```

This is ~20 lines. The detail is in the supporting files.

---

## Anti-patterns to avoid

- **Monolithic SKILL.md**: 2000-line instruction walls that the model never gets through. Split into guides.
- **Redundant description**: "This skill does X. It helps with X. When X, use this skill." Be terse.
- **Unlinked examples**: If `examples/` contains files not referenced from SKILL.md or guides, the Angel will not find them. Always link.
- **Ambiguous scope**: "Handles everything related to security" is a trap. Declare what the skill does _not_ cover so the router doesn't over-trigger.
