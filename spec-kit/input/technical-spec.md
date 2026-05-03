# Technical specification — Local Project

> **VISION fallback:** Bundles your **approved brief** and **product PRD** into one engineering-facing document. For structured architecture (layers, diagrams, ADRs), configure `LOCAL_IDE_AI_COMMAND` or edit manually.

## Approved brief

# Brief - IT Issue Tracking Platform V2 Phase 2

## Executive Summary

The IT Issue Tracking Platform V2 Phase 2 project enhances the City of Rancho Cordova's existing Microsoft 365-native helpdesk platform with operational audit, stronger visibility, a branded Microsoft Teams app experience, role-based Power BI dashboards, a Copilot Studio IT Helpdesk Agent, a curated SharePoint knowledge base, and human handoff automation. Phase 2 does not replace the Phase 1 architecture; it packages and extends the existing SharePoint, Teams, Microsoft Forms, Outlook, Power Automate, AI Builder, and managed taxonomy foundation into a more unified support experience.

The primary value of Phase 2 is to make IT support easier to access, easier to monitor, and easier to manage. Employees get a clearer Teams-based entry point for submitting tickets, viewing their own ticket history, asking common IT questions, and using natural language to check ticket status. Helpdesk agents get operational dashboards that highlight open workload, SLA risk, closure metrics, and ticket distribution. IT leadership gets executive reporting for ticket volume, SLA compliance, resolution time, issue categories, and support demand patterns.

The updated SOW consolidates licensing and governance assumptions. The $4,999 professional services cost covers delivery work only. Microsoft licenses, Copilot Studio capacity, Power BI licenses, Power Platform premium licenses, Fabric capacity, Microsoft 365 Copilot licensing, and other subscription costs are excluded unless separately approved in writing. Production rollout depends on Rancho Cordova administrator approval for Teams custom apps, app setup policies, Copilot Studio availability, Power BI access, Power Automate connector licensing, and Microsoft 365 Government tenant constraints.

## Context

Phase 1 is already implemented using Microsoft 365 services. The current platform includes a Teams-based support workspace, Microsoft Forms ticket intake, a SharePoint Online IT Ticket Intake Queue, supporting SharePoint configuration lists, a Tickets document library, Power Automate flows, Outlook shared mailbox intake, 8x8 voicemail-to-ticket processing, AI Builder description cleanup, and Teams/email lifecycle notifications. The IT Ticket Intake Queue is the authoritative ticket database and is backed by item-level permissions so employees see only their own tickets while agents and managers receive broader operational access according to role.

The existing Phase 1 architecture includes five Power Automate flows: Provision Ticket, Intake On Change, Forms-to-Ticket, Email-to-Ticket, and SLA Breach. These flows generate `INC-XXXXX` ticket numbers, route tickets using category/subcategory metadata, calculate business-hours-aware SLA targets using settings and holiday lists, apply item-level security, transfer attachments, correlate email replies, process 8x8 voicemail transcripts, and flag overdue tickets every 15 minutes.

Phase 2 adds a formal audit of what Phase 1 delivered, then improves discoverability and usability through a branded Teams app package named `IT Helpdesk`. The updated experience is intended to surface Home, Submit Ticket, My Tickets, Dashboards, Knowledge Base, Copilot Agent, and About tabs through Teams personal/static tabs where tenant policy allows. The dashboard mockups show a polished Teams-integrated UI with the IT Helpdesk app in the Teams app rail, a horizontal product nav, refresh/bookmark/filter controls, KPI cards, dense data tables, role-specific dashboard pages, and Power BI-style visuals.

## Goals

