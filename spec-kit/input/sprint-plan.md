# Sprint Plan — Engineering Web Portal KT Document

## Sprint 1 — Complete KT Document (Single Sprint)

**Goal:** Produce `docs/KT-EngineeringWebPortal.md` covering all 11 sections of the KT master prompt, verified against all 10 quality gates.

**Stories in sprint:** US-01 through US-10
**Deliverable:** `docs/KT-EngineeringWebPortal.md`

| # | Task | Story | Status |
|---|---|---|---|
| T-01 | Section 1: Functional Overview + architecture diagram | US-01 | todo |
| T-02 | Section 2: Architecture & Components table | US-01 | todo |
| T-03 | Section 3: Data Model — CT hierarchy | US-02 | todo |
| T-04 | Section 3: Data Model — site columns table | US-03 | todo |
| T-05 | Section 3: Data Model — library inventory table | US-04 | todo |
| T-06 | Section 3: Data Model — Agreements library fields | US-05 | todo |
| T-07 | Section 4: Process Flow — document upload/tagging workflow | US-03 | todo |
| T-08 | Section 5: Config Reference — Agreements views with CAML | US-05 | todo |
| T-09 | Section 5: Config Reference — CEP library standard config | US-04 | todo |
| T-10 | Section 5: Config Reference — Assets libraries & permissions | US-07 | todo |
| T-11 | Section 6: PnP Modern Search V4 deployment | US-06 | todo |
| T-12 | Section 7: Interface Documentation — search page & web parts | US-06 | todo |
| T-13 | Section 8: Permissions & Access matrix | US-07 | todo |
| T-14 | Section 9: Runbook — create CEP library | US-08 | todo |
| T-15 | Section 9: Runbook — manage taxonomy terms | US-09 | todo |
| T-16 | Section 10: Data Snapshot Evidence | US-04 | todo |
| T-17 | Section 11: Brand Compliance (gap noted — PDFs not machine-readable) | US-01 | todo |
| T-18 | Quality gate verification — all 10 gates | US-10 | todo |

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


| Sprint | Goal (sugerido) | RF / stories cubiertas | Dependencias |
|--------|-----------------|---------------------------|--------------|

| 1 | Fundación y primeros RF | RF-01, RF-02, RF-03 (S-01, S-02, S-03) | — |
| 2 | Incremento funcional (RF-04…) | RF-04, RF-05, RF-06 (S-04, S-05, S-06) | Sprint 1 |
| 3 | Incremento funcional (RF-07…) | RF-07, RF-08, RF-09 (S-07, S-08, S-09) | Sprint 2 |
| 4 | Cierre MVP / integración | RF-10 (S-10) | Sprint 3 |

---

**Total RF en plan:** 10 · **Sprints:** 4
