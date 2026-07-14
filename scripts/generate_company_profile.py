from __future__ import annotations

import os
from html import escape
from pathlib import Path

from reportlab.graphics import renderPDF
from reportlab.graphics.barcode.qr import QrCodeWidget
from reportlab.graphics.shapes import Drawing
from reportlab.lib import colors
from reportlab.lib.colors import HexColor
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.utils import ImageReader
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas
from reportlab.platypus import Paragraph


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "output" / "pdf" / "company-profile-gandiva-labs.pdf"

W, H = A4
M = 42

INK = HexColor("#171511")
INK_2 = HexColor("#2B2722")
IVORY = HexColor("#F5F0E7")
PAPER = HexColor("#FBF8F2")
SAND = HexColor("#E9DFD2")
SAND_2 = HexColor("#D9CDBE")
MUTED = HexColor("#70685F")
MUTED_LIGHT = HexColor("#BEB5AA")
ACCENT = HexColor("#C85F32")
ACCENT_LIGHT = HexColor("#EE8859")
GREEN = HexColor("#73866C")
WHITE = colors.white

FONT_DIR = Path(r"C:\Windows\Fonts")
FONT_FILES = {
    "GLSans": "segoeui.ttf",
    "GLSansBold": "segoeuib.ttf",
    "GLSansItalic": "segoeuii.ttf",
    "GLSansLight": "segoeuil.ttf",
    "GLSerif": "georgia.ttf",
    "GLSerifItalic": "georgiai.ttf",
    "GLSerifBold": "georgiab.ttf",
}


def register_fonts() -> None:
    for name, filename in FONT_FILES.items():
        pdfmetrics.registerFont(TTFont(name, str(FONT_DIR / filename)))


def img_path(relative: str) -> str:
    return str(ROOT / relative)


LOGO_LIGHT = img_path("src/assets/brand/source/gandiva-mark-light-source.png")
LOGO_DARK = img_path("src/assets/brand/source/gandiva-mark-dark-source.png")
IMG_SHINYOUNG = img_path("src/assets/screenshots/shinyoung.png")
IMG_MAHAKARYA = img_path("src/assets/screenshots/mahakarya.png")
IMG_WIJAYA = img_path("src/assets/screenshots/wijaya.png")


def rounded_rect(c: canvas.Canvas, x: float, y: float, w: float, h: float, r: float,
                 fill, stroke=None, stroke_width: float = 0.8) -> None:
    c.saveState()
    c.setFillColor(fill)
    c.setStrokeColor(stroke if stroke is not None else fill)
    c.setLineWidth(stroke_width)
    c.roundRect(x, y, w, h, r, fill=1, stroke=1 if stroke is not None else 0)
    c.restoreState()


def line(c: canvas.Canvas, x1: float, y1: float, x2: float, y2: float,
         color=SAND_2, width: float = 0.7) -> None:
    c.saveState()
    c.setStrokeColor(color)
    c.setLineWidth(width)
    c.line(x1, y1, x2, y2)
    c.restoreState()


def paragraph(c: canvas.Canvas, text: str, x: float, y_top: float, w: float,
              font="GLSans", size: float = 9.5, leading: float | None = None,
              color=INK, align=TA_LEFT, max_h: float = 1000) -> float:
    leading = leading or size * 1.45
    style = ParagraphStyle(
        name="body",
        fontName=font,
        fontSize=size,
        leading=leading,
        textColor=color,
        alignment=align,
        spaceAfter=0,
        spaceBefore=0,
        splitLongWords=False,
    )
    p = Paragraph(text, style)
    _, h = p.wrap(w, max_h)
    p.drawOn(c, x, y_top - h)
    return h


def plain_paragraph(c: canvas.Canvas, text: str, x: float, y_top: float, w: float,
                    font="GLSans", size: float = 9.5, leading: float | None = None,
                    color=INK) -> float:
    return paragraph(c, escape(text).replace("\n", "<br/>"), x, y_top, w, font, size, leading, color)


def label(c: canvas.Canvas, text: str, x: float, y: float, color=ACCENT,
          font="GLSansBold", size: float = 7.5, tracking: float = 1.1) -> None:
    c.saveState()
    text_object = c.beginText(x, y)
    text_object.setFillColor(color)
    text_object.setFont(font, size)
    text_object.setCharSpace(tracking)
    text_object.textLine(text.upper())
    c.drawText(text_object)
    c.restoreState()


def title(c: canvas.Canvas, lines: list[str], x: float, y_top: float,
          size: float = 31, leading: float | None = None, color=INK,
          accent_last: bool = False) -> float:
    leading = leading or size * 0.98
    y = y_top
    for i, text in enumerate(lines):
        use_accent = accent_last and i == len(lines) - 1
        c.setFillColor(ACCENT if use_accent else color)
        c.setFont("GLSerifItalic" if use_accent else "GLSansBold", size)
        c.drawString(x, y - size, text)
        y -= leading
    return y_top - y


def page_header(c: canvas.Canvas, page_no: int, section: str, dark: bool = False) -> None:
    fg = IVORY if dark else INK
    muted = MUTED_LIGHT if dark else MUTED
    c.setFillColor(fg)
    c.setFont("GLSansBold", 8)
    c.drawString(M, H - 27, "GANDIVA LABS")
    c.setFillColor(muted)
    c.setFont("GLSans", 7.3)
    c.drawRightString(W - M, H - 27, f"{section.upper()}  |  {page_no:02d}")
    line(c, M, H - 36, W - M, H - 36, HexColor("#3C3833") if dark else SAND_2, 0.6)


def page_footer(c: canvas.Canvas, dark: bool = False) -> None:
    c.setFillColor(MUTED_LIGHT if dark else MUTED)
    c.setFont("GLSans", 6.5)
    c.drawString(M, 20, "Company Profile 2026")
    c.drawRightString(W - M, 20, "Surabaya, Indonesia")


def page_bg(c: canvas.Canvas, color=PAPER) -> None:
    c.setFillColor(color)
    c.rect(0, 0, W, H, fill=1, stroke=0)


def dot_grid(c: canvas.Canvas, x: float, y: float, w: float, h: float,
             color=SAND_2, step: float = 16, radius: float = 0.55) -> None:
    c.saveState()
    c.setFillColor(color)
    xx = x
    while xx <= x + w:
        yy = y
        while yy <= y + h:
            c.circle(xx, yy, radius, fill=1, stroke=0)
            yy += step
        xx += step
    c.restoreState()


def draw_logo(c: canvas.Canvas, x: float, y: float, size: float, light=False) -> None:
    c.drawImage(LOGO_LIGHT if light else LOGO_DARK, x, y, size, size,
                preserveAspectRatio=True, mask="auto")


def clip_round(c: canvas.Canvas, x: float, y: float, w: float, h: float, r: float) -> None:
    path = c.beginPath()
    path.roundRect(x, y, w, h, r)
    c.clipPath(path, stroke=0, fill=0)


def draw_image_cover(c: canvas.Canvas, image_path: str, x: float, y: float,
                     w: float, h: float, radius: float = 0,
                     anchor_x: float = 0.5, anchor_y: float = 0.5) -> None:
    img = ImageReader(image_path)
    iw, ih = img.getSize()
    scale = max(w / iw, h / ih)
    dw, dh = iw * scale, ih * scale
    dx = x - (dw - w) * anchor_x
    dy = y - (dh - h) * anchor_y
    c.saveState()
    if radius:
        clip_round(c, x, y, w, h, radius)
    c.drawImage(img, dx, dy, dw, dh, preserveAspectRatio=True, mask="auto")
    c.restoreState()