- Audit the existing Phase 1 platform and compare original SOW commitments against actual delivered features, enhancements, configuration, and support work.
- Create a branded Microsoft Teams app package named `IT Helpdesk` as a unified entry point for ticket submission, ticket visibility, dashboards, knowledge resources, and Copilot support.
- Provide employees with self-service ticket visibility through a user-scoped My Tickets experience and an Employee Self-Service Ticket History dashboard.
- Build role-based Power BI dashboards for helpdesk agents, employees, and IT leadership.
- Configure an IT Helpdesk Copilot Agent in Microsoft Copilot Studio for ticket status lookup, guided ticket submission, FAQ answering, onboarding/help, and human handoff.
- Establish a SharePoint-managed FAQ knowledge base that IT administrators can maintain without developer involvement.
- Support human agent handoff when Copilot cannot resolve or route a request after the defined attempt threshold.
- Improve notification, reporting, and operational visibility while preserving the Phase 1 system of record and Microsoft 365-native architecture.
- Document licensing dependencies, administrator approvals, deployment guidance, testing results, and handoff instructions.

## Target Users / Roles

- City employees / requesters: need a simple Teams-based way to submit tickets, check ticket status, review open tickets and history, ask common IT questions, and request a human when self-service is not enough.
- Helpdesk agents: need a daily workload dashboard showing assigned open tickets, SLA target urgency, breached and near-breach tickets, closure metrics, resolution time, and category distribution.
- IT leadership / managers: need executive reporting for volume trends, SLA compliance, agent performance, average resolution time, top issue categories, submission heatmaps, and resource planning.
- IT administrators: need maintainable SharePoint lists, Teams app deployment guidance, Power BI workspace/RLS guidance, Copilot publishing guidance, FAQ maintenance documentation, and clear licensing/admin dependency notes.
- Rancho Cordova Teams / M365 administrators: approve or configure custom Teams app upload, organizational app catalog availability, app setup policies, app pinning, Power BI access, Copilot Studio publishing, and connector licensing.
- Delivery team: performs the audit, configures the Teams app package, dashboards, Copilot topics, Power Automate integrations, handoff notifications, testing, training, and documentation.

## Scope - In

- Phase 1 feature audit covering Forms intake, Teams tabs, SharePoint lists and views, fields and metadata, ticket lifecycle, Power Automate flows, notifications, routing, SLA behavior, permissions, and delivered enhancements beyond original scope.
- V1 SOW vs. actual delivered comparison, enhancement log, gap analysis, recommendations, and optional future backlog.
- Branded Microsoft Teams app package named `IT Helpdesk`, including app name, descriptions, icons, manifest, app package ZIP, personal/static tab configuration, deployment guidance, and app setup policy guidance.
- Teams app tabs or entry points for Home, Submit Ticket, My Tickets, Dashboards, Knowledge Base, Copilot Agent, and About, subject to tenant policy and approved Microsoft 365 URLs.
- Submit Ticket experience showing issue title, category, subcategory, priority, location, description, attachment upload, and submit action.
- My Tickets experience showing ticket number, issue title, priority, status, assigned agent, SLA target, and last updated for the logged-in employee.
- Power BI Dashboard Suite with Agent Workload & Performance, Employee Self-Service Ticket History, and IT Leadership Executive dashboards.
- Power BI workspace publishing support, Teams tab embedding support, and Row-Level Security configuration guidance or implementation as agreed.
- Agent dashboard with KPI cards for tickets closed this week/month, average resolution time, SLA compliance, assigned open ticket priority table, SLA breach/near-breach warning, filters, and ticket volume by category.
- Employee dashboard with open ticket count, closed-this-year count, average resolution time, open ticket table, full ticket history, date/status filters, assigned agent, SLA target, and user-scoped ticket data.
- Executive dashboard with total tickets this month, average resolution time, weekly/monthly volume trend, SLA compliance scorecard, sortable agent performance table, average resolution time matrix, top issue categories, and ticket submission heatmap.
- IT Helpdesk Copilot Agent in Copilot Studio with welcome/help topic, ticket status lookup, guided ticket submission, FAQ response topic, human handoff topic, Power Automate integrations, and Teams publishing support.
- SharePoint FAQ knowledge base list with recommended metadata: Question, Answer, Category, Keywords, Status, Last Reviewed Date, Owner, Related Link, and Escalation Required.
- Initial FAQ category structure, including Password Reset, VPN Access, Microsoft Teams, Outlook, Hardware, Software Requests, Printer Support, Account Access, Shared Drives, Security, and MFA.
- Human handoff workflow, Teams private channel notification, handoff card template, and user confirmation messages.
- Testing for Teams app loading, tab navigation, submit ticket, My Tickets, Power BI access/RLS, Copilot welcome, status lookup, guided submission, FAQ accuracy, handoff, notifications, and permissions.
- Training and handoff materials: admin deployment guidance, Teams app usage guide, Copilot usage guide, Power BI overview, knowledge base maintenance guide, testing checklist, and handoff documentation.

