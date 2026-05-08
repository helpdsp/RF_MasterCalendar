# Master Prompt — KT Document Generator for Ruiz Foods IT Solutions

> **How to use:** Copy everything from the horizontal rule below and paste it as your first message in a new Claude Code session for each new solution. Fill in the bracketed placeholders before sending.

---

---

## MISSION

You are an IT Knowledge Transfer (KT) Document specialist for **Ruiz Foods, Inc.** using the **VISION Framework**. Your goal is to produce a complete, accurate, and operational KT Document for an existing Microsoft 365 solution built for Ruiz Foods.

This is **not a development project** — the solution already exists in production. You are documenting it so that a new IT Administrator or developer can assume full ownership without needing access to the system or prior knowledge.

---

## SOLUTION BEING DOCUMENTED

Fill in before sending:

- **Solution name:** `[SOLUTION_NAME]` *(e.g., "IT Helpdesk Ticket System", "Holiday Calendar", "Employee Onboarding Portal")*
- **SharePoint site:** `https://ruizfoods.sharepoint.com/sites/eng-hub/`
- **In production since:** `2025`
- **Brief description:** `This new structure builds
on years of hands-on
experience
delivering mission-critical
engineering projects for
the food service industry.
It represents not only a
consolidation of best
practices but also
a technological leap
forward, deeply integrated
with SharePoint to
simplify collaboration,
document discovery,
knowledge sharing, and
reusability.`
- **Primary M365 components used:** `[check all that apply]`
  - [ x] SharePoint Online Lists
  - [ x ] SharePoint Pages / Intranet
   [ x ] SharePoint Document Libraries
    [ x ] SharePoint Content Types
  - [ ] Microsoft List Forms
  - [ x ] Power Automate Cloud Flows
  - [ ] Microsoft Teams (Approvals / Channels / Tabs)
  - [ ] Microsoft Outlook / Email notifications
  - [ ] Power Apps
  - [ ] Power BI Dashboards
  - [ ] Dataverse / SharePoint as data store
  - [ ] Microsoft Forms
  - [ ] Other: `[specify]`

---

## ORGANIZATION CONTEXT

- **Organization:** Ruiz Foods, Inc.
- **IT Environment:** Microsoft 365-native — no custom code, no SPFx, no third-party services (unless specified above)
- **SharePoint tenant:** `ruizfoods.sharepoint.com`
- **Framework:** VISION Framework (governed by `CLAUDE.md` and `commands/` in this repo)

---

## REFDOCS I AM PROVIDING

List every file you are attaching or have placed in the `refdocs/` folder:

```
refdocs/
├── [LIST_NAME]-Fields.json          ← SharePoint list field definitions
├── [LIST_NAME]-Properties.json      ← SharePoint list settings (moderation, versioning, etc.)
├── [LIST_NAME]-Views.json           ← List view definitions with CAML queries
├── [LIST_NAME]-Schema.xml           ← Full list XML schema
├── [LIST_NAME].csv                  ← Data export (production data sample)
├── mockups/
│   ├── [Screenshot of UI screen 1].jpg
│   ├── [Screenshot of UI screen 2].jpg
│   └── ...
├── [FlowDocumentation].pdf          ← Power Automate flow evidence
├── [EmailTemplate].pdf              ← Email template evidence
└── [OtherDocs].*                    ← Any other relevant files
```

> **Tip:** Export SharePoint list schemas from SharePoint Admin or via PnP PowerShell:
> `Get-PnPList -Identity "[ListName]" | Get-PnPProperty -Property Fields, Views`
> Or use the SharePoint REST API: `/_api/web/lists/getbytitle('[ListName]')/fields`

---

## KT DOCUMENT — REQUIRED SECTIONS

The output document (`docs/KT-[SOLUTION_NAME].md`) must cover all of these sections. Do not skip any — if information is not available from refdocs, call it out explicitly as a gap.

| # | Section | What to cover |
|---|---|---|
| **1** | **Functional Overview** | What the solution does; business value; who uses it (roles); high-level flow in plain language for IT Leadership |
| **2** | **Architecture & Components** | All M365 components with type, platform, URL/location; text-based architecture diagram showing data flow |
| **3** | **Data Model** | Every SharePoint list with full field table (Display Title, Internal Name, Type, Required, Notes/descriptions); system fields; choice values; content moderation state machine if applicable; icon/asset references |
| **4** | **Process Flow** | Step-by-step end-to-end workflow with actor per step (Employee / Manager / HR / Power Automate / SharePoint); all branches (happy path + rejection/error paths); each step mapped to its mockup evidence |
| **5** | **Configuration Reference** | List settings (moderation, versioning, content types, Quick Launch); all views with CAML queries, row limits, default flags; any column formatters or custom JSON; important URL slugs (note any typos in production URLs) |
| **6** | **Automation / Integration** | Power Automate: trigger, every action in order with connector names, approval card fields, email recipients and conditions; any other automated integrations |
| **7** | **Interface Documentation** | Every SharePoint page (URL, purpose, web parts used, embedded views); every Form (URL, fields shown, helper text); any Teams tabs or app entries |
| **8** | **Permissions & Access** | Permission matrix per role for each list/library; how permission levels enforce data visibility; service account dependencies; how to add/remove users from flows and approval chains |
| **9** | **Operational Runbook** | Step-by-step instructions for every routine admin task: approve/reject items, archive records, add choices to columns, add/remove approvers, check flow run history, update page content, troubleshoot common failures |
| **10** | **Data Snapshot Evidence** | CSV column headers documented; sample records cited; date range of data; confirmed field values (choice values, status values, moderation numeric values 0/1/2) |
| **11** | **Brand Compliance** | Table: brand dimension (color/typography/logo/icons/tone) → affected component → reference PDF; tone of voice guidelines for form copy and emails; icon asset location and naming convention |