def pill(c: canvas.Canvas, text: str, x: float, y: float, fill=SAND,
         fg=INK, font="GLSansBold", size: float = 7.2, pad_x: float = 10,
         height: float = 20, border=None) -> float:
    tw = pdfmetrics.stringWidth(text, font, size)
    w = tw + pad_x * 2
    rounded_rect(c, x, y, w, height, height / 2, fill, border)
    c.setFillColor(fg)
    c.setFont(font, size)
    c.drawString(x + pad_x, y + (height - size) / 2 + 1, text)
    return w


def number_box(c: canvas.Canvas, number: str, x: float, y: float,
               dark=False, size: float = 30) -> None:
    fill = HexColor("#25221E") if dark else SAND
    fg = ACCENT_LIGHT if dark else ACCENT
    rounded_rect(c, x, y, size, size, 8, fill)
    c.setFillColor(fg)
    c.setFont("GLSansBold", 8)
    c.drawCentredString(x + size / 2, y + size / 2 - 3, number)


def card_title(c: canvas.Canvas, text: str, x: float, y_top: float,
               size: float = 13, color=INK) -> None:
    c.setFillColor(color)
    c.setFont("GLSansBold", size)
    c.drawString(x, y_top - size, text)


def bullets(c: canvas.Canvas, items: list[str], x: float, y_top: float, w: float,
            color=INK, bullet_color=ACCENT, size: float = 8.7,
            leading: float = 13.2, gap: float = 4) -> float:
    y = y_top
    for item in items:
        c.setFillColor(bullet_color)
        c.circle(x + 3, y - 5.5, 1.7, fill=1, stroke=0)
        h = plain_paragraph(c, item, x + 12, y, w - 12, "GLSans", size, leading, color)
        y -= h + gap
    return y_top - y


def qr_code(c: canvas.Canvas, data: str, x: float, y: float, size: float,
            dark=INK, light=WHITE) -> None:
    qr = QrCodeWidget(data)
    bounds = qr.getBounds()
    bw = bounds[2] - bounds[0]
    bh = bounds[3] - bounds[1]
    drawing = Drawing(size, size, transform=[size / bw, 0, 0, size / bh, 0, 0])
    qr.barFillColor = dark
    qr.barStrokeColor = dark
    drawing.add(qr)
    renderPDF.draw(drawing, c, x, y)


def add_url(c: canvas.Canvas, url: str, x: float, y: float, w: float, h: float) -> None:
    c.linkURL(url, (x, y, x + w, y + h), relative=0, thickness=0)


def cover(c: canvas.Canvas) -> None:
    page_bg(c, INK)
    dot_grid(c, W * 0.54, H * 0.41, W * 0.5, H * 0.62, HexColor("#3B352F"), 18, 0.55)
    c.setFillColor(HexColor("#251A15"))
    c.circle(W + 15, H * 0.45, 230, fill=1, stroke=0)
    c.setStrokeColor(ACCENT)
    c.setLineWidth(1.2)
    c.circle(W - 20, H * 0.47, 176, fill=0, stroke=1)
    draw_logo(c, M, H - 119, 58, light=True)
    c.setFillColor(IVORY)
    c.setFont("GLSansBold", 12)
    c.drawString(M + 72, H - 78, "GANDIVA LABS")
    c.setFillColor(MUTED_LIGHT)
    c.setFont("GLSans", 7.5)
    c.drawString(M + 72, H - 94, "WEBSITE STUDIO  |  COMPANY PROFILE 2026")

    label(c, "Website strategy - design - development - care", M, H - 194, ACCENT_LIGHT, size=7.2)
    c.setFillColor(IVORY)
    c.setFont("GLSansBold", 37)
    c.drawString(M, H - 250, "Website yang membuat")
    c.drawString(M, H - 292, "bisnis lebih mudah")
    c.setFillColor(ACCENT_LIGHT)
    c.setFont("GLSerifItalic", 38)
    c.drawString(M, H - 335, "dipercaya.")

    plain_paragraph(
        c,
        "Gandiva Labs merancang website bisnis yang jelas, meyakinkan, dan mudah digunakan - dari impresi pertama sampai calon pelanggan menghubungi Anda.",
        M, H - 382, 360, "GLSans", 11, 17, MUTED_LIGHT,
    )

    rounded_rect(c, M, 92, W - 2 * M, 94, 18, HexColor("#221F1B"), HexColor("#3E3933"))
    c.setFillColor(IVORY)
    c.setFont("GLSansBold", 10)
    c.drawString(M + 20, 155, "BUILT FOR CLARITY")
    c.setFillColor(MUTED_LIGHT)
    c.setFont("GLSans", 8.2)
    c.drawString(M + 20, 135, "Surabaya, Indonesia")
    c.drawString(M + 20, 116, "Company profile - Landing page - E-commerce - Custom web")
    c.setFillColor(ACCENT_LIGHT)
    c.setFont("GLSansBold", 9)
    c.drawRightString(W - M - 20, 133, "GANDIVA-LABS")
    c.setFillColor(MUTED_LIGHT)
    c.setFont("GLSans", 7)
    c.drawRightString(W - M - 20, 116, "Digital presence with a clear purpose")
    c.showPage()


def snapshot(c: canvas.Canvas) -> None:
    page_bg(c)
    page_header(c, 2, "Profile Snapshot")
    page_footer(c)
    label(c, "Gandiva in one view", M, H - 74)
    title(c, ["Satu studio. Satu arah:", "membuat bisnis lebih jelas."], M, H - 91, 29, 30, accent_last=True)
    plain_paragraph(c, "Dokumen ini dirancang sebagai alat percakapan bisnis: ringkas untuk dipindai, cukup lengkap untuk membantu keputusan.", M, H - 169, 405, "GLSans", 10.5, 15.5, MUTED)

    stats = [
        ("04", "Lini layanan", "Dari company profile hingga web custom dan care."),
        ("10", "Karya terpetakan", "3 website bisnis, 3 sistem internal, 4 eksperimen."),
        ("04", "Tahap kerja", "Brief, struktur, desain-build, review-tayang."),
    ]
    y = 501
    card_w = (W - 2 * M - 20) / 3
    for i, (num, head, body) in enumerate(stats):
        x = M + i * (card_w + 10)
        rounded_rect(c, x, y, card_w, 120, 14, WHITE, SAND_2)
        c.setFillColor(ACCENT)
        c.setFont("GLSerifItalic", 28)
        c.drawString(x + 14, y + 79, num)
        c.setFillColor(INK)
        c.setFont("GLSansBold", 9.2)
        c.drawString(x + 14, y + 56, head)
        plain_paragraph(c, body, x + 14, y + 43, card_w - 28, "GLSans", 7.4, 10.3, MUTED)

    rounded_rect(c, M, 231, W - 2 * M, 276, 18, SAND)
    label(c, "Isi buku", M + 20, 477, ACCENT)
    sections = [
        ("01", "Arah bisnis", "Positioning, audiens, dan nilai yang dibawa."),
        ("02", "Layanan", "Scope, bentuk kebutuhan, dan model kolaborasi."),
        ("03", "Cara kerja", "Tahap proyek, keputusan, QA, dan serah terima."),
        ("04", "Bukti kerja", "Website publik, sistem internal, dan eksperimen."),
        ("05", "Studio", "Founder, prinsip kerja, teknologi, dan kontak."),
    ]
    yy = 439
    for n, head, body in sections:
        c.setFillColor(ACCENT)
        c.setFont("GLSansBold", 8)
        c.drawString(M + 20, yy, n)
        c.setFillColor(INK)
        c.setFont("GLSansBold", 10)
        c.drawString(M + 58, yy, head)
        c.setFillColor(MUTED)
        c.setFont("GLSans", 8.2)
        c.drawString(M + 181, yy, body)
        line(c, M + 20, yy - 15, W - M - 20, yy - 15, SAND_2)
        yy -= 46

    c.setFillColor(MUTED)
    c.setFont("GLSans", 6.8)
    c.drawString(M, 208, "[VERIFIED] Ringkasan layanan, karya, proses, profil founder, dan kontak bersumber dari materi internal Gandiva Labs per 14 Juli 2026.")
    c.showPage()


