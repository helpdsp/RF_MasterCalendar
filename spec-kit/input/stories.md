# User Stories — Ruiz Foods Praise Program (KT Document)

## Story Index

| Story | Epic | KT Section | Owner Role |
|---|---|---|---|
| S-01 | E-01 | Functional Overview | technical-writer |
| S-02 | E-01 | Architecture & Components | technical-writer |
| S-03 | E-01 | Data Model | technical-writer |
| S-04 | E-01 | Process Flow | technical-writer |
| S-05 | E-02 | List Configuration & Views | technical-writer |
| S-06 | E-02 | Power Automate Flow | technical-writer |
| S-07 | E-02 | SharePoint Pages | technical-writer |
| S-08 | E-02 | Permissions & Access | technical-writer |
| S-09 | E-03 | Operational Runbook | technical-writer |
| S-10 | E-03 | Data Snapshot Evidence | technical-writer |
| S-11 | E-03 | Brand Compliance | technical-writer |

---

## S-01 — Functional Overview

- **As a** KT document reader (IT Admin or IT Leadership), **I want** a clear functional overview of the Praise Program **so that** I understand what it does, why it exists, and who uses it — without needing access to the system.
- **RF:** RF-01, RF-03, RF-04, RF-05
- **Acceptance criteria:**
  - [ ] Section explains the business purpose of the Praise Program and its value to Ruiz Foods
  - [ ] User roles documented: Employee (submitter), Employee (recognized), HR Manager, IT Admin
  - [ ] High-level end-to-end flow described in plain language (submit → approve → publish)
  - [ ] Entry points on the intranet described (Landing Page links)
  - [ ] No technical jargon in the leadership-facing summary

---

## S-02 — Architecture & Components

- **As a** new IT Admin, **I want** a complete inventory of all M365 components and how they connect **so that** I know exactly what exists in the tenant and where to find each piece.
- **RF:** RF-01, RF-02, RF-06, RF-07
- **Acceptance criteria:**
  - [ ] Component table lists all 11 components (3 lists, 1 form, 3 pages, 1 flow, 2 emails, 1 Teams Approvals entry point)
  - [ ] Architecture diagram (text-based) shows data flow from submission to publication
  - [ ] SharePoint site URL documented (`/sites/RuizNetPortal/`)
  - [ ] Power Automate environment and flow name documented
  - [ ] No third-party or custom code dependencies stated (confirmed M365-native)

---

## S-03 — Data Model

- **As a** new IT Admin, **I want** a complete field-level reference for all three SharePoint lists **so that** I can support, maintain, or recreate the data structure if needed.
- **RF:** RF-01, RF-06, RF-07
- **Acceptance criteria:**
  - [ ] Praise list: all custom fields documented with Display Title, Internal Name, Type, Required flag
  - [ ] Praise Cards list: all custom fields documented with same attributes
  - [ ] Praise (Archive) list: structure documented relative to Praise list
  - [ ] Key system fields documented (ID, Author, Created, _ModerationStatus)
  - [ ] Content moderation state machine explained (Pending → Approved/Rejected)
  - [ ] Schema XML files referenced as authoritative reconstruction source
  - [ ] CSV data files referenced as evidence

---

## S-04 — Process Flow

- **As a** KT document reader, **I want** a step-by-step process flow from praise submission to publication **so that** I understand the sequence of events, approval gates, and system interactions.
- **RF:** RF-01, RF-02, RF-03, RF-08
- **Acceptance criteria:**
  - [ ] Step-by-step flow documented: submit → Power Automate trigger → Teams approval → approve/reject branch → moderation update → email notification → intranet publication
  - [ ] Each step identifies the actor (Employee, HR Manager, Power Automate, SharePoint)
  - [ ] Approval and rejection paths both documented
  - [ ] Congratulations email trigger condition stated (approval only)
  - [ ] Evidence: mockup screenshots referenced for each step

---

## S-05 — List Configuration & Views

- **As a** new IT Admin, **I want** the complete list settings and view configuration for all three lists **so that** I can reconfigure, audit, or troubleshoot list behavior.
- **RF:** RF-03, RF-04, RF-07
- **Acceptance criteria:**
  - [ ] Praise list settings documented: content moderation ON, versioning ON, content types ON, Quick Launch hidden
  - [ ] All 7 views documented with: title, URL, default flag, CAML filter logic, row limit
  - [ ] Approve/reject Items view role for HR documented
  - [ ] My submissions view filter logic documented (Author = [Me])
  - [ ] Top 10 views row limit (10) documented
  - [ ] Hidden form view (Welcome to the Praise Form!) documented
  - [ ] Praise Archive list settings documented

