# Gaps

Topics adjacent to this Weapon's scope that are intentionally not covered, with the routing.

| Gap | Owned by | Notes |
|---|---|---|
| Stripe Connect, marketplaces, multi-party flows | Future `connect-guardian` | Out of scope for v1. |
| Stripe Issuing, Treasury, Capital, Climate | Out of scope | Different product surfaces. |
| Stripe Terminal / in-person | Out of scope | Different SDK. |
| Database schema, migrations, indexing for payments tables | `db-guardian` | This Weapon specifies the columns; db-guardian designs the migration. |
| Secret-key rotation, env management, leaked-secret incident response | `security-guardian` | This Weapon flags; security-guardian audits. |
| PII handling beyond the obvious "don't log it" | `security-guardian` | |
| React-side Stripe.js / Elements / EmbeddedCheckout component code | `react-guardian` | This Weapon describes the contract; react-guardian implements. |
| Payment fraud (Radar rules) | Out of scope v1 | Stripe Radar has its own surface; revisit. |
| Tax engines beyond Stripe Tax | Out of scope v1 | TaxJar, Avalara — separate Angel if needed. |
| Accounting / GL integration (NetSuite, QuickBooks) | Out of scope | Separate Angel if needed. |
| PRD authoring for payments features | `library-guardian` | This Weapon implements; library-guardian PRDs. |
| Verification of an implementation against a PRD | `quality-guardian` | This Weapon hands off. |