## Scope - Out / Non-goals

- Full custom web application development.
- Custom React, SPFx, or full-code Teams application development.
- Custom APIs outside approved Microsoft 365 connectors and Power Automate patterns.
- Mobile-specific custom application development.
- Replacing SharePoint as the system of record.
- Replacing existing Power Automate flows with custom code.
- Advanced ITSM processes such as Problem Management or Change Management.
- Asset management, CMDB, or inventory tracking.
- AI model training or custom language model development.
- Tenant-wide Teams deployment without Rancho Cordova administrator approval.
- Complex custom authentication beyond Microsoft 365 / Teams authentication.
- Data migration from other ticketing platforms.
- Advanced Power BI data warehouse architecture.
- Long-term production support after handoff.
- Ongoing FAQ content maintenance after initial configuration.
- Microsoft licensing procurement, subscription purchase, or payment of Copilot Studio, Power BI, Power Platform, Fabric, Microsoft 365 Copilot, or other Microsoft service costs.
- Reactivating the reserved Document Set/PDF ticket summary architecture unless separately scoped.

## Functional Requirements Summary

### Existing Phase 1 behavior to preserve

- The IT Ticket Intake Queue remains the central ticket database and single source of truth.
- Existing intake channels remain available: Teams/Form tab, Outlook shared mailbox, Teams/SharePoint list views, and 8x8 voicemail-to-email.
- Provision Ticket Flow creates ticket numbers, detects source, routes tickets, calculates SLA targets, applies item-level security, and sends notifications.
- Intake On Change detects ticket lifecycle changes, sends employee/agent notifications, records closed dates, and reroutes tickets after category/subcategory changes.
- Forms-to-Ticket maps submitted form data to SharePoint, resolves managed metadata, runs AI Builder cleanup, and transfers attachments.
- Email-to-Ticket creates or updates tickets from shared mailbox messages, extracts voicemail transcripts, cleans email bodies, resolves sender identity, and preserves original email content.
- SLA Breach Flow monitors open tickets and flags breached items on a scheduled recurrence.

### Audit and Teams app requirements

- The project shall produce a Phase 1 feature inventory and V1 SOW vs. actual comparison.
- The project shall document delivered enhancements and recommendations for Phase 2 and future phases.
- The project shall create a branded `IT Helpdesk` Teams app manifest and app package ZIP.
- The app shall provide personal/static tab access to approved support entry points, prioritizing app-rail usability when app pinning is approved.
- The app shall include or link to Home, Submit Ticket, My Tickets, Dashboards, Knowledge Base, Copilot Agent, and About experiences where tenant policy allows.
- The app shall include app icon assets, short/long descriptions, deployment guidance, and setup policy guidance.

### Dashboard requirements

