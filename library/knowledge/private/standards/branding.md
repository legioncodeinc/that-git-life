# Branding standard

- **Category:** Standards
- **Status:** Canonical
- **Last updated:** 2026-05-23

This document is the rule of thumb for applying The Notorious Llama brand to TGL's web UI. The full design system spec lives at [`../frontend/design-system.md`](../frontend/design-system.md); this file is the *philosophy*.

---

## 1. The dial

The Notorious Llama brand kit ships with two dials:

- **Notorious Llama** — loud, hip-hop, Anton + cream + gold, personal brand.
- **Claude Design** — operator-minimalist, Inter + bone white + calibration orange.

**TGL uses the Notorious Llama dial.** Always. There is no toggle.

---

## 2. Source of truth

Brand assets live at `/brand` at the repo root. They are copies from `The Notorious Llama/`:

```
brand/
  colors_and_type.css     # design tokens — IMPORT THIS in web/main.tsx
  assets/                 # logo SVGs (primary, light, gold, purple, mono)
  README.md               # brand kit overview
```

The web app imports tokens from `brand/colors_and_type.css` and logo SVGs from `brand/assets/`. **Do not duplicate or hardcode colors in components** — always read from CSS variables.

---

## 3. Core tokens (informal preview)

The exact values live in `brand/colors_and_type.css`. The intent:

| Token | Role |
|---|---|
| `--bg-cream` | Page background. Warm off-white. |
| `--ink-black` | Primary text. |
| `--accent-gold` | The signature gold. Used for primary CTAs, badges, the brand mark. |
| `--accent-purple` | Secondary accent, used sparingly. |
| `--font-display` | Anton — for headers, the brand mark, "loud" copy. |
| `--font-body` | Sans-serif body font (see CSS for exact stack). |

---

## 4. Voice

- **Loud and confident, never apologetic.**
- Short, punchy headers. "Get the git life." "Stay notorious." "That git life."
- Subheaders can be longer but still drop unnecessary words.
- It's okay to be playful. It's never okay to be cute at the user's expense (no "Oopsie!" on error states).
- Use slang sparingly and only where it lands. "Vibe coding," "fam," "no cap" — fine occasionally, never every sentence.

---

## 5. Motion

The brand calls for "animations and clever Notorious Llama styles" (per the brief). Specifics:

- Entrance animations on first-page hero areas — staggered fade + slide-up via Framer Motion.
- Hover states on interactive elements use a subtle scale (1.0 → 1.02) + gold underline reveal.
- Loading states use the llama mark spinning or pulsing — never a generic spinner.
- Reduced motion: respect `prefers-reduced-motion: reduce`. Replace animations with crossfades.

---

## 6. Iconography

- Use Lucide icons (Shadcn default) as the line-style base.
- Brand mark (`brand/assets/notorious-llama-primary.svg` or similar) appears in the top-left of the nav and in empty states.

---

## 7. Empty states

Empty states are not blank screens. Each is:

- A line of brand voice ("Nothing notorious yet. Let's fix that.").
- A relevant CTA ("Scan your first repo", "Standardize this folder").
- The llama mark or N pendant illustration.

---

## 8. Errors

Errors are direct, not jokey:

> Couldn't reach GitHub. Check your PAT in Settings → SSH.

Color: a muted red sourced from the brand palette (defined in `colors_and_type.css`), never raw `#ff0000`.

---

## 9. The "clever" budget

The brief says "clever Notorious Llama styles." Reserve cleverness for:

- The hero / first-load moment.
- Empty states.
- Success confetti on first repo standardized.
- Error states (which stay direct — see §8 — but can carry brand voice).

Day-to-day surfaces (dashboard tables, settings forms) stay calm so the loud moments land.
