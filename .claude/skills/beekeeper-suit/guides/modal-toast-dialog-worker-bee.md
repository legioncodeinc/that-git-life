# Modal Toast Dialog Worker Bee - Beekeeper-Suit's Guide

The Beekeeper-Suit routing skill's record of when to invoke `modal-toast-dialog-worker-bee`. Use this guide to decide whether a user request belongs to this Bee.

**Bee:** [`.cursor/agents/modal-toast-dialog-worker-bee.md`](../../agents/modal-toast-dialog-worker-bee.md)
**Stinger:** [`.cursor/skills/modal-toast-dialog-stinger/`](../../skills/modal-toast-dialog-stinger/)
**Command Brief:** not available (synthesized from agent + stinger files)
**Trigger policy:** on-demand

---

## Domain

`modal-toast-dialog-worker-bee` owns the accessible overlay surface in React applications: alert dialogs, confirmation dialogs, drawers/sheets, toasts, command menus, and the focus + scroll + ARIA contract they all share. It selects the right primitive for every overlay need — Radix Dialog, AlertDialog, Vaul Drawer, Sonner toast, cmdk command menu, or Headless UI — wires it correctly (portal, focus trap, keyboard), and validates the result against the six-point accessible-modal contract and the four-tier toast-vs-notification taxonomy. It does not own design tokens or animation values, general React component architecture, or security audits of overlays that gate destructive or sensitive actions. The Bee produces the wired overlay component and hands off to `ux-ui-worker-bee` for animation and `security-worker-bee` for audits of irreversible-action gates.

## Trigger phrases

Route to `modal-toast-dialog-worker-bee` when the user says any of:

- "Which primitive should I use for this dialog?"
- "My focus trap isn't working"
- "Should this be a toast or a dialog?"
- "How do I set up Sonner in Next.js App Router?"
- "Build me a command palette"
- "Audit our overlay accessibility"
- "The drawer isn't scrolling inside"

Or when the request implicitly involves choosing or implementing an overlay (modal, toast, drawer, sheet, alert dialog, command menu) in a React application.

## Do NOT route when

- The request is about design tokens, animation values, or motion for overlays — route to `ux-ui-worker-bee` instead.
- The request is about general React component architecture or state management — route to `react-worker-bee` instead.
- The overlay gates a destructive, irreversible, or privilege-escalating action and a security audit is the primary ask — route to `security-worker-bee` instead.

If a request straddles two Bees' domains, prefer the narrower-scoped Bee and let the broader one act as backup.

## Inputs the Bee needs

Before invoking, ensure the user has provided (or you can infer):

- The overlay type or scenario (modal, toast, drawer, alert dialog, command palette, etc.)
- The React framework in use (Next.js App Router, Vite, CRA, etc.) — needed to apply Vaul `"use client"` and Sonner provider placement correctly
- Whether the overlay guards a destructive or irreversible action — determines AlertDialog vs Dialog and escalation to `security-worker-bee`
- Existing primitive already in use (optional — defaults to recommending from the canonical selection matrix if absent)

## Outputs the Bee produces

- Wired overlay component code (inline in the response or as a new file) implementing the selected primitive with full accessible-modal contract compliance
- Overlay audit report using `templates/overlay-audit-report.md` for audit requests, covering primitive selection, accessible-modal checklist, taxonomy table, stacking checklist, findings, and next steps

## Multi-Bee sequences this Bee participates in

- Plan execution loop — always closes with `security-worker-bee` then `quality-worker-bee`
- Overlay implementation handoff — `modal-toast-dialog-worker-bee` wires the component → `ux-ui-worker-bee` authors animation values targeting `data-[state=open]` / `data-[state=closed]` attributes

## Critical directives the orchestrator should respect

- Always mount overlays in a portal outside the app root — overlays inside scroll containers or stacking contexts produce z-index and scroll-lock failures that are nearly impossible to debug after the fact.
- Never allow or suggest re-implementing the focus trap — every hand-rolled focus trap has edge cases (Shadow DOM, iframes, dynamically rendered content) that the Radix / Headless UI implementations already handle.
- Apply the toast-vs-notification taxonomy before recommending any primitive — ephemeral toasts masking destructive confirmations are a critical UX failure that passes QA but damages users.
- Validate keyboard navigation and focus return before declaring done — the most common overlay accessibility regression is forgetting to return focus to the trigger element on close.
- Escalate and stop if the overlay guards a destructive or privilege-escalating action and `security-worker-bee` has not yet audited it.

(Full list lives in the Bee file's `## Critical directives` section.)

---

*Part of Beekeeper-Suit's roster. See [`.cursor/skills/beekeeper-suit/SKILL.md`](../SKILL.md) for the full Army.*
