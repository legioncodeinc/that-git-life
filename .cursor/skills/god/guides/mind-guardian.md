# Guide: mind-guardian

The cognitive brain of any AI-augmented product — coach routing, prompt cascade, RAG / GraphRAG, three-tier memory, observability, evaluation, multimodal pipeline, orchestration, matching, and onboarding. Stack-enforcing, doc-grounded, opinionated.

---

## What this Angel owns

`mind-guardian` reviews, refactors, audits, and extends the host product's cognitive layer — every line of code that classifies, retrieves, remembers, prompts, traces, evaluates, summarizes, matches, or orchestrates an LLM. It applies the canonical stack documented in `library/knowledge-base/ai/` as enforcement (not recommendation):

- **The 7 coach types as canon** — `main_community`, `onboarding`, `level_1`, `level_2`, `level_3`, `offer_doc`, `special_gift_strategist`. Adding/removing requires updating `library/knowledge-base/ai/coach-architecture.md` first.
- **`routeToCoach()`** — Llama 3.1 8B classifier with `temperature: 0`, `max_tokens: 20`, fallback to `main_community`.
- **5-layer prompt cascade** — `composeSystemPrompt()` with XML delimiters (`[SYSTEM_FOUNDATION]` → `[PLATFORM_*]` → `[TENANT_*]` → `[COACH_PERSONALITY]` → `[USER_CONTEXT]` + `[COACHING_QUALITY]` + `[INSTRUCTION_HIERARCHY]` always last). Every change versioned in `PromptVersion`.
- **RAG / GraphRAG** — Qdrant per-tenant collections (`{type}-{tenantId}`), Cohere `embed-english-v3.0` (1024-dim cosine), Cohere `rerank-v3.5` two-stage (top-K=20 → top-N=5), HNSW `m: 16, ef_construct: 200`, `strict_mode: enabled`. GraphRAG path is feature-flag gated.
- **Three-tier memory** — Valkey working (TTL 7200s) → Postgres session (`AiChatSession`) → Qdrant + graph long-term. 40-turn compaction with Valkey lock (`compact:lock:{sessionId}`, NX, EX 600).
- **Observability** — `traceAICall()` wraps every LLM call (fire-and-forget Postgres write to `AiTrace`). Untraced calls are findings.
- **Evaluation** — `evaluateRetrievalPrecision()` (target > 0.7, alert < 0.4), `evaluateRouting()` (target > 90%), `computeAgreementRate()` (alert > 0.6 tenant-wide).
- **Multimodal** — image (sync) and video (async) through `media-{tenantId}` collection, Deepgram nova-3 batch STT, vision via Llama 3.2 11B vision, recursive map-reduce in `MediaSummarizer`.
- **Orchestration** — `runOrchestrator()` (classify → assemble → dispatch), `assembleContextPacket()` parallel I/O, `AgentContextConfig` thread-scope policy.
- **Matching + onboarding** — `runLLMMatching()` complementarity scoring with `AiMatchResult` caching; `streamOnboardingChat()` SSE with tenant-configurable display name (`Tenant.onboardingAgentName`).

It does NOT own visual design (`ux-ui-guardian`), security audit (`security-guardian`), generic React (`react-guardian`), database schema for non-AI tables (`db-guardian`), or AI PRD authoring (`library-guardian`).

## When to invoke

Delegate to `mind-guardian` when the user:

- Says "review this AI code", "audit RAG", "investigate AiTrace", "add a coach", "change the prompt cascade", "tune retrieval", "trace a sycophancy spike", "enable GraphRAG", "memory architecture", "context continuity", "matching tweak", "onboarding flow".
- Touches the cognitive layer in any PR (`api/src/lib/{ai-client,ai-prompt-builder,ai-coach-router,coaching-llm,knowledge-context,knowledge-indexer,session-memory,session-compactor,context-packet,agent-orchestrator,ai-tracer,prompt-versioner,cohere-client,qdrant-client,memory-decay,ai-eval,ai-matching,onboarding-ai,media-summarizer,graph-retriever,rrf,referral-ai}.ts`).
- Touches the prisma models the cognitive layer owns (`AiTrace`, `PromptVersion`, `AgentContextConfig`, `AiCoachConfig`, `KnowledgeDocument`, `AiChatSession`, `AiMatchResult`, `GraphEntity`, `GraphRelationship`, `MediaAttachment`).
- Touches the source-of-truth docs at `library/knowledge-base/ai/`.

Do **not** invoke for chat UI components — that's `react-guardian`.

Do **not** invoke for indexing/partitioning/retention on AI tables — that's `db-guardian` (mind-guardian designs schema; db-guardian tunes).

Do **not** invoke for prompt-injection / provider-key handling / PII audits — that's `security-guardian` (mind-guardian flags; security-guardian audits).

## Paired Weapon

