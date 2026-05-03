# Statement of Work (SOW)  
# IT Issue Tracking Platform V2  
## Phase 2 – Operational Enhancements, Reporting & Teams App Experience

---

## 1. Project Overview

The City of Rancho Cordova has implemented Phase 1 of the IT Issue Tracking Platform using Microsoft 365 services, including Microsoft Teams, Microsoft Forms, SharePoint Online, Power Automate, and related notification capabilities.

Phase 2 builds on that foundation by improving operational visibility, employee self-service, IT agent productivity, reporting, and support automation. This phase introduces a more polished Microsoft Teams experience, Power BI dashboards, a Copilot Studio-based IT Helpdesk Agent, a structured knowledge base foundation, and a formal audit of the features delivered in Phase 1.

The goal of Phase 2 is not to replace the Phase 1 architecture. Instead, Phase 2 enhances the existing solution and packages key capabilities into a more unified, easier-to-access experience for employees, IT helpdesk agents, and IT leadership.

---

## 2. Phase 2 Objectives

The objectives of Phase 2 are to:

- Perform a detailed audit of the existing Phase 1 IT Issue Tracking Platform
- Compare delivered capabilities against the original Phase 1 SOW
- Identify features, enhancements, and configuration work completed beyond the original quote
- Create a branded Microsoft Teams app package named **IT Helpdesk**
- Provide a centralized Teams-based entry point for ticket submission, ticket status visibility, dashboards, knowledge resources, and Copilot support
- Build role-based Power BI dashboards for IT agents, employees, and IT leadership
- Configure an IT Helpdesk Copilot Agent using Microsoft Copilot Studio
- Enable natural language ticket status lookup
- Enable guided ticket submission through conversational interaction
- Create a curated IT FAQ knowledge base foundation
- Support human agent handoff when the Copilot Agent cannot resolve a request
- Improve notification, visibility, and user engagement around IT support requests
- Maintain Microsoft 365 as the core platform without introducing unnecessary third-party systems

---

## 3. Phase 2 Scope of Work

| # | Workstream | Description | Key Deliverables |
|---|---|---|---|
| 4.1 | Existing Feature Audit & V1 Gap Analysis | Perform a detailed review of the existing IT Issue Tracking Platform, including features, flows, lists, libraries, forms, permissions, notifications, and delivered components. | Audit report, V1 vs. actual comparison, enhancement log, recommendations |
| 4.2 | Branded Microsoft Teams App Package | Create a branded Teams app package named **IT Helpdesk** to provide a unified entry point for key solution capabilities. | Teams app manifest, app icons, personal tabs, app package ZIP, deployment guidance |
| 4.3 | Power BI Dashboard Suite | Build three role-based Power BI dashboards and publish them to a Power BI workspace for Teams embedding. | Agent dashboard, employee dashboard, executive dashboard, RLS configuration |
| 4.4 | IT Helpdesk Copilot Agent | Build and deploy a Copilot Studio agent in Microsoft Teams to support ticket lookup, guided ticket submission, FAQ answering, and handoff. | Copilot Agent, topics, Power Automate integrations, Teams deployment |
| 4.5 | Knowledge Base Foundation | Create a curated IT FAQ knowledge base using SharePoint as the manageable source of truth. | SharePoint FAQ list, initial knowledge structure, admin guidance |
| 4.6 | Human Agent Handoff & Notifications | Configure escalation and handoff logic when the Copilot Agent cannot resolve an issue. | Handoff flow, Teams private channel notification, handoff card template |
| 4.7 | Testing, Training & Handoff | Validate all Phase 2 components and provide handoff documentation for ongoing administration. | Test plan, test results, training notes, handoff documentation |

---

## 4.1 Existing Feature Audit & V1 Gap Analysis

Phase 2 includes a formal audit of the current IT Issue Tracking Platform implementation.

The purpose of this audit is to document what was originally quoted, what was actually delivered, and what additional configuration, enhancement, or support work was performed beyond the original Phase 1 scope.

### Included Audit Areas

The audit will review:

- Microsoft Forms ticket intake configuration
- Microsoft Teams channel and tab configuration
- SharePoint ticket intake queue
- SharePoint ticket fields and metadata
- SharePoint views
- Ticket lifecycle statuses
- Power Automate flows
- Notification logic
- Assignment logic
- SLA-related configuration
- User-facing tabs such as **Submit Ticket** and **My Tickets**
- Permissions and visibility model
- Any additional support, configuration, testing, or documentation performed beyond the original quote

