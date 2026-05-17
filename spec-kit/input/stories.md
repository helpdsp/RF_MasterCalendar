# User Stories — Ruiz Foods Master Calendar KT Document

> Persona: **IT Admin / New Owner** — the person taking full ownership of the Master Calendar solution.

## EP-01: Solution Architecture & Data Model

### US-01 — Functional Overview
**As** the new IT admin,
**I need** a plain-language explanation of what the Master Calendar does and why it exists,
**so that** I can communicate its business value to IT Leadership without reading the full technical spec.

**Acceptance criteria:**
- Section covers: business purpose, requestors (Jesse Sowell / Sal G, 2024), problem solved, roles, business value
- High-level component diagram in text form
- Appropriate for a 5-minute non-technical read

---

### US-02 — Architecture & Component Inventory
**As** the new IT admin,
**I need** a complete inventory of all M365 components with their URLs and identifiers,
**so that** I can locate every piece of the solution in the tenant without guessing.

**Acceptance criteria:**
- Table: component, type, URL/ID for SharePoint site, both lists, 4 flows, Forms form, service account, logo asset
- Text-based architecture / data-flow diagram
- All IDs confirmed from ListSettings.json (not from memory)

---

### US-03 — Data Model: Master Calendar List
**As** the new IT admin,
**I need** a complete field table for the Master Calendar list,
**so that** I can maintain or query the list correctly.

**Acceptance criteria:**
- Field table: Display Title, Internal Name, Type, Required, Notes for all non-hidden fields
- Category choices listed verbatim: Meeting, Work hours, Business, Holiday, Get-together, Gifts, Birthday, Anniversary, Meal, Keynote, Breakout, Workshop, Panel, Talk, Networking
- `Master_x0020_Calendar_x0020_Sync` (Text) purpose documented
- List settings table: ID, URL (`/Lists/mc`), BaseTemplate 100, versioning, moderation, item count 160

---

### US-04 — Data Model: Master Calendar Sync List
**As** the new IT admin,
**I need** a complete field table for the Master Calendar Sync list,
**so that** I can understand how Outlook integration works at the data level.

**Acceptance criteria:**
- Standard calendar fields: EventDate, EndDate, fAllDayEvent, fRecurrence, Location, Description, Category
- Custom field `Master_x0020_Calendar_x0020_ID` (Number) — FK to Master Calendar
- List settings: ID, URL, BaseTemplate 106, versioning disabled, not on Quick Launch, Event content type
- `stssync://` link documented with all parameters decoded

---

### US-05 — Configuration Reference
**As** the new IT admin,
**I need** all list views and settings documented with CAML queries,
**so that** I can recreate or troubleshoot views without SharePoint Admin access.

**Acceptance criteria:**
- Master Calendar views: All Items, Calendar (default), RssView (hidden) — with CAML
- Master Calendar Sync views: All Events, Calendar (default, DateRangesOverlap CAML), Current Events
- Each view: Title, ViewType, DefaultView flag, RowLimit, ViewFields, ViewQuery
- Note: Master Calendar URL alias `/Lists/mc` documented

---

## EP-02: Automation & Integration

### US-06 — New Item Flow
**As** the new IT admin,
**I need** the New Item flow documented step-by-step,
**so that** I can maintain the flow that creates Sync entries for new events.

**Acceptance criteria:**
- Flow ID, trigger (GetOnNewItems, 5-min poll), status: ACTIVE
- Actions in order: Initialize variable → HTTP POST to Sync REST API (fAllDayEvent=true) → Get items → Apply to each → Update item (write Sync ID back)
- All field mappings documented

---

### US-07 — Update Item Flow
**As** the new IT admin,
**I need** the Update Item flow documented including reactivation procedure,
**so that** I can restore event-update propagation to Outlook subscribers.

**Acceptance criteria:**
- Flow ID, trigger (GetOnUpdatedItems, 5-min poll), status: ⚠️ SUSPENDED 2025-11-14
- Actions: Get item → Initialize variable → Update item (Title, EventDate, EndDate, Description, Master_Calendar_ID, Category)
- Reactivation steps included in runbook

