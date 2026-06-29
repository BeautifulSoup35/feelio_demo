import { useMemo, useState } from 'react';
import Logo from '../components/common/Logo.jsx';

const goalOptions = [
  { id: 'HOUSE', icon: '🏠', title: '내 집 마련', caption: '가장 가까운 큰 목표를 기준으로 볼게요.' },
  { id: 'EMERGENCY', icon: '🧰', title: '비상금 만들기', caption: '흔들리지 않을 안전망을 준비해요.' },
  { id: 'TRAVEL', icon: '✈️', title: '여행비 모으기', caption: '기대되는 여행을 현실적인 숫자로 바꿔요.' },
  { id: 'REDUCE_SPENDING', icon: '🌱', title: '소비 줄이기', caption: '무리하지 않고 줄일 수 있는 흐름을 찾아요.' },
  { id: 'CUSTOM', icon: '+', title: '직접 입력하기', caption: '나만의 목표 이름으로 시작해요.' }
];

const amountOptions = [
  { label: '500만', value: 5000000 },
  { label: '1,000만', value: 10000000 },
  { label: '3,000만', value: 30000000 }
];

const periodOptions = [
  { label: '3개월', value: '3M', months: 3 },
  { label: '6개월', value: '6M', months: 6 },
  { label: '1년', value: '1Y', months: 12 },
  { label: '2년', value: '2Y', months: 24 },
  { label: '직접 설정', value: 'CUSTOM', months: 12 }
];

function formatWon(value) {
  return `₩ ${Number(value || 0).toLocaleString('ko-KR')}`;
}

function parseMoney(value) {
  return Number(String(value).replace(/[^0-9]/g, '')) || 0;
}

function addMonths(date, months) {
  const next = new Date(date);
  next.setMonth(next.getMonth() + months);
  return next;
}

function toDateInputValue(date) {
  return date.toISOString().slice(0, 10);
}

function SummaryCard({ icon, label, value, complete }) {
  if (!value) return null;

  return (
    <div className={`onboardingSummaryCard ${complete ? 'complete' : ''}`}>
      <span>{icon}</span>
      <div>
        <small>{label}</small>
        <strong>{value}</strong>
      </div>
      {complete && <i>✓</i>}
    </div>
  );
}

function Progress({ step }) {
  return (
    <div className="onboardingProgress" aria-label={`온보딩 ${step} / 5`}>
      <span>{step} / 5</span>
      <div>
        {Array.from({ length: 5 }, (_, index) => (
          <i key={index} className={index < step ? 'active' : ''} />
        ))}
      </div>
    </div>
  );
}

