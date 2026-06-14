---
source_type: internal
authority: high
relevance: high
topic: weapon folder layout and pipeline context
date_accessed: 2026-05-20
---

# Weapon Folder Layout: image-optimization-weapon

## Pipeline Position

scripture-historian (Phase 1.5) → **weapon-forge reads this folder** (Phase 2) → angel-creator (Phase 3) → god-registrar (Phase 4)

## Expected weapon-forge Output Layout

```
ai-tools/skills/image-optimization-weapon/
├── SKILL.md                          # Primary entrypoint for the Angel
├── guides/
│   ├── 00-principles.md              # Format hierarchy, LCP thinking, SSRF guard
│   ├── 01-format-selection.md        # AVIF vs WebP vs legacy decision tree
│   ├── 02-responsive-srcset.md       # srcset/sizes authoring
│   ├── 03-blur-placeholders.md       # LQIP, BlurHash, ThumbHash
│   ├── 04-nextjs-image.md            # Next.js <Image> config guide
│   └── 05-tooling-pipeline.md        # Squoosh, Sharp, ImageOptim, CI
├── templates/
│   ├── nextjs-image-remote.tsx       # Template for remote <Image> component
│   ├── picture-avif-webp.html        # Picture element with AVIF/WebP fallback
│   ├── responsive-srcset.html        # Complete srcset/sizes example
│   └── blur-placeholder-lqip.tsx     # plaiceholder + next/image wiring
├── examples/
│   ├── sharp-avif-batch.ts           # Sharp programmatic batch conversion
│   ├── squoosh-cli-ci.sh             # Squoosh CLI CI script
│   └── nextjs-config-remote.js       # next.config.js with remotePatterns
└── research/                         # THIS FOLDER (populated by scripture-historian)
    ├── research-plan.md
    ├── research-summary.md
    ├── index.md
    ├── internal/
    └── external/
```

## Key Relationships

- SKILL.md orients the Angel and points to guides
- Guides are consumed at task-time (Angel deep-dives into relevant guide)
- Templates are copy-paste-ready production code snippets
- Research folder is input to weapon-forge; not shipped to end users
- The `image-optimization-guardian` subagent file lives at `.cursor/agents/image-optimization-guardian.md`

## Refresh Cadence

Every 6 months (AVIF toolchain and browser baseline shift frequently; BlurHash/ThumbHash APIs evolve).