---

## S-06 — Power Automate Flow

- **As a** new IT Admin, **I want** a step-by-step documentation of the Power Automate approval flow **so that** I can maintain, troubleshoot, and modify it.
- **RF:** RF-02, RF-08
- **Acceptance criteria:**
  - [ ] Flow trigger documented: SharePoint — When item is created, on Praise list
  - [ ] All flow actions documented in order with connector names
  - [ ] Approval step: who receives it, what fields are surfaced on the approval card
  - [ ] Condition branch: Approved path and Rejected path both documented
  - [ ] Moderation status update action documented (_ModerationStatus values)
  - [ ] Congratulations email action documented (recipient, trigger condition)
  - [ ] Flow location in Power Automate (environment, flow name) documented
  - [ ] Evidence: Power Automate PDF referenced

---

## S-07 — SharePoint Pages

- **As a** new IT Admin, **I want** an inventory of all SharePoint pages in the Praise Program **so that** I know what pages exist, what they show, and how to maintain them.
- **RF:** RF-03, RF-04, RF-05
- **Acceptance criteria:**
  - [ ] 3 pages documented: Intranet Landing, View Current Praises, View Submitted Praises
  - [ ] Each page: URL, purpose, web parts or embedded list views used
  - [ ] Intranet Landing Page links to Submit and View documented
  - [ ] View Current Praises: which list view is embedded documented
  - [ ] View Submitted Praises: "My submissions" view embedded documented
  - [ ] Evidence: mockup screenshots referenced for each page

---

## S-08 — Permissions & Access

- **As a** new IT Admin, **I want** a clear permissions matrix for the Praise Program **so that** I can manage access, onboard new HR approvers, and ensure data security.
- **RF:** RF-01, RF-02
- **Acceptance criteria:**
  - [ ] SharePoint list permissions documented per role (Employee, HR Manager, IT Admin)
  - [ ] "Approve Items" permission requirement for HR documented
  - [ ] How content moderation restricts non-HR view access documented
  - [ ] Power Automate flow ownership and sharing documented
  - [ ] How to add or remove an HR approver from the flow documented
  - [ ] Teams Approvals access — how HR Managers receive approvals documented

---

## S-09 — Operational Runbook

- **As a** new IT Admin or HR Manager, **I want** step-by-step instructions for all common operational tasks **so that** I can run the system day-to-day without specialized training.
- **RF:** RF-02, RF-07
- **Acceptance criteria:**
  - [ ] How to approve a praise in Teams Approvals App (step-by-step)
  - [ ] How to reject a praise in Teams Approvals App (step-by-step)
  - [ ] How to view pending praises in the SharePoint list (Approve/reject Items view)
  - [ ] How to archive old praises (manual process to Archive list)
  - [ ] How to add a new choice to the Core Value Demonstrated field
  - [ ] How to add or remove an HR approver in the Power Automate flow
  - [ ] How to check Power Automate flow run history for failures
  - [ ] How to update SharePoint page content

---

## S-10 — Data Snapshot Evidence

- **As a** KT document reader, **I want** production data snapshots included as evidence **so that** I can validate the documented structure against real data.
- **RF:** RF-10
- **Acceptance criteria:**
  - [ ] `Praise.csv` referenced and its structure described (column headers documented)
  - [ ] `Praise(Archive).csv` referenced and described
  - [ ] Item count noted (9 items in Praise list at time of export)
  - [ ] `Category` field values (Core Values) documented from data
  - [ ] `_ModerationStatus` numeric values confirmed from data (0, 1, 2)
  - [ ] Date range of data noted for both files

---

## S-11 — Brand Compliance

- **As a** new IT Admin or content maintainer, **I want** a brand compliance reference **so that** I know which brand guidelines apply to which components and can maintain brand consistency.
- **RF:** RF-09
- **Acceptance criteria:**
  - [ ] Both brand guide PDFs cited by name in the KT document
  - [ ] Color palette: components using brand colors documented (pages, email templates)
  - [ ] Typography: font usage per component documented (pages, emails)
  - [ ] Logo/icon usage: logo placement on intranet pages documented; Icon field role documented
  - [ ] Tone of voice: components with brand-compliant copy documented (form, emails)
  - [ ] Table mapping: brand dimension → affected component → brand guide reference
