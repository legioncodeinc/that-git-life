---
name: code-forensics-stinger
description: "Forensic investigation methodology for software-development and agency-services engagements where a client has been overcharged, defrauded, or materially injured by a vendor and possesses a paper trail (invoices, emails, git repo, audit reports). Produces an 11-deliverable evidence packet — master forensic report, agency-services subreport, attorney legal memo, plain-language client report, 51-tab invoice spreadsheet, and a 6-document pre-litigation pack. Trigger whenever the user describes the pattern of paid $100k+ for a half-working product, monthly maintenance retainer with little or no git activity, hosting double-billing, virtual-assistant or social-media charges without delivery, or any sibling pattern. Defendant-agnostic — see defendant-profile-template for plugging in case-specific corporate context. Calibrated against the Example Booking Co. matter ($202K documented spend, $183K-$381K damages range)."
---

# code-forensics-stinger

## What this Stinger is for

A client believes they have been defrauded, overcharged, or materially injured by a software vendor or digital agency. They have (or can obtain) a paper trail: invoices, email correspondence, a git repository, technical audit reports, marketing reports. Your job is to convert that paper trail into a litigation-ready evidence packet that supports breach of contract, fraud, and gross negligence claims.

This skill captures the methodology, scripts, and templates used to produce the original Example Booking Co. forensic packet (May 2026). It is parameterized for reuse on any sibling matter with minimal customization per case.

## When to invoke

Read this paragraph carefully and proactively trigger if it matches:

- The user describes a software-engagement that ended badly with multi-vendor billing
- The user has invoices, emails, git history, or audit reports and wants to "build a case", "claw back fees", "investigate", or "document"
- The user references a specific defendant pair (ADA/DevPipe, or any sibling)
- The user describes the signature pattern: paid $100k+ for a half-working product, monthly maintenance retainer with zero or little git activity in some months, agency services billed without delivery

Do NOT trigger for:
- Routine technical audits unrelated to forensic-clawback context
- General code review or security audits without a damages claim
- Cases where the user wants legal advice (the Bee produces evidence for retained counsel; it does not practice law)

## Deliverable inventory

Eleven deliverables go into a `forensic-output/` folder. The full templates are in `templates/`. Use the docx-builder scripts in `scripts/` to generate Word output, then convert to PDF via LibreOffice headless.

1. `{ProjectName}_Forensic_Report.docx/.pdf` — master 7-part technical and financial investigation (~40 pages)
2. `{ProjectName}_Agency_Forensic_Report.docx/.pdf` — agency-services-specific (hosting fraud, CVE timeline, marketing performance)
3. `{ProjectName}_Attorney_Legal_Memo.docx/.pdf` — privileged work product (causes of action, damages, strategy)
4. `{ProjectName}_Plain_Language_Report.docx/.pdf` — 8th-grade reading level for the client (with industry-appropriate analogies)
5. `{ProjectName}_Invoice_Forensics.xlsx` — 51-tab Excel: invoices, recurring, one-off, commit log, monthly effort rollup, billed-vs-delivered variance, idle months
6–11. `pre-litigation-pack/` — six documents: cover & instructions, two findings notices, two demand letters, two termination notices

Rename `{ProjectName}_` per case (e.g., `OhioAMS_`, `AcmeInventory_`).

## Workflow — nine phases (read end-to-end)

The investigation runs through these phases in order. Each phase has a dedicated guide. Each phase produces evidence that strengthens the case independently; if a phase doesn't apply (e.g., no marketing site → skip Phase 5), document the absence in the master report rather than fabricating content.

