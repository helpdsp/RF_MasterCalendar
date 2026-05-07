# Test Plan — Ruiz Foods Praise Program (KT Document)

## Purpose

This plan defines how to verify that the KT Document is complete, accurate, and usable by its two target audiences. Since the output is a documentation artifact (not software), "testing" means **reviewing each section against production evidence** (refdocs).

---

## Review Dimensions

| Dimension | Description |
|---|---|
| **Completeness** | Does every required section exist and contain substantive content? |
| **Accuracy** | Does the content match the refdocs (schemas, CSVs, mockups, PDFs)? |
| **Usability** | Can a new IT Admin perform the task described without additional help? |
| **Brand accuracy** | Are brand guidelines cited correctly for the right components? |

---

## Test Cases by Story

### TC-01 — Functional Overview

| Check | Evidence |
|---|---|
| Business purpose stated | Praise Program.pptx |
| User roles listed (4 roles) | product-prd.md §2 |
| High-level flow in plain language | mockups/*.jpg |
| Intranet entry points described | mockup: Intranet Landing Page.jpg |
| No technical jargon in leadership summary | Reviewer judgment |

### TC-02 — Architecture & Components

| Check | Evidence |
|---|---|
| All 11 components listed | technical-spec.md component table |
| Architecture diagram present | technical-spec.md |
| SharePoint URL correct | Praise-Properties.json — RootFolderServerUrl |
| Power Automate flow referenced | Power Automate PDF |
| M365-native confirmed (no custom code) | All refdocs — no code files present |

### TC-03 — Data Model

| Check | Evidence |
|---|---|
| Praise list: all custom fields with Internal Name | Praise-Fields.json |
| Praise Cards list: all custom fields | Praise Cards-Fields.json |
| Praise Archive list documented | Praise(Archive)-Fields.json |
| _ModerationStatus values documented (0, 1, 2) | Praise-Views.json (CAML filter) |
| Schema XML files referenced | Praise-Schema.xml, etc. |
| List ID matches export | Praise-Properties.json — Id field |

### TC-04 — Process Flow

| Check | Evidence |
|---|---|
| Submit step documented | mockup: Praise Form Blank.jpg |
| Approval card step documented | mockup: Teams Approvals App.jpg + Power Automate PDF |
| Approval branch documented | mockup: Approval Experience for HR Managers.jpg |
| Rejection path documented | Power Automate PDF |
| Congratulations email step documented | Mirosoft Outlook - Congratulations Email.pdf |
| Alert email step documented | mockup: Microsoft Outlook - Praise Email Alert.jpg |

### TC-05 — List Configuration & Views

| Check | Evidence |
|---|---|
| Content moderation ON confirmed | Praise-Properties.json — EnableModeration: true |
| Versioning ON confirmed | Praise-Properties.json — EnableVersioning: true |
| All 7 views documented | Praise-Views.json (7 views) |
| Default view filter (Approved only) | Praise-Views.json — AllItems ViewQuery |
| My submissions filter (Author=[Me]) | Praise-Views.json — my-sub ViewQuery |
| Top 10 row limit confirmed | Praise-Views.json — RowLimit: 10 |

### TC-06 — Power Automate Flow

| Check | Evidence |
|---|---|
| Trigger: SharePoint — item created | Power Automate PDF |
| Approval action documented | Power Automate PDF — approval step screenshot |
| Approval card fields listed | mockup: Teams Approvals App — Praise Request.jpg |
| Moderation status update documented | technical-spec.md §8 |
| Congratulations email recipient documented | Mirosoft Outlook - Congratulations Email.pdf |
| Flow run location documented | Power Automate PDF |

### TC-07 — SharePoint Pages

| Check | Evidence |
|---|---|
| 3 pages documented | mockups: 3 SharePoint page screenshots |
| Intranet Landing Page links documented | mockup: Intranet Landing.jpg |
| View Current Praises page described | mockup: View Current Praises Page.jpg |
| View Submitted Praises page described | mockup: View Submitted Praises.jpg |
| Each page references its mockup | mockups/*.jpg |

### TC-08 — Permissions & Access

| Check | Evidence |
|---|---|
| Employee contribute permission documented | Praise-Views.json — My submissions filter |
| Approve Items permission for HR documented | Praise-Properties.json — EnableModeration |
| Moderation visibility restriction documented | Praise-Views.json — AllItems filter |
| Flow ownership documented | Power Automate PDF |
| How to add HR approver documented | technical-spec.md §4 |

### TC-09 — Operational Runbook

| Check | Evidence |
|---|---|
| Approve in Teams Approvals: step-by-step | mockup: Teams Approvals - Approval Experience.jpg |
| Reject in Teams Approvals: step-by-step | mockup: Teams Approvals App.jpg |
| View pending praises in list: step-by-step | Praise-Views.json — mod-view |
| Archive old praises: documented | data-model.md |
| Add Core Value choice: documented | Praise-Fields.json — Category field |
| Add/remove HR approver: documented | technical-spec.md |
| Check flow run history: documented | technical-spec.md §11 |

### TC-10 — Data Snapshot Evidence

| Check | Evidence |
|---|---|
| Praise.csv column headers documented | Praise.csv |
| Praise(Archive).csv referenced | Praise(Archive).csv |
| Item count (9) noted | Praise-Properties.json — ItemCount: 9 |
| Category field values listed | Praise.csv — Category column |
| ModerationStatus values confirmed | Praise-Views.json — CAML |

### TC-11 — Brand Compliance

| Check | Evidence |
|---|---|
| Learning Color Brand Guide.pdf cited | refdocs/ |
| El Monterey Brand Guidelines PDF cited | refdocs/ |
| Color palette → SharePoint pages mapped | brand-guidelines.md (KT section) |
| Typography → emails and pages mapped | brand-guidelines.md |
| Logo/icon → intranet pages and Icon field mapped | brand-guidelines.md |
| Tone of voice → form copy and emails mapped | brand-guidelines.md |

---

## Acceptance Sign-Off

The KT Document passes review when:

- [ ] All 11 TC checklists above are checked off
- [ ] Zero `TBD`, `TODO`, or placeholder text remains in the document
- [ ] At least one refdoc reference per section
- [ ] IT Admin reviewer confirms runbook tasks are executable
- [ ] IT Leadership reviewer confirms functional overview is understandable without system access
- [ ] Brand compliance section reviewed by stakeholder owning brand guidelines
