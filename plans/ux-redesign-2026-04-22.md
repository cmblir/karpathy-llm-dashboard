---
title: "UX Redesign + Features — 2026-04-22"
type: plan
created: 2026-04-22
status: in_progress
---

# UX Redesign + Features

## 목표

현재 대시보드는 기능은 풍부하지만:
1. 색이 너무 많음 (accent blue, green, orange, purple, cyan, pink) → 산만
2. 인터랙션 피드백 부족 (static 느낌)
3. 사이드바 고정 너비 → 긴 제목 잘림
4. 페이지를 하나씩만 봄 → 연관된 맥락 읽기 어려움
5. Claude 모델 고정

## 작업 큐

### [FEAT-08] Claude 모델 선택
- 서버: `/api/settings` GET/POST (model 필드)
- 서버: `run_claude()`에 `--model` 플래그 전달
- UI: 헤더 좌측에 모델 드롭다운 (Opus 4.7 / Sonnet 4.6 / Haiku 4.5)
- 선택 시 localStorage 저장 + 서버에도 반영

### [FEAT-09] 블랙앤화이트 디자인
- CSS 변수 전면 교체: 색조 → 흑백 계조
- 배경: #0a0a0a, 카드: #141414, 경계: #2a2a2a, 텍스트: #f0f0f0
- 액센트: 순수 흰색 (#fff) + 약간의 미묘한 회색 변화
- 예외: 상태 표시(초록/빨강/주황)는 유지 (가독성)
- 타입 닷 색: 흑백 스케일로 통일 (밝기만 차이)

### [FEAT-10] 인터랙티브 개선
- 모든 버튼: hover scale/translate + 100ms ease transition
- 포커스 링: focus-visible로 접근성 유지
- 페이지 전환: fade-in 애니메이션
- 리스트 아이템: stagger-in 애니메이션
- Toast 알림 시스템 (alert() 대체)
- 로딩 상태: 스피너/스켈레톤

### [FEAT-11] 사이드바 리사이즈 & 토글
- 사이드바 우측 경계에 드래그 핸들 (ew-resize)
- 최소/최대 너비 (220px ~ 500px)
- localStorage에 너비 저장
- Cmd/Ctrl + B 단축키로 사이드바 토글 (숨김/표시)

### [FEAT-12] 폴더 스크롤 뷰
- 사이드바에서 폴더 클릭 → 전체 폴더 뷰
- 메인 영역에 해당 폴더의 모든 페이지를 순서대로 렌더
- 각 페이지 사이에 구분선 + 앵커
- 우측에 스크롤 스파이 (현재 읽는 페이지 하이라이트)
- URL hash로 특정 페이지 직접 이동 가능

### [FEAT-13] README 업데이트
- 새 디자인 스크린샷 설명
- 6개 신규 기능 반영
- CLI flag / 설정 섹션 추가

## 실행 원칙

- 각 기능 완료 시 commit + push
- i18n 지원 유지 (영/한 토글 동작)
- 기존 기능 회귀 없도록 JS syntax check
- 자율모드 안전 규칙 준수
