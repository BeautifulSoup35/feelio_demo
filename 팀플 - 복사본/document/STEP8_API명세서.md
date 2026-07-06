# STEP 8. API 명세서

**프로젝트명:** Feelio
**작성일:** 2026-07-06
**작성 기준:** 저장소에 백엔드 코드(Controller·DTO·Service)가 존재하지 않으므로, **현재 코드 기준으로 확인되는 API는 0건**이다. 본 문서는 ① 그 사실을 명시하고, ② 실제 운영 서비스를 전제로, STEP 6~7의 12테이블 구조(마스터 코드 테이블 분리, 상황 N:M, 소셜 계정 분리)와 1:1로 연결되는 API 전체를 **"추가 필요 API" 설계 초안**으로 정리한다.

---

## 1. 현재 상태 (현재 코드 기준)

| 구분 | 내용 |
|---|---|
| 구현된 API | **없음** — 백엔드 프로젝트 미생성 (Spring Boot + MySQL + MyBatis로 구축 예정, 팀 결정) |
| 현재 데이터 처리 | 프론트 로컬 상태 함수(`src/stores/useFeelioStoreDc.js`) + localStorage |
| 본 문서의 성격 | 백엔드 개발 착수 시 기준이 되는 **API 설계 초안**. 전 항목 구현 상태 = "추가 필요 (미구현)" |

### 현재 로컬 함수 → 대체 API 매핑

| 현재 로컬 함수 | 대체할 API | 관련 기능 |
|---|---|---|
| `login(provider)` | POST /api/auth/login | FUNC-001 |
| `logout()` | POST /api/auth/logout | FUNC-002 |
| `updateUser(patch)` | PATCH /api/users/me | FUNC-003 |
| (없음 — 탈퇴) | DELETE /api/users/me | FUNC-004 |
| `completeOnboarding(goal)` | POST /api/goals + PATCH /api/users/me/onboarding | FUNC-005 |
| (없음 — 목표 CRUD) | GET·POST·PUT·DELETE /api/goals | FUNC-006·007 |
| `addTransaction(t)` | POST /api/transactions | FUNC-008 |
| `updateTransaction(id, patch)` | PUT /api/transactions/{id} | FUNC-009 |
| `removeTransaction(id)` | DELETE /api/transactions/{id} | FUNC-010 |
| (로컬 필터링) | GET /api/transactions | FUNC-012~014 |
| (로컬 집계) | GET /api/summary/calendar, /api/summary/emotions | FUNC-015~017 |
| (하드코딩) | GET /api/analysis/monthly, GET /api/universe/simulation | FUNC-018~022 |
| `toggleMode()` / `setAurora()` | PATCH /api/users/me/settings | FUNC-023 |
| `resetData()` | DELETE /api/transactions | FUNC-026 |
| (프론트 상수 `emotions.js` 등) | GET /api/meta (감정·카테고리·상황 마스터) | FUNC-008 (기록 입력 폼) |

## 2. 공통 규격 (초안)

| 항목 | 내용 |
|---|---|
| Base URL | `/api` |
| 인증 | 소셜 로그인 성공 시 서버 발급 **accessToken(JWT) 가정** — Authorization: Bearer {accessToken}. 인증 방식(JWT vs 세션)은 백엔드 착수 시 팀 확정 필요 |
| 데이터 격리 | 인증 주체의 user_id 기준으로만 조회·변경 (REQ-N-005). 클라이언트가 보낸 userId는 신뢰하지 않음 |
| 표기 | JSON camelCase ↔ DB snake_case 매핑 (예: occurredAt ↔ occurred_at) |
| 공통 응답 | `{ "status": 200, "message": "success", "body": { ... } }` |
| 공통 에러 | `{ "status": 4xx/5xx, "message": "에러 설명", "body": null }` |

### 공통 Status Code

