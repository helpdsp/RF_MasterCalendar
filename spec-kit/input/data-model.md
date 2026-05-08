# Data model — Local Project

> **VISION fallback:** Uses section 7 of the product PRD when a "## 7." heading is present; otherwise embeds an excerpt of the full PRD.

## Data model (no §7 heading found)

# Product PRD — Ruiz Foods Praise Program (Knowledge Transfer Document)

## 1. Product Summary

The **Praise Program** is an employee recognition solution built on Microsoft 365 at Ruiz Foods, Inc. It enables any employee to formally recognize a peer for demonstrating one of the company's Core Values. Submissions are routed through an HR approval workflow (Power Automate + Teams Approvals) before being published on the RuizNetPortal intranet.

This PRD defines the scope of the **Knowledge Transfer (KT) Document** to be produced — a comprehensive technical and functional reference that enables a new IT Administrator or developer to fully assume ownership of the production system.

The solution uses no custom code. All components are Microsoft 365-native: SharePoint Online Lists, Microsoft List Forms, Power Automate flows, Microsoft Teams Approvals App, and Outlook email notifications.

## 2. Users and Roles

- **Employee (submitter):** Any Ruiz Foods employee who submits a praise for a peer via the Microsoft List Form on the intranet.
- **Employee (recognized):** The employee being praised; receives a Congratulations email upon HR approval.
- **HR Manager:** Reviews and approves or rejects praise submissions via the Microsoft Teams Approvals App.
- **IT Administrator:** Manages SharePoint lists, list settings, Power Automate flows, permissions, and the intranet pages.

## 3. Functional Requirements

### RF-01 — Praise Submission

- The system shall allow any employee to submit a praise for a peer via the intranet entry point.
- The submission form shall collect: Praise for (employee), Core Value Demonstrated, Description, and Manager of the recognized employee.
- Submissions shall be stored in the **Praise** SharePoint list (internal name: Recognition) on the `/sites/RuizNetPortal/` site.
- The list shall enforce content moderation — submitted items are placed in Pending status until approved by HR.

### RF-02 — HR Approval Workflow

- A Power Automate flow shall trigger on each new Praise list item.
- The flow shall create an approval request in **Microsoft Teams Approvals App** and route it to HR Manager(s).
- The approval card shall surface: praised employee, submitter, Core Value Demonstrated, description, and manager.
- On **approval**: the list item moderation status shall be set to Approved; a Congratulations email shall be sent to the recognized employee.
- On **rejection**: the list item shall remain in a rejected/moderated state; the submitter may be notified.

### RF-03 — Published Praise Visibility

- Approved praises shall be visible on the **View Current Praises** SharePoint page.
- The default list view ("All Items") shall filter to show only Approved items, ordered newest first.
- The **Top 10 Recognitions** view shall display the 10 most recent approved praises in list format.
- The **Top 10 Recognitions Cards** view shall display the 10 most recent approved praises in card format.

### RF-04 — Employee Self-Service Views

- The **My submissions** view shall allow the submitting employee to see their own submissions grouped by moderation status.
- The **View Submitted Praises** SharePoint page shall surface this self-service view.

### RF-05 — Intranet Navigation

- The **Intranet Landing Page** shall provide links to both "Submit a Praise" and "View Praises" entry points.
- Navigation shall require no special permissions for read access to approved praises.

### RF-06 — Praise Cards Display

- The **Praise Cards** SharePoint list shall serve as the display-optimized companion list for card-layout rendering.
- Praise Cards fields: Title (Required), To (User, Required), From (User, Required), Icon (Text), Description (Note), Likes (UserMulti).

### RF-07 — Praise Archive

- The **Praise (Archive)** SharePoint list shall store historical praises migrated from the active Praise list.
- The Archive list shall maintain the same core field structure as the active list.

### RF-08 — Email Notifications

- A **Praise Alert Email** shall notify relevant parties of a new praise pending approval.
- A **Congratulations Email** shall be sent to the recognized employee upon HR approval.
- Both email templates shall comply with Ruiz Foods / El Monterey brand guidelines (colors, typography, logo, tone of voice).

### RF-09 — Brand Compliance

- All user-facing components (SharePoint pages, email templates, form copy) shall comply with:
  - Ruiz Foods corporate color palette (Learning Color Brand Guide)
  - El Monterey brand guidelines (logo usage, typography, tone of voice, icon style)
- The `Icon` field on Praise and Praise Cards lists stores brand-compliant icon identifiers.

### RF-10 — KT Document Coverage

The KT Document produced by this project shall document:
1. Functional overview and business value
2. Architecture and all M365 component inventory
3. Full data model for all three SharePoint lists (field names, internal names, types, constraints)
4. End-to-end process flow (submission → approval → publication)
5. List configuration (moderation, versioning, views, content types)
6. Power Automate flow logic (trigger, actions, approval connector, email actions)
7. SharePoint Pages inventory (pages, web parts, embedded views)
8. Permissions and access model (lists, views, flows, approvals)
9. Operational runbook (how to approve/reject, archive, onboard/offboard HR approvers)
10. Data snapshot evidence (CSV archives)
11. Brand compliance mapping (guidelines → component)

## 4. Non-Functional Requirements

- No new development: this is a documentation project only.
- All documented components are Microsoft 365-native — no custom code, SPFx, or third-party services.
- Document must be usable as a standalone reference without access to the production environment.
- KT Document must be maintained in Markdown format for version control.
- Brand guidelines must be cited by document name and section where referenced.

## 5. Data Model Overview

| List | Internal Name | Key Custom Fields | Moderation |
|---|---|---|---|
| Praise | Recognition | Praise for, Core Value Demonstrated, Description, Manager, Status, Department, Icon, Comments, Likes | Enabled |
| Praise (Archive) | — | Same core fields as Praise | — |
| Praise Cards | — | Title, To, From, Icon, Description, Likes | — |

SharePoint site: `/sites/RuizNetPortal/`

## 6. Acceptance Summary

The KT Document is complete when all 11 sections defined in RF-10 have been authored, reviewed against the refdocs evidence, and committed to the repository. Brand compliance must be documented for all user-facing components referencing both brand guide PDFs.
