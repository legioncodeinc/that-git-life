---
title: "Adjacent Weapon Review: devops-weapon — Escalation Boundary"
source_url: internal://legion-code/.cursor/skills/devops-weapon/SKILL.md
source_type: internal-weapon
authority: high
relevance: medium
date_retrieved: 2026-05-20
topics:
  - escalation-paths
  - domain-boundaries
  - devops
  - kanban-method
weapon: kanban-flow-weapon
---

# Adjacent Weapon Review: devops-weapon Escalation Boundary

**Source:** Internal — `.cursor/skills/devops-weapon/SKILL.md`
**Purpose:** Clarify the boundary between `kanban-flow-guardian` and `devops-guardian` to avoid domain overlap and ensure correct escalation paths in SKILL.md.

## Summary

The `devops-weapon` skill covers: Docker and Docker Compose pipeline configuration, GitHub Actions CI/CD architecture, Depot build acceleration, Trivy/Scout image scanning, and local-CI parity. It explicitly does NOT cover: cloud provisioning, DB schema migrations (except wiring the migration step), security CVE deep audits, or PRD authoring.

**Key escalation boundary with `kanban-flow-guardian`:**

The two guardians are clearly separated by their level of abstraction:
- `kanban-flow-guardian` owns the **human delivery process** and **board discipline**: how teams decide what to work on, in what order, with what WIP constraints, and how they measure whether work is flowing well.
- `devops-guardian` owns the **automated software delivery pipeline**: the CI/CD tooling, container build process, and deployment infrastructure that carries code from commit to production.

**Where the two overlap (and how to handle it):**
1. **Deployment frequency** (DORA metric): Both guardians care about it. `kanban-flow-guardian` treats deployment frequency as a throughput measure visible on the Kanban board (deployed cards per week). `devops-guardian` owns the CI/CD pipeline that enables frequent deployment. Rule: when the conversation is about "how often are we deploying and does it match our throughput target," that is `kanban-flow-guardian`. When the conversation is about "how do we make our CI/CD pipeline capable of deploying more frequently," that is `devops-guardian`.

2. **Lead time for changes** (DORA metric): `kanban-flow-guardian` measures lead time as defined in Kanban — from ticket creation to deployment. The DORA "lead time for changes" (commit to production) is a subset. If a team's lead time is dominated by CI/CD pipeline wait times (slow builds, manual gates), `kanban-flow-guardian` should flag this and escalate to `devops-guardian`.

3. **Blocked items due to infrastructure dependencies**: A Kanban card blocked because it is waiting for a CI environment, a deployment credential, or an infrastructure prerequisite is in `devops-guardian`'s domain. `kanban-flow-guardian` surfaces the blockage via its flow metrics analysis; `devops-guardian` resolves the infrastructure cause.

**Escalation triggers in `kanban-flow-weapon` (when to hand off to `devops-guardian`):**
- Team's cycle time is dominated by CI/CD wait time (>50% of cycle time in a "Waiting for Build/Deploy" state)
- Team wants to implement custom Kanban tooling (automated board state transitions, GitHub Actions for WIP limit enforcement)
- Deployment cadence is constrained by pipeline infrastructure, not team WIP discipline

## Annotations for weapon-forge

- **Supports** SKILL.md "escalation paths" section: weapon-forge should encode the three escalation triggers above as explicit routing rules.
- The DORA metric overlap (deployment frequency, lead time for changes) should be acknowledged in `guides/02-flow-metrics.md` with a note that `kanban-flow-guardian` uses Kanban-native definitions (not DORA definitions), and the two measurement systems produce different but complementary numbers.
- The GitHub Actions WIP limit enforcement workaround (writing a GitHub Action to count column cards and post warnings) is technically in `devops-guardian`'s implementation domain. If a user asks `kanban-flow-guardian` to implement this, the guardian should describe WHAT to build (the policy and thresholds) and hand off to `devops-guardian` or `react-guardian` for the actual implementation.
