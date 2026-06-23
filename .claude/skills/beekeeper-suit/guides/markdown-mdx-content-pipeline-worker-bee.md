# Markdown/MDX Content Pipeline Worker Bee - Beekeeper-Suit's Guide

The Beekeeper-Suit routing skill's record of when to invoke `markdown-mdx-content-pipeline-worker-bee`. Use this guide to decide whether a user request belongs to this Bee.

**Bee:** [`.cursor/agents/markdown-mdx-content-pipeline-worker-bee.md`](../../agents/markdown-mdx-content-pipeline-worker-bee.md)
**Stinger:** [`.cursor/skills/markdown-mdx-content-pipeline-stinger/`](../../skills/markdown-mdx-content-pipeline-stinger/)
**Command Brief:** not available (synthesized from agent + stinger files)
**Trigger policy:** on-demand

---

## Domain

`markdown-mdx-content-pipeline-worker-bee` owns the full Markdown/MDX content processing stack — everything between a raw `.md`/`.mdx` source file and its final HTML/JSX/React output. This includes compiler selection (Velite, @next/mdx, next-mdx-remote, @mdx-js/mdx, Contentlayer2), the remark/rehype plugin chain, syntax highlighting (Shiki v4, expressive-code, starry-night, rehype-pretty-code), math rendering (KaTeX, MathJax), diagram embedding (Mermaid, D2), custom directive plugins, and XSS sanitization (rehype-sanitize, DOMPurify). It is opinionated about the 2026 ecosystem: it prefers Velite over archived next-mdx-remote, Shiki v4 over Prism/Highlight.js, and treats sanitization as non-negotiable for user-authored content. It does not own platform selection, the React component map, or broader security audits beyond sanitization config.

## Trigger phrases

Route to `markdown-mdx-content-pipeline-worker-bee` when the user says any of:

- "set up MDX"
- "configure Shiki"
- "write a remark plugin"
- "rehype plugin chain"
- "sanitize user markdown"
- "embed Mermaid diagrams"
- "migrate from Contentlayer"
- "migrate from next-mdx-remote"
- "math in markdown"
- "audit unified pipeline"

Or when the request implicitly involves compiling, transforming, or rendering `.md`/`.mdx` files through the unified/remark/rehype ecosystem.

## Do NOT route when

- The user is choosing between docs platforms (Starlight, Docusaurus, Mintlify) — route to `docs-site-worker-bee`, which owns platform selection; this Bee picks up once the platform is decided.
- The user wants to design or audit the `mdx-components.tsx` component map (which React components replace which HTML elements) — route to `react-worker-bee`.
- The sanitization audit reveals broader XSS concerns beyond rehype-sanitize/DOMPurify config (CSP headers, stored XSS via database, rendered JSX from untrusted sources at scale) — route to `security-worker-bee`.
- The user wants to generate SDKs or enrich an OpenAPI spec from MDX documentation — route to `api-docs-worker-bee`.
- The request is about SEO/AEO concerns on rendered pages — route to `seo-aeo-worker-bee`.

If a request straddles two Bees' domains, prefer the narrower-scoped Bee and let the broader one act as backup.

## Inputs the Bee needs

Before invoking, ensure the user has provided (or you can infer):

- Target framework or runtime (Next.js App Router, Astro, Vite, plain Node.js) — required to select the right compiler
- Whether content is trusted (author-written) or user-generated — required to determine sanitization strictness
- Existing compiler/stack if this is an audit or migration (e.g., "we use next-mdx-remote v5") — optional; Bee will ask if undecided
- Specific feature request (syntax highlighting, math, diagrams, custom plugin) — optional; defaults to a full pipeline audit if absent

## Outputs the Bee produces

- Configuration PR diff or code artifact: `velite.config.ts`, `next.config.mjs`, or `.use()` plugin chain with pinned versions and inline comments explaining each plugin's role
- Advisory markdown when no code change is needed: compiler decision rationale, migration steps, sanitization checklist, or plugin ordering correction

## Multi-Bee sequences this Bee participates in

- Plan execution loop — always closes with `security-worker-bee` then `quality-worker-bee`
- Docs platform setup — `docs-site-worker-bee` selects the platform, then hands off to this Bee for highlighting and plugin configuration
- New content site bootstrap — this Bee wires the MDX pipeline after `react-worker-bee` scaffolds the component map

## Critical directives the orchestrator should respect

- **Prefer Shiki v4 over Prism or Highlight.js for new projects.** Shiki ships TextMate grammars, is the 2026 default in Vite/Astro/Next.js, and supports rich transformers; Prism is unmaintained and Highlight.js lacks transformer support.
- **Never skip sanitization for user-generated Markdown.** MDX can embed arbitrary JSX; without `rehype-sanitize` or DOMPurify, a malicious `<script>` or event handler in user-authored content executes in the application's origin — a critical XSS vector.
- **Flag next-mdx-remote as archived for any new project.** It was archived by Hashicorp in 2026 (v6.0.0 final, February 2026); recommend Velite for new Next.js content sites.
- **`rehype-sanitize` MUST come after `rehype-raw` in the plugin chain.** Placing sanitize before raw allows raw HTML nodes to survive sanitization — the sanitizer sees no HTML because `rehypeRaw` hasn't parsed it yet.
- **Pin plugin versions.** The unified ecosystem releases breaking AST changes without major semver bumps; `"*"` or `"latest"` breaks pipelines silently.
- **Distinguish MDX compile (server/build) from MDX render (client/RSC).** Conflating these layers produces subtly broken CSR/SSR configurations with security implications; `allowDangerousHtml: true` is only safe at compile time for fully trusted source.

(Full list lives in the Bee file's `## Critical directives` section.)

---

*Part of Beekeeper-Suit's roster. See [`.cursor/skills/beekeeper-suit/SKILL.md`](../SKILL.md) for the full Army.*
