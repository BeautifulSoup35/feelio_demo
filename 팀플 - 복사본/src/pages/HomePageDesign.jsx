/** @jsxImportSource @emotion/react */
import styled from '@emotion/styled';
import { EmotionBlob } from '../components/common/EmotionBlob.jsx';
import { GlassCard } from '../components/common/GlassCard.jsx';
import { getEmotion } from '../data/emotions.js';
import { dayKey, money, percent } from '../utils/format.js';

const Grid = styled.div`
  width: min(100%, 1420px);
  min-height: clamp(680px, calc(100vh - 92px), 820px);
  margin: 0 auto;
  display: grid;
  grid-template-columns: minmax(0, 1.08fr) minmax(380px, .92fr);
  gap: clamp(18px, 2.1vw, 28px);
  align-items: stretch;

  @media (max-width: 1180px) {
    grid-template-columns: minmax(0, 1fr) minmax(360px, .82fr);
  }

  @media (max-width: 980px) {
    grid-template-columns: 1fr;
    min-height: auto;
  }
`;

const Left = styled.div`
  min-height: 0;
  display: grid;
  grid-template-rows: minmax(360px, 1fr) clamp(190px, 27vh, 260px);
  gap: clamp(14px, 1.4vw, 18px);
`;

const Stage = styled.div`
  min-height: 0;
  display: grid;
  place-items: center;
  text-align: center;
`;

const BlobHalo = styled.div`
  position: relative;
  width: clamp(330px, 30vw, 430px);
  height: clamp(330px, 30vw, 430px);
  display: grid;
  place-items: center;

  &::before {
    content: "";
    position: absolute;
    inset: 5%;
    border-radius: 50%;
    background: radial-gradient(circle, ${({ color }) => color}, transparent 62%);
    filter: blur(clamp(36px, 3vw, 48px));
    opacity: .56;
  }

  @media (max-width: 980px) {
    width: clamp(260px, 55vw, 360px);
    height: clamp(260px, 55vw, 360px);
  }
`;

const Ridge = styled(GlassCard)`
  min-height: 0;
  overflow: hidden;
  padding: clamp(18px, 1.6vw, 22px) clamp(20px, 1.8vw, 26px) 0;
  border-radius: 26px;
`;

const Right = styled.div`
  min-height: 0;
  display: grid;
  grid-template-rows: auto clamp(108px, 15vh, 136px) 1fr;
  gap: clamp(12px, 1.4vw, 16px);
`;

const Calendar = styled.div`
  width: 100%;
  max-width: clamp(340px, 27vw, 390px);
  padding: 2px 2px 4px;
  justify-self: center;

  @media (max-width: 980px) {
    max-width: min(100%, 420px);
    margin: 0 auto;
  }
`;

const Week = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: clamp(3px, .36vw, 5px);
  margin-bottom: clamp(4px, .6vw, 7px);
  color: var(--sub);
  font-size: clamp(10px, .8vw, 11.5px);
  text-align: center;
`;

const PebbleGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: clamp(3px, .36vw, 5px);
`;

const Pebble = styled.button`
  aspect-ratio: 1;
  min-width: 0;
  border-radius: clamp(17px, 1.45vw, 20px);
  display: flex;
  align-items: center;
  justify-content: center;
  border: ${({ today, dark }) => today ? `1.5px solid rgba(255,255,255,${dark ? '.6' : '.92'})` : '1px solid var(--line)'};
  background: ${({ color, strong, dark }) => {
    if (!color) return 'linear-gradient(150deg, rgba(255,255,255,.26), transparent)';
    const alpha1 = strong ? (dark ? '9C' : 'B4') : (dark ? '60' : '7C');
    const alpha2 = dark ? '12' : '26';
    const highlight = dark ? '.12' : '.34';
    return `radial-gradient(circle at 40% 24%, rgba(255,255,255,${highlight}), transparent 44%), linear-gradient(150deg, ${color}${alpha1}, ${color}${alpha2})`;
  }};
  color: ${({ color, dark }) => color ? (dark ? '#F3F1F8' : '#fff') : 'var(--sub)'};
  font-size: clamp(11px, .9vw, 13px);
  font-weight: ${({ today }) => today ? 800 : 700};
  cursor: ${({ empty }) => empty ? 'default' : 'pointer'};
  backdrop-filter: blur(16px) saturate(1.35);
  -webkit-backdrop-filter: blur(16px) saturate(1.35);
  box-shadow: ${({ today, dark }) => {
    const glow = today ? `, 0 0 0 3px rgba(255,255,255,${dark ? '.16' : '.28'})` : '';
    return dark
      ? `inset 0 1px 1px rgba(255,255,255,.16), inset 0 0 14px rgba(255,255,255,.03), 0 8px 20px -16px rgba(0,0,0,.55)${glow}`
      : `inset 0 1px 1.5px rgba(255,255,255,.5), inset 0 -8px 20px rgba(70,55,44,.045), 0 12px 26px -22px rgba(70,55,44,.36)${glow}`;
  }};
`;

