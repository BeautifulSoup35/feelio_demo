import styled from '@emotion/styled';
import { routes } from '../../app/routes.js';
import { EmotionBlob } from './EmotionBlob.jsx';

const Aside = styled.aside`
  position: fixed;
  left: 14px;
  top: 14px;
  bottom: 14px;
  z-index: 30;
  width: 224px;
  display: flex;
  flex-direction: column;
  gap: 18px;
  padding: 20px 16px;
  border-radius: 28px;
  background: var(--card-strong);
  border: 1px solid var(--card-border);
  box-shadow: var(--shadow);
  backdrop-filter: blur(30px) saturate(1.3);

  @media (max-width: 820px) {
    display: none;
  }
`;

const Brand = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 2px 6px 4px;

  strong {
    display: block;
    font-size: 20px;
    letter-spacing: -.02em;
  }

  span {
    display: block;
    margin-top: -2px;
    color: var(--sub);
    font-size: 10.5px;
  }
`;

const Nav = styled.nav`
  display: grid;
  gap: 5px;
`;

const NavButton = styled.button`
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  border: 0;
  border-radius: 16px;
  padding: 13px 14px;
  background: ${({ active }) => active ? 'var(--card-strong)' : 'transparent'};
  color: ${({ active }) => active ? 'var(--text)' : 'var(--sub)'};
  font-size: 14.5px;
  font-weight: 700;
  text-align: left;
  cursor: pointer;
  box-shadow: ${({ active }) => active ? '0 12px 28px rgba(0,0,0,.06)' : 'none'};
`;

const Profile = styled.button`
  margin-top: auto;
  display: flex;
  align-items: center;
  gap: 11px;
  padding: 11px;
  border-radius: 18px;
  border: 1px solid var(--line);
  background: var(--card);
  cursor: pointer;
  text-align: left;

  i {
    width: 38px;
    height: 38px;
    border-radius: 50%;
    display: grid;
    place-items: center;
    flex: 0 0 auto;
    background: linear-gradient(135deg,#FF8A62,#F2C766);
    color: #fff;
    font-style: normal;
    font-weight: 800;
  }

  strong, small {
    display: block;
  }

  small {
    color: var(--sub);
    margin-top: 2px;
  }
`;

export function SidebarDc({ route, onRoute, user, onProfile }) {
  return (
    <Aside>
      <Brand>
        <EmotionBlob emotion="설렘" size={40} interactive={false} />
        <div><strong>feelio</strong><span>Feel + I/O</span></div>
      </Brand>
      <Nav>
        {routes.map(item => (
          <NavButton key={item.key} type="button" active={route === item.key} onClick={() => onRoute(item.key)}>
            <span>{item.icon}</span>{item.label}
          </NavButton>
        ))}
      </Nav>
      <Profile type="button" onClick={onProfile}>
        <i>{user.nickname.slice(0, 1)}</i>
        <span><strong>{user.nickname}</strong><small>{user.provider} 계정</small></span>
      </Profile>
    </Aside>
  );
}

