# KT Document — Engineering Web Portal (Engineering Hub)

**Solution:** Engineering Web Portal
**Site URL:** https://ruizfoods.sharepoint.com/sites/eng-hub
**Platform:** SharePoint Online (Microsoft 365)
**Exported:** 2026-05-08
**Author:** VISION KT Agent

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

### Business Value

The **Engineering Web Portal** (internal name: `eng-hub`) is Ruiz Foods Engineering's central document management and knowledge hub. It provides a single URL where engineers across all four manufacturing facilities can store, organize, and search for technical documentation — from capital project files to equipment manuals, vendor agreements, CAD drawings, and safety procedures.

Before this portal, engineering documents lived in scattered network drives and isolated folders with no cross-project or cross-facility discoverability. The Engineering Hub solves this by combining SharePoint Online document libraries with a **PnP Modern Search Web Parts V4** search experience, enabling faceted filtering by facility, production area, document type, and classification.

### High-Level Flow

```
Engineer                   Engineering Hub                  SharePoint Search Index
   │                             │                                    │
   ├──── Opens search page ────► │                                    │
   │                             ├── Search Box (PnP) ───────────────►│
   │                             │◄── Results (PnP Results WP) ───────┤
   │◄──── Views filtered docs ───┤                                    │
   │                             │                                    │
   ├──── Navigates to library ──►│                                    │
   │                             ├── Document Library (CEP / Assets)  │
   ├──── Uploads document ──────►│                                    │
   │                             ├── Applies Ruiz Foods CT + MMD ────►│
   │                             │   (Facility, Area, Class...)       │
   │◄──── Confirmation ──────────┤                                    │
```

### User Roles

| Role | Description | Primary Access |
|---|---|---|
| **Engineering Staff** | Mechanical, electrical, software engineers at any facility | Search portal; read/download documents from CEP and Asset libraries |
| **Project Manager** | Owns a Capital Engineering Project (CEP) | Upload and manage documents in their assigned CEP library |
| **Engineering Manager** | Cross-facility oversight | Full read access to all libraries; approves project completions |
| **Procurement / Legal** | Manages vendor contracts | Agreements library — upload, track expiration dates |
| **IT Administrator** | Maintains the portal | All libraries; manages content types, taxonomy, PnP Search config |
| **New Employee / Contractor** | Onboarding | Read access to Approved Projects; search for procedural documents |

---

## 2. Architecture & Components

### M365 Component Inventory

| Component | Type | Platform | Location / Identifier |
|---|---|---|---|
| Engineering Hub Site | Communication Site | SharePoint Online | https://ruizfoods.sharepoint.com/sites/eng-hub |
| PnP Modern Search Web Parts V4 | Third-party SPFx package | SharePoint Online App Catalog | `pnp-modern-search-parts-v4.sppkg` |
| Ruiz Foods Taxonomy | Content Type Group | SharePoint Site Content Types | 15 custom content types |
| Ruiz Foods Taxonomy | Term Group | Managed Metadata Service | Term Group: "Ruiz Foods Taxonomy" |
| Agreements Library | Document Library | SharePoint Online | /sites/eng-hub/agreements |
| CA1 Dinuba Assets Library | Document Library | SharePoint Online | /sites/eng-hub/CA1Assets |
| CA4 Vernon MFG Assets Library | Document Library | SharePoint Online | (see Section 5) |
| Approved Projects — CA1 | Document Library | SharePoint Online | /sites/eng-hub/ (CA1 Dinuba Projects) |
| Approved Projects — CA4 | Document Library | SharePoint Online | /sites/eng-hub/ (CA4 Vernon MFG Projects) |
| Approved Projects — SC1 | Document Library | SharePoint Online | /sites/eng-hub/ (SC1 Florence Projects Library Template) |
| Approved Projects — TX1 | Document Library | SharePoint Online | /sites/eng-hub/ (TX1 Denison Projects Library Template) |
| CAD Blocks Library | Document Library | SharePoint Online | /sites/eng-hub/ (CAD Blocks) |
| CEP Project Libraries (100+) | Document Libraries | SharePoint Online | /sites/eng-hub/[CEP-YYNNN-Facility] |

### Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│              Engineering Hub Communication Site              │
│         https://ruizfoods.sharepoint.com/sites/eng-hub      │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              PnP Modern Search V4 Page                │  │
│  │  ┌──────────┐  ┌──────────────┐  ┌───────────────┐  │  │
│  │  │Search Box│  │Search Filters│  │Search Verticals│  │  │
│  │  └────┬─────┘  └──────┬───────┘  └───────┬───────┘  │  │
│  │       └───────────────┴──────────────────┘          │  │
│  │                       ▼                              │  │
│  │              ┌──────────────────┐                   │  │
│  │              │  Search Results  │                   │  │
│  │              └──────────────────┘                   │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                  Document Libraries                  │   │
│  │  Agreements │ CA1 Assets │ CA4 Assets │ CAD Blocks  │   │
│  │  Approved Projects (x4) │ CEP Libraries (100+)      │   │
│  └────────────────────────┬────────────────────────────┘   │
│                           │                                 │
│  ┌────────────────────────▼────────────────────────────┐   │
│  │           Ruiz Foods Taxonomy                        │   │
│  │  Content Types: Engineering Document (+ 10 sub-CTs) │   │
│  │  Site Columns: Area │ Facility │ Class │ Classification│  │
│  │                Supplier │ Legal Entity │ CEP Project #│  │
│  └────────────────────────┬────────────────────────────┘   │
│                           │                                 │
│  ┌────────────────────────▼────────────────────────────┐   │
│  │        Managed Metadata Service                      │   │
│  │  Term Group: Ruiz Foods Taxonomy                     │   │
│  │  Term Sets: Area │ Facility │ Class │ Classification │   │
│  │             Supplier │ Legal Entity                  │   │
└──┴──────────────────────────────────────────────────────┴──┘
```

---

## 3. Data Model

### 3.1 Content Type Hierarchy — Ruiz Foods Taxonomy Group

| Content Type | ID (prefix) | Parent | Field Count | Hidden | Notes |
|---|---|---|---|---|---|
| **Ruiz Foods Document** | `0x010100619C164C37EBEB428CE4DCE8DB753892` | Document | 12 | No | Base CT for all engineering docs |
| **Engineering Document** | `...0038A64346336E944E8E5FFB28C5756CC5` | Ruiz Foods Document | 24 | No | Primary CT for most CEP libraries |
| **Safety Document** | `...CC501` | Engineering Document | 24 | No | Safety procedures and MSDS |
| **Software Document** | `...CC502` | Engineering Document | 24 | No | PLC programs, HMI, software specs |
| **FSQA Document** | `...CC503` | Engineering Document | 24 | No | Food Safety / Quality Assurance docs |
| **Asset Document** | `...CC504` | Engineering Document | 24 | No | Used in Assets libraries (CA1, CA4) |
| **Data Link Document** | `...CC505` | Engineering Document | 24 | No | PLC data links and network configs |
| **Manual Document** | `...CC507` | Engineering Document | 24 | No | OEM manuals, operating procedures |
| **Agreement Document** | `...CC508` | Engineering Document | 27 | No | Used exclusively in Agreements library; 3 extra fields (Supplier, Legal Entity, Expiration) |
| **Drawing Document** | `...CC509` | Engineering Document | 24 | No | Engineering drawings and schematics |
| **Spare Part Document** | `...CC50A` | Engineering Document | 24 | No | Spare parts lists and BOM |
| **Warranty Document** | `...CC50B` | Engineering Document | 24 | No | Equipment warranties |
| **Project Document** | `...CC50C` | Engineering Document | 24 | No | General project documents |
| **Vendor Document** | `0x010100F813A098494E294A936BEF86FC6FAC5E` | Ruiz Foods Document | 18 | No | Vendor-related documents |
| **Engineering Folder** | `0x0120D520002246C65F013969469D511820D3EA093A` | Folder | 22 | No | Folder content type used in all libraries |

> **Full content type IDs** are in `refdocs/ContentTypes.json` and `refdocs/ContentTypes-ByGroup.json`.

### 3.2 Site Columns — Ruiz Foods Taxonomy Group

| Display Name | Internal Name | Type | Required | Default | Description |
|---|---|---|---|---|---|
| **Area** | `Area` | TaxonomyFieldType | No | `ALL LINES` | Production line/department/zone within a facility. TermSetId: `9115c481-4ca2-4e31-9a93-bac90958737c` |
| **Class** | `Class` | TaxonomyFieldTypeMulti | No | `All Equipment` | Equipment classification (multi-value). TermSetId: `36de550e-90a1-4e22-bef6-c5f529b891d0` |
| **Facility** | `Facility` | TaxonomyFieldType | No | — | Manufacturing facility (CA1, CA4, SC1, TX1) |
| **Classification** | `Classification` | TaxonomyFieldType | No | — | Document classification / agreement type |
| **Supplier** | `Supplier` | TaxonomyFieldType | No | — | Vendor / supplier name |
| **Legal entity** | `Legal_x0020_entity` | TaxonomyFieldType | No | — | Ruiz Foods legal entity |
| **Engineering Folder** | `Engineering_x0020_Folder` | TaxonomyFieldType | No | — | Engineering folder category (folder CT field) |
| **CEP Project #** | `CEP_x0020_Project_x0020__x0023_` | Text (255) | No | — | Capital Engineering Project number (e.g. `CEP 22-300`) |
| **EAM Asset Number** | `EAM_x0020_Asset_x0020_Number` | Text | No | — | Enterprise Asset Management ID |
| **Date Uploaded** | `Date_x0020_Uploaded` | DateTime | No | — | Document upload date |
| **Expiration Date** | `Expiration_x0020_Date` | DateTime | No | — | Contract/document expiration date (Agreements) |
| **Days Left on Contract** | `Days_x0020_Left_x0020_on_x0020_Contract` | Calculated | No | — | Calculated: days between today and Expiration Date |

> **Note:** Each TaxonomyFieldType column has a corresponding hidden `_0` shadow field (Note type) for storing the taxonomy wire value. Do not delete these shadow fields.

> **Full site column export** with SchemaXml is in `refdocs/Custom Columns-SiteColumns.json` and `refdocs/SiteColumns-ByGroup.json`.

### 3.3 Document Library Inventory

#### Core Libraries

| Library Title | Server-Relative URL | Items | Content Types | Unique Permissions | Versioning |
|---|---|---|---|---|---|
| Agreements | `/sites/eng-hub/agreements` | 778 | Agreement Document, Folder, Engineering Folder | No (inherits from site) | Major only, limit 500 |
| CA1 Dinuba Assets | `/sites/eng-hub/CA1Assets` | 18,485 | Asset Document, Engineering Document, Folder, Engineering Folder | **Yes** | Major only, limit 500 |
| CA4 Vernon MFG Assets | `/sites/eng-hub/` (CA4 Assets) | — | Asset Document, Engineering Document, Folder, Engineering Folder | **Yes** | Major only, limit 500 |
| CAD Blocks | `/sites/eng-hub/` (CAD Blocks) | — | Engineering Document, Folder, Engineering Folder | No | Major only, limit 500 |
| Approved Projects — CA1 Dinuba | `/sites/eng-hub/` | — | Engineering Document + sub-types, Engineering Folder | No | Major only, limit 500 |
| Approved Projects — CA4 Vernon MFG | `/sites/eng-hub/` | — | Engineering Document + sub-types, Engineering Folder | No | Major only, limit 500 |
| Approved Projects — SC1 Florence | `/sites/eng-hub/` | — | Engineering Document + sub-types, Engineering Folder | No | Major only, limit 500 |
| Approved Projects — TX1 Denison | `/sites/eng-hub/` | — | Engineering Document + sub-types, Engineering Folder | No | Major only, limit 500 |

#### Capital Engineering Project (CEP) Libraries — Naming Convention

All CEP libraries follow this naming pattern:

```
CEP YY-NNN Facility Description
```

Where:
- `YY` = 2-digit year (18, 19, 20, 21, 22…)
- `NNN` = 3-digit project number (001–999); CA1/CA4 projects use 001–299; TX1 uses 300–399; SC1 uses 900–999
- `Facility` = facility code: `CA1`, `CA4`, `SC1`, `TX1`
- `Description` = brief project name

**Facility codes:**

| Code | Facility | Location |
|---|---|---|
| CA1 | Dinuba | Dinuba, CA |
| CA4 | Vernon MFG | Vernon, CA |
| SC1 | Florence | Florence, SC |
| TX1 | Denison | Denison, TX |

**Example CEP libraries (partial list — 100+ exist):**

| Library Title | Year | Facility |
|---|---|---|
| CEP 18-005 & 18-005A CA1 Packaging Cameras | 2018 | CA1 |
| CEP 19-009 CA1 LA6 Upgrade | 2019 | CA1 |
| CEP 19-301 TX1 F5 Automation | 2019 | TX1 |
| CEP 19-901 SC1 BRC-Florence | 2019 | SC1 |
| CEP 20-100 TX1 Plant MES | 2020 | TX1 |
| CEP 21-300 TX1 Air Compressor Upgrade | 2021 | TX1 |
| CEP 22-300 TX1 F3 Optimization | 2022 | TX1 |

> **Full CEP library list** with all settings is in `refdocs/CEP *-Library.json` (one JSON file per library).

#### CEP Library Standard Configuration

All CEP libraries share this standard configuration:

| Setting | Value |
|---|---|
| BaseTemplate | 101 (DocumentLibrary) |
| BaseType | DocumentLibrary |
| EnableVersioning | true |
| EnableMinorVersions | false |
| EnableModeration | false (no content approval) |
| ForceCheckout | false |
| MajorVersionLimit | 500 |
| ContentTypesEnabled | true |
| EnableFolderCreation | true |
| IrmEnabled | false |
| NoCrawl | false (indexed for search) |
| HasUniqueRoleAssignments | false (inherits from site) |

---

## 4. Process Flow

### 4.1 Document Upload and Tagging

```
Actor          Step                              Notes
─────────────────────────────────────────────────────────────────────
Engineer       1. Navigate to target library    CEP library, Assets, or Agreements
               │
               ▼
