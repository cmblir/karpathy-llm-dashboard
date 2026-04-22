# LLM Wiki Dashboard

LLM이 구축하고 관리하는 개인 지식 베이스 + 웹 대시보드. [Karpathy의 LLM Wiki 패턴](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f) 기반.

**[English README](README.md)**

> **Obsidian**이 IDE, **Claude Code**가 프로그래머, **위키**가 코드베이스, **대시보드**가 컨트롤 패널.

위키를 직접 쓸 필요 없습니다. LLM이 전부 작성하고 유지합니다. 당신은 소스를 큐레이션하고, 질문하고, 분석을 지시하면 됩니다.

## 빠른 시작

```bash
git clone https://github.com/cmblir/karpathy-llm-dashboard.git my-wiki
cd my-wiki
python dashboard/server.py
# → http://localhost:8090
```

Obsidian → "Open folder as vault" → `my-wiki` 선택.

끝. Obsidian 설정, 그래프 색상, 단축키는 미리 세팅되어 있습니다.

## 할 수 있는 것

### 대시보드에서 (http://localhost:8090)

| 기능 | 설명 |
|------|------|
| **Ingest** | 내용 붙여넣기 → `raw/`에 자동 저장 → Claude가 위키 페이지 생성, diff + reasoning 표시 |
| **Query** | 질문하기 → Claude가 위키 검색, citation 포함 답변 합성. 어떤 파일을 읽었는지 추적 |
| **Lint** | 건강 검진: 누락 citation, 고아 페이지, 오래된 주장, frontmatter 문제 (16개 체크리스트) |
| **Reflect** | 최근 ingest 메타 분석 → 새 페이지 제안, 스키마 개선, 부족한 소스 추천 |
| **History** | git 기반 ingest 이력 + 원클릭 revert |
| **Provenance** | 페이지별 citation 커버리지 테이블, Claude로 자동 보완 |
| **Graph** | 인터랙티브 지식 그래프 (드래그, 클릭 이동) |
| **CLAUDE.md** | LLM 스키마를 대시보드에서 직접 확인/편집 |
| **Edit/Delete** | 위키 페이지 편집/삭제 |
| **+ Folder / + Page** | 위키 구조 수동 생성 |

### CLI에서

```bash
claude                              # Claude Code 시작
# 대화에서:
"Ingest raw/some-article.md"        # 소스 처리
"Self-Attention이 뭐야?"              # 위키에 질문
"Lint the wiki"                     # 건강 검진
```

## 아키텍처

```
raw/                  불변 소스 문서 (보호됨 — 수정/삭제 불가)
raw/assets/           다운로드된 이미지
wiki/                 LLM이 관리하는 위키 페이지 (Obsidian + 대시보드로 열람)
  index.md            콘텐츠 카탈로그 (50+ 페이지 시 자동으로 hierarchical 전환)
  log.md              활동 타임라인
  overview.md         위키 통계
dashboard/
  server.py           API 서버 (Python 3.10+, 외부 의존성 없음)
  index.html          단일 파일 대시보드 UI
  provenance.py       Citation 파싱 및 커버리지 분석
  index_strategy.py   적응형 인덱싱 (flat/hierarchical/indexed)
  build.py            선택: wiki → data.json 컴파일러
ingest-reports/       각 ingest의 WHY 보고서
reflect-reports/      주간 메타 분석 보고서
query-log.jsonl       쿼리 추적 (읽은 파일, wiki ratio)
CLAUDE.md             LLM 스키마 — frontmatter 규칙, citation 규칙,
                      모순 해결 정책, ingest 워크플로, lint 체크리스트
.obsidian/            vault 설정 (미리 세팅됨)
```

## 핵심 시스템

### Ingest + Diff 시각화

소스를 ingest하면 대시보드에 표시:
- **좌측 패널**: 파일 트리 (초록 = 생성, 노랑 = 수정)
- **우측 패널**: 수정 파일은 unified diff, 새 파일은 마크다운 프리뷰
- **Reasoning**: Claude가 각 판단의 이유를 설명
- **Approve / Revert**: 원클릭 `git revert`로 되돌리기

### Inline Citation

모든 사실적 주장에 `[^src-*]` citation 필수. 대시보드에서 숫자 배지로 렌더링, hover 시 소스 제목 툴팁, 클릭 시 소스 페이지로 이동.

**Provenance** 탭에서 페이지별 citation 커버리지 확인 — **Fix** 버튼으로 Claude가 자동 보완.