def business_need(c: canvas.Canvas) -> None:
    page_bg(c, IVORY)
    page_header(c, 3, "Business Context")
    page_footer(c)
    label(c, "The business need", M, H - 74)
    title(c, ["Bukan sekadar hadir online.", "Bisnis perlu tampil siap."], M, H - 91, 30, 31, accent_last=True)
    plain_paragraph(c, "Website bekerja paling baik saat informasi, visual, bukti, dan jalur tindakan bergerak ke arah yang sama.", M, H - 171, 380, "GLSans", 10.5, 15.5, MUTED)

    issues = [
        ("01", "Pesan belum fokus", "Pengunjung perlu menebak apa yang ditawarkan dan untuk siapa."),
        ("02", "Kredibilitas tercecer", "Keunggulan, proses, dan bukti kerja belum tersusun sebagai alasan percaya."),
        ("03", "Arah tindakan kabur", "Kontak ada, tetapi belum hadir sebagai langkah yang terasa natural."),
        ("04", "Pengalaman tidak konsisten", "Informasi yang baik kehilangan daya saat tampilan mobile terasa berat atau membingungkan."),
    ]
    y = 496
    for i, (n, head, body) in enumerate(issues):
        col = i % 2
        row = i // 2
        x = M + col * 258
        yy = y - row * 130
        rounded_rect(c, x, yy, 246, 116, 15, WHITE, SAND_2)
        number_box(c, n, x + 14, yy + 70, False, 30)
        card_title(c, head, x + 55, yy + 102, 11)
        plain_paragraph(c, body, x + 55, yy + 79, 172, "GLSans", 8, 11.2, MUTED)

    rounded_rect(c, M, 167, W - 2 * M, 106, 16, INK)
    label(c, "What we build toward", M + 20, 245, ACCENT_LIGHT)
    outcomes = [("Clarity", "Mudah dipahami"), ("Credibility", "Terlihat meyakinkan"), ("Direction", "Punya arah tindakan")]
    for i, (en, indo) in enumerate(outcomes):
        x = M + 20 + i * 163
        c.setFillColor(IVORY)
        c.setFont("GLSansBold", 10)
        c.drawString(x, 216, en)
        c.setFillColor(MUTED_LIGHT)
        c.setFont("GLSans", 7.8)
        c.drawString(x, 198, indo)
    c.showPage()


def about(c: canvas.Canvas) -> None:
    page_bg(c, PAPER)
    page_header(c, 4, "About The Studio")
    page_footer(c)
    rounded_rect(c, M, 458, 187, 327, 22, INK)
    dot_grid(c, M + 16, 474, 154, 240, HexColor("#39342E"), 16, 0.55)
    draw_logo(c, M + 36, 596, 115, light=True)
    c.setFillColor(ACCENT_LIGHT)
    c.setFont("GLSerifItalic", 18)
    c.drawCentredString(M + 93.5, 556, "Built for clarity")
    c.setFillColor(MUTED_LIGHT)
    c.setFont("GLSans", 7.4)
    c.drawCentredString(M + 93.5, 530, "STRATEGY - DESIGN - BUILD - CARE")
    c.setFillColor(IVORY)
    c.setFont("GLSansBold", 9)
    c.drawCentredString(M + 93.5, 493, "SURABAYA, INDONESIA")

    label(c, "About Gandiva Labs", 255, 757)
    title(c, ["Studio website", "dengan cara pikir", "bisnis."], 255, 733, 28, 29, accent_last=True)
    plain_paragraph(c, "Gandiva Labs membantu bisnis menerjemahkan kebutuhan menjadi website yang lebih mudah dipahami, dikelola, dan digunakan.", 255, 621, W - M - 255, "GLSans", 10.2, 15.5, MUTED)
    plain_paragraph(c, "Bagi kami, website bukan dekorasi digital. Ia adalah titik temu antara pesan brand, kebutuhan pelanggan, dan sistem yang harus tetap sehat setelah tayang.", 255, 551, W - M - 255, "GLSans", 9.3, 14.1, INK)

    label(c, "How we think", M, 419)
    principles = [
        ("Komunikasi langsung", "Pembahasan ringkas, jelas, dan tidak dibebani istilah teknis yang tidak perlu."),
        ("Business-first", "Teknologi dipilih setelah tujuan dan kemampuan pengelolaan bisnis dipahami."),
        ("Pikir sampai belakang layar", "Struktur, hosting, keamanan dasar, dan perawatan ikut dipertimbangkan."),
    ]
    y = 373
    for i, (head, body) in enumerate(principles):
        x = M + i * 173
        rounded_rect(c, x, 211, 161, 145, 15, SAND if i != 1 else WHITE, SAND_2)
        c.setFillColor(ACCENT)
        c.setFont("GLSerifItalic", 20)
        c.drawString(x + 14, 323, f"0{i+1}")
        card_title(c, head, x + 14, 299, 10.2)
        plain_paragraph(c, body, x + 14, 270, 133, "GLSans", 7.7, 10.8, MUTED)
    c.showPage()


