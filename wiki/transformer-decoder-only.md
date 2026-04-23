---
title: "Transformer Decoder-only 구조"
type: technique
tags:
  - transformer
  - architecture
  - llm
  - decoder-only
created: 2026-04-23
last_updated: 2026-04-23
source_count: 1
confidence: medium
status: active
---

# Transformer Decoder-only 구조

Transformer 아키텍처에서 디코더(Decoder) 부분만을 사용하는 구성. 인코더-디코더 전체를 쓰지 않고 다음 토큰을 자기회귀(autoregressive)적으로 예측하는 언어 모델에 적합하다.

## 대표 사례

- **[[gpt-1|GPT-1]]** (2018): 12층 Transformer 디코더 구조, 약 1.17억 파라미터.[^src-제목-gpt-1-improving-language-understanding-by-generative-pre-training-2018] 이후 GPT 시리즈 전체가 이 계열을 따른다.[^src-제목-gpt-1-improving-language-understanding-by-generative-pre-training-2018]

## GPT 계열 연속성

2018년 [[gpt-1|GPT-1]]의 12층 디코더-only 구조는 이후 GPT-2, GPT-3 등으로 확장되며 현재 대부분의 대규모 언어 모델이 채택한 표준이 되었다.[^src-제목-gpt-1-improving-language-understanding-by-generative-pre-training-2018] [[nanogpt|nanoGPT]]와 [[nanochat]] 역시 이 계열의 교육용 구현이다.

---

[^src-제목-gpt-1-improving-language-understanding-by-generative-pre-training-2018]: [[source-제목-gpt-1-improving-language-understanding-by-generative-pre-training-2018]]
