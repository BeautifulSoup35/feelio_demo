/** @jsxImportSource @emotion/react */
import { useState } from 'react';
import styled from '@emotion/styled';
import { GlassCard } from '../components/common/GlassCard.jsx';
import { getEmotion } from '../data/emotions.js';

const Page = styled.div`
  width: min(100%, 1420px);
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const ContentLayout = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(320px, .42fr);
  gap: 20px;
  align-items: stretch;

  @media (max-width: 980px) {
    grid-template-columns: 1fr;
  }
`;

const LeftColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const RightColumn = styled.div`
  display: flex;
  flex-direction: column;
`;

const SchedulePanel = styled(GlassCard)`
  padding: 32px 28px;
  height: 100%;
  border-radius: 28px;
  display: flex;
  flex-direction: column;
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

const FlipContainer = styled.div`
  perspective: 1200px;
  cursor: pointer;
  width: 100%;
`;

const CardInner = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 280px;
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

const TimelineContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 18px;
  padding-left: 6px;
  &::before {
    content: '';
    position: absolute;
    top: 10px;
    bottom: 10px;
    left: 28px;
    width: 2px;
    background: rgba(255,255,255,0.15);
  }
`;

const TimelineItem = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  position: relative;
`;

const TimeCircle = styled.div`
  width: 46px;
  height: 46px;
  border-radius: 50%;
  border: 3px solid ${props => props.color};
  background: ${props => props.bg || '#252336'};
  color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 900;
  z-index: 1;
  flex-shrink: 0;
  box-shadow: 0 4px 10px rgba(0,0,0,0.2);
