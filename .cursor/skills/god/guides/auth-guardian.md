# Guide: auth-guardian

End-to-end authentication implementation specialist — provider selection, OAuth flows (especially Google's, including the October 2025 unused-client-deletion policy), MFA / passkeys, RBAC, session storage, and B2B SSO.

---

## What this Angel owns

`auth-guardian` is the implementation half of authentication. It owns the protocol layer, the provider integration, the session hardening, the RBAC enforcement, and the migration paths between providers. Its territory:

- **Provider selection** — Clerk (best prebuilt UX), Better Auth (OSS, hot in 2026), Auth.js v5 (Next.js default OSS), Supabase Auth (when on Supabase), WorkOS (enterprise SSO/SAML/SCIM), Stack Auth, Kinde, Stytch.
- **Google OAuth deep work** — Google Auth Platform (Branding / Audience / Data Access), least-privilege scopes, sensitive-vs-restricted verification (demo video, CASA security assessment), domain verification, **the October 2025 unused-client-deletion policy** with synthetic-call defenses, GIS migration off legacy `gapi.auth2`.
- **Token & session strategy** — access vs refresh vs ID tokens, JWT vs opaque sessions, secure cookie attributes (`HttpOnly`, `Secure`, `SameSite`, `__Host-` prefix), CSRF defense, refresh-token rotation with reuse detection.
- **MFA** — TOTP (RFC 6238), WebAuthn / passkeys (W3C Level 3), SMS as recovery-only (SIM-swap), magic links with single-use semantics, recovery codes at enrollment.
- **RBAC** — roles, permissions, ABAC, multi-tenancy with row-level security, **two-layer enforcement** (middleware AND data layer / RLS).
- **Service-to-service** — Google service accounts, JWT bearer flows, Workload Identity Federation, Cross-Account Protection (RISC).
- **Common failure modes** — session fixation, OAuth callback CSRF, redirect URI confusion, fragment-leak in implicit flow, scope creep, ID-token signature skips.
- **Migration paths** — moving between providers without forcing all users to log in again (dual-write windows, identity-preserving cutovers).

It does not own: the React `<SignIn />` JSX (`react-guardian`), the `users` / `sessions` schema (`db-guardian`), the security audit of the resulting implementation (`security-guardian`), or the auth PRD (`library-guardian`).

## When to invoke

Delegate to `auth-guardian` when the user:

- Says "set up auth", "pick an auth provider", "Clerk vs Better Auth", or starts a greenfield project that needs sign-in.
- Says "wire up Google sign-in" or asks about Google OAuth scopes, verification, the deletion policy, or GIS migration.
- Asks for an MFA / passkey strategy, recovery-flow design, or magic-link implementation.
- Asks for RBAC modeling, multi-tenant authorization, or row-level security policy design (which auth-guardian flags to `db-guardian`).
- Asks to migrate between providers (NextAuth → Better Auth, Auth.js → Clerk, Clerk → self-host).
- Asks about session cookie attributes, JWT vs opaque sessions, or refresh-token rotation.

Do **not** invoke for the React form JSX, button placement, or auth-page layout — that's `react-guardian`'s domain.

Do **not** invoke for the `users` / `sessions` / `accounts` table migrations — that's `db-guardian`. auth-guardian flags the requirements.

Do **not** invoke for the post-implementation security audit — that's `security-guardian`. auth-guardian implements; security-guardian audits.

Do **not** invoke before the auth PRD lands — that's `library-guardian`. auth-guardian implements once the PRD is written.

## Paired Weapon

`.cursor/skills/auth-weapon/` — contains the master index (SKILL.md) with invocation modes and severity rubric, 12 guides covering principles, the provider decision tree, four provider deep-dives, the Google OAuth + verification deep dives, MFA / passkeys, RBAC, session storage, and the common-failure-modes catalog; 6 templates (provider matrix, consent-screen checklist, scope justification, cookie config, RBAC table, audit handoff); 2 deterministic scripts (`validate-oauth-scopes.ts`, `cookie-attribute-checker.ts`); 3 worked examples (B2C Clerk + Google OAuth, B2B WorkOS SSO, Better Auth from scratch); and the dated research trail.

## Expected input

- The codebase or feature branch under review, plus the runtime stack (Next.js / Remix / Vite / RR v7 / Express / Fastify).
- The use case: B2C SaaS, B2B, internal tool, mobile / native, CLI.
- The existing provider (if migrating) and the constraint that triggered the migration.
- Access to: `package.json`, `.env.example`, existing auth code, the Google Cloud Console project (when relevant), the database schema for auth tables.

## Expected output

- **Provider decision report**: the tree walked, the chosen provider, the named alternative if constraints shift, next-step task list. Cite `templates/provider-comparison-matrix.md`.
- **Implementation plan**: ordered task list — provider account, OAuth client config, callback route, session middleware, RBAC tables, MFA enrollment flow, recovery flow.
- **Google OAuth verification packet**: filled `templates/google-oauth-consent-screen-checklist.md` and `templates/scope-justification-template.md`; demo-video shot list; flag if security assessment is required.
- **Session config**: filled `templates/session-cookie-config.ts` for the runtime; cookie-attribute lint via `scripts/cookie-attribute-checker.ts`.
- **RBAC plan**: filled `templates/rbac-policy-table.md` with roles, permissions, and two-layer enforcement plan; schema requirements flagged for `db-guardian`.
- **Migration plan** (when applicable): phased plan with no forced re-login (dual-write window + cutover).
- **Audit handoff**: filled `templates/audit-report-template.md` listing every security-adjacent decision for `security-guardian` to verify.
- **Reports**: written into the host repo's `library/` tree (standalone: `library/qa/auth/<date>-<topic>.md`; feature-tied: `library/requirements/features/feature-<###>-<title>/reports/<date>-<type>-report.md`; issue-tied: `library/requirements/issues/issue-<###>-<title>/reports/<date>-<type>-report.md`) following `templates/run-report-template.md`.

## Critical directives to respect when routing

- **Least-privilege scopes are mandatory.** The orchestrator should not ask auth-guardian to "request whatever Google scopes might be useful". Specify the feature; auth-guardian picks the smallest scope set.
- **The October 2025 Google OAuth unused-client-deletion policy is load-bearing.** Production-critical OAuth clients need a synthetic call OR a runbook entry. The orchestrator should not skip this when handing off Google OAuth implementation.
- **Two-layer enforcement is non-negotiable.** Tenant-scoped or owner-scoped resources are enforced in middleware AND in the data layer. The orchestrator should not approve a "we'll add the data-layer check later" answer.
- **Auth-guardian flags schema, doesn't write it.** The `users` / `sessions` / `accounts` migration goes to `db-guardian` after auth-guardian flags the requirements.
- **Auth-guardian writes specs, not JSX.** The `<SignIn />` page goes to `react-guardian` after auth-guardian writes the layout spec.
- **Auth-guardian implements, doesn't audit.** Once auth-guardian has produced an implementation, the orchestrator should hand the audit to `security-guardian`.

## Typical failure modes

- **Invoked before the auth PRD lands** — auth-guardian will produce a decision but flag that the PRD belongs to `library-guardian`.
- **Invoked for a security audit of an existing implementation** — auth-guardian will redirect to `security-guardian` (audit) and offer to do a re-implementation review (which is its territory).
- **Invoked for the React `<SignIn />` UI** — auth-guardian will produce the spec and hand JSX to `react-guardian`.
- **Invoked for `users` schema design without context** — auth-guardian will produce the schema requirements and hand them to `db-guardian`.
- **Invoked for "audit our auth"** without scope — auth-guardian will ask for clarification: provider-selection / implementation review / Google OAuth / migration.

## Orchestration notes

In the standard implementation loop: **library-guardian (PRD) → db-guardian (schema) → auth-guardian (implementation) → react-guardian (UI) → security-guardian (audit) → quality-guardian (QA)**.

For a greenfield project, auth-guardian runs after library-guardian's auth PRD and in parallel with db-guardian's schema migration (auth-guardian flags requirements; db-guardian writes the SQL). Once auth-guardian's implementation is in place, security-guardian audits the protocol layer (CSRF, cookie attributes, refresh rotation, two-layer enforcement) before quality-guardian verifies functional correctness.

For a Google OAuth-specific request, auth