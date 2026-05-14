# Manage Ruiz Foods Taxonomy Terms in Term Store

This runbook walks a SharePoint administrator through adding, editing, and deprecating
managed metadata terms in the **Ruiz Foods Taxonomy** term group. Term changes apply
immediately across all document libraries on the Engineering Hub that use the affected
term set column.

**Applies to:** Term sets — Area, Facility, Classification, Supplier, Legal Entity, Engineering Folder

---

## Prerequisites

- Term Store Administrator or Site Collection Administrator role on `https://ruizfoods.sharepoint.com/sites/eng-hub`
- List of new terms to add (name, parent term set, optional description)
- For deprecations: confirmation from Engineering Manager that the term is no longer in use

---

## Chapter: Accessing the SharePoint Term Store

**Step 1:** Open the SharePoint Admin Center at `https://ruizfoods-admin.sharepoint.com`.

> [ADD SCREENSHOT: SharePoint Admin Center home page]

**Step 2:** In the left navigation, expand **Content services** and select **Term store**.

> [ADD SCREENSHOT: Left navigation showing Content services > Term store]

**Step 3:** The Term Store panel opens. In the left tree view, expand the taxonomy hierarchy until you see the **Ruiz Foods Taxonomy** term group.

> [ADD SCREENSHOT: Term Store panel with Ruiz Foods Taxonomy group expanded]

---

## Chapter: Adding a New Term

**Step 1:** In the term group tree, click the term set you want to add a term to (e.g., **Area**, **Facility**, **Classification**, or **Supplier**).

> [ADD SCREENSHOT: Term set selected in left tree, showing existing terms on the right]

**Step 2:** Click **Add term** (the `+` button next to the term set name, or the **Add term** link in the panel).

> [ADD SCREENSHOT: Add term button highlighted]

**Step 3:** Type the new term name and press **Enter** to confirm.

> [ADD SCREENSHOT: New term name being typed in the inline editor]

**Step 4:** With the new term selected, fill in the **Properties** panel on the right:

| Field | Value |
|---|---|
| **Name** | The term label (e.g., "Bakersfield Plant") |
| **Description** | Brief description of what this term represents |
| **Available for tagging** | Checked (enabled) |

> [ADD SCREENSHOT: Properties panel for new term showing Name, Description, and Available for tagging fields]

**Step 5:** Click **Save** to persist the new term.

> [ADD SCREENSHOT: Save button highlighted in term properties panel]

**Step 6:** Verify the new term appears in the term set list on the left tree.

> [ADD SCREENSHOT: Updated term set list showing the new term]

---

## Chapter: Editing an Existing Term

**Step 1:** In the term set tree, click the term you want to edit.

> [ADD SCREENSHOT: Existing term selected, properties visible on the right]

**Step 2:** In the **Properties** panel, click the pencil/edit icon next to the field you want to change.

**Step 3:** Update the field value and click **Save**.

> **Tip:** Renaming a term updates it everywhere it has been tagged — existing documents are automatically updated. However, any documents tagged with the old term value while offline may need to be re-saved.

---

## Chapter: Deprecating a Term

Use deprecation (not deletion) when a term is no longer valid for new documents but must remain on existing documents for historical accuracy.

**Step 1:** Select the term you want to deprecate.

**Step 2:** In the **Properties** panel, uncheck **Available for tagging**.

> [ADD SCREENSHOT: Available for tagging checkbox unchecked for deprecated term]

**Step 3:** Click **Save**. The term remains in the term store and on existing documents but will no longer appear in the tagging picker for new documents.

> **Note:** Do not delete terms that are still referenced by documents. Deletion breaks the managed metadata column value on those documents and may cause search indexing errors.

---

## Chapter: Verifying Changes in the Document Library

**Step 1:** Navigate to any document library on `https://ruizfoods.sharepoint.com/sites/eng-hub`.

**Step 2:** Open a document's metadata edit panel and click the column that uses the modified term set.

**Step 3:** Confirm the new term appears in the picker (for additions) or no longer appears (for deprecations).

> [ADD SCREENSHOT: Metadata picker showing new term in the suggestions list]

---

## Frequently Asked Questions

**Q: How long does it take for a new term to appear in the metadata picker?**
A: New terms are available immediately after saving. If the picker doesn't show the new term, try clearing your browser cache or waiting 1–2 minutes for the term store cache to refresh.

**Q: Can I add a term under an existing parent term (hierarchical terms)?**
A: Yes. In the tree view, expand the parent term and use **Add term** at that level. The child term will inherit the parent's availability settings.

**Q: Who should I contact before deprecating a Facility or Area term?**
A: Confirm with the Engineering Manager responsible for that facility. Deprecating a Facility term prevents any new documents from being tagged to that facility, which may affect search and reporting.
