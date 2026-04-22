# RLHF 개요

RLHF(Reinforcement Learning from Human Feedback)는 LLM을 인간 선호도에 맞게 정렬하는 기법이다.

## 핵심 단계
1. SFT(Supervised Fine-Tuning)
2. Reward Model 학습
3. PPO로 정책 최적화

## 주요 적용
- InstructGPT (OpenAI)
- ChatGPT
- Claude (Anthropic)

## 한계
- Reward hacking
- 인간 평가자 간 불일치
- 높은 비용

Andrej Karpathy는 RLHF를 LLM 학습 파이프라인의 핵심 구성요소로 설명했다.