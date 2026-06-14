# Example 01 — `document` mode against a TypeScript module (happy path)

A small TS module is being documented for the first time. No prior wiki state. Demonstrates the canonical TS-driver invocation, the six-phase flow, and the structured response payload.

## Invocation payload (from TS driver)

```json
{
  "mode": "document",
  "chunk": [
    {
      "path": "src/auth/middleware.ts",
      "content": "import { verifyToken } from './session';\nimport { logger } from '../logging';\n\nexport async function authMiddleware(req, res, next) {\n  const token = req.headers.authorization?.split(' ')[1];\n  if (!token) return res.status(401).json({ error: 'No token' });\n  try {\n    const session = await verifyToken(token);\n    req.session = session;\n    next();\n  } catch (err) {\n    logger.warn('Auth failed', { err });\n    res.status(401).json({ error: 'Invalid token' });\n  }\n}\n"
    },
    {
      "path": "src/auth/session.ts",
      "content": "import jwt from 'jsonwebtoken';\nconst SECRET = process.env.JWT_SECRET!;\n\nexport interface Session { userId: string; expiresAt: number; }\n\nexport async function verifyToken(token: string): Promise<Session> {\n  const decoded = jwt.verify(token, SECRET) as Session;\n  return decoded;\n}\n"
    }
  ],
  "git_context": {
    "src/auth/middleware.ts": {
      "created_commit": "ab1c2d3",
      "created_at": "2025-09-12T14:32:00Z",
      "last_commit": {"sha": "ab1c2d3", "author": "alice", "timestamp": "2025-09-12T14:32:00Z", "message": "feat(auth): initial JWT middleware"},
      "recent_commits": [{"sha": "ab1c2d3", "message": "feat(auth): initial JWT middleware", "timestamp": "2025-09-12T14:32:00Z"}],
      "blame_summary": {"top_authors": ["alice (100%)"], "churn_rate": "1 commit/month"}
    },
    "src/auth/session.ts": {
      "created_commit": "ab1c2d3",
      "created_at": "2025-09-12T14:32:00Z",
      "last_commit": {"sha": "ab1c2d3", "author": "alice", "timestamp": "2025-09-12T14:32:00Z", "message": "feat(auth): initial JWT middleware"},
      "recent_commits": [{"sha": "ab1c2d3", "message": "feat(auth): initial JWT middleware", "timestamp": "2025-09-12T14:32:00Z"}],
      "blame_summary": {"top_authors": ["alice (100%)"], "churn_rate": "1 commit/month"}
    }
  },
  "prior_state": [],
  "wiki_root": "/abs/path/to/repo/library/knowledge-base/wiki/",
  "page_caps": {"max_lines_per_page": 300, "target_pages_per_chunk": [8, 15]},
  "callout_vocabulary": ["[!contradiction]", "[!stale]", "[!gap]", "[!key-insight]"]
}
```

## Phase walk-through

**Phase 1 — Parse the chunk:** Both files are `.ts`; ts-morph extracts:
- `authMiddleware` (function, exported, async)
- `verifyToken` (function, exported, async)
- `Session` (data-model, interface)
- `JWT_SECRET` (env-var, read at session.ts:2)

Plus one concept candidate spans both files: the JWT auth flow.

Plus one decision candidate from the commit message `feat(auth): initial JWT middleware` — Tier 1 ("adopt JWT" via `feat:` introduction; could file as ADR). Confidence is moderate; agent files as Tier 1 ADR per the catalog (introduction of a new architectural choice).

**Phase 2 — Cross-reference:** `prior_state` is empty (`mode: document`), so all candidates are `new`. No contradictions.

**Phase 3 — Author entity pages:** Four entity pages written.

**Phase 4 — Author concept pages:** One concept page written.

**Phase 5 — Detect ADRs:** One Tier 1 ADR filed.

**Phase 6 — Contradiction protocol:** No contradictions to handle (empty `prior_state`).

## Pages written to disk

### `entities/auth-middleware.md`

```markdown
---
type: entity
title: "authMiddleware"
entity_type: function
status: developing
created: "2026-04-29"
updated: "2026-04-29"
path: "src/auth/middleware.ts"
language: ts
depends_on: ["[[entities/verify-token]]", "[[entities/logger]]"]
used_by: []
last_commit_hash: "ab1c2d3"
tested_by: []
tags: [entity, auth]
related: ["[[concepts/jwt-auth-flow]]"]
sources: []
---

# authMiddleware

## Overview
Express-compatible middleware that extracts a Bearer token from `req.headers.authorization`, validates via [[entities/verify-token]], and attaches the resulting [[entities/session]] to `req.session`. On failure, responds 401 (`src/auth/middleware.ts:5-12`).

## Signature
```ts
export async function authMiddleware(req, res, next): Promise<void>
```

## Behavior
- Extracts token from `Authorization: Bearer <token>` header (`src/auth/middleware.ts:5`).
- If absent, returns 401 with `{ error: 'No token' }` (`src/auth/middleware.ts:6`).
- Calls `verifyToken(token)` and attaches result to `req.session` (`src/auth/middleware.ts:8-9`).
- On any verification error, logs via `logger.warn` and returns 401 (`src/auth/middleware.ts:11-13`).

## Connections
- **depends_on:** [[entities/verify-token]], [[entities/logger]]
- **related concepts:** [[concepts/jwt-auth-flow]]

## Tested by
(none detected in chunk)

## History
- **Created:** commit `ab1c2d3` by alice on 2025-09-12
- **Last touched:** commit `ab1c2d3` by alice on 2025-09-12
- **Top contributors:** alice (100%)
- **Churn rate:** 1 commit/month

## Sources
- `src/auth/middleware.ts` (lines 1–14)
```

