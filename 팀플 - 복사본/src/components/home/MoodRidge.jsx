import { useMemo } from 'react';
import { moodEmotionColors } from '../../constants/emotions.js';

const COLORS = moodEmotionColors;
const DEFAULT_DATA = [
  { name: '외로움', value: 38 }, { name: '스트레스', value: 22 }, { name: '평온', value: 15 },
  { name: '신남', value: 12 }, { name: '화남', value: 8 }, { name: '무덤덤', value: 5 },
];

function peakPath(cx, w, h, baseY) {
  return `M ${(cx - w).toFixed(1)} ${baseY} C ${(cx - w * 0.4).toFixed(1)} ${baseY} ${(cx - w * 0.3).toFixed(1)} ${(baseY - h).toFixed(1)} ${cx.toFixed(1)} ${(baseY - h).toFixed(1)} C ${(cx + w * 0.3).toFixed(1)} ${(baseY - h).toFixed(1)} ${(cx + w * 0.4).toFixed(1)} ${baseY} ${(cx + w).toFixed(1)} ${baseY} Z`;
}

export function MoodRidge({ data = DEFAULT_DATA }) {
  const { s, total, top } = useMemo(() => {
    const s = [...data].sort((a, b) => b.value - a.value);
    const total = s.reduce((t, d) => t + d.value, 0) || 1;
    return { s, total, top: s[0] };
  }, [data]);

  const W = 600, H = 120, base = H + 4;
  const peaks = s.map((d, i) => ({
    color: COLORS[d.name] || COLORS.무덤덤,
    h: 20 + (d.value / total) * H * 1.6,
    cx: (W / s.length) * (i + 0.5),
    w: (W / s.length) * 1.25,
  }));

  return (
    <section className="homeEmotionWave moodRidgeCard" aria-label="이번 달 감정 능선">
      <div className="homeEmotionWaveHeader moodRidgeHeader">
        <h3>이번 달 감정 능선</h3>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} width="100%" className="moodRidgeSvg">
        <defs>
          <filter id="rg-soft" x="-40%" y="-80%" width="180%" height="260%"><feGaussianBlur stdDeviation="9" /></filter>
          <linearGradient id="rg-fade" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#fff" stopOpacity="0" />
            <stop offset="9%" stopColor="#fff" stopOpacity="1" />
            <stop offset="91%" stopColor="#fff" stopOpacity="1" />
            <stop offset="100%" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
          <mask id="rg-mask"><rect x="0" y="0" width={W} height={base + 4} fill="url(#rg-fade)" /></mask>
        </defs>
        <g mask="url(#rg-mask)">
          {peaks.map((p, i) => (
            <path key={i} d={peakPath(p.cx, p.w, p.h, base)} fill={p.color}
              opacity="0.55" filter="url(#rg-soft)" style={{ mixBlendMode: 'screen' }} />
          ))}
        </g>
      </svg>

      <p className="moodRidgeCaption">
        이번 달은 <span style={{ color: COLORS[top.name] || COLORS.무덤덤 }}>{top.name}</span>이 가장 높이 솟았어요
      </p>
    </section>
  );
}
