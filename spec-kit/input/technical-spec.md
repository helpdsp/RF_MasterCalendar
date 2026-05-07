# Technical Specification — Invoices for Tax Team

## 1. Platform & Environment

| Attribute | Value |
|-----------|-------|
| Platform | Microsoft 365 / SharePoint Online |
| Tenant | `ruizfoods.sharepoint.com` |
| Site URL | `https://ruizfoods.sharepoint.com/sites/InvoiceforTaxTeam` |
| Site type | Communication Site (OOTB) |
| In production since | 2025 |
| Custom code | None (zero SPFx development) |
| Third-party apps | PnP Modern Search v4 (`pnp-modern-search-parts-v4.sppkg`) |

---

## 2. Document Libraries

All four libraries are SharePoint Document Libraries (`BaseTemplate: 101`, `BaseType: 1`). They share identical configuration except for title, URL, and item count.

| Library Title | URL Path | Item Count | Root Folder |
|---------------|----------|------------|-------------|
| Accounts Payable | `/sites/InvoiceforTaxTeam/AP` | 173,704 | `/AP` |
| Fixed Assets | `/sites/InvoiceforTaxTeam/FA` | 11,985 | `/FA` |
| FY2023 | `/sites/InvoiceforTaxTeam/FY2023` | 16 | `/FY2023` |
| FY2024 | `/sites/InvoiceforTaxTeam/FY2024` | 45,933 | `/FY2024` |

**Shared library settings (all four):**

| Setting | Value |
|---------|-------|
| `EnableVersioning` | `true` |
| `EnableMinorVersions` | `false` |
| `EnableModeration` | `false` |
| `ForceCheckout` | `false` |
| `ContentTypesEnabled` | `true` |
| `OnQuickLaunch` | `true` |

---

## 3. Content Type Hierarchy

Group: **Invoice for Tax Team**

```
Item (0x01)
└── Document (0x0101)
    └── Invoice Document (0x010100E3917FC38B21344BB4F75ADAC1414E19)  ← base custom CT
        ├── Accounts Payable (0x010100E3917FC38B21344BB4F75ADAC1414E1901)
        └── Fixed Asset (0x010100E3917FC38B21344BB4F75ADAC1414E1902)
```

Each content type has **13 fields** (including inherited system fields + the 5 custom columns).

---

## 4. Custom Site Columns

All defined in group **"Custom Columns"** at site level.

| Display Title | Internal Name | Type | Required | Hidden | Read-Only |
|---------------|---------------|------|----------|--------|-----------|
| Fiscal Year | `Fiscal_x0020_Year` | Text | No | No | No |
| Received Date | `Received_x0020_Date` | DateTime | No | No | No |
| From | `EMail` | Text | No | No | No |
| To | `To` | Text | No | No | No |
| Subject | `Subject` | Text | No | No | No |

> `From` maps to SharePoint's `EMail` internal name (from "Core Contact and Calendar Columns"). `Subject` maps to the "Core Document Columns" group field.

---

## 5. Library Views

Each library has the same view set:

| View Title | URL Slug | Default | Hidden | CAML Filter | Row Limit |
|------------|----------|---------|--------|-------------|-----------|
| All Documents | `Forms/AllItems.aspx` | Yes | No | `ORDER BY ID DESC` | 30 |
| Bulk Edit View | `Forms/Not PDFs.aspx` (AP) / `Forms/Bulk Edit View.aspx` (others) | No | No | `ContentType = "Invoice Document"` AND `ORDER BY ID DESC` | 4,999 |
| assetLibTemp | `Forms/Thumbnails.aspx` | No | Yes | `ORDER BY LinkFilename` | 20 |
| Merge Documents | `Forms/Combine.aspx` | No | Yes | `ORDER BY FileLeafRef` | 30 |
| Relink Documents | `Forms/repair.aspx` | No | Yes | `xd_Signature != 1` AND `ORDER BY FileLeafRef` | 30 |
| RssView | `Forms/RssView.aspx` | No | Yes | (none) | 25 |
| Raw | `Forms/PersonalViews.aspx` | No | No | (none) | 30 |

> **Note:** The Accounts Payable "Bulk Edit View" URL slug is `Forms/Not PDFs.aspx` — this is a production typo/legacy name; do not rename as it would break existing links.

> **Note:** "Raw" view exists only on Fixed Assets library.

---

## 6. Search & PnP Modern Search v4

### Installed App
- Package: `pnp-modern-search-parts-v4.sppkg`
- Deployed to: App Catalog → Site Collection App

### Web Parts on Landing Page
The site landing page hosts a faceted search experience composed of PnP Modern Search v4 web parts:
- **Search Box** — keyword input
- **Search Refiners** — facet panel (managed properties mapped to custom columns)
- **Search Results** — paginated results list

### Managed Properties
SharePoint Search Managed Properties are configured to index the custom columns and expose them as refiners. The exact mappings are visible in `refdocs/Manage Properties.jpg`. Key properties expected (to be verified in Search Admin):
- Mapped to `Fiscal_x0020_Year` → Text managed property for refinement
- Mapped to `Received_x0020_Date` → DateTime managed property for date range refinement
- Mapped to `EMail` (`From`) → Text managed property for sender refinement

---

## 7. Power Automate Flows

Two separate flows are inferred from the solution design:

### Flow 1: AP Invoice Capture
- **Trigger:** When a new email arrives in `AP@ruizfoods.com` mailbox
- **Connector:** Office 365 Outlook (shared mailbox)
- **Actions:**
  1. Get email metadata (From, To, Subject, Received Time)
  2. Determine Fiscal Year from Received Time
  3. Create file in SharePoint `Accounts Payable` library (save email as .eml or body as PDF/HTML)
  4. Update file metadata: `EMail`, `To`, `Subject`, `Received_x0020_Date`, `Fiscal_x0020_Year`
  5. Set Content Type to `Accounts Payable`

### Flow 2: FA Invoice Capture
- Same structure as Flow 1, targeting `FixedAssets@ruizfoods.com` mailbox and `Fixed Assets` library, with Content Type set to `Fixed Asset`

### Service Account
- **Status: OPEN GAP** — The identity (personal vs. service account) running these flows is not confirmed from refdocs. Must be verified in Power Automate → My Flows / Team Flows.

---

## 8. Permissions Architecture

| Role | SharePoint Group | Permission Level | Scope |
|------|-----------------|-----------------|-------|
| Tax Team Members | Site Members | Read | Site (inherited by all libraries) |
| IT Administrators | Site Owners | Full Control | Site |
| Power Automate | (service account added directly or via group) | Contribute | Site or Library level — TBD |

- No broken permission inheritance on any library.
- Members cannot upload, edit, delete, or check out documents.
- `EnableModeration: false` on all libraries — no approval workflow.

---

## 9. Constraints & Dependencies

- All solution components must remain OOTB-maintainable (no SPFx, no custom code).
- PnP Modern Search v4 must be re-deployed if the site collection app catalog is reset.
- Power Automate flows depend on the service account having access to the shared mailboxes AND SharePoint library.
- SharePoint Search crawl must index the custom columns for the faceted search experience to work — any column added later requires a managed property to be created and a re-crawl.
- FY archive libraries (FY2023, FY2024) must be created manually for each new fiscal year; this is an admin operational task.
