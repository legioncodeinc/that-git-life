# Image Optimization Guardian — God's Guide

**Angel:** [`ai-tools/agents/image-optimization-guardian.md`](../../agents/image-optimization-guardian.md)
**Weapon:** [`ai-tools/skills/image-optimization-weapon/`](../../skills/image-optimization-weapon/)
**Command Brief:** [`ai-tools/command-briefs/image-optimization-guardian-command-brief.md`](../../../command-briefs/image-optimization-guardian-command-brief.md)
**Trigger policy:** on-demand

---

## Domain

`image-optimization-guardian` owns the full image delivery optimization surface: format selection (AVIF as 2026 default at 93-95% coverage, WebP fallback), responsive `srcset`/`sizes` calculus, blur placeholder strategies (LQIP/BlurHash/ThumbHash), `next/image` integration and the Next.js 16 `priority`→`preload` shift, and CLI tooling (Sharp for pipelines, Squoosh for one-offs). It treats image optimization as a measurable engineering discipline with LCP impact, not a cosmetic concern.

## Trigger phrases

Route to `image-optimization-guardian` when the user says any of:

- "optimize my images"
- "convert to AVIF"
- "fix layout shift from images"
- "add blur placeholders"
- "next/image remote patterns"
- "LCP image is slow"
- "AVIF vs WebP"
- "audit our images"
- "srcset sizes wrong"
- "BlurHash or LQIP"

## Do NOT route when

- The request is about video optimization — route to `video-streaming-guardian`
- The request is about image CDN selection (Cloudinary, ImageKit) — route to `image-cdn-guardian`
- The request is about general Core Web Vitals / LCP root cause analysis — route to `core-web-vitals-guardian`

## Inputs the Angel needs

- The tech stack (Next.js, plain HTML, other framework)
- The image types in use (hero, product, avatar, icons)
- Current format in use (JPEG, PNG, WebP)
- Whether using an image CDN or self-hosting

## Outputs the Angel produces

- Format migration plan (AVIF-first + WebP fallback) with browser matrix
- `srcset`/`sizes` attribute recommendations for responsive images
- Blur placeholder implementation (LQIP via Sharp, BlurHash/ThumbHash)
- `next/image` configuration fixes + remote patterns
- Image audit report at `templates/image-audit-report.md` shape

## Critical directives

- AVIF is the 2026 default for new content (93-95% global coverage)
- Mismatched `sizes` attribute is the #1 next/image performance bug — always audit this first
- Never recommend `<img>` without `width`/`height` — CLS will follow
- Escalate to `image-cdn-guardian` when the team needs transformation-on-the-fly or a managed CDN

---

*Part of God's roster. See [`ai-tools/skills/god/SKILL.md`](../SKILL.md) for the full Army.*