### Audit Deliverables

The audit will produce:

- Phase 1 feature inventory
- Original SOW vs. actual delivery comparison
- List of additional features or enhancements delivered beyond the original quote
- Gap analysis
- Recommendations for Phase 2 improvements
- Optional backlog for future phases

---

## 4.2 Branded Microsoft Teams App Package

Phase 2 includes the creation of a branded Microsoft Teams app package named **IT Helpdesk**.

This app package is intended to provide a more polished and centralized experience inside Microsoft Teams. It will not replace the existing SharePoint, Microsoft Forms, Power Automate, Power BI, or Copilot Studio components. Instead, it will package selected entry points into a unified Teams experience.

### Current State

Today, the solution is accessed through a Team and Channel structure:

```text
Microsoft Teams
└── Team: IT Issue Tracking & Support
    └── Channel: Issue Tracking
        ├── Posts
        ├── Shared
        ├── Notes
        ├── Submit Ticket
        └── My Tickets
```

This model remains valid and may continue to be used.

### Proposed Phase 2 Experience

Phase 2 introduces a branded Teams app experience:

```text
Microsoft Teams App Rail
└── IT Helpdesk
    ├── Home
    ├── Submit Ticket
    ├── My Tickets
    ├── Dashboards
    ├── Knowledge Base
    ├── Copilot Agent
    └── About
```

Where permitted by Rancho Cordova’s Teams governance, the app may be uploaded to the organizational Teams app catalog and pinned to the Teams app rail for selected users through Teams app setup policies.

### Included Activities

- Define app name, short description, long description, and branding
- Create or configure required Teams app icons
- Create the Microsoft Teams app manifest
- Configure personal tabs for selected IT Helpdesk experiences
- Link tabs to approved Microsoft 365 assets
- Package the app as a Teams app ZIP file
- Support app testing in Microsoft Teams
- Provide deployment guidance for Teams administrators
- Provide app setup policy guidance for pinning the app to the Teams rail, where permitted

### Proposed App Tabs

| Tab | Purpose |
|---|---|
| Home | Landing page with quick actions and key support links |
| Submit Ticket | Opens the ticket submission form or a simplified Teams-friendly intake page |
| My Tickets | Displays the employee’s open tickets and ticket history |
| Dashboards | Provides access to Power BI reports based on user role |
| Knowledge Base | Provides searchable IT FAQ and support articles |
| Copilot Agent | Provides access to the IT Helpdesk Copilot Agent |
| About | Provides help, support information, and basic usage guidance |

---

## 4.3 Power BI Dashboard Suite

Phase 2 includes three Power BI reports built, published to a Power BI workspace, and embedded as tabs within Microsoft Teams.

Row-Level Security will be considered so each audience sees the appropriate data based on their role and permissions.

### 4.3.1 Agent Workload & Performance Dashboard

This dashboard is designed for daily use by IT helpdesk agents.

It gives each agent a real-time snapshot of their assigned workload, SLA health, closure metrics, and current ticket distribution.

#### Visuals Included

| Visual / Element | What It Shows |
|---|---|
| My Open Tickets – Priority Table | All open tickets assigned to the logged-in agent, sorted by SLA target ascending. Columns include Ticket Number, Title, Priority, Status, SLA Target, and Hours Remaining. |
| SLA Breach Warning Indicator | Tickets with fewer than 2 hours remaining before SLA breach are highlighted as proactive warnings. |
| Closure Metrics – This Week / Month | KPI cards showing tickets closed this week, tickets closed this month, average resolution time, and SLA compliance percentage. |
| Ticket Volume by Category | Bar chart showing the agent’s current-month ticket distribution across IT categories. |

### 4.3.2 Employee Self-Service Ticket History Dashboard

This dashboard is designed for city employees who want visibility into their own support history.

The dashboard is scoped so employees only see tickets associated with their own account.

#### Visuals Included

| Visual / Element | What It Shows |
|---|---|
| My Open Tickets | Active tickets with status badge, priority, assigned agent, and SLA target date. |
| My Ticket History | Full history table with Ticket Number, Title, Category, Priority, Submitted Date, Closed Date, Assigned Agent, and Final Status. |

### 4.3.3 IT Leadership Executive Dashboard

This dashboard is designed for Rob Nunley and IT managers.

It provides operational visibility to evaluate team performance, identify systemic issues, and support resource planning.

#### Visuals Included

