/** @jsxImportSource @emotion/react */
import { useState, useRef, useEffect } from 'react';
import styled from '@emotion/styled';
import { Global, css } from '@emotion/react';

// === Keyframes ===
const globalStyles = css`
  @keyframes pu-twinkle { 0%, 100% { opacity: .2 } 50% { opacity: 1 } }
  @keyframes pu-float { 0%, 100% { transform: translateY(0) } 50% { transform: translateY(-9px) } }
  @keyframes pu-glow { 0%, 100% { opacity: .6 } 50% { opacity: 1 } }
  @keyframes pu-spin { from { transform: rotate(0) } to { transform: rotate(360deg) } }
  @keyframes pu-resultin { from { opacity: 0; transform: translate(-50%, -46%) scale(.96) } to { opacity: 1; transform: translate(-50%, -50%) scale(1) } }
  @keyframes pu-pop { from { opacity: 0; transform: scale(.9) } to { opacity: 1; transform: none } }
  @keyframes pu-blink { 0%, 100% { opacity: .35 } 50% { opacity: 1 } }
  @keyframes pu-fly-a { 0% { transform: translate(580px, 600px) scale(1) rotate(0deg); opacity: 0 } 14% { opacity: 1 } 100% { transform: translate(330px, 205px) scale(.32) rotate(-10deg); opacity: 1 } }
  @keyframes pu-fly-b { 0% { transform: translate(580px, 600px) scale(1) rotate(0deg); opacity: 0 } 14% { opacity: 1 } 100% { transform: translate(830px, 225px) scale(.32) rotate(10deg); opacity: 1 } }
  
  /* 신규 진입 애니메이션 */
  @keyframes pu-unfold {
    0% { transform: scaleY(0.005) scaleX(0); opacity: 0; box-shadow: 0 0 100px #fff; }
    30% { transform: scaleY(0.005) scaleX(1); opacity: 1; box-shadow: 0 0 40px #7FB4E8; }
    100% { transform: scaleY(1) scaleX(1); opacity: 1; box-shadow: none; }
  }
  @keyframes pu-flicker {
    0%, 10%, 20%, 30%, 100% { filter: brightness(1); }
    5%, 15%, 25% { filter: brightness(1.6) contrast(1.2); }
  }
`;

// === Data ===
const universeData = {
  current: {
    tag: "현재 우주", title: "지금처럼 소비한 나", metricLabel: "이번 달 감정소비",
    metric: "-182,000원", accent: "#9E96EE",
    narrative: "외로운 밤의 배달이 지금 속도로 이어지면, 제주도 여행 목표까지 4개월이 더 걸려요.",
    goalNote: "제주도 여행 · 4개월 지연", emotionTag: "외로움 · 스트레스",
  },
  reduced: {
    tag: "다른 우주", title: "감정소비를 줄인 나", metricLabel: "매달 아낄 수 있는 금액",
    metric: "+62,000원", accent: "#82E2C2",
    narrative: "외로운 밤의 배달을 절반만 줄이면, 목표에 이만큼씩 더 가까워져요.",
    goalNote: "제주도 여행 · 더 가까이", emotionTag: "평온 · 뿌듯함",
  }
};

const Container = styled.div`
  position: relative;
  width: 100%;
  height: calc(100vh - 120px);
  display: flex;
  align-items: center;
  justify-content: center;
`;

// 부모 컴포넌트의 패딩을 덮기 위해 -50px 등 여유를 주고 바깥을 덮습니다.
const Overlay = styled.div`
  position: absolute;
  inset: -60px;
  background: rgba(14, 15, 23, 0.55);
  backdrop-filter: blur(16px);
  z-index: 0;
  border-radius: 20px;
  /* 부드럽게 나타나는 효과 */
  animation: pu-fadein 0.6s ease forwards;
  @keyframes pu-fadein { from { opacity: 0; } to { opacity: 1; } }
`;

const PageWrapper = styled.div`
  width: min(100%, 1420px);
  height: 100%;
  position: relative;
  overflow: hidden;
  border-radius: 20px;
  background: radial-gradient(135% 100% at 50% -10%, #23263e 0%, #14161f 44%, #0a0c14 100%);
  z-index: 1;
  /* 펼쳐지는 모션과 깜빡임 모션 동시 적용 */
  transform-origin: center;
  animation: pu-unfold 0.85s cubic-bezier(0.16, 1, 0.3, 1) forwards, pu-flicker 0.6s ease-out forwards;
`;