### 적응형 인덱싱

| 페이지 수 | 전략 | 동작 |
|----------|------|------|
| < 50 | `flat` | 단일 `index.md` |
| 50-200 | `hierarchical` | 타입별 서브 인덱스 자동 생성 |
| > 200 | `indexed` | 경고 배너, BM25/벡터 검색 도입 권장 |

### Wiki Ratio 게이지

헤더에 실시간 게이지 — Claude가 Query 시 wiki vs raw 소스를 얼마나 참조하는지 표시. 0.4 미만 = 빨간색 (위키가 raw를 효과적으로 대체하지 못하고 있음).

### raw/ 보호

`raw/`는 4단계로 보호:
1. `CLAUDE.md`에 LLM에게 raw/ 수정 금지 명시
2. 모든 프롬프트에 "raw/는 불변" 삽입
3. `assert_writable()`로 프로그래밍적 쓰기 차단
4. `check_raw_integrity()`로 사후 변경 감지

### 모순 해결 정책

소스 간 충돌 시 CLAUDE.md에 정의된 3가지 경로:
- **최신 + 높은 신뢰도** → 기존 claim을 "Historical claims"로 이동
- **비슷한 날짜 또는 낮은 신뢰도** → "Disputed" 섹션, 페이지 `disputed` 표시
- **명시적 반박** → 기존 소스 `superseded` 표시

### Reflect (메타 분석)

주 1회 권장. 최근 ingest 보고서 + 로그 + 쿼리 기록을 분석하여:
- 만들어야 할 새 페이지 제안
- CLAUDE.md 스키마 개선 제안 (diff 형태)
- 부족한 소스 주제의 검색어 추천
- 반복되는 모순 패턴 분석

## API 레퍼런스

| Method | Path | 설명 |
|--------|------|------|
| GET | `/api/status` | Claude CLI + Obsidian 연결 상태 |
| GET | `/api/wiki` | 전체 위키 데이터 (페이지, 그래프, 로그, 통계) |
| GET | `/api/folders` | 폴더 트리 |
| GET | `/api/hash` | 위키 변경 감지 해시 |
| GET | `/api/schema` | CLAUDE.md 읽기 |
| GET | `/api/history` | Ingest 커밋 이력 |
| GET | `/api/provenance` | 페이지별 citation 커버리지 |
| GET | `/api/query-stats` | 최근 쿼리 wiki ratio 평균 |
| GET | `/api/index/status` | 현재 인덱싱 전략 |
| GET | `/api/raw/integrity` | raw/ 변조 체크 |
| GET | `/api/reflect/status` | 마지막 reflect 날짜 |
| POST | `/api/ingest` | 소스 ingest (diff, reasoning, 자동 커밋) |
| POST | `/api/query` | 파일 추적 포함 쿼리 |
| POST | `/api/query/save` | 쿼리 답변을 위키 페이지로 저장 |
| POST | `/api/lint` | lint 체크리스트 실행 |
| POST | `/api/lint/fix` | lint 이슈 자동 수정 |
| POST | `/api/reflect` | 메타 분석 실행 |
| POST | `/api/provenance/fix` | 페이지 citation 보완 |
| POST | `/api/index/rebuild` | 인덱스 강제 재빌드 |
| POST | `/api/revert` | ingest 커밋 revert |
| POST | `/api/page` | 페이지 생성 |
| POST | `/api/page/update` | 페이지 편집 |
| POST | `/api/page/delete` | 페이지 삭제 |
| POST | `/api/folder` | 폴더 생성 |
| POST | `/api/schema` | CLAUDE.md 수정 |

## 필요 조건

- Python 3.10+ (pip 의존성 없음)
- [Claude Code CLI](https://docs.anthropic.com/en/docs/claude-code) (`npm install -g @anthropic-ai/claude-code`)
- 브라우저
- Obsidian (선택이지만 권장)

## Obsidian 팁

- **Graph View** (`Cmd+G`) — 위키 구조를 한눈에
- **Backlinks** — 현재 페이지를 참조하는 모든 페이지 확인
- **`Cmd+Shift+D`** — 클리핑한 기사의 이미지를 `raw/assets/`로 다운로드
- **Web Clipper** — 브라우저 확장으로 웹 기사를 `raw/`에 마크다운으로 저장
- **Dataview** — frontmatter 기반 동적 테이블 (Community Plugins에서 설치)

## 라이선스

MIT
