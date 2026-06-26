export function formatMoney(value) {
  return `${Number(value || 0).toLocaleString('ko-KR')}원`;
}

export function parseMoney(value) {
  return Number(String(value).replace(/[^0-9]/g, '')) || 0;
}
