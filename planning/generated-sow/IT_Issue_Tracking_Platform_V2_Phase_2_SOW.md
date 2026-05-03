# Statement of Work
# IT Issue Tracking Platform V2
## Phase 2 - Operational Enhancements, Reporting & Teams App Experience

| | |
|---|---|
| Client | City of Rancho Cordova |
| Project | IT Issue Tracking Platform V2 |
| Phase | Phase 2 |
| Prepared For | Rob Nunley, IT Director |
| Engagement Type | Professional Services |
| Investment | $4,999 USD |
| Draft Source | Generated from `spec-kit/input/brief.md` |

---

## 1. Project Overview

The City of Rancho Cordova has implemented Phase 1 of the IT Issue Tracking Platform using Microsoft 365 services, including Microsoft Teams, Microsoft Forms, SharePoint Online, Power Automate, Outlook shared mailbox intake, AI Builder, and related notification capabilities.

Phase 2 enhances that existing foundation. It does not replace the Phase 1 architecture or introduce a third-party ticketing platform. Instead, it improves operational visibility, employee self-service, IT agent productivity, reporting, support automation, and discoverability by packaging key experiences into a branded Microsoft Teams app named **IT Helpdesk**.

Phase 2 also includes a formal audit of the Phase 1 implementation. This audit will document the delivered platform, compare actual delivered features against the original Phase 1 SOW, identify additional work and enhancements completed beyond the original quote, and provide recommendations for the Phase 2 implementation and future roadmap.

## 2. Objectives

Phase 2 has the following objectives:

- Perform a detailed audit of the existing Phase 1 IT Issue Tracking Platform.
- Compare original Phase 1 SOW commitments against actual delivered functionality.
- Create a branded Microsoft Teams app package named **IT Helpdesk**.
- Provide a centralized Teams entry point for ticket submission, ticket visibility, dashboards, knowledge resources, and Copilot support.
- Build role-based Power BI dashboards for IT agents, employees, and IT leadership.
- Configure an IT Helpdesk Copilot Agent in Microsoft Copilot Studio.
- Enable natural-language ticket status lookup and guided conversational ticket submission.
- Create a curated SharePoint-managed IT FAQ knowledge base foundation.
- Support human agent handoff when the Copilot Agent cannot resolve a request.
- Improve notification, reporting, and operational visibility without disrupting the Phase 1 system of record.
- Document licensing dependencies, administrator approvals, testing results, deployment guidance, and handoff instructions.

## 3. Scope of Work

| # | Workstream | Description | Key Deliverables |
|---|---|---|---|
| 3.1 | Phase 1 Feature Audit & Gap Analysis | Review the current implementation, delivered capabilities, flows, lists, permissions, notifications, and deviations from the original Phase 1 SOW. | Audit report, V1 vs. actual comparison, enhancement log, gap analysis, recommendations |
| 3.2 | Branded Microsoft Teams App Package | Create a branded Teams app package named **IT Helpdesk** to surface approved support experiences through Teams personal/static tabs. | Manifest, icons, app package ZIP, tab configuration, deployment guidance |
| 3.3 | Power BI Dashboard Suite | Build three role-based dashboards and publish them to a Power BI workspace for Teams access. | Agent dashboard, employee dashboard, executive dashboard, RLS validation/guidance |
| 3.4 | IT Helpdesk Copilot Agent | Configure Copilot Studio topics for ticket lookup, guided submission, FAQ answering, onboarding, and handoff. | Copilot Agent, topics, Power Automate integrations, Teams publishing support |
| 3.5 | Knowledge Base Foundation | Create a SharePoint FAQ list as the manageable content source for common IT questions. | FAQ list, metadata structure, initial categories, maintenance guidance |
| 3.6 | Human Handoff & Notifications | Configure handoff behavior for unresolved Copilot conversations. | Handoff workflow, Teams private channel notification, handoff card template |
| 3.7 | Testing, Training & Handoff | Validate Phase 2 components and prepare support materials. | Test plan, test results, user/admin documentation, deployment notes |

## 4. Workstream Details

### 4.1 Phase 1 Feature Audit & Gap Analysis

The audit will review the existing IT Issue Tracking Platform and document what was originally quoted, what was actually delivered, and what additional configuration, enhancement, testing, or support work was completed beyond the original Phase 1 scope.

Audit areas include:

- Microsoft Forms ticket intake configuration.
- Microsoft Teams team, channel, and tab configuration.
- SharePoint IT Ticket Intake Queue and related lists.
- SharePoint fields, metadata, views, permissions, and item-level visibility.
- Ticket lifecycle statuses and user-facing ticket views.
- Power Automate flows for provisioning, intake, lifecycle changes, email intake, and SLA breach detection.
- Notification logic for employees, agents, and managers.
- Assignment and routing logic.
- SLA configuration, settings, holidays, and breach behavior.
- User-facing experiences such as Submit Ticket and My Tickets.
- Delivered features or enhancements beyond the original quote.

