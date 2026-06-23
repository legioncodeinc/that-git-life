# references/ — Demoted Generic AI Patterns

> **These are alternatives we DON'T use; preserved for context only because mind-worker-bee supersedes the retired ai-platform-worker-bee.**

The cognitive layer of the deploying product runs on an opinionated stack documented in `guides/01-stack-enforcement.md`:

- **Gateway:** OpenRouter
- **Models:** Llama 3.3 70B / 3.1 8B / 3.2 11B vision (via OpenRouter, configured in `PlatformConfig`)
- **Embedding:** Cohere `embed-english-v3.0`
- **Rerank:** Cohere `rerank-v3.5`
- **Vector DB:** Qdrant per-tenant
- **Working memory:** Valkey
- **Session memory:** Postgres `AiChatSession`
- **Long-term memory:** Qdrant `conversations-{tenantId}` + optional `GraphEntity`/`GraphRelationship` graph (gated)
- **Observability:** `AiTrace` Postgres
- **STT:** Deepgram

The notes in this folder document the alternatives we **considered and did not pick**. They exist for two reasons:

1. **Substitution-pressure context** — when a contributor or vendor pitches a substitution, the references explain why we already chose the canonical option.
2. **Future-substitution ground truth** — if the canonical choice ever needs to change, these notes are the starting point for a new evaluation.

**Active recommendations live in `guides/`. References are demoted context.**

---

## Files in this folder

| File | What it documents |
|---|---|
| `generic-orchestration-frameworks.md` | Mastra / Vercel AI SDK / LangGraph / Pydantic AI / LlamaIndex / CrewAI as alternatives to the deploying product's homegrown `runOrchestrator()` |
| `generic-embedding-model-choice.md` | BGE-M3 / Voyage / OpenAI text-embedding-3 as alternatives to Cohere `embed-english-v3.0` |
| `generic-vector-db-choice.md` | pgvector / Pinecone / Weaviate / Milvus as alternatives to Qdrant |
| `generic-llm-gateway-choice.md` | Portkey / LiteLLM as alternatives to OpenRouter |
| `generic-eval-platforms.md` | RAGAS / DeepEval / Langfuse / Braintrust / Helicone as alternatives to the deploying product's homegrown `ai-eval.ts` + `AiTrace` |
| `generic-graph-db-choice.md` | Neo4j as an alternative to the deploying product's Postgres-native graph (`GraphEntity` / `GraphRelationship`) |
| `vectara-naacl-2025-chunking-finding.md` | The Vectara NAACL 2025 paper (load-bearing reference for fixed-size chunking — **carried over verbatim from ai-platform-stinger's research** because it's the canonical defense against vendor "semantic chunking" claims) |

---

## Substitution policy reminder

A push to substitute requires (per `guides/01-stack-enforcement.md §2`):

1. Update the corresponding `library/knowledge-base/ai/<doc>.md` first.
2. Eval evidence — show the new component meets or beats the canonical one on the deploying product's metrics.
3. Migration plan — for stateful components, phased migration with parallel-running.
4. Reference-folder demotion of the previous choice.

Without all four, the substitution is a finding.