export default function UniversePageDc() {
  const [phase, setPhase] = useState("idle");
  const [selected, setSelected] = useState("");
  const timerRef = useRef(null);

  const clearTimer = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  const selectPlanet = (key) => {
    clearTimer();
    setPhase("flying");
    setSelected(key);
    timerRef.current = setTimeout(() => {
      setPhase("result");
    }, 1150);
  };

  const reset = () => {
    clearTimer();
    setPhase("idle");
    setSelected("");
  };

  const switchOther = () => {
    const other = selected === "current" ? "reduced" : "current";
    clearTimer();
    setPhase("idle");
    setSelected("");
    timerRef.current = setTimeout(() => selectPlanet(other), 640);
  };

  useEffect(() => {
    return clearTimer;
  }, []);

  const isCurrent = selected === "current";
  const isReduced = selected === "reduced";
  const parked = phase === "flying" || phase === "result";
  const u = universeData[selected] || null;

  const status = phase === "idle" ? "STANDBY · 목적지 선택 대기"
    : phase === "flying" ? "ENGAGED · " + (isCurrent ? "스트레스" : "평온") + " 우주로 진입"
    : "ARRIVED · 관측 완료";

  return (
    <>
      <Global styles={globalStyles} />
      <Container>
        <Overlay />
        <PageWrapper>
          {/* SCENE */}
          <div style={{ position: "absolute", inset: 0 }}>
          {/* starfield */}
          <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
            <div style={{ position: "absolute", left: "6%", top: "60px", width: "2px", height: "2px", borderRadius: "50%", background: "#fff", animation: "pu-twinkle 3.2s ease-in-out infinite" }}></div>
            <div style={{ position: "absolute", left: "15%", top: "130px", width: "2px", height: "2px", borderRadius: "50%", background: "#fff", animation: "pu-twinkle 2.6s ease-in-out .4s infinite" }}></div>
            <div style={{ position: "absolute", left: "23%", top: "70px", width: "1.5px", height: "1.5px", borderRadius: "50%", background: "#fff", animation: "pu-twinkle 3.8s ease-in-out .8s infinite" }}></div>
            <div style={{ position: "absolute", left: "34%", top: "150px", width: "2px", height: "2px", borderRadius: "50%", background: "#fff", animation: "pu-twinkle 3s ease-in-out .2s infinite" }}></div>
            <div style={{ position: "absolute", left: "46%", top: "56px", width: "1.5px", height: "1.5px", borderRadius: "50%", background: "#fff", animation: "pu-twinkle 2.9s ease-in-out 1s infinite" }}></div>
            <div style={{ position: "absolute", left: "55%", top: "180px", width: "2px", height: "2px", borderRadius: "50%", background: "#fff", animation: "pu-twinkle 3.4s ease-in-out .6s infinite" }}></div>
            <div style={{ position: "absolute", left: "64%", top: "90px", width: "2px", height: "2px", borderRadius: "50%", background: "#fff", animation: "pu-twinkle 2.7s ease-in-out .3s infinite" }}></div>
            <div style={{ position: "absolute", left: "73%", top: "150px", width: "1.5px", height: "1.5px", borderRadius: "50%", background: "#fff", animation: "pu-twinkle 3.6s ease-in-out .9s infinite" }}></div>
            <div style={{ position: "absolute", left: "82%", top: "64px", width: "2px", height: "2px", borderRadius: "50%", background: "#fff", animation: "pu-twinkle 3.1s ease-in-out .5s infinite" }}></div>
            <div style={{ position: "absolute", left: "90%", top: "140px", width: "1.5px", height: "1.5px", borderRadius: "50%", background: "#fff", animation: "pu-twinkle 2.8s ease-in-out 1.1s infinite" }}></div>
            <div style={{ position: "absolute", left: "11%", top: "230px", width: "1.5px", height: "1.5px", borderRadius: "50%", background: "#fff", animation: "pu-twinkle 3.5s ease-in-out .1s infinite" }}></div>
            <div style={{ position: "absolute", left: "40%", top: "260px", width: "2px", height: "2px", borderRadius: "50%", background: "#fff", animation: "pu-twinkle 3s ease-in-out .7s infinite" }}></div>
            <div style={{ position: "absolute", left: "60%", top: "280px", width: "1.5px", height: "1.5px", borderRadius: "50%", background: "#fff", animation: "pu-twinkle 2.6s ease-in-out 1.2s infinite" }}></div>
            <div style={{ position: "absolute", left: "78%", top: "250px", width: "2px", height: "2px", borderRadius: "50%", background: "#fff", animation: "pu-twinkle 3.3s ease-in-out .35s infinite" }}></div>
            <div style={{ position: "absolute", left: "88%", top: "300px", width: "1.5px", height: "1.5px", borderRadius: "50%", background: "#fff", animation: "pu-twinkle 3.1s ease-in-out .9s infinite" }}></div>
            <div style={{ position: "absolute", left: "28%", top: "320px", width: "1.5px", height: "1.5px", borderRadius: "50%", background: "#fff", animation: "pu-twinkle 2.9s ease-in-out .5s infinite" }}></div>
          </div>

          {/* PLANET A */}
          <div
            onClick={() => selectPlanet("current")}
            css={{
              position: "absolute", left: "330px", top: "205px", transform: "translate(-50%,-50%)",
              cursor: "pointer", zIndex: 4, '&:hover': { filter: "brightness(1.08)" }
            }}
          >
            <div style={{ position: "relative", width: "108px", height: "108px" }}>
              <div style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%,-50%)", width: "196px", height: "196px", borderRadius: "50%", background: "radial-gradient(circle,rgba(158,150,238,.5),transparent 60%)", filter: "blur(15px)", animation: "pu-glow 4.4s ease-in-out infinite" }}></div>
              <div style={{ position: "relative", width: "100%", height: "100%", borderRadius: "50%", overflow: "hidden", background: "radial-gradient(circle at 38% 30%,rgba(200,188,246,.5),rgba(129,112,208,.36) 58%,rgba(84,68,160,.26) 100%)", boxShadow: "inset -5px -8px 20px rgba(48,36,96,.38),inset 7px 6px 16px rgba(255,255,255,.3),0 0 34px -4px rgba(158,150,238,.55)", backdropFilter: "blur(3px)", animation: "pu-float 6s ease-in-out infinite" }}>
                <div style={{ position: "absolute", inset: "-25%", background: "radial-gradient(circle at 32% 42%,rgba(255,255,255,.28),transparent 38%),radial-gradient(circle at 72% 66%,rgba(120,100,200,.5),transparent 46%),radial-gradient(circle at 60% 24%,rgba(184,172,242,.42),transparent 40%)", animation: "pu-spin 20s linear infinite", opacity: .78 }}></div>
                <div style={{ position: "absolute", left: "24px", top: "22px", width: "26px", height: "12px", borderRadius: "50%", background: "rgba(255,255,255,.4)", filter: "blur(4px)" }}></div>
              </div>
              {isCurrent && (
                <div style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%,-50%)", width: "132px", height: "132px", borderRadius: "50%", border: "1.5px solid rgba(158,150,238,.7)", boxShadow: "0 0 22px -3px rgba(158,150,238,.6)", animation: "pu-pop .35s ease" }}></div>
              )}
            </div>
            <div style={{ position: "absolute", left: "50%", top: "122px", transform: "translateX(-50%)", whiteSpace: "nowrap", textAlign: "center", opacity: parked ? 0 : 1, transition: "opacity .3s ease" }}>
              <div style={{ font: "600 12.5px system-ui", color: "#ECEBF0" }}>지금처럼 소비한 나</div>
              <div style={{ font: "400 10px system-ui", color: "#9E96EE", marginTop: "2px", letterSpacing: ".02em" }}>스트레스 우주</div>
            </div>
          </div>

          {/* PLANET B */}
          <div
            onClick={() => selectPlanet("reduced")}
            css={{
              position: "absolute", left: "830px", top: "225px", transform: "translate(-50%,-50%)",
              cursor: "pointer", zIndex: 4, '&:hover': { filter: "brightness(1.08)" }
            }}
          >
            <div style={{ position: "relative", width: "94px", height: "94px" }}>
              <div style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%,-50%)", width: "176px", height: "176px", borderRadius: "50%", background: "radial-gradient(circle,rgba(130,226,194,.5),transparent 60%)", filter: "blur(15px)", animation: "pu-glow 4s ease-in-out .6s infinite" }}></div>
              <div style={{ position: "relative", width: "100%", height: "100%", borderRadius: "50%", overflow: "hidden", background: "radial-gradient(circle at 38% 30%,rgba(190,240,220,.52),rgba(111,211,179,.38) 58%,rgba(63,165,136,.26) 100%)", boxShadow: "inset -5px -7px 18px rgba(20,86,66,.36),inset 6px 5px 14px rgba(255,255,255,.32),0 0 32px -4px rgba(130,226,194,.55)", backdropFilter: "blur(3px)", animation: "pu-float 5.4s ease-in-out .4s infinite" }}>
                <div style={{ position: "absolute", inset: "-25%", background: "radial-gradient(circle at 34% 44%,rgba(255,255,255,.3),transparent 38%),radial-gradient(circle at 70% 64%,rgba(70,180,150,.5),transparent 46%),radial-gradient(circle at 58% 24%,rgba(170,235,210,.42),transparent 40%)", animation: "pu-spin 17s linear infinite reverse", opacity: .78 }}></div>
                <div style={{ position: "absolute", left: "20px", top: "19px", width: "22px", height: "10px", borderRadius: "50%", background: "rgba(255,255,255,.42)", filter: "blur(4px)" }}></div>
              </div>
              {isReduced && (
                <div style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%,-50%)", width: "118px", height: "118px", borderRadius: "50%", border: "1.5px solid rgba(130,226,194,.7)", boxShadow: "0 0 22px -3px rgba(130,226,194,.6)", animation: "pu-pop .35s ease" }}></div>
              )}
            </div>
            <div style={{ position: "absolute", left: "50%", top: "108px", transform: "translateX(-50%)", whiteSpace: "nowrap", textAlign: "center", opacity: parked ? 0 : 1, transition: "opacity .3s ease" }}>
              <div style={{ font: "600 12.5px system-ui", color: "#ECEBF0" }}>감정소비를 줄인 나</div>
              <div style={{ font: "400 10px system-ui", color: "#82E2C2", marginTop: "2px", letterSpacing: ".02em" }}>평온 우주</div>
            </div>
          </div>
        </div>

        {/* HEADER */}
        <div style={{ position: "absolute", left: "34px", top: "26px", zIndex: 12 }}>
          <div style={{ font: "600 11px system-ui", letterSpacing: ".16em", color: "#8f8c9c" }}>PARALLEL UNIVERSE</div>
          <div style={{ font: "600 21px system-ui", color: "#ECEBF0", marginTop: "4px" }}>미래는 지금 갈라지고 있어요</div>
        </div>

        {/* SHIP (FLYING A) */}
        {phase === "flying" && selected === "current" && (
          <div style={{ position: "absolute", left: 0, top: 0, zIndex: 7, animation: "pu-fly-a 1.15s cubic-bezier(.42,.08,.5,1) forwards" }}>
            <div style={{ position: "relative", width: "120px", height: "96px", transform: "translate(-50%,-50%)" }}>
              <div style={{ position: "absolute", left: "50%", bottom: "-4px", transform: "translateX(-50%)", width: "74px", height: "26px", borderRadius: "50%", background: "radial-gradient(circle,rgba(130,226,194,.85),transparent 70%)", filter: "blur(6px)" }}></div>
              <div style={{ position: "absolute", left: "50%", bottom: "22px", transform: "translateX(-50%)", width: "120px", height: "34px", borderRadius: "50%", background: "linear-gradient(180deg,#e9e6f4,#b6b1cf 52%,#918cae)", boxShadow: "0 8px 18px -8px rgba(0,0,0,.6),inset 0 2px 4px rgba(255,255,255,.5)" }}></div>
              <div style={{ position: "absolute", left: "50%", bottom: "30px", transform: "translateX(-50%)", width: "96px", height: "7px", borderRadius: "50%", background: "linear-gradient(90deg,#F6A96B,#F4A7C4,#9E96EE,#7FB4E8,#82E2C2,#F5D06B)", opacity: .6 }}></div>
              <div style={{ position: "absolute", left: "50%", bottom: "36px", transform: "translateX(-50%)", width: "64px", height: "52px", borderRadius: "50% 50% 46% 46%", background: "radial-gradient(circle at 46% 36%,rgba(214,206,248,.95),rgba(150,138,214,.85))", boxShadow: "inset 0 -6px 10px rgba(120,105,180,.4),inset 0 5px 9px rgba(255,255,255,.5)" }}></div>
            </div>
          </div>
        )}

        {/* SHIP (FLYING B) */}
        {phase === "flying" && selected === "reduced" && (
          <div style={{ position: "absolute", left: 0, top: 0, zIndex: 7, animation: "pu-fly-b 1.15s cubic-bezier(.42,.08,.5,1) forwards" }}>
            <div style={{ position: "relative", width: "120px", height: "96px", transform: "translate(-50%,-50%)" }}>
              <div style={{ position: "absolute", left: "50%", bottom: "-4px", transform: "translateX(-50%)", width: "74px", height: "26px", borderRadius: "50%", background: "radial-gradient(circle,rgba(130,226,194,.85),transparent 70%)", filter: "blur(6px)" }}></div>
              <div style={{ position: "absolute", left: "50%", bottom: "22px", transform: "translateX(-50%)", width: "120px", height: "34px", borderRadius: "50%", background: "linear-gradient(180deg,#e9e6f4,#b6b1cf 52%,#918cae)", boxShadow: "0 8px 18px -8px rgba(0,0,0,.6),inset 0 2px 4px rgba(255,255,255,.5)" }}></div>
              <div style={{ position: "absolute", left: "50%", bottom: "30px", transform: "translateX(-50%)", width: "96px", height: "7px", borderRadius: "50%", background: "linear-gradient(90deg,#F6A96B,#F4A7C4,#9E96EE,#7FB4E8,#82E2C2,#F5D06B)", opacity: .6 }}></div>
              <div style={{ position: "absolute", left: "50%", bottom: "36px", transform: "translateX(-50%)", width: "64px", height: "52px", borderRadius: "50% 50% 46% 46%", background: "radial-gradient(circle at 46% 36%,rgba(214,206,248,.95),rgba(150,138,214,.85))", boxShadow: "inset 0 -6px 10px rgba(120,105,180,.4),inset 0 5px 9px rgba(255,255,255,.5)" }}></div>
            </div>
          </div>
        )}

        {/* CONSOLE */}
        <div style={{
          position: "absolute", left: 0, right: 0, bottom: 0, aspectRatio: "1160 / 300", zIndex: 5,
          transform: parked ? "translateY(48px)" : "none",
          opacity: parked ? 0 : 1,
          pointerEvents: parked ? "none" : "auto",
          transition: "opacity .5s ease, transform .6s cubic-bezier(.5,.05,.2,1)"
        }}>
          <svg viewBox="0 0 1160 300" xmlns="http://www.w3.org/2000/svg" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", display: "block" }} aria-hidden="true">
            <defs>
              <linearGradient id="cn-glass" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#ffffff" stopOpacity=".10"/><stop offset="1" stopColor="#ffffff" stopOpacity=".045"/></linearGradient>
              <linearGradient id="cn-wing" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#ffffff" stopOpacity=".07"/><stop offset="1" stopColor="#ffffff" stopOpacity=".03"/></linearGradient>
              <linearGradient id="cn-inset" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#000000" stopOpacity=".38"/><stop offset=".3" stopColor="#000000" stopOpacity="0"/></linearGradient>
              <linearGradient id="cn-bez" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#000000" stopOpacity=".26"/><stop offset=".55" stopColor="#000000" stopOpacity=".06"/><stop offset="1" stopColor="#ffffff" stopOpacity=".05"/></linearGradient>
            </defs>
            <g id="console-base">
              <path d="M0,120 L360,74 Q382,70 404,70 L756,70 Q778,70 800,74 L1160,120 L1160,320 L0,320 Z" fill="url(#cn-glass)"/>
              <path d="M0,120 L360,74 Q382,70 404,70 L756,70 Q778,70 800,74 L1160,120" fill="none" stroke="rgba(255,255,255,.13)" strokeWidth="1"/>
              <path d="M368,88 L404,84 L756,84 L792,88" fill="none" stroke="rgba(255,255,255,.15)" strokeWidth="1"/>
            </g>
            <g id="deco-left">
              <path d="M0,120 L360,74 L360,92 L18,138 Z" fill="url(#cn-wing)"/>
              <line x1="46" y1="156" x2="150" y2="156" stroke="rgba(255,255,255,.09)" strokeWidth="1"/>
              <circle cx="60" cy="182" r="2.8" fill="#7FB4E8"/>
              <circle cx="80" cy="182" r="2.8" fill="rgba(255,255,255,.26)"/>
              <circle cx="100" cy="182" r="2.8" fill="rgba(255,255,255,.18)"/>
              <rect x="46" y="202" width="22" height="12" rx="6" fill="rgba(0,0,0,.24)" stroke="rgba(255,255,255,.1)"/>
              <circle cx="52" cy="208" r="3.4" fill="rgba(255,255,255,.5)"/>
              <line x1="82" y1="208" x2="150" y2="208" stroke="rgba(255,255,255,.09)" strokeWidth="1"/>
              <line x1="46" y1="226" x2="128" y2="226" stroke="rgba(255,255,255,.08)" strokeWidth="1"/>
            </g>
            <g id="deco-right">
              <path d="M1160,120 L800,74 L800,92 L1142,138 Z" fill="url(#cn-wing)"/>
              <line x1="1010" y1="156" x2="1114" y2="156" stroke="rgba(255,255,255,.09)" strokeWidth="1"/>
              <circle cx="1100" cy="182" r="2.8" fill="#F5D06B"/>
              <circle cx="1080" cy="182" r="2.8" fill="rgba(255,255,255,.26)"/>
              <circle cx="1060" cy="182" r="2.8" fill="rgba(255,255,255,.18)"/>
              <rect x="1092" y="202" width="22" height="12" rx="6" fill="rgba(0,0,0,.24)" stroke="rgba(255,255,255,.1)"/>
              <circle cx="1108" cy="208" r="3.4" fill="rgba(255,255,255,.5)"/>
              <line x1="1010" y1="208" x2="1078" y2="208" stroke="rgba(255,255,255,.09)" strokeWidth="1"/>
              <line x1="1032" y1="226" x2="1114" y2="226" stroke="rgba(255,255,255,.08)" strokeWidth="1"/>
            </g>
            <g id="emotion-rail">
              <circle cx="498" cy="98" r="3" fill="#F6A96B"/>
              <circle cx="521" cy="98" r="3" fill="#F4A7C4"/>
              <circle cx="544" cy="98" r="3" fill="#F5D06B"/>
              <circle cx="567" cy="98" r="3" fill="#9E96EE"/>
              <circle cx="590" cy="98" r="3" fill="#7FB4E8"/>
              <circle cx="613" cy="98" r="3" fill="#F08A7E"/>
              <circle cx="636" cy="98" r="3" fill="#82E2C2"/>
              <circle cx="659" cy="98" r="3" fill="#B8B4C4"/>
            </g>
            <g id="telemetry">
              <rect x="466" y="120" width="228" height="24" rx="8" fill="rgba(0,0,0,.30)"/>
              <rect x="466" y="120" width="228" height="24" rx="8" fill="url(#cn-inset)"/>
              <rect x="466.5" y="120.5" width="227" height="23" rx="7.5" fill="none" stroke="rgba(255,255,255,.07)" strokeWidth="1"/>
            </g>
            <g id="btn-slot-left">
              <rect x="330" y="158" width="210" height="66" rx="15" fill="rgba(0,0,0,.24)"/>
              <rect x="330" y="158" width="210" height="66" rx="15" fill="url(#cn-bez)"/>
              <rect x="330.5" y="158.5" width="209" height="65" rx="14.5" fill="none" stroke="rgba(255,255,255,.08)" strokeWidth="1"/>
            </g>
            <g id="btn-slot-right">
              <rect x="620" y="158" width="210" height="66" rx="15" fill="rgba(0,0,0,.24)"/>
              <rect x="620" y="158" width="210" height="66" rx="15" fill="url(#cn-bez)"/>
              <rect x="620.5" y="158.5" width="209" height="65" rx="14.5" fill="none" stroke="rgba(255,255,255,.08)" strokeWidth="1"/>
            </g>
            <g id="ignition">
              <circle cx="580" cy="191" r="31" fill="rgba(0,0,0,.28)"/>
              <circle cx="580" cy="191" r="31" fill="url(#cn-inset)"/>
              <circle cx="580" cy="191" r="31" fill="none" stroke="rgba(255,255,255,.1)" strokeWidth="1"/>
              <circle cx="580" cy="191" r="26" fill="none" stroke="#8B7EE8" strokeOpacity=".22" strokeWidth="1" strokeDasharray="2 5"/>
              <circle cx="580" cy="191" r="18" fill="url(#cn-glass)" stroke="rgba(255,255,255,.14)" strokeWidth="1"/>
              <circle cx="580" cy="191" r="18" fill="url(#cn-bez)"/>
              <line x1="580" y1="178" x2="580" y2="186" stroke="#8B7EE8" strokeWidth="2.4" strokeLinecap="round"/>
              <text x="580" y="234" textAnchor="middle" fill="rgba(255,255,255,.3)" style={{ font: "600 7px ui-monospace,Menlo,monospace", letterSpacing: ".14em" }}>SYNC</text>
            </g>
            <g id="controls-detail">
              <circle cx="282" cy="90" r="1.6" fill="rgba(255,255,255,.2)"/>
              <circle cx="878" cy="90" r="1.6" fill="rgba(255,255,255,.2)"/>
              <circle cx="200" cy="112" r="1.6" fill="rgba(255,255,255,.16)"/>
              <circle cx="960" cy="112" r="1.6" fill="rgba(255,255,255,.16)"/>
            </g>
          </svg>

          <div style={{ position: "absolute", left: "40.17%", top: "40%", width: "19.66%", height: "8%", display: "flex", alignItems: "center", justifyContent: "center", gap: "7px", pointerEvents: "none" }}>
            <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#8B7EE8", animation: "pu-blink 1.4s ease-in-out infinite", flex: "none" }}></span>
            <span style={{ font: "600 9px ui-monospace,Menlo,monospace", letterSpacing: ".1em", color: "#9a97a8", whiteSpace: "nowrap" }}>{status}</span>
          </div>

          <button
            onClick={() => selectPlanet("current")}
            style={{ position: "absolute", left: "29.31%", top: "55%", width: "16.55%", height: "17.33%", border: "none", padding: 0, background: "transparent", cursor: "pointer" }}
          >
            <div css={{
              position: "relative", width: "100%", height: "100%", borderRadius: "13px",
              background: "linear-gradient(180deg,rgba(255,255,255,.13),rgba(255,255,255,.03))",
              border: "1px solid rgba(255,255,255,.14)", boxShadow: "0 3px 7px rgba(0,0,0,.34),inset 0 1px 0 rgba(255,255,255,.2)",
              display: "flex", alignItems: "center", gap: "11px", padding: "0 15px", boxSizing: "border-box",
              transition: "transform .15s ease,box-shadow .2s ease",
              '&:hover': { transform: "translateY(-2px)", boxShadow: "0 6px 12px rgba(0,0,0,.38),inset 0 1px 0 rgba(255,255,255,.24)" }
            }}>
              <span style={{ width: "9px", height: "9px", borderRadius: "50%", background: "rgba(255,255,255,.24)", flex: "none", transition: ".25s" }}></span>
              <span style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", lineHeight: 1.22 }}>
                <span style={{ font: "600 13.5px system-ui", color: "#ECEBF0" }}>현재 우주로</span>
                <span style={{ font: "500 8.5px ui-monospace,Menlo,monospace", color: "#8f8c9c", letterSpacing: ".1em" }}>PLANET-01 · STRESS</span>
              </span>
              <span style={{ marginLeft: "auto", display: "flex", gap: "2.5px" }}>
                <i style={{ width: "1.5px", height: "18px", background: "rgba(255,255,255,.1)", display: "block" }}></i>
                <i style={{ width: "1.5px", height: "18px", background: "rgba(255,255,255,.1)", display: "block" }}></i>
                <i style={{ width: "1.5px", height: "18px", background: "rgba(255,255,255,.1)", display: "block" }}></i>
              </span>
              {isCurrent && (
                <>
                  <span style={{ position: "absolute", inset: 0, borderRadius: "13px", border: "1.5px solid rgba(158,150,238,.65)", boxShadow: "inset 0 2px 7px rgba(0,0,0,.4),0 0 18px -4px rgba(158,150,238,.7)", pointerEvents: "none" }}></span>
                  <span style={{ position: "absolute", left: "15px", top: "50%", transform: "translateY(-50%)", width: "9px", height: "9px", borderRadius: "50%", background: "#9E96EE", boxShadow: "0 0 9px #9E96EE", pointerEvents: "none" }}></span>
                </>
              )}
            </div>
          </button>

          <button
            onClick={() => selectPlanet("reduced")}
            style={{ position: "absolute", left: "54.14%", top: "55%", width: "16.55%", height: "17.33%", border: "none", padding: 0, background: "transparent", cursor: "pointer" }}
          >
            <div css={{
              position: "relative", width: "100%", height: "100%", borderRadius: "13px",
              background: "linear-gradient(180deg,rgba(255,255,255,.13),rgba(255,255,255,.03))",
              border: "1px solid rgba(255,255,255,.14)", boxShadow: "0 3px 7px rgba(0,0,0,.34),inset 0 1px 0 rgba(255,255,255,.2)",
              display: "flex", alignItems: "center", gap: "11px", padding: "0 15px", boxSizing: "border-box",
              transition: "transform .15s ease,box-shadow .2s ease",
              '&:hover': { transform: "translateY(-2px)", boxShadow: "0 6px 12px rgba(0,0,0,.38),inset 0 1px 0 rgba(255,255,255,.24)" }
            }}>
              <span style={{ width: "9px", height: "9px", borderRadius: "50%", background: "rgba(255,255,255,.24)", flex: "none", transition: ".25s" }}></span>
              <span style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", lineHeight: 1.22 }}>
                <span style={{ font: "600 13.5px system-ui", color: "#ECEBF0" }}>다른 우주로</span>
                <span style={{ font: "500 8.5px ui-monospace,Menlo,monospace", color: "#8f8c9c", letterSpacing: ".1em" }}>PLANET-02 · CALM</span>
              </span>
              <span style={{ marginLeft: "auto", display: "flex", gap: "2.5px" }}>
                <i style={{ width: "1.5px", height: "18px", background: "rgba(255,255,255,.1)", display: "block" }}></i>
                <i style={{ width: "1.5px", height: "18px", background: "rgba(255,255,255,.1)", display: "block" }}></i>
                <i style={{ width: "1.5px", height: "18px", background: "rgba(255,255,255,.1)", display: "block" }}></i>
              </span>
              {isReduced && (
                <>
                  <span style={{ position: "absolute", inset: 0, borderRadius: "13px", border: "1.5px solid rgba(130,226,194,.65)", boxShadow: "inset 0 2px 7px rgba(0,0,0,.4),0 0 18px -4px rgba(130,226,194,.7)", pointerEvents: "none" }}></span>
                  <span style={{ position: "absolute", left: "15px", top: "50%", transform: "translateY(-50%)", width: "9px", height: "9px", borderRadius: "50%", background: "#82E2C2", boxShadow: "0 0 9px #82E2C2", pointerEvents: "none" }}></span>
                </>
              )}
            </div>
          </button>
        </div>

        {/* BIG RESULT PANEL */}
        {phase === "result" && u && (
          <>
            <div style={{ position: "absolute", inset: 0, zIndex: 15, background: "radial-gradient(80% 70% at 50% 42%,rgba(8,9,14,.52),rgba(8,9,14,.8))", pointerEvents: "none" }}></div>
            <div style={{ position: "absolute", left: "50%", top: "46%", zIndex: 16, width: "600px", transform: "translate(-50%,-50%)", animation: "pu-resultin .55s cubic-bezier(.2,.7,.3,1)" }}>
              <div style={{ borderRadius: "22px", padding: "30px 34px 26px", background: "rgba(255,255,255,.055)", border: "1px solid rgba(255,255,255,.13)", boxShadow: "0 30px 70px -24px rgba(0,0,0,.7),inset 0 1px 0 rgba(255,255,255,.12)", backdropFilter: "blur(14px)" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: "8px", font: "600 11px system-ui", letterSpacing: ".06em", color: u.accent }}>
                    <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: u.accent, boxShadow: `0 0 8px ${u.accent}` }}></span>{u.tag}
                  </span>
                  <span style={{ font: "600 9.5px ui-monospace,Menlo,monospace", letterSpacing: ".14em", color: "#8f8c9c" }}>OBSERVATION COMPLETE</span>
                </div>
                <div style={{ font: "700 27px/1.2 system-ui", color: "#ECEBF0", marginTop: "14px", letterSpacing: "-.01em" }}>{u.title}</div>
                <div style={{ font: "400 11px system-ui", color: "#9a97a8", marginTop: "16px" }}>{u.metricLabel}</div>
                <div style={{ font: "800 48px/1 system-ui", color: u.accent, marginTop: "6px", letterSpacing: "-.02em" }}>{u.metric}</div>
                <div style={{ font: "400 14px/1.6 system-ui", color: "#c9c6d4", marginTop: "16px", maxWidth: "520px" }}>{u.narrative}</div>
                <div style={{ display: "flex", gap: "10px", marginTop: "18px" }}>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "7px 13px", borderRadius: "11px", background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.1)", font: "500 11.5px system-ui", color: "#c9c6d4" }}>🎯 {u.goalNote}</span>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "7px 13px", borderRadius: "11px", background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.1)", font: "500 11.5px system-ui", color: "#c9c6d4" }}>
                    <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: u.accent }}></span>{u.emotionTag}
                  </span>
                </div>
                <div style={{ display: "flex", gap: "10px", marginTop: "24px" }}>
                  <button
                    onClick={switchOther}
                    css={{ flex: 1, padding: "13px", borderRadius: "13px", border: "1px solid rgba(255,255,255,.16)", background: "rgba(255,255,255,.06)", color: "#ECEBF0", font: "600 13px system-ui", cursor: "pointer", transition: ".2s", '&:hover': { background: "rgba(255,255,255,.12)" } }}
                  >다른 우주로 항행 →</button>
                  <button
                    onClick={reset}
                    css={{ padding: "13px 20px", borderRadius: "13px", border: "1px solid rgba(255,255,255,.1)", background: "transparent", color: "#9a97a8", font: "600 13px system-ui", cursor: "pointer", transition: ".2s", '&:hover': { color: "#ECEBF0" } }}
                  >다시 선택</button>
                </div>
              </div>
            </div>
          </>
        )}
      </PageWrapper>
      </Container>
    </>
  );
}
