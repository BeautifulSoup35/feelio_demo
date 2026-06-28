import { useState, useEffect, useRef } from "react";

/* ------------------------------------------------------------------ *
 *  Moodies — 감정 말랑이 (EmotionBlob) v2
 *  확정 8종 · 긍정 3 : 부정 3 : 중립 2
 *  표정은 감정별로 눈/입/눈썹 + 소품까지 맞춤.
 *  사용:  <EmotionBlob emotion="설렘" size={64} variant="css" />
 * ------------------------------------------------------------------ */

const EMOTIONS = {
  신남:     { light: "#FFD9E7", base: "#F9A9CB", dark: "#F086B4", ink: "#9c5277", text: "#d96fa0", face: "excited" },
  설렘:     { light: "#E7DBFB", base: "#C9B2F4", dark: "#B196EC", ink: "#6e539e", text: "#9a7ad0", face: "flutter" },
  뿌듯함:   { light: "#FFE0B8", base: "#F8C088", dark: "#F0A865", ink: "#a06b34", text: "#cf8a3e", face: "proud"   },
  스트레스: { light: "#D9C7F5", base: "#B398E6", dark: "#9F7FDC", ink: "#5d4596", text: "#8266c0", face: "stress"  },
  외로움:   { light: "#C9D2FA", base: "#9FB0F0", dark: "#8597E8", ink: "#46568f", text: "#6677ce", face: "lonely"  },
  화남:     { light: "#FFC2BC", base: "#F89189", dark: "#F2706A", ink: "#a8453e", text: "#d6564c", face: "angry"   },
  평온:     { light: "#C6F0E0", base: "#92DEC2", dark: "#72CFAD", ink: "#2f7d62", text: "#3a9d7d", face: "calm"    },
  무덤덤:   { light: "#DEDCE8", base: "#BDB9CC", dark: "#A8A3BC", ink: "#615c75", text: "#807a96", face: "numb"    },
};

const SILHOUETTE =
  "M100 38C148 38 174 76 172 120C171 146 158 162 150 162C141 162 139 172 126 172C116 172 114 162 100 162C86 162 84 172 74 172C61 172 59 162 50 162C42 162 29 146 28 120C26 76 52 38 100 38Z";

let _uid = 0;

function Face({ face, ink }) {
  const S = { stroke: ink, strokeWidth: 3, strokeLinecap: "round", strokeLinejoin: "round", fill: "none", opacity: 0.88 };
  // 작고 동그란 점 눈
  const eye = (cx, cy, r = 4.4) => <circle cx={cx} cy={cy} r={r} fill={ink} opacity={0.9} />;
  const blush = (o = 0.5) => (
    <>
      <ellipse cx="76" cy="116" rx="7.5" ry="4.4" fill="#ffffff" opacity={o} />
      <ellipse cx="124" cy="116" rx="7.5" ry="4.4" fill="#ffffff" opacity={o} />
    </>
  );
  // 적당한 간격: 좌 86, 우 114 (중심 100), 살짝 아래(y 106)
  const LX = 86, RX = 114, EY = 106;

  switch (face) {
    case "excited": // 신남 — 점 눈 + 입 벌리고 활짝, 눈썹 없음
      return (
        <g>
          {blush(0.55)}
          {eye(LX, EY)}{eye(RX, EY)}
          <path d="M93 116 Q100 126 107 116 Q100 120 93 116 Z" fill={ink} opacity="0.9" />
        </g>
      );
    case "flutter": { // 설렘 — 위로 올려다보는 동그란 눈 + 새초롬한 미소 + 반짝이
      const sp = (cx, cy, s) => (
        <path d={`M${cx} ${cy - s} L${cx + s * 0.3} ${cy - s * 0.3} L${cx + s} ${cy} L${cx + s * 0.3} ${cy + s * 0.3} L${cx} ${cy + s} L${cx - s * 0.3} ${cy + s * 0.3} L${cx - s} ${cy} L${cx - s * 0.3} ${cy - s * 0.3} Z`} fill={ink} opacity="0.55" />
      );
      return (
        <g>
          {blush(0.75)}
          {/* 위쪽을 바라보는 큰 동그란 눈 (눈동자 위로) */}
          <circle cx={LX} cy={EY - 1} r="5" fill={ink} opacity="0.9" />
          <circle cx={RX} cy={EY - 1} r="5" fill={ink} opacity="0.9" />
          {/* 입 다문 작은 새초롬 미소 */}
          <path d="M96 119 Q100 122 104 119" {...S} strokeWidth="2.6" />
          {sp(150, 70, 5)}{sp(54, 80, 4)}
        </g>
      );
    }
    case "proud": // 뿌듯함 — 눈 감고 흐뭇 ^ ^ + 작은 미소
      return (
        <g>
          {blush(0.45)}
          <path d="M82 106 Q86 101 90 106" {...S} strokeWidth="2.8" />
          <path d="M110 106 Q114 101 118 106" {...S} strokeWidth="2.8" />
          <path d="M94 117 Q100 122 106 117" {...S} strokeWidth="2.8" />
        </g>
      );
    case "stress": // 스트레스 — 처진 눈 + 작은 흔들 입 + 땀 (눈썹 살짝)
      return (
        <g>
          <path d="M82 99 Q86 97 90 100" {...S} strokeWidth="2.2" />
          <path d="M110 100 Q114 97 118 99" {...S} strokeWidth="2.2" />
          {eye(LX, EY, 4)}{eye(RX, EY, 4)}
          <path d="M95 120 Q100 117 105 120" {...S} strokeWidth="2.6" />
          <path d="M58 104 C58 104 54.5 109 58 110.5 C61.5 109 58 104 58 104 Z" fill="#7FB5E6" opacity="0.75" />
        </g>
      );
    case "lonely": // 외로움 — 점 눈 + 시무룩한 입, 눈썹 없음 (단순 귀엽게)
      return (
        <g>
          {blush(0.42)}
          {eye(LX, EY)}{eye(RX, EY)}
          <path d="M95 122 Q100 118 105 122" {...S} strokeWidth="2.6" />
        </g>
      );
    case "angry": // 화남 — 솟은 눈썹 + 점 눈 + 뾰로통
      return (
        <g>
          <path d="M80 101 L91 104" {...S} strokeWidth="3" />
          <path d="M120 101 L109 104" {...S} strokeWidth="3" />
          {eye(LX, EY + 1, 4)}{eye(RX, EY + 1, 4)}
          <path d="M95 122 Q100 118 105 122" {...S} strokeWidth="2.8" />
        </g>
      );
    case "calm": // 평온 — 편안하게 감은 눈 + 잔잔한 미소
      return (
        <g>
          {blush(0.4)}
          <path d="M82 105 Q86 109 90 105" {...S} strokeWidth="2.8" />
          <path d="M110 105 Q114 109 118 105" {...S} strokeWidth="2.8" />
          <path d="M95 116 Q100 120.5 105 116" {...S} strokeWidth="2.8" />
        </g>
      );
    case "numb": // 무덤덤 — 작은 점 눈 + 일자 입
      return (
        <g>
          {eye(LX, EY, 3.4)}{eye(RX, EY, 3.4)}
          <path d="M96 120 L104 120" {...S} strokeWidth="2.8" />
        </g>
      );
    default:
      return null;
  }
}

