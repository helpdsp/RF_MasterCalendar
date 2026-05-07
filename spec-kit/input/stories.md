# User Stories — Invoices for Tax Team KT Document

---

## Story 1.1 — Functional Overview
**As** a new IT Administrator,
**I want** a plain-language description of what the Invoices for Tax Team solution does and why it exists,
**so that** I can explain it to IT Leadership and stakeholders without needing system access.

**Acceptance criteria:**
- [ ] Solution purpose stated in 1-2 paragraphs (shared mailbox → SharePoint migration)
- [ ] Business value articulated (storage relief, read-only enforcement, rich search)
- [ ] All user roles listed with their access level
- [ ] High-level flow described: email arrives → Power Automate → SharePoint → Tax Team searches
- [ ] Owner role: `engineering-technical-writer`

---

## Story 2.1 — Architecture Component Table
**As** a new IT Administrator,
**I want** a table of all M365 components with type, location, and URL,
**so that** I can locate every part of the solution in the Microsoft 365 admin portals.

**Acceptance criteria:**
- [ ] Site URL confirmed: `https://ruizfoods.sharepoint.com/sites/InvoiceforTaxTeam`
- [ ] All 4 libraries listed with URL path and item count
- [ ] PnP Modern Search v4 app listed with package name
- [ ] Power Automate flows listed (with gap flag if names unconfirmed)
- [ ] SharePoint Managed Properties listed as a component
- [ ] Owner role: `engineering-technical-writer`

## Story 2.2 — Architecture Diagram
**As** a new IT Administrator,
**I want** a text-based architecture diagram showing data flow,
**so that** I can understand how components connect without a separate diagram tool.

**Acceptance criteria:**
- [ ] Diagram shows: Source Mailboxes → Power Automate → SharePoint Libraries → Search Index → PnP Search UX → Tax Team
- [ ] AP and FA paths both represented
- [ ] Owner role: `engineering-technical-writer`

---

## Story 3.1 — Library Field Tables
**As** a new IT Administrator,
**I want** a complete field table for each of the 4 document libraries,
**so that** I know every column, its internal name, and its configuration.

**Acceptance criteria:**
- [ ] Table includes: Display Title, Internal Name, Type, Required, Hidden, Read-Only
- [ ] All 5 custom columns identified and distinguished from system fields
- [ ] Internal names verified against JSON exports (`Fiscal_x0020_Year`, `Received_x0020_Date`, `EMail`, `To`, `Subject`)
- [ ] Owner role: `engineering-technical-writer`

## Story 3.2 — Content Type Documentation
**As** a new IT Administrator,
**I want** the content type hierarchy and IDs documented,
**so that** I can recreate or modify content types if needed.

**Acceptance criteria:**
- [ ] Base CT `Invoice Document` documented with ID `0x010100E3917FC38B21344BB4F75ADAC1414E19`
- [ ] Child CTs `Accounts Payable` and `Fixed Asset` documented with their IDs
- [ ] Hierarchy diagram (parent → children) included
- [ ] Owner role: `engineering-technical-writer`

---

## Story 4.1 — AP Email-to-SharePoint Flow
**As** a new IT Administrator,
**I want** the step-by-step process for how AP emails become SharePoint documents,
**so that** I can troubleshoot or reconfigure the flow if it breaks.

**Acceptance criteria:**
- [ ] Each step numbered with actor (Power Automate / SharePoint / System)
- [ ] All metadata fields mapped: From, To, Subject, Received Date, Fiscal Year, Content Type
- [ ] Flow connector names identified
- [ ] Owner role: `engineering-technical-writer`

## Story 4.2 — FA Email-to-SharePoint Flow
**As** a new IT Administrator,
**I want** the Fixed Assets flow documented separately,
**so that** I can distinguish it from the AP flow when troubleshooting.

**Acceptance criteria:**
- [ ] Step-by-step process for FixedAssets@ruizfoods.com → Fixed Assets library
- [ ] Differences from AP flow noted
- [ ] Owner role: `engineering-technical-writer`

---

## Story 5.1 — Library Settings Reference
**As** a new IT Administrator,
**I want** a configuration reference for all 4 libraries,
**so that** I can verify current settings or restore them if accidentally changed.

**Acceptance criteria:**
- [ ] Each library: versioning on/off, moderation on/off, content types on/off, Quick Launch
- [ ] All 4 libraries covered
- [ ] Owner role: `engineering-technical-writer`

