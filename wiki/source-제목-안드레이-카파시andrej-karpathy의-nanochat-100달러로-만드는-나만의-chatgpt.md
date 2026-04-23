---
title: "Andrej Karpathy의 nanochat — 100달러로 만드는 나만의 ChatGPT"
type: source-summary
tags:
  - nanochat
  - karpathy
  - llm-training
  - open-source
created: 2026-04-23
last_updated: 2026-04-23
source_count: 1
confidence: high
status: active
---

# Andrej Karpathy의 nanochat — 100달러로 만드는 나만의 ChatGPT

2025년 10월 13일, 전 OpenAI 창립 멤버이자 전 Tesla AI 디렉터인 [[andrej-karpathy|Andrej Karpathy]]가 GitHub에 '[[nanochat]]'을 공개했다. 이전 프로젝트 [[nanogpt|nanoGPT]]가 사전학습(pretraining)만 다뤘다면, nanochat은 토크나이저 학습부터 사전학습, [[midtraining|중간학습(midtraining)]], 지도학습 미세조정(SFT), 강화학습(RL), 그리고 웹 UI 배포까지 전 과정을 단일 코드베이스에 담은 풀스택 [[llm-training-pipeline|LLM 학습 파이프라인]]이다.

## 핵심 주장

**비용**: NVIDIA 8×H100 GPU 노드(시간당 약 $24)를 4시간 임대하면 총 약 **$100**으로 대화 가능한 ChatGPT 클론을 얻을 수 있다. $1,000(약 41.6시간) 투자 시 MMLU 40점대, ARC-Easy 70점대, GSM8K 20점대 수준에 도달한다.

**규모**: 약 **560M 파라미터**. 학습 시간을 12시간으로 늘리면 GPT-2 CORE 벤치마크 점수를 넘는다. $1,000 수준은 GPT-3 전체 연산량의 약 1/1,000에 해당한다.

**코드베이스**: 약 **8,000줄**. PyTorch/Python이 주를 이루고, 토크나이저는 효율성을 위해 Rust로 구현. 복잡한 모델 팩토리나 설정 객체 없이 읽기 쉽고 포크(fork)하기 쉬운 '강력한 베이스라인' 지향.

## 학습 데이터

- **사전학습**: FineWeb-EDU 데이터셋
- **중간학습(midtraining)**: SmolTalk — 사용자-어시스턴트 대화, 객관식 문제, 도구 사용(tool use) 데이터

## 토크나이저

- 어휘 크기: 65,536 토큰
- 압축률: 약 4.8 문자/토큰
- 구현 언어: Rust

## 추론 엔진

- KV 캐시(KV cache)
- prefill/decode 분리
- Python 인터프리터를 통한 도구 사용(tool use)
- 학습 완료 후 CORE, ARC-E/C, MMLU, GSM8K, HumanEval, ChatCORE 벤치마크 점수를 담은 `report.md` 자동 생성

## 활용 및 한계

Karpathy는 nanochat을 [[llm101n|LLM101n]] 강의의 캡스톤 프로젝트로 활용할 계획이라 밝혔다. 공개 직후 Red Hat OpenShift AI, Apple Silicon, CPU 전용 환경 등 다양한 커뮤니티 실험이 보고되었다.

단, Karpathy는 개인 데이터로 미세조정하는 방식에 신중한 입장을 취하며, 저품질 출력(slop) 위험을 경고했다. 대신 NotebookLM 등을 활용한 RAG(검색 증강 생성) 방식을 권장했다.

---

[^src-제목-안드레이-카파시andrej-karpathy의-nanochat-100달러로-만드는-나만의-chatgpt]: [[source-제목-안드레이-카파시andrej-karpathy의-nanochat-100달러로-만드는-나만의-chatgpt]]
