export function toDateKey(dateLike) {
  return new Date(dateLike).toISOString().slice(0, 10);
}

export function todayKey() {
  return '2026-06-25';
}

export function formatKoreanDate(dateLike) {
  const date = new Date(dateLike);
  return `${date.getMonth() + 1}월 ${date.getDate()}일`;
}
