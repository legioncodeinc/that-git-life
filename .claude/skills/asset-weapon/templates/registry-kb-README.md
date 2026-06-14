# Universal Asset Registry — Knowledge Base

<!-- Owner: asset-guardian. Seed copied from .cursor/skills/asset-weapon/templates/registry-kb-README.md on library/knowledge-base/asset-registry/ scaffold. Edit freely; do not rename the folder without updating the agent. -->

This folder is the durable documentation home for the Universal Asset Registry — the platform-owned catalog of every Feature, Page, Route, Surface, Control, Display, Layout, NavEntry, DesignToken, Icon, MediaAsset, Font, Motion, Breakpoint, ContentEntry, Translation, FeatureFlag binding, Meter binding, and Entitlement.

## When to read

- You are implementing any asset-registry sub-feature PRD.
- You are reviewing a PR that adds, modifies, or deprecates a registry row.
- You are debugging a drift audit failure.
- You need to understand how the code-to-DB sync works.

## Document map

```
library/knowledge-base/asset-registry/
├── README.md                     # this file
├── 00-architecture.md            # spine concept, principles, data flow
├── 01-tables-reference.md        # master list of registry tables + fields
├── 02-tokens-catalog.md          # design-token catalog (aligned with ux-ui brief)
├── 03-relationships-map.md       # the joins that matter (diagrams)
├── 04-critical-directives.md     # do's, don'ts, anti-patterns
├── 05-schema-example.prisma      # canonical Prisma fragment (mirrors agent/schema/)
├── 06-sync-generator-contract.md # CI generator rules
└── 07-migration-strategy.md      # blank-DB + existing-DB overlay paths
```

Drift reports do **not** live here. See:

- **Standalone drift reports** → `library/qa/asset-registry/<YYYY-MM-DD>-drift-audit.md`
- **Feature-tied drift reports** → `library/requirements/features/feature-<###>-<title>/reports/<YYYY-MM-DD>-asset-drift.md`

## Agent ownership

This folder is owned by [`asset-guardian`](../../../.cursor/agents/asset-guardian.md). For cross-cutting concerns:

- **Documentation lifecycle** (numbering, invariants, cross-linking): [`library-guardian`](../../../.cursor/agents/library-guardian.md)
- **UX/UI semantic token meaning**: [`ux-ui-guardian`](../../../.cursor/agents/ux-ui-guardian.md)
- **QA of registry-shaped implementations**: [`quality-guardian`](../../../.cursor/agents/quality-guardian.md)
- **Security review of registry feature PRDs**: [`security-guardian`](../../../.cursor/agents/security-guardian.md)

## Governing principles

See `00-architecture.md` for the full treatment. Summary:

1. Code is truth; DB is the registry.
2. Deprecate, never delete.
3. Keys stable; IDs opaque.
4. Platform catalogs, tenant overrides.
5. Features are the spine.
6. No new string-keyed references.
7. Generator vs human fields are disjoint.
8. Every change is traceable.
9. Every per-asset guide follows the template.

## Related

- Asset-registry feature wave — `library/requirements/features/feature-<###>-asset-registry-master-index/feature-<###>-asset-registry-master-index.md` (when written)
- ux-ui brief — `library/knowledge-base/ux-ui/00-design-brief.md`
- Existing feature-flag schema — the deploying product's Prisma/SQL schema, `FeatureFlag` model
- Theme data model — complements the `DesignTokenDefinition` catalog (see ux-ui-guardian)
