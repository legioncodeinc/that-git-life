# Guide 05: Audit Playbook

> Use when asked to review an existing changelog for quality, cadence, or tone.

*Derived from: `research/external/changelog-copy-craft.md`, `research/external/keep-a-changelog.md`*

---

## What to audit

A changelog audit covers five dimensions, each scored 1-5:

| Dimension | What it measures |
|---|---|
| **Cadence** | How consistently does the team publish? |
| **User-centric language** | Is the writing for users or engineers? |
| **Tone consistency** | Does the voice stay consistent across entries? |
| **Distribution coverage** | Does the team actively distribute entries? |
| **Honest scope** | Does the team communicate what is NOT shipping? |

Total possible score: 25. Threshold for "healthy changelog": 18+.

---

## Scoring rubric

### Cadence (1-5)

- **5:** Entries within 7 days of every release; no gaps longer than 3 weeks unless the product had zero releases.
- **4:** Most releases covered; occasional 1-2 week gap.
- **3:** Releases covered inconsistently; 1-2 months between some entries.
- **2:** Sparse — fewer than 1 entry per month for an actively-shipping product.
- **1:** Last entry is 3+ months old or the changelog has fewer than 5 total entries.

### User-centric language (1-5)

Read the most recent 5 entries. For each bullet, apply the "before / after test" from `guides/03-copy-craft.md`.

- **5:** All bullets pass. No raw commit messages, no ticket numbers, no library names.
- **4:** Minor slips (1-2 bullets per entry with implementation language).
- **3:** Mixed — roughly half the bullets are user-facing, half are implementation-oriented.
- **2:** Mostly implementation language with occasional user framing.
- **1:** Raw git log or pure ticket dump.

### Tone consistency (1-5)

- **5:** Same register, same vocabulary, same formality level across all entries.
- **4:** Mostly consistent; one or two entries written by a different author feel slightly off.
- **3:** Noticeable variation — some entries are casual, some formal.
- **2:** Wildly inconsistent; different entries feel like different products.
- **1:** No discernible voice; purely transactional lists.

### Distribution coverage (1-5)

Check: does the product have an in-app widget? email digest? community channel? For each "yes," add one point. Then assess whether distribution matches release significance.

- **5:** In-app widget + email digest + community posts for significant releases.
- **4:** In-app widget + email digest; no community posts.
- **3:** In-app widget only; no email or community.
- **2:** Changelog exists but no widget or email distribution.
- **1:** Changelog is a file on GitHub that no one knows about.

### Honest scope (1-5)

- **5:** Regular "coming next" sections or honest notes when major features are absent from a release.
- **4:** Occasional honest scope notes; present when needed.
- **3:** Never uses honest scope, but the product has few publicly-discussed pending features.
- **2:** The team has announced features publicly that have been missing from multiple releases without any note.
- **1:** Users are filing support tickets asking "where is X?" that a single honest scope note would have prevented.

---

## Audit workflow

1. Open the existing changelog (URL or file).
2. Read the most recent 10 entries (or all entries if fewer than 10).
3. Fill in the scoring template at `templates/audit-report.md`.
4. Write specific, quoted recommendations for each low-scoring dimension.
5. Prioritize: the dimension with the lowest score is the first one to fix.

---

## Common findings and fixes

| Finding | Likely fix |
|---|---|
| Raw commit messages in bullets | Rewrite using `guides/03-copy-craft.md` template |
| Last entry 6+ months old | Identify whether releases were happening; if yes, back-fill the 3 most important; if no, the issue is shipping cadence not changelog |
| No distribution mechanism | Follow `guides/01-tool-selection.md` + `guides/02-tool-setup.md` |
| Inconsistent tone | Establish a one-page style guide; nominate a reviewer for changelog entries |
| Missing honest scope notes for known-requested features | Add a "Coming soon" section to the most recent entry; commit to including it in future entries |

*See `examples/audit-report-example.md` for a worked example.*