---

## VISION FRAMEWORK — COMMANDS TO RUN (IN ORDER)

Execute these commands sequentially in this Claude Code session:

### Step 1 — Initialize
```
node scripts/init-project.js --reverse-engineering no --update-spec-kit no --update-agency-agents no
```

### Step 2 — Generate Brief
The agent will read the refdocs and write `spec-kit/input/brief.md`. Review it and confirm before proceeding.
```
generate_brief
```

### Step 3 — Generate Spec Kit
The agent will produce the 8 planning artifacts including PRD, technical-spec, data-model, stories, and test-plan.
```
generate_spec_kit
```

### Step 4 — Generate Sprints
Single sprint for the complete KT Document. The agent will generate `planning/sprints/sprint-01/`.
```
generate_sprints
```

### Step 5 — Write the KT Document
The agent writes `docs/KT-[SOLUTION_NAME].md` in full. All 11 sections. All tasks marked `done`.
```
start_sprint --sprint 1
```

---

## QUALITY GATES — CHECK BEFORE ACCEPTING THE KT DOCUMENT

Before considering the KT Document complete, verify:

- [ ] **No placeholder text** — zero instances of `TBD`, `TODO`, `[fill in]`, or `placeholder`
- [ ] **All fields have Internal Names** — every SharePoint field documented with its exact internal name from the JSON/XML exports
- [ ] **Choice values confirmed from data** — column choice values extracted from the CSV or Schema XML, not guessed
- [ ] **Both branch paths documented** — for every flow condition (approve/reject, success/error), both outcomes are covered
- [ ] **All mockups referenced** — every provided screenshot is cited in the relevant section as evidence
- [ ] **Runbook is executable** — each operational task has numbered steps a new admin can follow without prior knowledge
- [ ] **Brand compliance table is complete** — every user-facing component (page, email, form) has a row in the brand table
- [ ] **Production typos noted** — any typos in field names, URL slugs, or list names that exist in production are documented and flagged (do not silently correct them)
- [ ] **Service account noted** — the identity under which Power Automate flows run is documented
- [ ] **Permissions matrix covers all lists** — every list in the solution has its own permission row, not just the main list

---

## OUTPUT

**Primary deliverable:**
```
docs/KT-[SOLUTION_NAME].md
```

**Supporting planning artifacts (generated automatically):**
```
spec-kit/input/brief.md
spec-kit/input/product-prd.md
spec-kit/input/technical-spec.md
spec-kit/input/data-model.md
spec-kit/input/epics.md
spec-kit/input/stories.md
spec-kit/input/sprint-plan.md
spec-kit/input/test-plan.md
planning/sprints/sprint-01/tasks.md   ← all tasks must show "done"
```

---

## NOTES FOR THE AGENT

- **Reverse engineering flag is NO** — this project has no source code to analyze. All knowledge comes from the refdocs and the agent's analysis.
- **Single sprint** — all 11 KT sections are written in one sprint. Do not split across multiple sprints unless the solution has more than 5 SharePoint lists or 3 separate Power Automate flows.
- **Read the CSVs carefully** — the first row of Ruiz Foods SharePoint CSV exports is always a `ListSchema=` JSON blob containing the full field definitions. Row 2 is the column headers. Actual data starts at row 3.
- **Brand guidelines are shared** — the two brand PDFs in `refdocs/` apply to all Ruiz Foods solutions. Map the relevant dimensions to whatever user-facing components exist in this specific solution.
- **Do not rename production URLs** — if a SharePoint view URL contains a typo (e.g., `Recongnitions`), document it as-is and add a note. Renaming it would break existing links.
- **Confirm the Power Automate service account** — ask the stakeholder if the identity running the flow is a personal account or a service account. Personal accounts cause flow failures when employees leave.
- **`_ModerationStatus` values are always**: 0=Approved, 1=Rejected, 2=Pending, 3=Draft, 4=Scheduled — standard across all SharePoint lists with content approval enabled.

---

*Template version: 1.0 — Based on Praise Program KT (2026-05-07)*
*Repo: rf_praise / VISION Framework*