def client_fit(c: canvas.Canvas) -> None:
    page_bg(c, IVORY)
    page_header(c, 5, "Positioning And Fit")
    page_footer(c)
    label(c, "Who we are built for", M, H - 74)
    title(c, ["Cocok untuk bisnis yang", "ingin terlihat lebih siap."], M, H - 91, 30, 31, accent_last=True)
    plain_paragraph(c, "Gandiva Labs paling relevan saat bisnis sudah punya arah, tetapi membutuhkan cara yang lebih rapi untuk menjelaskan, meyakinkan, dan mengajak orang mengambil langkah berikutnya.", M, H - 172, 445, "GLSans", 10.2, 15.2, MUTED)

    fits = [
        ("Pemilik bisnis", "Perlu website utama yang menjelaskan bisnis tanpa bergantung pada presentasi manual."),
        ("Brand berkembang", "Ingin memiliki kanal digital yang konsisten dengan karakter dan kebutuhan pelanggan."),
        ("Tim marketing", "Membutuhkan landing page atau web kampanye dengan fokus yang jelas."),
        ("Perusahaan B2B", "Perlu menata layanan, proses, kapabilitas, dan jalur konsultasi."),
    ]
    y = 530
    for i, (head, body) in enumerate(fits):
        yy = y - i * 79
        rounded_rect(c, M, yy, 326, 66, 13, WHITE, SAND_2)
        c.setFillColor(ACCENT)
        c.setFont("GLSansBold", 8)
        c.drawString(M + 15, yy + 42, f"0{i+1}")
        card_title(c, head, M + 51, yy + 53, 10.5)
        plain_paragraph(c, body, M + 51, yy + 33, 255, "GLSans", 7.6, 10.4, MUTED)

    rounded_rect(c, 389, 293, 164, 303, 18, INK)
    label(c, "Priority sectors", 407, 562, ACCENT_LIGHT)
    c.setFillColor(IVORY)
    c.setFont("GLSansBold", 15)
    c.drawString(407, 528, "Dekat dengan")
    c.drawString(407, 509, "bukti kerja saat ini")
    sectors = ["Beauty", "Manufacturing", "Business services", "Growing SMEs"]
    yy = 469
    for item in sectors:
        c.setFillColor(IVORY)
        c.circle(411, yy + 2, 1.7, fill=1, stroke=0)
        c.setFont("GLSans", 8.6)
        c.drawString(423, yy - 1, item)
        yy -= 31
    plain_paragraph(c, "Prioritas ini membantu percakapan lebih relevan, bukan membatasi kemungkinan sektor lain.", 407, 355, 128, "GLSans", 7.3, 10.5, MUTED_LIGHT)
    c.setFillColor(MUTED)
    c.setFont("GLSans", 6.8)
    c.drawString(M, 195, "[ESTIMATED] Kecocokan audiens dan sektor prioritas adalah arah strategi berdasarkan portofolio yang tersedia.")
    c.drawString(M, 181, "Validasi lanjutan membutuhkan data lead, proposal, dan proyek yang terstruktur.")
    c.showPage()


def services_overview(c: canvas.Canvas) -> None:
    page_bg(c, SAND)
    page_header(c, 6, "Services")
    page_footer(c)
    label(c, "Service architecture", M, H - 74)
    title(c, ["Pilih bentuk website", "sesuai tujuan bisnis."], M, H - 91, 30, 31, accent_last=True)
    plain_paragraph(c, "Tidak perlu datang dengan brief yang sempurna. Mulai dari konteks dan masalahnya, lalu scope disusun bersama.", M, H - 171, 410, "GLSans", 10.2, 15.2, MUTED)

    services = [
        ("01", "Company Profile", "Untuk tampil lebih profesional", "Profil, layanan, keunggulan, dan jalur kontak dalam struktur yang mudah dipahami.", ["Strategi konten", "Desain responsif", "SEO dasar"]),
        ("02", "Landing Page", "Untuk kampanye atau penawaran khusus", "Satu halaman fokus yang membawa pengunjung dari perhatian menuju tindakan.", ["Copy terarah", "Struktur konversi", "CTA jelas"]),
        ("03", "Toko Online", "Untuk kanal penjualan milik brand", "Katalog dan alur belanja yang mudah digunakan tanpa kehilangan karakter visual.", ["Katalog produk", "Checkout", "Integrasi toko"]),
        ("04", "Web Custom & Care", "Untuk kebutuhan di luar template", "Fitur khusus, redesign, dan dukungan teknis setelah website tayang.", ["Fitur custom", "Redesign", "Maintenance"]),
    ]
    y_positions = [421, 421, 211, 211]
    for i, (n, head, fit, body, tags) in enumerate(services):
        x = M + (i % 2) * 258
        y = y_positions[i]
        rounded_rect(c, x, y, 246, 194, 17, WHITE, SAND_2)
        number_box(c, n, x + 16, y + 147, False, 31)
        label(c, fit, x + 59, y + 166, ACCENT, size=6.2, tracking=0.5)
        card_title(c, head, x + 16, y + 132, 14)
        plain_paragraph(c, body, x + 16, y + 103, 214, "GLSans", 8, 11.4, MUTED)
        tx = x + 16
        for tag in tags:
            pw = pill(c, tag, tx, y + 17, fill=IVORY, fg=INK, size=6.5, height=18, pad_x=7)
            tx += pw + 5
    c.showPage()


def company_profile_service(c: canvas.Canvas) -> None:
    page_bg(c, PAPER)
    page_header(c, 7, "Service 01")
    page_footer(c)
    rounded_rect(c, M, 464, W - 2 * M, 322, 22, INK)
    dot_grid(c, 335, 485, 200, 250, HexColor("#3A342F"), 16, 0.55)
    label(c, "Company profile website", M + 22, 752, ACCENT_LIGHT)
    c.setFillColor(IVORY)
    c.setFont("GLSansBold", 29)
    c.drawString(M + 22, 707, "Jelaskan bisnis")
    c.drawString(M + 22, 673, "tanpa membuat orang")
    c.setFillColor(ACCENT_LIGHT)
    c.setFont("GLSerifItalic", 30)
    c.drawString(M + 22, 638, "menebak.")
    plain_paragraph(c, "Website utama untuk menyatukan profil, layanan, keunggulan, bukti, dan jalur konsultasi dalam satu pengalaman yang rapi.", M + 22, 596, 290, "GLSans", 10, 15, MUTED_LIGHT)
    draw_logo(c, 397, 568, 94, light=True)

    label(c, "Best used when", M, 428)
    left_items = [
        "Bisnis belum memiliki website utama.",
        "Website lama tidak lagi mewakili positioning.",
        "Layanan sulit dijelaskan dalam percakapan singkat.",
        "Calon mitra membutuhkan bukti dan konteks sebelum menghubungi.",
    ]
    rounded_rect(c, M, 190, 246, 215, 16, SAND, SAND_2)
    bullets(c, left_items, M + 18, 372, 210, INK, ACCENT, 8.3, 12, 7)

    label(c, "Typical deliverables", 306, 428)
    rounded_rect(c, 306, 190, 247, 215, 16, WHITE, SAND_2)
    right_items = [
        "Arah pesan dan struktur halaman.",
        "Desain responsif untuk desktop dan mobile.",
        "Pengembangan website dan integrasi kebutuhan utama.",
        "SEO on-page dasar dan kesiapan publikasi.",
        "Review, QA, launch, dan serah terima sesuai scope.",
    ]
    bullets(c, right_items, 324, 372, 211, INK, ACCENT, 8.3, 12, 6)
    c.setFillColor(MUTED)
    c.setFont("GLSansItalic", 6.7)
    c.drawString(M, 169, "Susunan halaman, jumlah revisi, dan detail deliverables ditetapkan dalam scope proyek.")
    c.showPage()


