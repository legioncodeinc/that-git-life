---
ai_description: |
  Reactive bug/incident work for that-git-life. Peer of requirements/, same
  three-state lifecycle. IRD numbers MUST match the GitHub issue number —
  never invent issue numbers. IRDs are single-scope: no sub-IRDs. Folder
  pattern: `ird-<###>-<kebab-slug>/` containing `ird-<###>-<slug>-index.md`
  and `qa/ird-<###>-<slug>-qa.md`.
human_description: |
  Where bug-fix work lives. One IRD per GitHub issue. Use the GitHub issue
  number as the IRD number.
---

# issues/

| Folder | Purpose |
|---|---|
| [`backlog/`](backlog/) | IRDs queued. |
| [`in-work/`](in-work/) | IRDs in progress. |
| [`completed/`](completed/) | Shipped fixes. |
