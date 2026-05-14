#!/usr/bin/env python3
"""Convert docs/KT-EngineeringWebPortal.md to a branded Word document.

Steps:
  0. Pre-process: discover refdocs/Runbook - *.md files, fix image paths,
     write a merged _kt_merged.md at repo root for pandoc to consume.
  1. Run pandoc on merged file with --resource-path . so images resolve
     from the repo root regardless of where the markdown lives.
  2. python-docx post-processing:
       - Brand heading colors (Ruiz Foods navy #1F2D5C)
       - Navy header row + white text on all tables
       - Resize images wider than 5.5 inches to fit page margins
       - Insert alt-text figure captions below each image paragraph
       - Running header + "Page X of Y" footer on all pages
       - Cover page prepended
  3. Validate: report embedded image count vs. markdown image references.
"""

import re
import subprocess
import sys
from pathlib import Path

from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.oxml.ns import qn
from docx.oxml import OxmlElement

REPO        = Path(__file__).parent.parent
MD_IN       = REPO / "docs" / "KT-EngineeringWebPortal.md"
RUNBOOKS_DIR = REPO / "refdocs" / "Runbooks"   # refdocs/Runbooks/*/runbook.md
MERGED_MD   = REPO / "_kt_merged.md"       # temp; deleted after pandoc
DOCX_TMP    = REPO / "docs" / "_kt_tmp.docx"
DOCX_OUT    = REPO / "docs" / "KT-EngineeringWebPortal.docx"

NAVY  = "1F2D5C"
WHITE = "FFFFFF"
RED   = "CC0000"
GRAY  = "595959"

MAX_IMAGE_WIDTH = Inches(5.5)   # ~page width minus margins

# Namespace URIs used for image introspection
WP_NS = "http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing"
W_NS  = "http://schemas.openxmlformats.org/wordprocessingml/2006/main"


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def rgb(hex_str: str) -> RGBColor:
    h = hex_str.lstrip("#")
    return RGBColor(int(h[0:2], 16), int(h[2:4], 16), int(h[4:6], 16))


def _text_run(para, text: str, size_pt: float = 9, bold: bool = False,
              color_hex: str | None = None):
    run = para.add_run(text)
    run.font.size = Pt(size_pt)
    run.font.bold = bold
    if color_hex:
        run.font.color.rgb = rgb(color_hex)
    return run


def _field_run(para, field_code: str):
    """Append a PAGE / NUMPAGES field as an inline run."""
    r = OxmlElement("w:r")
    rPr = OxmlElement("w:rPr")
    sz = OxmlElement("w:sz")
    sz.set(qn("w:val"), "18")
    rPr.append(sz)
    r.append(rPr)
    fc_begin = OxmlElement("w:fldChar")
    fc_begin.set(qn("w:fldCharType"), "begin")
    r.append(fc_begin)
    instr = OxmlElement("w:instrText")
    instr.text = f" {field_code} "
    r.append(instr)
    fc_end = OxmlElement("w:fldChar")
    fc_end.set(qn("w:fldCharType"), "end")
    r.append(fc_end)
    para._p.append(r)


# ---------------------------------------------------------------------------
# Step 0 — pre-process: merge KT + runbook files, fix image paths
# ---------------------------------------------------------------------------

def _fix_image_paths(content: str, rb_folder_rel: str | None = None) -> str:
    """
    Rewrite image paths so pandoc can resolve them from the repo root.

    - Legacy absolute paths: /refdocs/... → refdocs/...
    - Runbook-relative paths: images/foo.jpg → refdocs/Runbooks/{folder}/images/foo.jpg
    """
    content = content.replace("](/refdocs/", "](refdocs/")
    if rb_folder_rel:
        # images/ is relative to the runbook folder; make it repo-root-relative
        rb_prefix = rb_folder_rel.replace("\\", "/")
        content = content.replace("](images/", f"]({rb_prefix}/images/")
    return content


def _demote_headings(content: str) -> str:
    """
    Demote each heading level by one so a runbook's H1 becomes H2
    and fits under the KT document's existing section hierarchy.
    """
    lines = []
    for line in content.splitlines():
        if line.startswith("#### "):
            lines.append("##### " + line[5:])
        elif line.startswith("### "):
            lines.append("#### " + line[4:])
        elif line.startswith("## "):
            lines.append("### " + line[3:])
        elif line.startswith("# "):
            lines.append("## " + line[2:])
        else:
            lines.append(line)
    return "\n".join(lines)


