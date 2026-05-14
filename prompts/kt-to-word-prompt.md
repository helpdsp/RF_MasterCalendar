# Prompt — Convert KT Markdown to Word Document (Ruiz Foods)

> **How to use:** Copy everything from the horizontal rule below and paste it as
> your first message in a new Claude Code session (or in this same session).
> No placeholders to fill — works as-is for the Engineering Web Portal KT.

---

---

## TASK

Convert the Knowledge Transfer Document at `docs/KT-EngineeringWebPortal.md`
into a professional Microsoft Word document (`.docx`) that can be shared with
IT Leadership and used as an official handover document at Ruiz Foods, Inc.

The output file should be: `docs/KT-EngineeringWebPortal.docx`

---

## STEP 0 — PRE-PROCESSING (required before pandoc)

Before converting, run the pre-processing step that:

1. **Discovers runbook source files** — scans `refdocs/Runbooks/*/runbook.md`
   (one subfolder per runbook, sorted alphabetically). Each runbook folder
   contains a `runbook.md` and an `images/` subfolder with screenshots.

2. **Fixes image paths** — runbook markdowns reference screenshots as relative
   `images/foo.jpg` paths. These are rewritten to repo-root-relative paths
   (`refdocs/Runbooks/{folder}/images/foo.jpg`) so pandoc can find them via
   `--resource-path .`.

3. **Demotes heading levels** — each runbook's H1 becomes H2 (the appendix
   title shown in the TOC), H2 → H3 (chapters), H3 → H4 (sub-steps):
   - `# Runbook Title` → `## Appendix: Runbook Title`
   - `## Chapter: ...` → `### Chapter: ...`
   - `### Sub-section` → `#### Sub-section`

4. **Writes a merged temp file** — `_kt_merged.md` at the repo root, combining
   the KT markdown and all runbook appendices. This file is deleted after pandoc
   runs.

**Script:** `py scripts/build-docx.py` handles all of the above automatically.

---

## STEP 1 — CONVERSION APPROACH

### Option A — `scripts/build-docx.py` (preferred — handles everything)

This script implements all pre-processing, pandoc invocation, branding
post-processing, and validation in one pass:

```bash
py scripts/build-docx.py
```

Requirements: pandoc installed + `py -m pip install python-docx`

---

### Option B — Manual pandoc (if you need to run pandoc directly)

After completing Step 0 pre-processing manually, run pandoc on the merged file:

```powershell
pandoc _kt_merged.md `
  --from markdown `
  --to docx `
  --output docs/KT-EngineeringWebPortal.docx `
  --resource-path . `
  --toc `
  --toc-depth=2 `
  --highlight-style=tango
```

> `--resource-path .` is **required** — it tells pandoc to resolve image paths
> from the repo root (where `refdocs/mockups/` lives). Without it, pandoc
> looks only in `docs/` and all runbook screenshots will be missing.

---

### Option C — Node.js with `docx` npm package (if pandoc not available)

```bash
npm install docx markdown-it
```

Write `scripts/md-to-docx.js` that reads the merged markdown, embeds images
by resolving paths from the repo root, and outputs the docx.

---

## WORD DOCUMENT REQUIREMENTS

### Structure

- [ ] **Cover page** with:
  - Solution name: "Engineering Web Portal"
  - Subtitle: "Knowledge Transfer Document"
  - Organization: "Ruiz Foods, Inc." + "Engineering Department"
  - Date: May 8, 2026
  - Site URL: https://ruizfoods.sharepoint.com/sites/eng-hub
  - "CONFIDENTIAL — INTERNAL USE ONLY" in red
- [ ] **Table of Contents** (auto-generated, 2 levels deep)
- [ ] **Page numbers** in footer (format: "Page X of Y")
- [ ] **Running header** on every page after cover:
  `Ruiz Foods — Engineering Web Portal KT Document | CONFIDENTIAL`
- [ ] All 11 KT sections present and complete
- [ ] All runbook appendices appended after Section 11 with "Appendix:" prefix headings

### Formatting

- [ ] **Heading 1** → document title only
- [ ] **Heading 2** → each of the 11 numbered sections + each runbook appendix
- [ ] **Heading 3** → subsections within sections and runbook chapters
- [ ] **Heading 4** → sub-subsections within runbook chapters
- [ ] **Tables** → header row shaded navy (`#1F2D5C`) with white bold text;
  no table overflows page margin
