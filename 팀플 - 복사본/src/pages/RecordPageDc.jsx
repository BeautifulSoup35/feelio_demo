/** @jsxImportSource @emotion/react */
import { useState } from 'react';
import styled from '@emotion/styled';
import { EmotionBlob } from '../components/common/EmotionBlob.jsx';
import { GlassCard } from '../components/common/GlassCard.jsx';
import { getEmotion } from '../data/emotions.js';

const emotions = ['신남', '설렘', '뿌듯함', '스트레스', '외로움', '화남', '평온', '무덤덤'];
const categories = ['배달', '카페', '교통', '쇼핑', '문화', '건강', '급여', '행복'];
const situations = ['퇴근 후', '혼자 있음', '친구와', '보상', '습관', '이동 중', '아침', '밤'];

const Page = styled.div`
  width: min(100%, 1080px);
  margin: 0 auto;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1.08fr) minmax(340px, .92fr);
  gap: 18px;
  align-items: stretch;

  @media (max-width: 920px) {
    grid-template-columns: 1fr;
  }
`;

const MainPanel = styled(GlassCard)`
  position: relative;
  overflow: hidden;
  min-height: 610px;
  padding: clamp(22px, 3vw, 34px);
`;

const FaintBlob = styled.div`
  position: absolute;
  width: 360px;
  height: 360px;
  right: -110px;
  top: -120px;
  border-radius: 50%;
  background: radial-gradient(circle, ${({ color }) => color}44, transparent 68%);
  filter: blur(24px);
  pointer-events: none;
`;

const TypeTabs = styled.div`
  position: relative;
  width: 220px;
  display: flex;
  padding: 4px;
  border-radius: 14px;
  background: var(--line);
`;

const TypeTab = styled.button`
  flex: 1;
  border: 0;
  border-radius: 12px;
  padding: 11px;
  background: ${({ active }) => active ? 'var(--card-strong)' : 'transparent'};
  color: ${({ active }) => active ? 'var(--text)' : 'var(--sub)'};
  font-weight: 800;
  cursor: pointer;
`;

const AmountBox = styled.label`
  display: flex;
  align-items: center;
  gap: 12px;
  min-height: 92px;
  border-radius: 24px;
  padding: 0 20px;
  background: var(--card);
  border: 1px solid var(--line);
`;

const AmountInput = styled.input`
  flex: 1;
  min-width: 0;
  border: 0;
  outline: 0;
  background: transparent;
  color: var(--text);
  text-align: right;
  font-size: clamp(42px, 7vw, 70px);
  font-weight: 900;
  font-variant-numeric: tabular-nums;
`;

const Divider = styled.div`
  height: 1px;
  background: var(--line);
  margin: clamp(20px, 3vw, 28px) 0;
`;

const BlobGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(78px, 1fr));
  gap: 14px 10px;
  margin-top: 18px;

  @media (max-width: 560px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const BlobChoice = styled.button`
  height: 128px;
  border: 0;
  background: transparent;
  color: ${({ active }) => active ? 'var(--text)' : 'var(--sub)'};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: end;
  gap: 2px;
  font-weight: ${({ active }) => active ? 900 : 700};
  cursor: pointer;
  filter: ${({ dim }) => dim ? 'saturate(.55) opacity(.45)' : 'none'};
`;

const Side = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const SideCard = styled(GlassCard)`
  padding: 22px;
`;

const ChipRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const Chip = styled.button`
  border: 1.5px solid ${({ active, color }) => active ? color : 'var(--line)'};
  border-radius: 999px;
  padding: 10px 16px;
  background: ${({ active, color }) => active ? `${color}26` : 'transparent'};
  color: ${({ active }) => active ? 'var(--text)' : 'var(--sub)'};
  font-weight: 800;
  cursor: pointer;
`;

const SaveButton = styled.button`
  border: 0;
  border-radius: 18px;
  padding: 18px;
  background: ${({ disabled }) => disabled ? 'var(--line)' : 'var(--ink)'};
  color: ${({ disabled }) => disabled ? 'var(--sub)' : 'var(--on-ink)'};
  font-size: 15px;
  font-weight: 900;
  cursor: ${({ disabled }) => disabled ? 'default' : 'pointer'};
`;

export default function RecordPageDc({ actions }) {
  const [form, setForm] = useState({
    type: 'expense',
    amount: '',
    category: null,
    emotion: null,
    situation: [],
    memo: '',
    date: '2026-07-01T21:30'
  });
  const selected = getEmotion(form.emotion || '스트레스');
  const canSave = form.amount && form.emotion && form.category;

  const setField = (key, value) => setForm(prev => ({ ...prev, [key]: value }));
  const toggleSituation = (value) => setForm(prev => ({
    ...prev,
    situation: prev.situation.includes(value)
      ? prev.situation.filter(item => item !== value)
      : [...prev.situation, value]
  }));

  const save = () => {
    if (!canSave) return;
    actions.addTransaction({
      type: form.type,
      amount: Number(form.amount),
      category: form.category,
      emotion: form.emotion,
      situation: form.situation[0] || '기록',
      memo: form.memo || '감정 기록',
      date: form.date
    });
    setForm(prev => ({ ...prev, amount: '', category: null, emotion: null, situation: [], memo: '' }));
  };

  return (
    <Page>
      <Grid>
        <MainPanel strong>
          <FaintBlob color={selected.color} />
          <TypeTabs>
            <TypeTab active={form.type === 'expense'} onClick={() => setField('type', 'expense')}>지출</TypeTab>
            <TypeTab active={form.type === 'income'} onClick={() => setField('type', 'income')}>수입</TypeTab>
          </TypeTabs>

          <div css={{ position: 'relative', marginTop: 'clamp(18px, 3vw, 28px)' }}>
            <div css={{ fontSize: 13, color: 'var(--text)', fontWeight: 900, marginBottom: 11 }}>
              {form.type === 'expense' ? '얼마나 썼어요?' : '얼마가 들어왔어요?'}
            </div>
            <AmountBox>
              <span css={{ fontSize: 26, fontWeight: 900, color: 'var(--sub)' }}>₩</span>
              <AmountInput
                inputMode="numeric"
                placeholder="0"
                value={form.amount ? Number(form.amount).toLocaleString() : ''}
                onChange={event => setField('amount', event.target.value.replace(/\D/g, ''))}
              />
              <span css={{ fontSize: 20, fontWeight: 900, color: 'var(--sub)' }}>원</span>
            </AmountBox>
            <div css={{ fontSize: 12, color: 'var(--sub)', marginTop: 9 }}>숫자만 입력하면 돼요</div>
          </div>

          <Divider />

          <section css={{ position: 'relative' }}>
            <div css={{ fontSize: 15, fontWeight: 900 }}>
              이 소비, 어떤 기분이었어요?
              {form.emotion && <span css={{ color: selected.color }}> · {form.emotion}</span>}
            </div>
            <BlobGrid>
              {emotions.map(name => {
                const active = form.emotion === name;
                return (
                  <BlobChoice key={name} active={active} dim={form.emotion && !active} onClick={() => setField('emotion', active ? null : name)}>
                    <EmotionBlob emotion={name} size={active ? 122 : 92} interactive={false} />
                    <span>{name}</span>
                  </BlobChoice>
                );
              })}
            </BlobGrid>
          </section>
        </MainPanel>

        <Side>
          <SideCard>
            <h3 css={{ margin: '0 0 13px', fontSize: 13 }}>어디에 썼어요 <span css={{ color: 'var(--sub)', fontWeight: 600 }}>· 필수</span></h3>
            <ChipRow>{categories.map(item => <Chip key={item} color={selected.color} active={form.category === item} onClick={() => setField('category', item)}>{item}</Chip>)}</ChipRow>
          </SideCard>

          <SideCard css={{ flex: 1 }}>
            <h3 css={{ margin: '0 0 13px', fontSize: 13 }}>어떤 상황이었어요 <span css={{ color: 'var(--sub)', fontWeight: 600 }}>· 선택</span></h3>
            <ChipRow>{situations.map(item => <Chip key={item} color={selected.color} active={form.situation.includes(item)} onClick={() => toggleSituation(item)}>{item}</Chip>)}</ChipRow>
            <textarea
              value={form.memo}
              onChange={event => setField('memo', event.target.value)}
              placeholder="한 줄 메모 - 그 순간, 왜 그 마음이었을까요?"
              css={{ marginTop: 14, minHeight: 76, resize: 'vertical', width: '100%', boxSizing: 'border-box', background: 'var(--card)', border: '1px solid var(--line)', borderRadius: 13, padding: '12px 15px', color: 'var(--text)', outline: 0, fontFamily: 'inherit' }}
            />
            <label css={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 14, paddingTop: 14, borderTop: '1px solid var(--line)', fontSize: 12.5, color: 'var(--sub)' }}>
              <input type="datetime-local" value={form.date} onChange={event => setField('date', event.target.value)} css={{ background: 'transparent', border: 0, color: 'var(--sub)', outline: 0, fontFamily: 'inherit' }} />
              <span css={{ color: selected.color, fontWeight: 900 }}>· 지금</span>
            </label>
          </SideCard>

          <SaveButton disabled={!canSave} onClick={save}>
            {canSave ? '감정 기록 저장하기' : '금액·감정·카테고리를 골라주세요'}
          </SaveButton>
        </Side>
      </Grid>
    </Page>
  );
}
