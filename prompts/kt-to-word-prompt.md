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

1. **Discovers runbook source files** — scans `refdocs/` for any files matching
   `Runbook - *.md`. Each file is a detailed step-by-step runbook with
   screenshots that must be appended to the Word document as an appendix section.

2. **Fixes image paths** — the runbook markdown files reference images with
   absolute paths like `](/refdocs/mockups/...)`. These must be rewritten to
   relative paths (`](refdocs/mockups/...)`) so pandoc can resolve them from
   the repo root.

3. **Demotes heading levels** — runbook files use `# Title` (H1) and
   `## Chapter` (H2). When appended to the KT document, headings are demoted
   by one level so they nest correctly under the existing section hierarchy:
   - Runbook H1 → H2 (appears as "Appendix: {runbook title}" in TOC)
   - Runbook H2 → H3
   - Runbook H3 → H4

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

To include an additional runbook scenario in future Word exports:

1. Create `refdocs/Runbook - {scenario name}.md` following the chapter
   structure used in existing runbooks.
2. Place all screenshots in `refdocs/mockups/Runbook - {scenario name}/`.
3. Reference images in the markdown as:
   `![Alt text describing the screenshot](/refdocs/mockups/Runbook - {scenario name}/image.jpg)`
4. Re-run `py scripts/build-docx.py` — the new runbook is automatically
   discovered and appended as a new appendix.

No changes to `build-docx.py` or the KT markdown are needed.

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
