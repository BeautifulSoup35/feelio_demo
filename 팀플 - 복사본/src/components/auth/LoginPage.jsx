import Logo from '../common/Logo.jsx';
import GlassCard from '../common/GlassCard.jsx';

const providers = [
  { key: 'google', label: 'Google로 계속하기' },
  { key: 'kakao', label: 'Kakao로 계속하기' },
  { key: 'apple', label: 'Apple로 계속하기' }
];

function OAuthSymbol({ provider }) {
  if (provider === 'apple') {
    return (
      <svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M16.5 2.4c0 1.2-.45 2.26-1.34 3.17-.94.96-1.98 1.51-3.12 1.42-.15-1.15.35-2.37 1.19-3.24.86-.9 2.25-1.56 3.27-1.35ZM20.36 17.37c-.49 1.12-.73 1.62-1.37 2.62-.89 1.36-2.15 3.06-3.71 3.08-1.39.02-1.75-.9-3.63-.89-1.88.01-2.28.91-3.67.89-1.56-.02-2.75-1.55-3.64-2.91-2.49-3.83-2.75-8.33-1.21-10.72 1.09-1.7 2.82-2.69 4.44-2.69 1.65 0 2.69.91 4.06.91 1.33 0 2.14-.91 4.06-.91 1.45 0 2.99.79 4.08 2.15-3.59 1.97-3.01 7.11.59 8.47Z" />
      </svg>
    );
  }

  if (provider === 'kakao') {
    return (
      <svg width="21" height="21" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M12 4C6.98 4 3 7.18 3 11.1c0 2.53 1.66 4.75 4.16 6.01l-.6 2.35c-.08.32.29.58.56.39l2.75-1.92c.68.11 1.39.17 2.13.17 5.02 0 9-3.18 9-7.1S17.02 4 12 4Z" fill="#F5A623" />
      </svg>
    );
  }

  return (
    <svg width="21" height="21" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M21.2 12.22c0-.73-.06-1.26-.19-1.81h-8.8v3.48h5.17c-.1.86-.67 2.17-1.93 3.04l-.02.12 2.8 2.17.19.02c1.74-1.61 2.78-3.98 2.78-7.02Z" fill="#5B8DEF" />
      <path d="M12.2 21.4c2.49 0 4.58-.82 6.11-2.22l-2.91-2.26c-.78.54-1.82.92-3.2.92-2.44 0-4.51-1.61-5.25-3.83l-.11.01-2.91 2.25-.04.1c1.52 3.01 4.63 5.03 8.31 5.03Z" fill="#2FBFA6" />
      <path d="M6.95 14.01c-.19-.55-.31-1.14-.31-1.75s.11-1.2.3-1.75l-.01-.12-2.95-2.29-.1.05A9.18 9.18 0 0 0 3 12.26c0 1.48.36 2.88.99 4.11l2.96-2.36Z" fill="#F5A623" />
      <path d="M12.2 6.68c1.73 0 2.9.75 3.57 1.37l2.61-2.55C16.78 4.01 14.69 3.1 12.2 3.1c-3.68 0-6.79 2.02-8.31 5.04l3.05 2.36c.75-2.22 2.82-3.82 5.26-3.82Z" fill="#FF7A6B" />
    </svg>
  );
}

export default function LoginPage({ onLogin }) {
  return (
    <main className="loginPage">
      <div className="aurora a1" />
      <div className="aurora a2" />
      <div className="aurora a3" />
      <section className="loginHero">
        <Logo />
        <h1>감정을 입력하면 소비 인사이트가 출력됩니다.</h1>
        <p>
          Feelio는 지출 금액보다 그 순간의 감정과 상황을 먼저 기록합니다.
          반복되는 감정소비 패턴을 읽고, 목표에 가까워지는 선택을 도와요.
        </p>
      </section>
      <GlassCard className="loginCard">
        <div className="loginCardIntro">
          <span>OAuth2 로그인</span>
          <strong>소셜 계정으로 시작하세요.</strong>
        </div>
        <div className="oauthList">
          {providers.map(provider => (
            <button key={provider.key} type="button" className={`oauthButton ${provider.key}`} onClick={() => onLogin(provider.key)}>
              <span><OAuthSymbol provider={provider.key} /></span>
              {provider.label}
            </button>
          ))}
        </div>
        <p className="helperText">현재는 mock 로그인으로 동작하며, 구조는 실제 OAuth2 API 연결을 전제로 분리되어 있습니다.</p>
      </GlassCard>
    </main>
  );
}
