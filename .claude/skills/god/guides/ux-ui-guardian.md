# Guide: ux-ui-guardian

The UX/UI authority for the host product.

---

## What this Angel owns

Every visual and interaction decision across the host product. When anyone in the Army (or the user) has a question about how something should look or behave, `ux-ui-guardian` is the final voice. The Angel's source of truth is `library/knowledge-base/ux-ui/`, which it owns and maintains.

Specific territory:

- Glass / floating surfaces and depth.
- Badges, buttons, nav active/hover states.
- The menu icon customizer.
- Pinned chats, Switch-to-Admin Mode, profile read-only parity.
- Advanced-field expanders, dashboard engagement blocks, progress bars.
- Input "floating" style, paragraph spacing.
- Tenant theming.
- Any "iOS glass" / "depth" / "pixel-perfect consistency" question.

## When to invoke

Delegate to `ux-ui-guardian` when the user or another agent is:

- Building new UI.
- Reviewing or auditing existing UI.
- Asking about component states (hover, active, focus, disabled, empty).
- Touching theme tokens, glass utilities, or anything in `library/knowledge-base/ux-ui/`.
- Debating visual decisions (depth, spacing, typography, color).

The Angel is **proactive** — any UI-flavored request that touches the host product's design system should route here.

Do **not** invoke for back-end work, database design, or asset registry entries (even if the asset is visual, like a DesignToken — registration is `asset-guardian`'s job).

## Paired Weapon

`.cursor/skills/ux-ui-weapon/` (when forged) — contains the comprehensive design brief, master tokens, glass-and-depth utilities, per-component docs, per-screen docs, and static HTML references. Until the Weapon is formally forged with the Factory pipeline, the Angel draws directly from `library/knowledge-base/ux-ui/`:

- `00-design-brief.md` — master brief (end-to-end target state).
- `01-master-tokens.css` — the token layer.
- `02-glass-and-depth.css` — "glass on beige" utility layer.
- `03-components/*.md` — one doc per component group.
- `04-screens/*.md` — one doc per major screen.
- `05-html-examples/*.html` — static visual references.

## Expected input

- A UI question, design proposal, or review request.
- Screenshots, Figma links, or pointers to code under review.
- The component, screen, or surface in question.

## Expected output

- A definitive recommendation, grounded in the relevant doc in `library/knowledge-base/ux-ui/`.
- If the folder doesn't cover the question, the Angel **updates the folder first**, then answers. No off-the-cuff UI rulings.
- For reviews: specific, file/line-level notes with proposed rewrites of tokens, classes, or component structure.

## Critical directives to respect when routing

- `library/knowledge-base/ux-ui/` is the single source of truth. Expect the Angel to open it first, every time.
- Deviations from the design brief require updating the brief, not routing around it.
- Pixel-perfect consistency is a stated goal. Do not ask this Angel to approve shortcuts.

## Typical failure modes

- Invoked for asset-registry questions (e.g., "how do I register a new DesignToken?") — route to `asset-guardian` instead.
- Invoked for UI work in a repo that has not yet adopted `library/knowledge-base/ux-ui/` — the baked-in design brief won't apply; consider running `design-system-guardian` first to bootstrap the system, or forging a product-specific UI Angel via the Legendary Angel Factory.
- Asked to make a one-off UI decision without updating the doc — the Angel will refuse, and that is correct behavior.

## Orchestration notes

When a new UI lands, orchestrate: `ux-ui-guardian` first (to review or specify), then `asset-guardian` if a catalogged asset was added or changed, then the primary orchestrator implements. After implementation, `security-guardian` → `quality-guardian` close the loop.