export function EmotionBlob({ emotion = "평온", size = 140, variant = "svg", interactive = true }) {
  const e = EMOTIONS[emotion] || EMOTIONS["평온"];
  const idRef = useRef(`eb${_uid++}`);
  const turbRef = useRef(null);
  const squishTimer = useRef(null);
  const [squishing, setSquishing] = useState(false);
  const prev = useRef(emotion);

  useEffect(() => {
    if (prev.current !== emotion) { prev.current = emotion; poke(); }
  }, [emotion]);

  useEffect(() => {
    if (variant !== "svg") return;
    let raf, last = 0, t = 0;
    const tick = (now) => {
      if (now - last > 55) {
        last = now; t += 0.06;
        const f = 0.012 + 0.004 * Math.sin(t * 0.5);
        if (turbRef.current) turbRef.current.setAttribute("baseFrequency", `${f.toFixed(4)} ${(f * 0.8).toFixed(4)}`);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [variant]);

  function poke() {
    setSquishing(false);
    requestAnimationFrame(() => {
      setSquishing(true);
      clearTimeout(squishTimer.current);
      squishTimer.current = setTimeout(() => setSquishing(false), 620);
    });
  }

  const W = size, H = size * 1.025;
  const gradId = `${idRef.current}-grad`;
  const filtId = `${idRef.current}-goo`;

  return (
    <div
      onClick={interactive ? poke : undefined}
      style={{ width: W, height: H, position: "relative", cursor: interactive ? "pointer" : "default", animation: "eb-float 5s ease-in-out infinite", userSelect: "none" }}
    >
      <div style={{
        position: "absolute", left: "50%", top: "52%", width: W * 0.95, height: H * 0.9,
        transform: "translate(-50%,-50%)", background: e.base, borderRadius: "50%",
        filter: "blur(16px)", opacity: 0.32, transition: "background .45s ease",
      }} />

      <div style={{
        position: "absolute", inset: 0, transformOrigin: "50% 88%",
        animation: squishing ? "eb-squish .6s cubic-bezier(.2,.8,.2,1)" : "eb-breathe 4s ease-in-out infinite",
      }}>
        {variant === "svg" ? (
          <svg width={W} height={H} viewBox="0 0 200 205" style={{ position: "absolute", inset: 0, display: "block" }}>
            <defs>
              <radialGradient id={gradId} cx="38%" cy="26%" r="80%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.55" />
                <stop offset="22%" stopColor={e.light} />
                <stop offset="62%" stopColor={e.base} />
                <stop offset="100%" stopColor={e.dark} />
              </radialGradient>
              <radialGradient id={`${gradId}-sheen`} cx="34%" cy="22%" r="42%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.7" />
                <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
              </radialGradient>
              <filter id={filtId} x="-25%" y="-25%" width="150%" height="150%">
                <feTurbulence ref={turbRef} type="fractalNoise" baseFrequency="0.012 0.0096" numOctaves="2" seed="4" result="n" />
                <feDisplacementMap in="SourceGraphic" in2="n" scale="16" xChannelSelector="R" yChannelSelector="G" />
              </filter>
            </defs>
            <g filter={`url(#${filtId})`}>
              <path d={SILHOUETTE} fill={`url(#${gradId})`} style={{ transition: "fill .45s ease" }} />
            </g>
          </svg>
        ) : (
          <div style={{
            position: "absolute", left: "50%", top: "47%", width: W * 0.82, height: W * 0.84,
            transform: "translate(-50%,-50%)",
            background: `radial-gradient(circle at 42% 30%, ${e.light}, ${e.base} 55%, ${e.dark})`,
            transition: "background .45s ease",
            borderRadius: "46% 54% 60% 40% / 58% 52% 48% 42%",
            animation: "eb-morph 8s ease-in-out infinite",
          }} />
        )}

        <svg width={W} height={H} viewBox="0 0 200 205" style={{ position: "absolute", inset: 0, display: "block" }}>
          <Face face={e.face} ink={e.ink} />
        </svg>
      </div>
    </div>
  );
}
