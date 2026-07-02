/** @jsxImportSource @emotion/react */
import styled from '@emotion/styled';
import { GlassCard } from '../components/common/GlassCard.jsx';
import { getEmotion } from '../data/emotions.js';

const Page = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Cosmic = styled.div`
  position: relative;
  overflow: hidden;
  border-radius: 28px;
  padding: 30px 32px;
  background: linear-gradient(150deg, #2A2740, #151327 62%);
  box-shadow: var(--shadow);
  isolation: isolate;
`;

const Duo = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;

  @media (max-width: 860px) {
    grid-template-columns: 1fr;
  }
`;

const UniverseCard = styled(GlassCard)`
  position: relative;
  overflow: hidden;
  padding: 28px;
`;

const Bars = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 14px;
  height: 150px;
  margin-top: 20px;
`;

const ScenarioGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;

  @media (max-width: 860px) {
    grid-template-columns: 1fr;
  }
`;

const projection = [['1월', 18, 11], ['2월', 36, 21], ['3월', 55, 30], ['4월', 74, 38], ['5월', 92, 46], ['6월', 112, 52]];
const scenarios = [
  ['밤 배달 주 2회 → 1회', '스트레스', '+38,000', '가장 큰 누수예요'],
  ['습관성 카페 절반으로', '설렘', '+16,000', '작지만 매일 쌓여요'],
  ['충동 쇼핑 하루만 참기', '설렘', '+24,000', '주말에 몰려요']
];

export default function UniversePageDc() {
  return (
    <Page>
      <Cosmic>
        <div css={{ position: 'absolute', inset: 0, zIndex: -1, background: 'radial-gradient(circle at 82% 22%,rgba(131,201,176,.28),transparent 44%),radial-gradient(circle at 20% 82%,rgba(158,150,238,.24),transparent 46%)' }} />
        <div css={{ position: 'relative', maxWidth: 440 }}>
          <div css={{ fontSize: 12, fontWeight: 900, letterSpacing: '.14em', color: 'rgba(255,255,255,.55)', marginBottom: 10 }}>PARALLEL UNIVERSE</div>
          <div css={{ fontSize: 'clamp(22px, 2.6vw, 28px)', fontWeight: 900, lineHeight: 1.4, color: '#fff' }}>지금의 소비가 이어질 미래와,<br />감정소비를 조금 줄인 미래.</div>
          <div css={{ fontSize: 14, color: 'rgba(255,255,255,.62)', lineHeight: 1.65, marginTop: 12 }}>두 우주가 이렇게 갈라지고 있어요.</div>
        </div>
        <svg viewBox="0 0 520 190" width="100%" height="150" preserveAspectRatio="none" css={{ display: 'block', marginTop: 16, overflow: 'visible' }}>
          <path d="M40,150 C200,150 300,150 490,150" fill="none" stroke="rgba(200,195,220,.42)" strokeWidth="2.5" strokeDasharray="2 7" strokeLinecap="round" />
          <path d="M40,150 C210,150 300,90 490,34" fill="none" stroke="#8FDAC0" strokeWidth="3" strokeLinecap="round" />
          <circle cx="40" cy="150" r="6" fill="#fff" />
          <circle cx="490" cy="150" r="5.5" fill="rgba(200,195,220,.6)" />
          <path d="M490 20l3.4 9.6 9.6 3.4-9.6 3.4L490 46l-3.4-9.6-9.6-3.4 9.6-3.4z" fill="#8FDAC0" />
          <circle cx="150" cy="150" r="2" fill="rgba(255,255,255,.4)" />
          <circle cx="430" cy="52" r="2" fill="rgba(255,255,255,.5)" />
          <circle cx="330" cy="150" r="1.6" fill="rgba(255,255,255,.3)" />
        </svg>
        <div css={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 900, marginTop: 4 }}><span css={{ color: 'rgba(255,255,255,.55)' }}>지금</span><span css={{ color: '#8FDAC0' }}>목표 도착 ★</span></div>
      </Cosmic>

      <Duo>
        <UniverseCard>
          <div css={{ position: 'absolute', top: -50, right: -40, width: 180, height: 180, borderRadius: '50%', background: 'radial-gradient(circle at 40% 35%,#cfcadb,#a49fb6)', filter: 'blur(10px)', opacity: .4 }} />
          <div css={{ color: 'var(--sub)', fontSize: 12, fontWeight: 900, letterSpacing: '.04em' }}>현재 우주</div>
          <h3 css={{ margin: '6px 0 18px', fontSize: 20 }}>지금처럼 소비한 나</h3>
          <div css={{ color: 'var(--sub)', fontSize: 13 }}>이번 달 감정소비</div>
          <div css={{ fontSize: 34, fontWeight: 900 }}>-182,000원</div>
          <p css={{ color: 'var(--sub)', lineHeight: 1.7 }}>외로운 밤의 배달이 지금 속도로 이어지면, 목표까지 <b css={{ color: 'var(--text)' }}>4개월</b>이 더 걸려요.</p>
        </UniverseCard>
        <UniverseCard css={{ background: 'linear-gradient(160deg,#83C9B033,var(--card))' }}>
          <div css={{ position: 'absolute', top: -50, right: -40, width: 180, height: 180, borderRadius: '50%', background: 'radial-gradient(circle at 40% 35%,#C6F0E0,#72CFAD)', filter: 'blur(10px)', opacity: .55 }} />
          <div css={{ color: '#3E9578', fontSize: 12, fontWeight: 900, letterSpacing: '.04em' }}>다른 우주</div>
          <h3 css={{ margin: '6px 0 18px', fontSize: 20 }}>감정소비를 줄인 나</h3>
          <div css={{ color: 'var(--sub)', fontSize: 13 }}>아낄 수 있는 금액</div>
          <div css={{ fontSize: 34, fontWeight: 900, color: '#3E9578' }}>+62,000원</div>
          <p css={{ color: 'var(--sub)', lineHeight: 1.7 }}>외로운 밤의 배달을 <b css={{ color: 'var(--text)' }}>절반만</b> 줄이면, 목표에 이만큼 더 가까워져요.</p>
        </UniverseCard>
      </Duo>

      <GlassCard css={{ padding: '26px 30px', borderRadius: 28 }}>
        <div css={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
          <div><h3 css={{ margin: '0 0 3px', fontSize: 16 }}>6개월 후, 두 우주의 격차</h3><div css={{ color: 'var(--sub)', fontSize: 12 }}>감정소비 누적을 나란히 두면 이렇게 벌어져요</div></div>
          <div css={{ display: 'flex', gap: 16, alignItems: 'center' }}><span css={{ color: 'var(--sub)', fontSize: 12, fontWeight: 800 }}>■ 현재 우주</span><span css={{ color: '#3E9578', fontSize: 12, fontWeight: 900 }}>■ 다른 우주</span></div>
        </div>
        <Bars>{projection.map(([label, now, alt]) => (
          <div key={label} css={{ flex: 1, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end' }}>
            <div css={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: 5, width: '100%', height: '100%' }}>
              <div css={{ width: '42%', maxWidth: 16, height: `${now / 120 * 100}%`, borderRadius: '5px 5px 2px 2px', background: 'linear-gradient(180deg,#C9C3DB,#A49FB6)' }} />
              <div css={{ width: '42%', maxWidth: 16, height: `${alt / 120 * 100}%`, borderRadius: '5px 5px 2px 2px', background: 'linear-gradient(180deg,#8FDAC0,#3E9578)' }} />
            </div>
            <span css={{ color: 'var(--sub)', fontSize: 11, fontWeight: 800, marginTop: 9 }}>{label}</span>
          </div>
        ))}</Bars>
        <div css={{ display: 'flex', alignItems: 'center', gap: 10, background: 'linear-gradient(105deg,#83C9B01f,transparent)', borderRadius: 16, padding: '14px 18px', marginTop: 20, fontWeight: 800 }}><span css={{ fontSize: 20, color: '#3E9578' }}>+600,000원</span><span css={{ color: 'var(--sub)' }}>6개월이면 다른 우주가 이만큼 앞서요.</span></div>
      </GlassCard>

      <div>
        <h3 css={{ margin: '0 0 4px', fontSize: 16 }}>만약에, 이렇게 바꾼다면</h3>
        <p css={{ margin: '0 0 16px', color: 'var(--sub)', fontSize: 12 }}>작은 레버 하나가 다른 우주를 열어요</p>
        <ScenarioGrid>{scenarios.map(([lever, emotion, save, note]) => {
          const emo = getEmotion(emotion);
          return <GlassCard key={lever} css={{ padding: '20px 22px', display: 'grid', gap: 11 }}>
            <div css={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}><span css={{ color: emo.text || emo.color, background: `${emo.color}26`, borderRadius: 99, padding: '2px 9px', fontSize: 11, fontWeight: 900 }}>{emotion}</span><b css={{ color: '#3E9578', fontSize: 19 }}>{save}</b></div>
            <b>{lever}</b>
            <span css={{ color: 'var(--sub)', fontSize: 12 }}>{note} · 매달</span>
          </GlassCard>;
        })}</ScenarioGrid>
      </div>
    </Page>
  );
}