### `entities/verify-token.md`

(similar shape — function entity with depends_on `[[entities/JWT_SECRET]]`, body documenting JWT verification)

### `entities/session.md`

(data-model entity with `entity_type: data-model`, fields `userId`, `expiresAt`)

### `entities/jwt-secret.md`

(env-var entity with `name: JWT_SECRET`, `read_at: [{file: "src/auth/session.ts", line: 2}]`, `is_required: true`)

### `concepts/jwt-auth-flow.md`

```markdown
---
type: concept
title: "JWT auth flow"
complexity: intermediate
domain: "authentication"
created: "2026-04-29"
updated: "2026-04-29"
status: developing
tags: [concept, auth]
related: ["[[entities/auth-middleware]]", "[[entities/verify-token]]", "[[entities/session]]", "[[entities/jwt-secret]]"]
sources: []
---

# JWT auth flow

## Definition
The codebase authenticates HTTP requests by validating a JWT in the `Authorization` header against [[entities/jwt-secret]] and attaching the decoded [[entities/session]] to the request object. Bearer-token convention.

## How it works
1. Client sends `Authorization: Bearer <token>` header.
2. [[entities/auth-middleware]] extracts the token and calls [[entities/verify-token]].
3. [[entities/verify-token]] uses `jsonwebtoken.verify` against [[entities/jwt-secret]].
4. On success, decoded payload (matching [[entities/session]] shape) is attached to `req.session` and the request proceeds.
5. On failure, 401 is returned and the failure is logged.

## Why it matters
This is the only authentication path in the codebase. Any change to [[entities/verify-token]] or [[entities/jwt-secret]] handling has blast radius across every authenticated endpoint.

## Examples in this codebase
- [[entities/auth-middleware]] — the only invoker of the flow.

## Connections
- **involves entities:** [[entities/auth-middleware]], [[entities/verify-token]], [[entities/session]], [[entities/jwt-secret]]

## Sources
- `src/auth/middleware.ts` (full file) — primary expression
- `src/auth/session.ts` (full file) — verification implementation
- commit `ab1c2d3` — flow introduction
```

### `decisions/pending-ab1c2d3-adopt-jwt-for-session-auth.md`

```markdown
---
type: decision
title: "Adopt JWT for session auth"
status: accepted
adr_number: "<pending>"
decision_date: "2025-09-12"
deciders: []
commit_sha: "ab1c2d3"
supersedes: []
superseded_by: ""
related: ["[[entities/auth-middleware]]", "[[entities/verify-token]]", "[[concepts/jwt-auth-flow]]"]
tags: [adr, decision, auth]
---

# ADR <pending>: Adopt JWT for session auth

## Status
Accepted — 2025-09-12

## Context
The auth flow needed a stateless session mechanism for the new API. Commit `ab1c2d3` introduces JWT-based middleware (Tier 1 ADR signal: subject contains "feat(auth): initial").

## Decision
We will use JWT (via `jsonwebtoken`) to encode session payloads. Sessions are signed with `JWT_SECRET` (env var) and verified per request via [[entities/auth-middleware]].

## Consequences
- **Positive:** Stateless — no session store. Easy horizontal scaling.
- **Negative:** Token revocation requires extra infra (blocklist). Not addressed in this commit.
- **Affected entities:** [[entities/auth-middleware]], [[entities/verify-token]], [[entities/session]], [[entities/jwt-secret]]

## Sources
- Commit `ab1c2d3` by alice on 2025-09-12
- Message: "feat(auth): initial JWT middleware"
```

(The TS driver allocates `<pending>` → `0001` in the post-pass and renames the file to `decisions/0001-adopt-jwt-for-session-auth.md`.)

## Response payload to TS driver

```json
{
  "pages_created": [
    "entities/auth-middleware.md",
    "entities/verify-token.md",
    "entities/session.md",
    "entities/jwt-secret.md",
    "concepts/jwt-auth-flow.md",
    "decisions/pending-ab1c2d3-adopt-jwt-for-session-auth.md"
  ],
  "pages_updated": [],
  "decisions_filed": ["decisions/pending-ab1c2d3-adopt-jwt-for-session-auth.md"],
  "contradictions_flagged": [],
  "meta_reports_written": [],
  "notification_flags": [],
  "entities_detected": [
    {"name": "authMiddleware", "type": "function", "file": "src/auth/middleware.ts", "line": 4},
    {"name": "verifyToken", "type": "function", "file": "src/auth/session.ts", "line": 5},
    {"name": "Session", "type": "data-model", "file": "src/auth/session.ts", "line": 4},
    {"name": "JWT_SECRET", "type": "env-var", "file": "src/auth/session.ts", "line": 2}
  ],
  "gaps": [
    {"entity": "logger", "referenced_in": "src/auth/middleware.ts:11", "reason": "definition not in chunk"}
  ],
  "lint_findings": [],
  "partial_scan": false
}
```

The TS driver consumes this and:

1. Updates `index.md` with 6 new pages.
2. Updates `entities/_index.md`, `concepts/_index.md`, `decisions/_index.md`.
3. Appends 6 entries to `log.md`.
4. Refreshes `hot.md` with "auth flow ingested 2026-04-29".
5. Allocates `0001` for the pending ADR and renames the file.
6. Updates `.legion/file-hashes.json` with new entries for the two source files.
7. Files the `gaps[0]` entry as `questions/where-is-logger-defined.md` for human follow-up on a future scan.

## Page count check

6 pages = below the 8–15 target. Within tolerance for a small two-file chunk. The 8–15 target assumes a richer chunk (a full module or a feature-area sweep). For tiny chunks like this happy-path example, 4–8 is normal.
