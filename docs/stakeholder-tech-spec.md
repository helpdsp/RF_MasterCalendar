---
title: "SWUK Central Submissions — Prepayment Platform"
subtitle: "Technical Specification for Stakeholders"
author: "UK Shared Services — Digital Solutions"
date: "April 2026"
---

# Executive Summary

Smurfit Westrock UK currently manages prepayment requests through a fragmented, plant-by-plant process that requires manual coordination and lacks centralised visibility. This document describes the design and delivery plan for the **SWUK Central Submissions** platform — a secure, automated solution built on **Microsoft 365** that will give the UK Shared Services Finance Team a single, consolidated view of all prepayment requests across all 23 UK plants, while ensuring each plant can only access its own data.

The platform requires no new software licences. It is built entirely on existing Microsoft 365 infrastructure (SharePoint Online, Power Automate, and Microsoft Teams) and is designed to be **self-managed by the Finance Team** once delivered — including the ability to onboard new plants independently.

---

# 1. Business Context & Objectives

## 1.1 Problem Statement

The current process requires Finance to manually collect, reconcile, and consolidate prepayment submission data from 23 plants operating in isolation. This creates three critical risks:

- **Incomplete visibility**: No single source of truth exists for the full UK division.
- **Data integrity exposure**: Manual aggregation introduces errors and version conflicts.
- **Scalability gap**: Adding a new plant requires significant manual setup effort.

## 1.2 Strategic Objectives

| Objective | What it means in practice |
| :--- | :--- |
| **Centralisation** | One master view of all 23 plants' prepayment requests, always current. |
| **Data Isolation** | Each plant can only see and submit its own data — enforced at platform level, not by policy. |
| **Automation** | Monthly consolidation runs with a single button click by a Finance Manager. |
| **Self-Management** | Finance Team can onboard new plants or extend the system without IT dependency. |

---

# 2. Solution Architecture

## 2.1 Hub-and-Spoke Model

The platform follows a **Hub-and-Spoke** architecture, a proven pattern for multi-entity data collection under centralised governance.

```
  Plant NOC ──┐
  Plant WEA ──┤
  Plant SBG ──┼──► [Power Automate] ──► Prepayment Master List (Hub)
  Plant ...  ──┤                              │
  Plant (23) ──┘                     Finance Team Dashboard
                                              │
                                     Facilities Master List
                                       (System Configuration)
```

**Spokes** are the 23 individual plant submission lists. Each is a secured, isolated data entry point. Plant employees interact only with their own Spoke.

**The Hub** is the central **Prepayment Request Master List** — the single source of truth for the Finance Team. It is populated automatically by the automation layer and is never written to directly by plant users.

**The Connection** is a **Power Automate Cloud Flow** — the automation engine that moves data from all Spokes into the Hub on a monthly basis, triggered manually by a Finance Manager.

## 2.2 Platform Components

| Component | Technology | Purpose |
| :--- | :--- | :--- |
| Plant Submission Lists (×23) | SharePoint Online | Data entry point for each plant |
| Prepayment Request Master List | SharePoint Online | Consolidated Finance Team view |
| Facilities Master List | SharePoint Online | System registry of all active plants |
| Consolidation Flow | Power Automate | Monthly automated data aggregation |
| Provisioning Script | PnP PowerShell 1.5.0 | Consistent, repeatable setup of all 23 plants |
| Access Layer | Microsoft Teams + Edge | End-user experience for plant employees |

## 2.3 Site Collection

The entire solution resides within the existing **`/GBR-UK-Shared-Services`** SharePoint site collection. No new site collection or tenant is required.

---

# 3. Security Model

Security is enforced at the **platform level**, not by user discipline. The following controls are built into the architecture:

## 3.1 Plant Isolation

Each plant's submission list has **broken permission inheritance**. This means SharePoint's default "inherit from parent" behaviour is disabled, and each list is governed by its own dedicated Security Group.

- Every plant has a dedicated SharePoint Security Group named **`[Plant Code] Members`** (e.g., `NOC Members`, `WEA Members`).
- Members of that group receive **Contribute** permissions to their plant's list only.
- Attempting to access another plant's list returns **Access Denied** — this is enforced at the platform level.

## 3.2 Data Sealing (Post-Consolidation)

