# AI Coding Tools Guardian — God's Guide

The God routing skill's record of when to invoke `ai-coding-tools-guardian`. Use this guide to decide whether a user request belongs to this Angel.

**Angel:** [`ai-tools/agents/ai-coding-tools-guardian.md`](../../agents/ai-coding-tools-guardian.md)
**Weapon:** [`ai-tools/skills/ai-coding-tools-weapon/`](../../skills/ai-coding-tools-weapon/)
**Command Brief:** [`ai-tools/command-briefs/ai-coding-tools-guardian-command-brief.md`](../../../command-briefs/ai-coding-tools-guardian-command-brief.md)
**Trigger policy:** proactive

---

## Domain

`ai-coding-tools-guardian` owns the selection, comparison, configuration, and cost-optimization layer of AI-assisted development tools across the 2026 ecosystem. Its domain covers Cursor, Claude Code, Aider, Cline, Windsurf (Cascade), Continue.dev, Replit Agent, Devin 2.0, and Bolt.new — classified into four autonomy tiers. It applies a five-question selection rubric, provides SWE-bench and Aider polyglot benchmark data with dated citations, explains model-routing patterns (including Aider's 3-5x cost-reducing architect/editor split), and surfaces per-tool footguns before they cause problems. It does NOT own Cursor IDE configuration depth, LLM provider/gateway architecture, or CI/CD pipelines that invoke agents.

## Trigger phrases

Route to `ai-coding-tools-guardian` when the user says any of:

- "which AI coding tool should I use"
- "Cursor vs Claude Code vs Aider"
- "set up Aider" / ".aider.conf.yml"
- "Cline keeps failing" / "Cline is unreliable"
- "is Devin worth it" / "Devin or Claude Code"
- "reduce my AI coding costs"
- "SWE-bench scores for AI tools"
- "prompt discipline for Claude Code" / "CLAUDE.md setup"
- "which tool for autonomous tasks"
- "Windsurf vs Cursor"
- "Continue.dev vs Cursor"
- "Bolt.new limits"
- "architect editor mode Aider"

Or when the request implicitly involves choosing, comparing, or configuring AI-assisted development tools.

## Do NOT route when

- The user asks about Cursor IDE rules, MCP server registration, Cloud Agents configuration, or `@cursor/sdk` — route to `cursor-ide-guardian`.
- The user asks about LLM provider gateways (Portkey, OpenRouter, Bedrock) or cost optimization across providers rather than per-tool — route to `ai-tools-platform-guardian`.
- The user asks about CI/CD pipelines that invoke agents (GitHub Actions running Devin, scheduled Aider runs) — route to `devops-guardian`.

If a request mentions Cursor in the context of IDE rules or MCP config, prefer `cursor-ide-guardian`. If it mentions Cursor in the context of "should I use Cursor or Claude Code", this Angel owns it.

## Inputs the Angel needs

Before invoking, ensure the user has provided (or you can infer):

- The user's current workflow style (solo vs team, vibe-coding vs production-grade)
- The specific problem or question (tool comparison, footgun, configuration, cost question)
- Optional: budget envelope, preferred IDE/editor, language/framework
- Optional: tools already tried and what failed

If the user asks a specific question without workflow context, the Angel's five-question intake will surface it.

## Outputs the Angel produces

- Inline markdown recommendation with tool selection, benchmark citations (dated), cost estimate, and configuration snippet
- Per-tool CLAUDE.md or .aider.conf.yml or equivalent configuration artifact for the recommended tool
- Footgun warnings relevant to the user's scenario
- Cross-links to peer Angels (cursor-ide-guardian, ai-tools-platform-guardian) where appropriate

## Multi-Angel sequences this Angel participates in

- **Vibe-coding setup sequence** — typically invoked before `cursor-ide-guardian` (tool selection) and `ai-tools-platform-guardian` (provider/gateway setup); helps the developer pick the right tool before configuring it deeply.

## Critical directives the orchestrator should respect

- Always cite SWE-bench scores with retrieval date — never cite stale benchmark data without flagging it as potentially outdated.
- Windsurf is owned by Cognition AI (makers of Devin), not OpenAI — the Command Brief contained an error on this point; all recommendations must reflect Cognition AI ownership post-December 2025.
- Never recommend Devin or Replit Agent for production repos without explicitly surfacing the scope-creep and irreversibility risk.

(Full list lives in the Angel file's `## Critical directives` section.)

---

*Part of God's roster. See [`ai-tools/skills/god/SKILL.md`](../SKILL.md) for the full Army.*