`;

const TimelineContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3px;
  flex: 1;
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
        <div css={{ position: 'relative', maxWidth: 440 }}>
          <div css={{ fontSize: 12, fontWeight: 900, letterSpacing: '.14em', color: 'rgba(255,255,255,.55)', marginBottom: 10 }}>PARALLEL UNIVERSE</div>
          <div css={{ fontSize: 'clamp(22px, 2.6vw, 28px)', fontWeight: 900, lineHeight: 1.4, color: '#fff' }}>지금의 소비가 이어질 미래와,<br />감정소비를 조금 줄인 미래.</div>
          <div css={{ fontSize: 14, color: 'rgba(255,255,255,.62)', lineHeight: 1.65, marginTop: 12 }}>두 우주가 이렇게 갈라지고 있어요.</div>
        </div>
        <svg viewBox="0 0 520 190" width="100%" height="150" preserveAspectRatio="none" css={{ display: 'block', marginTop: 16, overflow: 'visible' }}>
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

      <ContentLayout>
        <LeftColumn>
          <Duo>
            <FlipContainer onClick={() => setSelectedUniverse(selectedUniverse === 'current' ? null : 'current')}>
              <CardInner isFlipped={selectedUniverse === 'current'}>
                <CardFace>
                  <div css={{ position: 'absolute', top: -50, right: -40, width: 180, height: 180, borderRadius: '50%', background: 'radial-gradient(circle at 40% 35%,#cfcadb,#a49fb6)', filter: 'blur(10px)', opacity: .4 }} />
                  <div css={{ color: 'var(--sub)', fontSize: 12, fontWeight: 900, letterSpacing: '.04em' }}>현재 우주</div>
                  <h3 css={{ margin: '6px 0 18px', fontSize: 20 }}>지금처럼 소비한 나</h3>
                  <div css={{ color: 'var(--sub)', fontSize: 13 }}>이번 달 감정소비</div>
                  <div css={{ fontSize: 34, fontWeight: 900 }}>-182,000원</div>
                  <p css={{ color: 'var(--sub)', lineHeight: 1.7, marginTop: 'auto' }}>외로운 밤의 배달이 지금 속도로 이어지면, 목표까지 <b css={{ color: 'var(--text)' }}>4개월</b>이 더 걸려요.</p>
                  <div css={{ fontSize: 11, color: 'var(--sub)', marginTop: 14, textAlign: 'right' }}>클릭해서 스케줄 보기 ↺</div>
                </CardFace>
                <CardBack css={{ background: '#252336' }}>
                  <div css={{ color: 'var(--sub)', fontSize: 12, fontWeight: 900, letterSpacing: '.04em' }}>현재 우주의 하루</div>
                  <h3 css={{ margin: '6px 0 14px', fontSize: 18 }}>이대로 가면... 텅장 예약입니다 💸</h3>
                  <p css={{ color: 'var(--sub)', lineHeight: 1.6, fontSize: 14 }}>스트레스 풀려다 지갑이 풀려버리는 루트.<br/>배달 앱 VIP 달성은 축하드리지만, 통장 잔고는 매일 눈물을 흘리고 있어요. 이대로면 6개월 뒤 60만원 증발 확정!</p>
                  <div css={{ fontSize: 11, color: 'var(--sub)', marginTop: 'auto', textAlign: 'right' }}>돌아가기 ↺</div>
                </CardBack>
              </CardInner>
            </FlipContainer>

            <FlipContainer onClick={() => setSelectedUniverse(selectedUniverse === 'alt' ? null : 'alt')}>
              <CardInner isFlipped={selectedUniverse === 'alt'}>
                <CardFace css={{ background: 'linear-gradient(160deg,#83C9B033,var(--card))' }}>
                  <div css={{ position: 'absolute', top: -50, right: -40, width: 180, height: 180, borderRadius: '50%', background: 'radial-gradient(circle at 40% 35%,#C6F0E0,#72CFAD)', filter: 'blur(10px)', opacity: .55 }} />
                  <div css={{ color: '#3E9578', fontSize: 12, fontWeight: 900, letterSpacing: '.04em' }}>다른 우주</div>
                  <h3 css={{ margin: '6px 0 18px', fontSize: 20 }}>감정소비를 줄인 나</h3>
                  <div css={{ color: 'var(--sub)', fontSize: 13 }}>아낄 수 있는 금액</div>
                  <div css={{ fontSize: 34, fontWeight: 900, color: '#3E9578' }}>+62,000원</div>
                  <p css={{ color: 'var(--sub)', lineHeight: 1.7, marginTop: 'auto' }}>외로운 밤의 배달을 <b css={{ color: 'var(--text)' }}>절반만</b> 줄이면, 목표에 이만큼 더 가까워져요.</p>
                  <div css={{ fontSize: 11, color: '#3E957880', marginTop: 14, textAlign: 'right' }}>클릭해서 스케줄 보기 ↺</div>
                </CardFace>
                <CardBack css={{ background: 'linear-gradient(160deg,#3E957833,#252336)' }}>
                  <div css={{ color: '#3E9578', fontSize: 12, fontWeight: 900, letterSpacing: '.04em' }}>다른 우주의 하루</div>
                  <h3 css={{ margin: '6px 0 14px', fontSize: 18 }}>참으면 복이 와요! 📈</h3>
                  <p css={{ color: 'var(--sub)', lineHeight: 1.6, fontSize: 14 }}>작은 인내가 모여 통장이 두둑해지는 지름길.<br/>조금만 참으면 6개월 뒤 60만원 이상의 이득! 여유롭게 제주도 왕복 항공권 겟!</p>
                  <div css={{ fontSize: 11, color: '#3E957880', marginTop: 'auto', textAlign: 'right' }}>돌아가기 ↺</div>
                </CardBack>
              </CardInner>
            </FlipContainer>
          </Duo>

          <GlassCard css={{ padding: '26px 30px', borderRadius: 28, marginTop: 'auto' }}>
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
        </LeftColumn>

        <RightColumn>
          <SchedulePanel>
            {selectedUniverse === 'current' ? (
              <>
                <div css={{ color: 'var(--sub)', fontSize: 12, fontWeight: 900, letterSpacing: '.04em' }}>현재 우주 타임라인</div>
                <h3 css={{ margin: '6px 0 24px', fontSize: 20 }}>돈이 모이지 않는 스케줄</h3>
                <TimelineContainer>
                  <TimelineItem>
                    <TimeCircle color="#cfcadb" bg="#252336">18:30</TimeCircle>
                    <TimelineContent>
                      <div css={{ fontSize: 13, color: '#cfcadb', fontWeight: 500 }}>퇴근길 스트레스, 편의점 캔맥주 충동구매</div>
                      <div css={{ fontSize: 13, color: '#ff7a6b', fontWeight: 800 }}>-12,000원</div>
                    </TimelineContent>
                  </TimelineItem>
                  <TimelineItem>
                    <TimeCircle color="#cfcadb" bg="#252336">20:00</TimeCircle>
                    <TimelineContent>
                      <div css={{ fontSize: 13, color: '#cfcadb', fontWeight: 500 }}>유튜브 보다가 쇼핑몰 할인 광고 클릭</div>
                    </TimelineContent>
                  </TimelineItem>
                  <TimelineItem>
                    <TimeCircle color="#cfcadb" bg="#252336">22:00</TimeCircle>
                    <TimelineContent>
                      <div css={{ fontSize: 13, color: '#cfcadb', fontWeight: 500 }}>스트레스 폭발, 누워서 배달 앱 탐색</div>
                    </TimelineContent>
                  </TimelineItem>
                  <TimelineItem>
                    <TimeCircle color="#cfcadb" bg="#252336">23:30</TimeCircle>
                    <TimelineContent>
                      <div css={{ fontSize: 13, color: '#cfcadb', fontWeight: 500 }}>매운 야식 결제 완료</div>
                      <div css={{ fontSize: 13, color: '#ff7a6b', fontWeight: 800 }}>-23,000원</div>
                    </TimelineContent>
                  </TimelineItem>
                  <TimelineItem>
                    <TimeCircle color="#cfcadb" bg="#252336">02:00</TimeCircle>
                    <TimelineContent>
                      <div css={{ fontSize: 13, color: '#cfcadb', fontWeight: 500 }}>소화불량으로 뒤척이다 새벽 감성 쇼핑</div>
                      <div css={{ fontSize: 13, color: '#ff7a6b', fontWeight: 800 }}>-45,000원</div>
                    </TimelineContent>
                  </TimelineItem>
                  <TimelineItem>
                    <TimeCircle color="#cfcadb" bg="#252336">08:30</TimeCircle>
                    <TimelineContent>
                      <div css={{ fontSize: 13, color: '#cfcadb', fontWeight: 500 }}>더부룩한 속, 늦잠으로 인한 택시 탑승</div>
                      <div css={{ fontSize: 13, color: '#ff7a6b', fontWeight: 800 }}>-9,800원</div>
                    </TimelineContent>
                  </TimelineItem>
                  <TimelineItem>
                    <TimeCircle color="#cfcadb" bg="#252336">12:00</TimeCircle>
                    <TimelineContent>
                      <div css={{ fontSize: 13, color: '#cfcadb', fontWeight: 500 }}>피곤함을 달래려 비싼 커피 수혈</div>
                      <div css={{ fontSize: 13, color: '#ff7a6b', fontWeight: 800 }}>-6,000원</div>
                    </TimelineContent>
                  </TimelineItem>
                </TimelineContainer>
              </>
            ) : selectedUniverse === 'alt' ? (
              <>
                <div css={{ color: '#3E9578', fontSize: 12, fontWeight: 900, letterSpacing: '.04em' }}>다른 우주 타임라인</div>
                <h3 css={{ margin: '6px 0 24px', fontSize: 20 }}>가벼워지는 스케줄</h3>
                <TimelineContainer>
                  <TimelineItem>
                    <TimeCircle color="#8FDAC0" bg="#1a2522">18:30</TimeCircle>
                    <TimelineContent>
                      <div css={{ fontSize: 13, color: '#8FDAC0', fontWeight: 500 }}>퇴근길 산책하며 스트레스 날리기</div>
                      <div css={{ fontSize: 13, color: '#3E9578', fontWeight: 800 }}>0원</div>
                    </TimelineContent>
                  </TimelineItem>
                  <TimelineItem>
                    <TimeCircle color="#8FDAC0" bg="#1a2522">20:00</TimeCircle>
                    <TimelineContent>
                      <div css={{ fontSize: 13, color: '#8FDAC0', fontWeight: 500 }}>건강한 집밥으로 가벼운 저녁 식사</div>
                    </TimelineContent>
                  </TimelineItem>
                  <TimelineItem>
                    <TimeCircle color="#8FDAC0" bg="#1a2522">22:00</TimeCircle>
                    <TimelineContent>
                      <div css={{ fontSize: 13, color: '#8FDAC0', fontWeight: 500 }}>야식 대신 따뜻한 차 한 잔으로 릴렉스</div>
                    </TimelineContent>
                  </TimelineItem>
                  <TimelineItem>
                    <TimeCircle color="#8FDAC0" bg="#1a2522">23:00</TimeCircle>
                    <TimelineContent>
                      <div css={{ fontSize: 13, color: '#8FDAC0', fontWeight: 500 }}>배달비 방어 성공! 가벼운 속으로 취침</div>
                    </TimelineContent>
                  </TimelineItem>
                  <TimelineItem>
                    <TimeCircle color="#8FDAC0" bg="#1a2522">07:30</TimeCircle>
                    <TimelineContent>
                      <div css={{ fontSize: 13, color: '#8FDAC0', fontWeight: 500 }}>개운하게 기상, 여유롭게 대중교통 탑승</div>
                    </TimelineContent>
                  </TimelineItem>
                  <TimelineItem>
                    <TimeCircle color="#8FDAC0" bg="#1a2522">10:00</TimeCircle>
                    <TimelineContent>
                      <div css={{ fontSize: 13, color: '#8FDAC0', fontWeight: 500 }}>늘어난 적금 이자 확인</div>
                      <div css={{ fontSize: 13, color: '#3E9578', fontWeight: 800 }}>+62,000원</div>
                    </TimelineContent>
                  </TimelineItem>
                </TimelineContainer>
              </>
            ) : (
              <div css={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--sub)', textAlign: 'center', gap: 16 }}>
                <div css={{ fontSize: 40, opacity: 0.5 }}>👀</div>
                <div css={{ fontSize: 15, lineHeight: 1.6, fontWeight: 600 }}>왼쪽 카드를 클릭하여<br/>각 우주의 하루 일과를 확인해보세요</div>
              </div>
            )}
          </SchedulePanel>
        </RightColumn>
      </ContentLayout>

    </Page>
  );
}