Once an item has been consolidated into the Master List by the monthly automation:

1. The item in the source plant list is **locked to read-only** for the submitting plant group.
2. Only Site Owners retain full control.
3. The item is timestamped with the consolidation date (`Processed On`).

This prevents retroactive changes to data that has already been aggregated into the central record.

## 3.3 Finance Team Access

The Finance Team accesses the **Prepayment Request Master List** (the Hub) with full read access across all plants. They do not need membership in any individual plant group, and plant users cannot see the Master List.

---

# 4. Data Structure

## 4.1 The "Prepayment Item" — Standardised Across All Plants

To ensure consistency across all 23 plant lists, a single **Site Content Type** called "Prepayment Item" is defined once at the site level and applied to every plant list. This means all plants capture the same fields, in the same format.

| Field | Type | Required | Notes |
| :--- | :--- | :--- | :--- |
| Invoice Number | Text | Yes | |
| Invoice Value | Currency | Yes | |
| Purchase Order (PO) | Text | Yes | |
| Payment Description | Note | Yes | |
| Business Area | Choice | Yes | |
| Cost Centre | Text | No | |
| GL Code | Text | No | |
| Date From / Date To | Date | No | |
| Vendor Name / Number | Text | No | |
| Plant | Text | No | Auto-populated — plant employees do not fill this in |
| Processed On | Date | No | Hidden — set by automation only |
| Processed | Calculated | — | Displays "Yes/No" automatically based on consolidation state |

## 4.2 Facilities Master List (System Registry)

This list acts as the system's configuration layer. The Power Automate flow reads from it to know which plants are active and which SharePoint list to query for each.

| Field | Purpose |
| :--- | :--- |
| SAP Code | Unique plant identifier (matches the security group naming convention) |
| Plant Name | Human-readable plant name |
| List Name | Internal SharePoint list name for that plant's submissions |
| Group ID | SharePoint Security Group ID (used for sealing logic) |
| General Manager | GM user field for reference |
| Active | Boolean — allows a plant to be excluded from consolidation without deletion |

Adding a new plant requires only adding a row to this list and running the provisioning script. No flow edits are needed.

---

# 5. Automation: The Consolidation Flow

## 5.1 How It Works

The **SWUK Prepayment Request Consolidation** Power Automate flow is the engine that moves data from the 23 plant lists into the Master List. It runs on a **manual monthly trigger** initiated by a Finance Manager.

**Flow logic (step by step):**

1. **Trigger**: Finance Manager clicks "Run" in Power Automate (or via a Teams button).
2. **Read Configuration**: Flow reads the Facilities Master List to get the current list of active plants.
3. **Iterate Each Plant**: For each active plant, the flow queries its submission list for items not yet processed (`Processed = No`).
4. **Consolidate**: Each unprocessed item is created in the Prepayment Request Master List with full field mapping.
5. **Stamp the Source**: The original item in the plant list is updated with a consolidation timestamp.
6. **Seal the Item**: Permissions on the source item are changed — the plant group loses write access, making the item read-only.

## 5.2 Service Accounts

**Development / Testing**

The flow runs under the **`s2-gis-mxl1-msflows@smurfitkappa.com`** service account, which holds the necessary permissions across all lists. This account is used for development and testing.

**Production**

The flow runs under the **`S2-GBR-UK-Portal@smurfitwestrock.com`** service account, which holds the necessary permissions across all lists. Plant users do not need elevated access at any point. This account is used to run the flow automation without any user-centric dependency — such as password rotation policies that enforce changes every 6 months.

## 5.3 Key Guarantees

- Items are **never duplicated** — the filter on `Processed = No` ensures only new items are picked up each month.
- Items are **immutable after processing** — the sealing step prevents retroactive amendments.
- **New plants are automatically included** — adding a plant to the Facilities Master List is sufficient; no flow changes are needed.

---

# 6. Provisioning Approach

Setting up 23 plants manually would be error-prone and time-consuming. Instead, a **PnP PowerShell 1.5.0** script automates the entire provisioning process. A single script execution can:

- Create all 23 plant-specific submission lists, each pre-configured with the Prepayment Item Content Type.
- Create all 23 Security Groups with the correct naming convention.
- Break permission inheritance on each list and assign the correct group.
- Register each plant in the Facilities Master List.

