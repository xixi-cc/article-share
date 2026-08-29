#!/usr/bin/env python3
"""Build the Article Share sitemap from the public archive links."""

from __future__ import annotations

import html
import re
from pathlib import Path
from urllib.parse import quote


ROOT = Path(__file__).resolve().parent.parent
BASE_URL = "https://xixi-cc.github.io/article-share/"
PDF_LINK_PATTERN = re.compile(r'href="([^"]+\.pdf)"', re.IGNORECASE)


def main() -> None:
    source = (ROOT / "index.html").read_text(encoding="utf-8")
    urls = [BASE_URL, f"{BASE_URL}rights.html"]
    urls.extend(f"{BASE_URL}{quote(path, safe='/')}" for path in PDF_LINK_PATTERN.findall(source))
    document = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ]
    for url in dict.fromkeys(urls):
        document.extend(["  <url>", f"    <loc>{html.escape(url)}</loc>", "  </url>"])
    document.append("</urlset>")
    (ROOT / "sitemap.xml").write_text("\n".join(document) + "\n", encoding="utf-8")


if __name__ == "__main__":
    main()