| Visual / Element | What It Shows |
|---|---|
| Volume Trend – Weekly & Monthly | Line charts showing total tickets created per week and per month. |
| SLA Compliance Scorecard | Overall SLA compliance KPI and agent-by-agent SLA compliance table. |
| Average Resolution Time Matrix | Average resolution time by category. |
| Top Issue Categories | Ranked bar chart of the top Category/Subcategory combinations. |
| Ticket Submission Heatmap | Matrix showing tickets by day of week and hour of day. |

---

## 4.4 IT Helpdesk Copilot Agent

Phase 2 includes the creation of an IT Helpdesk Copilot Agent using Microsoft Copilot Studio and deployment within Microsoft Teams.

The Copilot Agent will help employees interact with the IT Helpdesk solution using natural language.

### Included Capabilities

| Capability | Description |
|---|---|
| Ticket Status Lookup | Employees can ask questions such as “What’s the status of my ticket?” or “Any update on INC-00042?” The agent returns the current status, assigned agent, and SLA target date. Results are scoped to the requesting employee’s tickets only. |
| Guided Ticket Submission | Employees can start a new ticket through conversation. The agent collects issue title, category, subcategory, priority, description, and location, then calls a Power Automate flow to create the ticket. |
| IT FAQ – Common Question Answering | The agent answers common IT questions from a curated SharePoint-based knowledge base. |
| Human Agent Handoff | If the agent cannot resolve the query after two attempts, it summarizes the conversation and posts a handoff card to the Agents Private Channel in Teams. |
| Onboarding Experience | New users, or users who type “help,” receive a welcome message listing available capabilities and example phrases. |

### Example User Prompts

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

### Copilot Agent Integrations

The Copilot Agent may integrate with:

- SharePoint ticket intake queue
- SharePoint FAQ list
- Power Automate cloud flows
- Microsoft Teams notifications
- Existing ticket metadata
- Existing ticket permissions model

---

## 4.5 Knowledge Base Foundation

Phase 2 includes the creation of a curated IT FAQ knowledge base.

The knowledge base will be managed in SharePoint so IT administrators can maintain questions and answers without developer involvement.

### Included Knowledge Base Fields

Recommended fields include:

- Question
- Answer
- Category
- Keywords
- Status
- Last Reviewed Date
- Owner
- Related Link
- Escalation Required

### Initial FAQ Categories

Possible categories include:

- Password Reset
- VPN Access
- Microsoft Teams
- Outlook
- Hardware
- Software Requests
- Printer Support
- Account Access
- Shared Drives
- Security and MFA

### Purpose

The knowledge base allows the Copilot Agent to answer common IT questions without creating unnecessary tickets.

If a user still needs help after reviewing an answer, the agent can offer to create a ticket or hand off to a human agent.

---

## 4.6 Human Agent Handoff & Notifications

Phase 2 includes human agent handoff functionality for unresolved or escalated requests.

When the Copilot Agent cannot resolve a request after two attempts, it will generate a summary and notify the appropriate IT agents.

### Handoff Process

1. Employee asks for help.
2. Copilot Agent attempts to answer or guide the user.
3. If unresolved after two attempts, the agent summarizes the conversation.
4. A handoff notification is posted to the Agents Private Channel in Teams.
5. The employee is informed that a human agent will follow up.
6. The IT agent can review the handoff summary and determine next steps.

### Handoff Card May Include

- Employee name
- Employee email
- Request summary
- Priority
- Conversation summary
- Source
- Timestamp
- Pending request ID or ticket number
- Link to open or create the ticket
- Link to related Teams conversation if available

---

## 4.7 Testing, Training & Handoff

Phase 2 includes testing, validation, training, and handoff documentation.

### Testing Areas

Testing will include:

- Teams app package loading
- Teams app tab navigation
- Submit Ticket tab behavior
- My Tickets tab behavior
- Power BI report access
- Power BI Row-Level Security behavior
- Copilot Agent welcome experience
- Ticket status lookup
- Guided ticket submission
- FAQ response accuracy
- Human agent handoff
- Teams notifications
- Permissions and access validation

### Training and Handoff Materials

Phase 2 will include:

- Admin deployment guidance
- Teams app usage guide
- Copilot Agent usage guide
- Power BI dashboard overview
- Knowledge base maintenance guide
- Testing checklist
- Handoff documentation

---

## 5. Licensing Considerations

Phase 2 uses Microsoft 365 services already available or expected to be available in Rancho Cordova’s environment. However, some capabilities may require specific licenses, tenant settings, administrator approval, or additional Microsoft subscription capacity.

