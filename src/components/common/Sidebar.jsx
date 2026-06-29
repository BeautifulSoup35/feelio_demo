import Logo from './Logo.jsx';
import { CalendarIcon, ContentIcon, HomeIcon } from './Icons.jsx';

const tabs = [
  { key: 'home', label: '홈', Icon: HomeIcon },
  { key: 'calendar', label: '캘린더', Icon: CalendarIcon },
  { key: 'content', label: '콘텐츠', Icon: ContentIcon }
];

export default function Sidebar({ currentTab, onChange, user, onProfile, theme, onToggleTheme }) {
  return (
    <aside className="sidebar">
      <Logo />
      <div className="sideMenu">
        {tabs.map(tab => (
          <button
            key={tab.key}
            type="button"
            className={`sideButton ${currentTab === tab.key ? 'active' : ''}`}
            onClick={() => onChange(tab.key)}
          >
            <tab.Icon size={20} />
            {tab.label}
          </button>
        ))}
      </div>
      
      <div className="sidebarThemeToggle">
        <button
          type="button"
          className={`themeToggleBtn ${theme === 'day' ? 'active' : ''}`}
          onClick={() => theme !== 'day' && onToggleTheme()}
          aria-label="라이트 테마"
        >
          ☀️ 데이
        </button>
        <button
          type="button"
          className={`themeToggleBtn ${theme === 'night' ? 'active' : ''}`}
          onClick={() => theme !== 'night' && onToggleTheme()}
          aria-label="다크 테마"
        >
          🌙 나이트
        </button>
      </div>

      <button type="button" className="profileMini" onClick={onProfile}>
        <span className="profileAvatar">{user.nickname.slice(0, 1)}</span>
        <span>
          <strong>{user.nickname}</strong>
          <small>{user.provider} 계정</small>
        </span>
      </button>
    </aside>
  );
}