Engineer       2. Upload document               Drag-drop or Upload button
               │
               ▼
SharePoint     3. Auto-detect content type      Based on library default CT
               │
               ▼
Engineer       4. Fill in metadata fields       Required fields vary by CT:
               │                               All CTs: Facility, Area, Class
               │                               Agreement CT: + Supplier, Legal Entity,
               │                                              Classification, Expiration Date
               │                               CEP CT: + CEP Project #
               │
               ▼
SharePoint     5. Save document                 Document stored in library
               │
               ▼
Search Index   6. Crawl and index metadata      Managed Properties mapped to
                                               crawled properties from MMD columns
```

### 4.2 Faceted Search Discovery

```
Actor          Step                              Notes
─────────────────────────────────────────────────────────────────────
Engineer       1. Navigate to search page       PnP Modern Search page on the site
               │
               ▼
Engineer       2. Enter search terms            Free-text in Search Box web part
               │
               ▼
PnP Search     3. Execute SharePoint search     Queries across ALL indexed libraries
               │
               ▼
Engineer       4. Apply filters                 Managed Metadata refiners:
               │                               - Facility (CA1, CA4, SC1, TX1)
               │                               - Area (production line/zone)
               │                               - Class (equipment type)
               │                               - Classification (document type)
               │                               - Content Type (Engineering/Safety/etc.)
               ▼
