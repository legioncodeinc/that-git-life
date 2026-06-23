---
source_url: https://cursor.com/docs/skills
retrieved_on: 2026-05-20
source_type: official-docs
authority: official
relevance: critical
topic: cursor-skills
stinger: the-queen-stinger
---

# Agent Skills | Cursor Docs

## Summary
Canonical Cursor documentation for skills. Defines skills as `SKILL.md` files that teach agents specialized workflows, the auto-discovery mechanism (Cursor walks skill directories at startup), the manual invocation syntax (`/skill-name` in chat), the frontmatter schema (`name`, `description`, `paths`, `disable-model-invocation`, `metadata`), and the `disable-model-invocation: true` flag that turns a skill into a slash-command-only invocation. Critical for `the-queen` because it dispatches FOUR skills (command-center, stinger-forge, bee-creator, hive-registrar) and must invoke them correctly.

## Key quotations / statistics

- "When Cursor starts, it automatically discovers skills from skill directories and makes them available to Agent. The agent is presented with available skills and decides when they are relevant based on context."
- "Skills can also be manually invoked by typing `/` in Agent chat and searching for the skill name."
- Frontmatter schema:
  - "`name` | Yes | Skill identifier. Lowercase letters, numbers, and hyphens only. Must match the parent folder name."
  - "`description` | Yes | Describes what the skill does and when to use it. Used by the agent to determine relevance."
  - "`paths` | No | Glob patterns that scope the skill to matching files."
  - "`disable-model-invocation` | No | When `true`, the skill is only included when explicitly invoked via `/skill-name`."
  - "`metadata` | No | Arbitrary key-value mapping for additional metadata."
- "Set `disable-model-invocation: true` to make a skill behave like a traditional slash command, where it is only included in context when you explicitly type `/skill-name` in chat."
- Skills load order: "Skills are automatically loaded from `.agents/skills/`, `.cursor/skills/`, `~/.agents/skills/` (global), and `~/.cursor/skills/` (global)."
- Cross-tool compatibility: "Cursor also loads skills from Claude and Codex directories: `.claude/skills/`, `.codex/skills/`, `~/.claude/skills/`, and `~/.codex/skills/`."
- Best practice: "Keep your main `SKILL.md` focused and move detailed reference material to separate files. This keeps context usage efficient since agents load resources progressively -- only when needed."

## Annotations for stinger-forge
- `guides/04-phase-1-command-center.md`, `guides/06-phase-2-stinger-forge.md`, `guides/07-phase-3-bee-creator.md`, `guides/08-phase-4-hive-registrar.md` should each document the canonical skill-invocation pattern: `the-queen` invokes by typing `/skill-name` (e.g., `/command-center`, `/stinger-forge`) into its own agent reasoning loop, OR by reading the skill's SKILL.md and following its instructions directly. The Command Brief's ACTION steps say "Invoke the `command-center` skill (loading it from `.cursor/skills/command-center/SKILL.md` or the global `skills-cursor/command-center/SKILL.md`)" -- this maps to the "load SKILL.md from a known path and follow it" pattern.
- The "skills load from multiple roots" detail justifies the Command Brief's fallback path: "load it from `.cursor/skills/command-center/SKILL.md` or the global `skills-cursor/command-center/SKILL.md`." `stinger-forge` should preserve this dual-path lookup as a robustness feature.
- The progressive-loading guidance ("move detailed reference material to separate files") justifies the 12-guide structure proposed in the Command Brief's IDEAS section. The Stinger's SKILL.md should be a thin index over the guides, not a single monolith.
- The `disable-model-invocation: true` flag is interesting for `the-queen-stinger` specifically: should the skill auto-load when `the-queen` reasons about its own task, or only when explicitly slash-invoked? Recommendation for `stinger-forge`: leave it as default (`false`) so `the-queen`'s body can reference the stinger via natural-language directives like "load the the-queen-stinger skill" without needing to type a slash command.
