# Brief — Invoices for Tax Team (SharePoint Online)

## Executive Summary

The **Invoices for Tax Team** site (`https://ruizfoods.sharepoint.com/sites/InvoiceforTaxTeam`) is a production Microsoft 365 solution for Ruiz Foods, Inc. deployed in 2025. It consolidates invoice-related emails from two high-volume shared mailboxes — `AP@ruizfoods.com` (Accounts Payable) and `FixedAssets@ruizfoods.com` (Fixed Assets) — into structured, searchable SharePoint document libraries.

The solution was designed to replace a shared mailbox (`InvoicesforTaxTeam@ruizfoods.com`) that was approaching Microsoft 365 storage limits. Power Automate flows monitor the two source mailboxes and automatically route each incoming email — along with its metadata (sender, recipient, subject, received date, fiscal year) — into the appropriate SharePoint document library. Tax Team members receive read-only access and interact with the content through a faceted search experience built on the **PnP Modern Search v4** web part, providing an Outlook-like browsing and filtering experience within SharePoint.

The site holds over **231,600 documents** across four document libraries and is the authoritative archive of invoice correspondence for the Finance / Tax team.

## Context

Ruiz Foods' Tax Team received and archived invoice-related emails using a shared mailbox (`InvoicesforTaxTeam@ruizfoods.com`). As the volume of emails from `AP@ruizfoods.com` and `FixedAssets@ruizfoods.com` grew, the shared mailbox approached its Microsoft 365 storage capacity limit, threatening the team's ability to receive and retain new correspondence.

The IT team designed this SharePoint-based solution to:
1. Eliminate the storage constraint by moving archived emails and attachments into SharePoint Online document libraries (which have significantly higher capacity limits).
2. Enforce strict read-only access so that Tax Team members can view invoices without modifying or deleting them.
3. Reproduce and improve on the email search experience by deploying PnP Modern Search v4 — enabling faceted filtering by sender, fiscal year, received date, and other metadata fields.
4. Maintain organizational separation between Accounts Payable and Fixed Assets invoice streams, and provide fiscal-year-based archive libraries (FY2023, FY2024) alongside active incoming libraries.

The solution is 100% Microsoft 365 out-of-the-box (plus PnP Modern Search v4 as an installable SPFx app). No custom code, no SPFx development, no Dataverse.

## Goals

- **Resolve storage limit:** Move invoice email archival from a near-capacity shared mailbox to SharePoint Online document libraries with ample capacity.
- **Maintain read-only access:** All Tax Team site members have read-only access; only IT Administrators can add, edit, or delete documents.
- **Provide rich search:** Enable faceted search (by sender, fiscal year, date range, subject, content type) using PnP Modern Search v4 — replicating and improving on the Outlook search experience.
- **Auto-classify incoming mail:** Power Automate flows capture email metadata into structured SharePoint columns (`Received Date`, `From`, `To`, `Subject`, `Fiscal Year`) and tag documents with the correct content type (`Accounts Payable` or `Fixed Asset`).
- **Support fiscal-year archival:** Maintain separate archive libraries (FY2023, FY2024) for completed fiscal years alongside active inboxes for AP and FA.
- **Zero custom code:** Remain maintainable by IT staff without SPFx developers or external vendors.

## Target Users / Roles

| Role | Description | Access |
|------|-------------|--------|
| Tax Team Member | Finance/Tax staff who need to search and view invoice documents | Read-only (site Members group) |
| IT Administrator | IT staff who configure the site, manage flows, update permissions | Full control / Owner |
| Power Automate Service Account | Automated agent that routes emails to libraries | Contributor (write to libraries) |
| AP / FA Mailbox Users | Senders to `AP@ruizfoods.com` and `FixedAssets@ruizfoods.com` — they trigger the flow indirectly | No direct site access |

> **Open question:** Is the Power Automate flow running under a personal account or a dedicated service account? Personal accounts cause flow failures when the employee leaves Ruiz Foods.

## Scope — In