### 4.2 Branded Microsoft Teams App Package

Phase 2 will create a branded Microsoft Teams app package named **IT Helpdesk**. The app package is a Teams shell that surfaces approved Microsoft 365 experiences; it is not a custom full-code Teams application.

The proposed app structure is:

```text
IT Helpdesk
├── Home
├── Submit Ticket
├── My Tickets
├── Dashboards
├── Knowledge Base
├── Copilot Agent
└── About
```

Included activities:

- Define app name, short description, long description, and branding.
- Create or configure required Teams app icons.
- Create the Teams app manifest.
- Configure personal/static tabs for selected IT Helpdesk experiences.
- Link tabs to approved Microsoft 365 assets such as SharePoint, Microsoft Forms, Power BI, or Copilot Studio.
- Package the app as a Teams app ZIP.
- Support app testing in Microsoft Teams.
- Provide app deployment and setup policy guidance for Teams administrators.

App upload, installation, and pinning are subject to Rancho Cordova Teams governance, app permission policies, app setup policies, and administrator approval.

### 4.3 Power BI Dashboard Suite

Phase 2 will create three role-based Power BI dashboards connected to the existing SharePoint ticket data, with the IT Ticket Intake Queue as the primary reporting source.

#### Agent Workload & Performance Dashboard

Designed for daily use by IT helpdesk agents.

Included visuals:

- Tickets Closed This Week KPI.
- Tickets Closed This Month KPI.
- Average Resolution Time KPI.
- SLA Compliance Percentage KPI.
- My Open Tickets priority table sorted by SLA target.
- SLA breach and near-breach warning indicator.
- Agent, priority, and date filters.
- Ticket Volume by Category chart.

The dashboard should show ticket number, title, priority, status, SLA target, and hours remaining, with breached tickets and tickets under two hours remaining clearly highlighted.

#### Employee Self-Service Ticket History Dashboard

Designed for city employees.

Included visuals:

- Open Tickets KPI.
- Closed This Year KPI.
- Average Resolution Time KPI.
- My Open Tickets table.
- My Ticket History table.
- Date range and status filters.

The dashboard should show only tickets associated with the logged-in employee, including ticket number, title, category, priority, submitted date, closed date, assigned agent, final status, status badge, and SLA target.

#### IT Leadership Executive Dashboard

Designed for IT leadership and managers.

Included visuals:

- Total Tickets This Month KPI.
- Average Resolution Time KPI.
- Weekly Volume Trend for the last 12 weeks.
- Monthly Volume Trend for the last 12 months.
- SLA Compliance Scorecard.
- Sortable agent performance table.
- Average Resolution Time Matrix by category.
- Top Issue Categories chart.
- Ticket Submission Heatmap by day of week and hour of day.

### 4.4 IT Helpdesk Copilot Agent

Phase 2 will configure an IT Helpdesk Copilot Agent using Microsoft Copilot Studio and prepare it for deployment in Microsoft Teams, subject to licensing, capacity, and tenant policy.

Included capabilities:

| Capability | Description |
|---|---|
| Welcome / Onboarding | New users or users who type "help" receive a summary of available actions and example prompts. |
| Ticket Status Lookup | Employees can ask for ticket status using natural language. Results are scoped to tickets associated with the requesting account. |
| Guided Ticket Submission | The agent collects issue title, category, subcategory, priority, description, and location, then calls Power Automate to create a ticket. |
| FAQ Answering | The agent answers common IT questions using a SharePoint-managed FAQ list. |
| Human Agent Handoff | If unresolved after two attempts, the agent summarizes the conversation and posts a handoff card to the Agents Private Channel. |

Example prompts:

```text
What is the status of my ticket?
Any update on INC-00042?
Create a new ticket.
I need help with VPN.
How do I reset my password?
Show my open tickets.
Talk to a person.
Help.
```

### 4.5 Knowledge Base Foundation

Phase 2 will create a SharePoint-based IT FAQ knowledge base that IT administrators can maintain without developer involvement.

Recommended fields:

- Question.
- Answer.
- Category.
- Keywords.
- Status.
- Last Reviewed Date.
- Owner.
- Related Link.
- Escalation Required.

Initial categories may include:

- Password Reset.
- VPN Access.
- Microsoft Teams.
- Outlook.
- Hardware.
- Software Requests.
- Printer Support.
- Account Access.
- Shared Drives.
- Security and MFA.

### 4.6 Human Agent Handoff & Notifications

When the Copilot Agent cannot resolve a request after two attempts, it will summarize the interaction and notify the appropriate IT agents.

Expected handoff process:

