---
ai_description: |
  Repository health scanner for that-git-life. Runs four check categories
  against every tracked repo: (1) uncommitted/unpushed changes, (2)
  standardization drift vs Schema v2, (3) stale branches, (4) light
  secrets/.env exposure scan. Output is a single normalized "finding"
  schema rendered in the dashboard. Scans run on a daily cron and on
  demand from the UI.
human_description: |
  Reference for the health scanner: which checks run, how findings are scored
  and surfaced.
---

# scanner/

| Document | Purpose |
|---|---|
| [`checks-spec.md`](checks-spec.md) | Each check: inputs, algorithm, severity, finding shape, false-positive rules. |
