import GlassCard from '../components/common/GlassCard.jsx';
import { EmotionBlob } from '../components/home/EmotionBlob.jsx';
import { BlobEmpty, RidgeEmpty } from '../components/home/EmptyStates.jsx';
import { MoodRidge } from '../components/home/MoodRidge.jsx';
import { formatMoney } from '../utils/money.js';
import { formatKoreanDateWithWeekday, toDateKey, todayKey } from '../utils/date.js';
import { makeEmotionSignalMessage, taggedEmotionData, topEmotion } from '../utils/emotionInsights.js';

const RIDGE_MIN_TAGS = 5;

function findTagName(tags, tagIds, type) {
  return tagIds
    .map(tagId => tags.find(tag => tag.tagId === tagId))
    .find(tag => tag?.type === type)?.name;
}

export default function HomePage({ state, onProfile }) {
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
  const recentTransactions = state.transactions.slice(0, 3);

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
        <GlassCard className="homeMoodCard">
          <div className="sectionTitle compact">
            <span>오늘의 감정 말랑이</span>
            <strong>{totalTags >= 1 ? `${signalEmotion} 말랑이가 보여요` : '아직 첫 감정 기록을 기다려요'}</strong>
          </div>
          <div className="homeMoodBody">
            <div className="homeMoodCopy">
              <p>
                {totalTags >= 1
                  ? `${signalEmotion} 태그가 이번 달 소비 흐름에서 가장 크게 보여요. 숫자보다 먼저 오늘의 감정 상태를 가볍게 확인해보세요.`
                  : '지출/수입 메뉴에서 첫 소비와 감정 태그를 남기면 말랑이가 바로 나타나요.'}
              </p>
              <span>입력은 지출/수입 메뉴에서, 홈은 감정 요약만 보여줘요.</span>
            </div>
            <div className="homeMalliHouse">
              <div className="homeMalliStage">
                {totalTags >= 1
                  ? <EmotionBlob emotion={signalEmotion} size={190} variant="svg" interactive={true} />
                  : (
                    <button type="button" className="defaultBlobButton" aria-label="기본 말랑이 누르기">
                      <BlobEmpty size={190} />
                    </button>
                  )}
              </div>
              <div className="homeMoodStats">
                <span>
                  <small>이번 달 감정 태그</small>
                  <b>{totalTags}개</b>
                </span>
                <span>
                  <small>대표 감정</small>
                  <b>{totalTags >= 1 ? signalEmotion : '대기 중'}</b>
                </span>
              </div>
            </div>
          </div>
        </GlassCard>
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
          <p className="cardText">
            {formatMoney(mainGoal.currentAmount)} / {formatMoney(mainGoal.targetAmount)}
            <br />
            감정소비를 줄인 돈이 목표에 가까워지는 중이에요.
          </p>
        </GlassCard>

        <GlassCard className="homeRecentCard">
          <div className="sectionTitle compact">
            <span>최근 기록</span>
            <strong>방금 쌓인 감정소비 흔적</strong>
          </div>
          <div className="homeRecentList">
            {recentTransactions.length > 0 ? recentTransactions.map(transaction => {
              const emotionName = findTagName(state.tags, transaction.tags, 'EMOTION') || '무덤덤';
              const category = findTagName(state.tags, transaction.tags, 'EXPENSE_CATEGORY')
                || findTagName(state.tags, transaction.tags, 'INCOME_CATEGORY')
                || transaction.title;
              return (
                <article className="homeRecentItem" key={transaction.transactionId}>
                  <span>{emotionName}</span>
                  <div>
                    <b>{category}</b>
                    <small>{transaction.memo || '메모 없음'}</small>
                  </div>
                  <strong>{transaction.transactionType === 'INCOME' ? '+' : '-'}{formatMoney(transaction.amount)}</strong>
                </article>
              );
            }) : (
              <p className="cardText">첫 기록을 남기면 홈에서도 최근 기록이 바로 보여요.</p>
            )}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
