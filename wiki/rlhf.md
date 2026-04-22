---
title: RLHF
type: concept
created: 2026-04-22
updated: 2026-04-22
sources:
  - test-rlhf-paper.md
tags:
  - alignment
  - reinforcement-learning
  - training
---

# RLHF (Reinforcement Learning from Human Feedback)

LLM을 인간 선호도에 맞게 정렬하는 강화학습 기법. 현대 LLM 학습 파이프라인의 핵심 구성요소다.

## 파이프라인

1. **[[sft|SFT]]** — 시연 데이터로 지도학습 미세조정
2. **[[reward-model|Reward Model]]** — 인간 비교 데이터로 보상 모델 학습
3. **[[ppo|PPO]]** — 보상 모델을 기준으로 정책 최적화

## 적용 사례

| 모델 | 조직 |
|------|------|
| [[instructgpt|InstructGPT]] | [[openai|OpenAI]] |
| [[chatgpt|ChatGPT]] | [[openai|OpenAI]] |
| [[claude-ai|Claude]] | [[anthropic|Anthropic]] |

## 한계

- **[[reward-hacking|Reward hacking]]** — 보상 모델의 취약점을 악용하여 실제 품질 개선 없이 높은 보상을 받는 현상
- **평가자 불일치** — 인간 어노테이터 간 선호 판단이 일치하지 않는 문제
- **높은 비용** — 인간 피드백 수집과 강화학습 훈련 모두 비용이 큼

## 관련 개념

[[andrej-karpathy|Andrej Karpathy]]는 RLHF를 LLM 학습의 핵심 단계로 설명한다. [[transformer|Transformer]] 기반 모델의 사전학습 이후 적용되는 후처리 단계에 해당한다.
