export function HomeIcon({ size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5 9.5V20h14V9.5" />
      <path d="M9.5 20v-5h5v5" />
    </svg>
  );
}

export function CalendarIcon({ size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="4.5" width="18" height="16" rx="3" />
      <path d="M3 9h18M8 2.5v4M16 2.5v4" />
    </svg>
  );
}

export function ContentIcon({ size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 3 3 7.5l9 4.5 9-4.5z" />
      <path d="M3 12.5 12 17l9-4.5M3 17 12 21.5 21 17" />
    </svg>
  );
}

export function AnalysisIcon({ size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 19V5" />
      <path d="M4 19h16" />
      <path d="M8 16v-5" />
      <path d="M12 16V8" />
      <path d="M16 16v-7" />
      <path d="M20 16v-3" />
    </svg>
  );
}

export function WalletIcon({ size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 7.5A2.5 2.5 0 0 1 6.5 5H18a2 2 0 0 1 2 2v12H6.5A2.5 2.5 0 0 1 4 16.5z" />
      <path d="M4 8h16" />
      <path d="M16 13h4v4h-4a2 2 0 0 1 0-4Z" />
    </svg>
  );
}

export function FeelioMark({ size = 34 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" aria-hidden="true">
      <defs>
        <radialGradient id="feelioGlow" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(58 46) rotate(123) scale(58 58)">
          <stop stopColor="#F4E7FF" />
          <stop offset="0.48" stopColor="#D8EAFF" />
          <stop offset="1" stopColor="#F7F8FF" />
        </radialGradient>
        <linearGradient id="feelioBlob" x1="25" y1="25" x2="78" y2="77" gradientUnits="userSpaceOnUse">
          <stop stopColor="#A8DFFF" />
          <stop offset="0.45" stopColor="#69BEF5" />
          <stop offset="0.72" stopColor="#9B78FF" />
          <stop offset="1" stopColor="#FFB8EA" />
        </linearGradient>
      </defs>
      <circle cx="50" cy="50" r="47" fill="url(#feelioGlow)" />
      <path d="M20 54c-5-18 13-35 31-28 8 3 16-15 28-7 14 10 10 33 1 47-12 19-39 22-54 8-3-3-5-10-6-20Z" fill="#BFDFFF" opacity=".42" />
      <path d="M31 25c15-14 43 1 41 22-1 17-16 31-33 27-20-5-24-35-8-49Z" fill="#CDBDFF" opacity=".38" />
      <path d="M34 36c7-15 28-19 38-7 11 14 3 38-14 45-10 4-13-3-21-1-8 1-13-5-10-13 3-9 3-15 7-24Z" fill="url(#feelioBlob)" />
      <path d="M37 37c6-11 20-14 29-7 6 5 6 14 2 22-4 9-12 15-22 15-7 0-12-6-10-13 2-7-3-8 1-17Z" fill="#72D4F6" opacity=".5" />
      <circle cx="43" cy="49" r="2.8" fill="#151A49" />
      <circle cx="58" cy="49" r="2.8" fill="#151A49" />
      <path d="M47 57c2 4 8 4 10 0" stroke="#151A49" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}
