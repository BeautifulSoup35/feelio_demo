import styled from '@emotion/styled';
import { theme } from '../../styles/theme.js';
import { driftA, driftB } from '../../styles/animations.js';
import { Sidebar } from './Sidebar.jsx';
import { BottomNav } from './BottomNav.jsx';

const Shell = styled.div`
  --bg-1: ${({ mode }) => mode === 'dark' ? '#12141e' : '#f6f2eb'};
  --bg-2: ${({ mode }) => mode === 'dark' ? '#0b0d15' : '#ede6dc'};
  --card: ${({ mode }) => mode === 'dark' ? 'rgba(255,255,255,.055)' : 'rgba(255,255,255,.34)'};
  --card-strong: ${({ mode }) => mode === 'dark' ? 'rgba(255,255,255,.085)' : 'rgba(255,255,255,.52)'};
  --card-border: ${({ mode }) => mode === 'dark' ? 'rgba(255,255,255,.12)' : 'rgba(255,255,255,.58)'};
  --text: ${({ mode }) => mode === 'dark' ? '#ECEBF0' : '#3a352f'};
  --sub: ${({ mode }) => mode === 'dark' ? '#9a97a8' : '#8a837a'};
  --ink: ${({ mode }) => mode === 'dark' ? '#ECEBF0' : '#2b2723'};
  --on-ink: ${({ mode }) => mode === 'dark' ? '#141220' : '#fbf9f6'};
  --line: ${({ mode }) => mode === 'dark' ? 'rgba(255,255,255,.10)' : 'rgba(50,42,32,.10)'};
  --modal-bg: ${({ mode }) => mode === 'dark' ? 'rgba(22,24,34,.58)' : 'rgba(248,245,240,.58)'};
  --scrim: ${({ mode }) => mode === 'dark' ? 'rgba(5,6,12,.42)' : 'rgba(40,32,24,.22)'};
  --shadow: ${({ mode }) => mode === 'dark' ? theme.darkShadow : theme.shadow};
  position: relative;
  min-height: 100vh;
  overflow-x: hidden;
  background: linear-gradient(160deg, var(--bg-1), var(--bg-2));
`;

const Orb = styled.div`
  position: fixed;
  pointer-events: none;
  border-radius: 50%;
  filter: blur(80px);
  opacity: ${({ mode }) => mode === 'dark' ? .46 : .62};
  mix-blend-mode: ${({ mode }) => mode === 'dark' ? 'screen' : 'multiply'};
`;

const Main = styled.main`
  position: relative;
  z-index: 2;
  min-height: 100vh;
  padding: 32px 44px 42px 266px;

  @media (max-width: 820px) {
    padding: 22px 16px 96px;
  }
`;

const Top = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  width: min(100%, 1240px);
  margin: 0 auto 12px;

  p {
    margin: 0;
    color: var(--sub);
    font-size: 13px;
    font-weight: 700;
  }

  h1 {
    margin: 2px 0 0;
    font-size: 24px;
    letter-spacing: -.02em;
  }
`;

const IconButton = styled.button`
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 1px solid var(--card-border);
  background: var(--card);
  cursor: pointer;
  backdrop-filter: blur(20px);
`;

export function AppLayout({ route, title, state, actions, onRoute, onProfile, children }) {
  const colors = theme.auroras[state.aurora] || theme.auroras.mint;

  return (
    <Shell mode={state.mode}>
      <Orb mode={state.mode} style={{ width: 520, height: 520, left: '10%', top: '8%', background: colors[0], animation: `${driftA} 14s ease-in-out infinite` }} />
      <Orb mode={state.mode} style={{ width: 600, height: 600, right: '-8%', top: '22%', background: colors[2], animation: `${driftB} 16s ease-in-out infinite` }} />
      <Orb mode={state.mode} style={{ width: 420, height: 420, left: '34%', bottom: '-16%', background: colors[1] }} />
      <Sidebar route={route} onRoute={onRoute} user={state.user} onProfile={onProfile} />
      <Main>
        <Top>
          <div>
            <p>2026년 7월 1일 수요일</p>
            <h1>{title}</h1>
          </div>
          <IconButton type="button" onClick={actions.toggleMode} aria-label="화면 모드 전환">
            {state.mode === 'dark' ? '☾' : '☼'}
          </IconButton>
        </Top>
        {children}
      </Main>
      <BottomNav route={route} onRoute={onRoute} />
    </Shell>
  );
}

