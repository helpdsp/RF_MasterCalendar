# User Stories — Engineering Web Portal KT Document

## US-01 — Functional Overview
**As a** new IT Administrator, **I want** a plain-language description of what the Engineering Hub does, **so that** I understand the business context before diving into technical details.
- [ ] Section 1 covers business value, user roles, high-level data flow
- [ ] Architecture diagram shows: User → PnP Search → Libraries → Managed Metadata → Content Types

## US-02 — Content Type Hierarchy
**As a** IT Administrator, **I want** the Ruiz Foods Taxonomy CT hierarchy documented, **so that** I know which CT to use for each document type.
- [ ] All 15 CTs listed with ID, parent, field count
- [ ] Inheritance hierarchy shown (Ruiz Foods Document → Engineering Document → 10 sub-types)

## US-03 — Site Column Reference
**As a** IT Administrator, **I want** every site column with internal name and type, **so that** I can configure search refiners and troubleshoot metadata.
- [ ] All custom columns documented: Area (`Area`), Facility (`Facility`), Legal Entity (`Legal_x0020_entity`), Classification (`Classification`), Supplier (`Supplier`), Engineering Folder (`Engineering_x0020_Folder`)
- [ ] TaxonomyFieldType columns linked to their term set

## US-04 — Library Inventory
**As a** IT Administrator, **I want** a table of all document libraries with key settings, **so that** I can assess the portal scope.
- [ ] All libraries listed: Agreements, Assets (CA1, CA4), Approved Projects (x4), CAD Blocks, all CEP libraries
- [ ] CEP naming convention `CEP YY-NNN Facility Description` documented

## US-05 — Agreements Library Detail
**As a** Procurement administrator, **I want** the Agreements library fully documented, **so that** I can manage vendor contracts without prior knowledge.
- [ ] All 6 views with CAML: All Vendors, All COI, All MNDA, All W9, All Visitor's Liability, All Documents
- [ ] Agreement Document fields documented including expiration tracking columns
- [ ] Classification MMD term values documented

## US-06 — PnP Search Configuration
**As a** IT Administrator, **I want** the PnP Modern Search V4 deployment documented, **so that** I can redeploy or troubleshoot it.
- [ ] App Catalog deployment steps documented
- [ ] Solution package name: `pnp-modern-search-parts-v4.sppkg`
- [ ] Search page URL and web part layout documented

## US-07 — Permissions Matrix
**As a** IT Administrator, **I want** a permissions matrix for all libraries, **so that** I can onboard/offboard users correctly.
- [ ] Libraries with unique permissions (CA1 Assets, CA4 Assets) flagged
- [ ] Steps to add/remove users documented

## US-08 — Create New CEP Library Runbook
**As a** IT Administrator, **I want** step-by-step instructions to create a new CEP library, **so that** new capital projects are onboarded consistently.
- [ ] Steps numbered and executable
- [ ] Naming convention enforced, content types assigned, standard views created

## US-09 — Manage Taxonomy Terms Runbook
**As a** IT Administrator, **I want** instructions to add/modify Ruiz Foods Taxonomy terms, **so that** I can keep metadata current.
- [ ] Steps to access Term Store, add terms to Area/Facility/Classification/Supplier

## US-10 — Quality Gate Verification
**As a** KT Document reviewer, **I want** all 10 quality gates verified, **so that** the document is complete.
- [ ] Zero TBD/TODO/placeholder instances
- [ ] All fields have internal names from JSON exports
- [ ] All CAML queries transcribed verbatim from library exports

## Brief aprobado (extracto)

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
| **New Employees / Contractors** | Onboarding | Access to approved

...(truncated — see full product PRD in refdocs or pass a larger file)...


## Tabla índice (stories ↔ RF)

