# Epics — Ruiz Foods Master Calendar KT Document

## EP-01 — Solution Architecture & Data Model

| Campo | Contenido |
|---|---|
| **Objetivo de negocio** | Document the full technical architecture so the new admin understands every component without system access |
| **Alcance** | KT Sections 2 (Architecture & Components), 3 (Data Model), 5 (Configuration Reference) |
| **Fuera de alcance** | Building new features; modifying existing architecture |
| **Dependencias** | Master Calendar-ListSettings.json, Master Calendar Sync-ListSettings.json, Schema XML exports |
| **Riesgos** | Large JSON exports — field tables must be derived from raw data, not fabricated |
| **Criterio de done** | Both lists fully documented with internal field names, all views with CAML, list settings table, list IDs confirmed from exports |

## EP-02 — Automation & Integration Documentation

| Campo | Contenido |
|---|---|
| **Objetivo de negocio** | Document all four Power Automate flows step-by-step so the admin can maintain, reactivate, and troubleshoot them |
| **Alcance** | KT Section 6 (Automation / Integration) — all 4 flows, Microsoft Forms, Outlook sync link |
| **Fuera de alcance** | Rebuilding flows; changing trigger frequency |
| **Dependencias** | All four flow definition.json exports; Subscribe flow email HTML; Forms form ID |
| **Riesgos** | Three flows are currently suspended — suspension status must be prominently documented; reactivation steps must be tested-procedure-quality |
| **Criterio de done** | Each flow documented: display name, flow ID, trigger, every action in order with connector/operation, field mappings, suspension status, reactivation steps |

## EP-03 — User Journey & Interface Documentation

| Campo | Contenido |
|---|---|
| **Objetivo de negocio** | Document every user-facing interface and the end-to-end employee subscription journey with mockup evidence |
| **Alcance** | KT Sections 1 (Functional Overview), 4 (Process Flow), 7 (Interface Documentation), 10 (Data Snapshot) |
| **Fuera de alcance** | Redesigning the UI; modifying the SharePoint page |
| **Dependencias** | All 8 mockup screenshots; Microsoft Forms form definition; Outlook sync link |
| **Riesgos** | Mockup filenames contain typos ("Siscribed", "Suscribe") — document exactly as-is in production |
| **Criterio de done** | Every mockup cited in the appropriate section; end-to-end subscription flow documented step-by-step with actor per step; all interface URLs confirmed from list settings exports |

## EP-04 — Operations, Permissions & Brand Compliance

| Campo | Contenido |
|---|---|
| **Objetivo de negocio** | Equip the new admin with executable runbooks for all routine tasks and document who can do what |
| **Alcance** | KT Sections 8 (Permissions & Access), 9 (Operational Runbook), 11 (Brand Compliance) |
| **Fuera de alcance** | Implementing new permission models; creating new brand assets |
| **Dependencias** | HasUniqueRoleAssignments=true on both lists; service account `0365-PA-FLOWSVCG@ruizfoods.com`; Subscribe flow email HTML for brand mapping |
| **Riesgos** | Permission details not fully exported — admin must verify SharePoint group membership live; annual year update is manual and undocumented |
| **Criterio de done** | Permission matrix per list per role; runbook covers: add event, edit event, delete event, reactivate suspended flow, update annual year references, troubleshoot Outlook sync, add department coordinator |
