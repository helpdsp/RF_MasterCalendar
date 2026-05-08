# Test plan — Local Project

> Align tests with quality gates and RF acceptance in the product PRD.

## Context (brief + PRD excerpt)

### Approved brief

# Brief — Engineering Web Portal (eng-hub)

## Executive Summary

The Engineering Web Portal is a SharePoint Online Communication Site at `https://ruizfoods.sharepoint.com/sites/eng-hub` that serves as the central document management and search hub for the Ruiz Foods Engineering department across all four manufacturing facilities: CA1 (Dinuba, CA), CA4 (Vernon MFG, CA), SC1 (Florence, SC), and TX1 (Denison, TX).

The portal houses a large corpus of engineering documentation — over 100 dedicated Capital Engineering Project (CEP) document libraries, two facility-level Asset libraries (totaling 18,000+ items in CA1 alone), a vendor Agreements library (778 items), Approved Projects libraries per facility, and a shared CAD Blocks library. All document libraries share a unified **Ruiz Foods Taxonomy** content type hierarchy and managed metadata columns (Facility, Area, Classification, Engineering Folder, Supplier, Legal Entity) that enable cross-library faceted search powered by **PnP Modern Search Web Parts V4**.

The primary value proposition is that engineering staff can find any document — whether it belongs to a CEP project, an equipment asset, a vendor agreement, or a CAD file — through a single search interface with rich filtering by facility, production area, document type, classification, and supplier. Without this portal, documents would be siloed in individual project folders with no cross-library discoverability.

## Context

Ruiz Foods Engineering operates across four manufacturing plants and generates large volumes of technical documentation: P&IDs, electrical drawings, equipment manuals, spare parts lists, warranty documents, safety procedures, software documentation, and capital project records. Prior to this portal, each project had its own storage location with no standardized metadata, making it difficult to locate documents across projects or facilities.

The Engineering Hub was built to:
- Standardize document classification across all facilities using a single Ruiz Foods content type hierarchy
- Provide a faceted search experience (PnP Modern Search V4) so engineers can filter by facility, area, document type, and project simultaneously
- Structure Capital Engineering Projects (CEPs) each in their own dedicated document library following a consistent naming convention: `CEP YY-NNN Facility Description`
- Support per-facility access control (the Assets libraries carry unique role assignments)
- Centralize vendor agreements with contract expiration tracking

## Goals