def build_merged_markdown() -> tuple[Path, str]:
    """
    Merge the KT markdown with every runbook found at
    refdocs/Runbooks/*/runbook.md, sorted by folder name.
    Each runbook is appended as an appendix section.
    Returns (path_to_merged_file, full_merged_content).
    """
    kt_content = MD_IN.read_text(encoding="utf-8")
    kt_content = _fix_image_paths(kt_content)

    runbooks = sorted(RUNBOOKS_DIR.glob("*/runbook.md")) if RUNBOOKS_DIR.exists() else []

    if runbooks:
        print(f"  merge   -> {len(runbooks)} runbook(s) found in refdocs/Runbooks/")
        appendix_parts = []
        for rb_path in runbooks:
            rb_raw = rb_path.read_text(encoding="utf-8")
            # rb_folder_rel: e.g. "refdocs/Runbooks/new-cep-project-library"
            rb_folder_rel = str(rb_path.parent.relative_to(REPO)).replace("\\", "/")
            rb_raw = _fix_image_paths(rb_raw, rb_folder_rel)
            rb_demoted = _demote_headings(rb_raw)
            label = rb_path.parent.name   # e.g. "new-cep-project-library"
            # Use the H1 title from the runbook as the appendix heading if present
            first_h1 = next(
                (l.lstrip("# ").strip() for l in rb_raw.splitlines() if l.startswith("# ")),
                label
            )
            appendix_parts.append(
                f"\n\n---\n\n## Appendix: {first_h1}\n\n{rb_demoted}"
            )
        merged = kt_content + "".join(appendix_parts)
    else:
        print("  merge   -> no runbooks in refdocs/Runbooks/ — using KT markdown as-is")
        merged = kt_content

    MERGED_MD.write_text(merged, encoding="utf-8")
    print(f"  merge   -> _kt_merged.md written ({len(merged):,} chars)")
    return MERGED_MD, merged


# ---------------------------------------------------------------------------
# Step 1 — pandoc
# ---------------------------------------------------------------------------

def run_pandoc(source: Path):
    result = subprocess.run(
        [
            "pandoc", str(source),
            "--from", "markdown",
            "--to", "docx",
            "--output", str(DOCX_TMP),
            "--resource-path", str(REPO),   # resolve images from repo root
            "--toc",
            "--toc-depth=2",
            "--highlight-style=tango",
        ],
        capture_output=True,
        text=True,
        cwd=str(REPO),                      # run from repo root
    )
    if result.returncode != 0:
        sys.exit(f"pandoc failed:\n{result.stderr}")
    if result.stderr:
        # pandoc writes image warnings to stderr even on success
        for line in result.stderr.splitlines():
            if line.strip():
                print(f"  pandoc  [warn] {line.strip()}")
    print(f"  pandoc  -> {DOCX_TMP.name}")


# ---------------------------------------------------------------------------
# Step 2a — heading styles
# ---------------------------------------------------------------------------

def apply_heading_styles(doc: Document):
    for name, sz in [("Heading 1", 16), ("Heading 2", 13), ("Heading 3", 11)]:
        try:
            s = doc.styles[name]
            s.font.color.rgb = rgb(NAVY)
            s.font.size = Pt(sz)
            s.font.bold = True
        except KeyError:
            pass


# ---------------------------------------------------------------------------
# Step 2b — table header shading
# ---------------------------------------------------------------------------

def shade_table_headers(doc: Document):
    for tbl in doc.tables:
        if not tbl.rows:
            continue
        for cell in tbl.rows[0].cells:
            tc_pr = cell._tc.get_or_add_tcPr()
            shd = OxmlElement("w:shd")
            shd.set(qn("w:val"), "clear")
            shd.set(qn("w:color"), "auto")
            shd.set(qn("w:fill"), NAVY)
            tc_pr.append(shd)
            for para in cell.paragraphs:
                for run in para.runs:
                    run.font.color.rgb = rgb(WHITE)
                    run.font.bold = True


# ---------------------------------------------------------------------------
# Step 2c — resize images to fit page margins
# ---------------------------------------------------------------------------

