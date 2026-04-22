"""
provenance.py — Inline citation 파싱, 검증, provenance graph 구축.
wiki 페이지에서 [^src-*] 형태의 footnote citation을 추적한다.

Citation 형식 예:
  본문: "Transformer는 attention만으로 동작한다[^src-attention-is-all-you-need]."
  정의: "[^src-attention-is-all-you-need]: [[source-attention-is-all-you-need]]"
"""

import re
from pathlib import Path

# [^src-slug] 참조 (본문에서)
CITE_REF_RE = re.compile(r"\[\^(src-[a-z0-9-]+)\](?!:)")
# [^src-slug]: 정의 (페이지 하단)
CITE_DEF_RE = re.compile(r"^\[\^(src-[a-z0-9-]+)\]:\s*(.+)", re.MULTILINE)
# claim 문장: 마침표(. 。)로 끝나는 줄. frontmatter/heading/list marker/link-only 제외.
CLAIM_RE = re.compile(
    r"^(?!#|>|\s*-|\s*\d+\.|\s*\||\s*```|\s*\[)"  # heading, blockquote, list, table, code, link-only 제외
    r"(.+[.。])\s*$",
    re.MULTILINE,
)
FRONTMATTER_RE = re.compile(r"^---\s*\n.*?\n---\s*\n", re.DOTALL)


def _strip_frontmatter(text: str) -> str:
    m = FRONTMATTER_RE.match(text)
    return text[m.end():] if m else text


def parse_citations(page_content: str) -> dict[str, list[int]]:
    """페이지에서 [^src-*] 참조를 추출 → {source_slug: [char_positions]}"""
    body = _strip_frontmatter(page_content)
    result: dict[str, list[int]] = {}
    for m in CITE_REF_RE.finditer(body):
        slug = m.group(1)
        result.setdefault(slug, []).append(m.start())
    return result


def _get_definitions(page_content: str) -> dict[str, str]:
    """페이지 하단의 [^src-*]: 정의 추출 → {slug: target_text}"""
    body = _strip_frontmatter(page_content)
    return {m.group(1): m.group(2).strip() for m in CITE_DEF_RE.finditer(body)}


def _count_claims(page_content: str) -> tuple[int, int]:
    """(총 claim 수, citation 있는 claim 수) 반환"""
    body = _strip_frontmatter(page_content)
    claims = CLAIM_RE.findall(body)
    total = len(claims)
    cited = sum(1 for c in claims if CITE_REF_RE.search(c))
    return total, cited


def validate_page(page_path: Path, wiki_dir: Path) -> dict:
    """페이지 검증:
    - 모든 [^src-*] 참조에 정의가 있는지
    - 정의된 source-summary 페이지가 존재하는지
    - claim 중 citation 없는 비율
    """
    text = page_path.read_text("utf-8")
    refs = parse_citations(text)
    defs = _get_definitions(text)
    total_claims, cited_claims = _count_claims(text)

    # 1. 참조인데 정의 없음
    undefined_refs = [slug for slug in refs if slug not in defs]

    # 2. 정의된 source 페이지 존재 여부
    missing_sources = []
    for slug, target in defs.items():
        # target에서 wikilink 추출: [[source-xxx]] 또는 그냥 텍스트
        wl = re.search(r"\[\[([^\]]+)\]\]", target)
        source_filename = (wl.group(1) if wl else slug.replace("src-", "source-")) + ".md"
        if not (wiki_dir / source_filename).exists():
            missing_sources.append({"slug": slug, "expected": source_filename})

    coverage = (cited_claims / total_claims * 100) if total_claims > 0 else 100.0

    return {
        "page": str(page_path.relative_to(wiki_dir)),
        "total_claims": total_claims,
        "cited_claims": cited_claims,
        "coverage": round(coverage, 1),
        "undefined_refs": undefined_refs,
        "missing_sources": missing_sources,
    }


def build_provenance_graph(wiki_dir: Path) -> list[dict]:
    """모든 wiki 페이지 검증 결과 리스트 반환"""
    results = []
    for md in sorted(wiki_dir.rglob("*.md")):
        rel = str(md.relative_to(wiki_dir))
        # 메타 페이지는 스킵
        if rel in ("index.md", "log.md"):
            continue
        text = md.read_text("utf-8")
        # source 타입 페이지는 그 자체가 출처이므로 스킵
        if re.search(r"^type:\s*source", text, re.MULTILINE):
            continue
        v = validate_page(md, wiki_dir)
        # claim이 0인 페이지도 포함 (overview 등)
        results.append(v)
    # 커버리지 낮은 순 정렬
    results.sort(key=lambda x: x["coverage"])
    return results