| Story | RF | Título |
|-------|-----|--------|
| S-01 | RF-01 | Praise Submission |
| S-02 | RF-02 | HR Approval Workflow |
| S-03 | RF-03 | Published Praise Visibility |
| S-04 | RF-04 | Employee Self-Service Views |
| S-05 | RF-05 | Intranet Navigation |
| S-06 | RF-06 | Praise Cards Display |
| S-07 | RF-07 | Praise Archive |
| S-08 | RF-08 | Email Notifications |
| S-09 | RF-09 | Brand Compliance |
| S-10 | RF-10 | KT Document Coverage |

---

## RF-01 — Praise Submission

### S-01 — Praise Submission

- **Como** parte de los roles definidos en el PRD **quiero** el comportamiento descrito en **RF-01** **para** cumplir el requisito funcional.
- **RF:** RF-01
- **Criterios de aceptación (checklist):**
  - [ ] The system shall allow any employee to submit a praise for a peer via the intranet entry point.
  - [ ] The submission form shall collect: Praise for (employee), Core Value Demonstrated, Description, and Manager of the recognized employee.
  - [ ] Submissions shall be stored in the **Praise** SharePoint list (internal name: Recognition) on the `/sites/RuizNetPortal/` site.
  - [ ] The list shall enforce content moderation — submitted items are placed in Pending status until approved by HR.
- **Dependencias:** orden lógico respecto a otros RF (ver PRD); integraciones listadas en §8 si aplica.
- **Owner sugerido:** frontend, backend
- **Notas técnicas:** tablas Supabase, RLS, RPC y Edge Functions según PRD §7–8.

#### Extracto PRD (RF-01)

```text
- The system shall allow any employee to submit a praise for a peer via the intranet entry point.
- The submission form shall collect: Praise for (employee), Core Value Demonstrated, Description, and Manager of the recognized employee.
- Submissions shall be stored in the **Praise** SharePoint list (internal name: Recognition) on the `/sites/RuizNetPortal/` site.
- The list shall enforce content moderation — submitted items are placed in Pending status until approved by HR.
```

---

## RF-02 — HR Approval Workflow

### S-02 — HR Approval Workflow

- **Como** parte de los roles definidos en el PRD **quiero** el comportamiento descrito en **RF-02** **para** cumplir el requisito funcional.
- **RF:** RF-02
- **Criterios de aceptación (checklist):**
  - [ ] A Power Automate flow shall trigger on each new Praise list item.
  - [ ] The flow shall create an approval request in **Microsoft Teams Approvals App** and route it to HR Manager(s).
  - [ ] The approval card shall surface: praised employee, submitter, Core Value Demonstrated, description, and manager.
  - [ ] On **approval**: the list item moderation status shall be set to Approved; a Congratulations email shall be sent to the recognized employee.
  - [ ] On **rejection**: the list item shall remain in a rejected/moderated state; the submitter may be notified.
- **Dependencias:** orden lógico respecto a otros RF (ver PRD); integraciones listadas en §8 si aplica.
- **Owner sugerido:** frontend, backend
- **Notas técnicas:** tablas Supabase, RLS, RPC y Edge Functions según PRD §7–8.

#### Extracto PRD (RF-02)

```text
- A Power Automate flow shall trigger on each new Praise list item.
- The flow shall create an approval request in **Microsoft Teams Approvals App** and route it to HR Manager(s).
- The approval card shall surface: praised employee, submitter, Core Value Demonstrated, description, and manager.
- On **approval**: the list item moderation status shall be set to Approved; a Congratulations email shall be sent to the recognized employee.
- On **rejection**: the list item shall remain in a rejected/moderated state; the submitter may be notified.
```

---

## RF-03 — Published Praise Visibility

### S-03 — Published Praise Visibility

- **Como** parte de los roles definidos en el PRD **quiero** el comportamiento descrito en **RF-03** **para** cumplir el requisito funcional.
- **RF:** RF-03
- **Criterios de aceptación (checklist):**
  - [ ] Approved praises shall be visible on the **View Current Praises** SharePoint page.
  - [ ] The default list view ("All Items") shall filter to show only Approved items, ordered newest first.
  - [ ] The **Top 10 Recognitions** view shall display the 10 most recent approved praises in list format.
  - [ ] The **Top 10 Recognitions Cards** view shall display the 10 most recent approved praises in card format.
