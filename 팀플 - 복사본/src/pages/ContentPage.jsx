import { useState } from 'react';
import GlassCard from '../components/common/GlassCard.jsx';
import { formatMoney } from '../utils/money.js';

const futureOptions = [
  {
    id: 'steady',
    icon: '🏡',
    title: '전세 아파트 입주',
    subtitle: '보증금 2억 + 목표 3년 앞당김',
    price: 65000000,
    tone: 'good'
  },
  {
    id: 'same',
    icon: '🚪',
    title: '월세 원룸 4년째',
    subtitle: '매달 -65만 · 모은 돈 거의 없음',
    price: -650000,
    tone: 'quiet'
  }
];

const patternInsights = [
  {
    label: '외로움',
    value: 61,
    amount: 47200,
    title: '새벽 1시, 외로우면 지갑이 샌다',
    caption: '자정~새벽 소비의 78%가 외로움 태그',
    summary: '외로운 밤에는 배달과 구독 결제가 같이 늘었어요.',
    tone: 'blue'
  },
  {
    label: '불안',
    value: 22,
    amount: 17100,
    title: '월급날 다음 3일이 제일 위험해',
    caption: '불안 소비가 평소의 2.3배로 튐',
    summary: '월급 직후에는 작은 쇼핑을 여러 번 나누어 결제했어요.',
    tone: 'gold'
  },
  {
    label: '신남',
    value: 17,
    amount: 13200,
    title: '기분 좋은 날엔 약속 소비가 커져',
    caption: '신남 태그 소비의 64%가 외식과 카페',
    summary: '즐거운 날에는 사람을 만나는 소비가 자연스럽게 늘었어요.',
    tone: 'pink'
  }
];

const budgetPlans = [
  { label: '생활비', value: 420000, max: 520000, className: 'life' },
  { label: '감정소비', value: 77500, max: 60000, className: 'emotion' },
  { label: '여유비', value: 138000, max: 180000, className: 'extra' }
];

const timeBars = [
  { time: '0시', spend: 32, income: 0 },
  { time: '4시', spend: 18, income: 0 },
  { time: '8시', spend: 45, income: 0 },
  { time: '12시', spend: 72, income: 30 },
  { time: '16시', spend: 52, income: 0 },
  { time: '20시', spend: 98, income: 24 }
];

