# KT Document — Invoices for Tax Team
**Ruiz Foods, Inc. | SharePoint Online | Microsoft 365**
*Generated: 2026-05-07 | VISION Framework | rf_taxteam repo*

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

### What the Solution Does
The **Invoices for Tax Team** site is a Microsoft 365 SharePoint Online document management solution that consolidates invoice-related email correspondence into a structured, searchable archive. It was built to relieve the storage pressure on the shared mailbox `InvoicesforTaxTeam@ruizfoods.com`, which was approaching its Microsoft 365 capacity limit.

Vendors and counterparties send invoice emails to two dedicated mailboxes: `AP@ruizfoods.com` (Accounts Payable) and `FixedAssets@ruizfoods.com` (Fixed Assets). Both mailboxes have **forwarding rules** that automatically forward every incoming email to the central `InvoicesforTaxTeam@ruizfoods.com` shared mailbox. A single **Power Automate cloud flow** — named "Ruiz Foods - Finance - Tax Team - Invoices" — monitors `InvoicesforTaxTeam@ruizfoods.com` and, upon receiving an email with an attachment, saves both the email (as `.eml`) and each attachment to the correct SharePoint document library, tagged with sender, recipient, subject, received date, and **calculated fiscal year**.

> **Key business constraint:** The forwarding-rule architecture was chosen specifically to avoid any modification to the `AP@ruizfoods.com` and `FixedAssets@ruizfoods.com` mailboxes. Those mailboxes are operated by other teams and must not be altered.

Tax Team members can then search the full archive using a rich faceted search experience powered by **PnP Modern Search v4** on the site landing page, replicating and improving upon the Outlook search experience.

### Business Value
| Pain point resolved | How |
|---------------------|-----|
| Shared mailbox hitting storage limit | Emails routed to SharePoint which has far greater capacity |
| Risk of data loss from mailbox over-quota | Documents stored in versioned SharePoint document libraries |
| Uncontrolled editing by Tax Team members | Read-only site membership; members cannot upload, edit, or delete |
| Poor search in shared mailbox | PnP Modern Search v4 with faceted refiners by sender, date, fiscal year |
| Disruption to operational AP/FA mailboxes | Forwarding rules used instead — AP and FA mailboxes untouched |
| No audit trail of document access | SharePoint versioning and access logging enabled |

### User Roles

| Role | Who | Access Level | What They Do |
|------|-----|-------------|--------------|
| Tax Team Member (Internal) | Finance / Tax department staff | **Read-only** (Site Members group) | Search and view invoice documents via browser |
| IT Administrator | Ruiz Foods IT | Full Control (Site Owners group) | Configure libraries, manage flows, update permissions |
| Power Automate Service Account | `O365-PA-FLOWSVC@ruizfoods.com` | Contribute (write) | Automated agent — routes emails and attachments to SharePoint |
| External Email Sender | AP vendors, FA vendors | None (no site access) | Send emails to `AP@ruizfoods.com` or `FixedAssets@ruizfoods.com` |
| Visitors | Guest / occasional viewers | **Read-only** (Site Visitors group) | View content only |

### High-Level Flow
```
External vendor sends invoice email with attachment
              │
              ▼
   AP@ruizfoods.com  OR  FixedAssets@ruizfoods.com
              │                       │
              │ (forwarding rule)     │ (forwarding rule)
              └───────────┬───────────┘
                          ▼
           InvoicesforTaxTeam@ruizfoods.com
           (central shared mailbox — monitored by flow)
                          │
                          ▼
     Power Automate: "Ruiz Foods - Finance - Tax Team - Invoices"
     Service account: O365-PA-FLOWSVC@ruizfoods.com
                          │
              ┌───────────┴───────────┐
              │ (check toRecipients)  │
              ▼                       ▼
     "Accounts Payable"        "Fixed Assets"
      library /AP               library /FA
      subfolder: /FY20XX        subfolder: /FY20XX
              │                       │
              └───────────┬───────────┘
                          ▼
             SharePoint Search Index
                          │
                          ▼
               PnP Modern Search v4
         (site landing page — faceted search)
                          │
                          ▼
          Tax Team Member
     (read-only browse & search via Edge browser)
```

---

## 2. Architecture & Components

### Site
| Attribute | Value |
|-----------|-------|
| Site Name | Invoices for Tax Team |
| Site URL | `https://ruizfoods.sharepoint.com/sites/InvoiceforTaxTeam` |
| Site Type | SharePoint Online Site Collection |
| Tenant | `ruizfoods.sharepoint.com` |
| In Production Since | March 2025 (flow created 2025-03-03) |
| Custom Code | None — 100% Microsoft 365 OOTB + PnP Modern Search v4 |

### Component Inventory

| # | Component | Type | Location / Identifier |
|---|-----------|------|-----------------------|
| 1 | Accounts Payable | Document Library | `/sites/InvoiceforTaxTeam/AP` — 173,704 items |
| 2 | Fixed Assets | Document Library | `/sites/InvoiceforTaxTeam/FA` — 11,985 items |
| 3 | FY2023 | Document Library (archive) | `/sites/InvoiceforTaxTeam/FY2023` — 16 items |
| 4 | FY2024 | Document Library (archive) | `/sites/InvoiceforTaxTeam/FY2024` — 45,933 items |
| 5 | FO Log | SharePoint List | `/sites/InvoiceforTaxTeam` — operational log (schema not in refdocs) |
| 6 | FO Settings | SharePoint List | `/sites/InvoiceforTaxTeam` — configuration settings (schema not in refdocs) |
| 7 | FO Acknowledgement | SharePoint List | `/sites/InvoiceforTaxTeam` — acknowledgement tracking (schema not in refdocs) |
| 8 | Invoice Document | Site Content Type | ID: `0x010100E3917FC38B21344BB4F75ADAC1414E19` |
| 9 | Accounts Payable CT | Site Content Type | ID: `0x010100E3917FC38B21344BB4F75ADAC1414E1901` |
| 10 | Fixed Asset CT | Site Content Type | ID: `0x010100E3917FC38B21344BB4F75ADAC1414E1902` |
| 11 | Ruiz Foods - Finance - Tax Team - Invoices | Power Automate Cloud Flow | Single flow; monitors `InvoicesforTaxTeam@ruizfoods.com`; routes to AP or FA library |
| 12 | PnP Modern Search v4 | SPFx App (tenant app catalog) | Package: `pnp-modern-search-parts-v4.sppkg` |
| 13 | SharePoint Managed Properties | Search Schema | Configured in SharePoint Admin Center > Search > Manage Search Schema |
| 14 | Site Landing Page (Home Page) | SharePoint Page | `https://ruizfoods.sharepoint.com/sites/InvoiceforTaxTeam/SitePages/Home.aspx` |

### Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│  OUTLOOK (EMAIL LAYER)                                                   │
│                                                                          │
│   External Senders                                                       │
│   ┌──────────────────┐         ┌────────────────────────┐               │
│   │ AP@ruizfoods.com │ ──fwd──▶│                        │               │
│   └──────────────────┘         │ InvoicesforTaxTeam     │               │
│                                │ @ruizfoods.com         │               │
│   ┌──────────────────────┐     │ (central shared        │               │
│   │ FixedAssets@ruiz...  │──fwd│  mailbox)              │               │
│   └──────────────────────┘     └────────────┬───────────┘               │
│                                             │ trigger (with attachment)  │
└─────────────────────────────────────────────┼───────────────────────────┘
                                              │
┌─────────────────────────────────────────────┼───────────────────────────┐
│  POWER PLATFORM                             │                            │
│                                             ▼                            │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │  "Ruiz Foods - Finance - Tax Team - Invoices"                    │   │
│  │  Service acct: O365-PA-FLOWSVC@ruizfoods.com                     │   │
│  │  Connectors: Office 365 Outlook + SharePoint Online              │   │
│  │                                                                  │   │
│  │  1. Read toRecipients → route to AP or FA library               │   │
│  │  2. Calculate Fiscal Year (Oct 1 – Sep 30 boundaries)            │   │
│  │  3. Export email → save .eml file to /{library}/{FY}/           │   │
│  │  4. Loop attachments → save each to /{library}/{FY}/            │   │
│  │  5. PATCH metadata on all saved files                            │   │
│  └────────────┬─────────────────────────────┬─────────────────────┘   │
└───────────────┼─────────────────────────────┼─────────────────────────┘
                │                             │
┌───────────────┼─────────────────────────────┼─────────────────────────┐
│  SHAREPOINT   │  ruizfoods.sharepoint.com   │                          │
│  /sites/InvoiceforTaxTeam                   │                          │
│               ▼                             ▼                          │
│  ┌──────────────────────┐   ┌──────────────────────────┐              │
│  │ Accounts Payable /AP │   │ Fixed Assets /FA          │              │
│  │  └─ /FY2024/         │   │  └─ /FY2024/              │              │
│  │      email.eml       │   │      email.eml            │              │
│  │      invoice.pdf     │   │      asset.pdf            │              │
│  │  └─ /FY2025/ ...     │   │  └─ /FY2025/ ...          │              │
│  └──────────────────────┘   └──────────────────────────┘              │
│  ┌────────────┐ ┌──────────┐ ┌────────┐ ┌────────────────────────┐   │
│  │ FY2023     │ │ FY2024   │ │FO Log  │ │ FO Settings            │   │
│  │ (archive)  │ │ (archive)│ │FO Ack. │ │ (operational lists)    │   │
│  └────────────┘ └──────────┘ └────────┘ └────────────────────────┘   │
│                                                                        │
│  Security Groups: Invoice for Tax Team Owners / Members / Visitors     │
│  Search: Managed Properties   Apps: PnP Modern Search v4               │
│  Site Pages: Home Page                                                 │
└──────────────────────────────┬─────────────────────────────────────────┘
                               │ SharePoint Search Index
                               ▼
               ┌─────────────────────────────┐
               │  PnP Modern Search v4       │
               │  Home Page (landing)        │
               │  - Search Box               │
               │  - Refiners Panel           │
               │  - Results Panel            │
               └──────────────┬──────────────┘
                              │
                              ▼
               ┌─────────────────────────────┐
               │  Tax Team Member            │
               │  (Internal User / Edge)     │
               └─────────────────────────────┘
```

---

## 3. Data Model

### 3.1 Content Type Hierarchy

```
Document  (0x0101)  ← SharePoint built-in
└── Invoice Document  (0x010100E3917FC38B21344BB4F75ADAC1414E19)
    Group: Invoice for Tax Team | 13 fields | Not sealed
    │
    ├── Accounts Payable  (0x010100E3917FC38B21344BB4F75ADAC1414E1901)
    │   Group: Invoice for Tax Team | 13 fields | Used in: AP library
    │
    └── Fixed Asset  (0x010100E3917FC38B21344BB4F75ADAC1414E1902)
        Group: Invoice for Tax Team | 13 fields | Used in: FA library
