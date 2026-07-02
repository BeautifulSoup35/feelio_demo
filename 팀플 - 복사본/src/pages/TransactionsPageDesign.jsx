/** @jsxImportSource @emotion/react */
import { useMemo, useState } from 'react';
import styled from '@emotion/styled';
import { GlassCard } from '../components/common/GlassCard.jsx';
import { getEmotion } from '../data/emotions.js';
import { money, signedMoney } from '../utils/format.js';

const Wrap = styled.div`
  width: min(100%, 1120px);
  margin: 0 auto;
`;

const Summary = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  margin-bottom: 18px;

  @media (max-width: 760px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const Toolbar = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  margin: 18px 0 16px;
`;

const ViewTabs = styled.div`
  display: flex;
  padding: 3px;
  border-radius: 12px;
  background: var(--card);
  border: 1px solid var(--line);
`;

const ViewTab = styled.button`
  border: 0;
  border-radius: 9px;
  padding: 7px 15px;
  background: ${({ active }) => active ? 'var(--ink)' : 'transparent'};
  color: ${({ active }) => active ? 'var(--on-ink)' : 'var(--sub)'};
  font-size: 13px;
  font-weight: 900;
  cursor: pointer;
`;

const Search = styled.div`
  flex: 1;
  min-width: 180px;
  position: relative;

  input {
    width: 100%;
    box-sizing: border-box;
    border: 1px solid var(--line);
    border-radius: 12px;
    background: var(--card);
    color: var(--text);
    outline: 0;
    padding: 10px 14px 10px 34px;
    font-size: 13.5px;
    font-family: inherit;
  }

  svg {
    position: absolute;
    left: 12px;
    top: 11px;
  }
`;

const FilterRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 20px;
`;

const Pill = styled.button`
  border: 1px solid ${({ active }) => active ? 'var(--ink)' : 'var(--line)'};
  border-radius: 999px;
  padding: 8px 15px;
  background: ${({ active }) => active ? 'var(--ink)' : 'var(--card)'};
  color: ${({ active }) => active ? 'var(--on-ink)' : 'var(--text)'};
  cursor: pointer;
  font-size: 13px;
  font-weight: 900;
`;

const Group = styled.div`
  margin-top: 22px;
`;

const Row = styled.button`
  width: 100%;
  display: grid;
  grid-template-columns: 42px minmax(0, 1fr) max-content;
  align-items: center;
  gap: 14px;
  border: 0;
  border-bottom: 1px solid var(--line);
  background: transparent;
  padding: 15px 18px;
  text-align: left;
  cursor: pointer;

  &:last-child {
    border-bottom: 0;
  }
`;

const viewTabs = ['일별', '월별', '연간', '감정별'];
const filters = ['전체', '지출', '수입', '카테고리', '감정'];
const emotionSpend = ['스트레스', '외로움', '화남'];

function toDate(item) {
  return new Date(item.date);
}

function groupLabel(item, view) {
  const date = toDate(item);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const weekday = ['일', '월', '화', '수', '목', '금', '토'][date.getDay()];
  if (view === '월별') return `${year}년 ${month}월`;
  if (view === '연간') return `${year}년`;
  if (view === '감정별') return item.emotion || '감정 없음';
  return `${month}월 ${day}일 (${weekday})`;
}

function groupKey(item, view) {
  if (view === '감정별') return item.emotion || '';
  const date = toDate(item);
  if (view === '연간') return String(date.getFullYear());
  if (view === '월별') return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
  return item.date;
}

function signedGroupTotal(items) {
  const total = items.reduce((sum, item) => sum + (item.type === 'income' ? item.amount : -item.amount), 0);
  return `${total >= 0 ? '+' : '-'}${money(Math.abs(total))}`;
}

export default function TransactionsPageDesign({ state, onSelect }) {
  const [view, setView] = useState('일별');
  const [filter, setFilter] = useState('전체');
  const [query, setQuery] = useState('');

  const filtered = state.transactions.filter(item => {
    if (filter === '지출' && item.type !== 'expense') return false;
    if (filter === '수입' && item.type !== 'income') return false;
    if (query.trim()) {
      const haystack = `${item.category} ${item.emotion} ${item.situation} ${item.memo}`.toLowerCase();
      if (!haystack.includes(query.trim().toLowerCase())) return false;
    }
    return true;
  });

  const expense = state.transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const income = state.transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const BUDGET = 1500000;
  const remainingBudget = BUDGET - expense;

  const groups = useMemo(() => {
    const map = filtered.reduce((acc, item) => {
      const label = groupLabel(item, view);
      const key = groupKey(item, view);
      if (!acc[label]) acc[label] = { key, items: [] };
      acc[label].items.push(item);
      return acc;
    }, {});

    return Object.entries(map)
      .sort((a, b) => view === '감정별' ? a[0].localeCompare(b[0], 'ko') : b[1].key.localeCompare(a[1].key))
      .map(([label, group]) => ({
        label,
        items: group.items.sort((a, b) => new Date(b.date) - new Date(a.date))
      }));
  }, [filtered, view]);

  return (
    <Wrap>
      <Summary>
        {[
          ['이번 달 지출', `-${money(expense)}`, 'var(--text)'],
          ['이번 달 수입', `+${money(income)}`, '#3E9578'],
          ['순지출', `+${money(income - expense)}`, 'var(--text)'],
          ['남은 예산', `${remainingBudget >= 0 ? '+' : ''}${money(remainingBudget)}`, remainingBudget >= 0 ? '#6A61C4' : '#FF4757']
        ].map(([label, value, color]) => <GlassCard key={label} padding={18}><small css={{ color: 'var(--sub)', fontWeight: 800 }}>{label}</small><strong css={{ display: 'block', marginTop: 6, fontSize: 20, color }}>{value}</strong></GlassCard>)}
      </Summary>

      <Toolbar>
        <ViewTabs>
          {viewTabs.map(item => <ViewTab key={item} active={view === item} onClick={() => setView(item)}>{item}</ViewTab>)}
        </ViewTabs>
        <Search>
          <input placeholder="메모·카테고리 검색" value={query} onChange={event => setQuery(event.target.value)} />
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--sub)" strokeWidth="2"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
        </Search>
      </Toolbar>

      <FilterRow>{filters.map(item => <Pill key={item} active={filter === item} onClick={() => setFilter(item)}>{item}</Pill>)}</FilterRow>

      {groups.map(group => (
        <Group key={group.label}>
          <div css={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, padding: '0 4px' }}>
            <strong>{group.label}</strong>
            <span css={{ color: 'var(--sub)', fontWeight: 800 }}>{signedGroupTotal(group.items)}</span>
          </div>
          <GlassCard padding={0}>
            {group.items.map(item => {
              const emo = getEmotion(item.emotion);
              return (
                <Row key={item.id} onClick={() => onSelect(item)}>
                  <span css={{ width: 40, height: 40, borderRadius: 12, display: 'grid', placeItems: 'center', background: emo.light }}><i css={{ width: 15, height: 15, borderRadius: '50%', background: emo.color }} /></span>
                  <span css={{ minWidth: 0 }}><strong>{item.category}</strong><small css={{ display: 'block', color: 'var(--sub)', marginTop: 3 }}>{item.emotion} · {item.situation} · {item.memo}</small></span>
                  <b css={{ color: item.type === 'income' ? '#3E9578' : 'var(--text)' }}>{signedMoney(item)}</b>
                </Row>
              );
            })}
          </GlassCard>
        </Group>
      ))}
    </Wrap>
  );
}
