# Sprint 1 — Tasks

| Task | Sección KT Document | Story | Owner | Status |
|---|---|---|---|---|
| T-01 | Functional Overview | S-01 | technical-writer | done |
| T-02 | Architecture & Components | S-02 | technical-writer | done |
| T-03 | Data Model | S-03 | technical-writer | done |
| T-04 | Process Flow | S-04 | technical-writer | done |
| T-05 | List Configuration & Views | S-05 | technical-writer | done |
| T-06 | Power Automate Flow | S-06 | technical-writer | done |
| T-07 | SharePoint Pages | S-07 | technical-writer | done |
| T-08 | Permissions & Access | S-08 | technical-writer | done |
| T-09 | Operational Runbook | S-09 | technical-writer | done |
| T-10 | Data Snapshot Evidence | S-10 | technical-writer | done |
| T-11 | Brand Compliance | S-11 | technical-writer | done |

---

## T-01 — Functional Overview

**RF:** RF-01, RF-03, RF-04, RF-05
**Output:** Sección 1 de `docs/KT-Praise-Program.md`

Checklist:
- [ ] Propósito del Praise Program y valor para Ruiz Foods
- [ ] 4 roles documentados: Employee (submitter), Employee (recognized), HR Manager, IT Admin
- [ ] Flujo de alto nivel en lenguaje simple (submit → approve → publish)
- [ ] Entry points del intranet descritos (Landing Page links)
- [ ] Resumen para IT Leadership sin jargon técnico
- [ ] Evidencia: mockup Intranet Landing Page.jpg

---

## T-02 — Architecture & Components

**RF:** RF-01, RF-02, RF-06, RF-07
**Output:** Sección 2 de `docs/KT-Praise-Program.md`

Checklist:
- [ ] Tabla de 11 componentes con tipo, plataforma y URL/ubicación
- [ ] Diagrama de arquitectura (texto) mostrando flujo de datos
- [ ] URL del sitio SharePoint documentado (`/sites/RuizNetPortal/`)
- [ ] Entorno y nombre del flujo de Power Automate documentados
- [ ] Confirmado: no hay código personalizado ni dependencias de terceros
- [ ] Evidencia: Praise-Properties.json, technical-spec.md

---

## T-03 — Data Model

**RF:** RF-01, RF-06, RF-07
**Output:** Sección 3 de `docs/KT-Praise-Program.md`

Checklist:
- [ ] Lista Praise: todos los campos custom con Display Title, Internal Name, Type, Required
- [ ] Lista Praise Cards: todos los campos custom documentados
- [ ] Lista Praise (Archive): estructura documentada en relación a Praise
- [ ] Campos de sistema clave documentados (ID, Author, Created, _ModerationStatus)
- [ ] State machine de content moderation explicado (Pending → Approved/Rejected con valores 0/1/2)
- [ ] Archivos XML de schema referenciados como fuente autoritativa
- [ ] Evidencia: Praise-Fields.json, Praise Cards-Fields.json, Praise-Schema.xml, Praise.csv

---

## T-04 — Process Flow

**RF:** RF-01, RF-02, RF-03, RF-08
**Output:** Sección 4 de `docs/KT-Praise-Program.md`

Checklist:
- [ ] Flujo step-by-step: submit → trigger PA → Teams approval → branch → moderation update → email → publicación
- [ ] Cada paso identifica al actor (Employee, HR Manager, Power Automate, SharePoint)
- [ ] Ruta de aprobación documentada
- [ ] Ruta de rechazo documentada
- [ ] Condición de email Congratulations indicada (solo en aprobación)
- [ ] Mockups referenciados como evidencia de cada paso

---

## T-05 — List Configuration & Views

**RF:** RF-03, RF-04, RF-07
**Output:** Sección 5 de `docs/KT-Praise-Program.md`

Checklist:
- [ ] Settings de lista Praise: content moderation ON, versioning ON, content types ON, Quick Launch hidden
- [ ] Las 7 vistas documentadas: título, URL, default flag, lógica de filtro CAML, row limit
- [ ] Vista "Approve/reject Items" y su rol para HR documentado
- [ ] Vista "My submissions" filtro (Author = [Me]) documentado
- [ ] Vista Top 10 row limit (10) confirmado
- [ ] Vista oculta "Welcome to the Praise Form!" documentada
- [ ] Settings de Praise Archive documentados
- [ ] Evidencia: Praise-Views.json, Praise-Properties.json

