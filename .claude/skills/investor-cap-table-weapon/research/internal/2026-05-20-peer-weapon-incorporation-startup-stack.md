---
source_url: .cursor/skills/incorporation-startup-stack-weapon/SKILL.md
retrieved_on: 2026-05-20
source_type: internal-peer-weapon
authority: high
relevance: medium
topic: meta
weapon: investor-cap-table-weapon
---

# Peer Weapon Cross-Reference: incorporation-startup-stack-weapon

## Summary
The incorporation-startup-stack-weapon is the upstream peer for investor-cap-table-weapon. It covers: entity-type decision (Delaware C-Corp vs LLC), formation platform selection (Stripe Atlas, Clerky, Doola, Firstbase), EIN acquisition, startup banking (Mercury, Brex, Relay), bookkeeping setup (Pilot, Bench - NOTE: Bench shut down December 27, 2024 and was reacquired, operational status must be verified), and the founder paperwork minimum including the 83(b) election (30-day hard deadline). The handoff between the two weapons is at first equity grant: incorporation-startup-stack-weapon handles everything before the cap table exists; investor-cap-table-weapon picks up from first equity grant.

## Key facts for handoff boundary
- 83(b) election: "30 calendar day hard deadline. No exceptions. IRS Form 15620 now enables electronic filing (available July 2025)."
- Bench shutdown: "Bench shut down December 27, 2024 and was reacquired. Current operational status must be verified before recommending."
- Mercury international risk: "Mercury executed mass account closures for sanctioned-country passport holders in August 2024."
- Correct formation order from peer weapon: "Entity formation → Stock purchase + vesting agreements → IP assignment (PIIA/CIIA) → 83(b) election within 30 calendar days → Banking setup → Bookkeeping setup"

## Annotations for weapon-forge
- The investor-cap-table-weapon does NOT need to cover the 83(b) election in depth - it should cross-link to incorporation-startup-stack-weapon's guides/05-founder-paperwork.md.
- The formation order from the peer weapon establishes that founder stock purchase + vesting agreements come immediately after entity formation - this is where investor-cap-table-weapon picks up.
- The Bench shutdown warning is relevant context: if a founder's bookkeeping is broken, their financial statements for the data room may be incomplete. A cross-reference in guides/07-data-room-checklist.md to verify bookkeeping provider status before preparing data room is worth including.
- The peer weapon explicitly excludes "cap-table management (Carta/Pulley), fundraising mechanics (SAFEs, priced rounds)" from its scope - confirming the clean handoff boundary.
