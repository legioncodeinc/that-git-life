# Guide 10 — The Structured Response Payload

Every wiki-guardian invocation returns a structured JSON response payload to the TS driver. The driver's reconciliation pass depends on it. A scan that completes without a payload is a bug.

## The schema

```json
{
  "pages_created": ["entities/auth-middleware.md", "concepts/session-flow.md"],
  "pages_updated": ["entities/get-user.md"],
  "decisions_filed": ["decisions/0042-switch-to-jwt.md"],
  "contradictions_flagged": [
    {
      "old": "entities/get-user.md",
      "new": "entities/get-user.md",
      "reason": "return type changed from User to User | null",
      "commit": "abc123"
    }
  ],
  "meta_reports_written": ["meta/2026-04-29-contradiction-report.md"],
  "notification_flags": [
    {
      "severity": "warning",
      "title": "Contract change detected in get-user",
      "page": "entities/get-user.md",
      "report": "meta/2026-04-29-contradiction-report.md"
    }
  ],
  "entities_detected": [
    {"name": "authMiddleware", "type": "function", "file": "src/middleware/auth.ts", "line": 12}
  ],
  "gaps": [
    {"entity": "verifyToken", "referenced_in": "src/middleware/auth.ts:18", "reason": "definition not in chunk"}
  ],
  "lint_findings": [],
  "partial_scan": false
}
```

## Field semantics

| Field | Type | Required | Meaning |
|---|---|---|---|
| `pages_created` | string[] | yes | Repo-relative paths under `library/knowledge-base/wiki/` of pages newly created this invocation |
| `pages_updated` | string[] | yes | Same shape, for pages updated rather than created |
| `decisions_filed` | string[] | yes | Repo-relative paths of `decisions/<NNNN>-<slug>.md` ADRs filed in Phase 5 |
| `contradictions_flagged` | object[] | yes (may be empty) | Each: `{old, new, reason, commit}`. Drives `meta_reports_written` and `notification_flags` |
| `meta_reports_written` | string[] | yes (may be empty) | Repo-relative paths of `meta/<date>-*-report.md` files created or appended this invocation |
| `notification_flags` | object[] | yes (may be empty) | Each: `{severity, title, page, report}`. Driver surfaces in Cursor sidebar |
| `entities_detected` | object[] | yes | Each: `{name, type, file, line}`. Includes ALL detected entities — both new and unchanged. The driver uses this to update the hash manifest |
| `gaps` | object[] | yes (may be empty) | Each: `{entity, referenced_in, reason}`. Used to file `questions/` later |
| `lint_findings` | object[] | only in `mode: lint` | Per-chunk lint findings; driver runs the global pass separately |
| `partial_scan` | boolean | yes | `true` for direct `@`-mention invocations; `false` for canonical TS driver invocations |

## What the driver does with each field

- `pages_created` + `pages_updated` → updates `index.md` and `<type>/_index.md`; appends entries to `log.md`.
- `decisions_filed` → also updates the ADR index (`decisions/_index.md`).
- `contradictions_flagged` → audits that `meta_reports_written` covers them and that `notification_flags` was emitted (incomplete handling = bug).
- `notification_flags` → renders Cursor notifications in the Legion sidebar.
- `entities_detected` → updates `.legion/file-hashes.json` with `pages_created`/`pages_updated` per source file (delta-tracking key).
- `gaps` → optionally promotes to `questions/` pages on a future pass.
- `lint_findings` → aggregated into `meta/<date>-lint-report.md` by the driver.
- `partial_scan: true` → triggers a reconciliation pass before any other downstream consumer reads the wiki global state.

## Error response

If validation in [`guides/01-canonical-invocation.md`](01-canonical-invocation.md) fails or any phase encounters an unrecoverable error, return:

```json
{
  "error": {
    "code": "validation_failed | phase_failed | partial_write",
    "message": "Human-readable explanation",
    "phase": 1,
    "details": {}
  },
  "pages_created": [],
  "pages_updated": []
}
```

The driver MUST NOT proceed with reconciliation if `error` is present.

## Why this exact shape

The schema is designed for the driver's reconciliation logic, which reads each field and updates exactly one global state file:

- `pages_created` + `pages_updated` → `index.md`, `<type>/_index.md`
- Same → `log.md` (one entry per touched page)
- `entities_detected` → `.legion/file-hashes.json`
- `notification_flags` → sidebar UI
- `meta_reports_written` → audit that Phase 6 fired correctly

If a field is missing or wrong-shaped, the driver's reconciliation either fails or silently drifts. Be precise.
