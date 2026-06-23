# Asset Worker Bee - Beekeeper-Suit's Guide

The Beekeeper-Suit routing skill's record of when to invoke `asset-worker-bee`. Use this guide to decide whether a user request belongs to this Bee.

**Bee:** [`.cursor/agents/asset-worker-bee.md`](../../agents/asset-worker-bee.md)
**Stinger:** [`.cursor/skills/asset-stinger/`](../../skills/asset-stinger/)
**Command Brief:** not available (synthesized from agent + stinger files)
**Trigger policy:** on-demand

---

## Domain

The Asset Worker Bee is the single owner of the Universal Asset Registry — the platform-owned catalog of every first-class asset in the codebase. It covers 19 asset types: Features, Pages, Routes, Surfaces, Controls, Displays, Layouts, NavEntries, DesignTokens, Icons, MediaAssets, Fonts, Motion, Breakpoints, ContentEntries, Translations, FeatureFlagBindings, MeterBindings, and Entitlements. All registry rows live in the DB; the codebase is the source of truth and the registry reflects it. Tenant-scoped overrides (theme, flags, menu customization, content) reference these catalogs by FK — never by hardcoded string. This Bee also owns drift auditing between code and DB, the sync-generator contract, and all documentation under `library/knowledge-base/asset-registry/`.

## Trigger phrases

Route to `asset-worker-bee` when the user says any of:

- "register this feature / page / route / surface / control / icon / font / token"
- "add this asset to the registry"
- "audit drift between code and the registry"
- "design the sync generator" / "spec the code-to-DB sync"
- "deprecate / sunset this asset"

Or when the request implicitly involves cataloging, inventorying, or auditing any of the 19 asset types in the Universal Asset Registry.

## Do NOT route when

- The request is about authoring QA reports or test plans — that belongs to `quality-worker-bee`.
- The request is about numbering, validating, or placing feature PRDs and issue requirement docs — that belongs to `library-worker-bee`.
- The request is about UX or visual design decisions, design-system authority, or `library/knowledge-base/ux-ui/*` — that belongs to `ux-ui-worker-bee` (Asset Worker Bee co-owns only the DesignToken catalog, not UX design decisions).
- The request is a security audit of registry tables or feature PRDs — that belongs to `security-worker-bee`.

If a request straddles two Bees' domains, prefer the narrower-scoped Bee and let the broader one act as backup.

## Inputs the Bee needs

Before invoking, ensure the user has provided (or you can infer):

- The asset type (Feature, Page, Route, Surface, Control, Display, Layout, NavEntry, DesignToken, Icon, MediaAsset, Font, Motion, Breakpoint, ContentEntry, Translation, FeatureFlagBinding, MeterBinding, or Entitlement).
- A reference to the real, running construct in the codebase that the registry row will reflect (component name, route path, CSS variable name, i18n key, etc.).
- The intended operation — register, audit, deprecate, sync-spec, or explain — defaults to "register" if the user simply names an asset and asks to "add" it.

## Outputs the Bee produces

- A registry row spec (human-owned fields: `key`, `description`, `owner`, `plan_tiers`, `status`; generator-owned fields noted as write-only-by-generator) plus the corresponding migration delta, delivered as a KB doc under `library/knowledge-base/asset-registry/`.
- For drift audits: a drift report at `library/qa/asset-registry/<YYYY-MM-DD>-drift-audit.md` (or feature-scoped at `library/requirements/features/feature-<###>-<title>/reports/<YYYY-MM-DD>-asset-drift.md`).

## Multi-Bee sequences this Bee participates in

- Plan execution loop — always closes with `security-worker-bee` then `quality-worker-bee`

## Critical directives the orchestrator should respect

- Code is the source of truth; never register a row for an asset that does not exist as a real, importable construct in the codebase.
- Deprecate, never delete — a row transitions to `status: archived` with `deprecated_at` and `sunset_at`; physical deletion only after `sunset_at` passes and `usage_count = 0`.
- Stable, human-readable keys — `key` is kebab-case, ≤64 chars, never renamed; key changes require a `key_alias` row.
- No string-keyed references where a FK exists — flag any `targetKey: String` pointing at a catalog and propose a migration.
- Derived fields (`code_path`, `file_hash`, `last_seen_at`, `detected_at`) are write-only-by-generator and must never accept human input.
- Every registry change cites the PR that introduced it; every schema change cites a feature PRD; no orphan migrations.

(Full list lives in the Bee file's `## Your Invariants` section.)

---

*Part of Beekeeper-Suit's roster. See [`.cursor/skills/beekeeper-suit/SKILL.md`](../SKILL.md) for the full Army.*