The Phase 2 project cost covers professional services only. It does not include the cost of Microsoft licenses, Copilot Studio capacity, Power BI licenses, Power Platform premium licenses, Microsoft 365 Copilot licenses, or any other Microsoft subscription costs unless explicitly stated in writing.

### 5.1 Microsoft Teams App Package

The branded **IT Helpdesk** Teams app package does not require a separate standalone application license by itself.

The app package is a Teams shell that surfaces approved Microsoft 365 experiences such as SharePoint, Microsoft Forms, Power BI, and Copilot Studio. Users must have the appropriate Microsoft Teams and Microsoft 365 licenses required to access the services surfaced inside the app.

Publishing, installing, and pinning the app are subject to Rancho Cordova’s Teams app governance, including:

- Custom app policies
- App permission policies
- App setup policies
- Organizational app catalog approval
- Administrator review and deployment approval

### 5.2 Microsoft Teams App Pinning

Pinning the **IT Helpdesk** app to the Teams app rail depends on Rancho Cordova administrator approval and configuration of Teams app setup policies.

If app pinning is not approved, the app may still be made available through the organizational Teams app catalog or through a direct installation link, subject to tenant policy.

For the proposed pinned app experience, the design should prioritize personal/static tabs rather than relying only on configurable channel tabs.

### 5.3 Microsoft Copilot Studio Agent

The IT Helpdesk Copilot Agent requires Microsoft Copilot Studio licensing or eligible Microsoft 365 Copilot licensing, depending on the final deployment model, user audience, and available licensing in Rancho Cordova’s Microsoft 365 GOV tenant.

Rancho Cordova must confirm:

- Copilot Studio availability
- Copilot Studio licensing
- Available capacity or credits
- Microsoft 365 Copilot licensing, if applicable
- Publishing rights to Microsoft Teams
- Any GOV tenant limitations or rollout constraints

If the agent is made available to users who do not have Microsoft 365 Copilot licenses, additional Copilot Studio capacity, credits, or licensing may be required.

### 5.4 Power Automate Licensing

Power Automate licensing depends on the connectors and actions used by the Copilot Agent and related automation flows.

Standard Microsoft 365 connectors may be covered by existing licensing. However, additional licensing may be required if the solution uses:

- Premium connectors
- Custom connectors
- Dataverse
- HTTP actions requiring premium licensing
- External system integrations
- Advanced Power Platform capabilities outside standard Microsoft 365 usage rights

Any required premium licensing must be reviewed and approved by Rancho Cordova before production deployment.

### 5.5 Power BI Licensing

Power BI dashboards embedded in Microsoft Teams require appropriate Power BI licensing and report permissions.

Embedding a report in Teams does not automatically grant access to the report. Users must have:

- Access to the Power BI report
- Access to the Power BI workspace or app, where applicable
- The appropriate Power BI license, unless the content is hosted in an eligible Premium or Fabric capacity
- Proper permissions aligned with Row-Level Security, if RLS is implemented

Power BI licensing and report access must be validated before dashboard rollout.

### 5.6 Licensing Exclusion

This Statement of Work does not include the cost of Microsoft licenses, Microsoft 365 Copilot licenses, Copilot Studio capacity, Power BI licenses, Power Platform premium licenses, Power Automate premium licensing, Fabric capacity, or any other Microsoft subscription costs unless explicitly stated in writing.

---

## 6. Deliverables

### 6.1 Audit Deliverables

- Phase 1 feature audit report
- V1 SOW vs. actual delivered comparison
- Additional work/enhancement log
- Gap analysis
- Recommendations for future improvements

### 6.2 Teams App Package Deliverables

- IT Helpdesk Teams app manifest
- Teams app package ZIP file
- Teams app color icon
- Teams app outline icon
- Personal tab configuration
- App deployment instructions
- App setup policy guidance

### 6.3 Power BI Deliverables

- Agent Workload & Performance Dashboard
- Employee Self-Service Ticket History Dashboard
- IT Leadership Executive Dashboard
- Power BI workspace publishing support
- Teams tab embedding support
- RLS configuration guidance

### 6.4 Copilot Agent Deliverables

- IT Helpdesk Copilot Agent
- Welcome/onboarding topic
- Ticket status lookup topic
- Guided ticket submission topic
- IT FAQ topic
- Human handoff topic
- Power Automate flow integration
- Teams publishing support

### 6.5 Knowledge Base Deliverables