---

### US-08 — Deleted Item Flow
**As** the new IT admin,
**I need** the Deleted Item flow documented including reactivation procedure,
**so that** I can restore event-deletion propagation to keep the Sync list clean.

**Acceptance criteria:**
- Flow ID, trigger (GetOnDeletedItems, 5-min poll), status: ⚠️ SUSPENDED 2025-09-08
- Actions: Get items (filter Sync by ID) → Initialize variable → Apply to each → Delete item
- Reactivation steps included in runbook

---

### US-09 — Subscribe Flow
**As** the new IT admin,
**I need** the Subscribe flow documented end-to-end,
**so that** I can reactivate and maintain the employee subscription experience.

**Acceptance criteria:**
- Flow ID, display name (note "Suscribe" typo), trigger (Forms webhook), form ID, status: ⚠️ SUSPENDED 2025-09-08
- Actions: Get response → Get logo file → Compose (base64) → Init variable (img tag) → Get user profile → Send email
- Email fields: To, Subject, Body (HTML), BCC documented
- `stssync://` link anatomy in email body explained
- BCC: `HaaronGCONSULT@ruizfoods.com`

---

## EP-03: User Journey & Interface

### US-10 — Employee Subscription Journey
**As** the new IT admin,
**I need** the full employee subscription workflow documented step-by-step with mockup references,
**so that** I can support subscribers and train coordinators.

**Acceptance criteria:**
- Process flow table: Actor, Step number, System/action, Mockup evidence
- Covers happy path: page → Subscribe button → Forms → submit → email → Sync link → Outlook dialog → calendar synced
- Branch: flow suspended (no email received after form submission)
- All 8 mockups cited

---

### US-11 — Interface Documentation
**As** the new IT admin,
**I need** every user-facing interface documented with URL and purpose,
**so that** I can find and maintain each surface of the solution.

**Acceptance criteria:**
- SharePoint Modern page: URL, title, web parts, year-view calendar display
- Master Calendar list (modern): `/sites/RuizNetPortal/Lists/mc/Calendar.aspx`
- Master Calendar Sync list (classic): `/sites/RuizNetPortal/Lists/Master Calendar Sync/calendar.aspx`
- Microsoft Forms URL with form ID
- Subscription email: sender (`0365-PA-FLOWSVCG@ruizfoods.com`), subject, HTML structure

---

## EP-04: Operations, Permissions & Brand

### US-12 — Permissions Matrix
**As** the new IT admin,
**I need** the permission structure for both lists per role,
**so that** I can add/remove coordinators and troubleshoot access issues.

**Acceptance criteria:**
- Matrix: Role → Master Calendar → Master Calendar Sync
- Both lists: HasUniqueRoleAssignments = true
- Service account `0365-PA-FLOWSVCG@ruizfoods.com` documented as required contributor
- Steps to add a new department coordinator

---

### US-13 — Operational Runbook
**As** the new IT admin,
**I need** step-by-step instructions for every routine admin task,
**so that** I can operate the calendar year-round without tribal knowledge.

**Acceptance criteria:**
- Tasks: (1) Add event, (2) Edit event, (3) Delete event, (4) Reactivate suspended flow, (5) Prevent future suspension, (6) Annual year update, (7) Troubleshoot Outlook sync, (8) Check flow run history, (9) Add department coordinator
- Each task: numbered steps, no assumed knowledge

---

### US-14 — Brand Compliance
**As** the new IT admin,
**I need** brand elements documented for every user-facing component,
**so that** I can maintain visual consistency when updating templates.

**Acceptance criteria:**
- Brand table: Component → Dimension → Value
- Email: green `#008345` buttons, `#0066cc` headings/links, Ruiz logo from SiteAssets, professional tone
- Logo path: `/SiteAssets/__sitelogo__ruizsitelogo.png`
- Production typos noted: "Suscribe" in flow name, "Siscribed" in mockup filename
