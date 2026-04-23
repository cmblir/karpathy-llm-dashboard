"""project_registry.py — 멀티 프로젝트 레지스트리/resolver.

- projects.json 읽기/쓰기
- Project dataclass
- legacy 모드 지원 (projects.json이 없거나 비어있으면 현재 루트의 wiki/raw를 default로 간주)
- 모든 경로는 PROJECT_ROOT 기준 절대 경로로 변환
"""

from __future__ import annotations

import json
import re
import time
from dataclasses import dataclass, field, asdict
from datetime import datetime
from pathlib import Path

# 모듈 로드 시 PROJECT_ROOT 고정
PROJECT_ROOT = Path(__file__).resolve().parent.parent
REGISTRY_FILE = PROJECT_ROOT / "projects.json"
PROJECTS_DIR = PROJECT_ROOT / "projects"
TEMPLATES_DIR = PROJECT_ROOT / "templates"

# legacy 경로 (마이그레이션 전 현재 레이아웃)
LEGACY_WIKI = PROJECT_ROOT / "wiki"
LEGACY_RAW = PROJECT_ROOT / "raw"
LEGACY_CLAUDE_MD = PROJECT_ROOT / "CLAUDE.md"
LEGACY_SETTINGS = PROJECT_ROOT / ".dashboard-settings.json"
LEGACY_INGEST_REPORTS = PROJECT_ROOT / "ingest-reports"
LEGACY_REFLECT_REPORTS = PROJECT_ROOT / "reflect-reports"
LEGACY_QUERY_LOG = PROJECT_ROOT / "query-log.jsonl"
LEGACY_PLANS = PROJECT_ROOT / "plans"


@dataclass(frozen=True)
class Project:
    slug: str                  # "" for legacy
    title: str
    is_legacy: bool
    root: Path                 # projects/<slug>/ or PROJECT_ROOT
    wiki_dir: Path
    raw_dir: Path
    claude_md: Path
    settings_file: Path
    ingest_reports: Path
    reflect_reports: Path
    plans_dir: Path
    query_log: Path
    model: str = "default"
    description: str = ""
    created: str = ""
    last_used: str = ""
    template: str = ""

    def to_dict(self) -> dict:
        d = asdict(self)
        # Path → str for JSON
        for k, v in list(d.items()):
            if isinstance(v, Path):
                d[k] = str(v.relative_to(PROJECT_ROOT)) if v.is_relative_to(PROJECT_ROOT) else str(v)
        return d


# ─── registry I/O ───

def _default_registry() -> dict:
    return {"version": 1, "active": None, "projects": []}


def _load_registry() -> dict:
    if not REGISTRY_FILE.exists():
        return _default_registry()
    try:
        data = json.loads(REGISTRY_FILE.read_text("utf-8"))
        if not isinstance(data, dict):
            return _default_registry()
        data.setdefault("version", 1)
        data.setdefault("active", None)
        data.setdefault("projects", [])
        return data
    except Exception:
        return _default_registry()