- SharePoint FAQ list
- Recommended FAQ metadata structure
- Initial FAQ category structure
- Knowledge base maintenance guidance

### 6.6 Notification and Handoff Deliverables

- Human handoff workflow
- Teams handoff card
- Agent private channel notification logic
- User confirmation messages

### 6.7 Testing and Documentation Deliverables

- Test plan
- Test results summary
- User guide
- Admin handoff documentation
- Deployment support notes

---

## 7. Timeline

Estimated duration: **3 to 4 weeks**

The final timeline may vary depending on administrator availability, Teams app approval, Power BI workspace access, Copilot Studio licensing, and validation cycles.

### Proposed Workstreams

| Workstream | Estimated Timing |
|---|---|
| Existing Feature Audit & V1 Gap Analysis | Week 1 |
| Teams App Package Configuration | Week 1–2 |
| Power BI Dashboard Suite | Week 2–3 |
| Copilot Agent Configuration | Week 2–3 |
| Knowledge Base Foundation | Week 2–3 |
| Handoff & Notification Testing | Week 3 |
| Final Testing, Training & Handoff | Week 4 |

---

## 8. Project Cost

Phase 2 project cost: **$4,999 USD**

This cost covers the Phase 2 professional services described in this Statement of Work, including the audit, Teams app package, Power BI dashboard suite, Copilot Agent configuration, knowledge base foundation, human handoff logic, testing, and handoff documentation.

Microsoft licensing costs, subscription costs, premium connector costs, Copilot Studio capacity costs, Power BI licensing costs, and Microsoft 365 Copilot licensing costs are excluded unless explicitly stated in writing.

---

## 9. Dependencies and Assumptions

The following assumptions apply to Phase 2:

- Rancho Cordova allows custom Teams apps in the Microsoft Teams Admin Center
- Rancho Cordova administrators can upload or approve custom apps in the organizational Teams app catalog
- Rancho Cordova administrators can configure or update Teams app setup policies
- Target users can be assigned an app setup policy that installs or pins the IT Helpdesk app
- Microsoft Teams app pinning is subject to Rancho Cordova governance and admin approval
- Users have appropriate Microsoft 365 and Power BI licenses
- Power BI workspace access will be provided
- Copilot Studio licensing is available or approved
- Copilot Studio capacity, credits, or required licensing will be confirmed by Rancho Cordova
- Required SharePoint lists, libraries, and fields from Phase 1 are available and stable
- Existing Power Automate flows are available for review and extension
- Existing ticket data is available for Power BI reporting
- The shared mailbox, Teams channels, and SharePoint site remain available
- Any required premium connector usage is approved by Rancho Cordova
- Branding assets, including logo and colors, will be provided or approved by Rancho Cordova
- Business rules, SLA definitions, and FAQ content will be reviewed and confirmed by Rancho Cordova

---

## 10. Out of Scope

The following items are excluded from Phase 2 unless separately scoped and approved:

- Full custom web application development
- Custom React, SPFx, or full-code Teams application development
- Custom API development outside approved Microsoft 365 connectors and Power Automate
- Mobile-specific custom application development
- Replacement of SharePoint as the system of record
- Replacement of Power Automate flows with custom code
- Advanced ITSM processes such as Problem Management or Change Management
- Asset management or configuration management database
- AI model training or custom language model development
- Tenant-wide Teams app deployment without administrator approval
- Complex custom authentication beyond Microsoft 365 / Teams authentication
- Data migration from other ticketing platforms
- Advanced Power BI data warehouse architecture
- Long-term production support after handoff
- Ongoing FAQ content maintenance after initial configuration
- Microsoft licensing procurement or subscription purchases
- Payment of Microsoft licensing, Copilot Studio, Power BI, Power Platform, Fabric, or Microsoft 365 Copilot costs

---

## 11. Risks and Constraints

| Risk / Constraint | Potential Impact |
|---|---|
| Custom Teams app approval may require admin review | Could delay deployment or pinning of the app |
| Teams app pinning depends on app setup policies | The app may be available but not automatically pinned |
| Power BI licensing or permissions may limit access | Some users may not be able to view dashboards |
| Copilot Studio licensing or publishing restrictions may apply | Agent deployment timing may be affected |
| Copilot Studio capacity may be required for broader usage | Additional Microsoft licensing costs may apply |
| Power Automate premium connectors may be required depending on implementation | Additional Power Platform licensing may apply |
| Some SharePoint or Power BI pages may not render perfectly inside Teams tabs | URLs or page layouts may need adjustment |
| Existing Phase 1 configuration may require cleanup before Phase 2 enhancements | Audit findings may affect implementation sequence |
| RLS depends on reliable user identity and ticket ownership data | Incorrect metadata could affect report visibility |
| FAQ quality depends on curated content from IT | Weak FAQ content may reduce Copilot Agent usefulness |
| Microsoft 365 GOV tenant limitations may affect availability or deployment timing | Some capabilities may need adjustment based on tenant constraints |

