# Test Plan — Invoices for Tax Team KT Document

## Quality Gates (from KT Master Prompt)

These gates must pass before the KT document is accepted.

---

### QG-01 — No Placeholder Text
**Check:** Search the final `docs/KT-InvoicesForTaxTeam.md` for: `TBD`, `TODO`, `[fill in]`, `placeholder`, `[specify]`, `[LIST_NAME]`.
**Expected:** Zero matches.
**If fail:** Replace all placeholders with confirmed data from refdocs or flag explicitly as a documented gap.

---

### QG-02 — All Fields Have Internal Names
**Check:** Every SharePoint field mentioned in Section 3 includes both Display Title and Internal Name.
**Expected:** At minimum, all 5 custom columns documented: `Fiscal_x0020_Year`, `Received_x0020_Date`, `EMail`, `To`, `Subject`.
**If fail:** Cross-reference `Custom Columns-SiteColumns.json` and `*-Fields.json` exports.

---

### QG-03 — CAML Queries Present
**Check:** Section 5 (Configuration Reference) includes CAML query for at minimum: All Documents view and Bulk Edit View for each library.
**Expected:** 4 libraries × 2 views = 8 CAML blocks minimum.
**If fail:** Extract from `*-Views.json` exports.

---

### QG-04 — Both Flow Paths Documented
**Check:** Section 6 documents both: AP flow (`AP@ruizfoods.com` → Accounts Payable library) and FA flow (`FixedAssets@ruizfoods.com` → Fixed Assets library).
**Expected:** Two separate flow descriptions with connector names.
**If fail:** Document from inferred architecture; mark as "inferred — verify in Power Automate portal."

---

### QG-05 — Both Mockups Referenced
**Check:** Section 7 cites both mockup screenshots by filename.
**Expected:**
- `mockups/SharePoint_Landing Page - Faceted Search Experience - No Data.jpg`
- `mockups/SharePoint_Landing Page - Faceted Search Experience - With Data and Search refiners.jpg`
**If fail:** Add citation in Section 7 Interface Documentation.

---

### QG-06 — Runbook Is Executable
**Check:** Section 9 has numbered steps for all 7 admin tasks.
**Expected:** Each task has ≥3 numbered steps a new admin can follow without prior knowledge.
**If fail:** Expand any task that is missing steps.

---

### QG-07 — Brand Compliance Table Complete
**Check:** Section 11 has a table with at least: color, typography, tone of voice dimensions mapped to user-facing components.
**Expected:** At minimum: landing page, search refiners, any visible text.
**If fail:** Add missing dimension rows.

---

### QG-08 — Production Typo Documented
**Check:** The Accounts Payable "Bulk Edit View" URL slug `Not PDFs.aspx` is documented and flagged in Section 5.
**Expected:** A note reads: "Production URL slug is `Not PDFs.aspx` — this is a legacy name in production; do not rename as it would break existing links."
**If fail:** Add note to the view entry in Section 5.

---

### QG-09 — Service Account Gap Flagged
**Check:** Section 6 explicitly notes whether the Power Automate service account identity is a personal or service account.
**Expected:** If unknown, a gap statement: "The identity running the flow could not be confirmed from refdocs. Verify in Power Automate → My Flows / Team Flows and ensure a service account is in use."
**If fail:** Add gap statement.

---

### QG-10 — Permissions Matrix Covers All Libraries
**Check:** Section 8 has a permission row for each of the 4 libraries.
**Expected:** 4 rows × 3 roles = 12 permission cells minimum.
**If fail:** Add missing library rows.

---

### QG-11 — Item Counts Confirmed
**Check:** Section 10 documents item counts for all 4 libraries.
**Expected:** AP=173,704; FA=11,985; FY2023=16; FY2024=45,933; Total=231,638.
**If fail:** Pull counts from `*-Properties.json` exports.

---

### QG-12 — Content Type IDs Documented
**Check:** Section 3 includes the full content type ID strings for all 3 custom CTs.
**Expected:**
- `Invoice Document`: `0x010100E3917FC38B21344BB4F75ADAC1414E19`
- `Accounts Payable`: `0x010100E3917FC38B21344BB4F75ADAC1414E1901`
- `Fixed Asset`: `0x010100E3917FC38B21344BB4F75ADAC1414E1902`
**If fail:** Pull from `ContentTypes-ByGroup.json`.
