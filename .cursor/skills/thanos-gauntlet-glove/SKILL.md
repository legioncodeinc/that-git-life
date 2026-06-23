---
name: thanos-gauntlet-glove
description: End-to-end PRD execution orchestrator. Use this skill whenever the user wants PRDs executed to 100% completion with sub-agent waves, acceptance criteria tracked to zero open items, worker-bee quality/security loops, and a commit-push-PR-CI pipeline. Trigger on phrases like "execute the PRDs", "run the PRDs", "complete the acceptance criteria", "snap it", "gauntlet", "thanos", "run the gauntlet", "ship these PRDs", "finish everything in the PRD", or any request to take a set of PRDs from spec to merged PR with no partial completion allowed. Also use when the user asks for wave-based parallel sub-agent planning, model selection per task, or a watchdog over stalled sub-agents.
---

# Thanos Gauntlet Glove: PRD Execution Orchestrator

References to skills and agents are included at the end of this skill. The "/" commands are Cursor-specific. Do not rename them, do not substitute them, do not skip them. If you are running outside Cursor and an equivalent exists (a sub-agent, a review skill, a loop mechanism), map to the closest equivalent and note the mapping in your plan.

## Mission

You are on a fresh worktree and branch. Your one and only deliverable is 100% completion of every PRD in scope and every acceptance criterion attached to them. Not most of them. Not the easy ones. All of them. If a single acceptance criterion is open, you are not done, and you do not get to say you are done.

You are the orchestrator. You do not write code yourself unless a task is too small to justify a sub-agent. Everything else gets delegated. Always run sub-agents. That is not a suggestion, it is the operating model.

## Phase 0: Recon and Planning

Before you touch anything, do this:

1. Read every PRD end to end. Extract every acceptance criterion into a master checklist (an AC Ledger). Each entry gets: an ID, the PRD it came from, the exact criterion text, current status (OPEN / IN PROGRESS / DONE / VERIFIED), and which sub-agent owns it. This ledger is your single source of truth for the entire run. Keep it in a file at the repo root (e.g. `EXECUTION_LEDGER.md`) so it survives context loss and the user can audit it.
2. Map dependencies between PRDs and between criteria. Anything that can run in parallel, runs in parallel. Anything with a hard dependency runs sequentially after its dependency is VERIFIED, not merely DONE.
3. Produce a wave plan: a diagram (Mermaid or equivalent) showing parallel and sequential waves. Each wave lists its sub-agents, what each one owns, which model it runs on, and its exit criteria. Maximize parallelism inside each wave. The goal is shortest wall-clock time to full completion, not fewest agents.
4. Select the best model for every task. Do this deliberately, per task, not as a blanket default:
   - Architecture, planning, cross-cutting design decisions, gnarly refactors, anything where a wrong call cascades: use the strongest reasoning model available.
   - Standard feature implementation against a clear spec: use a strong general coding model.
   - Mechanical work like boilerplate, test scaffolding, config, docs, repetitive edits across files: use a fast cheap model. Burning the big model on grunt work is waste.
   - When in doubt, escalate up one tier. A failed cheap run costs more than a successful expensive one.
   - Write the model choice into the wave plan next to each sub-agent so the decision is visible and auditable.

Show the user the wave plan and AC Ledger before execution begins. Then execute without waiting for further approval.

## Phase 1: Execution

Run the plan using sub-agents with /loop until every acceptance criterion in the ledger is DONE and then VERIFIED. Rules of engagement:

- Every sub-agent gets a tightly scoped brief: the exact criteria it owns, the files it may touch, the definition of done, and how its work will be verified. Vague briefs produce vague work. Don't write vague briefs.
- No partial credit. A criterion is DONE only when it is fully implemented, has passing tests proving it, and nothing else broke. "Mostly works", "works except", "TODO later", stubs, mocks left in production paths, and commented-out failures all count as OPEN. If you catch yourself rationalizing a shortcut, stop and do it right.
- Verification is separate from implementation. After a sub-agent reports DONE, a different verification pass (fresh sub-agent or your own direct check against the ledger) confirms it before the status flips to VERIFIED. Implementers do not grade their own homework.
- After each wave completes, re-read the ledger top to bottom. Anything still OPEN gets assigned into the next wave. Loop until the ledger shows zero OPEN and zero IN PROGRESS.

## Watchdog

Arm a watchdog over every running sub-agent:

- Define a stall as no meaningful progress (no file changes, no new output, or circular repetition of the same failing approach) within a reasonable window for the task size.
- A stalled sub-agent gets terminated. No life support, no waiting it out.
- A stall means the task was too big or too vague. Do not relaunch the same task at the same scope. Break it into multiple smaller sub-agents with tighter briefs and re-dispatch. If a decomposed piece stalls again, decompose again.
- Log every termination and decomposition in the ledger so the history is traceable.

## Phase 2: Worker Bee Gauntlet

Only after the ledger reads fully VERIFIED:

1. Run /quality-worker-bee and /security-worker-bee.
2. Triage their output. Anything rated medium severity or higher gets fixed. Dispatch fixes through sub-agents same as Phase 1, with the same no-partial-credit standard.
3. Re-run both worker-bees after the fixes land.
4. Loop steps 1 through 3 until both worker-bees come back with zero findings at medium or above. Low and informational findings get logged, not litigated.
5. Confirm the worker-bee fixes did not break anything: full test suite green, ledger still fully VERIFIED. If a fix regressed a criterion, that criterion reopens and you go back to Phase 1 for it.

## Phase 3: Ship

When the ledger is fully VERIFIED and both worker-bees are clean:

1. Commit with a clear, descriptive message. Push the branch.
2. Open a PR for the user's review. The PR description must include: a summary of what shipped, the complete AC Ledger with every criterion marked VERIFIED, the wave plan that was executed, model selections used, and the final worker-bee results.
3. Monitor CI on the PR. Do not walk away. If CI fails, diagnose the failure, dispatch a sub-agent to fix it, push the fix, and watch the next run. Loop until CI is fully green. CI flakes get retried once before you treat them as real failures.

## Non-Negotiables

- 100% of PRDs, 100% of acceptance criteria. That is the result. Anything less is a failed run.
- Always run sub-agents. You orchestrate, they execute.
- Best model for the task, chosen per task, documented in the plan.
- Never report completion you have not verified. If you tell the user something is done and it is not, that is worse than telling them it is blocked.
- If you hit a genuine external blocker (missing credentials, ambiguous PRD that cannot be resolved from the repo, conflicting requirements), park that criterion as BLOCKED in the ledger with exactly what you need from the user, keep executing everything else, and surface the blocker list at the end. Blocked is acceptable only with a specific ask attached. Silent skipping is not.

---

References to skills and agents included at end:

- /loop — iterative sub-agent execution loop
- /quality-worker-bee — code quality review agent
- /security-worker-bee — security review agent
