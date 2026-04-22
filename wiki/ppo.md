---
title: PPO (Proximal Policy Optimization)
type: concept
created: 2026-04-22
updated: 2026-04-22
sources:
  - test-rlhf-paper.md
tags:
  - reinforcement-learning
  - training
---

# PPO (Proximal Policy Optimization)

근위 정책 최적화. 정책 업데이트 폭을 제한하여 안정적인 학습을 보장하는 강화학습 알고리즘.

[[rlhf|RLHF]] 파이프라인의 세 번째(최종) 단계. [[reward-model|Reward Model]]이 제공하는 보상 신호를 기반으로, [[sft|SFT]]를 거친 모델의 정책을 최적화한다.