def resize_images(doc: Document):
    """Scale down any inline image wider than MAX_IMAGE_WIDTH proportionally."""
    resized = 0
    total = 0
    for shape in doc.inline_shapes:
        total += 1
        if shape.width > MAX_IMAGE_WIDTH:
            ratio = MAX_IMAGE_WIDTH / shape.width
            shape.height = int(shape.height * ratio)
            shape.width = MAX_IMAGE_WIDTH
            resized += 1
    if resized:
        print(f"  images  -> {total} embedded, {resized} resized to {MAX_IMAGE_WIDTH / 914400:.1f}\" wide")
    else:
        print(f"  images  -> {total} embedded, all within margins")


# ---------------------------------------------------------------------------
# Step 2d — figure captions from alt text
# ---------------------------------------------------------------------------

def add_figure_captions(doc: Document):
    """
    After each paragraph that contains an inline image, insert an italic
    gray caption paragraph using the image's alt-text description.
    """
    inserts = []   # list of (paragraph._p element, alt_text string)

    for para in doc.paragraphs:
        drawings = para._p.findall(f".//{{{W_NS}}}drawing")
        for drawing in drawings:
            docPr = drawing.find(f".//{{{WP_NS}}}docPr")
            if docPr is not None:
                alt = (docPr.get("descr") or docPr.get("name") or "").strip()
                if alt:
                    inserts.append((para._p, alt))
                    break  # one caption per image paragraph

    # Insert in reverse order so earlier insertions don't shift later indices
    for p_elem, alt_text in reversed(inserts):
        cap_p = OxmlElement("w:p")

        cap_pPr = OxmlElement("w:pPr")
        cap_jc = OxmlElement("w:jc")
        cap_jc.set(qn("w:val"), "center")
        cap_pPr.append(cap_jc)
        cap_sp = OxmlElement("w:spacing")
        cap_sp.set(qn("w:before"), "0")
        cap_sp.set(qn("w:after"), "120")
        cap_pPr.append(cap_sp)
        cap_p.append(cap_pPr)

        cap_r = OxmlElement("w:r")
        cap_rPr = OxmlElement("w:rPr")
        cap_rPr.append(OxmlElement("w:i"))
        cap_rPr.append(OxmlElement("w:iCs"))
        cap_color = OxmlElement("w:color")
        cap_color.set(qn("w:val"), GRAY)
        cap_rPr.append(cap_color)
        cap_sz = OxmlElement("w:sz")
        cap_sz.set(qn("w:val"), "16")   # 8pt
        cap_rPr.append(cap_sz)
        cap_r.append(cap_rPr)

        cap_t = OxmlElement("w:t")
        cap_t.text = alt_text
        cap_t.set("{http://www.w3.org/XML/1998/namespace}space", "preserve")
        cap_r.append(cap_t)
        cap_p.append(cap_r)

        p_elem.addnext(cap_p)

    print(f"  captions -> {len(inserts)} figure caption(s) inserted")


# ---------------------------------------------------------------------------
# Step 2e — running header + page-number footer
# ---------------------------------------------------------------------------

def set_headers_footers(doc: Document):
    for sec in doc.sections:
        sec.different_first_page_header_footer = True

        hdr = sec.header
        hdr.is_linked_to_previous = False
        for p in list(hdr.paragraphs):
            p.clear()
        hp = hdr.paragraphs[0] if hdr.paragraphs else hdr.add_paragraph()
        hp.alignment = WD_ALIGN_PARAGRAPH.CENTER
        _text_run(hp,
                  "Ruiz Foods  —  Engineering Web Portal KT Document  |  CONFIDENTIAL",
                  size_pt=9, color_hex=NAVY)

        ftr = sec.footer
        ftr.is_linked_to_previous = False
        for p in list(ftr.paragraphs):
            p.clear()
        fp = ftr.paragraphs[0] if ftr.paragraphs else ftr.add_paragraph()
        fp.alignment = WD_ALIGN_PARAGRAPH.CENTER
        _text_run(fp, "Page ", size_pt=9)
        _field_run(fp, "PAGE")
        _text_run(fp, " of ", size_pt=9)
        _field_run(fp, "NUMPAGES")


# ---------------------------------------------------------------------------
# Step 2f — cover page
# ---------------------------------------------------------------------------

