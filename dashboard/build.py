#!/usr/bin/env python3
"""
build.py — wiki/ 마크다운을 파싱하여 dashboard/data.json 생성.
의존성 없음 (Python 3.10+ 표준 라이브러리만 사용).

Usage:
    python dashboard/build.py       # 프로젝트 루트에서
    python build.py                 # dashboard/ 안에서
"""

import json, os, re, sys
from datetime import datetime
from pathlib import Path

SCRIPT_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = SCRIPT_DIR.parent
WIKI_DIR = PROJECT_ROOT / "wiki"
RAW_DIR = PROJECT_ROOT / "raw"
OUTPUT = SCRIPT_DIR / "data.json"

FRONTMATTER_RE = re.compile(r"^---\s*\n(.*?)\n---\s*\n", re.DOTALL)
YAML_LIST_RE = re.compile(r"\[(.*?)\]")
# [[target]] 또는 [[target|display]]
WIKILINK_RE = re.compile(r"\[\[([^\]|]+)(?:\|[^\]]*)?\]\]")
# [text](file.md) 전통 링크도 지원
MDLINK_RE = re.compile(r"\[([^\]]+)\]\(([^)]+\.md)\)")
LOG_ENTRY_RE = re.compile(r"^## \[(\d{4}-\d{2}-\d{2})\] (\w+) \| (.+)$", re.MULTILINE)


def parse_frontmatter(text: str) -> tuple[dict, str]:
    meta, body = {}, text
    m = FRONTMATTER_RE.match(text)
    if m:
        body = text[m.end():]
        for line in m.group(1).strip().split("\n"):
            if ":" not in line:
                continue
            key, val = line.split(":", 1)
            key, val = key.strip(), val.strip()
            list_match = YAML_LIST_RE.search(val)
            if list_match:
                meta[key] = [x.strip().strip("'\"") for x in list_match.group(1).split(",") if x.strip()]
            elif val.startswith("-") or val == "":
                continue  # multi-line list (handled below)
            else:
                meta[key] = val.strip("'\"")
        # multi-line YAML lists
        for mline in re.finditer(r"^(\w+):\s*\n((?:\s+-\s+.+\n?)+)", m.group(1), re.MULTILINE):
            key = mline.group(1)
            items = [x.strip().strip("'\"") for x in re.findall(r"-\s+(.+)", mline.group(2))]
            meta[key] = items
    return meta, body


def extract_links(body: str) -> list[str]:
    wikilinks = {m.group(1).strip() for m in WIKILINK_RE.finditer(body)}
    mdlinks = {m[1] for m in MDLINK_RE.findall(body)}
    # normalize: wikilink targets에 .md 붙이기
    all_links = set()
    for link in wikilinks:
        if not link.endswith(".md"):
            link = link + ".md"
        all_links.add(link)
    all_links.update(mdlinks)
    return sorted(all_links)


def count_raw_sources() -> int:
    count = 0
    if not RAW_DIR.exists():
        return 0
    for f in RAW_DIR.iterdir():
        if f.name.startswith(".") or f.name == "assets":
            continue
        if f.is_file():
            count += 1
        elif f.is_dir():
            count += sum(1 for x in f.rglob("*") if x.is_file() and not x.name.startswith("."))
    return count


def build():
    if not WIKI_DIR.exists():
        print(f"Error: wiki/ not found at {WIKI_DIR}")
        sys.exit(1)

    pages, nodes, edges = [], [], []
    type_counts, node_ids = {}, set()

    for md_file in sorted(WIKI_DIR.glob("*.md")):
        filename = md_file.name
        text = md_file.read_text(encoding="utf-8")
        meta, body = parse_frontmatter(text)
        links = extract_links(body)

        page_type = meta.get("type", "unknown")
        type_counts[page_type] = type_counts.get(page_type, 0) + 1

        pages.append({
            "filename": filename,
            "title": meta.get("title", filename.replace(".md", "").replace("-", " ").title()),
            "type": page_type,
            "created": meta.get("created", ""),
            "updated": meta.get("updated", ""),
            "tags": meta.get("tags", []),
            "sources": meta.get("sources", []),
            "links": links,
            "word_count": len(body.split()),
            "content": body.strip(),
        })

        node_ids.add(filename)
        nodes.append({"id": filename, "label": meta.get("title", filename.replace(".md", "")), "type": page_type})
        for link in links:
            edges.append({"from": filename, "to": link})

    for edge in edges:
        if edge["to"] not in node_ids:
            node_ids.add(edge["to"])
            nodes.append({"id": edge["to"], "label": edge["to"].replace(".md", "").replace("-", " ").title(), "type": "missing"})

    log_entries = []
    log_file = WIKI_DIR / "log.md"
    if log_file.exists():
        _, log_body = parse_frontmatter(log_file.read_text(encoding="utf-8"))
        log_entries = [{"date": m.group(1), "action": m.group(2), "title": m.group(3)} for m in LOG_ENTRY_RE.finditer(log_body)]

    data = {
        "pages": pages,
        "graph": {"nodes": nodes, "edges": edges},
        "log": log_entries,
        "stats": {
            "total_pages": len(pages),
            "raw_sources": count_raw_sources(),
            "type_counts": type_counts,
            "total_links": len(edges),
            "last_updated": datetime.now().strftime("%Y-%m-%d %H:%M"),
        },
    }

    OUTPUT.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Built {OUTPUT}  ({len(pages)} pages, {len(edges)} links)")


if __name__ == "__main__":
    build()
