# markdown-mdx-content-pipeline-guardian — God's Guide

The God routing skill's record of when to invoke `markdown-mdx-content-pipeline-guardian`. Use this guide to decide whether a user request belongs to this Angel.

**Angel:** [`ai-tools/agents/markdown-mdx-content-pipeline-guardian.md`](../../agents/markdown-mdx-content-pipeline-guardian.md)
**Weapon:** [`ai-tools/skills/markdown-mdx-content-pipeline-weapon/`](../../skills/markdown-mdx-content-pipeline-weapon/)
**Command Brief:** [`ai-tools/command-briefs/markdown-mdx-content-pipeline-guardian-command-brief.md`](../../../command-briefs/markdown-mdx-content-pipeline-guardian-command-brief.md)
**Trigger policy:** proactive

---

## Domain

`markdown-mdx-content-pipeline-guardian` owns everything between a raw `.md` or `.mdx` source file and its final HTML/JSX/React output. This includes compiler selection (Velite, @next/mdx, @mdx-js/mdx, next-mdx-remote), the unified remark/rehype plugin chain, syntax highlighting (Shiki v4, expressive-code, starry-night), math rendering (KaTeX), diagram embedding (Mermaid, D2), custom remark/rehype plugin authoring using the visitor pattern, and XSS sanitization (rehype-sanitize, DOMPurify). It is the 2026 authority on this rapidly-evolving ecosystem: Velite replaces the archived next-mdx-remote, Shiki v4 replaces Prism/Highlight.js, and sanitization is non-negotiable for any user-authored content.

## Trigger phrases

Route to `markdown-mdx-content-pipeline-guardian` when the user says any of:

- "set up MDX"
- "configure Shiki"
- "which Shiki version should I use?"
- "write a remark plugin" / "write a rehype plugin"
- "set up a plugin chain"
- "GFM tables aren't rendering"
- "remark-gfm setup"
- "sanitize user markdown" / "rehype-sanitize config"
- "embed Mermaid diagrams" / "mermaid in Next.js"
- "math in markdown" / "KaTeX rendering"
- "migrate from Contentlayer" / "migrate from next-mdx-remote"
- "MDX compiler for Next.js"
- "expressive-code setup"
- "Velite vs next-mdx-remote"
- "rehype-pretty-code configuration"
- "unified pipeline"
- "AST manipulation"
- "custom directive plugin"

Or when the request involves any `.md`/`.mdx` processing pipeline, content compilation, or syntax highlighting configuration.

## Do NOT route when

- The user is choosing between Starlight, Docusaurus, Mintlify, or other docs platforms — route to `docs-site-guardian` (platform before pipeline).
- The user wants to design the `mdx-components.tsx` component map (which React components replace which HTML tags) — route to `react-guardian`.
- The user wants a full XSS security audit beyond sanitization plugin configuration — route to `security-guardian`.
- The user wants to generate SDKs or enrich OpenAPI specs from MDX documentation — route to `api-docs-guardian`.
- The user asks about blog platform choices (Ghost, Hashnode, Medium) without mentioning a code pipeline — no routing needed; informational response suffices.

If a request straddles `docs-site-guardian` and this Angel (e.g., "set up Starlight with Shiki"), prefer `docs-site-guardian` for the platform decision and then hand off to this Angel for the highlighting configuration.

## Inputs the Angel needs

Before invoking, ensure the user has provided (or you can infer):

- **Target runtime:** Next.js App Router, Astro, Vite, standalone Node.js, or Cloudflare Workers (affects compiler and highlighter choice)
- **Content source:** local `.md`/`.mdx` files, CMS, database, user-generated (critical for sanitization posture)
- **Existing deps:** current `package.json` dependencies and any plugin configuration files (`next.config.mjs`, `velite.config.ts`)
- **Desired features:** math, diagrams, GFM, code highlighting, custom directives, callouts (optional — defaults to recommending a full-featured pipeline)

If the runtime is missing and the request is about compiler selection, ask: "Is this for Next.js App Router, Astro, Vite, or a standalone Node.js script?"

## Outputs the Angel produces

- **Compiler recommendation + configuration snippets** — `velite.config.ts`, `next.config.mjs`, or `unified()` chain with pinned plugin versions
- **Plugin chain diff** — exact `.use()` chain in canonical order with ordering rationale
- **Syntax highlighting config** — Shiki theme, rehype-pretty-code or expressive-code options, Cloudflare-compatible bundle approach if needed
- **Sanitization schema** — `rehype-sanitize` schema for the use case (docs allowlist vs user-generated strict), DOMPurify config for client-side
- **Custom plugin skeleton** — typed TypeScript plugin using the boilerplate from `templates/plugin-boilerplate.ts`
- **Test harness proposal** — vitest fixture plan with XSS payloads for new pipelines

## Multi-Angel sequences this Angel participates in

- **Docs site setup** — `docs-site-guardian` selects the platform and hands off; this Angel picks up to configure the highlighting and plugin chain for the chosen platform.
- **React/Next.js app build** — `react-guardian` owns the `mdx-components.tsx` component map; this Angel configures the pipeline that feeds it compiled MDX.
- **Security review** — `security-guardian` performs the broader XSS audit; this Angel configures `rehype-sanitize` and `DOMPurify` as the first-line sanitization layer.

## Critical directives the orchestrator should respect

- Always prefer Shiki v4 / rehype-pretty-code over Prism or Highlight.js for new projects (Prism is unmaintained in 2026).
- Flag `next-mdx-remote` as archived for any new project; recommend Velite migration.
- Enforce `rehype-sanitize` after `rehypeRaw` — never before.
- Never set `allowDangerousHtml: true` for user-authored content.

(Full list lives in the Angel file's `## Critical directives` section.)

---

*Part of God's roster. See [`ai-tools/skills/god/SKILL.md`](../SKILL.md) for the full Army.*
