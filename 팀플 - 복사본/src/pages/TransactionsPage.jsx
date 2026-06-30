import { useMemo, useState } from 'react';
import GlassCard from '../components/common/GlassCard.jsx';
import EmotionExpenseCard from '../components/home/EmotionExpenseCard.jsx';
import { allTags } from '../constants/tags.js';
import { formatKoreanDateWithWeekday, toDateKey, todayKey } from '../utils/date.js';
import { formatMoney } from '../utils/money.js';

const tagMap = new Map(allTags.map(tag => [tag.tagId, tag]));
const monthlyBudget = 760000;
const filterLabels = ['전체', '월급', '용돈', '카페', '구독', '쇼핑', '식비', '교통', '편의점', '배달'];
const categoryIcons = {
  배달: '🍜',
  카페: '☕',
  쇼핑: '🛍',
  택시: '🚕',
  편의점: '🏪',
  구독: '◼',
  식비: '🍚',
  교통: '🚕',
  월급: '↥',
  용돈: '＋',
  기타: '•'
};

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

function monthLabel(monthKey) {
  const [year, month] = monthKey.split('-');
  return `${year}년 ${Number(month)}월`;
}

function shiftMonth(monthKey, diff) {
  const [year, month] = monthKey.split('-').map(Number);
  const date = new Date(year, month - 1 + diff, 1);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

function groupByDate(transactions) {
  return transactions.reduce((groups, transaction) => {
    const key = toDateKey(transaction.transactionAt);
    if (!groups[key]) groups[key] = [];
    groups[key].push(transaction);
    return groups;
  }, {});
}

export default function TransactionsPage({ state, onAddTransaction, onRemoveTransaction }) {
  const [selectedMonth, setSelectedMonth] = useState(todayKey().slice(0, 7));
  const [activeFilter, setActiveFilter] = useState('전체');
  const monthlyTransactions = useMemo(() => (
    state.transactions
      .filter(item => toDateKey(item.transactionAt).slice(0, 7) === selectedMonth)
      .sort((a, b) => new Date(b.transactionAt) - new Date(a.transactionAt))
  ), [state.transactions, selectedMonth]);
  const filteredTransactions = useMemo(() => (
    activeFilter === '전체'
      ? monthlyTransactions
      : monthlyTransactions.filter(item => categoryName(item) === activeFilter)
  ), [activeFilter, monthlyTransactions]);
  const groupedTransactions = groupByDate(filteredTransactions);
  const expenseTotal = monthlyTransactions
    .filter(item => item.transactionType === 'EXPENSE')
    .reduce((sum, item) => sum + item.amount, 0);
  const incomeTotal = monthlyTransactions
    .filter(item => item.transactionType === 'INCOME')
    .reduce((sum, item) => sum + item.amount, 0);
  const netBalance = incomeTotal - expenseTotal;
  const remainingBudget = Math.max(0, monthlyBudget - expenseTotal);

  return (
    <div className="pageGrid transactionsDashboard">
      <div className="pageLead transactionsLead">
        <div>
          <p><span className="leadDot">◎</span> 감정과 함께 남기는 가계부</p>
          <h1>지출 · 수입</h1>
        </div>
        <div className="monthStepper" aria-label="월 선택">
          <button type="button" onClick={() => setSelectedMonth(prev => shiftMonth(prev, -1))}>‹</button>
          <strong>{monthLabel(selectedMonth)}</strong>
          <button type="button" onClick={() => setSelectedMonth(prev => shiftMonth(prev, 1))}>›</button>
        </div>
      </div>

      <section className="transactionOverviewStrip" aria-label="이번 달 입출금 요약">
        <article className="overviewPill expense">
          <span>↓</span>
          <div>
            <small>지출</small>
            <strong>{formatMoney(expenseTotal)}</strong>
            <em>{monthlyTransactions.filter(item => item.transactionType === 'EXPENSE').length}건의 지출</em>
          </div>
        </article>
        <article className="overviewPill">
          <span>↥</span>
          <div>
            <small>수입</small>
            <strong>{formatMoney(incomeTotal)}</strong>
          </div>
        </article>
        <article className="overviewPill">
          <span>▰</span>
          <div>
            <small>순 잔액</small>
            <strong>{netBalance >= 0 ? '+' : ''}{formatMoney(netBalance)}</strong>
          </div>
        </article>
        <article className="overviewPill">
          <span>◎</span>
          <div>
            <small>남은 예산</small>
            <strong>{formatMoney(remainingBudget)}</strong>
          </div>
        </article>
      </section>

      <div className="transactionsMain">
        <EmotionExpenseCard onSubmit={onAddTransaction} />
      </div>

      <div className="transactionsAside">
        <GlassCard className="transactionHistoryCard">
          <div className="transactionHistoryHeader">
            <div className="sectionTitle compact">
              <strong>거래 내역</strong>
            </div>
            <span>{filteredTransactions.length}건</span>
          </div>
          <div className="transactionFilterChips" aria-label="거래 분류 필터">
            {filterLabels.map(label => (
              <button
                key={label}
                type="button"
                className={activeFilter === label ? 'active' : ''}
                onClick={() => setActiveFilter(label)}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="transactionHistoryList">
            {filteredTransactions.length > 0 ? Object.entries(groupedTransactions).map(([dateKey, transactions]) => {
              const dailyExpense = transactions
                .filter(item => item.transactionType === 'EXPENSE')
                .reduce((sum, item) => sum + item.amount, 0);
              return (
                <section className="transactionDateGroup" key={dateKey}>
                  <div className="transactionDateHeader">
                    <strong>{formatKoreanDateWithWeekday(`${dateKey}T00:00:00`)}</strong>
                    <span>-{formatMoney(dailyExpense)}</span>
                  </div>
                  {transactions.map(transaction => {
                    const emotions = tagNames(transaction, 'EMOTION');
                    const situations = tagNames(transaction, 'SITUATION');
                    const category = categoryName(transaction);
                    return (
                      <article className="transactionHistoryItem" key={transaction.transactionId}>
                        <span className="transactionCategoryIcon">{categoryIcons[category] || categoryIcons.기타}</span>
                        <div>
                          <strong>{transaction.memo || category}</strong>
                          <small>{category} · {[...emotions, ...situations].map(name => `#${name}`).join(' ') || '태그 없음'}</small>
                        </div>
                        <b className={transaction.transactionType === 'INCOME' ? 'income' : ''}>
                          {transaction.transactionType === 'INCOME' ? '+' : '-'}{formatMoney(transaction.amount)}
                        </b>
                        <button
                          type="button"
                          className="transactionDeleteButton"
                          onClick={() => onRemoveTransaction?.(transaction.transactionId)}
                          aria-label={`${category} 기록 삭제`}
                        >
                          삭제
                        </button>
                      </article>
                    );
                  })}
                </section>
              );
            }) : (
              <div className="transactionEmpty">
                선택한 달 또는 필터에 해당하는 거래가 없어요.
              </div>
            )}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
