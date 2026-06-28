import { allTags } from './tags.js';

export const initialUser = {
  userId: 1,
  nickname: '서연',
  profileImageUrl: '',
  provider: 'google',
  email: 'seoyeon@example.com',
  auroraTheme: 'blue'
};

export const initialGoals = [
  {
    goalId: 1,
    title: '내 집 마련',
    targetAmount: 10000000,
    currentAmount: 4200000,
    startDate: '2026-06-01',
    endDate: '2026-12-31',
    isMain: true
  },
  {
    goalId: 2,
    title: '여행비 모으기',
    targetAmount: 2000000,
    currentAmount: 360000,
    startDate: '2026-06-01',
    endDate: '2026-11-30',
    isMain: false
  }
];

export const initialTransactions = [
  {
    transactionId: 1,
    transactionType: 'EXPENSE',
    title: '배달 야식',
    amount: 14500,
    memo: '퇴근 후 너무 지쳐서 안전한 메뉴로 주문했다.',
    transactionAt: '2026-06-25T21:40:00',
    tags: ['c1', 'e1', 's1', 's4']
  },
  {
    transactionId: 2,
    transactionType: 'EXPENSE',
    title: '카페 라떼',
    amount: 6800,
    memo: '오후에 불안해서 잠깐 나갔다.',
    transactionAt: '2026-06-25T16:20:00',
    tags: ['c2', 'e3', 's6']
  },
  {
    transactionId: 3,
    transactionType: 'INCOME',
    title: '월급',
    amount: 2800000,
    memo: '6월 급여',
    transactionAt: '2026-06-24T09:00:00',
    tags: ['i1', 'e4', 's7']
  },
  {
    transactionId: 4,
    transactionType: 'EXPENSE',
    title: '택시',
    amount: 17200,
    memo: '야근 후 막차를 놓쳤다.',
    transactionAt: '2026-06-18T23:10:00',
    tags: ['c4', 'e7', 's1']
  },
  {
    transactionId: 5,
    transactionType: 'EXPENSE',
    title: '쇼핑',
    amount: 39000,
    memo: '기분 전환 겸 샀다.',
    transactionAt: '2026-06-12T20:30:00',
    tags: ['c3', 'e2', 's5']
  }
];

export const initialState = {
  isLoggedIn: false,
  user: initialUser,
  goals: initialGoals,
  transactions: initialTransactions,
  tags: allTags
};
