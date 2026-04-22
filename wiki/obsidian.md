---
title: Obsidian
type: entity
created: 2026-04-22
updated: 2026-04-22
sources:
  - karpathy-llm-wiki.md
tags:
  - tool
  - knowledge-management
---

# Obsidian

로컬 마크다운 기반 노트 앱. [[persistent-wiki-pattern]]에서 **위키 뷰어 겸 IDE** 역할.

## LLM Wiki에서의 역할

- **그래프 뷰** — 위키의 형태를 한눈에. 허브, 고아 페이지, 클러스터 확인
- **백링크** — 어떤 페이지가 현재 페이지를 참조하는지 자동 표시
- **실시간 반영** — LLM이 파일을 수정하면 Obsidian에서 즉시 확인

## 유용한 플러그인/도구

- **Web Clipper** — 브라우저에서 웹 기사를 마크다운으로 클리핑
- **[[dataview]]** — 페이지 frontmatter에 대해 쿼리 실행 (동적 테이블)
- **Marp** — 마크다운 기반 슬라이드 덱
- `Cmd+Shift+D` — 첨부된 이미지 로컬 다운로드 (`raw/assets/`로)

출처: [[source-karpathy-llm-wiki|Karpathy: LLM Wiki]]
