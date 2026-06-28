import { useMemo, useState } from 'react';
import { parseMoney } from '../../utils/money.js';
import { MoodRidge } from './MoodRidge.jsx';

const categoryChips = [
  { tagId: 'c1', label: '#배달', title: '배달', color: '#8EA0C8' },
  { tagId: 'c2', label: '#카페', title: '카페', color: '#B08AA8' },
  { tagId: 'c3', label: '#쇼핑', title: '쇼핑', color: '#A79AC8' },
  { tagId: 'c4', label: '#택시', title: '택시', color: '#E5B05C' },
  { tagId: 'c5', label: '#편의점', title: '편의점', color: '#6EC8CA' }
];

const emotionChips = [
  { tagId: 'e2', label: '#외로움', color: '#6EA0FF' },
  { tagId: 'e8', label: '#신남', color: '#FF7A8C' },
  { tagId: 'e3', label: '#불안', color: '#F7B844' },
  { tagId: 'e4', label: '#평온', color: '#46D3BC' },
  { tagId: 'e5', label: '#화남', color: '#FF6666' },
  { tagId: 'e6', label: '#무덤덤', color: '#9EA3BB' }
];

const situationChips = [
  { tagId: 's1', label: '#야근', color: '#7B8DFF' },
  { tagId: 's2', label: '#혼자 있음', color: '#6EA0FF' },
  { tagId: 's3', label: '#퇴근길', color: '#8A6CFF' },
  { tagId: 's4', label: '#충동소비', color: '#FF6666' }
];

export const monthlyEmotionFlowItems = [
  { label: '외로움', value: '38%', color: '#6EA0FF' },
  { label: '불안', value: '22%', color: '#F7B844' },
  { label: '평온', value: '15%', color: '#46D3BC' },
  { label: '신남', value: '12%', color: '#F35FA8' },
  { label: '화남', value: '8%', color: '#FF6666' },
  { label: '무덤덤', value: '5%', color: '#8A6CFF' }
];

function MoodChip({ label, color, selected = false, onClick }) {
  const Component = onClick ? 'button' : 'span';

  return (
    <Component
      type={onClick ? 'button' : undefined}
      className={`moodChip ${selected ? 'selected' : ''}`}
      style={{ '--chip-accent': color }}
      onClick={onClick}
    >
      {selected && <i />}
      {label}
    </Component>
  );
}

function TagPickerSection({ chips, selectedIds, onSelect }) {
  const visibleChips = chips.filter(chip => !selectedIds.includes(chip.tagId));

  return (
    <div className="tagPickerSection expanded">
      <div className="emotionChipGrid">
        {visibleChips.map(chip => (
          <MoodChip
            key={chip.tagId}
            {...chip}
            selected={false}
            onClick={() => onSelect(chip.tagId)}
          />
        ))}
      </div>
    </div>
  );
}