- All dashboards shall connect to the existing SharePoint ticket data, with the IT Ticket Intake Queue as primary source.
- Power BI access shall respect report permissions, workspace/app permissions, and RLS rules where implemented.
- Agent dashboard shall show open assigned tickets sorted by SLA target, with ticket number, title, priority, status, SLA target, and hours remaining.
- Agent dashboard shall show breached tickets and tickets with fewer than two hours remaining before SLA breach.
- Agent dashboard shall show tickets closed this week, tickets closed this month, average resolution time, SLA compliance percentage, filters, and ticket volume by category.
- Employee dashboard shall show the logged-in user's open tickets, ticket history, status, priority, assigned agent, SLA target, submitted date, closed date, final status, and filters.
- Executive dashboard shall show weekly and monthly volume trends, total tickets this month, average resolution time, SLA compliance scorecard, sortable agent performance, resolution time by category, top issue categories, and submission heatmap.
- Dashboards shall be embedded or linked through Microsoft Teams, subject to Power BI licensing and permissions.

### Copilot and knowledge base requirements

- The Copilot Agent shall be available in Microsoft Teams when Copilot Studio licensing, capacity, publishing rights, and tenant constraints permit.
- The agent shall answer natural-language ticket status requests such as "What is the status of my ticket?" and "Any update on INC-00042?"
- Ticket status lookup shall return current status, assigned agent, and SLA target while scoping results to tickets associated with the requesting account.
- The agent shall guide ticket submission by collecting issue title, category, subcategory, priority, description, and location, then calling a Power Automate flow to create the ticket.
- The agent shall answer FAQ questions from the SharePoint knowledge base.
- If no useful FAQ answer is available, the agent shall offer ticket creation or handoff.
- If unresolved after two attempts, the agent shall summarize the conversation and post a handoff notification to the Agents Private Channel.
- Handoff cards should include employee name/email, request summary, priority, conversation summary, source, timestamp, pending request ID or ticket number, and links where available.

## Technical Stack & Constraints

- Tenant: City of Rancho Cordova Microsoft 365 Government (GCC) tenant.
- Current site collection: `https://cityofranchocordovaorg.sharepoint.com/sites/ITHelpdesk`.
- Current primary data store: SharePoint Online IT Ticket Intake Queue list.
- Supporting SharePoint assets: IT Helpdesk Settings, IT Helpdesk Routing, IT Helpdesk Holidays, IT Helpdesk Locations, Tickets document library, managed site columns, list views, and Term Store.
- Current automation: Power Automate flows for Provision Ticket, Intake On Change, Forms-to-Ticket, Email-to-Ticket, and SLA Breach.
- Phase 2 automation: Power Automate integrations for Copilot guided ticket submission and handoff notifications; connector licensing must be reviewed before production.
- Conversational layer: Microsoft Copilot Studio published to Microsoft Teams, subject to Copilot Studio availability and licensing/capacity.
- Reporting layer: Power BI dashboards published to a workspace and embedded or linked in Teams, subject to Power BI licensing, permissions, and RLS validation.
- Teams packaging: Microsoft Teams app manifest, icons, package ZIP, personal/static tabs, organizational app catalog, app permission policies, app setup policies, and optional app rail pinning.
- Knowledge layer: SharePoint FAQ list managed by IT administrators.
- Taxonomy: Category/Subcategory and Location Term Store term sets remain the basis for consistent classification and reporting.
- Security: Existing item-level SharePoint permissions must be preserved; Copilot and Power BI must not leak cross-user ticket data.
- Design direction: Mockups show a Teams-native shell with IT Helpdesk app rail placement, top navigation, refresh/bookmarks/filters controls, KPI cards, priority/status badges, tabular ticket views, bar/line charts, heatmap, and role-specific dashboard pages.
- Delivery timeline: estimated 3 to 4 weeks, dependent on administrator availability, Teams app approval, Power BI workspace access, Copilot Studio licensing, and validation cycles.
- Cost constraint: professional services budget is $4,999; Microsoft subscription and licensing costs are excluded.

## Success Criteria

