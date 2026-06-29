import { useState } from 'react';
import GlassCard from '../components/common/GlassCard.jsx';

const futureOptions = [
  {
    id: 'steady',
    icon: '🏡',
    title: '전세 아파트 입주',
    subtitle: '보증금 2억 + 목표 3년 앞당김',
    price: 65000000,
    priceText: '+65,000,000원',
    priceSub: '감정소비 막아서 모은 자산',
    factAttackBadge: '🔥 팩폭 한마디 (감정소비 막은 나)',
    factAttackText: '“월 18만 원만 아껴도 3년 뒤 통장에 6,500만 원이 쌓입니다. 지금의 작은 절약이 전세 아파트 열쇠가 됩니다!”',
    tone: 'good'
  },
  {
    id: 'same',
    icon: '🚪',
    title: '월세 원룸 4년째',
    subtitle: '매달 -65만 · 모은 돈 거의 없음',
    price: -650000,
    priceText: '-650,000원',
    priceSub: '매달 새어나가는 월세 및 감정소비',
    factAttackBadge: '⚡️ 팩폭 한마디 (그대로 쓴 나)',
    factAttackText: '“새벽 배달음식과 스트레스성 쇼핑, 계속하면 3년 뒤에도 여전히 이 원룸에서 월세 입금을 누르고 있을 겁니다!”',
    tone: 'quiet'
  }
];

export default function ContentPage() {
  const [selectedFuture, setSelectedFuture] = useState(futureOptions[0]);
  const [flippedId, setFlippedId] = useState(null);

  return (
    <div className="pageGrid contentGrid">
      <div className="pageLead">
        <div>
          <p>감정소비 인사이트</p>
          <h1>콘텐츠</h1>
        </div>
      </div>

      <GlassCard className="parallelCard contentFeatureCard">
        <div className="sectionTitle compact">
          <span>평행우주 · 2029년의 나</span>
          <strong>같은 출발선에서 갈라진 선택 (카드를 터치해 금액 확인)</strong>
        </div>
        <div className="parallelGrid">
          <div className="versusBadge">VS</div>
          {futureOptions.map(option => {
            const isFlipped = flippedId === option.id;
            const isActive = selectedFuture.id === option.id;
            return (
              <div
                key={option.id}
                className={`futureCardWrapper ${isFlipped ? 'flipped' : ''}`}
                onClick={() => {
                  setSelectedFuture(option);
                  setFlippedId(prev => (prev === option.id ? null : option.id));
                }}
              >
                <div className={`futureCardInner ${option.tone} ${isActive ? 'active' : ''}`}>
                  <div className="futureCardFront">
                    <span className="futureIcon">{option.icon}</span>
                    <div className="futureContent">
                      <span className="futureTag">{option.id === 'steady' ? '감정소비 막은 나' : '그대로 쓴 나'}</span>
                      <strong>{option.title}</strong>
                      <small>{option.subtitle}</small>
                    </div>
                  </div>
                  <div className="futureCardBack">
                    <span className="futureIcon">{option.icon}</span>
                    <div className="futureContent">
                      <span className="futureTag">3년 뒤 금액 결과</span>
                      <strong className="futurePriceText">{option.priceText}</strong>
                      <small>{option.priceSub}</small>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="contentPriceReveal">
          <span>{selectedFuture.factAttackBadge}</span>
          <strong className="factAttackMain">{selectedFuture.factAttackText}</strong>
          <p>💡 카드를 클릭하면 뒤집어지면서 금액 결과가 나타납니다.</p>
        </div>
      </GlassCard>

    </div>
  );
}
