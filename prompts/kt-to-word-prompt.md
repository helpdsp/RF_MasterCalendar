# Prompt — Convert KT Markdown to Word Document (Ruiz Foods)

> **How to use:** Copy everything from the horizontal rule below and paste it as your first message in a new Claude Code session (or in this same session). No placeholders to fill — works as-is for the Praise Program KT.

---

---

## TASK

Convert the Knowledge Transfer Document at `docs/KT-InvoicesForTaxTeam.md` into a professional Microsoft Word document (`.docx`) that can be shared with IT Leadership and used as an official handover document at Ruiz Foods, Inc.

The output file should be: `docs/KT-InvoicesForTaxTeam.docx`

---

## APPROACH — CHECK IN THIS ORDER

### Option A — pandoc (preferred, best fidelity)

Check if pandoc is installed:
```powershell
pandoc --version
```

If available, run:
```powershell
pandoc docs/KT-Praise-Program.md `
  --from markdown `
  --to docx `
  --output docs/KT-Praise-Program.docx `
  --toc `
  --toc-depth=2 `
  --highlight-style=tango
```

If you want to apply a Word reference template for branding (recommended):
```powershell
pandoc docs/KT-Praise-Program.md `
  --from markdown `
  --to docx `
  --output docs/KT-Praise-Program.docx `
  --reference-doc=prompts/word-reference-template.docx `
  --toc `
  --toc-depth=2
```

> To generate a starter reference template: `pandoc -o prompts/word-reference-template.docx --print-default-data-file reference.docx`
> Then open it in Word and apply Ruiz Foods fonts/colors to the Heading 1, Heading 2, Heading 3, Normal, and Table styles.

### Option B — Node.js with `docx` npm package (if pandoc not available)

Install the package and write a conversion script:
```bash
npm install docx markdown-it
```

Write a script at `scripts/md-to-docx.js` that:
1. Reads `docs/KT-Praise-Program.md`
2. Parses it with `markdown-it`
3. Generates a `docx` using the `docx` npm package
4. Writes `docs/KT-Praise-Program.docx`

### Option C — Python with python-docx (if Python available)

Check: `python --version`

Install: `pip install python-docx mistune`

Write a script at `scripts/md_to_docx.py` that converts the markdown to docx with proper heading mapping.

---

## WORD DOCUMENT REQUIREMENTS

### Structure
- [ ] **Cover page** with: Solution name ("Praise Program"), subtitle ("Knowledge Transfer Document"), organization ("Ruiz Foods, Inc."), date (2026-05-07), and "CONFIDENTIAL — INTERNAL USE ONLY"
- [ ] **Table of Contents** (auto-generated, 2 levels deep)
- [ ] **Page numbers** in footer (format: "Page X of Y")
- [ ] **Header** on every page (after cover): "Ruiz Foods — Praise Program KT Document | CONFIDENTIAL"
- [ ] All 11 sections from the Markdown must be present and complete

### Formatting
- [ ] **Heading 1** → each of the 11 numbered sections (e.g., "1. Functional Overview")
- [ ] **Heading 2** → subsections (e.g., "3.1 Praise List", "9.1 Task 1 — Approve a Praise")
- [ ] **Heading 3** → sub-subsections (e.g., "Custom Fields", "Key System Fields")
- [ ] **Tables** → properly formatted with header row shading; no table should overflow the page margin
- [ ] **Code blocks** (CAML queries, architecture diagram, CSV headers) → monospace font (Courier New 9pt), light gray background
- [ ] **Bold text** → preserved from Markdown `**bold**`
- [ ] **Inline code** → monospace font, preserved from Markdown backticks
- [ ] **Bullet and numbered lists** → properly indented
- [ ] **Horizontal rules** (`---`) → convert to a thin page-width line separator

### Branding (Ruiz Foods / El Monterey)
Apply these styles based on brand guidelines in `refdocs/`:
- **Primary heading color:** Use brand primary color from `Learning Color Brand Guide.pdf` (if known; otherwise use dark navy `#1F2D5C` as placeholder — confirm with stakeholder)
- **Table header row:** Brand primary color background with white text
- **Accent / highlight color:** Brand secondary color for callout boxes or important notes
- **Body font:** As specified in `RZF003_22 El Monterey_Brand_Guidelines_10_27_22_v3 (1).pdf` (if known; otherwise use Calibri 11pt as M365 default)
- **Heading font:** As specified in brand guidelines (if known; otherwise use Calibri Light)
- **Logo:** If you have a Ruiz Foods or El Monterey logo file available, add it to the cover page and page header

### Special Elements
- [ ] The **architecture diagram** (ASCII art in Section 2) → render inside a fixed-width code block or as a monospace text box; do NOT try to convert it to a Visio/SmartArt shape
- [ ] **Callout box** for the `> Note:` and `> Critical:` blockquotes → light yellow or light blue background box with left border accent
- [ ] **Appendix** section at the end → formatted as a separate section with "Appendix" as a Heading 1

---

## VALIDATION AFTER CONVERSION

After generating the `.docx`, verify:

- [ ] Open in Microsoft Word and confirm no rendering errors
- [ ] Table of Contents resolves correctly (update fields if needed: Ctrl+A → F9)
- [ ] All 11 section headings appear in the TOC
- [ ] Tables do not overflow page margins (adjust column widths if needed)
- [ ] Code blocks (CAML queries, CSV headers) are readable in monospace
- [ ] Architecture diagram is intact and readable
- [ ] No Markdown syntax characters (`##`, `**`, `|`, `` ` ``) visible in the rendered document
- [ ] Page count is reasonable (expect 15–25 pages for this document)
- [ ] Footer shows correct page numbers
- [ ] Header shows on all pages except cover

---

## IF CONVERSION TOOLS ARE NOT AVAILABLE

If neither pandoc, Node.js docx package, nor Python are available, provide:

1. A **PowerShell script** that opens the `.md` file and uses the **Word COM object** (`New-Object -ComObject Word.Application`) to create the document programmatically — only as a last resort, as this is slow and requires Word to be installed on the machine.

2. Or **instructions for manual conversion** using the Microsoft Word built-in Markdown import (File → Open → change file type to All Files → open the .md file → Word will auto-convert).

---

## OUTPUT

```
docs/KT-Praise-Program.docx    ← primary deliverable
```

Confirm the file size is reasonable (expect 200KB–2MB for a document of this size without embedded images).

---

*Prompt version: 1.0 — Companion to kt-master-prompt.md*
*Repo: rf_praise / VISION Framework*
