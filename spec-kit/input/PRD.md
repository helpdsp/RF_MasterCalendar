# PRD — Invoices for Tax Team KT Document

## Overview

This PRD governs the production of a complete **Knowledge Transfer (KT) Document** for the Invoices for Tax Team solution at Ruiz Foods, Inc. The solution is an existing Microsoft 365 SharePoint Online deployment. The deliverable is `docs/KT-InvoicesForTaxTeam.md`.

---

## Problem Statement

The Invoices for Tax Team site has been in production since 2025 and is actively used by the Finance / Tax Team. There is no formal documentation for the solution. Any IT Administrator taking ownership must reverse-engineer the configuration from scratch — a risk to operational continuity and incident response.

---

## Objective

Produce a KT document that allows a new IT Administrator or developer to:
1. Understand the purpose, architecture, and data model of the solution.
2. Locate every component in Microsoft 365.
3. Perform all routine administrative tasks using step-by-step runbook instructions.
4. Troubleshoot common failures.
5. Maintain and extend the solution without vendor or prior-owner dependency.

---

## Functional Requirements

### RF-01 — Functional Overview
Document what the solution does, its business value, the roles that interact with it, and the high-level email-to-SharePoint flow in plain language suitable for IT Leadership.

### RF-02 — Architecture & Components
List all M365 components: site URL, 4 document libraries with paths and item counts, content type hierarchy, Power Automate flows, PnP Modern Search v4 app, SharePoint Managed Properties. Include a text-based architecture diagram showing: Source Mailboxes → Power Automate → SharePoint Libraries → PnP Search UX → Tax Team.

### RF-03 — Data Model
Document all 4 document libraries with full field tables (Display Title, Internal Name, Field Type, Required, Hidden, Read-Only, Notes). Document the content type hierarchy (Invoice Document → Accounts Payable, Fixed Asset) and all custom site columns: `Fiscal Year`, `Received Date`, `From (EMail)`, `To`, `Subject`.

### RF-04 — Process Flow
Document the end-to-end workflow step-by-step: email arrives at `AP@ruizfoods.com` / `FixedAssets@ruizfoods.com` → Power Automate trigger → metadata extraction → document creation in SharePoint → metadata stamp → document available in search. Actor per step. Both AP and FA paths.

### RF-05 — Configuration Reference
Document for each of the 4 libraries: list settings (versioning, moderation, content types, Quick Launch), all views with title, URL slug, CAML query, row limit, default flag, visibility. Document content type IDs and custom site column internal names.

### RF-06 — Automation / Integration
Document Power Automate flows: trigger (email on shared mailbox), actions in sequence (fetch email → extract metadata → create file → set column values), connector names (Office 365 Outlook, SharePoint), service account identity (gap — must be confirmed), flow run history location.

### RF-07 — Interface Documentation
Document SharePoint pages and the PnP Modern Search v4 experience: landing page URL, web parts used (search input, refiners panel, results panel), managed property mappings for refiners, mockup evidence for both empty and populated states.

### RF-08 — Permissions & Access
Document the permission matrix per library per role: Tax Team Members = Read; IT Owners = Full Control; Power Automate service account = Contribute. Document how to add/remove users and how to update the flow service account.

### RF-09 — Operational Runbook
Provide step-by-step admin instructions for: adding a user (read-only), archiving documents to FY library, checking Power Automate run history, troubleshooting missing emails, adding a new fiscal year library, updating document metadata, accessing PnP Modern Search configuration.

### RF-10 — Data Snapshot Evidence
Document item counts per library (AP=173,704; FA=11,985; FY2023=16; FY2024=45,933; Total=231,638), confirmed field presence, and note on FY2023 low count.

### RF-11 — Brand Compliance
Document Ruiz Foods brand dimensions applicable to this solution and map each user-facing component to the brand guideline.

---

## Non-Functional Requirements

- **NFR-01:** Zero instances of `TBD`, `TODO`, `[fill in]`, or placeholder text in the final KT document.
- **NFR-02:** Every SharePoint field documented with its exact internal name from the JSON/XML exports.
- **NFR-03:** Each operational task must have numbered steps a new admin can follow without prior knowledge.
- **NFR-04:** Do not correct production typos — document and flag them.
- **NFR-05:** If information is not available from refdocs, call it out explicitly as a gap.

---

## Success Criteria

- All 11 KT sections completed with no placeholders.
- All custom fields documented with internal names from JSON exports.
- A new IT admin can read the KT document and perform all operational tasks without system access.
