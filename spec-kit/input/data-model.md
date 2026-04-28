# Data Model: SWUK Central Submissions

## 1. Entity: Prepayment Item (Content Type)
This entity represents a single prepayment request. It is implemented as a SharePoint Content Type.

### 1.1 "Prepayment Item" Content Type
| Field Name | Internal Name | Type | Required | Notes |
| :--- | :--- | :--- | :--- | :--- |
| **Bus Area** | `Bus_x0020_Area` | Choice | Yes | |
| **Cost Centre** | `Cost_x0020_Centre` | Text | No | |
| **Date From** | `Date_x0020_From` | DateTime | No | |
| **Date To** | `Date_x0020_To` | DateTime | No | |
| **GL** | `GL` | Text | No | |
| **Invoice Number** | `Invoice_x0020_Number` | Text | Yes | |
| **Invoice Value** | `Invoice_x0020_Value` | Currency | Yes | |
| **PO** | `PO` | Text | Yes | |
| **Rationale** | `Rationale_x0020_for_x0020_Prepay` | Note | No | |
| **Vendor Name** | `Vendor_x0020_Name` | Text | No | |
| **Vendor Number** | `Vendor_x0020_Number` | Text | No | |
| **Plant** | `Plant` | Text | No | Auto-populated by PnP script |
| **Processed On** | `Processed_x0020_On` | DateTime | No | Hidden |
| **Description** | `Payment_x0020_Description` | Note | Yes | |
| **Timestamp** | `Title` | Text | No | **Note**: POC uses `Title` for timestamp. We will use a dedicated field in the final version but maintain compatibility. |
| **Processed** | `isEmpty` | Calculated | No | `=IF(ISBLANK(Title),"No","Yes")` |

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