1. Employee asks for help.
2. Copilot Agent attempts to answer or guide the user.
3. If unresolved after two attempts, the agent summarizes the conversation.
4. A handoff notification is posted to the Agents Private Channel in Teams.
5. The employee is informed that a human agent will follow up.
6. The IT agent reviews the handoff summary and determines next steps.

The handoff card may include employee name, employee email, request summary, priority, conversation summary, source, timestamp, pending request ID or ticket number, and links to related records or conversations where available.

## 5. Licensing Considerations

The Phase 2 project cost covers professional services only. It does not include Microsoft licenses, Microsoft subscription costs, Copilot Studio capacity, Power BI licenses, Power Platform premium licensing, Fabric capacity, Microsoft 365 Copilot licensing, or any other subscription costs unless explicitly stated in writing.

### 5.1 Microsoft Teams App Package

The branded **IT Helpdesk** Teams app package does not require a separate standalone application license by itself. It surfaces Microsoft 365 experiences, and users must have the appropriate Microsoft Teams and Microsoft 365 licenses for the services shown inside the app.

Publishing, installing, and pinning the app are subject to Rancho Cordova governance, including custom app policies, app permission policies, app setup policies, organizational app catalog approval, and administrator review.

### 5.2 Microsoft Copilot Studio

The IT Helpdesk Copilot Agent requires Microsoft Copilot Studio licensing or eligible Microsoft 365 Copilot licensing depending on deployment model, audience, tenant availability, and capacity requirements.

Rancho Cordova must confirm Copilot Studio availability, licensing, capacity or credits, publishing rights to Teams, and any Microsoft 365 Government tenant constraints.

### 5.3 Power Automate

Power Automate licensing depends on connectors and actions used by Copilot integrations and handoff flows. Premium connectors, custom connectors, Dataverse, HTTP actions requiring premium licensing, external integrations, or advanced Power Platform capabilities may require additional licensing and approval.

### 5.4 Power BI

Power BI dashboards embedded in Teams require appropriate Power BI licenses and permissions. Embedding a report in Teams does not grant report access by itself. Users must have access to the report, workspace or app, appropriate license or capacity-backed access, and RLS-aligned permissions where applicable.

## 6. Deliverables

### 6.1 Audit Deliverables

- Phase 1 feature audit report.
- V1 SOW vs. actual delivered comparison.
- Additional work and enhancement log.
- Gap analysis.
- Recommendations and optional future backlog.

### 6.2 Teams App Deliverables

- IT Helpdesk Teams app manifest.
- Teams app package ZIP file.
- Teams app color icon.
- Teams app outline icon.
- Personal/static tab configuration.
- App deployment instructions.
- App setup policy guidance.

### 6.3 Power BI Deliverables

- Agent Workload & Performance Dashboard.
- Employee Self-Service Ticket History Dashboard.
- IT Leadership Executive Dashboard.
- Power BI workspace publishing support.
- Teams embedding support.
- RLS configuration and validation guidance.

### 6.4 Copilot Agent Deliverables

- IT Helpdesk Copilot Agent.
- Welcome/onboarding topic.
- Ticket status lookup topic.
- Guided ticket submission topic.
- IT FAQ topic.
- Human handoff topic.
- Power Automate integration.
- Teams publishing support.

### 6.5 Knowledge Base Deliverables

- SharePoint FAQ list.
- Recommended FAQ metadata structure.
- Initial FAQ category structure.
- Knowledge base maintenance guidance.

### 6.6 Testing and Handoff Deliverables

- Test plan.
- Test results summary.
- Teams app usage guide.
- Copilot Agent usage guide.
- Power BI dashboard overview.
- Knowledge base maintenance guide.
- Admin deployment and handoff documentation.

## 7. Timeline

Estimated duration: **3 to 4 weeks**.

The final timeline may vary depending on administrator availability, Teams app approval, Power BI workspace access, Copilot Studio licensing, connector licensing review, and validation cycles.

| Workstream | Estimated Timing |
|---|---|
| Phase 1 Feature Audit & Gap Analysis | Week 1 |
| Teams App Package Configuration | Week 1-2 |
| Power BI Dashboard Suite | Week 2-3 |
| Copilot Agent Configuration | Week 2-3 |
| Knowledge Base Foundation | Week 2-3 |
| Human Handoff & Notification Testing | Week 3 |
| Final Testing, Training & Handoff | Week 4 |

## 8. Project Investment

Phase 2 professional services investment: **$4,999 USD**.

This cost covers the professional services described in this SOW, including audit, Teams app package, Power BI dashboard suite, Copilot Agent configuration, knowledge base foundation, human handoff logic, testing, and handoff documentation.

Microsoft licensing costs, subscription costs, premium connector costs, Copilot Studio capacity costs, Power BI licensing costs, Microsoft 365 Copilot licensing costs, Fabric capacity, and other Microsoft subscription costs are excluded unless explicitly stated in writing.

