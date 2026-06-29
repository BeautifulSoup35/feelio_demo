import { useMemo } from 'react';
import GlassCard from '../components/common/GlassCard.jsx';
import { formatMoney } from '../utils/money.js';
import { aiEmotionComments } from '../constants/aiComments.js';

export default function ContentPage({ state, theme, onToggleTheme }) {
  const expenses = state.transactions.filter(item => item.transactionType === 'EXPENSE');
  const totalExpense = expenses.reduce((sum, item) => sum + item.amount, 0);
  const emotionalExpense = expenses
    .filter(item => item.tags.some(tagId => ['e1', 'e2', 'e3', 'e5', 'e7'].includes(tagId)))
    .reduce((sum, item) => sum + item.amount, 0);
  const leakRate = totalExpense ? Math.round((emotionalExpense / totalExpense) * 100) : 0;

  // Extract unique emotion tags recorded in user's expenses
  const userEmotions = useMemo(() => {
    const emotionSet = new Set();
    state.transactions
      .filter(item => item.transactionType === 'EXPENSE')
      .forEach(item => {
        item.tags.forEach(tagId => {
          if (tagId.startsWith('e')) {
            emotionSet.add(tagId);
          }
        });
      });
    return Array.from(emotionSet);
  }, [state.transactions]);

  return (
    <div className="pageGrid contentGrid">
      <div className="pageLead">
        <div>
          <p>Content</p>
          <h1>콘텐츠</h1>
        </div>
        <button
          type="button"
          className="themeToggleButtonMobile"
          onClick={onToggleTheme}
          aria-label="테마 전환"
        >
          {theme === 'day' ? '☀️' : '🌙'}
        </button>
      </div>

      <GlassCard className="parallelCard">
        <div className="sectionTitle compact">
          <span>평행우주 · 2029년의 나</span>
          <strong>같은 출발선에서 갈라진 선택</strong>
        </div>
        <div className="parallelGrid">
          <div className="futureCard good">
            <div className="futureIcon">🏡</div>
            <div className="futureContent">
              <span className="futureTag">감정소비 막은 나</span>
              <strong>전세 아파트 입주</strong>
              <small>보증금 2.4억 · 목표 3년 앞당김</small>
            </div>
          </div>
          <div className="futureCard quiet">
            <div className="futureIcon">🏢</div>
            <div className="futureContent">
              <span className="futureTag">그대로 쓴 나</span>
              <strong>월세 원룸 4년째</strong>
              <small>매달 -65만 · 모은 돈 거의 없음</small>
            </div>
          </div>
        </div>
        <div className="parallelSummary">
          <p className="summaryLabel">감정소비를 월 18만씩만 막아도</p>
          <h2 className="summaryAmount">+65,000,000원</h2>
          <p className="cardText">3년 뒤 두 우주의 사이는 현재의 작은 선택에서 시작돼요.</p>
        </div>
      </GlassCard>

      <GlassCard className="reportCard">
        <div className="sectionTitle compact">
          <span>6월 감정소비 리포트</span>
          <strong>AI가 정리한 이번 달</strong>
        </div>
        <p className="cardText">
          이번 달 감정소비 누수율은 <b>{leakRate}%</b>예요. 그중 피곤과 스트레스가 붙은 배달/카페 소비가 반복되고 있어요.
          새벽 시간대 소비가 지난주보다 증가했습니다.
        </p>
      </GlassCard>

      <div className="insightStack">
        {userEmotions.length === 0 ? (
          <div className="insightCard blue">
            <strong>감정 기록이 없습니다</strong>
            <span>오늘 소비에서 느낀 감정을 기록하면 AI가 분석 코멘트를 이곳에 정리해 줍니다.</span>
          </div>
        ) : (
          userEmotions.map((tagId, index) => {
            const commentInfo = aiEmotionComments[tagId];
            if (!commentInfo) return null;
            const colors = ['blue', 'gold', 'pink'];
            const cardColor = colors[index % colors.length];
            return (
              <div className={`insightCard ${cardColor}`} key={tagId}>
                <strong>{commentInfo.emoji} {commentInfo.name} 소비 시그널</strong>
                <span>{commentInfo.comment}</span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
