# God Guide — modal-toast-dialog-guardian

The God routing skill's record of when to invoke `modal-toast-dialog-guardian`. Use this guide to decide whether a user request belongs to this Angel.

**Angel:** [`ai-tools/agents/modal-toast-dialog-guardian.md`](../../agents/modal-toast-dialog-guardian.md)
**Weapon:** [`ai-tools/skills/modal-toast-dialog-weapon/`](../../skills/modal-toast-dialog-weapon/)
**Command Brief:** [`ai-tools/command-briefs/modal-toast-dialog-guardian-command-brief.md`](../../../command-briefs/modal-toast-dialog-guardian-command-brief.md)
**Trigger policy:** proactive

---

## Domain

`modal-toast-dialog-guardian` owns the accessible overlay surface of a React application: modals, alert dialogs, drawers/sheets, toasts/snackbars, and command menus. It selects the right primitive from the 2026 React ecosystem (Radix Dialog, Radix AlertDialog, Vaul Drawer, Sonner, cmdk), enforces the six-point accessible-modal contract (focus trap, Escape, scroll lock, `aria-modal`, `aria-labelledby`, focus return), and applies the four-tier toast-vs-notification taxonomy to prevent UX failures like ephemeral toasts masking destructive confirmations.

## Trigger phrases

Route to `modal-toast-dialog-guardian` when the user says any of:

- "Which overlay primitive should I use?"
- "My focus trap isn't working"
- "Should this be a toast or a dialog?"
- "Set up Sonner in Next.js"
- "Build a Vaul drawer with snap points"
- "Add a command palette to my app"
- "Audit our modal accessibility"
- "The drawer isn't scrolling inside"
- "Is this an AlertDialog or a Dialog?"
- "Wire up cmdk"

Or when the request implicitly involves overlay components, toast notifications, confirmation dialogs, or command menus in a React project.

## Do NOT route when

- The user asks about design tokens, colors, or animation values for overlays (route to `ux-ui-guardian`).
- The user asks about general React component architecture or state management that happens to involve a dialog (route to `react-guardian`).
- The overlay gates a destructive, irreversible, or privilege-escalating action and needs a security audit (route to `security-guardian` after `modal-toast-dialog-guardian` has implemented it).
- The user asks about a notification center / persistent activity tray with session persistence (out of scope for this Angel; handle inline or forge a new Angel).

If a request straddles `modal-toast-dialog-guardian` and `ux-ui-guardian` (e.g., "build a dialog and make it animate correctly"), prefer `modal-toast-dialog-guardian` for the primitive wiring and defer the animation values to `ux-ui-guardian`.

## Inputs the Angel needs

Before invoking, ensure the user has provided (or you can infer):

- The overlay type (dialog, drawer, toast, command menu, or compound).
- The React framework context (Next.js App Router vs Pages Router; Tailwind vs CSS modules).
- Which overlay packages are already installed, if any.
- Whether the overlay gates a destructive action (determines Dialog vs AlertDialog choice).
- For audit requests: file paths or PR diff for the overlay components.

If the overlay type is unclear, ask before invoking — the taxonomy decision is the first step in the procedure.

## Outputs the Angel produces

- **Primary:** Implemented or refactored overlay component code in chat (or on disk if the user requests a file).
- **Audit report:** Filled-in `templates/overlay-audit-report.md` at `docs/qa/<branch>-overlay-audit.md` for audit requests.
- **Accessibility checklist:** The six-point checklist from `guides/01-accessible-modal-contract.md`, verified for each audited overlay.

## Multi-Angel sequences this Angel participates in

- **Plan execution loop** — `modal-toast-dialog-guardian` implements the overlay; `security-guardian` audits if the overlay gates sensitive/destructive actions; `quality-guardian` verifies against the plan.
- **Design system bring-up** — after `design-system-guardian` or `ux-ui-guardian` establishes motion tokens, `modal-toast-dialog-guardian` wires the overlay primitives to target the canonical `data-[state=open]` / `data-[state=closed]` attributes.
- **React architecture review** — `react-guardian` reviews the component tree; `modal-toast-dialog-guardian` handles any overlay-specific concerns surfaced by that review.

## Critical directives the orchestrator should respect

- Always mount overlays in a portal outside the app root (never inside scroll containers or stacking contexts).
- Never allow a hand-rolled focus trap implementation to pass; redirect to the primitive's built-in trap.
- Apply the taxonomy before recommending a primitive — toast is never the right choice for a destructive confirmation.
- Validate focus return on close before declaring done — the most common overlay accessibility regression.

(Full list lives in the Angel file's `## Critical directives` section.)

---

*Part of God's roster. See [`ai-tools/skills/god/SKILL.md`](../SKILL.md) for the full Army.*
