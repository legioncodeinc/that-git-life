# Example: Break-Fix Runbook — Database Connection Pool Exhaustion

> **Demonstrates:** `guides/01-runbook-types.md` (break-fix type), `guides/02-no-implied-context-audit.md`, `guides/03-escalation-path-architecture.md`, `guides/04-rollback-procedures.md`
> **Template used:** `templates/break-fix-runbook.md`
> **Research source:** `research/external/2026-03-08-incop-oncall-runbook-best-practices.md` (the postmortem-to-action-item pattern from `research/external/2026-03-29-devopsil-blameless-postmortems.md`)

This is a fully worked break-fix runbook for "Payment service connection pool exhaustion." Use it as a model when authoring new break-fix runbooks.

---

# Payment Service — Database Connection Pool Exhaustion

**Runbook ID:** RBK-PAY-003
**Alert:** `payments_db_connections_critical` (fires when active connections > 90% of pool max)
**Service:** checkout-api (payments namespace)
**Last updated:** 2026-04-15 by @sre-engineer
**Status:** TESTED

> ✅ TEST STATUS: Last tested 2026-04-15 in staging (Format: Staging Exercise)
> Tested by: @sre-engineer-name
> Game day score (runbook_accuracy): 5/5
> Gaps found: None.
> Next scheduled exercise: 2026-07-15 (Q3 game day: Security incidents)

---

## Summary

The checkout-api service has exhausted its database connection pool. Active connections are at or near the configured maximum (default: 10 per pod, 5 pods = 50 total). New requests are queueing and timing out. This is a SEV-1 incident.

**Typical root causes (in order of frequency):**
1. Long-running query holding connections open (80% of cases)
2. Connection leak (no connection.close() in error path) (15% of cases)
3. Traffic spike beyond expected load (5% of cases)

---

## Severity

**SEV-1** — Payment processing is degraded. SLA clock is running.

Expected resolution time with this runbook: 20-30 minutes.

---

## Prerequisites

Set these variables before executing any step:

```
NAMESPACE=payments         # Kubernetes namespace
SERVICE=checkout-api       # Deployment name
DB_HOST=prod-db.internal   # Database hostname (check: kubectl get configmap db-config -n payments -o yaml)
DB_USER=checkout_app       # Database user (least privilege: read + write, no DROP)
# DB_PASSWORD: Do not set this. Use: $(aws ssm get-parameter --name /prod/payments/db-password --with-decryption --query Parameter.Value --output text)
```

Access requirements:
- kubectl access to `payments` namespace
- AWS SSM access for `/prod/payments/*` parameter paths
- Database read access (for observation steps only; no schema changes in this runbook)

---

## Triage checklist

Run these before executing remediation steps:

- [ ] Confirm the alert is real: `kubectl exec -n $NAMESPACE deploy/$SERVICE -- wget -q -O- localhost:8080/health`
  - Expected: `{"status":"degraded","db":"connection_pool_exhausted"}`
  - If healthy, this alert may be a false positive. Check for a PagerDuty duplicate.
- [ ] Confirm the namespace: `kubectl get pods -n $NAMESPACE -l app=$SERVICE`
  - Expected: 5 pods running; 0 in CrashLoopBackOff
- [ ] Check Grafana dashboard: https://grafana.internal.example.com/d/payments-db?var-env=production
  - Confirm: `payments_db_active_connections` is > 45 (90% of max=50)

---

## Steps

### Step 1: Identify long-running queries (~2 minutes)

```sql
-- Run via: psql "host=$DB_HOST dbname=payments user=$DB_USER password=$(aws ssm get-parameter --name /prod/payments/db-password --with-decryption --query Parameter.Value --output text)" -c "SELECT pid, now() - pg_stat_activity.query_start AS duration, query, state FROM pg_stat_activity WHERE (now() - pg_stat_activity.query_start) > interval '30 seconds' ORDER BY duration DESC;"
```

Expected: A list of running queries.
- If any query has been running > 5 minutes: proceed to Step 2 (Kill Long-Running Query).
- If no queries > 5 minutes: proceed to Step 4 (Check for Connection Leaks).

---

### Step 2: Capture original connection state before changes (~1 minute)

```bash
# Capture current connection count (for rollback reference)
psql "host=$DB_HOST ..." -c "SELECT count(*) as active_connections FROM pg_stat_activity WHERE state = 'active';"
# Record the output as ORIGINAL_ACTIVE_CONNECTIONS
```

---

### Step 3: Terminate long-running queries (state-changing — see rollback) (~1 minute)

```sql
-- Terminate all queries running longer than 5 minutes
SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE (now() - query_start) > interval '5 minutes' AND state != 'idle' AND pid <> pg_backend_pid();
```

Expected output: `pg_terminate_backend` returns `t` for each terminated connection.

