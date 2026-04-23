---
title: "Today Queue — 멀티 프로젝트 아키텍처"
created: 2026-04-23
owner: yoo
---

# Today Queue — 멀티 프로젝트 전환

우선순위: 위에서 아래로 소비. 각 항목은 독립 커밋.

---

## [MP-01] 저장소 레이아웃 재설계 (설계만, 파일 이동 없음)
- 목표: 프로젝트 격리 구조 문서화
- 영향 범위: 루트 레이아웃, `server.py` 상수, CLAUDE.md
- 완료 기준:
  - 제안 디렉터리 트리가 `plans/architecture-multiproject.md`에 정리됨
  - 경로 resolver 함수 시그니처 초안 (project_root(name) / wiki_dir(name) / raw_dir(name))
  - 루트에 유지할 것 vs 프로젝트 스코프로 내릴 것 구분 확정
- 위험도: low

---

## [MP-02] `projects/` 루트 + `projects.json` 레지스트리 도입
- 목표: `projects/` 디렉터리 생성 + `projects.json`(프로젝트 목록, active_project) 스키마 정의
- 영향 범위: 신규 파일
- 완료 기준:
  - `projects/` 존재
  - `projects.json` 스키마: `{ "active": "<slug>", "projects": [{"slug","title","description","model","created","last_used"}] }`
  - 기존 콘텐츠는 아직 이동하지 않음 (MP-04에서 수행)
- 위험도: low

---

## [MP-03] `server.py` 프로젝트 resolver 도입
- 목표: `WIKI_DIR`/`RAW_DIR` 상수를 함수로 치환. 모든 경로 접근을 resolver 경유.
- 영향 범위: `dashboard/server.py` 전반, `dashboard/index_strategy.py`, `dashboard/provenance.py`
- 완료 기준:
  - `get_project(name=None)` → dataclass (paths, settings) 반환
  - 모든 do_*() 함수가 project 인자(또는 current) 받도록 시그니처 변경
  - 하위호환: project 인자 생략 시 `projects.json.active` 사용
- 위험도: medium (서버 전체 리팩토링)

---

## [MP-04] 기존 콘텐츠 → `projects/karpathy-llm/` 마이그레이션
- 목표: 현재 `wiki/ raw/ CLAUDE.md ingest-reports/ reflect-reports/ query-log.jsonl`를 프로젝트 하위로 이전
- 영향 범위: 루트 디렉터리 대규모 이동
- 완료 기준:
  - `git mv`로 history 보존 이전
  - `projects.json`에 `karpathy-llm` 등록 + active
  - `.dashboard-settings.json`의 model 값을 프로젝트 `.settings.json`으로 복사
  - 루트 `README.md`의 경로 예시 갱신
  - 서버 재시작 후 대시보드 정상 작동 확인
- 위험도: high (사용자 승인 필수 — 되돌리기는 git revert)

---

## [MP-05] `/api/projects` CRUD 엔드포인트
- 목표: 프로젝트 목록/생성/전환/삭제 API
- 영향 범위: `server.py`
- 완료 기준:
  - `GET /api/projects` → 리스트 + active
  - `POST /api/projects` (name, description, model, template) → 새 `projects/<slug>/` 생성 + 스타터 CLAUDE.md + 빈 wiki/raw
  - `POST /api/projects/switch` (slug) → active 갱신
  - `POST /api/projects/delete` (slug, confirm) → 삭제 (쓰레기통으로 이동 권장)
  - `POST /api/projects/<slug>/settings` (model) → 프로젝트별 모델 저장
- 위험도: medium

---

## [MP-06] 프로젝트 템플릿 CLAUDE.md
- 목표: 신규 프로젝트 생성 시 복제될 스타터 스키마 제공
- 영향 범위: `templates/CLAUDE.md` 신규
- 완료 기준:
  - 일반 목적용 (기본 frontmatter/citation 규칙 유지, 도메인 예시 삭제)
  - 3~5개 주제별 variant (llm-research / product-ops / personal-notes / reading-log) — 생성 시 선택 가능
- 위험도: low

---

## [MP-07] 기존 API 엔드포인트 project 스코핑
- 목표: `/api/ingest, /api/query, /api/lint, /api/lint/fix, /api/reflect, /api/write, /api/compare, /api/review/*, /api/search, /api/page*, /api/folder, /api/slides, /api/revert, /api/history, /api/provenance, /api/suggest/sources, /api/raw/integrity, /api/index/*, /api/schema, /api/wiki, /api/folders, /api/hash, /api/query-stats, /api/assistant` — 전부 project 스코프 수용
- 영향 범위: 모든 핸들러
- 완료 기준:
  - body 또는 querystring에 `project` 필드 수용
  - 생략 시 active 사용
  - 응답에 `project` echo
- 위험도: medium

---

## [MP-08] 헤더 프로젝트 선택기 (UI)
- 목표: 대시보드 상단에 프로젝트 드롭다운 추가 (모델 선택기 옆)
- 영향 범위: `dashboard/index.html`
- 완료 기준:
  - 프로젝트 목록 + active 표시
  - 전환 시 전체 뷰 재로딩 (`/api/wiki?project=<slug>` 등)
  - "새 프로젝트" 버튼 → 모달 (name, description, model, template variant)
  - 모델 선택기는 현재 프로젝트의 모델을 읽고 쓰도록 연동
  - 키보드 단축키: Cmd/Ctrl+P (프로젝트 전환 팔레트)
- 위험도: medium

---

## [MP-09] 프로젝트 내 "목적별 폴더" 템플릿 지원
- 목표: 사용자가 "페이지를 목적별 폴더에 정리"하고 싶다는 요구 충족
- 영향 범위: 페이지 생성 플로우
- 완료 기준:
  - 템플릿 CLAUDE.md에 권장 폴더 구조 명시 (e.g. `sources/ entities/ concepts/ techniques/ analyses/`, 또는 variant별 상이)
  - Ingest 시 type에 따라 자동으로 적절한 하위 폴더에 배치 옵션
  - 페이지 생성 모달에 "폴더 빠른 선택" 드롭다운 (프로젝트 루트 + 기존 폴더)
  - 사이드바 "목적" 탭: frontmatter.tags 또는 folder 기반 그룹핑 뷰
- 위험도: low

---

## [MP-10] Obsidian / git / 대시보드 문서 갱신
- 목표: 멀티 프로젝트 전환 후 사용자 실제 이용 가능 상태 → README/가이드 갱신 (CLAUDE.md §4.5)
- 영향 범위: `README.md`, `README-ko.md`, `docs/`, 대시보드 내 Guide 모달
- 완료 기준:
  - 신규 경로/명령 반영
  - 스크린샷/GIF 재촬영 (필요 시)
  - `.obsidian/` vault 경로가 여전히 동작하는지 확인 — 프로젝트 개별 vault 등록 필요한지 결정
- 위험도: low
