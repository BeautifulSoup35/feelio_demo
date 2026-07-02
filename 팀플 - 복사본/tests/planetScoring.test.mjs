// 「소비 행성 관측」 로직 테스트 — 실행: node tests/planetScoring.test.mjs
import assert from 'node:assert/strict';
import { AXIS_ORDER, QUESTIONS, TYPES, BRIDGE, GAUGE_POS, WARP_PRIORITY } from '../src/data/planetTest.mjs';
import { scoreAnswers, gaugePercent, getWarpCandidates, flipAxisToZero, getWarpPlan } from '../src/utils/planetScoring.mjs';

const results = [];
function test(name, fn) {
  try {
    fn();
    results.push(['PASS', name]);
  } catch (err) {
    results.push(['FAIL', `${name} — ${err.message}`]);
  }
}

// 특정 비트 조합으로 가는 답안 생성: bit1 축은 one 선택, bit0 축은 반대 선택
function answersForBits(bits) {
  const answers = {};
  for (const q of QUESTIONS) {
    const wantOne = bits[q.axis] === 1;
    answers[q.id] = wantOne ? q.one : (q.one === 'A' ? 'B' : 'A');
  }
  return answers;
}

test('스펙 §5-2 검증 예시: P2/E3/C2 → 코드 111 한밤의 위로러', () => {
  const answers = { P1: 'B', P2: 'A', P3: 'A', E1: 'B', E2: 'B', E3: 'A', C1: 'B', C2: 'A', C3: 'A' };
  const r = scoreAnswers(answers);
  assert.deepEqual(r.axisScores, { P: 2, E: 3, C: 2 });
  assert.equal(r.code, '111');
  assert.equal(TYPES[r.code].name, '한밤의 위로러');
});

test('8개 유형 코드 전부 도달 가능', () => {
  for (let n = 0; n < 8; n += 1) {
    const bitsArr = [(n >> 2) & 1, (n >> 1) & 1, n & 1];
    const bits = { P: bitsArr[0], E: bitsArr[1], C: bitsArr[2] };
    const expected = bitsArr.join('');
    const r = scoreAnswers(answersForBits(bits));
    assert.equal(r.code, expected, `bits ${expected}`);
    assert.ok(TYPES[expected], `TYPES에 ${expected} 존재`);
  }
});

test('게이지 매핑 {0:12, 1:36, 2:64, 3:88}', () => {
  assert.deepEqual(GAUGE_POS, { 0: 12, 1: 36, 2: 64, 3: 88 });
  for (const s of [0, 1, 2, 3]) assert.equal(gaugePercent(s), GAUGE_POS[s]);
});

test('경계값: 축 점수 2 이상만 비트 1', () => {
  // P만 정확히 2점 (P1 one, P2 one, P3 반대), 나머지 0점
  const answers = { P1: 'B', P2: 'B', P3: 'B', E1: 'A', E2: 'A', E3: 'B', C1: 'A', C2: 'A', C3: 'B' };
  const r = scoreAnswers(answers);
  assert.deepEqual(r.axisScores, { P: 2, E: 0, C: 0 });
  assert.equal(r.code, '100');
});

test('항해 후보: 우선순위 C→E→P (§5-4)', () => {
  const candidates = getWarpCandidates({ P: 1, E: 1, C: 1 }, { P: 2, E: 3, C: 2 });
  assert.deepEqual(candidates, WARP_PRIORITY); // ['C','E','P']
});

test('항해: 111 기본 항로 = C축 → 목적지 110 다정한 보상러', () => {
  const r = { bits: { P: 1, E: 1, C: 1 }, axisScores: { P: 2, E: 3, C: 2 }, code: '111' };
  const plan = getWarpPlan(r);
  assert.equal(plan.stable, false);
  assert.equal(plan.axis, 'C');
  assert.equal(plan.destCode, '110');
  assert.equal(plan.destType.name, '다정한 보상러');
});

test('항해: 축 선택 시 해당 항로로 전환 (111 + E → 101)', () => {
  const r = { bits: { P: 1, E: 1, C: 1 }, axisScores: { P: 2, E: 3, C: 2 }, code: '111' };
  const plan = getWarpPlan(r, 'E');
  assert.equal(plan.axis, 'E');
  assert.equal(plan.destCode, '101');
  assert.equal(plan.destType.name, '설렘 폭주족');
});

test('항해: 후보가 아닌 축 지정 시 기본 후보로 폴백', () => {
  const r = { bits: { P: 0, E: 1, C: 0 }, axisScores: { P: 1, E: 3, C: 0 }, code: '010' };
  const plan = getWarpPlan(r, 'C'); // C는 비트 0 → 후보 아님
  assert.equal(plan.axis, 'E');
  assert.equal(plan.destCode, '000');
});

test('엣지: 코드 000 → stable, 목적지 없음', () => {
  const r = { bits: { P: 0, E: 0, C: 0 }, axisScores: { P: 0, E: 1, C: 1 }, code: '000' };
  const plan = getWarpPlan(r);
  assert.equal(plan.stable, true);
  assert.equal(plan.destCode, undefined);
  assert.deepEqual(plan.candidates, []);
});

test('모든 비-000 코드: 목적지는 해밍거리 1, 튼 비트는 1→0', () => {
  for (const code of Object.keys(TYPES)) {
    if (code === '000') continue;
    const bits = { P: +code[0], E: +code[1], C: +code[2] };
    const scores = { P: bits.P * 2, E: bits.E * 2, C: bits.C * 2 };
    const plan = getWarpPlan({ bits, axisScores: scores, code });
    const diff = [...code].filter((ch, i) => ch !== plan.destCode[i]);
    assert.equal(diff.length, 1, `${code} → ${plan.destCode} 해밍거리 1`);
    const i = AXIS_ORDER.indexOf(plan.axis);
    assert.equal(code[i], '1');
    assert.equal(plan.destCode[i], '0');
    assert.ok(TYPES[plan.destCode], `목적지 ${plan.destCode} 유형 존재`);
  }
});

test('flipAxisToZero 단독 검증', () => {
  assert.equal(flipAxisToZero('111', 'P'), '011');
  assert.equal(flipAxisToZero('111', 'E'), '101');
  assert.equal(flipAxisToZero('111', 'C'), '110');
});

test('데이터 무결성: 질문 9개(축별 3), 유형 8개(pal 3색), BRIDGE 3축', () => {
  assert.equal(QUESTIONS.length, 9);
  for (const axis of AXIS_ORDER) {
    assert.equal(QUESTIONS.filter(q => q.axis === axis).length, 3, `${axis}축 3문항`);
  }
  assert.equal(Object.keys(TYPES).length, 8);
  for (const [code, t] of Object.entries(TYPES)) {
    assert.equal(t.pal.length, 3, `${code} pal 3색`);
    assert.ok(t.name && t.def && t.open && t.tip && t.ink && t.mood, `${code} 필드 완전`);
  }
  assert.deepEqual(Object.keys(BRIDGE).sort(), ['C', 'E', 'P']);
});

const failed = results.filter(([s]) => s === 'FAIL');
for (const [status, name] of results) console.log(`${status === 'PASS' ? '✓' : '✗'} ${name}`);
console.log(`\n${results.length - failed.length}/${results.length} passed`);
if (failed.length) process.exit(1);
