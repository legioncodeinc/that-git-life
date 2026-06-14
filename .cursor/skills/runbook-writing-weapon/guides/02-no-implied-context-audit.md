# No-Implied-Context Audit Protocol

> **Research source:** `research/external/2026-03-08-incop-oncall-runbook-best-practices.md`, `research/external/2026-02-15-sreschool-runbook-definition-maturity.md`
> **Principle:** `guides/00-principles.md` Principle 1 and 2

This guide is the step-by-step protocol for auditing any runbook (new or existing) against the no-implied-context rule. Run it on every runbook before marking it READY FOR PRODUCTION.

---

## The audit protocol (9 checks)

For each check, scan the runbook top to bottom. Flag every violation with a `<!-- VIOLATION: [type] -->` comment inline, then fix each one before moving on to the next check.

---

### Check 1: Copy-paste commands

**Test:** Can every shell command, SQL query, kubectl invocation, and API call be copied and pasted into a terminal without modification?

**Violations to find:**
- Commands with `<placeholder>` that aren't defined in a Prerequisites section.
- Commands that reference variables defined elsewhere (in a script, in an env file) without defining them inline.
- Commands with "..." or "etc." in them.
- Commands that require tab-completion to find the right resource name.

**Correction pattern:**
```
# BEFORE (violation):
kubectl get pods -n payments

# AFTER (compliant):
kubectl get pods -n payments -l app=checkout-api
# Expected output: pods named "checkout-api-<hash>" in Running or CrashLoopBackOff status
# If no pods are returned, confirm NAMESPACE is correct: echo $NAMESPACE
```

---

### Check 2: Absolute URLs

**Test:** Are all URLs absolute (including protocol and domain)?

**Violations to find:**
- Relative paths: `/dashboard/payments`
- Anchor references without a base: `#alert-overview`
- "Check the Grafana dashboard" without a URL
- "Open the runbook index" without a URL

**Correction:** Replace with the full URL: `https://grafana.internal.example.com/d/payments-overview?var-env=production`

---

### Check 3: Environment variables defined

**Test:** Is every environment variable used in a command defined in the Prerequisites section?

**Violations to find:**
- `$SERVICE`, `$NAMESPACE`, `$ENV`, `$CLUSTER` used but not defined.
- A command that works in one environment but not another without explanation.

**Correction:** Add a Prerequisites section at the top of the runbook:
```
## Prerequisites
Before executing any step, set these variables in your terminal:

  ENV=production        # environment: production | staging | dev
  NAMESPACE=payments    # Kubernetes namespace
  SERVICE=checkout-api  # deployment name (check: kubectl get deploy -n payments)
  REGION=us-east-1      # AWS region
```

---

### Check 4: Decision points are explicit

**Test:** Does every "if/else" in the runbook name exactly what to look for and where to route?

**Violations to find:**
- "If the restart doesn't work, try something else."
- "If you see errors, investigate further."
- "Check if this is a known issue." (Where? Known issue list is not linked.)

**Correction pattern:**
```
# BEFORE (violation):
If the service doesn't come back up, investigate further.

# AFTER (compliant):
If the service is still not Running after 3 minutes:
  - Run: kubectl describe pod -n $NAMESPACE -l app=$SERVICE | grep -A5 "Events:"
  - If Events show "OOMKilled": proceed to Step 7 (Memory Scale-Up).
  - If Events show "ImagePullBackOff": proceed to Step 9 (Image Troubleshooting).
  - If Events show neither: escalate to Tier 2 per the Escalation Path section.
```

---

### Check 5: All referenced documents are linked

**Test:** Does every reference to another document include a direct link or path?

**Violations to find:**
- "See the on-call guide."
- "Check the deployment runbook."
- "Refer to the incident response policy."

**Correction:** Link inline: `See the [on-call guide](https://wiki.example.com/oncall-guide).`

---

### Check 6: Commands include expected output

**Test:** Does every command tell the engineer what to expect when it succeeds?

**Why:** An engineer who doesn't know what success looks like cannot tell if a command ran correctly.

**Correction pattern:**
```
Run: kubectl get pods -n $NAMESPACE -l app=$SERVICE
Expected: All pods show STATUS=Running and READY=1/1
If STATUS=CrashLoopBackOff: proceed to Step 4.
If no pods: proceed to Step 6.
```

---

### Check 7: Time estimates per step

**Test:** Do time-sensitive steps include an estimated duration?

**Why:** Engineers manage their escalation window based on how long each step should take. A step that should take 30 seconds but takes 5 minutes signals a problem.

**Pattern:** Add `(~30 seconds)` or `(~2-5 minutes)` after the step instruction where meaningful.

---

### Check 8: Credentials and access verified

**Test:** Does the runbook assume access that not every on-call engineer has?

**Violations to find:**
- "Log in to the production database" without specifying the login mechanism.
- "Access the AWS console" without specifying the role to assume.
- Commands that require a VPN but don't mention it.

**Correction:** Add to Prerequisites: `Access requirements: [VPN connected / AWS role assumed / database credentials in 1Password vault "Engineering/Prod-DB"]`.

---

### Check 9: Security check (secrets hygiene)

**Test:** Does the runbook contain hardcoded secrets, API keys, or passwords?

**Violations:** Any literal value that looks like a credential (`AKIA...`, `sk_live_...`, `postgres://user:password@host`).

**Correction:** Replace with a reference to the secret store: `$(aws ssm get-parameter --name /prod/db/password --with-decryption --query Parameter.Value --output text)`

**Source:** SRE School quality attribute #9 (security-aware). See `research/external/2026-02-15-sreschool-runbook-definition-maturity.md`.

---

## Violation scoring

After completing all 9 checks, tally:

| Severity | Check numbers | Action if any found |
|---|---|---|
| **Critical (blocks READY)** | 1, 2, 3, 4, 9 | Must fix before marking ready |
| **High (blocks READY)** | 5, 6, 8 | Must fix before marking ready |
| **Medium (should fix)** | 7 | Fix in same PR; note in audit log |

A runbook with any Critical or High violations cannot be marked READY FOR PRODUCTION. See `guides/07-done-checklist.md`.

---

## Quick cheat sheet

Paste this as a comment at the top of the runbook while auditing:

```markdown
<!-- AUDIT IN PROGRESS
Check 1: Copy-paste commands [ ]
Check 2: Absolute URLs [ ]
Check 3: Env vars defined [ ]
Check 4: Decision points explicit [ ]
Check 5: References linked [ ]
Check 6: Expected output per command [ ]
Check 7: Time estimates [ ]
Check 8: Access requirements stated [ ]
Check 9: No hardcoded secrets [ ]
Audited by: @name on YYYY-MM-DD
-->
```

Remove this comment when all checks pass.
