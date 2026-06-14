# 00 — Principles

The non-negotiables. Read on every invocation.

> **Source-of-truth docs:** `library/knowledge-base/ai/` (15 docs). The docs are canonical. This Weapon is the playbook. If a finding contradicts the docs, the docs are wrong (update them) or the finding is wrong (revise it). The third option — silently ignore — is not allowed.

---

## The twelve principles

### 1. Read the docs first — always

mind-guardian opens `library/knowledge-base/ai/README.md` and the doc(s) most relevant to the question on every invocation. The docs are the source of truth. If a question reveals a gap, the docs are updated **before** the answer is given.

The 15 docs:

| Doc | Owns |
|---|---|
| `README.md` | Index, coach lineup, model slot table, key source files, RAG status |
| `coach-architecture.md` | The host product's coach/agent lineup, `routeToCoach()` classifier, level gating, persona defaults |
| `prompt-engineering.md` | Per-coach default prompts, profile injection, tone, session summary |
| `prompt-cascade-architecture.md` | 5-layer `composeSystemPrompt()`, XML delimiters, `PromptVersion` |
| `onboarding-ai.md` | `streamOnboardingChat()`, profile extraction, welcome post, attachments |
| `matching.md` | `runLLMMatching()`, complementarity scoring, `AiMatchResult` |
| `rag-vector-strategy.md` | Qdrant collections, Cohere embedding, two-stage retrieval, HNSW |
| `vector-payload-schema.md` | Payload field definitions per collection, indexing decisions |
| `knowledge-base.md` | `KnowledgeDocument` types, context injection paths, text-budget fallback |
| `memory-summarization.md` | Three-tier memory, `generateSessionSummary()`, decay, `MediaSummarizer` |
| `context-continuity.md` | Session state machine, 40-turn compaction, `reconstructSession()`, TTL |
| `observability-evaluation.md` | `AiTrace` model, `traceAICall()`, LLM-as-judge eval, sycophancy |
| `multimodal-media-pipeline.md` | Image/video, Deepgram, `media-{tenantId}`, `MediaSummarizer` |
| `agent-orchestration.md` | `runOrchestrator()`, `assembleContextPacket()`, `AgentContextConfig` |
| `graphrag-knowledge-graph.md` | `GraphEntity`/`GraphRelationship`, `graph-retriever.ts`, RRF (gated) |

### 2. Stack is the recommended default

The recommended canonical stack is the default. Substitutions are findings unless the host repo's `library/knowledge-base/ai/` explicitly overrides:

| Layer | Recommended | Source |
|---|---|---|
| Gateway | OpenRouter | `library/knowledge-base/ai/coach-architecture.md §3` |
| Chat model | Llama 3.3 70B Instruct | `PlatformConfig.modelChat` |
| Fast / classifier | Llama 3.1 8B Instruct | `PlatformConfig.modelFast` |
| Vision | Llama 3.2 11B Vision Instruct | `PlatformConfig.modelVision` |
| Embedding | Cohere `embed-english-v3.0` (1024-dim cosine) | `library/knowledge-base/ai/rag-vector-strategy.md §3` |
| Rerank | Cohere `rerank-v3.5` (top-K 20 → top-N 5) | `library/knowledge-base/ai/rag-vector-strategy.md §6` |
| Vector DB | Qdrant per-tenant `{type}-{tenantId}` | `library/knowledge-base/ai/rag-vector-strategy.md §1` |
| Working memory | Valkey (TTL 7200s) | `library/knowledge-base/ai/memory-summarization.md §3` |
| Session memory | Postgres `AiChatSession` | `library/knowledge-base/ai/agent-orchestration.md §4` |
| Long-term memory | Qdrant `conversations-{tenantId}` (+ optional graph) | `library/knowledge-base/ai/memory-summarization.md §2` |
| Observability | `AiTrace` Postgres + `traceAICall()` | `library/knowledge-base/ai/observability-evaluation.md §2` |
| STT | Deepgram nova-3 (batch) | `library/knowledge-base/ai/multimodal-media-pipeline.md §5` |

A push to swap (e.g., Pinecone for Qdrant, OpenAI embeddings for Cohere, Redis for Valkey) requires updating the corresponding doc in `library/knowledge-base/ai/` **first**. Never silently substitute.

### 3. Models live in `PlatformConfig`, not in code

`getAIModels()` reads `PlatformConfig.modelChat`, `modelFast`, `modelVision`. Cached in Valkey under `platform:ai-models` for 1 hour. Never hardcode model names. SA edits the slots; mind-guardian flags hardcoded models as **must-fix**.

After a slot change, `invalidateAIModelsCache()` MUST be called from the SA route to flush the Valkey entry. See `guides/19-llm-provider-config.md`.

### 4. Every LLM call is traced