def landing_ecommerce(c: canvas.Canvas) -> None:
    page_bg(c, IVORY)
    page_header(c, 8, "Services 02 And 03")
    page_footer(c)
    label(c, "Focused growth tools", M, H - 74)
    title(c, ["Dua kebutuhan. Dua alur", "yang berbeda."], M, H - 91, 30, 31, accent_last=True)
    plain_paragraph(c, "Landing page mengurangi distraksi. Toko online menyatukan eksplorasi produk dan transaksi. Keduanya perlu struktur yang sengaja dirancang.", M, H - 171, 465, "GLSans", 10.1, 15.2, MUTED)

    rounded_rect(c, M, 190, 246, 437, 18, WHITE, SAND_2)
    label(c, "02 - Landing page", M + 18, 610)
    c.setFillColor(INK)
    c.setFont("GLSansBold", 19)
    c.drawString(M + 18, 575, "Satu halaman.")
    c.drawString(M + 18, 551, "Satu fokus.")
    plain_paragraph(c, "Cocok untuk kampanye, peluncuran, event, lead generation, atau satu layanan yang perlu berdiri sendiri.", M + 18, 519, 210, "GLSans", 8.8, 13, MUTED)
    line(c, M + 18, 444, M + 228, 444, SAND_2)
    label(c, "Inside the scope", M + 18, 422, MUTED, size=6.5)
    bullets(c, ["Copy dan hierarki pesan", "Alur perhatian ke tindakan", "Form atau CTA utama", "Responsif dan SEO dasar"], M + 18, 399, 210, INK, ACCENT, 8, 11.6, 6)
    rounded_rect(c, M + 18, 245, 210, 54, 12, SAND)
    c.setFillColor(ACCENT)
    c.setFont("GLSansBold", 8)
    c.drawString(M + 31, 278, "PRINSIP")
    plain_paragraph(c, "Setiap blok harus membantu keputusan, bukan sekadar memenuhi halaman.", M + 31, 266, 183, "GLSans", 7.2, 9.8, MUTED)

    rounded_rect(c, 306, 190, 247, 437, 18, INK)
    label(c, "03 - Toko online", 324, 610, ACCENT_LIGHT)
    c.setFillColor(IVORY)
    c.setFont("GLSansBold", 19)
    c.drawString(324, 575, "Produk lebih mudah")
    c.drawString(324, 551, "ditemukan dan dipilih.")
    plain_paragraph(c, "Cocok untuk brand yang ingin memiliki katalog, akun pelanggan, dan alur belanja pada kanalnya sendiri.", 324, 519, 211, "GLSans", 8.8, 13, MUTED_LIGHT)
    line(c, 324, 444, 535, 444, HexColor("#413C36"))
    label(c, "Inside the scope", 324, 422, MUTED_LIGHT, size=6.5)
    bullets(c, ["Struktur katalog dan kategori", "Halaman produk", "Checkout dan integrasi toko", "Pengelolaan konten produk"], 324, 399, 211, IVORY, ACCENT_LIGHT, 8, 11.6, 6)
    rounded_rect(c, 324, 245, 211, 54, 12, HexColor("#26231F"), HexColor("#403A34"))
    c.setFillColor(ACCENT_LIGHT)
    c.setFont("GLSansBold", 8)
    c.drawString(337, 278, "PRINSIP")
    plain_paragraph(c, "Karakter brand tetap terasa, tetapi alur belanja tidak dibuat berlebihan.", 337, 266, 184, "GLSans", 7.2, 9.8, MUTED_LIGHT)
    c.showPage()


def custom_care(c: canvas.Canvas) -> None:
    page_bg(c, PAPER)
    page_header(c, 9, "Service 04")
    page_footer(c)
    label(c, "Custom web and care", M, H - 74)
    title(c, ["Ketika template tidak cukup,", "solusinya harus tetap masuk akal."], M, H - 91, 28, 30, accent_last=True)
    plain_paragraph(c, "Kebutuhan custom tidak selalu berarti sistem yang rumit. Fokusnya adalah memilih fungsi yang benar-benar membantu bisnis atau operasional.", M, H - 171, 455, "GLSans", 10, 15, MUTED)

    modes = [
        ("NEW BUILD", "Bangun dari awal", "Untuk kebutuhan yang memerlukan struktur, fitur, atau integrasi yang lebih spesifik."),
        ("REDESIGN", "Rapikan yang sudah ada", "Audit pesan, struktur, tampilan, performa, dan pengelolaan sebelum menentukan arah perbaikan."),
        ("ONGOING CARE", "Jaga setelah tayang", "Update konten, backup, pengecekan rutin, perbaikan kecil, dan dukungan teknis secara opsional."),
    ]
    y = 460
    for i, (kicker, head, body) in enumerate(modes):
        x = M + i * 173
        rounded_rect(c, x, y, 161, 146, 15, SAND if i != 1 else WHITE, SAND_2)
        label(c, kicker, x + 14, y + 116, ACCENT, size=6.4, tracking=0.7)
        card_title(c, head, x + 14, y + 101, 10.5)
        plain_paragraph(c, body, x + 14, y + 74, 133, "GLSans", 7.7, 10.8, MUTED)

    rounded_rect(c, M, 148, W - 2 * M, 318, 18, INK)
    label(c, "Examples of custom scope", M + 20, 434, ACCENT_LIGHT)
    c.setFillColor(IVORY)
    c.setFont("GLSansBold", 18)
    c.drawString(M + 20, 398, "Fitur mengikuti alur kerja,")
    c.drawString(M + 20, 375, "bukan tren sesaat.")
    custom_items = [
        "Dashboard internal dan role pengguna",
        "Katalog atau workflow khusus",
        "Integrasi form, email, dan data",
        "Perapian struktur website lama",
        "Setup hosting dan keamanan dasar",
        "Maintenance sesuai kebutuhan",
    ]
    for i, item in enumerate(custom_items):
        col, row = i % 2, i // 2
        x = M + 20 + col * 246
        yy = 326 - row * 48
        c.setFillColor(ACCENT_LIGHT)
        c.circle(x + 4, yy + 3, 2, fill=1, stroke=0)
        c.setFillColor(IVORY)
        c.setFont("GLSans", 8.4)
        c.drawString(x + 15, yy, item)
    c.setFillColor(MUTED_LIGHT)
    c.setFont("GLSansItalic", 6.8)
    c.drawString(M + 20, 173, "Tidak semua contoh masuk ke setiap proyek. Scope final mengikuti kebutuhan dan kesepakatan awal.")
    c.showPage()


def process_page(c: canvas.Canvas) -> None:
    page_bg(c, INK)
    page_header(c, 10, "Process", dark=True)
    page_footer(c, dark=True)
    label(c, "How we work", M, H - 74, ACCENT_LIGHT)
    c.setFillColor(IVORY)
    c.setFont("GLSansBold", 30)
    c.drawString(M, H - 125, "Prosesnya jelas.")
    c.setFillColor(ACCENT_LIGHT)
    c.setFont("GLSerifItalic", 30)
    c.drawString(M, H - 159, "Tidak ada fase tiba-tiba jadi.")
    plain_paragraph(c, "Setiap keputusan punya alasan. Anda tahu apa yang sedang dikerjakan, apa yang perlu disiapkan, dan kapan waktunya memberi masukan.", M, H - 190, 450, "GLSans", 10, 15, MUTED_LIGHT)

    steps = [
        ("01", "Kenalan & brief", "Bahas bisnis, audiens, masalah saat ini, dan hasil yang ingin dicapai."),
        ("02", "Arah & struktur", "Susun halaman, alur informasi, dan pesan utama sebelum masuk ke visual."),
        ("03", "Desain & build", "Bangun bertahap, lalu periksa pengalaman desktop dan mobile."),
        ("04", "Review & tayang", "Selesaikan revisi, persiapan launch, dan serah terima."),
    ]
    y = 370
    card_w = 119
    for i, (n, head, body) in enumerate(steps):
        x = M + i * 128
        rounded_rect(c, x, y, card_w, 224, 16, HexColor("#211F1C"), HexColor("#403A34"))
        number_box(c, n, x + 14, y + 188, True, 32)
        c.setFillColor(IVORY)
        c.setFont("GLSansBold", 10.2)
        c.drawString(x + 14, y + 160, head)
        plain_paragraph(c, body, x + 14, y + 137, card_w - 28, "GLSans", 7.6, 10.8, MUTED_LIGHT)
        if i < 3:
            c.setStrokeColor(ACCENT)
            c.setLineWidth(1)
            c.line(x + card_w + 3, y + 119, x + card_w + 6, y + 119)

    rounded_rect(c, M, 183, W - 2 * M, 176, 16, HexColor("#241B17"), HexColor("#4B382F"))
    label(c, "Working agreement", M + 20, 328, ACCENT_LIGHT)
    c.setFillColor(IVORY)
    c.setFont("GLSansBold", 13)
    c.drawString(M + 20, 297, "Scope dan estimasi disepakati di awal.")
    plain_paragraph(c, "Arah kerja tetap terukur dari awal sampai tayang. Perubahan di luar scope dibicarakan sebelum dikerjakan, sehingga tidak ada kejutan yang tidak perlu.", M + 20, 272, 465, "GLSans", 8.6, 12.6, MUTED_LIGHT)
    c.showPage()