| 코드 | 의미 | 대표 상황 |
|---|---|---|
| 200 | 성공 | 조회·수정·삭제 성공 |
| 201 | 생성 성공 | 기록·목표 생성 |
| 400 | 잘못된 요청 | 필수 값 누락(금액·감정·카테고리), 감정 8종 외 값, amount ≤ 0 |
| 401 | 인증 실패 | 토큰 없음·만료 |
| 403 | 권한 없음 | 타인 리소스 접근 |
| 404 | 없음 | 존재하지 않는 기록·목표 ID |
| 500 | 서버 오류 | — |

## 3. API 목록 (전체 — 추가 필요 API)

| Method | URL | 기능 | 인증 | Request 요약 | Response 요약 | 관련 기능 | 구현 상태 |
|---|---|---|---|---|---|---|---|
| POST | /api/auth/login | 소셜 로그인 (토큰 교환) | 불필요 | provider, providerToken | accessToken, 사용자 정보(프로필 이미지 포함) | FUNC-001 | 추가 필요 |
| POST | /api/auth/logout | 로그아웃 | 필요 | — | 성공 여부 | FUNC-002 | 추가 필요 |
| GET | /api/users/me | 내 정보 조회 | 필요 | — | 사용자 정보 | FUNC-003 | 추가 필요 |
| PATCH | /api/users/me | 프로필 수정 | 필요 | nickname | 갱신된 사용자 정보 | FUNC-003 | 추가 필요 |
| DELETE | /api/users/me | 회원탈퇴 | 필요 | — | 성공 여부 | FUNC-004 | 추가 필요 |
| PATCH | /api/users/me/onboarding | 온보딩 완료 처리 | 필요 | — | onboardingDone | FUNC-005 | 추가 필요 |
| PATCH | /api/users/me/settings | 테마 설정 변경 | 필요 | themeMode, auroraTheme | 갱신된 설정 | FUNC-023 | 추가 필요 |
| GET | /api/meta | 감정·카테고리·상황 마스터 조회 | 필요 | — | 마스터 목록(색상·정렬 포함) | FUNC-008 | 추가 필요 |
| GET | /api/transactions | 기록 목록 조회 | 필요 | year, month, day, emotionId, categoryId, query, sort | 기록 목록 | FUNC-012~014 | 추가 필요 |
| POST | /api/transactions | 기록 등록 | 필요 | type, amount, categoryId, emotionId, situationIds[], memo, occurredAt | 생성된 기록 | FUNC-008 | 추가 필요 |
| GET | /api/transactions/{transactionId} | 기록 상세 조회 | 필요 | — | 기록 상세 | FUNC-011 | 추가 필요 |
| PUT | /api/transactions/{transactionId} | 기록 수정 | 필요 | 등록과 동일 필드 | 수정된 기록 | FUNC-009 | 추가 필요 |
| DELETE | /api/transactions/{transactionId} | 기록 삭제 | 필요 | — | 성공 여부 | FUNC-010 | 추가 필요 |
| DELETE | /api/transactions | 전체 기록 초기화 | 필요 | — | 삭제 건수 | FUNC-026 | 추가 필요 |
| GET | /api/goals | 목표 목록 조회 | 필요 | — | 목표 목록(대표 목표 포함) | FUNC-006 | 추가 필요 |
| POST | /api/goals | 목표 생성 | 필요 | name, targetAmount, currentAmount, dueDate, isMain | 생성된 목표 | FUNC-005·007 | 추가 필요 |
| PUT | /api/goals/{goalId} | 목표 수정 | 필요 | 생성과 동일 필드 | 수정된 목표 | FUNC-007 | 추가 필요 |
| DELETE | /api/goals/{goalId} | 목표 삭제 | 필요 | — | 성공 여부 | FUNC-007 | 추가 필요 |
| GET | /api/summary/calendar | 월별 캘린더 요약 (날짜별 대표 감정) | 필요 | year, month | 날짜별 대표 감정·건수 | FUNC-015·016 | 추가 필요 |
| GET | /api/summary/emotions | 월별 감정 분포 (능선·신호) | 필요 | year, month | 감정별 건수·금액 | FUNC-017·018 | 추가 필요 |
| GET | /api/analysis/monthly | 월간 분석 (카테고리·시간대·감정·인사이트) | 필요 | year, month | 분석 집계 + 인사이트 문장 | FUNC-019~021 | 추가 필요 (3순위) |
| GET | /api/universe/simulation | 평행우주 시뮬레이션 | 필요 | goalId(선택) | 두 미래 시나리오 수치·문장 | FUNC-022 | 추가 필요 (3순위) |

