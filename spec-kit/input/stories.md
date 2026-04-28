# User Stories: SWUK Central Submissions

> [!IMPORTANT]
> **Reverse Engineering Mode**: This project builds upon an existing Proof of Concept (POC). We are reverse-engineering the logic from existing SharePoint lists (Facilities, Master, UNHN) and the `SWUK Prepayment Request Consolidation` Power Automate flow to create a hardened, scalable regional solution.

## Epic 1: Foundation & Security
- **ST-1.1**: Define and create the "Prepayment Item" Site Content Type and associated Site Columns.
- **ST-1.2**: Develop the **PnP PowerShell 1.5.0** script for automated provisioning of security groups and lists.
- **ST-1.3**: Provision SharePoint Security Groups for all 23 plants following the `[Plant Code] Members` convention using the script.
- **ST-1.4**: Configure base permissions at the site level to allow group discovery while maintaining isolation.

## Epic 2: Plant Rollout (Spokes)
- **ST-2.1**: Execute PnP script to create Prepayment Request lists for each UK plant (NOC, WEA, SBG, etc.).
- **ST-2.2**: Break permission inheritance and assign unique group permissions via automation.
- **ST-2.3**: Configure "Pending" and "Processed" views and integrate lists into **Microsoft Teams** App Tabs.
- **ST-2.4**: Provision Site Pages for each plant using the reusable Plant Template.

## Epic 3: Central Automation (Hub)
- **ST-3.1**: Create the "Plant Master List" for system configuration.
- **ST-3.2**: Create the "Prepayment Request Master List" for data aggregation.
- **ST-3.3**: Develop the Power Automate "Consolidation Flow" to dynamically iterate through the Plant Master List.
- **ST-3.4**: Implement the "Sealing" logic to set processed items to read-only in source lists.

## Epic 4: Governance & Handover
- **ST-4.1**: Conduct functional testing per plant and end-to-end consolidation testing.
- **ST-4.2**: Produce "Plant Onboarding" documentation for Finance.
- **ST-4.3**: Deliver Knowledge Transfer (KT) session to the Finance team for self-management.