def delivery(c: canvas.Canvas) -> None:
    page_bg(c, IVORY)
    page_header(c, 11, "Collaboration")
    page_footer(c)
    label(c, "What the collaboration covers", M, H - 74)
    title(c, ["Bukan hanya halaman jadi.", "Keputusan ikut dirapikan."], M, H - 91, 30, 31, accent_last=True)
    plain_paragraph(c, "Deliverables disusun untuk mengurangi kebingungan sebelum build, menjaga kualitas saat produksi, dan memudahkan pengelolaan setelah launch.", M, H - 171, 445, "GLSans", 10, 15, MUTED)

    columns = [
        ("STRATEGY", "Arah", ["Tujuan website", "Audiens prioritas", "Struktur halaman"]),
        ("CONTENT", "Pesan", ["Hierarki informasi", "Copy dasar", "CTA dan jalur kontak"]),
        ("DESIGN", "Visual", ["Arah visual", "Desain responsif", "Komponen konsisten"]),
        ("BUILD", "Teknis", ["Pengembangan", "Integrasi", "SEO dasar"]),
        ("LAUNCH", "Serah terima", ["QA", "Persiapan tayang", "Akses dan handover"]),
    ]
    card_w = 95
    for i, (kicker, head, items) in enumerate(columns):
        x = M + i * 102
        rounded_rect(c, x, 375, card_w, 244, 14, WHITE if i % 2 else SAND, SAND_2)
        label(c, kicker, x + 12, 590, ACCENT, size=5.8, tracking=0.55)
        card_title(c, head, x + 12, 566, 11)
        yy = 527
        for item in items:
            line(c, x + 12, yy + 11, x + card_w - 12, yy + 11, SAND_2)
            plain_paragraph(c, item, x + 12, yy, card_w - 24, "GLSans", 7.2, 9.6, MUTED)
            yy -= 49

    rounded_rect(c, M, 188, W - 2 * M, 180, 16, INK)
    label(c, "Decision principle", M + 20, 337, ACCENT_LIGHT)
    c.setFillColor(IVORY)
    c.setFont("GLSansBold", 16)
    c.drawString(M + 20, 305, "Tujuan dulu. Teknologi kemudian.")
    plain_paragraph(c, "Pilihan platform, fitur, dan integrasi mengikuti tujuan, kebutuhan konten, kemampuan pengelolaan, serta batas scope. Pendekatan ini selaras dengan human-centred design dan pemetaan value proposition yang digunakan dalam audit internal Gandiva Labs.", M + 20, 277, 470, "GLSans", 8.4, 12.5, MUTED_LIGHT)
    c.setFillColor(MUTED_LIGHT)
    c.setFont("GLSansItalic", 6.4)
    c.drawString(M + 20, 211, "Referensi metodologi: ISO 9241-210:2019 dan Strategyzer Value Proposition Canvas.")
    c.showPage()


def portfolio_overview(c: canvas.Canvas) -> None:
    page_bg(c, PAPER)
    page_header(c, 12, "Selected Work")
    page_footer(c)
    label(c, "Portfolio map", M, H - 74)
    title(c, ["Sistem digital untuk", "kebutuhan yang nyata."], M, H - 91, 30, 31, accent_last=True)
    plain_paragraph(c, "Dari website yang bertemu langsung dengan pelanggan hingga sistem yang bekerja di balik operasional bisnis.", M, H - 171, 425, "GLSans", 10.2, 15.2, MUTED)

    draw_image_cover(c, IMG_SHINYOUNG, M, 400, 265, 211, 16, 0.33, 0.55)
    draw_image_cover(c, IMG_MAHAKARYA, 318, 508, 235, 103, 16, 0.5, 0.5)
    draw_image_cover(c, IMG_WIJAYA, 318, 400, 235, 99, 16, 0.48, 0.47)
    c.setStrokeColor(WHITE)
    c.setLineWidth(1.5)
    c.roundRect(M, 400, 265, 211, 16, fill=0, stroke=1)
    c.roundRect(318, 508, 235, 103, 16, fill=0, stroke=1)
    c.roundRect(318, 400, 235, 99, 16, fill=0, stroke=1)

    buckets = [
        ("03", "Website bisnis", "Dapat dikunjungi"),
        ("03", "Sistem internal", "Dijaga privat"),
        ("04", "Eksperimen digital", "Ruang eksplorasi"),
    ]
    for i, (num, head, desc) in enumerate(buckets):
        x = M + i * 173
        rounded_rect(c, x, 236, 161, 157, 15, SAND if i != 1 else INK, SAND_2 if i != 1 else HexColor("#39342E"))
        c.setFillColor(ACCENT_LIGHT if i == 1 else ACCENT)
        c.setFont("GLSerifItalic", 27)
        c.drawString(x + 14, 350, num)
        c.setFillColor(IVORY if i == 1 else INK)
        c.setFont("GLSansBold", 9.5)
        c.drawString(x + 14, 321, head)
        c.setFillColor(MUTED_LIGHT if i == 1 else MUTED)
        c.setFont("GLSans", 7.5)
        c.drawString(x + 14, 299, desc)
        if i == 1:
            c.setFillColor(MUTED_LIGHT)
            c.setFont("GLSans", 6.8)
            plain_paragraph(c, "Nama klien, tampilan, data, dan akses tidak dipublikasikan.", x + 14, 277, 133, "GLSans", 6.8, 9.3, MUTED_LIGHT)
    c.showPage()


