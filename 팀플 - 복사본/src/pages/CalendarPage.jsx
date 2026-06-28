import { useMemo, useState } from 'react';
import CalendarRecordForm from '../components/calendar/CalendarRecordForm.jsx';
import GlassCard from '../components/common/GlassCard.jsx';
import { formatMoney } from '../utils/money.js';
import { formatKoreanDateWithWeekday, toDateKey, todayKey } from '../utils/date.js';

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

function monthStart(dateKey) {
  const date = new Date(`${dateKey}T00:00:00`);
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function toMonthKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

function buildMonthCells(monthDate) {
  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const cells = [];

  for (let index = 0; index < firstDay.getDay(); index += 1) {
    cells.push({ key: `blank-start-${index}`, isBlank: true });
  }

  for (let day = 1; day <= lastDay.getDate(); day += 1) {
    const date = new Date(year, month, day);
    cells.push({
      key: toDateKey(date),
      dateKey: toDateKey(date),
      day,
      isBlank: false
    });
  }

  while (cells.length < 42) {
    cells.push({ key: `blank-end-${cells.length}`, isBlank: true });
  }

  return cells;
}

function selectedFallbackRecords(selectedDate) {
  if (selectedDate === '2026-06-14') {
    return [
      { transactionId: 'f1', title: '배달의민족', memo: '23:14 · 야식', amount: 23000, transactionType: 'EXPENSE' },
      { transactionId: 'f2', title: 'GS25 편의점', memo: '23:48 · 주류', amount: 8400, transactionType: 'EXPENSE' },
      { transactionId: 'f3', title: '왓챠 결제', memo: '00:02 · 구독', amount: 4000, transactionType: 'EXPENSE' }
    ];
  }
  return [];
}

export default function CalendarPage({ state, onAddTransaction, onRemoveTransaction }) {
  const today = todayKey();
  const [selectedDate, setSelectedDate] = useState(today);
  const [visibleMonth, setVisibleMonth] = useState(() => monthStart(today));
  const [isAdding, setIsAdding] = useState(false);
  const [activeRecordId, setActiveRecordId] = useState(null);
  const days = useMemo(() => buildMonthCells(visibleMonth), [visibleMonth]);
  const selectedDay = Number(selectedDate.slice(-2));
  const selectedMonthKey = selectedDate.slice(0, 7);
  const visibleMonthKey = toMonthKey(visibleMonth);
  const selectedDateLabel = formatKoreanDateWithWeekday(`${selectedDate}T00:00:00`);

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
    : selectedFallbackRecords(selectedDate);
  const selectedRecords = [...rawSelectedRecords].sort((a, b) => {
    const aTime = a.transactionAt ? new Date(a.transactionAt).getTime() : Number(a.transactionId?.toString().replace(/\D/g, '') || 0);
    const bTime = b.transactionAt ? new Date(b.transactionAt).getTime() : Number(b.transactionId?.toString().replace(/\D/g, '') || 0);
    return bTime - aTime;
  });
  const selectedTotal = selectedRecords.filter(item => item.transactionType !== 'INCOME')
    .reduce((sum, item) => sum + item.amount, 0);

  function moveMonth(offset) {
    setVisibleMonth(prev => {
      const next = new Date(prev.getFullYear(), prev.getMonth() + offset, 1);
      const nextKey = toMonthKey(next);
      if (selectedMonthKey !== nextKey) {
        setSelectedDate(toDateKey(next));
        setActiveRecordId(null);
      }
      return next;
    });
  }

  return (
    <div className="calendarMoodPage">
      <div className="calendarHeader">
        <div>
          <h1>{visibleMonth.getFullYear()}년 {visibleMonth.getMonth() + 1}월</h1>
          <p>{visibleMonthKey === today.slice(0, 7) ? '이번 달 소비와 감정 흐름을 확인해요.' : '선택한 달의 소비와 감정 흐름을 확인해요.'}</p>
        </div>
        <div className="calendarNavButtons">
          <button type="button" aria-label="이전 달" onClick={() => moveMonth(-1)}>‹</button>
          <button type="button" aria-label="다음 달" onClick={() => moveMonth(1)}>›</button>
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
          {days.map(cell => {
            if (cell.isBlank) {
              return <span key={cell.key} className="moodDayCell blank" aria-hidden="true" />;
            }

            const emotion = byDate.has(cell.dateKey) ? 'lonely' : emotionByDay[cell.day] || 'empty';
            const isToday = cell.dateKey === today;
            return (
              <button
                type="button"
                key={cell.dateKey}
                className={`moodDayCell ${emotion} ${selectedDate === cell.dateKey ? 'selected' : ''} ${isToday ? 'today' : ''}`}
                onClick={() => { setSelectedDate(cell.dateKey); setActiveRecordId(null); }}
              >
                {cell.day}
              </button>
            );
          })}
        </div>
      </GlassCard>

      <GlassCard className="selectedDayPanel">
        <div className="selectedDayHeader">
          <div>
            <span className="panelEyebrow">선택한 날</span>
            <h2>{selectedDateLabel}</h2>
          </div>
          <button type="button" className="calendarAddButton" onClick={() => setIsAdding(true)} aria-label="기록 추가">+</button>
        </div>
        <div className="emotionPill"><i />외로움</div>
        <p className="daySummary">이 날의 소비 {selectedRecords.length}건 · 합계 {formatMoney(selectedTotal)}</p>

        <div className="selectedRecordList">
          {selectedRecords.length === 0 ? (
            <div className="calendarEmpty">이 날은 기록이 없어요.</div>
          ) : selectedRecords.map((item, index) => {
            const canDelete = !String(item.transactionId).startsWith('f');
            const isDeleteOpen = activeRecordId === item.transactionId;
            return (
              <div
                className={`selectedRecordRow ${isDeleteOpen ? 'deleteOpen' : ''}`}
                key={item.transactionId}
                role={canDelete ? 'button' : undefined}
                tabIndex={canDelete ? 0 : undefined}
                onClick={canDelete ? () => setActiveRecordId(prev => prev === item.transactionId ? null : item.transactionId) : undefined}
                onKeyDown={canDelete ? event => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    setActiveRecordId(prev => prev === item.transactionId ? null : item.transactionId);
                  }
                } : undefined}
              >
                <span className={`recordIcon c${index + 1}`}>{index === 0 ? '🍟' : index === 1 ? '🏪' : '🎬'}</span>
                <div>
                  <strong>{item.title}</strong>
                  <small>{item.memo}</small>
                </div>
                <b>{formatMoney(item.amount)}</b>
                {canDelete && isDeleteOpen && (
                  <button
                    type="button"
                    className="recordDeleteButton"
                    onClick={(event) => {
                      event.stopPropagation();
                      onRemoveTransaction?.(item.transactionId);
                      setActiveRecordId(null);
                    }}
                    aria-label={`${item.title} 기록 삭제`}
                  >
                    삭제
                  </button>
                )}
              </div>
            );
          })}
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