/** @jsxImportSource @emotion/react */
import { useMemo, useState } from 'react';
import styled from '@emotion/styled';
import { GlassCard } from '../components/common/GlassCard.jsx';
import { getEmotion } from '../data/emotions.js';
import { dayKey, money, signedMoney } from '../utils/format.js';

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

const Tools = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 16px;
`;

const Pill = styled.button`
  border: 1px solid ${({ active }) => active ? 'var(--ink)' : 'var(--line)'};
  border-radius: 999px;
  padding: 9px 14px;
  background: ${({ active }) => active ? 'var(--ink)' : 'var(--card)'};
  color: ${({ active }) => active ? 'var(--on-ink)' : 'var(--text)'};
  cursor: pointer;
  font-weight: 800;
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

  &:last-child { border-bottom: 0; }
`;

export default function TransactionsPage({ state, onSelect }) {
  const [filter, setFilter] = useState('전체');
  const filtered = state.transactions.filter(item => {
    if (filter === '지출') return item.type === 'expense';
    if (filter === '수입') return item.type === 'income';
    if (filter === '감정소비') return item.type === 'expense' && ['스트레스', '외로움', '화남'].includes(item.emotion);
    return true;
  });
  const expense = state.transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const income = state.transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const emotional = state.transactions.filter(t => t.type === 'expense' && ['스트레스', '외로움', '화남'].includes(t.emotion)).reduce((s, t) => s + t.amount, 0);
  const groups = useMemo(() => filtered.reduce((map, item) => {
    const key = dayKey(item.date);
    map[key] = [...(map[key] || []), item];
    return map;
  }, {}), [filtered]);

  return (
    <Wrap>
      <Summary>
        {[
          ['이번 달 지출', `-${money(expense)}`, 'var(--text)'],
          ['이번 달 수입', `+${money(income)}`, '#3E9578'],
          ['순지출', `+${money(income - expense)}`, 'var(--text)'],
          ['감정소비', `-${money(emotional)}`, '#7960b8']
        ].map(([label, value, color]) => <GlassCard key={label} padding={18}><small css={{ color: 'var(--sub)', fontWeight: 800 }}>{label}</small><strong css={{ display: 'block', marginTop: 6, fontSize: 20, color }}>{value}</strong></GlassCard>)}
      </Summary>
      <Tools>{['전체', '지출', '수입', '감정소비', '카테고리', '감정'].map(item => <Pill key={item} active={filter === item} onClick={() => setFilter(item)}>{item}</Pill>)}</Tools>
      {Object.entries(groups).map(([date, items]) => (
        <Group key={date}>
          <div css={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, padding: '0 4px' }}><strong>{date}</strong><span css={{ color: 'var(--sub)', fontWeight: 800 }}>{money(items.reduce((s, t) => s + (t.type === 'expense' ? t.amount : 0), 0))}</span></div>
          <GlassCard padding={0}>
            {items.map(item => {
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

