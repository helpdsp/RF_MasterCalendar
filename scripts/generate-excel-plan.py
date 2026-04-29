import openpyxl
from openpyxl.styles import (
    PatternFill, Font, Alignment, Border, Side, GradientFill
)
from openpyxl.utils import get_column_letter
from openpyxl.chart import BarChart, Reference
from openpyxl.chart.series import DataPoint
from openpyxl.formatting.rule import ColorScaleRule, DataBarRule, FormulaRule
from openpyxl.drawing.image import Image as XLImage
import datetime

# ── Colour palette ────────────────────────────────────────────────────────────
C = {
    "brand_dark":   "1F3864",   # deep navy
    "brand_mid":    "2E5B9B",   # mid blue
    "brand_light":  "D6E4F7",   # pale blue
    "brand_accent": "00B0F0",   # bright cyan accent
    "white":        "FFFFFF",
    "off_white":    "F7FAFF",
    "done_bg":      "C6EFCE",   # green fill
    "done_fg":      "276221",
    "inprog_bg":    "FFEB9C",   # amber fill
    "inprog_fg":    "9C6500",
    "todo_bg":      "F2F2F2",   # light grey
    "todo_fg":      "595959",
    "priority_bg":  "FCE4D6",   # soft orange
    "priority_fg":  "833C00",
    "header_text":  "FFFFFF",
    "row_alt":      "EEF4FC",
    "border":       "BDD7EE",
    "risk_low":     "E2EFDA",
    "risk_med":     "FFEB9C",
    "risk_high":    "FFC7CE",
    "section_bg":   "16365C",
    "section_fg":   "FFFFFF",
}

def fill(hex_color):
    return PatternFill("solid", fgColor=hex_color)

def font(bold=False, color="000000", size=11, italic=False):
    return Font(bold=bold, color=color, size=size, italic=italic, name="Calibri")

def border(style="thin", color="BDD7EE"):
    s = Side(style=style, color=color)
    return Border(left=s, right=s, top=s, bottom=s)

def align(h="left", v="center", wrap=False):
    return Alignment(horizontal=h, vertical=v, wrap_text=wrap)

def apply_header_row(ws, row, cols, bg=C["brand_dark"], fg=C["white"], size=11):
    for col in range(1, cols + 1):
        c = ws.cell(row=row, column=col)
        c.fill = fill(bg)
        c.font = font(bold=True, color=fg, size=size)
        c.alignment = align("center", "center")
        c.border = border("thin", C["border"])

def apply_data_row(ws, row, cols, alt=False):
    bg = C["row_alt"] if alt else C["white"]
    for col in range(1, cols + 1):
        c = ws.cell(row=row, column=col)
        if not c.fill or c.fill.patternType == "none":
            c.fill = fill(bg)
        c.border = border("thin", C["border"])
        if not c.alignment or c.alignment.horizontal == "general":
            c.alignment = align("left", "center", wrap=True)

def status_style(cell, status):
    s = status.strip().lower()
    if s == "done" or s == "✅ done":
        cell.fill = fill(C["done_bg"])
        cell.font = font(bold=True, color=C["done_fg"])
    elif "progress" in s:
        cell.fill = fill(C["inprog_bg"])
        cell.font = font(bold=True, color=C["inprog_fg"])
    else:
        cell.fill = fill(C["todo_bg"])
        cell.font = font(color=C["todo_fg"])
    cell.alignment = align("center", "center")

def set_col_widths(ws, widths):
    for i, w in enumerate(widths, 1):
        ws.column_dimensions[get_column_letter(i)].width = w

def section_header(ws, row, text, cols, bg=C["section_bg"]):
    ws.merge_cells(start_row=row, start_column=1, end_row=row, end_column=cols)
    c = ws.cell(row=row, column=1)
    c.value = text
    c.fill = fill(bg)
    c.font = font(bold=True, color=C["white"], size=12)
    c.alignment = align("left", "center")
    c.border = border("thin", C["brand_accent"])
    ws.row_dimensions[row].height = 22

