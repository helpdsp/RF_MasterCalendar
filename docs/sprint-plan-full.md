---
title: "SWUK Central Submissions — Sprint Plan"
subtitle: "All Sprints & Task Breakdown"
author: "UK Shared Services — Digital Solutions"
date: "April 2026"
---

# Project Overview

**Project**: SWUK Central Submissions (Prepayment)
**Platform**: Microsoft 365 — SharePoint Online, Power Automate, Microsoft Teams
**Total Effort**: ~128 Hours across 3 sprints (~4 weeks)

| Sprint | Focus | Timeline | Effort | Status |
| :--- | :--- | :--- | :--- | :--- |
| Sprint 1 | Core Framework & Provisioning Script | Weeks 1–1.5 | 36 hrs | **Active** |
| Sprint 2 | Regional Rollout — 23 Plants | Weeks 1.5–3 | 92 hrs | Planned |
| Sprint 3 | QA, Automation & Finance Handover | Week 4 | Included | Planned |

---

# Sprint 1 — Core Framework & Provisioning Script

**Timeline**: Weeks 1–1.5 | **Effort**: 36 hours | **Status**: Active

## Goal

Build the core infrastructure foundation with the **PnP PowerShell 1.5.0 provisioning script as the priority deliverable**. A battle-tested script compresses Sprint 2 from a manual, plant-by-plant effort into largely automated batch execution — directly reducing delivery risk and total time.

Priority order:

1. **Develop, iterate, and pilot-test the PnP PowerShell provisioning script** against at least one plant end-to-end before Sprint 2 begins.
2. Develop and harden the Power Automate Consolidation Flow (manual monthly trigger).
3. Create the reusable Plant Page template.

> **Capacity note**: If sprint tasks complete ahead of the 1.5-week window, remaining time is made available to the Finance Team for other SharePoint-related tasks within the `GBR-UK-Shared-Services` site.

## Stories

| Story | Description | Status |
| :--- | :--- | :--- |
| ~~ST-1.1~~ | ~~Define and create the "Prepayment Item" Site Content Type and associated Site Columns.~~ | Done (POC) |
| ST-1.2 ⭐ | Develop the **PnP PowerShell 1.5.0** script for automated provisioning of security groups and lists. Includes end-to-end pilot run on at least one plant. | Done |
| ST-1.3 | Provision SharePoint Security Groups for all 23 plants following the `[Plant Code] Members` convention. | To Do |
| ST-1.4 | Configure base permissions at the site level to allow group discovery while maintaining isolation. | To Do |
| ST-2.1 | Execute PnP script to create Prepayment Request lists for each UK plant (NOC, WEA, SBG, etc.). | To Do |

## Task Breakdown

| Task ID | Description | Story | Role | Points | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| T-001 | ~~Define and create the "Prepayment Item" Site Content Type and Site Columns.~~ *(Completed via POC — no rework required.)* | ST-1.1 | Frontend | 3 | **Done** |
| T-002 ⭐ | Develop and fully test the PnP PowerShell 1.5.0 provisioning script. Includes end-to-end pilot run against at least one plant. | ST-1.2 | Backend | 5 | **Done** |
| T-003 | Provision SharePoint Security Groups for all 23 plants following the `[Plant Code] Members` convention using the script. | ST-1.3 | QA | 3 | To Do |
| T-004 | Configure base permissions at the site level to allow group discovery while maintaining isolation. | ST-1.4 | PM | 3 | To Do |
| T-005 | Execute PnP script to create Prepayment Request lists for each UK plant (NOC, WEA, SBG, etc.). | ST-2.1 | Deploy | 3 | To Do |

**Sprint 1 Points**: 17 total | 8 done | 9 remaining

## QA & Acceptance Criteria

| Story | Acceptance Criteria |
| :--- | :--- |
| ST-1.1 | "Prepayment Item" Content Type exists at site level with all required fields. *(No re-testing needed — delivered via POC.)* |
| ST-1.2 ⭐ | Script provisions a pilot plant end-to-end: security group created, list created with Content Type applied, permissions broken and assigned. Script must be idempotent (re-runnable without duplicating artefacts). |
| ST-1.3 | All 23 `[Plant Code] Members` groups exist in the site with correct naming convention. |
| ST-1.4 | Site-level permissions allow group discovery. Users can be added to a plant group without Site Admin rights. |
| ST-2.1 | At least one plant list exists with Prepayment Item Content Type, correct views (Pending / Processed), and isolated permissions. |

