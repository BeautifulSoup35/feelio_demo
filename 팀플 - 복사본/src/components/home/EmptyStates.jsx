import { useMemo } from "react";
import { moodEmotionColors } from "../../constants/emotions.js";

/* 데이터 입력 전 디폴트(빈 상태) 디자인 — 말랑이 / 능선 */

const COLORS = moodEmotionColors;
const ALL = Object.values(COLORS);

/* ── 1. 말랑이 빈 상태 ──
   특정 감정색이 없으니 은은한 다색 글로우 + 호기심 어린 표정으로 "기다리는" 말랑이 */
const SIL = "M100 38C148 38 174 76 172 120C171 146 158 162 150 162C141 162 139 172 126 172C116 172 114 162 100 162C86 162 84 172 74 172C61 172 59 162 50 162C42 162 29 146 28 120C26 76 52 38 100 38Z";

export function BlobEmpty({ size = 150 }) {
  const W = size, H = size * 1.025;
  return (
    <div style={{ width: W, height: H, position: "relative", animation: "es-float 5s ease-in-out infinite" }}>
      {/* 은은한 다색 글로우 (특정 감정 없음을 표현) */}
      <div style={{
        position: "absolute", left: "50%", top: "52%", width: W * 0.95, height: H * 0.9, transform: "translate(-50%,-50%)",
        borderRadius: "50%", filter: "blur(15px)", opacity: 0.4,
        background: "conic-gradient(from 0deg, #9FB0F0, #C9B2F4, #F9A9CB, #F8C088, #92DEC2, #9FB0F0)",
        animation: "es-spin 12s linear infinite",
      }} />
      <div style={{ position: "absolute", inset: 0, animation: "es-breathe 4s ease-in-out infinite", transformOrigin: "50% 88%" }}>
        <svg width={W} height={H} viewBox="0 0 200 205" style={{ position: "absolute", inset: 0 }}>
          <defs>
            {/* 몸 베이스: 위→아래 자연스러운 명암 (흰칠 X) */}
            <linearGradient id="es-body" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#E2DCF0" />
              <stop offset="55%" stopColor="#CBC4DE" />
              <stop offset="100%" stopColor="#B3ABC9" />
            </linearGradient>
            {/* 상단 림라이트: 빛을 '더하는' 그라데이션 (screen 블렌드) */}
            <linearGradient id="es-rim" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.55" />
              <stop offset="35%" stopColor="#ffffff" stopOpacity="0.12" />
              <stop offset="60%" stopColor="#ffffff" stopOpacity="0" />
            </linearGradient>
            <clipPath id="es-clip"><path d={SIL} /></clipPath>
          </defs>
          <path d={SIL} fill="url(#es-body)" />
          {/* 림라이트를 몸 안쪽에만, screen으로 더해서 어두운 배경에서도 '광'으로 보이게 */}
          <g clipPath="url(#es-clip)" style={{ mixBlendMode: "screen" }}>
            <rect x="0" y="0" width="200" height="205" fill="url(#es-rim)" />
          </g>
          {/* 호기심 어린 표정: 동그란 눈 + 작은 'o' 입 (??) */}
          <circle cx="86" cy="106" r="4.4" fill="#6a6580" opacity="0.85" />
          <circle cx="114" cy="106" r="4.4" fill="#6a6580" opacity="0.85" />
          <ellipse cx="100" cy="121" rx="3.6" ry="4.4" fill="#6a6580" opacity="0.8" />
        </svg>
      </div>
    </div>
  );
}

