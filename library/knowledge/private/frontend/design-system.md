# Frontend design system

- **Category:** Reference
- **Status:** Canonical
- **Last updated:** 2026-05-23

How the Notorious Llama brand becomes a React component library inside TGL's web UI. Pairs with the rule-of-thumb document at [`../standards/branding.md`](../standards/branding.md).

---

## 1. Source of truth

All visual tokens come from `brand/colors_and_type.css` at the repo root. The web app imports this file once in `src/web/main.tsx`:

```ts
import '../../brand/colors_and_type.css';
import './styles/global.css';
```

`global.css` is short — just resets, `body` defaults, and a few utility classes that wrap brand tokens. **No hex codes in components.** All color access goes through CSS variables.

---

## 2. Tailwind configuration

`tailwind.config.ts`:

```ts
import type { Config } from 'tailwindcss';

export default {
  content: ['./src/web/**/*.{ts,tsx,html}'],
  theme: {
    extend: {
      colors: {
        cream:  'var(--bg-cream)',
        ink:    'var(--ink-black)',
        gold:   'var(--accent-gold)',
        purple: 'var(--accent-purple)',
        muted:  'var(--ink-muted)',
        danger: 'var(--accent-danger)',
        success:'var(--accent-success)',
      },
      fontFamily: {
        display: 'var(--font-display)',
        body:    'var(--font-body)',
        mono:    'var(--font-mono)',
      },
      borderRadius: {
        brand: '6px',
      },
      boxShadow: {
        brand: '0 1px 0 var(--ink-black), 0 4px 12px rgba(0,0,0,0.06)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config;
```

The actual variable values come from `brand/colors_and_type.css`. Components style against the Tailwind classes (`bg-cream`, `text-ink`, `font-display`).

---

## 3. shadcn/ui setup

We use shadcn/ui as a copy-in component base. Components live at `src/web/components/ui/<name>.tsx` and are restyled to the brand:

- `Button` — primary variant is `bg-ink text-cream` with gold hover underline; gold variant is `bg-gold text-ink`.
- `Card` — `bg-white border-2 border-ink rounded-brand shadow-brand`.
- `Input`, `Select`, `Checkbox` — restyled to use `border-ink`, focus-ring `gold`.
- `Toast` — gold background for success, danger for error, ink for neutral.
- `Tabs`, `Dialog`, `Sheet`, `DropdownMenu` — shadcn defaults with brand colors.

Don't ship a component until it works in both default and `prefers-color-scheme: dark` modes. The dark mode for TGL uses an inverted token set defined in `brand/colors_and_type.css`.

---

## 4. Typography ramp

| Class | Use |
|---|---|
| `text-4xl font-display tracking-tight` | Hero headlines. |
| `text-2xl font-display` | Page titles. |
| `text-lg font-display` | Section titles. |
| `text-base font-body` | Body copy. |
| `text-sm font-body text-muted` | Captions, metadata. |
| `text-xs font-mono` | Code, paths, IDs. |

Anton (`font-display`) is loud and condensed. Use it for headers and brand moments only — never for body copy.

---

## 5. Motion library

Use Framer Motion. Three reusable variants live in `src/web/lib/motion.ts`:

```ts
export const fadeInUp = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
  exit:    { opacity: 0, y: -8, transition: { duration: 0.2 } },
};

export const staggerChildren = {
  animate: { transition: { staggerChildren: 0.06 } },
};

export const hoverScale = {
  rest:  { scale: 1 },
  hover: { scale: 1.02, transition: { duration: 0.15 } },
};
```

Hero areas use `fadeInUp` + `staggerChildren`. Cards and buttons use `hoverScale`. Reduced-motion users get the crossfade fallback (handled by a global `prefers-reduced-motion` listener in `App.tsx`).

---

## 6. Iconography

- Lucide icons via `lucide-react`. Default stroke `2`, size `20`.
- Brand mark from `brand/assets/notorious-llama-primary.svg`. Always rendered inline (via `?react` Vite import) so it inherits `currentColor`.
- N pendant for empty states from `brand/assets/n-pendant.svg`.

---

## 7. Layout primitives

```tsx
<AppShell>
  <Nav />
  <main>
    <PageHeader title="Repositories" />
    <Container>{children}</Container>
  </main>
</AppShell>
```

- `AppShell` — sets `bg-cream text-ink min-h-screen font-body`.
- `Nav` — top bar with brand mark left, settings/help right; sticks on scroll.
- `Container` — `max-w-6xl mx-auto px-6 py-8`.
- `PageHeader` — title + optional subtitle + actions.

---

## 8. Reusable patterns

| Pattern | Component | Notes |
|---|---|---|
| Repo list row | `<RepoRow />` | Path, health dot, last scan, "Scan" + "Standardize" actions. |
| Health dot | `<HealthDot status="green|yellow|red" />` | 8px circle in brand colors. |
| Finding card | `<FindingCard />` | Severity badge + message + repo link + "Open file" link. |
| Empty state | `<EmptyState illustration="n-pendant" title copy ctaLabel onCta />` | Required for any list/page that may be empty. |
| Checklist row | `<ChecklistRow />` | Used in onboarding signup checklist. |
| Code block | `<CodeBlock language="bash">…</CodeBlock>` | Mono font, dark ink background, gold caret. |

---

## 9. Accessibility

- All interactive elements have visible focus rings (`focus-visible:ring-2 ring-gold`).
- Color contrast meets WCAG AA against the cream background.
- Animations respect `prefers-reduced-motion`.
- Modal dialogs trap focus (shadcn's `Dialog` already does this).
- Form errors are read by screen readers via `aria-describedby`.

---

## 10. Don'ts

- Don't introduce new top-level colors. Pick from the existing palette.
- Don't change Anton's letter spacing per-instance. Tracking is fixed at the typography ramp.
- Don't add a global dark-mode toggle. TGL respects the OS preference; there's no in-app switcher.
- Don't add icon libraries beyond Lucide.
- Don't import from `node_modules/@radix-ui` directly — use the shadcn wrapper.
