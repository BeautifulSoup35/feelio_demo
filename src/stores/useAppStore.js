import { useEffect, useMemo, useState } from 'react';
import { initialState } from '../constants/mockData.js';

const STORAGE_KEY = 'feelio-app-state-v1';

function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? { ...initialState, ...JSON.parse(saved) } : initialState;
  } catch {
    return initialState;
  }
}

export function useAppStore() {
  const [state, setState] = useState(loadState);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const actions = useMemo(() => ({
    login(provider) {
      setState(prev => ({
        ...prev,
        isLoggedIn: true,
        user: { ...prev.user, provider }
      }));
    },
    logout() {
      setState(prev => ({ ...prev, isLoggedIn: false }));
    },
    updateUser(userPatch) {
      setState(prev => ({ ...prev, user: { ...prev.user, ...userPatch } }));
    },
    addTransaction(transaction) {
      setState(prev => ({
        ...prev,
        transactions: [
          { ...transaction, transactionId: Date.now() },
          ...prev.transactions
        ]
      }));
    },
    updateGoal(goalPatch) {
      setState(prev => ({
        ...prev,
        goals: prev.goals.map(goal => (
          goal.goalId === goalPatch.goalId
            ? { ...goal, ...goalPatch }
            : goalPatch.isMain
              ? { ...goal, isMain: false }
              : goal
        ))
      }));
    }
  }), []);

  return { state, actions };
}
