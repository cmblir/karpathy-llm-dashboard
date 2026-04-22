---
title: qmd
type: entity
created: 2026-04-22
updated: 2026-04-22
sources:
  - karpathy-llm-wiki.md
tags:
  - tool
  - search
---

# qmd

로컬 마크다운 검색 엔진. BM25 + 벡터 하이브리드 검색 + LLM 리랭킹. 전부 온디바이스.

- CLI로 사용 가능 (LLM이 shell out)
- MCP 서버로도 사용 가능 (LLM이 네이티브 도구로 활용)
- 위키 규모가 커지면 index.md만으로 부족할 때 도입

출처: [[source-karpathy-llm-wiki|Karpathy: LLM Wiki]]
