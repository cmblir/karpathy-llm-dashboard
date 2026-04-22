---
title: "RLHF 개요"
type: source
created: 2026-04-22
updated: 2026-04-22
sources:
  - test-rlhf-paper.md
tags:
  - rlhf
  - alignment
  - reinforcement-learning
---

# RLHF 개요

`raw/test-rlhf-paper.md` 요약.

## 핵심 내용

[[rlhf|RLHF]](Reinforcement Learning from Human Feedback)는 LLM을 인간 선호도에 맞게 정렬(alignment)하는 기법이다. 세 단계로 구성된다:

1. **[[sft|SFT]]** (Supervised Fine-Tuning) — 지도학습 미세조정
2. **[[reward-model|Reward Model]]** 학습 — 인간 선호를 반영하는 보상 모델
3. **[[ppo|PPO]]** 로 정책 최적화 — 강화학습으로 최종 정렬

## 주요 적용 사례

- [[instructgpt|InstructGPT]] ([[openai|OpenAI]])
- [[chatgpt|ChatGPT]] ([[openai|OpenAI]])
- [[claude-ai|Claude]] ([[anthropic|Anthropic]])

## 한계

- [[reward-hacking|Reward hacking]] — 보상 모델의 허점을 악용
- 인간 평가자 간 불일치 (inter-annotator disagreement)
- 높은 비용

## 기타

[[andrej-karpathy|Andrej Karpathy]]는 RLHF를 LLM 학습 파이프라인의 핵심 구성요소로 설명했다.
