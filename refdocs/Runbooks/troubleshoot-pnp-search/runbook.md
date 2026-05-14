# Troubleshoot PnP Modern Search Indexing and Web Parts

This runbook covers diagnosing and resolving the most common issues with the
**PnP Modern Search Web Parts V4** search experience on the Engineering Hub,
including missing results, stale results, and broken web part connections.

**Search page URL:** `https://ruizfoods.sharepoint.com/sites/eng-hub/SitePages/engineering-search.aspx`
**Solution package:** `pnp-modern-search-parts-v4.sppkg`

---

## Prerequisites

- SharePoint Administrator or Site Collection Administrator access
- Access to SharePoint Admin Center: `https://ruizfoods-admin.sharepoint.com`
- Ability to edit the eng-hub search page (Site Owner or higher)

---

## Chapter: Identifying the Symptom

Before troubleshooting, confirm which type of issue you are facing:

| Symptom | Likely cause | Go to chapter |
|---|---|---|
| Search returns no results for any query | Crawl failure or web part misconfiguration | Crawl Status / Web Part Config |
| Some documents missing from results | Specific library not crawled, or metadata not indexed | Re-index Library |
| Results are stale (old documents showing) | Crawl delay or cached results | Force Re-crawl |
| Web part shows "Something went wrong" or blank | Broken web part connection or SPFx error | Web Part Connections |
| Filters (refiners) don't work | Managed properties not mapped | Managed Properties |

---

## Chapter: Checking SharePoint Search Crawl Status

**Step 1:** Open the SharePoint Admin Center at `https://ruizfoods-admin.sharepoint.com`.

> [ADD SCREENSHOT: SharePoint Admin Center home]

**Step 2:** In the left navigation, select **Search** (under Content services or the classic admin link).

> [ADD SCREENSHOT: Search admin link in left navigation]

**Step 3:** Click **Crawl Log** to review recent crawl activity. Look for errors or warnings on the `eng-hub` site.

> [ADD SCREENSHOT: Crawl Log showing recent activity and any error entries]

**Step 4:** If you see persistent errors for specific libraries, note the library URLs — these will need to be re-indexed (see next chapter).

---

## Chapter: Re-indexing a Specific Library

Use this when a document library's content is not appearing in search results.

**Step 1:** Navigate to the document library on `https://ruizfoods.sharepoint.com/sites/eng-hub`.

**Step 2:** Click the **Settings** gear → **Library settings**.

> [ADD SCREENSHOT: Library settings page]

**Step 3:** Under **General Settings**, click **Advanced settings**.

**Step 4:** Scroll to the **Reindex Document Library** section and click **Reindex Document Library**.

> [ADD SCREENSHOT: Reindex Document Library button highlighted in Advanced Settings]

**Step 5:** Confirm the dialog. The library will be queued for the next crawl (typically within 15–30 minutes during business hours).

> **Note:** Re-indexing queues the library for the next scheduled crawl — it does not trigger an immediate crawl. If you need faster results, request a manual crawl from the SharePoint Admin Center Search settings.

---

## Chapter: Verifying PnP Search Web Part Connections

Web parts on the search page must be connected in a specific order to function correctly. A broken connection causes the Results web part to show errors or ignore filter selections.

**Step 1:** Navigate to the search page: `https://ruizfoods.sharepoint.com/sites/eng-hub/SitePages/engineering-search.aspx`.

**Step 2:** Click **Edit** (top right) to enter page edit mode.

> [ADD SCREENSHOT: Search page in edit mode showing web part zones]

**Step 3:** Click on the **Search Results** web part and then click **Edit web part** (pencil icon).

> [ADD SCREENSHOT: Search Results web part selected with Edit pencil icon visible]

**Step 4:** In the web part properties panel, scroll to **Data sources** and verify the query template and result source are set correctly:
- Result source: Local SharePoint Results (or `eng-hub` site-scoped)
- Query template: `{searchTerms} Path:"https://ruizfoods.sharepoint.com/sites/eng-hub/*"`

> [ADD SCREENSHOT: Search Results web part data source configuration panel]

**Step 5:** Scroll to **Connections** in the properties panel. Verify:
- **Search Box** connection: linked to the Search Box web part on the page
- **Search Filters** connection: linked to the Search Filters web part

> [ADD SCREENSHOT: Connections section showing Search Box and Search Filters linked]

**Step 6:** Click **Apply** and then **Republish** the page to save changes.

---

## Chapter: Checking Managed Properties for Refiners

If filter/refiner columns (Facility, Area, Classification) show no values or incorrect values, the managed properties may not be mapped correctly.

**Step 1:** In the SharePoint Admin Center, navigate to **Search** → **Manage Search Schema**.

> [ADD SCREENSHOT: Manage Search Schema page]

**Step 2:** Search for the managed property name (e.g., `owstaxIdFacility`, `owstaxIdArea`, `owstaxIdClassification`).

> [ADD SCREENSHOT: Search schema search results showing owstaxId managed properties]

**Step 3:** Click the property and confirm:
- **Refinable:** Yes
- **Queryable:** Yes
- **Searchable:** Yes (for text columns) or mapped to the correct crawled property

> [ADD SCREENSHOT: Managed property settings showing Refinable and Queryable checked]

**Step 4:** If the mapping is missing, click **Add a mapping** and map to the corresponding crawled property (`ows_taxId_{ColumnName}`).

**Step 5:** After saving, trigger a full re-crawl to propagate the mapping changes.

---

## Chapter: Clearing PnP Search Cache

If results are stale or the web part is showing old configurations, clearing the SPFx component cache may resolve the issue.

**Step 1:** In the SharePoint Admin Center, navigate to the **App Catalog**.

**Step 2:** Locate `pnp-modern-search-parts-v4.sppkg` and confirm the version matches the expected release.

**Step 3:** If the version is correct but results are stale, the issue is likely a crawl delay — not a web part problem. Wait for the next scheduled crawl or request a manual one.

**Step 4:** If the web part version is outdated, follow the **Update PnP Modern Search V4 Solution** runbook to redeploy the latest package.

---

## Frequently Asked Questions

**Q: How often does SharePoint crawl the Engineering Hub?**
A: SharePoint Online uses continuous crawling for most content. New documents typically appear in search results within 15–60 minutes of upload. After a re-index request, allow up to 4 hours for large libraries.

**Q: The search page is blank for all users — where do I start?**
A: Start with the Crawl Log in the SharePoint Admin Center. If the crawl is healthy, edit the search page and check that the Search Results web part is still connected to the Search Box web part. A page republish sometimes resolves blank-results issues caused by cached SPFx bundles.

**Q: A specific CEP library's documents don't appear in search — everything else works.**
A: That library likely needs a re-index. Follow the "Re-indexing a Specific Library" chapter. If the issue persists after 4 hours, check whether the library has unique permissions that might restrict the search crawler's access.
