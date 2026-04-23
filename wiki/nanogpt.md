---
title: "nanoGPT"
type: entity
tags:
  - open-source
  - llm
  - karpathy
  - pretraining
created: 2026-04-23
last_updated: 2026-04-23
source_count: 2
confidence: medium
status: active
---

# nanoGPT

[[andrej-karpathy|Andrej Karpathy]]가 [[nanochat]] 이전에 공개한 교육용 GPT 구현 프로젝트.[^src-제목-안드레이-카파시andrej-karpathy의-nanochat-100달러로-만드는-나만의-chatgpt] **사전학습(pretraining) 단계만**을 다루었다.[^src-제목-안드레이-카파시andrej-karpathy의-nanochat-100달러로-만드는-나만의-chatgpt]

nanochat은 nanoGPT의 후속 프로젝트로, 사전학습 이후의 미세조정·강화학습·배포까지 포함한 [[llm-training-pipeline|전체 LLM 파이프라인]]을 다룬다는 점에서 구분된다.[^src-제목-안드레이-카파시andrej-karpathy의-nanochat-100달러로-만드는-나만의-chatgpt] nanochat의 12시간 학습은 GPT-2 CORE 벤치마크 점수를 초과한다.[^src-제목-안드레이-카파시andrej-karpathy의-nanochat-100달러로-만드는-나만의-chatgpt]

## 계보

nanoGPT·nanochat은 2018년 [[openai|OpenAI]]의 [[gpt-1|GPT-1]]이 도입한 [[transformer-decoder-only|Transformer Decoder-only]] 계열 아키텍처의 교육용 구현이다.[^src-제목-gpt-1-improving-language-understanding-by-generative-pre-training-2018]

---

[^src-제목-안드레이-카파시andrej-karpathy의-nanochat-100달러로-만드는-나만의-chatgpt]: [[source-제목-안드레이-카파시andrej-karpathy의-nanochat-100달러로-만드는-나만의-chatgpt]]

[^src-제목-gpt-1-improving-language-understanding-by-generative-pre-training-2018]: [[source-제목-gpt-1-improving-language-understanding-by-generative-pre-training-2018]]
