import GlassCard from '../components/common/GlassCard.jsx';
import EmotionExpenseCard from '../components/home/EmotionExpenseCard.jsx';
import { allTags } from '../constants/tags.js';
import { formatKoreanDateWithWeekday } from '../utils/date.js';
import { formatMoney } from '../utils/money.js';

const tagMap = new Map(allTags.map(tag => [tag.tagId, tag]));

function tagNames(transaction, type) {
  return transaction.tags
    .map(tagId => tagMap.get(tagId))
    .filter(tag => tag?.type === type)
    .map(tag => tag.name);
}

function categoryName(transaction) {
  return transaction.tags
    .map(tagId => tagMap.get(tagId))
    .find(tag => tag?.type === 'EXPENSE_CATEGORY' || tag?.type === 'INCOME_CATEGORY')?.name || transaction.title;
}

export default function TransactionsPage({ state, onAddTransaction, onRemoveTransaction }) {
  const recentTransactions = state.transactions.slice(0, 8);
  const expenseTotal = state.transactions
    .filter(item => item.transactionType === 'EXPENSE')
    .reduce((sum, item) => sum + item.amount, 0);
  const incomeTotal = state.transactions
    .filter(item => item.transactionType === 'INCOME')
    .reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="pageGrid transactionsGrid">
      <div className="pageLead">
        <div>
          <p>감정과 함께 남기는 가계부</p>
          <h1>지출/수입</h1>
        </div>
      </div>

      <div className="transactionsMain">
        <EmotionExpenseCard onSubmit={onAddTransaction} />
      </div>

      <div className="transactionsAside">
        <GlassCard className="transactionSummaryCard">
          <div className="sectionTitle compact">
            <span>이번 달 기록 요약</span>
            <strong>입출금 흐름</strong>
          </div>
          <div className="transactionSummaryGrid">
            <span>
              <small>출금</small>
              <b>{formatMoney(expenseTotal)}</b>
            </span>
            <span>
              <small>입금</small>
              <b>{formatMoney(incomeTotal)}</b>
            </span>
          </div>
          <p className="cardText">감정 태그와 상황 태그를 함께 남기면 홈, 캘린더, 분석 화면이 같은 데이터로 이어져요.</p>
        </GlassCard>

        <GlassCard className="transactionHistoryCard">
          <div className="sectionTitle compact">
            <span>최근 기록</span>
            <strong>감정 태그가 붙은 소비 목록</strong>
          </div>
          <div className="transactionHistoryList">
            {recentTransactions.length > 0 ? recentTransactions.map(transaction => {
              const emotions = tagNames(transaction, 'EMOTION');
              const situations = tagNames(transaction, 'SITUATION');
              return (
                <article className="transactionHistoryItem" key={transaction.transactionId}>
                  <div>
                    <span>{formatKoreanDateWithWeekday(transaction.transactionAt)}</span>
                    <strong>{categoryName(transaction)}</strong>
                    <p>{transaction.memo || '메모 없음'}</p>
                    <small>{[...emotions, ...situations].map(name => `#${name}`).join(' ') || '태그 없음'}</small>
                  </div>
                  <b className={transaction.transactionType === 'INCOME' ? 'income' : ''}>
                    {transaction.transactionType === 'INCOME' ? '+' : '-'}{formatMoney(transaction.amount)}
                  </b>
                  <button
                    type="button"
                    className="transactionDeleteButton"
                    onClick={() => onRemoveTransaction?.(transaction.transactionId)}
                    aria-label={`${categoryName(transaction)} 기록 삭제`}
                  >
                    삭제
                  </button>
                </article>
              );
            }) : (
              <div className="transactionEmpty">
                첫 기록을 남기면 최근 지출/수입 내역이 여기에 쌓여요.
              </div>
            )}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
