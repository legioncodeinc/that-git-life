---
type: entity
title: ""
entity_type: function
status: seed
created: 2026-04-29
updated: 2026-04-29
path: ""
language: ts
depends_on: []
used_by: []
last_commit_hash: ""
tested_by: []
tags:
  - entity
related: []
sources: []
---

# {Title}

## Overview

[One paragraph: what this entity is and why it exists. Cite source `file:line` at minimum once.]

## Signature / Definition

```ts
[code signature, type declaration, or schema — keep terse, no full bodies]
```

## Behavior

[How it works. Inputs, outputs, side effects, error cases. Each claim cites `file:line`.]

## Connections

- **depends_on:** [[entities/...]]
- **used_by:** [[entities/...]]
- **related concepts:** [[concepts/...]]

## Tested by

- [[entities/test-name]] (`path/to/test.ts:line`)

## History

- **Created:** commit `{sha}` by {author} on {YYYY-MM-DD}
- **Last touched:** commit `{sha}` by {author} on {YYYY-MM-DD}
- **Recent activity:**
  - `{sha}` — {message} ({date})
  - `{sha}` — {message} ({date})

## Sources

- `path/to/source/file.ts` (lines X–Y)

---

**Frontmatter notes for sub-types** (see [`references/frontmatter-schema.md`](../references/frontmatter-schema.md) for the full enum):

- `entity_type` MUST be one of: `function`, `class`, `module`, `service`, `endpoint`, `env-var`, `config-key`, `data-model`, `react-component`, `sql-table`, `queue`, `cron-job`, `feature-flag`.
- For `react-component`: add `props_summary: "comma-separated prop names"`.
- For `service`: add `endpoints:` and `env_vars:` lists.
- For `queue`: add `triggers:` (handler entity) and `queue_framework: bullmq | inngest | sqs | other`.
- For `cron-job`: add `schedule: "cron expression"` and `triggers:`.
- For `feature-flag`: add `flag_provider: openfeature | launchdarkly | growthbook | env-var | other` and `read_at:` (call sites).
