# Sprint Plan: SWUK Central Submissions

## Total Estimated Effort: 128 Hours

## Sprint 1: Core Framework & Automation (Weeks 1–1.5)
- **Goal**: Build the foundation, with the **PnP PowerShell provisioning script as the priority deliverable**. A fully tested script compresses Sprint 2 from a manual per-plant effort into automated batch execution.
- **Tasks**:
  - ~~Setup Content Types.~~ *(Done — "Prepayment Item" Content Type delivered via POC.)*
  - **[PRIORITY] Develop, iterate, and pilot-test PnP PowerShell 1.5.0 provisioning script** (end-to-end pilot against at least one plant).
  - Develop and harden the Power Automate Consolidation Flow (Manual Trigger).
  - Create the Plant Page Template.
- **Effort**: 36 Hours.
- **Capacity note**: If sprint completes early, remaining time is redirected to Finance Team SharePoint tasks within `GBR-UK-Shared-Services`.

## Sprint 2: Regional Rollout & Security (Weeks 1.5–3)
- **Goal**: Provision and secure all 23 "Spoke" lists using the script built in Sprint 1. Expected to be significantly faster than the baseline estimate thanks to script automation.
- **Tasks**:
  - Execute PnP script to batch-provision all 23 plant lists and security groups.
  - Configure "Pending" and "Processed" views per plant.
  - Integrate lists into Microsoft Teams App Tabs.
  - Navigation setup.
- **Effort**: Up to 92 Hours (23 Plants × 4h/plant baseline — script automation expected to reduce actual time).

## Sprint 3: Final QA & Handover (Week 4)
- **Goal**: Validate end-to-end, complete documentation, and leave Finance self-sufficient.
- **Tasks**:
  - Functional testing: per-plant isolation verification.
  - Integration testing: end-to-end consolidation with real plant data.
  - UAT with Finance Team (including Finance-led plant onboarding test).
  - Documentation completion.
  - Finance KT session.
- **Effort**: Included in previous estimates.