# ── Data ──────────────────────────────────────────────────────────────────────
SPRINTS = [
    {
        "name": "Sprint 1",
        "subtitle": "Core Framework & Provisioning Script",
        "timeline": "Weeks 1–1.5",
        "effort": "36 hrs",
        "status": "Active",
        "goal": (
            "Build the core infrastructure foundation with the PnP PowerShell 1.5.0 "
            "provisioning script as the priority deliverable. A battle-tested script compresses "
            "Sprint 2 from manual per-plant effort into automated batch execution.\n\n"
            "Priority: (1) Develop & pilot PnP script end-to-end on at least one plant. "
            "(2) Harden the Power Automate Consolidation Flow. (3) Create Plant Page template.\n\n"
            "Capacity note: If sprint completes early, remaining time is redirected to Finance "
            "Team SharePoint tasks within GBR-UK-Shared-Services."
        ),
        "stories": [
            ("ST-1.1", "Define and create the \"Prepayment Item\" Site Content Type and Site Columns.", "Done (POC)", False),
            ("ST-1.2 ⭐", "Develop the PnP PowerShell 1.5.0 script for automated provisioning of security groups and lists. Includes end-to-end pilot run on at least one plant.", "Done", True),
            ("ST-1.3", "Provision SharePoint Security Groups for all 23 plants following the [Plant Code] Members convention.", "To Do", False),
            ("ST-1.4", "Configure base permissions at the site level to allow group discovery while maintaining isolation.", "To Do", False),
            ("ST-2.1", "Execute PnP script to create Prepayment Request lists for each UK plant (NOC, WEA, SBG, etc.).", "To Do", False),
        ],
        "tasks": [
            ("S1-T-001", "ST-1.1", "Define and create the \"Prepayment Item\" Site Content Type and Site Columns. Completed via POC — no rework required.", "Frontend", 3, "Done"),
            ("S1-T-002 ⭐", "ST-1.2", "Develop and fully test the PnP PowerShell 1.5.0 provisioning script. Includes end-to-end pilot run against at least one plant before Sprint 2.", "Backend", 5, "Done"),
            ("S1-T-003", "ST-1.3", "Provision SharePoint Security Groups for all 23 plants following the [Plant Code] Members convention using the script.", "QA", 3, "To Do"),
            ("S1-T-004", "ST-1.4", "Configure base permissions at the site level to allow group discovery while maintaining isolation.", "PM", 3, "To Do"),
            ("S1-T-005", "ST-2.1", "Execute PnP script to create Prepayment Request lists for each UK plant (NOC, WEA, SBG, etc.).", "Deploy", 3, "To Do"),
        ],
        "qa": [
            ("ST-1.1", '"Prepayment Item" Content Type exists at site level with all required fields.', "Done via POC — no re-testing needed unless fields modified."),
            ("ST-1.2 ⭐", "Script provisions a pilot plant end-to-end: security group created, list created with Content Type, permissions broken and assigned.", "Script must be idempotent — re-runnable without duplicating artefacts."),
            ("ST-1.3", "All 23 [Plant Code] Members groups exist in the site with correct naming.", "Verify via SharePoint Admin Centre."),
            ("ST-1.4", "Site-level permissions allow group discovery. Users can be added without Site Admin rights.", "Test with a non-admin account."),
            ("ST-2.1", "At least one plant list exists with Prepayment Item CT, Pending/Processed views, isolated permissions.", "Full rollout continues in Sprint 2."),
        ],
        "risks": [
            ("PnP script incompatibility with tenant permissions", "Medium", "Test against dev account (s2-gis-mxl1-msflows@smurfitkappa.com) before production run."),
            ("Script run time exceeds window for 23 plants", "Low", "Pilot on 1 plant first; batch remaining in Sprint 2."),
            ("Sprint 1 completes early", "Low–Medium", "Remaining capacity redirected to Finance Team SharePoint tasks — no idle time."),
        ],
    },
    {
        "name": "Sprint 2",
        "subtitle": "Regional Rollout — 23 Plants",
        "timeline": "Weeks 1.5–3",
        "effort": "Up to 92 hrs",
        "status": "Planned",
        "goal": (
            "Provision and secure all 23 Spoke lists using the script validated in Sprint 1. "
            "Script automation is expected to reduce actual effort significantly below the 92-hour "
            "baseline (23 plants × 4h/plant manual estimate). Configure Teams integration, "
            "views, site pages, and master lists."
        ),
        "stories": [
            ("ST-2.2", "Break permission inheritance and assign unique group permissions via automation.", "To Do", False),
            ("ST-2.3", 'Configure "Pending" and "Processed" views and integrate lists into Microsoft Teams App Tabs.', "To Do", False),
            ("ST-2.4", "Provision Site Pages for each plant using the reusable Plant Template.", "To Do", False),
            ("ST-3.1", "Create the Plant Master List (Facilities) for system configuration.", "To Do", False),
            ("ST-3.2", "Create the Prepayment Request Master List for central data aggregation.", "To Do", False),
        ],
        "tasks": [
            ("S2-T-001", "ST-2.2", "Break permission inheritance and assign unique [Plant Code] Members group permissions on all 23 plant lists via the PnP script.", "Frontend", 3, "To Do"),
            ("S2-T-002", "ST-2.3", 'Configure "Pending" (Processed=No) and "Processed" (Processed=Yes) views on all plant lists and integrate into Microsoft Teams App Tabs.', "Backend", 3, "To Do"),
            ("S2-T-003", "ST-2.4", "Provision Site Pages for each plant using the reusable Plant Page template with SharePoint List webpart filtered to the plant's list.", "QA", 3, "To Do"),
            ("S2-T-004", "ST-3.1", "Create the Facilities Master List with columns: SAP Code, Plant Name, List Name, Group ID, GM, Active. Pre-populate all 23 plants.", "PM", 3, "To Do"),
            ("S2-T-005", "ST-3.2", "Create the Prepayment Request Master List inheriting all Prepayment Item fields plus Source Plant and Master Processed Date.", "Deploy", 3, "To Do"),
        ],
        "qa": [
            ("ST-2.2", 'User from Plant A receives "Access Denied" accessing Plant B list.', "Each list has broken inheritance with only its own [Plant Code] Members group assigned Contribute."),
            ("ST-2.3", '"Pending" view shows Processed=No items. "Processed" view shows Processed=Yes items.', "Lists render correctly inside Microsoft Teams App Tab."),
            ("ST-2.4", "Each plant has a dedicated SharePoint page displaying its submission list.", "Accessible via Teams or browser."),
            ("ST-3.1", "Facilities Master List contains all 23 plants with all required fields populated.", "Used as Power Automate configuration source."),
            ("ST-3.2", "Master List exists with all Prepayment Item fields plus Source Plant and Master Processed Date.", "Finance Team has read access; plant users cannot access it."),
        ],
        "risks": [
            ("Teams App Tab configuration per plant is time-consuming", "Medium", "Use bulk configuration approach; template the Teams tab settings."),
            ("Plant Master List data incomplete at sprint start", "Low", "Pre-populate during Sprint 1 pilot run."),
            ("Permission script misassigns group to wrong list", "Low", "Dry-run script with -WhatIf flag before executing on all 23 plants."),
        ],
    },
    {
        "name": "Sprint 3",
        "subtitle": "QA, Automation & Finance Handover",
        "timeline": "Week 4",
        "effort": "Included",
        "status": "Planned",
        "goal": (
            "Validate the platform end-to-end, complete the Power Automate consolidation engine "
            "with sealing logic, and leave the Finance Team fully self-sufficient — able to trigger "
            "monthly consolidation, review the Master List, and onboard new plants independently "
            "without IT assistance."
        ),
        "stories": [
            ("ST-3.3", "Develop the Power Automate Consolidation Flow to dynamically iterate through the Plant Master List.", "To Do", False),
            ("ST-3.4", "Implement the Sealing logic to set processed items to read-only in source lists.", "To Do", False),
            ("ST-4.1", "Conduct functional testing per plant and end-to-end consolidation testing.", "To Do", False),
            ("ST-4.2", 'Produce "Plant Onboarding" documentation for Finance.', "To Do", False),
            ("ST-4.3", "Deliver Knowledge Transfer (KT) session to the Finance Team for self-management.", "To Do", False),
        ],
        "tasks": [
            ("S3-T-001", "ST-3.3", "Develop Power Automate Consolidation Flow: reads Facilities Master List, iterates active plants, queries unprocessed items, creates in Master List. New plants auto-included — no flow edits required.", "Frontend", 3, "To Do"),
            ("S3-T-002", "ST-3.4", "Implement Sealing logic: break role inheritance on consolidated source items, assign Read to plant group (MembershipGroupId), Full Control to Site Owners (ID 3). Stamp Processed On timestamp.", "Backend", 3, "To Do"),
            ("S3-T-003", "ST-4.1", "Functional testing: per-plant isolation. End-to-end consolidation with data from at least 3 plants. Zero data loss or duplication. UAT with Finance Team.", "QA", 3, "To Do"),
            ("S3-T-004", "ST-4.2", "Produce Plant Onboarding documentation: step-by-step guide for Finance Team to onboard a new plant independently using PnP script and Facilities Master List.", "PM", 3, "To Do"),
            ("S3-T-005", "ST-4.3", "Deliver KT session covering: monthly consolidation trigger, Master List review, plant onboarding process. Finance Team signs off on self-management readiness.", "Deploy", 3, "To Do"),
        ],
        "qa": [
            ("ST-3.3", "Flow reads Facilities Master List, queries each active plant for unprocessed items, creates in Master List with correct field mapping.", "New plants added to Facilities Master List auto-included — no flow code changes."),
            ("ST-3.4", "After consolidation: source items read-only for plant group, Processed On timestamp set, submitter cannot amend.", "Test sealing on items from at least 3 plants."),
            ("ST-4.1", "All 23 plant lists tested for isolation. End-to-end consolidation with ≥3 plants. Zero data loss or duplication.", "Finance Team validates Master List data accuracy."),
            ("ST-4.2", "Finance Team onboards a new test plant using only the documentation — without IT assistance.", "Documentation validated during UAT."),
            ("ST-4.3", "Finance Team can independently: trigger consolidation, review Master List, initiate plant onboarding.", "Sign-off obtained from Finance Team lead."),
        ],
        "risks": [
            ("Power Automate throttling on large runs (23 plants)", "Medium", "Use concurrency controls in flow; test with full plant set before UAT."),
            ("Finance Team unavailable for KT session", "Low", "Schedule KT early in sprint window; record session for reference."),
            ("Sealing logic breaks item editing for Site Owners", "Low", "Verify Full Control assignment to Site Owners group in sealing step."),
        ],
    },
]

