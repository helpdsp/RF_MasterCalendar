# Brief — Ruiz Foods Master Calendar KT Document

## Executive Summary

The **Ruiz Foods Master Calendar** is a company-wide event hub built on SharePoint Online and Power Automate, hosted at the Corporate Intranet portal (`https://ruizfoods.sharepoint.com/sites/RuizNetPortal`). It publishes all Ruiz Foods events for the year — holidays, board meetings, townhalls, sales conferences, and facility-level activities — on a branded SharePoint Modern page visible to all employees, and enables any employee to subscribe and receive those same events directly in their Microsoft Outlook calendar, synchronized in real time.

The solution uses a dual-list architecture: a custom **Master Calendar** SharePoint list (modern experience) holds the authoritative event data managed by department coordinators, while a **Master Calendar Sync** SharePoint Calendar list (classic experience) serves as the Outlook-integration surface. Four Power Automate cloud flows keep both lists in sync on every create, update, and delete, and handle the employee subscription flow via Microsoft Forms and automated email.

This KT document is produced so that a new IT administrator or developer can fully assume ownership of the solution — understanding its architecture, data model, automation logic, operational procedures, and known issues — without requiring prior access to the live system or direct knowledge transfer from the original builder.

---

## Context

The solution originated in 2024 when Jesse Sowell requested an "Op Co Calendar" to centralize operational events. **Sal G** expanded the scope to cover all Ruiz Foods employees and renamed it the **Master Calendar**. Requirement approval and build proceeded the same year. The solution has been in production since 2024 on the `RuizNetPortal` SharePoint site, which serves as the Ruiz Foods Corporate Intranet ("La Cocina").

A critical operational issue exists: **three of the four Power Automate flows are currently suspended** due to Microsoft's auto-suspension policy (flows inactive for 90+ days are automatically disabled). The Subscribe, Update Item, and Delete Item flows are all offline as of this writing (suspended between September and November 2025). Only the New Item flow remains active. Reactivating all four flows and documenting the prevention procedure is an explicit deliverable of this KT.

The solution contact for operational questions is **Christina Johnson** (`christinaj@ruizfoods.com`). All four flows run under the dedicated service account **`0365-PA-FLOWSVCG@ruizfoods.com`**, which eliminates the personal-account risk for flow continuity.

---

## Goals

- Document the full technical architecture of the Master Calendar solution for a new IT admin/developer who has never seen it
- Produce a complete data model for both SharePoint lists with all field internal names, types, and choice values from the live exports
- Document all four Power Automate flows step-by-step, including their current suspension status and reactivation procedure
- Document the subscription user experience end-to-end: Forms → email → Outlook dialog → calendar sync
- Provide an operational runbook covering every routine admin task (adding events, updating the year title, reactivating suspended flows, troubleshooting the Outlook sync link)
- Document the annual year-transition procedure (manual admin task — updating the page title and email templates each January)
- Capture known production issues and their remediation steps
- Map all brand compliance elements (colors, logo usage, email template)

---

## Target Users / Roles

| Role | Description | Interaction with solution |
|---|---|---|
| **IT Admin / New Owner** | Primary KT audience — the person taking ownership | Manages flows, lists, page, annual updates, troubleshooting |
| **Department Coordinator** | HR, Sales, Finance, Facilities, etc. — one per area | Creates, edits, and deletes events in the Master Calendar list |
| **Employee (Subscriber)** | Any Ruiz Foods employee | Fills out the Microsoft Forms subscription form; receives sync email; uses Outlook calendar |
| **IT Leadership / Management** | Functional overview audience | Reads Section 1 to understand business value; does not operate the system |

---

## Scope — In

