import { useEffect, useMemo, useState } from 'react';
import LoginPage from './components/auth/LoginPage.jsx';
import BottomNav from './components/common/BottomNav.jsx';
import Sidebar from './components/common/Sidebar.jsx';
import ProfileModal from './components/profile/ProfileModal.jsx';
import HomePage from './pages/HomePage.jsx';
import TransactionsPage from './pages/TransactionsPage.jsx';
import CalendarPage from './pages/CalendarPage.jsx';
import AnalysisPage from './pages/AnalysisPage.jsx';
import ContentPage from './pages/ContentPage.jsx';
import OnboardingPage from './pages/OnboardingPage.jsx';
import { useAppStore } from './stores/useAppStore.js';

const auroraThemes = {
  blue: ['rgba(91, 141, 239, .82)', 'rgba(47, 191, 166, .55)', 'rgba(255, 122, 107, .42)'],
  mint: ['rgba(47, 191, 166, .78)', 'rgba(91, 141, 239, .46)', 'rgba(245, 166, 35, .34)'],
  pink: ['rgba(243, 95, 168, .70)', 'rgba(138, 108, 255, .52)', 'rgba(91, 141, 239, .36)'],
  gold: ['rgba(245, 166, 35, .64)', 'rgba(255, 122, 107, .44)', 'rgba(47, 191, 166, .36)'],
  lavender: ['rgba(190, 170, 255, .62)', 'rgba(136, 210, 255, .42)', 'rgba(255, 188, 232, .36)'],
  sky: ['rgba(126, 205, 255, .62)', 'rgba(178, 235, 255, .42)', 'rgba(157, 180, 255, .34)'],
  peach: ['rgba(255, 190, 170, .58)', 'rgba(255, 221, 150, .40)', 'rgba(255, 157, 202, .34)'],
  lime: ['rgba(180, 235, 150, .56)', 'rgba(92, 216, 196, .42)', 'rgba(255, 230, 140, .32)']
};
export default function App() {
  const { state, actions } = useAppStore();
  const [currentTab, setCurrentTab] = useState('home');
  const [profileOpen, setProfileOpen] = useState(false);
  const [theme, setTheme] = useState(() => (
    localStorage.getItem('feelio_theme') || 'dark'
  ));
  const [onboardingCompleted, setOnboardingCompleted] = useState(() => (
    localStorage.getItem('feelio_onboarding_completed') === 'true'
  ));

  const mainGoal = useMemo(() => state.goals.find(goal => goal.isMain) || state.goals[0], [state.goals]);
  const auroraColors = auroraThemes[state.user.auroraTheme || 'blue'] || auroraThemes.blue;
  const auroraStyle = {
    '--aurora-1': auroraColors[0],
    '--aurora-2': auroraColors[1],
    '--aurora-3': auroraColors[2]
  };

  useEffect(() => {
    localStorage.setItem('feelio_theme', theme);
  }, [theme]);

  if (!state.isLoggedIn) {
    return <LoginPage onLogin={actions.login} />;
  }

  if (!onboardingCompleted) {
    return (
      <OnboardingPage
        mainGoal={mainGoal}
        onComplete={({ goalPatch }) => {
          actions.updateGoal(goalPatch);
          setOnboardingCompleted(true);
          setCurrentTab('home');
        }}
      />
    );
  }

  return (
    <div className={`appShell theme-${theme}`} style={auroraStyle}>
      <div className="aurora a1" />
      <div className="aurora a2" />
      <div className="aurora a3" />
      <div className="moodMascot" aria-hidden="true">
        <span className="mascotEye left" />
        <span className="mascotEye right" />
        <span className="mascotMouth" />
      </div>
      <Sidebar currentTab={currentTab} onChange={setCurrentTab} user={state.user} onProfile={() => setProfileOpen(true)} />
      <button
        type="button"
        className="themeToggleButton"
        onClick={() => setTheme(prev => (prev === 'dark' ? 'light' : 'dark'))}
        aria-label={theme === 'dark' ? '라이트 모드로 변경' : '다크 모드로 변경'}
        title={theme === 'dark' ? '라이트 모드' : '다크 모드'}
      >
        <span className="themeToggleTrack">
          <span className="themeToggleThumb" />
        </span>
        <span className="themeToggleText">{theme === 'dark' ? 'Dark' : 'Light'}</span>
      </button>
      <main className="mainSurface">
        {currentTab === 'home' && (
          <HomePage state={state} onProfile={() => setProfileOpen(true)} />
        )}
        {currentTab === 'transactions' && (
          <TransactionsPage
            state={state}
            onAddTransaction={actions.addTransaction}
            onRemoveTransaction={actions.removeTransaction}
          />
        )}
        {currentTab === 'calendar' && (
          <CalendarPage state={state} onAddTransaction={actions.addTransaction} onRemoveTransaction={actions.removeTransaction} />
        )}
        {currentTab === 'analysis' && (
          <AnalysisPage state={state} />
        )}
        {currentTab === 'content' && (
          <ContentPage state={state} />
        )}
      </main>
      <BottomNav currentTab={currentTab} onChange={setCurrentTab} />
      {profileOpen && (
        <ProfileModal
          user={state.user}
          goal={mainGoal}
          onClose={() => setProfileOpen(false)}
          onUserSave={actions.updateUser}
          onGoalSave={actions.updateGoal}
          onLogout={() => {
            actions.logout();
            setProfileOpen(false);
          }}
        />
      )}
    </div>
  );
}