## Story 5.2 — View Definitions Reference
**As** a new IT Administrator,
**I want** all views documented with their CAML queries and URL slugs,
**so that** I can recreate a view if accidentally deleted.

**Acceptance criteria:**
- [ ] All 6 views per library documented (All Documents, Bulk Edit, assetLibTemp, Merge, Relink, RssView)
- [ ] CAML query for each non-system view included
- [ ] AP "Bulk Edit View" URL typo (`Not PDFs.aspx`) flagged with note
- [ ] Owner role: `engineering-technical-writer`

---

## Story 6.1 — Power Automate Flow Documentation
**As** a new IT Administrator,
**I want** each Power Automate flow documented with trigger and actions,
**so that** I can maintain or rebuild the flow without prior knowledge.

**Acceptance criteria:**
- [ ] Trigger: email arrives at shared mailbox
- [ ] Each action documented in sequence with connector name
- [ ] Service account identity documented (or flagged as gap if unconfirmed)
- [ ] Flow run history location documented (Power Automate portal)
- [ ] Owner role: `engineering-technical-writer`

---

## Story 7.1 — Landing Page & PnP Modern Search Documentation
**As** a new IT Administrator,
**I want** the SharePoint landing page and search experience documented,
**so that** I can reconfigure or troubleshoot the search web parts.

**Acceptance criteria:**
- [ ] Landing page URL documented
- [ ] PnP Modern Search v4 web parts listed: Search Box, Refiners, Results
- [ ] Both mockup screenshots cited as evidence
- [ ] Managed property mappings for refiners documented
- [ ] Owner role: `engineering-technical-writer`

---

## Story 8.1 — Permission Matrix
**As** a new IT Administrator,
**I want** a permission matrix for all roles across all libraries,
**so that** I can verify and enforce access control.

**Acceptance criteria:**
- [ ] Matrix: Tax Team Members = Read; IT Owners = Full Control; Service Account = Contribute
- [ ] Confirmation that permissions inherit from site (no broken inheritance)
- [ ] No moderation workflow (EnableModeration=false confirmed)
- [ ] Owner role: `engineering-technical-writer`

## Story 8.2 — User Management Procedures
**As** a new IT Administrator,
**I want** procedures to add and remove Tax Team members,
**so that** I can manage access without SharePoint Admin Center documentation.

**Acceptance criteria:**
- [ ] Step-by-step: how to add a user to the Site Members group (read-only)
- [ ] Step-by-step: how to remove a user
- [ ] Note on service account dependency for Power Automate
- [ ] Owner role: `engineering-technical-writer`

---

## Story 9.1 — Operational Runbook
**As** a new IT Administrator,
**I want** numbered step-by-step instructions for every routine admin task,
**so that** I can perform operations without prior knowledge of the system.

**Acceptance criteria:**
- [ ] Task: Add a user (read-only access)
- [ ] Task: Archive documents to FY library
- [ ] Task: Check Power Automate flow run history
- [ ] Task: Troubleshoot — email not appearing in SharePoint
- [ ] Task: Create a new fiscal year library
- [ ] Task: Update document metadata (admin only)
- [ ] Task: Access and modify PnP Modern Search configuration
- [ ] Each task has numbered steps executable by a new admin
- [ ] Owner role: `engineering-technical-writer`

---

## Story 10.1 — Data Snapshot
**As** a new IT Administrator,
**I want** confirmed item counts and field evidence from the live system,
**so that** I know the solution's data scale and can detect anomalies.

**Acceptance criteria:**
- [ ] Item counts: AP=173,704; FA=11,985; FY2023=16; FY2024=45,933; Total=231,638
- [ ] FY2023 low count anomaly noted with hypothesis
- [ ] Custom column presence confirmed from JSON exports
- [ ] Owner role: `engineering-technical-writer`

---

## Story 11.1 — Brand Compliance Table
**As** a new IT Administrator,
**I want** Ruiz Foods brand dimensions mapped to this solution's user-facing components,
**so that** any future updates maintain brand consistency.

**Acceptance criteria:**
- [ ] Brand dimensions listed: color, typography, logo/icons, tone of voice
- [ ] Each user-facing component mapped to relevant brand dimension
- [ ] Brand guideline PDF references cited
- [ ] Owner role: `engineering-technical-writer`
