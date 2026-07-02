/** @jsxImportSource @emotion/react */
import { useState } from 'react';
import { Modal } from '../common/Modal.jsx';
import { EmotionBlob } from '../common/EmotionBlob.jsx';
import { auroras } from '../../data/auroras.js';

export default function ProfileModal({ state, actions, onClose }) {
  const [view, setView] = useState('main');
  const [nickname, setNickname] = useState(state.user.nickname);

  function saveProfile() {
    actions.updateUser({ nickname });
    onClose();
  }

  return (
    <Modal onClose={onClose}>
      <div css={{ padding: '26px 28px' }}>
        {view === 'main' && (
          <>
            <div css={{ textAlign: 'center', padding: '6px 0 20px' }}><EmotionBlob emotion="설렘" size={86} interactive={false} /><h2>{state.user.nickname}</h2><p css={{ color: 'var(--sub)' }}>{state.user.provider} 계정</p></div>
            {[
              ['profile', '프로필 수정'],
              ['aurora', '화면 · 오로라'],
              ['data', '데이터 관리'],
              ['account', '계정 관리']
            ].map(([key, label]) => <button key={key} type="button" onClick={() => setView(key)} css={{ width: '100%', display: 'flex', justifyContent: 'space-between', border: 0, borderBottom: '1px solid var(--line)', background: 'transparent', padding: '15px 0', fontWeight: 800, cursor: 'pointer' }}>{label}<span>›</span></button>)}
            <button type="button" onClick={actions.logout} css={{ width: '100%', marginTop: 18, border: 0, borderRadius: 14, padding: 14, background: 'var(--ink)', color: 'var(--on-ink)', fontWeight: 900 }}>로그아웃</button>
          </>
        )}
        {view === 'profile' && <Sub title="프로필 수정" back={() => setView('main')}><input value={nickname} onChange={e => setNickname(e.target.value)} css={{ width: '100%', border: '1px solid var(--line)', borderRadius: 14, padding: 14, background: 'var(--card)' }} /><button onClick={saveProfile} css={primaryButton}>저장하기</button></Sub>}
        {view === 'aurora' && <Sub title="화면 설정" back={() => setView('main')}><div css={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>{auroras.map(item => <button key={item.id} onClick={() => actions.setAurora(item.id)} css={{ border: state.aurora === item.id ? '1px solid var(--ink)' : '1px solid var(--line)', borderRadius: 14, padding: 14, background: 'var(--card)', cursor: 'pointer' }}><span css={{ display: 'flex' }}>{item.colors.map(color => <i key={color} css={{ width: 20, height: 20, borderRadius: '50%', background: color, marginRight: -6 }} />)}</span><b>{item.name}</b></button>)}</div></Sub>}
        {view === 'data' && <Sub title="데이터 관리" back={() => setView('main')}><p css={{ color: 'var(--sub)' }}>모든 거래와 감정 기록을 초기화할 수 있어요.</p><button onClick={actions.resetData} css={{ ...primaryButton, background: '#E87573' }}>전체 기록 초기화</button></Sub>}
        {view === 'account' && <Sub title="계정 관리" back={() => setView('main')}><p css={{ color: 'var(--sub)' }}>탈퇴하면 지금까지 기록한 감정과 거래, 목표가 사라져요.</p><button onClick={actions.logout} css={{ ...primaryButton, background: '#E87573' }}>탈퇴 진행</button></Sub>}
      </div>
    </Modal>
  );
}

function Sub({ title, back, children }) {
  return <><div css={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}><button onClick={back} css={{ border: 0, background: 'transparent', fontSize: 22, cursor: 'pointer', color: 'var(--sub)' }}>‹</button><h2 css={{ margin: 0, fontSize: 20 }}>{title}</h2></div><div css={{ display: 'grid', gap: 16 }}>{children}</div></>;
}

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

