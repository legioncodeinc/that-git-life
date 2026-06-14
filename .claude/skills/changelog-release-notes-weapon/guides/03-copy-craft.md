# Guide 03: Copy Craft

> Use when writing a changelog entry. Apply every time, regardless of release size.

*Derived from: `research/external/changelog-copy-craft.md`, `research/external/keep-a-changelog.md`*

---

## The impact-first template

Use this skeleton for every entry:

```markdown
## [Version] - YYYY-MM-DD

**One sentence: the most important thing that changed, framed as user benefit.**

### New
- [Who can now do what]: brief description (1-2 sentences max per bullet).

### Improved
- [What works better now]: specific, measurable if possible.

### Fixed
- [What was broken that is now working]: describe the symptom the user experienced, not the root cause.

### Changed
- [What behavior changed]: include migration steps or a link if the change requires user action.

### Removed
- [What is gone]: note what replaces it, if anything.

---

**Coming next** *(optional - the honest scope note)*
We started work on [feature X] but it is not ready for the quality bar we want.
Expected in [rough timeframe or "no ETA yet"].
```

Adapt the sections to what actually shipped. If nothing was removed, omit the `### Removed` section. If nothing is "coming next", omit that block.

---

## User-centric language rules

### Replace implementation verbs with user-impact verbs

| Implementation verb | Replace with |
|---|---|
| "refactored" | "improved", "sped up", "simplified" |
| "migrated to X library" | "X now loads faster / handles more cases" (if there's a user benefit) — or omit if invisible |
| "patched CVE-XXXX" | "Fixed a security vulnerability in [component]" |
| "resolved issue #1234" | Describe the symptom, not the ticket number |
| "optimized database query" | "Loading [page/feature] is now [X]x faster" |

### The before / after test

For every bullet: ask "if I read this sentence without knowing anything about our codebase, do I understand how the product changed for me?"

- **Pass:** "Fixed a bug where inviting a team member sometimes showed an error even when the invite was sent successfully."
- **Fail:** "Fixed an async state mutation in the invite flow reducer."

### Quantify when possible

- "3x faster dashboard loading" beats "improved dashboard performance."
- "Reduced email send time from ~30s to ~2s" beats "optimized email sending."
- "Export files are now up to 80% smaller" beats "improved compression."

If you don't have a metric, a qualitative framing is still better than an implementation note: "noticeably faster" is acceptable; "some performance improvements" is not.

---

## The honest scope note

When to include it:
- A feature was publicly discussed, teased in a roadmap, or heavily requested, and it is NOT in this release.
- You are close to shipping something major and want to set expectations.
- There was a rollback or partial ship that users may notice.

Format:

> "We started work on [feature name] but it is not ready for the quality bar we want. [Optional: Expected in Q3 2026 / next 2-3 releases / no ETA yet.]"

Do NOT:
- Include honest scope notes for features that were never publicly discussed (this sets expectations you didn't need to set).
- Give hard dates in an honest scope note unless you are highly confident — soft framing ("next 2-3 releases") is safer.

*See `examples/saas-minor-release.md` for a worked honest scope note.*

---

## Tone calibration checklist

Before submitting a draft entry:

1. Read the three most recent published entries.
2. Match their formality register (casual / professional / developer-terse).
3. Match their length pattern — if previous entries are 3 bullets, a 15-bullet entry needs a reason.
4. Check for jargon that the reader wouldn't know: internal codenames, library names the user doesn't care about, ticket IDs.

---

## Anti-patterns (never do these)

- Pasting raw `git log --oneline` output as bullets.
- Starting bullets with "We" instead of the thing that changed: prefer "The dashboard now loads..." over "We improved dashboard loading".
- Including "internal" changes that users will never notice (code cleanup, test coverage, CI changes) unless the team explicitly wants to signal transparency.
- Writing in the future tense about current release: "We will ship X" — either it shipped (past tense) or it didn't (honest scope note).
