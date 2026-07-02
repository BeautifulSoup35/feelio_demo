/** @jsxImportSource @emotion/react */
import { useState } from 'react';
import styled from '@emotion/styled';
import { GlassCard } from '../components/common/GlassCard.jsx';
import { getEmotion } from '../data/emotions.js';
import PlanetTest from '../components/universe/PlanetTest.jsx';
import TheFork from '../components/universe/TheFork.jsx';

const Page = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const Cosmic = styled.div`
  position: relative;
  overflow: hidden;
  border-radius: 28px;
  padding: 22px 26px;
  background: linear-gradient(150deg, #2A2740, #151327 62%);
  box-shadow: var(--shadow);
  isolation: isolate;
`;

const Duo = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;

  @media (max-width: 860px) {
    grid-template-columns: 1fr;
  }
`;

const UniverseCard = styled(GlassCard)`
  position: relative;
  overflow: hidden;
  padding: 22px;
`;

const Bars = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 10px;
  height: 112px;
  margin-top: 14px;
`;

const FlipContainer = styled.div`
  perspective: 1200px;
  cursor: pointer;
  width: 100%;
`;

const CardInner = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 230px;
  transition: transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
  transform-style: preserve-3d;
  ${props => props.isFlipped && `transform: rotateX(180deg);`}
`;

const CardFace = styled(UniverseCard)`
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  top: 0; left: 0;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  margin: 0;
`;

const CardBack = styled(CardFace)`
  transform: rotateX(180deg);
`;

const ScheduleList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 9px;
  margin-top: 8px;
  font-size: 12px;
  line-height: 1.5;
`;

