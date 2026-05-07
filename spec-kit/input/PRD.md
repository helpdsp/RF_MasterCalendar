# PRD — Local Project

## Product PRD (input)

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

## Executive brief

# Brief — Ruiz Foods Praise Program (Knowledge Transfer Document)

## Executive Summary

The **Praise Program** is an employee recognition solution deployed on Microsoft 365 at Ruiz Foods, Inc., hosted within the **RuizNetPortal** SharePoint Online site (`/sites/RuizNetPortal/`). The system has been in production for multiple years and enables any employee to formally recognize a peer for demonstrating one of the company's core values. Submissions go through an HR approval workflow before being published on the company intranet.

**Purpose of this project:** Produce a complete Knowledge Transfer (KT) Document that describes the existing production system — its components, data model, process flows, configuration, and administrative tasks — so that a new IT Administrator or developer can assume ownership and support/extend the solution without loss of knowledge.

**KT Document audience:**
- **New IT Admin / Developer:** Full technical ownership transfer (lists, flows, permissions, configuration)
- **IT Leadership / Management:** Scope and value of the solution, operational overview

## System Overview

| Attribute | Value |
|---|---|
| Solution name | Praise Program (Recognition) |
| Organization | Ruiz Foods, Inc. |
| Platform | Microsoft 365 (SharePoint Online, Power Automate, Teams, Outlook) |
| SharePoint site | `/sites/RuizNetPortal/` |
| Status | In production (active) |
| Document type | Knowledge Transfer (KT) — existing system documentation |

## Business Context

The Praise Program allows Ruiz Foods employees to recognize their peers for demonstrating **Core Values**. The recognition process is moderated — HR managers approve each submission before it is published on the intranet. Approved praises are visible to the entire organization on a dedicated SharePoint page and displayed as cards on the site's home page.

## Components Inventory

### 1. SharePoint Lists

| List | Internal Name | Description |
|---|---|---|
| **Praise** | Recognition | Active praise submissions. Content moderation enabled. |
| **Praise (Archive)** | — | Historical archive of older praises. |
| **Praise Cards** | — | Companion list for gallery/card-view rendering of approved praises. |

**Praise List — Key Custom Fields (non-system):**

| Display Title | Internal Name | Type | Required |
|---|---|---|---|
| Praise for | Recognitionfor | User | Yes |
| Core Value Demonstrated | Category | Choice | Yes |
| Description | Description | Note | Yes |
| Manager | Manager | User | Yes |
| Status | Status | Choice | No |
| Department | Department | Text | No |
| Icon | Icon | Text | No |
| Comments | Comments | Note | No |
| Likes | Likes | User | No |
| Praise from2 | Recognition_x0020_from | User | No |

**Praise Cards List — Key Custom Fields:**

| Display Title | Internal Name | Type | Required |
|---|---|---|---|
| Title | Title | Text | Yes |
| To | To | User | Yes |
| From | From | User | Yes |
| Icon | Icon | Text | No |
| Description | Description | Note | No |
| Likes | Likes | UserMulti | No |

**List Configuration (Praise):**
- Content types enabled: Yes
- Versioning: Enabled (major versions)
- Content moderation: **Enabled** (approval required before items appear in default view)
- Quick Launch: Hidden (accessed via SharePoint pages)

### 2. SharePoint List Views

| View Title | Default | Visibility | Purpose |
|---|---|---|---|
| All Items | Yes | Visible | Shows approved praises (moderation filter), ordered newest first |
| Approve/reject Items | No | Visible | HR managers — grouped by moderation status |
| My submissions | No | Visible | Employee's own submissions, grouped by status |
| Top 10 Recognitions | No | Visible | Latest 10 approved praises (list format) |
| Top 10 Recognitions Cards | No | Visible | Latest 10 approved praises (card format) |
| HomePage | No | Visible | Home page embedded view |
| Welcome to the Praise Form! | No | **Hidden** | Custom form entry point |

### 3. Microsoft List Form (Praise Submission)

A custom Microsoft List Form ("Welcome to the Praise Form!") is used as the submission interface. Employees fill in:
- Who they are praising (Praise for)
- Core Value Demonstrated (dropdown)
- Description of the recognition
- Manager of the recognized employee

### 4. SharePoint Pages

| Page | Purpose |
|---|---|
| Intranet Landing Page | Contains links to "Submit a Praise" and "View Praises" |
| View Current Praises | Displays approved praises as a gallery/list |
| View Submitted Praises | Shows the employee's own submitted praises |

### 5. Power Automate — Approval Flow

A Power Automate flow is triggered when a new praise is submitted. Flow behavior:
1. New item created in the Praise list triggers the flow
2. Flow creates an approval request via the **Microsoft Teams Approvals** connector
3. Approval request is sent to HR Manager(s)
4. HR Manager receives the request in **Teams Approvals App**
5. On approval: content moderation status on the list item is updated to Approved; Congratulations email is sent to the recognized employee
6. On rejection: item is rejected/moderated out; submitter may be notified

