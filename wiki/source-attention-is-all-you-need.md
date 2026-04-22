---
title: "Attention Is All You Need — 소스 요약"
type: source
created: 2026-04-22
updated: 2026-04-22
sources:
  - test-attention-mechanism.md
tags:
  - paper
  - transformer
  - attention
---

# Attention Is All You Need

2017년 [[google-brain|Google Brain]] 팀이 발표한 논문. [[transformer|Transformer]] 아키텍처를 최초로 제안했다.

## 핵심 아이디어

기존 시퀀스 모델(RNN, LSTM)의 순차 처리 한계를 벗어나, [[self-attention|Self-Attention]]만으로 시퀀스 전체를 병렬 처리. 인코더-디코더 구조에서 recurrence를 완전히 제거했다.

## Attention 메커니즘

Query, Key, Value 세 벡터로 구성:
- **Scaled Dot-Product Attention**: `softmax(QK^T / √d_k) × V`
- **[[multi-head-attention|Multi-Head Attention]]**: 여러 attention head를 병렬 실행하여 서로 다른 표현 부분공간의 정보를 포착

## 주요 기여

1. RNN 없이 attention만으로 SOTA 달성 (WMT 2014 번역 태스크)
2. 학습 속도 대폭 향상 — 병렬화 가능
3. Long-range dependency 처리 개선

## 영향

- BERT, GPT 시리즈 등 현대 LLM의 기반 아키텍처
- Vision Transformer(ViT)로 CV 영역까지 확장
- [[andrej-karpathy|Andrej Karpathy]]가 minGPT, nanoGPT 등으로 교육용 구현 공개

## 저자

[[ashish-vaswani|Ashish Vaswani]], Noam Shazeer, Niki Parmar, Jakob Uszkoreit, Llion Jones, Aidan N. Gomez, Łukasz Kaiser, Illia Polosukhin