---

## 12. Realistic Mockup Direction

The Phase 2 mockups should reflect both the current state and the proposed future state.

### 12.1 Current State Mockup

The current-state mockup should show the existing Team and Channel structure:

```text
Team: IT Issue Tracking & Support
Channel: Issue Tracking
Tabs:
- Posts
- Shared
- Notes
- Submit Ticket
- My Tickets
```

This represents the current V1 user experience.

### 12.2 Proposed Phase 2 Teams App Mockup

The proposed-state mockup should show a new app named **IT Helpdesk** available in Microsoft Teams.

The app should be presented as a branded Teams app package with personal tabs:

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

The mockup should clearly label this as:

```text
Proposed Phase 2 – Branded Teams App Experience
```

### 12.3 Realistic Submit Ticket Mockup

The Submit Ticket tab should show a Teams-hosted or Teams-embedded ticket intake experience.

The mockup should show:

- Issue title
- Category
- Subcategory
- Priority
- Location
- Description
- Attachment upload
- Submit button

### 12.4 Realistic My Tickets Mockup

The My Tickets tab should show a user-scoped ticket list.

The mockup should show:

- Ticket Number
- Issue Title
- Priority
- Status
- Assigned Agent
- SLA Target
- Last Updated

### 12.5 Realistic Dashboard Mockup

The Dashboard tab should show Power BI embedded in Teams.

The mockup should show dashboard navigation based on role:

- Agent Workload & Performance
- Employee Ticket History
- IT Leadership Executive View

### 12.6 Realistic Copilot Agent Mockup

The Copilot Agent tab should show a Teams chat-style interface.

Example interaction:

```text
User:
What is the status of my ticket INC-2025-0841?

IT Helpdesk Copilot:
Here is the latest status for ticket INC-2025-0841.

Status: In Progress
Assigned Agent: Alex Parker
SLA Target: May 16, 2025, 10:00 AM

I’m only showing tickets associated with your account.
```

---

## 13. Acceptance Criteria

Phase 2 will be considered complete when:

- The Phase 1 audit report has been delivered
- The V1 vs. actual delivered comparison has been documented
- The Teams app package has been created and provided for deployment
- The Teams app has been tested in Microsoft Teams, subject to admin approval
- The agreed personal tabs have been configured
- The three Power BI dashboards have been created
- Power BI reports have been published to the agreed workspace
- Dashboard access and RLS behavior have been validated
- The Copilot Agent has been configured in Copilot Studio
- The Copilot Agent has been published or prepared for publishing to Teams
- Ticket status lookup has been tested
- Guided ticket submission has been tested
- FAQ responses have been tested
- Human handoff notifications have been tested
- Handoff documentation has been provided
- Licensing dependencies and required admin approvals have been documented

---

## 14. Future Phase Opportunities

Phase 2 establishes a stronger foundation for future enhancements, including:

- Advanced self-service portal experience
- Expanded knowledge base and search experience
- Ticket deflection analytics
- Additional Copilot Agent topics
- Automated ticket classification
- Predictive SLA risk scoring
- Asset management integration
- Change request workflows
- Problem management workflows
- Expanded executive analytics
- Department-level service reporting
- Long-term IT service management roadmap

---

## 15. Summary

Phase 2 enhances the Rancho Cordova IT Issue Tracking Platform by improving visibility, user experience, automation, and reporting around the existing Phase 1 foundation.

The proposed enhancements introduce a branded Microsoft Teams app package, role-based Power BI dashboards, a Copilot Studio-based IT Helpdesk Agent, a curated FAQ knowledge base, and human handoff logic.

The investment for Phase 2 is **$4,999 USD** for professional services.

Microsoft licensing costs, Copilot Studio capacity, Power BI licensing, Power Platform premium licensing, Microsoft 365 Copilot licensing, and other Microsoft subscription costs are excluded unless explicitly stated in writing.

The solution remains aligned with Microsoft 365 and is designed to improve adoption, reduce support friction, and give IT leadership better operational insight without requiring a full third-party ticketing platform.
