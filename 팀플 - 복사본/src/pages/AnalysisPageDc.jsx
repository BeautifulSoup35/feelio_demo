/** @jsxImportSource @emotion/react */
import styled from '@emotion/styled';
import { GlassCard } from '../components/common/GlassCard.jsx';
import { getEmotion } from '../data/emotions.js';

const Page = styled.div`
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

const categoryBars = [
  ['배달', '82,000원', '43%', '스트레스', 100],
  ['카페', '54,000원', '28%', '설렘', 66],
  ['쇼핑', '39,000원', '21%', '설렘', 48],
  ['편의점', '15,000원', '8%', '평온', 18]
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
          <h3 css={{ margin: '0 0 4px', fontSize: 16 }}>카테고리별 지출</h3>
          <p css={{ margin: '0 0 22px', color: 'var(--sub)', fontSize: 12 }}>가장 큰 지출은 <b css={{ color: 'var(--text)' }}>배달</b>이에요</p>
          <div css={{ display: 'grid', gap: 20 }}>{categoryBars.map(([name, amount, pct, emotion, width]) => {
            const emo = getEmotion(emotion);
            return <div key={name}>
              <div css={{ display: 'flex', justifyContent: 'space-between', gap: 10, marginBottom: 9 }}>
              <div css={{ display: 'flex', alignItems: 'center', gap: 9 }}><b>{name}</b><span css={{ fontSize: 11, fontWeight: 800, color: emo.text || emo.color, background: `${emo.color}26`, padding: '2px 9px', borderRadius: 99 }}>{emotion}</span></div>
                <div css={{ display: 'flex', gap: 10 }}><b>{amount}</b><b css={{ color: 'var(--sub)', width: 38, textAlign: 'right' }}>{pct}</b></div>
              </div>
              <BarTrack><div css={{ width: `${width}%`, height: '100%', borderRadius: 99, background: `linear-gradient(90deg, ${emo.color}9e, ${emo.color})` }} /></BarTrack>
            </div>;
          })}</div>
        </Card>

        <Card>
          <h3 css={{ margin: '0 0 4px', fontSize: 16 }}>감정별 지출 지분</h3>
          <p css={{ margin: '0 0 20px', color: 'var(--sub)', fontSize: 12 }}>어떤 마음이 지갑을 열었나</p>
          <div css={{ display: 'flex', height: 32, borderRadius: 99, overflow: 'hidden', boxShadow: 'inset 0 0 0 1px var(--line)', marginBottom: 22 }}>
            {emotionDist.map(([name, pct]) => <div key={name} css={{ width: pct, background: getEmotion(name).color }} />)}
          </div>
          <div css={{ display: 'grid', gap: 14 }}>{emotionDist.map(([name, pct, desc, amount]) => {
            const emo = getEmotion(name);
            return <div key={name} css={{ display: 'flex', alignItems: 'center', gap: 11 }}>
              <span css={{ width: 11, height: 11, borderRadius: '50%', background: emo.color }} />
              <div css={{ flex: 1, minWidth: 0 }}><b>{name}</b><div css={{ color: 'var(--sub)', fontSize: 11.5 }}>{desc}</div></div>
              <span css={{ color: 'var(--sub)', fontSize: 12, fontWeight: 800 }}>{amount}</span>
              <b css={{ color: emo.color, fontSize: 17, width: 44, textAlign: 'right' }}>{pct}</b>
            </div>;
          })}</div>
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
              <div css={{ width: '72%', maxWidth: 34, height: `${value / 520 * 100}%`, minHeight: 6, borderRadius: '7px 7px 3px 3px', background: current ? 'linear-gradient(180deg,#9E96EE,#B7B0F2)' : 'var(--line)' }} />
              <span css={{ color: current ? 'var(--text)' : 'var(--sub)', fontSize: 11, fontWeight: current ? 900 : 700, marginTop: 9 }}>{label}</span>
            </div>;
          })}</div>
        </Card>

        <Card>
          <div css={{ display: 'flex', justifyContent: 'space-between', gap: 10 }}><h3 css={{ margin: 0, fontSize: 16 }}>시간대별 소비</h3><span css={{ fontSize: 12, fontWeight: 900, color: '#6A61C4', background: '#9E96EE1f', padding: '6px 12px', borderRadius: 99 }}>밤에 소비가 몰려요</span></div>
          <p css={{ color: 'var(--sub)', fontSize: 12 }}>감정소비의 <b css={{ color: 'var(--text)' }}>64%</b>가 저녁·밤에 일어나요</p>
          <div css={{ position: 'relative', height: 132 }}>
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" width="100%" height="132" css={{ position: 'absolute', inset: 0 }}>
              <defs><linearGradient id="analysisRidge" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#9E96EE" stopOpacity=".4" /><stop offset="1" stopColor="#9E96EE" stopOpacity="0" /></linearGradient></defs>
              <path d={area} fill="url(#analysisRidge)" />
              <path d={curve} fill="none" stroke="#9E96EE" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
            </svg>
            {points.map(point => <span key={point.label} css={{ position: 'absolute', left: `${point.x}%`, bottom: `${100 - point.y}%`, transform: 'translate(-50%,50%)', width: point.peak ? 13 : 8, height: point.peak ? 13 : 8, borderRadius: '50%', background: point.peak ? '#9E96EE' : 'var(--card-strong)', border: `2px solid ${point.peak ? '#fff' : '#9E96EE'}` }} />)}
          </div>
          <div css={{ display: 'flex', marginTop: 10 }}>{points.map(point => <div key={point.label} css={{ flex: 1, textAlign: 'center' }}><b css={{ color: point.peak ? '#6A61C4' : 'var(--sub)', fontSize: 12 }}>{point.label}</b><div css={{ color: 'var(--sub)', fontSize: 11 }}>{point.value}%</div></div>)}</div>
        </Card>
      </Duo>

      <Card>
        <div css={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 6 }}><span css={{ width: 24, height: 24, borderRadius: 8, background: 'var(--ink)', color: 'var(--on-ink)', display: 'grid', placeItems: 'center', fontSize: 10, fontWeight: 900 }}>AI</span><b>반복되는 감정소비 패턴</b></div>
        <p css={{ color: 'var(--sub)', fontSize: 12.5, margin: '0 0 22px' }}>AI가 이번 달에 찾은 반복 조합이에요</p>
        <div css={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', marginBottom: 22 }}>
          <span css={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontWeight: 900, background: '#9E96EE22', color: '#4A4299', padding: '11px 17px', borderRadius: 14 }}><i css={{ width: 9, height: 9, borderRadius: '50%', background: '#9E96EE' }} />스트레스</span>
          <span css={{ color: 'var(--sub)' }}>→</span><span css={{ fontWeight: 800, background: 'var(--card)', border: '1px solid var(--line)', padding: '11px 17px', borderRadius: 14 }}>배달</span>
          <span css={{ color: 'var(--sub)' }}>→</span><span css={{ fontWeight: 800, background: 'var(--card)', border: '1px solid var(--line)', padding: '11px 17px', borderRadius: 14 }}>밤 10시 이후</span>
          <span css={{ marginLeft: 'auto' }}><b css={{ fontSize: 22, color: '#6A61C4' }}>7</b><span css={{ color: 'var(--sub)', fontSize: 12, fontWeight: 800 }}> 번 반복</span></span>
        </div>
        <div css={{ background: '#9E96EE14', borderRadius: 16, padding: '15px 18px', marginBottom: 22, fontWeight: 800 }}>스트레스 받은 밤, 배달로 마음을 달래고 있었어요. 그 순간을 조금만 알아채도 충분해요.</div>
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
      </Card>
    </Page>
  );
}
