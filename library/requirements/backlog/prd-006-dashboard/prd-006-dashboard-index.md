# PRD-006: Dashboard

- **Status:** backlog
- **Owner:** Cursor
- **Depends on:** PRD-003 (onboarding done), PRD-004 (standardizer), PRD-005 (scanner)

## 1. Problem

Once onboarded, the user needs a day-to-day dashboard: see the health of their GitHub root, browse repos with quick actions, drill into a repo's findings, change settings, and trigger scans or standardizations on demand. This is the "everything after onboarding" UI.

## 2. Goals

- Single React app continuation from PRD-003 (same Vite project, same brand application).
- Routes per `frontend/page-specs.md`: `/`, `/repos`, `/repos/:id`, `/settings/*`, `/logs`, `/about`.
- Repo inventory: scan the GitHub root for git repos, upsert into the `repos` table.
- Repo actions: scan, standardize, ignore, open in IDE.
- Settings: change root, ignored folders, IDE switch, skills sync toggle, updates.
- Live updates: when a scan/standardize job completes, the UI updates without a manual refresh.

## 3. Non-goals

- Custom theming or a settings UI for it.
- Multi-tab features (e.g., split-pane).
- A mobile breakpoint optimized for phones (we target ≥ 768 px; below that we gracefully degrade).

## 4. User stories

- "As a user, I open the dashboard and see whether my Git life is healthy in one glance."
- "As a user, I drill into a repo with one click and see exactly what's wrong."
- "As a user, I click 'Standardize' on a drifting repo, see the diff, approve, done."
- "As a user, I change my GitHub root and TGL re-discovers all my repos."

## 5. Scope

### In scope

- All non-onboarding pages from `page-specs.md`.
- Repo discovery + inventory upserter on first dashboard visit and on root change.
- Real-time job polling (UI polls `/api/v1/jobs/:id` every 1–2 s while jobs run).
- Keyboard shortcuts per `page-specs.md` §"Keyboard shortcuts".
- Empty states with brand voice per `branding.md`.
- Logs page with live-tail.
- About page with the easter egg.

### Out of scope

- Per-finding auto-fix actions.
- Custom dashboards or saved views.
- Search across findings (just repo name search).

## 6. Acceptance criteria

- [ ] After onboarding, `/` shows the dashboard with KPI tiles and recent activity.
- [ ] `/repos` lists every git repo found under the GitHub root, with ignore toggles persisting.
- [ ] Clicking "Scan" kicks off a job and the row updates with the result when the job finishes (no manual refresh).
- [ ] Clicking "Standardize" opens a diff preview, then a confirm, then runs.
- [ ] `/settings/root` changes the root and re-discovers repos (with a clear "we're scanning" loader).
- [ ] `/settings/ignored` toggles persist and exclude ignored folders from future discovery.
- [ ] `/settings/skills` shows installed skills and the last-synced timestamp.
- [ ] `/logs` tails the service log with level filtering.
- [ ] `/about` shows the version and includes the keyboard easter egg.
- [ ] All pages render correctly in the Notorious Llama dial (Anton headers, cream bg, gold accents).
- [ ] Keyboard shortcuts work (`?`, `g d`, `g r`, `g s`, `/`, `s`).

## 7. File-level deliverables

- `src/web/pages/dashboard.tsx`
- `src/web/pages/repos/list.tsx`
- `src/web/pages/repos/detail.tsx`
- `src/web/pages/settings/account.tsx`
- `src/web/pages/settings/root.tsx`
- `src/web/pages/settings/ignored.tsx`
- `src/web/pages/settings/skills.tsx`
- `src/web/pages/settings/updates.tsx`
- `src/web/pages/logs.tsx`
- `src/web/pages/about.tsx`
- `src/web/components/RepoRow.tsx`
- `src/web/components/HealthDot.tsx`
- `src/web/components/FindingCard.tsx`
- `src/web/components/EmptyState.tsx`
- `src/web/hooks/useJob.ts` — polls `/api/v1/jobs/:id` until complete.
- `src/web/hooks/useKeyboardShortcuts.ts`
- `src/service/routes/repos.routes.ts` — list, detail, discover, ignore, scan, standardize.
- `src/service/services/repo-inventory.service.ts` — discover repos under a root.

## 8. Sequenced steps

1. Build the `AppShell`, `Nav`, `PageHeader`, `Container` primitives per `design-system.md`.
2. Implement `repo-inventory.service.ts` and `/api/v1/repos` routes.
3. Build the dashboard page with KPI tiles + recent activity.
4. Build `/repos` list with discovery + ignore.
5. Build `/repos/:id` detail with the three tabs.
6. Build the settings pages.
7. Build `/logs` + `/about` (including the easter egg).
8. Wire keyboard shortcuts.
9. Write Vitest + Testing Library tests for each page.
10. Write the QA artifact at `qa/prd-006-dashboard-qa.md`.

## 9. Risks

| Risk | Mitigation |
|---|---|
| Repo discovery walks deeply nested node_modules. | Skip dirs named `node_modules`, `.git` (subdirs), `vendor`, `target`, etc. |
| Polling at 1 s × N jobs strains the loop. | Cap concurrent polls; back off when no progress in 5 s. |
| Some repos lack a `main` branch (use `master` or other). | Detect default branch via `git symbolic-ref refs/remotes/origin/HEAD`. |

## 10. References

- `library/knowledge/private/frontend/page-specs.md`
- `library/knowledge/private/frontend/design-system.md`
- `library/knowledge/private/standards/branding.md`
- `library/knowledge/private/service/api-contract.md`