Engineer       5. Click result to open          Opens document directly in browser
```

---

## 5. Configuration Reference

### 5.1 Agreements Library

**Settings:**

| Setting | Value |
|---|---|
| Title | Agreements |
| ID | `fb4aeb75-60d0-45fa-86e4-739414423138` |
| Server-Relative URL | `/sites/eng-hub/agreements` |
| Default View URL | `/sites/eng-hub/agreements/Forms/All Vendors.aspx` |
| Item Count | 778 (as of 2026-05-08) |
| Content Types | Agreement Document, Folder, Engineering Folder |
| Content Types Enabled | true |
| Versioning | Major only, limit 500 |
| Content Approval | Disabled |
| Force Checkout | Disabled |
| IRM | Disabled |
| Unique Permissions | No (inherits from site) |

**Views:**

| View Title | Default | Hidden | Row Limit | CAML Filter |
|---|---|---|---|---|
| All Vendors | **Yes** | No | 30 | `<OrderBy><FieldRef Name="FileLeafRef" /></OrderBy>` |
| All Documents | No | No | 30 | `<OrderBy><FieldRef Name="FileLeafRef" /></OrderBy><Where><Neq><FieldRef Name="ContentType" /><Value Type="Computed">Engineering Folder</Value></Neq></Where>` |
| All COI Documents | No | No | 30 | See below |
| All MNDA Documents | No | No | 30 | See below |
| All W9 Documents | No | No | 30 | See below |
| All Visitor's Liability Release | No | No | 30 | See below |
| All Folders | No | No | 30 | `<OrderBy><FieldRef Name="Expiration_x0020_Date" Ascending="FALSE" /></OrderBy>` |

**CAML — All COI Documents:**
```xml
<Where>
  <And>
    <Or>
      <Contains><FieldRef Name="FileLeafRef" /><Value Type="File">W9</Value></Contains>
      <Contains><FieldRef Name="FileLeafRef" /><Value Type="File">W-9</Value></Contains>
    </Or>
    <Or>
      <Or>
        <Eq><FieldRef Name="Classification" /><Value Type="MMD">Terms ＆ Conditions (TCs)- MNDA- AIA.</Value></Eq>
        <Eq><FieldRef Name="Classification" /><Value Type="MMD">NEW VENDOR FORM</Value></Eq>
      </Or>
      <Eq><FieldRef Name="Classification" /><Value Type="MMD">All Agreements</Value></Eq>
    </Or>
  </And>
</Where>
<OrderBy><FieldRef Name="FileLeafRef" /></OrderBy>
```

**CAML — All MNDA Documents:** (same filter as All COI Documents — same CAML query)

**CAML — All W9 Documents:**
```xml
<OrderBy><FieldRef Name="FileLeafRef" /></OrderBy>
<Where>
  <Or>
    <Contains><FieldRef Name="FileLeafRef" /><Value Type="File">W9</Value></Contains>
    <Contains><FieldRef Name="FileLeafRef" /><Value Type="File">W-9</Value></Contains>
  </Or>
</Where>
```

**CAML — All Visitor's Liability Release:**
```xml
<Where>
  <And>
    <Neq><FieldRef Name="ContentType" /><Value Type="Computed">Engineering Folder</Value></Neq>
    <Eq><FieldRef Name="Classification" /><Value Type="MMD">VISITOR'S LIABILITY RELEASE AND CONFIDENTIALITY AGREEMENT</Value></Eq>
  </And>
</Where>
<OrderBy><FieldRef Name="FileLeafRef" /></OrderBy>
```

**Agreement Document Content Type — Key Fields:**

| Display Name | Internal Name | Type | Required | Notes |
|---|---|---|---|---|
| Name | `FileLeafRef` | File | — | System field — document file name |
| Content Type | `ContentType` | Computed | — | Must be "Agreement Document" |
| Legal entity | `Legal_x0020_entity` | TaxonomyFieldType | No | Ruiz Foods legal entity |
| Facility | `Facility` | TaxonomyFieldType | No | Manufacturing facility |
| Classification | `Classification` | TaxonomyFieldType | No | Agreement type (MMD term) |
| Supplier | `Supplier` | TaxonomyFieldType | No | Vendor / supplier |
| Date Uploaded | `Date_x0020_Uploaded` | DateTime | No | Manual upload date |
| Expiration Date | `Expiration_x0020_Date` | DateTime | No | Contract expiration |
| Days Left on Contract | `Days_x0020_Left_x0020_on_x0020_Contract` | Calculated | No | Auto-calculated from Expiration Date |
| CEP Project # | `CEP_x0020_Project_x0020__x0023_` | Text | No | Linked CEP project number |
| EAM Asset Number | `EAM_x0020_Asset_x0020_Number` | Text | No | Enterprise Asset Management ID |
| Area | `Area` | TaxonomyFieldType | No | Production area |
| Class | `Class` | TaxonomyFieldTypeMulti | No | Equipment class |
| Created | `Created` | DateTime | — | System — auto set on upload |
| Author | `Author` | User | — | System — uploader |
| Modified | `Modified` | DateTime | — | System — auto |

**Classification Managed Metadata Values (confirmed from CAML queries):**

| Term Value | Used In View |
|---|---|
| `Terms ＆ Conditions (TCs)- MNDA- AIA.` | All COI Documents, All MNDA Documents |
| `NEW VENDOR FORM` | All COI Documents, All MNDA Documents |
| `All Agreements` | All COI Documents, All MNDA Documents |
| `VISITOR'S LIABILITY RELEASE AND CONFIDENTIALITY AGREEMENT` | All Visitor's Liability Release |

> **Note:** The `＆` character in `Terms ＆ Conditions` is a full-width ampersand (U+FF06), not a standard `&`. This is the production value and must be used exactly as shown when creating CAML queries.

### 5.2 Assets Libraries

Both CA1 Dinuba Assets and CA4 Vernon MFG Assets share this configuration:

| Setting | Value |
|---|---|
| BaseType | DocumentLibrary |
| Content Types | Asset Document, Engineering Document, Folder, Engineering Folder |
| EnableVersioning | true |
| EnableMinorVersions | false |
| MajorVersionLimit | 500 |
| NoCrawl | false |
| **HasUniqueRoleAssignments** | **true** — facility-scoped permissions |

**CA1 Dinuba Assets specific:**

| Setting | Value |
|---|---|
| Server-Relative URL | `/sites/eng-hub/CA1Assets` |
| Item Count | 18,485 (as of 2026-05-08) |
| Default View | All Folders |

