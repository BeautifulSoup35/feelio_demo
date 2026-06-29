export const moodEmotions = [
  { tagId: 'e1', name: '신남', color: '#F9A9CB' },
  { tagId: 'e2', name: '설렘', color: '#C9B2F4' },
  { tagId: 'e3', name: '뿌듯함', color: '#F8C088' },
  { tagId: 'e4', name: '스트레스', color: '#B398E6' },
  { tagId: 'e5', name: '외로움', color: '#9FB0F0' },
  { tagId: 'e6', name: '화남', color: '#F89189' },
  { tagId: 'e7', name: '평온', color: '#92DEC2' },
  { tagId: 'e8', name: '무덤덤', color: '#BDB9CC' }
];

export const moodEmotionColors = Object.fromEntries(
  moodEmotions.map(emotion => [emotion.name, emotion.color])
);
