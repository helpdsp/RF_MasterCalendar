# Sprint 1 QA Plan

## Acceptance criteria per story

- **ST-1.1** *(Done via POC)*: "Prepayment Item" Content Type exists at site level with all required fields. No re-testing needed unless fields are modified.
- **ST-1.2 (Priority)**: PnP PowerShell script successfully provisions a pilot plant end-to-end — security group created, list created with Content Type applied, permissions broken and assigned. Script must be idempotent (re-runnable without duplicating artefacts).
- **ST-1.3**: All 23 `[Plant Code] Members` groups exist in the site with correct naming.
- **ST-1.4**: Site-level permissions allow group discovery. Users can be added to a plant group without Site Admin rights.
- **ST-2.1**: At least one plant list exists with the Prepayment Item Content Type, correct views (Pending / Processed), and isolated permissions.

## Risks monitored

| Risk | Likelihood | Mitigation |
|---|---|---|
| PnP script incompatibility with tenant permissions | Medium | Test against dev service account (`s2-gis-mxl1-msflows@smurfitkappa.com`) before running in production context |
| Script run time exceeds window for 23 plants | Low | Pilot on 1 plant first; batch remaining in Sprint 2 |
| Sprint 1 completes early | Low–Medium | Remaining capacity redirected to Finance Team SharePoint tasks — no idle time |