`traceAICall()` wraps every call. Untraced calls are **must-fix**. Even fire-and-forget calls — even router calls. Flag any orchestrator that does NOT wrap its routing/classifier call in `traceAICall()` on every observability audit until closed (this is a recurring gap pattern; track concrete instances in `library/knowledge-base/ai/observability-evaluation.md`).

`AiTrace` records: `composedPromptTokens`, `completionTokens`, `llmLatencyMs`, `retrievedChunks`, `knowledgeChunks`, `retrievalLatencyMs`, `assistantResponse`, plus eval-worker-populated `retrievalScore`, `faithfulnessScore`, `routingCorrect`, `agreementScore`. See `guides/16-observability.md`.

### 5. Per-tenant isolation is mandatory

Every Qdrant query MUST include `tenant_id` (and usually `user_id`). Missing `tenant_id` filter on a query is a **security finding** (hand to `security-guardian`). Per-user collections were rejected at design time (10x memory overhead at 10K users); user isolation is via indexed payload fields.

The `tenant_id` payload field is **belt-and-suspenders** — the collection is already tenant-scoped by name (`knowledge-{tenantId}`), but the payload field ensures cross-tenant protection even if collection routing breaks. See `guides/09-vector-payload-schema.md`.

### 6. Indexed-payload-only filters

`strict_mode_config: { enabled: true }` rejects filters on unindexed fields, preventing silent full-scans (50–200ms per query → 2–5ms with index). Adding a filter on a new field requires adding the index in `COMMON_INDEXES` first. See `guides/09-vector-payload-schema.md`.

### 7. Cohere `rerank-v3.5` is non-optional in the two-stage pipeline

Vector recall pulls the top-K (default `KNOWLEDGE_CANDIDATES = 20`), rerank narrows to top-N (default `KNOWLEDGE_TOP_N = 5`). Skipping rerank is a finding. The fallback (on Cohere error) is top-K-by-ANN-score, but that fallback is a degradation, not a design.

Episodic retrieval has its own constants: `EPISODIC_CANDIDATES = 10`, `EPISODIC_TOP_N = 3`. See `guides/10-cohere-embedding-and-rerank.md`.

### 8. Fixed-size chunking is the default (Vectara NAACL 2025)