**Views (CA1 Dinuba Assets):**

| View | Default | CAML |
|---|---|---|
| All Documents | No | `<OrderBy><FieldRef Name="FileLeafRef" /></OrderBy><Where><Neq><FieldRef Name="ContentType" /><Value Type="Computed">Engineering Folder</Value></Neq></Where>` |
| All Folders | Yes | — |

### 5.3 CEP Library Standard Views

Each CEP library has at minimum:

| View | Default | CAML |
|---|---|---|
| All Documents | No | `<OrderBy><FieldRef Name="FileLeafRef" /></OrderBy><Where><Neq><FieldRef Name="ContentType" /><Value Type="Computed">Engineering Folder</Value></Neq></Where>` |
| All Folders | Yes | — |

View fields typically include: `DocIcon`, `LinkFilename`, `Modified`, `Editor`, `ContentType`, `Facility`, `Area`

---

## 6. Automation / Integration

### 6.1 PnP Modern Search Web Parts V4

**Solution Package:**

| Attribute | Value |
|---|---|
| File name | `pnp-modern-search-parts-v4.sppkg` |
| Package type | SharePoint Framework (SPFx) solution |
| Deployment target | Tenant App Catalog |
| Source | https://github.com/microsoft-search/pnp-modern-search (open source) |

**Deployment Steps (Admin):**
1. Navigate to SharePoint Admin Center → More Features → Apps → Open
2. Upload `pnp-modern-search-parts-v4.sppkg` to the App Catalog
3. When prompted, check "Make this solution available to all sites in the organization" if tenant-wide deployment is desired, or deploy to the site-level App Catalog
4. Trust the solution when prompted
5. Navigate to the Engineering Hub site → Site Contents → Add an App → PnP Modern Search
6. Add Search Box, Search Results, Search Filters, and Search Verticals web parts to the target page

**Web Parts Available:**

| Web Part | Purpose |
|---|---|
| PnP Search Box | Full-text search input |
| PnP Search Results | Renders result cards with configured template |
| PnP Search Filters | Managed Properties refiners (Facility, Area, Class, Classification, etc.) |
| PnP Search Verticals | Tabs to switch search scope (All, Engineering, Agreements, etc.) |

**Web Part Connections Required:**

| Source WP | → Target WP | Connection Type |
|---|---|---|
| Search Box | → Search Results | Passes search query |
| Search Box | → Search Filters | Passes search query |
| Search Verticals | → Search Results | Passes vertical scope |
| Search Filters | → Search Results | Passes active refiners |

> **Gap:** The exact web part property configuration (result template, data source, managed properties used as refiners, vertical configurations) requires access to the live site to export. The page URL and full configuration JSON were not available in the exported refdocs.

### 6.2 No Power Automate Flows Identified

No Power Automate flows were identified in the Engineering Hub portal. The portal is a purely manual document management system — there are no automated workflows for approval, notification, or archiving.

---

## 7. Interface Documentation

### 7.1 Main Search Page

> **Gap:** The search page URL and exact web part layout require live site access. Based on the PnP Modern Search V4 deployment and the site type (Communication Site), the search experience is expected to be a SharePoint Site Page containing the four PnP web parts (Search Box, Filters, Verticals, Results) wired together.

**Expected page structure:**

```
[Header / Site Navigation]

[PnP Search Box]

[PnP Search Verticals]    |    [PnP Search Filters]
  All Documents            |      Facility
  By Facility              |      Area
  Agreements               |      Class
  CAD / Drawings           |      Classification
                           |      Content Type
[PnP Search Results]
  Card 1: [Icon] [Title] [Facility] [Area] [Date Modified]
  Card 2: ...
  ...
  [Pagination]
```

### 7.2 Document Libraries

Each document library is accessible directly by URL:

| Library | URL Pattern |
|---|---|
| Agreements | `https://ruizfoods.sharepoint.com/sites/eng-hub/agreements` |
| CA1 Assets | `https://ruizfoods.sharepoint.com/sites/eng-hub/CA1Assets` |
| CEP Library | `https://ruizfoods.sharepoint.com/sites/eng-hub/[library-server-relative-url]` |

Library views are rendered as standard SharePoint document library views. The default view for Agreements is **All Vendors**; for CA1 Assets it is **All Folders**.

---

## 8. Permissions & Access

### 8.1 Site-Level Permissions

> **Gap:** Site permission group names and membership were not in the exported refdocs. The following is the standard SharePoint Communication Site permission model — verify against the live site.

| SharePoint Group | Default Permission Level | Who Should Be In This Group |
|---|---|---|
| eng-hub Owners | Full Control | IT Administrators, Engineering Managers |
| eng-hub Members | Edit | Engineering Staff who upload documents |
| eng-hub Visitors | Read | All Ruiz Foods employees (view/download) |

### 8.2 Libraries with Unique Permissions

The following libraries break permission inheritance from the site and require separate management:

| Library | HasUniqueRoleAssignments | Reason |
|---|---|---|
| **CA1 Dinuba Assets** | **Yes** | Facility-scoped access — only CA1 staff + IT can edit |
| **CA4 Vernon MFG Assets** | **Yes** | Facility-scoped access — only CA4 staff + IT can edit |

All other libraries (Agreements, CAD Blocks, Approved Projects, all CEP libraries) inherit permissions from the site.

### 8.3 How to Add / Remove a User

**Add a user to a site permission group:**
1. Navigate to `https://ruizfoods.sharepoint.com/sites/eng-hub/_layouts/15/user.aspx`
2. Click the group name (e.g., `eng-hub Members`)
3. Click "New" → "Add Users"
4. Enter the user's email address and click "Share"