- Phase 1 audit report, V1 vs. actual comparison, enhancement log, gap analysis, and recommendations are delivered.
- `IT Helpdesk` Teams app package is created, branded, packaged, documented, and tested in Teams subject to admin approval.
- Agreed Teams app tabs are configured or documented with realistic approved Microsoft 365 entry points.
- Power BI dashboards are created for agent, employee, and leadership audiences and published to the agreed workspace.
- Dashboard access and RLS behavior are validated so users see only the data appropriate to their role.
- Agent dashboard clearly surfaces SLA risk, open workload, closure KPIs, average resolution time, and category distribution.
- Employee dashboard shows only the logged-in employee's open tickets and ticket history.
- Executive dashboard provides useful operational visibility for ticket trends, SLA compliance, resolution time, agent performance, top categories, and submission timing.
- Copilot Agent is configured or prepared for Teams publishing, including welcome/help, ticket status lookup, guided ticket submission, FAQ, and handoff topics.
- Ticket status lookup, guided ticket submission, FAQ responses, and handoff notifications are tested.
- SharePoint FAQ list and maintenance guidance are delivered.
- Licensing dependencies, premium connector risks, admin approvals, and deployment constraints are explicitly documented.
- Phase 2 enhancements do not break existing Phase 1 intake, routing, SLA, notification, permission, or reporting foundations.

## Open Questions / Risks

- Confirm whether Rancho Cordova allows custom Teams apps and organizational app catalog upload in the Microsoft Teams Admin Center.
- Confirm whether app setup policies can install or pin the `IT Helpdesk` app to the Teams app rail for target users.
- Confirm whether personal/static tabs can render each intended Microsoft 365 experience reliably in Teams.
- Confirm final tab URLs and whether Submit Ticket will use Microsoft Forms, SharePoint, a Teams-hosted page, or another approved M365 surface.
- Confirm Copilot Studio availability, licensing, capacity/credits, publishing rights, and GOV tenant limitations.
- Confirm whether Microsoft 365 Copilot licensing affects the intended Copilot Agent audience.
- Confirm whether any Copilot or Power Automate integration requires premium connectors, HTTP actions, custom connectors, Dataverse, or other premium licensing.
- Confirm Power BI Pro, Premium, or Fabric licensing for intended users and whether broad employee dashboard access is financially and administratively approved.
- Confirm Power BI workspace/app permissions and the authoritative identity fields for RLS: requester email, assigned agent email, SharePoint person fields, claims, or Entra ID attributes.
- Confirm whether RLS is mandatory implementation scope or guidance-only, since the SOW states RLS "will be considered" while dashboard privacy requires strong user scoping.
- Confirm whether Copilot guided ticket submission must support attachment upload; the mockup asks for attachment upload in Submit Ticket, but Copilot attachment handling is not explicit.
- Confirm whether Copilot can return the final `INC-XXXXX` ticket number synchronously after existing provisioning completes or should return a pending confirmation.
- Confirm branding assets, app icons, approved colors, app descriptions, and any City style requirements.
- Confirm who will author initial FAQ entries and approve ongoing knowledge base governance.
- Risk: Existing Phase 1 configuration may require cleanup before Phase 2 work can be layered on cleanly.
- Risk: Some SharePoint or Power BI pages may not render cleanly inside Teams tabs and may need layout or URL adjustments.
- Risk: FAQ quality directly affects Copilot usefulness and ticket deflection.
- Risk: GOV tenant limitations or licensing procurement delays could shift the timeline beyond 3 to 4 weeks.
- Risk: The mockups include polished dashboard UI expectations; implementation should clarify whether exact visual fidelity is required or whether they serve as directional references.

## Input Sources

