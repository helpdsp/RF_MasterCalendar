## 1. Architecture Overview
The solution follows a **Hub-and-Spoke** architecture within the `GBR-UK-Shared-Services` site collection. Spokes (Plant Lists) feed into a Hub (Master List) via an Automation Layer (Power Automate) triggered by Finance Managers.

### 1.1 Automation Framework
- **Provisioning**: PowerShell with **PnP.PowerShell version 1.5.0** will be used to automate the creation of the 23 security groups and lists. The provisioning script is the Sprint 1 priority — a fully tested script reduces Sprint 2 from per-plant manual effort to batch execution.
- **Consolidation**: Power Automate Cloud Flow using environment-specific service accounts (see Section 5: Service Accounts).

### 1.2 Hub-and-Spoke Model Definition
In this architecture, **Spokes** refer to the 23 individual plant-level submission lists that act as local data entry points with strict security isolation. The **Hub** refers to the central Prepayment Request Master List where data is consolidated. This pattern ensures regional data privacy while allowing a unified central view for the UK Shared Services Finance Team.

## 2. Data Components
### 2.1 Content Type: "Prepayment Item"
Centralized Site Content Type derived from the POC list definitions.
- **Fields**:
  - `Bus_x0020_Area`: Choice (Required)
  - `Cost_x0020_Centre`: Text
  - `Date_x0020_From`/`Date_x0020_To`: DateTime
  - `GL`: Text
  - `Invoice_x0020_Number`: Text (Required)
  - `Invoice_x0020_Value`: Currency (Required)
  - `PO`: Text (Required)
  - `Rationale_x0020_for_x0020_Prepay`: Note
  - `Vendor_x0020_Name`/`Vendor_x0020_Number`: Text
  - `Plant`: Text
  - `Processed_x0020_On`: DateTime
  - `Title`: Text (Used as **Timestamp**)
  - `Payment_x0020_Description`: Note (Required)
  - `isEmpty`: Calculated (`=IF(ISBLANK(Title),"No","Yes")`)

### 2.2 Configuration Layer: "Plant Master List"
Stores the registry of all active plants.
- **Columns**: `PlantIdentifier` (Code), `PlantName`, `SubmissionListName`, `SecurityGroupID`, `Active` (Boolean).

## 3. Security Model
- **Plant Lists**: Inheritance broken for each list.
- **Groups**: `[Plant Code] Members` group assigned `Contribute` permissions.
- **Item-Level Security**: Advanced settings in SharePoint list to ensure users only see items they created (if required) or just restricted to the list scope.
- **Consolidation**: Once an item is marked as processed (Timestamp filled), the automation will change the item permissions to `Read` for the submitter (Sealing).

## 5. Service Accounts

| Environment | Account | Purpose |
|---|---|---|
| Development / Testing | `s2-gis-mxl1-msflows@smurfitkappa.com` | Used during script and flow development and testing |
| Production | `S2-GBR-UK-Portal@smurfitwestrock.com` | Used to run flow automation — no user-centric policy dependency (e.g. 6-month password rotation) |

## 4. Automation Logic: "Consolidation Flow"
The Power Automate flow (`SWUK Prepayment Request Consolidation`) follows these steps:
1. **Trigger**: Manual trigger (Monthly).
2. **Context**: Production runs under `S2-GBR-UK-Portal@smurfitwestrock.com`; development/testing under `s2-gis-mxl1-msflows@smurfitkappa.com`.
3. **Iterate Plants**: Reads from `Facilities Master List`.
4. **Fetch Items**: Query plant lists for items where `Title` (Timestamp) is null.
5. **Consolidate**:
   - Create item in `Prepayment Request Master List`.
   - Update `Title` in source list with `utcNow()`.
   - Update `Processed_x0020_On` with `utcNow()`.
6. **Security Sealing**:
   - Break role inheritance on source item.
   - Assign `Read` to the Plant Security Group (`MembershipGroupId`).
   - Assign `Full Control` to Site Owners (ID 3).

## 6. Annex A: Hub-and-Spoke Architecture Pattern

### Concept
The **Hub-and-Spoke** model is a network and data architecture pattern where a central "Hub" acts as the primary connector and repository, while multiple "Spokes" serve as localized endpoints for specific activities.

### Application in this Project
1. **The Spokes (Plant Lists)**:
   - **Isolation**: Each of the 23 UK plants operates within its own "Spoke" (a dedicated SharePoint list).
   - **Independence**: This allows for regional autonomy in data entry and ensures that users from different plants do not have access to each other's sensitive financial submissions.
   - **Standardization**: Every Spoke follows the same "Prepayment Item" blueprint (Content Type), ensuring that while the data is collected locally, it is consistent globally.

2. **The Hub (Master List)**:
   - **Consolidation**: The central "Hub" is the **Prepayment Request Master List**. It is the single destination for all validated data.
   - **Governance**: The UK Shared Services Finance Team manages the Hub. They have a bird's-eye view of the entire division without needing to manage 23 separate security contexts manually.
   - **Configuration**: The `Plant Master List` acts as the "Switchboard" of the Hub, defining which Spokes are active and how the automation should reach them.

3. **The Connection (Power Automate & PnP)**:
   - **Provisioning**: PnP PowerShell ensures that every new Spoke is manufactured exactly like the others.
   - **Data Flow**: Power Automate acts as the "Transport Layer," moving data from the Spokes to the Hub on a monthly trigger, ensuring the central repository is always up to date with the latest division-wide submissions.

### Benefits
- **Security**: Robust data silos between regions.
- **Scalability**: New plants (Spokes) can be added with minimal configuration changes.
- **Efficiency**: Centralized reporting and auditing in one single location (the Hub).
- **Site Pages**: Reusable "Plant Page" using the `Site Page` template.
- **Webparts**: SharePoint List webpart filtered to the specific plant's submission list.
- **Navigation**: Managed Metadata or Quick Launch links structured by region/plant code.
