# Guide 02 — Direct Invocation (`@`-Mention Escape Hatch)

When a Cursor user `@`-mentions wiki-guardian directly (instead of going through the Legion VS Code extension's Document/Update buttons), the agent operates in escape-hatch mode. This mode is for ad-hoc work — e.g., "extract entities from this file I just opened" or "look up the entity for `getUser`".

## The escape-hatch contract

Three rules, all non-negotiable:

1. **Echo and confirm scope BEFORE any disk write.** Direct invocation skips the TS driver's chunk planning. Infer the chunk from the user's prompt + Cursor's current editor state, then surface the inferred chunk and ask for explicit confirmation. NO writes until the user says "yes" (or equivalent).
2. **Self-fetch git context only if the driver is unavailable.** Try to ask the TS driver via `.legion/queue/` first (see queueing protocol below). If the driver isn't reachable, shell out to the user's `git` binary directly. Either way, never invent git facts.
3. **Set `partial_scan: true` in the structured response payload.** Direct invocation produces partial state — no global-state reconciliation runs. The user must understand that `index.md`, `log.md`, `hot.md`, and the hash manifest will be slightly stale until the next driver pass.

## The confirmation flow

When invoked, respond with a chunk preview:

```
I'll extract entities from this scope:

- src/auth/middleware.ts (full file)
- src/auth/session.ts (full file)

Mode: update (prior wiki state exists for these files).
git context: I'll fetch from .legion/queue/ if the driver is running, otherwise shell to git directly.

This will be a partial scan — index.md and log.md won't update until the next Document or Update run.

Confirm? (yes / no / refine scope)
```

If user says "yes": proceed to Phase 1 with the inferred payload.
If user says "no" or "refine": adjust the inferred chunk per their feedback, re-confirm.

## Driver-or-direct git context

Try driver first:

1. Write a request file `.legion/queue/git-context-request-<timestamp>.json` with the list of file paths needing git context.
2. Wait up to 2 seconds for `.legion/queue/git-context-response-<timestamp>.json` to appear.
3. If response file appears: read and use.
4. If no response: shell to `git log` / `git blame` directly using the user's `git` binary.

Either way, write the resulting payload into your in-memory invocation state and proceed to Phase 1.

## Mode inference

Direct invocations don't get a `mode` field from a driver. Infer:

- User mentions a single file or a small set of files explicitly → `mode: document` if no `prior_state` exists for them, else `mode: update`.
- User says "scan this directory" or names a subtree → `mode: scan-directory`.
- User says "audit", "lint", "health check" → `mode: lint`.
- Ambiguous → ask in the confirmation message before proceeding.

## Response payload

Identical to canonical-invocation response, with one mandatory field:

```json
{
  "partial_scan": true,
  "...rest of payload as usual..."
}
```

The TS driver uses this flag to know it must run a reconciliation pass before any other downstream consumer reads the wiki global state.

## When NOT to use direct invocation

- Bulk scans of more than ~10 files at once → use the extension's Document/Update buttons instead. The TS driver is much faster at chunk planning and parallelization.
- Cross-cutting work that needs global state (e.g., "find all dead links in the wiki") → use lint mode through the extension.

Direct invocation is convenience, not canon. The TS driver path is the always-correct path.
