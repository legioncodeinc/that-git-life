# Cursor Subagent Specification Reference

Authoritative documentation: https://cursor.com/docs/subagents

This file summarizes what bee-creator needs to produce a valid, high-quality Cursor subagent. When in doubt, fetch the live documentation — Cursor's subagent system is evolving. Use `WebFetch` on the URL above or search `web_search_exa` for "cursor subagents documentation" to confirm current requirements.

---

## What a Cursor subagent is

A Cursor subagent is a specialized AI persona that the primary Cursor agent can delegate work to. Each subagent is defined by a markdown file in `.cursor/agents/` containing YAML frontmatter (configuration) and a markdown body (instructions, context, and personality).

Subagents let the primary orchestrator hand off domain-specific work — security review, SEO audits, PRD writing, etc. — while remaining in control of the overall flow.

---

## File location

```
<repo-root>/.cursor/agents/<subagent-name>.md
```

In the ai-tools layout, this translates to:

```
<repo-root>/ai-tools/agents/<bee-name>.md
```

The filename must match the `name` frontmatter field.

---

## YAML frontmatter

Required fields (verify against the live docs for current list):

- `name` — subagent identifier, matches the filename.
- `description` — the triggering mechanism. Specifies when the orchestrator should delegate to this subagent.

Optional fields commonly used:

- `proactive` or equivalent — whether the orchestrator can invoke the subagent without explicit user mention.
- `tools` — a constraint on which Cursor tools this subagent is allowed to call.
- `model` — pin a specific model if the work benefits from one.

Check the authoritative docs before relying on any optional field; support varies by Cursor version.

---

## Body structure

Cursor does not mandate a fixed body structure, but the ai-tools convention is:

1. **Identity & responsibility** — persona and scope in 2–4 sentences.
2. **Paired Stinger** — link to the Stinger skill folder.
3. **Procedure** — numbered steps describing a typical invocation.
4. **Critical directives** — non-negotiable rules.
5. **Escalation** — what to do when stuck or unsure.
6. **References to skill files** — the full list of Stinger files the subagent should read.

---

## How the orchestrator selects subagents

Cursor's primary agent reads the description of each registered subagent. When the user's request or the current task matches a description, the orchestrator delegates. Key implications:

- The description is the trigger. Vague descriptions produce inconsistent routing.
- Descriptions should name the domain and at least one example phrase.
- If two subagents compete for the same description space, the orchestrator may pick either — explicitly state scope boundaries in each description ("Do not invoke for X — that's Y's job").

---

## Proactive vs. on-demand

Proactive subagents are invoked automatically when the orchestrator sees their domain in the task. On-demand subagents require an explicit mention (e.g., "use the security-worker-bee to review this").

Defaults by Bee type:

- Review/audit Bees (read-only, produces reports): proactive.
- Generation Bees (writes new files): proactive, but with a confirmation step in the procedure.
- State-mutating Bees (deploys, deletes, commits): on-demand.

When in doubt, ask the user to choose.

---

## Example subagent file

```markdown
---
name: seo-worker-bee
description: Reviews pull request diffs for technical SEO regressions including canonical tags, robots directives, hreflang, and metadata. Invoke when a PR touches routing, metadata files, rendering, public/robots.txt, sitemap.xml, or any framework metadata API. Do not invoke for content SEO (keywords, copy) — that's a separate Bee.
proactive: true
---

# SEO Worker Bee

## Identity & responsibility
seo-worker-bee is a technical-SEO reviewer invoked on pull requests. It reads code diffs, flags regressions in crawlability and indexability, and produces a severity-ranked report.

## Paired Stinger
`ai-tools/skills/seo-stinger/` — read its SKILL.md first.

## Procedure
1. Read the PR diff. Identify SEO-relevant files per `seo-stinger/guides/01-file-classification.md`.
2. For each file, apply the matching checklist from `seo-stinger/guides/02-checklists/`.
3. Classify each finding per `seo-stinger/guides/03-severity.md`.
4. Produce a report using `seo-stinger/templates/report.md`.

## Critical directives
- Never approve a PR that breaks canonical tags — the resulting duplicate content can destroy months of rankings.
- Always cite file and line on every finding. Findings without coordinates are not actionable.
- Do not modify code. Only comment.

## Escalation
If unsure whether a change is intentional (e.g., a deliberate `noindex`), flag it as a question in the report rather than a blocker.

## References to skill files
Utilize the Read tool to understand your skills at `ai-tools/skills/seo-stinger/` including:
- `SKILL.md` — master index
- `guides/00-principles.md`
- `guides/01-file-classification.md`
- `guides/02-checklists/` (all files)
- `guides/03-severity.md`
- `examples/` (all files)
- `templates/report.md`
```

---

## Anti-patterns to avoid

- **Generic description**: "Helps with SEO." Useless for routing.
- **No references**: Bee doesn't name its Stinger files — will not open them reliably.
- **Overlapping scope**: Two Bees with nearly-identical descriptions compete for the same work.
- **Missing escalation**: Bee does not say what to do when it's unsure, so it guesses.
- **Directives without reasons**: "Never X" without the why produces brittle behavior in edge cases.
