# Cursor IDE Guardian — God's Guide

The God routing skill's record of when to invoke `cursor-ide-guardian`. Use this guide to decide whether a user request belongs to this Angel.

**Angel:** [`ai-tools/agents/cursor-ide-guardian.md`](../../agents/cursor-ide-guardian.md)
**Weapon:** [`ai-tools/skills/cursor-ide-weapon/`](../../skills/cursor-ide-weapon/)
**Command Brief:** [`ai-tools/command-briefs/cursor-ide-guardian-command-brief.md`](../../../command-briefs/cursor-ide-guardian-command-brief.md)
**Trigger policy:** proactive

---

## Domain

`cursor-ide-guardian` owns the Cursor IDE platform surface: everything about configuring, extending, and mastering Cursor as a development platform, not the code it produces. Its domain covers project rules (`.cursorrules` migration and `.cursor/rules/*.mdc` authoring), MCP server registration and tool authoring (`mcp.json` schema, TypeScript MCP server stubs), the `@cursor/sdk` API for programmatic agent automation (`Agent.create`, `run.stream`, `CursorAgentError`), custom modes and their system-prompt design, the Agents Window and Cloud Agents (Cursor 3, April 2026+), and Cursor productivity patterns including slash commands (`/multitask`, `/worktree`, `/best-of-n`) and keybindings. It is the meta-guardian: it makes every other Legion Angel's workflow more powerful by ensuring Cursor itself is optimally configured.

## Trigger phrases

Route to `cursor-ide-guardian` when the user says any of:

- "review my `.cursorrules`" / "migrate my rules to MDC" / "create a rule file"
- "add an MCP tool" / "register an MCP server" / "build an MCP server"
- "Cursor SDK" / "`Agent.create`" / "`@cursor/sdk`" / "automate with Cursor"
- "create a custom mode" / "design a Cursor mode"
- "Cloud Agents" / "Agents Window" / "Background Agents" / `/multitask`
- "Cursor keybindings" / "Cursor shortcuts" / "productivity in Cursor"
- "Cursor extension" / "Cursor plugin" / "`vscode.cursor.*`"

Or when the request implicitly involves configuring Cursor's agent context, tooling, or automation layer.

## Do NOT route when

- The user wants code quality review of what a Cursor agent produced — route to the relevant language guardian (`react-guardian`, `python-guardian`, etc.).
- The user wants prompt engineering for external LLMs — route to `mind-guardian`.
- The user wants the CI/CD pipeline that runs an SDK script — route to `devops-guardian` (after `cursor-ide-guardian` provides the SDK code).
- The user wants a security audit of MCP server credential handling — route to `security-guardian`.
- The user is building React components inside a Cursor canvas — route to `react-guardian`.

If a request straddles two Angels' domains (e.g., "build an SDK script and wire it into GitHub Actions"), `cursor-ide-guardian` handles the SDK code, then hands off to `devops-guardian` for the pipeline.

## Inputs the Angel needs

Before invoking, ensure the user has provided (or you can infer):

- A description of the Cursor configuration problem, integration, or automation they want.
- Optionally: existing `.cursor/rules/` files, `mcp.json`, `settings.json`, or SDK script fragments to review or build on.
- Optionally: the user's current Cursor version (some features are version-gated to Cursor 3+).

If the Cursor version is unknown and the requested feature is version-gated, ask before proceeding.

## Outputs the Angel produces

- Modified or new `.cursor/rules/*.mdc` files with correct frontmatter and scoping.
- `mcp.json` entries and TypeScript MCP server stubs.
- `@cursor/sdk` TypeScript scripts with full error handling.
- Custom mode definitions (UI-guided, or a JSON structure for future file-based config).
- Advisory findings with references to the governing Cursor docs.

## Multi-Angel sequences this Angel participates in

- **IDE productivity setup** — `cursor-ide-guardian` configures Cursor (rules, MCP, SDK); `devops-guardian` wires the resulting SDK scripts into CI/CD pipelines; `security-guardian` audits any MCP credential handling.
- **Legion Angel Factory** — `cursor-ide-guardian` is the meta-tooling Angel; every factory Angel benefits from it being invoked first on a new repo to set up canonical rule files and MCP servers.

## Critical directives the orchestrator should respect

- Never write `.cursorrules` for a project already using `.cursor/rules/` — `.cursorrules` is silently ignored in Agent mode.
- Always include explicit JSON Schema on every MCP tool — Cursor silently rejects malformed schemas.
- Always show `CursorAgentError` handling in SDK examples — SDK runs fail silently without it.
- Prefer `alwaysApply: false` with narrow globs — `alwaysApply: true` rules share a ~2,000-token budget cap.

(Full list lives in the Angel file's `## Critical directives` section.)

---

*Part of God's roster. See [`ai-tools/skills/god/SKILL.md`](../SKILL.md) for the full Army.*