export default function OnboardingPage({ mainGoal, onComplete }) {
  const today = useMemo(() => new Date(), []);
  const defaultGoal = goalOptions[0];
  const [step, setStep] = useState(1);
  const [goalType, setGoalType] = useState(defaultGoal.id);
  const [customGoalTitle, setCustomGoalTitle] = useState('');
  const [targetAmountText, setTargetAmountText] = useState('10,000,000');
  const [targetPeriod, setTargetPeriod] = useState('1Y');
  const [customEndDate, setCustomEndDate] = useState(toDateInputValue(addMonths(today, 12)));
  const [currentAmountText, setCurrentAmountText] = useState('4,200,000');

  const selectedGoal = goalOptions.find(option => option.id === goalType) || defaultGoal;
  const selectedPeriod = periodOptions.find(option => option.value === targetPeriod) || periodOptions[2];
  const targetAmount = parseMoney(targetAmountText);
  const currentAmount = Math.min(parseMoney(currentAmountText), targetAmount || parseMoney(currentAmountText));
  const currentPercent = targetAmount ? Math.round((currentAmount / targetAmount) * 100) : 0;
  const goalTitle = goalType === 'CUSTOM' ? customGoalTitle.trim() : selectedGoal.title;
  const periodLabel = targetPeriod === 'CUSTOM' ? customEndDate : selectedPeriod.label;
  const startDate = toDateInputValue(today);
  const endDate = targetPeriod === 'CUSTOM'
    ? customEndDate
    : toDateInputValue(addMonths(today, selectedPeriod.months));

  const canGoNext = (
    (step === 1 && goalTitle) ||
    (step === 2 && targetAmount > 0) ||
    (step === 3 && targetPeriod) ||
    (step === 4 && currentAmount >= 0) ||
    step === 5
  );

  function goNext() {
    if (!canGoNext) return;
    setStep(prev => Math.min(5, prev + 1));
  }

  function finish() {
    const payload = {
      goalType,
      goalTitle,
      targetAmount,
      targetPeriod,
      targetPeriodLabel: periodLabel,
      currentAmount,
      startDate,
      endDate
    };

    localStorage.setItem('feelio_onboarding', JSON.stringify(payload));
    localStorage.setItem('feelio_onboarding_completed', 'true');

    onComplete?.({
      onboarding: payload,
      goalPatch: {
        goalId: mainGoal?.goalId || 1,
        title: goalTitle,
        targetAmount,
        currentAmount,
        startDate,
        endDate,
        isMain: true
      }
    });
  }

  return (
    <main className="onboardingPage">
      <div className="aurora a1" />
      <div className="aurora a2" />
      <div className="aurora a3" />

      <section className="onboardingBrandPanel">
        <Logo />
        <div>
          <h1>소비의 이유를 감정과 함께 바라볼게요</h1>
          <p>
            몇 가지 정보만 알려주면, Feelio가 목표와 소비 흐름을 연결해
            나에게 맞는 분석을 시작할 수 있어요.
          </p>
        </div>
        <div className="onboardingBlob" aria-hidden="true">
          <i />
          <span>Feelio</span>
        </div>
        <div className="onboardingGentleNote">
          <span>✦</span>
          <div>
            <strong>걱정 마세요, 어렵지 않아요</strong>
            <small>나중에 언제든 다시 바꿀 수 있어요.</small>
          </div>
        </div>
      </section>

      <section className="onboardingFlowPanel">
        <Progress step={step} />

        <div className="onboardingSummaryStack">
          <SummaryCard icon={selectedGoal.icon} label="목표" value={step > 1 ? goalTitle : ''} complete={step > 1} />
          <SummaryCard icon="🪙" label="목표 금액" value={step > 2 ? formatWon(targetAmount) : ''} complete={step > 2} />
          <SummaryCard icon="📅" label="기간" value={step > 3 ? periodLabel : ''} complete={step > 3} />
          <SummaryCard icon="💙" label="현재" value={step > 4 ? formatWon(currentAmount) : ''} complete={step > 4} />
        </div>

        {step === 1 && (
          <div className="onboardingStepCard">
            <span className="onboardingEyebrow">목표 설정</span>
            <h2>어떤 목표를 이루고 싶나요?</h2>
            <p>분석을 나에게 맞추기 위해 가장 가까운 목표 하나만 알려주세요.</p>
            <div className="onboardingOptionList">
              {goalOptions.map(option => (
                <button
                  key={option.id}
                  type="button"
                  className={`onboardingOption ${goalType === option.id ? 'active' : ''}`}
                  onClick={() => setGoalType(option.id)}
                >
                  <span>{option.icon}</span>
                  <div>
                    <strong>{option.title}</strong>
                    <small>{option.caption}</small>
                  </div>
                  <i>{goalType === option.id ? '✓' : ''}</i>
                </button>
              ))}
            </div>
            {goalType === 'CUSTOM' && (
              <label className="onboardingInputLine">
                <span>목표 이름</span>
                <input
                  value={customGoalTitle}
                  onChange={event => setCustomGoalTitle(event.target.value)}
                  placeholder="예: 독립 준비하기"
                />
              </label>
            )}
          </div>
        )}

        {step === 2 && (
          <div className="onboardingStepCard">
            <span className="onboardingEyebrow">목표 금액</span>
            <h2>목표 금액은 어느 정도인가요?</h2>
            <p>부담 없이, 대략적인 금액이어도 충분해요.</p>
            <label className="onboardingMoneyInput">
              <span>목표 금액</span>
              <input
                value={targetAmountText}
                onChange={event => setTargetAmountText(event.target.value)}
                inputMode="numeric"
              />
            </label>
            <div className="onboardingPillGrid">
              {amountOptions.map(option => (
                <button
                  type="button"
                  key={option.value}
                  className={targetAmount === option.value ? 'active' : ''}
                  onClick={() => setTargetAmountText(option.value.toLocaleString('ko-KR'))}
                >
                  {option.label}
                </button>
              ))}
              <button type="button" onClick={() => setTargetAmountText('')}>직접 입력</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="onboardingStepCard">
            <span className="onboardingEyebrow">기간 설정</span>
            <h2>언제까지 이루고 싶나요?</h2>
            <p>대략적인 기간만 있어도 흐름을 더 잘 읽을 수 있어요.</p>
            <div className="onboardingPillGrid period">
              {periodOptions.map(option => (
                <button
                  type="button"
                  key={option.value}
                  className={targetPeriod === option.value ? 'active' : ''}
                  onClick={() => setTargetPeriod(option.value)}
                >
                  {option.label}
                </button>
              ))}
            </div>
            {targetPeriod === 'CUSTOM' && (
              <label className="onboardingInputLine">
                <span>목표 날짜</span>
                <input
                  type="date"
                  value={customEndDate}
                  onChange={event => setCustomEndDate(event.target.value)}
                />
              </label>
            )}
          </div>
        )}

        {step === 4 && (
          <div className="onboardingStepCard">
            <span className="onboardingEyebrow">현재 금액</span>
            <h2>지금 어느 정도 모았나요?</h2>
            <p>현재 위치를 알면 목표까지의 속도를 더 정확하게 볼 수 있어요.</p>
            <label className="onboardingMoneyInput">
              <span>현재 보유 금액</span>
              <input
                value={currentAmountText}
                onChange={event => setCurrentAmountText(event.target.value)}
                inputMode="numeric"
              />
            </label>
            <div className="onboardingRangeWrap">
              <input
                type="range"
                min="0"
                max={Math.max(targetAmount, 1)}
                value={currentAmount}
                onChange={event => setCurrentAmountText(Number(event.target.value).toLocaleString('ko-KR'))}
              />
              <div>
                <span>0원</span>
                <span>{formatWon(targetAmount).replace('₩ ', '')}</span>
              </div>
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="onboardingStepCard complete">
            <div className="onboardingStar" aria-hidden="true">✦</div>
            <h2>이 정도면 충분해요</h2>
            <p>
              이제부터 소비 흐름을 목표에 맞춰 더 나답게 분석해볼게요.
              설정은 나중에 언제든 바꿀 수 있어요.
            </p>
            <div className="onboardingCompleteGrid">
              <span>목표 <b>{goalTitle}</b></span>
              <span>목표 금액 <b>{formatWon(targetAmount)}</b></span>
              <span>기간 <b>{periodLabel}</b></span>
              <span>현재 <b>{formatWon(currentAmount)} ({currentPercent}%)</b></span>
            </div>
          </div>
        )}

        <div className="onboardingFooter">
          {step > 1 && (
            <button type="button" className="onboardingBackButton" onClick={() => setStep(prev => prev - 1)}>
              이전
            </button>
          )}
          <button
            type="button"
            className="onboardingPrimaryButton"
            onClick={step === 5 ? finish : goNext}
            disabled={!canGoNext}
          >
            {step === 5 ? '시작하기' : '다음'}
          </button>
        </div>
      </section>
    </main>
  );
}
