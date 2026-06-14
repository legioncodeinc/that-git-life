# MCP Server Example

A minimal TypeScript MCP server that Cursor can invoke, with the corresponding `mcp.json` entry.

## Server code (`scripts/my-mcp-server.ts`)

```typescript
#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { readFileSync } from "fs";

const server = new Server(
  { name: "project-tools", version: "1.0.0" },
  { capabilities: { tools: {} } }
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: "read-env-summary",
      description: "Returns a summary of the project's environment variables from .env.example.",
      inputSchema: {
        type: "object",
        properties: {},
        required: [],
      },
    },
    {
      name: "check-dependency",
      description: "Checks if a npm package is listed in package.json.",
      inputSchema: {
        type: "object",
        properties: {
          packageName: {
            type: "string",
            description: "The npm package name to check.",
          },
        },
        required: ["packageName"],
      },
    },
  ],
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  if (name === "read-env-summary") {
    try {
      const content = readFileSync(".env.example", "utf-8");
      const keys = content
        .split("\n")
        .filter((l) => l.trim() && !l.startsWith("#"))
        .map((l) => l.split("=")[0].trim());
      return {
        content: [
          {
            type: "text",
            text: `Found ${keys.length} env vars: ${keys.join(", ")}`,
          },
        ],
      };
    } catch {
      return { content: [{ type: "text", text: ".env.example not found." }] };
    }
  }

  if (name === "check-dependency") {
    const { packageName } = args as { packageName: string };
    try {
      const pkg = JSON.parse(readFileSync("package.json", "utf-8"));
      const allDeps = { ...pkg.dependencies, ...pkg.devDependencies };
      const found = packageName in allDeps;
      return {
        content: [
          {
            type: "text",
            text: found
              ? `${packageName} is installed (${allDeps[packageName]}).`
              : `${packageName} is NOT in package.json.`,
          },
        ],
      };
    } catch {
      return { content: [{ type: "text", text: "Could not read package.json." }] };
    }
  }

  return {
    content: [{ type: "text", text: `Unknown tool: ${name}` }],
    isError: true,
  };
});

const transport = new StdioServerTransport();
await server.connect(transport);
```

## `.cursor/mcp.json` entry

```json
{
  "mcpServers": {
    "project-tools": {
      "command": "npx",
      "args": ["tsx", "${workspaceFolder}/scripts/my-mcp-server.ts"],
      "env": {}
    }
  }
}
```

Or if compiled to JS:

```json
{
  "mcpServers": {
    "project-tools": {
      "command": "node",
      "args": ["${workspaceFolder}/scripts/my-mcp-server.js"]
    }
  }
}
```

## Install dependencies

```bash
pnpm add -D @modelcontextprotocol/sdk tsx
```

## Testing

After saving `mcp.json`, restart Cursor. In the agent panel, ask: "Use the `read-env-summary` tool." Cursor will call the tool and display the result.

Check Output > "Cursor MCP" for server logs and errors.
