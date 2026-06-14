---
name: cursor-ide-weapon
description: Equips cursor-ide-guardian to master Cursor IDE as a development platform — project rules (.cursorrules migration, .cursor/rules/*.mdc authoring), custom modes, MCP server integration, Cloud Agents and the Agents Window, keybindings and productivity patterns, and the @cursor/sdk API for programmatic agent automation. Use when the user asks about configuring Cursor, extending it with MCP tools, building automations with the SDK, or maximising their IDE workflow. Do NOT use for code quality of what agents produce (language guardians), prompt engineering for external LLMs (mind-guardian), or CI/CD pipelines that happen to run SDK jobs (devops-guardian).
license: MIT
---

# cursor-ide Weapon

The knowledge repository for `cursor-ide-guardian`. Covers every platform surface of Cursor IDE: rule files, MCP integration, SDK authoring, Agents Window workflows, and productivity patterns.

## When this weapon applies

Load whenever `cursor-ide-guardian` is invoked. Typical triggers (any of these phrases, even without naming Cursor explicitly):

- "review my `.cursorrules`" / "migrate my rules to MDC"
- "add an MCP server" / "register a custom tool in Cursor"
- "build an automation with the Cursor SDK" / "`Agent.create`" / "`@cursor/sdk`"
- "create a custom mode" / "design a Cursor mode for X"
- "background agents" / "cloud agents" / "Agents Window" / `/multitask`
- "Cursor keybindings" / "Cursor shortcuts" / "power user Cursor"
- "Cursor plugin" / "Cursor extension"

Do NOT load for:

- Code quality produced by Cursor agents (language-specific guardians).
- Prompt engineering for OpenAI / Anthropic / etc. (mind-guardian).
- CI/CD pipelines that orchestrate Cursor SDK (devops-guardian owns the pipeline; this weapon authors the SDK code itself).

## First action when loaded

Read in order before acting:

1. **`guides/01-principles.md`** — rule file philosophy, context budget constraints, the MDC vs `.cursorrules` decision, activation mode taxonomy. This is the mental model foundation.
2. **`guides/02-rule-file-authoring.md`** — full frontmatter spec, glob patterns, migration checklist from legacy `.cursorrules`, anti-patterns.
3. Then pull the task-specific guide: `03` for MCP, `04` for SDK, `05` for modes/productivity, `06` for extensions.

## Folder layout

```text
cursor-ide-weapon/
+- SKILL.md                          (this file — master index)
+- guides/
|  +- 01-principles.md               (philosophy: rule activation, context budget, MDC vs legacy)
|  +- 02-rule-file-authoring.md      (frontmatter spec, glob patterns, migration)
|  +- 03-mcp-integration.md          (mcp.json schema, tool authoring, OAuth, Extension API)
|  +- 04-sdk-api.md                  (Agent lifecycle, run.stream, errors, local vs cloud)
|  +- 05-modes-and-productivity.md   (custom modes, Agents Window, keybindings, slash commands)
|  +- 06-extension-development.md    (plugin manifests, quality gates, marketplace checklist)
+- examples/
|  +- rule-file-examples.md          (worked .mdc examples for common scenarios)
|  +- mcp-server-example.md          (minimal TypeScript MCP server + mcp.json entry)
|  +- sdk-agent-example.md           (create, stream, error-handle pattern)
+- templates/
|  +- rule-file-template.mdc         (canonical .mdc frontmatter template)
|  +- mcp-json-template.json         (mcp.json with both stdio and remote stubs)
|  +- sdk-script-template.ts         (Agent.create + run.stream + error handling)
+- reports/
|  +- README.md
+- research/                         (populated by scripture-historian, 18 files)
   +- research-plan.md
   +- research-summary.md
   +- index.md
   +- internal/  (4 files)
   +- external/  (11 files)
```

## Critical directives (lifted from the Command Brief)

These are weapon-level non-negotiables that `cursor-ide-guardian` must enforce on every invocation:

- **Check Cursor version before referencing features.** Why: Cursor ships weekly; Cloud Agents, Agents Window, and SDK capabilities are version-gated. Use Cursor 3 (April 2026+) as the modern baseline.
- **Never write `.cursorrules` for a project already using `.cursor/rules/`.** Why: `.cursorrules` is silently ignored in Agent mode and the two formats produce silent precedence conflicts.
- **MCP tools must have explicit JSON Schema for every parameter.** Why: Cursor silently rejects tools with malformed schemas with no UI feedback.
- **Prefer `alwaysApply: false` with narrow globs over `alwaysApply: true`.** Why: `alwaysApply: true` rules consume the shared context budget (2,000-token cap across all `alwaysApply` rules).
- **Always show `CursorAgentError` handling in SDK examples.** Why: SDK runs fail silently without it.

## Key facts by domain (quick reference)

### Rules

| Format | Agent mode? | Multi-file? | Glob scoping? |
|---|---|---|---|
| `.cursorrules` | No (silently ignored) | No | No |
| `.cursor/rules/*.mdc` | Yes | Yes | Yes |

Four MDC activation modes (frontmatter drives which one applies):

| Mode | `alwaysApply` | `globs` | `description` |
|---|---|---|---|
| Always Apply | `true` | any | any |
| Apply to Specific Files | `false` | set | any |
| Apply Intelligently | `false` | unset | set |
| Apply Manually | `false` | unset | unset |

**Budget:** keep total `alwaysApply: true` content under ~2,000 tokens across all rule files.

### MCP

Config hierarchy: project `.cursor/mcp.json` > global `~/.cursor/mcp.json` (same-name project wins). Restart Cursor after editing either file. Tool auto-approval is off by default (Settings > MCP > allow tool auto-run). Interpolation variables: `${env:NAME}`, `${userHome}`, `${workspaceFolder}`, `${workspaceFolderBasename}`, `${pathSeparator}`.

### SDK (`@cursor/sdk` >= 1.0.7, public beta April 29, 2026)

```typescript
const agent = await Agent.create({ local: { cwd, model: "claude-sonnet-4-5" } });
const run = agent.send("do X");
for await (const msg of run.stream()) {
  if (msg.type === "assistant") process.stdout.write(msg.text ?? "");
}
await run.wait(); // resolves RunResult
await agent.dispose();
```

Error handling: all errors extend `CursorAgentError { isRetryable, code }`. Cloud agents: one active run at a time — watch for `AgentBusyError` (code: `agent_busy`, `isRetryable: false`).

### Agents Window (Cursor 3, April 2026)

- Background Agents renamed to **Cloud Agents** in Cursor 3.
- **Agents Window**: unified sidebar for all agents (local, cloud, mobile, Slack, GitHub, Linear).
- **Agent Tabs**: tiled multi-pane layout (added April 13, 2026).
- **`/multitask`**: async parallel subagents within a single task.
- Cloud Agents: isolated Ubuntu VMs, dedicated `agent/` branch, auto-PR on completion.

## Open questions (from research)

1. **Plan tier detection from SDK:** No documented public API for detecting Free / Pro / Business / Enterprise from within an SDK run. Flag as "not publicly documented" in guide 04.
2. **MCP tool name length:** No specific Cursor-documented limit found; best practice is <64 chars, namespace with `server-name.tool-name`.
3. **Custom modes file format:** `.cursor/modes.json` was "under consideration" as of May 2026; current method is UI-only (Settings > Features > Chat > Custom Modes). Do not document the file path until confirmed.
4. **Extension guide source gap:** `vscode.cursor.plugins.registerPath` Extension API found; full manifest schema needs direct fetch from `cursor.com/docs/plugins`.

## Refresh cadence

- Guides `01`-`05`: refresh every 3 months or on any Cursor major version.
- Guide `06`: refresh when extension/plugin manifest format changes.
- Research folder: re-run `scripture-historian` at `shallow` tier on any Cursor major release.

## Pairing

| Role | Artifact |
|---|---|
| This weapon | `ai-tools/skills/cursor-ide-weapon/` |
| Paired Angel | `ai-tools/agents/cursor-ide-guardian.md` |
| Command Brief | `ai-tools/command-briefs/cursor-ide-guardian-command-brief.md` |
| Cursor SDK skill (installed) | `.cursor/skills-cursor/sdk/SKILL.md` |
| create-rule skill | `.cursor/skills-cursor/create-rule/SKILL.md` |

---

*Forged by `weapon-forge` from `cursor-ide-guardian-command-brief.md` and `research/`. Part of the Legion AI Tools Factory by [Mario Aldayuz a.k.a @thenotoriousllama](https://github.com/thenotoriousllama).*
