# Skills

> What skills are, how they work, and how they map across Cursor, Claude Code, and Claude Cowork.

## What a skill is

A skill is a packaged, reusable capability an AI agent can load on demand. It bundles instructions, reference guides, templates, examples, and sometimes scripts into one folder, fronted by a `SKILL.md` file. When a task matches the skill's description, the agent loads it and follows its playbooks instead of improvising. Skills are how you give an agent deep, opinionated, repeatable expertise in a domain.

Skills use progressive disclosure. The agent first reads the short `SKILL.md` to understand scope, then opens only the specific guide or template it needs for the task at hand. That keeps the agent focused and the context lean.

In this repo, skills are called **Weapons**. Each Weapon is the procedural arsenal for one Angel (see [AGENTS.md](./AGENTS.md)). They live in [`.cursor/skills/`](./.cursor/skills/), mirrored to [`.claude/skills/`](./.claude/skills/), and packaged for Cowork in [`.cowork/skills/`](./.cowork/skills/).

## Anatomy of a skill

A skill is a folder named for the skill, with `SKILL.md` at its root:

```
git-weapon/
  SKILL.md            name + description frontmatter, scope, and routing to guides
  guides/             step-by-step playbooks for each sub-task
  templates/          copy-paste starting points
  examples/           worked end-to-end examples
  research/           sourced facts the skill cites
```

The `SKILL.md` frontmatter is what makes a skill discoverable:

```markdown
---
name: git-weapon
description: What the skill does and the exact phrases or situations that
  should trigger it, plus what it should NOT be used for.
---
```

## How skills map across harnesses

Skills are the most portable asset of all. The `SKILL.md` format is shared across all three harnesses.

| Harness | Where skills live | Format |
|---|---|---|
| **Cursor** | `.cursor/skills/<name>/` | Folder with `SKILL.md`. Source of truth in this repo. |
| **Claude Code** | `.claude/skills/<name>/` | Same folder + `SKILL.md` shape. Files port directly. |
| **Claude Cowork** | `.cowork/skills/<name>.skill` | The skill folder zipped into a single `.skill` package that installs with one click. |

### Installing a `.skill` in Cowork

A `.skill` file is just the skill directory zipped with a `.skill` extension. In Cowork it renders with a "Save skill" button. Download the `.skill` from [`.cowork/skills/`](./.cowork/skills/) and install it, and the skill is available to your agent.

### One Cowork gotcha: angle brackets

Skill docs are full of placeholders like `prd-<###>-<slug>`. On import, Cowork can read `<...>` as XML tags and choke. So the Cowork copies of every skill have all angle brackets swapped for curly braces: `<` becomes `{` and `>` becomes `}`. The meaning is identical (`prd-{###}-{slug}`), it just survives import. The Cursor and Claude Code copies keep the original angle brackets.

## Related

- [AGENTS.md](./AGENTS.md) — the Angels that wield these Weapons
- [HOOKS.md](./HOOKS.md) — event-driven automation
- [RULES.md](./RULES.md) — always-on guidance
