# Knowledge Transfer Document — Ruiz Foods Praise Program

**Organization:** Ruiz Foods, Inc.
**Document type:** Knowledge Transfer (KT) — Existing production system
**Prepared:** 2026-05-07
**Audience:** New IT Admin / Developer · IT Leadership / Management
**Status:** Complete

---

## Table of Contents

1. [Functional Overview](#1-functional-overview)
2. [Architecture & Components](#2-architecture--components)
3. [Data Model](#3-data-model)
4. [Process Flow](#4-process-flow)
5. [List Configuration & Views](#5-list-configuration--views)
6. [Power Automate Flow](#6-power-automate-flow)
7. [SharePoint Pages](#7-sharepoint-pages)
8. [Permissions & Access](#8-permissions--access)
9. [Operational Runbook](#9-operational-runbook)
10. [Data Snapshot Evidence](#10-data-snapshot-evidence)
11. [Brand Compliance](#11-brand-compliance)

---

## 1. Functional Overview

### What Is the Praise Program?

The **Praise Program** is an employee recognition initiative at Ruiz Foods, Inc. that allows any employee to formally recognize a peer for exemplifying one of the company's **Core Values**. The program is built entirely on Microsoft 365 and has been running in production on the company intranet (RuizNetPortal) for multiple years.

When an employee observes outstanding behavior from a colleague, they submit a praise through a form on the intranet. An HR Manager reviews and approves the recognition before it is published company-wide on the RuizNetPortal site.

### Business Value

- Reinforces Core Values through peer-to-peer recognition
- Creates a public, visible record of exemplary behavior
- Connects employees across departments and locations (Denison plant, Customer Service, Operations, R&D, etc.)
- Requires no custom software — runs entirely on Microsoft 365 licenses already held by the organization

### Core Values Recognized

| Core Value | Icon File |
|---|---|
| Innovation | Innovation-icon.jpg |
| Integrity | Integrity-icon.jpg |
| Respect | Respect-icon.jpg |
| Teamwork | Teamwork-icon.jpg |
| Safety | Safety-icon.jpg |
| Quality | Quality-icon.jpg |
| None of These | NoneofThese-icon.jpg |

Icon images are stored at: `https://ruizfoods.sharepoint.com/sites/RuizNetPortal/SiteAssets/Recognition/`

### User Roles

| Role | Who | What They Do |
|---|---|---|
| **Employee (submitter)** | Any Ruiz Foods employee | Submits a praise for a peer via the intranet form |
| **Employee (recognized)** | The praised employee | Receives a Congratulations email when their praise is approved |
| **HR Manager** | HR department staff | Reviews and approves or rejects praise submissions via Microsoft Teams Approvals App |
| **IT Administrator** | IT department | Manages lists, Power Automate flows, permissions, and SharePoint pages |

### End-to-End Summary (Non-Technical)

1. An employee visits the RuizNetPortal intranet and clicks "Submit a Praise"
2. They fill in who they are praising, which Core Value was demonstrated, a description, and the manager's name
3. The submission is automatically routed to HR for review via Microsoft Teams
4. An HR Manager approves or rejects the recognition
5. If approved, the recognized employee receives a Congratulations email and the praise appears on the "View Current Praises" page visible to all employees
6. If rejected, the submission does not appear publicly

---

## 2. Architecture & Components

### Platform

The solution is **100% Microsoft 365-native**. There is no custom code, no SPFx web parts, no PowerApps, and no third-party services. All components operate within the Ruiz Foods Microsoft 365 tenant.

- **SharePoint Online site:** `https://ruizfoods.sharepoint.com/sites/RuizNetPortal/`

### Architecture Diagram

```
Employee (browser — any device)
        │
        ▼
[SharePoint Page: Intranet Landing]
  "Submit a Praise" link  ──────────────────────────────────────────►
                                                              [Microsoft List Form]
                                                              "Welcome to the Praise Form!"
                                                              /sites/RuizNetPortal/Lists/Recognition/
                                                                        │
                                                            [new item created → _ModerationStatus=Pending]
                                                                        │
                                                                        ▼
                                                            [Power Automate — Approval Flow]
                                                                        │
                                                            [Teams Approvals connector]
                                                                        │
                                                                        ▼
                                                            [Microsoft Teams — Approvals App]
                                                            (HR Manager receives approval request)
                                                                        │
                                              ┌─────────────────────────┴───────────────────────┐
                                          [Approved]                                        [Rejected]
                                              │                                                  │
                               [SharePoint: _ModerationStatus=0]              [SharePoint: _ModerationStatus=1]
                               [Outlook: Congratulations Email]
                                              │
                               [SharePoint Page: View Current Praises]
                               (praise visible to all employees)

"View Praises" link ──────────────────────────────────────────────►
                                                            [SharePoint Page: View Current Praises]
                                                            (shows approved praises only)

"View Submitted Praises" ─────────────────────────────────────────►
                                                            [SharePoint Page: View Submitted Praises]
                                                            (shows employee's own submissions)
```

### Component Inventory

| # | Component | Type | Platform | Location / URL |
|---|---|---|---|---|
| 1 | **Praise List** (Recognition) | SharePoint List | SharePoint Online | `/sites/RuizNetPortal/Lists/Recognition/` |
| 2 | **Praise (Archive) List** | SharePoint List | SharePoint Online | `/sites/RuizNetPortal/Lists/` |
| 3 | **Praise Cards List** | SharePoint List | SharePoint Online | `/sites/RuizNetPortal/Lists/` |
| 4 | **Praise Submission Form** | Microsoft List Form | SharePoint Online | `/sites/RuizNetPortal/Lists/Recognition/Untitled Form.aspx` |
| 5 | **Intranet Landing Page** | SharePoint Page | SharePoint Online | `/sites/RuizNetPortal/SitePages/` |
| 6 | **View Current Praises Page** | SharePoint Page | SharePoint Online | `/sites/RuizNetPortal/SitePages/` |
| 7 | **View Submitted Praises Page** | SharePoint Page | SharePoint Online | `/sites/RuizNetPortal/SitePages/` |
| 8 | **Approval Flow** | Power Automate Cloud Flow | Power Automate | Ruiz Foods M365 tenant / Default environment |
| 9 | **HR Approval Interface** | Teams Approvals App | Microsoft Teams | Approvals tab in Teams |
| 10 | **Praise Alert Email** | Outlook email (Power Automate) | Outlook / Exchange Online | Sent via flow on submission |
| 11 | **Congratulations Email** | Outlook email (Power Automate) | Outlook / Exchange Online | Sent via flow on approval |

---

## 3. Data Model

The solution uses **three SharePoint lists** as its data store. All lists are on the RuizNetPortal site.

### 3.1 Praise List (System of Record)

**Internal name:** Recognition
**List ID:** `64333b56-6447-4aea-8765-0e5766b05e4f`
**URL:** `/sites/RuizNetPortal/Lists/Recognition/`
**Default view URL:** `/sites/RuizNetPortal/Lists/Recognition/AllItems.aspx`

**List settings:**
- BaseTemplate: 100 (Generic List)
- Content approval (moderation): **Enabled**
- Major version history: **Enabled**
- Minor versions: Disabled
- Content types: Enabled
- Quick Launch: Hidden
- Item count at export: **9**

#### Custom Fields

| Display Title | Internal Name | Type | Required | Description / Notes |
|---|---|---|---|---|
| **Praise for** | `Recognitionfor` | User | **Yes** | Person being recognized. Help text: "Please type the name or email address of the person you want to recognize." Displays user photo + name. |
| **Core Value Demonstrated** | `Category` | Choice | **Yes** | Dropdown: Innovation, Integrity, Respect, Teamwork, Safety, Quality, None of These. Help text: "Indicate which core value you feel the team member demonstrated." Column formatter displays matching Core Value icon. |
| **Description** | `Description` | Note (multi-line) | **Yes** | Help text: "Please provide details regarding the reason the person is being recognized. The recognition must be related to work or community service. It should not include any negative comments regarding team members or profanity." |
| **Manager** | `Manager` | User | **Yes** | Manager of the recognized employee. Help text: "This is the name of the manager of the person being recognized." |
| **Status** | `Status` | Choice | No | Choices: Requested (default), Approved, Revised. Color-coded pill: Requested=blue, Approved=green, Revised=gold. |
| **Department** | `Department` | Text | No | Department of the recognized employee. |
| **Icon** | `Icon` | Text | No | Core Value icon identifier. Stores the icon filename prefix (e.g., "Teamwork-icon"). |
| **Comments** | `Comments` | Note (multi-line) | No | Additional comments field. |
| **Likes** | `Likes` | User | No | Single-user like. |
| **Praise from2** | `Recognition_x0020_from` | User | No | Alternate submitter field (User display: name + photo). |

#### Key System Fields

| Display Title | Internal Name | Type | Notes |
|---|---|---|---|
| Praise from | `Author` | User (read-only) | Auto-set to the submitting user. Displays with circular photo. |
| Approval Status | `_ModerationStatus` | ModStat (read-only) | Controls content visibility. Values: 0=Approved, 1=Rejected, 2=Pending, 3=Draft, 4=Scheduled |
| Approver Comments | `_ModerationComments` | Note | HR rejection reason, if provided. |
| ID | `ID` | Counter | Auto-increment. Used for ordering (newest first). |
| Created | `Created` | DateTime | Auto-set on submission. |
| Modified | `Modified` | DateTime | Auto-updated on any change. |

#### Content Moderation State Machine

```
Employee submits praise
        │
        ▼
_ModerationStatus = 2 (Pending)
[Item NOT visible in default "All Items" view]
        │
Power Automate triggers
        │
        ▼
HR Manager receives Teams Approval
        │
   ┌────┴────┐
   │         │
[Approve]  [Reject]
   │         │
   ▼         ▼
Status=0   Status=1
(Approved) (Rejected)
   │
   ▼
Item appears in "All Items" default view
(visible to all employees)
Congratulations Email sent to recognized employee
```

### 3.2 Praise (Archive) List

**Purpose:** Long-term archive of praises migrated from the active Praise list. Managed manually by IT Admin.

**Additional fields vs Praise list:**

| Display Title | Internal Name | Type | Notes |
|---|---|---|---|
| Submitted | `Submnitted` | DateTime (DateOnly) | Original submission date |
| Approved | `Approved` | DateTime (DateOnly) | Date praise was approved |
| Archived | `Created` | DateTime | Date item was moved to archive |

The archive shares the same core fields (Praise for, Core Value Demonstrated, Description, Manager, Status, Department, Comments) and the same Core Values choices.

> Note: The "Submitted" field internal name contains a typo: `Submnitted` (double 'n'). This is the production value and must be used as-is.

### 3.3 Praise Cards List

**Purpose:** Display-optimized companion list for rendering approved praises as visual cards on SharePoint pages.

#### Custom Fields

| Display Title | Internal Name | Type | Required | Notes |
|---|---|---|---|---|
| **Title** | `Title` | Text | **Yes** | Card headline / title |
| **To** | `To` | User | **Yes** | Recognized employee |
| **From** | `From` | User | **Yes** | Submitting employee |
| **Icon** | `Icon` | Text | No | Core Value icon identifier |
| **Description** | `Description` | Note | No | Praise text for card display |
| **Likes** | `Likes` | UserMulti | No | Multi-user likes (multiple people can like a card) |

> The Praise Cards list does **not** have content moderation enabled. Only approved praises should be added here.

### 3.4 Core Value Icons

Icons are stored as image assets on the SharePoint site:

| Core Value | Icon filename |
|---|---|
| Innovation | `Innovation-icon.jpg` |
| Integrity | `Integrity-icon.jpg` |
| Respect | `Respect-icon.jpg` |
| Teamwork | `Teamwork-icon.jpg` |
| Safety | `Safety-icon.jpg` |
| Quality | `Quality-icon.jpg` |
| None of These | `NoneofThese-icon.jpg` |

**Asset library path:** `https://ruizfoods.sharepoint.com/sites/RuizNetPortal/SiteAssets/Recognition/`

The `Core Value Demonstrated` column has a **custom column formatter** that automatically renders the matching icon image inline next to the choice value in list views.

---

## 4. Process Flow

### Full End-to-End Flow

| Step | Actor | Action | System |
|---|---|---|---|
| 1 | Employee | Navigates to RuizNetPortal intranet and clicks "Submit a Praise" | SharePoint — Intranet Landing Page |
| 2 | Employee | Fills in the praise form: Praise for, Core Value, Description, Manager | SharePoint — Microsoft List Form |
| 3 | Employee | Submits the form | SharePoint — Praise List (Recognition) |
| 4 | SharePoint | Creates new list item with `_ModerationStatus = Pending (2)` | SharePoint — Praise List |
| 5 | Power Automate | Flow triggers on new item creation | Power Automate — Approval Flow |
| 6 | Power Automate | Creates approval request and routes to HR Manager(s) | Teams Approvals connector |
| 7 | HR Manager | Receives approval request notification in Microsoft Teams Approvals App | Microsoft Teams |
| 8 | HR Manager | Reviews praise details (praised employee, submitter, Core Value, description, manager) | Microsoft Teams — Approvals App |
| **Branch A: Approved** | | | |
| 9a | HR Manager | Clicks "Approve" in Teams Approvals | Microsoft Teams |
| 10a | Power Automate | Updates list item: `_ModerationStatus = Approved (0)` | SharePoint — Praise List |
| 11a | Power Automate | Sends Congratulations Email to recognized employee | Outlook / Exchange Online |
| 12a | SharePoint | Praise item appears in "All Items" default view and on "View Current Praises" page | SharePoint |
| **Branch B: Rejected** | | | |
| 9b | HR Manager | Clicks "Reject" in Teams Approvals | Microsoft Teams |
| 10b | Power Automate | Updates list item: `_ModerationStatus = Rejected (1)` | SharePoint — Praise List |
| 11b | Power Automate | (Optional) Notifies submitter of rejection | Outlook |
| 12b | SharePoint | Item remains hidden from default public view | SharePoint |

### Evidence

| Step | Mockup Reference |
|---|---|
| Step 2 — Blank form | `refdocs/mockups/Microsoft List Form - Praise Form Blank.jpg` |
| Step 2 — Form with data | `refdocs/mockups/Microsoft List Form - Praise Form with Data.jpg` |
| Step 7-8 — HR Teams approval | `refdocs/mockups/Microsoft Teams - Approvals App - Praise Request.jpg` |
| Step 8 — Approval experience | `refdocs/mockups/Microsoft Teams - Approvals - Approval Experience for HR Managers.jpg` |
| Step 6 — Approval request detail | `refdocs/Power Automate - Approvals - Praise Submission - Approval Request for Opal Sullen.pdf` |
| Step 11a — Congratulations email | `refdocs/Mirosoft Outlook - Congratulations Email.pdf` |
| Step 5 — Alert email | `refdocs/mockups/Microsoft Outlook - Praie Email Alert.jpg` |
| Step 12a — Intranet view | `refdocs/mockups/SharePoint - Pages - View Current Praises Page.jpg` |

---

## 5. List Configuration & Views

### 5.1 Praise List Settings

| Setting | Value | Location |
|---|---|---|
| Content moderation (approval) | **Enabled** | List Settings → Versioning settings |
| Major version history | Enabled | List Settings → Versioning settings |
| Minor versions | Disabled | List Settings → Versioning settings |
| Content types | Enabled | List Settings → Advanced settings |
| Quick Launch display | **Hidden** | List Settings → General settings |
| Default view | All Items (approved only) | List Settings → Views |

> **Critical:** Content moderation is the mechanism that controls whether submitted praises are visible to regular employees. Disabling it would expose all pending/rejected praises to the entire organization.

### 5.2 Praise List — All Views

| View Title | URL slug | Default | Hidden | Filter | Order | Row Limit |
|---|---|---|---|---|---|---|
| **All Items** | `/AllItems.aspx` | **Yes** | No | `_ModerationStatus = Approved (0)` | ID Descending | 30 |
| **Approve/reject Items** | `/mod-view.aspx` | No | No | None | Grouped by `_ModerationStatus` Descending | 30 |
| **HomePage** | `/HomePage.aspx` | No | No | None | — | 30 |
| **My submissions** | `/my-sub.aspx` | No | No | `Author = [Current User]` | ID Descending, Grouped by `_ModerationStatus` | 30 |
| **Top 10 Recognitions** | `/Top 5 Recongnitions.aspx` | No | No | `Status = Approved` | ID Descending | **10** |
| **Top 10 Recognitions Cards** | `/Top 10 Recognitions Cards.aspx` | No | No | `Status = Approved` | ID Descending | **10** |
| **Welcome to the Praise Form!** | `/Untitled Form.aspx` | No | **Yes** | None | — | 30 |

**CAML query — All Items (default view):**
```xml
<OrderBy>
  <FieldRef Name="ID" Ascending="FALSE" />
</OrderBy>
<Where>
  <Eq>
    <FieldRef Name="_ModerationStatus" />
    <Value Type="ModStat">Approved</Value>
  </Eq>
</Where>
```

**CAML query — My submissions:**
```xml
<GroupBy Collapse="FALSE" GroupLimit="30">
  <FieldRef Name="_ModerationStatus" Ascending="FALSE" />
</GroupBy>
<OrderBy>
  <FieldRef Name="ID" Ascending="FALSE" />
</OrderBy>
<Where>
  <Eq>
    <FieldRef Name="Author" />
    <Value Type="Integer"><UserID Type="Integer" /></Value>
  </Eq>
</Where>
```

> Note: The URL slug for "Top 10 Recognitions" is `/Top 5 Recongnitions.aspx` — this contains a spelling error ("Recongnitions") and is the production URL. Do not rename it without testing impact on embedded page references.

### 5.3 Praise (Archive) List Settings

The Archive list mirrors the Praise list structure with these additions:
- Added date fields: Submitted, Approved, Archived
- No content moderation required (items are pre-approved before archiving)
- Managed manually — no automated archiving flow exists

### 5.4 Praise Cards List Settings

- No content moderation (items added manually or via flow after HR approval)
- Optimized for card layout rendering on SharePoint pages

---

## 6. Power Automate Flow

### Overview

A single **Cloud Flow** handles the full approval lifecycle for the Praise Program. It is stored in the Ruiz Foods Microsoft 365 tenant under the **Default Power Platform environment**.

### Trigger

| Attribute | Value |
|---|---|
| Connector | SharePoint |
| Trigger action | When an item is created |
| Site | `https://ruizfoods.sharepoint.com/sites/RuizNetPortal/` |
| List | Recognition (Praise) |

### Flow Actions (in order)

| Step | Action | Connector | Details |
|---|---|---|---|
| 1 | **When an item is created** | SharePoint (trigger) | Fires on every new Praise list item |
| 2 | **Start and wait for an approval** | Approvals (Teams) | Creates approval request; routes to HR Manager(s). Approval type: First to respond |
| 3 | **Condition** | Control | Checks `Outcome` from step 2: equals "Approve" |
| 4a (Yes branch) | **Update item** | SharePoint | Sets `_ModerationStatus` on the Praise list item to `0` (Approved) |
| 5a (Yes branch) | **Send an email (V2)** | Office 365 Outlook | Sends Congratulations Email to the recognized employee |
| 4b (No branch) | **Update item** | SharePoint | Sets `_ModerationStatus` to `1` (Rejected) |

### Approval Card — Fields Shown to HR Manager

The approval request displayed in Teams Approvals shows:
- **Praised employee** (Praise for / Recognitionfor)
- **Submitter** (Praise from / Author)
- **Core Value Demonstrated** (Category)
- **Description**
- **Manager** of the recognized employee

Evidence: `refdocs/Power Automate - Approvals - Praise Submission - Approval Request for Opal Sullen.pdf`

### Email Templates

#### Praise Alert Email
- **Trigger:** On new submission (notifies relevant parties of pending praise)
- **Recipient:** HR Manager(s) or distribution list
- Evidence: `refdocs/mockups/Microsoft Outlook - Praie Email Alert.jpg`

#### Congratulations Email
- **Trigger:** After HR approval (Yes branch of condition)
- **Recipient:** The recognized employee (`Recognitionfor` field)
- **Content:** Congratulations message with praise details
- Evidence: `refdocs/Mirosoft Outlook - Congratulations Email.pdf`

### Flow Maintenance

To find the flow in Power Automate:
1. Go to `https://make.powerautomate.com`
2. Select the Ruiz Foods tenant / Default environment
3. Navigate to **My flows** or **Shared with me**
4. Search for the flow name associated with the Praise Program

To view run history: Open the flow → **28-day run history** tab → check for failed runs.

---

## 7. SharePoint Pages

The Praise Program uses **3 SharePoint pages** on the RuizNetPortal site. All pages are standard SharePoint communication/modern pages requiring no custom web parts.

### 7.1 Intranet Landing Page

| Attribute | Value |
|---|---|
| Location | `/sites/RuizNetPortal/SitePages/` |
| Purpose | Main entry point — provides navigation links to Submit and View praises |
| Evidence | `refdocs/mockups/SharePoint - Pages - Intranet Landing - Link to Submit a Praise and VIew Praises.jpg` |

**Content:**
- Link to **Submit a Praise** → opens the Microsoft List Form (`/Lists/Recognition/Untitled Form.aspx`)
- Link to **View Praises** → navigates to the View Current Praises page

This page is the primary entry point for all employees. The list itself is hidden from Quick Launch, so employees access it only through this page.

### 7.2 View Current Praises Page

| Attribute | Value |
|---|---|
| Location | `/sites/RuizNetPortal/SitePages/` |
| Purpose | Displays all approved praises visible to the entire organization |
| Evidence | `refdocs/mockups/SharePoint - Pages - View Current Praises Page.jpg` |

**Content:**
- Embedded list view from the **Praise list** using the **"All Items"** or **"Top 10 Recognitions Cards"** view
- Shows only approved praises (content moderation filter applied automatically)
- Displays praise recipient, submitter, Core Value icon, description

### 7.3 View Submitted Praises Page

| Attribute | Value |
|---|---|
| Location | `/sites/RuizNetPortal/SitePages/` |
| Purpose | Employee self-service — shows the current user's own submitted praises |
| Evidence | `refdocs/mockups/SharePoint - Pages - View Submitted Praises.jpg` |

**Content:**
- Embedded list view using the **"My submissions"** view
- Filter applied: `Author = [Current User]`
- Groups submissions by moderation status so the employee can see which praises are Pending, Approved, or Rejected

---

## 8. Permissions & Access

### SharePoint List Permissions

| Role | Permission Level | What They Can Do |
|---|---|---|
| **All employees** | Contribute | Submit new praise items; read approved items in "All Items" view |
| **HR Manager** | Contribute + **Approve Items** | Read all items in all moderation states; approve/reject via "Approve/reject Items" view or Teams Approvals |
| **IT Administrator** | Full Control | Manage list settings, fields, views, permissions, and content |

> The "Approve Items" permission is a SharePoint permission level that grants the right to approve or reject content in moderation-enabled lists. HR Managers must have this permission on the Praise list.

### How Content Moderation Enforces Privacy

- Regular employees with Contribute permission see **only Approved items** in the default "All Items" view (CAML filter: `_ModerationStatus = Approved`)
- Their own submissions (in any status) are visible via the "My submissions" view (filtered to `Author = [Current User]`)
- Employees cannot see other employees' pending or rejected praises
- HR Managers can see all items in all states via the "Approve/reject Items" view

### Power Automate Flow Permissions

| Attribute | Value |
|---|---|
| Flow owner | IT Administrator or HR department account |
| Shared with | HR Manager account(s) who need to see flow activity |
| Service account | The flow runs under the identity of the flow owner — ensure this account has Contribute + Approve Items on the Praise list |

### Teams Approvals

- HR Managers receive approval requests automatically when the flow routes them
- No additional Teams channel permissions are required — Approvals are routed directly via the Approvals App
- HR Managers access pending approvals via: **Teams → Apps → Approvals** or the notification in their Activity feed

### How to Add an HR Approver to the Flow

1. Open Power Automate (`make.powerautomate.com`)
2. Open the Praise approval flow
3. Locate the **"Start and wait for an approval"** action
4. Edit the **Assigned to** field to add or replace the HR Manager's email address
5. Save the flow

---

## 9. Operational Runbook

### Task 1 — Approve a Praise Submission

**Where:** Microsoft Teams → Apps → Approvals

1. Open Microsoft Teams
2. In the left sidebar, click **Apps** → search for **Approvals** → open it
3. Under **Received** tab, find the pending praise request
4. Review the approval card (praised employee, submitter, Core Value, description)
5. Click **Approve**
6. Optionally add a comment
7. Click **Confirm**

**Result:** The praise list item is updated to Approved; the recognized employee receives a Congratulations email; the praise appears on the View Current Praises page.

---

### Task 2 — Reject a Praise Submission

**Where:** Microsoft Teams → Apps → Approvals

1. Follow steps 1–4 from Task 1
2. Click **Reject**
3. Add a rejection reason in the comment field (recommended for record-keeping)
4. Click **Confirm**

**Result:** The praise list item is updated to Rejected; it does not appear publicly; the submitter may be notified depending on flow configuration.

---

### Task 3 — View Pending Praises Directly in SharePoint

**Where:** SharePoint → Praise List → Approve/reject Items view

1. Navigate to `https://ruizfoods.sharepoint.com/sites/RuizNetPortal/Lists/Recognition/mod-view.aspx`
2. Items are grouped by Approval Status (Pending, Approved, Rejected)
3. To approve/reject from here: select an item → **Item** menu → **Approve/Reject**

> This view requires "Approve Items" permission on the list.

---

### Task 4 — Archive Old Praises

There is no automated archiving flow. Archiving is a manual process:

1. Navigate to the Praise list: `/sites/RuizNetPortal/Lists/Recognition/AllItems.aspx`
2. Select the praise items to archive (check the checkboxes)
3. Note the field values for each item (Praise for, Core Value, Description, Manager, Department, Submitted date, Approved date)
4. Navigate to the Praise (Archive) list
5. Manually create corresponding items in the Archive list, filling in the Submitted and Approved date fields
6. Delete the items from the active Praise list

> Consider exporting to CSV before deleting: List → Export to Excel → save as backup.

---

### Task 5 — Add a New Core Value Choice

1. Go to `https://ruizfoods.sharepoint.com/sites/RuizNetPortal/Lists/Recognition/`
2. Click **Settings (gear icon)** → **List settings**
3. Under **Columns**, click **Core Value Demonstrated** (internal name: Category)
4. In the **Choices** section, add the new Core Value on a new line
5. Click **OK**
6. **Important:** If adding a new icon for this value, upload the icon image to `SiteAssets/Recognition/` and update the column formatter JSON to include the new choice mapping

---

### Task 6 — Add or Remove an HR Approver

1. Open Power Automate: `https://make.powerautomate.com`
2. Navigate to **My flows** or find the Praise approval flow
3. Click **Edit**
4. Find the **"Start and wait for an approval"** step
5. Edit the **Assigned to** field:
   - To **add**: add the new HR Manager's email (comma-separated for multiple approvers)
   - To **remove**: delete the email address from the field
6. Click **Save**

> If using "First to respond" approval type, any one of the listed approvers can approve. If you need **all** to approve, change the approval type to "Everyone must approve."

---

### Task 7 — Check Power Automate Flow Run History

1. Open Power Automate: `https://make.powerautomate.com`
2. Find the Praise approval flow
3. Click the flow name to open its detail page
4. Scroll to **28-day run history**
5. Look for runs with status **Failed**
6. Click a failed run to see which action failed and the error message
7. Common issues: expired service account token, SharePoint permission change, Teams approval timeout

---

### Task 8 — Update SharePoint Page Content

1. Navigate to the SharePoint page to edit (Intranet Landing, View Current Praises, or View Submitted Praises)
2. Click **Edit** (pencil icon top right)
3. Edit text, links, or web part properties as needed
4. Click **Republish** to make changes live

> Changes to embedded list views on pages are made by editing the **List web part** properties within the page editor, then selecting a different view or configuring columns.

---

## 10. Data Snapshot Evidence

Two CSV exports are available in `refdocs/` as production evidence. These files validate the documented field structure and actual data values.

### 10.1 Praise.csv — Active List Export

**File:** `refdocs/Praise.csv`
**Item count at export:** 9 items

**Column headers:**
```
"Praise for", "Praise from", "Description", "Manager",
"Core Value Demonstrated", "Department", "Status", "Comments",
"Approval Status", "Likes"
```

**Sample records:**

| Praise for | Core Value | Department | Status |
|---|---|---|---|
| AustinB@ruizfoods.com | Teamwork | R&D | Approved |
| RickB@ruizfoods.com | Teamwork | Operation | Approved |

Both sample records are from the Denison plant Maintenance department, recognizing employees for Teamwork during equipment downtime situations.

**Confirmed Core Value values in data:** Teamwork (observed in all exported records)
**Confirmed Status values:** Approved
**Confirmed Approval Status values:** Approved (mapped to `_ModerationStatus = 0`)

### 10.2 Praise(Archive).csv — Archive List Export

**File:** `refdocs/Praise(Archive).csv`

**Column headers (additional vs active list):**
```
"Praise for", "Praise from", "Description", "Manager",
"Core Value Demonstrated", "Department", "Status",
"Submitted", "Approved", "Archived", "Approval Status"
```

**Date range of archived records (from sample):** April 2026
- Submitted: 2026-04-22 to 2026-04-23
- Approved: same day as submission
- Archived: 2026-04-29 to 2026-04-30

**Sample records:**

| Praise for | Core Value | Department | Submitted | Approved |
|---|---|---|---|---|
| GusV@ruizfoods.com | Teamwork | Customer Service | 2026-04-23 | 2026-04-23 |
| OctavioD@ruizfoods.com | Teamwork | Customer Service | 2026-04-23 | 2026-04-23 |
| YolandaMa@ruizfoods.com | Teamwork | Operations | 2026-04-22 | 2026-04-22 |

> Note: The "Submitted" field has a typo in its internal name (`Submnitted`) in the production list. The CSV export shows it as "Submitted" in the display header.

### 10.3 _ModerationStatus Numeric Values (Confirmed)

| Numeric Value | Label | Meaning |
|---|---|---|
| 0 | Approved | Praise approved by HR; visible publicly |
| 1 | Rejected | Praise rejected by HR; not visible publicly |
| 2 | Pending | Awaiting HR review; not visible publicly |
| 3 | Draft | Draft state (not used in normal flow) |
| 4 | Scheduled | Scheduled publication (not used in normal flow) |

---

## 11. Brand Compliance

The Praise Program's user-facing components must comply with two official Ruiz Foods brand references:

| Document | Scope |
|---|---|
| `refdocs/Learning Color Brand Guide.pdf` | Ruiz Foods corporate color system — primary and secondary palette |
| `refdocs/RZF003_22 El Monterey_Brand_Guidelines_10_27_22_v3 (1).pdf` | El Monterey sub-brand guidelines — logo, typography, tone of voice, icon style |

### Brand Compliance Mapping

| Brand Dimension | Affected Component | Applied Where | Reference Document |
|---|---|---|---|
| **Color palette** | SharePoint pages | Page background, header, web part colors | Learning Color Brand Guide.pdf |
| **Color palette** | Email templates (Praise Alert, Congratulations) | Email header color, button/link color | Learning Color Brand Guide.pdf |
| **Color palette** | Praise Card visual design | Card background and accent colors | Learning Color Brand Guide.pdf |
| **Typography / fonts** | SharePoint pages | Page headings and body text font selection | El Monterey Brand Guidelines PDF |
| **Typography / fonts** | Email templates | Email heading and body font | El Monterey Brand Guidelines PDF |
| **Logo usage** | SharePoint Intranet Landing Page | Logo placement in page header/banner | El Monterey Brand Guidelines PDF |
| **Logo usage** | Congratulations email | Logo in email header | El Monterey Brand Guidelines PDF |
| **Icon style** | Core Value Demonstrated column | Icon images for each Core Value stored in `SiteAssets/Recognition/` | El Monterey Brand Guidelines PDF |
| **Icon style** | Icon field (Praise & Praise Cards lists) | Stores the icon filename/identifier | El Monterey Brand Guidelines PDF |
| **Tone of voice** | Praise submission form | Form title ("Welcome to the Praise Form!"), field helper text, submit button copy | El Monterey Brand Guidelines PDF |
| **Tone of voice** | Praise Alert email | Email subject line and body copy | El Monterey Brand Guidelines PDF |
| **Tone of voice** | Congratulations email | Congratulatory message copy and tone | El Monterey Brand Guidelines PDF |

### Icon Asset Compliance

The Core Value icons stored at `SiteAssets/Recognition/` should conform to the icon style guidelines in the El Monterey Brand Guidelines PDF. When adding new Core Values or updating existing icons, the IT Admin must:

1. Verify the new icon matches the approved icon style from the brand guidelines
2. Name the file following the existing convention: `[CoreValueName]-icon.jpg`
3. Upload to `https://ruizfoods.sharepoint.com/sites/RuizNetPortal/SiteAssets/Recognition/`
4. Update the column formatter JSON on the `Core Value Demonstrated` column to include the new mapping

### Tone of Voice — Key Guidelines

Per the El Monterey Brand Guidelines, employee-facing communications should:
- Be warm, encouraging, and celebratory
- Avoid corporate jargon
- Reflect the company's values-driven culture
- Be inclusive and respectful of all team members

The Description field on the Praise form includes a helper text guideline: *"The recognition must be related to work or community service. It should not include any negative comments regarding team members or profanity."*

---

## Appendix — Quick Reference

### Key URLs

| Resource | URL |
|---|---|
| RuizNetPortal site | `https://ruizfoods.sharepoint.com/sites/RuizNetPortal/` |
| Praise list (all items) | `/sites/RuizNetPortal/Lists/Recognition/AllItems.aspx` |
| Praise list (approve/reject) | `/sites/RuizNetPortal/Lists/Recognition/mod-view.aspx` |
| Praise submission form | `/sites/RuizNetPortal/Lists/Recognition/Untitled Form.aspx` |
| Power Automate | `https://make.powerautomate.com` |
| Teams Approvals | Microsoft Teams → Apps → Approvals |
| Core Value icons | `/sites/RuizNetPortal/SiteAssets/Recognition/` |

### Key List IDs

| List | ID |
|---|---|
| Praise (Recognition) | `64333b56-6447-4aea-8765-0e5766b05e4f` |

### Core Values — Quick Reference

Innovation · Integrity · Respect · Teamwork · Safety · Quality · None of These

### Status Field Values

| Status (display) | Default? |
|---|---|
| Requested | **Yes** |
| Approved | No |
| Revised | No |

### Evidence Files Index

| File | What It Documents |
|---|---|
| `Praise-Fields.json` | Praise list — all field definitions |
| `Praise-Properties.json` | Praise list — list-level settings (ID, moderation, versioning) |
| `Praise-Views.json` | Praise list — all 7 view definitions with CAML |
| `Praise-Schema.xml` | Praise list — full XML schema (use to reconstruct list) |
| `Praise(Archive)-Fields.json` | Archive list — all field definitions |
| `Praise(Archive)-Properties.json` | Archive list — list-level settings |
| `Praise(Archive)-Views.json` | Archive list — view definitions |
| `Praise(Archive)-Schema.xml` | Archive list — full XML schema |
| `Praise Cards-Fields.json` | Praise Cards list — all field definitions |
| `Praise Cards-Properties.json` | Praise Cards list — list-level settings |
| `Praise Cards-Views.json` | Praise Cards list — view definitions |
| `Praise Cards-Schema.xml` | Praise Cards list — full XML schema |
| `Praise.csv` | Active praise data export (9 items) |
| `Praise(Archive).csv` | Archived praise data export |
| `Praise Program.pptx` | Program overview presentation |
| `Power Automate - Approvals - Praise Submission - Approval Request for Opal Sullen.pdf` | Power Automate approval flow evidence |
| `Mirosoft Outlook - Congratulations Email.pdf` | Congratulations email template evidence |
| `mockups/` | UI screenshots of all system screens |
| `Learning Color Brand Guide.pdf` | Corporate color palette |
| `RZF003_22 El Monterey_Brand_Guidelines_10_27_22_v3 (1).pdf` | El Monterey brand guidelines |
| `HumanResources-PraiseProgram_20260507143222.zip` | Additional HR artifacts |
