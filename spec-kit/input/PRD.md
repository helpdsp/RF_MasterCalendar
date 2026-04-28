# PRD: SWUK Central Submissions (Prepayment)

## 1. Project Overview
The solution provides a secure, consolidated prepayment request system for the **UK Shared Services Finance Team**, accessible via Browser and **Microsoft Teams**.

## 2. Target Audience
- **Plant Employees**: Submitters of prepayment requests at the regional level.
- **UK Shared Services Finance Team**: Owners of the central consolidation process, primary administrators of the platform, and final data consumers.
- **Site Administrators**: Responsible for technical governance and assisting the Finance Team with plant onboarding.

## 3. User Stories & Functional Requirements
### 3.1 Data Submission (Regional)
- **RS-01**: As a plant employee, I can navigate to my plant's dedicated submission page.
- **RS-02**: As a plant employee, I can submit a new Prepayment Request with required fields (Invoice Number, Value, PO, Description).
- **RS-03**: As a plant employee, I can attach supporting documentation to my request.
- **RS-04**: As a plant employee, I can see which of my requests are pending and which have been processed.

### 3.2 Security & Isolation
- **SEC-01**: Users from Plant A must NOT be able to view, edit, or submit data to Plant B's submission list.
- **SEC-02**: Plant members should have "Contribute" access but without the ability to view versions or delete items if restricted.

### 3.3 Central Consolidation (**UK Shared Services Finance Team**)
- **CON-01**: As a member of the UK Shared Services Finance Team, I want to **manually trigger** the consolidation flow on a **monthly basis** to aggregate plant data.
- **CON-02**: As a member of the UK Shared Services Finance Team, I want processed items in the source plant lists to be "sealed" (read-only) once they are consolidated to prevent late changes.

### 3.4 Management & Onboarding
- **MGMT-01**: As an admin, I can register a new plant by adding its details to a Master configuration list.
- **MGMT-02**: As an admin, I want to use **PowerShell PnP 1.5.0** to automate the creation of groups and lists for all 23 plants to ensure consistency.

### 3.5 Accessibility
- **ACC-01**: Users can access the submission lists directly via Microsoft Edge.
- **ACC-02**: Users can access and submit requests through a dedicated **Microsoft Teams** tab or List Form.
- **MGMT-02**: The automation flow should automatically include any new plant registered in the Master list without code changes.

## 4. Non-Functional Requirements
- **Performance**: The consolidation flow should handle processing multiple plants within a reasonable timeframe (scheduled or trigger-based).
- **Scalability**: The system must support at least 50 plants (future-proofing).
- **Maintainability**: Low-code/No-code approach using standard SharePoint and Power Automate features.

## 5. Success Metrics
- 100% data isolation between plants.
- Automated consolidation of items from all 23 plants within 24 hours of submission.
- Zero manual intervention required for data movement.
