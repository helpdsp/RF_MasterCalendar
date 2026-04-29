# Data Model: SWUK Central Submissions

## 1. Entity: Prepayment Item (Content Type)
This entity represents a single prepayment request. It is implemented as a SharePoint Content Type named **Prepayment Item**.

> The provisioning script (`Provision-PlantList.ps1`) adds this content type to each plant list, removes the default **Item** content type, and creates one list-level calculated column (`Processed`). All other columns below come from the site content type.

### 1.1 "Prepayment Item" Content Type Fields
| Field Name | Internal Name | Type | Required | Source | Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Timestamp** | `Title` | Text | No | Content Type | Default `Title` field renamed to **Timestamp** by the provisioning script. Used by the consolidation flow to record when an item was processed. |
| **Bus Area** | `Bus_x0020_Area` | Choice | Yes | Content Type | |
| **Cost Centre** | `Cost_x0020_Centre` | Text | No | Content Type | |
| **Date From** | `Date_x0020_From` | DateTime | No | Content Type | |
| **Date To** | `Date_x0020_To` | DateTime | No | Content Type | |
| **Description Details** | `Payment_x0020_Description` | Note | Yes | Content Type | |
| **GL** | `GL` | Text | No | Content Type | |
| **Invoice Number** | `Invoice_x0020_Number` | Text | Yes | Content Type | |
| **Invoice Value** | `Invoice_x0020_Value` | Currency | Yes | Content Type | |
| **Plant** | `Plant` | Text | No | Content Type | Auto-populated with the plant code by the provisioning script via field default value. |
| **PO** | `PO` | Text | Yes | Content Type | |
| **Processed On** | `Processed_x0020_On` | DateTime | No | Content Type | Populated by the consolidation flow when item is processed. |
| **Rationale for Prepayment** | `Rationale_x0020_for_x0020_Prepay` | Note | No | Content Type | |
| **Vendor Name** | `Vendor_x0020_Name` | Text | No | Content Type | |
| **Vendor Number** | `Vendor_x0020_Number` | Text | No | Content Type | |
| **Processed** | `isEmpty` | Calculated | No | List-level | Formula: `=IF(ISBLANK([Timestamp]),"No","Yes")`. Drives view filters and the consolidation flow trigger. |

### 1.2 List Views

#### Pending View (Default — Grid/Edit in grid view)
| # | Column | Internal Name |
| :--- | :--- | :--- |
| 1 | Bus Area | `Bus_x0020_Area` |
| 2 | PO | `PO` |
| 3 | Invoice Number | `Invoice_x0020_Number` |
| 4 | Invoice Value | `Invoice_x0020_Value` |
| 5 | Description Details | `Payment_x0020_Description` |
| 6 | Date From | `Date_x0020_From` |
| 7 | Date To | `Date_x0020_To` |
| 8 | GL | `GL` |
| 9 | Cost Centre | `Cost_x0020_Centre` |
| 10 | Vendor Number | `Vendor_x0020_Number` |
| 11 | Vendor Name | `Vendor_x0020_Name` |
| 12 | Rationale for Prepayment | `Rationale_x0020_for_x0020_Prepay` |
| 13 | Processed | `isEmpty` |

| Setting | Value |
| :--- | :--- |
| View Type | Grid (Edit in grid view) |
| Default View | Yes |
| Filter | `Processed is equal to No` |
| Totals | `Invoice Value = Sum` |
| Item Limit | No limit |

#### Processed View (Standard — Read only)
| # | Column | Internal Name |
| :--- | :--- | :--- |
| 1 | Bus Area | `Bus_x0020_Area` |
| 2 | PO | `PO` |
| 3 | Invoice Number | `Invoice_x0020_Number` |
| 4 | Invoice Value | `Invoice_x0020_Value` |
| 5 | Description Details | `Payment_x0020_Description` |
| 6 | Date From | `Date_x0020_From` |
| 7 | Date To | `Date_x0020_To` |
| 8 | GL | `GL` |
| 9 | Cost Centre | `Cost_x0020_Centre` |
| 10 | Vendor Number | `Vendor_x0020_Number` |
| 11 | Vendor Name | `Vendor_x0020_Name` |
| 12 | Rationale for Prepayment | `Rationale_x0020_for_x0020_Prepay` |
| 13 | Processed | `isEmpty` |
| 14 | Timestamp (linked to item with edit menu) | `LinkTitle` |

| Setting | Value |
| :--- | :--- |
| View Type | Standard (Html) |
| Default View | No |
| Filter | `Processed is equal to Yes` |
| Totals | `Invoice Value = Sum` |
| Item Limit | 30 per page (paginated) |

## 2. Configuration Entity: Plant Registry
Used by Power Automate to discover Spokes.

### 1.2 "Facilities Master List" (Configuration)
| Field Name | Internal Name | Type | Notes |
| :--- | :--- | :--- | :--- |
| **SAP Code** | `Title` | Text | Primary identifier |
| **Plant** | `Plant` | Text | Human readable name |
| **List Name** | `PaymentRequestList` | Text | SharePoint List Title |
| **Group ID** | `MembershipGroupId` | Number | SharePoint Security Group ID |
| **GM** | `GM` | User | General Manager |
| **Active** | Boolean | Whether to include in consolidation |

## 3. Entity: Consolidation Log (Master List)
Inherits all fields from **Prepayment Item** plus:
- **Source Plant**: Link to the source plant record.
- **Master Processed Date**: Audit timestamp for central processing.
