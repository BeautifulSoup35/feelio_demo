import GlassCard from '../components/common/GlassCard.jsx';
import EmotionExpenseCard from '../components/home/EmotionExpenseCard.jsx';
import { EmotionBlob } from '../components/home/EmotionBlob.jsx';
import { BlobEmpty, RidgeEmpty } from '../components/home/EmptyStates.jsx';
import { MoodRidge } from '../components/home/MoodRidge.jsx';
import { formatMoney } from '../utils/money.js';
import { formatKoreanDateWithWeekday, toDateKey, todayKey } from '../utils/date.js';
import { makeEmotionSignalMessage, taggedEmotionData, topEmotion } from '../utils/emotionInsights.js';

const RIDGE_MIN_TAGS = 5;

export default function HomePage({ state, onAddTransaction, onProfile }) {
  const mainGoal = state.goals.find(goal => goal.isMain) || state.goals[0];
  const expenseTotal = state.transactions
    .filter(item => item.transactionType === 'EXPENSE')
    .reduce((sum, item) => sum + item.amount, 0);
  const emotionalExpense = state.transactions
    .filter(item => item.transactionType === 'EXPENSE' && item.tags.some(tagId => /^e\d+$/.test(tagId)))
    .reduce((sum, item) => sum + item.amount, 0);
  const leakRate = expenseTotal ? Math.round((emotionalExpense / expenseTotal) * 100) : 0;
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
  const signalCount = emotionData.find(item => item.name === signalEmotion)?.value || 0;
  const signalPercent = totalTags ? `${Math.round((signalCount / totalTags) * 100)}%` : '0%';
  const signalMessage = totalTags >= 1
    ? makeEmotionSignalMessage(signalEmotion, signalPercent)
    : '소비에 감정 태그가 붙으면 오늘의 소비 신호를 바로 보여드릴게요.';
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
        <EmotionExpenseCard onSubmit={onAddTransaction} />
        <div className="moodRidgeFrame">
          {totalTags >= RIDGE_MIN_TAGS
            ? <MoodRidge data={emotionData} />
            : <RidgeEmpty />}
        </div>
      </div>

      <div className="homeAside">
        <GlassCard className="homeMetricCard">
          <div className="metricHeader">
            <span>이번 달 감정소비 누적율</span>
            <strong>{leakRate}%</strong>
          </div>
          <div className="progressTrack"><span style={{ width: `${leakRate}%` }} /></div>
          <p className="cardText">스트레스가 쌓인 밤마다 배달 소비가 반복되고 있어요. 이번 주는 4번 중 1번만 쉬어가도 목표에 가까워져요.</p>
        </GlassCard>

        <GlassCard className="aiSignalCard">
          <div>
            <div className="sectionTitle compact">
              <span>AI 코멘트</span>
              <strong>오늘의 소비 신호</strong>
            </div>
            <p className="cardText">{signalMessage}</p>
          </div>
          <div className="signalBlobWrap">
            {totalTags >= 1
              ? (
                <EmotionBlob
                  emotion={signalEmotion}
                  size={150}
                  variant="svg"
                  interactive={true}
                />
              )
              : (
                <button type="button" className="defaultBlobButton" aria-label="기본 말랑이 누르기">
                  <BlobEmpty size={150} />
                </button>
              )}
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