export function BlobEmptyCard() {
  return (
    <div style={{ background: "linear-gradient(180deg,#14102a,#0d0a1a)", borderRadius: 18, padding: "22px 20px", border: "1px solid rgba(255,255,255,0.08)", textAlign: "center", fontFamily: "system-ui,-apple-system,sans-serif" }}>
      <div style={{ color: "#9b97b0", fontSize: 13, fontWeight: 500, marginBottom: 4 }}>오늘의 소비 신호</div>
      <div style={{ display: "flex", justifyContent: "center", margin: "6px 0 10px" }}><BlobEmpty size={120} /></div>
      <div style={{ color: "#fff", fontSize: 15, fontWeight: 600 }}>아직 기분을 못 들었어요</div>
      <div style={{ color: "#8a8a9c", fontSize: 13, marginTop: 4, lineHeight: 1.5 }}>소비에 기분 태그를 붙이면<br />말랑이가 오늘의 신호를 알려줄게요</div>
    </div>
  );
}

/* ── 2. 능선 빈 상태 ──
   봉우리가 없으니 잔잔한 미스트(낮은 안개) + 첫 입력 유도 */
export function RidgeEmpty() {
  const W = 600, H = 120, base = H + 4;
  // 평평하고 낮은 안개 언덕 몇 개 (회색빛, 아주 낮게)
  const mist = useMemo(() => [
    { x: 150, w: 230, h: 28 }, { x: 360, w: 250, h: 34 }, { x: 480, w: 220, h: 24 },
  ], []);
  const path = (cx, w, h) =>
    `M ${cx - w} ${base} C ${cx - w * 0.4} ${base} ${cx - w * 0.3} ${base - h} ${cx} ${base - h} C ${cx + w * 0.3} ${base - h} ${cx + w * 0.4} ${base} ${cx + w} ${base} Z`;

  return (
    <div style={{ background: "#0b0817", borderRadius: 20, padding: "18px 22px 16px", border: "1px solid rgba(255,255,255,0.06)", fontFamily: "system-ui,-apple-system,sans-serif" }}>
      <div style={{ color: "#fff", fontSize: 18, fontWeight: 700, marginBottom: 6 }}>이번 달 감정 능선</div>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: "block" }}>
        <defs>
          <filter id="re-soft" x="-40%" y="-80%" width="180%" height="260%"><feGaussianBlur stdDeviation="12" /></filter>
          <linearGradient id="re-fade" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#fff" stopOpacity="0" /><stop offset="9%" stopColor="#fff" stopOpacity="1" />
            <stop offset="91%" stopColor="#fff" stopOpacity="1" /><stop offset="100%" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
          <mask id="re-mask"><rect width={W} height={base + 4} fill="url(#re-fade)" /></mask>
        </defs>
        <g mask="url(#re-mask)">
          {/* 낮은 안개 언덕 */}
          <g style={{ animation: "es-mist 9s ease-in-out infinite" }}>
            {mist.map((m, i) => (
              <path key={i} d={path(m.x, m.w, m.h)} fill="#6b6f9a" opacity="0.2" filter="url(#re-soft)" style={{ mixBlendMode: "screen" }} />
            ))}
          </g>
          {/* 점선 베이스라인 (능선이 솟아날 '땅') */}
          <line x1="20" y1={base} x2={W - 20} y2={base} stroke="rgba(255,255,255,0.14)" strokeWidth="1.5" strokeDasharray="2 9" strokeLinecap="round" />
          {/* 떠 있는 작은 빛망울 (앞으로 봉우리가 될 씨앗 느낌) */}
          {[{x:170,y:78,r:2.4,d:"6s"},{x:300,y:62,r:3,d:"7.5s"},{x:300,y:96,r:1.8,d:"5s"},{x:430,y:84,r:2.2,d:"6.8s"}].map((s, i) => (
            <circle key={i} cx={s.x} cy={s.y} r={s.r} fill="#9b8cff" opacity="0.5"
              style={{ animation: `es-twinkle ${s.d} ease-in-out infinite`, mixBlendMode: "screen" }} />
          ))}
        </g>
      </svg>
      <div style={{ color: "#a6a6be", fontSize: 13, marginTop: 10 }}>
        첫 소비에 기분을 붙이면, 마음 능선이 솟아나기 시작해요
      </div>
    </div>
  );
}