- **Master Calendar list** — full field documentation, views, settings, permissions
- **Master Calendar Sync list** — full field documentation, views, settings, permissions (classic calendar)
- **Power Automate flows (all 4)** — New Item, Update Item, Deleted Item, Subscribe — trigger, actions, connectors, service account, suspension status, reactivation steps
- **Microsoft Forms** — subscription form fields, form ID, flow webhook trigger
- **SharePoint Modern page** — Master Calendar intranet page (URL, layout, web parts used, year-view display, Subscribe banner/button)
- **Subscription email** — HTML template, sender (service account), Outlook sync link anatomy, `stssync://` protocol explanation
- **Outlook integration** — `stssync://` link behavior, Outlook confirmation dialog, resulting calendar appearance
- **Operational runbook** — adding/editing/deleting events, annual year update, flow reactivation, troubleshooting Outlook sync, checking flow run history
- **Brand compliance** — Ruiz Foods colors (#008345 green, #0066cc blue), logo usage in email, email tone
- **Permissions** — list-level permissions for both lists, coordinator access model
- **Known issues** — 3 flows suspended; "Suscribe" typo in production flow name/form; year naming inconsistency ("2025" in email template vs. "2026" on page)

---

## Scope — Out / Non-goals

- Building new features or modifying the existing solution
- SPFx web parts, custom code, or PowerShell scripts for ongoing management
- Power Apps or custom form experiences (solution uses standard SharePoint list forms + Microsoft Forms)
- Recurrence events (the calendar uses `fAllDayEvent = true` for all events; recurring events are not currently used)
- Multi-language or localization support
- Mobile app experience (solution is desktop-only intranet)

---

## Functional Requirements Summary

### FR-01 — Event publication (Master Calendar list)
Department coordinators add, edit, and delete events in the Master Calendar custom list. Events have a Title, start Date, end Date, and Category. The default view is a Calendar view; an All Items list view is also available for tabular management.

### FR-02 — Outlook sync bridge (Master Calendar Sync list)
A parallel SharePoint Calendar list (classic experience, BaseTemplate 106) maintains a mirror copy of all events. It carries the standard calendar fields (`EventDate`, `EndDate`, `fAllDayEvent`) plus a custom `Master_x0020_Calendar_x0020_ID` field linking each sync item back to its source in the Master Calendar. This list exposes the native SharePoint `stssync://` Outlook subscription mechanism.

### FR-03 — Real-time sync (3 Power Automate flows)
- **New Item flow**: triggers when an item is created in Master Calendar → creates the matching item in Master Calendar Sync (all-day event) → writes the Sync item ID back to the `Master_x0020_Calendar_x0020_Sync` field of the source item. Polls every 5 minutes.
- **Update Item flow**: triggers when an item is created or modified in Master Calendar → reads the existing Sync ID from the source item → updates the corresponding Sync item. Polls every 5 minutes. ⚠️ Currently suspended.
- **Deleted Item flow**: triggers when an item is deleted from Master Calendar → queries Sync list for the matching ID → deletes the Sync item. Polls every 5 minutes. ⚠️ Currently suspended.

### FR-04 — Employee subscription (Microsoft Forms + Subscribe flow)
Employees visit the Master Calendar intranet page and click "Subscribe to the Master Calendar." A Microsoft Forms form (single checkbox question) is embedded or linked. On submission:
1. Power Automate Subscribe flow (webhook trigger) fires
2. Flow retrieves the form response and the user's display name via Office 365 Users connector
3. Flow retrieves the Ruiz Foods logo from SharePoint SiteAssets (`__sitelogo__ruizsitelogo.png`) and base64-encodes it
4. Flow sends a branded HTML email to the subscriber with the Outlook sync link
5. Subscriber clicks "Sync the Master Calendar" → Outlook opens a confirmation dialog → calendar is added to Outlook under "Other Calendars" as "Corporate Intranet - Master Calendar Sync"
⚠️ Subscribe flow currently suspended.

### FR-05 — Annual year update (manual)
Each calendar year, an admin updates the SharePoint page title (e.g., "2026 Master Calendar") and the email template subject/body references to the new year. This is a manual operation documented in the runbook.

---

## Technical Stack & Constraints

| Component | Technology | Notes |
|---|---|---|
| Intranet platform | SharePoint Online (Microsoft 365) | Modern Communication Site experience |
| Primary data store | SharePoint Custom List (BaseTemplate 100) | `Master Calendar` — 160 items as of 2026-05-17 |
| Outlook sync bridge | SharePoint Calendar List (BaseTemplate 106) | `Master Calendar Sync` — 160 items; classic experience; not on Quick Launch |
| Automation | Power Automate Cloud Flows | 4 flows; service account `0365-PA-FLOWSVCG@ruizfoods.com` |
| Subscription form | Microsoft Forms | Single-question form; webhook trigger |
| Email delivery | Office 365 / Outlook connector | Sent by service account; HTML email with embedded logo |
| User directory | Office 365 Users connector | Used by Subscribe flow to resolve display name |
| File storage | SharePoint SiteAssets | Logo stored at `/SiteAssets/__sitelogo__ruizsitelogo.png` |
| Outlook sync protocol | `stssync://` (SharePoint classic calendar) | Deep link; works only in Outlook desktop (not web) |
| No custom code | — | No SPFx, no Azure Functions, no third-party services |

**Known constraints:**
- The `stssync://` protocol works only in Outlook desktop on Windows; it does not function in Outlook for Mac or Outlook Web Access
- All events in Master Calendar Sync are set as all-day events (`fAllDayEvent = true`) — time-specific events are not supported by the current implementation
- Power Automate polling interval is 5 minutes — there is an inherent delay between event creation in Master Calendar and appearance in Master Calendar Sync / Outlook

---

## Success Criteria

- A new IT admin with no prior knowledge of this solution can take full ownership using this document alone
- Every SharePoint field is documented with its exact internal name, type, and choice values as exported from production
- Every Power Automate flow action is described step-by-step with connector names and field mappings
- The subscription user journey is documented with reference to each mockup screenshot
- All three suspended flows are identified with their suspension dates and reactivation steps
- The operational runbook is executable: each task is written as numbered steps without assumed prior knowledge
- Brand elements (colors, logo, email tone) are mapped to each user-facing component
- All production typos are documented as-is (not silently corrected): "Suscribe" in flow name/form, "Sync" list not on Quick Launch

---

## Open Questions / Risks

| # | Item | Status |
|---|---|---|
| OQ-01 | **3 flows suspended** — Subscribe, Update Item, and Delete Item have been inactive since Aug–Nov 2025. New events added since then are not propagating updates/deletes to Outlook subscribers. | Document and provide reactivation runbook |
| OQ-02 | **Year naming inconsistency** — Email templates reference "Master Calendar 2025" while the intranet page shows "2026 Master Calendar." The email body was not updated when the page was. | Document in runbook: update email template HTML in Subscribe flow each January |
| OQ-03 | **`stssync://` Mac/web compatibility** — The Outlook sync link does not work in Outlook for Mac or OWA. No workaround is currently documented for Mac users. | Flag as known limitation in KT |
| OQ-04 | **Microsoft Forms form ownership** — The subscription form was created under a user account. If that account is deactivated, the form and the Subscribe flow webhook may break. | Document form ID; recommend transferring ownership to service account or shared mailbox |
| OQ-05 | **"Suscribe" production typo** — The Subscribe flow display name and the internal flow name both contain "Suscribe" (missing the second 's'). This typo exists in production and should not be renamed without verifying the Forms webhook still resolves. | Document as-is; note typo exists in production |

---

## Input Sources

- `refdocs/Master Calendar-ListSettings.json` — SharePoint list settings, views, and all field definitions (exported 2026-05-17)
- `refdocs/Master Calendar Sync-ListSettings.json` — SharePoint calendar list settings, views, and fields (exported 2026-05-17)
- `refdocs/Master Calendar-Schema.xml` — Full SharePoint list XML schema
- `refdocs/Master Calendar Sync-Schema.xml` — Full SharePoint calendar XML schema
- `refdocs/CorporateIntranet-MasterCalendar-NewItem_20260517111014/` — Power Automate New Item flow export
- `refdocs/CorporateIntranet-MasterCalendar-UpdateItem_20260517111041/` — Power Automate Update Item flow export
- `refdocs/CorporateIntranet-MasterCalendar-DeletedItem_20260517111102/` — Power Automate Delete Item flow export
- `refdocs/CorporateIntranet-MasterCalendar-Suscribe_20260517111131/` — Power Automate Subscribe flow export
- `refdocs/mockups/Corporate Intranet - Home.jpg` — Intranet home page with navigation context
- `refdocs/mockups/Corporate Intranet - Page - Master Calendar.jpg` — Master Calendar intranet page (year-view layout)
- `refdocs/mockups/Corporate Intranet - Form - Suscribe for Master Calendar.jpg` — Microsoft Forms subscription form
- `refdocs/mockups/Corporate Intranet - Outlook - Siscribed to the Ruix Foods Master Calendar - Email Alert.jpg` — Subscription confirmation email in Outlook
- `refdocs/mockups/Corporate Intranet - Outlook - Connect to SharePoint Calendar.jpg` — Outlook confirmation dialog for calendar sync
- `refdocs/mockups/Corporate Intranet - Outlook - Ruiz Foods Master Calendar Synced.jpg` — Outlook calendar with Master Calendar Sync connected
- `refdocs/mockups/Corporate Intranet - SharePoint Online - List - Master Calendar.jpg` — Master Calendar list in calendar view (modern UI)
- `refdocs/mockups/Corporate Intranet - SharePoint Online - List - Master Calendar Sync.jpg` — Master Calendar Sync list in classic calendar view
- `planning/clarifications/brief.json` — Clarification answers (2026-05-17): KT doc goal, Subscribe flow in scope, dept-coordinator governance, manual year transition
- Stakeholder input: flows run under `0365-PA-FLOWSVCG@ruizfoods.com` (dedicated service account)