def _save_registry(reg: dict) -> None:
    REGISTRY_FILE.write_text(
        json.dumps(reg, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )


# ─── slug ───

def make_slug(title: str) -> str:
    """Mirror of server.make_slug — duplicated to avoid circular import."""
    s = (title or "").strip().lower()
    s = re.sub(r"[^\w\s-]", "", s, flags=re.UNICODE)
    s = re.sub(r"[\s_]+", "-", s)
    s = re.sub(r"-+", "-", s).strip("-")
    if not s:
        s = f"untitled-{int(time.time())}"
    return s


# ─── 프로젝트 설정 파일 (model 등) ───

def _load_project_settings(settings_path: Path) -> dict:
    if not settings_path.exists():
        return {}
    try:
        return json.loads(settings_path.read_text("utf-8")) or {}
    except Exception:
        return {}


def _save_project_settings(settings_path: Path, settings: dict) -> None:
    settings_path.write_text(
        json.dumps(settings, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )


# ─── Project 인스턴스화 ───

def _legacy_project() -> Project:
    settings = _load_project_settings(LEGACY_SETTINGS)
    return Project(
        slug="",
        title="(legacy)",
        is_legacy=True,
        root=PROJECT_ROOT,
        wiki_dir=LEGACY_WIKI,
        raw_dir=LEGACY_RAW,
        claude_md=LEGACY_CLAUDE_MD,
        settings_file=LEGACY_SETTINGS,
        ingest_reports=LEGACY_INGEST_REPORTS,
        reflect_reports=LEGACY_REFLECT_REPORTS,
        plans_dir=LEGACY_PLANS,
        query_log=LEGACY_QUERY_LOG,
        model=settings.get("model", "default"),
    )


def _entry_to_project(entry: dict) -> Project:
    slug = entry["slug"]
    root = PROJECTS_DIR / slug
    settings = _load_project_settings(root / ".settings.json")
    # model 우선순위: .settings.json > registry entry > default
    model = settings.get("model") or entry.get("model") or "default"
    return Project(
        slug=slug,
        title=entry.get("title", slug),
        is_legacy=False,
        root=root,
        wiki_dir=root / "wiki",
        raw_dir=root / "raw",
        claude_md=root / "CLAUDE.md",
        settings_file=root / ".settings.json",
        ingest_reports=root / "ingest-reports",
        reflect_reports=root / "reflect-reports",
        plans_dir=root / "plans",
        query_log=root / "query-log.jsonl",
        model=model,
        description=entry.get("description", ""),
        created=entry.get("created", ""),
        last_used=entry.get("last_used", ""),
        template=entry.get("template", ""),
    )


def list_projects() -> list[Project]:
    reg = _load_registry()
    return [_entry_to_project(e) for e in reg.get("projects", [])]


def get_active_slug() -> str | None:
    reg = _load_registry()
    return reg.get("active")


def has_projects() -> bool:
    reg = _load_registry()
    return bool(reg.get("projects"))


def get_project(slug: str | None = None) -> Project:
    """주어진 slug의 프로젝트. 없거나 projects.json이 비어있으면 legacy project 반환.

    Args:
        slug: 구체적 프로젝트 slug. None이면 active 사용. legacy 폴백.
    """
    reg = _load_registry()
    projects = reg.get("projects", [])
    if not projects:
        # projects.json 비어있음 → legacy
        return _legacy_project()

    target = slug or reg.get("active")
    if not target:
        # active 미지정인데 프로젝트는 있음 → 첫 항목으로 폴백
        return _entry_to_project(projects[0])

    for e in projects:
        if e.get("slug") == target:
            return _entry_to_project(e)

    # slug 불일치 → legacy 폴백 (조용히) 대신 예외
    raise KeyError(f"Project not found: {target}")


# ─── CRUD ───

def _copy_template(template_name: str, dest: Path) -> None:
    """templates/<name>/CLAUDE.md를 dest/CLAUDE.md로 복사. 없으면 generic.

    placeholder {{TOPIC}} {{PURPOSE}}는 나중에 create_project에서 replace.
    """
    src_dir = TEMPLATES_DIR / template_name
    if not (src_dir / "CLAUDE.md").exists():
        src_dir = TEMPLATES_DIR  # generic fallback
    dest.write_text((src_dir / "CLAUDE.md").read_text("utf-8"), encoding="utf-8")


def create_project(
    slug_hint: str,
    title: str,
    description: str = "",
    model: str = "default",
    template: str = "",
) -> Project:
    """신규 프로젝트 생성.

    - slug_hint → make_slug → 중복 체크
    - projects/<slug>/ 디렉터리 + 기본 파일 생성
    - projects.json에 등록, active로 설정
    """
    if not title or not title.strip():
        raise ValueError("title is required")
    slug = make_slug(slug_hint or title)
    if not slug:
        raise ValueError("invalid slug")

    reg = _load_registry()
    for e in reg.get("projects", []):
        if e.get("slug") == slug:
            raise ValueError(f"slug already exists: {slug}")

    root = PROJECTS_DIR / slug
    if root.exists():
        raise ValueError(f"projects/{slug} already exists on disk")
    root.mkdir(parents=True)
    (root / "wiki").mkdir()
    (root / "raw").mkdir()
    (root / "raw" / "assets").mkdir()
    (root / "ingest-reports").mkdir()
    (root / "reflect-reports").mkdir()
    (root / "plans").mkdir()

    # 스타터 wiki 파일 (최소)
    today = datetime.now().strftime("%Y-%m-%d")
    (root / "wiki" / "index.md").write_text(
        f"# {title} — Index\n\n## Sources\n\n## Entities\n\n## Concepts\n\n## Techniques\n\n## Analyses\n",
        encoding="utf-8",
    )
    (root / "wiki" / "log.md").write_text(
        f"# {title} — Activity Log\n\n## [{today}] init | {title}\nProject created.\n",
        encoding="utf-8",
    )
    (root / "wiki" / "overview.md").write_text(
        f"---\ntitle: \"{title}\"\ntype: overview\ncreated: {today}\nlast_updated: {today}\n---\n\n# {title}\n\n{description}\n",
        encoding="utf-8",
    )

    # CLAUDE.md 템플릿 복사
    _copy_template(template or "", root / "CLAUDE.md")
    content = (root / "CLAUDE.md").read_text("utf-8")
    content = content.replace("{{TOPIC}}", title).replace("{{PURPOSE}}", description or "")
    (root / "CLAUDE.md").write_text(content, encoding="utf-8")

    # .settings.json
    _save_project_settings(root / ".settings.json", {"model": model})

    # 빈 query-log
    (root / "query-log.jsonl").write_text("", encoding="utf-8")

    # 레지스트리 업데이트
    entry = {
        "slug": slug,
        "title": title,
        "description": description,
        "model": model,
        "created": today,
        "last_used": today,
        "template": template or "",
    }
    reg.setdefault("projects", []).append(entry)
    reg["active"] = slug
    _save_registry(reg)

    return _entry_to_project(entry)


def switch_project(slug: str) -> Project:
    reg = _load_registry()
    projects = reg.get("projects", [])
    for e in projects:
        if e.get("slug") == slug:
            reg["active"] = slug
            e["last_used"] = datetime.now().strftime("%Y-%m-%d")
            _save_registry(reg)
            return _entry_to_project(e)
    raise KeyError(f"Project not found: {slug}")


def update_project_settings(slug: str, *, model: str | None = None, title: str | None = None, description: str | None = None) -> Project:
    reg = _load_registry()
    projects = reg.get("projects", [])
    for e in projects:
        if e.get("slug") == slug:
            if model is not None:
                e["model"] = model
                # .settings.json과 동기화
                sf = PROJECTS_DIR / slug / ".settings.json"
                s = _load_project_settings(sf)
                s["model"] = model
                _save_project_settings(sf, s)
            if title is not None:
                e["title"] = title
            if description is not None:
                e["description"] = description
            _save_registry(reg)
            return _entry_to_project(e)
    raise KeyError(f"Project not found: {slug}")


def delete_project(slug: str, confirm: bool = False) -> dict:
    """프로젝트 삭제. 기본값은 projects/.trash/<slug>-<ts>/로 이동 (soft).
    confirm=True여야만 실행. 'hard' 옵션은 이번 단계에서 미구현.
    """
    if not confirm:
        return {"ok": False, "error": "confirm=True required"}
    reg = _load_registry()
    projects = reg.get("projects", [])
    entry = next((e for e in projects if e.get("slug") == slug), None)
    if not entry:
        return {"ok": False, "error": f"Project not found: {slug}"}

    src = PROJECTS_DIR / slug
    trash = PROJECTS_DIR / ".trash"
    trash.mkdir(exist_ok=True)
    ts = datetime.now().strftime("%Y%m%d-%H%M%S")
    dest = trash / f"{slug}-{ts}"
    src.rename(dest)

    reg["projects"] = [e for e in projects if e.get("slug") != slug]
    if reg.get("active") == slug:
        reg["active"] = reg["projects"][0]["slug"] if reg["projects"] else None
    _save_registry(reg)
    return {"ok": True, "moved_to": str(dest.relative_to(PROJECT_ROOT))}