**Risks**

| Risk | Likelihood | Mitigation |
| :--- | :--- | :--- |
| PnP script incompatibility with tenant permissions | Medium | Test against dev account (`s2-gis-mxl1-msflows@smurfitkappa.com`) before production run |
| Script run time exceeds window for 23 plants | Low | Pilot on 1 plant first; batch remaining in Sprint 2 |
| Sprint 1 completes early | Low–Medium | Remaining capacity redirected to Finance Team SharePoint tasks |

---

# Sprint 2 — Regional Rollout (23 Plants)

**Timeline**: Weeks 1.5–3 | **Effort**: Up to 92 hours (23 plants × 4h baseline) | **Status**: Planned

## Goal

Provision and secure all 23 "Spoke" lists using the script built and validated in Sprint 1. The script automation is expected to reduce actual effort below the 92-hour baseline — the 4h/plant estimate was based on manual configuration.

## Stories

| Story | Description | Status |
| :--- | :--- | :--- |
| ST-2.2 | Break permission inheritance and assign unique group permissions via automation. | To Do |
| ST-2.3 | Configure "Pending" and "Processed" views and integrate lists into Microsoft Teams App Tabs. | To Do |
| ST-2.4 | Provision Site Pages for each plant using the reusable Plant Template. | To Do |
| ST-3.1 | Create the "Plant Master List" for system configuration. | To Do |
| ST-3.2 | Create the "Prepayment Request Master List" for data aggregation. | To Do |

## Task Breakdown

| Task ID | Description | Story | Role | Points | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| T-001 | Break permission inheritance and assign unique group permissions for all 23 plant lists via the PnP script. | ST-2.2 | Frontend | 3 | To Do |
| T-002 | Configure "Pending" and "Processed" views on all plant lists and integrate into Microsoft Teams App Tabs. | ST-2.3 | Backend | 3 | To Do |
| T-003 | Provision Site Pages for each plant using the reusable Plant Page template. | ST-2.4 | QA | 3 | To Do |
| T-004 | Create the "Plant Master List" (Facilities Master List) for system configuration and Power Automate reference. | ST-3.1 | PM | 3 | To Do |
| T-005 | Create the "Prepayment Request Master List" for central Finance data aggregation. | ST-3.2 | Deploy | 3 | To Do |

**Sprint 2 Points**: 15 total | 0 done | 15 remaining

## QA & Acceptance Criteria

| Story | Acceptance Criteria |
| :--- | :--- |
| ST-2.2 | A user from Plant A receives "Access Denied" when attempting to access Plant B's list. Each plant list has broken inheritance with only its own `[Plant Code] Members` group assigned Contribute rights. |
| ST-2.3 | "Pending" view shows items where `Processed = No`. "Processed" view shows items where `Processed = Yes`. Lists render correctly inside Microsoft Teams App Tab. |
| ST-2.4 | Each plant has a dedicated SharePoint page displaying its submission list, accessible via Teams or browser. |
| ST-3.1 | Facilities Master List contains all 23 plants with SAP Code, List Name, Group ID, and Active fields populated. |
| ST-3.2 | Prepayment Request Master List exists with all Prepayment Item fields plus Source Plant and Master Processed Date. |

**Risks**

| Risk | Likelihood | Mitigation |
| :--- | :--- | :--- |
| Teams App Tab configuration per plant is time-consuming | Medium | Use bulk configuration approach; template the Teams tab settings |
| Plant Master List data incomplete at sprint start | Low | Pre-populate during Sprint 1 pilot run |

---

# Sprint 3 — QA, Automation & Finance Handover

**Timeline**: Week 4 | **Effort**: Included in previous estimates | **Status**: Planned

## Goal

Validate the platform end-to-end, complete the Power Automate consolidation engine, and leave the Finance Team fully self-sufficient — able to trigger the monthly consolidation and onboard new plants independently.

## Stories

| Story | Description | Status |
| :--- | :--- | :--- |
| ST-3.3 | Develop the Power Automate "Consolidation Flow" to dynamically iterate through the Plant Master List. | To Do |
| ST-3.4 | Implement the "Sealing" logic to set processed items to read-only in source lists post-consolidation. | To Do |
| ST-4.1 | Conduct functional testing per plant and end-to-end consolidation testing. | To Do |
| ST-4.2 | Produce "Plant Onboarding" documentation for Finance. | To Do |
| ST-4.3 | Deliver Knowledge Transfer (KT) session to the Finance Team for self-management. | To Do |

