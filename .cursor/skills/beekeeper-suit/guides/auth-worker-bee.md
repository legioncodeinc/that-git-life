# Auth Worker Bee - Beekeeper-Suit's Guide

The Beekeeper-Suit routing skill's record of when to invoke `auth-worker-bee`. Use this guide to decide whether a user request belongs to this Bee.

**Bee:** [`.cursor/agents/auth-worker-bee.md`](../../agents/auth-worker-bee.md)
**Stinger:** [`.cursor/skills/auth-stinger/`](../../skills/auth-stinger/)
**Command Brief:** not available (synthesized from agent + stinger files)
**Trigger policy:** on-demand

---

## Domain

auth-worker-bee is the Army's senior identity & access engineer — opinionated about session security, ruthless about least-privilege scopes, and pragmatic about which provider to reach for. It owns the **implementation half** of authentication: provider selection, OAuth flow wiring (with deep Google Auth Platform expertise including the October 2025 unused-client-deletion policy and GIS migration), session-cookie hardening, MFA / passkey enrollment, RBAC enforcement, B2B SSO via WorkOS, and migrations between auth providers. It covers the full provider landscape — Clerk, Better Auth, Auth.js / NextAuth, Supabase Auth, WorkOS, Stack Auth, Kinde, and Stytch. It does not own the audit of the resulting implementation, the React sign-in UI, the users/sessions database schema, or the auth product requirements document.

## Trigger phrases

Route to `auth-worker-bee` when the user says any of:

- "set up auth"
- "pick an auth provider"
- "wire up Google sign-in"
- "Google OAuth verification"
- "set up MFA / passkeys"
- "RBAC for multi-tenant"
- "migrate from NextAuth to Better Auth / Clerk"

Or when the request implicitly involves authentication protocol concerns, provider selection, session security, OAuth scope configuration, or auth migrations in a PR.

## Do NOT route when

- The request is a **security audit** of an already-implemented auth system — that belongs to `security-worker-bee`.
- The request is about building the **React `<SignIn />` / `<UserMenu />` UI** — that belongs to `react-worker-bee`.
- The request is about the **`users` / `sessions` / `accounts` / `roles` database tables or RLS policies** — that belongs to `db-worker-bee`.
- The request is about writing the **auth PRD or product requirements** — that belongs to `library-worker-bee`.

If a request straddles two Bees' domains, prefer the narrower-scoped Bee and let the broader one act as backup.

## Inputs the Bee needs

Before invoking, ensure the user has provided (or you can infer):

- **Use-case classification** — B2C vs B2B; hosted UI vs custom; scope footprint (sign-in only vs Google Workspace data access); jurisdiction constraints.
- **Runtime stack** — Next.js / Remix / Vite / React Router v7 / Express / Fastify; inferred from `package.json` and `.env.example` if not stated.
- **Existing auth setup** — current provider (if any), existing cookie config, existing auth libraries — inferred from the codebase if not stated.
- **Migration source/target** (optional) — only required for migration mode; if absent, the Bee proceeds with a greenfield implementation plan.

## Outputs the Bee produces

- **Provider selection ADR** — `library/architecture/ADR-<n>-auth-<topic>.md` with a filled `templates/provider-comparison-matrix.md`.
- **Implementation task plan** — ordered steps with filled `templates/session-cookie-config.ts`, `templates/rbac-policy-table.md`, and `templates/google-oauth-consent-screen-checklist.md` as applicable.
- **Audit handoff report** — `library/qa/auth/<date>-auth-audit.md` (standalone) or `library/requirements/features/feature-<###>-<title>/reports/<date>-auth-audit.md` (feature-tied), using `templates/audit-report-template.md`, flagged for `security-worker-bee`.
- **Run archive copy** — `reports/YYYY-MM-DD-<slug>.md` inside the stinger.

## Multi-Bee sequences this Bee participates in

- Plan execution loop — always closes with `security-worker-bee` (audit handoff) then `quality-worker-bee` (post-implementation QA).

## Critical directives the orchestrator should respect

- **Least-privilege scopes by default** — every Google scope is a verification cost and a breach surface; the smallest scope set that ships the feature wins.
- **Secure-by-default cookie attributes** — `HttpOnly` + `Secure` + `SameSite=Lax` is the floor; `__Host-` prefix on cross-site flows; `localStorage` for tokens is XSS-readable and never acceptable.
- **Never enforce auth in only one layer** — middleware AND data layer (or row-level security) always; single-layer enforcement is a must-fix blocker.
- **The October 2025 Google OAuth unused-client-deletion policy is load-bearing** — production clients without recent traffic are deleted after 6 months; a synthetic health-call defense is required.
- **Use Google Identity Services (GIS), not legacy `gapi.auth2`** — legacy is deprecated; new clients must adopt GIS.
- **Refresh tokens are bearer secrets** — rotate on use, bind to session ID, revoke on logout / password change / suspicious activity.
- **MFA without recovery is denial-of-service** — recovery codes at enrollment; the recovery flow itself must be MFA-protected.
- **SMS is recovery-only, never primary** — SIM-swap risk makes SMS unacceptable as a primary factor.
- **Auth UI is `react-worker-bee`'s territory** — auth-worker-bee writes the protocol spec, not the JSX.

(Full list lives in the Bee file's `## Critical directives` section.)

---

*Part of Beekeeper-Suit's roster. See [`.cursor/skills/beekeeper-suit/SKILL.md`](../SKILL.md) for the full Army.*
