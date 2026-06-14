# Frontmatter Schema

Every wiki page starts with flat YAML frontmatter. No nested objects (Obsidian's Properties UI requires flat structure; Cursor doesn't care, but we keep flat for portability across both renderers).

---

## Universal fields (every page, no exceptions)

```yaml
---
type: <entity|concept|decision|comparison|question|meta>
title: "Human-Readable Title"
created: 2026-04-29
updated: 2026-04-29
tags:
  - <type-tag>
  - <domain-tag>
status: <seed|developing|mature|evergreen|stub>
related:
  - "[[Other Page]]"
sources:
  - "[[entities/source-file]]"
---
```

**Status values:**
- `seed` — exists, barely populated
- `developing` — has real content, not yet complete
- `mature` — comprehensive, well-linked
- `evergreen` — unlikely to need updates
- `stub` — placeholder for non-TS/JS file pending v2 multi-language extraction

---

## Type-specific additions

### entity (the most common type)

```yaml
entity_type: function
# function | class | module | service | endpoint | env-var | config-key |
# data-model | react-component | sql-table | queue | cron-job | feature-flag
path: "src/middleware/auth.ts"     # repo-relative
language: ts                       # ts | tsx | js | jsx | py | go | sql | yml | json | unknown
depends_on:
  - "[[entities/verifyToken]]"
  - "[[entities/getSession]]"
used_by:
  - "[[entities/loginRoute]]"
last_commit_hash: "abc123def"
tested_by:
  - "[[entities/auth-middleware-test]]"
```

**For `react-component` sub-type, additionally:**
```yaml
props_summary: "auth, redirectTo, onLogin"
```

**For `service` sub-type, additionally:**
```yaml
endpoints:
  - "POST /api/auth/login"
  - "POST /api/auth/logout"
env_vars:
  - "[[entities/AUTH_SECRET]]"
```

**For `queue` sub-type, additionally:**
```yaml
triggers:
  - "[[entities/handle-payment-job]]"
queue_framework: "bullmq"      # bullmq | inngest | sqs | other
```

**For `cron-job` sub-type, additionally:**
```yaml
schedule: "0 * * * *"
triggers:
  - "[[entities/cleanup-stale-sessions]]"
```

**For `feature-flag` sub-type, additionally:**
```yaml
flag_provider: "openfeature"   # openfeature | launchdarkly | growthbook | env-var | other
read_at:
  - file: "src/components/Banner.tsx"
    line: 42
  - file: "src/api/checkout.ts"
    line: 87
```

### concept

```yaml
complexity: intermediate    # basic | intermediate | advanced
domain: "authentication"
aliases:
  - "auth flow"
```

### decision (ADR-shaped)

```yaml
status: proposed             # proposed | accepted | superseded | deprecated
decision_date: 2026-04-15
commit_sha: "abc123"
superseded_by: "[[decisions/switch-to-oauth]]"   # optional
supersedes:                                       # optional
  - "[[decisions/use-session-cookies]]"
```

### comparison

```yaml
subjects:
  - "[[entities/Redis]]"
  - "[[entities/PostgreSQL]]"
dimensions:
  - "throughput"
  - "durability"
  - "ops cost"
verdict: "Postgres for the queue; Redis for the rate limiter."
```

### question

```yaml
question: "Why does the cleanup-stale-sessions cron run at the top of the hour?"
answer_quality: solid       # draft | solid | definitive
```

### meta (contradiction reports, lint reports)

```yaml
report_type: contradiction   # contradiction | lint
date: 2026-04-29
contradiction_count: 3       # for contradiction reports
issue_count: 12              # for lint reports
```

---

## Rules

1. Use flat YAML only. Never nest objects (except `read_at` on `feature-flag` entities, which uses a list of objects — the only allowed exception, since flag call-sites carry both file and line and need to stay together).
2. Dates as `YYYY-MM-DD` strings, not ISO datetime.
3. Lists always use the `- item` format, not inline `[a, b, c]`.
4. Wikilinks in YAML fields must be quoted: `"[[Page Name]]"`.
5. `path` is repo-relative — never absolute.
6. `last_commit_hash` is the delta-tracking key — always include on entity pages.
7. Update `updated` every time you edit the page content.
8. `tags` always includes the type tag (e.g., `entity`, `concept`).
9. `status: stub` means a non-TS/JS placeholder pending v2 — do not promote until a real extraction has run.

---

## Source

Ported and extended from `gods-hand/refs/claude-obsidian-main/skills/wiki/references/frontmatter.md`. Code-specific fields (`path`, `language`, `depends_on`, `used_by`, `last_commit_hash`, sub-type extensions) added per the wiki-guardian Command Brief.