**Add a user to a library with unique permissions (CA1 or CA4 Assets):**
1. Navigate to the library
2. Library Settings → Permissions for this document library
3. Click "Grant Permissions"
4. Enter the user's email, select permission level (Read or Edit), click "Share"

---

## 9. Operational Runbook

This section is the operational reference for IT Administrators and SharePoint Administrators
responsible for maintaining the Engineering Hub. Each runbook covers a specific admin scenario
with numbered steps, screenshots, and FAQs.

**Runbook source files:** `refdocs/Runbooks/{runbook-name}/runbook.md`
**Runbook catalog:** `spec-kit/input/runbooks.md`
**In the Word document:** each runbook appears as a full appendix with embedded screenshots
immediately after Section 11.

---

### Runbook Catalog

| ID | Runbook | Audience | Trigger | Status | Word Appendix |
|---|---|---|---|---|---|
| RB-01 | Create a New CEP Project Library (ShareGate) | IT Admin | New CEP service request | Complete | Appendix: Create a New CEP Project Library Using ShareGate |
| RB-02 | Manage Ruiz Foods Taxonomy Terms | IT Admin | New term needed (facility, area, supplier, classification) | Stub — screenshots pending | Appendix: Manage Ruiz Foods Taxonomy Terms in Term Store |
| RB-03 | Manage Unique Permissions on Assets Libraries | IT Admin / Eng Manager | Employee onboarding, offboarding, or role change | Stub — screenshots pending | Appendix: Manage Unique Permissions on Assets Libraries |
| RB-04 | Troubleshoot PnP Modern Search | IT Admin | Missing results, stale results, web part errors | Stub — screenshots pending | Appendix: Troubleshoot PnP Modern Search Indexing and Web Parts |
| RB-05 | Upload and Tag Engineering Documents | Engineering Staff / PM | New document ready for the portal | Stub — screenshots pending | Appendix: Upload and Tag Engineering Documents |
| RB-06 | Deploy / Update PnP Modern Search V4 Solution | IT Admin | New PnP release or post-migration redeploy | Stub — screenshots pending | Appendix: Deploy / Update PnP Modern Search V4 Solution |

> **Stub runbooks** contain full chapter structures, step descriptions, and placeholder
> image callouts (`> [ADD SCREENSHOT: ...]`). Screenshots are added by dropping JPG/PNG
> files into `refdocs/Runbooks/{name}/images/` and re-running `py scripts/build-docx.py`.

---

### RB-01 — Create a New CEP Project Library (ShareGate)

**Status:** Complete (33 screenshots)
**Full runbook:** `refdocs/Runbooks/new-cep-project-library/runbook.md`
**Audience:** SharePoint administrators, IT staff
**Trigger:** New Capital Engineering Project service request received

**Summary of steps:**

