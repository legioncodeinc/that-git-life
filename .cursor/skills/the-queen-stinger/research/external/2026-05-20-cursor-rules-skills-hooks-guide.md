---
source_url: https://theodoroskokosioulis.com/blog/cursor-rules-commands-skills-hooks-guide/
retrieved_on: 2026-05-20
source_type: blog
authority: practitioner
relevance: medium
topic: cursor-primitives
stinger: the-queen-stinger
---

# Cursor rules, commands, skills, and hooks: a complete guide

## Summary
Practitioner guide to Cursor's four extensibility primitives: rules (always-on), commands (manual `/` invocation), skills (agent-decided lazy loading), hooks (event-driven). Useful context for `stinger-forge` because `the-queen-stinger` is a SKILL by design, and this source explains the trade-off space across primitives. The decision tree (does it apply to every conversation? -> rule; specific workflow? -> command; agent decides? -> skill; block/modify actions? -> hook) is a clean orientation aid for anyone reading the the-queen-stinger SKILL.md for the first time.

## Key quotations / statistics

- Primitive definitions: "Rule: Always-on constraints (or file-scoped standards via globs). Command: A workflow you intentionally trigger with `/`. Skill: A playbook you want available, but only when the agent decides it's needed."
- Skills mechanism: "Skills are portable packages that teach agents how to perform domain-specific tasks. The key difference from rules: the agent decides when to load them based on relevance."
- Lazy loading: "Cursor scans skill descriptions at startup but only loads the full content when the task demands it. This keeps your prompts short while still making deep, task-specific guidance available."
- `disable-model-invocation`: "Set `disable-model-invocation: true` in the frontmatter to make a skill behave like a command. The agent won't auto-load it; you must explicitly type `/skill-name`."
- Decision tree (load-bearing for stinger-forge): "Does this apply to EVERY conversation? Yes -> Rule (alwaysApply: true). No -> Should it apply based on file patterns? Yes -> Rule (globs). No -> Is it a specific workflow you trigger? Yes -> Command. No -> Should the agent decide when it's relevant? Yes -> Skill. No -> Do you need to block/modify agent actions? Yes -> Hook. Otherwise -> Manual rule (@-mention)."
- Recommended folder structure: ".cursor/rules/ for always-on rules, .cursor/commands/ for slash commands, .cursor/skills/<skill>/ for skills (with optional scripts/ subfolder)."

## Annotations for stinger-forge
- The decision tree confirms `the-queen-stinger` is a SKILL (multi-step workflow, agent decides relevance based on the task description). `stinger-forge` should NOT make `the-queen-stinger` a rule or a hook.
- This source provides the rationale for the "thin SKILL.md + many guides/" pattern: lazy loading means the agent only pulls in the parts of the stinger it needs. `guides/00-principles.md`, `guides/01-pick-and-lock.md`, etc. each become a lazy-load unit. The main SKILL.md is the index/dispatcher.
- The hooks primitive is interesting but NOT used by the-queen-stinger. Hooks are event-driven (Cursor fires them on agent events); the-queen is procedural-step-driven. `guides/00-principles.md` can include one paragraph stating "the-queen-stinger could conceivably use a hook for end-of-cycle reporting, but the current design intentionally keeps all reporting inline in the Bee's body to avoid hidden side effects."
- Lower relevance than the official Cursor docs because this is one practitioner's framing rather than canonical reference. Cite this source in `guides/00-principles.md` as supplementary; cite cursor.com/docs/skills.md and cursor.com/docs/subagents.md as primary.
