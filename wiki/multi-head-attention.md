---
title: Multi-Head Attention
type: concept
created: 2026-04-22
updated: 2026-04-22
sources:
  - test-attention-mechanism.md
tags:
  - mechanism
  - deep-learning
---

# Multi-Head Attention

[[self-attention|Self-Attention]]을 여러 개의 head로 병렬 실행하는 메커니즘. [[transformer|Transformer]]의 핵심 구성 요소.

## 동작 원리

입력을 서로 다른 선형 변환으로 h개의 head에 투영한 뒤, 각 head에서 독립적으로 attention을 수행하고 결과를 concatenate하여 다시 선형 변환한다.

```
MultiHead(Q, K, V) = Concat(head_1, ..., head_h) × W^O
where head_i = Attention(QW_i^Q, KW_i^K, VW_i^V)
```

## 장점

- 서로 다른 표현 부분공간(subspace)의 정보를 동시에 포착
- 단일 attention head보다 풍부한 표현 학습 가능

[[source-attention-is-all-you-need|Attention Is All You Need]] 원 논문에서는 h=8개의 head를 사용했다.
