"""
index_strategy.py — 페이지 수에 따라 인덱스 전략을 결정하고
인덱스 파일을 자동 생성/갱신한다.

전략:
  flat         (< 50 pages)  — 단일 wiki/index.md
  hierarchical (50~200)      — 타입별 서브 인덱스
  indexed      (> 200)       — 서브 인덱스 + BM25 권장
"""

import re
from datetime import datetime
from pathlib import Path

FRONTMATTER_RE = re.compile(r"^---\s*\n(.*?)\n---\s*\n", re.DOTALL)

THRESHOLDS = {"flat": 50, "hierarchical": 200}

# 타입 → 서브 인덱스 파일명 매핑
TYPE_INDEX = {
    "concept": "index-concepts.md",
    "technique": "index-techniques.md",
    "entity": "index-entities.md",
    "source-summary": "index-sources.md",
    "analysis": "index-analyses.md",
}

# 이 파일들은 일반 페이지 카운트에서 제외
SYSTEM_FILES = {"index.md", "log.md", "overview.md"} | set(TYPE_INDEX.values())


def _parse_type(text: str) -> str:
    m = FRONTMATTER_RE.match(text)
    if not m:
        return "unknown"
    for line in m.group(1).split("\n"):
        if line.strip().startswith("type:"):
            return line.split(":", 1)[1].strip().strip("'\"")
    return "unknown"


def _parse_title(text: str, stem: str) -> str:
    m = FRONTMATTER_RE.match(text)
    if m:
        for line in m.group(1).split("\n"):
            if line.strip().startswith("title:"):
                return line.split(":", 1)[1].strip().strip("'\"")
    return stem.replace("-", " ").title()


def count_wiki_pages(wiki_dir: Path) -> int:
    """시스템 파일 제외한 실제 위키 페이지 수"""
    count = 0
    for md in wiki_dir.rglob("*.md"):
        if md.name not in SYSTEM_FILES:
            count += 1
    return count


def get_strategy(wiki_dir: Path) -> dict:
    """현재 전략 + 메타 정보 반환"""
    n = count_wiki_pages(wiki_dir)
    if n < THRESHOLDS["flat"]:
        mode = "flat"
        next_threshold = THRESHOLDS["flat"]
        warning = None
    elif n <= THRESHOLDS["hierarchical"]:
        mode = "hierarchical"
        next_threshold = THRESHOLDS["hierarchical"]
        warning = None
    else:
        mode = "indexed"
        next_threshold = None
        warning = "200+ 페이지 도달. qmd 또는 벡터 검색 도입을 권장합니다."

    # 임계값 접근 경고 (5 이내)
    proximity_warning = None
    if mode == "flat" and next_threshold - n <= 5:
        proximity_warning = f"flat → hierarchical 전환까지 {next_threshold - n}페이지"
    elif mode == "hierarchical" and next_threshold and next_threshold - n <= 10:
        proximity_warning = f"indexed 전환까지 {next_threshold - n}페이지"

    return {
        "mode": mode,
        "page_count": n,
        "next_threshold": next_threshold,
        "warning": warning,
        "proximity_warning": proximity_warning,
    }


def _collect_pages(wiki_dir: Path) -> dict[str, list[tuple[str, str]]]:
    """타입별로 (filename, title) 리스트 수집"""
    by_type: dict[str, list[tuple[str, str]]] = {}
    for md in sorted(wiki_dir.rglob("*.md")):
        if md.name in SYSTEM_FILES:
            continue
        text = md.read_text("utf-8")
        ptype = _parse_type(text)
        title = _parse_title(text, md.stem)
        rel = str(md.relative_to(wiki_dir))
        by_type.setdefault(ptype, []).append((rel, title))
    return by_type


def _one_line(title: str, filename: str) -> str:
    stem = filename.replace(".md", "")
    return f"- [[{stem}|{title}]]"