export default function ContentPage({ state }) {
  const [selectedFuture, setSelectedFuture] = useState(futureOptions[0]);
  const [selectedInsight, setSelectedInsight] = useState(null);
  const expenses = state.transactions.filter(item => item.transactionType === 'EXPENSE');
  const totalExpense = expenses.reduce((sum, item) => sum + item.amount, 0);
  const emotionalExpense = expenses
    .filter(item => item.tags.some(tagId => ['e1', 'e2', 'e3', 'e5', 'e7'].includes(tagId)))
    .reduce((sum, item) => sum + item.amount, 0);
  const leakRate = totalExpense ? Math.round((emotionalExpense / totalExpense) * 100) : 0;
  const monthlyBudget = 760000;
  const recommendedBudget = 680000;
  const budgetUsedRate = monthlyBudget ? Math.min(100, Math.round((totalExpense / monthlyBudget) * 100)) : 0;
  const budgetGap = Math.max(0, monthlyBudget - totalExpense);
  const dailyLimit = Math.max(0, Math.round((recommendedBudget - totalExpense) / 7));

  return (
    <div className="pageGrid contentGrid">
      <div className="pageLead">
        <div>
          <p>감정소비 인사이트</p>
          <h1>콘텐츠</h1>
        </div>
      </div>

      <GlassCard className="parallelCard contentFeatureCard">
        <div className="sectionTitle compact">
          <span>평행우주 · 2029년의 나</span>
          <strong>같은 출발선에서 갈라진 선택</strong>
        </div>
        <div className="parallelGrid">
          {futureOptions.map(option => (
            <button
              type="button"
              key={option.id}
              className={`futureCard ${option.tone} ${selectedFuture.id === option.id ? 'active' : ''}`}
              onClick={() => setSelectedFuture(option)}
            >
              <span>{option.icon}</span>
              <strong>{option.title}</strong>
              <small>{option.subtitle}</small>
            </button>
          ))}
        </div>
        <div className="contentPriceReveal">
          <span>감정소비를 월 18만 원씩만 막아도</span>
          <strong>{selectedFuture.price > 0 ? '+' : ''}{formatMoney(selectedFuture.price)}</strong>
          <p>3년 뒤 두 우주의 차이는 현재의 작은 선택에서 시작돼요.</p>
        </div>
      </GlassCard>

      <div className="contentLowerGrid">
        <GlassCard className="reportCard contentFeatureCard monthlyReport">
          <div className="sectionTitle compact">
            <span>6월 감정소비 리포트</span>
            <strong>AI가 정리한 한 달</strong>
          </div>
          <p className="cardText">
            이번 달 감정소비는 <b>{formatMoney(emotionalExpense)}</b>, 그중 <b>{leakRate}%</b>가 외로움에서 나왔어요.
          </p>
          <div className="contentStatRow">
            {patternInsights.map(item => (
              <button
                type="button"
                key={item.label}
                className={`contentStatCard ${item.tone} ${selectedInsight?.label === item.label ? 'active' : ''}`}
                onClick={() => setSelectedInsight(prev => prev?.label === item.label ? null : item)}
              >
                <small>{item.label}</small>
                <b>{item.value}%</b>
                {selectedInsight?.label === item.label && <em>{formatMoney(item.amount)}</em>}
              </button>
            ))}
          </div>
          {selectedInsight && (
            <div className={`monthlyInsightDetail ${selectedInsight.tone}`}>
              <div>
                <span>{selectedInsight.label} 소비 요약</span>
                <strong>{selectedInsight.title}</strong>
              </div>
              <p>{selectedInsight.summary}</p>
            </div>
          )}
        </GlassCard>

        <GlassCard className="contentInsightRail monthlySpendCard">
          <div className="sectionTitle compact">
            <span>이번 달 지출 진단</span>
            <strong>{formatMoney(totalExpense)} 썼어요</strong>
          </div>
          <div className="monthlySpendGauge">
            <span style={{ width: `${budgetUsedRate}%` }} />
          </div>
          <p>
            예산의 <b>{budgetUsedRate}%</b>를 사용했어요. 아직 {formatMoney(budgetGap)} 여유가 있지만,
            감정소비 비중은 조금 낮추는 노력이 필요해요.
          </p>
          <div className="monthlySpendAdvice">
            <span>추천 이번 달 한도</span>
            <strong>{formatMoney(recommendedBudget)}</strong>
            <small>남은 기간에는 하루 평균 {formatMoney(dailyLimit)} 안쪽으로 맞춰봐요.</small>
          </div>
        </GlassCard>

        <GlassCard className="emotionBubblePanel budgetPlannerPanel">
          <div className="sectionTitle compact">
            <strong>한 달 예산 정하기</strong>
            <span>카테고리별 권장 한도</span>
          </div>
          <div className="budgetPlanList">
            {budgetPlans.map(item => (
              <div key={item.label} className={`budgetPlanItem ${item.className}`}>
                <div>
                  <b>{item.label}</b>
                  <span>{formatMoney(item.value)} / {formatMoney(item.max)}</span>
                </div>
                <i><span style={{ width: `${Math.min(100, Math.round((item.value / item.max) * 100))}%` }} /></i>
              </div>
            ))}
            <p>감정소비 한도는 이미 넘었어요. 다음 기록부터는 결제 전 메모를 한 줄 남기는 방식이 좋아요.</p>
          </div>
        </GlassCard>

        <GlassCard className="timePatternPanel">
          <div className="timePatternHeader">
            <div className="sectionTitle compact">
              <strong>시간대별 소비 패턴</strong>
              <span>하루 중 지갑이 새는 시간</span>
            </div>
            <div className="timeLegend">
              <span><i className="spend" />지출</span>
              <span><i className="income" />수입</span>
            </div>
          </div>
          <div className="timeBarChart">
            {timeBars.map(item => (
              <div className="timeBarItem" key={item.time}>
                <div>
                  <i className="spend" style={{ height: `${item.spend}%` }} />
                  {item.income > 0 && <i className="income" style={{ height: `${item.income}%` }} />}
                </div>
                <span>{item.time}</span>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