def _cover_para(text: str, size_half: int, bold: bool = False,
                color: str = NAVY, align: str = "center",
                space_before: int = 0, space_after: int = 12):
    p = OxmlElement("w:p")
    pPr = OxmlElement("w:pPr")
    jc = OxmlElement("w:jc")
    jc.set(qn("w:val"), align)
    pPr.append(jc)
    sp = OxmlElement("w:spacing")
    sp.set(qn("w:before"), str(space_before * 20))
    sp.set(qn("w:after"),  str(space_after  * 20))
    pPr.append(sp)
    p.append(pPr)
    if text:
        r = OxmlElement("w:r")
        rPr = OxmlElement("w:rPr")
        for tag in ("w:sz", "w:szCs"):
            el = OxmlElement(tag)
            el.set(qn("w:val"), str(size_half))
            rPr.append(el)
        if bold:
            rPr.append(OxmlElement("w:b"))
            rPr.append(OxmlElement("w:bCs"))
        col = OxmlElement("w:color")
        col.set(qn("w:val"), color)
        rPr.append(col)
        r.append(rPr)
        t = OxmlElement("w:t")
        t.text = text
        t.set("{http://www.w3.org/XML/1998/namespace}space", "preserve")
        r.append(t)
        p.append(r)
    return p


def _page_break_para():
    p = OxmlElement("w:p")
    r = OxmlElement("w:r")
    br = OxmlElement("w:br")
    br.set(qn("w:type"), "page")
    r.append(br)
    p.append(r)
    return p


def insert_cover(doc: Document):
    body = doc.element.body
    rows = [
        ("",                                           20, False, NAVY,    "center", 0,  0),
        ("",                                           20, False, NAVY,    "center", 0,  0),
        ("",                                           20, False, NAVY,    "center", 0,  0),
        ("",                                           20, False, NAVY,    "center", 0,  0),
        ("",                                           20, False, NAVY,    "center", 0,  0),
        ("",                                           20, False, NAVY,    "center", 0,  0),
        ("Engineering Web Portal",                     56, True,  NAVY,    "center", 0,  6),
        ("Knowledge Transfer Document",                32, False, NAVY,    "center", 0, 40),
        ("",                                           20, False, NAVY,    "center", 0,  0),
        ("Ruiz Foods, Inc.",                           28, True,  NAVY,    "center", 0,  6),
        ("Engineering Department",                     22, False, NAVY,    "center", 0,  6),
        ("",                                           20, False, NAVY,    "center", 0,  0),
        ("May 8, 2026",                                22, False, "444444", "center", 0, 6),
        ("https://ruizfoods.sharepoint.com/sites/eng-hub",
                                                       18, False, "444444", "center", 0, 40),
        ("",                                           20, False, NAVY,    "center", 0,  0),
        ("CONFIDENTIAL  —  INTERNAL USE ONLY",         20, True,  RED,     "center", 0,  0),
    ]
    body.insert(0, _page_break_para())
    for row in reversed(rows):
        body.insert(0, _cover_para(*row))


# ---------------------------------------------------------------------------
# Step 3 — validate image embedding
# ---------------------------------------------------------------------------

def validate_images(doc: Document, merged_content: str):
    md_count  = len(re.findall(r"!\[", merged_content))
    docx_count = len(list(doc.inline_shapes))
    if docx_count < md_count:
        missing = md_count - docx_count
        print(f"  validate -> {docx_count}/{md_count} images embedded "
              f"[WARNING: {missing} image(s) not found — check refdocs/ paths]")
    else:
        print(f"  validate -> {docx_count}/{md_count} images embedded [OK]")


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main():
    print("Building KT-EngineeringWebPortal.docx...")

    merged_path, merged_content = build_merged_markdown()

    run_pandoc(merged_path)

    doc = Document(str(DOCX_TMP))

    print("  styles  -> heading colors")
    apply_heading_styles(doc)

    print("  tables  -> header row shading")
    shade_table_headers(doc)

    print("  images  -> resizing oversized images")
    resize_images(doc)

    print("  captions -> adding figure captions")
    add_figure_captions(doc)

    print("  layout  -> header / footer")
    set_headers_footers(doc)

    print("  cover   -> prepending cover page")
    insert_cover(doc)

    validate_images(doc, merged_content)

    doc.save(str(DOCX_OUT))

    # Clean up temp files
    DOCX_TMP.unlink(missing_ok=True)
    MERGED_MD.unlink(missing_ok=True)

    size_kb = DOCX_OUT.stat().st_size // 1024
    print(f"  saved   -> {DOCX_OUT.name}  ({size_kb} KB)")


if __name__ == "__main__":
    main()
