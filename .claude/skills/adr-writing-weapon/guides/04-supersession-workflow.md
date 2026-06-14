# Supersession and Deprecation Workflow

ADRs are permanent — they are never deleted. When a decision changes, the old ADR enters a new status, and a new ADR records the replacement decision. The bidirectional link between the two is mandatory.

---

## Status transitions

```
Proposed ──→ Accepted ──→ Superseded by ADR-NNNN
                       ──→ Deprecated (reason required)
         ──→ Rejected  (reason required)
```

| Status | Meaning |
|---|---|
| Proposed | Decision is actively being ratified. Not yet binding. Do not reference from code. |
| Accepted | Decision is binding. This is the normal operating state. |
| Superseded | A newer ADR replaced this one. Link is bidirectional. |
| Deprecated | The decision was retired without a direct replacement (e.g., the feature was removed). Requires a deprecation rationale. |
| Rejected | The decision was proposed and explicitly rejected. Record the rejection rationale so the same proposal is not re-raised without new evidence. |

---

## Supersession: step-by-step

### Step 1 — Write the new ADR

Author the new ADR (call it ADR-0025) as a normal Nygard or MADR record. In its header, add a `Supersedes` line after the Status:

```markdown
## Status

Accepted

Supersedes ADR-0012
```

In the Context section, briefly explain why the old decision no longer holds:

> ADR-0012 adopted PostgreSQL via Supabase. We have since exceeded Supabase's connection limits at scale, and the team has evaluated Neon as a drop-in replacement with native serverless connection pooling.

### Step 2 — Update the superseded ADR

Open the old ADR (ADR-0012) and change its Status section:

```markdown
## Status

Superseded by ADR-0025
```

Do not modify any other content in the old ADR. The superseded record must remain readable as a historical artifact.

### Step 3 — Update the ADR log index

If the project uses `adr-log.md` or a Log4brains `config.yml`, update the entry for ADR-0012 to reflect its new status. Log4brains does this automatically when it regenerates the site.

---

## Deprecation (no direct replacement)

Use Deprecated when:
- The feature the decision supported was removed ("we deprecated the mobile app, so the React Native ADR is no longer relevant")
- The decision became moot due to external changes (a third-party service discontinued)
- The technology was retired without a replacement decision recorded (legacy cleanup)

In the deprecated ADR:

```markdown
## Status

Deprecated

Rationale: The mobile app was sunset in Q1 2026. This decision no longer applies.
```

---

## Rejection

Use Rejected for a `Proposed` ADR that was explicitly voted down. Always record the rejection rationale:

```markdown
## Status

Rejected

Rationale: The proposal to adopt GraphQL federation was rejected in the architecture review on 2025-11-10. Primary objections: operational complexity of the federation gateway and the team's limited GraphQL experience. The proposal can be revisited if team GraphQL expertise grows or if the public API surface requires it.
```

A rejected ADR is valuable — it prevents the same proposal from being re-raised without new evidence.

---

## adr-tools supersession command

```bash
adr new -s 12 "Use Neon instead of Supabase"
```

This creates the new ADR and automatically appends `Supersedes: 0012` to its header. It does NOT update ADR-0012 — you must do that manually (or use Log4brains which handles it in the UI).

---

## Audit checklist

Before closing a supersession:

- [ ] New ADR exists with `Supersedes: ADR-NNNN` in header
- [ ] Old ADR's Status updated to `Superseded by ADR-MMMM`
- [ ] ADR log index (if maintained separately) reflects both statuses
- [ ] Both ADRs reference each other by number
- [ ] New ADR's Context section explains why the old decision no longer holds
