# AI Coding Tools Worker Bee - Beekeeper-Suit's Guide

The Beekeeper-Suit routing skill's record of when to invoke `ai-coding-tools-worker-bee`. Use this guide to decide whether a user request belongs to this Bee.

**Bee:** [`.cursor/agents/ai-coding-tools-worker-bee.md`](../../agents/ai-coding-tools-worker-bee.md)
**Stinger:** [`.cursor/skills/ai-coding-tools-stinger/`](../../skills/ai-coding-tools-stinger/)
**Command Brief:** not available (synthesized from agent + stinger files)
**Trigger policy:** on-demand

---

## Domain

`ai-coding-tools-worker-bee` owns the selection, comparison, prompt discipline, and cost-optimization layer of AI-assisted software development tools. It covers Cursor, Claude Code, Aider, Cline, Windsurf (Cascade), Continue.dev, Replit Agent, Devin 2.0, and Bolt.new. The Bee classifies tools into four autonomy tiers (interactive-pair, hybrid-agent, fully-autonomous, rapid-scaffold), applies a five-question selection rubric, and provides benchmark-grounded recommendations with dated SWE-bench citations. It also surfaces tool-specific footguns, model-routing defaults, per-tool prompt and context discipline artifacts, and compatible multi-tool stacking patterns.

## Trigger phrases

Route to `ai-coding-tools-worker-bee` when the user says any of:

- "which AI coding tool should I use"
- "Cursor vs Claude Code vs Aider"
- "is Devin worth it"
- "Cline keeps breaking"
- "how do I reduce AI coding costs"
- "set up Aider"
- "which tool for autonomous tasks"
- "prompt discipline for Claude Code / Aider / Cline"
- "SWE-bench scores"

Or when the request implicitly involves comparing, selecting, configuring, or debugging an AI-assisted development tool.

## Do NOT route when

- The user asks about Cursor IDE configuration depth (rules, MCP servers, Cloud Agents, `@cursor/sdk`) — that belongs to `cursor-ide-worker-bee`.
- The user asks about LLM provider/gateway architecture (Portkey, OpenRouter, Bedrock, Vertex AI) — that belongs to `ai-tools-platform-worker-bee`.
- The user asks about CI/CD pipelines that invoke agents (GitHub Actions running Devin, scheduled Aider runs) — that belongs to `devops-worker-bee`.

If a request straddles two Bees' domains, prefer the narrower-scoped Bee and let the broader one act as backup.

## Inputs the Bee needs

Before invoking, ensure the user has provided (or you can infer):

- The user's autonomy tolerance (0–5 scale) or a description of how much unsupervised AI action is acceptable
- Monthly API/subscription budget (or an indication that cost is not a constraint)
- Current editor or IDE preference (optional — Bee will ask if absent; defaults to no editor constraint)
- Primary programming language or framework (optional — Bee will ask if absent; defaults to polyglot advice)
- Task type: interactive pair programming, batch refactor, greenfield scaffold, or fully autonomous execution

## Outputs the Bee produces

- A structured tool recommendation using `templates/tool-recommendation.md`, including tier assignment, rationale, cost estimate, and configuration snippet — delivered inline in the conversation
- Optional: a named configuration artifact (CLAUDE.md structure, `.aider.conf.yml` snippet, or Cursor rules pointer) for the recommended tool

## Multi-Bee sequences this Bee participates in

- Plan execution loop — always closes with `security-worker-bee` then `quality-worker-bee`

## Critical directives the orchestrator should respect

- Always cite the benchmark source and date — SWE-bench scores change monthly; every capability claim must include the source and retrieval date (currently 2026-05-20).
- Windsurf is owned by Cognition AI, NOT OpenAI — all recommendations mentioning Windsurf must state this and reference the December 2025 acquisition.
- Cross-link to `cursor-ide-worker-bee` for any Cursor IDE configuration request — deep Cursor config is out of scope for this Bee.
- Never recommend Devin or Replit Agent for production repos without explicitly flagging scope-creep and irreversibility risks — the user must acknowledge the risk before proceeding.
- State the model-routing default explicitly before recommending — Claude Code is model-locked to Claude; Aider supports 100+ models; Cursor routes to multiple providers.

(Full list lives in the Bee file's `## Critical directives` section.)

---

*Part of Beekeeper-Suit's roster. See [`.cursor/skills/beekeeper-suit/SKILL.md`](../SKILL.md) for the full Army.*
