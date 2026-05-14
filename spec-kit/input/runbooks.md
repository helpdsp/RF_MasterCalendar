# Runbook Catalog — Engineering Web Portal (eng-hub)

This file tracks all operational runbooks for the Engineering Hub SharePoint portal.
Each runbook lives in `refdocs/Runbooks/{runbook-name}/runbook.md` with screenshots
in `refdocs/Runbooks/{runbook-name}/images/`. All runbooks are automatically discovered
and appended to the KT Word document when `py scripts/build-docx.py` is run.

---

## Status Legend

| Status | Meaning |
|---|---|
| `complete` | Markdown fully written, screenshots added, verified |
| `draft` | Markdown written, screenshots pending |
| `stub` | Skeleton created — needs content and screenshots |
| `proposed` | Identified as needed — folder not yet created |

---

## Runbook Inventory

| # | Folder | Title | Status | KT Section |
|---|---|---|---|---|
| RB-01 | `new-cep-project-library` | Create a New CEP Project Library (ShareGate) | complete | §9 Runbook |
| RB-02 | `manage-taxonomy-terms` | Manage Ruiz Foods Taxonomy Terms in Term Store | stub | §9 Runbook |
| RB-03 | `manage-assets-permissions` | Manage Unique Permissions on Assets Libraries | stub | §8 Permissions |
| RB-04 | `troubleshoot-pnp-search` | Troubleshoot PnP Modern Search Indexing and Web Parts | stub | §6 Automation |
| RB-05 | `upload-and-tag-documents` | Upload and Tag Engineering Documents | stub | §4 Process Flow |
| RB-06 | `update-pnp-search-solution` | Deploy / Update PnP Modern Search V4 Solution | stub | §6 Automation |

---

## RB-01 — Create a New CEP Project Library (ShareGate)

**Status:** complete
**Folder:** `refdocs/Runbooks/new-cep-project-library/`
**Audience:** SharePoint administrators, IT staff
**Trigger:** New Capital Engineering Project service request received

**Chapters:**
1. Copy structure and content from template library using ShareGate
2. Configure copy options (title, URL, operation mode, element selection)
3. Monitor migration and export report
4. Update library name, description, and content type settings
5. Verify columns and set Legal Entity default value
6. Bulk-edit metadata across all document sets

**Prerequisites:**
- ShareGate access with source/destination site admin rights
- Open service request ticket with new CEP library name and number
- Target site: `https://ruizfoods.sharepoint.com/sites/eng-hub`

---

## RB-02 — Manage Ruiz Foods Taxonomy Terms in Term Store

**Status:** stub
**Folder:** `refdocs/Runbooks/manage-taxonomy-terms/`
**Audience:** SharePoint administrators
**Trigger:** New facility, area, classification value, or supplier needed

**Chapters:**
1. Access the SharePoint Term Store via SharePoint Admin Center
2. Navigate to the Ruiz Foods Taxonomy term group
3. Add a new term to an existing term set (Area, Facility, Classification, Supplier)
4. Edit or deprecate an existing term
5. Verify terms appear in managed metadata columns across libraries

**Prerequisites:**
- Term Store Administrator or Site Collection Administrator role
- List of new terms to add (name, parent term set, optional description)

---

## RB-03 — Manage Unique Permissions on Assets Libraries

**Status:** stub
**Folder:** `refdocs/Runbooks/manage-assets-permissions/`
**Audience:** SharePoint administrators, Engineering Managers
**Trigger:** New employee onboarding, employee offboarding, role change for facility access

**Chapters:**
1. Navigate to the CA1 or CA4 Assets library
2. Open Library Permissions (Library Settings → Permissions for this document library)
3. Verify the library uses unique role assignments (not inheriting from site)
4. Grant access: add a user or group to an existing permission level
5. Revoke access: remove a user or group from the permission list
6. Verify access changes are reflected in the site members panel

**Prerequisites:**
- Site Collection Administrator or Full Control on the specific library
- Employee name, email, and required permission level (Read / Contribute / Edit)

---

## RB-04 — Troubleshoot PnP Modern Search Indexing and Web Parts

**Status:** stub
**Folder:** `refdocs/Runbooks/troubleshoot-pnp-search/`
**Audience:** IT Administrators
**Trigger:** Search results missing, stale, or web parts showing errors

**Chapters:**
1. Identify the symptom: no results, wrong results, or web part error
2. Check SharePoint Search crawl status in Search Admin
3. Request a full re-crawl or re-index of a specific library
4. Verify PnP Search web part connections (Search Box → Results → Filters)
5. Check managed properties are mapped to crawled properties
6. Clear PnP Search web part cache and reload
7. Redeploy the SPFx solution if web parts are broken

**Prerequisites:**
- SharePoint Admin Center access
- Access to the eng-hub site search page (`/sites/eng-hub/SitePages/engineering-search.aspx`)

---

## RB-05 — Upload and Tag Engineering Documents

**Status:** stub
**Folder:** `refdocs/Runbooks/upload-and-tag-documents/`
**Audience:** Engineering Staff, Project Managers
**Trigger:** New engineering document ready for the portal

**Chapters:**
1. Navigate to the correct document library (CEP, Assets, Agreements, CAD Blocks)
2. Upload the document (drag-and-drop or Upload button)
3. Select the correct content type (Engineering Document sub-type)
4. Fill in required metadata: Facility, Area, Classification, CEP Project #, Legal Entity
5. Save and confirm the document appears in the default library view
6. Verify the document is discoverable via PnP Search

**Prerequisites:**
- Contribute or Edit permission on the target library
- Document ready for upload (PDF, DWG, DOCX, XLSX, or similar)
- Correct CEP Project # and facility known in advance

---

## RB-06 — Deploy / Update PnP Modern Search V4 Solution

**Status:** stub
**Folder:** `refdocs/Runbooks/update-pnp-search-solution/`
**Audience:** IT Administrators
**Trigger:** New PnP Modern Search V4 release available, or web parts need reconfiguration

**Chapters:**
1. Download the latest `pnp-modern-search-parts-v4.sppkg` from the PnP GitHub releases
2. Upload to the SharePoint App Catalog (tenant-wide or site collection)
3. Deploy and trust the solution
4. Verify existing web parts continue to function after update
5. Re-add or reconfigure web parts if a major version upgrade requires it
6. Test search page end-to-end: Search Box → vertical → filters → results

**Prerequisites:**
- SharePoint App Catalog access (Tenant Admin or App Catalog Owner)
- Latest `.sppkg` file downloaded from https://github.com/microsoft-search/pnp-modern-search/releases
- Change window approved (avoid deploying during peak engineering hours)
