---
title: "Feature Expansion Plan — 2026-04-22"
type: plan
created: 2026-04-22
status: in_progress
---

# Feature Expansion Plan

## 목표

1. **완벽한 영/한 이중언어 지원** (i18n + 사용자 토글 + localStorage)
2. **Karpathy가 제공할만한 기능 추가** — LLM Wiki gist의 정신대로 "출력은 마크다운·표·슬라이드·차트·캔버스 등 다양한 형태" 실현

## 작업 큐 (순서대로 소화)

### 1. i18n 시스템
- 언어 토글 버튼 (헤더 우상단)
- 영/한 사전 분리 (모든 UI 문자열)
- localStorage 저장 (새로고침 시 유지)
- HTML `lang` 속성 동적 변경

### 2. Writing Companion (`/api/write`)
- 주제 입력 → Claude가 위키 페이지들을 조합해 에세이/블로그 글 초안 작성
- 모든 주장에 `[^src-*]` citation 자동 삽입
- 출력은 마크다운, 위키에 저장 가능
- 단어 수 지정 가능 (short/medium/long)

### 3. Page Comparison (`/api/compare`)
- 두 페이지 선택 → Claude가 공통점/차이점/시사점 분석
- 결과를 `type: comparison` 페이지로 저장 옵션
- 대시보드에서 2개 페이지 선택 UI

### 4. Spaced Review
- 페이지의 `last_updated` 기준 정렬
- 30일 이상 업데이트 없는 `active` 페이지 리스트
- 각 페이지 옆에 "Refresh with Claude" 버튼 → 새 소스 관점에서 갱신

### 5. Marp Slide Export (`/api/slides`)
- 임의 페이지 or 분석 → Marp 포맷 마크다운 슬라이드
- `raw/assets/` 이미지 자동 삽입
- `.md` 파일로 다운로드

### 6. Smart Search (`/api/search`)
- 위키 전문에 대한 TF-IDF 검색 (의존성 없이 구현)
- 쿼리 → top-k 페이지 + 매칭 스니펫
- 검색창에서 실시간 결과 미리보기

### 7. Related Sources Suggestion (`/api/suggest/sources`)
- 현재 위키 상태 분석 → Claude가 다음에 ingest할만한 소스 검색어 제안
- Reflect와 구분: 이건 "지금 당장 ingest할 것"에 초점
- 각 제안에 예상 커버 영역 (어떤 페이지들을 보강할지)

## 실행 원칙

- 각 작업 완료 시 commit + push
- 기존 기능 회귀 없도록 JS syntax check + API smoke test
- 실패 시 blocked.md에 기록 후 다음 작업으로
- 각 기능마다 "수동 검증 수단" 최소 1개 제공 (curl 한 줄 등)

## 제약

- 자율모드 하드 블록: 프로덕션 DB, force push, 결제 API 실호출 → 해당 없음
- 현재 레포: 로컬 개발 + GitHub 레포 푸시만 수행
- 모든 변경은 revert 가능해야 함 (git 기반)