---

## T-06 — Power Automate Flow

**RF:** RF-02, RF-08
**Output:** Sección 6 de `docs/KT-Praise-Program.md`

Checklist:
- [ ] Trigger documentado: SharePoint — When item is created, en lista Praise
- [ ] Todas las acciones del flujo documentadas en orden con nombres de connector
- [ ] Paso de aprobación: quién lo recibe, qué campos se muestran en la tarjeta
- [ ] Branch de condición: ruta Aprobado y ruta Rechazado ambas documentadas
- [ ] Acción de actualización de moderation status documentada (valores _ModerationStatus)
- [ ] Acción de email Congratulations documentada (destinatario, condición)
- [ ] Ubicación del flujo en Power Automate documentada
- [ ] Evidencia: Power Automate PDF, mockup Teams Approvals App

---

## T-07 — SharePoint Pages

**RF:** RF-03, RF-04, RF-05
**Output:** Sección 7 de `docs/KT-Praise-Program.md`

Checklist:
- [ ] 3 páginas documentadas: Intranet Landing, View Current Praises, View Submitted Praises
- [ ] Cada página: URL, propósito, web parts o vistas de lista embebidas
- [ ] Links de Intranet Landing Page (Submit y View) documentados
- [ ] Vista embebida en View Current Praises documentada
- [ ] Vista "My submissions" embebida en View Submitted Praises documentada
- [ ] Evidencia: mockups de las 3 páginas SharePoint (3 imágenes .jpg)

---

## T-08 — Permissions & Access

**RF:** RF-01, RF-02
**Output:** Sección 8 de `docs/KT-Praise-Program.md`

Checklist:
- [ ] Permisos de lista SharePoint por rol (Employee, HR Manager, IT Admin)
- [ ] Requerimiento de permiso "Approve Items" para HR documentado
- [ ] Cómo content moderation restringe la vista de no-HR documentado
- [ ] Ownership y sharing del flujo de Power Automate documentado
- [ ] Cómo agregar o remover un HR approver del flujo documentado
- [ ] Cómo HR Managers reciben aprobaciones en Teams documentado

---

## T-09 — Operational Runbook

**RF:** RF-02, RF-07
**Output:** Sección 9 de `docs/KT-Praise-Program.md`

Checklist:
- [ ] Cómo aprobar un praise en Teams Approvals App (paso a paso)
- [ ] Cómo rechazar un praise en Teams Approvals App (paso a paso)
- [ ] Cómo ver praises pendientes en la lista SharePoint (vista Approve/reject Items)
- [ ] Cómo archivar praises antiguos (proceso manual a Archive list)
- [ ] Cómo agregar un nuevo valor al campo Core Value Demonstrated
- [ ] Cómo agregar/remover un HR approver en el flujo de Power Automate
- [ ] Cómo revisar el historial de ejecuciones del flujo (fallas)
- [ ] Cómo actualizar contenido de páginas SharePoint

---

## T-10 — Data Snapshot Evidence

**RF:** RF-10
**Output:** Sección 10 de `docs/KT-Praise-Program.md`

Checklist:
- [ ] Praise.csv: headers de columnas documentados
- [ ] Praise(Archive).csv referenciado y descrito
- [ ] Item count (9 items en Praise list al momento del export) indicado
- [ ] Valores del campo Category (Core Values) listados desde los datos
- [ ] Valores numéricos de _ModerationStatus confirmados desde datos (0, 1, 2)
- [ ] Rango de fechas de ambos archivos indicado

---

## T-11 — Brand Compliance

**RF:** RF-09
**Output:** Sección 11 de `docs/KT-Praise-Program.md`

Checklist:
- [ ] Ambos PDFs de brand guidelines citados por nombre
- [ ] Color palette → componentes que usan colores de marca documentados (pages, emails)
- [ ] Typography → uso de fuentes por componente documentado (pages, emails)
- [ ] Logo/icon → placement en páginas intranet documentado; rol del campo Icon documentado
- [ ] Tone of voice → componentes con copy de marca documentados (form, emails)
- [ ] Tabla de mapeo: dimensión de marca → componente afectado → documento de referencia
