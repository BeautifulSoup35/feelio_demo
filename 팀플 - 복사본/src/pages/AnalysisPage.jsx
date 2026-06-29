import { useState } from 'react';
import GlassCard from '../components/common/GlassCard.jsx';
import { formatMoney } from '../utils/money.js';
import { moodEmotionColors } from '../constants/emotions.js';
import { allTags } from '../constants/tags.js';

const tagMap = new Map(allTags.map(tag => [tag.tagId, tag]));

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
    label: '스트레스',
    value: 22,
    amount: 17100,
    title: '월급날 다음 3일이 제일 위험해',
    caption: '스트레스 소비가 평소의 2.3배로 튐',
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
  { label: '여유비', value: 138000, max: 180000, className: 'extra' }
];

const detailedCategoryPlans = [
  { label: '쇼핑', value: 95000, max: 110000, color: '#8A6CFF' },
  { label: '카페', value: 35000, max: 70000, color: '#F5A623' },
  { label: '택시🚖', value: 45000, max: 150000, color: '#2FBFA6' },
  { label: '편의점🧺', value: 79000, max: 80000, color: '#FF4757', danger: true }
];

const timeBars = [
  { time: '00시', spend: 45, emotion: '외로움', color: '#FF7A6B' },
  { time: '02시', spend: 85, peak: true, emotion: '외로움 + 스트레스', colors: ['#FF7A6B', '#8A6CFF'] },
  { time: '04시', spend: 20, emotion: '피곤', color: '#5B8DEF' },
  { time: '06시', spend: 12, emotion: '무덤덤', color: '#9AA0B4' },
  { time: '08시', spend: 38, emotion: '피곤', color: '#5B8DEF' },
  { time: '10시', spend: 28, emotion: '평온', color: '#2FBFA6' },
  { time: '12시', spend: 62, emotion: '뿌듯함', color: '#F35FA8' },
  { time: '14시', spend: 42, emotion: '불안', color: '#F5A623' },
  { time: '16시', spend: 58, emotion: '스트레스', color: '#8A6CFF' },
  { time: '18시', spend: 75, emotion: '피곤 + 분노', colors: ['#5B8DEF', '#F25555'] },
  { time: '20시', spend: 98, peak: true, emotion: '스트레스 + 외로움', colors: ['#8A6CFF', '#FF7A6B'] },
  { time: '22시', spend: 80, emotion: '불안 + 스트레스', colors: ['#F5A623', '#8A6CFF'] }
];

const contentColorMap = {
  '#5B8DEF': moodEmotionColors.외로움,
  '#6EA0FF': moodEmotionColors.외로움,
  '#8A6CFF': moodEmotionColors.스트레스,
  '#F5A623': moodEmotionColors.뿌듯함,
  '#2FBFA6': moodEmotionColors.평온,
  '#F35FA8': moodEmotionColors.신남,
  '#F25555': moodEmotionColors.화남,
  '#FF4757': moodEmotionColors.화남,
  '#FF7A6B': moodEmotionColors.외로움,
  '#9AA0B4': moodEmotionColors.무덤덤
};

function harmonizeContentColor(color) {
  return contentColorMap[color] || color;
}

function aggregateByTag(transactions, type) {
  const map = new Map();
  transactions.forEach(transaction => {
    transaction.tags
      .map(tagId => tagMap.get(tagId))
      .filter(tag => tag?.type === type)
      .forEach(tag => {
        const prev = map.get(tag.name) || { name: tag.name, amount: 0, count: 0, color: tag.color };
        map.set(tag.name, {
          ...prev,
          amount: prev.amount + transaction.amount,
          count: prev.count + 1
        });
      });
  });
  return [...map.values()].sort((a, b) => b.amount - a.amount);
}

