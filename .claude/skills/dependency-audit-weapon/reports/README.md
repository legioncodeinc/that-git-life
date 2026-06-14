# Reports

This folder collects dependency audit reports produced by `dependency-audit-guardian` over time.

Each audit run produces a dated markdown report at:
```
reports/YYYY-MM-DD-<project-name>-dependency-audit.md
```

## Report structure

Each report contains:
1. **Scanner stack summary** — which tools ran and their versions
2. **Findings summary table** — critical/high/medium/low counts by scanner
3. **Triage decisions** — for each critical/high finding: exploitability assessment, resolution, and ignore policy if applicable
4. **Lockfile status** — `npm ci` enforcement check, lockfile drift since last audit
5. **Provenance status** — signatures verified, attestations checked
6. **Open questions** — findings requiring human review before next release
7. **Action items** — numbered list of required changes with owners and due dates

## Seeding this folder

This folder is empty initially. The first report is created when `dependency-audit-guardian` completes its first audit run against a project.
