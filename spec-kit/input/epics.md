# Epics — Invoices for Tax Team KT Document

Each epic maps to one required section of the KT document (`docs/KT-InvoicesForTaxTeam.md`).

---

## Epic 1 — Functional Overview (RF-01)
Document the solution's purpose, business value, user roles, and high-level email-to-SharePoint data flow in plain language for IT Leadership.

**Deliverable:** KT Section 1 — complete, no placeholders.

---

## Epic 2 — Architecture & Components (RF-02)
Document all Microsoft 365 components in scope: site URL, 4 document libraries with item counts and paths, content type hierarchy, Power Automate flows (2), PnP Modern Search v4 app package, SharePoint Managed Properties configuration. Include a text-based architecture diagram.

**Deliverable:** KT Section 2 — complete with component table and ASCII/text diagram.

---

## Epic 3 — Data Model (RF-03)
Document every field across all 4 document libraries: Display Title, Internal Name, Type, Required, Hidden, Read-Only, Notes. Document the content type hierarchy and all 5 custom site columns with their exact internal names from the JSON exports.

**Deliverable:** KT Section 3 — all field tables, CT hierarchy, custom column details.

---

## Epic 4 — Process Flow (RF-04)
Document the end-to-end email-to-SharePoint workflow: both AP and FA paths, actor per step, Power Automate trigger and actions, document creation and metadata stamping, search indexing.

**Deliverable:** KT Section 4 — step-by-step flow with actors and mockup references.

---

## Epic 5 — Configuration Reference (RF-05)
Document all library settings (versioning, moderation, content types, Quick Launch) and all views (title, URL slug, CAML query, row limit, default/hidden flags) for each of the 4 libraries. Flag the Accounts Payable "Bulk Edit View" URL typo (`Not PDFs.aspx`).

**Deliverable:** KT Section 5 — complete configuration tables per library.

---

## Epic 6 — Automation & Integration (RF-06)
Document the two Power Automate flows: trigger, every action in sequence, connector names (Office 365 Outlook, SharePoint), service account identity (gap — flag if unconfirmed), and how to access flow run history.

**Deliverable:** KT Section 6 — flow documentation with service account gap flagged.

---

## Epic 7 — Interface Documentation (RF-07)
Document the SharePoint site landing page and its PnP Modern Search v4 web parts (Search Box, Refiners, Results). Reference both mockup screenshots. Document managed property mappings for refiners. Document the Bulk Edit View as an admin-only interface.

**Deliverable:** KT Section 7 — page and web part documentation with mockup citations.

---

## Epic 8 — Permissions & Access (RF-08)
Document the permission matrix: all roles × all libraries × permission levels. Explain how read-only is enforced at site level. Provide procedures to add/remove Tax Team members and update the Power Automate service account.

**Deliverable:** KT Section 8 — permission matrix table and admin procedures.

---

## Epic 9 — Operational Runbook (RF-09)
Write numbered step-by-step instructions for every routine admin task: add user, archive documents, check flow history, troubleshoot missing emails, create new FY library, update document metadata, access PnP Modern Search config.

**Deliverable:** KT Section 9 — executable runbook with numbered steps.

---

## Epic 10 — Data Snapshot Evidence (RF-10)
Document confirmed library item counts (AP=173,704; FA=11,985; FY2023=16; FY2024=45,933; Total=231,638), confirmed field names from JSON exports, and note the FY2023 low count anomaly.

**Deliverable:** KT Section 10 — data snapshot table with evidence citations.

---

## Epic 11 — Brand Compliance (RF-11)
Map Ruiz Foods brand dimensions (color, typography, logo, tone of voice) to user-facing components of this solution (landing page, any visible page text, search experience). Reference the brand guideline PDFs.

**Deliverable:** KT Section 11 — brand compliance table.