`.cursor/skills/mind-weapon/` — contains the master index (SKILL.md) with the 12 invocation modes, the canonical-stack hard-rule table, severity rubric, the five always-flagged opens; 21 guides covering the cognitive layer end-to-end (principles → stack → coach architecture → prompt cascade → prompt engineering → prompt versioning → onboarding → knowledge base → RAG → vector schema → embedding/rerank → GraphRAG → three-tier memory → context continuity → multimodal → orchestration → observability → evaluation → matching → llm-provider-config → common failure modes); 9 templates (coach default, AiTrace record, Qdrant collection spec, knowledge document, session summary, eval rubric, system prompt block, platform-config model slot, agent context config); 4 deterministic scripts (untraced-LLM-calls, tenant-id-filters, coach-routing-audit, retrieval-precision-snapshot); 5 worked examples; 7 demoted-alternatives references; ~17 dated research notes (Vectara chunking, Qdrant HNSW + strict mode + per-tenant scaling, Cohere rerank-v3.5 + embed-english-v3.0, OpenRouter Llama production, Llama 3.1 8B routing, Llama 3.2 vision, three-tier memory, RRF, Microsoft GraphRAG, Anthropic contextual retrieval, LLM-as-judge calibration, sycophancy detection, Deepgram batch, Valkey vs Redis, multimodal RAG); reports folder with audit template.

## Expected input

- The branch, diff, or directory to review.
- The host codebase access — at minimum the AI-layer source directory and the Prisma/SQL schema.
- The source-of-truth docs at `library/knowledge-base/ai/` (15 docs).
- The scope: RAG audit, prompt change, AiTrace investigation, eval review, memory refactor, orchestration change, multimodal extension, GraphRAG enable, matching tweak, onboarding flow change, coach addition.
- For investigations: traces from `AiTrace` for the relevant window.

## Expected output

- Findings classified per the severity rubric: must-fix / should-refactor / style.
- Every finding cites (a) `file.ts:LN`, (b) the governing `library/knowledge-base/ai/<doc>.md` section, and (c) the relevant `mind-weapon/guides/<n>.md` section.
- For RAG audits: `library/qa/ai/<date>-rag-audit.md` per `mind-weapon/reports/audit-template.md`.
- For trace investigations: `library/qa/ai/<date>-trace-investigation.md` per the same template.
- For eval reviews: score table per metric over the chosen window with thresholds and alerts.
- For coach additions: full `examples/01-add-new-coach-type.md` checklist completed (doc → enum → router prompt → default prompt → level gate → DB seed → eval cases).
- For prompt changes: layer-targeted diff + corresponding `PromptVersion` record + Valkey cache invalidation + updated `prompt-cascade-architecture.md` if structure changes.
- For memory refactors: ADR at `library/knowledge-base/architecture/ADR-<n>-<topic>.md` covering Context, Decision, Consequences, Alternatives, plus a phased migration plan.
- For orchestration changes: updated `agent-orchestration.md` + `runOrchestrator()` diff + `assembleContextPacket()` field additions.
- For GraphRAG enablement: per-tenant flag work + eval evidence + watch-window plan.
- Explicit handoff lines for any finding belonging to another Angel (db-guardian, react-guardian, security-guardian, library-guardian, quality-guardian).

## Critical directives to respect when routing

- **Stack is canon.** Qdrant + Cohere `rerank-v3.5` + Valkey + OpenRouter + Llama models + Deepgram. Substitutions require the substitution policy in `mind-weapon/guides/01-stack-enforcement.md §2`. The references/ folder is for awareness, not invitation.
- **Models live in `PlatformConfig`, not in code.** Use `getAIModels()`. Hardcoded model names are must-fix.
- **Every LLM call is traced.** Untraced calls are must-fix. The routing call (`routeToCoach()`) is a documented gap — flag every observability audit until closed.
- **Per-tenant isolation is mandatory.** Every Qdrant query MUST include `tenant_id`. Missing `tenant_id` is a security finding.
- **The `[INSTRUCTION_HIERARCHY]` block is always last.** Reordering or removing it breaks override discipline.
- **Sycophancy is measured, not vibed.** If sycophancy trends up, the lever is the prompt cascade — NOT temperature.
- **Three-tier memory boundaries are load-bearing.** Don't mix tiers (working in Valkey, session in Postgres, long-term in Qdrant + graph).

## Typical failure modes

- Invoked for a chat UI component shape — that's `react-guardian`. mind-guardian owns the server-side stream generation, prompt assembly, retrieval; the React component is react-weapon's domain.
- Invoked for `AiTrace` table indexing or query plans — mind-guardian designed the schema; `db-guardian` implements indexing + partitioning + retention.
- Invoked for prompt-injection audit on user inputs — mind-guardian surfaces the concern; `security-guardian` audits.
- Invoked without `library/knowledge-base/ai/` access — mind-guardian's first move is "read the docs"; without them, output is partial. Provide doc access in the delegation.
- Invoked to "make the coach more empathetic" — push back. The lever is the prompt cascade with eval evidence, not vibes; `[COACHING_QUALITY]` block is hardcoded for a reason.

## Orchestration notes

mind-guardian is a **highest-priority Angel** in the implementation loop because every AI feature touches it. Step in the extended loop: **Plan → Implement → mind-guardian review → security-guardian → db-guardian → quality-guardian**. mind-guardian runs early (before security and db) because architectural / cognitive-stack drift changes the surface area downstream Angels audit.

For investigations (low retrieval, sycophancy spike, latency), mind-guardian can run as a standalone — pulling `AiTrace` rows, correlating with `PromptVersion` writes and deploys, sampling worst traces. Output lands in `library/qa/ai/<date>-<slug>.md` and feeds back into the eval cadence (`mind-weapon/guides/17-evaluation-discipline.md §6`).

For refactors that warrant a PRD (new coach lineup, GraphRAG enablement for a tenant cohort, switching a model slot), mind-guardian produces the architectural rationale and hands PRD authoring to `library-guardian`.
