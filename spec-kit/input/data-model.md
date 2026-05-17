# Data Model — Ruiz Foods Master Calendar

## Master Calendar List

**Display name:** Master Calendar
**Internal URL:** `/sites/RuizNetPortal/Lists/mc` (note: short alias `mc`, not the display name)
**List ID:** `ba41b5e9-74a9-4b73-92b6-e52850322b2f`
**BaseTemplate:** 100 (Generic List, modern experience)
**BaseType:** GenericList
**Item Count:** 160 (as of 2026-05-17)
**Versioning:** Enabled (50 major versions)
**Moderation:** Disabled
**Content Approval:** Disabled
**Unique Permissions:** Yes (`HasUniqueRoleAssignments: true`)
**On Quick Launch:** Yes

### Content Types

| Name | ID |
|---|---|
| Item (custom) | `0x0100ACEBF5E09117A0408D179F5F88EB46E70095451E2EA972B64F9FE785D30CB2DBCB` |
| Folder | `0x012000C468287ADE28DF41B6DEDAF82AD9344E` |

### Fields

| Display Title | Internal Name | Static Name | Type | Required | Notes |
|---|---|---|---|---|---|
| Title | `Title` | `Title` | Text | Yes (system) | Event name |
| Date | `Date` | `Date` | DateTime | No | Event start date. ID: `e5f3905d-3499-45a1-b278-0238a9acb3c6` |
| Date End | `Date_x0020_End` | `Date_x0020_End` | DateTime | No | Event end date. ID: `42e15071-de4c-41f0-8e9b-50af31462795` |
| Category | `Category` | `Category` | Choice | No | Event category. Default: `Meeting`. ID: `f8cbd7ff-7630-4046-9d74-cfe1e9725add` |
| Master Calendar Sync ID | `Master_x0020_Calendar_x0020_Sync` | `Master_x0020_Calendar_x0020_Sync` | Text | No | Stores the ID of the corresponding item in Master Calendar Sync list. Written by New Item flow. ID: `49b434da-a20f-4098-b7fc-625179c91bc6` |
| ID | `ID` | `ID` | Counter | No | System auto-increment identifier |
| Created | `Created` | `Created` | DateTime | No | System — item creation timestamp |
| Modified | `Modified` | `Modified` | DateTime | No | System — last modified timestamp |
| Created By | `Author` | `Author` | User | No | System — item creator |
| Modified By | `Editor` | `Editor` | User | No | System — last modifier |

### Category Field — Choice Values

Confirmed from `Master Calendar-ListSettings.json` export (not guessed):

| Value | Notes |
|---|---|
| Meeting | **Default value** |
| Work hours | |
| Business | |
| Holiday | Typically used for federal/company holidays (highlighted in yellow on page) |
| Get-together | |
| Gifts | |
| Birthday | |
| Anniversary | |
| Meal | |
| Keynote | |
| Breakout | |
| Workshop | |
| Panel | |
| Talk | |
| Networking | |

### Views

| Title | Default | ViewType | RowLimit | ViewFields | CAML Query |
|---|---|---|---|---|---|
| Calendar | ✅ Yes | HTML | 0 (unlimited) | Date, Date_End, Title, Title, Category | *(none — all events)* |
| All Items | No | HTML | 30 | LinkTitle, Date, Date_End, Category | `<OrderBy><FieldRef Name="Date" /></OrderBy>` |
| RssView | No | HTML (hidden) | 25 | Date, Date_End, Master_Calendar_Sync, Category | *(none)* |

---

## Master Calendar Sync List

