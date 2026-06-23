# AI Tools Platform Worker Bee - Beekeeper-Suit's Guide

The Beekeeper-Suit routing skill's record of when to invoke `ai-tools-platform-worker-bee`. Use this guide to decide whether a user request belongs to this Bee.

**Bee:** [`.cursor/agents/ai-tools-platform-worker-bee.md`](../../agents/ai-tools-platform-worker-bee.md)
**Stinger:** [`.cursor/skills/ai-tools-platform-stinger/`](../../skills/ai-tools-platform-stinger/)
**Command Brief:** not available (synthesized from agent + stinger files)
**Trigger policy:** on-demand

---

## Domain

`ai-tools-platform-worker-bee` is the single authority on AI tooling infrastructure for developers. It owns every decision between a developer's intent and a running LLM: which AI gateway to use and how to configure it (Portkey, OpenRouter, LiteLLM), which cloud provider to choose (AWS Bedrock, Vertex AI, Azure OpenAI, direct APIs), which models to run at each capability and cost tier (Claude, GPT, Gemini, open-weight), how to optimize AI spend, how to set up a local LLM workflow (Ollama, LM Studio, llama.cpp), and which GPU cloud vendor to use for open-weight model inference (Modal, Runpod, Together AI, Fireworks AI, Groq). It also decides which MCP servers and IDE plugins developers should install for maximum productivity. Every recommendation applies the canonical stack defaults from the stinger and is time-stamped with a re-evaluation trigger.

## Trigger phrases

Route to `ai-tools-platform-worker-bee` when the user says any of:

- "which AI provider should I use"
- "set up Portkey" / "configure OpenRouter"
- "Ollama for local dev" / "local LLM setup"
- "Runpod vs Modal" / "GPU inference vendor"
- "which MCP servers do I need"
- "LLM spend is too high" / "optimize AI cost"

Or when the request implicitly involves choosing, configuring, or auditing any AI gateway, cloud LLM provider, frontier model, cheap-fallback route, local LLM runtime, GPU cloud vendor, or developer MCP/IDE tooling.

## Do NOT route when

- The request is about **cognitive-layer architecture** such as RAG pipelines, prompt cascades, three-tier memory, or evaluation harnesses — route to `mind-worker-bee` instead.
- The request is about **API key vault strategy, secret rotation, IAM least-privilege, or DPA compliance** — route to `security-worker-bee` instead.
- The request is about **Docker containers or CI/CD wiring for GPU deployments** — route to `devops-worker-bee` instead.
- The request is about **authoring a PRD for an AI feature** — route to `library-worker-bee` instead.

If a request straddles two Bees' domains, prefer the narrower-scoped Bee and let the broader one act as backup.

## Inputs the Bee needs

Before invoking, ensure the user has provided (or you can infer):

- **Use-case description** — what the LLM call is doing (chat, classification, summarization, code generation, etc.)
- **Deployment context** — hosted cloud, local dev, or GPU cloud inference
- **Budget or cost constraints** — optional; defaults to recommending the canonical cheap-fallback alongside any frontier model
- **Privacy or compliance requirements** — optional; defaults to flagging PII/proprietary-code workloads for local or private VPC routing

## Outputs the Bee produces

- **Primary deliverable:** a concrete recommendation (winner, runner-up, deciding factor, configuration snippet or setup steps, cost estimate) — written inline or saved as a report under `.cursor/skills/ai-tools-platform-stinger/reports/`
- **Secondary deliverable:** a filled-in comparison table or cost estimate using `templates/provider-comparison.md` or `templates/cost-estimate.md` when a durable reference document is warranted

## Multi-Bee sequences this Bee participates in

- Plan execution loop — always closes with `security-worker-bee` then `quality-worker-bee`

## Critical directives the orchestrator should respect

- **Always cite current pricing with date** — AI provider pricing changes every 60-90 days; stale prices can be 10x wrong.
- **Distinguish hosted / local / GPU cloud deployment profiles** — these have fundamentally different privacy, latency, cost, and reliability characteristics.
- **Name the cheap fallback for every frontier model recommendation** — production systems without a cost tier typically overpay by 60-80%.
- **Privacy-sensitive workloads default to local or private VPC** — surface this proactively for PII, proprietary code, or regulated data.
- **Defer provider key security to security-worker-bee** — this Bee advises on which keys are needed, not how to store or rotate them.
- **Never strand a user mid-migration** — always provide the migration path, switching cost, and break-even analysis before recommending a provider switch.
- **Keep recommendations time-stamped and qualified** — the AI tooling landscape shifts every quarter.

(Full list lives in the Bee file's `## Critical directives` section.)

---

*Part of Beekeeper-Suit's roster. See [`.cursor/skills/beekeeper-suit/SKILL.md`](../SKILL.md) for the full Army.*
