# Rollback Procedures

> **Principle:** `guides/00-principles.md` Principle 4 ("Rollback Before You Ship")

Every state-changing step must have a rollback. This guide explains how to write rollback sections, how to classify reversible vs. irreversible changes, and how to handle irreversibility with explicit risk documentation.

---

## The rollback contract

A runbook that modifies state without a rollback is incomplete. Period. Here is why this is non-negotiable:

An engineer executes Step 6 (scales the DB connection pool from 10 to 50). The incident is not resolved. They escalate. A second engineer joins. Neither knows the original connection pool value was 10. The second engineer scales it to 100 "to fix the issue." Now there are two untracked modifications in flight. The postmortem cannot reconstruct the change timeline.

Rollback sections prevent this by:
1. Pre-authorizing the undo steps (no guessing in the moment).
2. Documenting the original state so engineers know what to restore to.
3. Forcing runbook authors to think through failure modes before the incident.

---

## Rollback section placement

Place the `## Rollback` section immediately after the last action step, before `## Post-Incident` and `## Escalation Path`.

The rollback section lists steps in **reverse order** of the action steps that changed state. Only steps that changed state need a rollback entry; read-only steps (log inspection, metrics queries) do not.

---

## Classifying changes

### Reversible changes (require rollback steps)

Any command that can be undone:

| Change type | Example | Rollback |
|---|---|---|
| Scale deployment up | `kubectl scale deploy/api --replicas=5` | Scale back: `kubectl scale deploy/api --replicas=2` (or original value) |
| Change feature flag | `launchdarkly flag set payments.v2 true` | Reset to prior value: `launchdarkly flag set payments.v2 false` |
| Restart service | `kubectl rollout restart deploy/api -n payments` | Revert to prior deployment: `kubectl rollout undo deploy/api -n payments` |
| Flush cache | `redis-cli FLUSHDB` | Cache cannot be restored; add note: "Cache will rebuild automatically over ~15 minutes" |
| Update config | `aws ssm put-parameter --name /prod/api/max-pool --value 50` | Restore original: `aws ssm put-parameter --name /prod/api/max-pool --value 10` |

**Capture original values before changing them.** Add a read step before the change:
```
Step 5a (capture): kubectl get deploy/api -n payments -o jsonpath='{.spec.replicas}'
  # Record the output. This is ORIGINAL_REPLICAS. You will need it if you roll back.
Step 5b (change): kubectl scale deploy/api -n payments --replicas=5
```

---

### Irreversible changes (require explicit acknowledgment)

Some changes cannot be undone. Irreversible changes require:
1. A `⚠️ IRREVERSIBLE` warning inline on the step.
2. A documented risk: what goes wrong if you need to "undo" this.
3. A documented mitigation: how to recover from the consequences.

**Template for irreversible step:**
```markdown
#### Step 8: Drop the stuck migration lock

```sql
DELETE FROM schema_migrations_lock WHERE locked = true AND locked_by = 'deploy-job';
```

⚠️ IRREVERSIBLE: This modifies the migrations lock table directly. Risk: if a migration job is legitimately running (not stuck), this command will cause it to re-run on next deploy, potentially double-applying a migration. Mitigation: Before executing, confirm the job named in `locked_by` is not running by checking `kubectl get jobs -n $NAMESPACE | grep deploy`. If running, do NOT execute this step — escalate to the Database team (Tier 2) instead.
```

---

## Rollback section template

```markdown
## Rollback

If at any point the steps above did not resolve the incident, or if you need to undo changes made, execute the following steps in order:

**Precondition:** Note which action steps you executed. Only undo steps that you actually ran.

**Rollback Step 1 (undoes Action Step 5):** Restore original replica count
  kubectl scale deploy/$SERVICE -n $NAMESPACE --replicas=ORIGINAL_REPLICAS
  # Replace ORIGINAL_REPLICAS with the value captured in Step 5a.
  Verify: kubectl get deploy/$SERVICE -n $NAMESPACE
  Expected: DESIRED matches ORIGINAL_REPLICAS

**Rollback Step 2 (undoes Action Step 3):** Restore original connection pool setting
  aws ssm put-parameter --name /prod/$SERVICE/max-pool --value ORIGINAL_POOL_SIZE --overwrite
  # Replace ORIGINAL_POOL_SIZE with the value captured in Step 3a.
  Verify: aws ssm get-parameter --name /prod/$SERVICE/max-pool --query Parameter.Value
  Expected: Returns ORIGINAL_POOL_SIZE

After executing rollback:
1. Document all changes made and rollbacks executed in the incident channel.
2. Notify Tier 2 escalation contact that rollback was performed.
3. Open a postmortem if the incident was SEV-1 or higher.
```

---

## Common rollback mistakes

1. **Not capturing original state before changing it.** You cannot roll back to "original value" if you don't know what it was.
2. **Rollback in action order instead of reverse order.** Rollback must be reverse-chronological. Rolling back Step 3 before Step 5 may put the system in an inconsistent state.
3. **Omitting rollback for "safe" changes.** Restarting a service is not always safe. A restart that causes a new pod to pull a broken image version is worse than the original state.
4. **Assuming rollback won't be needed.** The reason rollback is pre-authored is because it will be needed. The discipline of writing rollback steps also forces you to identify risky steps during authoring, not during an incident.
