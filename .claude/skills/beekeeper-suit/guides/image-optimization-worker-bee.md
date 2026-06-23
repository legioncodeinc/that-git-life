# Image Optimization Worker Bee - Beekeeper-Suit's Guide

The Beekeeper-Suit routing skill's record of when to invoke `image-optimization-worker-bee`. Use this guide to decide whether a user request belongs to this Bee.

**Bee:** [`.cursor/agents/image-optimization-worker-bee.md`](../../agents/image-optimization-worker-bee.md)
**Stinger:** [`.cursor/skills/image-optimization-stinger/`](../../skills/image-optimization-stinger/)
**Command Brief:** not available (synthesized from agent + stinger files)
**Trigger policy:** on-demand

---

## Domain

`image-optimization-worker-bee` owns all decisions about how images are encoded, sized, delivered, and perceived in the host product. Its domain runs from format choice (AVIF/WebP/JPEG/PNG/SVG) through responsive delivery (`srcset`, `sizes`, `<picture>`), placeholder strategies (LQIP via Sharp, BlurHash-as-CSS-gradient, ThumbHash), `next/image` integration (remote patterns, `priority`/`preload`, custom loaders), and CLI tooling (Sharp for Node.js pipelines, Squoosh for one-offs). The bee is the authoritative source for the 2026 image delivery playbook, covering format selection with the current browser support matrix, srcset/sizes calculus, and the Next.js 16 `priority`→`preload` API shift. It produces a structured audit report (saved to `library/qa/image-optimization/`) covering inventory, format breakdown, LCP candidates, placeholder audit, and a prioritized remediation checklist.

## Trigger phrases

Route to `image-optimization-worker-bee` when the user says any of:

- "optimize my images"
- "convert to AVIF" / "AVIF vs WebP" / "which image format should I use"
- "fix layout shift from images" / "CLS from images" / "my LCP image is slow"
- "add blur placeholders" / "LQIP" / "BlurHash" / "ThumbHash"
- "next/image remote patterns" / "next/image config" / "Image component sizes"
- "audit our images" / "image optimization report"
- "set up srcset and sizes" / "responsive images"

Or when the request implicitly involves image format conversion, responsive image delivery, placeholder loading UX, `next/image` configuration, or Sharp/Squoosh tooling in a web context.

## Do NOT route when

- The request is about SVG icon libraries, icon sprite systems, or icon component APIs — route to `icon-system-worker-bee` instead.
- The request is a general Lighthouse / Core Web Vitals audit that goes beyond image-specific findings — route to `lighthouse-pagespeed-worker-bee` instead.
- The request is about CDN cache TTL strategy, Cache-Control headers, or CI build pipeline architecture beyond per-image squash — route to `devops-worker-bee` instead.
- The request is about CSS animation performance or transition jank — route to `ux-ui-worker-bee` instead.

If a request straddles two Bees' domains, prefer the narrower-scoped Bee and let the broader one act as backup.

## Inputs the Bee needs

Before invoking, ensure the user has provided (or you can infer):

- **Framework and version** — Next.js version (critical for choosing `priority` vs `preload`), or confirmation it is a non-Next.js HTML context.
- **CDN setup** — whether the project is on Cloudflare, Vercel, Imgix, Fastly, or another provider (determines whether CDN-level format negotiation applies before any code changes).
- **Existing image config** — current `next.config` image settings, or existing `<picture>`/`<img>` patterns in the codebase.
- **LCP candidate (optional)** — which element is the LCP image, if known; if absent the Bee will audit and identify candidates or ask the user to run Lighthouse first.

## Outputs the Bee produces

- **Image audit report** — filled-in `templates/image-audit-report.md` covering inventory, format breakdown, srcset/sizes audit, LCP candidates, placeholder audit, width/height audit, and prioritized remediation checklist. Saved to `library/qa/image-optimization/<YYYY-MM-DD>-<project>-image-audit.md`.
- **Code changes** — updated `<Image>` / `<img>` / `<picture>` elements with corrected formats, `sizes`, `priority`/`preload`, `width`/`height`, and placeholder props; updated `next.config` with `formats`, `remotePatterns`, and `minimumCacheTTL`; Sharp batch conversion scripts or Squoosh CLI commands where applicable.

## Multi-Bee sequences this Bee participates in

- Plan execution loop — always closes with `security-worker-bee` then `quality-worker-bee`

## Critical directives the orchestrator should respect

- **AVIF first, WebP fallback, never JPEG as primary for new raster content.** AVIF delivers 50-70% smaller files than JPEG at equivalent quality and has 93-95% global browser support in 2026.
- **Never omit `width` and `height` on `<img>` or `<Image>` elements.** Missing dimensions cause CLS; a CLS above 0.1 fails Core Web Vitals.
- **Mark LCP images with `priority` (Next.js <16), `preload` (Next.js 16+), or `fetchpriority="high"` (native). Never pair LCP images with `loading="lazy"`.** `loading="lazy"` defers the LCP fetch until viewport intersection, which is the worst possible behavior for the LCP candidate.
- **`sizes` must match the CSS layout — never leave it at the default `100vw` for non-full-width images.** A mismatched `sizes` causes the browser to download images 2-4x wider than rendered, defeating the entire optimization.
- **Do not recommend client-side BlurHash decode for web contexts.** The JS decoder is 10x heavier in transfer than an LQIP string; use LQIP via Sharp or BlurHash-as-CSS-gradient via `@unpic/placeholder` instead.
- **Version-check before writing the `priority`/`preload` prop.** `priority` was deprecated in Next.js 16 in favor of `preload`; writing the wrong prop triggers a deprecation warning.
- **Validate `remotePatterns` is as specific as possible.** Wildcard hostname patterns allow any subdomain to serve images through the optimization pipeline — a security risk if the domain is user-controlled.

(Full list lives in the Bee file's `## Critical directives` section.)

---

*Part of Beekeeper-Suit's roster. See [`.cursor/skills/beekeeper-suit/SKILL.md`](../SKILL.md) for the full Army.*
