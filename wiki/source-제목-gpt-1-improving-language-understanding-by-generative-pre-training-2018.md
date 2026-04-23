---
title: "GPT-1: Improving Language Understanding by Generative Pre-Training (2018)"
type: source-summary
tags:
  - gpt
  - openai
  - transformer
  - pretraining
  - nlp-paper
  - 2018
created: 2026-04-23
last_updated: 2026-04-23
source_count: 1
confidence: high
status: active
---

# GPT-1: Improving Language Understanding by Generative Pre-Training (2018)

2018년 [[openai|OpenAI]]가 발표한 첫 번째 GPT 모델 논문의 요약.[^src-제목-gpt-1-improving-language-understanding-by-generative-pre-training-2018] 제1저자는 [[alec-radford|Alec Radford]] 외 공저.[^src-제목-gpt-1-improving-language-understanding-by-generative-pre-training-2018]

## 핵심 주장

**2단계 학습 패러다임**: 대규모 비지도 사전학습(unsupervised pre-training) 후, 소규모 지도 미세조정(supervised fine-tuning)을 수행한다.[^src-제목-gpt-1-improving-language-understanding-by-generative-pre-training-2018] 다음 단어 예측이라는 단순한 언어 모델링 목표(language modeling objective)만으로도 질의응답·함의 추론·분류 등 다양한 NLP 태스크에서 좋은 성능을 낼 수 있음을 처음 증명했다.[^src-제목-gpt-1-improving-language-understanding-by-generative-pre-training-2018]

## 모델 구조

- 12층 [[transformer-decoder-only|Transformer 디코더(Decoder-only)]] 구조[^src-제목-gpt-1-improving-language-understanding-by-generative-pre-training-2018]
- 파라미터 수: 약 **1.17억 개**(117M)[^src-제목-gpt-1-improving-language-understanding-by-generative-pre-training-2018]

## 학습 데이터

- **[[bookcorpus|BookCorpus]]**: 약 7,000권의 책으로 구성된 코퍼스[^src-제목-gpt-1-improving-language-understanding-by-generative-pre-training-2018]

## 학습 목표

- 다음 단어 예측(next-word prediction) 기반의 언어 모델링 목표[^src-제목-gpt-1-improving-language-understanding-by-generative-pre-training-2018]

## 평가된 태스크 유형

- 질의응답(Question Answering)[^src-제목-gpt-1-improving-language-understanding-by-generative-pre-training-2018]
- 함의 추론(Entailment)[^src-제목-gpt-1-improving-language-understanding-by-generative-pre-training-2018]
- 분류(Classification)[^src-제목-gpt-1-improving-language-understanding-by-generative-pre-training-2018]

## 기여 및 영향

- 단순 언어 모델링만으로 태스크 비의존적(task-agnostic)인 표현을 학습할 수 있음을 입증.[^src-제목-gpt-1-improving-language-understanding-by-generative-pre-training-2018]
- 이후 모든 GPT 시리즈(GPT-2, GPT-3, …)의 토대가 되었다.[^src-제목-gpt-1-improving-language-understanding-by-generative-pre-training-2018]
- "사전학습 + 미세조정"이라는 [[pretrain-finetune-paradigm|사전학습-미세조정 패러다임]]을 NLP 주류로 끌어올렸다.

## 한계 (원문 한계)

본 소스는 요약문 형태의 짧은 메모로, 벤치마크 수치·하이퍼파라미터·ablation·비교 모델(ELMo, BERT 등)에 대한 구체적 기술은 포함되지 않았다. 상세 수치는 원 논문을 직접 참조해야 한다.

---

[^src-제목-gpt-1-improving-language-understanding-by-generative-pre-training-2018]: [[source-제목-gpt-1-improving-language-understanding-by-generative-pre-training-2018]]
