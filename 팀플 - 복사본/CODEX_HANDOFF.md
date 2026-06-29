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
- 로그인 OAuth 제공자 중 Apple을 Naver로 수정했습니다. `LoginPage.jsx`의 provider key/label과 아이콘, `.oauthButton.naver` 스타일을 반영했습니다.
- 온보딩 PC 레이아웃을 좌우 분할 소개형에서 중앙 대형 폼 중심으로 정리하고, 단계 전환 시 가벼운 slide/fade 애니메이션이 적용되도록 CSS를 보정했습니다.
- 홈 화면의 AI 소비 신호와 감정소비 흐름을 같은 월간 감정 태그 데이터에서 파생되도록 통합했습니다.
- `BlobEmptyCard.jsx`, `RidgeEmpty.jsx`를 추가했고, `HomePage.jsx`에서 `totalTags >= 1`이면 `EmotionBlob`, `totalTags >= RIDGE_MIN_TAGS(5)`이면 `MoodRidge`를 보여주도록 분기했습니다.
- `EmotionBlob.jsx`와 `MoodRidge.jsx` 내부 좌표/path/색상/애니메이션은 수정하지 않았습니다.
- 사용자가 `RidgeEmpty`의 흐릿한 봉우리 빈 상태가 보낸 디자인과 다르다고 지적했습니다.
- 임의로 만든 가짜 능선 비주얼을 제거하고, 확정 디자인 코드가 들어오기 전까지는 텍스트 중심의 최소 빈 상태로 정리했습니다.
- 사용자가 `C:\Users\user\Downloads\EmptyStates.jsx`를 제공했고, 지금 과정은 충분한 유저 정보가 없을 때 기본으로 보여줄 디자인이라고 명확히 했습니다.
- 제공된 `EmptyStates.jsx`를 `src/components/home/EmptyStates.jsx`로 추가하고, 데모용 default export만 제거한 뒤 `BlobEmptyCard`, `RidgeEmpty` named export를 홈 화면에 연결했습니다.
- 제공 파일의 빈 상태 SVG/좌표/색/blur/opacity/mixBlendMode/그라데이션/애니메이션 값은 수정하지 않았고, 데모 `<style>`에 있던 `es-*` keyframes만 `src/styles/global.css`로 옮겼습니다.
- 이전에 임의로 만든 `src/components/home/BlobEmptyCard.jsx`, `src/components/home/RidgeEmpty.jsx`는 제거했습니다.
- 사용자가 처음 UI 확인을 위해 캘린더 기록을 모두 비워 디폴트 상태를 먼저 보고 싶다고 요청했습니다.
- `initialTransactions`를 빈 배열로 바꾸고, `useAppStore` 저장 키를 `feelio-app-state-v2-empty-demo`로 변경해 기존 브라우저 localStorage의 샘플 거래가 섞이지 않게 했습니다.
- 캘린더의 날짜별 임시 감정 색과 2026-06-14 fallback 기록을 실제 거래 데이터 기준으로 바꿨습니다. 이제 기록이 없는 날짜는 empty 상태이고, 기록을 추가한 날짜만 감정 태그에 맞춰 색이 들어갑니다.
- 홈의 마음 능선 영역은 `moodRidgeFrame`으로 감싸 실제 능선과 빈 상태가 같은 높이를 유지하도록 했습니다.
- 캘린더 기록 모달은 공통 `Modal`의 폭/높이/패딩/둥근값 기준과 맞도록 CSS를 보정했습니다.
- 사용자가 "말랑이만 추가되어야 하고 뒷배경 카드는 없어야 한다"고 지적했습니다.
- 홈 AI 소비 신호의 데이터 부족 상태는 `BlobEmptyCard` 대신 `BlobEmpty` 본체만 렌더링하도록 바꿨습니다.
- 캘린더 기록 입력은 공통 `Modal`을 사용하도록 연결했고, 내부 `calendarRecordModal`은 투명 컨텐츠 래퍼처럼 보이도록 덮어 기존 Feelio 글래스 모달 질감을 유지했습니다.
- 사용자가 마음 능선 빈 상태와 모달이 검게 막히면 안 되고, 다른 모달처럼 배경이 비치는 투명 글래스여야 한다고 재요청했습니다.
- `RidgeEmpty` 내부 SVG/좌표는 건드리지 않고, 홈의 `.moodRidgeFrame > div`에만 CSS override를 적용해 검은 inline 배경을 투명 글래스 배경으로 덮었습니다.
- `.modalLayer`, `.modalPanel`, `.calendarRecordModal` 투명도/blur를 다시 정리했고, 공통 모달 안쪽의 `.calendarRecordModal`은 완전 투명한 래퍼로 유지되도록 마지막 override를 추가했습니다.
- 사용자가 홈 카드 높이를 맞추고, 디폴트 말랑이도 다른 감정 말랑이와 같은 크기와 클릭 효과를 가져야 한다고 요청했습니다.
- 홈 AI 소비 신호의 `BlobEmpty` 크기를 `150`으로 맞추고, `defaultBlobButton` wrapper를 추가해 hover/focus/active 눌림 효과를 적용했습니다.
- 오른쪽 홈 카드(`homeMetricCard`, `aiSignalCard`, `homeGoalCard`) 높이를 `194px` 기준으로 통일하고, `aiSignalCard`의 말랑이 컬럼도 `150px`로 맞췄습니다.
- 사용자가 홈 화면 좌우 높이 비율이 맞지 않는다고 다시 요청했습니다.
- 데스크톱 홈에서 `.homeMain`과 `.homeAside`가 같은 `--home-content-height`를 쓰도록 맞추고, 오른쪽은 3등분, 왼쪽은 입력 카드 + 220px 능선 카드 비율로 정렬되게 했습니다.
- 사용자가 마음 능선의 감정 색을 말랑이 색과 매칭하고, 말랑이 머리에 멍처럼 보이는 장식을 없애달라고 요청했습니다.
- `MoodRidge.jsx`의 감정별 COLORS를 `EmotionBlob.jsx`의 말랑이 `base` 색상과 맞췄고, 알 수 없는 감정명은 `무덤덤` 색으로 fallback 하도록 했습니다.
- `EmptyStates.jsx`의 빈 상태 팔레트도 말랑이 색 계열로 맞추고, 빈 말랑이 머리 쪽 물음표 장식을 제거했습니다.
- 사용자가 디폴트 말랑이처럼 모든 말랑이의 머리 쪽 멍처럼 보이는 하이라이트를 없애고, 캘린더 날짜 색은 하루마다 가장 많이 태깅된 감정 기준으로 투명하게 보여달라고 요청했습니다.
- `EmotionBlob.jsx`의 SVG radialGradient에서 흰색 하이라이트 stop을 제거해 어두운 배경에서 멍처럼 보이는 부분을 줄였습니다.
- `CalendarPage.jsx`에서 날짜별 기록의 감정 태그를 모두 집계해 가장 많이 나온 감정을 계산하도록 바꾸고, 날짜 셀/선택한 날 패널/감정 pill에 `--day-emotion` CSS 변수로 투명한 감정 배경을 적용했습니다.
- 캘린더의 예전 2026-06-14 fallback 기록 함수와 첫 번째 감정 태그 기준 헬퍼는 제거했습니다.
- 모달 레이어와 패널은 마지막 CSS override에서 더 투명한 글래스모피즘 톤으로 유지되도록 재정리했습니다.
- 사용자가 캘린더 기분 태그 색과 홈 기분 태그 색을 말랑이 8종 기준으로 통일하고, 캘린더 배경은 직전보다 이전 느낌에 가깝게 되돌려달라고 요청했습니다.
- `src/constants/emotions.js`를 추가해 말랑이 기준 8종 감정(`신남`, `설렘`, `뿌듯함`, `스트레스`, `외로움`, `화남`, `평온`, `무덤덤`)과 base 색을 공통 팔레트로 분리했습니다.
- `tags.js`, `EmotionExpenseCard.jsx`, `CalendarRecordForm.jsx`, `CalendarPage.jsx`, `MoodRidge.jsx`, `EmptyStates.jsx`가 이 팔레트를 공유하도록 정리했습니다.
- 기존 `e8 -> 신남` 강제 override는 제거했고, 예전 저장 데이터 호환용 `피곤/불안/분노` alias만 `emotionInsights.js`에 남겼습니다.
- 캘린더 날짜/선택 패널 색은 말랑이 팔레트를 쓰되, 배경 톤은 더 이전처럼 묵직한 `rgba(.09)` 기반 글래스로 되돌렸습니다.
- 사용자가 캘린더 날짜 배경이 여전히 흐린 유리처럼 보이고, 원래처럼 또렷한 컬러 블록 느낌을 원한다고 요청했습니다.
- `.moodDayCell.hasEmotion` 마지막 override를 추가해 날짜 셀 배경을 `--day-emotion` 기반의 선명한 linear-gradient 컬러 블록으로 되돌렸고, empty 셀은 어두운 빈 칸으로 유지했습니다.

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