- **SharePoint Online Site:** `https://ruizfoods.sharepoint.com/sites/InvoiceforTaxTeam`
- **4 Document Libraries:**
  - `Accounts Payable` (AP) — active AP inbox, 173,704 documents, URL: `/sites/InvoiceforTaxTeam/AP`
  - `Fixed Assets` (FA) — active FA inbox, 11,985 documents, URL: `/sites/InvoiceforTaxTeam/FA`
  - `FY2023` — archive for fiscal year 2023, 16 documents, URL: `/sites/InvoiceforTaxTeam/FY2023`
  - `FY2024` — archive for fiscal year 2024, 45,933 documents, URL: `/sites/InvoiceforTaxTeam/FY2024`
- **Custom Content Type Hierarchy** (group: "Invoice for Tax Team"):
  - `Invoice Document` (base, `0x010100E3917FC38B21344BB4F75ADAC1414E19`) — 13 fields
  - `Accounts Payable` (child, `0x010100E3917FC38B21344BB4F75ADAC1414E1901`) — 13 fields
  - `Fixed Asset` (child, `0x010100E3917FC38B21344BB4F75ADAC1414E1902`) — 13 fields
- **Custom Site Columns** (Group: "Custom Columns"):
  - `Fiscal Year` (`Fiscal_x0020_Year`, Text)
  - `Received Date` (`Received_x0020_Date`, DateTime)
  - `From` (`EMail`, Text) — email sender
  - `To` (`To`, Text) — email recipient
  - `Subject` (`Subject`, Text) — from "Core Document Columns" group
- **PnP Modern Search v4** (`pnp-modern-search-parts-v4.sppkg`) — faceted search experience on the site landing page
- **Power Automate Cloud Flows** — email-to-SharePoint routing for AP and FA mailboxes
- **SharePoint Pages** — intranet landing page with PnP Modern Search web part (search refiners and results panels shown in mockups)
- **SharePoint Managed Properties** — configured for PnP Modern Search faceted filtering (documented in `Manage Properties.jpg`)
- **Read-only permissions** for site Members group

## Scope — Out / Non-goals

- No Microsoft Teams channels, tabs, or Approvals
- No Power Apps or custom forms
- No Power BI dashboards
- No Microsoft Forms
- No Dataverse
- No SPFx custom code or custom web parts (PnP Modern Search is a packaged OOTB app)
- No email composition or outbound notifications from SharePoint
- No document editing by Tax Team members (strict read-only)
- No content moderation (all four libraries have `EnableModeration: false`)
- No required check-out (`ForceCheckout: false` on all libraries)

## Functional Requirements Summary

### Epic 1: Email Capture & Classification
- Power Automate flow monitors `AP@ruizfoods.com` inbox; on new email arrival, creates a document in the **Accounts Payable** library, populating: `From` (EMail), `To`, `Subject`, `Received Date`, `Fiscal Year`, content type = `Accounts Payable`.
- Separate Power Automate flow does the same for `FixedAssets@ruizfoods.com` → **Fixed Assets** library, content type = `Fixed Asset`.
- Documents are stored as email files or email body extracts; attachments may be included.

### Epic 2: Document Library Structure
- Four document libraries, each with `BaseTemplate: 101` (document library), versioning enabled, content types enabled, Quick Launch visibility on.
- All libraries share the same custom column set and content type hierarchy.
- Default view: ordered by ID descending, 30 rows.
- **Bulk Edit View:** filters to `ContentType = "Invoice Document"`, 4,999 rows — allows bulk metadata editing by administrators.

### Epic 3: Faceted Search Experience
- SharePoint site page hosts PnP Modern Search v4 web parts: a search input, refiners panel (facets by sender, fiscal year, date, content type), and results panel.
- Mockups show two states: empty state (no results) and populated state (with search refiners visible).
- Managed Properties are configured in SharePoint Search to enable faceted filtering on the custom columns.

### Epic 4: Access Control & Governance
- Site Members group = read-only; no edit, delete, or upload capability for Tax Team users.
- Site Owners / IT = full control.
- Service account (Power Automate) = contributor access to write documents.

### Epic 5: Fiscal Year Archiving
- Completed fiscal years are archived into dedicated libraries (FY2023, FY2024).
- Active fiscal year traffic routes to AP and FA libraries.
- Migration process for moving documents from active to archive libraries is an operational admin task.

## Technical Stack & Constraints

