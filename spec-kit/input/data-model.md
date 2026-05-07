# Data Model — Invoices for Tax Team

## 1. Document Libraries (Entities)

### 1.1 Accounts Payable (`/AP`)
- **Type:** Document Library (BaseTemplate 101)
- **Item Count:** 173,704
- **Default View URL:** `/sites/InvoiceforTaxTeam/AP/Forms/AllItems.aspx`

### 1.2 Fixed Assets (`/FA`)
- **Type:** Document Library (BaseTemplate 101)
- **Item Count:** 11,985
- **Default View URL:** `/sites/InvoiceforTaxTeam/FA/Forms/AllItems.aspx`

### 1.3 FY2023 (`/FY2023`)
- **Type:** Document Library (BaseTemplate 101)
- **Item Count:** 16 *(potential partial migration — see Open Questions)*
- **Default View URL:** `/sites/InvoiceforTaxTeam/FY2023/Forms/AllItems.aspx`

### 1.4 FY2024 (`/FY2024`)
- **Type:** Document Library (BaseTemplate 101)
- **Item Count:** 45,933
- **Default View URL:** `/sites/InvoiceforTaxTeam/FY2024/Forms/AllItems.aspx`

---

## 2. Content Type Hierarchy

```
Document (0x0101)                          ← SharePoint built-in
└── Invoice Document                        ← Custom base CT
    ID: 0x010100E3917FC38B21344BB4F75ADAC1414E19
    Group: Invoice for Tax Team
    Fields: 13 (includes all custom columns below)
    │
    ├── Accounts Payable                    ← Custom child CT (AP library)
    │   ID: 0x010100E3917FC38B21344BB4F75ADAC1414E1901
    │   Fields: 13
    │
    └── Fixed Asset                         ← Custom child CT (FA library)
        ID: 0x010100E3917FC38B21344BB4F75ADAC1414E1902
        Fields: 13
```

All libraries have `ContentTypesEnabled: true`. The `Bulk Edit View` filters to `ContentType = "Invoice Document"` which matches all three custom CTs (base + both children).

---

## 3. Custom Site Columns (Business Fields)

These are the non-system, business-meaningful columns added to all libraries. All are in the **"Custom Columns"** site column group.

| # | Display Title | Internal Name | Field Type | Required | Hidden | Read-Only | Description |
|---|---------------|---------------|-----------|----------|--------|-----------|-------------|
| 1 | Fiscal Year | `Fiscal_x0020_Year` | Text | No | No | No | Fiscal year label (e.g., "FY2024"). Set by Power Automate flow. |
| 2 | Received Date | `Received_x0020_Date` | DateTime | No | No | No | Date/time the email was received at the source mailbox. |
| 3 | From | `EMail` | Text | No | No | No | Sender email address. Internal name `EMail` (Core Contact and Calendar Columns). |
| 4 | To | `To` | Text | No | No | No | Recipient email address(es). |
| 5 | Subject | `Subject` | Text | No | No | No | Email subject line. From "Core Document Columns" group. |

---

## 4. System / Built-in Fields Referenced in Views

| Display Title | Internal Name | Type | Notes |
|---------------|---------------|------|-------|
| ID | `ID` | Counter | Auto-increment. Default view sorts DESC by this field. |
| Name | `FileLeafRef` | File | Document filename. Required. |
| Content Type | `ContentType` | Computed | Used in Bulk Edit View CAML filter. |
| Created | `Created` | DateTime | Document creation timestamp. |
| Created By | `Author` | User | User who created the document. |
| Modified | `Modified` | DateTime | Last modification timestamp. |
| Modified By | `Editor` | User | Last user to modify. |
| Title | `Title` | Text | Optional document title. |
| Description | `_ExtendedDescription` | Note | Optional extended description. |
| Version | `_UIVersionString` | Text | Version label (e.g., "1.0"). |
| Approval Status | `_ModerationStatus` | ModStat | Hidden. `EnableModeration=false` so always Approved (0). |

---

## 5. Field Relationships & Data Flow

```
Email received at AP@ruizfoods.com or FixedAssets@ruizfoods.com
        │
        ▼
Power Automate Flow
        │
        ├── Extract: From    → EMail
        ├── Extract: To      → To
        ├── Extract: Subject → Subject
        ├── Extract: Date    → Received_x0020_Date
        ├── Derive:  FY      → Fiscal_x0020_Year (e.g., "FY2024")
        └── Assign:  CT      → Accounts Payable | Fixed Asset
        │
        ▼
SharePoint Document Library
  ├── Document stored as file (email body / attachment)
  └── Metadata stamped on file item
        │
        ▼
SharePoint Search (indexed)
  └── Managed Properties → PnP Modern Search v4 Refiners
```

---

## 6. Library-to-Content-Type Mapping

| Library | Content Type Applied | Use Case |
|---------|---------------------|----------|
| Accounts Payable | `Accounts Payable` | Active AP invoice emails (ongoing) |
| Fixed Assets | `Fixed Asset` | Active FA invoice emails (ongoing) |
| FY2023 | `Invoice Document` or `Accounts Payable` / `Fixed Asset` | Archive — FY2023 emails migrated |
| FY2024 | `Invoice Document` or `Accounts Payable` / `Fixed Asset` | Archive — FY2024 emails migrated |

> FY archive libraries may use the base `Invoice Document` CT or the child CTs depending on how migration was performed. Verify in SharePoint Admin.

---

## 7. View CAML Queries

### All Documents (all libraries)
```xml
<OrderBy>
  <FieldRef Name="ID" Ascending="FALSE" />
</OrderBy>
```

### Bulk Edit View (all libraries)
```xml
<OrderBy>
  <FieldRef Name="ID" Ascending="FALSE" />
</OrderBy>
<Where>
  <Eq>
    <FieldRef Name="ContentType" />
    <Value Type="Computed">Invoice Document</Value>
  </Eq>
</Where>
```

### Relink Documents (all libraries, hidden)
```xml
<OrderBy>
  <FieldRef Name="FileLeafRef" />
</OrderBy>
<Where>
  <Neq>
    <FieldRef Name="xd_Signature" />
    <Value Type="Boolean">1</Value>
  </Neq>
</Where>
```
