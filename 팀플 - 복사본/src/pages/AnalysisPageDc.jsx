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

const kpis = [
  { label: '총 지출', value: '486,700', unit: '원', sub: '지난달 대비 -2.6%', tone: 'var(--text)', subColor: '#3E9578' },
  { label: '총 수입', value: '2,600,000', unit: '원', sub: '고정 급여', tone: 'var(--text)', subColor: 'var(--sub)' },
  { label: '이번 달 순액', value: '+2,113,300', unit: '원', sub: '흑자 유지 중', tone: '#3E9578', subColor: 'var(--sub)' },
  { label: '감정소비', value: '186,000', unit: '원', sub: '전체 지출의 38%', tone: '#7960b8', subColor: '#7960b8' }
];

const categoryData = [
  { name: '배달', amount: 82000, prevAmount: 100000, emotion: '스트레스', pctText: '43%' },
  { name: '카페', amount: 54000, prevAmount: 50000, emotion: '설렘', pctText: '28%' },
  { name: '쇼핑', amount: 39000, prevAmount: 48000, emotion: '설렘', pctText: '21%' },
  { name: '편의점', amount: 15000, prevAmount: 20000, emotion: '평온', pctText: '8%' }
];

const aiInsights = [
  { emotion: '외로움', percent: 61, color: '#5b7db1', title: '새벽 1시, 외로우면 지갑이 샌다', desc: '자정~새벽 소비의 78%가 \'외로움\' 태그' },
  { emotion: '불안', percent: 22, color: '#a68b55', title: '월급날 다음 3일이 제일 위험해', desc: '불안 소비가 평소의 2.3배로 튐' },
  { emotion: '신남', percent: 17, color: '#b15b76', title: '기분이 들뜨면 지출도 들뜬다', desc: '신남 태그 날 하루 평균 지출 49,200원' }
];

const emotionDist = [
  ['스트레스', '43%', '바쁜 하루 끝의 충동', '80,000원'],
  ['외로움', '28%', '혼자인 밤의 위로', '52,000원'],
  ['설렘', '21%', '기대가 이끈 지출', '39,000원'],
  ['평온', '8%', '기분 좋은 여유', '15,000원']
];

const monthly = [['2월', 392], ['3월', 445], ['4월', 418], ['5월', 502], ['6월', 473], ['7월', 487]];
const times = [['아침', 12], ['점심', 24], ['저녁', 31], ['밤', 33]];
const evidence = [
  ['6월 12일', '배달', '스트레스', '퇴근 후', '₩23,000'],
  ['6월 18일', '편의점', '스트레스', '밤', '₩8,400'],
  ['6월 22일', '배달', '스트레스', '혼자 있음', '₩18,000']
];