Watch Grafana: `payments_db_active_connections` should drop within 60 seconds.

- If connections drop to < 40 (80% of max): monitor for 5 minutes; proceed to Step 10 (Monitor and Close).
- If connections remain elevated: proceed to Step 4 (Check for Connection Leaks).

---

### Step 4: Check for connection leaks (~3 minutes)

```sql
SELECT client_addr, count(*) FROM pg_stat_activity GROUP BY client_addr ORDER BY count DESC;
```

Expected: Even distribution across 5 pod IPs (`10.x.x.x`).
- If one pod IP has >> the others: that pod has a connection leak. Proceed to Step 5 (Restart Leaking Pod).
- If even distribution: proceed to Step 6 (Scale Up Temporarily).

---

### Step 5: Restart the leaking pod (state-changing — see rollback) (~3 minutes)

```bash
# Identify the pod name corresponding to the IP from Step 4
kubectl get pods -n $NAMESPACE -o wide | grep <LEAKING_POD_IP>
# Record the pod name as LEAKING_POD_NAME

# Delete the pod (deployment will recreate it)
kubectl delete pod $LEAKING_POD_NAME -n $NAMESPACE
```

Expected: Pod is terminated and recreated within 90 seconds. `kubectl get pods -n $NAMESPACE` shows a new pod entering Running state.

Watch Grafana: `payments_db_active_connections` should drop within 2 minutes.

---

### Step 6: Scale up temporarily if leak is not isolated (state-changing — see rollback) (~2 minutes)

```bash
# Capture original replica count
ORIGINAL_REPLICAS=$(kubectl get deploy/$SERVICE -n $NAMESPACE -o jsonpath='{.spec.replicas}')
echo "ORIGINAL_REPLICAS=$ORIGINAL_REPLICAS"  # Record this!

# Scale up to distribute connections
kubectl scale deploy/$SERVICE -n $NAMESPACE --replicas=8
```

Expected: 3 new pods start within 3 minutes. `payments_db_active_connections` drops as connections distribute.

Note: This is a temporary fix. The connection leak must be identified and fixed in code. Open a SEV-2 ticket after the incident is resolved.

---

### Step 10: Monitor and close (~5 minutes)

- Confirm `payments_db_active_connections` is < 40 (80% of max) for 5 consecutive minutes.
- Confirm checkout-api is returning HTTP 200s: https://grafana.internal.example.com/d/payments-api
- Notify #payments-incidents: "Connection pool exhaustion resolved. Root cause: [long-running query / connection leak / traffic spike]. Monitoring for 5 minutes."
- If stable after 5 minutes: resolve the PagerDuty incident.
- If not stable: escalate per the Escalation Path section.

---

## Rollback

Only execute rollback steps for action steps you ran.

**Rollback for Step 3 (terminated queries):** No rollback. Terminated queries cannot be re-run. The client will retry automatically. If retry volume is abnormal, check application logs: `kubectl logs -n $NAMESPACE deploy/$SERVICE --since=10m | grep 'retry'`.

**Rollback for Step 5 (deleted pod):** The deployment controller already recreated the pod. No manual rollback needed.

**Rollback for Step 6 (scaled up):**
```bash
kubectl scale deploy/$SERVICE -n $NAMESPACE --replicas=$ORIGINAL_REPLICAS
# Verify
kubectl get deploy/$SERVICE -n $NAMESPACE
# Expected: DESIRED matches ORIGINAL_REPLICAS
```

---

## Escalation path

**Tier 1 (you):** Exhaust the steps in this runbook.

**Tier 2 (escalate if: 15 min no progress OR data loss risk):**
- Team: Payments Team
- Slack: #payments-oncall
- PagerDuty: "Payments Team" schedule
- Expected response: 10 minutes

**Tier 3 (escalate if: 30 min no resolution OR SEV-0):**
- Team: Engineering Management
- PagerDuty: "EM Escalation" policy
- Expected response: 15 minutes

**Database team (escalate if: connection leak confirmed in code):**
- Slack: #database-team
- Response time: next business day for non-data-loss issues; 1 hour for data loss

---

## Post-incident

After resolution:
1. Update the incident channel with root cause and resolution.
2. If root cause was a code defect (connection leak): open a bug ticket in Linear/Jira.
3. If the incident was SEV-1: schedule postmortem within 48 hours.
4. Update this runbook's Postmortem history section with the incident and any improvements discovered.

---

## Postmortem history

| Date | Incident ID | SEV | Summary | Runbook change |
|---|---|---|---|---|
| 2026-03-10 | INC-2041 | SEV-1 | DB connection pool exhausted; Step 6 command missing --timeout | Added `--replicas=8` with explicit explanation; added ORIGINAL_REPLICAS capture step |

---

*Example runbook for `runbook-writing-guardian`. Real runbooks are stored in your team's designated runbook folder.*
