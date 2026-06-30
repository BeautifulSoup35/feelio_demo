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

const timelineData = {
  steady: {
    title: '감정소비를 막은 나의 하루 소비 일과표',
    items: [
      { time: '오전 08:30', text: '모닝 커피 대신 집 커피 ☕️', subText: '4,500원 절약', color: 'blue', type: 'save' },
      { time: '오후 12:00', text: '배달 앱 삭제 후 도시락 🍱', subText: '12,000원 절약', color: 'green', type: 'save' },
      { time: '오후 15:30', text: '스트레스 당 충전 참고 산책 🚶‍♀️', subText: '6,000원 절약', color: 'orange', type: 'save' },
      { time: '오후 19:00', text: '퇴근길 홧김 택시 대신 지하철 🚇', subText: '18,000원 절약', color: 'purple', type: 'save' },
      { time: '오후 22:00', text: '새벽 쇼핑 결제 전 장바구니 방치 🛒', subText: '50,000원+ 방어!', color: 'red', type: 'save' }
    ]
  },
  same: {
    title: '감정소비에 무너진 나의 하루 소비 일과표',
    items: [
      { time: '오전 08:30', text: '피곤하니까 택시 출근 🚕', subText: '- 15,000원 지출', color: 'red', type: 'spend' },
      { time: '오후 12:00', text: '스트레스 폭발, 마라탕 특대 배달 🍜', subText: '- 28,000원 지출', color: 'orange', type: 'spend' },
      { time: '오후 15:30', text: '당 땡겨서 탕후루 3개 결제 🍓', subText: '- 12,000원 지출', color: 'purple', type: 'spend' },
      { time: '오후 19:00', text: '우울하니까 일단 쇼핑몰 장바구니 결제 👗', subText: '- 85,000원 지출', color: 'blue', type: 'spend' },
      { time: '오후 22:00', text: '야식으로 치킨에 맥주 추가 🍗', subText: '- 32,000원 지출', color: 'green', type: 'spend' }
    ]
  }
};

export default function ContentPage() {
  const [selectedFuture, setSelectedFuture] = useState(futureOptions[0]);
  const [flippedId, setFlippedId] = useState(null);
  const [isMailModalOpen, setIsMailModalOpen] = useState(false);

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

      <div className="contentExtraRow">
        {/* 첫 번째 카드: 소비 일과표 타임라인 */}
        <GlassCard className="timelineCard">
          <div className="sectionTitle compact">
            <strong>{timelineData[selectedFuture.id].title}</strong>
          </div>
          <div className="timelineContainer">
            <div className="timelineLine"></div>
            {timelineData[selectedFuture.id].items.map((item, index) => (
              <div key={index} className="timelineItem">
                <div className={`timelineDot ${item.color}`}></div>
                <div className="timelineBox">
                  <span className="timeText">{item.time}</span>
                  <strong>{item.text}</strong>
                  <span className={`saveText ${item.type === 'spend' ? 'danger' : ''}`}>{item.subText}</span>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* 두 번째 카드: 말랑이 편지 */}
        <GlassCard className="mailTriggerCard" onClick={() => setIsMailModalOpen(true)}>
          <div className="mailEnvelopeClosed">
            {/* 닫힌 보라색 편지봉투 CSS 디자인 */}
            <div className="envelopeTop"></div>
            <div className="envelopeRibbon"></div>
            <div className="envelopeSeal">💌</div>
          </div>
          <strong>말랑이가 보낸 편지 도착!</strong>
          <p>클릭해서 편지를 열어보세요</p>
        </GlassCard>
      </div>

      {/* 말랑이 편지 모달 */}
      {isMailModalOpen && (
        <div className="mailModalOverlay" onClick={() => setIsMailModalOpen(false)}>
          <div className="mailModalContent" onClick={e => e.stopPropagation()}>
            <button className="mailCloseBtn" onClick={() => setIsMailModalOpen(false)}>✕</button>
            
            {/* 모달 배경: 말랑이와 열린 편지 편지지 */}
            <div className="mailModalBackground">
              {/* 편지지 텍스트 영역 가이드라인 (빨간 박스 영역 매핑) */}
              <div className="mailLetterArea">
                <p>안녕! 오늘도 하루 종일 고생 많았어.</p>
                <br/>
                <p>홧김에 긁고 싶었던 순간들, 스트레스 때문에 배달 앱을 켰던 순간들을 잘 이겨내고 이렇게 멋진 일과표를 완성하다니 정말 대단해! 💜</p>
                <br/>
                <p>네가 아낀 돈들은 단순히 숫자가 아니라, 너의 빛나는 미래를 만들어갈 단단한 벽돌이 될 거야. 조급해하지 말고 지금처럼 천천히, 꾸준하게 나아가보자.</p>
                <br/>
                <p>내일도 내가 옆에서 든든하게 응원할게! 넌 할 수 있어! 화이팅! 🍀</p>
                <br/>
                <p className="mailSign">- 너의 감정소비 지킴이 말랑이가</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
