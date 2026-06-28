import { CalendarIcon, ContentIcon, HomeIcon } from './Icons.jsx';

const tabs = [
  { key: 'home', label: '홈', Icon: HomeIcon },
  { key: 'calendar', label: '캘린더', Icon: CalendarIcon },
  { key: 'content', label: '콘텐츠', Icon: ContentIcon }
];

export default function BottomNav({ currentTab, onChange }) {
  return (
    <nav className="bottomNav" aria-label="주요 메뉴">
      {tabs.map(tab => (
        <button
          key={tab.key}
          type="button"
          className={`navButton ${currentTab === tab.key ? 'active' : ''}`}
          onClick={() => onChange(tab.key)}
        >
          <span className="navGlyph"><tab.Icon /></span>
          <span>{tab.label}</span>
        </button>
      ))}
    </nav>
  );
}
