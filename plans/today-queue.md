---
title: "Today Queue — 2026-04-22"
type: queue
created: 2026-04-22
---

# Today Queue

## [FEAT-01] i18n 시스템 (영/한)
- 목표: 대시보드 모든 UI 문자열을 EN/KO로 전환 가능, 토글 버튼, localStorage
- 영향 범위: dashboard/index.html
- 완료 기준: 모든 탭/패널이 EN/KO 전환, 새로고침 유지
- 위험도: low

## [FEAT-02] Writing Companion
- 목표: /api/write → Claude가 주제 받아 위키 기반 에세이 생성
- 영향 범위: server.py, index.html
- 완료 기준: 주제 입력 → 초안 출력 → 위키 저장 가능
- 위험도: low

## [FEAT-03] Page Comparison
- 목표: 2개 페이지 선택 → Claude가 비교 분석
- 영향 범위: server.py, index.html
- 완료 기준: 2개 선택 → 분석 결과 → comparison 페이지로 저장
- 위험도: low

## [FEAT-04] Spaced Review
- 목표: 오래된 active 페이지 리스트 + 개별 새로고침
- 영향 범위: server.py, index.html
- 완료 기준: 30일+ 페이지 리스트, Refresh 버튼
- 위험도: low

## [FEAT-05] Marp Slide Export
- 목표: 페이지 → Marp 슬라이드 마크다운 다운로드
- 영향 범위: server.py, index.html
- 완료 기준: 페이지 하나 → 슬라이드 생성 → 다운로드
- 위험도: low

## [FEAT-06] Smart Search (TF-IDF)
- 목표: 사이드바 검색을 TF-IDF 기반으로 업그레이드
- 영향 범위: server.py, index.html
- 완료 기준: 쿼리 → 관련 페이지 랭킹 + 스니펫
- 위험도: low

## [FEAT-07] Related Sources Suggestion
- 목표: 다음 ingest할 소스 검색어 제안
- 영향 범위: server.py, index.html
- 완료 기준: 버튼 → 5개 이상의 구체적 검색어 제안
- 위험도: low
