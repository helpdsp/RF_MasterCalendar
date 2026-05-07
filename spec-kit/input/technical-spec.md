# Technical Specification — Ruiz Foods Praise Program (KT Document)

## 1. Solution Architecture

The Praise Program is a **Microsoft 365-native, no-code solution**. There are no custom applications, SPFx web parts, or third-party services. All components run within the Ruiz Foods M365 tenant.

```
Employee (Browser)
      │
      ▼
SharePoint Online — RuizNetPortal (/sites/RuizNetPortal/)
  ├── Intranet Landing Page          ← entry point links
  ├── View Current Praises Page      ← approved praise gallery
  ├── View Submitted Praises Page    ← employee self-service
  └── Praise List (Recognition)      ← system of record
        │ (new item trigger)
        ▼
Power Automate — Approval Flow
  ├── Teams Approvals connector ──► Microsoft Teams (HR Manager)
  │                                  └── Approvals App
  └── Send Email connector ─────► Microsoft Outlook
        ├── Praise Alert Email
        └── Congratulations Email (on approval)
```

## 2. Component Inventory

| # | Component | Type | Platform | Location / URL pattern |
|---|---|---|---|---|
| 1 | Praise List | SharePoint List | SharePoint Online | `/sites/RuizNetPortal/Lists/Recognition/` |
| 2 | Praise (Archive) List | SharePoint List | SharePoint Online | `/sites/RuizNetPortal/Lists/` |
| 3 | Praise Cards List | SharePoint List | SharePoint Online | `/sites/RuizNetPortal/Lists/` |
| 4 | Praise Submission Form | Microsoft List Form | SharePoint Online | `/sites/RuizNetPortal/Lists/Recognition/Untitled Form.aspx` |
| 5 | Intranet Landing Page | SharePoint Page | SharePoint Online | `/sites/RuizNetPortal/SitePages/` |
| 6 | View Current Praises Page | SharePoint Page | SharePoint Online | `/sites/RuizNetPortal/SitePages/` |
| 7 | View Submitted Praises Page | SharePoint Page | SharePoint Online | `/sites/RuizNetPortal/SitePages/` |
| 8 | Approval Flow | Power Automate Cloud Flow | Power Automate | Ruiz Foods tenant / Default environment |
| 9 | HR Approval Interface | Teams Approvals App | Microsoft Teams | Approvals tab in Teams |
| 10 | Praise Alert Email | Outlook email template | Power Automate / Outlook | Sent via flow |
| 11 | Congratulations Email | Outlook email template | Power Automate / Outlook | Sent via flow on approval |

## 3. SharePoint Site Configuration

| Attribute | Value |
|---|---|
| Site type | Communication site (SharePoint Online) |
| Site URL | `/sites/RuizNetPortal/` |
| Site name | RuizNetPortal |
| Lists on Quick Launch | Praise list is hidden from Quick Launch (accessed via Pages) |
| Content approval | Enabled on Praise list |

## 4. Power Automate Flow — Specification

### Trigger
- **Type:** SharePoint — When an item is created
- **Site:** `/sites/RuizNetPortal/`
- **List:** Recognition (Praise)

### Flow Steps (documented order)

| Step | Action | Connector | Notes |
|---|---|---|---|
| 1 | When item is created | SharePoint | Trigger on Praise list |
| 2 | Start and wait for an approval | Teams Approvals | Routes to HR Manager(s); surfaces praised employee details |
| 3 | Condition: Approval outcome | Control | Branches on Approved / Rejected |
| 4a (Approved) | Update item — moderation status | SharePoint | Sets `_ModerationStatus` to Approved (0) |
| 4b (Approved) | Send an email | Outlook / O365 | Congratulations email to recognized employee |
| 4c (Rejected) | Update item — moderation status | SharePoint | Sets `_ModerationStatus` to Rejected (2) |

### Approval Card Fields Surfaced to HR
- Praised employee (Praise for / Recognitionfor)
- Submitter (Praise from / Author)
- Core Value Demonstrated (Category)
- Description
- Manager

## 5. SharePoint List Views — Query Reference

### Praise List Views

| View | CAML Filter | Order | Row Limit |
|---|---|---|---|
| All Items (default) | `_ModerationStatus = Approved` | ID DESC | 30 |
| Approve/reject Items | GroupBy `_ModerationStatus` | — | 30 |
| My submissions | `Author = [Me]`, GroupBy `_ModerationStatus` | ID DESC | 30 |
| Top 10 Recognitions | `Status = Approved` | ID DESC | 10 |
| Top 10 Recognitions Cards | `Status = Approved` | ID DESC | 10 |
| HomePage | — (no filter) | — | 30 |
| Welcome to the Praise Form! | Hidden | — | 30 |

## 6. Microsoft List Form Configuration

- **Form name:** "Welcome to the Praise Form!"
- **View URL:** `/sites/RuizNetPortal/Lists/Recognition/Untitled Form.aspx`
- **Type:** Microsoft List custom form (no Power Apps, no SPFx)
- **Fields shown:** Praise for, Core Value Demonstrated, Description, Manager
- **Hidden from default navigation:** Yes (linked from SharePoint page)

## 7. Permissions Model

| Role | SharePoint List Access | Flow Access | Teams Approvals |
|---|---|---|---|
| Employee (all) | Contribute (submit new items); Read approved items only | None | None |
| HR Manager | Read all items; Approve/reject via moderation | None | Receive & process approvals |
| IT Administrator | Full Control | Owner/Edit of flow | — |

> Note: The "All Items" default view enforces `_ModerationStatus = Approved` so contributors cannot see pending/rejected items outside of their own "My submissions" view.

## 8. Content Moderation Mechanics

The Praise list has **Content Approval** enabled (`EnableModeration: true`). When a new item is created:
- The item is assigned `_ModerationStatus = Pending (2)`
- Only users with **Approve Items** permission see all moderation states
- Regular contributors only see items with `_ModerationStatus = Approved (0)` in the default view
- The Power Automate flow programmatically sets moderation status after HR decision via SharePoint REST API call (`/_api/web/lists/...`)

## 9. Brand / Theming

| Component | Brand Dimension | Reference Document |
|---|---|---|
| SharePoint pages | Color palette, typography | Learning Color Brand Guide.pdf |
| Email templates | Logo, color, tone of voice | RZF003_22 El Monterey_Brand_Guidelines.pdf |
| Praise submission form copy | Tone of voice | RZF003_22 El Monterey_Brand_Guidelines.pdf |
| Icon field values | Icon style | RZF003_22 El Monterey_Brand_Guidelines.pdf |

## 10. Licensing Requirements

| Service | License Required |
|---|---|
| SharePoint Online | Microsoft 365 (any plan with SPO) |
| Power Automate | Microsoft 365 plan with Power Automate included, or Power Automate per-user/per-flow |
| Teams Approvals App | Microsoft Teams (included with M365) |
| Outlook / Exchange Online | Microsoft 365 (any plan with Exchange) |

No Power Platform premium connectors or Dataverse licenses are required for this solution.

## 11. Key Admin Tasks

| Task | Where | Frequency |
|---|---|---|
| Approve/reject praises | Teams Approvals App | On submission |
| Add HR approver to flow | Power Automate — approval step | As needed |
| Archive old praises | Manually export to Praise (Archive) list | Periodically |
| Update Core Value choices | Praise list column settings — Category field | When values change |
| Update SharePoint pages | SharePoint page editor | As needed |
| Monitor flow runs | Power Automate — Run history | On failures |
