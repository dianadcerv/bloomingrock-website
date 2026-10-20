#!/usr/bin/env python3
"""One-off: write a minimal valid PDF for the Meridian access platform demo drawing."""

from pathlib import Path

# Minimal PDF with Helvetica text (Rev C title block)
CONTENT = b"""BT
/F1 16 Tf
72 720 Td
(DEMO / FAKE - NOT FOR CONSTRUCTION) Tj
0 -28 Td
/F1 14 Tf
(Part: Access platform) Tj
0 -24 Td
(Revision: Rev C) Tj
0 -24 Td
(Meridian Food Plants - Line 3) Tj
0 -24 Td
(Northridge Steel demo data only) Tj
ET
"""

objects = []
objects.append(b"1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n")
objects.append(b"2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n")
objects.append(
    b"3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] "
    b"/Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>\nendobj\n"
)
stream = b"4 0 obj\n<< /Length %d >>\nstream\n" % len(CONTENT) + CONTENT + b"\nendstream\nendobj\n"
objects.append(stream)
objects.append(b"5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n")

body = b"%PDF-1.4\n"
offsets = [0]
for obj in objects:
    offsets.append(len(body))
    body += obj

xref_pos = len(body)
body += b"xref\n0 %d\n" % (len(objects) + 1)
body += b"0000000000 65535 f \n"
for off in offsets[1:]:
    body += b"%010d 00000 n \n" % off
body += b"trailer\n<< /Size %d /Root 1 0 R >>\nstartxref\n%d\n%%EOF\n" % (
    len(objects) + 1,
    xref_pos,
)

out = Path(__file__).resolve().parents[1] / "public" / "demo" / "meridian-access-platform-rev-c.pdf"
out.parent.mkdir(parents=True, exist_ok=True)
out.write_bytes(body)
print("Wrote", out, len(body), "bytes")