- **Dependencias:** orden lógico respecto a otros RF (ver PRD); integraciones listadas en §8 si aplica.
- **Owner sugerido:** frontend, backend
- **Notas técnicas:** tablas Supabase, RLS, RPC y Edge Functions según PRD §7–8.

#### Extracto PRD (RF-03)

```text
- Approved praises shall be visible on the **View Current Praises** SharePoint page.
- The default list view ("All Items") shall filter to show only Approved items, ordered newest first.
- The **Top 10 Recognitions** view shall display the 10 most recent approved praises in list format.
- The **Top 10 Recognitions Cards** view shall display the 10 most recent approved praises in card format.
```

---

## RF-04 — Employee Self-Service Views

### S-04 — Employee Self-Service Views

- **Como** parte de los roles definidos en el PRD **quiero** el comportamiento descrito en **RF-04** **para** cumplir el requisito funcional.
- **RF:** RF-04
- **Criterios de aceptación (checklist):**
  - [ ] The **My submissions** view shall allow the submitting employee to see their own submissions grouped by moderation status.
  - [ ] The **View Submitted Praises** SharePoint page shall surface this self-service view.
- **Dependencias:** orden lógico respecto a otros RF (ver PRD); integraciones listadas en §8 si aplica.
- **Owner sugerido:** frontend, backend
- **Notas técnicas:** tablas Supabase, RLS, RPC y Edge Functions según PRD §7–8.

#### Extracto PRD (RF-04)

```text
- The **My submissions** view shall allow the submitting employee to see their own submissions grouped by moderation status.
- The **View Submitted Praises** SharePoint page shall surface this self-service view.
```

---

## RF-05 — Intranet Navigation

### S-05 — Intranet Navigation

- **Como** parte de los roles definidos en el PRD **quiero** el comportamiento descrito en **RF-05** **para** cumplir el requisito funcional.
- **RF:** RF-05
- **Criterios de aceptación (checklist):**
  - [ ] The **Intranet Landing Page** shall provide links to both "Submit a Praise" and "View Praises" entry points.
  - [ ] Navigation shall require no special permissions for read access to approved praises.
- **Dependencias:** orden lógico respecto a otros RF (ver PRD); integraciones listadas en §8 si aplica.
- **Owner sugerido:** frontend, backend
- **Notas técnicas:** tablas Supabase, RLS, RPC y Edge Functions según PRD §7–8.

#### Extracto PRD (RF-05)

```text
- The **Intranet Landing Page** shall provide links to both "Submit a Praise" and "View Praises" entry points.
- Navigation shall require no special permissions for read access to approved praises.
```

---

## RF-06 — Praise Cards Display

### S-06 — Praise Cards Display

- **Como** parte de los roles definidos en el PRD **quiero** el comportamiento descrito en **RF-06** **para** cumplir el requisito funcional.
- **RF:** RF-06
- **Criterios de aceptación (checklist):**
  - [ ] The **Praise Cards** SharePoint list shall serve as the display-optimized companion list for card-layout rendering.
  - [ ] Praise Cards fields: Title (Required), To (User, Required), From (User, Required), Icon (Text), Description (Note), Likes (UserMulti).
- **Dependencias:** orden lógico respecto a otros RF (ver PRD); integraciones listadas en §8 si aplica.
- **Owner sugerido:** frontend, backend
- **Notas técnicas:** tablas Supabase, RLS, RPC y Edge Functions según PRD §7–8.

#### Extracto PRD (RF-06)

```text
- The **Praise Cards** SharePoint list shall serve as the display-optimized companion list for card-layout rendering.
- Praise Cards fields: Title (Required), To (User, Required), From (User, Required), Icon (Text), Description (Note), Likes (UserMulti).
```

---

## RF-07 — Praise Archive

### S-07 — Praise Archive