- Provide a single URL for all engineering documentation across all four Ruiz Foods facilities
- Enable faceted search powered by SharePoint Search and PnP Modern Search V4
- Enforce consistent metadata tagging on all documents via Ruiz Foods Taxonomy content types
- Organize Capital Engineering Projects each in isolated document libraries with standardized folder structures
- Track vendor agreement expiration dates and classify contract types (COI, MNDA, W9, Visitor's Liability Release, etc.)
- Support per-facility permissions on Asset libraries without affecting the rest of the portal
- Provide a shared CAD Blocks library accessible across projects

## Target Users / Roles

| Role | Description | Needs |
|---|---|---|
| **Engineering Staff** | Mechanical, electrical, software engineers at any facility | Find project documents, drawings, manuals, spare parts lists quickly via search |
| **Project Managers** | Own individual CEP libraries | Upload, organize, and manage documents for their assigned CEP |
| **Engineering Managers** | Oversight across facilities and projects | Cross-facility search, access to all CEP and asset records |
| **Procurement / Legal** | Manage vendor agreements | Access the Agreements library; track COI, MNDA, W9 expiration dates |
| **IT Administrators** | Maintain the portal | Manage content types, term sets, library permissions, PnP Search configuration |
| **New Employees / Contractors** | Onboarding | Access to approved project documents and training materials |

## Scope — In

- SharePoint Online Communication Site at `/sites/eng-hub`
- **PnP Modern Search Web Parts V4** deployment (`.sppkg` solution package)
- **Ruiz Foods Taxonomy** content type group (15 content types: base `Ruiz Foods Document`, 12 document sub-types, `Vendor Document`, `Engineering Folder`)
- All site columns in the **Ruiz Foods Taxonomy** and **Custom Columns** groups
- **Agreements** library — vendor agreements with expiration tracking (COI, MNDA, W9, Visitor's Liability, All Agreements)
- **Assets libraries** — `CA1 Dinuba Assets` (18,485 items) and `CA4 Vernon MFG Assets`, with unique role assignments per facility
- **Approved Projects libraries** — per facility (CA1, CA4, SC1, TX1)
- **CAD Blocks** library — shared engineering drawings
- **CEP Project libraries** — 100+ libraries following `CEP YY-NNN Facility Description` naming convention, spanning 2018–2022+
- Ruiz Foods Taxonomy term group in the Managed Metadata Service
- Standard SharePoint library views per library type

## Scope — Out / Non-goals

- Power Automate flows (none identified in the engineering hub portal)
- Microsoft Teams integration
- Power Apps or Power BI
- SharePoint list-based solutions (all storage is document libraries)
- External-facing or extranet access
- SPFx custom web parts (solution uses only PnP Modern Search V4 as a third-party package)
- Document generation or templating
- E-mail notifications

## Functional Requirements Summary

### FR-01 — Faceted Search Experience
The portal exposes a PnP Modern Search V4 interface enabling engineers to search across all document libraries simultaneously. Filters include: Facility, Area, Classification, Content Type, document type, and Engineering Folder. The PnP Modern Search package (`pnp-modern-search-parts-v4.sppkg`) must be deployed to the tenant App Catalog.

### FR-02 — Unified Content Type Hierarchy
All documents are tagged with content types from the **Ruiz Foods Taxonomy** group. The hierarchy is:
- `Ruiz Foods Document` → `Engineering Document` (and 10 sub-types: Safety, Software, FSQA, Asset, Data Link, Manual, Agreement, Drawing, Spare Part, Warranty, Project)
- `Ruiz Foods Document` → `Vendor Document`
- `Engineering Folder` (folder content type used in all libraries)

### FR-03 — Capital Engineering Project Libraries
Each CEP has its own document library named `CEP YY-NNN Facility Description`. Libraries inherit content types from the site content type hub and use the standardized `Engineering Folder` CT for folder organization. The `Approved Projects` library per facility provides a project registry.

### FR-04 — Vendor Agreement Tracking (Agreements Library)
The Agreements library stores 778+ vendor documents with views filtered by agreement type (COI, MNDA, W9, Visitor's Liability). Custom columns `Expiration_x0020_Date` and `Days_x0020_Left_x0020_on_x0020_Contract` (calculated) enable expiration tracking. Classification is Managed Metadata (term: `Classification`).

### FR-05 — Facility Asset Libraries
CA1 Dinuba Assets (18,485 items) and CA4 Vernon MFG Assets each hold facility-specific technical documentation. Both have `HasUniqueRoleAssignments = true` providing facility-scoped access control.

### FR-06 — Taxonomy-Driven Metadata
Site columns `Area`, `Facility`, `Legal entity`, `Classification`, `Supplier`, and `Engineering Folder` are all `TaxonomyFieldType` (Managed Metadata) sourced from the **Ruiz Foods Taxonomy** term group. This enables consistent filtering across all libraries in the PnP Search experience.

## Technical Stack & Constraints

| Component | Detail |
|---|---|
| **Platform** | SharePoint Online (Microsoft 365) |
| **Site type** | Communication Site |
| **Site URL** | `https://ruizfoods.sharepoint.com/sites/eng-hub` |
| **Third-party package** | PnP Modern Search Web Parts V4 (`pnp-modern-search-parts-v4.sppkg`) |
| **Content Type Hub** | Ruiz Foods Taxonomy group with 15 custom content types |
| **Managed Metadata** | Ruiz Foods Taxonomy term group (Area, Facility, Classification, etc.) |
| **Versioning** | Major versions only, limit 500 (consistent across all libraries) |
| **IRM** | Disabled on all libraries |
| **Content Approval** | Disabled on all libraries |
| **Custom Code** | None (OOTB SharePoint + PnP Modern Search only) |
| **Tenant** | `ruizfoods.sharepoint.com` |
| **Facilities** | CA1 (Dinuba), CA4 (Vernon MFG), SC1 (Florence), TX1 (Denison) |

## Success Criteria

- A new IT administrator can identify every document library, its content types, and its configured views without accessing the live site
- A new engineer can understand how to find documents using the PnP Search interface and what metadata to use for filtering
- All 100+ CEP libraries are documented with their naming convention, content types, and configuration
- The Agreements library expiration tracking mechanism is fully documented
- Facility-specific permissions (unique role assignments on Assets libraries) are documented
- The PnP Modern Search V4 deployment and configuration is documented so it can be reproduced

## Open Questions / Risks

- **PnP Search page structure**: The actual search page(s) layout (web parts, connections between Search Box / Filters / Verticals / Results) were not exported — screenshots or a site page export would be needed for full documentation
- **Term set contents**: The Ruiz Foods Taxonomy term group structure (term sets and terms) was not included in the current refdocs — the `Export-AllTermSets.ps1` script should be run to capture this
- **CEP library count**: The glob was truncated — exact total count of CEP libraries exceeds 100; a full list needs to be confirmed
- **CA4 Vernon Assets permissions**: `HasUniqueRoleAssignments = true` on Assets libraries — the actual permission groups and members are not in the exported data
- **Approved Projects library purpose**: Whether these libraries act as a project registry index or store actual project-level documents needs confirmation
- **Facility codes**: TX1 = Denison, TX; CA1 = Dinuba, CA; CA4 = Vernon MFG, CA; SC1 = Florence, SC — needs confirmation from stakeholder

## Input Sources

- refdocs: `ContentTypes.json`, `ContentTypes-ByGroup.json`, `ContentTypes-FieldMap.json`
- refdocs: `SiteColumns-ByGroup.json`, `SiteColumns-Special.json`, `Custom Columns-SiteColumns.json`
- refdocs: `Agreements-Library.json` (with full fields and views)
- refdocs: `CA1 Dinuba Assets-Library.json`
- refdocs: 100+ `CEP *-Library.json` files (project libraries)
- refdocs: `Approved Projects - *-Library.json` (4 files, one per facility)
- refdocs: `CAD Blocks-Library.json`
- refdocs: `pnp-modern-search-parts-v4.sppkg` (solution package, binary)
- refdocs: `Engineering_Hub_Solution_Definition.docx` (binary, not readable)
- refdocs: `Engineering Hub Proposal.pptx` (binary, not readable)
- refdocs: `engineering web portal Training - V2 (2).pdf` (binary, not readable)

### Product PRD (excerpt)

# Product PRD — Ruiz Foods Praise Program (Knowledge Transfer Document)

## 1. Product Summary

The **Praise Program** is an employee recognition solution built on Microsoft 365 at Ruiz Foods, Inc. It enables any employee to formally recognize a peer for demonstrating one of the company's Core Values. Submissions are routed through an HR approval workflow (Power Automate + Teams Approvals) before being published on the RuizNetPortal intranet.

This PRD defines the scope of the **Knowledge Transfer (KT) Document** to be produced — a comprehensive technical and functional reference that enables a new IT Administrator or developer to fully assume ownership of the production system.

The solution uses no custom code. All components are Microsoft 365-native: SharePoint Online Lists, Microsoft List Forms, Power Automate flows, Microsoft Teams Approvals App, and Outlook email notifications.

## 2. Users and Roles

- **Employee (submitter):** Any Ruiz Foods employee who submits a praise for a peer via the Microsoft List Form on the intranet.
- **Employee (recognized):** The employee being praised; receives a Congratulations email upon HR approval.
- **HR Manager:** Reviews and approves or rejects praise submissions via the Microsoft Teams Approvals App.
- **IT Administrator:** Manages SharePoint lists, list settings, Power Automate flows, permissions, and the intranet pages.

## 3. Functional Requirements

### RF-01 — Praise Submission

- The system shall allow any employee to submit a praise for a peer via the intranet entry point.
- The submission form shall collect: Praise for (employee), Core Value Demonstrated, Description, and Manager of the recognized employee.
- Submissions shall be stored in the **Praise** SharePoint list (internal name: Recognition) on the `/sites/RuizNetPortal/` site.
- The list shall enforce content moderation — submitted items are placed in Pending status until approved by HR.

### RF-02 — HR Approval Workflow

- A Power Automate flow shall trigger on each new Praise list item.
- The flow shall create an approval request in **Microsoft Teams Approvals App** and route it to HR Manager(s).
- The approval card shall surface: praised employee, submitter, Core Value Demonstrated, description, and manager.
- On **approval**: the list item moderation status shall be set to Approved; a Congratulations email shall be sent to the recognized employee.
- On **rejection**: the list item shall remain in a rejected/moderated state; the submitter may be notified.

### RF-03 — Published Praise Visibility

- Approved praises shall be visible on the **View Current Praises** SharePoint page.
- The default list view ("All Items") shall filter to show only Approved items, ordered newest first.
- The **Top 10 Recognitions** view shall display the 10 most recent approved praises in list format.
- The **Top 10 Recognitions Cards** view shall display the 10 most recent approved praises in card format.

### RF-04 — Employee Self-Service Views

- The **My submissions** view shall allow the submitting employee to see their own submissions grouped by moderation status.
- The **View Submitted Praises** SharePoint page shall surface this self-service view.

### RF-05 — Intranet Navigation

- The **Intranet Landing Page** shall provide links to both "Submit a Praise" and "View Praises" entry points.
- Navigation shall require no special permissions for read access to approved praises.

### RF-06 — Praise Cards Display

- The **Praise Cards** SharePoint list shall serve as the display-optimized companion list for card-layout rendering.
- Praise Cards fields: Title (Required), To (User, Required), From (User, Required), Icon (Text), Description (Note), Likes (UserMulti).

### RF-07 — Praise Archive

- The **Praise (Archive)** SharePoint list shall store historical praises migrated from the active Praise list.
- The Archive list shall maintain the same core field structure as the active list.

### RF-08 — Email Notifications

- A **Praise Alert Email** shall notify relevant parties of a new praise pending approval.
- A **Congratulations Email** shall be sent to the recognized employee upon HR approval.
- Both email templates shall comply with Ruiz Foods / El Monterey brand guidelines (colors, typography, logo, tone of voice).

### RF-09 — Brand Compliance

- All user-facing components (SharePoint pages, email templates, form copy) shall comply with:
  - Ruiz Foods corporate color palette (Learning Color Brand Guide)
  - El Monterey brand guidelines (logo usage, typography, tone of voice, icon style)
- The `Icon` field on Praise and Praise Cards lists stores brand-compliant icon identifiers.

### RF-10 — KT Document Coverage

The KT Document produced by this project shall document:
1. Functional overview and business value
2. Architecture and all M365 component inventory
3. Full data model for all three SharePoint lists (field names, internal names, types, constraints)
4. End-to-end process flow (submission → approval → publication)
5. List configuration (moderation, versioning, views, content types)
6. Power Automate flow logic (trigger, actions, approval connector, email actions)
7. SharePoint Pages inventory (pages, web parts, embedded views)
8. Permissions and access model (lists, views, flows, approvals)
9. Operational runbook (how to approve/reject, archive, onboard/offboard HR approvers)
10. Data snapshot evidence (CSV archives)
11. Brand compliance mapping (guidelines → component)

## 4. Non-Functional Requirements

- No new development: this is a documentation project only.
- All documented components are Microsoft 365-native — no custom code, SPFx, or third-party services.
- Document must be usable as a standalone reference without access to the production environment.
- KT Document must be maintained in Markdown format for version control.
- Brand guidelines must be cited by document name and section where referenced.

## 5. Data Model Overview

| List | Internal Name | Key Custom Fields | Moderation |
|---|---|---|---|
| Praise | Recognition | Praise for, Core Value Demonstrated, Description, Manager, Status, Department, Icon, Comments, Likes | Enabled |
| Praise (Archive) | — | Same core fields as Praise | — |
| Praise Cards | — | Title, To, From, Icon, Description, Likes | — |

SharePoint site: `/sites/RuizNetPortal/`

## 6. Acceptance Summary

The KT Document is complete when all 11 sections defined in RF-10 have been authored, reviewed against the refdocs evidence, and committed to the repository. Brand compliance must be documented for all user-facing components referencing both brand guide PDFs.