## 9. Assumptions and Dependencies

- Rancho Cordova allows custom Teams apps in the Teams Admin Center.
- Rancho Cordova administrators can upload or approve custom apps in the organizational Teams app catalog.
- Rancho Cordova administrators can configure app permission and setup policies.
- Target users can be assigned app setup policies that install or pin the IT Helpdesk app, if approved.
- Users have appropriate Microsoft 365, Teams, Power BI, Copilot Studio, and Power Platform licensing where required.
- Power BI workspace access will be provided.
- Copilot Studio licensing, capacity, and publishing rights will be confirmed before deployment.
- Required SharePoint lists, libraries, fields, permissions, and ticket data from Phase 1 remain available and stable.
- Existing Power Automate flows remain available for review and integration.
- Shared mailbox, Teams channels, SharePoint site, and Microsoft 365 tenant services remain available.
- Any required premium connector use will be reviewed and approved by Rancho Cordova before production deployment.
- Branding assets, including logo and colors, will be provided or approved by Rancho Cordova.
- Business rules, SLA definitions, dashboard audiences, and FAQ content will be reviewed and confirmed by Rancho Cordova.

## 10. Out of Scope

- Full custom web application development.
- Custom React, SPFx, or full-code Teams application development.
- Custom API development outside approved Microsoft 365 connectors and Power Automate.
- Mobile-specific custom application development.
- Replacement of SharePoint as the system of record.
- Replacement of Power Automate flows with custom code.
- Advanced ITSM processes such as Problem Management or Change Management.
- Asset management or CMDB capabilities.
- AI model training or custom language model development.
- Tenant-wide Teams deployment without administrator approval.
- Complex custom authentication beyond Microsoft 365 / Teams authentication.
- Data migration from other ticketing platforms.
- Advanced Power BI data warehouse architecture.
- Long-term production support after handoff.
- Ongoing FAQ content maintenance after initial configuration.
- Microsoft licensing procurement, subscription purchases, or payment of Microsoft licensing costs.

## 11. Risks and Constraints

| Risk / Constraint | Potential Impact |
|---|---|
| Custom Teams app approval may require admin review | Could delay app deployment or pinning |
| Teams app pinning depends on app setup policies | App may be available but not automatically pinned |
| Some Microsoft 365 surfaces may not render cleanly in Teams tabs | URLs or layouts may need adjustment |
| Power BI licensing or permissions may limit access | Some users may not be able to view dashboards |
| RLS depends on reliable user identity and ticket ownership data | Incorrect metadata could affect report visibility |
| Copilot Studio licensing, capacity, or publishing restrictions may apply | Agent deployment timing may be affected |
| Power Automate premium connectors may be required | Additional Power Platform licensing may apply |
| Existing Phase 1 configuration may need cleanup | Audit findings may affect implementation sequence |
| FAQ quality depends on curated IT content | Weak FAQ content may reduce Copilot usefulness |
| Microsoft 365 GOV tenant limitations may apply | Some capabilities may require adjustment |

## 12. Acceptance Criteria

Phase 2 will be considered complete when:

- The Phase 1 audit report has been delivered.
- The V1 vs. actual delivered comparison has been documented.
- The Teams app package has been created and provided for deployment.
- The Teams app has been tested in Microsoft Teams, subject to administrator approval.
- The agreed personal/static tabs have been configured or documented.
- The three Power BI dashboards have been created.
- Power BI reports have been published to the agreed workspace.
- Dashboard access and RLS behavior have been validated or documented according to agreed scope.
- The Copilot Agent has been configured in Copilot Studio.
- The Copilot Agent has been published or prepared for publishing to Teams.
- Ticket status lookup has been tested.
- Guided ticket submission has been tested.
- FAQ responses have been tested.
- Human handoff notifications have been tested.
- Handoff and administrator documentation has been provided.
- Licensing dependencies and required administrator approvals have been documented.

## 13. Future Phase Opportunities

Phase 2 establishes a foundation for future enhancements, including:

- Advanced self-service portal experience.
- Expanded knowledge base and search experience.
- Ticket deflection analytics.
- Additional Copilot Agent topics.
- Automated ticket classification.
- Predictive SLA risk scoring.
- Asset management integration.
- Change request workflows.
- Problem management workflows.
- Expanded executive analytics.
- Department-level service reporting.
- Long-term IT service management roadmap.

## 14. Authorization

By signing below, both parties acknowledge the scope, assumptions, exclusions, licensing considerations, timeline dependencies, and professional services investment described in this Statement of Work.

| Consulting Organization | City of Rancho Cordova |
|---|---|
| Name: | Name: |
| Title: | Title: |
| Signature: | Signature: |
| Date: | Date: |

