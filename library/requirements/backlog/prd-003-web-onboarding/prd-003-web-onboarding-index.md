# PRD-003: Web onboarding

- **Status:** backlog
- **Owner:** Cursor
- **Depends on:** PRD-002 (service core must exist)

## 1. Problem

On first boot, the user lands at `http://localhost:3050` and needs to be walked through: signups checklist (blocking), GitHub root folder selection, GitHub PAT entry, SSH key generation + auto-upload, and initial skills bootstrap. The flow is the user's first impression of TGL — it must be polished, loud, and on-brand.

## 2. Goals

- A 7-step onboarding flow that cannot be skipped (per ADR-008).
- Native folder picker for the GitHub root selection step.
- Auto-upload of the SSH public key to GitHub via the user's PAT (per ADR-009).
- Onboarding state persisted in SQLite; survives mid-flow browser close.
- Notorious Llama brand application throughout (loud dial — Anton, cream, gold).

## 3. Non-goals

- Dashboard, settings, or any post-onboarding page (PRD-006).
- Multi-user onboarding (single-user product).
- Account verification beyond user self-report (no OAuth, no API calls to confirm).

## 4. User stories

- "As a new user, I'm walked through every required setup step with zero ambiguity."
- "As a new user, if I close the browser mid-flow, I resume at the same step."
- "As a new user, I never have to copy/paste an SSH key — it just appears on my GitHub account."

## 5. Scope

### In scope

- React + Vite + Tailwind + Shadcn web app scaffold.
- Notorious Llama branding (Anton, cream/gold tokens, motion).
- Routes per `library/knowledge/private/frontend/page-specs.md` §"Onboarding".
- Backend endpoints under `/api/v1/onboarding/*` per the API contract.
- Native folder picker (per OS): a small Node helper that opens `osascript -e ...` (macOS), PowerShell `OpenFileDialog` (Windows), or `zenity` / `kdialog` (Linux fallback).
- SSH key generation (`ssh-keygen -t ed25519 -f <github-root>/.ssh-keys/id_ed25519_tgl -N ''`).
- Octokit-based `POST /user/keys`.
- `~/.ssh/config` append with a `Host github.com` block (per ADR-009).
- Onboarding-complete flag flips `settings.onboarding_complete` to `1`.

### Out of scope

- Re-running onboarding (`tgl reset` covers it).
- Settings page that re-renders the checklist (PRD-006).

## 6. Acceptance criteria

- [ ] Visiting `/` when `onboarding_complete = 0` redirects to `/onboarding/welcome`.
- [ ] Visiting `/onboarding/*` when `onboarding_complete = 1` redirects to `/`.
- [ ] The signups checklist's "Continue" button is disabled until every required item is checked.
- [ ] Checklist toggles persist; refreshing the page restores state.
- [ ] The folder picker opens a native dialog on each OS and returns an absolute path.
- [ ] PAT validation hits `GET /user` via Octokit; invalid tokens show the GitHub error inline.
- [ ] SSH key generation writes to `<github-root>/.ssh-keys/` with correct file modes.
- [ ] The public key is uploaded to GitHub with title `that-git-life — <hostname>`.
- [ ] `~/.ssh/config` gets a clearly-labeled `Host github.com` block added.
- [ ] The skills step triggers PRD-009's bundled-install + first remote sync.
- [ ] Step 7 plays confetti and exposes a "Go to dashboard" CTA.
- [ ] Onboarding survives a hard refresh at every step.

## 7. File-level deliverables

- `src/web/main.tsx` — Vite entry, brand CSS import.
- `src/web/app.tsx` — router + auth-handshake wrapper.
- `src/web/styles/global.css` — resets + brand helper classes.
- `src/web/pages/onboarding/*.tsx` — one per step (welcome, signups, root, pat, ssh, skills, done).
- `src/web/components/onboarding/StepShell.tsx` — shared layout (progress bar, prev/next).
- `src/web/components/ChecklistRow.tsx` — signup row component.
- `src/web/lib/api.ts` — typed client over `fetch` + token handshake.
- `src/web/lib/motion.ts` — shared Framer Motion variants.
- `src/service/routes/onboarding.routes.ts` — every `/api/v1/onboarding/*` route.
- `src/service/services/onboarding.service.ts` — business logic (PAT validation, SSH gen, key upload).
- `src/service/services/folder-picker.ts` — OS-native folder dialog.
- `src/service/db/migrations/0002-onboarding-seed.sql` — seeds `onboarding_steps`.

## 8. Sequenced steps

1. Scaffold the React app under `src/web/`, wire Vite to output to `src/service/public/`.
2. Build `StepShell`, `ChecklistRow`, and the routing skeleton.
3. Implement `/api/v1/onboarding` GET + checklist toggle POST; seed the checklist via the new migration.
4. Wire up the signups page; verify the blocking-continue behavior.
5. Implement the folder picker + the root step.
6. Implement PAT capture + validation; store via keytar.
7. Implement SSH key generation + GitHub upload + `~/.ssh/config` write.
8. Implement the skills step (which calls into PRD-009's API once that ships, or stubs the call for now).
9. Implement the done step with confetti.
10. Write tests for each onboarding service method (unit + integration).
11. Write the QA artifact at `qa/prd-003-web-onboarding-qa.md`.

## 9. Risks

| Risk | Mitigation |
|---|---|
| The folder picker is unreliable on Linux without zenity/kdialog. | Fall back to a text input pre-populated with `~/GitHub` and clear instructions. |
| GitHub API returns 422 when the key title already exists. | Detect, ask user to delete the existing key, retry. |
| User pastes a PAT without the required scopes. | Pre-flight check the scopes with `GET /user/installations` or rate-limit endpoint; surface a clear scope list. |
| ssh-keygen not on PATH (rare on Windows). | Detect missing, instruct the user to install GitHub CLI / Git for Windows. |

## 10. References

- ADR-008, ADR-009.
- `library/knowledge/private/frontend/page-specs.md`
- `library/knowledge/private/frontend/design-system.md`
- `library/knowledge/private/installers/signup-flow.md`
