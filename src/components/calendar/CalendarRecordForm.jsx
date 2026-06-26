import { useMemo, useState } from 'react';
import { parseMoney } from '../../utils/money.js';

const categories = [
  { id: 'c1', label: '#배달', title: '배달', color: '#5CC8FF' },
  { id: 'c2', label: '#카페', title: '카페', color: '#B08AA8' },
  { id: 'c3', label: '#쇼핑', title: '쇼핑', color: '#A79AC8' },
  { id: 'c5', label: '#편의점', title: '편의점', color: '#6EC8CA' },
  { id: 'c4', label: '#교통', title: '교통', color: '#E5B05C' }
];

const moods = [
  { id: 'e2', label: '#외로움', color: '#6F7DFF' },
  { id: 'e8', label: '#신남', color: '#F35FA8' },
  { id: 'e3', label: '#불안', color: '#F5A623' },
  { id: 'e4', label: '#평온', color: '#2FBFA6' },
  { id: 'e6', label: '#무덤덤', color: '#9EA3BB' }
];

const situations = [
  { id: 's1', label: '#퇴근후', color: '#46D3BC' },
  { id: 's2', label: '#혼자있음', color: '#9EA3BB' },
  { id: 's3', label: '#새벽', color: '#9EA3BB' },
  { id: 's4', label: '#주말', color: '#9EA3BB' },
  { id: 's7', label: '#월급날', color: '#9EA3BB' }
];

function TagButton({ item, onClick }) {
  return (
    <button
      type="button"
      className="calendarFormTag"
      style={{ '--tag-accent': item.color }}
      onClick={onClick}
    >
      <i />
      {item.label}
    </button>
  );
}

function TagRow({ icon, title, caption, items, selected, onSelect }) {
  const visibleItems = items.filter(item => item.id !== selected);

  return (
    <div className="calendarFormTagRow">
      <div className="calendarFormTagTitle">
        <span>{icon}</span>
        <strong>{title}</strong>
        <small>{caption}</small>
      </div>
      <div className="calendarFormTags">
        {visibleItems.map(item => (
          <TagButton key={item.id} item={item} onClick={() => onSelect(item.id)} />
        ))}
      </div>
    </div>
  );
}

export default function CalendarRecordForm({ selectedDate, selectedDay, onClose, onSubmit }) {
  const [type, setType] = useState('EXPENSE');
  const [memo, setMemo] = useState('퇴근 후 너무 지쳐서 안전한 메뉴로 주문했다.');
  const [amount, setAmount] = useState('14,500');
  const [categoryId, setCategoryId] = useState('c1');
  const [moodId, setMoodId] = useState('e2');
  const [situationId, setSituationId] = useState('s1');
  const [activeGroup, setActiveGroup] = useState(null);

  const selectedCategory = useMemo(
    () => categories.find(item => item.id === categoryId) || categories[0],
    [categoryId]
  );
  const selectedMood = useMemo(
    () => moods.find(item => item.id === moodId) || moods[0],
    [moodId]
  );
  const selectedSituation = useMemo(
    () => situations.find(item => item.id === situationId) || situations[0],
    [situationId]
  );
  const groups = useMemo(() => [
    { id: 'category', label: selectedCategory.label, color: selectedCategory.color },
    { id: 'mood', label: selectedMood.label, color: selectedMood.color },
    { id: 'situation', label: selectedSituation.label, color: selectedSituation.color }
  ], [selectedCategory, selectedMood, selectedSituation]);

  const activeGroupConfig = useMemo(() => {
    if (activeGroup === 'category') {
      return {
        icon: '○',
        title: '소비분류',
        caption: '어디에 썼는지 선택해요.',
        items: categories,
        selected: categoryId,
        onSelect: setCategoryId
      };
    }
    if (activeGroup === 'mood') {
      return {
        icon: '○',
        title: '기분',
        caption: '그때의 기분을 골라봐요.',
        items: moods,
        selected: moodId,
        onSelect: setMoodId
      };
    }
    if (activeGroup === 'situation') {
      return {
        icon: '○',
        title: '상황',
        caption: '어떤 상황이었는지 선택해요.',
        items: situations,
        selected: situationId,
        onSelect: setSituationId
      };
    }
    return null;
  }, [activeGroup, categoryId, moodId, situationId]);

  function save() {
    onSubmit({
      transactionType: type,
      title: selectedCategory.title,
      amount: parseMoney(amount),
      memo,
      transactionAt: `${selectedDate}T21:40:00`,
      tags: [categoryId, moodId, situationId]
    });
  }

  return (
    <div className="calendarRecordLayer" role="presentation" onMouseDown={onClose}>
      <section className="calendarRecordModal" role="dialog" aria-modal="true" aria-label={`${selectedDay}일 기록 추가`} onMouseDown={event => event.stopPropagation()}>
        <button type="button" className="calendarRecordClose" onClick={onClose} aria-label="닫기">×</button>
        <header className="calendarRecordHeader">
          <h2>6월 {selectedDay}일 기록 추가</h2>
          <p>기억나는 만큼만 가볍게 남겨볼까요?</p>
        </header>

        <div className="calendarTypeLine">
          <div className="calendarTypeToggle">
            <button type="button" className={type === 'EXPENSE' ? 'active' : ''} onClick={() => setType('EXPENSE')}>출금</button>
            <button type="button" className={type === 'INCOME' ? 'active' : ''} onClick={() => setType('INCOME')}>입금</button>
          </div>
          <span>거래 유형</span>
        </div>

        <div className="calendarRecordInputCard">
          <label className="calendarMemoInput">
            <span>메모</span>
            <input value={memo} onChange={event => setMemo(event.target.value)} />
          </label>
          <label className="calendarAmountInput">
            <span>금액</span>
            <div><b>₩</b><input value={amount} onChange={event => setAmount(event.target.value)} inputMode="numeric" /></div>
          </label>
          <div className="calendarRecordSelectedTags">
            {groups.map(group => (
              <button
                type="button"
                key={group.id}
                className={activeGroup === group.id ? 'active' : ''}
                style={{ '--tag-accent': group.color }}
                onClick={() => setActiveGroup(prev => prev === group.id ? null : group.id)}
              >
                <span />
                {group.label}
              </button>
            ))}
            <i />
          </div>
        </div>

        {activeGroupConfig && (
          <div className="calendarFormTagBox">
            <TagRow {...activeGroupConfig} />
          </div>
        )}

        <div className="calendarRecordHint">태그를 더할수록 인사이트가 선명해져요.</div>
        <button type="button" className="calendarRecordSave" onClick={save}>기록 저장하기</button>
      </section>
    </div>
  );
}
