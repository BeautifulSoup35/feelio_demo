# Codex Handoff

이 파일은 PC를 옮기거나 새 Codex 채팅을 시작했을 때 작업 흐름을 이어가기 위한 인수인계 문서입니다.
새 환경에서 이 저장소를 열면 먼저 이 파일을 읽고, 현재 작업의 맥락과 다음 행동을 파악하세요.

## 사용 방법

1. 새 Codex 채팅을 시작하면 `CODEX_HANDOFF.md`를 먼저 읽어 달라고 요청합니다.
2. 작업을 진행한 뒤, 중요한 결정이나 변경사항이 생기면 이 파일의 `최근 작업 기록`과 `다음에 할 일`을 갱신합니다.
3. 변경사항을 커밋하고 원격 저장소에 올리면 다른 PC에서도 같은 맥락을 이어갈 수 있습니다.

권장 요청 예시:

```text
CODEX_HANDOFF.md를 먼저 읽고, 이전 작업 흐름에 맞춰 이어서 도와줘.
```

## 프로젝트 개요

- 프로젝트명: Feelio
- 형태: Vite + React 앱
- 실행 명령:

```bash
npm install
npm run dev
```

- 주요 코드 위치:
  - `src/App.jsx`
  - `src/components/`
  - `src/pages/`
  - `src/stores/useAppStore.js`
  - `src/styles/global.css`

## 현재 확인된 상태

- 루트에 `package.json`, `vite.config.js`, `index.html`, `src/`, `dist/`가 있습니다.
- `package.json` 기준 스크립트는 `dev`, `build`, `preview`입니다.
- 현재 IDE에서 열려 있던 파일은 `src/components/auth/LoginPage.jsx`입니다.
- 기존 `README_TEAM_SHARE.md`는 한글 인코딩이 깨져 보이는 상태입니다. 필요하면 나중에 UTF-8로 복구하거나 새로 정리하는 편이 좋습니다.

## 최근 작업 기록

### 2026-06-29

- 사용자가 다른 PC에서 작업해도 Codex 대화 흐름이 끊기지 않도록 저장소에 인수인계 파일을 만들고 싶다고 요청했습니다.
- 이에 따라 이 파일 `CODEX_HANDOFF.md`를 생성했습니다.
- 앞으로 중요한 대화 맥락, 구현 결정, 남은 작업은 이 파일에 계속 업데이트하는 방식으로 운영합니다.
- 모바일 앱 화면에서 홈의 감정 소비 입력 카드가 깨지고 금액/태그 영역이 겹치는 문제를 수정했습니다.
- 원인은 모바일 미디어쿼리 뒤에 데스크톱용 `.expensePreviewCard` 2열 규칙이 다시 선언되어 모바일에서도 적용되던 것입니다.
- `src/styles/global.css` 맨 아래에 모바일 레이아웃 가드 미디어쿼리를 추가해 입력 카드는 1열로 고정하고, 금액 입력과 태그 칩이 부모 폭 안에서 줄바꿈되도록 보정했습니다.
- `npm run build`는 통과했습니다. 최초 실행은 `dist/assets` 권한 문제로 실패했지만, 승인 후 같은 명령을 권한 밖에서 재실행해 성공했습니다.
- 현재 React 화면 구조를 기준으로 로그인/홈/캘린더/콘텐츠/프로필/네비게이션 와이어프레임 문서 `WIREFRAME.md`를 생성했습니다.
- `WIREFRAME.md`는 코드 구조를 근거로 한 Markdown 정리본입니다.
- 사용자가 기존 `wireframe.html`이 구조는 맞지만 현재 Feelio 디자인과 다르다고 지적했습니다.
- 이에 따라 `wireframe.html`을 Feelio의 다크 글래스 UI, 오로라 배경, 모바일 앱 프레임, 홈/캘린더/콘텐츠/프로필 카드 톤에 맞춘 시각 와이어프레임으로 재작성했습니다.
- 사용자가 와이어프레임은 유저 플로우에 따라 어디에 어떤 정보를 보여줄지 파악할 수 있어야 한다고 지적했습니다.
- 이에 따라 `wireframe.html`을 다시 플로우 중심 문서로 재작성했습니다. 각 화면은 목표, 화면 내 번호 콜아웃, 보여줄 정보, 사용자 액션, 상태 변화, 다음 흐름을 함께 설명합니다.
- 사용자가 기존 홈/캘린더/콘텐츠 화면은 절대 수정하지 말고 온보딩 화면과 필요한 라우팅만 추가해 달라고 요청했습니다.
- `src/pages/OnboardingPage.jsx`를 새로 추가하고, `src/App.jsx`에서 로그인 후 `feelio_onboarding_completed` localStorage 값이 없으면 온보딩을 먼저 보여주도록 분기했습니다.
- 온보딩 완료 시 `feelio_onboarding`, `feelio_onboarding_completed`를 localStorage에 저장하고 기존 메인 목표를 `actions.updateGoal`로 갱신한 뒤 홈으로 이동합니다.
- 온보딩 전용 스타일은 `src/styles/global.css`에 `onboarding*` 클래스명으로만 추가했습니다. 기존 Home/Calendar/Content 컴포넌트는 수정하지 않았습니다.

## 현재 대화 맥락

- 사용자는 다른 PC에서 했던 Codex/ChatGPT 채팅 기록을 이 세션에서 직접 볼 수 있는지 물었습니다.
- 답변: 현재 세션에서는 다른 PC의 채팅 기록에 자동 접근할 수 없습니다.
- 해결 방향: 채팅 기록 대신 저장소에 인수인계 파일을 두고 Git으로 공유합니다.

## 다음에 할 일

- 실제 기능 작업을 시작하기 전에 현재 요구사항 문서와 앱 구조를 다시 확인합니다.
- `src/components/auth/LoginPage.jsx` 관련 작업을 이어갈 가능성이 높습니다.
- 새 작업을 마치면 이 파일에 아래 항목을 남깁니다.

```text
날짜:
작업한 파일:
무엇을 바꿨는지:
왜 그렇게 했는지:
검증한 내용:
남은 문제:
```

## Codex에게 남기는 작업 규칙

- 사용자의 기존 변경사항을 되돌리지 않습니다.
- 코드 수정 전에는 관련 파일을 먼저 읽고 기존 구조를 따릅니다.
- UI 작업은 `src/styles/global.css`와 기존 컴포넌트 패턴을 우선 참고합니다.
- 작업 후 가능한 경우 `npm run build`로 검증합니다.
- 검증하지 못한 항목은 최종 답변에 명확히 남깁니다.
