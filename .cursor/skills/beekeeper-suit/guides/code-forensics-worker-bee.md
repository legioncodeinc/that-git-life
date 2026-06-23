# Code Forensics Worker Bee - Beekeeper-Suit's Guide

The Beekeeper-Suit routing skill's record of when to invoke `code-forensics-worker-bee`. Use this guide to decide whether a user request belongs to this Bee.

**Bee:** [`.cursor/agents/code-forensics-worker-bee.md`](../../agents/code-forensics-worker-bee.md)
**Stinger:** [`.cursor/skills/code-forensics-stinger/`](../../skills/code-forensics-stinger/)
**Command Brief:** not available (synthesized from agent + stinger files)
**Trigger policy:** on-demand

---

## Domain

code-forensics-worker-bee is the forensic investigator for the Army. It specializes in converting paper trails — invoices, email correspondence, git repositories, technical audit reports, and marketing reports — into litigation-ready evidence packets that support breach-of-contract, fraud, and gross-negligence claims against software vendors and digital agencies. The Bee runs a nine-phase investigation culminating in an 11-deliverable forensic packet: a master report, agency subreport, attorney legal memo, plain-language client report, 51-tab invoice spreadsheet, and a 6-document pre-litigation pack. Every claim in the packet is traceable to a specific source coordinate (email M-####, invoice number, git commit hash, audit-log row, or third-party report). The Bee does not practice law — it produces evidence for retained counsel to evaluate and serves demand letters only after counsel review.

## Trigger phrases

Route to `code-forensics-worker-bee` when the user says any of:

- "forensic investigation"
- "fee clawback"
- "investigate this engagement"
- "build a case against my developer / agency"
- "audit this software vendor"
- "breach of contract evidence"

Or when the request implicitly involves a client who paid $100k+ for a half-working product, a monthly maintenance retainer with little or no git activity, hosting double-billing, virtual-assistant or social-media charges without delivery, or any reference to defendants Robert Hartwell / ADA or Sameer Khan / DevPipe.

## Do NOT route when

- The user wants routine code review or a security audit without a damages claim — route to `security-worker-bee` or `quality-worker-bee` instead.
- The user is primarily seeking legal advice rather than evidence production (the Bee produces evidence; only retained counsel practices law).
- The request is a general technical audit with no forensic-clawback context and no reference to vendor misconduct or financial harm.

If a request straddles two Bees' domains, prefer the narrower-scoped Bee and let the broader one act as backup.

## Inputs the Bee needs

Before invoking, ensure the user has provided (or you can infer):

- Project name and engagement date range
- Identified defendant(s) — company name(s) and principal(s)
- Available materials: email archive (.eml files), invoice PDFs, git repository zip, technical audit reports, WordPress/CMS audit log export, marketing/account reports, and original signed contracts (any subset is sufficient to begin; missing materials are documented rather than fabricated)
- Jurisdiction — defaults to Ohio law if not specified

## Outputs the Bee produces

- Primary: `forensic-output/{ProjectName}_Forensic_Packet_{YYYYMMDD}.zip` — 11-deliverable bundle: master forensic report (.docx/.pdf), agency-services subreport (.docx/.pdf), attorney legal memo (.docx/.pdf), plain-language client report (.docx/.pdf), 51-tab invoice Excel workbook (.xlsx), and 6-document pre-litigation pack (.docx/.pdf each)
- Secondary: `forensic-output/case-facts.json` — the single-source-of-truth accumulator that drives all docx builders and persists all phase findings

## Multi-Bee sequences this Bee participates in

- Plan execution loop — always closes with `security-worker-bee` then `quality-worker-bee`

## Critical directives the orchestrator should respect

- Never allow the Bee to provide legal advice; all findings must be framed as evidence for retained counsel using qualified language ("may constitute fraud under applicable law," not "this is fraud").
- Enforce citation discipline: every dollar amount, date, file, and finding must be traceable to a specific source coordinate before any deliverable is finalized.
- Do not allow fabrication of evidence; document absences explicitly in the master report rather than inventing data to fill gaps.
- Escalate to the user — do not silently guess — when defendant identity is ambiguous, when a recurring invoice shows a price change that requires cross-boundary extrapolation, or when the jurisdiction is not Ohio and no matching `jurisdiction-{state}.md` file exists.
- Recommend retained counsel explicitly before any pre-litigation document is served; the pack is templated work product, not a substitute for legal representation.

(Full list lives in the Bee file's `## Critical directives` section.)

---

*Part of Beekeeper-Suit's roster. See [`.cursor/skills/beekeeper-suit/SKILL.md`](../SKILL.md) for the full Army.*
