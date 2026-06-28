import GlassCard from '../components/common/GlassCard.jsx';
import { formatMoney } from '../utils/money.js';

export default function ContentPage({ state }) {
  const expenses = state.transactions.filter(item => item.transactionType === 'EXPENSE');
  const totalExpense = expenses.reduce((sum, item) => sum + item.amount, 0);
  const emotionalExpense = expenses
    .filter(item => item.tags.some(tagId => ['e1', 'e2', 'e3', 'e5', 'e7'].includes(tagId)))
    .reduce((sum, item) => sum + item.amount, 0);
  const leakRate = totalExpense ? Math.round((emotionalExpense / totalExpense) * 100) : 0;

  return (
    <div className="pageGrid contentGrid">
      <div className="pageLead">
        <div>
          <p>Content</p>
          <h1>콘텐츠</h1>
        </div>
      </div>

      <GlassCard className="parallelCard">
        <div className="sectionTitle compact">
          <span>평행우주 · 2029년</span>
          <strong>같은 출발점, 다른 미래</strong>
        </div>
        <div className="parallelGrid">
          <div className="futureCard good">
            <span>A</span>
            <strong>감정소비를 막은 나</strong>
            <small>3년 뒤 주거 선택지 +6,500만원</small>
          </div>
          <div className="futureCard quiet">
            <span>B</span>
            <strong>그대로 쓴 나</strong>
            <small>매달 월세 부담 -65만원</small>
          </div>
        </div>
        <p className="cardText">월 18만원의 감정소비만 줄여도, 3년 뒤 선택지가 달라져요.</p>
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
        <div className="insightCard blue">
          <strong>야근 1번, 지갑이 열린다</strong>
          <span>저녁 이후 소비의 78%가 피곤 또는 스트레스 태그와 연결돼요.</span>
        </div>
        <div className="insightCard gold">
          <strong>월급날 다음 3일이 위험해요</strong>
          <span>보상소비가 평소보다 2.3배 높아지는 구간이에요.</span>
        </div>
        <div className="insightCard pink">
          <strong>감정소비 금액</strong>
          <span>{formatMoney(emotionalExpense)}가 이번 달 감정소비로 분류됐어요.</span>
        </div>
      </div>
    </div>
  );
}
