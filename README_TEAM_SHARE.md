# Feelio 공유용 안내

이 압축 파일은 현재까지 구현한 Feelio 화면 플로우/목업 작업물입니다.

## 바로 확인하기

정적 빌드 결과는 `dist` 폴더에 있습니다.

로컬 서버로 확인하려면:

```bash
npm install
npm run dev
```

브라우저에서 표시되는 주소로 접속하면 됩니다. 보통 `http://127.0.0.1:5173/` 입니다.

## 포함된 주요 파일

- `src/`: React 컴포넌트와 화면 구현 코드
- `src/components/home/EmotionExpenseCard.jsx`: 현재 작업 중인 감정 기반 소비 기록 카드
- `src/styles/global.css`: 전체 UI 스타일
- `dist/`: 빌드된 정적 결과
- `Feelio_전체화면플로우.html`: 전체 화면 플로우 목업
- `Feelio_1개월_구현계획_요구사항.md`: 구현 계획/요구사항 문서
- `Feelio 목업 (1).html`: 참고 목업 파일

## 참고

`node_modules`는 용량 때문에 제외했습니다. 처음 실행하는 팀원은 `npm install`을 먼저 실행하면 됩니다.
