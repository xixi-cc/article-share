#!/usr/bin/env python3
"""Generate archive entries, README inventory and sitemap from content/papers.json."""
import html
import json
from datetime import date
from pathlib import Path
from urllib.parse import quote, urlparse
from build_sitemap import main as build_sitemap

ROOT = Path(__file__).resolve().parent.parent


def replace_region(path, name, body):
    source = path.read_text(encoding='utf-8')
    start, end = f'<!-- BEGIN GENERATED {name} -->', f'<!-- END GENERATED {name} -->'
    if source.count(start) != 1 or source.count(end) != 1:
        raise ValueError(f'{path}: expected one generated region')
    before, rest = source.split(start)
    _, after = rest.split(end)
    path.write_text(before + start + '\n' + body + '\n' + end + after, encoding='utf-8')


def main():
    papers = json.loads((ROOT / 'content/papers.json').read_text(encoding='utf-8'))
    seen, rows, inventory = set(), [], []
    for paper in papers:
        date.fromisoformat(paper['date'])
        if paper['url'] in seen or urlparse(paper['url']).scheme != 'https':
            raise ValueError(f'Duplicate or invalid paper URL: {paper["url"]}')
        seen.add(paper['url'])
        pdf = (ROOT / paper['slides']).resolve()
        if not pdf.is_relative_to(ROOT) or not pdf.is_file() or pdf.suffix.lower() != '.pdf':
            raise ValueError(f'Missing or invalid slides: {paper["slides"]}')
        title, url, slides = (html.escape(paper[k], quote=True) for k in ('title', 'url', 'slides'))
        day = paper['date']
        rows.append(f'''                <article class="paper-row">
                    <div class="paper-meta"><time datetime="{day}">{day.replace('-', '.')}</time></div>
                    <div class="paper-content">
                        <h3><a href="{url}" target="_blank" rel="noreferrer">{title} <span class="link-label">arXiv ↗</span></a></h3>
                        <a class="slides-link" href="{slides}" target="_blank">Slides PDF ↗</a>
                    </div>
                </article>''')
        inventory.append(f'- [{paper["title"]}]({quote(str(Path(paper["slides"]).parent), safe="")}/)')
    replace_region(ROOT / 'index.html', 'PAPERS', '\n\n'.join(rows))
    replace_region(ROOT / 'README.md', 'PAPERS', '\n'.join(inventory))
    build_sitemap()


if __name__ == '__main__':
    main()
