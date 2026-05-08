# Epics — Engineering Web Portal KT Document

## EP-01 — Functional Overview & Architecture
Document the business purpose, user roles, and M365 component inventory of the Engineering Hub portal. Produce a text-based architecture diagram showing the relationship between PnP Modern Search, SharePoint libraries, Managed Metadata, and the content type hierarchy.

## EP-02 — Content Type & Metadata Model
Document the full Ruiz Foods Taxonomy content type hierarchy (15 CTs in the group), all site columns (Facility, Area, Classification, Engineering Folder, Supplier, Legal Entity, etc.) with internal names and types, and the Ruiz Foods Taxonomy term group structure.

## EP-03 — Document Library Inventory
Document every document library on the site: Agreements, CA1/CA4 Assets, Approved Projects (x4 facilities), CAD Blocks, and all 100+ CEP project libraries. For each library: URL, content types, versioning settings, unique permissions flag, item count, and key views with CAML queries.

## EP-04 — Agreements Library (Contract Tracking)
Document the Agreements library in full detail: the Agreement Document content type fields, expiration tracking via `Expiration_x0020_Date` and `Days_x0020_Left_x0020_on_x0020_Contract` calculated column, all 6 views with their CAML filters, and the vendor folder structure.

## EP-05 — PnP Modern Search V4 Configuration
Document the PnP Modern Search Web Parts V4 deployment: solution package details, search page layout, web part connections, and how the Managed Metadata columns drive faceted filtering.

## EP-06 — Permissions & Access Control
Document site-level and library-level permissions. Special focus on Assets libraries (CA1, CA4) with `HasUniqueRoleAssignments = true`. Document the inheritance model and how to add/remove users.

## EP-07 — Operational Runbook
Step-by-step admin instructions for: creating a new CEP library, managing taxonomy terms, deploying PnP Modern Search updates, troubleshooting search indexing.

## EP-08 — KT Quality Gates & Verification
Verify all 10 quality gates from the KT master prompt: no placeholders, all internal names, all CAML queries, permissions matrix complete, operational runbook executable.

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


## Mapa epic ↔ RF

| Epic | RF incluidos |
|------|----------------|
| E-01 | RF-01, RF-02, RF-03, RF-04 |
| E-02 | RF-05, RF-06, RF-07, RF-08 |
| E-03 | RF-09, RF-10 |

---

## E-01 — Praise Submission · HR Approval Workflow · Published Praise Visibility · Employee Self-…

| Campo | Contenido |
|-------|-----------|
| **Objetivo de negocio** | Entregar los requisitos: RF-01, RF-02, RF-03, RF-04. |
| **Alcance (RF)** | RF-01, RF-02, RF-03, RF-04 |
| **Fuera de alcance explícito** | Alineado con PRD §12 (MVP vs fase 2). |
| **Dependencias** | — |
| **Riesgos** | Revisar dependencias técnicas entre RF del bloque. |
| **Criterio de “done” del epic** | Stories S-XX asociadas aceptadas en QA. |

---

## E-02 — Intranet Navigation · Praise Cards Display · Praise Archive · Email Notifications

| Campo | Contenido |
|-------|-----------|
| **Objetivo de negocio** | Entregar los requisitos: RF-05, RF-06, RF-07, RF-08. |
| **Alcance (RF)** | RF-05, RF-06, RF-07, RF-08 |
| **Fuera de alcance explícito** | Alineado con PRD §12 (MVP vs fase 2). |
| **Dependencias** | E-01 u otras épicas previas |
| **Riesgos** | Revisar dependencias técnicas entre RF del bloque. |
| **Criterio de “done” del epic** | Stories S-XX asociadas aceptadas en QA. |

---

## E-03 — Brand Compliance · KT Document Coverage

| Campo | Contenido |
|-------|-----------|
| **Objetivo de negocio** | Entregar los requisitos: RF-09, RF-10. |
| **Alcance (RF)** | RF-09, RF-10 |
| **Fuera de alcance explícito** | Alineado con PRD §12 (MVP vs fase 2). |
| **Dependencias** | E-02 u otras épicas previas |
| **Riesgos** | Revisar dependencias técnicas entre RF del bloque. |
| **Criterio de “done” del epic** | Stories S-XX asociadas aceptadas en QA. |

---
