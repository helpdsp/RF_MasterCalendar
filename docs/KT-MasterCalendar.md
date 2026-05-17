# KT Document — Ruiz Foods Master Calendar

**Solution:** Corporate Intranet Master Calendar
**Platform:** Microsoft 365 (SharePoint Online + Power Automate + Microsoft Forms)
**Site:** `https://ruizfoods.sharepoint.com/sites/RuizNetPortal`
**In Production Since:** 2024
**KT Author:** Haaron Gonzalez (`HaaronGCONSULT@ruizfoods.com`)
**KT Date:** 2026-05-17
**Operational Contact:** Christina Johnson (`christinaj@ruizfoods.com`)

---

## Table of Contents

1. [Functional Overview](#1-functional-overview)
2. [Architecture & Components](#2-architecture--components)
3. [Data Model](#3-data-model)
4. [Process Flow](#4-process-flow)
5. [Configuration Reference](#5-configuration-reference)
6. [Automation / Integration](#6-automation--integration)
7. [Interface Documentation](#7-interface-documentation)
8. [Permissions & Access](#8-permissions--access)
9. [Operational Runbook](#9-operational-runbook)
10. [Data Snapshot Evidence](#10-data-snapshot-evidence)
11. [Brand Compliance](#11-brand-compliance)

---

## 1. Functional Overview

### What Is the Master Calendar?

The **Ruiz Foods Master Calendar** is a company-wide event hub that consolidates all important dates, meetings, holidays, and milestones across Ruiz Foods into a single, publicly accessible calendar on the Corporate Intranet. Employees can view the full year's events on a branded SharePoint page and — optionally — subscribe to sync those events directly into their Microsoft Outlook calendar, receiving real-time updates automatically.

The solution was originally requested in 2024 by **Jesse Sowell** as an "Op Co Calendar" to centralize operational events. **Sal G** expanded its scope to cover all Ruiz Foods employees and renamed it the Master Calendar. The solution has been live on the Corporate Intranet ("La Cocina") since 2024.

### Business Value

| Stakeholder | Value delivered |
|---|---|
| All Employees | Single place to see all company events for the year — no more searching multiple sources |
| Subscribers | Events appear automatically in Outlook; no manual calendar management required |
| Department Coordinators | Self-service event management — each department controls its own entries |
| IT / Management | Zero-code, Microsoft-native solution — no licenses, no custom development to maintain |

### User Roles

| Role | Description |
|---|---|
| **Employee (viewer)** | Views the Master Calendar page on the intranet; may subscribe |
| **Employee (subscriber)** | Has synced the Master Calendar to Outlook via the subscription process |
| **Department Coordinator** | Adds, edits, and deletes events in the Master Calendar SharePoint list |
| **IT Admin** | Maintains Power Automate flows, list settings, page, annual updates, troubleshooting |

### High-Level Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                 Ruiz Foods Corporate Intranet                    │
│                 ruizfoods.sharepoint.com/sites/RuizNetPortal     │
│                                                                  │
│  ┌────────────────────────┐   Power Automate (3 sync flows)      │
│  │   Master Calendar      │──────────────────────────────────►   │
│  │   (Custom List)        │◄──────────────────────────────────   │
│  │   Source of truth      │   New Item / Update / Delete         │
│  └────────────┬───────────┘                         │            │
│               │ Modern SharePoint page               │            │
│               ▼                                     ▼            │
│  ┌────────────────────────┐   ┌──────────────────────────────┐  │
│  │  Master Calendar page  │   │  Master Calendar Sync        │  │
│  │  (Year-view calendar)  │   │  (Classic SPO Calendar)      │  │
│  │  Subscribe button      │   │  Outlook integration surface │  │
│  └────────────────────────┘   └──────────────┬───────────────┘  │
│                                              │ stssync://         │
└──────────────────────────────────────────────┼───────────────────┘
                                               │
        ┌──────────────────┐                   ▼
        │  Microsoft Forms │    ┌──────────────────────────────────┐
        │  (Subscribe form)│───►│  Outlook Calendar                │
        └────────┬─────────┘    │  "Corporate Intranet -           │
                 │ Power         │   Master Calendar Sync"          │
                 │ Automate      └──────────────────────────────────┘
                 ▼
        ┌──────────────────┐
        │  Subscribe flow  │
        │  (email + link)  │
        └──────────────────┘
```

---

## 2. Architecture & Components

### Component Inventory

| Component | Type | Platform | URL / Identifier |
|---|---|---|---|
| Corporate Intranet site | SharePoint Online Communication Site | SharePoint Online | `https://ruizfoods.sharepoint.com/sites/RuizNetPortal` |
| Master Calendar list | Custom List (modern, BaseTemplate 100) | SharePoint Online | ID: `ba41b5e9-74a9-4b73-92b6-e52850322b2f` · URL: `/sites/RuizNetPortal/Lists/mc` |
| Master Calendar Sync list | Events/Calendar list (classic, BaseTemplate 106) | SharePoint Online | ID: `284250a1-f980-419d-9d77-373c14b37f7d` · URL: `/sites/RuizNetPortal/Lists/Master Calendar Sync` |
| New Item flow | Cloud Flow | Power Automate | ID: `43dd7568-e195-4015-9e93-aebbf2738963` · Status: ✅ ACTIVE |
| Update Item flow | Cloud Flow | Power Automate | ID: `cadbabbb-caeb-42c2-bb17-4966a00806d4` · Status: ⚠️ SUSPENDED 2025-11-14 |
| Deleted Item flow | Cloud Flow | Power Automate | ID: `bcdfef22-681e-46a3-93e2-68cbdc13c80e` · Status: ⚠️ SUSPENDED 2025-09-08 |
| Subscribe flow | Cloud Flow (webhook) | Power Automate | ID: `83cf4db2-4c6d-4c91-a933-b92468fb134f` · Display name: "Suscribe" *(production typo)* · Status: ⚠️ SUSPENDED 2025-09-08 |
| Subscription form | Microsoft Forms | Microsoft Forms | ID: `py7EuNnptEuWz4JQZaVbXvw8mw1BnC5Ik5I-8MoWJIJUM1VKMldXSTdCRFA5QUlWWktMTlpWS05FUS4u` |
| Service account | M365 user | Azure AD | `0365-PA-FLOWSVCG@ruizfoods.com` — runs all 4 flows |
| Ruiz Foods logo | Image | SharePoint SiteAssets | `/SiteAssets/__sitelogo__ruizsitelogo.png` |
| M365 Tenant | Azure AD | — | Tenant ID: `b8c42ea7-e9d9-4bb4-96cf-825065a55b5e` |

### Data Flow

1. A **Department Coordinator** adds, edits, or deletes an event in the **Master Calendar** list using the standard SharePoint modern list UI
2. The corresponding **Power Automate flow** (polling every 5 minutes) detects the change and mirrors it in **Master Calendar Sync**
3. For new items: the New Item flow also writes the resulting Sync item's ID back to the `Master_x0020_Calendar_x0020_Sync` field of the source item in Master Calendar (cross-reference for future updates/deletes)
4. **Subscribed employees** automatically see changes in Outlook because the Master Calendar Sync is connected to their Outlook calendar via the `stssync://` protocol

**Subscription path (separate):**
A **Microsoft Forms webhook** triggers the Subscribe flow when an employee submits the subscription form → the flow sends a branded email with the Outlook sync link → the employee confirms in Outlook → the Master Calendar Sync calendar is added to their Outlook.

---

## 3. Data Model

### 3.1 Master Calendar List

**Purpose:** Source of truth for all company events. Department coordinators manage entries here.

| Setting | Value |
|---|---|
| Display Name | Master Calendar |
| Internal URL | `/sites/RuizNetPortal/Lists/mc` *(note: short alias `mc`, not the display name)* |
| List ID | `ba41b5e9-74a9-4b73-92b6-e52850322b2f` |
| Base Template | 100 (Generic List — modern experience) |
| Item Count | 160 (as of 2026-05-17) |
| Versioning | Enabled — 50 major versions |
| Content Approval | Disabled |
| Moderation | Disabled |
| Unique Permissions | Yes |
| On Quick Launch | Yes |

#### Fields

| Display Title | Internal Name | Type | Required | Notes |
|---|---|---|---|---|
| Title | `Title` | Text | Yes | Event name |
| Date | `Date` | DateTime | No | Event start date |
| Date End | `Date_x0020_End` | DateTime | No | Event end date |
| Category | `Category` | Choice | No | Event category. Default: `Meeting` |
| Master Calendar Sync ID | `Master_x0020_Calendar_x0020_Sync` | Text | No | Stores the ID of the matching item in Master Calendar Sync. Written by the New Item flow; read by Update Item and Delete Item flows. |
| ID | `ID` | Counter | — | System auto-increment |
| Created | `Created` | DateTime | — | System timestamp |
| Modified | `Modified` | DateTime | — | System timestamp |
| Created By | `Author` | User | — | System |
| Modified By | `Editor` | User | — | System |

#### Category Field — Choice Values

Confirmed from `Master Calendar-ListSettings.json` export (2026-05-17):

`Meeting` *(default)* · `Work hours` · `Business` · `Holiday` · `Get-together` · `Gifts` · `Birthday` · `Anniversary` · `Meal` · `Keynote` · `Breakout` · `Workshop` · `Panel` · `Talk` · `Networking`

---

### 3.2 Master Calendar Sync List

**Purpose:** Outlook-integration surface. A shadow copy of all events in classic SharePoint calendar format, enabling the `stssync://` Outlook subscription protocol.

| Setting | Value |
|---|---|
| Display Name | Master Calendar Sync |
| Internal URL | `/sites/RuizNetPortal/Lists/Master Calendar Sync` |
| List ID | `284250a1-f980-419d-9d77-373c14b37f7d` |
| Base Template | 106 (Events / Calendar — classic experience) |
| Item Count | 160 (as of 2026-05-17) |
| Versioning | Disabled |
| Content Types Enabled | Yes — content type: **Event** (`0x01020019C70C71C642EA449B98AAA2C8B75C34`) |
| Content Approval | Disabled |
| Unique Permissions | Yes |
| On Quick Launch | No |

#### Fields

| Display Title | Internal Name | Type | Notes |
|---|---|---|---|
| Title | `Title` | Text | Event name (mirrored from Master Calendar) |
| Start Time | `EventDate` | DateTime | Mapped from Master Calendar `Date` field |
| End Time | `EndDate` | DateTime | Mapped from Master Calendar `Date_x0020_End` |
| All Day Event | `fAllDayEvent` | AllDayEvent | Always `true` — all events are created as all-day |
| Recurrence | `fRecurrence` | Recurrence | Not used; always false |
| Location | `Location` | Text | Not populated by any flow |
| Description | `Description` | Note (HTML) | Set by Update Item flow as `<p>[Title]</p>`. Not set by New Item flow. |
| Category | `Category` | Choice | Mirrored from Master Calendar Category |
| Master Calendar ID | `Master_x0020_Calendar_x0020_ID` | Number | Foreign key back to the Master Calendar list item ID. Written by all 3 sync flows. |
| Event Type | `EventType` | Integer | Standard SPO calendar field — not populated by flows |
| Master Series Item ID | `MasterSeriesItemID` | Integer | For recurring events — not used |

#### Cross-List Relationship

```
Master Calendar                      Master Calendar Sync
─────────────────────────────────    ────────────────────────────────────
ID ──────────────────────────────►   Master_x0020_Calendar_x0020_ID
Master_x0020_Calendar_x0020_Sync ◄── ID
Title ───────────────────────────►   Title
Date ────────────────────────────►   EventDate
Date_x0020_End ─────────────────►   EndDate
Category ───────────────────────►   Category
                                     fAllDayEvent = true (always)
                                     Description = "<p>Title</p>" (on update)
```

> **Note:** `Master_x0020_Calendar_x0020_Sync` in the Master Calendar list is stored as **Text** (not a Number lookup). The Update Item flow casts it to integer using `@int(outputs('Get_item')?['body/Master_x0020_Calendar_x0020_Sync'])` before using it as the Sync item ID.

---

## 4. Process Flow

### 4.1 Event Lifecycle (Coordinator → Outlook Subscribers)

| Step | Actor | Action | Mockup |
|---|---|---|---|
| 1 | Department Coordinator | Opens the Master Calendar list at `https://ruizfoods.sharepoint.com/sites/RuizNetPortal/Lists/mc/Calendar.aspx` | *Corporate Intranet - SharePoint Online - List - Master Calendar.jpg* |
| 2 | Department Coordinator | Clicks **+ Add new item**, fills in Title, Date, Date End, Category; saves | — |
| 3 | Power Automate (New Item flow) | Triggers within 5 minutes; creates an all-day event in Master Calendar Sync with the same Title, Date, and Category | — |
| 4 | Power Automate (New Item flow) | Writes the Sync item ID back to the `Master_x0020_Calendar_x0020_Sync` field of the source item | — |
| 5 | Outlook (subscribed employees) | New event appears automatically in their Outlook calendar under "Corporate Intranet - Master Calendar Sync" | *Corporate Intranet - Outlook - Ruiz Foods Master Calendar Synced.jpg* |

**Branch — Update event:**
> Steps 1–2 same; Power Automate Update Item flow (⚠️ currently suspended) triggers, reads the Sync ID from the source item, updates the Sync list entry.

**Branch — Delete event:**
> Coordinator deletes item; Power Automate Deleted Item flow (⚠️ currently suspended) queries Sync list by Master Calendar ID, deletes the matching Sync entry.

**Branch — Flows suspended:**
> If Update Item or Deleted Item flows are suspended, changes to existing events will **not** propagate to the Sync list or to subscribed Outlook calendars until the flows are reactivated (see [Runbook Task 4](#task-4--reactivate-a-suspended-flow)).

---

### 4.2 Employee Subscription Journey

| Step | Actor | Action | Mockup |
|---|---|---|---|
| 1 | Employee | Visits the Master Calendar page on the intranet | *Corporate Intranet - Page - Master Calendar.jpg* |
| 2 | Employee | Clicks **"Subscribe to the Master Calendar"** button/banner | *Corporate Intranet - Page - Master Calendar.jpg* |
| 3 | Employee | Microsoft Forms subscription form opens in browser | *Corporate Intranet - Form - Suscribe for Master Calendar.jpg* *(note: "Suscribe" production typo in URL/flow)* |
| 4 | Employee | Checks "Subscribe me to the Master Calendar" checkbox; clicks **Submit** | *Corporate Intranet - Form - Suscribe for Master Calendar.jpg* |
| 5 | Power Automate (Subscribe flow) | Webhook fires; retrieves form response (responder email); gets user display name from Office 365 Users; retrieves Ruiz Foods logo from SiteAssets and base64-encodes it; sends branded HTML email | — |
| 6 | Employee | Receives email "Stay Updated: Subscribe to the Ruiz Foods Master Calendar!" from `0365-PA-FLOWSVCG@ruizfoods.com` | *Corporate Intranet - Outlook - Siscribed to the Ruix Foods Master Calendar - Email Alert.jpg* *(note: "Siscribed" and "Ruix" production typos in mockup filename only)* |
| 7 | Employee | Clicks **"Sync the Master Calendar"** button in the email | *Corporate Intranet - Outlook - Siscribed to the Ruix Foods Master Calendar - Email Alert.jpg* |
| 8 | Outlook | Opens confirmation dialog: *"Connect this SharePoint Calendar to Outlook? Corporate Intranet - Master Calendar Sync"* | *Corporate Intranet - Outlook - Connect to SharePoint Calendar.jpg* |
| 9 | Employee | Clicks **Yes** | *Corporate Intranet - Outlook - Connect to SharePoint Calendar.jpg* |
| 10 | Outlook | Master Calendar Sync calendar is added under "Other Calendars"; all events appear | *Corporate Intranet - Outlook - Ruiz Foods Master Calendar Synced.jpg* |

**Branch — Subscribe flow is suspended:**
> Employee completes the form (Step 4), but no email is received (Step 6 never occurs). Reactivate the Subscribe flow (see [Runbook Task 4](#task-4--reactivate-a-suspended-flow)), then ask the employee to re-submit the form.

**Compatibility note:** The `stssync://` link in the email (Step 7) works only in **Outlook desktop on Windows**. It does not function in Outlook for Mac or Outlook Web Access.

---

## 5. Configuration Reference

### 5.1 Master Calendar List — Views

| View Title | Default | Type | Row Limit | View Fields | CAML Query |
|---|---|---|---|---|---|
| Calendar | ✅ Yes | HTML | 0 (unlimited) | Date, Date_End, Title, Title, Category | *(none — all events)* |
| All Items | No | HTML | 30 | LinkTitle, Date, Date_End, Category | `<OrderBy><FieldRef Name="Date" /></OrderBy>` |
| RssView | No | HTML *(hidden)* | 25 | Date, Date_End, Master_Calendar_Sync, Category | *(none)* |

> **URL note:** The Master Calendar list URL uses the short alias `mc`, not the display name. Correct URL: `https://ruizfoods.sharepoint.com/sites/RuizNetPortal/Lists/mc/Calendar.aspx`

### 5.2 Master Calendar Sync List — Views

| View Title | Default | Type | Row Limit | CAML Query |
|---|---|---|---|---|
| Calendar | ✅ Yes | CALENDAR | 30 | `<Where><DateRangesOverlap><FieldRef Name="EventDate" /><FieldRef Name="EndDate" /><FieldRef Name="RecurrenceID" /><Value Type="DateTime"><Month /></Value></DateRangesOverlap></Where>` |
| All Events | No | HTML | 30 | `<OrderBy><FieldRef Name="EventDate" /></OrderBy>` |
| Current Events | No | HTML | 30 | `<Where><DateRangesOverlap><FieldRef Name="EventDate" /><FieldRef Name="EndDate" /><FieldRef Name="RecurrenceID" /><Value Type="DateTime"><Now /></Value></DateRangesOverlap></Where><OrderBy><FieldRef Name="EventDate" /></OrderBy>` |

### 5.3 Outlook Sync Link

The `stssync://` link is embedded in the subscription confirmation email. It opens Outlook and prompts the user to connect the Master Calendar Sync as a subscribed calendar.

**Full link (verbatim from Subscribe flow email body):**
```
stssync://sts/?ver=1.1&type=calendar&cmd=add-folder&base-url=https%3A%2F%2Fruizfoods%2Esharepoint%2Ecom%2Fsites%2FRuizNetPortal&list-url=%2FLists%2FMaster%2520Calendar%2520Sync%2F&guid=%7B284250a1%2Df980%2D419d%2D9d77%2D373c14b37f7d%7D&site-name=Corporate%20Intranet&list-name=Master%20Calendar%20Sync
```

**Decoded parameters:**

| Parameter | Decoded Value |
|---|---|
| `ver` | `1.1` |
| `type` | `calendar` |
| `cmd` | `add-folder` |
| `base-url` | `https://ruizfoods.sharepoint.com/sites/RuizNetPortal` |
| `list-url` | `/Lists/Master Calendar Sync/` |
| `guid` | `{284250a1-f980-419d-9d77-373c14b37f7d}` (Master Calendar Sync list ID) |
| `site-name` | `Corporate Intranet` |
| `list-name` | `Master Calendar Sync` |

**Compatibility:** Windows Outlook desktop only. Does **not** work in Outlook for Mac or OWA.

---

## 6. Automation / Integration

All four flows run under the service account **`0365-PA-FLOWSVCG@ruizfoods.com`** (dedicated Power Automate service account — not a personal employee account).

---

### 6.1 New Item Flow

| Property | Value |
|---|---|
| Display name | Corporate Intranet - Master Calendar - New Item |
| Flow ID | `43dd7568-e195-4015-9e93-aebbf2738963` |
| Status | ✅ **ACTIVE** |
| Trigger type | `GetOnNewItems` (SharePoint Online) |
| Trigger list | Master Calendar (ID: `ba41b5e9-74a9-4b73-92b6-e52850322b2f`) |
| Poll frequency | Every 5 minutes |
| Created | 2025-10-08 |

**Actions (in order):**

| # | Action name | Connector / Operation | What it does |
|---|---|---|---|
| 1 | Initialize variable | Built-in | Initializes `varMasterCalendarSyncID` (String) |
| 2 | Send an HTTP request to SharePoint - Master Calendar Sync - All Day Events | `shared_sharepointonline` / `HttpRequest` | POST to `_api/web/lists/getByTitle('Master Calendar Sync')/Items` — creates a new event with Title, EventDate (from `Date`), EndDate (from `Date_x0020_End`), `fAllDayEvent: true`, `Master_x0020_Calendar_x0020_ID` set to the new item's ID |
| 3 | Get items | `shared_sharepointonline` / `GetItems` | Queries Master Calendar Sync where `Master_x0020_Calendar_x0020_ID eq [new item ID]`, top 1 |
| 4 | Apply to each | Built-in | Iterates over the result (1 item) |
| 5 | — Set variable | Built-in | Sets `varMasterCalendarSyncID` to the Sync item's `ID` |
| 6 | Update item | `shared_sharepointonline` / `PatchItem` | Updates the Master Calendar source item, writing `varMasterCalendarSyncID` into the `Master_x0020_Calendar_x0020_Sync` field (cross-reference) |

> **Note:** The New Item flow uses the SharePoint REST API for item creation (Step 2) rather than the standard connector action. This is because the `fAllDayEvent` flag requires explicit setting via REST.

---

### 6.2 Update Item Flow

| Property | Value |
|---|---|
| Display name | Corporate Intranet - Master Calendar - Update Item |
| Flow ID | `cadbabbb-caeb-42c2-bb17-4966a00806d4` |
| Status | ⚠️ **SUSPENDED** — auto-disabled 2025-11-14 (`NeverTriggeringDetected`: 90+ days without triggering) |
| Trigger type | `GetOnUpdatedItems` (SharePoint Online) |
| Trigger list | Master Calendar (ID: `ba41b5e9-74a9-4b73-92b6-e52850322b2f`) |
| Poll frequency | Every 5 minutes |

**Actions (in order):**

| # | Action name | Connector / Operation | What it does |
|---|---|---|---|
| 1 | Get item | `shared_sharepointonline_1` / `GetItem` | Reads the full updated item from Master Calendar (including `Master_x0020_Calendar_x0020_Sync` field) |
| 2 | Initialize variable - varMasterCalendarSyncID | Built-in | Initializes `varMasterCalendarSyncID` as Integer, cast from `outputs('Get_item')?['body/Master_x0020_Calendar_x0020_Sync']` |
| 3 | Update item | `shared_sharepointonline` / `PatchItem` | Updates the Master Calendar Sync item (ID: `varMasterCalendarSyncID`) with: Title, EventDate, EndDate, Description (`<p>Title</p>`), `Master_x0020_Calendar_x0020_ID`, Category |

> **Impact of suspension:** Event updates in Master Calendar are **not** propagating to Master Calendar Sync or to subscribed Outlook calendars. Subscribers see stale event data. Reactivate this flow immediately (see [Runbook Task 4](#task-4--reactivate-a-suspended-flow)).

---

### 6.3 Deleted Item Flow

| Property | Value |
|---|---|
| Display name | Corporate Intranet - Master Calendar - Deleted Item |
| Flow ID | `bcdfef22-681e-46a3-93e2-68cbdc13c80e` |
| Status | ⚠️ **SUSPENDED** — auto-disabled 2025-09-08 (`NeverTriggeringDetected`: 90+ days without triggering) |
| Trigger type | `GetOnDeletedItems` (SharePoint Online) |
| Trigger list | Master Calendar (ID: `ba41b5e9-74a9-4b73-92b6-e52850322b2f`) |
| Poll frequency | Every 5 minutes |

**Actions (in order):**

| # | Action name | Connector / Operation | What it does |
|---|---|---|---|
| 1 | Get items | `shared_sharepointonline` / `GetItems` | Queries Master Calendar Sync where `Master_x0020_Calendar_x0020_ID eq [deleted item ID]`, top 1 |
| 2 | Initialize variable | Built-in | Initializes `varMasterCalendarSyncID` (Integer) |
| 3 | Apply to each | Built-in | Iterates over query result (1 item) |
| 4 | — Set variable | Built-in | Sets `varMasterCalendarSyncID` to the Sync item's `ID` |
| 5 | Delete item | `shared_sharepointonline` / `DeleteItem` | Deletes the item from Master Calendar Sync using `varMasterCalendarSyncID` |

> **Impact of suspension:** Events deleted from Master Calendar are **not** being removed from Master Calendar Sync. Subscribers see deleted events in their Outlook until the flow is reactivated. Reactivate this flow (see [Runbook Task 4](#task-4--reactivate-a-suspended-flow)).

---

### 6.4 Subscribe Flow ("Suscribe")

> ⚠️ **Production typo:** This flow's display name is "Corporate Intranet - Master Calendar - **Suscribe**" (missing the second 's'). Do not rename the flow without re-testing the Microsoft Forms webhook connection.

| Property | Value |
|---|---|
| Display name | Corporate Intranet - Master Calendar - Suscribe *(production typo)* |
| Flow ID | `83cf4db2-4c6d-4c91-a933-b92468fb134f` |
| Status | ⚠️ **SUSPENDED** — auto-disabled 2025-09-08 (`NeverTriggeringDetected`: 90+ days without triggering) |
| Trigger type | `CreateFormWebhook` (Microsoft Forms — webhook, not polling) |
| Form ID | `py7EuNnptEuWz4JQZaVbXvw8mw1BnC5Ik5I-8MoWJIJUM1VKMldXSTdCRFA5QUlWWktMTlpWS05FUS4u` |

**Actions (in order):**

| # | Action name | Connector / Operation | What it does |
|---|---|---|---|
| 1 | Get response details | `shared_microsoftforms` / `GetFormResponseById` | Retrieves the full form submission including `responder` email address |
| 2 | Get file content using path - LOGO | `shared_sharepointonline` / `GetFileContentByPath` | Retrieves the Ruiz Foods logo from `/SiteAssets/__sitelogo__ruizsitelogo.png` on the root site (`https://ruizfoods.sharepoint.com/`) |
| 3 | Compose - LOGO | Built-in | Base64-encodes the logo binary: `base64(outputs('Get_file_content_using_path_-_LOGO')?['body'])` |
| 4 | Initialize variable - varImageTag | Built-in | Creates an HTML `<img>` tag with the base64-encoded logo as a data URI |
| 5 | Get user profile (V2) | `shared_office365users` / `UserProfile_V2` | Resolves the form responder's email to their display name |
| 6 | Send an email (V2) | `shared_office365` / `SendEmailV2` | Sends the subscription confirmation email |

**Email details:**

| Field | Value |
|---|---|
| To | Form responder's email address (`outputs('Get_response_details')?['body/responder']`) |
| Subject | `Stay Updated: Subscribe to the Ruiz Foods Master Calendar!` |
| Body | Full branded HTML — see brand template in [Section 11](#11-brand-compliance) |
| BCC | `HaaronGCONSULT@ruizfoods.com` |
| Sender | `0365-PA-FLOWSVCG@ruizfoods.com` (via Office 365 connector connection) |

> **Year mismatch:** The email body references "Master Calendar **2025**" but the SharePoint page displays "**2026** Master Calendar." Update the email body HTML in this flow action each January (see [Runbook Task 6](#task-6--annual-year-update)).

> **Impact of suspension:** Employees who submit the subscription form will **not** receive the confirmation email with the Outlook sync link. Reactivate this flow (see [Runbook Task 4](#task-4--reactivate-a-suspended-flow)).

---

## 7. Interface Documentation

### 7.1 Master Calendar Intranet Page

| Property | Value |
|---|---|
| Page title | 2026 Master Calendar |
| Site | `https://ruizfoods.sharepoint.com/sites/RuizNetPortal` |
| Navigation | Accessible via "What's Happening" menu in the top site navigation |
| Layout | Hero image banner (calendar photo) at top; subscribe call-to-action banner below hero; year-view calendar below |

**Year-view calendar display:** The page shows a 3-column month grid covering the full calendar year (Jan–Dec). Holidays are highlighted in yellow. Each month lists events by date. Events are entered as static text in the page layout (not dynamically pulled from the list for this display — the SharePoint Modern page uses a custom layout with static year content). The calendar list view is accessible separately at the list URL.

**Subscribe banner:** A prominently styled banner reading *"Don't miss a single important moment at Ruiz Foods!"* with a **"Subscribe to the Master Calendar"** button that links to the Microsoft Forms subscription form.

*Evidence: `refdocs/mockups/Corporate Intranet - Page - Master Calendar.jpg`*

---

### 7.2 Master Calendar List (Modern)

| Property | Value |
|---|---|
| URL | `https://ruizfoods.sharepoint.com/sites/RuizNetPortal/Lists/mc/Calendar.aspx` |
| Default view | Calendar view (modern) — shows events in monthly calendar format |
| Alt view | All Items — tabular list ordered by start date |
| Access | Site members (coordinators); visible to all site visitors |

*Evidence: `refdocs/mockups/Corporate Intranet - SharePoint Online - List - Master Calendar.jpg`*

---

### 7.3 Master Calendar Sync List (Classic)

| Property | Value |
|---|---|
| URL | `https://ruizfoods.sharepoint.com/sites/RuizNetPortal/Lists/Master Calendar Sync/calendar.aspx` |
| Default view | Classic SharePoint calendar (monthly view) |
| Navigation | Not on Quick Launch — accessed via Site Contents or by employees through their synced Outlook calendar |
| Purpose | Outlook integration surface only — not intended for direct employee browsing |
| Branding | Classic SharePoint experience with Ruiz Foods site navigation |

*Evidence: `refdocs/mockups/Corporate Intranet - SharePoint Online - List - Master Calendar Sync.jpg`*

---

### 7.4 Microsoft Forms Subscription Form

| Property | Value |
|---|---|
| Form title | Master Calendar 2025 Subscription *(note: year mismatch — form title says 2025)* |
| Form ID | `py7EuNnptEuWz4JQZaVbXvw8mw1BnC5Ik5I-8MoWJIJUM1VKMldXSTdCRFA5QUlWWktMTlpWS05FUS4u` |
| Form URL | `https://forms.office.com/Pages/ResponsePage.aspx?id=py7EuNnptEuWz4JQZaVbXvw8mw1BnC5Ik5I-8MoWJIJUM1VKMldXSTdCRFA5QUlWWktMTlpWS05FUS4u` |
| Questions | 1 — "Subscribe me to the Master Calendar" (checkbox / consent) |
| Intro text | Explains the benefit of subscribing and includes an inline screenshot of the Outlook sync result |
| Footer | Microsoft 365 branding footer |

*Evidence: `refdocs/mockups/Corporate Intranet - Form - Suscribe for Master Calendar.jpg`*

---

### 7.5 Subscription Confirmation Email

| Property | Value |
|---|---|
| Sender | `0365-PA-FLOWSVCG@ruizfoods.com` (display name: `O365-PA-FLOWSVC`) |
| Subject | `Stay Updated: Subscribe to the Ruiz Foods Master Calendar!` |
| Recipient | The employee who submitted the form |
| BCC | `HaaronGCONSULT@ruizfoods.com` |
| CTA button | "Sync the Master Calendar" (green `#008345`, links to `stssync://` URL) |
| Logo | Ruiz Foods logo embedded as base64 data URI, retrieved from SiteAssets |

*Evidence: `refdocs/mockups/Corporate Intranet - Outlook - Siscribed to the Ruix Foods Master Calendar - Email Alert.jpg`*

---

### 7.6 Outlook Calendar Confirmation Dialog

When the employee clicks "Sync the Master Calendar" in the email, Outlook shows:

> *"Connect this SharePoint Calendar to Outlook? You should only connect lists from sources you know and trust. Corporate Intranet - Master Calendar Sync / http://ruizfoods.sharepoint.com/sites/RuizNetPortal/Lists/Master Calendar Sync/ — To configure this Calendar, click Advanced."*

Buttons: **Advanced...** · **Yes** · **No**

*Evidence: `refdocs/mockups/Corporate Intranet - Outlook - Connect to SharePoint Calendar.jpg`*

After clicking **Yes**, the calendar appears in Outlook under "Other Calendars" as **"Corporate Intranet - Master Calendar Sync"**.

*Evidence: `refdocs/mockups/Corporate Intranet - Outlook - Ruiz Foods Master Calendar Synced.jpg`*

---

## 8. Permissions & Access

### 8.1 Permission Matrix

| Role | Master Calendar list | Master Calendar Sync list |
|---|---|---|
| Department Coordinator | Contribute (add, edit, delete events) | No direct access required — flows manage entries |
| All site visitors (employees) | Read (view events) | Not on Quick Launch — incidental read via Outlook |
| IT Admin | Full Control | Full Control |
| Service account (`0365-PA-FLOWSVCG@ruizfoods.com`) | Contribute (flows read and write) | Contribute (flows create, update, delete) |

Both lists have **unique role assignments** (`HasUniqueRoleAssignments: true`). They do **not** inherit permissions from the parent site.

> **Critical:** The service account `0365-PA-FLOWSVCG@ruizfoods.com` must have Contribute access to **both** lists. If this account's permissions are removed or the account is deactivated, all four Power Automate flows will fail.

### 8.2 How to Add a New Department Coordinator

1. Navigate to **Master Calendar** list → **Settings** → **List permissions**
2. Click **Grant Permissions**
3. Enter the coordinator's email address; select **Contribute** permission level
4. Uncheck "Send an email invitation" if preferred; click **Share**
5. Instruct the coordinator to access the list at: `https://ruizfoods.sharepoint.com/sites/RuizNetPortal/Lists/mc/AllItems.aspx`

> No access to Master Calendar Sync is needed — coordinators only manage the Master Calendar list.

### 8.3 Microsoft Forms Ownership

The subscription form was created under a user account. If that account is deactivated, the Microsoft Forms webhook trigger in the Subscribe flow may break.

**Recommendation:** Transfer form ownership to the service account or a shared admin account via Microsoft Forms → **Settings** → **Co-authors / Transfer ownership**.

---

## 9. Operational Runbook

---

### Task 1 — Add a New Event

1. Sign in to the Corporate Intranet: `https://ruizfoods.sharepoint.com/sites/RuizNetPortal`
2. Navigate to the Master Calendar list: `https://ruizfoods.sharepoint.com/sites/RuizNetPortal/Lists/mc/AllItems.aspx`
3. Click **+ Add new item** in the command bar
4. Fill in:
   - **Title** — event name (required)
   - **Date** — start date
   - **Date End** — end date (can be same as start for single-day events)
   - **Category** — select from the dropdown (see [Section 3.1](#category-field--choice-values) for all choices)
5. Click **Save**
6. Wait up to 5 minutes for the New Item flow to mirror the event in Master Calendar Sync (and by extension, in subscribed Outlook calendars)

---

### Task 2 — Edit an Existing Event

1. Navigate to the Master Calendar list (see Task 1, Step 2)
2. Locate the event — use the **All Items** view for easier searching, or the Calendar view to browse by date
3. Click the event title to open the item form
4. Click **Edit** (pencil icon)
5. Update the desired fields; click **Save**
6. ⚠️ **The Update Item flow is currently suspended.** The change will **not** propagate to Master Calendar Sync or to Outlook subscribers until the flow is reactivated. Reactivate the flow first (see Task 4), then wait up to 5 minutes for the update to appear in Outlook.

---

### Task 3 — Delete an Event

1. Navigate to the Master Calendar list
2. Select the checkbox next to the event
3. Click **Delete** in the command bar; confirm deletion
4. ⚠️ **The Deleted Item flow is currently suspended.** The event will **not** be removed from Master Calendar Sync or from Outlook until the flow is reactivated. Reactivate the flow first (see Task 4), then wait up to 5 minutes.

---

### Task 4 — Reactivate a Suspended Flow

**Applies to:** Update Item (suspended 2025-11-14), Deleted Item (suspended 2025-09-08), Subscribe (suspended 2025-09-08)

1. Sign in to Power Automate: `https://make.powerautomate.com`
2. Select the correct **environment** if prompted (Ruiz Foods tenant)
3. In the left navigation, click **My flows**
4. Find the suspended flow. Suspended flows are shown with a warning banner. You can search by name:
   - "Corporate Intranet - Master Calendar - Update Item"
   - "Corporate Intranet - Master Calendar - Deleted Item"
   - "Corporate Intranet - Master Calendar - Suscribe" *(note typo)*
5. Click the flow to open it
6. At the top of the flow detail page, click **Turn on** (or look for the "Enable" action if the flow is listed as disabled)
7. Verify the flow status changes to **On**
8. Test by performing the relevant action (e.g., edit an event to test the Update Item flow) and check the flow's **28 day run history** to confirm it triggered successfully

> **To prevent future auto-suspension:** Microsoft automatically suspends flows that have not triggered in 90+ days. For the Delete and Subscribe flows (which trigger infrequently), consider setting a calendar reminder for every 60 days to manually trigger or verify the flow is still active. Alternatively, set up a Microsoft Teams or email alert via the flow's failure notification settings.

---

### Task 5 — Prevent Future Flow Suspension

Microsoft auto-suspends flows that have not triggered in 90 days.

**Option A — Enable failure alerts (recommended):**
1. Open the flow in Power Automate
2. Click the **⋯** (more options) menu → **Settings**
3. Enable **"Send me email notifications for failed runs"**
4. The flow will alert you if it fails — though suspension prevention requires a trigger, not just monitoring

**Option B — Calendar reminder:**
1. Create a recurring calendar event in Outlook every 60 days: "Check suspended PA flows"
2. In the reminder, manually run the flow or create a test event to trigger it

**Option C — Add a scheduled trigger (advanced):**
For the Subscribe flow specifically (event-driven, infrequent), consider adding a second manual/scheduled trigger that runs a no-op action monthly to keep it active.

---

### Task 6 — Annual Year Update

Each January, update references to the current year in the following locations:

**A. SharePoint Master Calendar page:**
1. Navigate to the Master Calendar page on the intranet
2. Click **Edit** (top-right)
3. Update the page title and any year-specific text (e.g., "2026 Master Calendar" → "2027 Master Calendar")
4. Update the year-view calendar section with the new year's events
5. Click **Republish**

**B. Subscribe flow email template:**
1. Open the Subscribe flow in Power Automate
2. Locate the **Send an email (V2)** action
3. Click **Show advanced options** to expand the HTML body
4. Find all occurrences of the year (e.g., `2025`) in the HTML and update them to the new year
5. Update the email subject if it contains the year
6. Save the flow

**C. Microsoft Forms form title:**
1. Open the subscription form in Microsoft Forms
2. Update the form title (e.g., "Master Calendar 2025 Subscription" → "Master Calendar 2027 Subscription")
3. Save

---

### Task 7 — Troubleshoot Outlook Sync Link Not Working

**Symptom:** Employee clicks "Sync the Master Calendar" in the email but nothing happens, or Outlook does not show the confirmation dialog.

**Diagnosis steps:**
1. **Verify Outlook client** — the `stssync://` protocol works **only in Outlook desktop on Windows**. Ask the employee:
   - Are they using Outlook desktop (not OWA or Outlook for Mac)?
   - Are they on Windows?
2. **Verify the employee received the email** — if the Subscribe flow was suspended, the email was never sent. Confirm the flow is active (see Task 4)
3. **Try opening the link manually:**
   - Copy the `stssync://` link from the email
   - Paste it into a browser address bar on the employee's computer
   - Outlook should open the dialog
4. **Verify network/firewall** — some corporate firewalls block custom protocol handlers. Escalate to network team if needed
5. **Manual alternative (no link required):**
   - In Outlook desktop, go to **File → Account Settings → Account Settings**
   - Click **Internet Calendars** tab → **New**
   - Enter the web calendar URL for Master Calendar Sync (SharePoint ICAL feed, if available)

---

### Task 8 — Check Flow Run History

1. Sign in to Power Automate: `https://make.powerautomate.com`
2. Navigate to **My flows**
3. Click the flow to open its detail page
4. Scroll to the **28 day run history** section
5. Click any run to see:
   - Status (Succeeded / Failed)
   - Start time and duration
   - Each action's input/output (expand the action to see details)
6. For failed runs: look for the action that shows "Failed" and expand to read the error message

---

### Task 9 — Add a New Department Coordinator

See [Section 8.2](#82-how-to-add-a-new-department-coordinator) for detailed steps.

After granting access, provide the coordinator with:
- List URL: `https://ruizfoods.sharepoint.com/sites/RuizNetPortal/Lists/mc/AllItems.aspx`
- Category choices reference (see Section 3.1)
- Instructions to allow up to 5 minutes for new events to appear in Outlook for subscribers

---

## 10. Data Snapshot Evidence

### List Item Counts

| List | Item Count | Export Date |
|---|---|---|
| Master Calendar | 160 | 2026-05-17 |
| Master Calendar Sync | 160 | 2026-05-17 |

Both lists have identical counts, confirming the New Item flow has been successfully mirroring all events (at the time of export, the New Item flow was active).

### Category Field Confirmation

The Category field choice values below are confirmed from `Master Calendar-ListSettings.json` (exported 2026-05-17 via PnP PowerShell — not guessed):

`Meeting` (default) · `Work hours` · `Business` · `Holiday` · `Get-together` · `Gifts` · `Birthday` · `Anniversary` · `Meal` · `Keynote` · `Breakout` · `Workshop` · `Panel` · `Talk` · `Networking`

### Field Internal Names Confirmation

All field internal names in Section 3 are sourced directly from `Master Calendar-ListSettings.json` and `Master Calendar Sync-ListSettings.json` exports. Key custom fields:

| Display Title | Internal Name | Source file |
|---|---|---|
| Date | `Date` | `Master Calendar-ListSettings.json` |
| Date End | `Date_x0020_End` | `Master Calendar-ListSettings.json` |
| Category | `Category` | `Master Calendar-ListSettings.json` |
| Master Calendar Sync ID | `Master_x0020_Calendar_x0020_Sync` | `Master Calendar-ListSettings.json` |
| Master Calendar ID | `Master_x0020_Calendar_x0020_ID` | `Master Calendar Sync-ListSettings.json` |

### Flow Suspension Dates (Confirmed from Exports)

| Flow | Suspension Date | Source |
|---|---|---|
| Subscribe | 2025-09-08 | `CorporateIntranet-MasterCalendar-Suscribe_.../definition.json` → `flowclientsuspensiontime` |
| Deleted Item | 2025-09-08 | `CorporateIntranet-MasterCalendar-DeletedItem_.../definition.json` → `flowclientsuspensiontime` |
| Update Item | 2025-11-14 | `CorporateIntranet-MasterCalendar-UpdateItem_.../definition.json` → `flowclientsuspensiontime` |

---

## 11. Brand Compliance

### 11.1 Brand Table

| Component | Dimension | Value / Reference |
|---|---|---|
| Subscription email | Primary button color | `#008345` (Ruiz Foods green) |
| Subscription email | Heading / link color | `#0066cc` (corporate blue) |
| Subscription email | Background | `#f2f2f2` (outer) / `#ffffff` (content area) |
| Subscription email | Logo | Ruiz Foods logo — retrieved from SharePoint SiteAssets: `/SiteAssets/__sitelogo__ruizsitelogo.png` |
| Subscription email | Logo display | Centered, embedded as base64 data URI in `<img>` tag |
| Subscription email | Tone | Professional and welcoming — first person address ("Dear [Name]"), benefit-led bullets, brand-aligned CTA |
| Subscription email | Sender display name | `O365-PA-FLOWSVC` (auto-derived from service account) |
| SharePoint Modern page | Site theme | Ruiz Foods corporate intranet theme (Fluent UI aligned) — dark navy top navigation bar |
| SharePoint Modern page | Hero image | Full-width banner with a calendar/food photography image |
| Microsoft Forms form | Styling | Microsoft Forms default styling — no custom branding applied |
| Microsoft Forms form | Background | Ruiz Foods-themed image background (food photography) |
| Outlook calendar name | Calendar display name | "Corporate Intranet - Master Calendar Sync" |

### 11.2 Email Button Template (CTA)

The "Sync the Master Calendar" button in the subscription email uses this inline HTML:

```html
<table style="border-collapse:separate;background-color:#008345;margin-left:auto;margin-right:auto;"
       role="presentation" cellspacing="0" cellpadding="0" align="center">
  <tr>
    <td style="background:#008345;border-radius:3px;padding:10px 25px;">
      <a style="background:#008345;color:#ffffff;font-size:16px;font-weight:bold;
                text-decoration:none;padding:10px 25px;border-radius:3px;"
         href="stssync://sts/?ver=1.1&type=calendar&cmd=add-folder&...">
        Sync the Master Calendar
      </a>
    </td>
  </tr>
</table>
```

### 11.3 Tone of Voice (Email Copy)

The subscription confirmation email uses a welcoming, benefit-forward tone:
- Opens with a personalized greeting: *"Dear [Display Name],"*
- Leads with gratitude and reinforces the value proposition
- Uses three benefit bullets with emoji icons: 📅 Stay Informed, ⏰ Plan Ahead, 🔄 Real-Time Updates
- Closes with a human touch: *"Thank you for being part of the Ruiz Foods family"*
- Support contact: Christina Johnson (`christinaj@ruizfoods.com`)

### 11.4 Known Production Typos (Do Not Silently Correct)

| Location | Typo | Correct spelling | Action |
|---|---|---|---|
| Power Automate flow display name | "Corporate Intranet - Master Calendar - **Suscribe**" | "Subscribe" | Document as-is. Do not rename — the Microsoft Forms webhook is bound to this flow. Renaming may require re-testing. |
| Mockup filename | "Corporate Intranet - Outlook - **Siscribed** to the **Ruix** Foods Master Calendar - Email Alert.jpg" | "Subscribed", "Ruiz" | Filename-only typo. The email content is correct. |
| Microsoft Forms title | "Master Calendar **2025** Subscription" | "2026" | Update annually per Runbook Task 6. |
| Subscribe flow email body | "...Master Calendar **2025**..." | "2026" | Update annually per Runbook Task 6. |

---

*This document was generated using the VISION Framework on 2026-05-17.*
*Repository: `https://github.com/helpdsp/RF_MasterCalendar`*
*All field names, list IDs, and flow IDs are confirmed from live SharePoint/Power Automate exports in `refdocs/`.*