const Legend = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 4px 12px;
  margin-top: clamp(7px, .8vw, 10px);

  span {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    color: var(--sub);
    font-size: clamp(10.5px, .8vw, 11.5px);
  }

  i {
    width: 8px;
    height: 8px;
    border-radius: 50%;
  }
`;

const Signal = styled(GlassCard)`
  width: 100%;
  min-height: 0;
  padding: clamp(13px, 1.3vw, 17px) clamp(18px, 1.6vw, 22px);
  border-radius: 24px;
`;

const Goal = styled(GlassCard)`
  min-height: 0;
  padding: clamp(16px, 1.6vw, 22px);
  border-radius: 24px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const Bar = styled.div`
  height: 9px;
  border-radius: 999px;
  overflow: hidden;
  background: var(--line);

  span {
    display: block;
    width: ${({ value }) => value}%;
    height: 100%;
    border-radius: inherit;
    background: linear-gradient(90deg, #F2A65E, #F28AB7);
  }
`;

const fixedCalendar = {
  1: '스트레스',
  3: '뿌듯함',
  5: '설렘',
  6: '평온',
  8: '화남',
  12: '평온',
  15: '무덤덤',
  18: '설렘',
  20: '스트레스',
  24: '신남',
  26: '평온',
  28: '외로움',
  29: '외로움',
  30: '뿌듯함'
};

const heavyDays = new Set([1, 8, 20, 28, 29]);

function dominantEmotion(transactions) {
  const counts = transactions.reduce((map, item) => {
    if (item.type === 'expense') map[item.emotion] = (map[item.emotion] || 0) + 1;
    return map;
  }, {});
  return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] || '스트레스';
}

function calendarDays(transactions) {
  const txMap = new Map(transactions.map(item => [dayKey(item.date), item.emotion]));
  const lead = new Date(2026, 6, 1).getDay();
  const empty = Array.from({ length: lead }, (_, index) => ({ id: `empty-${index}`, empty: true }));
  const days = Array.from({ length: 31 }, (_, index) => {
    const day = index + 1;
    const key = `2026-07-${String(day).padStart(2, '0')}`;
    return { id: `day-${day}`, day, emotion: fixedCalendar[day] || txMap.get(key) };
  });
  return [...empty, ...days];
}

function ridgePath(cx, width, height, base = 172) {
  return `M ${(cx - width).toFixed(1)} ${base} C ${(cx - width * .42).toFixed(1)} ${base} ${(cx - width * .32).toFixed(1)} ${(base - height).toFixed(1)} ${cx.toFixed(1)} ${(base - height).toFixed(1)} C ${(cx + width * .32).toFixed(1)} ${(base - height).toFixed(1)} ${(cx + width * .42).toFixed(1)} ${base} ${(cx + width).toFixed(1)} ${base} Z`;
}

