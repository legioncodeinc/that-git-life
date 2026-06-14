---
source_type: official-docs
authority: high
relevance: high
topic: mcp-integration
url: https://cursor.com/docs/mcp
fetched: 2026-05-20
---

# Model Context Protocol (MCP) - Cursor Official Documentation

## Summary

The official Cursor MCP documentation covers the complete `mcp.json` configuration schema, both stdio and remote server types, OAuth support, config interpolation variables, and the programmatic Extension API for runtime registration. This is the authoritative source for `guides/03-mcp-integration.md`.

**Configuration locations:**
- Project-specific: `.cursor/mcp.json` (commit to git for team sharing; takes priority over global)
- Global: `~/.cursor/mcp.json` (personal, all projects)
- Both files are merged; project-level wins on name conflicts

**STDIO server config fields:**
- `type`: `"stdio"` (required but inferred from presence of `command`)
- `command`: executable (required)
- `args`: array of arguments (optional)
- `env`: environment variables (optional)
- `envFile`: path to .env file (optional)

**Remote server config:**
- `url`: HTTP/SSE endpoint
- `headers`: auth headers (optional)
- `auth`: static OAuth credentials (`CLIENT_ID`, `CLIENT_SECRET`, `scopes`) for OAuth 2.0 servers

**Config interpolation variables** (resolved in `command`, `args`, `env`, `url`, `headers`):
- `${env:NAME}` - environment variables
- `${userHome}` - home folder path
- `${workspaceFolder}` - project root (where `.cursor/mcp.json` lives)
- `${workspaceFolderBasename}` - project folder name
- `${pathSeparator}` / `${/}` - OS path separator

**Extension API** (`vscode.cursor.mcp`):
- `registerServer(config: StdioServerConfig | RemoteServerConfig): void` - programmatic registration without editing mcp.json
- `unregisterServer(serverName: string): void`
- Useful for enterprise onboarding tools and automated setup workflows

## Key quotations

- "Both files are merged. If the same server name appears in both, the project-level config takes priority."
- "By default, Agent asks for your approval before using an MCP tool. Enable auto-run in settings if you prefer Agent to use tools without asking."
- "For MCP servers that use OAuth, you can provide static OAuth client credentials in `mcp.json` instead of dynamic client registration."
- "Use variables in `mcp.json` values. Cursor resolves variables in these fields: `command`, `args`, `env`, `url`, and `headers`."

## Annotations for weapon-forge

- This is the PRIMARY source for `guides/03-mcp-integration.md`. All `mcp.json` field specs should cite this doc.
- The config interpolation variable table is highly useful for teams - reproduce it in full in guide 03.
- The static OAuth `auth` object is a 2026 addition - note it explicitly as a new capability.
- The Extension API (`vscode.cursor.mcp.registerServer`) enables enterprise plugin patterns - cover in `guides/06-extension-development.md`.
- The "project-level wins on name conflicts" merge behavior should be called out in the guide's project vs. global config section.
- Hot-reload: docs say "Restart Cursor" after config changes - note this as a friction point vs. Claude Code's hot-reload.
