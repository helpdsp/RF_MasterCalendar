# PRD — Ruiz Foods Master Calendar KT Document

## Product Vision

Produce a complete, accurate, and self-sufficient Knowledge Transfer document for the Ruiz Foods Master Calendar SharePoint Online solution, enabling a new IT administrator to take full ownership of the solution without requiring direct knowledge transfer from the original builder or access to the live system beyond what is documented.

## Business Context

The Master Calendar has been in production since 2024 on the Ruiz Foods Corporate Intranet (`https://ruizfoods.sharepoint.com/sites/RuizNetPortal`). It was originally requested by Jesse Sowell as an "Op Co Calendar" and expanded by Sal G to serve all Ruiz Foods employees. The solution is fully Microsoft 365-native: no custom code, no SPFx, no third-party services.

Three of four Power Automate flows are currently suspended (auto-disabled by Microsoft for inactivity). This is the most urgent operational issue and must be prominently documented with remediation steps.

## Deliverable

**Primary:** `docs/KT-MasterCalendar.md` — a single Markdown document with all 11 KT sections, checked into this git repository.

**No Word document is required** — Markdown in git is the agreed output format (see `planning/clarifications/brief.json`).

## Functional Requirements

### RF-01 — Section 1: Functional Overview
Document what the solution does, who uses it, and its business value in language suitable for IT Leadership (non-technical). Include a high-level architecture diagram (text-based).

### RF-02 — Section 2: Architecture & Components
List every M365 component with type, platform, URL, and identifier. Include a data-flow diagram.

### RF-03 — Section 3: Data Model
Document both SharePoint lists completely:
- Every field: Display Title, Internal Name, TypeAsString, Required, choices, notes
- List settings: ID, URL, BaseTemplate, versioning, moderation, item count, content types
- `Master Calendar` custom fields: Date, Date End, Category (15 choices), Master Calendar Sync ID
- `Master Calendar Sync` custom fields: Master Calendar ID; standard calendar fields

### RF-04 — Section 4: Process Flow
Document the end-to-end employee subscription journey step-by-step (Actor / Step / System action / Mockup) covering happy path and the suspended-flow failure branch.

### RF-05 — Section 5: Configuration Reference
Document all list views with CAML queries, row limits, ViewFields. Document list settings. Note the `/Lists/mc` URL alias for the Master Calendar list.

### RF-06 — Section 6: Automation / Integration
Document all four Power Automate flows:
- Display name, flow ID, trigger details, every action in order, connector/operation names, field mappings
- Suspension status for each flow (New Item: ACTIVE; Update Item: SUSPENDED 2025-11-14; Delete Item: SUSPENDED 2025-09-08; Subscribe: SUSPENDED 2025-09-08)
- Reactivation procedure for suspended flows
- Microsoft Forms: form ID, webhook trigger behavior
- `stssync://` link anatomy

### RF-07 — Section 7: Interface Documentation
Document every user-facing interface: SharePoint Modern page (URL, web parts), Master Calendar list (modern), Master Calendar Sync list (classic), Microsoft Forms subscription form, subscription email (HTML structure).

### RF-08 — Section 8: Permissions & Access
Document permission matrix per list per role. Service account `0365-PA-FLOWSVCG@ruizfoods.com` required as contributor on both lists. Both lists have unique role assignments.

### RF-09 — Section 9: Operational Runbook
Step-by-step instructions for all routine admin tasks: add/edit/delete event, reactivate suspended flow, prevent future suspension, annual year update, troubleshoot Outlook sync, check flow run history, add department coordinator.

### RF-10 — Section 10: Data Snapshot Evidence
Document current item counts (both lists: 160 items as of 2026-05-17), export date, confirmed field values, Category choices from live export.

### RF-11 — Section 11: Brand Compliance
Map brand elements to user-facing components. Colors: green `#008345`, blue `#0066cc`. Logo: `/SiteAssets/__sitelogo__ruizsitelogo.png`. Email tone: professional, welcoming. Note all production typos.

## Quality Gates (Definition of Done)

- [ ] No placeholder text (`TBD`, `TODO`, `[fill in]`)
- [ ] All fields have Internal Names from JSON/XML exports
- [ ] Category choice values confirmed from `Master Calendar-ListSettings.json`
- [ ] All 4 flows documented with suspension status
- [ ] All 8 mockups referenced in appropriate sections
- [ ] Runbook is executable (numbered steps, no assumed knowledge)
- [ ] Brand compliance table covers all user-facing components
- [ ] Production typos documented as-is: "Suscribe" (flow name), "Siscribed" (mockup filename)
- [ ] Service account `0365-PA-FLOWSVCG@ruizfoods.com` documented as flow runner
- [ ] Both lists have own permission rows in the permissions matrix
- [ ] `stssync://` link compatibility limitation (Windows Outlook desktop only) documented
