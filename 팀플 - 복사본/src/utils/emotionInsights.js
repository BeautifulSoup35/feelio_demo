const emotionNames = ['신남', '설렘', '뿌듯함', '스트레스', '외로움', '화남', '평온', '무덤덤'];

export function parseEmotionPercent(value) {
  return Number(String(value).replace('%', '')) || 0;
}

export function topEmotion(flowItems = []) {
  const fallback = '평온';
  const sorted = [...flowItems]
    .map(item => ({
      ...item,
      emotion: item.name || item.label
    }))
    .filter(item => emotionNames.includes(item.emotion))
    .sort((a, b) => parseEmotionPercent(b.value) - parseEmotionPercent(a.value));

  return sorted[0]?.emotion || fallback;
}

export function emotionPercent(flowItems = [], emotion) {
  return flowItems.find(item => item.label === emotion)?.value || '0%';
}

export function makeEmotionSignalMessage(emotion, percent) {
  const tips = {
    신남: '즐거운 날엔 약속 소비가 커지기 쉬워요. 결제 전 오늘의 즐거움 예산을 한 번만 확인해봐요.',
    설렘: '설레는 마음이 즉흥 결제로 이어지고 있어요. 장바구니에 10분만 담아두는 루틴을 추천합니다.',
    뿌듯함: '보상하고 싶은 마음이 소비로 이어지고 있어요. 작은 보상 예산을 정해두면 흐름이 안정돼요.',
    스트레스: '야근 직장인은 결제 전 10분 쉬어가기 루틴을 추천합니다.',
    외로움: '혼자 있는 밤엔 배달과 구독 소비가 커지기 쉬워요. 결제 전 다른 선택지를 하나만 떠올려봐요.',
    화남: '화난 순간에는 빠른 결제가 늘 수 있어요. 결제 전 화면을 잠깐 내려놓는 루틴을 추천합니다.',
    평온: '평온한 날엔 소비 흐름이 안정적이에요. 지금의 리듬을 유지해봐요.',
    무덤덤: '무덤덤한 소비는 습관처럼 지나가기 쉬워요. 기록을 한 줄 남기면 흐름이 더 선명해져요.'
  };

  return `${emotion} 태그가 붙은 소비가 전체 흐름의 ${percent}를 차지해요. ${tips[emotion] || tips.평온}`;
}
const emotionAlias = {
  피곤: '스트레스',
  불안: '스트레스',
  분노: '화남'
};

export function normalizeBlobEmotion(emotion) {
  if (emotionNames.includes(emotion)) return emotion;
  return emotionAlias[emotion] || '평온';
}

export function topTaggedEmotion(transactions = [], tags = []) {
  const emotionTagNames = new Map(
    tags
      .filter(tag => tag.type === 'EMOTION')
      .map(tag => [tag.tagId, tag.name])
  );
  const counts = new Map();
  let total = 0;

  transactions.forEach(transaction => {
    transaction.tags?.forEach(tagId => {
      const emotion = emotionTagNames.get(tagId);
      if (!emotion) return;
      const normalizedEmotion = normalizeBlobEmotion(emotion);
      counts.set(normalizedEmotion, (counts.get(normalizedEmotion) || 0) + 1);
      total += 1;
    });
  });

  const [emotion, count] = [...counts.entries()].sort((a, b) => b[1] - a[1])[0] || [];

  return {
    emotion: emotion || '평온',
    count: count || 0,
    percent: total ? `${Math.round(((count || 0) / total) * 100)}%` : '0%'
  };
}

export function taggedEmotionData(transactions = [], tags = []) {
  const emotionTagNames = new Map(
    tags
      .filter(tag => tag.type === 'EMOTION')
      .map(tag => [tag.tagId, tag.name])
  );
  const counts = new Map();
  let totalTags = 0;

  transactions.forEach(transaction => {
    transaction.tags?.forEach(tagId => {
      const emotion = emotionTagNames.get(tagId);
      if (!emotion) return;
      const normalizedEmotion = normalizeBlobEmotion(emotion);
      counts.set(normalizedEmotion, (counts.get(normalizedEmotion) || 0) + 1);
      totalTags += 1;
    });
  });

  const data = [...counts.entries()]
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  return { data, totalTags };
}
