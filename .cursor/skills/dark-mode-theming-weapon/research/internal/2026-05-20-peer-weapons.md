---
source_type: internal
authority: high
relevance: medium
topic: Peer weapon boundary notes for dark-mode-theming-weapon
date_retrieved: 2026-05-20
---

# Peer Weapon Boundary Notes

## ux-ui-weapon

`ux-ui-weapon` governs per-component visual specs: spacing, typography, shadow depth, focus rings. `dark-mode-theming-weapon` governs the token layer those specs reference. The handoff: `dark-mode-theming-weapon` produces the CSS variable surface; `ux-ui-weapon` tells components which tokens to use for which visual role.

Do NOT overlap: `dark-mode-theming-weapon` should not write per-component CSS rules. `ux-ui-weapon` should not write the `:root`/`.dark` block — that is this weapon's territory.

## design-system-weapon

`design-system-weapon` interviews the user, picks a palette, and produces the token file (master tokens CSS). `dark-mode-theming-weapon` receives that file and splits it into the `:root` (light) and `.dark` (dark) variable layers. If the token file does not already have semantic/primitive separation, `dark-mode-theming-guardian` should propose a refactor but defer to `design-system-guardian` for the final token names.

## db-weapon

`db-weapon` owns the schema for server-side persisted preference: the `user_preferences` table, the `theme` column, and the RLS policy. `dark-mode-theming-weapon` documents how to read that preference at request time (middleware cookie) and wire it to the HTML attribute, but does not design the schema.

## security-weapon

`security-weapon` should audit the multi-brand injection path: if a `data-brand` value is ever derived from user-controlled input (URL param, tenant slug), it must be validated against a server-side allowlist before being applied to the DOM. `dark-mode-theming-weapon` flags this boundary in `guides/06-multi-brand-runtime-swap.md`.