### 6. Microsoft Teams — Approvals App

HR Managers use the **Microsoft Teams Approvals App** to review and approve or reject praise submissions. The approval card includes:
- Praised employee name
- Submitter (Praise from)
- Core Value Demonstrated
- Description
- Manager information

### 7. Microsoft Outlook — Email Notifications

Two email templates are in use:
- **Praise Alert Email:** Notifies relevant parties of a new pending praise submission
- **Congratulations Email:** Sent to the recognized employee upon HR approval of their praise

## User Roles and Responsibilities

| Role | Responsibilities |
|---|---|
| **Employee (submitter)** | Submits praise for a peer via the intranet form |
| **Employee (recognized)** | Receives Congratulations email on approval |
| **HR Manager** | Reviews and approves/rejects praise submissions via Teams Approvals |
| **IT Admin** | Manages SharePoint lists, Power Automate flows, permissions, and list configuration |

## Data Model Summary

Three SharePoint lists form the data backbone:
- **Praise** — system of record for submissions (with approval workflow)
- **Praise (Archive)** — historical data
- **Praise Cards** — display-optimized companion list for card views

The `Category` (Core Value Demonstrated) field is a Choice column on the Praise list and is the primary classification dimension for recognitions.

## KT Document Scope

The KT Document to be produced must cover:

1. **Functional Overview** — What the system does, who uses it, business value
2. **Architecture & Components** — All M365 components, how they connect
3. **Data Model** — All three SharePoint lists with field inventory, types, and constraints
4. **Process Flow** — End-to-end submission-to-publication workflow with approval gates
5. **Configuration Reference** — List settings, view configurations, moderation settings
6. **Power Automate Flow** — Trigger, actions, approval logic, email notifications
7. **SharePoint Pages** — Page inventory, web parts, embedded views
8. **Permissions & Access** — Who has access to what (lists, views, flows, approval)
9. **Operational Runbook** — How to approve/reject, archive, add/remove users
10. **Data Snapshot** — CSV archives (Praise.csv, Praise Archive.csv) as evidence
11. **Brand Compliance** — Color palette, typography, logo/icon usage, and tone of voice mapped to each solution component

## Brand Guidelines

The solution's visual design and communication must comply with two official Ruiz Foods brand references provided in `refdocs/`:

| Document | Scope |
|---|---|
| `Learning Color Brand Guide.pdf` | Corporate color system — primary and secondary palette |
| `RZF003_22 El Monterey_Brand_Guidelines_10_27_22_v3.pdf` | El Monterey sub-brand guidelines (logo, typography, tone, icons) |

### Relevant Dimensions for the KT Document

| Dimension | Relevance to Praise Program |
|---|---|
| **Color palette** | SharePoint page theming, Power Automate email templates, Praise Card visual design |
| **Typography / fonts** | Font choices in SharePoint pages and email body |
| **Logo & icon usage** | Logo placement on intranet pages; `Icon` field values on Praise and Praise Cards lists |
| **Tone of voice / messaging** | Copy in the submission form, approval emails, and congratulations email must reflect brand voice |

The KT Document must include a Brand Compliance section that references both guidelines and maps each brand dimension to the specific component where it applies (pages, emails, form copy, icons).

## Non-Goals / Out of Scope

- No new development or feature additions
- No migration to other platforms
- No changes to existing list structure, flows, or permissions
- No PowerApps or custom SPFx development

## Evidence / Reference Inputs

| File | Type | Used for |
|---|---|---|
| Praise-Fields.json | JSON | Praise list field inventory |
| Praise-Properties.json | JSON | Praise list configuration |
| Praise-Views.json | JSON | Praise list views |
| Praise(Archive)-Fields/Properties/Views.json | JSON | Archive list configuration |
| Praise Cards-Fields/Properties/Views.json | JSON | Praise Cards list configuration |
| Praise-Schema.xml | XML | Full list schema |
| Praise(Archive)-Schema.xml | XML | Archive list schema |
| Praise Cards-Schema.xml | XML | Cards list schema |
| Praise.csv | CSV | Live data sample |
| Praise(Archive).csv | CSV | Historical data |
| Praise Program.pptx | PPTX | Program presentation/overview |
| Power Automate - Approvals - Praise Submission (...).pdf | PDF | Approval flow evidence |
| Mirosoft Outlook - Congratulations Email.pdf | PDF | Email notification evidence |
| mockups/*.jpg | Images | UI evidence for all system screens |
| HumanResources-PraiseProgram_*.zip | ZIP | Additional HR artifacts |
| Learning Color Brand Guide.pdf | PDF | Corporate color palette reference |
| RZF003_22 El Monterey_Brand_Guidelines_*.pdf | PDF | El Monterey brand: logo, typography, tone of voice, icons |

## Goals

- Ship software that satisfies the product PRD above.
- Refine this engineering PRD after structured generation when LOCAL_IDE_AI_COMMAND is available.
