# Guide 03: MCP Integration

How to register, configure, and build MCP (Model Context Protocol) servers for Cursor.

## What is MCP in Cursor?

MCP is the protocol Cursor uses to let agents call external tools — think of it as a plugin system for the agent's action space. An MCP server exposes `tools` (functions the agent can call), `resources` (read-only data sources), and `prompts` (reusable prompt templates). Cursor ships with several built-in MCP servers and lets you add your own.

## Config file hierarchy

Cursor reads MCP config from two places:

| File | Scope | Priority |
|---|---|---|
| `.cursor/mcp.json` | Project-specific; commit to git for team sharing | Higher (project wins on name conflict) |
| `~/.cursor/mcp.json` | Global; applies to all projects | Lower |

Both files are merged at startup. Restart Cursor after editing either file (unlike Claude Code, Cursor does not hot-reload MCP configs).

## `mcp.json` schema

### STDIO server (process spawned by Cursor)

```json
{
  "mcpServers": {
    "my-tool": {
      "command": "node",
      "args": ["${workspaceFolder}/scripts/my-mcp-server.js"],
      "env": {
        "API_KEY": "${env:MY_API_KEY}"
      }
    }
  }
}
```

Required fields: `command`. Optional: `args`, `env`, `envFile` (path to a `.env` file).

### Remote server (HTTP/SSE)

```json
{
  "mcpServers": {
    "remote-tool": {
      "url": "https://my-mcp.example.com/sse",
      "headers": {
        "Authorization": "Bearer ${env:REMOTE_TOKEN}"
      }
    }
  }
}
```

### Remote server with OAuth (2026 addition)

```json
{
  "mcpServers": {
    "oauth-tool": {
      "url": "https://my-oauth-mcp.example.com/sse",
      "auth": {
        "clientId": "${env:MCP_CLIENT_ID}",
        "clientSecret": "${env:MCP_CLIENT_SECRET}",
        "scopes": ["read", "write"]
      }
    }
  }
}
```

### Config interpolation variables

These variables are resolved in `command`, `args`, `env`, `url`, and `headers`:

| Variable | Value |
|---|---|
| `${env:NAME}` | Environment variable `NAME` |
| `${userHome}` | User home directory |
| `${workspaceFolder}` | Project root (where `.cursor/mcp.json` lives) |
| `${workspaceFolderBasename}` | Project folder name only |
| `${pathSeparator}` or `${/}` | OS path separator |

**Never hardcode secrets in `mcp.json`.** Always use `${env:NAME}` and store the value in your shell environment or a `.env` file (referenced via `envFile`).

## Authoring an MCP tool (TypeScript)

A minimal MCP server using the `@modelcontextprotocol/sdk` package:

```typescript
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";

const server = new Server({ name: "my-tool", version: "1.0.0" });

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [{
    name: "run_security_scan",
    description: "Runs a security scan on the specified file and returns findings.",
    inputSchema: {
      type: "object",
      properties: {
        filePath: { type: "string", description: "Absolute path to the file to scan." }
      },
      required: ["filePath"]
    }
  }]
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name === "run_security_scan") {
    const { filePath } = request.params.arguments as { filePath: string };
    // ... your logic here
    return { content: [{ type: "text", text: `Scan complete for ${filePath}` }] };
  }
  throw new Error(`Unknown tool: ${request.params.name}`);
});

const transport = new StdioServerTransport();
await server.connect(transport);
```

### Tool schema requirements

Cursor validates tool schemas strictly. Common failure patterns (silently rejected, no UI error):

| Problem | Fix |
|---|---|
| Missing `inputSchema` | Add `inputSchema: { type: "object", properties: {}, required: [] }` even for zero-param tools |
| `properties` is an array instead of an object | Use `{ "paramName": { "type": "string" } }` format |
| Tool name contains spaces or special chars | Use kebab-case: `run-scan`, `fetch-data` |
| Tool name > ~60 characters | Keep names short and namespaced: `secuity.run-scan` |

### Auto-approval

By default, Cursor asks the user before calling any MCP tool. To enable auto-approval (agent calls tools without prompting):

Settings > Cursor Settings > MCP > "Allow Agent to run tools without asking" > enable per-tool or globally.

## Programmatic registration (Extension API)

For enterprise plugins or automated setup workflows, use the `vscode.cursor.mcp` Extension API to register servers without editing `mcp.json`:

```typescript
import * as vscode from "vscode";

// In your extension's activate() function:
const mcpApi = vscode.extensions.getExtension("cursor.cursor")?.exports?.mcp;
if (mcpApi) {
  mcpApi.registerServer("my-enterprise-tool", {
    command: "node",
    args: ["/path/to/server.js"]
  });
}
```

Unregister with `mcpApi.unregisterServer("my-enterprise-tool")`. Useful for:
- Enterprise onboarding tools that add team-standard MCP servers automatically.
- Cursor plugins/extensions that bundle their own MCP server.

## Troubleshooting checklist

- **Tool not appearing in agent:** check `mcp.json` JSON syntax (a single trailing comma breaks the file); restart Cursor; verify the server process starts without errors.
- **Tool call silently fails:** validate `inputSchema` against the JSON Schema spec; check server logs in Output panel > "Cursor MCP".
- **Auth errors on remote server:** confirm env vars are set in your shell before launching Cursor; try `echo ${MY_API_KEY}` in a terminal first.
- **Server spawned multiple times:** Cursor spawns one process per project. If the server is also registered globally, you may get two processes — prefix the name differently to avoid conflicts.
