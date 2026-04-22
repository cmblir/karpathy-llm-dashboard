---
title: "Toolbar Categories + Sidebar Fix"
created: 2026-04-22
status: in_progress
---

# 툴바 카테고리화 + 사이드바 버그 수정

## 문제

### 툴바
현재 13개 버튼이 평면 나열 → 밀도 높고 시각적 피로. 기능 그룹이 안 보임.
- 페이지, + 수집, 질문, 검진, 성찰, 작성, 비교, 복습, 검색, 그래프, 이력, 출처, CLAUDE.md, ? 가이드, + 폴더, + 페이지

### 사이드바 버그
좌측 패널 닫기(⟷ 버튼 또는 Cmd/Ctrl+B) → **본문도 함께 사라짐**.
원인 추정: `.app.side-hidden { grid-template-columns: 0 1fr }` 설정과 JS에서 설정한 `--side-w: 280px`가 충돌. 또는 main의 min-width 부재로 grid가 1fr을 0으로 해석.

## 카테고리 설계

```
┌ Work ▾ ─┐  ┌ Analyze ▾ ─┐  ┌ Browse ▾ ─┐  ┌ Create ▾ ─┐  ┌ More ▾ ─┐
│ Ingest  │  │ Lint       │  │ Search    │  │ + Folder  │  │ CLAUDE.md│
│ Query   │  │ Reflect    │  │ Graph     │  │ + Page    │  │ Guide    │
│ Write   │  │ Review     │  │ History   │  └───────────┘  └──────────┘
│ Compare │  │ Provenance │  └───────────┘
└─────────┘  └────────────┘
```

- 5개 드롭다운 → 훨씬 덜 복잡
- 각 카테고리 내 항목은 관련성 높은 것만 (2~4개)
- "페이지" 버튼은 제거 (사이드바 클릭으로 대체)
- 드롭다운: 클릭으로 열고, 외부 클릭/ESC로 닫힘

## 구현 순서

1. 사이드바 버그 수정 (CSS `--side-w: 0` JS에서 명시, 또는 grid-template-columns override 명확히)
2. 드롭다운 컴포넌트 CSS (위치, 애니메이션, 키보드 접근성)
3. HTML 툴바 교체
4. JS 드롭다운 토글 로직
5. 검증 + README 업데이트

## 안전

- 기존 각 기능 함수(showIngest 등)는 그대로 유지 — UI만 재구성
- i18n 유지 (EN/KO 모두)
- 기존 단축키 유지
