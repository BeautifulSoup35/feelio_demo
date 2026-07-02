/** @jsxImportSource @emotion/react */
import { useState } from 'react';
import styled from '@emotion/styled';
import { Modal } from '../common/Modal.jsx';
import { EmotionBlob } from '../common/EmotionBlob.jsx';
import { auroras } from '../../data/aurorasDc.js';
import { money, percent } from '../../utils/format.js';

const Header = styled.div`
  display: grid;
  grid-template-columns: 64px 1fr 36px;
  align-items: center;
  gap: 16px;

  h2 {
    margin: 0;
    font-size: 22px;
  }

  p {
    margin: 3px 0 0;
    color: var(--sub);
  }
`;

const Close = styled.button`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 0;
  background: var(--line);
  color: var(--sub);
  cursor: pointer;
`;

const GoalStrip = styled.div`
  margin: 24px 0 22px;
  display: grid;
  grid-template-columns: 1fr 54px;
  align-items: center;
  gap: 12px;
  padding: 16px 18px;
  border-radius: 20px;
  background: rgba(255,255,255,.22);
  border: 1px solid var(--line);
`;

const Row = styled.button`
  width: 100%;
  display: grid;
  grid-template-columns: 1fr auto 18px;
  align-items: center;
  gap: 12px;
  border: 0;
  border-bottom: 1px solid var(--line);
  background: transparent;
  padding: 15px 10px;
  text-align: left;
  cursor: pointer;
  font-size: 15px;
  font-weight: 700;

  span {
    color: var(--sub);
    font-weight: 600;
  }
`;

const Logout = styled.button`
  width: 100%;
  margin-top: 18px;
  border: 0;
  border-radius: 14px;
  padding: 14px;
  background: rgba(255,255,255,.34);
  color: var(--sub);
  font-weight: 800;
  cursor: pointer;
`;

const FixedShell = styled.div`
  height: 100%;
  box-sizing: border-box;
  padding: 30px;
  overflow-y: auto;
  overscroll-behavior: contain;
`;

