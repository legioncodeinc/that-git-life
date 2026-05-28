# Signup flow

- **Category:** Reference
- **Status:** Canonical
- **Last updated:** 2026-05-23

How TGL orchestrates the affiliate signups across install + first boot. Implements ADR-008.

---

## The signup set

| ID | Label | When required | Affiliate URL constant |
|---|---|---|---|
| `signup-github` | GitHub account | Always | `AFFILIATE_URLS.github` |
| `signup-cloudflare` | Cloudflare account | Always | `AFFILIATE_URLS.cloudflare` |
| `signup-godaddy` | GoDaddy account | Always | `AFFILIATE_URLS.godaddy` |
| `signup-claude-ai` | Claude.ai paid | Always | `AFFILIATE_URLS.claudeAi` |
| `signup-obsidian` | Obsidian (free or paid) | Always | `AFFILIATE_URLS.obsidian` |
| `signup-ide-plan` | Cursor Pro **or** Claude Max | Depends on `settings.ide` | `AFFILIATE_URLS.cursorPro` **or** `AFFILIATE_URLS.claudeMax` |

The set is seeded into the `onboarding_steps` table on first install. Adding a new required service is a one-line schema migration + URL constant.

---

## Phase 1 — During install (CLI)

After all OS-level apps install and `tgl` is on PATH, the install script:

1. Prints a banner:
   ```
   ┌──────────────────────────────────────────┐
   │ Almost done. We need you to sign up for  │
   │ N accounts. We'll open a tab for each.   │
   └──────────────────────────────────────────┘
   ```
2. For each row in `AFFILIATE_URLS`, in order:
   - Print `Opening <Label>...`
   - Call the OS-native browser opener (macOS: `open`; Linux: `xdg-open`; Windows: `Start-Process`).
   - Wait for `<Enter>` before opening the next.
3. After the last tab: print `All tabs opened. Your browser may already have shown the TGL dashboard — finish signups there.`

Users who Ctrl-C out at this stage land safely — the dashboard's blocking checklist (Phase 2) catches them.

---

## Phase 2 — At first boot (web UI)

The onboarding flow's second step (`/onboarding/signups`) renders the blocking checklist:

- Pulls rows from `GET /api/v1/onboarding`. Each row: id, label, url, done flag.
- Renders one row per item with: name + helper copy + "Open signup" button + "I signed up" checkbox.
- Toggling a checkbox calls `POST /api/v1/onboarding/checklist/:id` with `{ done: true|false }`.
- "Continue" button at the bottom is **disabled** until every required row is `done`.
- The button reads: `Continue (signed up: N/N)` so progress is visible.

No skip. No bypass. By design (per ADR-008).

---

## Visual treatment

- Each row has its service's favicon on the left (fetched at build time and bundled to avoid a network dep at runtime).
- Checkbox toggle animates with a gold check via Framer Motion.
- When all rows are checked, the row container plays a single celebratory pulse.

---

## Re-signups

Users can re-open the checklist at `/settings/account` later. Un-checking a row does NOT lock the user out of the rest of the app — but it does flag the row in the dashboard's health indicator until re-checked. This is the only place where account state matters post-onboarding.

---

## Localization

Phase 1 strings are English-only for v1. The web UI is also English-only. Localization is a v2 concern.
