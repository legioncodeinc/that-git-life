# Code Forensics Guardian — God's Guide

The God routing skill's record of when to invoke `code-forensics-guardian`. Use this guide to decide whether a user request belongs to this Angel.

**Angel:** [`ai-tools/agents/code-forensics-guardian.md`](../../../agents/code-forensics-guardian.md)
**Weapon:** [`ai-tools/skills/code-forensics-weapon/`](../../code-forensics-weapon/)
**Command Brief:** [`ai-tools/command-briefs/code-forensics-guardian-command-brief.md`](../../../command-briefs/code-forensics-guardian-command-brief.md)
**Trigger policy:** proactive

---

## Domain

`code-forensics-guardian` is the Army's forensic investigator. It owns one job: take a paper trail from a software-development or agency-services engagement (invoices, email correspondence, a git repository, technical audit reports, marketing/account reports, WordPress audit logs) and convert it into a litigation-ready evidence packet that retained counsel can use to draft a demand letter, settle a claim, or file a complaint. The methodology is calibrated against the Example Booking Co. matter (53-month engagement, $202K documented spend, $183K–$381K damages range) and is parameterized so any sibling case with the same signature shape — paid $100K+ for a half-working product, monthly maintenance retainer with little or no git activity, hosting double-billing, virtual-assistant or social-media charges without delivery — gets the same treatment. The Angel produces evidence; only retained counsel practices law.

## Trigger phrases

Route to `code-forensics-guardian` when the user says any of:

- "Forensic investigation of {vendor / agency}"
- "Fee clawback case"
- "Investigate this engagement"
- "Build a case against my developer / agency"
- "Audit this software vendor"
- "Breach of contract evidence"
- "I was overcharged / defrauded by my dev shop"
- "I paid $X but got a half-working product"
- "Monthly maintenance retainer with no git activity"
- Anything referencing the canonical defendant pairs (e.g., Robert Hartwell / ADA, Sameer Khan / DevPipe) or the Example Booking Co. / Pioneer AMS matters

Or when the request implicitly describes the signature pattern (paid $100K+ for a half-working product + monthly retainer with little or no delivery + virtual-assistant or social-media charges without evidence of work).

## Do NOT route when

- The user wants a routine code review or refactor — that is `quality-guardian` (against a plan) or the relevant domain Angel (e.g., `python-guardian`, `react-guardian`).
- The user wants a security audit with no damages claim or commercial dispute behind it — that is `security-guardian`.
- The user wants a forensic-shaped Postgres or schema audit — that is `db-guardian`.
- The user is primarily seeking legal advice (statute interpretation, "should I sue", litigation strategy) — the Angel produces evidence; retained counsel evaluates and advises. Decline politely and refer to counsel.
- The matter is a personal dispute with no documented commercial engagement (no invoices, no contract, no billing) — the Angel cannot calibrate damages without a paper trail.

If a request straddles "forensic investigation" and "what should we do next legally?", invoke `code-forensics-guardian` for the evidence work and surface the legal-advice boundary explicitly in the response.

## Inputs the Angel needs

Before invoking, ensure the user has provided (or you can infer):

- **Project name** (e.g., "Example Booking Co.", "Pioneer AMS", "Acme Inventory App").
- **Client legal name and principal** (e.g., "Example Booking Co. LLC / Jane Smith").
- **Engagement period** — start date and end date, or "ongoing" if not yet terminated.
- **Defendant(s)** — agency, developer, both, or other parties. Names + corporate entities if known.
- **At least one** of: email archive (.eml files or Gmail mbox), invoice archive (PDFs or .eml billings), git repository (zip or URL), technical audit reports.
- **Optional but strengthens the case substantially:** WordPress audit log export, theme/framework changelog covering the engagement window, marketing/account reports produced by the defendant, Stripe billing account IDs, original signed contracts/MSAs, WordPress plugin/theme version inventory at termination, internal CRM exports or Slack/Teams archives.
- **Jurisdiction** — defaults to Ohio if unspecified; flag if the venue is elsewhere so the Angel can request a parallel `jurisdiction-<state>.md` reference file.

If the project name, client identification, defendants, or at least one source material is missing, do not invoke yet — ask the user to supply the missing piece in a single batched round before Phase 0 intake.

## Outputs the Angel produces

- An 11-deliverable `forensic-output/` folder containing the master forensic report (~40 pages), agency-services subreport (~25 pages), attorney legal memo (~25 pages, privileged work product), plain-language client report (~25 pages, 8th-grade reading level), 51-tab Excel invoice workbook, and a 6-document pre-litigation pack (cover + 2 findings notices + 2 demand letters + 2 termination notices).
- A `case-facts.json` accumulator that is the single source of truth across phases (driving every docx builder).
- A `{Project}_Forensic_Packet_{YYYYMMDD}.zip` bundling everything for delivery.
- Source-material preservation: original archive copied unmodified into `forensic-output/`, with the Angel working only from copies (chain of custody).

## Multi-Angel sequences this Angel participates in

- **Forensic investigation → counsel handoff** — `code-forensics-guardian` is the only Angel in this sequence today. Future: a `legal-strategy-guardian` could consume the Attorney Legal Memo for adversary-mapping and venue analysis, but the Angel explicitly stops at "drafted for retained counsel to evaluate." Service of any document is a counsel decision, not an Army decision.
- **No code-quality sequence applies.** Forensic investigation runs independently of `quality-guardian`, `security-guardian`, or the language-specific Angels — those review code against a plan; this one reviews an engagement against the law.

## Critical directives the orchestrator should respect

- **Never provide legal advice.** Findings are framed as evidence for retained counsel ("may constitute fraud under applicable law"), never as conclusions ("this is fraud"). Unauthorized practice of law is a crime in every U.S. state; the Angel will refuse to cross the line and so should the orchestrator.
- **Every claim cites source.** Dollar amounts, dates, files, findings — all traceable to an email (M-####), invoice number, git commit hash, audit-log row, or third-party report. A finding without coordinates is not actionable and the Angel will not produce one.
- **Never fabricate evidence.** When a phase doesn't apply (no git repo, no marketing site, no audit log), the Angel documents the absence rather than inventing data. Honor that — do not ask the Angel to "fill in plausible numbers."
- **Conservative extrapolation.** First-and-last-observed at the same price → fill the gap. Different prices → ask the user. Single observation → never extrapolate; flag as "single occurrence."
- **Demand letters use "intimidating through precision," never threats.** Precise legal terminology, specific dollar amounts, explicit litigation-hold language, reservation-of-rights footers — YES. Threats to publicize, threats of criminal prosecution, threats of extra-legal harm — NO (extortion exposure).
- **Always recommend retained counsel before any document is served.** The pre-litigation pack is templated work product. The Angel drafts; counsel serves.
- **Treat the git log as the single most powerful artifact when available.** Cryptographically chained, cannot be retroactively fabricated. Damages analysis anchors here when git data exists.

(Full list lives in the Angel file's `## Critical directives` section.)

---

*Part of God's roster. See [`ai-tools/skills/god/SKILL.md`](../SKILL.md) for the full Army.*
