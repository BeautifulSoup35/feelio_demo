import { useState } from 'react';
import Modal from '../common/Modal.jsx';
import { formatMoney, parseMoney } from '../../utils/money.js';

const menuItems = [
  { id: 'profile', icon: '●', title: '프로필 변경', caption: '닉네임, 프로필 이미지 등 관리' },
  { id: 'goal', icon: '◎', title: '목표 설정', caption: '소비 목표와 예산을 관리' },
  { id: 'settings', icon: '⚙', title: '설정', caption: '서비스 설정 및 알림 관리' }
];

export default function ProfileModal({ user, goal, onClose, onUserSave, onGoalSave, onLogout }) {
  const [view, setView] = useState('main');
  const [nickname, setNickname] = useState(user.nickname);
  const [goalForm, setGoalForm] = useState({
    ...goal,
    targetAmountText: formatMoney(goal.targetAmount),
    currentAmountText: formatMoney(goal.currentAmount)
  });
  const progress = Math.min(100, Math.round((parseMoney(goalForm.currentAmountText) / Math.max(1, parseMoney(goalForm.targetAmountText))) * 100));
  const title = view === 'main'
    ? '마이페이지'
    : view === 'profile'
      ? '프로필 변경'
      : view === 'goal'
        ? '목표 설정'
        : '설정';

  function saveGoal() {
    onGoalSave({
      ...goalForm,
      targetAmount: parseMoney(goalForm.targetAmountText),
      currentAmount: parseMoney(goalForm.currentAmountText),
      isMain: true
    });
  }

  function HeaderBack() {
    if (view === 'main') return null;
    return (
      <button type="button" className="profileBackButton" onClick={() => setView('main')} aria-label="뒤로가기">‹</button>
    );
  }

  return (
    <Modal title={title} onClose={onClose}>
      <div className={`profilePanel page-${view}`}>
        <HeaderBack />

        {view === 'main' && (
          <>
            <div className="profileHero compact">
              <div className="profileAvatar large">{nickname.slice(0, 1)}</div>
              <div>
                <strong>{nickname}</strong>
                <span>{user.email}</span>
                <small>{user.provider} 계정</small>
              </div>
            </div>

            <div className="profileMenuList">
              {menuItems.map(item => (
                <button type="button" className="profileMenuItem" key={item.id} onClick={() => setView(item.id)}>
                  <span className={`profileMenuIcon ${item.id}`}>{item.icon}</span>
                  <span>
                    <strong>{item.title}</strong>
                    <small>{item.caption}</small>
                  </span>
                  <b>›</b>
                </button>
              ))}
            </div>

            <button type="button" className="dangerButton" onClick={onLogout}>로그아웃</button>
          </>
        )}

        {view === 'profile' && (
          <section className="profileSubPage">
            <div className="profileEditAvatar">
              <div className="profileAvatar large">{nickname.slice(0, 1)}</div>
              <span>▣</span>
            </div>
            <label>
              닉네임
              <input value={nickname} onChange={event => setNickname(event.target.value)} />
            </label>
            <label>
              이메일
              <input value={user.email} readOnly />
            </label>
            <label>
              계정
              <input value={`${user.provider} 계정 (OAuth 연결됨)`} readOnly />
            </label>
            <button type="button" className="solidButton" onClick={() => onUserSave({ nickname })}>저장하기</button>
          </section>
        )}

        {view === 'goal' && (
          <section className="profileSubPage">
            <label>
              목표명
              <input value={goalForm.title} onChange={event => setGoalForm(prev => ({ ...prev, title: event.target.value }))} />
            </label>
            <label>
              목표 금액
              <input value={goalForm.targetAmountText} onChange={event => setGoalForm(prev => ({ ...prev, targetAmountText: event.target.value }))} />
            </label>
            <div className="dateGrid">
              <label>
                시작일
                <input type="date" value={goalForm.startDate} onChange={event => setGoalForm(prev => ({ ...prev, startDate: event.target.value }))} />
              </label>
              <label>
                종료일
                <input type="date" value={goalForm.endDate} onChange={event => setGoalForm(prev => ({ ...prev, endDate: event.target.value }))} />
              </label>
            </div>
            <div className="goalProgressPreview">
              <span>현재 진행률</span>
              <div><i style={{ width: `${progress}%` }} /></div>
              <b>{goalForm.currentAmountText} / {goalForm.targetAmountText} ({progress}%)</b>
            </div>
            <button type="button" className="solidButton" onClick={saveGoal}>저장하기</button>
          </section>
        )}

        {view === 'settings' && (
          <section className="profileSubPage settingsPage">
            <div className="settingGroup">
              <strong>알림 설정</strong>
              <label><span>일일 소비 리마인드</span><input type="checkbox" defaultChecked /></label>
              <label><span>주간 리포트 알림</span><input type="checkbox" defaultChecked /></label>
              <label><span>목표 달성 알림</span><input type="checkbox" defaultChecked /></label>
            </div>
            <div className="settingGroup">
              <strong>테마 설정</strong>
              <label><span>시스템 설정 따름</span><input type="radio" name="theme" defaultChecked /></label>
              <label><span>다크 모드</span><input type="radio" name="theme" /></label>
              <label><span>라이트 모드</span><input type="radio" name="theme" /></label>
            </div>
            <div className="settingGroup">
              <strong>기타 설정</strong>
              <button type="button">데이터 백업 ›</button>
            </div>
            <button type="button" className="solidButton">저장하기</button>
          </section>
        )}
      </div>
    </Modal>
  );
}
