# Guide: asset-guardian

The single owner of the Universal Asset Registry for any product that adopts it.

---

## What this Angel owns

Every first-class asset in the host codebase: Features, Pages, Routes, Surfaces, Controls, Displays, Layouts, NavEntries, DesignTokens, Icons, MediaAssets, Fonts, Motion definitions, Breakpoints, ContentEntries, Translations, FeatureFlag bindings, Meter bindings, and Entitlements. The Registry is the platform-owned catalog; tenant-scoped overrides reference it by foreign key, never by hardcoded string.

`asset-guardian` is responsible for:

- Every row in every registry table.
- Every knowledge-base doc under `library/knowledge-base/registry/`.
- The contract between code and database that keeps the two in sync.
- The code→DB sync generator (design and evolution).

## When to invoke

Delegate to `asset-guardian` when the user is:

- Registering a new asset (a new Feature, Page, Route, Surface, DesignToken, Icon, etc.).
- Auditing drift between the code and the Registry tables.
- Generating a registry migration (SQL or Prisma).
- Designing or updating the code→DB sync generator.
- Authoring or updating any document in `library/knowledge-base/registry/`.
- Asking who owns a particular catalog asset type.

Do **not** invoke for general documentation (that's `library-guardian`), UI design decisions (that's `ux-ui-guardian`), or security concerns (that's `security-guardian`).

## Paired Weapon

`.cursor/skills/asset-weapon/` — contains principles, per-asset-type workflows, the canonical Prisma/SQL schema, worked examples, and migration templates.

## Expected input

- Description of the asset to register, or a pointer to the code change that introduced it.
- Target asset type (Feature, Page, Surface, DesignToken, etc.).
- For drift audits: a branch or commit range to compare against.
- For generator changes: a description of the new sync behavior.

## Expected output

- An entry in the appropriate registry table via a Prisma/SQL migration.
- An updated or newly-authored document in `library/knowledge-base/registry/`.
- For drift audits: a markdown report listing the deltas between code and DB with recommended reconciliation actions.

## Critical directives to respect when routing

- Registry-aware. Only invoke in repositories that have actually adopted the Universal Asset Registry pattern; confirm with the user before applying it to a new codebase.
- Peer to `library-guardian`, `quality-guardian`, `security-guardian`, and `ux-ui-guardian` — overlapping concerns should be routed to the peer that owns the primary scope.

## Typical failure modes

- Invoked for generic documentation work — route to `library-guardian` instead.
- Invoked to design a new UI component without any asset-registry implication — route to `ux-ui-guardian`.
- Hardcoded strings appear in tenant-scoped code — this is a sign of a missing Registry entry; invoke `asset-guardian` to catalog the asset, then update the code to reference the FK.

## Orchestration notes

When a UI change introduces a new Page, Surface, Control, or any catalogged asset, orchestrate: `ux-ui-guardian` first (to review the design), then `asset-guardian` (to register the asset), then the primary orchestrator implements. If the design is already settled, skip straight to `asset-guardian`.
