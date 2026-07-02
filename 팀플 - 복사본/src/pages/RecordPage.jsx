/** @jsxImportSource @emotion/react */
import { useState } from 'react';
import styled from '@emotion/styled';
import { EmotionBlob } from '../components/common/EmotionBlob.jsx';
import { GlassCard } from '../components/common/GlassCard.jsx';
import { categories, emotions, situations } from '../data/emotions.js';

const Wrap = styled.div`
  width: min(100%, 980px);
  margin: 0 auto;
`;

const Panel = styled(GlassCard)`
  display: grid;
  gap: 24px;
`;

const Toggle = styled.div`
  width: 220px;
  display: flex;
  padding: 4px;
  border-radius: 14px;
  background: var(--line);
`;

const ToggleButton = styled.button`
  flex: 1;
  border: 0;
  border-radius: 12px;
  padding: 11px;
  background: ${({ active }) => active ? 'var(--card-strong)' : 'transparent'};
  color: ${({ active, income }) => active && income ? '#3E9578' : active ? 'var(--text)' : 'var(--sub)'};
  font-weight: 800;
  cursor: pointer;
`;

const Amount = styled.input`
  width: 100%;
  border: 0;
  outline: 0;
  background: transparent;
  text-align: right;
  font-size: clamp(34px, 6vw, 56px);
  font-weight: 900;
  letter-spacing: -.02em;
`;

const EmotionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(82px, 1fr));
  gap: 12px;

  @media (max-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const EmotionButton = styled.button`
  min-height: 130px;
  border: 1px solid ${({ active }) => active ? 'var(--ink)' : 'var(--line)'};
  border-radius: 20px;
  background: ${({ active }) => active ? 'var(--card-strong)' : 'var(--card)'};
  display: grid;
  place-items: center;
  gap: 4px;
  cursor: pointer;
  font-weight: 800;
`;

const ChipRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const Chip = styled.button`
  border: 1px solid ${({ active }) => active ? 'var(--ink)' : 'var(--line)'};
  border-radius: 999px;
  padding: 9px 14px;
  background: ${({ active }) => active ? 'var(--ink)' : 'var(--card)'};
  color: ${({ active }) => active ? 'var(--on-ink)' : 'var(--text)'};
  font-weight: 800;
  cursor: pointer;
`;

export default function RecordPage({ actions }) {
  const [form, setForm] = useState({ type: 'expense', amount: '', category: '식비', emotion: '스트레스', situation: '퇴근 후', memo: '' });

  function setField(key, value) {
    setForm(prev => ({ ...prev, [key]: value }));
  }

  function save() {
    if (!form.amount || !form.emotion) return;
    actions.addTransaction({
      ...form,
      amount: Number(form.amount),
      date: new Date().toISOString()
    });
    setForm(prev => ({ ...prev, amount: '', memo: '' }));
  }

  return (
    <Wrap>
      <Panel strong>
        <div css={{ display: 'flex', justifyContent: 'space-between', gap: 18, flexWrap: 'wrap' }}>
          <Toggle>
            <ToggleButton active={form.type === 'expense'} onClick={() => setField('type', 'expense')}>지출</ToggleButton>
            <ToggleButton income active={form.type === 'income'} onClick={() => setField('type', 'income')}>수입</ToggleButton>
          </Toggle>
          <Amount inputMode="numeric" placeholder="0" value={form.amount} onChange={event => setField('amount', event.target.value.replace(/\D/g, ''))} />
        </div>
        <section>
          <h3>이 소비, 어떤 기분이었어요? <span style={{ color: emotions.find(e => e.name === form.emotion)?.color }}>{form.emotion}</span></h3>
          <EmotionGrid>
            {emotions.map(item => (
              <EmotionButton key={item.name} active={form.emotion === item.name} onClick={() => setField('emotion', item.name)}>
                <EmotionBlob emotion={item.name} size={form.emotion === item.name ? 92 : 72} interactive={false} />
                {item.name}
              </EmotionButton>
            ))}
          </EmotionGrid>
        </section>
        <section><h3>카테고리</h3><ChipRow>{categories.map(item => <Chip key={item} active={form.category === item} onClick={() => setField('category', item)}>{item}</Chip>)}</ChipRow></section>
        <section><h3>상황</h3><ChipRow>{situations.map(item => <Chip key={item} active={form.situation === item} onClick={() => setField('situation', item)}>{item}</Chip>)}</ChipRow></section>
        <textarea placeholder="짧은 메모" value={form.memo} onChange={event => setField('memo', event.target.value)} css={{ minHeight: 90, resize: 'vertical', border: '1px solid var(--line)', borderRadius: 16, padding: 14, background: 'var(--card)', outline: 0 }} />
        <button type="button" onClick={save} css={{ border: 0, borderRadius: 16, padding: 16, background: 'var(--ink)', color: 'var(--on-ink)', fontWeight: 900, cursor: 'pointer' }}>기록 저장하기</button>
      </Panel>
    </Wrap>
  );
}

