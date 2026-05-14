# Manage Unique Permissions on Assets Libraries

This runbook covers granting and revoking access on the **CA1 Dinuba Assets** and
**CA4 Vernon MFG Assets** document libraries, which carry unique role assignments
independent of the main Engineering Hub site permissions.

**Applies to:** CA1 Dinuba Assets (`/sites/eng-hub/CA1DinubaAssets`), CA4 Vernon MFG Assets (`/sites/eng-hub/CA4VernonAssets`)

---

## Prerequisites

- Site Collection Administrator role on `https://ruizfoods.sharepoint.com/sites/eng-hub`, OR
- Full Control permission level on the specific Assets library
- Employee name and email address
- Required permission level: **Read** (view only) or **Contribute** (upload/edit)
- For offboarding: employee name and confirmation from HR or manager

---

## Chapter: Navigating to Library Permissions

**Step 1:** Open the Engineering Hub: `https://ruizfoods.sharepoint.com/sites/eng-hub`.

> [ADD SCREENSHOT: Engineering Hub home page]

**Step 2:** In the left navigation or top menu, navigate to the target Assets library — either **CA1 Dinuba Assets** or **CA4 Vernon MFG Assets**.

> [ADD SCREENSHOT: Library navigation showing CA1 Dinuba Assets selected]

**Step 3:** Click the **Settings** gear icon (top right) and select **Library settings**.

> [ADD SCREENSHOT: Settings gear dropdown with Library settings highlighted]

**Step 4:** On the Library Settings page, under **Permissions and Management**, click **Permissions for this document library**.

> [ADD SCREENSHOT: Library Settings page with Permissions for this document library link]

**Step 5:** Confirm the banner reads **"This library has unique permissions"** (not inheriting from the site). If it reads "inheriting," stop and contact the SharePoint Administrator — do not break inheritance here without authorization.

> [ADD SCREENSHOT: Permissions page showing unique permissions banner]

---

## Chapter: Granting Access to a User or Group

**Step 1:** On the Library Permissions page, click **Grant Permissions** in the top toolbar.

> [ADD SCREENSHOT: Grant Permissions button highlighted in the toolbar]

**Step 2:** In the **Share** dialog, type the employee's name or email address in the search box. Select the correct account from the suggestions.

> [ADD SCREENSHOT: Share dialog with user search and suggestions visible]

**Step 3:** Click **Show Options** and uncheck **Send an email invitation** if you do not want an automated email sent.

**Step 4:** In the **Select a permission level** dropdown, choose the appropriate level:

| Permission Level | Use When |
|---|---|
| **Read** | Employee needs to view and download files only |
| **Contribute** | Employee needs to upload, edit, and delete files |
| **Full Control** | Reserved for library owners and IT admins |

> [ADD SCREENSHOT: Permission level dropdown with Contribute selected]

**Step 5:** Click **Share** to apply the permission.

> [ADD SCREENSHOT: Confirmation that permission was granted]

**Step 6:** Back on the Library Permissions page, search for the user to verify they appear with the correct permission level.

> [ADD SCREENSHOT: Permissions list showing newly added user with their permission level]

---

## Chapter: Revoking Access (Offboarding or Role Change)

**Step 1:** On the Library Permissions page, locate the user or group whose access needs to be removed.

> [ADD SCREENSHOT: Permissions list with the target user visible]

**Step 2:** Check the checkbox next to the user's name.

**Step 3:** Click **Remove User Permissions** in the top toolbar.

> [ADD SCREENSHOT: Remove User Permissions button highlighted after selecting user]

**Step 4:** Confirm the removal in the dialog that appears.

**Step 5:** Verify the user no longer appears in the permissions list.

> [ADD SCREENSHOT: Permissions list after removal — user no longer visible]

> **Note:** Removing a user's permission from the library does not remove their access to the broader Engineering Hub site. If the user should be removed from the site entirely, that must be done separately in Site Settings → Site Permissions.

---

## Chapter: Checking a User's Current Access

If you need to verify what access a specific person currently has before making changes:

**Step 1:** On the Library Permissions page, click **Check Permissions** in the toolbar.

> [ADD SCREENSHOT: Check Permissions button in the toolbar]

**Step 2:** Type the user's name or email and click **Check Now**.

**Step 3:** Review the result — it shows the effective permission level and which group or direct assignment grants it.

> [ADD SCREENSHOT: Check Permissions result showing user's effective permission level]

---

## Frequently Asked Questions

**Q: Why do the Assets libraries have unique permissions while other CEP libraries do not?**
A: The Assets libraries contain facility-specific equipment records (spare parts lists, warranty docs, calibration records) that are sensitive to each facility's operations team. Unique permissions allow CA1 staff to access CA1 assets without seeing CA4 asset data, and vice versa.

**Q: If I add someone to the site's Members group, will they automatically get access to the Assets libraries?**
A: No. Because the Assets libraries break permission inheritance, site-level group changes do not propagate to them. Access must be granted explicitly at the library level using this runbook.

**Q: Who should approve access requests for the Assets libraries?**
A: The Engineering Manager for the relevant facility (CA1 or CA4) should approve access. IT then implements the change following this runbook.
