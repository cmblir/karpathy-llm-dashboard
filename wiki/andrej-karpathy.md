---
title: Andrej Karpathy
type: entity
created: 2026-04-22
updated: 2026-04-22
sources:
  - karpathy-llm-wiki.md
  - test-attention-mechanism.md
  - test-rlhf-paper.md
tags:
  - person
  - ai-researcher
---

# Andrej Karpathy

AI 연구자, 교육자. OpenAI 공동 창립 멤버, 전 Tesla AI Director.

## LLM Wiki 패턴

[[source-karpathy-llm-wiki|LLM Wiki]] 패턴의 저자. RAG의 한계를 지적하고, LLM이 점진적으로 구축·유지하는 **persistent wiki** 패턴을 제안했다.

실제 작업 방식: LLM 에이전트를 한쪽에, [[obsidian|Obsidian]]을 다른 한쪽에 열어두고, LLM이 편집하면 Obsidian에서 실시간으로 결과를 확인한다.

> "Obsidian is the IDE; the LLM is the programmer; the wiki is the codebase."

## RLHF와 LLM 파이프라인

[[source-test-rlhf-paper|RLHF 개요]]에서 언급된 바와 같이, Karpathy는 [[rlhf|RLHF]]를 LLM 학습 파이프라인의 핵심 구성요소로 설명한다. [[openai|OpenAI]] 공동 창립 멤버로서 [[instructgpt|InstructGPT]], [[chatgpt|ChatGPT]] 등 RLHF 적용 모델 개발에 기여했다.

## Transformer 교육용 구현

[[source-attention-is-all-you-need|Attention Is All You Need]] 논문의 [[transformer|Transformer]] 아키텍처를 minGPT, nanoGPT 등으로 구현하여 공개. LLM 내부 동작을 이해하기 위한 교육용 레퍼런스로 널리 활용된다.