export default function ProfileModalDc({ state, actions, onClose }) {
  const [view, setView] = useState('main');
  const [nickname, setNickname] = useState(state.user.nickname);
  const goal = state.goals[0];
  const goalPct = percent(goal.current, goal.target);

  function saveProfile() {
    actions.updateUser({ nickname });
    onClose();
  }

  return (
    <Modal
      onClose={onClose}
      width="min(560px, calc(100vw - 40px))"
      height="min(668px, calc(100vh - 40px))"
      maxHeight="calc(100vh - 40px)"
      overflow="hidden"
    >
      <FixedShell>
        {view === 'main' && (
          <>
            <Header>
              <span css={{ width: 64, height: 64, borderRadius: '50%', background: 'linear-gradient(135deg,#FF8A62,#F2C766)', color: '#fff', display: 'grid', placeItems: 'center', fontSize: 24, fontWeight: 800 }}>{state.user.nickname.slice(0, 1)}</span>
              <div><h2>{state.user.nickname}</h2><p>seoyeon@feelio.app · {state.user.provider} 계정</p></div>
              <Close type="button" onClick={onClose}>×</Close>
            </Header>
            <GoalStrip>
              <div><small css={{ color: 'var(--sub)', fontWeight: 800 }}>대표 목표</small><strong css={{ display: 'block', marginTop: 4 }}>{goal.name} · {goalPct}%</strong></div>
              <EmotionBlob emotion="뿌듯함" size={52} interactive={false} />
            </GoalStrip>
            {[
              ['profile', '프로필 수정', state.user.nickname],
              ['goals', '목표 관리', `${state.goals.length}개`],
              ['tags', '태그 관리', ''],
              ['noti', '알림 설정', ''],
              ['aurora', '화면 · 오로라', '블루'],
              ['data', '데이터 관리', ''],
              ['account', '계정 관리', '']
            ].map(([key, label, meta]) => <Row key={key} type="button" onClick={() => setView(key)}>{label}<span>{meta}</span><b>›</b></Row>)}
            <Logout type="button" onClick={actions.logout}>로그아웃</Logout>
          </>
        )}
        {view === 'profile' && <Sub title="프로필 수정" back={() => setView('main')}><input value={nickname} onChange={e => setNickname(e.target.value)} css={inputStyle} /><button onClick={saveProfile} css={primaryButton}>저장하기</button></Sub>}
        {view === 'goals' && <Sub title="목표 관리" back={() => setView('main')}><p>{goal.name}: {money(goal.current)} / {money(goal.target)}</p></Sub>}
        {view === 'tags' && <Sub title="태그 관리" back={() => setView('main')}><p css={{ color: 'var(--sub)' }}>감정 태그는 Feelio 기본 8종을 사용해요.</p></Sub>}
        {view === 'noti' && <Sub title="알림 설정" back={() => setView('main')}><p css={{ color: 'var(--sub)' }}>기록 리마인더와 주간 리포트 알림을 준비 중이에요.</p></Sub>}
        {view === 'aurora' && (
          <Sub title="화면 설정" back={() => setView('main')}>
            <div css={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 0 18px', borderBottom: '1px solid var(--line)', marginBottom: 16 }}>
              <div>
                <div css={{ fontSize: 14.5, fontWeight: 900 }}>다크 모드</div>
                <div css={{ fontSize: 12, color: 'var(--sub)', marginTop: 2 }}>어두운 무광 글래스로 전환해요</div>
              </div>
              <button
                type="button"
                onClick={actions.toggleMode}
                css={{
                  width: 46,
                  height: 27,
                  border: 0,
                  borderRadius: 99,
                  background: state.mode === 'dark' ? 'var(--ink)' : 'var(--line)',
                  position: 'relative',
                  cursor: 'pointer'
                }}
                aria-label="다크 모드 전환"
              >
                <span css={{
                  position: 'absolute',
                  top: 3,
                  left: state.mode === 'dark' ? 22 : 3,
                  width: 21,
                  height: 21,
                  borderRadius: '50%',
                  background: '#fff',
                  boxShadow: '0 1px 3px rgba(0,0,0,.2)',
                  transition: 'left .2s'
                }} />
              </button>
            </div>
            <div css={{ fontSize: 12.5, color: 'var(--sub)', marginBottom: 14 }}>오로라 색상 · 배경에 크게 흐르는 세 개의 오로라 색</div>
            <div css={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {auroras.map(item => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => actions.setAurora(item.id)}
                  css={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '13px 15px',
                    borderRadius: 16,
                    border: state.aurora === item.id ? '2px solid var(--ink)' : '2px solid var(--line)',
                    background: 'var(--card)',
                    color: 'var(--text)',
                    cursor: 'pointer'
                  }}
                >
                  <span css={{ display: 'flex', alignItems: 'center' }}>
                    {item.colors.map((color, index) => <i key={color} css={{ width: 20, height: 20, borderRadius: '50%', background: color, marginLeft: index === 0 ? 0 : -7 }} />)}
                  </span>
                  <span css={{ flex: 1, textAlign: 'right', fontSize: 14, fontWeight: 900 }}>{item.name}</span>
                </button>
              ))}
            </div>
          </Sub>
        )}
        {view === 'data' && <Sub title="데이터 관리" back={() => setView('main')}><p css={{ color: 'var(--sub)' }}>모든 거래와 감정 기록을 초기화할 수 있어요.</p><button onClick={actions.resetData} css={{ ...primaryButton, background: '#E87573' }}>전체 기록 초기화</button></Sub>}
        {view === 'account' && <Sub title="계정 관리" back={() => setView('main')}><p css={{ color: 'var(--sub)' }}>탈퇴하면 지금까지 기록한 감정과 거래, 목표가 사라져요.</p><button onClick={actions.logout} css={{ ...primaryButton, background: '#E87573' }}>탈퇴 진행</button></Sub>}
      </FixedShell>
    </Modal>
  );
}

function Sub({ title, back, children }) {
  return <><div css={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}><button onClick={back} css={{ border: 0, background: 'transparent', fontSize: 22, cursor: 'pointer', color: 'var(--sub)' }}>‹</button><h2 css={{ margin: 0, fontSize: 20 }}>{title}</h2></div><div css={{ display: 'grid', gap: 16 }}>{children}</div></>;
}

const inputStyle = {
  width: '100%',
  border: '1px solid var(--line)',
  borderRadius: 14,
  padding: 14,
  background: 'var(--card)'
};

const primaryButton = {
  width: '100%',
  border: 0,
  borderRadius: 14,
  padding: 14,
  background: 'var(--ink)',
  color: 'var(--on-ink)',
  fontWeight: 900,
  cursor: 'pointer'
};
