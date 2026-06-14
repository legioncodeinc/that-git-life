# Parallel Sub-Agent Contract

When wiki-guardian runs in parallel against different chunks (multiple driver invocations during a Document or Update pass), each invocation is a SUB-AGENT with respect to global wiki state. The orchestrator (the Legion VS Code extension's TypeScript driver) is the only writer of global state files. This contract is non-negotiable.

## Do NOT

- Modify `library/knowledge-base/wiki/index.md` — orchestrator (TS driver) updates after all parallel agents finish.
- Modify any `<type>/_index.md` (`entities/_index.md`, `concepts/_index.md`, `decisions/_index.md`, `comparisons/_index.md`, `questions/_index.md`) — same reason.
- Modify `library/knowledge-base/wiki/log.md` — append-at-TOP operation log; orchestrator writes after consolidating responses from all parallel agents.
- Modify `library/knowledge-base/wiki/hot.md` — recency cache rewritten by orchestrator at end of pass.
- Modify `library/knowledge-base/wiki/overview.md` — owned by `library-guardian`, not wiki-guardian.
- Modify `.legion/file-hashes.json` — orchestrator's hash manifest, the delta-tracking key.
- Modify any file under `.legion/` — driver state.
- Modify any source code file in the repo — wiki-guardian is read-only against the codebase.
- Create duplicate pages — check `prior_state` in the invocation payload before creating; update existing if found.
- Run `git` commands directly in the canonical path — `git_context` is pre-computed by the TS driver and provided in the payload. (Direct `@`-mention path may shell out to `git` if the driver is unavailable.)

## DO

- Write per-page content under `library/knowledge-base/wiki/{entities,concepts,decisions,comparisons,questions}/`.
- Append to (or create) `library/knowledge-base/wiki/meta/<YYYY-MM-DD>-contradiction-report.md` when Phase 6 detects contradictions.
- Write `library/knowledge-base/wiki/meta/<YYYY-MM-DD>-lint-report.md` ONLY when invoked in lint mode.
- Emit the structured response payload (see [`guides/10-response-payload.md`](../guides/10-response-payload.md), follow-up) so the orchestrator can reconcile.
- Always include `pages_created`, `pages_updated`, `decisions_filed`, `contradictions_flagged`, `meta_reports_written`, `notification_flags`, `entities_detected`, `gaps`, `lint_findings`, and (for direct `@`-mention) `partial_scan: true` in the response.

## Why

claude-obsidian (which wiki-guardian ports from) learned this the hard way: when parallel sub-agents update global state files, you get race conditions, drift, and lost writes. The post-pass reconciliation pattern keeps writes deterministic and atomic — even when N agents run concurrently. See `gods-hand/refs/claude-obsidian-main/agents/wiki-ingest.md` for the original.

## Source

Ported (with code-doc adaptations) from `gods-hand/refs/claude-obsidian-main/agents/wiki-ingest.md`, the "Do NOT" section.
