import { useMemo, useState } from 'react';
import CalendarRecordForm from '../components/calendar/CalendarRecordForm.jsx';
import GlassCard from '../components/common/GlassCard.jsx';
import { formatMoney } from '../utils/money.js';
import { formatKoreanDateWithWeekday, toDateKey, todayKey } from '../utils/date.js';
import { normalizeBlobEmotion } from '../utils/emotionInsights.js';
import { moodEmotionColors, moodEmotions } from '../constants/emotions.js';

const weekdays = ['일', '월', '화', '수', '목', '금', '토'];

const legend = moodEmotions.map(emotion => ({
  label: emotion.name,
  color: emotion.color
}));

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

function emotionClassName(emotion) {
  return {
    신남: 'anger',
    설렘: 'plain',
    뿌듯함: 'hot',
    스트레스: 'anxious',
    외로움: 'lonely',
    화남: 'hot',
    평온: 'calm',
    무덤덤: 'plain'
  }[emotion] || 'plain';
}

function topEmotionSummary(records = [], tags = []) {
  const emotionTagNames = new Map(
    tags
      .filter(tag => tag.type === 'EMOTION')
      .map(tag => [tag.tagId, tag.name])
  );
  const counts = new Map();

  records.forEach(record => {
    record.tags?.forEach(tagId => {
      const rawEmotion = emotionTagNames.get(tagId);
      if (!rawEmotion) return;
      const emotion = normalizeBlobEmotion(rawEmotion);
      counts.set(emotion, (counts.get(emotion) || 0) + 1);
    });
  });

  const [emotion] = [...counts.entries()].sort((a, b) => b[1] - a[1])[0] || [];

  return emotion
    ? {
      emotion,
      className: emotionClassName(emotion),
      color: moodEmotionColors[emotion] || moodEmotionColors.무덤덤
    }
    : null;
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

  const rawSelectedRecords = byDate.get(selectedDate) || [];
  const selectedRecords = [...rawSelectedRecords].sort((a, b) => {
    const aTime = a.transactionAt ? new Date(a.transactionAt).getTime() : Number(a.transactionId?.toString().replace(/\D/g, '') || 0);
    const bTime = b.transactionAt ? new Date(b.transactionAt).getTime() : Number(b.transactionId?.toString().replace(/\D/g, '') || 0);
    return bTime - aTime;
  });
  const selectedTotal = selectedRecords.filter(item => item.transactionType !== 'INCOME')
    .reduce((sum, item) => sum + item.amount, 0);
  const selectedEmotionSummary = topEmotionSummary(selectedRecords, state.tags);
  const selectedEmotionLabel = selectedEmotionSummary?.emotion || '기록 없음';

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
          {legend.map(item => (
            <span key={item.label}><i className="legendDot" style={{ '--legend-color': item.color }} />{item.label}</span>
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

            const dayRecords = byDate.get(cell.dateKey) || [];
            const dayEmotionSummary = topEmotionSummary(dayRecords, state.tags);
            const emotion = dayEmotionSummary ? dayEmotionSummary.className : 'empty';
            const isToday = cell.dateKey === today;
            return (
              <button
                type="button"
                key={cell.dateKey}
                className={`moodDayCell ${emotion} ${dayEmotionSummary ? 'hasEmotion' : ''} ${selectedDate === cell.dateKey ? 'selected' : ''} ${isToday ? 'today' : ''}`}
                style={dayEmotionSummary ? { '--day-emotion': dayEmotionSummary.color } : undefined}
                onClick={() => { setSelectedDate(cell.dateKey); setActiveRecordId(null); }}
              >
                {cell.day}
              </button>
            );
          })}
        </div>
      </GlassCard>

      <GlassCard
        className="selectedDayPanel"
        style={selectedEmotionSummary ? { '--day-emotion': selectedEmotionSummary.color } : undefined}
      >
        <div className="selectedDayHeader">
          <div>
            <span className="panelEyebrow">선택한 날</span>
            <h2>{selectedDateLabel}</h2>
          </div>
          <button type="button" className="calendarAddButton" onClick={() => setIsAdding(true)} aria-label="기록 추가">+</button>
        </div>
        <div
          className={`emotionPill ${selectedRecords.length ? '' : 'empty'}`}
          style={selectedEmotionSummary ? { '--day-emotion': selectedEmotionSummary.color } : undefined}
        ><i />{selectedEmotionLabel}</div>
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
