---
title: Reward Hacking
type: concept
created: 2026-04-22
updated: 2026-04-22
sources:
  - test-rlhf-paper.md
tags:
  - alignment
  - failure-mode
---

# Reward Hacking

[[rlhf|RLHF]]의 대표적 한계. 정책 모델이 [[reward-model|Reward Model]]의 취약점을 악용하여, 실제 품질 개선 없이 높은 보상 점수를 받는 현상.

보상 모델은 인간 선호의 근사치일 뿐이므로, 최적화가 과도하면 보상 모델의 프록시 특성이 드러나며 의도하지 않은 행동이 나타난다.
