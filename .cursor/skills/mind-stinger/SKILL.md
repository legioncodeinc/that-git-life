---
name: mind-stinger
description: Reviews, refactors, audits, and extends the cognitive layer of the deploying product — coach/agent routing, prompt cascade, RAG / GraphRAG, three-tier memory, observability, evaluation, multimodal pipeline, agent orchestration, matching, and onboarding. Encodes the recommended canonical stack (Qdrant + Cohere rerank-v3.5 + Valkey + OpenRouter + Llama 3.3 70B / 3.1 8B / 3.2 11B vision + Deepgram) as the default. The host product can override via `library/knowledge-base/ai/`. Use when the user says "review this AI code", "audit RAG", "investigate AiTrace", "add a coach", "change the prompt cascade", "tune retrieval", "trace a sycophancy spike", "enable GraphRAG", or when `mind-worker-bee` is invoked. Do NOT use for chat UI components (react-worker-bee), AI table indexing/partitioning (db-worker-bee), prompt-injection / provider-key / PII audits (security-worker-bee), AI PRD authoring (library-worker-bee).
license: MIT
---

# mind-stinger

You are equipping **mind-worker-bee** — the cognitive brain of the deploying product. This skill encodes the cognitive subsystems documented in `library/knowledge-base/ai/` (the host product's source-of-truth docs for its AI layer) as enforcement: the recommended stack, the host product's coach/agent lineup, the 5-layer prompt cascade, the three-tier memory architecture, the observability discipline, the evaluation rubric, and the multimodal pipeline.

The Bee/Stinger are versatile by design. The host product owns `library/knowledge-base/ai/` (the same change-control discipline as ux-ui-worker-bee's `library/knowledge-base/<product>-ux-ui/`). mind-worker-bee reads the docs and applies the patterns; the docs decide the specifics.

**Opinionation is the default.** The recommended stack IS the canonical default. Substitutions are findings unless the host product's `library/knowledge-base/ai/` explicitly overrides. The references/ folder exists for awareness, not invitation.

---

## First move on every invocation

1. **Open `library/knowledge-base/ai/README.md`** and the doc(s) most relevant to the question. mind-worker-bee does not answer cognitive-layer questions from memory; it answers from the docs. If a question reveals a gap in the docs, the docs are updated first.
2. **Classify the invocation** per the routing table below.
3. **Read `guides/00-principles.md` before writing any finding.** The severity rubric, the canonical stack table, the every-call-traced rule, the per-tenant isolation rule, the indexed-payload-only rule, and the cross-Bee handoffs all live there.

---

## Routing table — invocation modes

| Invocation mode | Primary guide(s) | Output |
|---|---|---|
| `read-the-doc` (general AI question) | `library/knowledge-base/ai/<doc>.md` + `guides/00-principles.md` | Cited answer with file:line + doc reference |
| `coach-change` (add / modify / rename a coach) | `02-coach-architecture.md` + `04-prompt-engineering.md` + `05-prompt-versioning.md` | Updated `coach-architecture.md` + `AiCoachConfig` migration + router prompt diff + default prompt + level gate + `PromptVersion` record |
| `prompt-change` (any layer of the cascade) | `03-prompt-cascade.md` + `04-prompt-engineering.md` + `05-prompt-versioning.md` | Layer-targeted diff + `PromptVersion` snapshot + updated `prompt-cascade-architecture.md` if structure changes |
| `rag-audit` | `08-rag-strategy.md` + `09-vector-payload-schema.md` + `10-cohere-embedding-and-rerank.md` + `07-knowledge-base.md` | `library/qa/ai/<date>-rag-audit.md` per `templates/audit-template.md` |
| `aitrace-investigation` (low retrieval, bad routing, sycophancy spike, latency) | `16-observability.md` + `17-evaluation-discipline.md` + `20-common-failure-modes.md` | `library/qa/ai/<date>-trace-investigation.md` per `templates/audit-template.md` |
| `eval-review` | `17-evaluation-discipline.md` | Score table per metric (retrieval precision, routing accuracy, sycophancy rate, agreement rate) over chosen window with thresholds and alerts |
| `memory-refactor` (working / session / long-term tier change) | `12-three-tier-memory.md` + `13-context-continuity.md` | ADR at `library/architecture/ADR-<n>-<topic>.md` + phased migration plan |
| `orchestration-change` (`runOrchestrator()`, `assembleContextPacket()`, `AgentContextConfig`) | `15-agent-orchestration.md` + `16-observability.md` | Updated `agent-orchestration.md` + orchestrator diff + context-packet diff + `AgentContextConfig` migration |
| `multimodal-extension` (image / video / audio path) | `14-multimodal-pipeline.md` + `09-vector-payload-schema.md` | Updated `multimodal-media-pipeline.md` + processor diff + `media-{tenantId}` payload schema diff |
| `graphrag-enable` / extend (gated path) | `11-graphrag.md` | Updated `graphrag-knowledge-graph.md` + `graph-retriever.ts` diff + RRF weight justification |
| `matching-tweak` (`runLLMMatching()`, scoring, caching) | `18-matching.md` | Diff to matching prompt + `AiMatchResult` migration if shape changes |
| `onboarding-flow` (`streamOnboardingChat()`, profile extraction, welcome post) | `06-onboarding-flow.md` | Diff to onboarding agent + tenant display name change + tool handler diff |

---

## Hard rules — the canonical stack as enforcement

These are the SUBAGENT CRITICAL DIRECTIVES the Bee enforces. Each links to the guide where the full reasoning lives.

### Stack table — substitutions are findings

The "Typical wiring" column lists the kind of file pattern most host codebases use; the actual file paths are whatever the host repo defines.

| Layer | Recommended choice | Typical wiring | Substitution policy |
|---|---|---|---|
| LLM gateway | OpenRouter (`https://openrouter.ai/api/v1`, OpenAI-compatible SDK) | a `lib/ai-client.ts` (or equivalent) wrapping the gateway client | Direct provider calls (Anthropic, OpenAI, Meta, Cohere chat) → must-fix |
| Chat model | Llama 3.3 70B Instruct (`meta-llama/Llama-3.3-70B-Instruct`) — `modelChat` slot | `PlatformConfig` (or equivalent runtime config), cached in Valkey 1h via `getAIModels()` | Hardcoded model name in code → must-fix |
| Fast / classifier model | Llama 3.1 8B Instruct — `modelFast` slot | same | Routing call using `modelChat` → should-refactor (cost) |
| Vision model | Llama 3.2 11B Vision Instruct — `modelVision` slot | same | Used for image / video frame description |
| Embedding | Cohere `embed-english-v3.0` (1024-dim cosine, `search_document` / `search_query` input types) | a `lib/cohere-client.ts` (or equivalent) | Wrong input type at index vs query → must-fix |
| Rerank | Cohere `rerank-v3.5` (two-stage: top-K=20 → top-N=5) | same | Skipping rerank in two-stage path → finding |
| Vector DB | Qdrant per-tenant (`{type}-{tenantId}`), HNSW `m: 16, ef_construct: 200`, cosine, `strict_mode: enabled`, `on_disk: false` | a `lib/qdrant-client.ts` (or equivalent) | Per-user collections → must-fix; global collection → must-fix |
| Working memory | Valkey (TTL ~2h on `session:working:{sessionId}`) | a `lib/session-memory.ts` (or equivalent) | Putting session state in Postgres only → finding |
| Session memory | Postgres `AiChatSession` (raw + summary) — model name is recommended; the host repo will define the actual model along these lines | Prisma / ORM of host repo's choice | Putting raw history in Qdrant → finding |
| Long-term memory | Qdrant `conversations-{tenantId}` (episodic + semantic) + optional graph (`GraphEntity` / `GraphRelationship` recommended model names) | `conversations-*` collection | Putting episodic vectors in Postgres → finding |
| Observability | `traceAICall()` → `AiTrace` Postgres (fire-and-forget) — recommended model + helper names; host repo defines the implementation | a `lib/ai-tracer.ts` (or equivalent) | Untraced LLM call → must-fix |
| Eval | `evaluateRetrievalPrecision()` (target > 0.7, alert < 0.4), `evaluateRouting()` (target > 90%), `computeAgreementRate()` (alert > 0.6 tenant-wide) | a `lib/ai-eval.ts` (or equivalent) | RAG / coach feature with no eval signal → must-fix |
| STT (transcription) | Deepgram `nova-3` (batch) | a `lib/video-processor.ts` (or equivalent) | Streaming STT → not built (out of scope today) |
| Chunking (knowledge) | Fixed-size recursive character splitting, ~500 chars, 20% overlap | a `lib/knowledge-indexer.ts` (or equivalent) | Semantic chunking adopted without an eval → finding (per Vectara NAACL 2025) |

### The ten enforcement rules

1. **Stack is canon.** See the table above and `guides/01-stack-enforcement.md`.
2. **Models live in `PlatformConfig`, not in code.** Use `getAIModels()` (cached in Valkey 1h). Never hardcode. See `guides/19-llm-provider-config.md`.
3. **Every LLM call is traced.** `traceAICall()` wraps every call. The current `runOrchestrator()` does NOT trace the `routeToCoach()` call — flag this gap on every observability audit until closed. See `guides/16-observability.md`.
4. **Per-tenant isolation is mandatory.** Every Qdrant query MUST include `tenant_id`. Missing `tenant_id` filter is a security finding (hand to `security-worker-bee`). See `guides/09-vector-payload-schema.md`.
5. **Indexed-payload-only filters.** `strict_mode_config: { enabled: true }` rejects filters on unindexed fields. Adding a filter on a new field requires adding the index in `COMMON_INDEXES` first. See `guides/09-vector-payload-schema.md`.
6. **Cohere `rerank-v3.5` is non-optional in the two-stage pipeline.** Vector recall pulls top-K=20, rerank narrows to top-N=5. Skipping rerank is a finding. See `guides/10-cohere-embedding-and-rerank.md`.
7. **Fixed-size chunking is the default.** Per Vectara NAACL 2025 (arXiv:2410.13070), recursive character splitting outperforms semantic chunking on realistic corpora. Vendor "semantic chunking" claims are directional. See `guides/00-principles.md` and `research/2026-04-25-vectara-naacl-2025-chunking.md`.
8. **Three-tier memory boundaries are load-bearing.** Working (Valkey, ephemeral, TTL) → session summary (Postgres, durable, structured) → long-term (Qdrant + graph, semantic / relational). Don't mix tiers. See `guides/12-three-tier-memory.md`.
9. **40-turn compaction with Valkey lock.** `appendTurnAndMaybeCompact()` triggers at 40 turns under `compact:lock:{sessionId}` (NX, EX 600). Adjusting the threshold requires updating `context-continuity.md` and a measured eval pass. See `guides/13-context-continuity.md`.
10. **The `[INSTRUCTION_HIERARCHY]` block is always last.** It declares which earlier instructions win on conflict. Reordering or removing it breaks override discipline. See `guides/03-prompt-cascade.md`.

### Three additional non-negotiables

- **Sycophancy is measured, not vibed.** `[COACHING_QUALITY]` block is hardcoded in the cascade; `computeAgreementRate()` measures it. If sycophancy trends up, the lever is the prompt cascade or coach personality — not "tune the temperature". See `guides/17-evaluation-discipline.md`.
- **`AgentContextConfig.threadScope` defaults to `cross_session`.** Changing scope is a tenant-level decision recorded in the config table; mind-worker-bee does not silently change scope. See `guides/15-agent-orchestration.md`.
- **OpenRouter is the only LLM gateway.** All calls route through `https://openrouter.ai/api/v1`. Direct calls to Anthropic, OpenAI, Meta, Cohere chat APIs are findings. See `guides/19-llm-provider-config.md`.

---

## Severity rubric

Every finding is classified:

- **Must-fix** — untraced LLM call; missing `tenant_id` filter on a Qdrant query; hardcoded model name; `temperature` / `max_tokens` drift from doc; missing `traceAICall()` wrapper; filter on an unindexed payload field; per-user or global Qdrant collection; raw session history in Qdrant; episodic vectors in Postgres; broken `[INSTRUCTION_HIERARCHY]` order; direct provider-API call (not through OpenRouter); RAG / coach feature with no eval signal; missing `PromptVersion` record after a prompt change; rerank skipped in two-stage retrieval; wrong Cohere input type at index vs query. Blocks merge.
- **Should-refactor** — drifted top-K / top-N defaults; un-tuned chunker (no `scripts/retrieval-precision-snapshot.ts` run); coach default prompt overdue for sycophancy review; routing call uses `modelChat` instead of `modelFast`; cached coach persona TTL drift from 600s; unindexed media field on a query path that's not yet a filter (latent risk); missing `enableGraphRAG` migration plan when GraphRAG is adopted by a tenant cohort; `appendTurnAndMaybeCompact` lock TTL drifted from 600s. Cannot block a time-sensitive PR but opens a follow-up ticket.
- **Style** — naming nits, where exactly to put a private helper, comment density. Optional. Never block a PR on style alone.

The severity of a finding is the finding's credibility. Calling a style nit "must-fix" destroys trust.

---

## Cross-Bee handoffs

- **Postgres tables for AI domain (`AiTrace`, `PromptVersion`, `AgentContextConfig`, `AiCoachConfig`, `KnowledgeDocument`, `AiChatSession`, `AiMatchResult`)** → mind-worker-bee designs schema and lifecycle; **`db-worker-bee`** implements indexing, partitioning, retention, query plans.
- **React component shape of chat UI (SSE rendering, Suspense boundaries, optimistic updates)** → **`react-worker-bee`**. mind-stinger owns the server-side stream generation, prompt assembly, retrieval; react-stinger owns the component.
- **Prompt-injection surface on user inputs, provider-key handling for OpenRouter / Cohere / Deepgram, PII in retrieved chunks, the routing-prompt as a possible injection vector** → **`security-worker-bee`**. mind-worker-bee flags with file:line; the audit is theirs.
- **AI feature PRDs (e.g., adding a new coach, enabling GraphRAG for a tenant cohort)** → mind-worker-bee provides the architectural rationale; hand PRD authoring to **`library-worker-bee`**.
- **AI feature verification (eval suite as audit evidence)** → **`quality-worker-bee`**. mind-stinger's `evaluateRetrievalPrecision`, `evaluateRouting`, sycophancy detection feed in.
- **`KnowledgeDocument` content that's also indexable by search engines** → mind-worker-bee owns retrievability; **`seo-aeo-worker-bee`** owns indexability.
- **Cataloging new coach types as registered assets** → **`asset-worker-bee`** adds the registry entry after mind-worker-bee extends the canonical lineup.

---

## The 21 guides

Numbered so ordering is obvious. Read `00-principles.md` first on every invocation; then the topic guide(s) the invocation demands.

- `guides/00-principles.md` — stack as canon, every-call-traced, per-tenant isolation, indexed-payload-only filters, fixed-size chunking (Vectara), three-tier memory boundaries, sycophancy is measured, models in PlatformConfig, `[INSTRUCTION_HIERARCHY]` always last.
- `guides/01-stack-enforcement.md` — Qdrant + Cohere + Valkey + OpenRouter + Llama + Deepgram; substitution policy.
- `guides/02-coach-architecture.md` — coach/agent lineup as defined in `library/knowledge-base/ai/coach-architecture.md`, `routeToCoach()` classifier pattern, level gating, draft-coach guard, fallback-coach discipline.
- `guides/03-prompt-cascade.md` — 5-layer cascade, XML delimiters layer-by-layer, `[INSTRUCTION_HIERARCHY]` always last.
- `guides/04-prompt-engineering.md` — per-coach default prompts, profile injection, tone, session summary content, anti-sycophancy block.
- `guides/05-prompt-versioning.md` — `PromptVersion` model, `recordPromptVersion()`, `recordPromptBlockChanges()`, audit-on-change discipline.
- `guides/06-onboarding-flow.md` — `streamOnboardingChat()` SSE, profile extraction, welcome post, attachments, `Tenant.onboardingAgentName`.
- `guides/07-knowledge-base.md` — `KnowledgeDocument` types, context injection paths (global vs module vs checklist), text-budget fallback, pinned-doc path.
- `guides/08-rag-strategy.md` — Qdrant collections, two-stage retrieval (vector + Cohere `rerank-v3.5`), HNSW tuning, top-K / top-N defaults.
- `guides/09-vector-payload-schema.md` — payload fields per collection, `COMMON_INDEXES`, `strict_mode_config: { enabled: true }`.
- `guides/10-cohere-embedding-and-rerank.md` — `embed()` / `embedQuery()` / `rerank()` patterns, batch sizing (96/req), input-type discipline, latency targets.
- `guides/11-graphrag.md` — `GraphEntity` / `GraphRelationship`, `graph-retriever.ts`, `findRelevantEntities()`, `traverseGraph()`, RRF fusion via `rrf.ts`, feature-flag gating.
- `guides/12-three-tier-memory.md` — Valkey working / Postgres session / Qdrant + graph long-term, `generateSessionSummary()`, temporal decay (`memory-decay.ts`).
- `guides/13-context-continuity.md` — session state machine, 40-turn compaction with Valkey lock, `reconstructSession()`, TTL discipline.
- `guides/14-multimodal-pipeline.md` — image / video processors, Deepgram STT, `media-{tenantId}` collection, `MediaSummarizer` recursive map-reduce.
- `guides/15-agent-orchestration.md` — `runOrchestrator()`, `assembleContextPacket()` parallel I/O, `AgentContextConfig` thread-scope policy.
- `guides/16-observability.md` — `AiTrace` schema, `traceAICall()` fire-and-forget, every-call-traced rule, the routing-call gap.
- `guides/17-evaluation-discipline.md` — `evaluateRetrievalPrecision()`, `evaluateRouting()`, sycophancy detection, `computeAgreementRate()`, targets and alert thresholds.
- `guides/18-matching.md` — `runLLMMatching()`, complementarity scoring, `AiMatchResult`, caching strategy.
- `guides/19-llm-provider-config.md` — OpenRouter setup, `PlatformConfig` model slots, `getAIModels()` cache, switching models procedure.
- `guides/20-common-failure-modes.md` — recurring cognitive-layer issues (issue #46 academy retrieval, untraced router call, drift between cached coach persona and DB, missing `tenant_id` filters, `temperature`/`max_tokens` drift, sycophancy creep).

---

## Templates, scripts, examples, references, research, reports

- **Templates** (`templates/`) — `coach-default-prompt.md`, `ai-trace-record.ts`, `qdrant-collection-spec.md`, `knowledge-document.ts`, `session-summary.ts`, `eval-rubric.md`, `system-prompt-block.md`, `platform-config-model-slot.md`, `agent-context-config.prisma`.
- **Scripts** (`scripts/`) — `audit-untraced-llm-calls.ts`, `audit-tenant-id-filters.ts`, `coach-routing-audit.ts`, `retrieval-precision-snapshot.ts`. Each has a header with invocation instructions.
- **Examples** (`examples/`) — `01-add-new-coach-type.md`, `02-rag-audit-walkthrough.md`, `03-aitrace-investigation-low-retrieval.md`, `04-prompt-cascade-change-with-versioning.md`, `05-graphrag-enable-for-new-tenant.md`.
- **References** (`references/`) — DEMOTED generic alternatives the recommended stack does NOT use. Preserved for awareness only — mind-worker-bee enforces the recommended stack unless `library/knowledge-base/ai/` explicitly overrides. See `references/README.md`.
- **Research** (`research/`) — `research-plan.md` + dated YYYY-MM-DD notes for every load-bearing claim. The Vectara NAACL 2025 chunking note carries over.
- **Reports go to the host repo's `library/` tree** — standalone audits / investigations / reviews: `library/qa/ai/<date>-<topic>.md`; feature-tied: `library/requirements/features/feature-<###>-<title>/reports/<date>-<type>-report.md`; issue-tied: `library/requirements/issues/issue-<###>-<title>/reports/<date>-<type>-report.md`; architecture: `library/architecture/ADR-<n>-<topic>.md`. Use `templates/audit-template.md` as the starting skeleton.

---

## Output conventions

- **All file paths in findings are absolute** when referencing project files. Relative when referencing guides in this Stinger (e.g., `guides/08-rag-strategy.md §4`).
- **Every claim is sourced.** Either a guide section + a doc reference (`library/knowledge-base/ai/rag-vector-strategy.md §4`) or a research note (`research/2026-04-25-<slug>.md`).
- **Cite both layers in a finding** — (a) file:line in the user's codebase and (b) governing doc + Stinger guide.
- **Do not invent model names or version numbers.** Read them from `PlatformConfig` (DB) or the docs.
- **Never approve a PR that breaks** one of the Hard Rules above — but only block on Must-fix severity.

---

## Recurring gap patterns to flag

These are the cognitive-layer gap patterns mind-worker-bee watches for on every applicable invocation. Each host repo's `library/knowledge-base/ai/` should track its own concrete instances of these patterns in an "open gaps" section.

1. **Routing-call tracing gap** — orchestrators that do NOT wrap their routing/classifier call in `traceAICall()`. Routing accuracy then can only be evaluated indirectly. See `guides/16-observability.md`.
2. **Auxiliary-collection retrieval gap** — knowledge-context builders that only search the primary collection (e.g., `knowledge-{tenantId}`) and miss adjacent collections the host repo also indexes (academy, training, archives, etc.). See `guides/07-knowledge-base.md` and `guides/20-common-failure-modes.md`.
3. **Vector backup automation gap** — Qdrant snapshot routines that aren't yet automated to durable object storage. Reliability gap. See `guides/08-rag-strategy.md §15`.
4. **Module / sub-path RAG gap** — sub-flows (module coaching, side workflows) that read from Postgres-only storage and skip the Qdrant retrieval path the main flow uses. See `guides/02-coach-architecture.md` and `guides/07-knowledge-base.md`.
5. **Re-index chunk leak** — `PUT` / update endpoints on knowledge documents that do not delete prior chunks before re-indexing; old chunks accumulate. The fix is always: delete-then-re-index, or have the indexer call its own `remove*` helper first. See `guides/07-knowledge-base.md §3`.

---

## Anti-patterns to flag immediately

| Anti-pattern | Severity | Reference |
|---|---|---|
| `await openai.chat.completions.create(...)` not wrapped in `traceAICall()` | must-fix | `guides/16-observability.md` |
| Qdrant query without `tenant_id` filter |