import { useState } from 'react';
import Modal from '../common/Modal.jsx';
import { formatMoney, parseMoney } from '../../utils/money.js';

const menuItems = [
  { id: 'profile', icon: '●', title: '프로필 변경', caption: '닉네임, 프로필 이미지 등 관리' },
  { id: 'goal', icon: '◎', title: '목표 설정', caption: '소비 목표와 예산을 관리' },
  { id: 'settings', icon: '⚙', title: '설정', caption: '서비스 설정 및 알림 관리' }
];

export default function ProfileModal({ user, goals = [], onClose, onUserSave, onGoalSave, onGoalAdd, onGoalDelete, onLogout }) {
  const [view, setView] = useState('main');
  const [nickname, setNickname] = useState(user.nickname);
  const [selectedGoalId, setSelectedGoalId] = useState(null); // null means list, otherwise goalId or 'new'
  const [isEditable, setIsEditable] = useState(false);
  const [goalForm, setGoalForm] = useState({
    title: '',
    targetAmountText: '0',
    currentAmountText: '0',
    category: '배달',
    savingRate: 15,
    budgetAmount: 300000,
    budgetAmountText: '300,000',
    isMain: false
  });
  const progress = Math.min(100, Math.round((parseMoney(goalForm.currentAmountText) / Math.max(1, parseMoney(goalForm.targetAmountText))) * 100));

  
  const savingRate = goalForm.savingRate || 0;
  let difficultyClass = 'easy';
  let difficultyEmoji = '🟢';
  let difficultyTitle = '쉬움';
  let difficultyMessage = '안정적이고 실천하기 쉬운 절약 목표예요.';

  if (savingRate > 15 && savingRate <= 40) {
    difficultyClass = 'normal';
    difficultyEmoji = '🟡';
    difficultyTitle = '보통';
    difficultyMessage = '의지적인 노력이 필요한 적정 수준의 목표예요.';
  } else if (savingRate > 40) {
    difficultyClass = 'hard';
    difficultyEmoji = '🔴';
    difficultyTitle = '어려움';
    difficultyMessage = '사용자가 너무 과한 목표를 잡은 것 같아요! 무리한 목표는 중도 포기를 유발할 수 있어요.';
  }

  const title = view === 'main'
    ? '마이페이지'
    : view === 'profile'
      ? '프로필 변경'
      : view === 'goal'
        ? '목표 설정'
        : '설정';

  function saveGoal() {
    const payload = {
      ...goalForm,
      targetAmount: parseMoney(goalForm.targetAmountText),
      currentAmount: parseMoney(goalForm.currentAmountText),
      budgetAmount: parseMoney(goalForm.budgetAmountText || formatMoney(goalForm.budgetAmount)),
    };
    
    if (selectedGoalId === 'new') {
      onGoalAdd(payload);
    } else {
      onGoalSave(payload);
    }
    setSelectedGoalId(null);
    setIsEditable(false);
  }

  function HeaderBack() {
    if (view === 'main') return null;
    if (view === 'goal' && selectedGoalId !== null) {
      return (
        <button type="button" className="profileBackButton" onClick={() => setSelectedGoalId(null)} aria-label="뒤로가기">‹</button>
      );
    }
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
            {selectedGoalId === null ? (
              /* Goal List View */
              <div className="goalListContainer">
                <div className="goalListHeader" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
                  <span style={{ fontSize: '13px', color: 'var(--muted)', fontWeight: 600 }}>나의 소비 목표 ({goals.length})</span>
                  <button 
                    type="button" 
                    className="solidButton small" 
                    style={{ width: 'auto', minHeight: '34px', padding: '0 12px', borderRadius: '10px', fontSize: '12px' }}
                    onClick={() => {
                      setSelectedGoalId('new');
                      setGoalForm({
                        title: '',
                        targetAmountText: '1,000,000',
                        currentAmountText: '0',
                        startDate: new Date().toISOString().split('T')[0],
                        endDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                        category: '배달',
                        savingRate: 15,
                        budgetAmount: 300000,
                        budgetAmountText: '300,000',
                        isMain: goals.length === 0
                      });
                      setIsEditable(true);
                    }}
                  >
                    + 새 목표 추가
                  </button>
                </div>

                <div className="goalCardList" style={{ display: 'grid', gap: '12px', maxHeight: '380px', overflowY: 'auto', paddingRight: '4px' }}>
                  {goals.length === 0 ? (
                    <div className="emptyState" style={{ padding: '40px', textAlign: 'center', opacity: 0.6 }}>등록된 목표가 없습니다. 새 목표를 추가해 보세요!</div>
                  ) : (
                    goals.map(g => {
                      const rate = Math.min(100, Math.round((g.currentAmount / g.targetAmount) * 100));
                      return (
                        <div key={g.goalId} className="goalItemCard" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', borderRadius: '18px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                          <div 
                            className="goalItemInfo" 
                            style={{ flex: 1, cursor: 'pointer' }}
                            onClick={() => {
                              setSelectedGoalId(g.goalId);
                              setGoalForm({
                                ...g,
                                targetAmountText: formatMoney(g.targetAmount),
                                currentAmountText: formatMoney(g.currentAmount),
                                category: g.category || '배달',
                                savingRate: g.savingRate || 25,
                                budgetAmount: g.budgetAmount || 500000,
                                budgetAmountText: formatMoney(g.budgetAmount || 500000)
                              });
                              setIsEditable(false);
                            }}
                          >
                            <div className="goalItemTitleRow" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                              <span className={`goalTypeBadge ${g.isMain ? 'mainGoal' : 'subGoal'}`} style={{ 
                                padding: '2px 8px', 
                                borderRadius: '6px', 
                                fontSize: '10px', 
                                fontWeight: 700,
                                background: g.isMain ? 'rgba(91,141,239,0.2)' : 'rgba(255,255,255,0.1)',
                                color: g.isMain ? '#5b8def' : 'var(--soft)',
                                border: g.isMain ? '1px solid rgba(91,141,239,0.3)' : '1px solid rgba(255,255,255,0.15)'
                              }}>
                                {g.isMain ? '대목표' : '소목표'}
                              </span>
                              <strong style={{ fontSize: '15px', color: 'var(--ink)' }}>{g.title}</strong>
                            </div>
                            <div className="goalItemProgress">
                              <div className="progressTrack" style={{ margin: '6px 0' }}><span style={{ width: `${rate}%` }} /></div>
                              <span style={{ fontSize: '11px', color: 'var(--muted)' }}>{rate}% ({formatMoney(g.currentAmount)} / {formatMoney(g.targetAmount)})</span>
                            </div>
                          </div>
                          
                          <button 
                            type="button" 
                            className="goalDeleteBtn" 
                            style={{ 
                              background: 'rgba(242,85,85,0.15)', 
                              border: '1px solid rgba(242,85,85,0.25)', 
                              color: '#f25555', 
                              padding: '6px 12px', 
                              borderRadius: '10px', 
                              fontSize: '11px', 
                              fontWeight: 700,
                              cursor: 'pointer'
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              if (confirm(`'${g.title}' 목표를 삭제하시겠습니까?`)) {
                                onGoalDelete(g.goalId);
                              }
                            }}
                          >
                            삭제
                          </button>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            ) : (
              /* Goal Detail Edit View */
              <>
                {/* Edit Mode Toggle */}
                <div className="editToggleRow">
                  <span>수정 모드 활성화</span>
                  <label className="toggleSwitch">
                    <input 
                      type="checkbox" 
                      checked={isEditable} 
                      onChange={event => setIsEditable(event.target.checked)} 
                    />
                    <span className="toggleSlider"></span>
                  </label>
                </div>

                {/* Split layout: Side-by-Side columns */}
                <div className="goalSplitLayout">
                  {/* Left Column: Basic Goal Info */}
                  <div className="goalSplitCol">
                    <h3 className="subSectionTitle" style={{ marginTop: 0 }}>기본 목표 정보</h3>
                    
                    <label>
                      목표 구분
                      <div className="goalTypeToggleGroup" style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                        <button
                          type="button"
                          className={`goalTypeRadioBtn ${goalForm.isMain ? 'active' : ''}`}
                          style={{
                            flex: 1,
                            height: '42px',
                            borderRadius: '12px',
                            border: '1px solid ' + (goalForm.isMain ? '#5b8def' : 'rgba(255,255,255,0.1)'),
                            background: goalForm.isMain ? 'rgba(91,141,239,0.16)' : 'rgba(255,255,255,0.05)',
                            color: goalForm.isMain ? '#5b8def' : 'var(--soft)',
                            fontWeight: 700,
                            cursor: isEditable ? 'pointer' : 'not-allowed'
                          }}
                          onClick={() => isEditable && setGoalForm(prev => ({ ...prev, isMain: true }))}
                          disabled={!isEditable}
                        >
                          대목표 (1개 제한)
                        </button>
                        <button
                          type="button"
                          className={`goalTypeRadioBtn ${!goalForm.isMain ? 'active' : ''}`}
                          style={{
                            flex: 1,
                            height: '42px',
                            borderRadius: '12px',
                            border: '1px solid ' + (!goalForm.isMain ? '#2fbfa6' : 'rgba(255,255,255,0.1)'),
                            background: !goalForm.isMain ? 'rgba(47,191,166,0.16)' : 'rgba(255,255,255,0.05)',
                            color: !goalForm.isMain ? '#2fbfa6' : 'var(--soft)',
                            fontWeight: 700,
                            cursor: isEditable ? 'pointer' : 'not-allowed'
                          }}
                          onClick={() => isEditable && goals.length > 0 && setGoalForm(prev => ({ ...prev, isMain: false }))}
                          disabled={!isEditable || (goalForm.isMain && goals.filter(g => g.goalId !== goalForm.goalId).length === 0 && selectedGoalId !== 'new')}
                        >
                          소목표
                        </button>
                      </div>
                    </label>

                    <label>
                      목표명
                      <input 
                        value={goalForm.title} 
                        onChange={event => setGoalForm(prev => ({ ...prev, title: event.target.value }))} 
                        disabled={!isEditable}
                      />
                    </label>
                    <label>
                      목표 금액
                      <input 
                        value={goalForm.targetAmountText} 
                        onChange={event => setGoalForm(prev => ({ ...prev, targetAmountText: event.target.value }))} 
                        disabled={!isEditable}
                      />
                    </label>
                    <div className="dateGrid">
                      <label>
                        시작일
                        <input 
                          type="date" 
                          value={goalForm.startDate} 
                          onChange={event => setGoalForm(prev => ({ ...prev, startDate: event.target.value }))} 
                          disabled={!isEditable}
                        />
                      </label>
                      <label>
                        종료일
                        <input 
                          type="date" 
                          value={goalForm.endDate} 
                          onChange={event => setGoalForm(prev => ({ ...prev, endDate: event.target.value }))} 
                          disabled={!isEditable}
                        />
                      </label>
                    </div>
                    {selectedGoalId !== 'new' && (
                      <div className="goalProgressPreview" style={{ marginTop: '16px' }}>
                        <span>현재 진행률</span>
                        <div><i style={{ width: `${progress}%` }} /></div>
                        <b>{goalForm.currentAmountText} / {goalForm.targetAmountText} ({progress}%)</b>
                      </div>
                    )}
                  </div>

                  {/* Right Column: Budget Setting Section */}
                  <div className="goalSplitCol">
                    <h3 className="subSectionTitle" style={{ marginTop: 0 }}>예산 및 절약 목표</h3>
                    
                    <div className="budgetGrid">
                      <label>
                        카테고리
                        <select 
                          value={goalForm.category} 
                          onChange={event => setGoalForm(prev => ({ ...prev, category: event.target.value }))}
                          disabled={!isEditable}
                        >
                          <option value="생활용품">생활용품</option>
                          <option value="배달">배달</option>
                          <option value="쇼핑">쇼핑</option>
                          <option value="카페">카페</option>
                          <option value="교통">교통</option>
                        </select>
                      </label>
                      
                      <label>
                        예산 금액
                        <input 
                          type="text" 
                          value={goalForm.budgetAmountText} 
                          onChange={event => setGoalForm(prev => ({ ...prev, budgetAmountText: event.target.value }))}
                          disabled={!isEditable}
                          placeholder="500,000"
                        />
                      </label>
                    </div>

                    <label className="savingRateLabel">
                      절약률 (%)
                      <div className="savingRateInputWrapper">
                        <input 
                          type="number" 
                          min="0" 
                          max="100" 
                          value={goalForm.savingRate} 
                          onChange={event => setGoalForm(prev => ({ ...prev, savingRate: Math.min(100, Math.max(0, parseInt(event.target.value) || 0)) }))}
                          disabled={!isEditable}
                        />
                        <span>%</span>
                      </div>
                    </label>

                    {/* 위험도 표시 (Difficulty Alert) */}
                    <div className={`difficultyAlert ${difficultyClass}`} style={{ marginTop: '14px' }}>
                      <span className="difficultyEmoji" style={{ fontSize: '18px' }}>{difficultyEmoji}</span>
                      <div className="difficultyText">
                        <strong>{difficultyTitle} (절약률 {goalForm.savingRate}%)</strong>
                        <p style={{ fontSize: '11px', marginTop: '2px' }}>{difficultyMessage}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Save Action Row */}
                <div className="goalSaveActionRow" style={{ marginTop: '24px' }}>
                  <button 
                    type="button" 
                    className="solidButton" 
                    onClick={saveGoal}
                    disabled={!isEditable}
                    style={{ 
                      width: '100%',
                      opacity: isEditable ? 1 : 0.5, 
                      cursor: isEditable ? 'pointer' : 'not-allowed'
                    }}
                  >
                    저장하기
                  </button>
                </div>
              </>
            )}
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
