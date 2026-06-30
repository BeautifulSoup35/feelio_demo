import GlassCard from '../components/common/GlassCard.jsx';
import { EmotionBlob } from '../components/home/EmotionBlob.jsx';
import { BlobEmpty, RidgeEmpty } from '../components/home/EmptyStates.jsx';
import { MoodRidge } from '../components/home/MoodRidge.jsx';
import { formatMoney } from '../utils/money.js';
import { formatKoreanDateWithWeekday, toDateKey, todayKey } from '../utils/date.js';
import { taggedEmotionData, topEmotion } from '../utils/emotionInsights.js';

const RIDGE_MIN_TAGS = 5;
const MONTHLY_BUDGET = 760000;

export default function HomePage({ state, onProfile }) {
  const mainGoal = state.goals.find(goal => goal.isMain) || state.goals[0];
  const expenseTotal = state.transactions
    .filter(item => item.transactionType === 'EXPENSE')
    .reduce((sum, item) => sum + item.amount, 0);
  const emotionalExpense = state.transactions
    .filter(item => item.transactionType === 'EXPENSE' && item.tags.some(tagId => /^e\d+$/.test(tagId)))
    .reduce((sum, item) => sum + item.amount, 0);
  const leakRate = expenseTotal ? Math.round((emotionalExpense / expenseTotal) * 100) : 0;
  const budgetUsedRate = MONTHLY_BUDGET ? Math.round((expenseTotal / MONTHLY_BUDGET) * 100) : 0;
  const isBudgetOver = expenseTotal > MONTHLY_BUDGET;
  const remainingBudget = Math.max(0, MONTHLY_BUDGET - expenseTotal);
  const overBudgetAmount = Math.max(0, expenseTotal - MONTHLY_BUDGET);
  const goalRate = Math.min(100, Math.round((mainGoal.currentAmount / mainGoal.targetAmount) * 100));
  const today = todayKey();
  const monthKey = today.slice(0, 7);
  const monthlyEmotionTransactions = state.transactions.filter(item => (
    item.transactionType === 'EXPENSE' && toDateKey(item.transactionAt).slice(0, 7) === monthKey
  ));
  const { data: emotionData, totalTags } = taggedEmotionData(
    monthlyEmotionTransactions,
    state.tags
  );
  const signalEmotion = totalTags >= 1 ? topEmotion(emotionData) : '평온';
  const todayLabel = formatKoreanDateWithWeekday(new Date());

  return (
    <div className="pageGrid homeGrid">
      <div className="pageLead">
        <div>
          <p>{todayLabel}</p>
          <h1>안녕, {state.user.nickname}</h1>
        </div>
        <button type="button" className="profileButton" onClick={onProfile}>{state.user.nickname.slice(0, 1)}</button>
      </div>

      <div className="homeMain">
        <div className="homeMalliOnly" aria-label="감정말랑이">
          <div className="homeMalliWalker">
            <div className="homeMalliOnlyStage">
              {totalTags >= 1
                ? <EmotionBlob emotion={signalEmotion} size={260} variant="svg" interactive={true} />
                : (
                  <button type="button" className="defaultBlobButton" aria-label="기본 말랑이 누르기">
                    <BlobEmpty size={260} />
                  </button>
                )}
            </div>
          </div>
          <p>{totalTags >= 1 ? `${signalEmotion} 말랑이` : '첫 감정을 기다리는 말랑이'}</p>
        </div>
        <div className="moodRidgeFrame">
          {totalTags >= RIDGE_MIN_TAGS
            ? <MoodRidge data={emotionData} />
            : <RidgeEmpty />}
        </div>
      </div>

      <div className="homeAside">
        <GlassCard className="homeGoalCard">
          <div className="metricHeader">
            <span>{mainGoal.title}</span>
            <strong>{goalRate}%</strong>
          </div>
          <div className="progressTrack mint"><span style={{ width: `${goalRate}%` }} /></div>
          <p className="cardText">
            {formatMoney(mainGoal.currentAmount)} / {formatMoney(mainGoal.targetAmount)}
            <br />
            감정소비를 줄인 돈이 목표에 가까워지는 중이에요.
          </p>
        </GlassCard>

        <GlassCard className="homeMetricCard homeBudgetCard">
          <div className="sectionTitle compact">
            <span>예산</span>
            <strong>{isBudgetOver ? '예산 초과 · 감정 누수율' : '이번 달 예산'}</strong>
          </div>
          <div className="metricHeader budgetMetricHeader">
            <span>{isBudgetOver ? '초과 구간 감정소비 비중' : '예산 사용률'}</span>
            <strong>{isBudgetOver ? leakRate : budgetUsedRate}%</strong>
          </div>
          <div className={`progressTrack budgetTrack ${isBudgetOver ? 'over' : ''}`}>
            <span style={{ width: `${Math.min(100, budgetUsedRate)}%` }} />
          </div>
          <p className="cardText">
            {isBudgetOver
              ? `예산을 ${formatMoney(overBudgetAmount)} 초과했어요. 초과 소비 중 감정 태그가 붙은 흐름을 먼저 확인해봐요.`
              : `이번 달 예산 ${formatMoney(MONTHLY_BUDGET)} 중 ${formatMoney(expenseTotal)}을 사용했어요.`}
          </p>
          <div className="budgetMiniStats">
            <span>
              <small>남은 예산</small>
              <b>{formatMoney(remainingBudget)}</b>
            </span>
            <span>
              <small>{isBudgetOver ? '초과 금액' : '총 지출'}</small>
              <b>{formatMoney(isBudgetOver ? overBudgetAmount : expenseTotal)}</b>
            </span>
            <span>
              <small>감정소비</small>
              <b>{formatMoney(emotionalExpense)}</b>
            </span>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