Per the Vectara NAACL 2025 paper [*Is Semantic Chunking Worth the Computational Cost?*](https://arxiv.org/abs/2410.13070) (arXiv:2410.13070), recursive character splitting consistently performs as well or better than semantic chunking on realistic document sets. Vendor "semantic chunking" claims (15–40% lift) are typically on synthetic / hand-picked corpora; the Vectara result is on realistic ones.

**Current implementation:** `chunkText()` in `knowledge-indexer.ts` produces 500-character chunks with 20% overlap. ~125 tokens per chunk — below Cohere's optimal ~512-token window, a deliberate trade-off for smaller Qdrant point counts and precise retrieval.

**Implication:** if a contributor proposes adopting "semantic chunking" because of a vendor blog, the answer is "show me the eval lift on our corpus, or stay on recursive character." See `research/2026-04-25-vectara-naacl-2025-chunking.md`.

### 9. Three-tier memory boundaries are load-bearing

| Tier | Storage | Content | TTL |
|---|---|---|---|
| Working | Valkey `session:working:{sessionId}` | Full `SessionTurn[]` | 2 hours |
| Session | Postgres `AiChatSession.messages` + `summary` | Raw history + 200–300 word summary | Indefinite (audit) |
| Long-term | Qdrant `conversations-{tenantId}` (+ optional graph) | `session_summary` / `episodic_summary` / `semantic_fact` | Until consolidated or GDPR-deleted |

**Don't mix tiers.** Don't put session state in working memory (Valkey is ephemeral, the lock is the point). Don't put episodic vectors in Postgres (no semantic search). Don't put raw turns in Qdrant (Postgres is the audit log). See `guides/12-three-tier-memory.md`.

### 10. 40-turn compaction with Valkey lock

`appendTurnAndMaybeCompact()` triggers compaction at 40 turns. `COMPACT_TURNS = 30` are summarized; `RETAIN_AFTER_COMPACT = 10` are kept in Valkey. The lock `compact:lock:{sessionId}` (NX, EX 600) prevents double-compaction under concurrent appends.

Up to `MAX_RETRIES = 3` attempts on failure. On final failure, status reverts to `"active"` and the lock is released — un-compacted turns remain in Valkey. **No data loss.**

Adjusting the threshold requires updating `context-continuity.md` and a measured eval pass. The 40 figure is calibrated for ~6,000–10,000 tokens of raw history fitting alongside system prompt + knowledge in current model windows. See `guides/13-context-continuity.md`.

### 11. Sycophancy is a measured failure mode, not a vibe

The `[COACHING_QUALITY]` block in the prompt cascade is hardcoded (not configurable). `computeAgreementRate()` measures the proportion of agreement vs. challenge patterns in coach responses, written to `AiTrace.agreementScore` asynchronously.

**Targets:**
- User agreement rate > 0.7 over last 30 days → flag for coach review.
- Tenant-wide agreement rate > 0.6 → alert engineering — prompt cascade may have drifted.

If sycophancy trends up, the lever is the prompt cascade or coach personality — not "tune the temperature". See `guides/17-evaluation-discipline.md`.

### 12. The `[INSTRUCTION_HIERARCHY]` block is always last

The `[INSTRUCTION_HIERARCHY]` block declares which earlier instructions win on conflict (priority: SYSTEM_FOUNDATION → PLATFORM_SAFETY_RULES → PLATFORM_FOUNDATION/GUIDELINES → TENANT_* → COACH_PERSONALITY → COACHING_QUALITY → USER_CONTEXT). Reordering or removing it breaks override discipline.

**Always last** — closest to the conversation window — because LLMs weight recent instructions more heavily. The structure is in `composeSystemPrompt()` in `ai-prompt-builder.ts`. See `guides/03-prompt-cascade.md`.

---

## Severity rubric

Three levels only:

| Severity | Examples | Blocks PR? |
|---|---|---|
| **Must-fix** | Untraced LLM call, missing `tenant_id` filter, hardcoded model, broken `[INSTRUCTION_HIERARCHY]`, direct provider-API call (not OpenRouter), per-user/global Qdrant collection, raw turns in Qdrant, prompt change without `PromptVersion`, rerank skipped, wrong Cohere input type, `temperature`/`max_tokens` drift from doc | Yes |
| **Should-refactor** | Drifted top-K/top-N, un-tuned chunker, coach prompt overdue for sycophancy review, routing call uses `modelChat`, cached coach persona TTL drift from 600s, `appendTurnAndMaybeCompact` lock TTL drift from 600s, latent unindexed field that's about to become a filter | No — open follow-up |
| **Style** | Naming nits, where to put a private helper, comment density | No — suggestion only |

The severity of a finding is the finding's credibility. Calling a style nit "must-fix" destroys trust.

---

## First-move checklist

Before writing findings, confirm:

- [ ] `library/knowledge-base/ai/README.md` opened; relevant doc(s) identified.
- [ ] Invocation classified per the routing table in `SKILL.md`.
- [ ] Stack confirmed (Qdrant + Cohere `rerank-v3.5` + Valkey + OpenRouter + Llama models + Deepgram). Substitutions tagged.
- [ ] Code source-of-truth file(s) located in the host repo's AI library (typically a `lib/` or `src/lib/` folder, exact path defined by the host).
- [ ] Severity rubric in mind.
- [ ] Every claim cited (file:line + doc + Weapon guide section).

## Cross-Angel boundaries

Below is what mind-guardian *does not* own. Hand off if the question is primarily:

| Question type | Owner |
|---|---|
| Indexing, partitioning, retention, query plans on `AiTrace`/`PromptVersion`/`AgentContextConfig`/`AiCoachConfig`/`KnowledgeDocument`/`AiChatSession`/`AiMatchResult` | `db-guardian` |
| React component shape of chat UI, SSE rendering, Suspense / error boundary composition for `/api/ai/chat/message` | `react-guardian` |
| Prompt-injection audit, OpenRouter / Cohere / Deepgram key handling, PII / data residency in retrieved chunks, routing-prompt as injection vector | `security-guardian` |
| AI feature PRD authoring (new coach, GraphRAG enablement) | `library-guardian` |
| Post-implementation QA verification (eval suite as audit evidence) | `quality-guardian` |
| `KnowledgeDocument` content also indexable by search engines | coordinated with `seo-aeo-guardian` |
| Coach registry / asset catalog entry | `asset-guardian` |

mind-guardian *surfaces* concerns in these areas with file:line; the audit / authoring is theirs.

## Scope explicitly excluded

- **Generic AI patterns / framework choice / vendor comparisons** — the recommended stack uses a homegrown orchestrator pattern (`runOrchestrator()`); generic alternatives (Mastra/LangGraph/Vercel AI SDK/Pydantic AI) are in `references/` for awareness only.
- **Visual design / token / spacing for AI surfaces** — `ux-ui-guardian`.
- **Generic React component patterns for chat UI** — `react-guardian`.
- **Database schema for non-AI tables** — `db-guardian`.

## Recurring gap patterns

mind-guardian flags these patterns on every applicable invocation. Each host repo's `library/knowledge-base/ai/` should track its own concrete instances under an "open gaps" section. See `guides/20-common-failure-modes.md` for the full list.

1. Routing-call tracing gap (orchestrator doesn't wrap its routing/classifier call in `traceAICall()`).
2. Auxiliary-collection 