```

### 3.2 Custom Site Columns (Business Fields)

All five custom columns are defined at site level in the **"Custom Columns"** group and are populated automatically by Power Automate.

| Display Title | Internal Name | Type | Required | Hidden | Read-Only | Source |
|---------------|---------------|------|----------|--------|-----------|--------|
| Fiscal Year | `Fiscal_x0020_Year` | Text | No | No | No | Calculated by Power Automate — Ruiz Foods FY (Oct 1 – Sep 30) |
| Received Date | `Received_x0020_Date` | DateTime | No | No | No | Email `receivedDateTime` from trigger |
| From | `EMail` | Text | No | No | No | Email `from` address (sender) |
| To | `To` | Text | No | No | No | Email `toRecipients` (original recipient: AP or FA mailbox) |
| Subject | `Subject` | Text | No | No | No | Email subject line (single quotes replaced with spaces) |

> **Note on `From` internal name:** The internal name `EMail` comes from the "Core Contact and Calendar Columns" site column group, not a custom column. Its display title on this solution is "From."

### 3.3 Library Field Schema (Accounts Payable — representative)

All four document libraries share an identical field schema. The full field list is exported to `refdocs/*-Fields.json`.

| Display Title | Internal Name | Type | Required | Hidden | Read-Only |
|---------------|---------------|------|----------|--------|-----------|
| ID | `ID` | Counter | No | No | Yes |
| Name | `FileLeafRef` | File | **Yes** | No | No |
| Title | `Title` | Text | No | No | No |
| Subject | `Subject` | Text | No | No | No |
| From | `EMail` | Text | No | No | No |
| To | `To` | Text | No | No | No |
| Fiscal Year | `Fiscal_x0020_Year` | Text | No | No | No |
| Received Date | `Received_x0020_Date` | DateTime | No | No | No |
| Description | `_ExtendedDescription` | Note | No | No | No |
| Content Type | `ContentType` | Computed | No | No | No |
| Created | `Created` | DateTime | No | No | Yes |
| Created By | `Author` | User | No | No | Yes |
| Modified | `Modified` | DateTime | No | No | Yes |
| Modified By | `Editor` | User | No | No | Yes |
| Version | `_UIVersionString` | Text | No | No | Yes |
| Approval Status | `_ModerationStatus` | ModStat | No | **Yes** | Yes |

### 3.4 Library Properties Summary

| Library | Title | BaseTemplate | Versioning | Minor Versions | Moderation | Force Checkout | CTs Enabled | Quick Launch |
|---------|-------|-------------|-----------|---------------|-----------|---------------|-------------|-------------|
| AP | Accounts Payable | 101 | ✅ | ❌ | ❌ | ❌ | ✅ | ✅ |
| FA | Fixed Assets | 101 | ✅ | ❌ | ❌ | ❌ | ✅ | ✅ |
| FY2023 | FY2023 | 101 | ✅ | ❌ | ❌ | ❌ | ✅ | ✅ |
| FY2024 | FY2024 | 101 | ✅ | ❌ | ❌ | ❌ | ✅ | ✅ |

### 3.5 Folder Structure Within Libraries

Power Automate organizes all documents into **fiscal year subfolders** within each library. The folder is created automatically if it does not already exist.

```
/AP/
  FY2021/
    EmailSubject.eml
    invoice_attachment.pdf
  FY2022/
    ...
  FY2023/
    ...
  FY2024/
    EmailSubject.eml
    invoice_attachment.pdf
  FY2025/
    ...
/FA/
  FY2021/
    ...
  FY2024/
    EmailSubject.eml
    asset_attachment.pdf
```

> **Note:** For each email, two types of items are saved: (1) the email itself as `{Subject}.eml`, and (2) each attachment as its original filename. Both receive the same metadata stamp (From, To, Subject, Received Date, Fiscal Year, Content Type).

### 3.6 Fiscal Year Definition

Ruiz Foods uses a **non-calendar fiscal year** running from **October 1 through September 30**.

| Fiscal Year | Start | End |
|-------------|-------|-----|
| FY2021 | October 2, 2020 | October 1, 2021 |
| FY2022 | October 2, 2021 | October 1, 2022 |
| FY2023 | October 2, 2022 | October 1, 2023 |
| FY2024 | October 2, 2023 | September 30, 2024 |
| FY2025 | October 1, 2024 | September 30, 2025 |
| FY2026 | October 1, 2025 | September 30, 2026 |

Power Automate evaluates the email's `receivedDateTime` against these boundaries and stamps the correct fiscal year label (e.g., `FY2025`) on all documents from that email. An email received in January 2025 is tagged `FY2025` because Ruiz Foods FY2025 runs through September 30, 2025.

---

## 4. Process Flow

### 4.1 End-to-End Invoice Capture Flow

| Step | Actor | Action |
|------|-------|--------|
| 1 | External Vendor | Sends invoice email **with at least one attachment** to `AP@ruizfoods.com` or `FixedAssets@ruizfoods.com` |
| 2 | Microsoft 365 | Email delivered to the source mailbox |
| 3 | Exchange (forwarding rule) | Mailbox forwarding rule automatically forwards email to `InvoicesforTaxTeam@ruizfoods.com`. Source mailbox is **not modified**. |
| 4 | Power Automate — Trigger | "When a new email arrives (V3)" fires on `InvoicesforTaxTeam@ruizfoods.com`. Trigger condition: email **must have attachments** (`HasAttachments = true`). Emails without attachments are ignored. |
| 5 | Power Automate — Variables | Initializes: `varSubject` (sanitizes quotes), `varFrom` (sender), `varTo` (recipient, lowercase), `varFolder` (default: `AP`), `varFolderName` (default: `Accounts Payable`), `varContentTyperId` (default: AP content type ID) |
| 6 | Power Automate — Routing | Checks `varTo`: if it contains `ap@ruizfoods.com` → target = AP library. If it contains `fixedassets@ruizfoods.com` → target = FA library, sets `varFolder = FA`, `varFolderName = Fixed Assets`, `varContentTyperId = ...E1902`. |
| 7 | Power Automate — Fiscal Year | Formats `receivedDateTime` as `yyyy-MM-dd` and evaluates against FY boundary date ranges (FY2021–FY2026) to set `varFiscalYear` (e.g., `FY2025`). |
| 8 | Power Automate — Export | Exports the full email from `InvoicesforTaxTeam@ruizfoods.com` as raw EML bytes via **Office 365 Outlook** connector. |
| 9 | Power Automate — Folder | Creates a folder named `{varFiscalYear}` inside the target library if it does not exist, via **SharePoint** connector (`CreateNewFolder`). |
| 10 | Power Automate — Save email | Creates file `{varSubject}.eml` in `/{varFolder}/{varFiscalYear}/` via **SharePoint** connector (`CreateFile`). |
| 11 | Power Automate — Tag email | PATCH REST call to SharePoint sets metadata on the `.eml` item: `ContentTypeId`, `Subject`, `To`, `EMail` (From), `Received_x0020_Date`, `Fiscal_x0020_Year`. |
| 12 | Power Automate — Attachments | Loops through each attachment in the email. For each: retrieves bytes via **Office 365 Outlook** (`GetAttachment_V2`), creates file in same `/{varFolder}/{varFiscalYear}/` folder, then PATCH REST call stamps same metadata on the attachment item. |
| 13 | SharePoint | All saved files (email + attachments) are versioned (major versions only) and visible to site members immediately — no approval workflow. |
| 14 | SharePoint Search | Search crawler indexes the new documents and their metadata into managed properties. |
| 15 | Tax Team Member | Searches or browses via PnP Modern Search v4 on the site landing page. |

### 4.2 Routing Logic Detail

The flow determines which library to target by inspecting the `toRecipients` field of the forwarded email. Since AP@ruizfoods.com and FixedAssets@ruizfoods.com forward to InvoicesforTaxTeam@ruizfoods.com, the forwarded email's `toRecipients` field retains the **original recipient address**.

```
varTo = toLower(triggerOutputs()?['body/toRecipients'])
                                          │
              ┌───────────────────────────┼───────────────────────────┐
              │ contains "ap@ruizfoods.com"│contains "fixedassets@..." │
              ▼                            ▼                           ▼
    varFolder = "AP"            varFolder = "FA"          (default: AP)
    varFolderName =             varFolderName =           if empty or unmatched
    "Accounts Payable"          "Fixed Assets"
    varContentTyperId =         varContentTyperId =
    ...E1901 (AP CT)            ...E1902 (FA CT)
```

> **Default behavior:** If `toRecipients` is empty or matches neither address, the flow defaults to the **Accounts Payable** library.

### 4.3 What Happens When an Email Has No Attachment

The trigger condition `fetchOnlyWithAttachment: true` and the explicit condition `@equals(triggerOutputs()?['body/HasAttachments'], true)` mean the flow **does not fire** for plain-text emails or emails without attachments. Those emails remain in `InvoicesforTaxTeam@ruizfoods.com` but are not routed to SharePoint.

### 4.4 Search & Retrieval Flow

| Step | Actor | Action |
|------|-------|--------|
| 1 | Tax Team Member | Navigates to site landing page in Edge browser |
| 2 | PnP Modern Search | Displays search box and refiners panel |
| 3 | Tax Team Member | Enters keyword or selects a refiner (e.g., Fiscal Year = FY2025, From = vendor@example.com) |
| 4 | PnP Modern Search | Passes query to SharePoint Search REST API with managed property filters |
| 5 | SharePoint Search | Returns matching results |
| 6 | PnP Modern Search | Renders results: document name, metadata, preview link |
| 7 | Tax Team Member | Clicks document to view/download — read-only |

---

## 5. Configuration Reference

### 5.1 Accounts Payable Library (`/AP`)

**Library settings:**
| Setting | Value |
|---------|-------|
| Internal name / URL folder | `AP` |
| Default View URL | `/sites/InvoiceforTaxTeam/AP/Forms/AllItems.aspx` |
| BaseTemplate | 101 (Document Library) |
| Item count | 173,704 |
| Versioning | Major versions only |
| Minor versions | Disabled |
| Content Approval (Moderation) | Disabled (`EnableModeration = false`) |
| Force Check Out | Disabled |
| Content Types | Enabled |
| Quick Launch | Enabled |

**Views:**

| View Title | URL Slug | Default | Hidden | CAML Query | Row Limit |
|------------|----------|---------|--------|-----------|-----------|
| All Documents | `Forms/AllItems.aspx` | ✅ | ❌ | `<OrderBy><FieldRef Name="ID" Ascending="FALSE"/></OrderBy>` | 30 |
| Bulk Edit View | `Forms/Not PDFs.aspx` ⚠️ | ❌ | ❌ | `<Where><Eq><FieldRef Name="ContentType"/><Value Type="Computed">Invoice Document</Value></Eq></Where><OrderBy><FieldRef Name="ID" Ascending="FALSE"/></OrderBy>` | 4,999 |
| assetLibTemp | `Forms/Thumbnails.aspx` | ❌ | ✅ | `<OrderBy><FieldRef Name="LinkFilename"/></OrderBy>` | 20 |
| Merge Documents | `Forms/Combine.aspx` | ❌ | ✅ | `<OrderBy><FieldRef Name="FileLeafRef"/></OrderBy>` | 30 |
| Relink Documents | `Forms/repair.aspx` | ❌ | ✅ | `<Where><Neq><FieldRef Name="xd_Signature"/><Value Type="Boolean">1</Value></Neq></Where><OrderBy><FieldRef Name="FileLeafRef"/></OrderBy>` | 30 |
| RssView | `Forms/RssView.aspx` | ❌ | ✅ | *(none)* | 25 |

> ⚠️ **Production note:** The Bulk Edit View URL slug is `Not PDFs.aspx` — this is a legacy/typo name in production. **Do not rename this view** as doing so would break any bookmarked or linked URLs.

---

### 5.2 Fixed Assets Library (`/FA`)

**Library settings:** Identical to Accounts Payable (§5.1), except:
| Setting | Value |
|---------|-------|
| Internal name / URL folder | `FA` |
| Default View URL | `/sites/InvoiceforTaxTeam/FA/Forms/AllItems.aspx` |
| Item count | 11,985 |

**Views:**

| View Title | URL Slug | Default | Hidden | CAML Query | Row Limit |
|------------|----------|---------|--------|-----------|-----------|
| All Documents | `Forms/AllItems.aspx` | ✅ | ❌ | `<OrderBy><FieldRef Name="ID" Ascending="FALSE"/></OrderBy>` | 30 |
| Bulk Edit View | `Forms/Bulk Edit View.aspx` | ❌ | ❌ | `<Where><Eq><FieldRef Name="ContentType"/><Value Type="Computed">Invoice Document</Value></Eq></Where><OrderBy><FieldRef Name="ID" Ascending="FALSE"/></OrderBy>` | 4,999 |
| Raw | `Forms/PersonalViews.aspx` | ❌ | ❌ | *(none)* | 30 |
| assetLibTemp | `Forms/Thumbnails.aspx` | ❌ | ✅ | `<OrderBy><FieldRef Name="LinkFilename"/></OrderBy>` | 20 |
| Merge Documents | `Forms/Combine.aspx` | ❌ | ✅ | `<OrderBy><FieldRef Name="FileLeafRef"/></OrderBy>` | 30 |
| Relink Documents | `Forms/repair.aspx` | ❌ | ✅ | `<Where><Neq><FieldRef Name="xd_Signature"/><Value Type="Boolean">1</Value></Neq></Where><OrderBy><FieldRef Name="FileLeafRef"/></OrderBy>` | 30 |
| RssView | `Forms/RssView.aspx` | ❌ | ✅ | *(none)* | 25 |

> Note: Fixed Assets has an additional visible view "Raw" (`PersonalViews.aspx`) not present in the other libraries.

---

### 5.3 FY2023 Archive Library (`/FY2023`)

**Library settings:** Identical to Accounts Payable, except:
| Setting | Value |
|---------|-------|
| Internal name / URL folder | `FY2023` |
| Default View URL | `/sites/InvoiceforTaxTeam/FY2023/Forms/AllItems.aspx` |
| Item count | 16 *(see §10 — anomaly noted)* |

**Views:**

| View Title | URL Slug | Default | Hidden | CAML Query | Row Limit |
|------------|----------|---------|--------|-----------|-----------|
| All Documents | `Forms/AllItems.aspx` | ✅ | ❌ | `<OrderBy><FieldRef Name="ID" Ascending="FALSE"/></OrderBy>` | 30 |
| Bulk Edit View | `Forms/Bulk Edit View.aspx` | ❌ | ❌ | `<Where><Eq><FieldRef Name="ContentType"/><Value Type="Computed">Invoice Document</Value></Eq></Where><OrderBy><FieldRef Name="ID" Ascending="FALSE"/></OrderBy>` | 4,999 |
| assetLibTemp | `Forms/Thumbnails.aspx` | ❌ | ✅ | `<OrderBy><FieldRef Name="LinkFilename"/></OrderBy>` | 20 |
| Merge Documents | `Forms/Combine.aspx` | ❌ | ✅ | `<OrderBy><FieldRef Name="FileLeafRef"/></OrderBy>` | 30 |
| Relink Documents | `Forms/repair.aspx` | ❌ | ✅ | `<Where><Neq><FieldRef Name="xd_Signature"/><Value Type="Boolean">1</Value></Neq></Where>` | 30 |
| RssView | `Forms/RssView.aspx` | ❌ | ✅ | *(none)* | 25 |

---

### 5.4 FY2024 Archive Library (`/FY2024`)

**Library settings:** Identical to FY2023, except:
| Setting | Value |
|---------|-------|
| Internal name / URL folder | `FY2024` |
| Default View URL | `/sites/InvoiceforTaxTeam/FY2024/Forms/AllItems.aspx` |
| Item count | 45,933 |

**Views:** Same as FY2023 (§5.3).

---

### 5.5 Content Types — Full Reference

| Content Type | ID | Group | Parent | Fields | Hidden | Sealed |
|---|---|---|---|---|---|---|
| Invoice Document | `0x010100E3917FC38B21344BB4F75ADAC1414E19` | Invoice for Tax Team | Document | 13 | ❌ | ❌ |
| Accounts Payable | `0x010100E3917FC38B21344BB4F75ADAC1414E1901` | Invoice for Tax Team | Invoice Document | 13 | ❌ | ❌ |
| Fixed Asset | `0x010100E3917FC38B21344BB4F75ADAC1414E1902` | Invoice for Tax Team | Invoice Document | 13 | ❌ | ❌ |

---

## 6. Automation / Integration

### 6.1 Overview

There is a **single Power Automate cloud flow** that handles both the Accounts Payable and Fixed Assets email capture paths.

| Attribute | Value |
|-----------|-------|
| Flow display name | `Ruiz Foods - Finance - Tax Team - Invoices` |
| Flow ID | `b195fd79-821e-4fca-97cd-03c9ed68fa9d` |
| Created | 2025-03-03 |
| Last modified | 2025-09-06 |
| Service account | `O365-PA-FLOWSVC@ruizfoods.com` (confirmed from flow export — SharePoint connection owner) |
| Connector — trigger | **Office 365 Outlook** (`shared_office365`) |
| Connector — SharePoint | **SharePoint Online** (`shared_sharepointonline`) |
| Monitored mailbox | `InvoicesforTaxTeam@ruizfoods.com` |

### 6.2 Email Routing Architecture

The flow uses a **single-mailbox, single-flow** design:

```
AP@ruizfoods.com          ─── forwarding rule ──▶ ┐
FixedAssets@ruizfoods.com ─── forwarding rule ──▶ │  InvoicesforTaxTeam@ruizfoods.com
                                                   │  (Power Automate listens here)
                                                   ▼
                                Flow inspects toRecipients field
                                to determine routing destination
```

**Why this design:** A business requirement prohibits any modification to the `AP@ruizfoods.com` and `FixedAssets@ruizfoods.com` mailboxes. The forwarding rule is configured on those mailboxes by Exchange admins, and the flow connects only to the neutral `InvoicesforTaxTeam@ruizfoods.com` mailbox.

### 6.3 Trigger Configuration

| Setting | Value |
|---------|-------|
| Trigger action | `OnNewEmailV3` (When a new email arrives V3) |
| Folder | Inbox |
| Include attachments | Yes |
| Fetch only with attachment | **Yes** — emails without attachments are **ignored** |
| Importance filter | Any |
| Condition | `HasAttachments == true` |

### 6.4 Variable Initialization

| Variable | Type | Initial Value | Purpose |
|----------|------|--------------|---------|
| `varSubject` | String | Email subject with single quotes replaced by spaces | Used as the filename for the `.eml` file |
| `varFrom` | String | Email `from` address (single quotes stripped) | Stored in `EMail` column |
| `varTo` | String | Lowercase `toRecipients` (defaults to `ap@ruizfoods.com` if empty) | Used for routing and stored in `To` column |
| `varFiscalYear` | String | Initial: `concat('F', formatDateTime(receivedDateTime,'yy'))` — overridden by FY scope | Final value: `FY2021` – `FY2026` |
| `varFolder` | String | `AP` (default) | URL path segment for target library |
| `varFolderName` | String | `Accounts Payable` (default) | Display name of target library for REST calls |
| `varContentTyperId` | String | `0x010100E3917FC38B21344BB4F75ADAC1414E1901` (AP CT, default) | Content type ID to stamp on saved items |

### 6.5 Fiscal Year Calculation

Power Automate calculates the Ruiz Foods fiscal year label from the email's `receivedDateTime`. The flow evaluates the received date against each FY boundary and sets `varFiscalYear` accordingly. **Ruiz Foods fiscal year runs October 1 – September 30** (not calendar year).

```
receivedDateTime → formatDateTime(yyyy-MM-dd)
                            │
         ┌──────────────────┼──────────────────┐
         ▼                  ▼                  ▼
  2025-10-01 to      2024-10-01 to      2023-10-02 to
  2026-09-30         2025-09-30         2024-09-30
  → "FY2026"         → "FY2025"         → "FY2024"    ...and so on through FY2021
```

Fiscal years currently handled by the flow: **FY2021, FY2022, FY2023, FY2024, FY2025, FY2026**.

> **Admin note:** When a new fiscal year begins (each October 1), verify that the flow has a condition block for the new FY. If missing, add one following the same pattern as existing conditions in the "Scope - Fiscal Years" scope.

### 6.6 Full Action Sequence

| # | Action Name | Type | Connector | Key Details |
|---|-------------|------|-----------|-------------|
| 1 | Initialize variable — varSubject | InitializeVariable | Built-in | Sanitizes email subject (replaces `'` with space) |
| 2 | Initialize variable — varFrom | InitializeVariable | Built-in | Strips single quotes from `from` address |
| 3 | Initialize variable — varTo | InitializeVariable | Built-in | Lowercase `toRecipients`; defaults to `ap@ruizfoods.com` if empty |
| 4 | Initialize variable — varFiscalYear | InitializeVariable | Built-in | Initial value from format expression |
| 5 | Initialize variable — varFolder | InitializeVariable | Built-in | Default: `AP` |
| 6 | Initialize variable — varFolderName | InitializeVariable | Built-in | Default: `Accounts Payable` |
| 7 | Initialize variable — varContentTyperId | InitializeVariable | Built-in | Default: AP content type ID |
| 8 | Condition — ap@ruizfoods.com | Condition | Built-in | If `varTo` contains `ap@ruizfoods.com` → set varFolder=AP, varFolderName=Accounts Payable |
| 9 | Condition — fixedassets@ruizfoods.com | Condition | Built-in | If `varTo` contains `fixedassets@ruizfoods.com` → set varFolder=FA, varFolderName=Fixed Assets, varContentTyperId=...E1902 |
| 10 | Scope — Fiscal Years | Scope | Built-in | Contains 6 condition blocks (FY2021–FY2026); sets varFiscalYear to correct label |
| 11 | *(try)* Export email (V2) | OpenApiConnection | Office 365 Outlook | Exports full email from `InvoicesforTaxTeam@ruizfoods.com` as EML bytes |
| 12 | *(try)* Create new folder | OpenApiConnection | SharePoint | Creates `/{varFolder}/{varFiscalYear}/` folder if not exists |
| 13 | *(try)* Create file — Email Message | OpenApiConnection | SharePoint | Saves `{varSubject}.eml` in `/{varFolder}/{varFiscalYear}/` (chunked transfer) |
| 14 | *(try)* Send HTTP request — Email Message | OpenApiConnection | SharePoint | PATCH REST: sets ContentTypeId, Subject, To, EMail, Received_x0020_Date, Fiscal_x0020_Year on the .eml item |
| 15 | *(try)* Apply to each (attachments loop) | Foreach | Built-in | Iterates over each attachment in the email |
| 15a | *(loop)* Get Attachment (V2) | OpenApiConnection | Office 365 Outlook | Retrieves attachment bytes from `InvoicesforTaxTeam@ruizfoods.com` |
| 15b | *(loop)* Create file — Attachment | OpenApiConnection | SharePoint | Saves attachment with original filename in `/{varFolder}/{varFiscalYear}/` (chunked) |
| 15c | *(loop)* Send HTTP request — Attachments | OpenApiConnection | SharePoint | PATCH REST: stamps same metadata on the attachment item |
| 16 | Scope — Catch | Scope | Built-in | Empty error handler (no recovery actions defined — run history must be checked manually on failure) |

### 6.7 Service Account

| Attribute | Value |
|-----------|-------|
| Account | `O365-PA-FLOWSVC@ruizfoods.com` |
| Type | Dedicated service account (confirmed from flow connection manifest) |
| Connections held | SharePoint Online connection used by the flow |
| Risk | If this account is deactivated or its password expires, the SharePoint connector will fail. The flow will then show "Failed" in run history. |

**To verify connections are still healthy:**
1. Sign in to [Power Automate](https://make.powerautomate.com) as `O365-PA-FLOWSVC@ruizfoods.com` or as an admin.
2. Go to **Data** → **Connections** → verify both "Office 365 Outlook" and "SharePoint" connections show **Connected** status.

### 6.8 Flow Run History & Monitoring

1. Sign in to [Power Automate](https://make.powerautomate.com).
2. Navigate to **My flows** or **Team flows** → open "Ruiz Foods - Finance - Tax Team - Invoices."
3. Scroll to **28-day run history.**
4. Each run shows: status (Succeeded / Failed), trigger time, duration.
5. Click a failed run → expand each step to see the error message.
6. Common failures: connection expired (re-authenticate Office 365 Outlook or SharePoint), SharePoint throttling (retry with exponential backoff), duplicate filename (`.eml` already exists with that subject in that folder).

---

## 7. Interface Documentation

### 7.1 Site Landing Page

| Attribute | Value |
|-----------|-------|
| Page URL | `https://ruizfoods.sharepoint.com/sites/InvoiceforTaxTeam/SitePages/Home.aspx` |
| Page type | SharePoint Modern Page |
| Purpose | Primary UI for Tax Team — search and browse invoices |
| Browser | Microsoft Edge (internal users access via Edge) |

The landing page hosts a faceted search experience built with **PnP Modern Search v4** web parts. Two mockup screenshots are provided as evidence:

- **Empty state:** `refdocs/mockups/SharePoint_Landing Page - Faceted Search Experience - No Data.jpg`
- **Populated state:** `refdocs/mockups/SharePoint_Landing Page - Faceted Search Experience - With Data and Search refiners.jpg`

### 7.2 PnP Modern Search v4 Web Parts

| Web Part | Purpose | Configuration Notes |
|----------|---------|---------------------|
| **Search Box** | Accepts keyword input | Connected to the Results web part; passes query string |
| **Search Refiners** | Faceted filter panel | Displays filter options derived from managed properties (see §7.3) |
| **Search Results** | Displays matching documents | Renders document name, metadata columns, preview/download link |

**App package:** `pnp-modern-search-parts-v4.sppkg` — deployed to the tenant or site collection app catalog.
To verify: **SharePoint Admin Center → Advanced → Apps → App Catalog** or **Site Contents → Site Collection Apps.**

### 7.3 SharePoint Managed Properties (Search Refiners)

Managed Properties map SharePoint columns to the SharePoint Search index. Reference: `refdocs/Manage Properties.jpg`.

To verify or modify:
1. **SharePoint Admin Center** (`https://ruizfoods-admin.sharepoint.com`) → **Search** → **Manage Search Schema.**
2. Search by crawled property name (e.g., `ows_Fiscal_x0020_Year`) or managed property name.

Expected managed properties for refiners:

| Custom Column | Internal Name | Expected Managed Property | Refiner Type |
|---|---|---|---|
| Fiscal Year | `Fiscal_x0020_Year` | `RefinableString` or custom | Text facet |
| Received Date | `Received_x0020_Date` | `RefinableDate` or custom | Date range |
| From | `EMail` | `RefinableString` or custom | Text facet |
| Subject | `Subject` | `Title` or custom | Keyword |

### 7.4 Security Groups

SharePoint permissions are managed through three Microsoft 365 / SharePoint security groups:

| Group Name | Permission Level | Members |
|-----------|-----------------|---------|
| Invoice for Tax Team Owners | Full Control | IT Administrators |
| Invoice for Tax Team Members | Read | Tax Team department staff |
| Invoice for Tax Team Visitors | Read (view only) | Guests / occasional viewers |

### 7.5 Library Views (User-Accessible)

| Library | View | URL |
|---------|------|-----|
| Accounts Payable | All Documents (default) | `/sites/InvoiceforTaxTeam/AP/Forms/AllItems.aspx` |
| Accounts Payable | Bulk Edit View *(admin)* | `/sites/InvoiceforTaxTeam/AP/Forms/Not PDFs.aspx` ⚠️ |
| Fixed Assets | All Documents (default) | `/sites/InvoiceforTaxTeam/FA/Forms/AllItems.aspx` |
| Fixed Assets | Bulk Edit View *(admin)* | `/sites/InvoiceforTaxTeam/FA/Forms/Bulk Edit View.aspx` |
| FY2023 | All Documents (default) | `/sites/InvoiceforTaxTeam/FY2023/Forms/AllItems.aspx` |
| FY2024 | All Documents (default) | `/sites/InvoiceforTaxTeam/FY2024/Forms/AllItems.aspx` |

---

## 8. Permissions & Access

### 8.1 Permission Matrix

| Role | SharePoint Group | Permission Level | AP | FA | FY2023 | FY2024 |
|------|-----------------|-----------------|-----|-----|--------|--------|
| Tax Team Member | Invoice for Tax Team Members | **Read** | Read | Read | Read | Read |
| IT Administrator | Invoice for Tax Team Owners | **Full Control** | Full | Full | Full | Full |
| Visitor | Invoice for Tax Team Visitors | **Read** | Read | Read | Read | Read |
| Power Automate Service Account | Direct or custom assignment | **Contribute** | Contribute | Contribute | Contribute | Contribute |

**Permission inheritance:** All four libraries inherit permissions from the site. No broken inheritance. Members cannot upload, edit, delete, check out, or approve documents.

**Moderation:** `EnableModeration = false` on all libraries. Documents saved by Power Automate are immediately visible — no approval workflow.

### 8.2 How to Add a Tax Team Member (Read-Only)

1. Navigate to `https://ruizfoods.sharepoint.com/sites/InvoiceforTaxTeam`.
2. Click the **gear icon** (⚙️) → **Site permissions.**
3. Click **Share site.**
4. Search for the user's name or email address.
5. Set permission level to **"Can view"** (maps to Invoice for Tax Team Members / Read).
6. Click **Add.** User receives an email notification with a link.

### 8.3 How to Remove a Tax Team Member

1. Navigate to **Site Settings** → **Site permissions** (or **People and groups**).
2. Click **Invoice for Tax Team Members.**
3. Find the user → click the ellipsis (…) → **Remove user from group.**
4. Confirm removal.

### 8.4 Power Automate Service Account Dependency

> **Critical:** The Power Automate flow runs under `O365-PA-FLOWSVC@ruizfoods.com`. If this account is deactivated, has its password changed, or its Microsoft 365 license is removed, the SharePoint connection will break and all email routing will stop silently.
>
> **Mitigation:** Ensure `O365-PA-FLOWSVC@ruizfoods.com` is excluded from password rotation policies. Assign it a Microsoft 365 license with Power Automate entitlement. Monitor the flow's run history weekly.

---

## 9. Operational Runbook

### Task 1: Add a New User with Read-Only Access
1. Open a browser and navigate to `https://ruizfoods.sharepoint.com/sites/InvoiceforTaxTeam`.
2. Click the **gear icon** (⚙️) → **Site permissions.**
3. In the Permissions panel, click **Share site.**
4. Type the user's name or email address and select them.
5. Set permission to **Can view** (read-only).
6. Optionally uncheck "Send email" if notification is not desired.
7. Click **Add.** The user now has read-only access to all four libraries.

---

### Task 2: Archive Documents from Active Library to FY Archive Library

> Use when a fiscal year ends and you want to move completed documents from AP or FA to the appropriate FY archive library.

1. Navigate to the source library (e.g., **Accounts Payable**).
2. Switch to the **Bulk Edit View** using the view picker. This shows up to 4,999 documents filtered to `Invoice Document` content type.
3. Filter by **Fiscal Year** column to show only the year being archived (e.g., `FY2023`).
4. Select all filtered documents using the checkbox in the header row.
5. In the command bar, click **Move to** → browse to the destination FY library (e.g., `FY2023`).
6. Click **Move here.**
7. Verify documents appear in the FY2023 library and are gone from the source.
8. Repeat for the other active library (FA → FY archive) if needed.

> **Note:** For batches > 5,000 items, use PnP PowerShell `Move-PnPFile` in a loop. The Bulk Edit View row limit is 4,999.

---

### Task 3: Check Power Automate Flow Run History

> Use when emails are not appearing in SharePoint or to verify the flow is running.

1. Navigate to [Power Automate](https://make.powerautomate.com) and sign in.
2. Click **My flows** or **Team flows** → locate **"Ruiz Foods - Finance - Tax Team - Invoices."**
3. Click the flow name to open the detail page.
4. Scroll to **28-day run history.**
5. Look for any **Failed** rows. Click a failed run to expand each action and read the error.
6. Common errors:
   - **Connection expired:** Re-authenticate the Office 365 Outlook or SharePoint connection under `O365-PA-FLOWSVC@ruizfoods.com`.
   - **SharePoint throttling:** The flow will retry automatically — check if a later run succeeded.
   - **Duplicate filename:** Subject already exists in that FY folder — rename or delete the existing file and re-send the email.

---

### Task 4: Troubleshoot — Email Not Appearing in SharePoint

1. Confirm the email was delivered to `AP@ruizfoods.com` or `FixedAssets@ruizfoods.com` (check the source mailbox in Outlook or Exchange Admin Center).
2. Confirm the email **has at least one attachment.** The flow does not process attachment-free emails.
3. Verify the forwarding rule is active: in Exchange Admin Center, open the mailbox → **Mail flow rules** or **Inbox rules** → confirm the forwarding rule to `InvoicesforTaxTeam@ruizfoods.com` is enabled.
4. Check the flow run history (Task 3). Find the run matching the email timestamp.
5. If the run shows **Failed:** read the error and resolve (see Task 3 common errors).
6. If **no run exists** for that email: the trigger may not have fired. Verify the flow status is **On** (not turned off). Verify the Office 365 Outlook connection is still valid.
7. Once the issue is resolved, test by sending a new email with an attachment to the source mailbox.

---

### Task 5: Create a New Fiscal Year Archive Library

> Use at the start of each new fiscal year or when a new archive library is needed.

1. Navigate to `https://ruizfoods.sharepoint.com/sites/InvoiceforTaxTeam`.
2. Click **gear icon** → **Site contents** → **New** → **Document library.**
3. Name: `FY2027` (or the appropriate year). Click **Create.**
4. In the new library → **Library settings** (gear icon in toolbar).
5. Enable versioning: **Versioning settings** → Major versions only → Save.
6. Enable content types: **Advanced settings** → Allow management of content types? → **Yes** → Save.
7. Add content types: under **Content Types** → **Add from existing site content types** → filter by **Invoice for Tax Team** → add `Invoice Document`, `Accounts Payable`, `Fixed Asset` → OK.
8. Enable Quick Launch: **List name, description and navigation** → Display this list on Quick Launch? → **Yes** → Save.
9. Create the Bulk Edit View:
   a. Click **All Documents** → **Create view** → Standard view.
   b. Name: `Bulk Edit View`, row limit: 4,999.
   c. Filter: `ContentType` is equal to `Invoice Document`.
   d. Sort: `ID` Descending. Save.
10. **Update the Power Automate flow** to add a new FY condition in the "Scope - Fiscal Years" scope (see §6.5 admin note).

---

### Task 6: Update Metadata on a Document (Admin Only)

> Read-only members cannot edit metadata. Only Site Owners (`O365-PA-FLOWSVC@ruizfoods.com` or IT Admins) can modify properties.

1. Navigate to the library containing the document.
2. Hover over the document → click the ellipsis (…) → **Details.**
3. In the details pane, click **Edit all.**
4. Update the desired field (e.g., `Fiscal Year`, `Received Date`).
5. Click **Save.**

For bulk edits:
1. Switch to **Bulk Edit View** (§7.5 for URLs).
2. Click **Edit in grid view** in the command bar.
3. Click any cell to edit. Tab to move between fields. Changes save automatically.
4. Click **Exit grid view** when done.

---

### Task 7: Access and Modify PnP Modern Search Configuration

> Use when the search experience needs updating (new refiner, changed layout).

1. Navigate to `https://ruizfoods.sharepoint.com/sites/InvoiceforTaxTeam`.
2. Click **gear icon** → **Edit page** (requires Site Owner or Designer permission).
3. Hover over the **Search Refiners** web part → click the pencil ✏️ icon.
4. In the property panel:
   - **Refiners:** Add or remove managed property names (e.g., `RefinableString00`).
   - **Display templates:** Adjust how each refiner appears (checkbox list, date range, etc.).
5. To edit **Search Results:** click its pencil icon → configure result source, selected properties, result template.
6. Click **Save and close** → **Republish** when done.

**To update managed properties** (requires SharePoint Administrator):
1. Go to [SharePoint Admin Center](https://ruizfoods-admin.sharepoint.com) → **Search** → **Manage Search Schema.**
2. Find or create the managed property (search by crawled property `ows_Fiscal_x0020_Year`).
3. Edit: enable refinement, make retrievable, etc.
4. Wait for the next scheduled crawl or request a full re-crawl for changes to take effect.

---

## 10. Data Snapshot Evidence

### 10.1 Library Item Counts (as of 2026-05-07)

| Library | Item Count | Source |
|---------|-----------|--------|
| Accounts Payable | 173,704 | `refdocs/Accounts Payable-Properties.json` → `ItemCount` |
| Fixed Assets | 11,985 | `refdocs/Fixed Assets-Properties.json` → `ItemCount` |
| FY2023 | 16 | `refdocs/FY2023-Properties.json` → `ItemCount` |
| FY2024 | 45,933 | `refdocs/FY2024-Properties.json` → `ItemCount` |
| **Total** | **231,638** | Sum |

### 10.2 FY2023 Low Count — Anomaly Note

FY2023 contains only **16 documents** vs FY2024's 45,933. The flow was created on **2025-03-03**, meaning it was not active during the FY2023 period (October 2022 – October 2023). The 16 items were likely manually migrated or backfilled. FY2023 documents remain in `InvoicesforTaxTeam@ruizfoods.com` mailbox unless manually migrated.

**Action recommended:** Confirm with the project stakeholder whether a FY2023 backfill is needed.

### 10.3 Custom Column Presence Confirmed

All five custom columns (`Fiscal_x0020_Year`, `Received_x0020_Date`, `EMail`, `To`, `Subject`) are confirmed present across all four libraries from the `*-Fields.json` exports in `refdocs/`.

### 10.4 Content Type Evidence

Three custom content types confirmed in `refdocs/ContentTypes-ByGroup.json` under group **"Invoice for Tax Team":**
- `Invoice Document` — 13 fields — ID: `0x010100E3917FC38B21344BB4F75ADAC1414E19`
- `Accounts Payable` — 13 fields — ID: `0x010100E3917FC38B21344BB4F75ADAC1414E1901`
- `Fixed Asset` — 13 fields — ID: `0x010100E3917FC38B21344BB4F75ADAC1414E1902`

### 10.5 Flow Export Evidence

The Power Automate flow package is available at `refdocs/RuizFoods-Finance-TaxTeam-Invoices_20260507192205.zip`. Flow ID: `b195fd79-821e-4fca-97cd-03c9ed68fa9d`. Service account confirmed in `connectionsMap.json`.

---

## 11. Brand Compliance

### 11.1 Brand Reference Sources

> **Gap note:** The Ruiz Foods brand guideline PDFs (`Learning Color Brand Guide.pdf` and `RZF003_22 El Monterey_Brand_Guidelines_10_27_22_v3 (1).pdf`) were not available in refdocs at time of KT generation. Brand compliance mapping below is based on mockup screenshots and general Ruiz Foods / El Monterey brand knowledge. Update against official PDFs when available.

### 11.2 Brand Compliance Table

| Brand Dimension | Affected Component | Guideline Reference | Notes |
|-----------------|-------------------|---------------------|-------|
| **Color palette** | Site landing page background, web part headers | Ruiz Foods Brand Guide — Primary colors | SharePoint theme should use Ruiz Foods brand colors. Verify in site theme settings. |
| **Typography** | Page headings, body text, search result labels | Ruiz Foods Brand Guide — Typography | SharePoint Modern uses system fonts; ensure headings match brand font guidance where customizable. |
| **Logo / Icon** | Site logo (top-left of site header) | El Monterey Brand Guidelines — Logo usage | Display the Ruiz Foods or El Monterey logo. Do not use cropped or distorted versions. |
| **Tone of voice** | Page titles, web part headers, instructional text | Ruiz Foods Brand Guide — Tone & Voice | Professional, direct, English-language. Avoid casual language in any text visible to Tax Team. |
| **Iconography** | PnP Modern Search result icons, document type icons | El Monterey Brand Guidelines — Icons | System document type icons (PDF, Word) are not brand-configurable. Custom icons in result templates should follow brand palette. |

### 11.3 User-Facing Components Summary

| Component | User-Facing? | Brand Impact |
|-----------|-------------|-------------|
| Site landing page (header, navigation) | ✅ Yes | Logo, theme color, navigation labels |
| PnP Modern Search — search box | ✅ Yes | Web part title / search hint text |
| PnP Modern Search — refiners panel | ✅ Yes | Refiner labels (Fiscal Year, From, Date) |
| PnP Modern Search — results panel | ✅ Yes | Result card layout, column headers |
| Library views (All Documents) | ✅ Yes — members can access | Column labels, view names |
| Power Automate flow | ❌ No — background process | Not user-facing |
| SharePoint Managed Properties | ❌ No — admin only | Not user-facing |

---

*End of KT Document — Invoices for Tax Team*
*Document generated by VISION Framework | rf_taxteam | 2026-05-07 (v2 — corrected architecture)*
*Repo: `c:\DATA\Repos\rf_taxteam` | Branch: main*
