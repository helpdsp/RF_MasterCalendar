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