| Component | Technology | Notes |
|-----------|------------|-------|
| Platform | SharePoint Online (Microsoft 365) | Tenant: `ruizfoods.sharepoint.com` |
| Document Libraries | SharePoint Document Library (BaseTemplate 101) | 4 libraries, versioning on, moderation off |
| Content Types | SharePoint Site Content Types | Custom group "Invoice for Tax Team"; 3 types in hierarchy |
| Email Routing | Power Automate Cloud Flows | Monitors AP and FA mailboxes; service account TBD |
| Search UX | PnP Modern Search v4 | SPFx app package `pnp-modern-search-parts-v4.sppkg` installed on site |
| Search Configuration | SharePoint Managed Properties | Configured to expose custom columns for refiners |
| Permissions | SharePoint groups (OOTB) | Members = read only; Owners = full control |
| Brand | Ruiz Foods / El Monterey brand guidelines | Applied to page design and any user-facing text |

**Constraints:**
- No custom code — all components must remain maintainable via SharePoint Admin Center and Power Automate UI.
- Storage: AP library alone has 173,704 documents; KT documentation must note growth trajectory.
- Read-only enforcement: no list-level permissions required (site-level inheritance); Members group permission level is "Read."

## Success Criteria

- A new IT Administrator can assume full ownership of the site without prior knowledge, using only this KT document.
- Tax Team members can search for any invoice by sender, fiscal year, date range, or keyword using the PnP Modern Search interface.
- Power Automate flows continue routing emails to the correct library after administrator changes (no personal-account dependency).
- All four document libraries are documented with full field tables and operational runbook steps.
- The solution remains compliant with Ruiz Foods read-only access requirements for Tax Team members.

## Open Questions / Risks

1. **Power Automate service account:** The identity running the flows is undocumented. If it is a personal employee account, the flow will fail when that employee leaves. Must confirm and potentially migrate to a service account.
2. **PDF request details (`#87823`):** The original IT ticket PDF could not be parsed in this session. Additional context from that ticket may reveal flow configuration details, approval chain, or stakeholder contacts not captured in the schema exports.
3. **Managed Properties screenshot only:** `Manage Properties.jpg` is a visual screenshot — exact managed property names mapped to custom columns are not in machine-readable form. Admin must verify current configuration in SharePoint Admin Center > Search > Manage Search Schema.
4. **FY2023 low document count (16):** FY2023 has only 16 documents vs. FY2024's 45,933. This may indicate the migration to SharePoint started mid-2023 or that FY2023 was partially migrated. Admin should verify if migration is complete.
5. **Brand PDF files not parseable in this session:** The two brand guideline PDFs (`Learning Color Brand Guide.pdf`, `El Monterey Brand Guidelines`) were removed from refdocs. Brand compliance section of the KT will need to be informed by those documents if re-provided.
6. **`Ruiz_Foods_TaxTeam.docx`** and **`RuizFoods-Finance-TaxTeam-Invoices_20260507192205.zip`:** These refdoc files were not parsed (binary formats); they may contain additional architecture or flow documentation.

## Input Sources

- refdocs: `Accounts Payable-Fields.json`, `Accounts Payable-Properties.json`, `Accounts Payable-Views.json`
- refdocs: `Fixed Assets-Fields.json`, `Fixed Assets-Properties.json`, `Fixed Assets-Views.json`
- refdocs: `FY2023-Properties.json`, `FY2023-Views.json`, `FY2024-Properties.json`, `FY2024-Views.json`
- refdocs: `Custom Columns-SiteColumns.json`, `ContentTypes-ByGroup.json`
- refdocs: `pnp-modern-search-parts-v4.sppkg` (presence confirms PnP Modern Search v4 in use)
- refdocs: `Manage Properties.jpg` (visual — search managed properties configuration)
- refdocs: `mockups/SharePoint_Landing Page - Faceted Search Experience - No Data.jpg`
- refdocs: `mockups/SharePoint_Landing Page - Faceted Search Experience - With Data and Search refiners.jpg`
- refdocs: `#87823 Request Details - RuizFoodProductsInc.pdf` (not parseable in this session)
- refdocs: `Ruiz_Foods_TaxTeam.docx`, `RuizFoods-Finance-TaxTeam-Invoices_20260507192205.zip` (binary — not parsed)
- source-code: N/A (reverse engineering = false)
- kt-master-prompt: `prompts/kt-master-prompt.md` (solution description and component checklist)
