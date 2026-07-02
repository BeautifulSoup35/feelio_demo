/** @jsxImportSource @emotion/react */
import styled from '@emotion/styled';
import { GlassCard } from '../components/common/GlassCard.jsx';
import { emotions, getEmotion } from '../data/emotions.js';
import { money, percent } from '../utils/format.js';

const Grid = styled.div`
  width: min(100%, 1180px);
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1.1fr .9fr;
  gap: 16px;

  @media (max-width: 900px) { grid-template-columns: 1fr; }
`;

const Hero = styled(GlassCard)`
  grid-column: 1 / -1;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;

  @media (max-width: 760px) { grid-template-columns: repeat(2, 1fr); }
`;

const Bar = styled.div`
  height: 12px;
  border-radius: 999px;
  background: var(--line);
  overflow: hidden;
  span { display: block; height: 100%; width: ${({ value }) => value}%; border-radius: inherit; background: ${({ color }) => color}; }
`;

export default function AnalysisPage({ state }) {
  const expenses = state.transactions.filter(item => item.type === 'expense');
  const total = expenses.reduce((sum, item) => sum + item.amount, 0);
  const emotionTotals = emotions.map(emotion => ({
    ...emotion,
    amount: expenses.filter(item => item.emotion === emotion.name).reduce((sum, item) => sum + item.amount, 0)
  })).filter(item => item.amount > 0).sort((a, b) => b.amount - a.amount);
  const categoryTotals = ['식비', '카페', '쇼핑', '문화'].map(name => ({
    name,
    amount: expenses.filter(item => item.category === name).reduce((sum, item) => sum + item.amount, 0),
    emotion: expenses.find(item => item.category === name)?.emotion || '평온'
  })).filter(item => item.amount > 0);

  return (
    <Grid>
      <Hero strong>
        {[
          ['총 지출', total, '지난달 대비 -2.6%'],
          ['감정소비', emotionTotals.slice(0, 3).reduce((s, i) => s + i.amount, 0), '전체 지출의 38%'],
          ['반복 패턴', 4, '퇴근 후·카페'],
          ['목표 영향', 62, '제주도 여행']
        ].map(([label, value, sub]) => <div key={label}><small css={{ color: 'var(--sub)', fontWeight: 800 }}>{label}</small><strong css={{ display: 'block', marginTop: 7, fontSize: 28 }}>{typeof value === 'number' && value > 1000 ? money(value) : value}</strong><span css={{ color: 'var(--sub)', fontSize: 12 }}>{sub}</span></div>)}
      </Hero>
      <GlassCard>
        <h3>카테고리별 지출</h3>
        <p css={{ color: 'var(--sub)', fontSize: 13 }}>가장 큰 지출은 <b css={{ color: 'var(--text)' }}>식비</b>예요</p>
        <div css={{ display: 'grid', gap: 18, marginTop: 22 }}>
          {categoryTotals.map(item => {
            const emo = getEmotion(item.emotion);
            return <div key={item.name}><div css={{ display: 'flex', justifyContent: 'space-between', marginBottom: 9 }}><strong>{item.name}</strong><b>{money(item.amount)}</b></div><Bar value={percent(item.amount, total)} color={emo.color}><span /></Bar></div>;
          })}
        </div>
      </GlassCard>
      <GlassCard>
        <h3>감정별 지출 지분</h3>
        <div css={{ display: 'flex', height: 32, borderRadius: 999, overflow: 'hidden', margin: '18px 0' }}>
          {emotionTotals.map(item => <span key={item.name} css={{ width: `${percent(item.amount, total)}%`, background: item.color }} />)}
        </div>
        <div css={{ display: 'grid', gap: 14 }}>
          {emotionTotals.map(item => <div key={item.name} css={{ display: 'grid', gridTemplateColumns: '14px 1fr auto 44px', alignItems: 'center', gap: 10 }}><i css={{ width: 12, height: 12, borderRadius: '50%', background: item.color }} /><strong>{item.name}</strong><span css={{ color: 'var(--sub)' }}>{money(item.amount)}</span><b style={{ color: item.color }}>{percent(item.amount, total)}%</b></div>)}
        </div>
      </GlassCard>
      <GlassCard strong css={{ gridColumn: '1 / -1' }}>
        <div css={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 6 }}><b css={{ width: 24, height: 24, borderRadius: 8, background: 'var(--ink)', color: 'var(--on-ink)', display: 'grid', placeItems: 'center', fontSize: 10 }}>AI</b><strong>반복되는 감정소비 패턴</strong></div>
        <p css={{ color: 'var(--sub)' }}>퇴근 후 스트레스가 높을 때 카페와 야식 소비가 반복돼요. 기록 전 10분만 쉬어도 목표 달성 속도가 좋아질 가능성이 있어요.</p>
      </GlassCard>
    </Grid>
  );
}

