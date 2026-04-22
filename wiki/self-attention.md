---
title: Self-Attention
type: concept
created: 2026-04-22
updated: 2026-04-22
sources:
  - test-attention-mechanism.md
tags:
  - mechanism
  - deep-learning
---

# Self-Attention

시퀀스 내 각 위치가 같은 시퀀스의 모든 위치에 attend하는 메커니즘. [[transformer|Transformer]] 아키텍처의 핵심 연산이다.

## 동작 원리

Query(Q), Key(K), Value(V) 세 벡터로 구성:

```
Attention(Q, K, V) = softmax(QK^T / √d_k) × V
```

- **Scaled Dot-Product**: QK^T로 유사도를 계산한 뒤 √d_k로 스케일링하여 softmax 적용
- 스케일링 이유: d_k가 클 때 dot product 값이 커져 softmax 그래디언트가 소실되는 것을 방지

## 의의

[[source-attention-is-all-you-need|Attention Is All You Need]] 논문에서 RNN/LSTM 없이 self-attention만으로 시퀀스 모델링이 가능함을 증명. 병렬 처리와 long-range dependency 처리에서 큰 이점을 보였다.

관련: [[multi-head-attention|Multi-Head Attention]]
