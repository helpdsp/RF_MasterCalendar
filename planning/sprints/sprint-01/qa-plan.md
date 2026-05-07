# Sprint 1 — QA Plan

## Objetivo

Verificar que el KT Document (`docs/KT-Praise-Program.md`) es completo, exacto y usable por sus dos audiencias objetivo.

## Tipo de revisión

Revisión documental — cada sección se valida contra los refdocs de evidencia.

## Dimensiones de revisión

| Dimensión | Criterio |
|---|---|
| **Completitud** | Las 11 secciones existen con contenido sustantivo |
| **Exactitud** | El contenido coincide con los refdocs (schemas, CSVs, mockups, PDFs) |
| **Usabilidad** | Un nuevo IT Admin puede ejecutar las tareas del Runbook sin ayuda adicional |
| **Brand accuracy** | Los brand guidelines están citados correctamente para los componentes correctos |

## Gate de calidad por tarea

| Task | Evidencia requerida | Validación |
|---|---|---|
| T-01 Functional Overview | mockup: Intranet Landing Page.jpg | Reviewer confirma que IT Leadership entiende sin acceso al sistema |
| T-02 Architecture | Praise-Properties.json, technical-spec.md | 11 componentes presentes en tabla |
| T-03 Data Model | Praise-Fields.json, Praise Cards-Fields.json | Todos los campos custom con Internal Name correcto |
| T-04 Process Flow | Power Automate PDF, mockups Teams/Outlook | Ambas ramas (aprobación/rechazo) documentadas |
| T-05 List Config | Praise-Views.json, Praise-Properties.json | 7 vistas, EnableModeration: true confirmado |
| T-06 PA Flow | Power Automate PDF | Trigger + todas las acciones en orden |
| T-07 Pages | 3 mockups SharePoint pages | URL y web parts de las 3 páginas |
| T-08 Permissions | Praise-Properties.json, technical-spec.md | Matriz completa por rol |
| T-09 Runbook | mockups Teams Approvals | Cada tarea tiene steps numerados ejecutables |
| T-10 Data Snapshot | Praise.csv, Praise(Archive).csv | Column headers y valores de Category listados |
| T-11 Brand Compliance | Ambos PDFs de brand guidelines | Tabla de mapeo dimensión → componente → PDF |

## Sign-off

- [ ] Todos los checklists de T-01 a T-11 completados
- [ ] Cero texto TBD o placeholder en el documento
- [ ] IT Admin reviewer confirma que el Runbook es ejecutable
- [ ] IT Leadership reviewer confirma que el overview es comprensible
- [ ] Brand compliance citada para los dos PDFs
