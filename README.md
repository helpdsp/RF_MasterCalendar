# Ruiz Foods — Master Calendar KT Document

This repository contains the **Knowledge Transfer (KT) document** for the Ruiz Foods Master Calendar — a SharePoint Online solution that publishes all company-wide events for the year and lets employees subscribe to sync those events directly into Microsoft Outlook.

The KT document is generated using the **VISION Framework** — a structured AI-assisted documentation workflow.

---

## Project Overview

The Master Calendar is a company-wide event hub hosted on the Ruiz Foods Corporate Intranet (`https://ruizfoods.sharepoint.com/sites/RuizNetPortal`). It was originally requested by Jesse Sowell as an Op Co Calendar and later expanded by Sal G's request (2024) to cover all Ruiz Foods employees and events.

### What the solution does

| Feature | How it works |
|---|---|
| **Year-view calendar page** | SharePoint Modern page displays all company events (holidays, board meetings, townhalls, sales events) in a month-by-month grid |
| **Subscribe to Calendar** | Employee fills out a Microsoft Forms form → Power Automate sends a branded email with an Outlook sync link |
| **Outlook sync** | The sync link (`stssync://`) connects Outlook to the "Master Calendar Sync" classic SharePoint list, so events appear in the employee's Outlook calendar |
| **Real-time sync** | Three Power Automate flows keep the Master Calendar and Master Calendar Sync lists in sync on every add, edit, and delete |

### Sites and lists

| Component | Details |
|---|---|
| Site | `https://ruizfoods.sharepoint.com/sites/RuizNetPortal` |
| Master Calendar list | Custom SharePoint list (modern experience) — source of truth for all events |
| Master Calendar Sync list | Classic SharePoint Calendar — exposes the `stssync://` Outlook integration link |

### Power Automate flows

| Flow | Trigger | Purpose |
|---|---|---|
| Corporate Intranet - Master Calendar - New Item | Item created in Master Calendar | Creates matching item in Master Calendar Sync |
| Corporate Intranet - Master Calendar - Update Item | Item updated in Master Calendar | Updates matching item in Master Calendar Sync |
| Corporate Intranet - Master Calendar - Deleted Item | Item deleted in Master Calendar | Deletes matching item from Master Calendar Sync |
| Corporate Intranet - Master Calendar - Suscribe | Microsoft Forms submission | Sends branded subscription email with Outlook sync link |

> **Note:** The Subscribe flow was auto-suspended in Sept 2025 after 90+ days of inactivity. Reactivating it is in scope for this KT project.

### Event governance

Department coordinators (HR, Sales, Finance, Facilities, etc.) each manage their own events. Year-to-year title updates (e.g. "2026 Master Calendar") are performed manually by the IT admin.

---

## Deliverables

| File | Description |
|---|---|
| `docs/KT-MasterCalendar.md` | Full KT document (Markdown, versiond in git) |

---

## How to export SharePoint data

Before running the VISION workflow, use the PnP PowerShell scripts in `source-code/` to export live data from the site. All scripts default to the RuizNetPortal site — no `-SiteUrl` argument needed.

```powershell
# Full Master Calendar solution export (lists, fields, views, site pages)
.\source-code\Export-MasterCalendarSolution.ps1

# Include sample items and site pages inventory
.\source-code\Export-MasterCalendarSolution.ps1 -IncludeSampleItems -IncludeSitePages

# Export individual list settings (all lists)
.\source-code\Export-ListSettings.ps1

# Export site columns
.\source-code\Export-SiteColumns.ps1
```

All exports land in `refdocs/` and serve as the factual basis for the KT document — no data is fabricated.

### Outlook sync link (for reference)

```
stssync://sts/?ver=1.1&type=calendar&cmd=add-folder
  &base-url=https%3A%2F%2Fruizfoods%2Esharepoint%2Ecom%2Fsites%2FRuizNetPortal
  &list-url=%2FLists%2FMaster%2520Calendar%2520Sync%2F
  &guid=%7B284250a1%2Df980%2D419d%2D9d77%2D373c14b37f7d%7D
  &site-name=Corporate%20Intranet
  &list-name=Master%20Calendar%20Sync
```

---

## Repository Structure

```
refdocs/                          ← SharePoint exports + Power Automate flow packages
  mockups/                        ← SharePoint page / Outlook / Forms screenshots
  CorporateIntranet-MasterCalendar-*.zip  ← Exported Power Automate flows
  Master Calendar-ListSettings.json
  Master Calendar Sync-ListSettings.json
source-code/                      ← PnP PowerShell export scripts (default: RuizNetPortal)
  Export-MasterCalendarSolution.ps1
  Export-AllLists.ps1
  Export-ListSettings.ps1
  Export-SiteColumns.ps1
  Export-Library.ps1
  Export-ContentTypes.ps1
  Export-AllTermSets.ps1
docs/
  KT-MasterCalendar.md            ← KT document (Markdown)
spec-kit/input/                   ← VISION-generated spec artifacts
  brief.md
planning/
  workflow-state.json             ← VISION workflow state
  clarifications/brief.json       ← Clarification answers used to generate brief
prompts/
  kt-master-prompt.md             ← Master prompt driving KT generation
```

---

## VISION Framework

VISION is a local-first AI workflow for running the full delivery cycle (brief → spec → sprints → implementation) without depending on an external service.

### Flow

```
init → clarify_brief → generate_brief → generate_spec_kit → generate_sprints → start_sprint
```

### Commands

All commands are issued to the AI agent in the IDE chat window:

| Command | What it does |
|---|---|
| `init` | Initialize project structure |
| `clarify_brief` | Generate contextual questions from refdocs before the brief |
| `generate_brief` | Generate project brief from refdocs + clarification answers |
| `generate_spec_kit` | Generate PRD, epics, user stories, sprint plan |
| `generate_sprints` | Create sprint folders and task lists |
| `start_sprint --sprint N` | Implement sprint N (code + docs in same session) |
| `continue_sprint` | Resume an in-progress sprint |
| `next_step` | Show what to do next |
| `reset_project` | Delete all generated artifacts (keeps refdocs) |

### IDE setup

```bash
npm install
npm run setup:ide
```

### Status

```bash
npm run status          # terminal status report
npm run status:web      # local dashboard → http://127.0.0.1:4173
```

Built on:
- **Spec Kit** — [github/spec-kit](https://github.com/github/spec-kit)
- **Agency Agents** — [msitarzewski/agency-agents](https://github.com/msitarzewski/agency-agents)

Full command reference: [`AGENTS.md`](AGENTS.md)