> 누수율 관련 API는 제거 확정 정책에 따라 존재하지 않는다. 알림·백업·챌린지 API는 4순위로 본 초안에서 제외 (필요 시 별도 정의).

## 4. API 상세 (핵심 API)

### 4-1. POST /api/auth/login — 소셜 로그인

- 인증: 불필요 | 관련 기능: FUNC-001 | 관련 테이블: `users`

Request Body:

```json
{
  "provider": "GOOGLE",
  "providerToken": "소셜 SDK/OAuth 콜백으로 받은 토큰"
}
```

처리: providerToken 검증 → 제공자에서 프로필(식별자·이메일·닉네임·**프로필 이미지**) 수신 → `(provider, provider_user_id)`로 조회, 없으면 가입 → accessToken 발급.

Response Body (200):

```json
{
  "status": 200,
  "message": "로그인 성공",
  "body": {
    "accessToken": "jwt-access-token",
    "refreshToken": "jwt-refresh-token",
    "user": {
      "userId": 1,
      "nickname": "서연",
      "email": "user@example.com",
      "profileImageUrl": "https://.../photo.jpg",
      "provider": "GOOGLE",
      "onboardingDone": false,
      "themeMode": "LIGHT",
      "auroraTheme": "블루"
    }
  }
}
```

처리 참고: `social_accounts`에서 `(provider, provider_user_id)`로 조회 → 없으면 `users` + `social_accounts` 생성, 이때 `notification_settings` 기본 행과 약관 동의 이력(`terms_agreements`)도 함께 생성. 리프레시 토큰은 해시하여 `refresh_tokens`에 저장.

예외: 400 (지원하지 않는 provider), 401 (providerToken 검증 실패)

### 4-2. GET /api/meta — 마스터 목록 조회

- 인증: 필요 | 관련 기능: FUNC-008(기록 입력 폼) | 관련 테이블: `emotions`, `categories`, `situations`
- 기록 입력·필터 UI가 감정·카테고리·상황 목록과 색상·정렬을 서버에서 받아 렌더링한다 (프론트 하드코딩 대체).

Response Body (200):

```json
{
  "status": 200,
  "message": "success",
  "body": {
    "emotions": [
      { "emotionId": 1, "name": "스트레스", "color": "#5042B3", "sortOrder": 4 }
    ],
    "categories": [
      { "categoryId": 3, "name": "카페", "type": "EXPENSE", "sortOrder": 3 }
    ],
    "situations": [
      { "situationId": 1, "name": "퇴근 후", "sortOrder": 1 }
    ]
  }
}
```

> `is_active=true`인 마스터만 반환. 응답은 캐시 가능(자주 바뀌지 않음).

### 4-3. GET /api/transactions — 기록 목록 조회

- 인증: 필요 | 관련 기능: FUNC-012~014 | 관련 테이블: `transactions` (+ emotions·categories·transaction_situations 조인), 인덱스 `(user_id, occurred_at)`·`(user_id, emotion_id)`

Request Parameter:

| 파라미터 | 필수 | 설명 |
|---|---|---|
| year | Y | 조회 연도 |
| month | N | 조회 월 (없으면 연 전체) |
| day | N | 조회 일 |
| emotionId | N | 감정 필터 (콤마 구분 복수: `4,5`) |
| categoryId | N | 카테고리 필터 (콤마 구분 복수) |
| query | N | 메모·카테고리 검색어 |
| sort | N | date_desc(기본) / date_asc / category_asc / category_desc / amount_desc / amount_asc |

Response Body (200):

