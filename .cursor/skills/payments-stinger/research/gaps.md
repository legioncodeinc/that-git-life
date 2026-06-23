# Gaps

Topics adjacent to this Stinger's scope that are intentionally not covered, with the routing.

| Gap | Owned by | Notes |
|---|---|---|
| Stripe Connect, marketplaces, multi-party flows | Future `connect-worker-bee` | Out of scope for v1. |
| Stripe Issuing, Treasury, Capital, Climate | Out of scope | Different product surfaces. |
| Stripe Terminal / in-person | Out of scope | Different SDK. |
| Database schema, migrations, indexing for payments tables | `db-worker-bee` | This Stinger specifies the columns; db-worker-bee designs the migration. |
| Secret-key rotation, env management, leaked-secret incident response | `security-worker-bee` | This Stinger flags; security-worker-bee audits. |
| PII handling beyond the obvious "don't log it" | `security-worker-bee` | |
| React-side Stripe.js / Elements / EmbeddedCheckout component code | `react-worker-bee` | This Stinger describes the contract; react-worker-bee implements. |
| Payment fraud (Radar rules) | Out of scope v1 | Stripe Radar has its own surface; revisit. |
| Tax engines beyond Stripe Tax | Out of scope v1 | TaxJar, Avalara — separate Bee if needed. |
| Accounting / GL integration (NetSuite, QuickBooks) | Out of scope | Separate Bee if needed. |
| PRD authoring for payments features | `library-worker-bee` | This Stinger implements; library-worker-bee PRDs. |
| Verification of an implementation against a PRD | `quality-worker-bee` | This Stinger hands off. |
