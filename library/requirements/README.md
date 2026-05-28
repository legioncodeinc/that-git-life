---
ai_description: |
  Forward-looking work for that-git-life. Three lifecycle folders plus a
  routine reports folder. PRD numbers are repo-local sequential, computed
  as max+1 over all prd-* folders in backlog/, in-work/, and completed/.
  Move whole PRD folders between lifecycle states — never encode state in
  frontmatter. Sub-PRDs use letter suffixes (a/b/c…) within a parent PRD.
human_description: |
  Where product work lives. Plan in backlog/, work in in-work/, ship to
  completed/. Routine scan reports go in reports/.
---

# requirements/

| Folder | Purpose |
|---|---|
| [`backlog/`](backlog/) | PRDs queued, not yet started. |
| [`in-work/`](in-work/) | PRDs actively being implemented. |
| [`completed/`](completed/) | Shipped PRDs (folder moves here intact). |
| [`reports/`](reports/) | Routine code-scan reports not tied to any PRD (`<YYYY-MM-DD>-<type>-report.md`). |

Naming rules: Schema v2 §4.
