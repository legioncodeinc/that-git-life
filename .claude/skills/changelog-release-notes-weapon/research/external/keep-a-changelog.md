---
source: external
type: standard
authority: high
relevance: high
topic: changelog-format-standard
url: https://keepachangelog.com
---

# Source: Keep a Changelog

**URL:** https://keepachangelog.com  
**Author:** Olivier Lacan  
**Why it matters:** The de-facto community standard for markdown-based changelogs. Establishes the vocabulary and hierarchy that most changelog tools understand or import.

## Core conventions

- Changelog entries go in `CHANGELOG.md` at the project root.
- Sections per release: `Added`, `Changed`, `Deprecated`, `Removed`, `Fixed`, `Security`.
- Latest release at the top; `[Unreleased]` section above it for in-progress changes.
- Semantic versioning links in the footer: each version heading links to a GitHub compare URL.
- Human-readable prose, not machine-generated commit lists.

## Guiding philosophy (from the site)

> "Don't let your friends dump git logs into changelogs." — the canonical anti-pattern.

- Changelogs are FOR humans, not machines.
- Every version should be linkable.
- Latest always at top.
- Use ISO dates (YYYY-MM-DD) — unambiguous internationally.
- Use semantic versioning.

## Limitations / when NOT to follow

- Keep a Changelog is format-only; it says nothing about distribution, widgets, or engagement.
- Prescribes categories (Added/Changed/etc.) which work well for libraries but can feel over-engineered for product SaaS announcements where "what changed for me as a user" is a better organizing principle.
- No tooling for email digests, in-app widgets, or analytics.

## Applicability to weapon guides

- `guides/00-principles.md` — cite the "not for machines" philosophy.
- `guides/03-copy-craft.md` — the category vocabulary (Added/Changed/Fixed/Security) is the canonical skeleton even when the final format differs.
- `templates/changelog-entry.md` — the skeleton should follow Keep a Changelog section ordering.
