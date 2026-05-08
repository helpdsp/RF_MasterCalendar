#!/usr/bin/env python3
"""Convert docs/KT-EngineeringWebPortal.md to a branded Word document.

Steps:
  1. Run pandoc  → _kt_tmp.docx  (handles TOC, heading hierarchy, tables, code blocks)
  2. python-docx → KT-EngineeringWebPortal.docx
       - Brand heading colors (Ruiz Foods navy #1F2D5C)
       - Navy header row + white text on all tables
       - Running header + "Page X of Y" footer on all pages
       - Cover page prepended (title, subtitle, date, CONFIDENTIAL)
"""

import subprocess
import sys
from pathlib import Path

from docx import Document
from docx.shared import Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.oxml.ns import qn
from docx.oxml import OxmlElement

REPO     = Path(__file__).parent.parent
MD_IN    = REPO / "docs" / "KT-EngineeringWebPortal.md"
DOCX_TMP = REPO / "docs" / "_kt_tmp.docx"
DOCX_OUT = REPO / "docs" / "KT-EngineeringWebPortal.docx"

NAVY  = "1F2D5C"
WHITE = "FFFFFF"
RED   = "CC0000"


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
    """Append a Word field (PAGE / NUMPAGES) as an inline run."""
    r = OxmlElement("w:r")
    rPr = OxmlElement("w:rPr")
    sz = OxmlElement("w:sz")
    sz.set(qn("w:val"), "18")
    rPr.append(sz)
    r.append(rPr)
    for ftype in ("begin", "end"):
        if ftype == "begin":
            fc = OxmlElement("w:fldChar")
            fc.set(qn("w:fldCharType"), "begin")
            r.append(fc)
            instr = OxmlElement("w:instrText")
            instr.text = f" {field_code} "
            r.append(instr)
        else:
            fc = OxmlElement("w:fldChar")
            fc.set(qn("w:fldCharType"), "end")
            r.append(fc)
    para._p.append(r)


# ---------------------------------------------------------------------------
# Step 1 — pandoc
# ---------------------------------------------------------------------------

def run_pandoc():
    result = subprocess.run(
        [
            "pandoc", str(MD_IN),
            "--from", "markdown",
            "--to", "docx",
            "--output", str(DOCX_TMP),
            "--toc",
            "--toc-depth=2",
            "--highlight-style=tango",
        ],
        capture_output=True,
        text=True,
    )
    if result.returncode != 0:
        sys.exit(f"pandoc failed:\n{result.stderr}")
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
# Step 2c — running header + page-number footer
# ---------------------------------------------------------------------------

def set_headers_footers(doc: Document):
    """
    Enable different-first-page on every section so the cover page is bare.
    Set the main header and footer on every section.
    """
    for sec in doc.sections:
        sec.different_first_page_header_footer = True

        # Header (non-first pages)
        hdr = sec.header
        hdr.is_linked_to_previous = False
        for p in list(hdr.paragraphs):
            p.clear()
        hp = hdr.paragraphs[0] if hdr.paragraphs else hdr.add_paragraph()
        hp.alignment = WD_ALIGN_PARAGRAPH.CENTER
        _text_run(hp,
                  "Ruiz Foods — Engineering Web Portal KT Document  |  CONFIDENTIAL",
                  size_pt=9, color_hex=NAVY)

        # Footer (non-first pages) — "Page X of Y"
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
# Step 2d — cover page
# ---------------------------------------------------------------------------

def _cover_para(text: str, size_half: int, bold: bool = False,
                color: str = NAVY, align: str = "center",
                space_before: int = 0, space_after: int = 12):
    """Build a raw <w:p> element for the cover page (no doc reference needed)."""
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
    """Prepend a cover page to the document body, followed by a page break."""
    body = doc.element.body

    # Cover rows: (text, size_half_pt, bold, color, align, space_before, space_after)
    rows = [
        ("",                                          20, False, NAVY,  "center",  0,  0),
        ("",                                          20, False, NAVY,  "center",  0,  0),
        ("",                                          20, False, NAVY,  "center",  0,  0),
        ("",                                          20, False, NAVY,  "center",  0,  0),
        ("",                                          20, False, NAVY,  "center",  0,  0),
        ("",                                          20, False, NAVY,  "center",  0,  0),
        ("Engineering Web Portal",                    56, True,  NAVY,  "center",  0,  6),
        ("Knowledge Transfer Document",               32, False, NAVY,  "center",  0, 40),
        ("",                                          20, False, NAVY,  "center",  0,  0),
        ("Ruiz Foods, Inc.",                          28, True,  NAVY,  "center",  0,  6),
        ("Engineering Department",                    22, False, NAVY,  "center",  0,  6),
        ("",                                          20, False, NAVY,  "center",  0,  0),
        ("May 8, 2026",                               22, False, "444444", "center", 0, 6),
        ("https://ruizfoods.sharepoint.com/sites/eng-hub",
                                                      18, False, "444444", "center", 0, 40),
        ("",                                          20, False, NAVY,  "center",  0,  0),
        ("CONFIDENTIAL — INTERNAL USE ONLY",     20, True,  RED,   "center",  0,  0),
    ]

    # Insert page break first (it ends up at the bottom of the cover after prepending)
    body.insert(0, _page_break_para())

    # Insert cover rows in reverse so they appear in original order after prepending
    for row in reversed(rows):
        body.insert(0, _cover_para(*row))


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main():
    print("Building KT-EngineeringWebPortal.docx...")

    run_pandoc()

    doc = Document(str(DOCX_TMP))
    print("  styles  -> heading colors")
    apply_heading_styles(doc)

    print("  tables  -> header row shading")
    shade_table_headers(doc)

    print("  layout  -> header / footer")
    set_headers_footers(doc)

    print("  cover   -> prepending cover page")
    insert_cover(doc)

    doc.save(str(DOCX_OUT))
    DOCX_TMP.unlink(missing_ok=True)

    size_kb = DOCX_OUT.stat().st_size // 1024
    print(f"  saved   -> {DOCX_OUT.name}  ({size_kb} KB)")


if __name__ == "__main__":
    main()
