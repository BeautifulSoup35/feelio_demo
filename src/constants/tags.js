export const emotionTags = [
  { tagId: 'e1', name: '피곤', type: 'EMOTION', color: '#5B8DEF', isDefault: true },
  { tagId: 'e2', name: '외로움', type: 'EMOTION', color: '#FF7A6B', isDefault: true },
  { tagId: 'e3', name: '불안', type: 'EMOTION', color: '#F5A623', isDefault: true },
  { tagId: 'e4', name: '평온', type: 'EMOTION', color: '#2FBFA6', isDefault: true },
  { tagId: 'e5', name: '화남', type: 'EMOTION', color: '#F25555', isDefault: true },
  { tagId: 'e6', name: '무덤덤', type: 'EMOTION', color: '#9AA0B4', isDefault: true },
  { tagId: 'e7', name: '스트레스', type: 'EMOTION', color: '#8A6CFF', isDefault: true },
  { tagId: 'e8', name: '성취감', type: 'EMOTION', color: '#F35FA8', isDefault: true },
  { tagId: 'e9', name: '신남', type: 'EMOTION', color: '#FF7A8C', isDefault: true },
  { tagId: 'e10', name: '설렘', type: 'EMOTION', color: '#FF66B2', isDefault: true },
  { tagId: 'e11', name: '우울', type: 'EMOTION', color: '#8A6CFF', isDefault: true },
  { tagId: 'e12', name: '자신감', type: 'EMOTION', color: '#5B8DEF', isDefault: true },
  { tagId: 'e13', name: '고민', type: 'EMOTION', color: '#9AA0B4', isDefault: true },
  { tagId: 'e14', name: '행복', type: 'EMOTION', color: '#2FBFA6', isDefault: true },
  { tagId: 'e15', name: '민망함', type: 'EMOTION', color: '#9AA0B4', isDefault: true },
  { tagId: 'e16', name: '충동', type: 'EMOTION', color: '#F25555', isDefault: true },
  { tagId: 'e17', name: '귀찮음', type: 'EMOTION', color: '#8A6CFF', isDefault: true },
  { tagId: 'e18', name: 'FOMO(놓칠까 두려움)', type: 'EMOTION', color: '#F5A623', isDefault: true }
];

export const expenseCategoryTags = [
  { tagId: 'c1', name: '배달', type: 'EXPENSE_CATEGORY', color: '#5B8DEF', isDefault: true },
  { tagId: 'c2', name: '카페', type: 'EXPENSE_CATEGORY', color: '#8A6CFF', isDefault: true },
  { tagId: 'c3', name: '쇼핑', type: 'EXPENSE_CATEGORY', color: '#F35FA8', isDefault: true },
  { tagId: 'c4', name: '택시', type: 'EXPENSE_CATEGORY', color: '#F5A623', isDefault: true },
  { tagId: 'c5', name: '편의점', type: 'EXPENSE_CATEGORY', color: '#2FBFA6', isDefault: true },
  { tagId: 'c6', name: '간식', type: 'EXPENSE_CATEGORY', color: '#FF7A6B', isDefault: true },
  { tagId: 'c7', name: '구독', type: 'EXPENSE_CATEGORY', color: '#9AA0B4', isDefault: true }
];

export const incomeCategoryTags = [
  { tagId: 'i1', name: '월급', type: 'INCOME_CATEGORY', color: '#2FBFA6', isDefault: true },
  { tagId: 'i2', name: '용돈', type: 'INCOME_CATEGORY', color: '#5B8DEF', isDefault: true },
  { tagId: 'i3', name: '상여', type: 'INCOME_CATEGORY', color: '#8A6CFF', isDefault: true },
  { tagId: 'i4', name: '이자', type: 'INCOME_CATEGORY', color: '#F5A623', isDefault: true },
  { tagId: 'i5', name: '기타', type: 'INCOME_CATEGORY', color: '#9AA0B4', isDefault: true }
];

export const situationTags = [
  { tagId: 's1', name: '야근', type: 'SITUATION', color: '#6F7DFF', isDefault: true },
  { tagId: 's2', name: '혼자 있음', type: 'SITUATION', color: '#5B8DEF', isDefault: true },
  { tagId: 's3', name: '퇴근길', type: 'SITUATION', color: '#8A6CFF', isDefault: true },
  { tagId: 's4', name: '충동소비', type: 'SITUATION', color: '#F25555', isDefault: true },
  { tagId: 's5', name: '보상소비', type: 'SITUATION', color: '#F35FA8', isDefault: true },
  { tagId: 's6', name: '스트레스받음', type: 'SITUATION', color: '#FF7A6B', isDefault: true },
  { tagId: 's7', name: '월급날', type: 'SITUATION', color: '#2FBFA6', isDefault: true }
];

export const allTags = [
  ...emotionTags,
  ...expenseCategoryTags,
  ...incomeCategoryTags,
  ...situationTags
];
