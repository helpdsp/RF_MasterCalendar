# IT Issue Tracking Platform V1
## Solution Architecture — Component Descriptions

**City of Rancho Cordova | Microsoft 365 Government Tenant | Version 1.0 | May 2026**

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [SharePoint Online — Site Collection & Infrastructure](#2-sharepoint-online--site-collection--infrastructure)
   - 2.1 [SharePoint Lists](#21-sharepoint-lists)
   - 2.2 [Document Library — Ticket](#22-document-library--ticket)
   - 2.3 [Security Groups & Item-Level Permissions](#23-security-groups--item-level-permissions)
3. [Microsoft Teams — IT Issue Tracking & Support Team](#3-microsoft-teams--it-issue-tracking--support-team)
4. [Microsoft Forms — Ticket Intake Form](#4-microsoft-forms--ticket-intake-form)
5. [Microsoft Outlook — Shared Mailbox (Email Intake)](#5-microsoft-outlook--shared-mailbox-email-intake)
6. [SharePoint Term Store — Managed Taxonomy](#6-sharepoint-term-store--managed-taxonomy)
7. [Power Automate — Automation Flows](#7-power-automate--automation-flows)
   - 7.1 [Flow 1 — Provision Ticket Flow](#flow-1--it-issue-tracking-platform-provision-ticket-flow)
   - 7.2 [Flow 2 — Intake On Change](#flow-2--it-issue-tracking-platform-intake-on-change)
   - 7.3 [Flow 3 — Forms-to-Ticket Flow](#flow-3--it-issue-tracking-platform-forms-to-ticket-flow)
   - 7.4 [Flow 4 — Email-to-Ticket Flow](#flow-4--it-issue-tracking-platform-email-to-ticket-flow)
   - 7.5 [Flow 5 — SLA Breach Flow](#flow-5--it-issue-tracking-platform-sla-breach-flow)
8. [AI Builder — Intelligent Processing](#8-ai-builder--intelligent-processing)
9. [End-to-End Data Flow](#9-end-to-end-data-flow)
10. [Key Design Decisions & Architectural Notes](#10-key-design-decisions--architectural-notes)

---

## 1. Executive Summary

The IT Issue Tracking Platform is a fully integrated, Microsoft 365-native helpdesk solution purpose-built for the City of Rancho Cordova. Delivered entirely within the city's Microsoft 365 Government (GCC) tenant, the platform enables employees to report IT issues through multiple intake channels — Microsoft Teams, a Microsoft Form, and email — while providing helpdesk agents with a centralized, structured workspace to manage, triage, and resolve those issues end-to-end.

The solution replaces ad-hoc email-based support workflows with a governed, automated, and auditable ticketing system. It enforces Service Level Agreements (SLAs), routes tickets to the correct support agents based on configurable category and subcategory rules, applies item-level security so that each employee sees only their own tickets, and proactively notifies both employees and agents at every key lifecycle event via Teams adaptive cards and email.

No third-party software licenses or external infrastructure are required. All components run natively on the Microsoft Power Platform and Microsoft 365 services already licensed by the city.

### Technology Stack Overview

| Layer | Technology | Role |
|---|---|---|
| Data & Content | SharePoint Online (GCC) | Master database, document libraries, configuration lists |
| Automation | Power Automate (5 flows) | Ticket provisioning, routing, SLA, notifications, intake |
| User Interface | Microsoft Teams | Primary channel for employees and agents |
| Intake — Form | Microsoft Forms | Structured ticket submission with file attachments |
| Intake — Email | Microsoft Outlook (shared mailbox) | Email-based ticket creation and thread updates |
| AI Processing | AI Builder (Power Platform) | Prompt-based description clean-up and classification |
| Taxonomy | SharePoint Term Store | Managed metadata for categories, subcategories, locations |

---

## 2. SharePoint Online — Site Collection & Infrastructure

The SharePoint site collection serves as the backbone of the platform. It hosts every configurable data structure — tickets, routing rules, SLA parameters, holiday calendars, and location records — and provides the underlying security framework that governs who can see and interact with which tickets.

- **Site Collection URL:** `https://cityofranchocordovaorg.sharepoint.com/sites/ITHelpdesk`
- **Site Type:** Communication Site (IT Help Desk)

---

### 2.1 SharePoint Lists

#### IT Ticket Intake Queue

This is the central data store for the entire platform — the equivalent of a ticketing database. Every ticket created through any intake channel (Teams form, email, or future integrations) is recorded as a list item in this list. The list serves as the single source of truth for ticket status, assignment, categorization, and history.

| Field / Column | Purpose |
|---|---|
| Title | Ticket subject line, used as the primary display label |
| Ticket Number | Auto-generated unique identifier (e.g., INC-00042), padded and sequential |
| Requested By | Person column linked to the employee who submitted the ticket |
| Assigned To | Person column for the helpdesk agent responsible for resolution |
| Category / Subcategory | Managed metadata fields sourced from the Term Store term set |
| Priority | Ticket urgency level: Low, Normal, or High — drives SLA calculation |
| Ticket Status | Lifecycle state: New, In Progress, Waiting on User, Closed |
| Issue Description | Full text of the problem statement provided by the employee |
| Source | How the ticket was submitted: Forms, Outlook, or Other |
| SLA Target | Computed due date/time by which the ticket must be resolved |
| SLA Breached | Boolean flag set automatically by the SLA Breach flow when overdue |
| Ticket Closed Date | Timestamp recorded when an agent sets status to Closed |
| Location | City office location associated with the request |
| Message ID | Email message identifier used to correlate email thread replies to the ticket |

---

#### IT Helpdesk Settings

A configuration list that acts as the platform's global settings store. Rather than hard-coding operational parameters in flow logic, all time-sensitive values are stored here so administrators can update them without touching any flow definition. This list drives business-hours enforcement and SLA hour allocation.

| Setting | Description |
|---|---|
| Office Start Time | The time (e.g., 8:00 AM Pacific) at which the business day begins for SLA calculation purposes |
| Office End Time | The time (e.g., 5:00 PM Pacific) at which the business day ends |
| SLA — Low Priority | Number of business hours allocated to resolve a Low-priority ticket |
| SLA — Normal Priority | Number of business hours allocated to resolve a Normal-priority ticket |
| SLA — High Priority | Number of business hours allocated to resolve a High-priority ticket |
| Location Settings | Per-location details such as address and supported hours for each city office |

---

#### IT Helpdesk Routing

The routing list is the intelligence layer that enables automatic ticket assignment. Each row in this list maps a specific Category + Subcategory combination to a designated support agent, an optional backup agent, and the corresponding Term Store IDs needed for managed metadata lookups. When a new ticket arrives, the Provision Ticket Flow queries this list to determine the correct assignee based on the ticket's category and subcategory values.

| Field | Description |
|---|---|
| Category | The top-level support category (e.g., Hardware, Software, Network) |
| Subcategory | The specific issue type within the category (e.g., Laptop, VPN, Printer) |
| Category Term ID | The SharePoint Term Store GUID for the Category managed metadata value |
| Subcategory Term ID | The SharePoint Term Store GUID for the Subcategory managed metadata value |
| Assigned Agent | The primary helpdesk agent responsible for this category/subcategory combination |
| Backup Agent | A secondary agent used when the primary agent is unavailable |

---

#### IT Helpdesk Holidays

A calendar list that stores every official city holiday by date. The SLA calculation engine in the Provision Ticket Flow reads this list at the moment a ticket is created to determine which dates must be excluded from the SLA countdown. This ensures that due dates are never set on days when the helpdesk is closed, and that business-hours counting skips over holiday dates entirely.

---

#### IT Helpdesk Locations

A reference list that stores the city offices and locations where IT support is delivered. Location data drives ticket categorization and can be referenced in routing rules and reporting. Confirmed locations include City Hall and the Rancho Cordova offices.

---

### 2.2 Document Library — Ticket

A SharePoint document library named **Ticket** was provisioned during the initial build to support a document-set-per-ticket architecture. The original design called for each ticket to have a dedicated document set (a folder-like container in SharePoint) holding a generated PDF summary of the ticket. While the Document Set Content Type (IT Ticket Document Set) and document generation logic were fully built and are still present in the Provision Ticket Flow definition, this capability was subsequently deprioritized and is not actively used in the current release. The library and content type remain in place for a potential future activation.

---

### 2.3 Security Groups & Item-Level Permissions

Three SharePoint security groups govern access to the IT Help Desk site collection. The Provision Ticket Flow dynamically applies item-level permissions to each ticket record immediately after creation, ensuring employees can only see their own submitted tickets in the list view.

| Security Group | SharePoint Role | Members |
|---|---|---|
| Requesters | Site Visitors | All City of Rancho Cordova employees who may submit support tickets |
| Helpdesk Agents | Site Members | IT helpdesk staff responsible for working and resolving tickets |
| Helpdesk Managers | Site Owners | IT managers and administrators with full site and configuration access |

At ticket creation, the Provision Ticket Flow removes the default site permission inheritance on the new list item, then explicitly grants read/write access to the submitting employee and the assigned agent only. This means that when employees view the ticket list in Teams, they see exclusively their own tickets — not other employees' records.

---

## 3. Microsoft Teams — IT Issue Tracking & Support Team

Microsoft Teams is the primary user interface for both employees and helpdesk agents. A dedicated Teams team called **IT Issue Tracking & Support** serves as the hub for all ticket-related activity. This team is accessible to all city employees and all helpdesk agents, organized into two distinct channels that serve different audiences.

---

### 3.1 Issue Tracking Channel (Employee-Facing)

The Issue Tracking Channel is the main workspace for city employees. It is where employees submit new tickets, monitor their open issues, and receive real-time status updates delivered as adaptive cards.

| Tab / Feature | Description |
|---|---|
| Submit a Ticket (Form Tab) | A pinned tab that loads the Ticket Intake Microsoft Form directly inside Teams, allowing employees to complete a structured intake form without leaving the Teams application |
| IT Ticket Intake Queue (List Tab) | A pinned tab displaying the SharePoint IT Ticket Intake Queue list, filtered by item-level permissions so each employee sees only their own tickets |
| Adaptive Card Notifications | Status-change notifications are delivered directly into the employee's Teams activity feed. Cards appear when a ticket moves to In Progress, Waiting on User, or Closed |

---

### 3.2 Agents Private Channel (Agent-Facing)

The Agents Private Channel is a restricted workspace visible only to helpdesk agents and managers. It provides agents with their own dedicated view of the IT Ticket Intake Queue, showing all tickets assigned to them, along with full ticket details and action capabilities.

| Tab / Feature | Description |
|---|---|
| IT Ticket Intake Queue (List Tab) | Same SharePoint list as the employee view, but agents see all tickets assigned to them across all requesters. Agents can update status, add notes, and manage ticket resolution directly from this tab |
| Agent Notifications | When a ticket is reassigned or when a category/subcategory is changed, the newly assigned agent receives a Teams notification card alerting them to the change |

---

## 4. Microsoft Forms — Ticket Intake Form

A Microsoft Form named **Ticket Intake** serves as the structured intake channel for employees who prefer to report issues through a guided questionnaire. The form is surfaced as a tab inside the Issue Tracking Channel in Teams, providing a seamless, in-application experience that requires no browser navigation.

---

### 4.1 Form Fields

| Field | Type | Description |
|---|---|---|
| Your Name / Email | Text / Auto-populated | Captured from the submitter's Microsoft 365 identity |
| Location | Choice | The city office location relevant to the support request |
| Category | Choice | Top-level issue category (sourced from the managed taxonomy) |
| Subcategory | Choice | Specific issue type within the selected category |
| Issue Title | Short text | A brief one-line description of the problem |
| Issue Description | Long text | Detailed explanation of the issue, steps to reproduce, and impact |
| Priority | Choice | Self-reported urgency: Low, Normal, or High |
| Attachments | File Upload | Employees can drag-and-drop or browse to attach supporting files (screenshots, logs, documents). Multiple files are supported. |

---

### 4.2 Attachment Handling

File attachments submitted through the form are processed by the Forms-to-Ticket Flow. The flow reads each attachment from the form submission, retrieves the file content, and uploads each file as a native SharePoint list item attachment on the corresponding ticket record in the IT Ticket Intake Queue. This means agents see the files directly attached to the ticket in SharePoint and Teams — no separate link or storage location is required.

---

## 5. Microsoft Outlook — Shared Mailbox (Email Intake)

A shared mailbox at **ithelpdesk@cityofranchocordova.org** provides an email-based ticket intake channel. Employees who prefer email — or who need to forward an existing email thread as a support request — can send a message to this address. The Email-to-Ticket Flow monitors this mailbox continuously and processes every inbound message.

---

### 5.1 New Ticket via Email

When a message arrives at the shared mailbox and its subject line does not contain an existing ticket number, the flow creates a new ticket in the IT Ticket Intake Queue. The email body is processed through AI Builder to extract a clean, plain-text issue description (stripping HTML formatting). The sender's Microsoft 365 identity is resolved via the Get User Profile action to populate the Requested By field. Default category and subcategory values are applied, which agents can reclassify after review. The original email is exported as an .EML file and attached to the ticket record for reference.

---

### 5.2 Thread Reply / Ticket Update via Email

If the subject of an inbound email contains a recognized ticket number (e.g., INC-00042), the flow identifies the match and updates the existing ticket record rather than creating a duplicate. This allows employees to send follow-up information by replying to any email notification they receive — the reply is automatically correlated to the correct ticket.

---

### 5.3 8x8 Voicemail Integration

The platform includes a specialized processing path for voicemail notifications generated by the city's 8x8 phone system. When 8x8 delivers a voicemail notification email to the shared mailbox (identified by a subject line that begins with "New voicemail from"), the Email-to-Ticket Flow detects this pattern and switches to a voicemail-specific extraction routine.

The flow parses the HTML body of the 8x8 notification email to locate and extract the call transcript section, isolating the plain-text transcript content from the surrounding HTML markup using `indexOf` and `substring` expressions anchored to the landmark tag `Transcript </span></h1>`. This transcript is then used as the Issue Description for the newly created ticket.

This means that when a city employee leaves a voicemail on the IT helpdesk line, a ticket is automatically created in the system with the voicemail transcript as the issue description — no manual data entry is required from the agent.

---

## 6. SharePoint Term Store — Managed Taxonomy

The SharePoint Term Store provides the managed metadata taxonomy that drives ticket categorization throughout the platform. Two term sets are maintained: **Category/Subcategory** and **Location**.

---

### 6.1 Category / Subcategory Term Set

This hierarchical term set defines all supported issue types. The top-level terms represent major support categories (e.g., Hardware, Software, Network, Access & Identity). Each category contains child terms representing specific subcategories (e.g., Hardware > Laptop, Hardware > Printer, Network > VPN).

Every term in this set has a globally unique Term ID (GUID). The IT Helpdesk Routing list maps each Category + Subcategory combination to a support agent using these Term IDs. The Power Automate flows use Term IDs — rather than display labels — to set and read managed metadata fields reliably, ensuring that metadata operations are locale-independent and consistent across flow runs.

---

### 6.2 Location Term Set

A separate term set holds the city's office locations as managed terms. Location values on ticket records are sourced from this term set, ensuring consistent location labeling across all tickets and reports.

---

## 7. Power Automate — Automation Flows

Five Power Automate flows form the automation backbone of the platform. Each flow handles a distinct phase of the ticket lifecycle. All flows run within the Rancho Cordova Microsoft 365 Government tenant and connect to SharePoint, Microsoft Teams, Microsoft Forms, Outlook, and AI Builder using standard connector authentication.

---

### Flow 1 — IT Issue Tracking Platform: Provision Ticket Flow

**Trigger:** When an item is created in the IT Ticket Intake Queue SharePoint list

This is the most complex and consequential flow in the platform. It fires immediately whenever a new item is added to the IT Ticket Intake Queue — regardless of whether the ticket came from a form submission, an email, or any future intake channel. It orchestrates every aspect of ticket initialization: number generation, routing, SLA calculation, item-level security, notifications, and document set creation.

---

#### 7.1.1 Ticket Number Generation

Upon triggering, the flow generates a unique, human-readable ticket number in the format **INC-XXXXX** (e.g., INC-00042). A counter variable is initialized and incremented based on existing ticket count or a sequential ID, then zero-padded to five digits and prefixed with "INC-". The generated number is written back to the Ticket Number column on the list item via an HTTP request to the SharePoint REST API.

---

#### 7.1.2 Source Detection

The flow inspects the **Source** field on the newly created ticket item to determine whether it originated from Microsoft Forms, Outlook email, or another channel. A Switch action branches the flow into source-specific processing paths. This distinction matters because the document set creation and attachment-handling steps differ between the form and email intake paths.

---

#### 7.1.3 Automatic Ticket Routing

The flow reads the Category and Subcategory values from the new ticket, then queries the IT Helpdesk Routing list to find the routing record whose Category Term ID and Subcategory Term ID match the ticket's managed metadata values. The matching row returns the designated support agent. The flow then resolves that agent's full user profile (display name, email, Azure AD ID) using the Get User Profile action, and writes the agent's details to the Assigned To column on the ticket.

If no routing match is found — for example, when a ticket arrives via email and no category has been assigned yet — the flow applies a default assignment so the ticket is never left unowned. The routing list also supports a Backup Agent field; if the primary agent is identified as unavailable, the flow assigns the ticket to the backup agent instead.

---

#### 7.1.4 SLA Calculation (Business-Hours Aware)

The SLA calculation engine is the most sophisticated component of the Provision Ticket Flow. It computes a SLA Target date/time that accounts for office hours, weekends, and holidays — not raw calendar time. The calculation process works as follows:

1. The flow reads the ticket's Priority field (Low, Normal, or High) and looks up the corresponding SLA hour allocation from the IT Helpdesk Settings list (e.g., 4 hours for High, 8 hours for Normal, 16 hours for Low).
2. The ticket creation timestamp is converted to Pacific Standard Time.
3. The flow reads all holiday dates from the IT Helpdesk Holidays list and stores them as an in-memory array.
4. Starting from the ticket creation time, the engine walks forward through business hours only: it tracks how many hours remain in the current workday, checks whether each day is a weekend or a holiday, and advances the date to the next valid business day when a day boundary is crossed.
5. This loop continues until the full SLA hour allocation has been consumed, at which point the resulting date and time becomes the **SLA Target**.
6. The SLA Target is written to the ticket record. The SLA Breach Flow subsequently monitors this field to detect overdue tickets.

---

#### 7.1.5 Item-Level Security

SharePoint lists by default allow all site members to see all items. The Provision Ticket Flow breaks this behavior by applying unique item-level permissions to each new ticket:

- The flow sends an HTTP request to the SharePoint REST API to **break the permission inheritance** on the specific list item.
- It then explicitly grants Contribute access to the submitting employee (Requested By) and to the assigned helpdesk agent.
- Helpdesk managers (Site Owners) retain full access to all items by virtue of their site ownership role.
- The same item-level permission logic is applied to the corresponding Document Set if one is created.

The practical effect is that employees navigating to the IT Ticket Intake Queue list in Teams see only their own tickets — not any other employee's support history.

---

#### 7.1.6 New Ticket Notifications

After provisioning is complete, the flow dispatches two categories of notifications:

- **Email to the employee:** A confirmation email is sent to the requester's mailbox acknowledging receipt of the ticket, providing the ticket number, and communicating the SLA target date.
- **Teams card to the assigned agent:** An adaptive card is posted to the agent in Microsoft Teams, summarizing the ticket details (number, title, category, subcategory, priority, SLA target, and a link to the ticket in SharePoint).

---

#### 7.1.7 Document Set Creation (Reserved)

The flow contains fully implemented logic to create a SharePoint Document Set in the Ticket document library for each new ticket, and to update the document set's metadata properties with ticket details. This capability was built but subsequently set aside in the current release. The flow branches remain in the definition and can be reactivated in a future version to support automated document generation (e.g., PDF ticket summaries).

---

### Flow 2 — IT Issue Tracking Platform: Intake On Change

**Trigger:** When an item is created or modified in the IT Ticket Intake Queue SharePoint list

This flow responds to any change on any ticket record. It evaluates what changed and dispatches the appropriate notification or performs the appropriate action. It is the primary engine for keeping employees and agents informed throughout the ticket lifecycle.

---

#### 7.2.1 Change Detection

The flow uses the **Get Changes for an Item** action to retrieve a record of which specific fields were modified in the current update. This allows the flow to take targeted action only on relevant changes — for example, sending a "ticket closed" notification only when the Ticket Status field transitions to Closed, not on every minor edit.

---

#### 7.2.2 Status-Based Notification Routing

| Status Transition | Action Taken |
|---|---|
| → In Progress | A Teams adaptive card is posted to the assigned agent confirming the ticket is now active. A Teams card is also sent to the employee informing them their ticket is being worked on. |
| → Waiting on User | An email and/or Teams message is sent to the requesting employee indicating that the agent needs additional information to proceed. |
| → Closed | The Closed Date timestamp is written to the ticket record. Item-level permissions are updated to make the ticket read-only for the employee. A confirmation email is sent to the employee summarizing the resolution. A Teams card notifies the agent that the ticket has been closed. |

---

#### 7.2.3 Category / Subcategory Re-routing

When an agent changes the Category or Subcategory on an existing ticket (a common scenario for tickets that arrive via email with no initial classification), the flow detects this change and automatically re-evaluates the routing. It queries the IT Helpdesk Routing list using the new category/subcategory Term IDs, identifies the correct agent, updates the Assigned To field on the ticket, and sends a notification to the newly assigned agent.

---

### Flow 3 — IT Issue Tracking Platform: Forms-to-Ticket Flow

**Trigger:** When a new response is submitted in the Ticket Intake Microsoft Form

This flow is the bridge between the Microsoft Forms intake experience and the SharePoint ticketing database. When an employee submits the Ticket Intake form, this flow runs, extracts every field value from the form response, enriches the data, and creates a structured ticket item in the IT Ticket Intake Queue list.

---

#### 7.3.1 Form Response Extraction

The flow calls the **Get Response Details** action, which retrieves the complete set of field values for the submitted form response. Each field value (category, subcategory, priority, location, issue title, and description) is mapped to the corresponding SharePoint list column.

---

#### 7.3.2 AI-Powered Description Enhancement

The raw issue description text entered by the employee is passed to an AI Builder custom prompt via the **Run a Prompt** action. The AI model processes the description, corrects grammatical errors, removes informal language, and produces a clean, professional version of the issue text. This enhanced description is stored in the Issue Description field on the ticket, ensuring that ticket records maintain a consistent, professional quality regardless of how the employee phrased their original input.

---

#### 7.3.3 Category/Subcategory Term ID Resolution

Because managed metadata fields in SharePoint require Term IDs (GUIDs) rather than display labels, the flow uses a Switch action to map the selected category and subcategory text values from the form to their corresponding Term IDs. These IDs are sourced from the IT Helpdesk Routing list and used when writing the managed metadata columns on the new ticket item.

---

#### 7.3.4 Attachment Transfer

If the employee attached one or more files to the form submission, the flow processes each attachment individually:

1. The flow retrieves the count and list of attachments from the form response.
2. For each attachment, it retrieves the binary file content from the Forms storage location.
3. It then uploads the file as a native list item attachment on the newly created SharePoint ticket item using the Add Attachment action.
4. The file name and content type are preserved during the transfer.

Agents who open the ticket in SharePoint or Teams see the attachments directly on the ticket record — exactly as if the employee had attached the files manually.

---

#### 7.3.5 Ticket Record Creation

After all enrichment steps are complete, the flow creates the ticket item in the IT Ticket Intake Queue list with all fields populated: Requested By (resolved from the submitter's M365 profile), Category and Subcategory (as managed metadata Term IDs), Priority, Location, Issue Title, Issue Description (AI-enhanced), and Source (set to "Forms"). Upon item creation, the Provision Ticket Flow automatically fires to complete the remaining provisioning steps.

---

### Flow 4 — IT Issue Tracking Platform: Email-to-Ticket Flow

**Trigger:** When a new email arrives in the ithelpdesk@cityofranchocordova.org shared mailbox

This flow monitors the IT helpdesk shared mailbox in real time. Every inbound email is evaluated, classified, and either used to create a new ticket or to update an existing one.

---

#### 7.4.1 New Ticket vs. Thread Reply Detection

The flow reads the subject line of every inbound email and searches for a ticket number pattern (e.g., INC-XXXXX). If no ticket number is found in the subject, the email is treated as a new ticket request. If a matching ticket number is found, the flow retrieves the corresponding ticket from the IT Ticket Intake Queue list and appends the email content to that ticket as an update.

---

#### 7.4.2 8x8 Voicemail Detection and Transcript Extraction

The flow contains a dedicated conditional branch that activates when the email subject begins with "New voicemail from" — the signature format used by the city's 8x8 telephone system for voicemail-to-email notifications. In this branch:

1. The flow parses the HTML body of the voicemail notification email.
2. It locates the transcript section by searching for the HTML landmark `Transcript </span></h1>`.
3. It extracts the plain-text transcript content using `substring` and `indexOf` expressions, stripping all surrounding HTML tags via a final `split('>').last()` operation.
4. The extracted transcript becomes the **Issue Description** for the new ticket.

This integration ensures that employees who call the IT helpdesk line and leave a voicemail automatically have a ticket created on their behalf, with the voicemail transcript as the problem description. No agent intervention is needed to manually create the ticket from the voicemail.

---

#### 7.4.3 HTML-to-Text Conversion via AI Builder

For standard (non-voicemail) emails, the raw HTML email body is passed to an AI Builder custom prompt using the **Run a Prompt** action. The prompt instructs the AI model to strip all HTML formatting, remove quoted reply chains, and return a clean, readable plain-text summary of the issue. This processed text is used as the Issue Description on the new ticket.

---

#### 7.4.4 EML Attachment

For new tickets created from inbound emails, the flow exports the original email as an **.EML file** using the Export Email action and attaches it to the newly created SharePoint ticket item using the Add Attachment action. This preserves the complete original email — including headers, formatting, and any email attachments — as part of the ticket record.

---

#### 7.4.5 Sender Identity Resolution

The flow resolves the sender's email address to a Microsoft 365 user profile using the **Get User Profile** action. This populates the Requested By field with the sender's structured identity (display name, email, Azure AD object ID), ensuring the ticket is properly linked to the employee's account even when submitted via email.

---

### Flow 5 — IT Issue Tracking Platform: SLA Breach Flow

**Trigger:** Scheduled recurrence — runs every 15 minutes

The SLA Breach Flow is a time-based monitoring agent that continuously scans the IT Ticket Intake Queue for tickets whose SLA Target has passed without being closed. It enforces SLA accountability by flagging overdue tickets and alerting the responsible agents.

---

#### 7.5.1 Overdue Ticket Query

Every 15 minutes, the flow queries the IT Ticket Intake Queue list using a server-side OData filter:

```
(TicketStatus ne 'Closed') and (SLATarget lt '<current UTC timestamp>')
```

This filter efficiently identifies all tickets that are both still open and past their SLA deadline, without loading the entire list into memory.

---

#### 7.5.2 Breach Flag and Notification

For each ticket identified as overdue, the flow updates the **SLA Breached** field on the ticket record to `True` using an HTTP PATCH request to the SharePoint REST API. This flag can be used by agents, managers, and reporting dashboards to quickly identify which tickets are out of compliance. The flow is designed to accommodate additional notification steps — such as sending escalation emails or Teams alerts to the assigned agent and their manager — within the Apply to Each loop.

---

## 8. AI Builder — Intelligent Processing

AI Builder, part of the Microsoft Power Platform, is used in two flows (Forms-to-Ticket and Email-to-Ticket) to apply AI-powered text processing to raw ticket descriptions. A custom prompt — shared between both flows and identified by the same prompt record ID — is invoked via the **Run a Prompt** action.

The prompt receives the raw issue description text — whether typed by the employee in the form or extracted from an email body — and instructs the AI model to:

- Remove HTML tags, encoded characters, and email formatting artifacts
- Eliminate quoted reply chains and forwarded message headers from email submissions
- Correct spelling, grammar, and capitalization
- Produce a concise, professional, plain-text summary of the reported issue

The processed output is stored as the Issue Description on the ticket record. This ensures that all tickets in the system maintain a consistent, readable quality, regardless of the communication style of the original submitter.

---

## 9. End-to-End Data Flow

The following table summarizes the complete journey of a ticket from submission to closure.

| Stage | Actor | Component(s) | Outcome |
|---|---|---|---|
| 1. Submission | Employee | Teams (Form tab) or Outlook or Teams (List tab) | Employee provides issue details and optional attachments |
| 2. Intake Processing | Forms-to-Ticket Flow or Email-to-Ticket Flow | Microsoft Forms / Outlook, AI Builder | Data extracted, AI-enhanced, ticket item created in IT Ticket Intake Queue |
| 3. Provisioning | Provision Ticket Flow | SharePoint, Term Store, Routing List, Settings List, Holidays List | Ticket number assigned, agent routed, SLA calculated, permissions set, notifications sent |
| 4. Agent Work | Helpdesk Agent | Teams (Agents Private Channel), SharePoint List | Agent reviews ticket, updates status, communicates with employee |
| 5. Status Notifications | Intake On Change Flow | SharePoint, Teams, Outlook | Employee and agent notified of each status change via Teams cards and email |
| 6. SLA Monitoring | SLA Breach Flow (every 15 min) | SharePoint IT Ticket Intake Queue | Overdue open tickets flagged with SLA Breached = True |
| 7. Re-routing | Intake On Change Flow | SharePoint Routing List, Teams | Category/Subcategory changes trigger automatic reassignment and agent notification |
| 8. Closure | Helpdesk Agent | SharePoint, Teams, Outlook | Status set to Closed, closed date recorded, permissions tightened, employee notified |

---

## 10. Key Design Decisions & Architectural Notes

### 10.1 No Third-Party Software

The entire platform runs on services included in the city's existing Microsoft 365 Government license. SharePoint Online, Power Automate, Microsoft Forms, Teams, Outlook, AI Builder, and the SharePoint Term Store are all standard M365 components. There are no additional vendor contracts, external APIs, or subscription costs associated with running this solution.

---

### 10.2 Configuration-Driven Behavior

SLA hours, office start/end times, and location details are all stored in the IT Helpdesk Settings list — not hard-coded in flow expressions. Holiday exclusions are stored in the IT Helpdesk Holidays list. Routing rules are stored in the IT Helpdesk Routing list. This means that IT managers can change SLA policy, add new support categories, assign different agents, or add new holiday dates simply by editing list items — with no flow edits required.

---

### 10.3 Managed Metadata for Taxonomy

Using the SharePoint Term Store for categories, subcategories, and locations — rather than simple choice columns — provides several benefits: terms are centrally managed and reusable across lists, Term IDs are stable GUIDs that flows can rely on even if display labels change, and future reporting tools can group and filter by managed metadata consistently.

---

### 10.4 Dual-Channel User Experience

The IT Ticket Intake Queue list is surfaced in both the employee-facing Issue Tracking Channel and the agent-facing Agents Private Channel in Teams. Both views show the same underlying list — filtered by item-level permissions — so there is no data duplication. Agents see all tickets assigned to them; employees see only their own submissions.

---

### 10.5 AI Builder for Text Quality

Rather than storing raw, unformatted email bodies or informal form text as ticket descriptions, the platform passes every incoming description through an AI Builder custom prompt. This elevates the quality and readability of the ticket record, reduces the cognitive load on agents reviewing new tickets, and produces cleaner data for future reporting.

---

### 10.6 SLA Precision via Business-Hours Calculation

SLA due dates are calculated in business hours — not calendar hours. The calculation excludes weekends and holidays read from the Holidays list, and respects the office start/end times from the Settings list. This means a High-priority ticket submitted at 4:45 PM on a Friday before a Monday holiday will correctly have its SLA Target set to a time on Tuesday morning, not over the weekend.

---

### 10.7 8x8 Voicemail Auto-Ticketing

The Email-to-Ticket Flow's voicemail detection path ensures that the helpdesk phone line is a fully integrated intake channel alongside Teams and form submission. Callers who leave a voicemail receive the same ticket-creation experience — including a ticket number and confirmation — as employees who submit via the form. The HTML parsing logic extracts the transcript directly from the 8x8 notification email body without any additional integration or API connection to the phone system.

---

*End of Document — IT Issue Tracking Platform, Solution Architecture v1.0*
*City of Rancho Cordova | Confidential — Internal Use Only*
