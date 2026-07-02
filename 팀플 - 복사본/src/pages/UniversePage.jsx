/** @jsxImportSource @emotion/react */
import styled from '@emotion/styled';
import { EmotionBlob } from '../components/common/EmotionBlob.jsx';
import { GlassCard } from '../components/common/GlassCard.jsx';
import { money, percent } from '../utils/format.js';

const Grid = styled.div`
  width: min(100%, 1120px);
  margin: 0 auto;
  display: grid;
  grid-template-columns: .9fr 1.1fr;
  gap: 18px;

  @media (max-width: 900px) { grid-template-columns: 1fr; }
`;

const Orbit = styled(GlassCard)`
  min-height: 520px;
  display: grid;
  place-items: center;
  text-align: center;
`;

export default function UniversePage({ state }) {
  const goal = state.goals[0];
  const pct = percent(goal.current, goal.target);

  return (
    <Grid>
      <Orbit strong>
        <div>
          <EmotionBlob emotion="평온" size={180} />
          <h2>평행우주의 서연</h2>
          <p css={{ color: 'var(--sub)', lineHeight: 1.7 }}>감정소비를 20%만 줄인 세계에서는<br />제주도 여행이 조금 더 가까워져요.</p>
        </div>
      </Orbit>
      <div css={{ display: 'grid', gap: 14 }}>
        <GlassCard><small css={{ color: 'var(--sub)', fontWeight: 800 }}>현재 우주</small><h3>{goal.name} {pct}%</h3><p>{money(goal.current)} / {money(goal.target)}</p></GlassCard>
        <GlassCard><small css={{ color: 'var(--sub)', fontWeight: 800 }}>절약 우주</small><h3>이번 달 +97,000원</h3><p css={{ color: 'var(--sub)' }}>스트레스·외로움 소비를 줄이면 목표 잔액이 더 빠르게 채워져요.</p></GlassCard>
        <GlassCard><small css={{ color: 'var(--sub)', fontWeight: 800 }}>추천 미션</small><h3>퇴근 후 카페 2회 건너뛰기</h3><p css={{ color: 'var(--sub)' }}>말랑이가 지켜보는 작은 실험이에요. 실패해도 기록만 남기면 충분해요.</p></GlassCard>
      </div>
    </Grid>
  );
}

