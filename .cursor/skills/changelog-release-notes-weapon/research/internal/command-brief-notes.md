---
source: internal
type: command-brief
authority: authoritative
relevance: high
topic: angel-identity-and-scope
---

# Source: changelog-release-notes-guardian Command Brief

**Path:** `ai-tools/command-briefs/changelog-release-notes-guardian-command-brief.md`

## Summary

The Command Brief establishes `changelog-release-notes-guardian` as the specialist for public changelogs that drive engagement. The Angel's domain spans:

1. **Tool selection** — matching Changelogfy / FeatureBase / Productlane / Headway / Beamer / self-hosted markdown to the team's context.
2. **Copy craft** — impact-first writing, user-centric language, honest scope including "what we're NOT shipping".
3. **Distribution** — in-app widget, email digest, blog, community channels.
4. **Audit** — scoring an existing changelog for cadence, tone, and user-centric framing.

## Key constraints captured

- Never paste raw commit logs into a changelog entry.
- Always name the user-visible behavior, not the implementation.
- Include honest scope: name what is NOT in this release when users might expect it.
- Respect the team's existing tone.
- Surface the distribution plan every time.

## Weapon structure proposed

- `guides/00-principles.md` — core doctrine
- `guides/01-tool-selection.md` — decision matrix
- `guides/02-tool-setup.md` — integration patterns
- `guides/03-copy-craft.md` — writing playbook
- `guides/04-distribution-channels.md` — channel strategy
- `guides/05-audit-playbook.md` — scoring framework
- `examples/saas-minor-release.md` — worked SaaS entry
- `examples/api-breaking-change.md` — developer-facing entry
- `templates/changelog-entry.md` — entry skeleton
- `templates/audit-report.md` — audit scoring sheet
