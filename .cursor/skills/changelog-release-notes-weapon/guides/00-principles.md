# Guide 00: Principles

> Read this before any other guide. These are the non-negotiables.

*Derived from: `research/external/keep-a-changelog.md`, `research/external/changelog-copy-craft.md`, `research/internal/command-brief-notes.md`*

---

## The core problem

Most changelogs fail in one of two ways:

1. **Over-automated:** Raw commit logs, auto-generated from `git log --oneline`, shipped as-is. Written for CI pipelines, not humans.
2. **Under-communicated:** A quarterly blog post, no changelog page, no widget. Users discover changes accidentally.

The goal of `changelog-release-notes-guardian` is the middle path: a human-authored, user-centric entry that is easy to create and actually reaches users.

## The ten principles

### 1. Changelogs are for users, not machines

*Source: `research/external/keep-a-changelog.md`*

> "Don't let your friends dump git logs into changelogs."

A changelog entry is a communication artifact. The reader is a paying user wondering "did they fix the bug I reported?" or "what new thing can I do today?" Every word should serve that reader.

### 2. Name the user-visible behavior, not the implementation

Good: "Fixed a bug where the export button sometimes disappeared after refreshing the page."  
Bad: "Fixed a race condition in the UI state manager."

The second sentence may be accurate; the first is useful to the user.

### 3. Impact first, details second

Open with the most user-meaningful change. Not the most technically complex change. If the biggest thing is a performance improvement, lead with "Loading the dashboard is now 3x faster" — not the root cause analysis.

### 4. Honest scope: name what is NOT in this release

When users have been waiting for a feature, a brief note prevents support tickets and builds trust:

> "We started work on bulk CSV export but it is not ready for the quality bar we want. Expected in the next 2-3 releases."

This is NOT a commitment to a date. It is transparency about the team's awareness and priorities. See `research/external/changelog-copy-craft.md` for the full rationale.

### 5. Respect the team's existing tone

Before writing an entry, read the three most recent entries. If they are casual ("hey, that annoying spinner bug is gone"), match it. If they are formal ("We have resolved an issue affecting..."), match that. A sudden tone shift signals a broken process, not a better product.

### 6. Distribution or it didn't happen

*Source: `research/external/changelog-copy-craft.md`*

An entry that lives only on the changelog page and is never distributed via widget badge, email, or community post has zero discovery ROI. At minimum: update the in-app widget badge. For significant releases: email digest + community post.

### 7. Never recommend a paid tool without confirming fit

Keep a Changelog markdown is always a valid starting point and never requires migration away. Recommend paid tools only when a specific capability (segmentation, NPS, email digest automation) justifies the cost and the team is actively looking to invest.

### 8. Keep entries linkable

Every release should have a stable anchor URL. Whether that is a dedicated page (`/changelog/2026-05-20`), a heading in CHANGELOG.md, or a platform-provided permalink — the link is the audit trail.

### 9. ISO dates only

`2026-05-20` not `May 20, 2026` not `5/20/26`. ISO dates are internationally unambiguous and sort lexicographically. *Source: `research/external/keep-a-changelog.md`*

### 10. One source of truth

The changelog is NOT the git log. It is NOT the sprint board. It is NOT the email. It IS the human-authored record of user-facing changes. Everything else is a distribution channel pointing back to it.
