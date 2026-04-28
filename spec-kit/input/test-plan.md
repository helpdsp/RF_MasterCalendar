# Test Plan: SWUK Central Submissions

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
