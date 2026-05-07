# Epics — Ruiz Foods Praise Program (KT Document)

## Epic Map

| Epic | KT Document Sections | Stories |
|---|---|---|
| E-01 | Functional Overview, Architecture, Data Model, Process Flow | S-01, S-02, S-03, S-04 |
| E-02 | List Config, Power Automate, SharePoint Pages, Permissions | S-05, S-06, S-07, S-08 |
| E-03 | Operational Runbook, Data Snapshot, Brand Compliance | S-09, S-10, S-11 |

---

## E-01 — System Understanding (Functional + Architecture + Data)

| Campo | Contenido |
|---|---|
| **Objetivo** | Document what the Praise Program does, who uses it, how it is architected, and how data is structured — giving both IT Leadership and a new IT Admin a complete functional and technical foundation. |
| **Alcance (RF)** | RF-01 (Submission), RF-02 (Approval Workflow), RF-03 (Visibility), RF-06 (Praise Cards) |
| **Stories** | S-01 (Functional Overview), S-02 (Architecture & Components), S-03 (Data Model), S-04 (Process Flow) |
| **Dependencias** | None — first epic to complete |
| **Criterio de "done"** | All four KT sections authored, reviewed against refdocs, no gaps in component or field inventory |

---

## E-02 — Configuration & Integration Reference

| Campo | Contenido |
|---|---|
| **Objetivo** | Provide the complete configuration reference that an IT Admin needs to maintain, reconfigure, or reconstruct every component of the solution. |
| **Alcance (RF)** | RF-04 (Self-Service Views), RF-05 (Navigation), RF-07 (Archive), RF-08 (Emails) |
| **Stories** | S-05 (List Configuration & Views), S-06 (Power Automate Flow), S-07 (SharePoint Pages), S-08 (Permissions & Access) |
| **Dependencias** | E-01 complete (architecture and data model must be documented first) |
| **Criterio de "done"** | Configuration reference covers all lists, views, flow steps, pages, and permission levels with no missing details |

---

## E-03 — Operations, Evidence & Brand Compliance

| Campo | Contenido |
|---|---|
| **Objetivo** | Provide the operational runbook for day-to-day administration, validate the documentation against production data evidence, and map all brand guidelines to the components that use them. |
| **Alcance (RF)** | RF-09 (Brand Compliance), RF-10 (KT Document Coverage) |
| **Stories** | S-09 (Operational Runbook), S-10 (Data Snapshot Evidence), S-11 (Brand Compliance) |
| **Dependencias** | E-01 and E-02 complete |
| **Criterio de "done"** | Runbook covers all admin tasks; CSV data is referenced; both brand guide PDFs are cited and mapped to components |