# ── Workbook setup ─────────────────────────────────────────────────────────────
wb = openpyxl.Workbook()
wb.remove(wb.active)   # remove default sheet

# ════════════════════════════════════════════════════════════════════════════════
# SHEET 1 — DASHBOARD
# ════════════════════════════════════════════════════════════════════════════════
ws = wb.create_sheet("📊 Dashboard")
ws.sheet_view.showGridLines = False
ws.sheet_properties.tabColor = C["brand_accent"]
set_col_widths(ws, [3, 22, 28, 16, 14, 14, 18, 3])

# ── Title block ────────────────────────────────────────────────────────────────
ws.merge_cells("B2:G2")
t = ws["B2"]
t.value = "SWUK CENTRAL SUBMISSIONS — PREPAYMENT"
t.fill = fill(C["brand_dark"])
t.font = font(bold=True, color=C["brand_accent"], size=18)
t.alignment = align("center", "center")
ws.row_dimensions[2].height = 36

ws.merge_cells("B3:G3")
s = ws["B3"]
s.value = "Sprint Planning Dashboard  ·  UK Shared Services Digital Solutions  ·  April 2026"
s.fill = fill(C["brand_mid"])
s.font = font(color=C["white"], size=11, italic=True)
s.alignment = align("center", "center")
ws.row_dimensions[3].height = 20