- refdocs: `IT_Issue_Tracking_Platform_V2_Phase_2_SOW_Consolidated.md`
- refdocs: `IT_IssueTracking_SolutionArchitecture.md`
- refdocs: `Category_Subcategory-TermSet.json`
- refdocs: `Location-TermSet.json`
- refdocs: `IT Ticket Intake Queue-Fields.json`
- refdocs: `IT Ticket Intake Queue-Properties.json`
- refdocs: `IT Ticket Intake Queue-Views.json`
- refdocs: `IT Helpdesk Routing-Fields.json`
- refdocs: `IT Helpdesk Routing-Properties.json`
- refdocs: `IT Helpdesk Routing-Views.json`
- refdocs: `IT Helpdesk Settings-Fields.json`
- refdocs: `IT Helpdesk Settings-Properties.json`
- refdocs: `IT Helpdesk Settings-Views.json`
- refdocs: `IT Helpdesk Holidays-Fields.json`
- refdocs: `IT Helpdesk Holidays-Properties.json`
- refdocs: `IT Helpdesk Holidays-Views.json`
- refdocs: `IT Helpdesk Locations-Fields.json`
- refdocs: `IT Helpdesk Locations-Properties.json`
- refdocs: `IT Helpdesk Locations-Views.json`
- refdocs: `Tickets-Fields.json`
- refdocs: `Tickets-Properties.json`
- refdocs: `Tickets-Views.json`
- refdocs: `SiteColumns-ByGroup.json`
- refdocs: `SiteColumns-Special.json`
- refdocs: `IT Helpdesk-SiteColumns.json`
- refdocs mockups: `mockups/Agent Workload & Performance Dashboard.png`
- refdocs mockups: `mockups/Employee Self-Service Ticket History.png`
- refdocs mockups: `mockups/IT Leadership Executive Dashboard.png`
- refdocs visual reference: `IT Issue Tracking Platform V1 Solution Architecture Diagram.jpg`
- refdocs binary references present: `Phase1_Rancho_Cordova_ITHelpDesk_SOW-status.docx`, `Phase2_SOW.docx`
- refdocs Power Automate packages present: `ITIssueTrackingPlatform-Email-to-ticketflow_20260502182343.zip`, `ITIssueTrackingPlatform-Forms-to-ticketflow_20260502182326.zip`, `ITIssueTrackingPlatform-IntakeOnChange_20260502182311.zip`, `ITIssueTrackingPlatform-ProvisionTicketflow_20260502182254.zip`, `ITIssueTrackingPlatform-SLABreach_20260502182359.zip`
- source-code: Not applicable. Workflow state has `reverseEngineering = false`.

## Product PRD (primary implementation source)

# Product PRD - IT Issue Tracking Platform V2 Phase 2

## 1. Product Summary

Phase 2 enhances the City of Rancho Cordova's existing Microsoft 365-native IT Issue Tracking Platform. It adds a Phase 1 audit, a branded Microsoft Teams app package named **IT Helpdesk**, role-based Power BI dashboards, a Copilot Studio IT Helpdesk Agent, a SharePoint-managed FAQ knowledge base, human agent handoff, and deployment/testing/handoff materials.

The solution must preserve the existing Phase 1 architecture: SharePoint Online remains the system of record, the IT Ticket Intake Queue remains the primary ticket database, and existing Power Automate intake/provisioning/SLA/notification flows remain operational.

## 2. Users and Roles

- City employee / requester: submits support requests, checks status, views ticket history, asks FAQs, and requests human help.
- Helpdesk agent: monitors assigned tickets, SLA risk, closure metrics, and ticket distribution.
- IT leadership / manager: reviews team performance, volume trends, SLA compliance, category patterns, and staffing signals.
- IT administrator: maintains SharePoint lists, Teams app deployment, Power BI access, Copilot publishing, and knowledge content.
- Microsoft 365 / Teams administrator: approves custom app upload, app setup policy, app pinning, Power BI access, Copilot deployment, and connector licensing.

## 3. Functional Requirements

### RF-01 - Phase 1 Feature Audit and Gap Analysis

- The delivery shall produce a Phase 1 feature inventory covering Forms, Teams tabs, SharePoint lists/views/fields, Power Automate flows, notifications, routing, SLA behavior, permissions, and user-facing ticket views.
- The delivery shall compare original Phase 1 SOW commitments against actual delivered capabilities.
- The delivery shall document enhancements or configuration work completed beyond the original quote.
- The delivery shall produce a gap analysis and recommendations for Phase 2 and future phases.