export default function HomePageDesign({ state, onRoute }) {
  const top = dominantEmotion(state.transactions);
  const topMeta = getEmotion(top);
  const goal = state.goals[0];
  const goalPct = percent(goal.current, goal.target);
  const dark = state.mode === 'dark';
  const days = calendarDays(state.transactions);
  const ridgeData = [['화남', 8], ['평온', 15], ['외로움', 38], ['스트레스', 22], ['신남', 12], ['무덤덤', 5]];
  const slot = 560 / ridgeData.length;

  return (
    <Grid>
      <Left>
        <Stage>
          <div>
            <BlobHalo color={topMeta.color}>
              <div css={{ position: 'relative', display: 'grid', placeItems: 'center', width: 'clamp(230px, 20vw, 290px)', height: 'clamp(230px, 20vw, 290px)' }}>
                <EmotionBlob emotion={top} size={300} />
              </div>
            </BlobHalo>
            <div css={{ fontSize: 12, color: 'var(--sub)', fontWeight: 800, marginTop: 2 }}>이번 달, 내 곁에 가장 오래 머문 마음</div>
            <div css={{ fontSize: 24, color: topMeta.color, fontWeight: 900, letterSpacing: '-.02em', marginTop: 2 }}>{top} 말랑이</div>
          </div>
        </Stage>

        <Ridge>
          <div css={{ fontSize: 14.5, fontWeight: 900 }}>마음 능선</div>
          <div css={{ fontSize: 12, color: 'var(--sub)', marginTop: 2 }}>이번 달 감정이 흘러온 결</div>
          <div css={{ height: 150, position: 'relative', margin: '6px -22px 0' }}>
            <svg viewBox="0 0 600 170" width="100%" height="100%" preserveAspectRatio="none" css={{ display: 'block', position: 'absolute', inset: 0 }}>
              <defs>
                <linearGradient id="ridgeFadeDesign" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#fff" stopOpacity=".35" />
                  <stop offset="42%" stopColor="#fff" />
                  <stop offset="100%" stopColor="#fff" stopOpacity="0" />
                </linearGradient>
                <mask id="ridgeMaskDesign"><rect width="600" height="170" fill="url(#ridgeFadeDesign)" /></mask>
              </defs>
              <g mask="url(#ridgeMaskDesign)" filter="blur(2.5px)">
                {ridgeData.map(([name, value], index) => {
                  const cx = 20 + slot * (index + .5);
                  const height = 34 + (value / 38) * 120;
                  return <path key={name} d={ridgePath(cx, slot * 1.15, height)} fill={getEmotion(name).color} opacity=".5" css={{ mixBlendMode: dark ? 'screen' : 'multiply' }} />;
                })}
              </g>
            </svg>
          </div>
          <div css={{ fontSize: 12.5, color: 'var(--sub)', padding: '8px 0 14px' }}>이번 달은 <b css={{ color: getEmotion('외로움').color }}>외로움</b>이 가장 높이 솟았어요</div>
        </Ridge>
      </Left>

      <Right>
        <Calendar>
          <div css={{ marginBottom: 8 }}><span css={{ fontSize: 18, fontWeight: 900, letterSpacing: '-.01em' }}>2026년 7월</span></div>
          <Week>{['일', '월', '화', '수', '목', '금', '토'].map(day => <span key={day}>{day}</span>)}</Week>
          <PebbleGrid>
            {days.map(item => {
              if (item.empty) return <Pebble key={item.id} empty disabled aria-hidden="true" />;
              const color = item.emotion ? getEmotion(item.emotion).color : undefined;
              return <Pebble key={item.id} color={color} strong={heavyDays.has(item.day)} today={item.day === 1} dark={dark} onClick={() => onRoute('transactions')}>{item.day}</Pebble>;
            })}
          </PebbleGrid>
          <Legend>{['스트레스', '외로움', '평온', '뿌듯함'].map(name => <span key={name}><i style={{ background: getEmotion(name).color }} />{name}</span>)}</Legend>
        </Calendar>

        <Signal>
          <div css={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 7 }}>
            <b css={{ width: 25, height: 25, borderRadius: 9, background: 'var(--ink)', color: 'var(--on-ink)', display: 'grid', placeItems: 'center', fontSize: 10 }}>AI</b>
            <span css={{ color: 'var(--sub)', fontSize: 11.5, fontWeight: 800 }}>이번 달 감정 신호</span>
          </div>
          <div css={{ fontSize: 14.5, fontWeight: 900, lineHeight: 1.35 }}>이번 달은 스트레스 소비가 조금 늘고 있어요.</div>
          <div css={{ display: 'flex', gap: 6, flexWrap: 'wrap', padding: '8px 0 7px', borderTop: '1px solid var(--line)', marginTop: 8 }}>
            {[
              ['스트레스', '▲ 8%'],
              ['외로움', '▲ 5%'],
              ['평온', '▼ 3%']
            ].map(([name, delta]) => <span key={name} css={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 10px', borderRadius: 999, background: 'var(--card)', border: '1px solid var(--line)', color: 'var(--sub)', fontSize: 11.5, fontWeight: 800 }}><i css={{ width: 7, height: 7, borderRadius: '50%', background: getEmotion(name).color }} />{name} {delta}</span>)}
          </div>
          <button type="button" onClick={() => onRoute('analysis')} css={{ border: 0, padding: 0, background: 'transparent', color: 'var(--sub)', fontSize: 12.5, fontWeight: 800, cursor: 'pointer' }}>분석 자세히 보기 →</button>
        </Signal>

        <Goal onClick={() => onRoute('universe')}>
          <div css={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <div css={{ display: 'flex', alignItems: 'center', gap: 9 }}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#83C9B0" strokeWidth="1.9"><circle cx="12" cy="12" r="4.5" /><ellipse cx="12" cy="12" rx="10" ry="3.6" transform="rotate(-25 12 12)" /></svg>
              <span css={{ fontSize: 14, fontWeight: 900 }}>{goal.name}</span>
            </div>
            <span css={{ color: '#3E9578', fontSize: 12.5, fontWeight: 900 }}>{goalPct}%</span>
          </div>
          <Bar value={goalPct}><span /></Bar>
          <div css={{ display: 'flex', justifyContent: 'space-between', gap: 10, marginTop: 10, color: 'var(--sub)', fontSize: 12 }}>
            <span>{money(goal.current)} / {money(goal.target)}</span>
            <span>{money(goal.target - goal.current)} 남음 →</span>
          </div>
        </Goal>
      </Right>
    </Grid>
  );
}