- [ ] **Code blocks** (CAML queries, architecture diagram) → monospace
  Courier New 9pt, light gray background
- [ ] **Bold / inline code** → preserved from Markdown
- [ ] **Bullet and numbered lists** → properly indented
- [ ] **Blockquotes** (`> Note:`, `> Tip:`) → indented with left border or
  light background

### Images (runbook screenshots)

- [ ] **All images embedded** — not linked externally; verify count matches
  source markdown
- [ ] **Images resized** — any image wider than 5.5 inches scaled down
  proportionally to fit within page margins
- [ ] **Figure captions** — alt text rendered as an italic, gray, 8pt caption
  centered below each image

### Branding (Ruiz Foods)

- **Primary heading color:** `#1F2D5C` (dark navy) — from brand guidelines
- **Table header:** navy background with white text
- **Body font:** Calibri 11pt (M365 default)
- **Heading font:** Calibri Light
- **CONFIDENTIAL label:** `#CC0000` red on cover page

---

## VALIDATION AFTER CONVERSION

After generating the `.docx`, verify:

- [ ] Open in Microsoft Word — no rendering errors
- [ ] Table of Contents resolves (update fields: Ctrl+A → F9 if needed)
- [ ] All 11 section headings appear in TOC
- [ ] Each runbook appendix appears in TOC as an H2 entry
- [ ] **Image count matches** — script reports `X/Y images embedded [OK]`;
  if any are missing, check that:
  - Image paths in the runbook `.md` use `](refdocs/...` (not `](/refdocs/...`)
  - pandoc was run with `--resource-path .` from the repo root
  - Image files exist in `refdocs/mockups/{runbook-folder}/`
- [ ] All screenshots display at a readable size (≤5.5" wide)
- [ ] Each screenshot is followed by an italic gray caption
- [ ] Tables do not overflow page margins
- [ ] Code blocks readable in monospace
- [ ] Architecture diagram intact
- [ ] No raw Markdown syntax visible (`##`, `**`, `|`, `` ` ``)
- [ ] Page count reasonable (expect 25–60 pages with runbook screenshots)
- [ ] Footer shows page numbers on all pages except cover
- [ ] Header shows on all pages except cover

---

## ADDING A NEW RUNBOOK

Runbooks live in `refdocs/Runbooks/` — one subfolder per runbook:

```
refdocs/Runbooks/
  {runbook-folder-name}/
    runbook.md       ← full step-by-step content
    images/          ← screenshots referenced from runbook.md
      step-01.jpg
      step-02.jpg
      ...
```

To add a new runbook:

1. Create the folder: `refdocs/Runbooks/{kebab-case-name}/`
2. Create `runbook.md` using this chapter structure:
   ```markdown
   # Runbook Title
   Brief description of what this runbook covers.
   ## Prerequisites
   - ...
   ## Chapter: Step group name
   **Step 1:** ...
   ![Description of what the screenshot shows](images/step-01.jpg)
   **Step 2:** ...
   ```
3. Drop screenshots into `images/` and reference them as `![alt text](images/filename.jpg)`
4. Update `spec-kit/input/runbooks.md` — add a row to the Runbook Inventory table
5. Re-run `py scripts/build-docx.py` — the new runbook is automatically
   discovered (sorted alphabetically), path-fixed, and appended as a new appendix

No changes to `build-docx.py` or the KT markdown are needed.

> **Stub runbooks** — if images are not yet ready, use `> [ADD SCREENSHOT: description]`
> blockquotes as placeholders. The Word document will include the placeholder text
> until real screenshots are added.

---

## IF CONVERSION TOOLS ARE NOT AVAILABLE

If pandoc is not available, use the Word COM object as a last resort:

```powershell
$word = New-Object -ComObject Word.Application
$word.Visible = $false
$doc = $word.Documents.Open("$PWD\_kt_merged.md")
$doc.SaveAs2("$PWD\docs\KT-EngineeringWebPortal.docx", 16)  # 16 = docx
$doc.Close(); $word.Quit()
```

Note: COM conversion does not embed images or apply branding — treat as a
plain-text fallback only.

---

## OUTPUT

```
docs/KT-EngineeringWebPortal.docx    <- primary deliverable
```

Expected file size: 500 KB – 3 MB when runbook screenshots are embedded.

---

*Prompt version: 2.0 — Engineering Web Portal / VISION Framework*
*Supports: multi-runbook appendices, embedded screenshots, figure captions*
