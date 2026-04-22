---
title: RAG (Retrieval-Augmented Generation)
type: concept
created: 2026-04-22
updated: 2026-04-22
sources:
  - karpathy-llm-wiki.md
tags:
  - llm-patterns
  - information-retrieval
---

# RAG (Retrieval-Augmented Generation)

문서 컬렉션에서 관련 청크를 검색하고, LLM이 답변을 생성하는 패턴. NotebookLM, ChatGPT 파일 업로드 등 대부분의 시스템이 이 방식.

## 한계 ([[source-karpathy-llm-wiki|Karpathy]] 의 지적)

- 매 질문마다 지식을 **처음부터 재발견** — 축적이 없음
- 5개 문서를 합성해야 하는 질문에서, 매번 관련 조각을 찾아 조립해야 함
- 교차참조, 모순 탐지, 지식 합성이 영속되지 않음

## 대안

→ [[persistent-wiki-pattern]] — 지식을 한 번 컴파일하고 점진적으로 갱신
