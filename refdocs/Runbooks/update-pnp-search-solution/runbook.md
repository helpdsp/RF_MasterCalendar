# Deploy / Update PnP Modern Search V4 Solution

This runbook covers deploying a new or updated version of the **PnP Modern Search
Web Parts V4** SPFx solution to the Ruiz Foods SharePoint App Catalog. Run this
when a new release is available from the PnP GitHub or when the web parts need to
be redeployed after a tenant migration.

**Solution package:** `pnp-modern-search-parts-v4.sppkg`
**App Catalog URL:** `https://ruizfoods.sharepoint.com/sites/appcatalog`
**GitHub releases:** `https://github.com/microsoft-search/pnp-modern-search/releases`

---

## Prerequisites

- SharePoint App Catalog Owner or Tenant Administrator role
- Latest `.sppkg` file downloaded from the PnP Modern Search GitHub releases page
- Change window approved — avoid deploying during peak engineering hours (6 AM–6 PM weekdays)
- Notify IT team before starting in case the deployment causes a brief search page disruption

---

## Chapter: Downloading the Latest Release

**Step 1:** Open the PnP Modern Search releases page at `https://github.com/microsoft-search/pnp-modern-search/releases`.

> [ADD SCREENSHOT: GitHub releases page showing latest PnP Modern Search V4 release]

**Step 2:** Locate the latest stable release (not a pre-release). Under **Assets**, download `pnp-modern-search-parts-v4.sppkg`.

> [ADD SCREENSHOT: Release assets section with pnp-modern-search-parts-v4.sppkg highlighted]

**Step 3:** Note the release version number (e.g., `4.9.0`) — you will need this to verify the deployment completed correctly.

---

## Chapter: Uploading to the App Catalog

**Step 1:** Open the SharePoint App Catalog: `https://ruizfoods.sharepoint.com/sites/appcatalog`.

> [ADD SCREENSHOT: App Catalog home page]

**Step 2:** In the left navigation, click **Apps for SharePoint**.

> [ADD SCREENSHOT: Apps for SharePoint library in left navigation]

**Step 3:** Click **Upload** and select the `pnp-modern-search-parts-v4.sppkg` file you downloaded.

> [ADD SCREENSHOT: Upload dialog with sppkg file selected]

**Step 4:** If a previous version already exists, SharePoint will ask if you want to replace it. Click **Replace** (or **OK**) to confirm the upgrade.

> [ADD SCREENSHOT: Replace existing app dialog]

---

## Chapter: Deploying and Trusting the Solution

**Step 1:** After upload, a dialog appears asking whether to deploy the solution. Ensure **Make this solution available to all sites in the organization** is checked for a tenant-wide deployment.

> [ADD SCREENSHOT: Deploy solution dialog with tenant-wide deployment checkbox]

**Step 2:** Click **Deploy**. SharePoint will validate the package and deploy it.

**Step 3:** A second dialog may appear asking you to trust the solution's requested permissions (SharePoint Search access, etc.). Review the permissions and click **Trust It**.

> [ADD SCREENSHOT: Trust dialog showing requested API permissions]

**Step 4:** The deployment is complete when the app row shows the new version number in the **App Version** column of the Apps for SharePoint library.

> [ADD SCREENSHOT: Apps for SharePoint list showing updated version number]

---

## Chapter: Verifying Existing Web Parts Still Function

After deployment, verify the search page web parts continue to work without reconfiguration.

**Step 1:** Navigate to the Engineering Hub search page:
`https://ruizfoods.sharepoint.com/sites/eng-hub/SitePages/engineering-search.aspx`

> [ADD SCREENSHOT: Engineering Hub search page after deployment]

**Step 2:** Type a test query in the Search Box (e.g., "pump manual") and press Enter.

**Step 3:** Confirm results appear and the filter panel (Facility, Area, Classification) is still functional.

> [ADD SCREENSHOT: Search results page showing results and active filter refiners]

**Step 4:** Apply a filter (e.g., select a Facility) and confirm the results update correctly.

**Step 5:** If any web part shows an error or blank state, perform a hard browser refresh (`Ctrl+Shift+R`) — this clears the cached SPFx bundle. If the error persists, follow the **Troubleshoot PnP Modern Search** runbook.

---

## Chapter: Handling a Major Version Upgrade

For major version upgrades (e.g., 4.x → 5.x), web parts may require reconfiguration because the internal component IDs change.

**Step 1:** After deployment, navigate to the search page and enter edit mode.

> [ADD SCREENSHOT: Search page in edit mode showing web parts]

**Step 2:** If a web part shows a "This web part cannot be found" error, remove it and re-add the new version from the **PnP Modern Search** section of the web part picker.

> [ADD SCREENSHOT: Web part picker open with PnP Modern Search web parts listed]

**Step 3:** Reconfigure the web part connections (Search Box → Results → Filters) using the **Connections** panel in the web part properties.

**Step 4:** Reconfigure the result template, query template, and managed property refiners for the Search Results and Search Filters web parts.

**Step 5:** Publish the page and run a full end-to-end test.

> **Note:** For minor updates within the same major version (e.g., 4.8 → 4.9), no web part reconfiguration is typically needed.

---

## Rollback Procedure

If the deployment causes issues and a rollback is needed:

**Step 1:** In the App Catalog, re-upload the previous version of `pnp-modern-search-parts-v4.sppkg` (keep previous versions in a `releases/` folder on the IT SharePoint or OneDrive).

**Step 2:** Follow the same deploy-and-trust steps with the previous package.

**Step 3:** Hard-refresh the search page on all affected browsers.

---

## Frequently Asked Questions

**Q: How do I check which version of PnP Modern Search is currently deployed?**
A: Open the App Catalog → Apps for SharePoint → find `pnp-modern-search-parts-v4.sppkg` → check the **App Version** column.

**Q: Do I need to update every site that uses PnP Modern Search, or just the App Catalog?**
A: Tenant-wide deployment means the update applies to all sites automatically after you deploy to the App Catalog. No per-site action is needed.

**Q: After deployment, how quickly will users see the updated web parts?**
A: Immediately after a hard browser refresh. Cached bundles in the browser may serve the old version for users who do not refresh. CDN propagation for the updated bundle is typically complete within 5–15 minutes.
