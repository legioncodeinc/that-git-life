---
name: changelog-release-notes-weapon
description: Publishes engaging public changelogs and release notes. Use when the user says "write my changelog entry", "set up a changelog tool", "review our release notes", "plan our announcement strategy", "we just shipped X", or when a deploy workflow is completed and the team needs to communicate what changed. Covers tool selection (Changelogfy, FeatureBase, Productlane, Headway, Beamer, self-hosted markdown), copy craft (impact-first writing, user-centric language, honest scope), and multi-channel distribution (in-app widget, email digest, blog, community). Do NOT use for managing deployments (devops-guardian) or writing marketing launch campaigns (website-guardian).
---

# changelog-release-notes Weapon

You are the playbook for `changelog-release-notes-guardian`. Every invocation should leave the team with one concrete artifact: either a ready-to-publish changelog entry, a tool setup, an audit report, or a distribution plan. The research in `research/` backs every claim in these guides.

## When this weapon applies

Load this weapon for any of:

- Writing a single changelog entry for a shipped release.
- Choosing and setting up a changelog tool for the first time.
- Auditing an existing changelog for quality, cadence, or tone.
- Planning a multi-channel announcement for a significant release.
- Advising on the right format (in-app widget vs dedicated page vs markdown file vs email).

Do NOT load for:
- Engineering deployments or CI/CD — that is `devops-guardian`.
- Marketing landing pages or launch campaigns — that is `website-guardian`.
- Internal sprint retrospectives — that is a product management workflow, not a changelog.

## First action when this weapon is loaded

1. Read `guides/00-principles.md` — the non-negotiables that govern every output.
2. Match the user's request to one of the four triage intents in Step 1 of the Angel's ACTION.
3. Open the relevant guide(s) for the matched intent before producing any output.

## Folder layout

```text
changelog-release-notes-weapon/
+- SKILL.md                          (this file)
+- README.md                         (one-page human overview)
+- guides/
|  +- 00-principles.md               (core doctrine: user-centric, honest, distributed)
|  +- 01-tool-selection.md           (decision matrix: Headway vs FeatureBase vs Productlane vs Beamer vs markdown)
|  +- 02-tool-setup.md               (integration patterns per platform)
|  +- 03-copy-craft.md               (writing playbook: impact-first, user-centric verbs, honest scope)
|  +- 04-distribution-channels.md    (when to use each channel, sequencing, tailoring)
|  +- 05-audit-playbook.md           (scoring framework for existing changelogs)
+- examples/
|  +- saas-minor-release.md          (SaaS product minor release entry with distribution checklist)
|  +- api-breaking-change.md         (developer-facing API changelog with migration guide reference)
|  +- audit-report-example.md        (filled-in audit report for a fictional product)
+- templates/
|  +- changelog-entry.md             (standard entry skeleton)
|  +- audit-report.md                (audit scoring sheet)
+- reports/
|  +- README.md                      (describes how past audit reports accumulate here)
+- research/
   +- research-plan.md
   +- research-summary.md
   +- index.md
   +- internal/command-brief-notes.md
   +- external/keep-a-changelog.md
   +- external/headway-app.md
   +- external/featurebase.md
   +- external/productlane.md
   +- external/beamer.md
   +- external/changelog-copy-craft.md
```

## Critical directives (from Command Brief)

These apply on every invocation. Full justifications in `guides/00-principles.md`.

- **Never paste raw commit logs into a changelog entry.** Raw commit messages are written for engineers; re-frame for user impact.
- **Always name the user-visible behavior, not the implementation.** "Fixed a bug where signing in on multiple tabs sometimes logged you out" beats "Fixed a race condition in the token refresh handler."
- **Include honest scope.** When users might expect something that did NOT ship, say so. One sentence is enough.
- **Respect the team's existing tone.** Read two or three recent entries before writing; match their register.
- **Never recommend a paid tool without confirming budget / tier fit.** Default to markdown (Keep a Changelog) when unsure; it is always migratable.
- **Surface the distribution plan every time.** Writing and not distributing is the most common failure mode.

## Triage decision tree

```
User request → Triage intent

"write this entry" / "here's what we shipped" → guides/03-copy-craft.md
"set up a changelog" / "which tool?" / "compare X and Y" → guides/01-tool-selection.md
"audit our changelog" / "review our release notes" → guides/05-audit-playbook.md
"plan our announcement" / "how to distribute this?" → guides/04-distribution-channels.md
First time setup + writing + distribution → 01 → 02 → 03 → 04 in sequence
```
