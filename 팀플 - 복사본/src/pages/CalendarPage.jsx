import { useMemo, useState } from 'react';
import CalendarRecordForm from '../components/calendar/CalendarRecordForm.jsx';
import GlassCard from '../components/common/GlassCard.jsx';
import { formatMoney } from '../utils/money.js';
import { toDateKey } from '../utils/date.js';

const weekdays = ['일', '월', '화', '수', '목', '금', '토'];

const emotionByDay = {
  1: 'calm',
  2: 'calm',
  3: 'anxious',
  4: 'anger',
  5: 'anger',
  6: 'lonely',
  7: 'lonely',
  8: 'plain',
  9: 'calm',
  10: 'anxious',
  11: 'anxious',
  12: 'anger',
  13: 'anger',
  14: 'lonely',
  15: 'lonely',
  16: 'plain',
  17: 'calm',
  18: 'calm',
  19: 'anger',
  20: 'anger',
  21: 'lonely',
  22: 'anxious',
  23: 'lonely'
};

const legend = [
  ['lonely', '외로움'],
  ['anger', '신남'],
  ['anxious', '불안'],
  ['calm', '평온'],
  ['hot', '화남']
];

function buildDays() {
  return Array.from({ length: 30 }, (_, index) => `2026-06-${String(index + 1).padStart(2, '0')}`);
}

function selectedFallbackRecords(selectedDay) {
  if (selectedDay === 14) {
    return [
      { transactionId: 'f1', title: '배달의민족', memo: '23:14 · 야식', amount: 23000, transactionType: 'EXPENSE' },
      { transactionId: 'f2', title: 'GS25 편의점', memo: '23:48 · 주류', amount: 8400, transactionType: 'EXPENSE' },
      { transactionId: 'f3', title: '왓챠 결제', memo: '00:02 · 구독', amount: 4000, transactionType: 'EXPENSE' }
    ];
  }
  return [];
}

export default function CalendarPage({ state, onAddTransaction }) {
  const [selectedDate, setSelectedDate] = useState('2026-06-14');
  const [isAdding, setIsAdding] = useState(false);
  const days = buildDays();
  const selectedDay = Number(selectedDate.slice(-2));

  const byDate = useMemo(() => {
    return state.transactions.reduce((map, transaction) => {
      const key = toDateKey(transaction.transactionAt);
      const list = map.get(key) || [];
      list.push(transaction);
      map.set(key, list);
      return map;
    }, new Map());
  }, [state.transactions]);

  const rawSelectedRecords = byDate.get(selectedDate)?.length
    ? byDate.get(selectedDate)
    : selectedFallbackRecords(selectedDay);
  const selectedRecords = [...rawSelectedRecords].sort((a, b) => {
    const aTime = a.transactionAt ? new Date(a.transactionAt).getTime() : Number(a.transactionId?.toString().replace(/\D/g, '') || 0);
    const bTime = b.transactionAt ? new Date(b.transactionAt).getTime() : Number(b.transactionId?.toString().replace(/\D/g, '') || 0);
    return bTime - aTime;
  });
  const selectedTotal = selectedRecords.filter(item => item.transactionType !== 'INCOME')
    .reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="calendarMoodPage">
      <div className="calendarHeader">
        <div>
          <h1>2026년 6월</h1>
          <p>평온하게 시작했지만, 셋째 주는 파랗게 가라앉았어요.</p>
        </div>
        <div className="calendarNavButtons">
          <button type="button" aria-label="이전 달">‹</button>
          <button type="button" aria-label="다음 달">›</button>
        </div>
        <div className="emotionLegend">
          {legend.map(([key, label]) => (
            <span key={key}><i className={`legendDot ${key}`} />{label}</span>
          ))}
        </div>
      </div>

      <GlassCard className="moodCalendarCard">
        <div className="moodWeekGrid">
          {weekdays.map(day => <span key={day}>{day}</span>)}
        </div>
        <div className="moodMonthGrid">
          {days.map(dateKey => {
            const day = Number(dateKey.slice(-2));
            const emotion = emotionByDay[day] || 'empty';
            const disabled = day >= 24;
            return (
              <button
                type="button"
                key={dateKey}
                className={`moodDayCell ${emotion} ${selectedDate === dateKey ? 'selected' : ''} ${disabled ? 'disabled' : ''}`}
                onClick={() => setSelectedDate(dateKey)}
              >
                {day}
              </button>
            );
          })}
        </div>
      </GlassCard>

      <GlassCard className="selectedDayPanel">
        <div className="selectedDayHeader">
          <div>
            <span className="panelEyebrow">선택한 날</span>
            <h2>6월 {selectedDay}일 토요일</h2>
          </div>
          <button type="button" className="calendarAddButton" onClick={() => setIsAdding(true)} aria-label="기록 추가">+</button>
        </div>
        <div className="emotionPill"><i />외로움</div>
        <p className="daySummary">이 날의 소비 {selectedRecords.length}건 · 합계 {formatMoney(selectedTotal)}</p>

        <div className="selectedRecordList">
          {selectedRecords.length === 0 ? (
            <div className="calendarEmpty">이 날은 기록이 없어요.</div>
          ) : selectedRecords.map((item, index) => (
            <div className="selectedRecordRow" key={item.transactionId}>
              <span className={`recordIcon c${index + 1}`}>{index === 0 ? '🍟' : index === 1 ? '🏪' : '🎬'}</span>
              <div>
                <strong>{item.title}</strong>
                <small>{item.memo}</small>
              </div>
              <b>{formatMoney(item.amount)}</b>
            </div>
          ))}
        </div>
      </GlassCard>

      {isAdding && (
        <CalendarRecordForm
          selectedDate={selectedDate}
          selectedDay={selectedDay}
          onClose={() => setIsAdding(false)}
          onSubmit={(transaction) => {
            onAddTransaction(transaction);
            setIsAdding(false);
          }}
        />
      )}
    </div>
  );
}
