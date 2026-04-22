---
title: Reward Model
type: concept
created: 2026-04-22
updated: 2026-04-22
sources:
  - test-rlhf-paper.md
tags:
  - training
  - alignment
---

# Reward Model

인간의 선호 판단을 학습한 모델. 두 개 이상의 응답을 비교하여 어떤 것이 더 나은지 점수를 매긴다.

[[rlhf|RLHF]] 파이프라인의 두 번째 단계. [[sft|SFT]] 이후 인간 비교 데이터로 학습되며, 이후 [[ppo|PPO]]가 이 모델의 보상 신호를 기준으로 정책을 최적화한다.

## 한계

- [[reward-hacking|Reward hacking]] — 정책이 보상 모델의 허점을 악용할 수 있음
- 인간 평가자 간 불일치가 보상 모델 품질에 직접 영향
