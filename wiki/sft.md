---
title: SFT (Supervised Fine-Tuning)
type: concept
created: 2026-04-22
updated: 2026-04-22
sources:
  - test-rlhf-paper.md
tags:
  - training
  - fine-tuning
---

# SFT (Supervised Fine-Tuning)

지도학습 미세조정. 사전학습된 LLM에 시연(demonstration) 데이터를 사용하여 원하는 행동 패턴을 학습시키는 단계.

[[rlhf|RLHF]] 파이프라인의 첫 번째 단계로, [[reward-model|Reward Model]] 학습과 [[ppo|PPO]] 최적화에 앞서 수행된다.