export default function AnalysisPageDc() {
  const [activeInsight, setActiveInsight] = useState(aiInsights[0]);
  const [isSaveMode, setIsSaveMode] = useState(false);

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

      <KpiGrid>{kpis.map(item => (
        <Card key={item.label}>
          <div css={{ color: 'var(--sub)', fontSize: 12, fontWeight: 900 }}>{item.label}</div>
          <div css={{ marginTop: 7, color: item.tone, fontSize: 26, fontWeight: 900, letterSpacing: 0 }}>{item.value}<span css={{ fontSize: 14 }}>{item.unit}</span></div>
          <div css={{ color: item.subColor, fontSize: 12, fontWeight: 800 }}>{item.sub}</div>
        </Card>
      ))}</KpiGrid>

      <Duo>
        <Card>
          <div css={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h3 css={{ margin: '0 0 4px', fontSize: 16 }}>카테고리별 지출</h3>
              <p css={{ margin: '0 0 22px', color: 'var(--sub)', fontSize: 12 }}>
                {isSaveMode ? '저번달 대비 5% 절감 예산을 목표로 달리고 있어요' : <span>가장 큰 지출은 <b css={{ color: 'var(--text)' }}>배달</b>이에요</span>}
              </p>
            </div>
            {/* 절약모드 토글 */}
            <div 
              onClick={() => setIsSaveMode(!isSaveMode)}
              css={{
                display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer',
                background: isSaveMode ? '#3E95781a' : 'var(--line)', 
                padding: '6px 12px', borderRadius: 99, transition: '0.3s'
              }}
            >
              <span css={{ fontSize: 12, fontWeight: 800, color: isSaveMode ? '#3E9578' : 'var(--sub)' }}>절약모드</span>
              <div css={{
                width: 32, height: 18, borderRadius: 99, background: isSaveMode ? '#3E9578' : 'var(--sub)',
                position: 'relative', transition: '0.3s'
              }}>
                <div css={{
                  width: 14, height: 14, background: '#FFF', borderRadius: '50%',
                  position: 'absolute', top: 2, left: isSaveMode ? 16 : 2, transition: 'transform 0.3s'
                }}/>
              </div>
            </div>
          </div>

          <div css={{ display: 'grid', gap: 20 }}>{categoryData.map(data => {
            const emo = getEmotion(data.emotion);
            const budget = data.prevAmount * 0.95;
            const progress = (data.amount / budget) * 100;
            const isOver = progress > 100;
            // 일반 모드일 때의 바 길이 (제일 큰 배달을 100%로 잡기 위한 로직)
            const maxAmount = categoryData[0].amount;
            const normalWidth = (data.amount / maxAmount) * 100;

            return <div key={data.name}>
              <div css={{ display: 'flex', justifyContent: 'space-between', gap: 10, marginBottom: 9 }}>
                <div css={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                  <b>{data.name}</b>
                  <span css={{ fontSize: 11, fontWeight: 800, color: emo.text || emo.color, background: `${emo.color}26`, padding: '2px 9px', borderRadius: 99 }}>{data.emotion}</span>
                </div>
                <div css={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <b>{data.amount.toLocaleString()}원</b>
                  {isSaveMode ? (
                    <span css={{ 
                      fontSize: 12, fontWeight: 800, width: 44, textAlign: 'right', 
                      color: isOver ? '#FF4757' : 'var(--sub)' 
                    }}>
                      {Math.round(progress)}%
                    </span>
                  ) : (
                    <b css={{ color: 'var(--sub)', width: 38, textAlign: 'right' }}>{data.pctText}</b>
                  )}
                </div>
              </div>
              <BarTrack css={{ background: isSaveMode ? 'rgba(255,255,255,0.06)' : 'var(--line)' }}>
                <div css={{ 
                  width: isSaveMode ? `${Math.min(progress, 100)}%` : `${normalWidth}%`, 
                  height: '100%', 
                  borderRadius: 99, 
                  background: isSaveMode && isOver ? '#FF4757' : `linear-gradient(90deg, ${emo.color}9e, ${emo.color})`,
                  transition: 'width 0.4s ease, background 0.4s ease'
                }} />
              </BarTrack>
              {isSaveMode && (
                <div css={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: 11, color: 'var(--sub)' }}>
                  <span>{isOver ? <b css={{ color: '#FF4757' }}>예산 초과!</b> : '목표 예산'}</span>
                  <span>{budget.toLocaleString()}원</span>
                </div>
              )}
            </div>;
          })}</div>
        </Card>

        <Card css={{ padding: 0, overflow: 'hidden' }}>
          <div css={{ display: 'flex', height: '100%', alignItems: 'center' }}>
            {/* 왼쪽: 스트레스 */}
            <div css={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '36px 20px' }}>
              <div css={{ position: 'relative', width: 130, height: 130, marginBottom: 20 }}>
                <svg viewBox="0 0 36 36" css={{ width: '100%', height: '100%' }}>
                  <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#D3D6FF" strokeWidth="3.5" />
                  <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#5042B3" strokeWidth="3.5" strokeDasharray="43, 100" strokeLinecap="round" />
                </svg>
                <div css={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#5042B3' }}>
                  <span css={{ fontSize: 26, fontWeight: 900, marginBottom: 2 }}>43%</span>
                  <span css={{ fontSize: 20 }}>{getEmotion('스트레스').icon}</span>
                </div>
              </div>
              <span css={{ color: '#5042B3', fontSize: 16, fontWeight: 800 }}>스트레스</span>
            </div>

            {/* 가운데 구분선 */}
            <div css={{ width: 1, height: '70%', background: 'var(--line)' }} />

            {/* 오른쪽: 밤 */}
            <div css={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '36px 20px' }}>
              <div css={{ position: 'relative', width: 130, height: 130, marginBottom: 20 }}>
                <svg viewBox="0 0 36 36" css={{ width: '100%', height: '100%' }}>
                  <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#FFD1DF" strokeWidth="3.5" />
                  <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#9E355B" strokeWidth="3.5" strokeDasharray="33, 100" strokeLinecap="round" />
                </svg>
                <div css={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#9E355B' }}>
                  <span css={{ fontSize: 26, fontWeight: 900, marginBottom: 2 }}>33%</span>
                  <span css={{ fontSize: 20 }}>🌙</span>
                </div>
              </div>
              <span css={{ color: '#9E355B', fontSize: 16, fontWeight: 800 }}>밤</span>
            </div>
          </div>
        </Card>
      </Duo>

      <Duo>
        <Card>
          <div css={{ display: 'flex', justifyContent: 'space-between' }}><h3 css={{ margin: 0, fontSize: 16 }}>월별 지출 추이</h3><span css={{ color: 'var(--sub)', fontSize: 12, fontWeight: 800 }}>최근 6개월</span></div>
          <p css={{ color: 'var(--sub)', fontSize: 12 }}>지난달보다 <b css={{ color: '#3E9578' }}>2.6% 줄었어요</b></p>
          <div css={{ display: 'flex', alignItems: 'flex-end', gap: 10, height: 150 }}>{monthly.map(([label, value], index) => {
            const current = index === monthly.length - 1;
            return <div key={label} css={{ flex: 1, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end' }}>
              <span css={{ color: current ? '#6A61C4' : 'var(--sub)', fontSize: 10, fontWeight: 800, marginBottom: 7 }}>{(value / 100).toFixed(1)}만</span>
              <div css={{ width: '100%', maxWidth: 40, height: `${value / 520 * 100}%`, minHeight: 6, borderRadius: '7px 7px 3px 3px', background: current ? 'linear-gradient(180deg,#9E96EE,#B7B0F2)' : 'var(--line)' }} />
              <span css={{ color: current ? 'var(--text)' : 'var(--sub)', fontSize: 11, fontWeight: current ? 900 : 700, marginTop: 9 }}>{label}</span>
            </div>;
          })}</div>
        </Card>

        <Card css={{ display: 'flex', flexDirection: 'column' }}>
          <div css={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 16 }}><span css={{ width: 24, height: 24, borderRadius: 8, background: 'var(--ink)', color: 'var(--on-ink)', display: 'grid', placeItems: 'center', fontSize: 10, fontWeight: 900 }}>AI</span><b css={{ fontSize: 16 }}>감정소비 분석</b></div>
          <p css={{ color: 'var(--sub)', fontSize: 12, marginBottom: 20 }}>이번 달 지출에 가장 큰 영향을 미친 감정들이에요.</p>
          
          <div css={{ display: 'flex', gap: 10, marginBottom: 24 }}>
            {aiInsights.map(insight => {
               const isActive = activeInsight.emotion === insight.emotion;
               return (
                 <button 
                   key={insight.emotion}
                   onClick={() => setActiveInsight(insight)}
                   css={{ 
                     flex: 1, 
                     padding: '16px 14px', 
                     borderRadius: 14, 
                     border: `1px solid ${isActive ? insight.color : insight.color + '40'}`, 
                     background: isActive ? insight.color + '26' : 'transparent',
                     cursor: 'pointer',
                     transition: 'all 0.2s',
                     display: 'flex',
                     flexDirection: 'column',
                     alignItems: 'flex-start',
                     gap: 6
                   }}
                 >
                   <span css={{ fontSize: 13, color: 'var(--sub)', fontWeight: 800 }}>{insight.emotion}</span>
                   <b css={{ fontSize: 24, color: 'var(--text)' }}>{insight.percent}%</b>
                 </button>
               )
            })}
          </div>

          <div css={{ 
            marginTop: 'auto', 
            padding: '20px', 
            borderRadius: 16, 
            border: `1px solid ${activeInsight.color}80`, 
            background: `linear-gradient(145deg, ${activeInsight.color}1a, transparent)` 
          }}>
            <div css={{ fontSize: 16, fontWeight: 900, marginBottom: 8, color: 'var(--text)' }}>{activeInsight.title}</div>
            <div css={{ fontSize: 13, color: 'var(--sub)', lineHeight: 1.5 }}>{activeInsight.desc}</div>
          </div>
        </Card>
      </Duo>

      <Card>
        <div css={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 6 }}><span css={{ width: 24, height: 24, borderRadius: 8, background: 'var(--ink)', color: 'var(--on-ink)', display: 'grid', placeItems: 'center', fontSize: 10, fontWeight: 900 }}>AI</span><b>반복되는 감정소비 패턴</b></div>
        <p css={{ color: 'var(--sub)', fontSize: 12.5, margin: '0 0 22px' }}>AI가 이번 달에 찾은 반복 조합이에요</p>
        
        <div css={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 30, alignItems: 'start' }}>
          {/* 왼쪽: 패턴 요약 */}
          <div>
            <div css={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', marginBottom: 22 }}>
              <span css={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontWeight: 900, background: '#9E96EE22', color: '#4A4299', padding: '11px 17px', borderRadius: 14 }}><i css={{ width: 9, height: 9, borderRadius: '50%', background: '#9E96EE' }} />스트레스</span>
              <span css={{ color: 'var(--sub)' }}>→</span><span css={{ fontWeight: 800, background: 'var(--card)', border: '1px solid var(--line)', padding: '11px 17px', borderRadius: 14 }}>배달</span>
              <span css={{ color: 'var(--sub)' }}>→</span><span css={{ fontWeight: 800, background: 'var(--card)', border: '1px solid var(--line)', padding: '11px 17px', borderRadius: 14 }}>밤 10시 이후</span>
            </div>
            <div css={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 22 }}>
              <span css={{ color: '#6A61C4', fontSize: 24, fontWeight: 900 }}>7</span><span css={{ color: 'var(--sub)', fontSize: 14, fontWeight: 800 }}>번 반복</span>
            </div>
            <div css={{ background: '#9E96EE14', borderRadius: 16, padding: '15px 18px', fontWeight: 800, lineHeight: 1.6 }}>스트레스 받은 밤, 배달로 마음을 달래고 있었어요. 그 순간을 조금만 알아채도 충분해요.</div>
          </div>

          {/* 오른쪽: 내역 리스트 */}
          <div css={{ border: '1px solid var(--line)', borderRadius: 16, overflow: 'hidden', background: 'var(--card)' }}>
            <div css={{ display: 'grid', gridTemplateColumns: '84px 1fr auto', gap: 14, padding: '11px 18px', fontSize: 11, color: 'var(--sub)', fontWeight: 900, borderBottom: '1px solid var(--line)' }}><span>날짜</span><span>내역</span><span>금액</span></div>
            {evidence.map(([date, category, emotion, situation, amount]) => {
              const emo = getEmotion(emotion);
              return <div key={date} css={{ display: 'grid', gridTemplateColumns: '84px 1fr auto', gap: 14, alignItems: 'center', padding: '14px 18px', borderBottom: '1px solid var(--line)' }}>
                <span css={{ color: 'var(--sub)', fontSize: 12, fontWeight: 800 }}>{date}</span>
                <div css={{ display: 'flex', alignItems: 'center', gap: 9, minWidth: 0 }}><span css={{ width: 8, height: 8, borderRadius: '50%', background: emo.color }} /><b>{category} <span css={{ color: 'var(--sub)', fontWeight: 600 }}>· {situation}</span></b><span css={{ color: emo.text || emo.color, background: `${emo.color}26`, borderRadius: 99, padding: '2px 8px', fontSize: 11, fontWeight: 800 }}>{emotion}</span></div>
                <b>{amount}</b>
              </div>;
            })}
          </div>
        </div>
      </Card>
    </Page>
  );
}