**Display name:** Master Calendar Sync
**Internal URL:** `/sites/RuizNetPortal/Lists/Master Calendar Sync`
**List ID:** `284250a1-f980-419d-9d77-373c14b37f7d`
**BaseTemplate:** 106 (Events / Calendar, classic experience)
**BaseType:** GenericList
**Item Count:** 160 (as of 2026-05-17)
**Versioning:** Disabled
**Moderation:** Disabled
**Content types enabled:** Yes
**Content type:** Event (`0x01020019C70C71C642EA449B98AAA2C8B75C34`)
**Unique Permissions:** Yes (`HasUniqueRoleAssignments: true`)
**On Quick Launch:** No

### Fields

| Display Title | Internal Name | Type | Notes |
|---|---|---|---|
| Title | `Title` | Text | Event name (mirrored from Master Calendar) |
| Start Time | `EventDate` | DateTime | Event start date. Mapped from Master Calendar `Date` field |
| End Time | `EndDate` | DateTime | Event end date. Mapped from Master Calendar `Date_x0020_End` field |
| All Day Event | `fAllDayEvent` | AllDayEvent | Always set to `true` by New Item flow. All events are all-day. |
| Recurrence | `fRecurrence` | Recurrence | Not used; always false |
| Location | `Location` | Text | Not populated by flows |
| Description | `Description` | Note (HTML) | Set by Update Item flow as `<p>Title</p>`. Not set by New Item flow. |
| Category | `Category` | Choice | Mirrored from Master Calendar Category field |
| Master Calendar ID | `Master_x0020_Calendar_x0020_ID` | Number | Foreign key back to the Master Calendar list item ID. Written by all 3 sync flows. ID: confirmed in flow definitions |
| Event Type | `EventType` | Integer | Standard SPO calendar field |
| Workspace | `Workspace` | URL | Standard SPO calendar field |
| Master Series Item ID | `MasterSeriesItemID` | Integer | For recurring events (not used) |

### Views

| Title | Default | ViewType | RowLimit | Key CAML |
|---|---|---|---|---|
| Calendar | ✅ Yes | CALENDAR | 30 | `<DateRangesOverlap>` on EventDate/EndDate/RecurrenceID with `<Month />` |
| All Events | No | HTML | 30 | `<OrderBy><FieldRef Name="EventDate" /></OrderBy>` |
| Current Events | No | HTML | 30 | `<DateRangesOverlap>` with `<Now />`, ordered by EventDate |

### Outlook Sync Link (stssync://)

The `stssync://` protocol is a SharePoint classic calendar feature that allows Outlook desktop to subscribe to the list as a connected calendar.

```
stssync://sts/?ver=1.1&type=calendar&cmd=add-folder
  &base-url=https%3A%2F%2Fruizfoods%2Esharepoint%2Ecom%2Fsites%2FRuizNetPortal
  &list-url=%2FLists%2FMaster%2520Calendar%2520Sync%2F
  &guid=%7B284250a1%2Df980%2D419d%2D9d77%2D373c14b37f7d%7D
  &site-name=Corporate%20Intranet
  &list-name=Master%20Calendar%20Sync
```

**Compatibility:** Windows Outlook desktop only. Does not work in Outlook for Mac, OWA, or Outlook mobile.
When clicked, Outlook shows a dialog: *"Connect this SharePoint Calendar to Outlook? Corporate Intranet - Master Calendar Sync"*. After confirmation, the calendar appears under "Other Calendars."

---

## Cross-List Relationship

```
Master Calendar (mc)               Master Calendar Sync
─────────────────────              ─────────────────────────────
ID (auto)          ─────────────► Master_x0020_Calendar_x0020_ID
Master_x0020_Calendar_x0020_Sync ◄─ ID (auto)
Title                ─────────── ► Title
Date                 ─────────── ► EventDate
Date_x0020_End       ─────────── ► EndDate
Category             ─────────── ► Category
                                   fAllDayEvent = true (always)
                                   Description = "<p>Title</p>"
```

The `Master_x0020_Calendar_x0020_Sync` field in Master Calendar stores the text representation of the Sync item ID. The Update Item flow reads this as an integer (`int()` expression) to target the correct Sync item for updates.
