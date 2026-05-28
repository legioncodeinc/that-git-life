# PRD-001: Egress Control System

> **Status:** Backlog
> **Priority:** P0
> **Effort:** M (remaining: Layer 1 deployment, adversarial tests)
> **Schema changes:** None

---

## Overview

The egress control system enforces the deny-by-default contract: no outbound HTTP is permitted from the shim's process unless the destination appears in a compile-time `EGRESS_ALLOWLIST` constant. It operates at two independent layers: an in-process undici dispatcher (Layer 2) that intercepts every HTTP call made by the Node process, and a Kubernetes NetworkPolicy (Layer 1) that enforces at the OS network level. Either layer alone would stop most leak vectors; together they are the production contract. Current implementation status is approximately 80% complete — the allowlist and interceptor are done and the NetworkPolicy generation tool is implemented as a skeleton; Layer 1 deployment and adversarial test coverage remain.

---

## Goals

- Block all unauthorized outbound HTTP from process B
- Log every denied attempt with host, port, path, method, and stack trace
- Generate Kubernetes NetworkPolicy YAML from the same allowlist constant (no drift possible)
- Enforce allowlist-change governance via mandatory PR review by a platform engineer

## Non-Goals

- Raw TCP connections via `net.connect` — handled by Layer 1 only
- UDP traffic
- Process A egress enforcement (separate NetworkPolicy governs process A)

---

## Sub-features

| Sub-PRD | Scope | Status |
|---|---|---|
| [`prd-001a-egress-control-allowlist.md`](./prd-001a-egress-control-allowlist.md) | `EGRESS_ALLOWLIST` constant, `AllowEntry` interface, NetworkPolicy YAML generation | Backlog |
| [`prd-001b-egress-control-interceptor.md`](./prd-001b-egress-control-interceptor.md) | `AllowlistDispatcher`, `installEgressInterceptor()`, interceptor-must-be-first lint rule | Backlog |
| [`prd-001c-egress-control-leak-logging.md`](./prd-001c-egress-control-leak-logging.md) | `egress.leak_attempt` schema, observability sink wiring, dashboard signal | Backlog |

---

## Acceptance criteria

| ID | Criterion |
|---|---|
| AC-1 | Given the shim is running, when any code in the process calls `fetch()` or `undici.request()` to an unlisted host, then the call is denied with `Error("egress-denied: <host>:<port>")` and a structured `egress.leak_attempt` JSON record is written to stderr. |
| AC-2 | Given the allowlist constant, when `render-networkpolicy.ts` is run, then it produces a valid Kubernetes NetworkPolicy YAML with one TCP/443 egress rule per allowlist entry plus UDP/53 and TCP/53 DNS rules. |
| AC-3 | Given `installEgressInterceptor()` is called, when it is called a second time, then it is a no-op (idempotent). |
| AC-4 | Given a loopback address (`127.0.0.1`, `localhost`, `::1`), when the dispatcher intercepts the call, then it is passed through without consulting the allowlist. |

---

## Open questions

- [ ] Which hostname-enforcement mechanism is available in the production cluster (Cilium FQDN, Envoy egress gateway, or undici-only fallback)?

---

## Related

- [`../../knowledge/private/security/egress-model.md`](../../knowledge/private/security/egress-model.md)
- [`../../knowledge/private/operations/ci-battery.md`](../../knowledge/private/operations/ci-battery.md)
