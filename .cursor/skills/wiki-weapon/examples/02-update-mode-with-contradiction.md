# Example 02 — `update` mode with a contract change (active contradiction protocol)

Same `verifyToken` from Example 01, but a later commit changed its return type from `Session` to `Session | null`. Demonstrates Phase 6 active contradiction protocol — all four artifacts produced.

## Invocation payload (from TS driver)

```json
{
  "mode": "update",
  "chunk": [
    {
      "path": "src/auth/session.ts",
      "content": "import jwt from 'jsonwebtoken';\nconst SECRET = process.env.JWT_SECRET!;\n\nexport interface Session { userId: string; expiresAt: number; }\n\nexport async function verifyToken(token: string): Promise<Session | null> {\n  try {\n    const decoded = jwt.verify(token, SECRET) as Session;\n    return decoded;\n  } catch {\n    return null;\n  }\n}\n"
    }
  ],
  "git_context": {
    "src/auth/session.ts": {
      "created_commit": "ab1c2d3",
      "created_at": "2025-09-12T14:32:00Z",
      "last_commit": {
        "sha": "fe9d8c7",
        "author": "bob",
        "timestamp": "2026-04-15T10:22:00Z",
        "message": "auth: nullable session when token invalid (rather than throw)"
      },
      "recent_commits": [
        {"sha": "fe9d8c7", "message": "auth: nullable session when token invalid (rather than throw)", "timestamp": "2026-04-15T10:22:00Z"},
        {"sha": "ab1c2d3", "message": "feat(auth): initial JWT middleware", "timestamp": "2025-09-12T14:32:00Z"}
      ],
      "blame_summary": {"top_authors": ["alice (62%)", "bob (38%)"], "churn_rate": "1.2 commits/month"}
    }
  },
  "prior_state": [
    {
      "path": "entities/verify-token.md",
      "frontmatter": {
        "type": "entity",
        "entity_type": "function",
        "status": "developing",
        "path": "src/auth/session.ts",
        "language": "ts",
        "depends_on": ["[[entities/jwt-secret]]"],
        "used_by": ["[[entities/auth-middleware]]"],
        "last_commit_hash": "ab1c2d3"
      }
    }
  ],
  "wiki_root": "/abs/path/to/repo/library/knowledge-base/wiki/",
  "page_caps": {"max_lines_per_page": 300, "target_pages_per_chunk": [8, 15]},
  "callout_vocabulary": ["[!contradiction]", "[!stale]", "[!gap]", "[!key-insight]"]
}
```

## Phase walk-through

**Phase 1 — Parse:** Same entities as Example 01 plus updated signature for `verifyToken`.

**Phase 2 — Cross-reference:** `verifyToken` exists in `prior_state`. Compare:
- Prior return type (from prior page): `Promise<Session>`.
- New return type (from current chunk): `Promise<Session | null>`.

Contract change detected. Mark `verify-token` as `contradiction`.

**Phase 3 — Author updated entity page:** Write the new `entities/verify-token.md` with the `[!contradiction]` callout.

**Phase 5 — ADR detection:** Commit message `auth: nullable session when token invalid (rather than throw)` matches Tier 2 (tradeoff phrase "rather than throw") — file as a `questions/` page asking whether this should be promoted to ADR.

**Phase 6 — Active contradiction protocol:** All four artifacts.

## Artifact 1 — `[!stale]` callout appended to PRIOR `entities/verify-token.md`

The agent does NOT delete the prior page content. It appends:

```markdown
> [!stale]
> Behavior changed in commit `fe9d8c7` (2026-04-15) — see [[entities/verify-token]] (current version).
> Reason: return type changed from `Promise<Session>` to `Promise<Session | null>`. Verification failures now return `null` instead of throwing.
```

(Since both pages share the same filename, the [[wikilink]] above resolves to the SAME page after the update — Cursor preview shows both the prior and the new content in one file with the contradiction callout at the top.)

## Artifact 2 — Updated `entities/verify-token.md` with `[!contradiction]` callout

