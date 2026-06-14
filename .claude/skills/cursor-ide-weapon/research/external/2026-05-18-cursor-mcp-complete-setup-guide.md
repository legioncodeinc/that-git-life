---
source_type: blog
authority: medium
relevance: high
topic: mcp-integration
url: https://claudefa.st/blog/tools/mcp-extensions/cursor-mcp-setup
fetched: 2026-05-20
---

# Cursor MCP Servers: Complete Setup Guide for 2026

## Summary

Published May 18, 2026. Practitioner guide covering Cursor MCP server setup from scratch with troubleshooting and comparison against Claude Code. Key value: the Cursor vs. Claude Code MCP comparison table and the troubleshooting section.

**Configuration locations:**
- Project-level: `.cursor/mcp.json`
- Global: `~/.cursor/mcp.json`

**Cursor vs Claude Code MCP comparison:**

| Feature | Cursor | Claude Code |
|---------|--------|-------------|
| Config location | `.cursor/mcp.json` | `~/.claude.json` or `.mcp.json` |
| Transport types | stdio, SSE, HTTP | stdio (HTTP/SSE in some preview builds) |
| OAuth support | Built-in OAuth flow | Manual token paste in `env` block |
| Tool search | Not available (all tools loaded at session start) | Tool Search (lazy loading on demand) |
| Resources | Not yet supported | Supported |
| Hot reload | Restart Cursor required | Reloads on `.mcp.json` edit in some builds |
| Per-project scope | `.cursor/mcp.json` works | `.mcp.json` works the same way |

**Troubleshooting steps:**
1. Open Cursor Settings, search "MCP", confirm "Enable MCP Servers" is checked
2. Run `MCP: View Server Status` from Command Palette to confirm servers loaded
3. Verify JSON syntax is valid
4. Check server logs via Help > Toggle Developer Tools > Console

**Key fact:** MCP server packages are interchangeable between Cursor and Claude Code - both speak the same protocol. The same `mcp.json` config block copies between tools with no modification.

## Key quotations

- "Cursor and Claude Code both speak the same Model Context Protocol, so server packages are interchangeable."
- "Tool search: Not available — all tools loaded at session start" (unlike Claude Code's lazy loading)
- "Resources: Not yet supported" in Cursor (unlike Claude Code)
- "Hot reload: Restart Cursor required for config changes" (unlike Claude Code's auto-reload)

## Annotations for weapon-forge

- The "all tools loaded at session start" limitation is important: large numbers of MCP tools can bloat the context window. Mention in guide 03 as a reason to scope MCP servers per-project.
- Resources (MCP spec feature) not supported in Cursor - note this as a known gap in guide 03.
- The Cursor vs Claude Code comparison table is useful for teams choosing between tools - include a condensed version in guide 03.
- The troubleshooting steps (MCP: View Server Status command) are practical and should be in a troubleshooting section of guide 03.
- Config interpolation (`${env:VAR}`) is the safe way to inject API keys; this guide's reliance on hardcoded env values is an antipattern to note.
