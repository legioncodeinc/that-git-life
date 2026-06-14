# Example 03 — Direct `@`-mention with scope confirmation (escape hatch)

A Cursor user is reading code in `src/billing/stripe-webhook.ts` and `@`-mentions wiki-guardian to extract entities for that file. Demonstrates the direct-invocation flow per [`guides/02-direct-invocation.md`](../guides/02-direct-invocation.md): self-discover the chunk, confirm scope before writing, fetch git context (driver-or-direct), respond with `partial_scan: true`.

## User prompt (in Cursor chat)

> @wiki-guardian extract entities for the file I'm looking at

## Step 1 — Self-discover the chunk

Cursor's editor state shows `src/billing/stripe-webhook.ts` is the active file. wiki-guardian infers:

- chunk: `[{path: "src/billing/stripe-webhook.ts", content: "<full source>"}]`
- mode: `update` if a prior wiki page exists for this file; otherwise `document`. Check `library/knowledge-base/wiki/entities/` for `stripe-webhook.md` — assume not present, so mode is `document`.

## Step 2 — Confirmation message (NO writes yet)

wiki-guardian responds in Cursor chat:

```
I'll extract entities from this scope:

- src/billing/stripe-webhook.ts (full file, 187 lines)

Mode: document (no prior wiki page exists for this file).
Git context: I'll request from the Legion driver via .legion/queue/ if it's running, otherwise shell to git directly.
Output location: library/knowledge-base/wiki/{entities,concepts,decisions,questions}/

This will be a partial scan — index.md and log.md won't update until the next Document or Update run via the Legion sidebar.

Confirm? (yes / no / refine scope)
```

User responds: `yes`

## Step 3 — Fetch git context

wiki-guardian writes to `.legion/queue/git-context-request-1745930400.json`:

```json
{
  "request_id": "git-context-1745930400",
  "files": ["src/billing/stripe-webhook.ts"]
}
```

Wait up to 2 seconds for `.legion/queue/git-context-response-1745930400.json` to appear.

**Case A — driver responds:** read the response file, get pre-computed git context. Proceed to Phase 1.

**Case B — driver doesn't respond:** shell out to git directly:

```bash
git log --format='%H|%an|%aI|%s' -- src/billing/stripe-webhook.ts | head -10
git log --format='%H|%aI|%s' --diff-filter=A -- src/billing/stripe-webhook.ts | tail -1
git blame --line-porcelain src/billing/stripe-webhook.ts | grep '^author ' | sort | uniq -c | sort -rn | head -3
```

Parse outputs into the `git_context` shape. Proceed to Phase 1.

## Step 4 — Run Phases 1–6

Same as canonical invocation. Suppose this file produces:

- 1 `endpoint` entity (POST /api/stripe/webhook)
- 1 `function` entity (handleStripeWebhook handler)
- 2 `function` entities (helpers: `verifyStripeSignature`, `processInvoiceEvent`)
- 1 `env-var` entity (`STRIPE_WEBHOOK_SECRET`)
- 1 `concept` entity (Stripe webhook handling pattern)
- 1 `decision` entity (Tier 1 ADR if commit message had a switch-verb pattern; assume no for this example)

## Step 5 — Response payload (with `partial_scan: true`)

```json
{
  "pages_created": [
    "entities/stripe-webhook-endpoint.md",
    "entities/handle-stripe-webhook.md",
    "entities/verify-stripe-signature.md",
    "entities/process-invoice-event.md",
    "entities/stripe-webhook-secret.md",
    "concepts/stripe-webhook-handling.md"
  ],
  "pages_updated": [],
  "decisions_filed": [],
  "contradictions_flagged": [],
  "meta_reports_written": [],
  "notification_flags": [
    {
      "severity": "info",
      "title": "Partial scan completed via @-mention — driver reconciliation pending",
      "page": "entities/stripe-webhook-endpoint.md"
    }
  ],
  "entities_detected": [
    {"name": "stripeWebhookEndpoint", "type": "endpoint", "file": "src/billing/stripe-webhook.ts", "line": 12},
    {"name": "handleStripeWebhook", "type": "function", "file": "src/billing/stripe-webhook.ts", "line": 22},
    {"name": "verifyStripeSignature", "type": "function", "file": "src/billing/stripe-webhook.ts", "line": 84},
    {"name": "processInvoiceEvent", "type": "function", "file": "src/billing/stripe-webhook.ts", "line": 121},
    {"name": "STRIPE_WEBHOOK_SECRET", "type": "env-var", "file": "src/billing/stripe-webhook.ts", "line": 4}
  ],
  "gaps": [
    {"entity": "stripe", "referenced_in": "src/billing/stripe-webhook.ts:1", "reason": "external library import — not in chunk; not extractable"}
  ],
  "lint_findings": [],
  "partial_scan": true
}
```

## Step 6 — Cursor chat reply

wiki-guardian summarizes for the user:

```
Done. 6 pages written under library/knowledge-base/wiki/:

- entities/stripe-webhook-endpoint.md
- entities/handle-stripe-webhook.md
- entities/verify-stripe-signature.md
- entities/process-invoice-event.md
- entities/stripe-webhook-secret.md
- concepts/stripe-webhook-handling.md

This was a partial scan — index.md, log.md, hot.md, and the hash manifest will update on the next Document or Update run via the Legion sidebar (or whenever the driver next reconciles `.legion/queue/`).

Open questions: none. Gaps: 1 (external library `stripe` — expected, not extractable).
```

## What the TS driver does on the next reconciliation pass

1. Sees the `partial_scan: true` queued response and runs reconciliation:
2. Updates `index.md` with 6 new pages.
3. Updates `entities/_index.md` and `concepts/_index.md`.
4. Appends 6 entries to `log.md` with `[partial-scan]` tag noting the source.
5. Refreshes `hot.md` with "Stripe webhook handling ingested via @-mention 2026-04-29".
6. Updates `.legion/file-hashes.json`.
7. Surfaces a "1 partial scan reconciled" entry in the sidebar so the user knows the wiki is fully consistent again.

## When direct invocation is the right tool

This example shows the right use case: user is reading code, has a single file in focus, wants to extend the wiki on the spot without leaving Cursor. No bulk scan, no global state changes — just one chunk, one set of pages.

For ANY of the following, use the Legion sidebar's Document/Update buttons instead:
- More than ~10 files at once.
- Cross-cutting work (lint, full-repo audit, all-modules sweep).
- Anything that should leave the wiki fully reconciled when done.
