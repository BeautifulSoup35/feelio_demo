import GlassCard from '../components/common/GlassCard.jsx';
import EmotionExpenseCard, { EmotionWaveCard } from '../components/home/EmotionExpenseCard.jsx';
import { formatMoney } from '../utils/money.js';

export default function HomePage({ state, onAddTransaction, onProfile }) {
  const mainGoal = state.goals.find(goal => goal.isMain) || state.goals[0];
  const expenseTotal = state.transactions
    .filter(item => item.transactionType === 'EXPENSE')
    .reduce((sum, item) => sum + item.amount, 0);
  const emotionalExpense = state.transactions
    .filter(item => item.transactionType === 'EXPENSE' && item.tags.some(tagId => ['e1', 'e2', 'e3', 'e5', 'e7'].includes(tagId)))
    .reduce((sum, item) => sum + item.amount, 0);
  const leakRate = expenseTotal ? Math.round((emotionalExpense / expenseTotal) * 100) : 0;
  const goalRate = Math.min(100, Math.round((mainGoal.currentAmount / mainGoal.targetAmount) * 100));

  return (
    <div className="pageGrid homeGrid">
      <div className="pageLead">
        <div>
          <p>6월 25일 목요일</p>
          <h1>안녕, {state.user.nickname}</h1>
        </div>
        <button type="button" className="profileButton" onClick={onProfile}>{state.user.nickname.slice(0, 1)}</button>
      </div>

      <div className="homeMain">
        <EmotionExpenseCard onSubmit={onAddTransaction} />
        <EmotionWaveCard />
      </div>

      <div className="homeAside">
        <GlassCard className="homeMetricCard">
          <div className="metricHeader">
            <span>이번 달 감정소비 누적율</span>
            <strong>{leakRate}%</strong>
          </div>
          <div className="progressTrack"><span style={{ width: `${leakRate}%` }} /></div>
          <p className="cardText">피곤한 밤마다 배달 소비가 반복되고 있어요. 이번 주는 4번 중 1번만 쉬어가도 목표에 가까워져요.</p>
        </GlassCard>

        <GlassCard className="aiSignalCard">
          <div>
            <div className="sectionTitle compact">
              <span>AI 코멘트</span>
              <strong>오늘의 소비 신호</strong>
            </div>
            <p className="cardText">스트레스 태그가 붙은 소비가 전체 흐름의 32%를 차지해요. 야근 직장인은 결제 전 10분 쉬어가기 루틴을 추천합니다.</p>
          </div>
          <div className="signalBlob" aria-hidden="true">
            <span className="signalEye left" />
            <span className="signalEye right" />
            <span className="signalMouth" />
          </div>
        </GlassCard>

        <GlassCard className="homeGoalCard">
          <div className="metricHeader">
            <span>{mainGoal.title}</span>
            <strong>{goalRate}%</strong>
          </div>
          <div className="progressTrack mint"><span style={{ width: `${goalRate}%` }} /></div>
          <p className="cardText">{formatMoney(mainGoal.currentAmount)} / {formatMoney(mainGoal.targetAmount)}</p>
        </GlassCard>
      </div>
    </div>
  );
}