```markdown
---
type: entity
title: "verifyToken"
entity_type: function
status: developing
created: "2026-04-29"
updated: "2026-04-29"
path: "src/auth/session.ts"
language: ts
depends_on: ["[[entities/jwt-secret]]"]
used_by: ["[[entities/auth-middleware]]"]
last_commit_hash: "fe9d8c7"
tested_by: []
tags: [entity, auth]
related: ["[[concepts/jwt-auth-flow]]"]
sources: []
---

# verifyToken

> [!contradiction]
> Supersedes prior version at commit `ab1c2d3` (2025-09-12).
> Prior contract: `Promise<Session>` (threw on failure). New contract: `Promise<Session | null>` (returns null on failure).
> Callers must now handle the null case. See [[questions/should-callers-of-verify-token-handle-null]].

## Overview
Validates a JWT against [[entities/jwt-secret]] and returns the decoded [[entities/session]] payload, or `null` if verification fails (`src/auth/session.ts:6-12`).

## Signature
```ts
export async function verifyToken(token: string): Promise<Session | null>
```

## Behavior
- Calls `jwt.verify(token, SECRET)` — throws internally on invalid signature, expired token, or malformed JWT (`src/auth/session.ts:8`).
- Try/catch around the verify call: on any error, returns `null` (`src/auth/session.ts:10-12`).
- On success, returns the decoded [[entities/session]] (`src/auth/session.ts:9`).

## Connections
- **depends_on:** [[entities/jwt-secret]]
- **used_by:** [[entities/auth-middleware]] — note: caller must be updated to handle the new `null` case.
- **related concepts:** [[concepts/jwt-auth-flow]]

## History
- **Created:** commit `ab1c2d3` by alice on 2025-09-12
- **Last touched:** commit `fe9d8c7` by bob on 2026-04-15 — return type changed (see `[!contradiction]` callout above)
- **Top contributors:** alice (62%), bob (38%)
- **Churn rate:** 1.2 commits/month

## Sources
- `src/auth/session.ts` (lines 1–13)
```

## Artifact 3 — entry in `meta/2026-04-29-contradiction-report.md`

If the file doesn't exist for today, create from [`templates/contradiction-report.md`](../templates/contradiction-report.md). Append:

```markdown
---
type: meta
report_type: contradiction
date: "2026-04-29"
created: "2026-04-29"
updated: "2026-04-29"
contradiction_count: 1
tags: [meta, contradiction-report]
---

# Contradiction Report — 2026-04-29

---

## 11:14 — fe9d8c7 — verifyToken

- **Old page:** [[entities/verify-token]] (prior version, commit `ab1c2d3`)
- **New page:** [[entities/verify-token]] (current version, commit `fe9d8c7`)
- **Reason:** return type changed from `Promise<Session>` to `Promise<Session | null>` — verification failures now return null instead of throwing
- **Commit:** `fe9d8c7` — "auth: nullable session when token invalid (rather than throw)" — bob
- **Severity:** warning
- **Resolution suggestion:** [[questions/should-callers-of-verify-token-handle-null]]
```

## Artifact 4 — `notification_flag` in the response payload

```json
{
  "notification_flags": [
    {
      "severity": "warning",
      "title": "Contract change detected in verifyToken",
      "page": "entities/verify-token.md",
      "report": "meta/2026-04-29-contradiction-report.md"
    }
  ]
}
```

The TS driver renders this in the Legion sidebar as a Cursor notification.

## Full response payload

```json
{
  "pages_created": [
    "questions/should-callers-of-verify-token-handle-null.md",
    "questions/was-fe9d8c7-an-architectural-decision.md",
    "meta/2026-04-29-contradiction-report.md"
  ],
  "pages_updated": ["entities/verify-token.md"],
  "decisions_filed": [],
  "contradictions_flagged": [
    {
      "old": "entities/verify-token.md",
      "new": "entities/verify-token.md",
      "reason": "return type changed from Promise<Session> to Promise<Session | null>",
      "commit": "fe9d8c7"
    }
  ],
  "meta_reports_written": ["meta/2026-04-29-contradiction-report.md"],
  "notification_flags": [
    {
      "severity": "warning",
      "title": "Contract change detected in verifyToken",
      "page": "entities/verify-token.md",
      "report": "meta/2026-04-29-contradiction-report.md"
    }
  ],
  "entities_detected": [
    {"name": "verifyToken", "type": "function", "file": "src/auth/session.ts", "line": 5}
  ],
  "gaps": [],
  "lint_findings": [],
  "partial_scan": false
}
```

## What the TS driver does

1. Reconciles `index.md` (no new entries — `verify-token.md` was an update, not new).
2. Appends one entry to `log.md`: `## [2026-04-29] update | verifyToken — contract change`.
3. Updates `.legion/file-hashes.json` with new hash for `src/auth/session.ts`.
4. Renders the `notification_flag` in the Legion sidebar.
5. The user clicks the notification → opens `entities/verify-token.md` and sees the contradiction callout at top, with a link to the meta report and the open question.

## What's intentionally NOT done

- The prior version's frontmatter and body are NOT deleted — the contradiction is part of the audit trail.
- The change is NOT silently overwritten — that would defeat the entire wiki layer's value.
- `[[entities/auth-middleware]].used_by` is NOT auto-updated to flag the breaking change for the caller — that's a Phase-6 cross-cutting concern the lint mode catches separately.