| Phase | Steps | Tool |
|---|---|---|
| Copy library from template | Select source CEP library, configure destination title and URL, set operation mode and element selection | ShareGate Desktop |
| Monitor and export migration report | Watch item status, confirm all items "Copied successfully", export the report | ShareGate Desktop |
| Update library settings | Rename description to reference the ticket number, verify content type visibility and order | SharePoint Online |
| Verify columns | Confirm all required columns present (Area, CEP Project #, Legal Entity, Facility, Supplier/Vendor, EAM Asset #, etc.) | SharePoint Online |
| Set Legal Entity default | Open column settings, select the correct managed term default (RFP / RG4 / RG1) | SharePoint Online |
| Bulk-edit metadata | Select all document sets, fill Facility / Legal Entity / CEP Project # in bulk edit pane, save | SharePoint Online |

> See the full step-by-step procedure with screenshots in the Word document appendix:
> **"Appendix: Create a New CEP Project Library Using ShareGate"**

---

### RB-02 — Manage Ruiz Foods Taxonomy Terms

**Status:** Stub — screenshots pending
**Full runbook:** `refdocs/Runbooks/manage-taxonomy-terms/runbook.md`
**Audience:** SharePoint administrators
**Trigger:** New facility, area, classification value, or supplier needed
**Prerequisites:** Term Store Administrator or Site Collection Administrator role

**Summary of steps:**
1. Open SharePoint Admin Center → Content services → Term store
2. Expand **Ruiz Foods Taxonomy** term group in the left tree
3. Select the target term set (Area, Facility, Classification, or Supplier)
4. Click **Add term**, type the name, press Enter
5. Set **Available for tagging = On** and add a description
6. Save and verify the term appears in the library metadata picker

> **Important:** Use **deprecation** (uncheck "Available for tagging") rather than deletion
> for terms that are no longer valid — deletion breaks existing document metadata.

> See the full procedure in the Word document appendix:
> **"Appendix: Manage Ruiz Foods Taxonomy Terms in Term Store"**

---

### RB-03 — Manage Unique Permissions on Assets Libraries

**Status:** Stub — screenshots pending
**Full runbook:** `refdocs/Runbooks/manage-assets-permissions/runbook.md`
**Audience:** IT Administrators, Engineering Managers
**Trigger:** Employee onboarding, offboarding, or facility access role change
**Prerequisites:** Site Collection Administrator or Full Control on the specific library

**Summary of steps (grant access):**
1. Navigate to CA1 Dinuba Assets or CA4 Vernon MFG Assets library
2. Library Settings → Permissions for this document library
3. Confirm banner reads "This library has unique permissions"
4. Click **Grant Permissions**, search for the user, select permission level (Read / Contribute)
5. Click Share and verify the user appears in the permissions list

**Summary of steps (revoke access):**
1. On the Library Permissions page, locate the user
2. Check their name checkbox → **Remove User Permissions**
3. Confirm and verify removal

> **Note:** Removing site-level group membership does NOT revoke Assets library access
> because these libraries break permission inheritance. Always revoke at the library level.

> See the full procedure in the Word document appendix:
> **"Appendix: Manage Unique Permissions on Assets Libraries"**

---

### RB-04 — Troubleshoot PnP Modern Search

**Status:** Stub — screenshots pending
**Full runbook:** `refdocs/Runbooks/troubleshoot-pnp-search/runbook.md`
**Audience:** IT Administrators
**Trigger:** Missing results, stale results, or web part errors on the search page

**Symptom → Action quick reference:**

| Symptom | First action |
|---|---|
| No results for any query | Check crawl log in SharePoint Admin Center → Search |
| Specific library missing | Library Settings → Advanced Settings → Reindex Document Library |
| Results are stale | Request manual re-crawl; wait 15–60 min |
| Web part blank or error | Edit page → verify Search Box → Results → Filters connections |
| Refiners show no values | Admin Center → Search Schema → verify `owstaxId*` managed properties are Refinable |

**Search page URL:** `https://ruizfoods.sharepoint.com/sites/eng-hub/SitePages/engineering-search.aspx`

> See the full diagnostic procedure in the Word document appendix:
> **"Appendix: Troubleshoot PnP Modern Search Indexing and Web Parts"**

---

### RB-05 — Upload and Tag Engineering Documents

**Status:** Stub — screenshots pending
**Full runbook:** `refdocs/Runbooks/upload-and-tag-documents/runbook.md`
**Audience:** Engineering Staff, Project Managers
**Trigger:** New engineering document ready for the portal

**Library selection guide:**

| Document type | Target library |
|---|---|
| Capital Engineering Project documents | `CEP YY-NNN Facility Description` |
| Facility equipment assets | CA1 Dinuba Assets or CA4 Vernon MFG Assets |
| Vendor contracts and certificates | Agreements |
| AutoCAD drawing blocks | CAD Blocks |
| Approved project plans | Approved Projects — `{Facility}` |

**Required metadata for all documents:**
Facility · Area · Classification · Legal Entity · CEP Project # (if applicable)

> See the full upload and tagging procedure in the Word document appendix:
> **"Appendix: Upload and Tag Engineering Documents"**

---

### RB-06 — Deploy / Update PnP Modern Search V4 Solution

**Status:** Stub — screenshots pending
**Full runbook:** `refdocs/Runbooks/update-pnp-search-solution/runbook.md`
**Audience:** IT Administrators
**Trigger:** New PnP Modern Search V4 release, or post-tenant-migration redeploy
**Prerequisites:** SharePoint App Catalog Owner or Tenant Administrator role

**Summary of steps:**
1. Download `pnp-modern-search-parts-v4.sppkg` from the PnP GitHub releases page
2. Open App Catalog → Apps for SharePoint → Upload, replacing the existing package
3. Deploy with **"Make available to all sites"** checked; Trust the API permissions dialog
4. Verify the Apps for SharePoint list shows the new version number
5. Navigate to the search page and run a test query to confirm the web parts still function
6. If a major version upgrade (4.x → 5.x), re-add and reconnect web parts on the search page

**Rollback:** Re-upload the previous `.sppkg` version and deploy — no per-site action needed.

> See the full deployment procedure in the Word document appendix:
> **"Appendix: Deploy / Update PnP Modern Search V4 Solution"**

---

## 10. Data Snapshot Evidence

All data was exported from the live site on **2026-05-08** using PnP PowerShell v1.5.0 (`Connect-PnPOnline -UseWebLogin`).

### Item Counts at Export Date

| Library | Item Count | Export File |
|---|---|---|
| Agreements | 778 | `refdocs/Agreements-Library.json` |
| CA1 Dinuba Assets | 18,485 | `refdocs/CA1 Dinuba Assets-Library.json` |
| CA4 Vernon MFG Assets | — | `refdocs/CA4 Vernon MFG Assets-Library.json` |
| CAD Blocks | — | `refdocs/CAD Blocks-Library.json` |
| Approved Projects — CA1 | — | `refdocs/Approved Projects - CA1 Dinuba Projects-Library.json` |
| Approved Projects — CA4 | — | `refdocs/Approved Projects - CA4 Vernon MFG Projects-Library.json` |
| Approved Projects — SC1 | — | `refdocs/Approved Projects - SC1 Florence Projects Library Template-Library.json` |
| Approved Projects — TX1 | — | `refdocs/Approved Projects - TX1 Denison Projects Library Template-Library.json` |
| CEP Libraries (100+) | — each | `refdocs/CEP *-Library.json` (one file per library) |

> Items marked `—` were not read during this KT session (library JSON files exist in refdocs but were not fully parsed). Item counts can be confirmed by opening the corresponding `*-Library.json` file and reading the `Settings.ItemCount` field.

### Content Type Count at Export Date

| Group | Count | Source |
|---|---|---|
| Ruiz Foods Taxonomy | 15 content types | `refdocs/ContentTypes-ByGroup.json` |
| Document Content Types (OOTB) | 13 | `refdocs/ContentTypes-ByGroup.json` |
| Total site content types | ~66 (all groups) | `refdocs/ContentTypes.json` |

### Site Column Count at Export Date

| Group | Count | Source |
|---|---|---|
| Custom Columns | 34 (includes hidden/system) | `refdocs/Custom Columns-SiteColumns.json` |
| Ruiz Foods Taxonomy group | visible in library JSON fields | `refdocs/*-Library.json` (Fields array) |

### PnP Search Package

| Attribute | Value |
|---|---|
| File | `pnp-modern-search-parts-v4.sppkg` |
| Present in refdocs | Yes |
| Version | To be confirmed from App Catalog in live site |

---

## 11. Brand Compliance

> **Gap:** The Ruiz Foods brand guidelines files are in binary formats (`.pdf`, `.pptx`) that cannot be read by the document export tools used in this KT session. The files present in `refdocs/` are:
> - `engineering web portal Training - V2 (2).pdf`
> - `Engineering Hub Proposal.pptx`
> - `A Message from Our Senior Vice.pdf`
> - `Introducing the New Standardized Folder Structure for CEP Projects.pdf`
>
> Brand guidelines PDFs referenced in the KT master prompt template (`Learning Color Brand Guide.pdf`, `RZF003_22 El Monterey_Brand_Guidelines_10_27_22_v3 (1).pdf`) were **not present** in the current `refdocs/` folder.

**Known brand touchpoints in the Engineering Hub:**

| Component | Brand Dimension | Notes |
|---|---|---|
| Search page | Layout, typography | Communication site inherits global Ruiz Foods SharePoint theme |
| Library views | Column formatting | No JSON column formatters identified in exported views |
| Engineering Folder CT | Folder naming / icons | `Engineering Folder` content type used as standard folder display |
| PnP Search result cards | Card template layout | Configured in PnP Search Results web part template (requires live site review) |

**To complete this section:**
1. Add the Ruiz Foods brand guide PDFs to `refdocs/`
2. Request the training PDF to be converted to text or provide the key brand rules (colors, fonts, logo usage, tone) in a `.md` or `.txt` file
3. Re-run `generate_brief` and `start_sprint` to regenerate this section with complete brand data

---

## Appendix A — Export Scripts

The following PowerShell scripts (in `source-code/`) were used to generate the `refdocs/` data:

| Script | Purpose |
|---|---|
| `Export-Library.ps1` | Exports all document libraries (schema XML + JSON settings, views, fields) |
| `Export-ContentTypes.ps1` | Exports all site content types with field links |
| `Export-SiteColumns.ps1` | Exports site columns by group |
| `Export-AllTermSets.ps1` | Exports all term groups, term sets, and terms recursively |
| `Export-TermSets.ps1` | Exports a single term set |
| `Export-ListSchema.ps1` | Exports a single list schema XML |
| `Export-ListSettings.ps1` | Exports list settings and views for one or all lists |
| `Export-ManagedProperties.ps1` | Exports SharePoint Search managed properties |

**To re-export for a future KT refresh:**
```powershell
# Export all libraries
.\source-code\Export-Library.ps1 `
    -SiteUrl "https://ruizfoods.sharepoint.com/sites/eng-hub" `
    -OutputFolder "C:\DATA\Repos\rf_engineering\refdocs"

# Export all content types
.\source-code\Export-ContentTypes.ps1 `
    -SiteUrl "https://ruizfoods.sharepoint.com/sites/eng-hub" `
    -OutputFolder "C:\DATA\Repos\rf_engineering\refdocs"

# Export all term sets
.\source-code\Export-AllTermSets.ps1 `
    -SiteUrl "https://ruizfoods.sharepoint.com/sites/eng-hub" `
    -OutputFolder "C:\DATA\Repos\rf_engineering\refdocs" `
    -TermGroupName "Ruiz Foods Taxonomy"
```

---

## Appendix B — Runbook File Inventory

Detailed step-by-step runbooks with screenshots live in `refdocs/Runbooks/`.
Each folder contains a `runbook.md` and an `images/` subfolder.
All runbooks are automatically appended to this Word document as appendices
when `py scripts/build-docx.py` is run.

| Folder | Title | Status | Screenshots |
|---|---|---|---|
| `new-cep-project-library` | Create a New CEP Project Library (ShareGate) | Complete | 33 |
| `manage-taxonomy-terms` | Manage Ruiz Foods Taxonomy Terms in Term Store | Stub | 0 — pending |
| `manage-assets-permissions` | Manage Unique Permissions on Assets Libraries | Stub | 0 — pending |
| `troubleshoot-pnp-search` | Troubleshoot PnP Modern Search Indexing and Web Parts | Stub | 0 — pending |
| `upload-and-tag-documents` | Upload and Tag Engineering Documents | Stub | 0 — pending |
| `update-pnp-search-solution` | Deploy / Update PnP Modern Search V4 Solution | Stub | 0 — pending |

**To add screenshots to a stub runbook:**
1. Drop JPG/PNG files into `refdocs/Runbooks/{folder}/images/`
2. Update the `runbook.md` — replace `> [ADD SCREENSHOT: description]` lines with the markdown image syntax pointing to your file in `images/`
3. Update the status in `spec-kit/input/runbooks.md`
4. Run `py scripts/build-docx.py` — the updated runbook is embedded automatically

**To add a new runbook:**
1. Create `refdocs/Runbooks/{kebab-case-name}/runbook.md` + `images/` folder
2. Add a row to the catalog in `spec-kit/input/runbooks.md`
3. Run `py scripts/build-docx.py` — auto-discovered and appended, no script changes needed

---

*KT Document generated by VISION Framework — Sprint 1 (2026-05-08) / Updated Sprint 2 (2026-05-14)*
*Source data exported: 2026-05-08 | Runbook catalog: 6 runbooks (1 complete, 5 stubs)*
