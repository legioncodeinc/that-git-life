---
depth_consumed: shallow
time_window: 2025-11 to 2026-05
files_written: 6
internal_files: 1
external_files: 5
---

# Research Summary: changelog-release-notes-weapon

**Date:** 2026-05-20  
**Depth tier:** shallow  
**Researcher:** scripture-historian (slot-03, synthesized from training data)

## What was researched

Covered the five most important topic areas for `changelog-release-notes-guardian`:

1. The Keep a Changelog format standard (the baseline vocabulary and philosophy).
2. Headway, FeatureBase, Productlane, and Beamer — the four most commonly adopted changelog SaaS platforms.
3. Changelog copy craft best practices — the community consensus on user-centric framing, honest scope, and distribution.

## Five most influential sources

1. **Keep a Changelog** (`external/keep-a-changelog.md`) — canonical format standard; the "not for machines" philosophy is foundational to the entire weapon.
2. **Changelog Copy Craft Best Practices** (`external/changelog-copy-craft.md`) — the practical writing playbook including impact-first structure, user-centric verbs, and the honest scope note.
3. **Beamer** (`external/beamer.md`) — most feature-rich engagement platform; sets the ceiling for what changelog tooling can do (segmentation, NPS, analytics).
4. **Productlane** (`external/productlane.md`) — the Linear-native automation story; documents how to eliminate the data-gathering step for teams with good issue hygiene.
5. **FeatureBase** (`external/featurebase.md`) — best example of changelog-as-part-of-feedback-loop; the React widget snippet is immediately usable.

## Open questions for weapon-forge to surface

1. **Self-hosted options depth:** Only shallow coverage of open-source alternatives (conventional-changelog, release-please). If the user base includes open-source maintainers, a dedicated `guides/06-open-source-changelog.md` may be warranted.
2. **Changelogfy coverage:** Not covered independently in this shallow pass — appears to be a lighter-weight Headway competitor. If users specifically request Changelogfy, the Angel should note this gap.
3. **GitHub Releases integration:** Several tools (Productlane, standard-version) integrate with GitHub Releases directly. A guide on using GitHub Releases as the source of truth for markdown-driven changelogs is a logical extension.

## Sources to re-fetch at normal/deep tier

- `external/keep-a-changelog.md` — worth scraping the actual site for the most current philosophy document.
- `external/beamer.md` — pricing changes frequently; re-fetch if tier decisions matter.

## File manifest

See `index.md` for the full manifest with per-file metadata.
