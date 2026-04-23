---
title: "중간학습 (Midtraining)"
type: technique
tags:
  - llm
  - training
  - fine-tuning
  - midtraining
created: 2026-04-23
last_updated: 2026-04-23
source_count: 1
confidence: medium
status: active
---

# 중간학습 (Midtraining)

[[llm-training-pipeline|LLM 학습 파이프라인]]에서 사전학습(pretraining)과 지도학습 미세조정(SFT) 사이에 위치하는 학습 단계.[^src-제목-안드레이-카파시andrej-karpathy의-nanochat-100달러로-만드는-나만의-chatgpt] 사전학습으로 얻은 기초 언어 능력을 대화·추론·도구 사용 등 구체적인 기능에 특화시키는 전환 단계다.

## [[nanochat]]에서의 적용

[[andrej-karpathy|Karpathy]]의 [[nanochat]]에서는 midtraining 단계에서 **SmolTalk** 데이터셋을 사용한다:[^src-제목-안드레이-카파시andrej-karpathy의-nanochat-100달러로-만드는-나만의-chatgpt]

- 사용자-어시스턴트 대화 데이터
- 객관식 문제(MCQ)
- 도구 사용(tool use) 데이터

이를 통해 기초 언어 모델이 지시를 따르고 도구를 활용하는 능력을 갖추게 한 뒤 SFT 단계로 진입한다.

---

[^src-제목-안드레이-카파시andrej-karpathy의-nanochat-100달러로-만드는-나만의-chatgpt]: [[source-제목-안드레이-카파시andrej-karpathy의-nanochat-100달러로-만드는-나만의-chatgpt]]