def case_page(c: canvas.Canvas, page_no: int, name: str, category: str,
              image_path: str, link_url: str, context: str, solution: str,
              scope: list[str], accent=ACCENT, anchor_x=0.5) -> None:
    page_bg(c, PAPER)
    page_header(c, page_no, "Case Study")
    page_footer(c)
    draw_image_cover(c, image_path, M, 408, W - 2 * M, 333, 20, anchor_x, 0.5)
    c.saveState()
    c.setFillColor(colors.Color(0, 0, 0, alpha=0.42))
    c.roundRect(M, 408, W - 2 * M, 333, 20, fill=1, stroke=0)
    c.restoreState()
    rounded_rect(c, M + 20, 674, 122, 24, 12, WHITE)
    c.setFillColor(accent)
    c.setFont("GLSansBold", 6.5)
    c.drawCentredString(M + 81, 682, category.upper())
    c.setFillColor(WHITE)
    c.setFont("GLSansBold", 30)
    c.drawString(M + 20, 624, name)
    c.setFillColor(WHITE)
    c.setFont("GLSans", 8)
    c.drawString(M + 20, 598, link_url.replace("https://", ""))
    add_url(c, link_url, M + 20, 588, 250, 24)

    y = 360
    rounded_rect(c, M, 185, 158, 190, 15, SAND, SAND_2)
    label(c, "Context", M + 15, y, ACCENT)
    plain_paragraph(c, context, M + 15, y - 26, 128, "GLSans", 7.7, 10.8, MUTED)

    rounded_rect(c, 211, 185, 171, 190, 15, WHITE, SAND_2)
    label(c, "Solution", 226, y, ACCENT)
    plain_paragraph(c, solution, 226, y - 26, 141, "GLSans", 7.7, 10.8, MUTED)

    rounded_rect(c, 393, 185, 160, 190, 15, INK)
    label(c, "Scope", 408, y, ACCENT_LIGHT)
    bullets(c, scope, 408, y - 27, 130, IVORY, ACCENT_LIGHT, 7.5, 10.8, 6)
    c.setFillColor(MUTED)
    c.setFont("GLSansItalic", 6.5)
    c.drawString(M, 164, "[VERIFIED] Deskripsi kasus dan scope bersumber dari data portofolio internal Gandiva Labs.")
    c.showPage()


def private_work(c: canvas.Canvas) -> None:
    page_bg(c, INK)
    page_header(c, 16, "Private Systems And Lab", dark=True)
    page_footer(c, dark=True)
    label(c, "Work beyond public websites", M, H - 74, ACCENT_LIGHT)
    c.setFillColor(IVORY)
    c.setFont("GLSansBold", 29)
    c.drawString(M, H - 125, "Yang terlihat publik hanya")
    c.setFillColor(ACCENT_LIGHT)
    c.setFont("GLSerifItalic", 30)
    c.drawString(M, H - 159, "sebagian dari pekerjaannya.")
    plain_paragraph(c, "Gandiva Labs juga memetakan kebutuhan operasional internal dan terus menguji ide melalui eksperimen digital.", M, H - 190, 435, "GLSans", 10, 15, MUTED_LIGHT)

    systems = [
        ("P01", "Sistem POS", "Transaksi, item, stok, dan ringkasan aktivitas toko."),
        ("P02", "LMS + Safe Exam Browser", "Materi, kelas, evaluasi, dan alur ujian terintegrasi."),
        ("P03", "Tracking Paket Warehouse", "Penerimaan, perpindahan, sortir, dan serah terima paket."),
    ]
    for i, (n, head, body) in enumerate(systems):
        x = M + i * 173
        rounded_rect(c, x, 435, 161, 178, 15, HexColor("#221F1C"), HexColor("#403A34"))
        label(c, n + " - Private", x + 14, 581, ACCENT_LIGHT, size=6.2)
        c.setFillColor(IVORY)
        c.setFont("GLSansBold", 10.5)
        c.drawString(x + 14, 548, head)
        plain_paragraph(c, body, x + 14, 519, 133, "GLSans", 7.8, 10.9, MUTED_LIGHT)
        c.setFillColor(MUTED_LIGHT)
        c.setFont("GLSansItalic", 6.5)
        c.drawString(x + 14, 459, "Detail dijaga privat")

    rounded_rect(c, M, 190, W - 2 * M, 207, 16, HexColor("#241B17"), HexColor("#4B382F"))
    label(c, "Gandiva Lab - exploration space", M + 18, 365, ACCENT_LIGHT)
    labs = [
        ("Koi Farm", "Katalog digital"),
        ("RSLOV Digital Space", "Aplikasi web"),
        ("Katalog Lelang", "Platform interaktif"),
        ("Kalender 2026", "Web utility"),
    ]
    for i, (head, cat) in enumerate(labs):
        col, row = i % 2, i // 2
        x = M + 18 + col * 248
        y = 321 - row * 66
        c.setFillColor(ACCENT_LIGHT)
        c.setFont("GLSansBold", 7)
        c.drawString(x, y, f"L0{i+1}")
        c.setFillColor(IVORY)
        c.setFont("GLSansBold", 9.2)
        c.drawString(x + 37, y, head)
        c.setFillColor(MUTED_LIGHT)
        c.setFont("GLSans", 7)
        c.drawString(x + 37, y - 18, cat)
    c.showPage()


def studio_founder(c: canvas.Canvas) -> None:
    page_bg(c, PAPER)
    page_header(c, 17, "Studio And Technology")
    page_footer(c)
    rounded_rect(c, M, 489, 214, 296, 19, INK)
    draw_logo(c, M + 71, 661, 72, light=True)
    label(c, "Behind Gandiva Labs", M + 20, 630, ACCENT_LIGHT)
    c.setFillColor(IVORY)
    c.setFont("GLSansBold", 14.5)
    c.drawString(M + 20, 596, "Fadeta Ilhan Gandhi, S.T.")
    plain_paragraph(c, "Web developer berlatar Teknik Komputer dan IT infrastructure. Memadukan visual, sistem, dan kesiapan operasional setelah tayang.", M + 20, 568, 174, "GLSans", 7.6, 10.8, MUTED_LIGHT)
    pill(c, "MTCNA - 1911NA1056", M + 20, 495, HexColor("#2A2622"), ACCENT_LIGHT, size=6.5, height=20, border=HexColor("#463D36"))

    label(c, "Technical perspective", 279, 757)
    title(c, ["Teknisnya rapi.", "Bahasanya tetap manusiawi."], 279, 733, 23, 25, accent_last=True)
    plain_paragraph(c, "Stack tidak dipaksakan. Platform dipilih berdasarkan kebutuhan konten, fitur, pengelolaan, dan kesiapan bisnis.", 279, 648, 274, "GLSans", 9.2, 13.8, MUTED)
    techs = ["WordPress", "WooCommerce", "Vue", "Vite", "Responsive UI", "SEO dasar", "Hosting", "Security basics"]
    tx, ty = 279, 548
    for tech in techs:
        expected_w = pdfmetrics.stringWidth(tech, "GLSansBold", 6.7) + 16
        if tx + expected_w > W - M:
            tx = 279
            ty -= 29
        pw = pill(c, tech, tx, ty, SAND, INK, size=6.7, height=20, pad_x=8)
        tx += pw + 6

    label(c, "Three working principles", M, 449)
    principles = [
        ("01", "Komunikasi langsung", "Pembahasan dibuat mudah dipahami tanpa mengurangi ketelitian."),
        ("02", "Business-first", "Tujuan dan kemampuan pengelolaan menentukan pilihan teknis."),
        ("03", "Lifecycle thinking", "Launch bukan akhir. Akses, hosting, keamanan dasar, dan perawatan ikut dipikirkan."),
    ]
    for i, (n, head, body) in enumerate(principles):
        x = M + i * 173
        rounded_rect(c, x, 213, 161, 202, 15, SAND if i != 1 else WHITE, SAND_2)
        number_box(c, n, x + 14, 362, False, 30)
        card_title(c, head, x + 14, 343, 10)
        plain_paragraph(c, body, x + 14, 313, 133, "GLSans", 7.5, 10.7, MUTED)
    c.setFillColor(MUTED)
    c.setFont("GLSans", 6.6)
    c.drawString(M, 190, "[VERIFIED] Nama, gelar, latar, nomor sertifikat MTCNA, dan teknologi bersumber dari materi internal dan artefak proyek.")
    c.showPage()


