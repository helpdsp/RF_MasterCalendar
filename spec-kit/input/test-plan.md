# Test Plan — Ruiz Foods Master Calendar KT Document

## Quality Gates (from kt-master-prompt.md)

The following checks must all pass before the KT document is considered complete. Each is a binary pass/fail.

| # | Gate | How to verify |
|---|---|---|
| QG-01 | **No placeholder text** — zero instances of `TBD`, `TODO`, `[fill in]`, or `placeholder` | `grep -i "TBD\|TODO\|\[fill" docs/KT-MasterCalendar.md` returns 0 results |
| QG-02 | **All fields have Internal Names** — every SharePoint field documented with its exact internal name from JSON exports | Cross-check Section 3 field tables against `Master Calendar-ListSettings.json` and `Master Calendar Sync-ListSettings.json` |
| QG-03 | **Category choices confirmed from data** — 15 choices listed verbatim from `Master Calendar-ListSettings.json`, not guessed | Values match exactly: Meeting, Work hours, Business, Holiday, Get-together, Gifts, Birthday, Anniversary, Meal, Keynote, Breakout, Workshop, Panel, Talk, Networking |
| QG-04 | **All 4 flows documented** — each flow has: display name, flow ID, trigger, every action in order, suspension status | Count 4 flow sub-sections in Section 6; each has a complete action table |
| QG-05 | **All 8 mockups referenced** — every provided screenshot cited in the relevant section | Check `refdocs/mockups/` (8 files) — each appears in Section 4 or 7 evidence |
| QG-06 | **Runbook is executable** — each of the 9 admin tasks has numbered steps | Section 9 contains 9 tasks, each with ≥3 numbered steps, no assumed knowledge |
| QG-07 | **Brand compliance table complete** — every user-facing component has a brand row | Section 11 table covers: subscription email, SharePoint page, Microsoft Forms form |
| QG-08 | **Production typos documented as-is** — "Suscribe" (flow name), "Siscribed" (mockup filename) | Both typos appear in Section 6 / Section 7 with a "(production typo)" note |
| QG-09 | **Service account documented** — `0365-PA-FLOWSVCG@ruizfoods.com` appears in Section 6 and Section 8 | Text search confirms the service account email in both sections |
| QG-10 | **Permission matrix covers both lists** | Section 8 has separate permission rows for Master Calendar and Master Calendar Sync |
| QG-11 | **`stssync://` compatibility limitation documented** | Section 6 or 7 states: "Windows Outlook desktop only — does not work in Outlook for Mac or OWA" |
| QG-12 | **Suspension status for all 3 suspended flows** — dates included | Section 6: Update Item (suspended 2025-11-14), Deleted Item (2025-09-08), Subscribe (2025-09-08) |
| QG-13 | **Reactivation procedure documented** — at least once in Section 9 runbook | Section 9 Task 4 covers reactivation steps for suspended flows |
| QG-14 | **Annual year update procedure documented** | Section 9 Task 6 covers updating page title and Subscribe flow email template each January |
| QG-15 | **`stssync://` link reproduced verbatim** | The full decoded link appears in Section 6 or Section 7 |

## Section-Level Acceptance Criteria

| Section | Pass criteria |
|---|---|
| §1 Functional Overview | Readable by non-technical IT Leadership in <5 min; no jargon; high-level architecture diagram included |
| §2 Architecture & Components | All components in the component inventory table; text-based data-flow diagram present |
| §3 Data Model | Both lists fully tabled; field internal names from exports; Master Calendar Sync custom field `Master_x0020_Calendar_x0020_ID` documented |
| §4 Process Flow | Happy path + suspended-flow failure branch; actor per step; all 8 mockups cited |
| §5 Configuration | All views documented with CAML; list URL alias `/Lists/mc` noted |
| §6 Automation | 4 flows × (trigger + actions table + status + suspension date) |
| §7 Interfaces | All 5 surfaces documented with URLs; Microsoft Forms URL with form ID |
| §8 Permissions | Matrix with roles × lists; `HasUniqueRoleAssignments = true` noted for both lists |
| §9 Runbook | 9 tasks, numbered steps, no tribal knowledge required |
| §10 Data Snapshot | Item counts (160 each), export date (2026-05-17), Category choices listed |
| §11 Brand | Email template brand table; colors `#008345` / `#0066cc`; logo path; tone notes |
