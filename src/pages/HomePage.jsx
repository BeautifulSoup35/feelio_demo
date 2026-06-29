import { useState, useMemo } from 'react';
import GlassCard from '../components/common/GlassCard.jsx';
import EmotionExpenseCard from '../components/home/EmotionExpenseCard.jsx';
import EmotionFlowCard from '../components/home/EmotionFlowCard.jsx';
import { formatMoney } from '../utils/money.js';
import { aiEmotionComments } from '../constants/aiComments.js';

export default function HomePage({ state, onAddTransaction, onProfile, theme, onToggleTheme }) {
  const [selectedAIEmotion, setSelectedAIEmotion] = useState(null);
  
  const mainGoal = state.goals.find(goal => goal.isMain) || state.goals[0];
  const expenseTotal = state.transactions
    .filter(item => item.transactionType === 'EXPENSE')
    .reduce((sum, item) => sum + item.amount, 0);
  const emotionalExpense = state.transactions
    .filter(item => item.transactionType === 'EXPENSE' && item.tags.some(tagId => ['e1', 'e2', 'e3', 'e5', 'e7'].includes(tagId)))
    .reduce((sum, item) => sum + item.amount, 0);
  const leakRate = expenseTotal ? Math.round((emotionalExpense / expenseTotal) * 100) : 0;
  const goalRate = Math.min(100, Math.round((mainGoal.currentAmount / mainGoal.targetAmount) * 100));

  // Count emotions in actual transactions
  const emotionCounts = useMemo(() => {
    const counts = {};
    state.transactions
      .filter(item => item.transactionType === 'EXPENSE')
      .forEach(item => {
        item.tags.forEach(tagId => {
          if (tagId.startsWith('e')) {
            counts[tagId] = (counts[tagId] || 0) + 1;
          }
        });
      });
    return counts;
  }, [state.transactions]);

  // Find the top felt emotion
  const topEmotionId = useMemo(() => {
    let topId = 'e7'; // Default to 스트레스
    let max = 0;
    Object.entries(emotionCounts).forEach(([tagId, count]) => {
      if (count > max) {
        max = count;
        topId = tagId;
      }
    });
    return topId;
  }, [emotionCounts]);

  const activeEmotionId = selectedAIEmotion || topEmotionId;
  const activeCommentInfo = aiEmotionComments[activeEmotionId] || aiEmotionComments.e7;

  return (
    <div className="pageGrid homeGrid">
      <div className="pageLead">
        <div>
          <p>6월 25일 목요일</p>
          <h1>안녕, {state.user.nickname}</h1>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button
            type="button"
            className="themeToggleButtonMobile"
            onClick={onToggleTheme}
            aria-label="테마 전환"
          >
            {theme === 'day' ? '☀️' : '🌙'}
          </button>
          <button type="button" className="profileButton" onClick={onProfile}>{state.user.nickname.slice(0, 1)}</button>
        </div>
      </div>

      <div className="homeMain">
        <EmotionExpenseCard onSubmit={onAddTransaction} />
        <EmotionFlowCard />
      </div>

      <div className="homeAside">
        <GlassCard>
          <div className="metricHeader">
            <span>이번 달 감정소비 누수율</span>
            <strong>{leakRate}%</strong>
          </div>
          <div className="progressTrack"><span style={{ width: `${leakRate}%` }} /></div>
          <p className="cardText">피곤한 밤마다 배달 소비가 반복되고 있어요. 이번 주는 4번 중 1번만 쉬어가도 목표에 가까워져요.</p>
        </GlassCard>

        <GlassCard>
          <div className="sectionTitle compact">
            <span>AI 코멘트</span>
            <strong>오늘의 소비 신호 · {activeCommentInfo.emoji} {activeCommentInfo.name}</strong>
          </div>
          <p className="cardText commentHighlight" style={{ minHeight: '52px', margin: '12px 0 16px' }}>
            "{activeCommentInfo.comment}"
          </p>
          
          <div className="aiEmotionSelectorLabel">감정별 소비 진단 리포트 둘러보기</div>
          <div className="aiEmotionSelector">
            {Object.entries(aiEmotionComments).map(([tagId, emotion]) => {
              const hasSpent = emotionCounts[tagId] > 0;
              const isSelected = activeEmotionId === tagId;
              return (
                <button
                  key={tagId}
                  type="button"
                  className={`aiEmotionMiniChip ${isSelected ? 'active' : ''} ${hasSpent ? 'hasSpent' : ''}`}
                  onClick={() => setSelectedAIEmotion(tagId)}
                  title={`${emotion.name}${hasSpent ? ` (${emotionCounts[tagId]}회 소비)` : ''}`}
                >
                  <span className="miniChipEmoji">{emotion.emoji}</span>
                  {hasSpent && <i className="spentDot" />}
                </button>
              );
            })}
          </div>
        </GlassCard>

        <GlassCard>
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
