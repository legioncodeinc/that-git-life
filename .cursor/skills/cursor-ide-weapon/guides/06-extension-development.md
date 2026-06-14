# Guide 06: Extension Development

Building Cursor plugins and extensions — manifest structure, MCP server bundling, and marketplace readiness.

> **Source gap note (from research):** The full Cursor plugin manifest schema and marketplace submission checklist were not fully confirmed in the May 2026 research window. The Extension API (`vscode.cursor.mcp.registerServer`, `vscode.cursor.plugins.registerPath`) was found. For the authoritative manifest spec, fetch `https://cursor.com/docs/plugins` directly. This guide documents what is confirmed and flags gaps.

## What is a Cursor extension?

Cursor extensions are VS Code-compatible extensions that additionally register into the `cursor.*` Extension API namespace. They are distributed through the Cursor marketplace (or installed via VSIX). They can:

- Bundle an MCP server and register it programmatically at extension activation.
- Register plugin paths that Cursor's agent loading machinery discovers.
- Contribute skills (`.cursor/skills/`) packaged inside the extension.
- Add commands, panels, and settings via standard VS Code contribution points.

## Extension manifest (`package.json`) — confirmed fields

Standard VS Code fields apply. Cursor-specific additions:

```json
{
  "name": "my-cursor-plugin",
  "displayName": "My Cursor Plugin",
  "version": "1.0.0",
  "engines": { "vscode": "^1.85.0" },
  "contributes": {
    "commands": [ ... ],
    "configuration": { ... }
  },
  "activationEvents": ["onStartupFinished"]
}
```

The Cursor marketplace layer reads standard VS Code manifest fields. No confirmed additional top-level Cursor-specific manifest keys as of May 2026 — verify at `cursor.com/docs/plugins`.

## Registering an MCP server from an extension

In `extension.ts` / `activate()`:

```typescript
import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
  const cursorExt = vscode.extensions.getExtension("cursor.cursor");
  const mcpApi = cursorExt?.exports?.mcp;
  
  if (mcpApi?.registerServer) {
    const serverPath = context.asAbsolutePath("out/mcp-server.js");
    mcpApi.registerServer("my-plugin-tools", {
      command: "node",
      args: [serverPath],
      env: {}
    });
    
    context.subscriptions.push({
      dispose: () => mcpApi.unregisterServer("my-plugin-tools")
    });
  }
}
```

Push to `context.subscriptions` so the server is unregistered when the extension deactivates.

## Registering a plugin path

```typescript
const pluginApi = cursorExt?.exports?.plugins;
if (pluginApi?.registerPath) {
  pluginApi.registerPath(context.extensionPath);
}
```

Cursor then discovers skills and rules in the extension's directory structure.

## Marketplace readiness checklist

Items confirmed or inferred from VS Code + Cursor publishing norms. Flag any item that requires verification at `cursor.com/docs/plugins`:

- [ ] `package.json` has `name`, `displayName`, `version`, `description`, `publisher`
- [ ] `engines.vscode` set to a realistic minimum version
- [ ] `activationEvents` are as narrow as possible (avoid `*`)
- [ ] Extension compiles cleanly with `vsce package`
- [ ] All `vscode.cursor.*` API calls are guarded with optional chaining (graceful degradation if API not present)
- [ ] Bundled MCP server exits cleanly on deactivation (no zombie processes)
- [ ] Secrets are not hardcoded — use VS Code `secrets` storage or `${env:NAME}` interpolation
- [ ] `README.md` explains what the extension does, how to install, and how to configure
- [ ] `CHANGELOG.md` present with version history
- [ ] Extension icon provided (128x128px PNG)

## Plugin quality gates rule

The `plugin-quality-gates.mdc` rule file at `.cursor/plugins/cache/cursor-public/create-plugin/.../rules/plugin-quality-gates.mdc` enforces manifest, path, and component metadata validity during plugin authoring. Load it when writing extension code.

## Handoff boundary

`cursor-ide-guardian` owns extension scaffolding and the `vscode.cursor.*` API surface. For the React components inside the extension's webview panels, hand off to `react-guardian`. For publishing and CI for the extension, hand off to `devops-guardian`.
