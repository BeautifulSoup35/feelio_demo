export function toDateKey(dateLike = new Date()) {
  const date = dateLike instanceof Date ? dateLike : new Date(dateLike);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function todayKey() {
  return toDateKey(new Date());
}

export function formatKoreanDate(dateLike) {
  const date = dateLike instanceof Date ? dateLike : new Date(dateLike);
  return `${date.getMonth() + 1}월 ${date.getDate()}일`;
}

export function formatKoreanDateWithWeekday(dateLike) {
  const date = dateLike instanceof Date ? dateLike : new Date(dateLike);
  const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
  return `${date.getMonth() + 1}월 ${date.getDate()}일 ${weekdays[date.getDay()]}요일`;
}