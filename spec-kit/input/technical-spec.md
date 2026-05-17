# Technical Specification — Ruiz Foods Master Calendar

## Solution Overview

The Ruiz Foods Master Calendar is a 100% Microsoft 365-native solution. There is no custom code, no SPFx, no Azure Functions, and no third-party services. All components are configured in the M365 tenant `ruizfoods.sharepoint.com`.

## Component Inventory

| Component | Type | Platform | Identifier / URL |
|---|---|---|---|
| Corporate Intranet site | SharePoint Online Communication Site | SharePoint Online | `https://ruizfoods.sharepoint.com/sites/RuizNetPortal` |
| Master Calendar list | Custom List (BaseTemplate 100, modern) | SharePoint Online | ID: `ba41b5e9-74a9-4b73-92b6-e52850322b2f` · `/sites/RuizNetPortal/Lists/mc` |
| Master Calendar Sync list | Events/Calendar list (BaseTemplate 106, classic) | SharePoint Online | ID: `284250a1-f980-419d-9d77-373c14b37f7d` · `/sites/RuizNetPortal/Lists/Master Calendar Sync` |
| New Item flow | Power Automate Cloud Flow | Power Automate | ID: `43dd7568-e195-4015-9e93-aebbf2738963` |
| Update Item flow | Power Automate Cloud Flow | Power Automate | ID: `cadbabbb-caeb-42c2-bb17-4966a00806d4` |
| Deleted Item flow | Power Automate Cloud Flow | Power Automate | ID: `bcdfef22-681e-46a3-93e2-68cbdc13c80e` |
| Subscribe flow | Power Automate Cloud Flow | Power Automate | ID: `83cf4db2-4c6d-4c91-a933-b92468fb134f` |
| Subscription form | Microsoft Forms | Microsoft Forms | ID: `py7EuNnptEuWz4JQZaVbXvw8mw1BnC5Ik5I-8MoWJIJUM1VKMldXSTdCRFA5QUlWWktMTlpWS05FUS4u` |
| Service account | M365 user account | Azure AD | `0365-PA-FLOWSVCG@ruizfoods.com` |
| Ruiz Foods logo | Image file | SharePoint SiteAssets | `/SiteAssets/__sitelogo__ruizsitelogo.png` |
| Tenant | M365 tenant | Azure AD | Tenant ID: `b8c42ea7-e9d9-4bb4-96cf-825065a55b5e` |

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│              Corporate Intranet (RuizNetPortal)              │
│                                                             │
│  ┌─────────────────────┐    ┌──────────────────────────┐   │
│  │  Master Calendar    │    │  Master Calendar Sync    │   │
│  │  (Custom List)      │◄───│  (Classic SPO Calendar)  │   │
│  │  BaseTemplate: 100  │    │  BaseTemplate: 106       │   │
│  │  160 items          │───►│  160 items               │   │
│  └────────┬────────────┘    └──────────┬───────────────┘   │
│           │                            │                    │
└───────────┼────────────────────────────┼────────────────────┘
            │                            │
            │  Power Automate Flows      │  stssync:// link
            │  (polling every 5 min)     │
    ┌───────▼──────────────────┐         │
    │  New Item flow   ACTIVE  │─────────┘ (creates Sync item)
    │  Update Item  ⚠ SUSPENDED│────────── (updates Sync item)
    │  Deleted Item ⚠ SUSPENDED│────────── (deletes Sync item)
    └──────────────────────────┘
            
    ┌──────────────────────────┐         ┌──────────────────┐
    │  Microsoft Forms         │────────►│  Subscribe flow  │
    │  (subscription form)     │         │  ⚠ SUSPENDED     │
    └──────────────────────────┘         └────────┬─────────┘
                                                   │
                                                   ▼
                                    ┌──────────────────────────┐
                                    │  Office 365 email        │
                                    │  (branded HTML)          │
                                    │  Sender: 0365-PA-FLOWSVCG│
                                    └────────────┬─────────────┘
                                                 │
                                                 ▼
                                    ┌──────────────────────────┐
                                    │  Outlook Calendar        │
                                    │  (stssync:// sync)       │
                                    │  Windows desktop only    │
                                    └──────────────────────────┘
```

## Data Flow

1. **Department Coordinator** creates/edits/deletes an event in the **Master Calendar** list (modern SharePoint UI)
2. A **Power Automate flow** (polling every 5 minutes) detects the change and mirrors it in **Master Calendar Sync**
3. The New Item flow also writes the resulting Sync item's ID back to the `Master_x0020_Calendar_x0020_Sync` field of the source Master Calendar item (cross-reference)
4. **Employees** who have subscribed have the Master Calendar Sync connected to their Outlook via the `stssync://` protocol — changes appear in their Outlook calendar within the polling interval

**Subscription path:**
1. Employee visits the Master Calendar SharePoint page and clicks "Subscribe"
2. Employee fills in the Microsoft Forms form (single checkbox)
3. **Subscribe flow** (webhook trigger) retrieves the employee's display name, base64-encodes the Ruiz Foods logo from SiteAssets, and sends a branded HTML email
4. Employee clicks "Sync the Master Calendar" button in the email
5. Outlook opens a confirmation dialog ("Connect this SharePoint Calendar to Outlook?")
6. Employee clicks "Yes" — the calendar is added to Outlook under "Other Calendars" as "Corporate Intranet - Master Calendar Sync"

## Power Automate: Connector References

| Connector | Internal API ID | Connection Name used in flows |
|---|---|---|
| SharePoint Online | `shared_sharepointonline` | `7ae38965814a41978fcc7ada9d119282` (primary) |
| SharePoint Online (secondary) | `shared_sharepointonline` | `shared-sharepointonl-626961c3-a4c2-4840-b3b0-25016b1a8028` |
| Office 365 Outlook | `shared_office365` | `d8fe850e4d5144f4b4ab67202e949ec3` |
| Office 365 Users | `shared_office365users` | `shared-office365user-da21f4f6-a67a-4f90-9a1b-718b-60263b2b` |
| Microsoft Forms | `shared_microsoftforms` | `shared-microsoftform-7e48760b-66dc-49d3-8c2a-b8d8360812bb` |

## Flow Suspension Status (as of 2026-05-17)

| Flow | Status | Suspended On | Reason |
|---|---|---|---|
| New Item | ✅ ACTIVE | — | `flowclientsuspensionreason: "None"` |
| Update Item | ⚠️ SUSPENDED | 2025-11-14 | `NeverTriggeringDetected` — 90+ days without triggering |
| Deleted Item | ⚠️ SUSPENDED | 2025-09-08 | `NeverTriggeringDetected` — 90+ days without triggering |
| Subscribe (Suscribe) | ⚠️ SUSPENDED | 2025-09-08 | `NeverTriggeringDetected` — 90+ days without triggering |

**Implication:** Events added after Sept 2025 are not propagating updates or deletes to Outlook subscribers. The Subscribe flow is not sending confirmation emails to new subscribers.

## Outlook Sync Link Anatomy

```
stssync://sts/
  ?ver=1.1
  &type=calendar
  &cmd=add-folder
  &base-url=https%3A%2F%2Fruizfoods%2Esharepoint%2Ecom%2Fsites%2FRuizNetPortal
  &list-url=%2FLists%2FMaster%2520Calendar%2520Sync%2F
  &guid=%7B284250a1%2Df980%2D419d%2D9d77%2D373c14b37f7d%7D
  &site-name=Corporate%20Intranet
  &list-name=Master%20Calendar%20Sync
```

Decoded:
- `base-url` → `https://ruizfoods.sharepoint.com/sites/RuizNetPortal`
- `list-url` → `/Lists/Master Calendar Sync/`
- `guid` → `{284250a1-f980-419d-9d77-373c14b37f7d}` (Master Calendar Sync list ID)
- `site-name` → `Corporate Intranet`
- `list-name` → `Master Calendar Sync`

**Compatibility:** This `stssync://` protocol works only in **Outlook desktop on Windows**. It does not function in Outlook for Mac or Outlook Web Access (OWA).

## Known Production Issues

| Issue | Impact | Remediation |
|---|---|---|
| 3 flows suspended | Event updates/deletes don't propagate to Outlook; no subscription emails sent | Reactivate flows in Power Automate (see Runbook, Task 4) |
| "Suscribe" typo in flow name | Cosmetic only — no functional impact | Document as-is; do not rename without re-testing Forms webhook |
| Year name mismatch | Email templates say "2025", page says "2026" | Update Subscribe flow email HTML body each January (see Runbook, Task 6) |
| All events are all-day | Time-specific events not supported | Documented limitation; not in scope to change |
| `stssync://` Mac/OWA incompatibility | Mac users cannot subscribe via Outlook | Documented limitation; no workaround currently available |
| 5-minute polling delay | Events appear in Sync list up to 5 min after being added to Master Calendar | Expected behavior; document in runbook |
