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

const KpiGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 14px;

  @media (max-width: 960px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 560px) {
    grid-template-columns: 1fr;
  }
`;

const Duo = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled(GlassCard)`
  padding: 24px;
`;

const BarTrack = styled.div`
  height: 12px;
  border-radius: 999px;
  overflow: hidden;
  background: var(--line);
`;

const categoryData = [
  { name: '배달', amount: 82000, prevAmount: 100000, emotion: '스트레스', pctText: '43%' },
  { name: '카페', amount: 54000, prevAmount: 50000, emotion: '설렘', pctText: '28%' },
  { name: '쇼핑', amount: 39000, prevAmount: 48000, emotion: '설렘', pctText: '21%' },
  { name: '편의점', amount: 15000, prevAmount: 20000, emotion: '평온', pctText: '8%' }
];

const aiInsights = [
  { emotion: '외로움', percent: 61, amount: '113,000원', color: '#5b7db1', title: '새벽 1시, 외로우면 지갑이 샌다', desc: '자정~새벽 소비의 78%가 \'외로움\' 태그' },
  { emotion: '불안', percent: 22, amount: '41,000원', color: '#a68b55', title: '월급날 다음 3일이 제일 위험해', desc: '불안 소비가 평소의 2.3배로 튐' },
  { emotion: '신남', percent: 17, amount: '31,500원', color: '#b15b76', title: '기분이 들뜨면 지출도 들뜬다', desc: '신남 태그 날 하루 평균 지출 49,200원' }
];

const emotionDist = [
  ['스트레스', '43%', '바쁜 하루 끝의 충동', '80,000원'],
  ['외로움', '28%', '혼자인 밤의 위로', '52,000원'],
  ['설렘', '21%', '기대가 이끈 지출', '39,000원'],
  ['평온', '8%', '기분 좋은 여유', '15,000원']
];

const monthly = [['1월', 350], ['2월', 392], ['3월', 445], ['4월', 418], ['5월', 502], ['6월', 473], ['7월', 487]];
const times = [['아침', 12], ['점심', 24], ['저녁', 31], ['밤', 33]];
const evidence = [
  ['6월 12일', '배달', '스트레스', '퇴근 후', '₩23,000'],
  ['6월 18일', '편의점', '스트레스', '밤', '₩8,400'],
  ['6월 22일', '배달', '스트레스', '혼자 있음', '₩18,000']
];

export default function AnalysisPageDc({ state }) {
  const isDark = state?.mode === 'dark';
  const [flippedCards, setFlippedCards] = useState({});
  const [activeChartTab, setActiveChartTab] = useState('category');

  const toggleFlip = (emotion) => {
    setFlippedCards(prev => ({ ...prev, [emotion]: !prev[emotion] }));
  };

  const chartConfig = {
    category: { 
      label: '배달', percent: 43, icon: '🍔', color: '#4E7EF0',
      segments: [
        { name: '배달', percent: 43, amount: '82,000원', color: '#4E7EF0' },
        { name: '카페', percent: 28, amount: '54,000원', color: '#86C9FF' },
        { name: '쇼핑', percent: 21, amount: '39,000원', color: '#B4AAF2' },
        { name: '편의점', percent: 8,  amount: '15,000원', color: '#E2E8FF' }
      ]
    },
    time: { 
      label: '밤', percent: 33, icon: '🌙', color: '#9E355B',
      segments: [
        { name: '밤', percent: 33, color: '#9E355B' },
        { name: '저녁', percent: 31, color: '#D46187' },
        { name: '점심', percent: 24, color: '#F49CB0' },
        { name: '아침', percent: 12, color: '#FFD1DF' }
      ]
    },
    emotion: { 
      label: '스트레스', percent: 43, icon: getEmotion('스트레스').icon, color: '#5042B3',
      segments: [
        { name: '스트레스', percent: 43, color: '#5042B3' },
        { name: '외로움', percent: 28, color: '#6A61C4' },
        { name: '설렘', percent: 21, color: '#9E96EE' },
        { name: '평온', percent: 8,  color: '#D3D6FF' }
      ]
    }
  };
  const activeChart = chartConfig[activeChartTab];

  const getPolarCoord = (percent, radius) => {
    const angleDeg = -90 + (percent * 3.6);
    const angleRad = (angleDeg * Math.PI) / 180;
    return { x: 18 + radius * Math.cos(angleRad), y: 18 + radius * Math.sin(angleRad) };
  };

  const points = times.map(([label, value], index) => {
    const x = ((index + .5) / times.length) * 100;
    const y = 90 - (value / 40) * 74;
    return { label, value, x, y, peak: label === '밤' };
  });
  const curve = `M0,${points[0].y} L${points[0].x},${points[0].y} ` + points.slice(1).map((p, index) => {
    const prev = points[index];
    const mid = ((prev.x + p.x) / 2).toFixed(1);
    return `C${mid},${prev.y.toFixed(1)} ${mid},${p.y.toFixed(1)} ${p.x.toFixed(1)},${p.y.toFixed(1)}`;
  }).join(' ') + ` L100,${points.at(-1).y}`;
  const area = `${curve} L100,90 L0,90 Z`;

  return (
    <Page>
      <div css={{ display: 'flex', justifyContent: 'flex-end' }}>
        <div css={{ display: 'flex', alignItems: 'center', gap: 10, background: '#9E96EE18', padding: '9px 15px', borderRadius: 14 }}>
          <div css={{ textAlign: 'right' }}><div css={{ fontSize: 11, color: '#6A61C4', fontWeight: 800 }}>감정소비 누수율</div><div css={{ fontSize: 19, fontWeight: 900, color: '#4A4299' }}>38%</div></div>
          <span css={{ fontSize: 12, fontWeight: 900, color: '#2E9E7A', background: '#82E2C226', padding: '5px 9px', borderRadius: 99 }}>▼ 8%</span>
        </div>
      </div>

      <KpiGrid>
        {/* Card 1: 상관관계 트리 */}
        <Card css={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div css={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 900, color: '#7265E3' }}>
            <span css={{ fontSize: 16 }}>🕸️</span> 위험한 감정 루트
          </div>
          <div css={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, flexWrap: 'wrap', marginTop: 'auto', marginBottom: 'auto' }}>
            <span css={{ background: '#5b7db133', color: '#4B70A6', padding: '8px 14px', borderRadius: 8, fontSize: 16, fontWeight: 800 }}>우울함</span>
            <span css={{ color: 'var(--sub)', fontSize: 14 }}>➔</span>
            <span css={{ background: 'var(--line)', color: 'var(--text)', padding: '8px 14px', borderRadius: 8, fontSize: 16, fontWeight: 800 }}>새벽 2시 쇼핑</span>
          </div>
        </Card>

        {/* Card 2: 팩트체크 리포트 */}
        <Card css={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div css={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 900, color: '#E74C3C' }}>
            <span css={{ fontSize: 16 }}>🔍</span> 팩트폭행 리포트
          </div>
          <div css={{ fontSize: 13, color: 'var(--sub)', lineHeight: 1.4 }}>이번 달 가장 쓸모없는 소비 1위</div>
          <div css={{ display: 'flex', alignItems: 'center', gap: 16, background: '#E74C3C1a', padding: '16px', borderRadius: 12, marginTop: 'auto' }}>
            <div css={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: 48, height: 48, borderRadius: '50%', background: '#DE3B40', color: '#FFF', flexShrink: 0, boxShadow: '0 4px 10px rgba(0,0,0,0.2)' }}>
              <span css={{ fontSize: 10, fontWeight: 900, lineHeight: 1 }}>TOP</span>
              <span css={{ fontSize: 20, fontWeight: 900, lineHeight: 1, marginTop: 2 }}>1</span>
            </div>
            <div css={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 4 }}>
              <span css={{ background: '#E74C3C1a', color: '#E74C3C', fontSize: 11, fontWeight: 800, padding: '4px 10px', borderRadius: 99 }}>스트레스 핑계</span>
              <div css={{ fontSize: 15, fontWeight: 900, color: 'var(--text)' }}>택시비</div>
              <div css={{ fontSize: 24, fontWeight: 900, color: '#E74C3C', marginTop: 2 }}>48,000원</div>
            </div>
          </div>
        </Card>

        {/* Card 3: 소비 위험도 (신호등) */}
        <Card css={{ display: 'flex', flexDirection: 'column', position: 'relative' }}>
          <div css={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 900, color: '#F1C40F' }}>
            <span css={{ fontSize: 16 }}>🚦</span> 소비 위험도
          </div>
          <div css={{ display: 'flex', gap: 16, margin: 'auto', background: isDark ? '#00000040' : '#222222', padding: '15px 23px', borderRadius: 6 }}>
            <div css={{ width: 44, height: 44, borderRadius: '50%', background: '#3E9578', opacity: 0.2 }} />
            <div css={{ width: 44, height: 44, borderRadius: '50%', background: '#F1C40F', opacity: 0.2 }} />
            <div css={{ width: 44, height: 44, borderRadius: '50%', background: '#E74C3C', boxShadow: '0 0 16px #E74C3C' }} />
          </div>
          <div css={{ position: 'absolute', bottom: 20, right: 22, fontSize: 11, color: 'var(--sub)', textAlign: 'right', letterSpacing: '-0.02em' }}>
            스트레스 누적으로 <b css={{ color: '#E74C3C' }}>위험</b> 상태
          </div>
        </Card>

        {/* Card 4: 맞춤 챌린지 */}
        <Card css={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div css={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 900, color: '#3E9578' }}>
            <span css={{ fontSize: 16 }}>🎯</span> AI 맞춤 챌린지
          </div>
          <div css={{ fontSize: 14, fontWeight: 800, color: 'var(--text)', marginTop: 2 }}>밤 10시 이후 결제 0원</div>
          <div css={{ marginTop: 'auto' }}>
            <div css={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--sub)', marginBottom: 4, fontWeight: 800 }}>
              <span>12일 연속 성공!</span>
              <span css={{ color: '#3E9578' }}>D-18</span>
            </div>
            <div css={{ width: '100%', height: 6, background: 'var(--line)', borderRadius: 99, overflow: 'hidden' }}>
              <div css={{ width: '40%', height: '100%', background: '#3E9578', borderRadius: 99 }} />
            </div>
          </div>
        </Card>
      </KpiGrid>

      <Duo>
        <Card>
          <div css={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h3 css={{ margin: '0 0 4px', fontSize: 16 }}>목표 예산 현황</h3>
              <p css={{ margin: '0 0 22px', color: 'var(--sub)', fontSize: 12 }}>
                저번달 대비 5% 절감 예산을 목표로 달리고 있어요
              </p>
            </div>
          </div>

          <div css={{ display: 'grid', gap: 20 }}>{categoryData.map(data => {
            const emo = getEmotion(data.emotion);
            const budget = data.prevAmount * 0.95;
            const progress = (data.amount / budget) * 100;
            const isOver = progress > 100;

            return <div key={data.name} css={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {/* 1줄: 카테고리 정보 및 금액 */}
              <div css={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div css={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <b css={{ fontSize: 14 }}>{data.name}</b>
                  <span css={{ fontSize: 11, fontWeight: 800, color: emo.text || emo.color, background: `${emo.color}26`, padding: '2px 8px', borderRadius: 6 }}>{data.emotion}</span>
                </div>
                <div css={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                  <span css={{ fontSize: 15, fontWeight: 900, color: isOver ? '#FF4757' : 'var(--text)' }}>{data.amount.toLocaleString()}원</span>
                  <span css={{ fontSize: 11, fontWeight: 700, color: 'var(--sub)' }}>/ {budget.toLocaleString()}원</span>
                </div>
              </div>

              {/* 2줄: 얇은 바 그래프 및 달성률 */}
              <div css={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <BarTrack css={{ flex: 1, height: 8, background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)' }}>
                  <div css={{ 
                    width: `${Math.min(progress, 100)}%`, 
                    height: '100%', 
                    borderRadius: 99, 
                    background: isOver ? '#FF4757' : `linear-gradient(90deg, ${emo.color}9e, ${emo.color})`,
                    transition: 'width 0.4s ease, background 0.4s ease'
                  }} />
                </BarTrack>
                <div css={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', width: 38 }}>
                  <span css={{ fontSize: 12, fontWeight: 800, color: isOver ? '#FF4757' : 'var(--sub)' }}>
                    {Math.round(progress)}%
                  </span>
                </div>
              </div>
            </div>;
          })}</div>
        </Card>

        <Card css={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <h3 css={{ margin: '0 0 20px', fontSize: 16 }}>나의 소비 코어</h3>
          
          <div css={{ display: 'flex', flex: 1, gap: 16, alignItems: 'center' }}>
            {/* 메인 원형 그래프 영역 (왼쪽) */}
            <div css={{ flex: 1.5, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <div css={{ position: 'relative', width: '100%', maxWidth: 210, aspectRatio: '1/1', marginBottom: 12 }}>
                <svg viewBox="-8 -8 52 52" css={{ width: '100%', height: '100%', overflow: 'visible' }}>
                  {activeChart.segments.reduce((acc, seg, idx) => {
                    const offset = acc.total;
                    acc.total += seg.percent;
                    acc.elements.push(
                      <path 
                        key={`path-${idx}`} 
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
                        fill="none" 
                        stroke={seg.color} 
                        strokeWidth="4" 
                        strokeDasharray={`${seg.percent}, 100`} 
                        strokeDashoffset={`-${offset}`}
                        strokeLinecap="round" 
                        css={{ transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)' }} 
                      />
                    );
                    
                    const midPercent = offset + seg.percent / 2;
                    const { x, y } = getPolarCoord(midPercent, 22.5); // 반지름을 선보다 바깥으로
                    const isLeft = x < 18;
                    const textLabel = activeChartTab === 'category' ? seg.amount : `${seg.percent}%`;
                    
                    if (seg.percent > 4) {
                      acc.elements.push(
                        <text
                          key={`txt-${idx}`}
                          x={x} y={y}
                          fill={seg.color}
                          fontSize="2.4"
                          fontWeight="800"
                          textAnchor={isLeft ? 'end' : 'start'}
                          alignmentBaseline="middle"
                          css={{ transition: 'all 0.4s ease' }}
                        >
                          {seg.name} {textLabel}
                        </text>
                      );
                    }
                    return acc;
                  }, { total: 0, elements: [] }).elements}
                </svg>
                <div css={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: activeChart.color, transition: 'color 0.4s ease' }}>
                  <span css={{ fontSize: 38, fontWeight: 900, marginBottom: 2 }}>{activeChart.percent}%</span>
                  <span css={{ fontSize: 24 }}>{activeChart.icon}</span>
                </div>
              </div>
              <span css={{ color: activeChart.color, fontSize: 16, fontWeight: 800, transition: 'color 0.4s ease' }}>1위는 '{activeChart.label}'</span>
            </div>

            {/* 세로 탭 버튼 영역 (오른쪽) */}
            <div css={{ display: 'flex', flexDirection: 'column', gap: 10, flex: 0.8 }}>
              {[
                { id: 'category', text: '가장 많이 쓴 곳' },
                { id: 'time', text: '주로 쓴 시간' },
                { id: 'emotion', text: '주된 감정' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveChartTab(tab.id)}
                  css={{
                    padding: '14px 16px', fontSize: 13, fontWeight: 800, borderRadius: 12, cursor: 'pointer', textAlign: 'left',
                    background: activeChartTab === tab.id ? 'var(--text)' : 'var(--line)',
                    color: activeChartTab === tab.id ? 'var(--bg-1)' : 'var(--sub)',
                    transition: 'all 0.3s', border: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                  }}
                >
                  {activeChartTab === tab.id && <span css={{ opacity: 0.5, fontSize: 14 }}>◀</span>}
                  {tab.text}
                </button>
              ))}
            </div>
          </div>
        </Card>
      </Duo>

      <Duo>
        <Card>
          <div css={{ display: 'flex', justifyContent: 'space-between' }}><h3 css={{ margin: 0, fontSize: 16 }}>월별 지출 추이</h3><span css={{ color: 'var(--sub)', fontSize: 12, fontWeight: 800 }}>최근 7개월</span></div>
          <p css={{ color: 'var(--sub)', fontSize: 12 }}>지난달보다 <b css={{ color: '#3E9578' }}>2.6% 줄었어요</b></p>
          <div css={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 165, marginTop: 12 }}>{monthly.map(([label, value], index) => {
            const current = index === monthly.length - 1;
            return <div key={label} css={{ flex: 1, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end' }}>
              <span css={{ color: current ? '#6A61C4' : 'var(--sub)', fontSize: 10, fontWeight: 800, marginBottom: 5, opacity: current ? 1 : 0.6 }}>{(value / 100).toFixed(1)}만</span>
              <div css={{ width: '100%', height: `${value / 505 * 100}%`, minHeight: 6, borderRadius: 12, background: current ? '#4A4299' : 'var(--line)' }} />
              <span css={{ color: current ? 'var(--text)' : 'var(--sub)', fontSize: 11, fontWeight: current ? 900 : 600, marginTop: 5 }}>{label}</span>
            </div>;
          })}</div>
        </Card>

        <Card css={{ display: 'flex', flexDirection: 'column' }}>
          <div css={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 6 }}><span css={{ width: 24, height: 24, borderRadius: 8, background: 'var(--ink)', color: 'var(--on-ink)', display: 'grid', placeItems: 'center', fontSize: 10, fontWeight: 900 }}>AI</span><b css={{ fontSize: 16 }}>감정소비 분석</b></div>
          <p css={{ color: 'var(--sub)', fontSize: 12, marginBottom: 20 }}>이번 달 지출에 가장 큰 영향을 미친 감정들이에요.</p>
          
          <div css={{ display: 'flex', gap: 12, flex: 1 }}>
            {aiInsights.map(insight => {
               const isFlipped = flippedCards[insight.emotion];
               return (
                 <div 
                   key={insight.emotion}
                   css={{ flex: 1, perspective: 1200, minHeight: 210, cursor: 'pointer' }}
                   onClick={() => toggleFlip(insight.emotion)}
                 >
                   <div css={{
                     width: '100%', height: '100%', position: 'relative',
                     transition: 'transform 0.7s cubic-bezier(0.4, 0, 0.2, 1)',
                     transformStyle: 'preserve-3d',
                     transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
                   }}>
                     {/* 앞면 (Front) */}
                     <div css={{
                       position: 'absolute', inset: 0, backfaceVisibility: 'hidden',
                       padding: '24px 20px', borderRadius: 16, 
                       border: `1px solid ${insight.color + '40'}`, 
                       background: 'var(--card)',
                       display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center', gap: 3,
                       boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
                     }}>
                       <span css={{ fontSize: 16, color: 'var(--sub)', fontWeight: 800 }}>{insight.emotion}</span>
                       <b css={{ fontSize: 36, color: 'var(--text)', lineHeight: 1 }}>{insight.percent}%</b>
                       <span css={{ fontSize: 14, color: insight.color, fontWeight: 900 }}>{insight.amount}</span>
                     </div>
                     
                     {/* 뒷면 (Back) */}
                     <div css={{
                       position: 'absolute', inset: 0, backfaceVisibility: 'hidden',
                       transform: 'rotateY(180deg)',
                       padding: '24px 20px', borderRadius: 16,
                       border: `1.5px solid ${insight.color}`, 
                       background: insight.color + '15',
                       display: 'flex', flexDirection: 'column', justifyContent: 'center',
                       boxShadow: `0 8px 24px ${insight.color}20`
                     }}>
                       <div css={{ fontSize: 16, fontWeight: 900, marginBottom: 12, color: 'var(--text)', wordBreak: 'keep-all', lineHeight: 1.3 }}>{insight.title}</div>
                       <div css={{ fontSize: 13, color: 'var(--sub)', lineHeight: 1.5, wordBreak: 'keep-all' }}>{insight.desc}</div>
                     </div>
                   </div>
                 </div>
               )
            })}
          </div>
        </Card>
      </Duo>

      <Card css={{ display: 'flex', flexDirection: 'column', minHeight: 410 }}>
        <div css={{ display: 'flex', flex: 1, gap: 40, alignItems: 'stretch' }}>
          {/* 왼쪽: 패턴 요약 */}
          <div css={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', paddingTop: 8, paddingLeft: 10, paddingRight: 10 }}>
            {/* 상단 타이틀 영역 (왼쪽으로 이동) */}
            <div css={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 6 }}>
              <span css={{ width: 24, height: 24, borderRadius: 8, background: 'var(--ink)', color: 'var(--on-ink)', display: 'grid', placeItems: 'center', fontSize: 10, fontWeight: 900 }}>AI</span>
              <b css={{ fontSize: 16 }}>반복되는 감정소비 패턴</b>
            </div>
            <p css={{ color: 'var(--sub)', fontSize: 13, margin: '0 0 45px', fontWeight: 600 }}>AI가 이번 달에 찾은 반복 조합이에요</p>

            <div css={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', marginBottom: 30 }}>
              <div css={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span css={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontWeight: 900, background: '#9E96EE22', color: '#4A4299', padding: '13px 18px', borderRadius: 14, fontSize: 15 }}><i css={{ width: 9, height: 9, borderRadius: '50%', background: '#9E96EE' }} />스트레스</span>
                <span css={{ color: 'var(--sub)' }}>→</span><span css={{ fontWeight: 800, background: 'var(--card)', border: '1px solid var(--line)', padding: '13px 18px', borderRadius: 14, fontSize: 15 }}>배달</span>
                <span css={{ color: 'var(--sub)' }}>→</span><span css={{ fontWeight: 800, background: 'var(--card)', border: '1px solid var(--line)', padding: '13px 18px', borderRadius: 14, fontSize: 15 }}>밤 10시 이후</span>
              </div>
              <div css={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                <span css={{ color: '#6A61C4', fontSize: 44, fontWeight: 900, lineHeight: 1 }}>7</span><span css={{ color: 'var(--sub)', fontSize: 16, fontWeight: 800 }}>번 반복</span>
              </div>
            </div>
            <div css={{ background: '#9E96EE14', borderRadius: 16, padding: '20px 24px', fontWeight: 800, lineHeight: 1.6, fontSize: 14 }}>스트레스 받은 밤, 배달로 마음을 달래고 있었어요. 그 순간을 조금만 알아채도 충분해요.</div>
          </div>

          {/* 가운데: 세로 구분선 */}
          <div css={{ width: 1, background: 'var(--line)' }} />

          {/* 오른쪽: 내역 리스트 (표) */}
          <div css={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
            <div css={{ border: '1px solid var(--line)', borderRadius: 16, overflow: 'hidden', background: 'var(--card)', display: 'flex', flexDirection: 'column', height: '100%' }}>
              <div css={{ display: 'grid', gridTemplateColumns: '84px 1fr auto', gap: 14, padding: '11px 18px', fontSize: 11, color: 'var(--sub)', fontWeight: 900, borderBottom: '1px solid var(--line)' }}><span>날짜</span><span>내역</span><span>금액</span></div>
              <div css={{ overflowY: 'auto', flex: 1, paddingBottom: 10 }}>
                {evidence.map(([date, category, emotion, situation, amount], idx) => {
                  const emo = getEmotion(emotion);
                  return <div key={`${date}-${idx}`} css={{ display: 'grid', gridTemplateColumns: '84px 1fr auto', gap: 14, alignItems: 'center', padding: '16px 18px', borderBottom: '1px solid var(--line)' }}>
                    <span css={{ color: 'var(--sub)', fontSize: 12, fontWeight: 800 }}>{date}</span>
                    <div css={{ display: 'flex', alignItems: 'center', gap: 9, minWidth: 0 }}><span css={{ width: 8, height: 8, borderRadius: '50%', background: emo.color }} /><b>{category} <span css={{ color: 'var(--sub)', fontWeight: 600 }}>· {situation}</span></b><span css={{ color: emo.text || emo.color, background: `${emo.color}26`, borderRadius: 99, padding: '2px 8px', fontSize: 11, fontWeight: 800 }}>{emotion}</span></div>
                    <b>{amount}</b>
                  </div>;
                })}
              </div>
            </div>
          </div>
        </div>
      </Card>
    </Page>
  );
}