def closing(c: canvas.Canvas) -> None:
    page_bg(c, INK)
    dot_grid(c, 336, 514, 230, 265, HexColor("#3A342E"), 17, 0.55)
    draw_logo(c, M, H - 112, 52, light=True)
    c.setFillColor(IVORY)
    c.setFont("GLSansBold", 10)
    c.drawString(M + 65, H - 74, "GANDIVA LABS")
    c.setFillColor(MUTED_LIGHT)
    c.setFont("GLSans", 7)
    c.drawString(M + 65, H - 90, "WEBSITE STUDIO  |  SURABAYA")
    label(c, "Start with context", M, H - 153, ACCENT_LIGHT)
    c.setFillColor(IVORY)
    c.setFont("GLSansBold", 31)
    c.drawString(M, H - 199, "Ceritakan targetnya.")
    c.setFillColor(ACCENT_LIGHT)
    c.setFont("GLSerifItalic", 31)
    c.drawString(M, H - 234, "Kami bantu susun jalannya.")
    plain_paragraph(c, "Tidak harus langsung punya brief lengkap. Mulai dari bisnis, masalah, atau website yang Anda bayangkan.", M, H - 270, 395, "GLSans", 10.2, 15.3, MUTED_LIGHT)

    rounded_rect(c, M, 370, 330, 154, 16, HexColor("#221F1C"), HexColor("#413A34"))
    label(c, "Brief awal", M + 18, 494, ACCENT_LIGHT)
    checklist = ["Tujuan utama website", "Audiens yang ingin dijangkau", "Layanan atau produk prioritas", "Materi yang sudah tersedia", "Fitur penting dan target waktu"]
    bullets(c, checklist, M + 18, 469, 294, IVORY, ACCENT_LIGHT, 8, 11.3, 4)

    rounded_rect(c, 392, 370, 161, 154, 16, IVORY)
    qr_code(c, "https://wa.me/6281553821808?text=Halo%20Gandiva%20Labs%2C%20saya%20ingin%20konsultasi%20website%20bisnis.", 417, 403, 102, INK, IVORY)
    c.setFillColor(INK)
    c.setFont("GLSansBold", 7.5)
    c.drawCentredString(472.5, 386, "SCAN TO WHATSAPP")
    add_url(c, "https://wa.me/6281553821808", 392, 370, 161, 154)

    rounded_rect(c, M, 174, W - 2 * M, 193, 16, HexColor("#241B17"), HexColor("#4A382F"))
    label(c, "Contact", M + 18, 336, ACCENT_LIGHT)
    contact_rows = [
        ("WhatsApp", "+62 815-5382-1808", "https://wa.me/6281553821808"),
        ("Email", "fadeta287@gmail.com", "mailto:fadeta287@gmail.com"),
        ("LinkedIn", "linkedin.com/in/fadetaig", "https://linkedin.com/in/fadetaig"),
        ("GitHub", "github.com/fadeta-ig", "https://github.com/fadeta-ig"),
    ]
    yy = 303
    for name, value, url in contact_rows:
        c.setFillColor(MUTED_LIGHT)
        c.setFont("GLSans", 7.2)
        c.drawString(M + 18, yy, name)
        c.setFillColor(IVORY)
        c.setFont("GLSansBold", 8.2)
        c.drawString(M + 91, yy, value)
        add_url(c, url, M + 85, yy - 5, 220, 15)
        yy -= 29

    c.setFillColor(MUTED_LIGHT)
    c.setFont("GLSans", 5.8)
    c.drawString(M, 145, "[VERIFIED] Materi: source website, data portofolio, aset brand, sertifikat MTCNA, dan Audit Gandiva Labs 13 Juli 2026.")
    c.drawString(M, 133, "[UNCERTAIN] Harga, timeline baku, domain resmi, testimonial, dan metrik hasil belum dipublikasikan karena data belum tersedia.")
    c.drawString(M, 121, "Acuan audit: ISO 9241-210:2019, Strategyzer VPC, WCAG 2.2, Google Web Vitals, dan Google Search Central.")
    c.setFillColor(ACCENT_LIGHT)
    c.setFont("GLSansBold", 7)
    c.drawString(M, 82, "LET'S MAKE THE DIRECTION CLEAR.")
    c.setFillColor(MUTED_LIGHT)
    c.setFont("GLSans", 6.8)
    c.drawRightString(W - M, 82, "Company Profile 2026")
    c.showPage()


def build_pdf() -> Path:
    register_fonts()
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    c = canvas.Canvas(str(OUTPUT), pagesize=A4, pageCompression=1)
    c.setTitle("Gandiva Labs - Company Profile 2026")
    c.setAuthor("Gandiva Labs")
    c.setSubject("Company profile dan kapabilitas bisnis Gandiva Labs")
    c.setCreator("Gandiva Labs")

    cover(c)
    snapshot(c)
    business_need(c)
    about(c)
    client_fit(c)
    services_overview(c)
    company_profile_service(c)
    landing_ecommerce(c)
    custom_care(c)
    process_page(c)
    delivery(c)
    portfolio_overview(c)
    case_page(
        c, 13, "Shinyoung Beauty", "E-commerce - Beauty", IMG_SHINYOUNG,
        "https://shinyoungbeauty.com/",
        "Brand kecantikan membutuhkan kanal yang menyatukan katalog, detail produk, akun pelanggan, dan alur pembelian.",
        "Toko online disusun agar eksplorasi produk, informasi brand, dan percakapan bantuan hadir dalam satu pengalaman.",
        ["WordPress", "WooCommerce", "Custom AI plugin"],
        GREEN, 0.35,
    )
    case_page(
        c, 14, "Mahakarya Kosmetika", "Company Profile - B2B", IMG_MAHAKARYA,
        "https://mahakaryakosmetika.co.id/",
        "Perusahaan manufaktur kosmetik perlu menjelaskan layanan, proses, dan kapabilitas kepada calon mitra secara lebih terstruktur.",
        "Website menata informasi dari pengenalan perusahaan menuju layanan dan jalur konsultasi yang lebih mudah ditemukan.",
        ["Strategi halaman", "WordPress", "Pengembangan web"],
        ACCENT, 0.47,
    )
    case_page(
        c, 15, "Wijaya Inovasi", "Company Profile - Manufacturing", IMG_WIJAYA,
        "https://wijayainovasi.co.id/",
        "Bisnis pengembangan produk herbal serta makanan dan minuman fungsional membutuhkan profil yang menjelaskan layanan dan kredibilitas.",
        "Company profile memberi ruang bagi positioning, kategori layanan, dan jalur request yang relevan bagi calon mitra.",
        ["Arsitektur konten", "WordPress", "SEO on-page dasar"],
        ACCENT, 0.46,
    )
    private_work(c)
    studio_founder(c)
    closing(c)
    c.save()
    return OUTPUT


if __name__ == "__main__":
    output = build_pdf()
    print(output)
