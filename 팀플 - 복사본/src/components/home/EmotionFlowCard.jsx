const bars = [
  { day: '월', type: 'lonely', height: 64 },
  { day: '화', type: 'calm', height: 30 },
  { day: '수', type: 'anxious', height: 78 },
  { day: '목', type: 'lonely', height: 52 },
  { day: '금', type: 'lonely', height: 120 },
  { day: '토', type: 'calm', height: 44 },
  { day: '일', type: 'anxious', height: 70 }
];

export default function EmotionFlowCard() {
  return (
    <section className="emotionFlowCard" aria-label="이번 주 감정 흐름">
      <div className="emotionFlowHeader">
        <h3>이번 주 감정 흐름</h3>
        <span>6.17 - 6.23</span>
      </div>
      <div className="emotionBars">
        {bars.map(item => (
          <div className="emotionBarItem" key={item.day}>
            <i className={`emotionBar ${item.type}`} style={{ height: `${item.height}px` }} />
            <span>{item.day}</span>
          </div>
        ))}
      </div>
      <div className="emotionFlowLegend">
        <span><i className="lonely" />외로움</span>
        <span><i className="anxious" />스트레스</span>
        <span><i className="calm" />평온</span>
      </div>
    </section>
  );
}