export function EmotionWaveCard() {
  const ridgeData = monthlyEmotionFlowItems.map(item => ({
    name: item.label,
    value: Number(String(item.value).replace('%', '')) || 0
  }));

  return <MoodRidge data={ridgeData} />;
}
export default function EmotionExpenseCard({ onSubmit }) {
  const [transactionType, setTransactionType] = useState('EXPENSE');
  const [amount, setAmount] = useState('14500');
  const [memo, setMemo] = useState('퇴근 후 너무 지쳐서 안전한 메뉴로 주문했다.');
  const [selectedCategoryId, setSelectedCategoryId] = useState('c1');
  const [selectedEmotionId, setSelectedEmotionId] = useState('e2');
  const [selectedSituationId, setSelectedSituationId] = useState('');
  const [activePicker, setActivePicker] = useState(null);
  const [saveState, setSaveState] = useState('idle');

  const selectedCategory = useMemo(
    () => categoryChips.find(chip => chip.tagId === selectedCategoryId) || categoryChips[0],
    [selectedCategoryId]
  );
  const selectedEmotion = useMemo(
    () => emotionChips.find(chip => chip.tagId === selectedEmotionId) || emotionChips[0],
    [selectedEmotionId]
  );
  const selectedSituation = useMemo(
    () => situationChips.find(chip => chip.tagId === selectedSituationId),
    [selectedSituationId]
  );
  const pickerGroups = useMemo(() => [
    { id: 'category', label: selectedCategory.label, color: selectedCategory.color, selected: true },
    { id: 'emotion', label: selectedEmotion.label, color: selectedEmotion.color, selected: true },
    {
      id: 'situation',
      label: selectedSituation?.label || '#상황',
      color: selectedSituation?.color || '#9EA3BB',
      selected: Boolean(selectedSituation)
    }
  ], [selectedCategory, selectedEmotion, selectedSituation]);

  const activePickerConfig = useMemo(() => {
    if (activePicker === 'category') {
      return { chips: categoryChips, selectedIds: [selectedCategoryId], onSelect: value => { setSelectedCategoryId(value); markEditing(); } };
    }
    if (activePicker === 'emotion') {
      return { chips: emotionChips, selectedIds: [selectedEmotionId], onSelect: value => { setSelectedEmotionId(value); markEditing(); } };
    }
    if (activePicker === 'situation') {
      return {
        chips: situationChips,
        selectedIds: selectedSituationId ? [selectedSituationId] : [],
        onSelect: value => { setSelectedSituationId(value); markEditing(); }
      };
    }
    return null;
  }, [activePicker, selectedCategoryId, selectedEmotionId, selectedSituationId]);
  const isReadyToSave = parseMoney(amount) > 0;

  function markEditing() {
    setSaveState('idle');
  }

  function saveRecord() {
    if (!isReadyToSave || saveState === 'saved') return;
    onSubmit?.({
      transactionType,
      title: selectedCategory.title,
      amount: parseMoney(amount),
      memo: memo.trim() || '감정소비 기록',
      transactionAt: new Date().toISOString(),
      tags: [selectedCategory.tagId, selectedEmotion.tagId, selectedSituationId].filter(Boolean)
    });
    setSaveState('saved');
    window.setTimeout(() => setSaveState('idle'), 1600);
  }

  return (
    <section className="emotionExpenseCard" aria-label="감정 소비 태그 선택">
      <div className="emotionExpenseHeader">
        <div>
          <h2>오늘 쓴 돈, 어떤 기분이었어?</h2>
          <p>소비에 기분 태그를 붙이면, 그 기분 아래로 차곡차곡 쌓여요.</p>
        </div>
        <div className="homeActionCluster">
          <div className="homeTypeToggle" aria-label="거래 유형">
            <button type="button" className={transactionType === 'EXPENSE' ? 'active' : ''} onClick={() => { setTransactionType('EXPENSE'); markEditing(); }}>출금</button>
            <button type="button" className={transactionType === 'INCOME' ? 'active' : ''} onClick={() => { setTransactionType('INCOME'); markEditing(); }}>입금</button>
          </div>
          <button
            type="button"
            className={`expenseSaveButton ${saveState === 'saved' ? 'saved' : ''}`}
            onClick={saveRecord}
            disabled={!isReadyToSave || saveState === 'saved'}
          >
            {saveState === 'saved' ? '저장됨' : '저장'}
          </button>
        </div>
      </div>

      <div className="expensePreviewCard">
        <div className="expensePreviewTop">
          <label className="merchantInput">
            <span>메모</span>
            <input
              value={memo}
              onChange={event => { setMemo(event.target.value); markEditing(); }}
              aria-label="메모"
              placeholder="퇴근 후 너무 지쳐서 안전한 메뉴로 주문했다."
            />
          </label>
          <label className="amountInput">
            <span>금액</span>
            <div className="amountEditable">
              <b aria-hidden="true">₩</b>
              <input
                value={amount}
                onChange={event => { setAmount(event.target.value); markEditing(); }}
                aria-label="금액"
                inputMode="numeric"
                placeholder="14,500"
              />
            </div>
          </label>
        </div>

        <div className="selectedMoodTags">
          <div className="pickerCategoryChips inline" aria-label="태그 카테고리">
            {pickerGroups.map(group => (
              <button
                key={group.id}
                type="button"
                className={`pickerCategoryChip ${activePicker === group.id ? 'active' : ''} ${group.selected ? 'selectedValue' : ''}`}
                style={{ '--chip-accent': group.color }}
                onClick={() => { markEditing(); setActivePicker(prev => prev === group.id ? null : group.id); }}
              >
                {group.selected && <i />}
                {group.label}
              </button>
            ))}
          </div>

        </div>
      </div>

      <div className="tagPickerStack">
        {activePickerConfig && (
          <TagPickerSection
            chips={activePickerConfig.chips}
            selectedIds={activePickerConfig.selectedIds}
            onSelect={activePickerConfig.onSelect}
          />
        )}
      </div>
    </section>
  );
}
