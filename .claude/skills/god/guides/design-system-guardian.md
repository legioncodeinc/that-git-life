# Guide: design-system-guardian

Bootstraps a complete design system from scratch for any product — source of truth, not production code.

---

## What this Angel owns

`design-system-guardian` is the Army's design-system bootstrapper. When a product needs UI from zero — no tokens file, no utility layer, no component specs — this Angel runs a structured interview, picks the closest starter kit, and materializes the canonical seven-artifact structure on disk. It owns:

- `00-design-brief.md` — the master brief (aesthetic, non-negotiables, scope, tenant/dark/RTL posture).
- `01-master-tokens.css` — color, spacing, typography, radius, motion tokens.
- `02-<utility-layer>.css` — the product-specific utility layer (e.g., glass-and-depth, surfaces-and-borders, paper-and-type).
- `03-components/*.md` — one spec per component group (purpose → contract → example → replaces).
- `04-screens/*.md` — one spec per major screen.
- `05-html-examples/*.html` — static, double-click-openable visual references.
- `README.md` — reader's guide, status table, change-control statement naming `ux-ui-guardian` as the steady-state owner.

This Angel extracts taste from the user; it never invents it. It writes `.md` and `.css` source documents; it does not wire them into a live codebase. Once the seven artifacts exist, ownership hands off to `ux-ui-guardian`.

## When to invoke

Delegate to `design-system-guardian` when the user:

- Says "build a design system for X", "bootstrap UI for product Y", "create tokens and utilities for this product".
- Brings a fresh product with no existing `library/knowledge-base/<product>-ux-ui/` folder.
- Has unsystematic CSS they want extracted into the canonical seven-artifact structure.
- Needs to define the source of truth before engineering starts implementing.

Do **not** invoke for incremental changes, PR reviews, or maintenance of an existing design system — that is `ux-ui-guardian`'s domain.

Do **not** invoke for wiring the system into a live codebase — the Angel produces source documents, not runtime code.

## Paired Weapon

`.cursor/skills/design-system-weapon/` — contains the master index (SKILL.md), authoring guides for each artifact, three starter kits (`glass-on-beige/`, `flat-modern/`, `editorial-serif/`), templates for brief / tokens / components / screens / HTML examples / readme, worked bootstrap examples, and the research trail.

## Expected input

- The product name and target path (default `library/knowledge-base/<product>-ux-ui/`).
- The aesthetic direction, supplied via interview or three reference products the user admires.
- Scope signals: tenant theming? dark mode? RTL? component inventory? major screens?
- Any non-negotiables the user wants baked in ("three progress-bar heights", "no inline styles", "oklch only").

## Expected output

- The complete seven-artifact structure at the target path, authored in layering order (tokens → utility → components → screens → HTML → brief → README).
- A handoff note identifying `ux-ui-guardian` as the ongoing owner.
- Optionally, a stub companion agent file pointing at the new folder so future requests route to `ux-ui-guardian` with the correct source of truth.

## Critical directives to respect when routing

- **Never ask this Angel to decide the aesthetic on its own.** If the user says "you pick", the Angel will push back and request three reference products. Rushed bootstraps produce bad design systems.
- **Respect the layering order.** Do not ask for component specs before tokens are authored. A component doc that references a hex value instead of a token is a bug, not a shortcut.
- **This Angel produces source of truth, not production code.** Do not ask for React components, Tailwind configs, or runtime wiring.
- **Once the folder exists, future UI questions route to `ux-ui-guardian`, not back here.** This Angel is a bootstrapper, not a steady-state authority.

## Typical failure modes

- Invoked for an incremental change to an existing design system — route to `ux-ui-guardian` instead.
- Invoked with "you decide" on aesthetic — the Angel will correctly refuse to guess. Orchestrators should collect reference products before delegation.
- Invoked for production code generation — the Angel will produce `.md` and `.css` only. For wiring, use the primary orchestrator with `ux-ui-guardian` as reviewer.
- Invoked without a target path — the Angel defaults to `library/knowledge-base/<product>-ux-ui/`; confirm this matches the user's intent before the full authoring pass.

## Orchestration notes

Step 1 in the canonical "New product → Design system bootstrap → UI implementation → UX review" sequence. After the seven-artifact folder lands, hand off to `ux-ui-guardian` for all subsequent UI questions on that product. If the bootstrapped system introduces catalogued assets (named components, screens, tokens worth registering), `asset-guardian` updates the registry after `ux-ui-guardian` confirms steady-state.
