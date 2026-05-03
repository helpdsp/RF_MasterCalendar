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
