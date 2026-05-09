# Ruiz Foods — Engineering Web Portal KT Document

This repository contains the **Knowledge Transfer (KT) document** for the Ruiz Foods Engineering Hub SharePoint Online portal (`https://ruizfoods.sharepoint.com/sites/eng-hub`), generated using the **VISION Framework** — a structured AI-assisted documentation workflow.

---

## Project Overview

The Engineering Hub is a SharePoint Online Communication Site that serves as the central document management and search hub for Ruiz Foods Engineering across four manufacturing facilities:

| Facility | Location |
|---|---|
| CA1 | Dinuba, CA |
| CA4 | Vernon MFG, CA |
| SC1 | Florence, SC |
| TX1 | Denison, TX |

The portal houses 100+ Capital Engineering Project (CEP) document libraries, facility-level Asset libraries (18,000+ items in CA1), a vendor Agreements library (778 items), Approved Projects libraries, and a shared CAD Blocks library — all discoverable through a unified **PnP Modern Search Web Parts V4** faceted search experience.

---

## Deliverables

| File | Description |
|---|---|
| [`docs/KT-EngineeringWebPortal.md`](docs/KT-EngineeringWebPortal.md) | Full 11-section KT document (Markdown source) |
| [`docs/KT-EngineeringWebPortal.docx`](docs/KT-EngineeringWebPortal.docx) | Branded Word document ready to share with IT Leadership |

### KT Document Sections

1. Functional Overview — business value, user roles, high-level flow
2. Architecture & Components — M365 inventory, architecture diagram
3. Data Model — 15 content types, site columns with internal names, library inventory
4. Process Flow — document upload/tagging and faceted search discovery
5. Configuration Reference — Agreements library CAML views, Assets config, CEP standard config
6. Automation / Integration — PnP Modern Search V4 deployment reference
7. Interface Documentation — search page, web parts, library URLs
8. Permissions & Access — site groups, unique permissions, add/remove user steps
9. Operational Runbook — create CEP library, manage taxonomy terms, troubleshoot PnP Search
10. Data Snapshot Evidence — item counts per library, export date
11. Brand Compliance — gap analysis (brand PDFs not machine-readable)

---

## How the VISION Framework Generated This Document

**VISION** is a local-first AI workflow that turns a product brief into fully-implemented deliverables through a structured pipeline:

```
init → generate_brief → generate_spec_kit → generate_sprints → start_sprint
```

### What each stage produced for this project

| Stage | Output |
|---|---|
| `init` | Initialized project structure; linked `refdocs/` (SharePoint JSON/XML exports) as source of truth |
| `generate_brief` | `spec-kit/input/brief.md` — Executive summary, goals, 6 user roles, functional requirements, open questions |
| `generate_spec_kit` | Epics (EP-01 through EP-08), user stories (US-01 through US-10), sprint plan (18 tasks), PRD, technical spec |
| `generate_sprints` | Single-sprint plan with 20 tasks mapped to the 11 KT document sections |
| `start_sprint --sprint 1` | Implemented all 20 tasks, producing `docs/KT-EngineeringWebPortal.md` |

### How source data was captured

Before running the VISION workflow, SharePoint data was exported using PnP PowerShell scripts in `source-code/`:

```powershell
# Export all document library schemas and settings
.\source-code\Export-Library.ps1 -SiteUrl "https://ruizfoods.sharepoint.com/sites/eng-hub"

# Export all term sets and terms (Ruiz Foods Taxonomy)
.\source-code\Export-AllTermSets.ps1 -SiteUrl "https://ruizfoods.sharepoint.com/sites/eng-hub" -TermGroupName "Ruiz Foods Taxonomy"

# Export content type definitions
.\source-code\Export-ContentTypes.ps1 -SiteUrl "https://ruizfoods.sharepoint.com/sites/eng-hub"
```

All exports land in `refdocs/` and were used as the factual basis for the KT document — no data was fabricated.

### How to regenerate the Word document

After updating `docs/KT-EngineeringWebPortal.md`, rebuild the `.docx` with:

```bash
py scripts/build-docx.py
```

Requires: [pandoc](https://pandoc.org/) and `python-docx` (`py -m pip install python-docx`).

---

## Repository Structure

```
refdocs/                        ← SharePoint JSON/XML exports (source of truth)
source-code/                    ← PnP PowerShell export scripts
  Export-Library.ps1
  Export-ContentTypes.ps1
  Export-AllTermSets.ps1
  Export-AllLists.ps1
docs/
  KT-EngineeringWebPortal.md   ← KT document (Markdown)
  KT-EngineeringWebPortal.docx ← KT document (Word, branded)
scripts/
  build-docx.py                ← Markdown → branded Word converter
spec-kit/input/                ← VISION-generated spec artifacts
  brief.md                     ← Project brief
  epics.md                     ← Epics
  stories.md                   ← User stories
  sprint-plan.md               ← Sprint plan
planning/
  workflow-state.json          ← VISION workflow state
  sprints/sprint-01/           ← Sprint tasks and QA plan
prompts/
  kt-master-prompt.md          ← Master prompt used to drive KT generation
  kt-to-word-prompt.md         ← Prompt used to drive Word conversion
```

---

## VISION Framework — Technical Reference

VISION is a local-first workflow template for running the full AI-assisted delivery cycle (brief → spec → sprints → execution) without depending on an external service.

Built on:
- **Spec Kit** — [github/spec-kit](https://github.com/github/spec-kit): specification templates
- **Agency Agents** — [msitarzewski/agency-agents](https://github.com/msitarzewski/agency-agents): specialist agent roles

### Commands

All commands are issued to the AI agent in the IDE chat window:

```
init                         Initialize project
generate_brief               Generate project brief from refdocs
generate_spec_kit            Generate PRD, epics, stories, sprint plan
generate_sprints             Create sprint folders and task lists
start_sprint --sprint N      Implement sprint N
continue_sprint              Resume an in-progress sprint
next_step                    Show what to do next
reset_project                Delete all generated artifacts (keeps refdocs)
```

### IDE setup

```bash
npm install
npm run setup:ide    # generates .claude/, .cursor/, .github/copilot-instructions.md
```

### Status

```bash
npm run status         # terminal status report
npm run status:web     # local dashboard → http://127.0.0.1:4173
```

### Agent roles

| Area | Role |
|---|---|
| Backend | `engineering-backend-architect` |
| QA | `testing-reality-checker` |
| Deploy | `engineering-devops-automator` |
| PM | `project-management-senior-project-manager` |

Full command reference: [`AGENTS.md`](AGENTS.md)