### RF-02 - Branded IT Helpdesk Teams App Package

- The delivery shall create a branded Microsoft Teams app package named **IT Helpdesk**.
- The package shall include app manifest, app color icon, app outline icon, short description, long description, and package ZIP.
- The app shall use personal/static tabs where appropriate so it can support app rail pinning when approved by administrators.
- The app shall provide deployment guidance and app setup policy guidance for Teams administrators.

### RF-03 - Teams App Navigation and Support Entry Points

- The IT Helpdesk app shall surface approved entry points for Home, Submit Ticket, My Tickets, Dashboards, Knowledge Base, Copilot Agent, and About.
- The app shall link tabs to approved Microsoft 365 assets such as SharePoint, Microsoft Forms, Power BI, and Copilot Studio where tenant policy permits.
- The app shall not replace the existing Teams/channel-based Phase 1 experience.
- The app shall remain subject to Rancho Cordova app catalog, app permission, and app setup policy approval.

### RF-04 - Submit Ticket Experience

- The Submit Ticket entry point shall provide or link to a Teams-friendly ticket intake experience.
- The intake experience shall support issue title, category, subcategory, priority, location, description, attachment upload, and submit action where the selected Microsoft 365 surface supports those fields.
- Submissions shall continue to create tickets in the existing IT Ticket Intake Queue and trigger the existing provisioning flow.

### RF-05 - My Tickets Employee Visibility

- The My Tickets entry point shall provide a user-scoped view of ticket number, issue title, priority, status, assigned agent, SLA target, and last updated.
- Employees shall only see tickets associated with their own account.
- The experience shall preserve the Phase 1 item-level security model and shall not expose other employees' ticket data.

### RF-06 - Agent Workload and Performance Dashboard

- The Agent dashboard shall display assigned open tickets sorted by SLA target.
- The dashboard shall include ticket number, title, priority, status, SLA target, and hours remaining.
- The dashboard shall highlight breached tickets and tickets with fewer than two hours remaining before breach.
- The dashboard shall include KPI cards for tickets closed this week, tickets closed this month, average resolution time, and SLA compliance percentage.
- The dashboard shall include filters for agent, priority, and date range plus ticket volume by category.

### RF-07 - Employee Self-Service Ticket History Dashboard

- The Employee dashboard shall show the logged-in employee's open tickets and ticket history.
- The dashboard shall include open ticket count, closed-this-year count, average resolution time, assigned agent, SLA target, submitted date, closed date, final status, and date/status filters.
- The dashboard shall enforce user-scoped visibility through Power BI permissions and RLS where implemented.

### RF-08 - IT Leadership Executive Dashboard

- The Executive dashboard shall show total tickets this month, average resolution time, weekly volume trend, monthly volume trend, and SLA compliance scorecard.
- The dashboard shall include a sortable agent performance table.
- The dashboard shall include average resolution time by category, top issue categories, and ticket submission heatmap by day of week and hour of day.
- The dashboard shall support leadership visibility across all relevant ticket data.

### RF-09 - Power BI Publishing, Embedding, and Access

- Power BI reports shall be published to an agreed Power BI workspace.
- Reports shall be embedded or linked from Microsoft Teams where tenant policy and licensing permit.
- Dashboard access shall respect Power BI permissions, workspace/app permissions, and RLS behavior where implemented.
- Report rollout shall validate that unauthorized users cannot view data outside their role.

### RF-10 - Copilot Agent Welcome and Onboarding

- The Copilot Agent shall provide a welcome/onboarding response for first-time users or users who type "help".
- The welcome response shall summarize supported actions such as ticket status lookup, creating a new ticket, asking FAQ questions, viewing open tickets, and talking to a person.