- **Como** parte de los roles definidos en el PRD **quiero** el comportamiento descrito en **RF-07** **para** cumplir el requisito funcional.
- **RF:** RF-07
- **Criterios de aceptación (checklist):**
  - [ ] The **Praise (Archive)** SharePoint list shall store historical praises migrated from the active Praise list.
  - [ ] The Archive list shall maintain the same core field structure as the active list.
- **Dependencias:** orden lógico respecto a otros RF (ver PRD); integraciones listadas en §8 si aplica.
- **Owner sugerido:** frontend, backend
- **Notas técnicas:** tablas Supabase, RLS, RPC y Edge Functions según PRD §7–8.

#### Extracto PRD (RF-07)

```text
- The **Praise (Archive)** SharePoint list shall store historical praises migrated from the active Praise list.
- The Archive list shall maintain the same core field structure as the active list.
```

---

## RF-08 — Email Notifications

### S-08 — Email Notifications

- **Como** parte de los roles definidos en el PRD **quiero** el comportamiento descrito en **RF-08** **para** cumplir el requisito funcional.
- **RF:** RF-08
- **Criterios de aceptación (checklist):**
  - [ ] A **Praise Alert Email** shall notify relevant parties of a new praise pending approval.
  - [ ] A **Congratulations Email** shall be sent to the recognized employee upon HR approval.
  - [ ] Both email templates shall comply with Ruiz Foods / El Monterey brand guidelines (colors, typography, logo, tone of voice).
- **Dependencias:** orden lógico respecto a otros RF (ver PRD); integraciones listadas en §8 si aplica.
- **Owner sugerido:** backend, frontend
- **Notas técnicas:** tablas Supabase, RLS, RPC y Edge Functions según PRD §7–8.

#### Extracto PRD (RF-08)

```text
- A **Praise Alert Email** shall notify relevant parties of a new praise pending approval.
- A **Congratulations Email** shall be sent to the recognized employee upon HR approval.
- Both email templates shall comply with Ruiz Foods / El Monterey brand guidelines (colors, typography, logo, tone of voice).
```

---

## RF-09 — Brand Compliance

### S-09 — Brand Compliance

- **Como** parte de los roles definidos en el PRD **quiero** el comportamiento descrito en **RF-09** **para** cumplir el requisito funcional.
- **RF:** RF-09
- **Criterios de aceptación (checklist):**
  - [ ] All user-facing components (SharePoint pages, email templates, form copy) shall comply with:
  - [ ] Ruiz Foods corporate color palette (Learning Color Brand Guide)
  - [ ] El Monterey brand guidelines (logo usage, typography, tone of voice, icon style)
  - [ ] The `Icon` field on Praise and Praise Cards lists stores brand-compliant icon identifiers.
- **Dependencias:** orden lógico respecto a otros RF (ver PRD); integraciones listadas en §8 si aplica.
- **Owner sugerido:** frontend, backend
- **Notas técnicas:** tablas Supabase, RLS, RPC y Edge Functions según PRD §7–8.

#### Extracto PRD (RF-09)

```text
- All user-facing components (SharePoint pages, email templates, form copy) shall comply with:
  - Ruiz Foods corporate color palette (Learning Color Brand Guide)
  - El Monterey brand guidelines (logo usage, typography, tone of voice, icon style)
- The `Icon` field on Praise and Praise Cards lists stores brand-compliant icon identifiers.
```

---

## RF-10 — KT Document Coverage

### S-10 — KT Document Coverage

- **Como** parte de los roles definidos en el PRD **quiero** el comportamiento descrito en **RF-10** **para** cumplir el requisito funcional.
- **RF:** RF-10
- **Criterios de aceptación (checklist):**
  - [ ] Criterios verificables según el texto completo de **RF-10** en el PRD.
- **Dependencias:** orden lógico respecto a otros RF (ver PRD); integraciones listadas en §8 si aplica.
- **Owner sugerido:** frontend, backend
- **Notas técnicas:** tablas Supabase, RLS, RPC y Edge Functions según PRD §7–8.

#### Extracto PRD (RF-10)

```text
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
```

---
