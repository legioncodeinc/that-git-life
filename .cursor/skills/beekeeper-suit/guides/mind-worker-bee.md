# Mind Worker Bee - Beekeeper-Suit's Guide

The Beekeeper-Suit routing skill's record of when to invoke `mind-worker-bee`. Use this guide to decide whether a user request belongs to this Bee.

**Bee:** [`.cursor/agents/mind-worker-bee.md`](../../agents/mind-worker-bee.md)
**Stinger:** [`.cursor/skills/mind-stinger/`](../../skills/mind-stinger/)
**Command Brief:** not available (synthesized from agent + stinger files)
**Trigger policy:** on-demand

---

## Domain

mind-worker-bee is the cognitive brain of the deploying product — the Army's authority on every line of code that classifies, retrieves, remembers, prompts, traces, evaluates, summarizes, matches, or orchestrates an LLM. It owns `library/knowledge-base/ai/` with the same change-control discipline applied to other knowledge domains: the docs that live there are the source of truth for the host product's cognitive layer. It reads those docs on every invocation and applies the recommended canonical stack (Qdrant + Cohere rerank-v3.5 + Valkey + OpenRouter + Llama 3.3 70B / 3.1 8B / 3.2 11B vision + Deepgram) as the default unless the docs explicitly override. It owns the host product's coach/agent lineup, the 5-layer prompt cascade, the three-tier memory architecture (Valkey / Postgres / Qdrant + graph), the `traceAICall()` observability discipline, the evaluation suite, the multimodal media pipeline, the orchestrator flow, complementarity matching, and the onboarding agent's streaming.

## Trigger phrases

Route to `mind-worker-bee` when the user says any of:

- "review this AI code"
- "audit RAG"
- "investigate AiTrace"
- "add a coach"
- "change the prompt cascade"
- "tune retrieval"
- "trace a sycophancy spike"
- "enable GraphRAG"
- "memory architecture"
- "context continuity"
- "matching tweak"
- "onboarding flow"

Or when the request implicitly involves the cognitive layer of the product (coach routing, RAG retrieval, LLM observability, prompt engineering, vector storage, embedding, reranking, multimodal pipelines, session memory, or agent orchestration).

## Do NOT route when

- The request is about **chat UI components** (SSE rendering, Suspense boundaries, optimistic updates) — route to `react-worker-bee` instead.
- The request is about **AI table indexing, partitioning, retention, or query plans** for tables like `AiTrace`, `PromptVersion`, `AiChatSession` — route to `db-worker-bee` for implementation; mind-worker-bee designs the schema, db-worker-bee implements the storage layer.
- The request is about **prompt-injection defenses, provider-key handling, PII in retrieved chunks, or security audits** of the AI surface — route to `security-worker-bee`; mind-worker-bee flags findings with file:line and hands the audit off.
- The request is about **AI feature PRD authoring** (writing a product requirements document for a new coach or GraphRAG enablement) — route to `library-worker-bee`; mind-worker-bee supplies architectural rationale only.

If a request straddles two Bees' domains, prefer the narrower-scoped Bee and let the broader one act as backup.

## Inputs the Bee needs

Before invoking, ensure the user has provided (or you can infer):

- **The cognitive-layer area** — which subsystem is in scope: coach routing, RAG, prompt cascade, memory, observability, eval, orchestration, multimodal, GraphRAG, matching, or onboarding.
- **The invocation mode** — one of: `read-the-doc`, `coach-change`, `prompt-change`, `rag-audit`, `aitrace-investigation`, `eval-review`, `memory-refactor`, `orchestration-change`, `multimodal-extension`, `graphrag-enable`, `matching-tweak`, `onboarding-flow`. If not stated, mind-worker-bee classifies from context.
- **Relevant file paths or PR diff** — optional but recommended; if absent, the Bee reads `library/knowledge-base/ai/README.md` and the most relevant doc to orient itself before answering.

## Outputs the Bee produces

- **Primary deliverable:** An audit report, ADR, refactor proposal, code-review with file:line citations, eval suite spec, prompt cascade diff, or AiTrace investigation summary — format depends on invocation mode. Audit-shaped outputs use `mind-stinger/reports/audit-template.md`. Reports land at `library/qa/ai/<date>-<topic>.md`; feature-tied reports at `library/requirements/features/feature-<###>-<title>/reports/<date>-<type>-report.md`; ADRs at `library/architecture/ADR-<n>-<topic>.md`.
- **Secondary deliverable:** Updated `library/knowledge-base/ai/` docs when a gap is uncovered — docs are updated first, then the answer is given.

## Multi-Bee sequences this Bee participates in

- Plan execution loop — always closes with `security-worker-bee` then `quality-worker-bee`
- Coach addition sequence — mind-worker-bee extends the canonical lineup, then `asset-worker-bee` adds the registry entry, and `library-worker-bee` authors the feature PRD if one is needed.
- AI schema change — mind-worker-bee designs the schema and lifecycle; `db-worker-bee` implements indexing, partitioning, and retention.

## Critical directives the orchestrator should respect

- **Stack is the recommended default.** Substitutions (non-Qdrant vector DB, non-Cohere embedding/rerank, non-OpenRouter gateway, non-Llama model, non-Deepgram STT) are findings unless `library/knowledge-base/ai/` explicitly overrides. A push to swap requires updating the corresponding doc first.
- **Models live in `PlatformConfig` (or the host repo's equivalent runtime config), not in code.** `getAIModels()` is cached in Valkey for 1h; hardcoded model names break cache invalidation and are must-fix findings.
- **Every LLM call is traced.** Untraced calls are invisible to the eval suite, sycophancy detection, and incident response. Flag any orchestrator that does not wrap its routing/classifier call in `traceAICall()` on every observability audit until closed.
- **Per-tenant isolation is mandatory.** Every Qdrant query must include `tenant_id`. Missing `tenant_id` is a security finding — flag it and hand to `security-worker-bee`.
- **Indexed-payload-only filters.** `strict_mode_config: { enabled: true }` rejects unindexed-field filters. Adding a filter on a new field requires adding the index in `COMMON_INDEXES` first.
- **Cohere `rerank-v3.5` is non-optional.** Vector recall pulls top-K=20; rerank narrows to top-N=5. Skipping rerank is a finding.
- **Fixed-size chunking is the default.** Per Vectara NAACL 2025 (arXiv:2410.13070), recursive character splitting outperforms semantic chunking. Vendor "semantic chunking" requires a measured eval lift to override.
- **Three-tier memory boundaries are load-bearing.** Working (Valkey, ephemeral, TTL) → session summary (Postgres, durable) → long-term (Qdrant + graph, semantic). Mixing tiers breaks `reconstructSession()` and `applyDecay()`.
- **Sycophancy is measured, not vibed.** `[COACHING_QUALITY]` block is hardcoded; `computeAgreementRate()` measures it. The lever is the prompt cascade or coach personality — not temperature.
- **`[INSTRUCTION_HIERARCHY]` block is always last in the prompt cascade.** Reordering or removing it breaks override discipline (Defense Layer 1 against prompt injection).

(Full list lives in the Bee file's `## Critical directives` section.)

---

*Part of Beekeeper-Suit's roster. See [`.cursor/skills/beekeeper-suit/SKILL.md`](../SKILL.md) for the full Army.*