```json
{
  "status": 200,
  "message": "success",
  "body": {
    "transactions": [
      {
        "transactionId": 10,
        "type": "EXPENSE",
        "amount": 18600,
        "category": { "categoryId": 3, "name": "카페" },
        "emotion": { "emotionId": 4, "name": "스트레스", "color": "#5042B3" },
        "situations": [
          { "situationId": 1, "name": "퇴근 후" },
          { "situationId": 2, "name": "혼자 있음" }
        ],
        "memo": "달달한 라떼와 케이크",
        "occurredAt": "2026-07-01T21:30:00"
      }
    ],
    "totalIncome": 2600000,
    "totalExpense": 320000
  }
}
```

> 감정·카테고리는 객체로, 상황은 배열로 반환한다 (N:M). 일별/월별/감정별 그룹핑은 프론트에서 수행하고, 서버는 필터·정렬된 평면 목록과 기간 합계를 반환한다.

예외: 400 (year 누락), 401

### 4-4. POST /api/transactions — 기록 등록

- 인증: 필요 | 관련 기능: FUNC-008 | 관련 테이블: `transactions` (+ `transaction_situations`)

Request Body:

```json
{
  "type": "EXPENSE",
  "amount": 18600,
  "categoryId": 3,
  "emotionId": 4,
  "situationIds": [1, 2],
  "memo": "달달한 라떼와 케이크",
  "occurredAt": "2026-07-01T21:30:00"
}
```

검증 (STEP 5 정책 반영): `amount > 0`·`emotionId`·`categoryId`·`occurredAt` 필수. `situationIds`는 **복수 허용, 생략 시 빈 배열**(N:M — situation 미부착). `memo`는 생략 시 **NULL 저장** (기본 문자열 저장 금지). 서버는 기록 저장 후 `situationIds` 각 항목을 `transaction_situations`에 삽입 (단일 트랜잭션).

Response Body (201): 생성된 기록 (transactionId 포함, 4-3과 동일 구조 — emotion·category 객체, situations 배열)

예외: 400 (필수 누락, 존재하지 않는 emotionId·categoryId·situationId, amount ≤ 0), 401

### 4-5. PUT /api/transactions/{transactionId} — 기록 수정

- 인증: 필요 | 관련 기능: FUNC-009 | Request Body: 4-4와 동일 필드
- situationIds 전달 시 기존 조인 행을 교체(전량 삭제 후 재삽입, 단일 트랜잭션)
- 예외: 400, 401, 403 (타인 기록), 404 (기록 없음)

### 4-6. DELETE /api/transactions/{transactionId} — 기록 삭제