def build_flat_index(wiki_dir: Path):
    """단일 index.md 생성 (< 50 pages)"""
    by_type = _collect_pages(wiki_dir)
    today = datetime.now().strftime("%Y-%m-%d")

    sections = []
    # overview 페이지
    if (wiki_dir / "overview.md").exists():
        sections.append("## Overview\n- [[overview]] — wiki scope and current state")

    type_order = [
        ("source-summary", "Sources"),
        ("entity", "Entities"),
        ("concept", "Concepts"),
        ("technique", "Techniques"),
        ("analysis", "Analyses"),
    ]
    for ptype, heading in type_order:
        pages = by_type.get(ptype, [])
        if not pages:
            continue
        lines = [f"## {heading}"]
        for fn, title in sorted(pages, key=lambda x: x[1].lower()):
            lines.append(_one_line(title, fn))
        sections.append("\n".join(lines))

    # 미분류
    known = {t for t, _ in type_order}
    for ptype, pages in sorted(by_type.items()):
        if ptype in known:
            continue
        lines = [f"## {ptype.title()}"]
        for fn, title in sorted(pages, key=lambda x: x[1].lower()):
            lines.append(_one_line(title, fn))
        sections.append("\n".join(lines))

    content = f"""---
title: Index
type: overview
created: 2026-04-22
last_updated: {today}
tags:
  - meta
---

# Wiki Index

All wiki pages, organized by type. Updated on every ingest.

{chr(10).join(sections)}
"""
    (wiki_dir / "index.md").write_text(content, "utf-8")


def build_hierarchical_index(wiki_dir: Path):
    """타입별 서브 인덱스 + 요약 index.md 생성 (50~200 pages)"""
    by_type = _collect_pages(wiki_dir)
    today = datetime.now().strftime("%Y-%m-%d")

    type_order = [
        ("source-summary", "Sources", "index-sources.md"),
        ("entity", "Entities", "index-entities.md"),
        ("concept", "Concepts", "index-concepts.md"),
        ("technique", "Techniques", "index-techniques.md"),
        ("analysis", "Analyses", "index-analyses.md"),
    ]

    summary_sections = []
    if (wiki_dir / "overview.md").exists():
        summary_sections.append("## Overview\n- [[overview]] — wiki scope and current state")

    for ptype, heading, idx_file in type_order:
        pages = by_type.get(ptype, [])
        count = len(pages)

        # 서브 인덱스 생성
        lines = []
        for fn, title in sorted(pages, key=lambda x: x[1].lower()):
            lines.append(_one_line(title, fn))

        sub_content = f"""---
title: "Index — {heading}"
type: overview
created: {today}
last_updated: {today}
tags:
  - meta
  - index
---

# {heading} ({count})

{chr(10).join(lines) if lines else '(none yet)'}
"""
        (wiki_dir / idx_file).write_text(sub_content, "utf-8")

        # 요약 index에 링크
        idx_stem = idx_file.replace(".md", "")
        summary_sections.append(
            f"## {heading} ({count})\nSee [[{idx_stem}|full list]]"
        )

    # 미분류
    known = {t for t, _, _ in type_order}
    for ptype, pages in sorted(by_type.items()):
        if ptype in known:
            continue
        lines = [f"## {ptype.title()} ({len(pages)})"]
        for fn, title in sorted(pages, key=lambda x: x[1].lower()):
            lines.append(_one_line(title, fn))
        summary_sections.append("\n".join(lines))

    content = f"""---
title: Index
type: overview
created: 2026-04-22
last_updated: {today}
tags:
  - meta
---

# Wiki Index (hierarchical)

> [!info] This wiki uses hierarchical indexing.
> Each type has its own sub-index page for faster navigation.

{chr(10).join(summary_sections)}
"""
    (wiki_dir / "index.md").write_text(content, "utf-8")


def rebuild_index(wiki_dir: Path) -> dict:
    """현재 전략에 맞는 인덱스를 강제 재생성"""
    strategy = get_strategy(wiki_dir)
    mode = strategy["mode"]

    if mode == "flat":
        build_flat_index(wiki_dir)
        # 서브 인덱스가 있으면 삭제
        for fn in TYPE_INDEX.values():
            f = wiki_dir / fn
            if f.exists():
                f.unlink()
    else:
        # hierarchical 또는 indexed
        build_hierarchical_index(wiki_dir)

    return {"ok": True, "mode": mode, "page_count": strategy["page_count"]}


def get_index_instruction(wiki_dir: Path) -> str:
    """ingest/query/lint 프롬프트에 삽입할 인덱스 읽기 지시문"""
    strategy = get_strategy(wiki_dir)
    mode = strategy["mode"]

    if mode == "flat":
        return "wiki/index.md를 먼저 읽어 관련 페이지를 찾아."
    else:
        return """wiki/index.md를 읽어 전체 구조를 파악한 뒤,
질문과 관련된 타입의 서브 인덱스를 읽어:
- 소스 관련: wiki/index-sources.md
- 엔티티 관련: wiki/index-entities.md
- 개념 관련: wiki/index-concepts.md
- 기법 관련: wiki/index-techniques.md
- 분석 관련: wiki/index-analyses.md
필요한 서브 인덱스만 선택적으로 읽어."""