export default function AnalysisPage({ state }) {
  const [selectedInsight, setSelectedInsight] = useState(null);
  const [showEmotionColors, setShowEmotionColors] = useState(true);
  const [isExtraFlipped, setIsExtraFlipped] = useState(false);
  const expenses = state.transactions.filter(item => item.transactionType === 'EXPENSE');
  const totalExpense = expenses.reduce((sum, item) => sum + item.amount, 0);
  const emotionalExpense = expenses
    .filter(item => item.tags.some(tagId => /^e\d+$/.test(tagId)))
    .reduce((sum, item) => sum + item.amount, 0);
  const leakRate = totalExpense ? Math.round((emotionalExpense / totalExpense) * 100) : 0;
  const monthlyBudget = 760000;
  const recommendedBudget = 680000;
  const budgetUsedRate = monthlyBudget ? Math.min(100, Math.round((totalExpense / monthlyBudget) * 100)) : 0;
  const budgetGap = Math.max(0, monthlyBudget - totalExpense);
  const dailyLimit = Math.max(0, Math.round((recommendedBudget - totalExpense) / 7));
  const emotionSummary = aggregateByTag(expenses, 'EMOTION').slice(0, 4);
  const categorySummary = aggregateByTag(expenses, 'EXPENSE_CATEGORY').slice(0, 4);
  const maxCategoryAmount = Math.max(1, ...categorySummary.map(item => item.amount));

  return (
    <div className="pageGrid contentGrid analysisContentGrid">
      <div className="pageLead">
        <div>
          <p>데이터로 해석하는 감정소비</p>
          <h1>분석</h1>
        </div>
      </div>

      <GlassCard className="analysisSummaryCard">
        <div className="sectionTitle compact">
          <span>감정별 소비 금액</span>
          <strong>어떤 감정에서 돈이 새는지</strong>
        </div>
        <div className="analysisEmotionSummary">
          {emotionSummary.length > 0 ? emotionSummary.map(item => (
            <span key={item.name} style={{ '--emotion-color': moodEmotionColors[item.name] || item.color }}>
              <small>{item.name}</small>
              <b>{formatMoney(item.amount)}</b>
              <em>{item.count}회</em>
            </span>
          )) : (
            <p className="cardText">감정 태그가 쌓이면 감정별 소비 금액이 보여요.</p>
          )}
        </div>
      </GlassCard>

      <GlassCard className="analysisSummaryCard">
        <div className="sectionTitle compact">
          <span>소비 분류별 금액</span>
          <strong>어디에서 가장 많이 썼는지</strong>
        </div>
        <div className="analysisCategorySummary">
          {categorySummary.length > 0 ? categorySummary.map(item => (
            <div key={item.name}>
              <span>
                <b>{item.name}</b>
                <small>{formatMoney(item.amount)}</small>
              </span>
              <i><em style={{ width: `${Math.max(8, Math.round((item.amount / maxCategoryAmount) * 100))}%`, background: harmonizeContentColor(item.color) }} /></i>
            </div>
          )) : (
            <p className="cardText">소비 분류를 선택한 기록이 생기면 분류별 분석이 나타나요.</p>
          )}
        </div>
      </GlassCard>

      <div className="contentLowerGrid analysisLowerGrid">
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

        <GlassCard className="timePatternPanel">
          <div className="timePatternHeader">
            <div className="sectionTitle compact">
              <strong>시간대별 감정 소비 패턴</strong>
              <span>시간대별 지출을 유발한 감정 컬러</span>
            </div>
            <div className="timeLegend">
              <button
                type="button"
                className={`emotionLegendChip toggleBtn ${showEmotionColors ? 'active' : ''}`}
                onClick={() => setShowEmotionColors(prev => !prev)}
              >
                🎨 감정 컬러 {showEmotionColors ? 'ON' : 'OFF'}
              </button>
              <span className="peakBadge">🔥 소비 피크: 20시 ~ 02시</span>
            </div>
          </div>
          <div className="timeBarChartWrapper">
            <div className="timeChartGrid">
              <span style={{ bottom: '75%' }} />
              <span style={{ bottom: '50%' }} />
              <span style={{ bottom: '25%' }} />
            </div>
            <div className="timeBarChart">
              {timeBars.map(item => {
                const gradient = showEmotionColors
                  ? (item.colors
                      ? `linear-gradient(180deg, ${harmonizeContentColor(item.colors[0])} 0%, ${harmonizeContentColor(item.colors[1])} 100%)`
                      : `linear-gradient(180deg, ${harmonizeContentColor(item.color)} 0%, rgba(20, 25, 45, 0.7) 100%)`)
                  : (item.peak
                      ? `linear-gradient(180deg, ${moodEmotionColors.신남} 0%, ${moodEmotionColors.뿌듯함} 100%)`
                      : `linear-gradient(180deg, ${moodEmotionColors.설렘} 0%, rgba(40, 46, 78, 0.85) 100%)`);
                const glowColor = showEmotionColors ? (item.colors ? harmonizeContentColor(item.colors[0]) : harmonizeContentColor(item.color)) : null;
                const boxShadowStyle = glowColor
                  ? (item.peak ? `0 0 18px ${glowColor}` : `0 4px 12px ${glowColor}66`)
                  : (item.peak ? `0 0 16px rgba(249, 169, 203, 0.62)` : `0 4px 14px rgba(201, 178, 244, 0.32)`);
                return (
                  <div className={`timeBarItem ${item.peak ? 'isPeak' : ''}`} key={item.time}>
                    <div className="barTrack">
                      <i
                        className="spend"
                        style={{
                          height: `${item.spend}%`,
                          background: gradient,
                          boxShadow: boxShadowStyle
                        }}
                      >
                        <span className="barValue">
                          <b>{item.spend}%</b>
                          <small>{item.emotion}</small>
                        </span>
                      </i>
                    </div>
                    <span>{item.time}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </GlassCard>

        <GlassCard className="contentInsightRail monthlySpendCard combinedSpendBudgetCard">
          <div className="sectionTitle compact">
            <span>이번 달 지출 & 예산 진단</span>
            <strong>{formatMoney(totalExpense)} 썼어요</strong>
          </div>
          <div className="monthlySpendGauge">
            <span style={{ width: `${budgetUsedRate}%` }} />
          </div>
          <p className="gaugeDesc">
            예산의 <b>{budgetUsedRate}%</b>를 사용했어요. 아직 {formatMoney(budgetGap)} 여유가 있지만, 감정소비 비중은 조금 낮추는 노력이 필요해요.
          </p>
          <div className="monthlySpendAdvice">
            <span>추천 이번 달 한도</span>
            <strong>{formatMoney(recommendedBudget)}</strong>
            <small>남은 기간에는 하루 평균 {formatMoney(dailyLimit)} 안쪽으로 맞춰봐요.</small>
          </div>

          {(() => {
            const extraPlan = budgetPlans.find(p => p.className === 'extra');
            return extraPlan ? (
              <div
                className={`extraFlipWrapper ${isExtraFlipped ? 'flipped' : ''}`}
                onClick={() => setIsExtraFlipped(prev => !prev)}
              >
                <div className="extraFlipInner">
                  <div className="extraFlipFront">
                    <div>
                      <b>🌱 여유비 한도 진단</b>
                      <small>터치하여 위아래로 뒤집어 한도 확인</small>
                    </div>
                    <span className="flipHintBadge">클릭해서 보기 🔄</span>
                  </div>
                  <div className="extraFlipBack">
                    <div className="extraBackHeader">
                      <b>{extraPlan.label}</b>
                      <span>{formatMoney(extraPlan.value)} / {formatMoney(extraPlan.max)}</span>
                    </div>
                    <i><span style={{ width: `${Math.min(100, Math.round((extraPlan.value / extraPlan.max) * 100))}%` }} /></i>
                  </div>
                </div>
              </div>
            ) : null;
          })()}

          <div className="budgetPlanSection">
            <div className="budgetPlanList">
              {detailedCategoryPlans
                .slice()
                .sort((a, b) => (a.max - a.value) - (b.max - b.value))
                .slice(0, 3)
                .map(item => (
                  <div key={item.label} className={`budgetPlanItem ${item.danger ? 'dangerItem' : ''}`}>
                    <div>
                      <b>{item.label}</b>
                      <span className={item.danger ? 'dangerText' : ''}>{formatMoney(item.value)} / {formatMoney(item.max)}</span>
                    </div>
                    <i><span style={{ width: `${Math.min(100, Math.round((item.value / item.max) * 100))}%`, background: harmonizeContentColor(item.color) }} /></i>
                  </div>
                ))}
            </div>
            <div className="totalRemainingBudgetFooter">
              총 남은 예산: <b>{formatMoney(121000)}</b>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
