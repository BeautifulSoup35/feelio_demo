import { useEffect, useMemo, useState } from 'react';
import LoginPage from './components/auth/LoginPage.jsx';
import BottomNav from './components/common/BottomNav.jsx';
import Sidebar from './components/common/Sidebar.jsx';
import ProfileModal from './components/profile/ProfileModal.jsx';
import HomePage from './pages/HomePage.jsx';
import CalendarPage from './pages/CalendarPage.jsx';
import ContentPage from './pages/ContentPage.jsx';
import { useAppStore } from './stores/useAppStore.js';

export default function App() {
  const { state, actions } = useAppStore();
  const [currentTab, setCurrentTab] = useState('home');
  const [profileOpen, setProfileOpen] = useState(false);

  const theme = state.theme || 'night';
  const mainGoal = useMemo(() => state.goals.find(goal => goal.isMain) || state.goals[0], [state.goals]);

  useEffect(() => {
    if (theme === 'day') {
      document.body.classList.add('theme-day');
      document.body.classList.remove('theme-night');
    } else {
      document.body.classList.add('theme-night');
      document.body.classList.remove('theme-day');
    }
  }, [theme]);

  if (!state.isLoggedIn) {
    return <LoginPage onLogin={actions.login} />;
  }

  return (
    <div className="appShell">
      <div className="aurora a1" />
      <div className="aurora a2" />
      <div className="aurora a3" />
      <div className="moodMascot" aria-hidden="true">
        <span className="mascotEye left" />
        <span className="mascotEye right" />
        <span className="mascotMouth" />
      </div>
      <Sidebar
        currentTab={currentTab}
        onChange={setCurrentTab}
        user={state.user}
        onProfile={() => setProfileOpen(true)}
        theme={theme}
        onToggleTheme={actions.toggleTheme}
      />
      <main className="mainSurface">
        {currentTab === 'home' && (
          <HomePage
            state={state}
            onAddTransaction={actions.addTransaction}
            onProfile={() => setProfileOpen(true)}
            theme={theme}
            onToggleTheme={actions.toggleTheme}
          />
        )}
        {currentTab === 'calendar' && (
          <CalendarPage
            state={state}
            onAddTransaction={actions.addTransaction}
            theme={theme}
            onToggleTheme={actions.toggleTheme}
          />
        )}
        {currentTab === 'content' && (
          <ContentPage
            state={state}
            theme={theme}
            onToggleTheme={actions.toggleTheme}
          />
        )}
      </main>
      <BottomNav currentTab={currentTab} onChange={setCurrentTab} />
      {profileOpen && (
        <ProfileModal
          user={state.user}
          goals={state.goals}
          onClose={() => setProfileOpen(false)}
          onUserSave={actions.updateUser}
          onGoalSave={actions.updateGoal}
          onGoalAdd={actions.addGoal}
          onGoalDelete={actions.deleteGoal}
          onLogout={() => {
            actions.logout();
            setProfileOpen(false);
          }}
        />
      )}
    </div>
  );
}
