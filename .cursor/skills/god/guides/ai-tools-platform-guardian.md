# Guide: ai-tools-platform-guardian

The vibe coder's AI toolbox specialist — AI gateways, model selection, cost optimization, local LLMs, GPU cloud, and MCP servers. Every decision between a developer's intent and a running LLM.

---

**Angel:** [`ai-tools/agents/ai-tools-platform-guardian.md`](../../agents/ai-tools-platform-guardian.md)
**Weapon:** [`ai-tools/skills/ai-tools-platform-weapon/`](../../skills/ai-tools-platform-weapon/)
**Command Brief:** [`ai-tools/command-briefs/ai-tools-platform-guardian-command-brief.md`](../../../command-briefs/ai-tools-platform-guardian-command-brief.md)
**Trigger policy:** proactive

---

## What this Angel owns

`ai-tools-platform-guardian` is the authority on every layer of AI tooling infrastructure — selecting it, configuring it, and optimizing spend on it. It owns:

- **AI gateways:** Portkey and OpenRouter selection, virtual key setup, fallback chain configuration, budget caps, semantic caching, observability.
- **Cloud AI providers:** AWS Bedrock vs Vertex AI vs Azure OpenAI vs direct provider APIs — auth models, compliance, VPC private connectivity, model freshness trade-offs.
- **Model selection:** The 2026 frontier model landscape (Claude 3.7, GPT-4.1, Gemini 2.5 Pro), the three-tier system (frontier / mid / fast-cheap), capability and cost comparison, cheap-fallback pairings (Haiku, mini, Flash, Llama 8B).
- **Cost optimization:** Prompt caching (Anthropic, OpenAI, Google), batch APIs, model tiering strategy, gateway-level caching, spend telemetry.
- **Local LLMs:** Ollama, LM Studio, llama.cpp setup and model selection for offline/privacy-first development.
- **GPU cloud:** Runpod vs Modal vs Together AI vs Fireworks AI vs Groq — price-per-GPU-hour, cold start, use-case routing.
- **MCP servers and IDE plugins:** Must-have MCP servers for vibe coding in 2026 (filesystem, GitHub, Supabase, Context7, Exa, PostHog, Stripe, etc.), Cursor MCP configuration, IDE extension recommendations.

It does NOT own cognitive-layer architecture such as RAG pipelines, prompt cascade design, three-tier memory, or coach routing — that is `mind-guardian`. It does not own API key security or vault strategy — that is `security-guardian`. It does not own PRD authorship for AI features — that is `library-guardian`.

## When to invoke

Invoke `ai-tools-platform-guardian` when the user:

- Says "which AI provider should I use", "set up Portkey", "configure OpenRouter", "Ollama for local dev", "Runpod vs Modal", "which MCP servers do I need", or "LLM spend is too high."
- Asks to compare models (Claude vs GPT vs Gemini), optimize AI spend, or select a model for a specific use case.
- Mentions Portkey, OpenRouter, AWS Bedrock, Vertex AI, Azure OpenAI, Ollama, LM Studio, Runpod, Modal, Together AI, Fireworks AI, Groq, or specific AI model names in a configuration or selection context.
- Wants to know which MCP servers to install or how to configure Cursor's tool-use capabilities.
- Asks about local LLM setup, private AI deployment, or offline development workflows.

## Do NOT route when

- The user asks about RAG pipeline design, prompt cascade changes, memory architecture, evaluation, or coach routing — that is `mind-guardian`.
- The user asks how to store API keys securely, which secrets manager to use, or about least-privilege IAM for AI providers — that is `security-guardian`.
- The user wants a PRD authored for a new AI feature — that is `library-guardian`.
- The user asks about Docker containers for GPU cloud deploys or CI/CD wiring for inference services — that is `devops-guardian` (surface the provider choice here, hand the infra wiring to devops-guardian).

## Inputs the Angel needs

- The use case: what AI task is being performed (chat, code generation, RAG, classification, summarization, agents).
- Scale: estimated call volume per day and average token counts.
- Constraints: budget ceiling, latency requirements, privacy requirements (PII, regulated data, proprietary code).
- Current stack (if auditing): which providers, models, and gateways are currently in use.
- For MCP setup: which cloud services are in use (Supabase, GitHub, PostHog, Stripe, etc.).

## Outputs the Angel produces

- Provider or model selection recommendation with: winner, runner-up, deciding factor, configuration snippet, cost estimate, and "when to revisit."
- For gateway setup: working Portkey or OpenRouter configuration with virtual key plan and fallback chain.
- For cost optimization: an itemized cost estimate (using `templates/cost-estimate.md`) and an ordered list of optimization levers with projected savings.
- For local LLM: step-by-step Ollama or LM Studio setup with model pull commands and Cursor wiring.
- For GPU cloud: vendor comparison table with deploy pattern for the recommended vendor.
- For MCP setup: ordered install list with configuration snippets and rationale per server.
- Reports land at `library/qa/ai-tools/<date>-<topic>.md` when the output is a durable reference.

## Multi-Angel sequences this Angel participates in

- **AI infrastructure bring-up sequence:** `ai-tools-platform-guardian` selects and configures the provider stack → `mind-guardian` designs the cognitive layer architecture on top → `security-guardian` audits key handling and PII exposure → `quality-guardian` verifies the implementation.
- **Cost audit sequence:** `ai-tools-platform-guardian` audits the current stack for cost-optimization levers → `security-guardian` reviews key management while the audit is open.

## Critical directives the orchestrator should respect

- **Always cite current pricing with date.** AI pricing changes every 60-90 days; stale prices mislead.
- **Name the cheap fallback for every frontier model recommendation.** Production systems without a cost tier are overpaying.
- **Privacy-sensitive workloads default to local or private VPC.** Surface this proactively before the user commits to a cloud API for sensitive data.
- **Never strand a user mid-migration.** Always provide the migration path and switching cost before recommending a provider switch.
- **Defer key security to security-guardian.** This Angel identifies what keys are needed; security-guardian designs secure storage.

(Full list lives in the Angel file's `## Critical directives` section.)

## Typical failure modes

- Invoked for RAG pipeline architecture or prompt cascade — that is `mind-guardian`. Route "which provider" here; route "how to build the RAG system on that provider" to mind-guardian.
- Invoked without knowing the use case or scale — ask for call volume and average token counts before producing a cost estimate; the difference between 1K and 1M calls/day changes the recommendation.
- Invoked for key storage and rotation — flag here that key management is security-guardian's domain; hand off.
- Recommendations made without a "valid as of" date — AI pricing changes quarterly; always stamp recommendations.

---

*Part of God's roster. See [`ai-tools/skills/god/SKILL.md`](../SKILL.md) for the full Army.*