ws.row_dimensions[4].height = 8

# ── Sprint summary cards ────────────────────────────────────────────────────────
card_headers = ["Sprint", "Focus", "Timeline", "Effort", "Status", "Progress"]
COLS = len(card_headers)

ws.row_dimensions[5].height = 20
for i, h in enumerate(card_headers, 2):
    c = ws.cell(row=5, column=i)
    c.value = h
    c.fill = fill(C["brand_dark"])
    c.font = font(bold=True, color=C["white"], size=11)
    c.alignment = align("center", "center")
    c.border = border()

totals = {"done": 0, "total": 0}
sprint_done = []
sprint_total = []

for sp in SPRINTS:
    done = sum(1 for t in sp["tasks"] if t[5].lower() == "done")
    total = len(sp["tasks"])
    totals["done"] += done
    totals["total"] += total
    sprint_done.append(done)
    sprint_total.append(total)

for idx, sp in enumerate(SPRINTS):
    r = 6 + idx
    ws.row_dimensions[r].height = 24
    done = sprint_done[idx]
    total = sprint_total[idx]
    pct = int(done / total * 100) if total else 0
    bar = "█" * (pct // 10) + "░" * (10 - pct // 10)
    status_colors = {
        "Active":   (C["inprog_bg"], C["inprog_fg"]),
        "Planned":  (C["todo_bg"],   C["todo_fg"]),
        "Done":     (C["done_bg"],   C["done_fg"]),
    }
    sbg, sfg = status_colors.get(sp["status"], (C["todo_bg"], C["todo_fg"]))

    row_data = [sp["name"], sp["subtitle"], sp["timeline"], sp["effort"], sp["status"], f"{bar}  {pct}%"]
    for ci, val in enumerate(row_data, 2):
        c = ws.cell(row=r, column=ci)
        c.value = val
        c.border = border()
        c.alignment = align("center", "center")
        alt = idx % 2 == 1
        if ci == 6:   # status
            c.fill = fill(sbg)
            c.font = font(bold=True, color=sfg)
        elif ci == 7:  # progress bar
            c.font = Font(name="Courier New", size=10, color=C["brand_mid"])
            c.fill = fill(C["off_white"])
        else:
            c.fill = fill(C["row_alt"] if alt else C["white"])
            c.font = font(bold=(ci == 2))

ws.row_dimensions[9].height = 8

# ── Overall progress ───────────────────────────────────────────────────────────
ws.merge_cells("B10:G10")
section_header(ws, 10, "  PROJECT PROGRESS", 6, C["brand_mid"])

ws.row_dimensions[11].height = 20
labels = ["Total Tasks", "Completed", "Remaining", "% Complete", "Sprints", "Active Sprint"]
values = [
    totals["total"],
    totals["done"],
    totals["total"] - totals["done"],
    f"{int(totals['done'] / totals['total'] * 100)}%",
    len(SPRINTS),
    "Sprint 1"
]
for ci, (lbl, val) in enumerate(zip(labels, values), 2):
    lc = ws.cell(row=11, column=ci)
    lc.value = lbl
    lc.fill = fill(C["brand_light"])
    lc.font = font(bold=True, color=C["brand_dark"], size=10)
    lc.alignment = align("center", "center")
    lc.border = border()
    vc = ws.cell(row=12, column=ci)
    vc.value = val
    vc.font = font(bold=True, color=C["brand_dark"], size=14)
    vc.alignment = align("center", "center")
    vc.border = border()
    vc.fill = fill(C["white"])
    ws.row_dimensions[12].height = 28

ws.row_dimensions[13].height = 8

# ── All-tasks summary table ────────────────────────────────────────────────────
ws.merge_cells("B14:G14")
section_header(ws, 14, "  ALL TASKS — MASTER LIST", 6, C["brand_dark"])

th = ["Task ID", "Sprint", "Story", "Description", "Role", "Status"]
ws.row_dimensions[15].height = 18
for ci, h in enumerate(th, 2):
    c = ws.cell(row=15, column=ci)
    c.value = h
    c.fill = fill(C["brand_mid"])
    c.font = font(bold=True, color=C["white"])
    c.alignment = align("center", "center")
    c.border = border()

all_tasks = []
for sp in SPRINTS:
    for t in sp["tasks"]:
        all_tasks.append((t[0], sp["name"], t[1], t[2], t[3], t[5]))

for i, (tid, sname, story, desc, role, status) in enumerate(all_tasks):
    r = 16 + i
    ws.row_dimensions[r].height = 18
    row_vals = [tid, sname, story, desc, role, status]
    for ci, val in enumerate(row_vals, 2):
        c = ws.cell(row=r, column=ci)
        c.value = val
        c.alignment = align("left", "center", wrap=(ci == 5))
        c.border = border()
        c.fill = fill(C["row_alt"] if i % 2 else C["white"])
        if ci == 7:
            status_style(c, val)

# ════════════════════════════════════════════════════════════════════════════════
# SHEETS 2–4 — INDIVIDUAL SPRINTS
# ════════════════════════════════════════════════════════════════════════════════
SPRINT_TAB_COLORS = [C["inprog_fg"], C["brand_mid"], C["brand_dark"]]

for s_idx, sp in enumerate(SPRINTS):
    ws = wb.create_sheet(f"🏃 {sp['name']}")
    ws.sheet_view.showGridLines = False
    ws.sheet_properties.tabColor = SPRINT_TAB_COLORS[s_idx]
    set_col_widths(ws, [3, 14, 10, 46, 12, 8, 14, 3])
    NUM_COLS = 7

    r = 2

    # Title
    ws.merge_cells(start_row=r, start_column=2, end_row=r, end_column=NUM_COLS)
    c = ws.cell(row=r, column=2)
    c.value = f"{sp['name'].upper()} — {sp['subtitle'].upper()}"
    c.fill = fill(C["brand_dark"])
    c.font = font(bold=True, color=C["brand_accent"], size=16)
    c.alignment = align("center", "center")
    ws.row_dimensions[r].height = 32
    r += 1

    # Meta row
    meta = f"Timeline: {sp['timeline']}   ·   Effort: {sp['effort']}   ·   Status: {sp['status']}"
    ws.merge_cells(start_row=r, start_column=2, end_row=r, end_column=NUM_COLS)
    mc = ws.cell(row=r, column=2)
    mc.value = meta
    mc.fill = fill(C["brand_mid"])
    mc.font = font(color=C["white"], italic=True)
    mc.alignment = align("center", "center")
    ws.row_dimensions[r].height = 18
    r += 1

    ws.row_dimensions[r].height = 8; r += 1

    # ── Goal ──────────────────────────────────────────────────────────────────
    section_header(ws, r, "  SPRINT GOAL", NUM_COLS); r += 1
    ws.merge_cells(start_row=r, start_column=2, end_row=r, end_column=NUM_COLS)
    gc = ws.cell(row=r, column=2)
    gc.value = sp["goal"]
    gc.fill = fill(C["brand_light"])
    gc.font = font(color=C["brand_dark"], size=10)
    gc.alignment = align("left", "top", wrap=True)
    gc.border = border()
    ws.row_dimensions[r].height = 72
    r += 1

    ws.row_dimensions[r].height = 8; r += 1

    # ── Stories ───────────────────────────────────────────────────────────────
    section_header(ws, r, "  USER STORIES", NUM_COLS); r += 1
    story_heads = ["Story ID", "Description", "Status"]
    sc = [2, 3, 4]
    ws.merge_cells(start_row=r, start_column=3, end_row=r, end_column=6)
    for ci, (col, h) in enumerate(zip([2, 3, 7], story_heads)):
        c = ws.cell(row=r, column=col)
        c.value = h
        c.fill = fill(C["brand_mid"])
        c.font = font(bold=True, color=C["white"])
        c.alignment = align("center", "center")
        c.border = border()
        if col == 3:
            ws.merge_cells(start_row=r, start_column=3, end_row=r, end_column=6)
    ws.row_dimensions[r].height = 18; r += 1

    for i, (sid, sdesc, sstatus, is_priority) in enumerate(sp["stories"]):
        ws.merge_cells(start_row=r, start_column=3, end_row=r, end_column=6)
        id_c = ws.cell(row=r, column=2)
        desc_c = ws.cell(row=r, column=3)
        stat_c = ws.cell(row=r, column=7)
        id_c.value = sid
        desc_c.value = sdesc
        stat_c.value = sstatus
        alt = i % 2 == 1
        for cc in [id_c, desc_c, stat_c]:
            cc.border = border()
            cc.alignment = align("left", "center", wrap=True)
        if is_priority:
            id_c.fill = fill(C["priority_bg"])
            id_c.font = font(bold=True, color=C["priority_fg"])
            desc_c.fill = fill(C["priority_bg"])
            desc_c.font = font(color=C["priority_fg"])
        else:
            id_c.fill = fill(C["row_alt"] if alt else C["white"])
            id_c.font = font(bold=True, color=C["brand_dark"])
            desc_c.fill = fill(C["row_alt"] if alt else C["white"])
        status_style(stat_c, sstatus)
        ws.row_dimensions[r].height = 28; r += 1

    ws.row_dimensions[r].height = 8; r += 1

    # ── Tasks ─────────────────────────────────────────────────────────────────
    section_header(ws, r, "  TASK BREAKDOWN", NUM_COLS); r += 1
    task_heads = ["Task ID", "Story", "Description", "Role", "Pts", "Status"]
    task_cols =  [2,         3,       4,              5,      6,     7]
    for col, h in zip(task_cols, task_heads):
        c = ws.cell(row=r, column=col)
        c.value = h
        c.fill = fill(C["brand_dark"])
        c.font = font(bold=True, color=C["white"])
        c.alignment = align("center", "center")
        c.border = border()
        if col == 4:
            ws.merge_cells(start_row=r, start_column=4, end_row=r, end_column=4)
    ws.row_dimensions[r].height = 18; r += 1

    for i, (tid, story, desc, role, pts, status) in enumerate(sp["tasks"]):
        is_pri = "⭐" in tid
        alt = i % 2 == 1
        row_vals = {2: tid, 3: story, 4: desc, 5: role, 6: pts, 7: status}
        for col, val in row_vals.items():
            c = ws.cell(row=r, column=col)
            c.value = val
            c.border = border()
            c.alignment = align("center" if col in [2,3,5,6,7] else "left", "center", wrap=(col == 4))
            if col == 7:
                status_style(c, val)
            elif is_pri:
                c.fill = fill(C["priority_bg"])
                c.font = font(bold=(col in [2,3]), color=C["priority_fg"])
            else:
                c.fill = fill(C["row_alt"] if alt else C["white"])
                c.font = font(bold=(col in [2,3]))
        ws.row_dimensions[r].height = 36; r += 1

    # Points summary
    done_pts = sum(t[4] for t in sp["tasks"] if t[5].lower() == "done")
    total_pts = sum(t[4] for t in sp["tasks"])
    ws.merge_cells(start_row=r, start_column=2, end_row=r, end_column=5)
    sc = ws.cell(row=r, column=2)
    sc.value = f"  Sprint Points: {total_pts} total   ·   {done_pts} done   ·   {total_pts - done_pts} remaining"
    sc.fill = fill(C["brand_light"])
    sc.font = font(bold=True, color=C["brand_dark"], size=10)
    sc.alignment = align("left", "center")
    sc.border = border()
    for col in range(6, 8):
        ec = ws.cell(row=r, column=col)
        ec.fill = fill(C["brand_light"])
        ec.border = border()
    ws.row_dimensions[r].height = 18; r += 1

    ws.row_dimensions[r].height = 8; r += 1

    # ── QA ────────────────────────────────────────────────────────────────────
    section_header(ws, r, "  QA & ACCEPTANCE CRITERIA", NUM_COLS); r += 1
    qa_heads = ["Story", "Acceptance Criteria", "Notes"]
    qa_widths = [2, 4, 6]
    ws.merge_cells(start_row=r, start_column=3, end_row=r, end_column=5)
    ws.merge_cells(start_row=r, start_column=6, end_row=r, end_column=7)
    for col, h in zip([2, 3, 6], qa_heads):
        c = ws.cell(row=r, column=col)
        c.value = h
        c.fill = fill(C["brand_mid"])
        c.font = font(bold=True, color=C["white"])
        c.alignment = align("center", "center")
        c.border = border()
    ws.row_dimensions[r].height = 18; r += 1

    for i, (qid, criteria, notes) in enumerate(sp["qa"]):
        alt = i % 2 == 1
        bg = C["row_alt"] if alt else C["white"]
        ws.merge_cells(start_row=r, start_column=3, end_row=r, end_column=5)
        ws.merge_cells(start_row=r, start_column=6, end_row=r, end_column=7)
        for col, val in [(2, qid), (3, criteria), (6, notes)]:
            c = ws.cell(row=r, column=col)
            c.value = val
            c.fill = fill(bg)
            c.font = font(bold=(col == 2), color=C["brand_dark"] if col == 2 else "000000")
            c.alignment = align("left", "center", wrap=True)
            c.border = border()
        ws.row_dimensions[r].height = 36; r += 1

    ws.row_dimensions[r].height = 8; r += 1

    # ── Risks ─────────────────────────────────────────────────────────────────
    section_header(ws, r, "  RISK REGISTER", NUM_COLS); r += 1
    risk_heads = ["Risk", "Likelihood", "Mitigation"]
    ws.merge_cells(start_row=r, start_column=2, end_row=r, end_column=4)
    ws.merge_cells(start_row=r, start_column=6, end_row=r, end_column=7)
    for col, h in zip([2, 5, 6], risk_heads):
        c = ws.cell(row=r, column=col)
        c.value = h
        c.fill = fill(C["brand_dark"])
        c.font = font(bold=True, color=C["white"])
        c.alignment = align("center", "center")
        c.border = border()
    ws.row_dimensions[r].height = 18; r += 1

    risk_colors = {"Low": C["risk_low"], "Medium": C["risk_med"], "High": C["risk_high"]}
    for i, (risk, likelihood, mitigation) in enumerate(sp["risks"]):
        alt = i % 2 == 1
        bg = C["row_alt"] if alt else C["white"]
        ws.merge_cells(start_row=r, start_column=2, end_row=r, end_column=4)
        ws.merge_cells(start_row=r, start_column=6, end_row=r, end_column=7)
        for col, val in [(2, risk), (5, likelihood), (6, mitigation)]:
            c = ws.cell(row=r, column=col)
            c.value = val
            c.alignment = align("left" if col != 5 else "center", "center", wrap=True)
            c.border = border()
            if col == 5:
                lc = risk_colors.get(likelihood.split("–")[0].strip(), C["todo_bg"])
                c.fill = fill(lc)
                c.font = font(bold=True)
            else:
                c.fill = fill(bg)
        ws.row_dimensions[r].height = 28; r += 1

# ════════════════════════════════════════════════════════════════════════════════
# SHEET 5 — LEGEND
# ════════════════════════════════════════════════════════════════════════════════
ws = wb.create_sheet("ℹ️ Legend")
ws.sheet_view.showGridLines = False
ws.sheet_properties.tabColor = C["brand_light"]
set_col_widths(ws, [3, 22, 34, 3])

ws.merge_cells("B2:C2")
lh = ws["B2"]
lh.value = "LEGEND & KEY"
lh.fill = fill(C["brand_dark"])
lh.font = font(bold=True, color=C["brand_accent"], size=14)
lh.alignment = align("center", "center")
ws.row_dimensions[2].height = 28

legend_items = [
    ("STATUS COLOURS", None, None),
    ("Done", C["done_bg"], "Task or story fully completed."),
    ("In Progress", C["inprog_bg"], "Task currently being worked on."),
    ("To Do", C["todo_bg"], "Task not yet started."),
    ("", None, None),
    ("PRIORITY MARKERS", None, None),
    ("⭐ Priority Task", C["priority_bg"], "High-priority item — must complete before downstream tasks can begin."),
    ("", None, None),
    ("RISK LIKELIHOOD", None, None),
    ("Low", C["risk_low"], "Unlikely to occur; manageable if it does."),
    ("Medium", C["risk_med"], "Possible; requires monitoring and a mitigation plan."),
    ("High", C["risk_high"], "Likely or high impact; needs immediate action."),
    ("", None, None),
    ("SERVICE ACCOUNTS", None, None),
    ("Dev / Test", C["brand_light"], "s2-gis-mxl1-msflows@smurfitkappa.com"),
    ("Production", C["brand_light"], "S2-GBR-UK-Portal@smurfitwestrock.com"),
]

for i, (label, bg, desc) in enumerate(legend_items):
    r = 3 + i
    ws.row_dimensions[r].height = 20
    lc = ws.cell(row=r, column=2)
    dc = ws.cell(row=r, column=3)
    if bg is None:
        # Section header
        lc.value = label
        ws.merge_cells(start_row=r, start_column=2, end_row=r, end_column=3)
        lc.fill = fill(C["section_bg"] if label else C["white"])
        lc.font = font(bold=True, color=C["white"] if label else C["white"], size=10)
        lc.alignment = align("left", "center")
    else:
        lc.value = label
        lc.fill = fill(bg)
        lc.font = font(bold=True, size=10)
        lc.alignment = align("left", "center")
        lc.border = border()
        dc.value = desc
        dc.fill = fill(C["off_white"])
        dc.font = font(size=10)
        dc.alignment = align("left", "center", wrap=True)
        dc.border = border()

# ── Save ───────────────────────────────────────────────────────────────────────
out = r"c:\DATA\Repos\sk_prepayment\docs\sprint-plan.xlsx"
wb.save(out)
print(f"Saved: {out}")
