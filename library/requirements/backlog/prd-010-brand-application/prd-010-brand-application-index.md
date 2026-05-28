# PRD-010: Brand application — full Notorious Llama dial

- **Status:** backlog
- **Owner:** Cursor
- **Depends on:** PRD-003 + PRD-006 (the UI surfaces exist), PRD-002 (service serves the assets)

## 1. Problem

TGL's web UI must feel unmistakably Notorious Llama — loud, hip-hop, Anton headlines on cream backgrounds with gold accents, motion that punches, empty states with voice. The other PRDs build the screens; this PRD makes sure they *land* with the brand. It is the explicit "polish + brand love" pass.

## 2. Goals

- Every page in the app applies the Notorious Llama dial per `branding.md` and `design-system.md`.
- The hero/onboarding/empty-state/success moments are loud and on-voice; day-to-day surfaces are calm.
- Animations are present, tasteful, and respect `prefers-reduced-motion`.
- Brand assets ship from `brand/` at repo root (no duplicated copies in `src/web/`).
- A pass over every screen confirms typography ramp, color tokens, focus states, and empty states.

## 3. Non-goals

- A second dial (Claude Design).
- A theme toggle.
- Dark mode beyond the `prefers-color-scheme: dark` token set (no in-app switch).

## 4. User stories

- "As a new user, the first 30 seconds in TGL feel like opening a Notorious Llama record sleeve."
- "As a returning user, the dashboard is calm and fast, not visually noisy."
- "As an accessibility user, animations don't make me motion-sick and contrast is fine."

## 5. Scope

### In scope

- Audit every page against `design-system.md` and `branding.md` and fix gaps.
- Implement the keyboard easter egg on `/about` (G I T L I F E).
- Implement confetti on onboarding done + first-repo-standardized.
- Implement the loading-spinner llama-mark animation.
- Implement the gold underline reveal on primary CTAs.
- Implement the entrance stagger on hero areas.
- Replace every default Shadcn class that conflicts with brand tokens.

### Out of scope

- New page templates.
- Net-new features.
- Mobile-specific UX (we target ≥ 768 px).

## 6. Acceptance criteria

- [ ] No hex codes appear in any `.tsx` component (lint rule passes).
- [ ] Every page uses `font-display` for headers and `font-body` for body copy.
- [ ] Every primary CTA is `bg-ink text-cream` with a gold hover underline.
- [ ] Every empty state uses the `<EmptyState />` component with brand voice copy.
- [ ] Every loading state uses the llama-mark spinner.
- [ ] All animations respect `prefers-reduced-motion: reduce`.
- [ ] WCAG AA color contrast passes for every text/background combo (audited via a Vitest a11y test).
- [ ] The G-I-T-L-I-F-E easter egg works on `/about`.
- [ ] Confetti plays on onboarding step 7 and on the first-ever standardize success.
- [ ] Lighthouse Performance ≥ 90 on the dashboard.

## 7. File-level deliverables

- Pass over every file in `src/web/pages/` and `src/web/components/` — no new files except:
- `src/web/components/Confetti.tsx`
- `src/web/components/LlamaSpinner.tsx`
- `src/web/lib/easter-egg.ts`
- `src/web/styles/brand-overrides.css` — minimal extra CSS where Tailwind isn't enough.
- ESLint rule: ban literal hex colors in `src/web/`.

## 8. Sequenced steps

1. Stand up the lint rule banning hex codes; fix violations across the codebase.
2. Implement `LlamaSpinner` and replace all loading spinners.
3. Implement `Confetti` and wire it into the two success moments.
4. Audit each page; tighten typography, colors, motion to the design system.
5. Implement the easter egg.
6. Run the a11y contrast test; fix any violations.
7. Run Lighthouse; fix any perf regressions.
8. Capture before/after screenshots in the QA artifact.
9. Write the QA artifact at `qa/prd-010-brand-application-qa.md`.

## 9. Risks

| Risk | Mitigation |
|---|---|
| Anton at small sizes hurts readability. | Anton is for ≥ `text-lg`. Forbid `font-display` on `text-sm`/`text-xs` via convention. |
| Confetti library bloat. | Use a tiny inline canvas confetti (~5 KB). No new heavy deps. |
| Motion fatigue on day-to-day surfaces. | Strict budget: motion lives in hero/empty/success only (per `branding.md` §9). |

## 10. References

- ADR-001 (Framer Motion + Shadcn + Tailwind).
- `library/knowledge/private/standards/branding.md`
- `library/knowledge/private/frontend/design-system.md`
- `library/knowledge/private/frontend/page-specs.md`
- `brand/` at repo root.