## Task Breakdown

| Task ID | Description | Story | Role | Points | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| T-001 | Develop the Power Automate "Consolidation Flow" to dynamically read the Facilities Master List and iterate through all active plants. | ST-3.3 | Frontend | 3 | To Do |
| T-002 | Implement "Sealing" logic — break role inheritance on consolidated items, assign Read to plant group, Full Control to Site Owners. | ST-3.4 | Backend | 3 | To Do |
| T-003 | Conduct functional testing (per-plant isolation) and end-to-end consolidation testing with real plant data. | ST-4.1 | QA | 3 | To Do |
| T-004 | Produce "Plant Onboarding" documentation for the Finance Team (step-by-step guide to onboard a new plant independently). | ST-4.2 | PM | 3 | To Do |
| T-005 | Deliver Knowledge Transfer session to the Finance Team covering: manual trigger, Master List management, plant onboarding. | ST-4.3 | Deploy | 3 | To Do |

**Sprint 3 Points**: 15 total | 0 done | 15 remaining

## QA & Acceptance Criteria

| Story | Acceptance Criteria |
| :--- | :--- |
| ST-3.3 | Consolidation Flow reads Facilities Master List, queries each active plant list for unprocessed items, and creates them in the Master List with correct field mapping. New plants added to the Master List are automatically included — no flow edits required. |
| ST-3.4 | After consolidation, source items are read-only for the plant group. Items have `Processed On` timestamp. Submitter cannot amend a processed item. |
| ST-4.1 | All 23 plant lists tested for isolation. End-to-end consolidation run with data from at least 3 plants. Zero data loss or duplication. |
| ST-4.2 | Finance Team can onboard a new test plant using only the documentation — without IT assistance. |
| ST-4.3 | Finance Team can independently: trigger the monthly consolidation, review the Master List, and initiate a new plant onboarding. |

**Risks**

| Risk | Likelihood | Mitigation |
| :--- | :--- | :--- |
| Power Automate flow throttling on large runs (23 plants) | Medium | Use concurrency controls in the flow; test with full plant set before UAT |
| Finance Team availability for KT session | Low | Schedule KT early in the sprint window |

---

# Summary — All Sprints

| Task ID | Sprint | Story | Description | Points | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| S1-T-001 | Sprint 1 | ST-1.1 | Define "Prepayment Item" Content Type *(Done via POC)* | 3 | **Done** |
| S1-T-002 | Sprint 1 | ST-1.2 | Develop & pilot PnP PowerShell provisioning script ⭐ | 5 | **Done** |
| S1-T-003 | Sprint 1 | ST-1.3 | Provision Security Groups for all 23 plants | 3 | To Do |
| S1-T-004 | Sprint 1 | ST-1.4 | Configure base site permissions | 3 | To Do |
| S1-T-005 | Sprint 1 | ST-2.1 | Execute PnP script — create all plant lists | 3 | To Do |
| S2-T-001 | Sprint 2 | ST-2.2 | Break permission inheritance on all plant lists | 3 | To Do |
| S2-T-002 | Sprint 2 | ST-2.3 | Configure views & Teams App Tab integration | 3 | To Do |
| S2-T-003 | Sprint 2 | ST-2.4 | Provision Site Pages per plant | 3 | To Do |
| S2-T-004 | Sprint 2 | ST-3.1 | Create Facilities Master List | 3 | To Do |
| S2-T-005 | Sprint 2 | ST-3.2 | Create Prepayment Request Master List | 3 | To Do |
| S3-T-001 | Sprint 3 | ST-3.3 | Develop Power Automate Consolidation Flow | 3 | To Do |
| S3-T-002 | Sprint 3 | ST-3.4 | Implement Sealing logic | 3 | To Do |
| S3-T-003 | Sprint 3 | ST-4.1 | Functional & end-to-end testing | 3 | To Do |
| S3-T-004 | Sprint 3 | ST-4.2 | Produce Plant Onboarding documentation | 3 | To Do |
| S3-T-005 | Sprint 3 | ST-4.3 | Deliver Finance Team KT session | 3 | To Do |

**Total points**: 47 | **Done**: 8 | **Remaining**: 39

---

*Document version 1.0 — April 2026. SWUK Central Submissions — UK Shared Services Digital Solutions.*
