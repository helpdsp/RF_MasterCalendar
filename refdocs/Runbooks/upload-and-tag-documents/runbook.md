# Upload and Tag Engineering Documents

This runbook walks engineering staff and project managers through uploading documents
to the Engineering Hub and applying the required metadata so documents are discoverable
via PnP Modern Search. Proper tagging is essential — untagged documents will not appear
in faceted search results filtered by Facility, Area, or Classification.

**Applies to:** All document libraries — CEP project libraries, CA1/CA4 Assets, CAD Blocks, Agreements

---

## Prerequisites

- **Contribute** or **Edit** permission on the target document library
- Document ready for upload (PDF, DWG, DOCX, XLSX, or other engineering format)
- Metadata values known in advance: Facility, Area, Classification, CEP Project # (if applicable), Legal Entity
- For Agreements: agreement type (COI, MNDA, W9, Visitor's Liability Release), vendor name, and expiration date

---

## Chapter: Navigating to the Correct Library

**Step 1:** Open the Engineering Hub: `https://ruizfoods.sharepoint.com/sites/eng-hub`.

> [ADD SCREENSHOT: Engineering Hub home page with search bar and navigation]

**Step 2:** Use the top navigation to find the correct library:

| Document type | Library to use |
|---|---|
| Capital Engineering Project documents | `CEP YY-NNN Facility Description` library |
| Facility equipment assets (manuals, spare parts, warranties) | CA1 Dinuba Assets or CA4 Vernon MFG Assets |
| Vendor contracts and certificates | Agreements |
| AutoCAD drawing blocks | CAD Blocks |
| Approved project plans | Approved Projects — `{Facility}` |

> [ADD SCREENSHOT: Top navigation menu open showing library options]

**Step 3:** Click the target library to open it.

> [ADD SCREENSHOT: Target document library open in list view]

---

## Chapter: Uploading a Document

**Step 1:** In the document library, click **Upload** → **Files** in the command bar.

> [ADD SCREENSHOT: Upload button clicked showing Files and Folder options]

**Step 2:** In the file picker dialog, navigate to the document on your computer and select it. Click **Open**.

> [ADD SCREENSHOT: Windows file picker with document selected]

**Step 3:** The document appears in the library. Depending on the library's settings, a metadata panel may open automatically on the right.

> [ADD SCREENSHOT: Document uploaded in library with metadata panel open on the right]

---

## Chapter: Selecting the Content Type

**Step 1:** In the metadata panel (or document properties dialog), locate the **Content Type** field.

**Step 2:** Click the dropdown and select the appropriate content type:

| Document type | Content type to select |
|---|---|
| General engineering drawing or document | **Engineering Document** |
| P&ID, electrical, or mechanical drawing | **Drawing** |
| Equipment manual or datasheet | **Equipment Manual** |
| Spare parts list | **Spare Parts List** |
| Safety procedure or permit | **Safety Procedure** |
| Software documentation or license | **Software Documentation** |
| Vendor-supplied document | **Vendor Document** |
| Vendor contract (Agreements library only) | **Agreement Document** |

> [ADD SCREENSHOT: Content Type dropdown showing Engineering Document sub-types]

**Step 3:** Select the correct content type. The metadata fields in the panel may update to show required fields for that type.

---

## Chapter: Filling in Required Metadata

Complete all required metadata fields. Missing values will prevent the document from appearing in filtered search results.

**Step 1:** Fill in the **Facility** field — select the facility where this document applies:

| Value | Facility |
|---|---|
| CA1 Dinuba | Dinuba, CA manufacturing plant |
| CA4 Vernon MFG | Vernon, CA manufacturing plant |
| SC1 Florence | Florence, SC manufacturing plant |
| TX1 Denison | Denison, TX manufacturing plant |

> [ADD SCREENSHOT: Facility field with dropdown showing all four facility options]

**Step 2:** Fill in the **Area** field — select the production area or zone within the facility (e.g., Packaging Line 1, Utilities, Refrigeration, Office).

> [ADD SCREENSHOT: Area field with managed metadata picker open]

**Step 3:** Fill in the **Classification** field — select the document classification (e.g., Confidential, Internal, Public).

**Step 4:** If uploading to a CEP library, fill in **CEP Project #** with the project number in the format `CEP YY-NNN` (e.g., `CEP 26-701`).

> [ADD SCREENSHOT: CEP Project # field filled with example value]

**Step 5:** Fill in the **Legal Entity** field:

| Value | Entity |
|---|---|
| Ruiz Food Products, Inc. (RFP) | Most engineering facilities |
| RG4 Holding Company, LLC (RG4) | Vernon MFG facility |
| RG1 Holding Co. LLC (RG1) | Holding company documents |

**Step 6:** Fill in any remaining optional fields (Supplier/Vendor, EAM Asset #, Description) as applicable.

> [ADD SCREENSHOT: Fully filled metadata panel ready to save]

---

## Chapter: Saving and Verifying

**Step 1:** Click **Save** at the bottom of the metadata panel.

> [ADD SCREENSHOT: Save button highlighted at the bottom of the metadata panel]

**Step 2:** The document library refreshes. Verify the new document row shows the correct metadata in the visible columns.

> [ADD SCREENSHOT: Library view showing newly uploaded document with metadata columns populated]

**Step 3:** To confirm search discoverability, wait 15–60 minutes and then search for the document by name or a metadata value on the search page:
`https://ruizfoods.sharepoint.com/sites/eng-hub/SitePages/engineering-search.aspx`

> **Tip:** Filter the search results by Facility and Area to confirm the document appears in the correct faceted results. If it does not appear after 60 minutes, verify the metadata was saved correctly and consider re-indexing the library (see the Troubleshoot PnP Search runbook).

---

## Frequently Asked Questions

**Q: I uploaded a document but didn't fill in the metadata. How do I add it now?**
A: Click the document name to open the preview, then click **Edit all** in the properties panel on the right. Fill in the required fields and save.

**Q: Can I upload multiple documents at once?**
A: Yes — drag and drop multiple files into the library view at once. However, you will need to edit the metadata for each document individually after upload. Use the bulk edit feature (select multiple documents → Bulk edit properties pane) if all documents share the same Facility, Area, and CEP Project # values.

**Q: I uploaded to the wrong library. Can I move the document?**
A: In the library, select the document, click **More** (the `...` menu) → **Move to** and select the correct library. The metadata should carry over, but verify it after the move.

**Q: Which content type should I use for a document that fits more than one category?**
A: Choose the most specific content type that applies. If uncertain, use **Engineering Document** as the general-purpose type and fill in the Classification field to narrow the category.