### RF-11 - Copilot Ticket Status Lookup

- Employees shall be able to ask natural-language status questions such as "What is the status of my ticket?" or "Any update on INC-00042?"
- The Copilot Agent shall return ticket status, assigned agent, and SLA target where available.
- The lookup shall be scoped to tickets associated with the requesting user.
- The response shall explicitly avoid exposing tickets owned by other employees.

### RF-12 - Copilot Guided Ticket Submission

- The Copilot Agent shall guide users through ticket submission by collecting issue title, category, subcategory, priority, description, and location.
- The agent shall call a Power Automate integration to create the ticket in the IT Ticket Intake Queue.
- Created Copilot tickets shall trigger the existing Provision Ticket Flow.
- The final confirmation shall return a ticket number when available or a pending confirmation if ticket number generation is asynchronous.

### RF-13 - SharePoint FAQ Knowledge Base

- The delivery shall create a SharePoint FAQ list with recommended fields: Question, Answer, Category, Keywords, Status, Last Reviewed Date, Owner, Related Link, and Escalation Required.
- The knowledge base shall include an initial category structure for Password Reset, VPN Access, Microsoft Teams, Outlook, Hardware, Software Requests, Printer Support, Account Access, Shared Drives, Security, and MFA.
- IT administrators shall be able to maintain FAQ content without developer involvement.

### RF-14 - Copilot FAQ Answering

- The Copilot Agent shall answer common IT questions using the SharePoint FAQ knowledge base.
- If no useful FAQ answer is available, the agent shall offer ticket creation or human handoff.
- FAQ behavior shall be tested for answer accuracy and escalation paths.

### RF-15 - Human Agent Handoff

- If the Copilot Agent cannot resolve a request after two attempts, it shall summarize the conversation and notify helpdesk agents.
- The handoff notification shall be posted to the Agents Private Channel in Teams.
- The employee shall be informed that a human agent will follow up.
- The handoff card should include employee name/email, request summary, priority, conversation summary, source, timestamp, pending request ID or ticket number, and links where available.

### RF-16 - Licensing and Governance Documentation

- The delivery shall document Microsoft licensing exclusions and dependencies for Teams app, Copilot Studio, Power Automate, Power BI, Power Platform premium connectors, Fabric, and Microsoft 365 Copilot.
- The delivery shall document required administrator approvals, including custom app approval, app setup policy, app pinning, Power BI workspace/report permissions, Copilot Studio publishing, and connector licensing approval.
- The delivery shall make clear that Microsoft subscription costs are outside the professional services investment unless separately agreed in writing.

### RF-17 - Testing, Training, and Handoff

- The delivery shall include a test plan and test results summary.
- Testing shall cover Teams app loading, tab navigation, Submit Ticket, My Tickets, Power BI access/RLS, Copilot welcome, status lookup, guided submission, FAQ responses, human handoff, notifications, and permissions.
- The delivery shall include Teams app usage guide, Copilot Agent usage guide, Power BI dashboard overview, knowledge base maintenance guide, admin deployment guidance, and handoff documentation.

## 4. Non-Functional Requirements

- Preserve the existing Phase 1 IT Ticket Intake Queue as the system of record.
- Preserve item-level permission assumptions and avoid cross-user ticket data leakage.
- Use Microsoft 365-native services and avoid unnecessary third-party systems.
- Avoid full custom web application development, custom React/SPFx/full-code Teams app development, and custom APIs unless separately scoped.
- Support Microsoft 365 Government tenant constraints and administrator approval processes.
- Keep Power BI, Copilot, Teams app, and Power Automate behavior dependent on confirmed licensing and permissions.

## 5. Acceptance Summary

Phase 2 is complete when the audit, Teams app package, dashboards, Copilot Agent, FAQ list, handoff workflow, testing evidence, documentation, licensing dependency notes, and admin approval requirements have been delivered or prepared for deployment according to agreed scope.