This same script is the mechanism for **onboarding future plants** — the Finance Team (or IT) runs the script with the new plant's parameters and the spoke is ready in minutes.

---

# 7. Delivery Plan

## 7.1 Sprint Overview

| Sprint | Focus | Duration | Effort |
| :--- | :--- | :--- | :--- |
| Sprint 1 | Core Framework & Automation Engine | Weeks 1–1.5 | 36 hrs |
| Sprint 2 | Regional Rollout — All 23 Plants | Weeks 1.5–3 | 92 hrs |
| Sprint 3 | QA, Documentation & Finance Handover | Week 4 | Included |
| **Total** | | **~4 Weeks** | **~128 hrs** |

## 7.2 Sprint 1 — Core Framework

**Goal**: Build the foundation that all 23 plants will depend on, with primary focus on delivering a robust PnP PowerShell provisioning script that compresses Sprint 2 execution time significantly.

The strategic priority for this sprint is the **provisioning script**. By investing time up front to produce, iterate, and thoroughly test the script in Sprint 1, the 23-plant rollout in Sprint 2 becomes a largely automated execution rather than a manual, repetitive effort — reducing risk and freeing capacity earlier than planned.

**Estimated script effort: 16–20 hrs** (development, iteration, and end-to-end provisioning test on a pilot plant).

- ~~Define and deploy the "Prepayment Item" Site Content Type.~~ *(Completed — delivered as part of the Proof of Concept.)*
- **Develop and fully test the PnP PowerShell 1.5.0 provisioning script** *(priority task — includes pilot run against at least one plant end-to-end).*
- Develop and harden the Power Automate Consolidation Flow.
- Create the Plant Page template.

> **Note on capacity**: If the script and flow are completed ahead of the 1.5-week window, the remaining Sprint 1 time will be made available to the **Finance Team for other SharePoint-related tasks or improvements** within the `GBR-UK-Shared-Services` site. This ensures no capacity is lost and the Finance Team gains additional value from the engagement.

## 7.3 Sprint 2 — Regional Rollout

**Goal**: Provision and secure all 23 plant Spokes.

- Execute PnP script to create all plant lists and security groups.
- Configure "Pending" and "Processed" views per plant.
- Integrate lists into Microsoft Teams App Tabs.
- Provision site pages per plant.

## 7.4 Sprint 3 — QA & Handover

**Goal**: Validate end-to-end and leave Finance self-sufficient.

- Functional testing: per-plant isolation verification.
- Integration testing: end-to-end consolidation with real plant data.
- UAT with Finance Team.
- Produce Plant Onboarding documentation.
- Deliver Knowledge Transfer session to Finance Team.

---

# 8. Testing & Acceptance

## 8.1 Security Validation

- A user from Plant A attempts to access Plant B's list → **Expected: Access Denied**.
- A user submits a request → item appears in "Pending" view with `Processed = No`.

## 8.2 Consolidation Validation

- Run the consolidation flow with items in 3 plant lists.
- Verify items appear in the Master List with full field mapping.
- Verify source items are timestamped and read-only post-consolidation.

## 8.3 Teams Integration

- Access plant list via Microsoft Teams App Tab → renders correctly, user authenticated.
- Submit a request via Teams → item created with correct Plant metadata.

## 8.4 UAT — Finance Team Sign-Off

- Finance Team reviews Master List data accuracy after a full monthly trigger cycle.
- Finance Team successfully onboards one new test plant using the script and documentation — **without IT assistance**.

---

# 9. Success Criteria

| Criterion | Measure |
| :--- | :--- |
| Data isolation | 0 cross-plant access incidents in testing |
| Consolidation accuracy | 100% of unprocessed items captured in Master List per run |
| Sealing reliability | 100% of processed items become read-only in source lists |
| Finance self-sufficiency | Finance Team onboards a test plant independently during UAT |
| Platform extensibility | System supports up to 50 plants without architectural changes |

---

# 10. Out of Scope

The following are explicitly excluded from this delivery:

- ERP / SAP integration
- Power BI dashboards or reporting layer
- Non-UK plant rollout
- Custom-developed applications (all delivery is low-code / no-code within M365)

---

*Document version 1.0 — April 2026. Prepared by UK Shared Services Digital Solutions.*
