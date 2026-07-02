import { useEffect, useMemo, useState } from 'react';
import { mockGoals } from '../data/mockGoals.js';
import { mockTransactions } from '../data/mockTransactions.js';

const STORAGE_KEY = 'feelio-dc-react-state-v1';

const initialState = {
  isLoggedIn: false,
  onboardingDone: false,
  mode: 'light',
  aurora: 'mint',
  user: { nickname: '서연', provider: 'Google' },
  goals: mockGoals,
  transactions: mockTransactions,
  toast: ''
};

function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? { ...initialState, ...JSON.parse(saved) } : initialState;
  } catch {
    return initialState;
  }
}

export function useFeelioStore() {
  const [state, setState] = useState(loadState);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const actions = useMemo(() => ({
    login(provider = 'Google') {
      setState(prev => ({ ...prev, isLoggedIn: true, user: { ...prev.user, provider } }));
    },
    completeOnboarding(goalPatch) {
      setState(prev => ({
        ...prev,
        onboardingDone: true,
        goals: goalPatch ? [{ ...prev.goals[0], ...goalPatch }] : prev.goals
      }));
    },
    logout() {
      setState(prev => ({ ...prev, isLoggedIn: false, onboardingDone: false }));
    },
    toggleMode() {
      setState(prev => ({ ...prev, mode: prev.mode === 'dark' ? 'light' : 'dark' }));
    },
    setAurora(aurora) {
      setState(prev => ({ ...prev, aurora }));
    },
    updateUser(userPatch) {
      setState(prev => ({ ...prev, user: { ...prev.user, ...userPatch } }));
    },
    addTransaction(transaction) {
      setState(prev => ({
        ...prev,
        transactions: [{ id: `t-${Date.now()}`, ...transaction }, ...prev.transactions],
        toast: '기록했어요'
      }));
    },
    updateTransaction(id, patch) {
      setState(prev => ({
        ...prev,
        transactions: prev.transactions.map(item => item.id === id ? { ...item, ...patch } : item),
        toast: '거래를 수정했어요'
      }));
    },
    removeTransaction(id) {
      setState(prev => ({
        ...prev,
        transactions: prev.transactions.filter(item => item.id !== id),
        toast: '기록을 삭제했어요'
      }));
    },
    clearToast() {
      setState(prev => ({ ...prev, toast: '' }));
    },
    resetData() {
      setState(prev => ({ ...prev, transactions: [], toast: '모든 기록을 초기화했어요' }));
    }
  }), []);

  return { state, actions };
}

