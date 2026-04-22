---
title: Persistent Wiki Pattern
type: concept
created: 2026-04-22
updated: 2026-04-22
sources:
  - karpathy-llm-wiki.md
tags:
  - knowledge-management
  - llm-patterns
---

# Persistent Wiki Pattern

LLM이 원본 소스로부터 지식을 **한 번 컴파일**하고, 새 소스가 추가될 때마다 **점진적으로 갱신**하는 패턴.

## RAG와의 차이

| | RAG | Persistent Wiki |
|---|---|---|
| 지식 처리 시점 | 질문할 때마다 | 소스 추가 시 한 번 |
| 축적 | 없음 (매번 재발견) | 복리처럼 쌓임 |
| 교차참조 | 없음 | 자동 유지 |
| 모순 탐지 | 없음 | 자동 플래그 |
| 합성 | 매번 새로 | 기존 합성 위에 증분 |

## 핵심 원리

> "Knowledge should compound across sessions rather than be re-derived each time."

소스 하나를 ingest하면 10-15개 위키 페이지가 업데이트될 수 있다. 엔티티 페이지, 컨셉 페이지, 요약, 인덱스, 로그 — 모두 한 번에. 이 교차참조 유지보수가 인간이 위키를 포기하는 이유이자, LLM이 잘하는 일이다.

## 구현

- **Schema** (CLAUDE.md, AGENTS.md 등)가 LLM에게 위키 구조와 워크플로를 알려줌
- **[[obsidian]]** 이 뷰어/IDE 역할
- [[ingest]], [[query]], [[lint]] 세 가지 오퍼레이션으로 운영

출처: [[source-karpathy-llm-wiki|Karpathy: LLM Wiki]]
