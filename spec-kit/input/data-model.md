# Data Model — Ruiz Foods Praise Program

## Overview

The solution uses three SharePoint Online lists as its data store. All lists live on the RuizNetPortal site (`/sites/RuizNetPortal/`). There is no external database, Dataverse, or SQL backend.

| List | Internal Name | List ID | Role |
|---|---|---|---|
| Praise | Recognition | `64333b56-6447-4aea-8765-0e5766b05e4f` | System of record — active submissions |
| Praise (Archive) | — | — | Historical praises moved from active list |
| Praise Cards | — | — | Display companion for card-layout rendering |

---

## List 1: Praise (Recognition)

**List URL:** `/sites/RuizNetPortal/Lists/Recognition/`
**BaseTemplate:** 100 (Generic List)
**Content moderation:** Enabled (`EnableModeration: true`)
**Versioning:** Enabled (major versions only)
**Content types:** Enabled
**Quick Launch:** Hidden
**Item count (at time of export):** 9

### Custom Fields (non-system)

| Display Title | Internal Name | Type | Required | Notes |
|---|---|---|---|---|
| Praise for | `Recognitionfor` | User | **Yes** | Employee being recognized |
| Core Value Demonstrated | `Category` | Choice | **Yes** | Primary classification dimension |
| Description | `Description` | Note (multi-line) | **Yes** | Praise narrative text |
| Manager | `Manager` | User | **Yes** | Manager of the recognized employee |
| Status | `Status` | Choice | No | Secondary status field (in addition to moderation) |
| Department | `Department` | Text | No | Department of recognized employee |
| Icon | `Icon` | Text | No | Brand-compliant icon identifier |
| Comments | `Comments` | Note (multi-line) | No | Additional comments |
| Likes | `Likes` | User | No | Single-user like field |
| Praise from2 | `Recognition_x0020_from` | User | No | Alternate submitter field |

### System Fields (key)

| Display Title | Internal Name | Type | Notes |
|---|---|---|---|
| Approval Status | `_ModerationStatus` | ModStat | Controls content visibility (Pending=2, Approved=0, Rejected=1) |
| Approver Comments | `_ModerationComments` | Note | HR rejection reason |
| Praise from | `Author` | User | Auto-set to submitting user |
| Created | `Created` | DateTime | Auto-set on submission |
| Modified | `Modified` | DateTime | Auto-updated |
| ID | `ID` | Counter | Auto-increment primary key |

### Views

| View Title | View URL | Default | Filter | Order | Row Limit |
|---|---|---|---|---|---|
| All Items | `/AllItems.aspx` | Yes | `_ModerationStatus = Approved` | ID DESC | 30 |
| Approve/reject Items | `/mod-view.aspx` | No | None | GroupBy `_ModerationStatus` DESC | 30 |
| HomePage | `/HomePage.aspx` | No | None | — | 30 |
| My submissions | `/my-sub.aspx` | No | `Author = [Me]` | ID DESC, GroupBy status | 30 |
| Top 10 Recognitions | `/Top 5 Recongnitions.aspx` | No | `Status = Approved` | ID DESC | 10 |
| Top 10 Recognitions Cards | `/Top 10 Recognitions Cards.aspx` | No | `Status = Approved` | ID DESC | 10 |
| Welcome to the Praise Form! | `/Untitled Form.aspx` | No | None | — | 30 (Hidden) |

---

## List 2: Praise (Archive)

**Purpose:** Long-term storage of praises moved from the active Praise list.
**Structure:** Mirrors the core field structure of the Praise list.

### Key Custom Fields

| Display Title | Internal Name | Type | Required |
|---|---|---|---|
| (Same core fields as Praise list — see above) | | | |

> The archive is managed manually by IT Admin. There is no automated archiving flow.

---

## List 3: Praise Cards

**Purpose:** Display-optimized companion list for rendering approved praises as visual cards on SharePoint pages. Populated in coordination with the Praise list (not automatically synced — manual or flow-driven).

### Custom Fields

| Display Title | Internal Name | Type | Required | Notes |
|---|---|---|---|---|
| Title | `Title` | Text | **Yes** | Card title / praise headline |
| To | `To` | User | **Yes** | Recognized employee |
| From | `From` | User | **Yes** | Submitting employee |
| Icon | `Icon` | Text | No | Brand icon identifier (matches Praise list Icon field) |
| Description | `Description` | Note | No | Praise text for display |
| Likes | `Likes` | UserMulti | No | Multi-user likes on the card |

---

## Content Moderation State Machine (Praise List)

```
[Submit] → _ModerationStatus = Pending (2)
               │
     Power Automate triggers approval
               │
      ┌────────┴────────┐
      │                 │
  [Approved]        [Rejected]
      │                 │
Status = Approved (0)  Status = Rejected (1)
Visible in All Items   Not visible in default view
Congratulations email  (submitter may be notified)
sent
```

---

## Data Sample (from Praise.csv export)

The `refdocs/Praise.csv` file contains the live export of praise submissions. The `refdocs/Praise(Archive).csv` file contains historical records. These CSV files serve as evidence of the production data structure and values.

Key observations from data:
- `Category` field contains Core Values choices (exact values documented in list column settings)
- `_ModerationStatus` values: 0 = Approved, 1 = Rejected, 2 = Pending

---

## SharePoint Schema Files

Full XML schemas exported from SharePoint are available in `refdocs/`:

| File | List |
|---|---|
| `Praise-Schema.xml` | Praise (Recognition) — complete list schema |
| `Praise(Archive)-Schema.xml` | Praise (Archive) — complete list schema |
| `Praise Cards-Schema.xml` | Praise Cards — complete list schema |

These XML files are the authoritative source for reconstructing the lists if needed.