- 인증: 필요 | 관련 기능: FUNC-010
- 관련 조인(`transaction_situations`)은 FK CASCADE로 함께 삭제
- Response (200): `{ "deleted": true }` | 예외: 401, 403, 404
- 참고: 삭제 확인은 프론트 다이얼로그에서 수행 (정책 #5)

### 4-7. GET /api/goals · POST /api/goals · PUT /api/goals/{goalId} · DELETE /api/goals/{goalId}

- 인증: 필요 | 관련 기능: FUNC-005~007 | 관련 테이블: `goals`

목표 객체:

```json
{
  "goalId": 1,
  "name": "제주도 여행",
  "targetAmount": 2000000,
  "currentAmount": 0,
  "startDate": "2026-07-06",
  "dueDate": "2026-10-31",
  "isMain": true,
  "status": "ACTIVE"
}
```

- POST: 온보딩 완료 시 `isMain: true`로 생성 (기간 선택값 → startDate + 기간으로 dueDate 계산, STEP 7 보완 #3)
- `isMain: true`로 생성·수정 시 기존 대표 목표는 서버가 트랜잭션으로 해제 (STEP 7 보완 #4)
- 예외: 400 (targetAmount ≤ 0), 401, 403, 404

### 4-8. PATCH /api/users/me/onboarding — 온보딩 완료 처리

- 인증: 필요 | 관련 기능: FUNC-005 | 관련 컬럼: `users.onboarding_done`
- Request Body 없음 → `onboarding_done = true` 설정 (로그아웃과 무관하게 보존 — 정책 #7)
- Response (200): `{ "onboardingDone": true }`

### 4-8. GET /api/summary/calendar — 월별 캘린더 요약

- 인증: 필요 | 관련 기능: FUNC-015·016 | Query: year(Y), month(Y)

Response Body (200):

```json
{
  "status": 200,
  "message": "success",
  "body": [
    {
      "date": "2026-07-01",
      "dominantEmotion": "스트레스",
      "transactionCount": 2,
      "totalExpense": 50600
    }
  ]
}
```

> 대표 감정 동률 규칙: **최근 기록 우선** (STEP 6 보완 #6의 명시 규칙 — 팀 확정 필요 표기)

### 4-9. GET /api/summary/emotions — 월별 감정 분포

- 인증: 필요 | 관련 기능: FUNC-017·018 | Query: year(Y), month(Y)

Response Body (200):

```json
{
  "status": 200,
  "message": "success",
  "body": {
    "emotions": [
      { "emotion": "스트레스", "count": 6, "amount": 140600 },
      { "emotion": "외로움", "count": 4, "amount": 78400 }
    ],
    "prevMonth": [
      { "emotion": "스트레스", "count": 4, "amount": 98000 }
    ]
  }
}
```

> 감정 능선은 8종 전체를 축으로 사용 (정책 #4). prevMonth는 홈 AI 감정 신호의 증감 계산용.

### 4-10. GET /api/analysis/monthly — 월간 분석 (3순위)

- 인증: 필요 | 관련 기능: FUNC-019~021 | Query: year(Y), month(Y)
- Response 구성(초안): 카테고리별 집계(금액·비중·전월 대비), 시간대별 집계(아침/점심/저녁/밤), 감정별 집계, 인사이트 문장 목록(룰 기반 생성 → LLM 확장)
- 상세 스키마는 AI 분석 화면의 실데이터 전환 설계 시 확정 — **확인 필요**

### 4-11. GET /api/universe/simulation — 평행우주 시뮬레이션 (3순위)

- 인증: 필요 | 관련 기능: FUNC-022 | Query: goalId(N — 없으면 대표 목표)
- Response 구성(초안): 현재 우주(월간 감정소비 추정액, 목표 지연 개월), 다른 우주(절감 가능액, 목표 단축), 내레이션 문장 목록
- 계산 로직은 `src/utils/planetScoring.mjs` 활용 여부 포함 설계 시 확정 — **확인 필요**

## 5. 구현 우선순위 (백엔드 착수 시)

| 차수 | API | 근거 |
|---|---|---|
| 1차 | auth/login·logout·토큰 갱신, meta(마스터), users/me(조회·수정·온보딩), transactions CRUD·목록 | 핵심 루프(기록→조회)와 데이터 영구 저장 (REQ-F-034). meta는 기록 입력 폼의 선행 조건 |
| 2차 | goals CRUD, summary/calendar, summary/emotions, users/me/settings, notification_settings | 홈 회고·목표 화면의 실데이터화 |
| 3차 | analysis/monthly, universe/simulation, users/me 탈퇴, transactions 전체 초기화 | 분석 실데이터화(3순위 요구사항) 및 계정 정리 기능 |

> 인증 보조 API: `POST /api/auth/token/refresh`(리프레시 토큰으로 액세스 토큰 재발급)는 1차에 포함. `refresh_tokens` 테이블과 연결된다.

## 6. 확인·확정 필요 항목

| # | 항목 | 내용 |
|---|---|---|
| 1 | 인증 방식 | JWT 가정으로 작성 — 세션 방식과 비교해 팀 확정 필요 |
| 2 | 소셜 토큰 교환 방식 | 프론트 SDK 토큰 전달 vs 서버 리다이렉트 콜백 — OAuth 연동 설계 시 확정 |
| 3 | 대표 감정 동률 규칙 | "최근 기록 우선"으로 초안 명시 — 팀 확정 필요 |
| 4 | 분석·시뮬레이션 응답 스키마 | 실데이터 전환 설계 시 상세 확정 (4-10·4-11) |
| 5 | 4순위 API | 알림·백업·챌린지 API는 본 초안 제외 — 기능 확정 시 별도 정의 |