const TimeRow = styled.div`
  display: flex;
  gap: 10px;
  align-items: flex-start;
  b { color: ${props => props.color}; min-width: 40px; }
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

export default function UniversePageDc() {
  const [selectedUniverse, setSelectedUniverse] = useState(null); // 'current' | 'alt' | null
  
  const baseProgress = 40;

  // 상승 궤도 (초록)
  const getUpPoint = (t) => {
    const p0 = { x: 40, y: 150 }, p1 = { x: 210, y: 150 }, p2 = { x: 300, y: 90 }, p3 = { x: 490, y: 34 };
    const cx = 3 * (p1.x - p0.x), bx = 3 * (p2.x - p1.x) - cx, ax = p3.x - p0.x - cx - bx;
    const cy = 3 * (p1.y - p0.y), by = 3 * (p2.y - p1.y) - cy, ay = p3.y - p0.y - cy - by;
    return { x: (ax * t**3) + (bx * t**2) + (cx * t) + p0.x, y: (ay * t**3) + (by * t**2) + (cy * t) + p0.y };
  };

  // 평행 궤도 (회색/바닥)
  const getDownPoint = (t) => {
    const p0 = { x: 40, y: 150 }, p1 = { x: 200, y: 150 }, p2 = { x: 300, y: 150 }, p3 = { x: 490, y: 150 };
    const cx = 3 * (p1.x - p0.x), bx = 3 * (p2.x - p1.x) - cx, ax = p3.x - p0.x - cx - bx;
    const cy = 3 * (p1.y - p0.y), by = 3 * (p2.y - p1.y) - cy, ay = p3.y - p0.y - cy - by;
    return { x: (ax * t**3) + (bx * t**2) + (cx * t) + p0.x, y: (ay * t**3) + (by * t**2) + (cy * t) + p0.y };
  };

  let starX, starY, currentProgress;
  if (selectedUniverse === 'alt') {
    currentProgress = 100;
    const pt = getUpPoint(1);
    starX = pt.x; starY = pt.y;
  } else if (selectedUniverse === 'current') {
    currentProgress = baseProgress; // 떨어질때 실선은 기본으로 유지
    const pt = getDownPoint(1);
    starX = pt.x; starY = pt.y;
  } else {
    currentProgress = baseProgress;
    const pt = getUpPoint(baseProgress / 100);
    starX = pt.x; starY = pt.y;
  }

  return (
    <Page>
      <Cosmic>
        <div css={{ position: 'absolute', inset: 0, zIndex: -1, background: 'radial-gradient(circle at 82% 22%,rgba(131,201,176,.28),transparent 44%),radial-gradient(circle at 20% 82%,rgba(158,150,238,.24),transparent 46%)' }} />
        <div css={{ position: 'relative', maxWidth: 400 }}>
          <div css={{ fontSize: 11, fontWeight: 900, letterSpacing: '.14em', color: 'rgba(255,255,255,.55)', marginBottom: 8 }}>PARALLEL UNIVERSE</div>
          <div css={{ fontSize: 'clamp(19px, 2.2vw, 24px)', fontWeight: 900, lineHeight: 1.35, color: '#fff' }}>지금의 소비가 이어질 미래와,<br />감정소비를 조금 줄인 미래.</div>
          <div css={{ fontSize: 13, color: 'rgba(255,255,255,.62)', lineHeight: 1.55, marginTop: 9 }}>두 우주가 이렇게 갈라지고 있어요.</div>
        </div>
        <svg viewBox="0 0 520 190" width="100%" height="112" preserveAspectRatio="none" css={{ display: 'block', marginTop: 10, overflow: 'visible' }}>
          <path d="M40,150 C200,150 300,150 490,150" fill="none" stroke="rgba(200,195,220,.42)" strokeWidth="2.5" strokeDasharray="2 7" strokeLinecap="round" />
          {/* Background Dashed Path (Unreached) */}
          <path d="M40,150 C210,150 300,90 490,34" fill="none" stroke="#8FDAC0" strokeWidth="3" strokeDasharray="2 7" strokeLinecap="round" opacity={0.4} />
          {/* Foreground Solid Path (Reached Progress) */}
          <path d="M40,150 C210,150 300,90 490,34" fill="none" stroke="#8FDAC0" strokeWidth="3" strokeLinecap="round" 
            pathLength="100" 
            strokeDasharray="100" 
            strokeDashoffset={100 - currentProgress} 
            css={{ transition: 'stroke-dashoffset 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)' }} 
          />
          <circle cx="40" cy="150" r="6" fill="#fff" />
          <circle cx="490" cy="150" r="5.5" fill="rgba(200,195,220,.6)" />
          {/* Animated Star */}
          <g css={{ transform: `translate(${starX}px, ${starY}px)`, transition: 'transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)' }}>
            <path d="M0 -13l3.4 9.6 9.6 3.4-9.6 3.4L0 13l-3.4-9.6-9.6-3.4 9.6-3.4z" fill="#8FDAC0" />
            {selectedUniverse === 'alt' && (
              <circle r="20" fill="#8FDAC0" css={{ opacity: 0, animation: 'ping 1s cubic-bezier(0, 0, 0.2, 1) infinite' }} />
            )}
          </g>
          <circle cx="150" cy="150" r="2" fill="rgba(255,255,255,.4)" />
          <circle cx="430" cy="52" r="2" fill="rgba(255,255,255,.5)" />
          <circle cx="330" cy="150" r="1.6" fill="rgba(255,255,255,.3)" />
        </svg>
        <div css={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 900, marginTop: 4 }}><span css={{ color: 'rgba(255,255,255,.55)' }}>지금</span><span css={{ color: '#8FDAC0' }}>목표 도착 ★</span></div>
      </Cosmic>

      <TheFork />

      <PlanetTest />

      <Duo>
        <FlipContainer onClick={() => setSelectedUniverse(selectedUniverse === 'current' ? null : 'current')}>
          <CardInner isFlipped={selectedUniverse === 'current'}>
            <CardFace>
              <div css={{ position: 'absolute', top: -44, right: -34, width: 145, height: 145, borderRadius: '50%', background: 'radial-gradient(circle at 40% 35%,#cfcadb,#a49fb6)', filter: 'blur(10px)', opacity: .4 }} />
              <div css={{ color: 'var(--sub)', fontSize: 12, fontWeight: 900, letterSpacing: '.04em' }}>현재 우주</div>
              <h3 css={{ margin: '5px 0 12px', fontSize: 17 }}>지금처럼 소비한 나</h3>
              <div css={{ color: 'var(--sub)', fontSize: 13 }}>이번 달 감정소비</div>
              <div css={{ fontSize: 27, fontWeight: 900 }}>-182,000원</div>
              <p css={{ color: 'var(--sub)', lineHeight: 1.55, fontSize: 13, marginTop: 'auto' }}>외로운 밤의 배달이 지금 속도로 이어지면, 목표까지 <b css={{ color: 'var(--text)' }}>4개월</b>이 더 걸려요.</p>
              <div css={{ fontSize: 10.5, color: 'var(--sub)', marginTop: 10, textAlign: 'right' }}>클릭해서 스케줄 보기 ↺</div>
            </CardFace>
            <CardBack css={{ background: '#252336' }}>
              <div css={{ color: 'var(--sub)', fontSize: 12, fontWeight: 900, letterSpacing: '.04em' }}>현재 우주의 하루</div>
              <h3 css={{ margin: '5px 0 10px', fontSize: 16 }}>돈이 모이지 않는 스케줄</h3>
              <ScheduleList>
                <TimeRow color="#cfcadb"><b>22:00</b><span>스트레스 폭발, 누워서 배달 앱 탐색</span></TimeRow>
                <TimeRow color="#cfcadb"><b>23:30</b><span>매운 야식 결제 (-23,000원) 완료</span></TimeRow>
                <TimeRow color="#cfcadb"><b>08:30</b><span>더부룩한 속, 늦잠으로 택시 탑승 (-9,800원)</span></TimeRow>
                <TimeRow color="#cfcadb"><b>12:00</b><span>피곤함을 달래려 비싼 커피 수혈 (-6,000원)</span></TimeRow>
              </ScheduleList>
              <div css={{ fontSize: 11, color: 'var(--sub)', marginTop: 'auto', textAlign: 'right' }}>돌아가기 ↺</div>
            </CardBack>
          </CardInner>
        </FlipContainer>

        <FlipContainer onClick={() => setSelectedUniverse(selectedUniverse === 'alt' ? null : 'alt')}>
          <CardInner isFlipped={selectedUniverse === 'alt'}>
            <CardFace css={{ background: 'linear-gradient(160deg,#83C9B033,var(--card))' }}>
              <div css={{ position: 'absolute', top: -44, right: -34, width: 145, height: 145, borderRadius: '50%', background: 'radial-gradient(circle at 40% 35%,#C6F0E0,#72CFAD)', filter: 'blur(10px)', opacity: .55 }} />
              <div css={{ color: '#3E9578', fontSize: 12, fontWeight: 900, letterSpacing: '.04em' }}>다른 우주</div>
              <h3 css={{ margin: '5px 0 12px', fontSize: 17 }}>감정소비를 줄인 나</h3>
              <div css={{ color: 'var(--sub)', fontSize: 13 }}>아낄 수 있는 금액</div>
              <div css={{ fontSize: 27, fontWeight: 900, color: '#3E9578' }}>+62,000원</div>
              <p css={{ color: 'var(--sub)', lineHeight: 1.55, fontSize: 13, marginTop: 'auto' }}>외로운 밤의 배달을 <b css={{ color: 'var(--text)' }}>절반만</b> 줄이면, 목표에 이만큼 더 가까워져요.</p>
              <div css={{ fontSize: 10.5, color: '#3E957880', marginTop: 10, textAlign: 'right' }}>클릭해서 스케줄 보기 ↺</div>
            </CardFace>
            <CardBack css={{ background: 'linear-gradient(160deg,#3E957833,#252336)' }}>
              <div css={{ color: '#3E9578', fontSize: 12, fontWeight: 900, letterSpacing: '.04em' }}>다른 우주의 하루</div>
              <h3 css={{ margin: '5px 0 10px', fontSize: 16 }}>가벼워지는 스케줄</h3>
              <ScheduleList>
                <TimeRow color="#8FDAC0"><b>22:00</b><span>야식 대신 따뜻한 차 한 잔으로 릴렉스</span></TimeRow>
                <TimeRow color="#8FDAC0"><b>23:00</b><span>배달비 방어 성공! 가벼운 속으로 취침</span></TimeRow>
                <TimeRow color="#8FDAC0"><b>07:30</b><span>개운하게 기상, 여유롭게 대중교통 탑승</span></TimeRow>
                <TimeRow color="#8FDAC0"><b>10:00</b><span>아낀 돈으로 늘어난 적금 이자 확인 (+62,000원)</span></TimeRow>
              </ScheduleList>
              <div css={{ fontSize: 11, color: '#3E957880', marginTop: 'auto', textAlign: 'right' }}>돌아가기 ↺</div>
            </CardBack>
          </CardInner>
        </FlipContainer>
      </Duo>

      <GlassCard css={{ padding: '20px 24px', borderRadius: 24 }}>
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
        <div css={{ display: 'flex', alignItems: 'center', gap: 10, background: 'linear-gradient(105deg,#83C9B01f,transparent)', borderRadius: 14, padding: '11px 15px', marginTop: 14, fontWeight: 800 }}><span css={{ fontSize: 17, color: '#3E9578' }}>+600,000원</span><span css={{ color: 'var(--sub)', fontSize: 13 }}>6개월이면 다른 우주가 이만큼 앞서요.</span></div>
      </GlassCard>

    </Page>
  );
}
