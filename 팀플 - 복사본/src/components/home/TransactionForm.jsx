import { useMemo, useState } from 'react';
import GlassCard from '../common/GlassCard.jsx';
import TagChip from '../common/TagChip.jsx';
import { emotionTags, expenseCategoryTags, incomeCategoryTags, situationTags } from '../../constants/tags.js';
import { parseMoney } from '../../utils/money.js';

const categoryIcons = {
  '배달': '🍔',
  '카페': '☕',
  '쇼핑': '🛍',
  '택시': '🚕',
  '편의점': '🏪',
  '간식': '🍪',
  '구독': '◌',
  '월급': '₩',
  '용돈': '＋',
  '상여': '★',
  '이자': '%',
  '기타': '•'
};

function makeCustomTag(name, type) {
  return {
    tagId: `custom-${type}-${Date.now()}-${name}`,
    name,
    type,
    color: type === 'SITUATION' ? '#8A6CFF' : '#2FBFA6',
    isDefault: false
  };
}

export default function TransactionForm({ selectedDate = '2026-06-25', onSubmit, compact = false }) {
  const [transactionType, setTransactionType] = useState('EXPENSE');
  const [amount, setAmount] = useState('14,500');
  const [memo, setMemo] = useState('퇴근 후 너무 지쳐서 안전한 메뉴로 주문했다.');
  const [customCategories, setCustomCategories] = useState([]);
  const [customSituations, setCustomSituations] = useState([]);
  const [categoryInputOpen, setCategoryInputOpen] = useState(false);
  const [situationInputOpen, setSituationInputOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newSituationName, setNewSituationName] = useState('');
  const [categoryId, setCategoryId] = useState('c1');
  const [emotionId, setEmotionId] = useState('e1');
  const [situations, setSituations] = useState(['s1']);

  const baseCategoryTags = transactionType === 'EXPENSE' ? expenseCategoryTags : incomeCategoryTags;
  const categoryTags = [...baseCategoryTags, ...customCategories];
  const allSituationTags = [...situationTags, ...customSituations];
  const selectedCategory = categoryTags.find(tag => tag.tagId === categoryId);
  const selectedEmotion = emotionTags.find(tag => tag.tagId === emotionId);
  const selectedSituationTags = allSituationTags.filter(tag => situations.includes(tag.tagId));
  const visibleCategoryTags = activeStep === 'category' ? categoryTags.slice(0, 6) : [selectedCategory].filter(Boolean);
  const visibleEmotionTags = activeStep === 'emotion' ? emotionTags.slice(0, 6) : [selectedEmotion].filter(Boolean);
  const visibleSituationTags = activeStep === 'situation' ? allSituationTags.slice(0, 7) : selectedSituationTags.slice(0, 3);

  const selectedTags = useMemo(() => {
    const tagIds = [categoryId, ...situations];
    if (emotionId) tagIds.push(emotionId);
    return tagIds;
  }, [categoryId, emotionId, situations]);

  function toggleSituation(tagId) {
    setSituations(prev => prev.includes(tagId) ? prev.filter(id => id !== tagId) : [...prev, tagId]);
  }

  function addCategory() {
    const name = newCategoryName.trim();
    if (!name) return;
    const tag = makeCustomTag(name, transactionType === 'EXPENSE' ? 'EXPENSE_CATEGORY' : 'INCOME_CATEGORY');
    setCustomCategories(prev => [...prev, tag]);
    setCategoryId(tag.tagId);
    setNewCategoryName('');
    setCategoryInputOpen(false);
    setActiveStep('emotion');
  }

  function addSituation() {
    const name = newSituationName.trim();
    if (!name) return;
    const tag = makeCustomTag(name, 'SITUATION');
    setCustomSituations(prev => [...prev, tag]);
    setSituations(prev => [...prev, tag.tagId]);
    setNewSituationName('');
    setSituationInputOpen(false);
  }

  function submit() {
    const fallbackTitle = selectedCategory?.name || (transactionType === 'EXPENSE' ? '지출 기록' : '입금 기록');
    onSubmit({
      transactionType,
      title: fallbackTitle,
      amount: parseMoney(amount),
      memo,
      transactionAt: `${selectedDate}T21:40:00`,
      tags: selectedTags
    });
    setAmount('');
    setMemo('');
  }

  return (
    <GlassCard className={`recordCard ${compact ? 'inModal' : ''}`}>
      {!compact && (
        <div className="sectionTitle">
          <span>빠른 기록</span>
          <strong>오늘 나는 어떤 기분으로 썼을까?</strong>
        </div>
      )}

      <div className="recordTopline">
        <button
          type="button"
          className={`typeToggle ${transactionType === 'INCOME' ? 'income' : 'expense'}`}
          onClick={() => setTransactionType(prev => prev === 'EXPENSE' ? 'INCOME' : 'EXPENSE')}
          aria-label="입금 출금 전환"
        >
          {transactionType === 'EXPENSE' ? '출금' : '입금'}
        </button>
        <span>{transactionType === 'EXPENSE' ? '쓴 돈을 감정과 함께 기록해요.' : '들어온 돈은 감정 태그를 선택으로 남겨요.'}</span>
      </div>

      <div className="amountMemoGrid">
        <label>
          금액
          <input value={amount} onChange={event => setAmount(event.target.value)} placeholder="0" />
        </label>
        <label>
          메모
          <input value={memo} onChange={event => setMemo(event.target.value)} placeholder="그 순간의 이유" />
        </label>
      </div>

      <div className={`chipGroup stepGroup ${activeStep === 'category' ? 'open' : 'collapsed'}`}>
        <span>
          분류 태그
          {activeStep !== 'category' && <button type="button" className="editStepButton" onClick={() => setActiveStep('category')}>수정</button>}
          {activeStep === 'category' && <button type="button" className="addChipButton" onClick={() => setCategoryInputOpen(prev => !prev)}>+</button>}
        </span>
        <div>
          {visibleCategoryTags.map(tag => (
            <TagChip
              key={tag.tagId}
              tag={tag}
              icon={categoryIcons[tag.name] || '+'}
              active={categoryId === tag.tagId}
              onClick={() => {
                setCategoryId(tag.tagId);
                setActiveStep('emotion');
              }}
            />
          ))}
          {activeStep === 'category' && categoryTags.length > 6 && <span className="mutedChip">+{categoryTags.length - 6}</span>}
        </div>
        {categoryInputOpen && (
          <div className="inlineTagForm">
            <input value={newCategoryName} onChange={event => setNewCategoryName(event.target.value)} placeholder="나만의 분류" />
            <button type="button" onClick={addCategory}>추가</button>
          </div>
        )}
      </div>

      <div className={`chipGroup stepGroup ${activeStep === 'emotion' ? 'open' : 'collapsed'}`}>
        <span>
          감정 태그 {transactionType === 'INCOME' && <small>선택</small>}
          {activeStep !== 'emotion' && <button type="button" className="editStepButton" onClick={() => setActiveStep('emotion')}>수정</button>}
        </span>
        <div>
          {visibleEmotionTags.map(tag => (
            <TagChip
              key={tag.tagId}
              tag={tag}
              active={emotionId === tag.tagId}
              onClick={() => {
                setEmotionId(emotionId === tag.tagId && transactionType === 'INCOME' ? '' : tag.tagId);
                setActiveStep('situation');
              }}
            />
          ))}
          {activeStep === 'emotion' && emotionTags.length > 6 && <span className="mutedChip">+{emotionTags.length - 6}</span>}
        </div>
      </div>

      <div className={`chipGroup stepGroup ${activeStep === 'situation' ? 'open' : 'collapsed'}`}>
        <span>
          상황 태그
          {activeStep !== 'situation' && <button type="button" className="editStepButton" onClick={() => setActiveStep('situation')}>수정</button>}
          {activeStep === 'situation' && <button type="button" className="addChipButton" onClick={() => setSituationInputOpen(prev => !prev)}>+</button>}
        </span>
        <div>
          {visibleSituationTags.map(tag => (
            <TagChip key={tag.tagId} tag={tag} active={situations.includes(tag.tagId)} onClick={() => toggleSituation(tag.tagId)} />
          ))}
          {activeStep === 'situation' && allSituationTags.length > 7 && <span className="mutedChip">+{allSituationTags.length - 7}</span>}
        </div>
        {situationInputOpen && (
          <div className="inlineTagForm">
            <input value={newSituationName} onChange={event => setNewSituationName(event.target.value)} placeholder="나만의 상황" />
            <button type="button" onClick={addSituation}>추가</button>
          </div>
        )}
      </div>

      <button type="button" className="solidButton" onClick={submit}>저장</button>
    </GlassCard>
  );
}
