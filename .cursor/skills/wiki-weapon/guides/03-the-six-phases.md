# Guide 03 — The Six Phases

For all non-lint invocations (`document` / `update` / `scan-directory`), wiki-guardian runs the same six phases in order. Lint mode follows `guides/09-lint-mode.md` instead (added in follow-up after research).

## Phase 1 — Parse the chunk

For each file in `chunk`:

1. Detect the language from the file extension.
2. **TS/JS files** (`.ts`, `.tsx`, `.js`, `.jsx`): run AST extraction via `ts-morph`. Identify candidate entities — functions, classes, react-components, types, exports. (Per-type extraction tactics in `guides/04-entity-extraction-by-type.md` once research is complete.)
3. **Non-TS/JS files**: do NOT attempt entity extraction. Create a filename-only stub page per `guides/08-stub-pages-for-non-js.md`. Skip to next file.
4. Identify candidate concepts: data flows, architectural patterns, domain models that span multiple files in the chunk.
5. Identify candidate decisions: scan `git_context.recent_commits` for decision-encoding patterns (Phase 5 specifics).

Output of Phase 1: a list of `{candidate_entities, candidate_concepts, candidate_decisions}` to feed the remaining phases.

## Phase 2 — Cross-reference against prior state

For each candidate entity in Phase 1:

1. Look up the entity in `prior_state` (the list of existing wiki pages provided in the invocation payload).
2. If no prior page exists → mark as `new`, queue for Phase 3.
3. If a prior page exists → compare contracts:
   - Signature (parameters, return type, generic constraints)
   - Side effects
   - Dependencies (`depends_on` set)
   - Semantic shift visible in commit diff or message
4. If contracts match → mark as `unchanged`, do NOT rewrite (skip to next candidate).
5. If contracts mismatch → mark as `contradiction`, queue for Phase 6.

## Phase 3 — Author entity pages

For each candidate entity marked `new` or `contradiction`:

1. Open [`templates/entity.md`](../templates/entity.md) and copy.
2. Fill the frontmatter per [`references/frontmatter-schema.md`](../references/frontmatter-schema.md). MUST include `entity_type` from the 13-type catalog, `path`, `language`, `last_commit_hash`.
3. Fill the body sections (Overview, Signature, Behavior, Connections, Tested by, History, Sources). MUST cite source `file:line` for every factual claim. MUST stay ≤300 lines (split if longer per `guides/05-atomic-page-rule.md`).
4. Write to `library/knowledge-base/wiki/entities/<entity-name>.md`.

For entities marked `unchanged`: skip — do not rewrite.

## Phase 4 — Author concept pages

For each candidate concept from Phase 1:

1. Look up in `prior_state` — same logic as Phase 2 but for concepts.
2. If new or changed: copy [`templates/concept.md`](../templates/concept.md), fill, write to `library/knowledge-base/wiki/concepts/<concept-name>.md`.
3. Concepts link upward to entities via `related: [[entities/foo]], [[entities/bar]]`.

## Phase 5 — Detect and file ADRs from commit messages

For each commit in `git_context.recent_commits`:

1. Check the message subject and body against the decision-pattern catalog. (Full catalog in `guides/07-adr-detection.md` once research is complete. For v1, use the heuristics below.)

**High-confidence patterns (file as ADR):**
- `^switch (from )?.+ to .+` (subject)
- `^migrate (from )?.+ to .+` (subject)
- `^replace .+ with .+` (subject)
- `^deprecate .+` (subject)
- `^adopt .+` (subject)
- Body contains `Decision:` or `Rationale:` on its own line
- Body contains `RFC:` or `ADR:` reference

**Low-confidence patterns (file as `questions/` for human review, NOT as ADR):**
- `^refactor .+`, `^restructure .+`, `^reorganize .+` — could be a decision OR mechanical cleanup
- Body mentions trade-offs without explicit decision language

2. For each high-confidence match:
   - Copy [`templates/decision.md`](../templates/decision.md).
   - Fill `commit_sha`, `decision_date` (from commit timestamp), Context (the problem), Decision (the choice), Consequences (downstream impact).
   - Write to `library/knowledge-base/wiki/decisions/<short-title>.md`.

3. For each low-confidence match:
   - Copy [`templates/question.md`](../templates/question.md).
   - Frame the question as "Did commit `{sha}` encode an architectural decision worth filing as an ADR?"
   - Write to `library/knowledge-base/wiki/questions/<short-question>.md`.

4. **NEVER fabricate an ADR** — if the commit message doesn't contain decision-encoding language, do not invent it. The pattern catalog is the only authority.

## Phase 6 — Apply active contradiction protocol

For each entity marked `contradiction` in Phase 2: apply ALL FOUR artifacts per [`guides/06-contradiction-protocol.md`](06-contradiction-protocol.md) and [`references/contradiction-protocol.md`](../references/contradiction-protocol.md). Incomplete handling is a bug.

## Final — Emit the structured response payload

The structured payload schema lives in `guides/10-response-payload.md` (added in follow-up). Required keys: `pages_created`, `pages_updated`, `decisions_filed`, `contradictions_flagged`, `meta_reports_written`, `notification_flags`, `entities_detected`, `gaps`, `lint_findings`, `partial_scan`.

For direct `@`-mention invocations: set `partial_scan: true`.

---

## Source

Phases 1–6 are derived from the wiki-guardian Command Brief's ACTION section. The pattern of "agent writes per-page content, orchestrator reconciles after" is ported from `gods-hand/refs/claude-obsidian-main/agents/wiki-ingest.md`.
