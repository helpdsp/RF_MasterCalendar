# Project Brief: SWUK Central Submissions (Prepayment)

## 1. Project Overview
The **SWUK Central Submissions** project aims to automate and centralize the Prepayment Request data collection and consolidation process for all UK plants within the Smurfit Westrock UK division. The solution resides within the `/GBR-UK-Shared-Services` SharePoint site collection and leverages Microsoft 365 (SharePoint, Power Automate, and Teams) to provide a secure, scalable, and self-managed platform for the **UK Shared Services Finance Team**.

## 2. Business Objectives
- **Centralization**: Provide a single point of truth for all prepayment requests across 23 UK plants for the **UK Shared Services Finance Team**.
- **Security**: Ensure data isolation so each plant can only access and submit its own data, while the Finance Team retains a consolidated view.
- **Automation**: Use **PnP PowerShell 1.5.0** for mass provisioning and Power Automate for monthly data consolidation.
- **Enablement**: Deliver a solution that the **UK Shared Services Finance Team** can self-manage, onboard new plants to, or extend for other financial controls.

## 3. Core Features & Requirements
### 3.1 Plant-Level Submission Experience
- **Dedicated Lists**: 23 plant-specific lists using the standardized "Prepayment Item" Content Type.
- **Security**: Isolation via SharePoint groups (`[Plant Code] Members`) with restricted "Contribute" permissions.
- **Access Points**: Optimized for Microsoft Edge and integrated into **Microsoft Teams** via SharePoint App Tabs and Microsoft List Forms.

### 3.2 Central Consolidation (Hub)
- **Master Lists**: "Prepayment Request Master List" for data and "Plant Master List" for system configuration.
- **Automation Engine**: Power Automate flow (`S2-GBR-UK-Portal@smurfitwestrock.com`) triggered **manually on a monthly basis** by Finance Managers.
- **Data Integrity**: Automatic "sealing" (read-only) of processed items in source plant lists.

### 3.3 Infrastructure Automation
- **Provisioning**: Use of **PnP.PowerShell version 1.5.0** to automate the creation of security groups, lists, and pages for all plants.

## 4. Technical Stack
- **Platform**: SharePoint Online (Site Collection: `/GBR-UK-Shared-Services`).
- **Automation**: Power Automate Cloud Flows & PnP PowerShell 1.5.0.
- **Client**: Microsoft Edge & Microsoft Teams.
- **Security**: SharePoint Security Groups & Item-level permission management.

## 5. Scope
- **In-Scope**:
    - Mass setup of 23 UK plants using PnP PowerShell.
    - Refactoring of the consolidation Power Automate flow for monthly manual triggers.
    - Creation of templates, master lists, and navigation.
    - Testing, documentation, and Knowledge Transfer to the UK Shared Services Finance Team.
- **Out-of-Scope**: ERP/SAP integration, Power BI dashboards, and non-UK rollout.

## 6. Success Criteria
- 100% data isolation between plants.
- Successful monthly consolidation of requests into the Master List.
- Finance team ability to manage the platform and onboard new plants independently.