| Phase | Guide | Output |
|---|---|---|
| 0 | `guides/00-principles.md` + `guides/01-intake.md` | `forensic-output/` skeleton, `case-facts.json` initialized |
| 1 | `guides/02-email-processing.md` | `individual-messages/M-####.md`, `threads/T-####.md`, top-sender table |
| 2 | `guides/03-invoice-extrapolation.md` | invoice JSONs, UNK-#### synthetic invoices, master Excel workbook |
| 3 | `guides/04-git-log-forensics.md` | per-commit + monthly-rollup JSONs, "Billed vs Delivered" variance table |
| 4 | `guides/05-cve-research.md` | CVE-per-update-window table |
| 5 | `guides/06-audit-log-analysis.md` | activity timeline, longest-gap-between-vendor-updates statement |
| 6 | `guides/07-marketing-analysis.md` | engagement-rate-vs-benchmark table, social-media overpayment calc |
| 7 | `guides/08-deliverable-synthesis.md` | 4 narrative reports (Word + PDF) + master zip |
| 8 | `guides/09-pre-litigation-pack.md` | 6 pre-litigation docs (Word + PDF) |

## Critical directives (the non-negotiables)

These are the Bee's guardrails. Surface them at the top of every deliverable and observe them at every step.

1. **Never provide legal advice.** Always frame findings as evidence for retained counsel to evaluate. Use "may constitute fraud under applicable law" rather than "this is fraud."
2. **Always cite source for every claim.** Every dollar amount, date, file, and finding must be traceable to a specific email (M-####), invoice number, git commit hash, audit-log row, or third-party report. A finding without coordinates is not actionable.
3. **Never fabricate evidence.** Document absences explicitly. If a phase doesn't apply, note it in the master report; do not invent data.
4. **Preserve all source materials unmodified.** Copy to `forensic-output/` and work from copies. The original archive is evidence.
5. **Apply the extrapolation rule conservatively.** First-and-last-observed at the same price → fill the gap. Different prices → ask before extrapolating across the boundary. Single observation → do not extrapolate at all; flag as "single occurrence."
6. **Use "intimidating through precision" in demand letters, not "intimidating through threats."** Precise legal terminology, specific dollar amounts, explicit litigation-hold language, and reservation-of-rights footers — YES. Threats to publicize, threats of criminal prosecution, threats of extra-legal harm — NO. See `guides/09-pre-litigation-pack.md` for the tone rules.
7. **Recommend retained counsel before any document is served.** The pre-litigation pack is templated work product. The Bee drafts; counsel serves.
8. **Treat the git log as the single most powerful artifact when available.** Git commits are cryptographically chained and cannot be fabricated.

A standalone `guides/00-principles.md` carries these directives plus the underlying reasoning. Read it first on every case.

## Parameterization (what changes per case)

The defendants, jurisdiction, and case-specific dollar figures change per case. The methodology does not.

### Defendant profiles
Each case fills in a `defendant-profile.md` per defendant using `templates/defendant-profile-template.md`. The profile captures: corporate structure, principals, MO, known personnel, jurisdiction, billing patterns, and any prior litigation involving the defendant that creates leverage.

The Example Booking Co. case profiles for ADA/Robert Hartwell and DevPipe/Sameer Khan are preserved as reference examples in `examples/example-case-a/defendant-profiles/`. Do not reuse them for sibling matters — fill in fresh profiles from the new case's evidence.

### Jurisdiction
The skill defaults to Ohio law (`research/jurisdiction-ohio.md`) because the calibration anchor (Example Booking Co.) involves Ohio-registered defendants. For cases in other venues, add `research/jurisdiction-{state}.md` with statutory citations parallel to the Ohio file. The Attorney Legal Memo template substitutes jurisdiction citations from this file.

### Industry analogy (Plain Language Report)
The Plain Language Report uses an extended analogy throughout. Default: "house construction" (you hired a contractor to build a house...). For clients in different industries, swap to a relatable analogy from `templates/plain-language-analogies.md`. Pick one and use it consistently throughout the report.

### Dollar figures
Every dollar figure is parameterized via `case-facts.json` (schema at `templates/case-facts-schema.json`). The docx builders read this file to substitute placeholders. Update `case-facts.json` as each phase produces new findings.

## File map

```
code-forensics-stinger/
├── SKILL.md                          (this file — main entry point)
├── README.md                         (one-page overview)
├── guides/
│   ├── 00-principles.md              (critical directives + rationale)
│   ├── 01-intake.md                  (Phase 0)
│   ├── 02-email-processing.md        (Phase 1)
│   ├── 03-invoice-extrapolation.md   (Phase 2)
│   ├── 04-git-log-forensics.md       (Phase 3)
│   ├── 05-cve-research.md            (Phase 4)
│   ├── 06-audit-log-analysis.md      (Phase 5)
│   ├── 07-marketing-analysis.md      (Phase 6)
│   ├── 08-deliverable-synthesis.md   (Phase 7)
│   └── 09-pre-litigation-pack.md     (Phase 8)
├── examples/
│   ├── example-case-a/          (the canonical worked example)
│   └── README.md                     (what each example demonstrates)
├── templates/
│   ├── defendant-profile-template.md
│   ├── case-facts-schema.json
│   ├── plain-language-analogies.md
│   ├── reports/                      (master, agency, attorney, plain-lang skeletons)
│   └── pre-litigation-pack/          (cover, findings, demand, termination)
├── scripts/
│   ├── parse_emails.py
│   ├── parse_invoices.py
│   ├── extrapolate_recurring.py
│   ├── build_invoice_xlsx.py
│   ├── parse_git_log.py
│   ├── build_master_report.js
│   ├── build_agency_report.js
│   ├── build_attorney_memo.js
│   ├── build_plain_language.js
│   ├── build_pre_litigation.js
│   ├── build_master_zip.py
│   ├── package.json
│   └── requirements.txt
├── reports/
│   └── master-report-shape.md        (template for the final master report)
└── research/
    ├── research-plan.md              (audit trail)
    ├── industry-pricing.md           (hosting / social / dev rate benchmarks)
    ├── cve-database-snapshot.md      (relevant CVEs by date)
    ├── jurisdiction-ohio.md          (default jurisdiction statutory authority)
    └── avada-changelog-archive.txt   (Avada theme changelog with SECURITY entries)
```

## How to start an investigation (the 30-second version)

When the user says "let's investigate {Project Name}":

1. Ask for: project name, date range, email archive (.eml files), invoices, git repo zip, audit reports, WordPress audit log if applicable, original signed contracts.
2. Run `scripts/parse_emails.py` on every email source directory (it dedupes automatically).
3. Run `scripts/parse_invoices.py` on the parsed emails + any invoice PDFs.
4. Run `scripts/extrapolate_recurring.py` to fill UNK invoices.
5. Run `scripts/parse_git_log.py` on the repo (if available).
6. Run `scripts/build_invoice_xlsx.py` to produce the master spreadsheet.
7. Update `case-facts.json` with totals.
8. Run the four docx builders (`build_master_report.js`, `build_agency_report.js`, `build_attorney_memo.js`, `build_plain_language.js`).
9. Convert all to PDF via `soffice --headless --convert-to pdf`.
10. Run `scripts/build_pre_litigation.js` to produce the 7-document pre-litigation pack.
11. Run `scripts/build_master_zip.py` to bundle everything.

Each step's full detail is in the corresponding guide under `guides/`. The Example Booking Co. V2 and V3 runs (in `examples/`) show the full output of each step.

## When something doesn't fit the template

Every case has quirks. The Example Booking Co. case had the Initial Build Vendor-then-Offshore Build pivot, the $6,000 → $4,000 Platinum Maintenance reduction, the examplebooking.example WordPress brochure site, and the August 2021 ACH Authorization that anchored the engagement before email archives existed. Future cases will have their own quirks.

Don't force the template — read the guides, understand the methodology, and adapt the language. Templates are starting points, not constraints.

That said: NEVER omit the nine phases. Each one produces evidence that strengthens the case independently. If a phase doesn't apply (e.g., no marketing site → skip Phase 5, no git repo → skip Phase 3), document why in the master report.
