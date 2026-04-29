# Test Plan: SWUK Central Submissions

## 0. Provisioning Script Validation (Provision-PlantList.ps1 / UnProvision-PlantList.ps1)

> Run this section every time the provisioning scripts are modified, using a throwaway plant code (e.g. `TST`).

### 0.1 Provision — Happy Path
- **Step**: Run `.\Provision-PlantList.ps1 -PlantCode "TST" -PlantName "Test Plant"`
- **Expected**: Script completes with no errors. Each step prints a green success message.

### 0.2 Content Types
- **Step**: Open the list Settings page → Content Types section.
- **Expected**:
  - Only `Prepayment Item` is listed.
  - `Prepayment Item` is marked as the default content type.
  - The default `Item` content type is **not** present.

### 0.3 Columns
- **Step**: Open the list Settings page → Columns section.
- **Expected**:
  - All content type fields are shown with `Used in: Prepayment Item`.
  - `Timestamp` column is the renamed Title field (single line of text).
  - `Processed` calculated column is present (list-level, no "Used in").
  - `Plant` field default value is pre-set to the plant code.
  - No duplicate or unexpected columns exist.

### 0.4 Views
- **Step**: Open the list Settings page → Views section.
- **Expected**:
  - Only two views exist: `Pending` and `Processed`.
  - `All Items` view is **not** present.
  - `Pending` is the default view.

### 0.5 Pending View Configuration
- **Step**: Open the Pending view settings (Edit view).
- **Expected**:
  - View type is **Grid** (Edit in grid view experience).
  - 13 columns displayed in order: Bus Area, PO, Invoice Number, Invoice Value, Description Details, Date From, Date To, GL, Cost Centre, Vendor Number, Vendor Name, Rationale for Prepayment, Processed.
  - Filter: `Processed is equal to No`.
  - Totals: `Invoice Value = Sum`.

### 0.6 Processed View Configuration
- **Step**: Open the Processed view settings (Edit view).
- **Expected**:
  - View type is **Standard**.
  - 14 columns displayed in order: Bus Area, PO, Invoice Number, Invoice Value, Description Details, Date From, Date To, GL, Cost Centre, Vendor Number, Vendor Name, Rationale for Prepayment, Processed, Timestamp (linked to item with edit menu).
  - Filter: `Processed is equal to Yes`.
  - Totals: `Invoice Value = Sum`.
  - Item limit: 30 per page with pagination enabled.

### 0.7 Permissions
- **Step**: Open Site Settings → People and Groups.
- **Expected**:
  - `TST Members` group exists.
  - `TST Members` group has **Read** permission at site level.
- **Step**: Open list Settings → Permissions for this list.
- **Expected**:
  - List has unique permissions (inheritance broken).
  - `TST Members` has **Contribute** on the list.
  - Site Owners group has **Full Control** on the list.

### 0.8 Facilities Master List Registration
- **Step**: Open the Facilities Master List.
- **Expected**: A row exists for `TST` with correct plant name and list reference.

### 0.9 Idempotency Check
- **Step**: Run `.\Provision-PlantList.ps1 -PlantCode "TST" -PlantName "Test Plant"` a second time.
- **Expected**: Script completes without errors. All "already exists" steps print yellow warning messages and skip — nothing is duplicated.

### 0.10 Unprovision — Happy Path
- **Step**: Run `.\UnProvision-PlantList.ps1 -PlantCode "TST"` and type `YES` when prompted.
- **Expected**: Script completes with no errors.
- **Verify**:
  - `TST - Prepayment Request` list is in the site recycle bin.
  - `TST Members` group no longer exists in People and Groups.
  - `TST` row is removed from the Facilities Master List.

### 0.11 Unprovision — Idempotency Check
- **Step**: Run `.\UnProvision-PlantList.ps1 -PlantCode "TST"` a second time.
- **Expected**: Script completes without errors. Each missing resource prints a yellow warning and skips — no exceptions thrown.

## 1. Unit Testing (Infrastructure & Data)
- **Check**: PnP PowerShell script correctly provisions list with Content Type.
- **Check**: Content Type fields are present and mandatory.
- **Check**: Calculated column `Processed` correctly toggles Yes/No.

## 2. Functional Testing (Security)
- **Scenario**: User A from Plant NOC tries to access List B from Plant WEA.
- **Expected**: Access Denied.
- **Scenario**: User A submits an item.
- **Expected**: Item visible in "Pending" view, Processed = No.

## 3. Integration Testing (Automation)
- **Scenario**: Run consolidation flow with items in 3 different plant lists.
- **Expected**: 
  - Items created in Master List.
  - Source items updated with Timestamp and ProcessedOn.
  - Source items become Read-Only for the submitter.

## 4. Accessibility & Integration Testing
- **Scenario**: Access plant list via Microsoft Teams App Tab.
- **Expected**: List rendered correctly, user authenticated.
- **Scenario**: Submit a request using Microsoft List Forms inside Teams.
- **Expected**: Item created with correct Plant metadata.

## 5. Acceptance Testing (UAT)
- **Finance Team Validation**: Review the Master List data accuracy after manual monthly trigger.
- **Finance Team Self-Management**: Onboard 1 new test plant using the PnP script and documentation.
