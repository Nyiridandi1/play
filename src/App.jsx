import { useState, useEffect, useRef } from "react";
import { supabase } from "./supabase";

// ─────────────────────────────────────────────────────────────────────────────
// 🔴 PLAY RWANDA — Pro UI (Netflix x Kick)
// Colors: Red #E50914 | White #FFFFFF | Black #0A0A0A
// Font: Netflix-style (Bebas Neue + Inter via Google Fonts)
// ─────────────────────────────────────────────────────────────────────────────

// ── DESIGN TOKENS ─────────────────────────────────────────────────────────────
const C = {
  red: "#E50914",
  redDark: "#B20710",
  redGlow: "rgba(229,9,20,0.15)",
  white: "#FFFFFF",
  black: "#0A0A0A",
  card: "#141414",
  cardHover: "#1A1A1A",
  surface: "#1C1C1C",
  border: "rgba(255,255,255,0.08)",
  borderStrong: "rgba(255,255,255,0.15)",
  text: "#FFFFFF",
  textMuted: "rgba(255,255,255,0.5)",
  textDim: "rgba(255,255,255,0.25)",
  overlay: "rgba(0,0,0,0.85)",
};

const FONT = {
  display: "'Bebas Neue', 'Arial Black', sans-serif",
  body: "'Inter', 'Helvetica Neue', Arial, sans-serif",
};

// ── GLOBAL STYLES ─────────────────────────────────────────────────────────────
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@300;400;500;600;700;800;900&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html, body, #root { width: 100%; min-height: 100vh; background: ${C.black}; color: ${C.white}; font-family: ${FONT.body}; overflow-x: hidden; }
  body { margin: 0 !important; padding: 0 !important; }
  #root { margin: 0 !important; padding: 0 !important; max-width: 100% !important; }
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: ${C.border}; border-radius: 4px; }

  @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
  @keyframes bounce { from{opacity:0.3;transform:translateY(0)} to{opacity:1;transform:translateY(-8px)} }
  @keyframes fadeIn { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
  @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
  @keyframes shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
  @keyframes slideUp { from{transform:translateY(100%);opacity:0} to{transform:translateY(0);opacity:1} }

  /* ── BUTTON HOVERS ── */
  .btn-red { transition: all 0.2s ease !important; }
  .btn-red:hover { background: #ff0a16 !important; box-shadow: 0 0 24px rgba(229,9,20,0.6) !important; transform: translateY(-1px) !important; }
  .btn-red:active { transform: translateY(0) scale(0.98) !important; }

  .btn-white { transition: all 0.2s ease !important; }
  .btn-white:hover { background: rgba(255,255,255,0.85) !important; transform: translateY(-1px) !important; }
  .btn-white:active { transform: scale(0.98) !important; }

  .btn-ghost { transition: all 0.2s ease !important; }
  .btn-ghost:hover { background: rgba(255,255,255,0.12) !important; border-color: rgba(255,255,255,0.5) !important; color: #fff !important; }

  .btn-surface { transition: all 0.2s ease !important; }
  .btn-surface:hover { background: #2a2a2a !important; border-color: rgba(255,255,255,0.25) !important; }

  .btn-danger { transition: all 0.2s ease !important; }
  .btn-danger:hover { background: rgba(229,9,20,0.25) !important; border-color: ${C.red} !important; color: #fff !important; }

  /* ── NAV LINKS ── */
  .nav-link { transition: color 0.2s ease !important; }
  .nav-link:hover { color: #fff !important; }

  /* ── CATEGORY PILLS ── */
  .cat-pill { transition: all 0.2s ease !important; }
  .cat-pill:hover { background: rgba(229,9,20,0.2) !important; border-color: ${C.red} !important; color: #fff !important; transform: translateY(-1px) !important; }

  /* ── FOOTER LINKS ── */
  .footer-link { transition: color 0.2s ease !important; cursor: pointer; }
  .footer-link:hover { color: #fff !important; padding-left: 4px !important; }

  /* ── SOCIAL BADGES ── */
  .social-badge { transition: all 0.2s ease !important; cursor: pointer; }
  .social-badge:hover { background: ${C.red} !important; border-color: ${C.red} !important; color: #fff !important; transform: translateY(-2px) !important; }

  /* ── PAYMENT METHOD CARDS ── */
  .pay-card { transition: all 0.2s ease !important; cursor: pointer; }
  .pay-card:hover { transform: translateY(-2px) !important; box-shadow: 0 8px 24px rgba(0,0,0,0.4) !important; }

  /* ── GIFT CARDS ── */
  .gift-card { transition: all 0.2s ease !important; cursor: pointer; }
  .gift-card:hover { background: #252525 !important; border-color: rgba(255,255,255,0.25) !important; transform: translateY(-3px) scale(1.04) !important; box-shadow: 0 8px 20px rgba(0,0,0,0.5) !important; }

  /* ── TAB BUTTONS ── */
  .tab-btn { transition: all 0.2s ease !important; }
  .tab-btn:hover { color: #fff !important; }

  /* ── STREAM TABLE ROWS ── */
  .stream-row { transition: background 0.2s ease !important; }
  .stream-row:hover { background: #1c1c1c !important; }

  /* ── LOGO ── */
  .logo { transition: opacity 0.2s ease !important; }
  .logo:hover { opacity: 0.85 !important; }

  /* ── AVATAR ── */
  .avatar { transition: transform 0.2s ease !important; }
  .avatar:hover { transform: scale(1.08) !important; }

  /* ── HERO BUTTONS ── */
  .hero-watch { transition: all 0.2s ease !important; }
  .hero-watch:hover { background: rgba(255,255,255,0.85) !important; transform: translateY(-2px) !important; box-shadow: 0 8px 24px rgba(0,0,0,0.4) !important; }

  .hero-info { transition: all 0.2s ease !important; }
  .hero-info:hover { background: rgba(255,255,255,0.2) !important; transform: translateY(-2px) !important; }

  /* ── CHAT INPUT AREA ── */
  .chat-send { transition: all 0.2s ease !important; }
  .chat-send:hover { background: #ff0a16 !important; transform: scale(1.05) !important; }

  /* ── END STREAM / LEAVE BUTTONS ── */
  .btn-end { transition: all 0.2s ease !important; }
  .btn-end:hover { background: #c0060f !important; box-shadow: 0 0 16px rgba(229,9,20,0.5) !important; }

  /* ── CONTROL BUTTONS (mic/cam) ── */
  .ctrl-btn { transition: all 0.2s ease !important; }
  .ctrl-btn:hover { transform: scale(1.1) !important; box-shadow: 0 4px 16px rgba(0,0,0,0.5) !important; }
`;

// ── CONSTANTS ─────────────────────────────────────────────────────────────────
const CATS = ["All", "Music", "Comedy", "Food", "Fitness", "Art", "Tech"];
const GIFTS = [
  { id: "g1", emoji: "❤️", name: "Heart", price: 100 },
  { id: "g2", emoji: "🔥", name: "Fire", price: 200 },
  { id: "g3", emoji: "👑", name: "Crown", price: 500 },
  { id: "g4", emoji: "💎", name: "Diamond", price: 1000 },
  { id: "g5", emoji: "🚀", name: "Rocket", price: 2000 },
  { id: "g6", emoji: "🦁", name: "Lion", price: 5000 },
];
const PAY_METHODS = [
  { id: "mtn", name: "MTN Mobile Money", color: "#FFCB00", tc: "#000", field: "phone", ph: "078 000 0000" },
  { id: "airtel", name: "Airtel Money", color: "#E50914", tc: "#fff", field: "phone", ph: "073 000 0000" },
  { id: "visa", name: "Visa / Mastercard", color: "#1A1F71", tc: "#fff", field: "card", ph: "" },
];
const FAKE_USERS = ["Mugabo", "Ingabire", "Patrick", "Uwase", "Kalisa", "Nziza", "Gasana", "Cyusa"];
const FAKE_MSGS = ["🔥🔥🔥", "Amazing!", "Neza cyane!", "❤️❤️", "Keep going!", "Incredible!", "Let's go!"];
const MOCK_STREAMS = [
  { id: "s1", creator: "Kalisa Brian", handle: "@kalisa", title: "Indirimbo z'Urukundo", category: "Music", viewers: 1240, price: 500, currency: "RWF", cut: 10, emoji: "🎤", totalEarned: 620000, live: true },
  { id: "s2", creator: "Mugisha Chris", handle: "@chrismug", title: "Comedy Night Live", category: "Comedy", viewers: 2100, price: 1000, currency: "RWF", cut: 20, emoji: "🎭", totalEarned: 2100000, live: true },
  { id: "s3", creator: "Nziza Amina", handle: "@amina_cooks", title: "Rwandan Cuisine", category: "Food", viewers: 560, price: 3, currency: "USD", cut: 12, emoji: "🍲", totalEarned: 1680, live: true },
  { id: "s4", creator: "Habimana Joel", handle: "@joelfit", title: "Morning Workout", category: "Fitness", viewers: 890, price: 300, currency: "RWF", cut: 10, emoji: "💪", totalEarned: 267000, live: true },
  { id: "s5", creator: "Uwase Diane", handle: "@diane_art", title: "Live Painting Session", category: "Art", viewers: 380, price: 2, currency: "USD", cut: 15, emoji: "🎨", totalEarned: 760, live: true },
  { id: "s6", creator: "Iradukunda Sara", handle: "@sara_talks", title: "Tech & Innovation", category: "Tech", viewers: 430, price: 1500, currency: "RWF", cut: 15, emoji: "🚀", totalEarned: 645000, live: true },
];

const fmt = (n, cur) => cur === "RWF" ? `${Number(n).toLocaleString()} RWF` : `$${Number(n).toFixed(2)}`;
const delay = ms => new Promise(r => setTimeout(r, ms));

// ── UI PRIMITIVES ─────────────────────────────────────────────────────────────
function Avatar({ name = "?", size = 36 }) {
  const hue = ((name.charCodeAt(0) || 65) * 37) % 360;
  return (
    <div style={{ width: size, height: size, borderRadius: "50%", background: `hsl(${hue},55%,35%)`, border: `2px solid ${C.border}`, color: C.white, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: size * 0.38, flexShrink: 0, fontFamily: FONT.body }}>
      {name[0]?.toUpperCase()}
    </div>
  );
}

function Logo({ onClick }) {
  return (
    <div onClick={onClick} style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 2 }}>
      <span style={{ fontFamily: FONT.display, fontSize: 28, color: C.red, letterSpacing: 2, lineHeight: 1 }}>PLAY</span>
    </div>
  );
}

function LiveBadge() {
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 5, background: C.red, borderRadius: 4, padding: "3px 8px" }}>
      <div style={{ width: 6, height: 6, borderRadius: "50%", background: C.white, animation: "pulse 1.4s infinite" }} />
      <span style={{ fontSize: 10, fontWeight: 800, color: C.white, letterSpacing: 1, fontFamily: FONT.body }}>LIVE</span>
    </div>
  );
}

function Toast({ msg, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t); }, []);
  return (
    <div style={{ position: "fixed", bottom: 32, left: "50%", transform: "translateX(-50%)", zIndex: 9999, background: C.surface, border: `1px solid ${C.border}`, color: C.white, borderRadius: 10, padding: "12px 24px", fontWeight: 600, fontSize: 14, whiteSpace: "nowrap", boxShadow: "0 8px 32px rgba(0,0,0,0.5)", fontFamily: FONT.body, animation: "fadeIn 0.3s ease" }}>
      {msg}
    </div>
  );
}

function SplashScreen({ onDone }) {
  const [fade, setFade] = useState(false);
  useEffect(() => {
    const t1 = setTimeout(() => setFade(true), 1800);
    const t2 = setTimeout(onDone, 2400);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);
  return (
    <div style={{ position: "fixed", inset: 0, background: C.black, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", zIndex: 9999, transition: "opacity 0.6s", opacity: fade ? 0 : 1 }}>
      <style>{GLOBAL_CSS}</style>
      <div style={{ fontFamily: FONT.display, fontSize: 80, color: C.red, letterSpacing: 6, marginBottom: 8 }}>PLAY</div>
      <div style={{ color: C.textMuted, fontSize: 12, letterSpacing: 6, textTransform: "uppercase", marginBottom: 48, fontFamily: FONT.body }}>Rwanda</div>
      <div style={{ display: "flex", gap: 8 }}>
        {[0,1,2].map(i => <div key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: C.red, animation: `bounce 0.7s ${i*0.15}s ease-in-out infinite alternate` }} />)}
      </div>
    </div>
  );
}

// ── STREAM CARD ────────────────────────────────────────────────────────────────
function StreamCard({ stream: s, onClick }) {
  const [hovered, setHovered] = useState(false);
  const gradients = [
    "linear-gradient(135deg, #2d0a0a, #1a0505)",
    "linear-gradient(135deg, #0a0a2d, #05051a)",
    "linear-gradient(135deg, #0a2d0a, #05180a)",
    "linear-gradient(135deg, #2d2a0a, #1a1705)",
    "linear-gradient(135deg, #2a0a2d, #18051a)",
    "linear-gradient(135deg, #0a2d2a, #051a18)",
  ];
  const grad = gradients[parseInt(s.id?.slice(-1) || 0) % gradients.length];

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderRadius: 8,
        overflow: "visible",
        cursor: "pointer",
        position: "relative",
        zIndex: hovered ? 10 : 1,
        transform: hovered ? "scale(1.04) translateY(-4px)" : "scale(1)",
        transition: "all 0.25s cubic-bezier(0.4,0,0.2,1)",
        boxShadow: hovered ? "0 16px 48px rgba(0,0,0,0.8)" : "none",
        background: "transparent",
      }}
    >
      {/* YouTube-style 16:9 Thumbnail */}
      <div style={{ position: "relative", width: "100%", paddingTop: "56.25%", background: grad, borderRadius: 8, overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0 }}>
          {s.thumbnail_url
            ? <img src={s.thumbnail_url} alt={s.title} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.3s ease", transform: hovered ? "scale(1.05)" : "scale(1)" }} />
            : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ fontSize: 48, transition: "transform 0.3s ease", transform: hovered ? "scale(1.1)" : "scale(1)" }}>{s.emoji || "🎬"}</div>
              </div>
          }
          <div style={{ position: "absolute", inset: 0, background: hovered ? "rgba(0,0,0,0.1)" : "rgba(0,0,0,0.25)", transition: "background 0.25s" }} />
          <div style={{ position: "absolute", top: 8, left: 8 }}><LiveBadge /></div>
          <div style={{ position: "absolute", top: 8, right: 8, background: "rgba(0,0,0,0.85)", borderRadius: 4, padding: "3px 8px", fontSize: 12, fontWeight: 700, color: C.white }}>{fmt(s.price, s.currency)}</div>
          <div style={{ position: "absolute", bottom: 8, left: 8, display: "flex", alignItems: "center", gap: 4, background: "rgba(0,0,0,0.75)", borderRadius: 4, padding: "3px 8px" }}>
            <span style={{ fontSize: 10, color: C.textMuted }}>👁</span>
            <span style={{ fontSize: 11, fontWeight: 600, color: C.white }}>{s.viewers?.toLocaleString()}</span>
          </div>
          <div style={{ position: "absolute", bottom: 8, right: 8, background: C.surface, borderRadius: 4, padding: "3px 8px", fontSize: 10, fontWeight: 600, color: C.textMuted }}>{s.category}</div>

          {/* Hover overlay with Watch button */}
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", opacity: hovered ? 1 : 0, transition: "opacity 0.2s" }}>
            <div style={{ background: C.red, borderRadius: 50, width: 52, height: 52, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, boxShadow: "0 4px 20px rgba(229,9,20,0.6)" }}>▶</div>
          </div>
        </div>
      </div>

      {/* YouTube-style Info Below */}
      <div style={{ padding: "10px 4px 14px", display: "flex", gap: 10, alignItems: "flex-start" }}>
        <Avatar name={s.creator} size={36} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 700, fontSize: 14, color: C.white, lineHeight: 1.3, marginBottom: 4, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>{s.title}</div>
          <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 2 }}>{s.creator}</div>
          <div style={{ fontSize: 12, color: C.textMuted }}>{s.viewers?.toLocaleString()} watching · {s.category}</div>
        </div>
      </div>
    </div>
  );
}

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderRadius: 6,
        overflow: "visible",
        cursor: "pointer",
        position: "relative",
        zIndex: hovered ? 10 : 1,
        transform: hovered ? "scale(1.08) translateY(-4px)" : "scale(1)",
        transition: "all 0.25s cubic-bezier(0.4,0,0.2,1)",
        boxShadow: hovered ? "0 20px 60px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.1)" : "none",
      }}
    >
      <div style={{ borderRadius: 6, overflow: "hidden", background: C.card }}>
        {/* Thumbnail */}
        <div style={{ position: "relative", height: 152, background: grad, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
          {s.thumbnail_url
            ? <img src={s.thumbnail_url} alt={s.title} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.3s ease", transform: hovered ? "scale(1.05)" : "scale(1)" }} />
            : <div style={{ fontSize: 52, transition: "transform 0.3s ease", transform: hovered ? "scale(1.1)" : "scale(1)" }}>{s.emoji || "🎬"}</div>
          }
          <div style={{ position: "absolute", inset: 0, background: hovered ? "rgba(0,0,0,0.1)" : "rgba(0,0,0,0.35)", transition: "background 0.25s" }} />
          <div style={{ position: "absolute", top: 8, left: 8 }}><LiveBadge /></div>
          <div style={{ position: "absolute", top: 8, right: 8, background: "rgba(0,0,0,0.8)", borderRadius: 4, padding: "3px 8px", fontSize: 12, fontWeight: 700, color: C.white }}>{fmt(s.price, s.currency)}</div>
          <div style={{ position: "absolute", bottom: 8, left: 8, display: "flex", alignItems: "center", gap: 4, background: "rgba(0,0,0,0.75)", borderRadius: 4, padding: "3px 8px" }}>
            <span style={{ fontSize: 10, color: C.textMuted }}>👁</span>
            <span style={{ fontSize: 11, fontWeight: 600, color: C.white }}>{s.viewers?.toLocaleString()}</span>
          </div>
          <div style={{ position: "absolute", bottom: 8, right: 8, background: C.surface, borderRadius: 4, padding: "3px 8px", fontSize: 10, fontWeight: 600, color: C.textMuted }}>{s.category}</div>
        </div>

        {/* Info — always visible */}
        <div style={{ padding: "12px 14px 14px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
            <Avatar name={s.creator} size={26} />
            <div>
              <div style={{ fontWeight: 700, fontSize: 13, color: C.white }}>{s.creator}</div>
              <div style={{ fontSize: 11, color: C.textMuted }}>{s.handle}</div>
            </div>
          </div>
          <div style={{ fontWeight: 600, fontSize: 14, color: C.white, lineHeight: 1.3, marginBottom: hovered ? 10 : 0, transition: "margin 0.2s" }}>{s.title}</div>

          {/* Netflix-style expanded info on hover */}
          <div style={{ overflow: "hidden", maxHeight: hovered ? 80 : 0, transition: "max-height 0.3s ease", opacity: hovered ? 1 : 0 }}>
            <div style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
              <button onClick={e => { e.stopPropagation(); onClick(); }} style={{ flex: 1, background: C.white, border: "none", borderRadius: 4, padding: "7px 12px", color: C.black, fontWeight: 700, fontSize: 12, cursor: "pointer", fontFamily: FONT.body }}>
                ▶ Watch
              </button>
              <button onClick={e => { e.stopPropagation(); }} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 4, padding: "7px 12px", color: C.white, fontWeight: 600, fontSize: 12, cursor: "pointer", fontFamily: FONT.body }}>
                + Info
              </button>
            </div>
            <div style={{ marginTop: 8, fontSize: 11, color: C.textMuted, display: "flex", gap: 12 }}>
              <span style={{ color: "#4ade80", fontWeight: 700 }}>LIVE</span>
              <span>{s.category}</span>
              <span>{fmt(s.price, s.currency)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── COMING SOON CARD ───────────────────────────────────────────────────────────
function ComingSoonCard({ event: e, reminded, onRemind, getCountdown }) {
  const [hovered, setHovered] = useState(false);
  const gradients = [
    "linear-gradient(135deg, #0a0a2d, #1a0a2d)",
    "linear-gradient(135deg, #0a2d1a, #0a1a2d)",
    "linear-gradient(135deg, #2d1a0a, #2d0a1a)",
    "linear-gradient(135deg, #1a2d0a, #0a2d2a)",
  ];
  const grad = gradients[parseInt(e.id?.slice(-1) || 0) % gradients.length];
  const countdown = getCountdown(e.event_date);
  const eventDate = new Date(e.event_date);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderRadius: 6, overflow: "hidden", position: "relative",
        zIndex: hovered ? 10 : 1,
        transform: hovered ? "scale(1.05) translateY(-4px)" : "scale(1)",
        transition: "all 0.25s cubic-bezier(0.4,0,0.2,1)",
        boxShadow: hovered ? "0 20px 60px rgba(0,0,0,0.8)" : "none",
        background: C.card,
      }}
    >
      {/* Thumbnail */}
      <div style={{ position: "relative", height: 152, background: grad, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ fontSize: 52, opacity: 0.7 }}>{e.emoji || "📅"}</div>
        <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.45)" }} />

        {/* Coming Soon badge */}
        <div style={{ position: "absolute", top: 8, left: 8, background: "rgba(0,0,0,0.85)", border: `1px solid ${C.border}`, borderRadius: 4, padding: "3px 8px", display: "flex", alignItems: "center", gap: 5 }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#a78bfa" }} />
          <span style={{ fontSize: 10, fontWeight: 800, color: "#a78bfa", letterSpacing: 1 }}>SOON</span>
        </div>

        {/* Countdown */}
        <div style={{ position: "absolute", top: 8, right: 8, background: "rgba(0,0,0,0.85)", borderRadius: 4, padding: "3px 10px", fontSize: 12, fontWeight: 800, color: C.white, fontFamily: FONT.display, letterSpacing: 1 }}>
          ⏰ {countdown}
        </div>

        {/* Price */}
        <div style={{ position: "absolute", bottom: 8, right: 8, background: C.surface, borderRadius: 4, padding: "3px 8px", fontSize: 12, fontWeight: 700, color: C.white }}>{fmt(e.price, e.currency)}</div>

        {/* Date */}
        <div style={{ position: "absolute", bottom: 8, left: 8, background: "rgba(0,0,0,0.75)", borderRadius: 4, padding: "3px 8px", fontSize: 10, color: C.textMuted }}>
          {eventDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })} · {eventDate.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
        </div>
      </div>

      {/* Info */}
      <div style={{ padding: "12px 14px 14px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
          <Avatar name={e.creator} size={26} />
          <div>
            <div style={{ fontWeight: 700, fontSize: 13, color: C.white }}>{e.creator}</div>
            <div style={{ fontSize: 11, color: C.textMuted }}>{e.handle}</div>
          </div>
        </div>
        <div style={{ fontWeight: 600, fontSize: 14, color: C.white, lineHeight: 1.3, marginBottom: 10 }}>{e.title}</div>
        {e.description && <div style={{ fontSize: 12, color: C.textMuted, lineHeight: 1.6, marginBottom: 10 }}>{e.description}</div>}

        <button
          onClick={onRemind}
          disabled={reminded}
          className={reminded ? "" : "btn-red"}
          style={{
            width: "100%", border: "none", borderRadius: 6, padding: "9px", cursor: reminded ? "default" : "pointer",
            background: reminded ? C.surface : C.red,
            color: reminded ? "#a78bfa" : C.white,
            fontWeight: 700, fontSize: 13, fontFamily: FONT.body,
            display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
            border: reminded ? `1px solid #a78bfa44` : "none",
          }}
        >
          {reminded ? "✓ Reminder Set!" : `🔔 Remind Me · ${(e.remind_count || 0)} interested`}
        </button>
      </div>
    </div>
  );
}

// ── HOME PAGE ──────────────────────────────────────────────────────────────────
function HomePage({ streams, onWatch, onGoLive, user, onLogin, onLogout, loadingStreams, onLeaderboard, onAbout }) {
  const [tab, setTab] = useState("home");
  const [cat, setCat] = useState("All");
  const [search, setSearch] = useState("");
  const [events, setEvents] = useState([]);
  const [remindedIds, setRemindedIds] = useState([]);

  useEffect(() => {
    supabase.from("events").select("*").order("event_date", { ascending: true })
      .then(({ data }) => { if (data) setEvents(data); });
  }, []);

  const filtered = streams.filter(s => {
    const mc = cat === "All" || s.category === cat;
    const ms = !search || s.title?.toLowerCase().includes(search.toLowerCase()) || s.creator?.toLowerCase().includes(search.toLowerCase());
    return mc && ms;
  });

  const featured = filtered[0];

  const handleRemind = async (event) => {
    setRemindedIds(p => [...p, event.id]);
    await supabase.from("events").update({ remind_count: (event.remind_count || 0) + 1 }).eq("id", event.id);
  };

  // Countdown helper
  const getCountdown = (dateStr) => {
    const diff = new Date(dateStr) - new Date();
    if (diff <= 0) return "Starting soon!";
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    if (d > 0) return `${d}d ${h}h`;
    if (h > 0) return `${h}h ${m}m`;
    return `${m}m`;
  };

  const NAV_TABS = [
    { id: "home", label: "Home" },
    { id: "comingsoon", label: "Coming Soon" },
    { id: "leaderboard", label: "Leaderboard" },
    { id: "about", label: "About" },
  ];

  return (
    <div style={{ width: "100vw", minHeight: "100vh", background: C.black, fontFamily: FONT.body, overflowX: "hidden", position: "relative" }}>
      <style>{GLOBAL_CSS}</style>

      {/* Navbar */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, background: "rgba(0,0,0,0.97)", borderBottom: `1px solid ${C.border}`, padding: "0 4%" }}>
        <div style={{ height: 60, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
            <Logo onClick={() => setTab("home")} />
            {/* Nav Tabs */}
            <div style={{ display: "flex", gap: 4 }}>
              {NAV_TABS.map(t => (
                <button key={t.id} onClick={() => setTab(t.id)} className="tab-btn" style={{ background: "transparent", border: "none", borderBottom: tab === t.id ? `2px solid ${C.red}` : "2px solid transparent", color: tab === t.id ? C.white : C.textMuted, fontWeight: tab === t.id ? 700 : 500, fontSize: 13, padding: "4px 14px", cursor: "pointer", fontFamily: FONT.body, height: 60, transition: "all 0.2s" }}>
                  {t.label}
                </button>
              ))}
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {user
              ? <>
                <Avatar name={user.name} size={32} />
                <span style={{ fontSize: 13, fontWeight: 600, color: C.white }}>{user.name}</span>
                <button className="btn-ghost" onClick={onLogout} style={{ background: "transparent", border: `1px solid ${C.border}`, color: C.textMuted, borderRadius: 6, padding: "6px 14px", fontSize: 13, cursor: "pointer", fontFamily: FONT.body }}>Sign Out</button>
              </>
              : <button className="btn-ghost" onClick={onLogin} style={{ background: "transparent", border: `1px solid rgba(255,255,255,0.3)`, color: C.white, borderRadius: 6, padding: "6px 16px", fontSize: 13, cursor: "pointer", fontFamily: FONT.body, fontWeight: 500 }}>Sign In</button>
            }
            <button className="btn-red" onClick={onGoLive} style={{ background: C.red, border: "none", borderRadius: 6, color: C.white, fontWeight: 700, padding: "8px 20px", cursor: "pointer", fontSize: 13, fontFamily: FONT.body }}>Go Live</button>
          </div>
        </div>
      </nav>

      {/* ── HOME TAB ── */}
      {tab === "home" && <>
        {/* Hero */}
        {featured && (
          <div style={{ position: "relative", width: "100%", height: "65vh", minHeight: 420, background: "linear-gradient(135deg, #1a0505, #0a0a0a)", display: "flex", alignItems: "flex-end", paddingBottom: 64, paddingLeft: "4%", paddingRight: "4%", marginTop: 60 }}>
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 120, opacity: 0.15 }}>{featured.emoji}</div>
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(0,0,0,0.9) 40%, transparent), linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 60%)" }} />
            <div style={{ position: "relative", zIndex: 2, maxWidth: 520, animation: "fadeIn 0.6s ease" }}>
              <LiveBadge />
              <div style={{ fontFamily: FONT.display, fontSize: 52, color: C.white, letterSpacing: 2, marginTop: 12, marginBottom: 8, lineHeight: 1 }}>{featured.title.toUpperCase()}</div>
              <div style={{ fontSize: 14, color: C.textMuted, marginBottom: 6 }}>{featured.creator} · {featured.viewers?.toLocaleString()} watching</div>
              <div style={{ fontSize: 13, color: C.textMuted, marginBottom: 20 }}>{featured.category} · {fmt(featured.price, featured.currency)} to join</div>
              <div style={{ display: "flex", gap: 12 }}>
                <button className="hero-watch" onClick={() => onWatch(featured)} style={{ background: C.white, border: "none", borderRadius: 6, color: C.black, fontWeight: 700, padding: "12px 28px", cursor: "pointer", fontSize: 15, fontFamily: FONT.body, display: "flex", alignItems: "center", gap: 8 }}>▶ Watch Now</button>
                <button className="hero-info" style={{ background: "rgba(255,255,255,0.1)", border: `1px solid ${C.border}`, borderRadius: 6, color: C.white, fontWeight: 600, padding: "12px 20px", cursor: "pointer", fontSize: 14, fontFamily: FONT.body }}>+ More Info</button>
              </div>
            </div>
          </div>
        )}

        {/* Content */}
        <div style={{ padding: "32px 4% 60px", marginTop: featured ? 0 : 80 }}>
          <div style={{ display: "flex", gap: 12, marginBottom: 28, flexWrap: "wrap", alignItems: "center" }}>
            <div style={{ position: "relative", flex: "1 1 280px", maxWidth: 400 }}>
              <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", fontSize: 15, color: C.textMuted }}>🔍</span>
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search streams or creators..." style={{ width: "100%", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: "10px 16px 10px 40px", color: C.white, fontSize: 14, fontFamily: FONT.body, outline: "none" }} />
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {CATS.map(c => (
                <button className="cat-pill" key={c} onClick={() => setCat(c)} style={{ background: cat === c ? C.red : C.surface, border: `1px solid ${cat === c ? C.red : C.border}`, color: cat === c ? C.white : C.textMuted, borderRadius: 6, padding: "8px 16px", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: FONT.body }}>
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <div style={{ width: 4, height: 24, background: C.red, borderRadius: 2 }} />
            <span style={{ fontFamily: FONT.display, fontSize: 22, color: C.white, letterSpacing: 2 }}>LIVE NOW</span>
            <div style={{ flex: 1, height: 1, background: C.border }} />
            <span style={{ fontSize: 13, color: C.textMuted }}>{filtered.length} streams</span>
          </div>

          {loadingStreams
            ? <div style={{ display: "flex", gap: 10, justifyContent: "center", padding: "60px 0" }}>
                {[0,1,2].map(i => <div key={i} style={{ width: 10, height: 10, borderRadius: "50%", background: C.red, animation: `bounce 0.7s ${i*0.15}s ease-in-out infinite alternate` }} />)}
              </div>
            : filtered.length === 0
              ? <div style={{ textAlign: "center", padding: "80px 0" }}>
                  <div style={{ fontSize: 64, marginBottom: 16 }}>📡</div>
                  <div style={{ fontFamily: FONT.display, fontSize: 28, color: C.white, letterSpacing: 2, marginBottom: 12 }}>NO LIVE STREAMS RIGHT NOW</div>
                  <div style={{ color: C.textMuted, fontSize: 14, marginBottom: 24 }}>Be the first to go live today!</div>
                  <button className="btn-red" onClick={onGoLive} style={{ background: C.red, border: "none", borderRadius: 8, padding: "12px 28px", color: C.white, fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: FONT.display, letterSpacing: 1 }}>GO LIVE NOW</button>
                </div>
              : <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "20px 16px", padding: "8px 4px 20px" }}>
                  {filtered.map(s => <StreamCard key={s.id} stream={s} onClick={() => onWatch(s)} />)}
                </div>
          }

          {/* Coming Soon Preview on Home */}
          {events.length > 0 && (
            <>
              <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "32px 0 20px" }}>
                <div style={{ width: 4, height: 24, background: C.red, borderRadius: 2 }} />
                <span style={{ fontFamily: FONT.display, fontSize: 22, color: C.white, letterSpacing: 2 }}>COMING SOON</span>
                <div style={{ flex: 1, height: 1, background: C.border }} />
                <span onClick={() => setTab("comingsoon")} style={{ fontSize: 13, color: C.red, cursor: "pointer", fontWeight: 600 }}>See all →</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 16, padding: "8px 4px 20px" }}>
                {events.slice(0, 3).map(e => <ComingSoonCard key={e.id} event={e} reminded={remindedIds.includes(e.id)} onRemind={() => handleRemind(e)} getCountdown={getCountdown} />)}
              </div>
            </>
          )}
        </div>
      </>}

      {/* ── COMING SOON TAB ── */}
      {tab === "comingsoon" && (
        <div style={{ padding: "100px 4% 60px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 32 }}>
            <div style={{ width: 4, height: 32, background: C.red, borderRadius: 2 }} />
            <span style={{ fontFamily: FONT.display, fontSize: 36, color: C.white, letterSpacing: 3 }}>COMING SOON</span>
          </div>
          {events.length === 0
            ? <div style={{ textAlign: "center", padding: "80px 0" }}>
                <div style={{ fontSize: 64, marginBottom: 16 }}>📅</div>
                <div style={{ fontFamily: FONT.display, fontSize: 28, color: C.white, letterSpacing: 2, marginBottom: 12 }}>NO UPCOMING STREAMS</div>
                <div style={{ color: C.textMuted, fontSize: 14 }}>Creators haven't scheduled anything yet. Check back soon!</div>
              </div>
            : <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20 }}>
                {events.map(e => <ComingSoonCard key={e.id} event={e} reminded={remindedIds.includes(e.id)} onRemind={() => handleRemind(e)} getCountdown={getCountdown} />)}
              </div>
          }
        </div>
      )}

      {/* ── LEADERBOARD TAB ── */}
      {tab === "leaderboard" && (
        <div style={{ padding: "100px 4% 60px", maxWidth: 700, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 32 }}>
            <div style={{ width: 4, height: 32, background: C.red, borderRadius: 2 }} />
            <span style={{ fontFamily: FONT.display, fontSize: 36, color: C.white, letterSpacing: 3 }}>TOP CREATORS</span>
          </div>
          {[...streams].sort((a, b) => (b.totalEarned || b.total_earned || 0) - (a.totalEarned || a.total_earned || 0)).map((s, i) => (
            <div className="stream-row" key={s.id} style={{ background: C.card, borderRadius: 10, border: `1px solid ${i < 3 ? "rgba(229,9,20,0.3)" : C.border}`, padding: "16px 20px", display: "flex", alignItems: "center", gap: 14, marginBottom: 10 }}>
              <div style={{ fontFamily: FONT.display, fontSize: 24, width: 36, textAlign: "center", color: i === 0 ? "#FFD700" : i === 1 ? "#C0C0C0" : i === 2 ? "#CD7F32" : C.textMuted }}>
                {i < 3 ? ["🥇","🥈","🥉"][i] : `#${i+1}`}
              </div>
              <div style={{ fontSize: 28 }}>{s.emoji || "🎤"}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 15 }}>{s.creator}</div>
                <div style={{ color: C.textMuted, fontSize: 12 }}>{s.category}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontWeight: 800, color: "#4ade80", fontSize: 16 }}>{fmt(s.totalEarned || s.total_earned || 0, s.currency || "RWF")}</div>
                <div style={{ fontSize: 11, color: C.textMuted }}>total earned</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── ABOUT TAB ── */}
      {tab === "about" && (
        <div style={{ padding: "100px 4% 60px", maxWidth: 760, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div style={{ fontFamily: FONT.display, fontSize: 64, color: C.red, letterSpacing: 4, marginBottom: 12 }}>PLAY</div>
            <div style={{ fontFamily: FONT.display, fontSize: 28, color: C.white, letterSpacing: 2, marginBottom: 16 }}>RWANDA'S PREMIER LIVE STREAMING PLATFORM</div>
            <div style={{ color: C.textMuted, fontSize: 16, maxWidth: 500, margin: "0 auto", lineHeight: 1.8 }}>Watch and support your favorite creators live. Pay per view, send gifts, and be part of the moment.</div>
          </div>
          {[
            { emoji: "👁", title: "Browse for free", desc: "Discover all live streams happening right now — no signup needed." },
            { emoji: "💳", title: "Pay to join", desc: "Unlock any stream instantly with MTN MoMo, Airtel Money, or Visa." },
            { emoji: "🎬", title: "Watch & Chat", desc: "Enjoy the stream and interact with other viewers in real time." },
            { emoji: "🎁", title: "Send Gifts", desc: "Show your appreciation by sending gifts to creators during their live stream." },
            { emoji: "💰", title: "Creators get paid", desc: "Up to 95% of every payment goes directly to the creator — instantly." },
            { emoji: "📅", title: "Coming Soon", desc: "Creators can schedule upcoming streams so you never miss a show." },
          ].map((item, i) => (
            <div key={i} className="stream-row" style={{ background: C.card, borderRadius: 12, padding: "20px 24px", border: `1px solid ${C.border}`, display: "flex", gap: 16, marginBottom: 12, alignItems: "flex-start" }}>
              <div style={{ fontSize: 36, flexShrink: 0 }}>{item.emoji}</div>
              <div>
                <div style={{ fontFamily: FONT.display, fontSize: 18, color: C.white, letterSpacing: 1, marginBottom: 6 }}>{item.title.toUpperCase()}</div>
                <div style={{ color: C.textMuted, fontSize: 14, lineHeight: 1.7 }}>{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Footer */}
      <footer style={{ background: C.black, borderTop: `1px solid ${C.border}`, padding: "48px 4% 32px" }}>
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 32, marginBottom: 40 }}>
            <div>
              <div style={{ fontFamily: FONT.display, fontSize: 36, color: C.red, letterSpacing: 3, marginBottom: 12 }}>PLAY</div>
              <div style={{ color: C.textMuted, fontSize: 13, maxWidth: 240, lineHeight: 1.7 }}>Rwanda's Premier Live Streaming Pay-Per-View Platform. Built for creators.</div>
            </div>
            <div style={{ display: "flex", gap: 48, flexWrap: "wrap" }}>
              <div>
                <div style={{ fontSize: 11, color: C.textDim, textTransform: "uppercase", letterSpacing: 2, marginBottom: 16, fontWeight: 700 }}>Platform</div>
                {["Browse Streams", "Top Creators", "How it Works", "Pricing"].map(item => (
                  <div className="footer-link" key={item} style={{ color: C.textMuted, fontSize: 13, marginBottom: 10 }}>{item}</div>
                ))}
              </div>
              <div>
                <div style={{ fontSize: 11, color: C.textDim, textTransform: "uppercase", letterSpacing: 2, marginBottom: 16, fontWeight: 700 }}>Creators</div>
                {["Go Live", "Creator Studio", "Payouts", "Guidelines"].map(item => (
                  <div className="footer-link" key={item} style={{ color: C.textMuted, fontSize: 13, marginBottom: 10 }}>{item}</div>
                ))}
              </div>
              <div>
                <div style={{ fontSize: 11, color: C.textDim, textTransform: "uppercase", letterSpacing: 2, marginBottom: 16, fontWeight: 700 }}>Contact</div>
                <div style={{ color: C.textMuted, fontSize: 13, marginBottom: 8 }}>hello@play.rw</div>
                <div style={{ color: C.textMuted, fontSize: 13, marginBottom: 16 }}>Kigali, Rwanda</div>
                <div style={{ display: "flex", gap: 10 }}>
                  {["Twitter", "Instagram", "TikTok"].map(s => (
                    <div className="social-badge" key={s} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 6, padding: "5px 12px", fontSize: 11, color: C.textMuted }}>{s}</div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 24, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
            <div style={{ fontSize: 12, color: C.textDim }}>© 2026 Play Rwanda. All rights reserved.</div>
            <div style={{ fontSize: 12, color: C.textDim }}>Made with ❤️ in Kigali</div>
          </div>
        </div>
      </footer>
    </div>
  );
}


// ── HOST BROADCAST ─────────────────────────────────────────────────────────────
function HostBroadcast({ stream: s, onEnd, toast }) {
  const roomRef = useRef(null);
  const videoRef = useRef(null);
  const [status, setStatus] = useState("starting");
  const [errMsg, setErrMsg] = useState("");
  const [micMuted, setMicMuted] = useState(false);
  const [vidOff, setVidOff] = useState(false);
  const [viewers, setViewers] = useState(0);
  const [earnings, setEarnings] = useState(0);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    let mounted = true;
    let tIv = null;
    let vIv = null;

    const start = async () => {
      try {
        const res = await fetch(`/api/livekit-token?room=${s.id}&username=host-${s.id}&isHost=true`);
        const { token } = await res.json();
        const { Room, RoomEvent, createLocalVideoTrack, createLocalAudioTrack } = await import("livekit-client");

        const mediaStream = await navigator.mediaDevices.getUserMedia({ video: { width: 1280, height: 720 }, audio: true });
        if (mounted) setStatus("live");
        await new Promise(r => setTimeout(r, 100));
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          videoRef.current.muted = true;
          videoRef.current.playsInline = true;
          await videoRef.current.play().catch(e => console.warn("Preview:", e));
        }

        const room = new Room();
        roomRef.current = room;
        room.on(RoomEvent.ParticipantConnected, () => { if (mounted) setViewers(v => v + 1); });
        room.on(RoomEvent.ParticipantDisconnected, () => { if (mounted) setViewers(v => Math.max(0, v - 1)); });
        await room.connect("wss://play-rw-psye6scu.livekit.cloud", token);

        const videoTrack = await createLocalVideoTrack({ width: 1280, height: 720 });
        const audioTrack = await createLocalAudioTrack();
        await room.localParticipant.publishTrack(videoTrack);
        await room.localParticipant.publishTrack(audioTrack);

        if (mounted) {
          toast("You are LIVE! Viewers can see you!");
          await supabase.from("streams").update({ live: true, peer_id: room.name }).eq("id", s.id);
          tIv = setInterval(() => setSeconds(d => d + 1), 1000);
          vIv = setInterval(() => setEarnings(e => e + s.price * (1 - s.cut / 100)), 4000);

          // ✅ Auto-capture thumbnail every 30 seconds
          const captureThumbnail = async () => {
            if (!videoRef.current || !mounted) return;
            try {
              const canvas = document.createElement("canvas");
              canvas.width = 640;
              canvas.height = 360;
              const ctx = canvas.getContext("2d");
              ctx.drawImage(videoRef.current, 0, 0, 640, 360);
              canvas.toBlob(async (blob) => {
                if (!blob) return;
                const fileName = `stream-${s.id}-${Date.now()}.jpg`;
                const { data } = await supabase.storage.from("thumbnails").upload(fileName, blob, { upsert: true, contentType: "image/jpeg" });
                if (data) {
                  const { data: urlData } = supabase.storage.from("thumbnails").getPublicUrl(fileName);
                  await supabase.from("streams").update({ thumbnail_url: urlData.publicUrl }).eq("id", s.id);
                }
              }, "image/jpeg", 0.8);
            } catch (e) { console.warn("Thumbnail capture failed:", e); }
          };

          // Capture first thumbnail after 3 seconds, then every 30s
          setTimeout(captureThumbnail, 3000);
          const thumbIv = setInterval(captureThumbnail, 30000);
          // Store interval ref for cleanup
          window.__thumbIv = thumbIv;
        }
      } catch (err) {
        if (mounted) { setStatus("error"); setErrMsg(err.message); }
      }
    };

    start();
    return () => {
      mounted = false;
      clearInterval(tIv);
      clearInterval(vIv);
      if (roomRef.current) roomRef.current.disconnect();
    };
  }, []);

  const toggleMic = async () => { if (roomRef.current) { await roomRef.current.localParticipant.setMicrophoneEnabled(micMuted); setMicMuted(m => !m); } };
  const toggleVid = async () => { if (roomRef.current) { await roomRef.current.localParticipant.setCameraEnabled(vidOff); setVidOff(v => !v); } };
  const endStream = async () => {
    if (videoRef.current?.srcObject) videoRef.current.srcObject.getTracks().forEach(t => t.stop());
    if (roomRef.current) roomRef.current.disconnect();
    if (window.__thumbIv) clearInterval(window.__thumbIv);
    await supabase.from("streams").update({ live: false, peer_id: null, thumbnail_url: null }).eq("id", s.id);
    toast(`Stream ended! Earned ~${Math.round(earnings).toLocaleString()} RWF`);
    onEnd();
  };

  const dur = (() => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s2 = seconds % 60;
    return h > 0 ? `${h}:${String(m).padStart(2,"0")}:${String(s2).padStart(2,"0")}` : `${m}:${String(s2).padStart(2,"0")}`;
  })();

  return (
    <div style={{ position: "fixed", inset: 0, background: C.black, display: "flex", flexDirection: "column", fontFamily: FONT.body }}>
      <style>{GLOBAL_CSS}</style>

      {/* Top Bar */}
      <div style={{ background: "rgba(0,0,0,0.9)", borderBottom: `1px solid ${C.border}`, padding: "0 20px", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0, backdropFilter: "blur(10px)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <Logo />
          <div style={{ width: 1, height: 24, background: C.border }} />
          {status === "live" && <LiveBadge />}
          <span style={{ fontSize: 14, fontWeight: 600, color: C.white }}>{s.title}</span>
          {status === "live" && <span style={{ fontSize: 13, color: C.textMuted, background: C.surface, borderRadius: 4, padding: "2px 10px" }}>{dur}</span>}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 10, color: C.textMuted, textTransform: "uppercase", letterSpacing: 1 }}>Viewers</div>
            <div style={{ fontWeight: 700, color: C.white, fontSize: 16 }}>{viewers.toLocaleString()}</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 10, color: C.textMuted, textTransform: "uppercase", letterSpacing: 1 }}>Earned</div>
            <div style={{ fontWeight: 700, color: "#4ade80", fontSize: 16 }}>{Math.round(earnings).toLocaleString()} RWF</div>
          </div>
          <button className="btn-end" onClick={endStream} style={{ background: C.red, border: "none", borderRadius: 6, color: C.white, fontWeight: 700, padding: "8px 20px", cursor: "pointer", fontSize: 13, fontFamily: FONT.body }}>End Stream</button>
        </div>
      </div>

      {/* Video */}
      <div style={{ flex: 1, position: "relative", background: "#000" }}>
        {status === "starting" && (
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16 }}>
            <div style={{ display: "flex", gap: 8 }}>{[0,1,2].map(i => <div key={i} style={{ width: 10, height: 10, borderRadius: "50%", background: C.red, animation: `bounce 0.7s ${i*0.15}s ease-in-out infinite alternate` }} />)}</div>
            <div style={{ color: C.white, fontWeight: 600, fontSize: 16 }}>Starting camera...</div>
            <div style={{ color: C.textMuted, fontSize: 14 }}>Allow camera & microphone access</div>
          </div>
        )}
        {status === "error" && (
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, padding: 24 }}>
            <div style={{ fontSize: 48 }}>⚠️</div>
            <div style={{ color: C.red, fontWeight: 700, fontSize: 18 }}>Camera Failed</div>
            <div style={{ color: C.textMuted, fontSize: 14, maxWidth: 300, textAlign: "center" }}>{errMsg}</div>
            <button onClick={onEnd} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: "10px 24px", color: C.white, fontWeight: 600, cursor: "pointer", fontFamily: FONT.body }}>← Go Back</button>
          </div>
        )}
        {status === "live" && (
          <>
            <video ref={videoRef} autoPlay muted playsInline style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", display: vidOff ? "none" : "block" }} />
            {vidOff && <div style={{ position: "absolute", inset: 0, background: C.surface, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 8 }}><div style={{ fontSize: 48 }}>📷</div><div style={{ color: C.textMuted }}>Camera is off</div></div>}

            {/* Live indicator */}
            <div style={{ position: "absolute", top: 16, left: 16 }}><LiveBadge /></div>

            {/* Controls */}
            <div style={{ position: "absolute", bottom: 28, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 14 }}>
              <button className="ctrl-btn" onClick={toggleMic} style={{ background: micMuted ? C.red : "rgba(0,0,0,0.7)", border: `1px solid ${micMuted ? C.red : C.border}`, borderRadius: 50, width: 56, height: 56, fontSize: 22, cursor: "pointer", color: C.white, backdropFilter: "blur(10px)" }}>
                {micMuted ? "🔇" : "🎤"}
              </button>
              <button className="ctrl-btn" onClick={toggleVid} style={{ background: vidOff ? C.red : "rgba(0,0,0,0.7)", border: `1px solid ${vidOff ? C.red : C.border}`, borderRadius: 50, width: 56, height: 56, fontSize: 22, cursor: "pointer", color: C.white, backdropFilter: "blur(10px)" }}>
                {vidOff ? "📷" : "📹"}
              </button>
              {/* Manual thumbnail capture */}
              <button className="ctrl-btn" onClick={async () => {
                if (!videoRef.current) return;
                const canvas = document.createElement("canvas");
                canvas.width = 640; canvas.height = 360;
                canvas.getContext("2d").drawImage(videoRef.current, 0, 0, 640, 360);
                canvas.toBlob(async (blob) => {
                  const fileName = `stream-${s.id}-manual.jpg`;
                  const { data } = await supabase.storage.from("thumbnails").upload(fileName, blob, { upsert: true, contentType: "image/jpeg" });
                  if (data) {
                    const { data: urlData } = supabase.storage.from("thumbnails").getPublicUrl(fileName);
                    await supabase.from("streams").update({ thumbnail_url: urlData.publicUrl }).eq("id", s.id);
                    toast("📸 Thumbnail updated!");
                  }
                }, "image/jpeg", 0.8);
              }} style={{ background: "rgba(0,0,0,0.7)", border: `1px solid ${C.border}`, borderRadius: 50, width: 56, height: 56, fontSize: 22, cursor: "pointer", color: C.white, backdropFilter: "blur(10px)" }} title="Capture thumbnail">
                📸
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ── LIVE ROOM (VIEWER) ─────────────────────────────────────────────────────────
function LiveRoom({ stream: s, user, go, toast }) {
  const roomRef = useRef(null);
  const videoRef = useRef(null);
  const [status, setStatus] = useState("connecting");
  const [errMsg, setErrMsg] = useState("");
  const [messages, setMessages] = useState([
    { user: "Mugabo", text: "🔥🔥🔥 Amazing!", me: false },
    { user: "Ingabire", text: "Neza cyane! ❤️", me: false },
    { user: user.name, text: "Just joined!", me: true },
  ]);
  const [msg, setMsg] = useState("");
  const [viewers, setViewers] = useState((s.viewers || 100) + 1);
  const [showGifts, setShowGifts] = useState(false);
  const [giftNotif, setGiftNotif] = useState(null);
  const chatRef = useRef(null);
  const isMobile = window.innerWidth < 640;

  useEffect(() => {
    let mounted = true;
    let chatIv = null;

    const connect = async () => {
      try {
        const res = await fetch(`/api/livekit-token?room=${s.id}&username=${encodeURIComponent(user.name)}-${Date.now()}&isHost=false`);
        const { token } = await res.json();
        const { Room, RoomEvent, Track } = await import("livekit-client");
        const room = new Room();
        roomRef.current = room;

        room.on(RoomEvent.TrackSubscribed, (track) => {
          if (!mounted) return;
          const element = track.attach();
          if (track.kind === Track.Kind.Video) {
            element.style.position = "absolute";
            element.style.inset = "0";
            element.style.width = "100%";
            element.style.height = "100%";
            element.style.objectFit = "cover";
            element.autoplay = true;
            element.playsInline = true;
            if (videoRef.current) { videoRef.current.innerHTML = ""; videoRef.current.appendChild(element); }
            setStatus("live");
          } else if (track.kind === Track.Kind.Audio) {
            element.autoplay = true;
            document.body.appendChild(element);
          }
        });

        room.on(RoomEvent.TrackUnsubscribed, (track) => { if (track.kind === "video") { track.detach(); if (mounted) setStatus("ended"); } });
        room.on(RoomEvent.ParticipantConnected, () => { if (mounted) setViewers(v => v + 1); });
        room.on(RoomEvent.Disconnected, () => { if (mounted) setStatus("ended"); });

        await room.connect("wss://play-rw-psye6scu.livekit.cloud", token);

        room.remoteParticipants.forEach(participant => {
          participant.trackPublications.forEach(pub => {
            if (pub.track) {
              const element = pub.track.attach();
              if (pub.track.kind === Track.Kind.Video) {
                element.style.position = "absolute"; element.style.inset = "0";
                element.style.width = "100%"; element.style.height = "100%";
                element.style.objectFit = "cover"; element.autoplay = true; element.playsInline = true;
                if (videoRef.current) { videoRef.current.innerHTML = ""; videoRef.current.appendChild(element); }
                if (mounted) setStatus("live");
              } else if (pub.track.kind === Track.Kind.Audio) {
                element.autoplay = true; document.body.appendChild(element);
              }
            }
          });
        });

        chatIv = setInterval(() => {
          setViewers(v => v + Math.floor(Math.random() * 2));
          const u = FAKE_USERS[Math.floor(Math.random() * FAKE_USERS.length)];
          const m = FAKE_MSGS[Math.floor(Math.random() * FAKE_MSGS.length)];
          setMessages(p => [...p.slice(-40), { user: u, text: m, me: false }]);
        }, 2500);

      } catch (err) {
        if (mounted) { setStatus("error"); setErrMsg("Could not connect to stream!"); }
      }
    };

    connect();
    return () => {
      mounted = false;
      clearInterval(chatIv);
      if (roomRef.current) roomRef.current.disconnect();
    };
  }, []);

  useEffect(() => { if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight; }, [messages]);

  const sendMsg = () => { if (!msg.trim()) return; setMessages(p => [...p, { user: user.name, text: msg, me: true }]); setMsg(""); };
  const leave = () => { if (roomRef.current) roomRef.current.disconnect(); go(); };
  const onGiftSent = gift => {
    setGiftNotif(gift);
    setMessages(p => [...p, { user: user.name, text: `${gift.emoji} Sent a ${gift.name}!`, me: true, isGift: true }]);
    setTimeout(() => setGiftNotif(null), 3000);
    toast(`${gift.emoji} Gift sent!`);
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: C.black, display: "flex", flexDirection: "column", fontFamily: FONT.body }}>
      <style>{GLOBAL_CSS}</style>

      {giftNotif && (
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", zIndex: 500, textAlign: "center", pointerEvents: "none", animation: "fadeIn 0.3s ease" }}>
          <div style={{ fontSize: 80 }}>{giftNotif.emoji}</div>
          <div style={{ color: C.white, fontWeight: 800, fontSize: 18 }}>{giftNotif.name}!</div>
        </div>
      )}

      {/* Top Bar */}
      <div style={{ background: "rgba(0,0,0,0.9)", borderBottom: `1px solid ${C.border}`, padding: "0 16px", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0, backdropFilter: "blur(10px)", gap: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Avatar name={s.creator} size={32} />
          <div>
            <div style={{ fontWeight: 700, fontSize: 14, color: C.white }}>{s.creator}</div>
            <div style={{ fontSize: 11, color: C.textMuted }}>{s.title}</div>
          </div>
          <div style={{ marginLeft: 6 }}><LiveBadge /></div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ background: status === "live" ? "rgba(74,222,128,0.15)" : C.surface, border: `1px solid ${status === "live" ? "rgba(74,222,128,0.4)" : C.border}`, borderRadius: 6, padding: "4px 12px", fontSize: 11, color: status === "live" ? "#4ade80" : C.red, fontWeight: 700 }}>
            {status === "connecting" ? "Connecting..." : status === "live" ? "Live" : status === "ended" ? "Ended" : "Error"}
          </div>
          <div style={{ fontSize: 12, color: C.textMuted }}>👁 {viewers.toLocaleString()}</div>
          <button onClick={() => setShowGifts(true)} style={{ background: C.red, border: "none", borderRadius: 6, color: C.white, fontWeight: 700, padding: "7px 14px", cursor: "pointer", fontSize: 12, fontFamily: FONT.body }}>🎁 Gift</button>
          <button onClick={leave} style={{ background: C.surface, border: `1px solid ${C.border}`, color: C.white, borderRadius: 6, padding: "7px 14px", fontWeight: 600, cursor: "pointer", fontSize: 12, fontFamily: FONT.body }}>Leave</button>
        </div>
      </div>

      {/* Main */}
      <div style={{ flex: 1, display: "flex", flexDirection: isMobile ? "column" : "row", overflow: "hidden" }}>

        {/* Video */}
        <div style={{ flex: isMobile ? "none" : 1, height: isMobile ? "42vh" : "auto", position: "relative", background: "#000" }}>
          {status === "error" && (
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12, padding: 24 }}>
              <div style={{ fontSize: 48 }}>⚠️</div>
              <div style={{ color: C.red, fontWeight: 700, fontSize: 18 }}>Connection Error</div>
              <div style={{ color: C.textMuted, fontSize: 13, textAlign: "center" }}>{errMsg}</div>
              <button onClick={go} style={{ background: C.red, border: "none", borderRadius: 8, padding: "10px 24px", color: C.white, fontWeight: 700, cursor: "pointer", fontFamily: FONT.body }}>← Home</button>
            </div>
          )}
          {status === "ended" && (
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12 }}>
              <div style={{ fontSize: 60 }}>📴</div>
              <div style={{ color: C.white, fontWeight: 700, fontSize: 20 }}>Stream Ended</div>
              <button onClick={go} style={{ background: C.red, border: "none", borderRadius: 8, padding: "10px 24px", color: C.white, fontWeight: 700, cursor: "pointer", fontFamily: FONT.body }}>← Home</button>
            </div>
          )}
          {status === "connecting" && (
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14, background: "radial-gradient(circle, #1a0505, #0a0a0a)" }}>
              <div style={{ fontSize: 64, animation: "float 3s ease-in-out infinite" }}>{s.emoji || "🎬"}</div>
              <div style={{ color: C.white, fontWeight: 700, fontSize: 16 }}>Connecting to {s.creator}...</div>
              <div style={{ display: "flex", gap: 8 }}>{[0,1,2].map(i => <div key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: C.red, animation: `bounce 0.7s ${i*0.15}s ease-in-out infinite alternate` }} />)}</div>
            </div>
          )}
          <div ref={videoRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", display: status === "live" ? "block" : "none" }} />
          {status === "live" && (
            <>
              <div style={{ position: "absolute", top: 12, left: 12 }}><LiveBadge /></div>
              <div style={{ position: "absolute", bottom: 14, left: 14, background: "rgba(0,0,0,0.8)", borderRadius: 6, padding: "8px 12px", backdropFilter: "blur(10px)" }}>
                <div style={{ fontSize: 10, color: C.textMuted, marginBottom: 2 }}>✅ Access granted</div>
                <div style={{ fontWeight: 700, color: C.white, fontSize: 12 }}>{fmt(s.price, s.currency)}</div>
              </div>
            </>
          )}
        </div>

        {/* Chat */}
        <div style={{ width: isMobile ? "100%" : 280, borderLeft: isMobile ? "none" : `1px solid ${C.border}`, borderTop: isMobile ? `1px solid ${C.border}` : "none", display: "flex", flexDirection: "column", background: C.card, flex: isMobile ? 1 : "none" }}>
          <div style={{ padding: "12px 14px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: C.white }}>Live Chat</span>
            <span style={{ fontSize: 12, color: C.textMuted }}>{viewers.toLocaleString()} watching</span>
          </div>
          <div ref={chatRef} style={{ flex: 1, overflowY: "auto", padding: "10px 12px", display: "flex", flexDirection: "column", gap: 10 }}>
            {messages.map((m, i) => (
              <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                <Avatar name={m.user} size={24} />
                <div>
                  <span style={{ fontSize: 11, fontWeight: 700, color: m.me ? C.red : m.isGift ? "#f59e0b" : C.textMuted }}>{m.user} </span>
                  <span style={{ fontSize: 13, color: m.isGift ? "#f59e0b" : C.white }}>{m.text}</span>
                </div>
              </div>
            ))}
          </div>
          <div style={{ padding: "10px 12px", borderTop: `1px solid ${C.border}`, display: "flex", gap: 8 }}>
            <input value={msg} onChange={e => setMsg(e.target.value)} onKeyDown={e => e.key === "Enter" && sendMsg()} placeholder="Send a message..." style={{ flex: 1, background: C.surface, border: `1px solid ${C.border}`, borderRadius: 6, padding: "9px 12px", color: C.white, fontSize: 13, fontFamily: FONT.body, outline: "none" }} />
            <button onClick={sendMsg} style={{ background: C.red, border: "none", borderRadius: 6, color: C.white, fontWeight: 700, padding: "9px 14px", cursor: "pointer", fontSize: 13 }}>→</button>
          </div>
        </div>
      </div>

      {/* Gifts Modal */}
      {showGifts && (
        <div style={{ position: "fixed", inset: 0, background: C.overlay, display: "flex", alignItems: "flex-end", justifyContent: "center", zIndex: 1000, padding: 16 }} onClick={() => setShowGifts(false)}>
          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: "20px 20px 12px 12px", padding: "24px 20px", width: "100%", maxWidth: 480, marginBottom: 8, animation: "slideUp 0.3s ease" }} onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <span style={{ fontFamily: FONT.display, fontSize: 22, color: C.white, letterSpacing: 1 }}>SEND A GIFT</span>
              <button onClick={() => setShowGifts(false)} style={{ background: C.surface, border: "none", color: C.textMuted, fontSize: 18, cursor: "pointer", borderRadius: "50%", width: 32, height: 32 }}>×</button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10 }}>
              {GIFTS.map(g => (
                <div className="gift-card" key={g.id} onClick={() => { onGiftSent(g); setShowGifts(false); }} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: "16px 8px", textAlign: "center" }}>
                  <div style={{ fontSize: 34, marginBottom: 6 }}>{g.emoji}</div>
                  <div style={{ fontWeight: 600, fontSize: 12, color: C.white, marginBottom: 4 }}>{g.name}</div>
                  <div style={{ color: C.red, fontSize: 11, fontWeight: 700 }}>{fmt(g.price, "RWF")}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── AUTH PAGE ──────────────────────────────────────────────────────────────────
function AuthPage({ type, go, onAuth }) {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "", category: "Music" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setError(""); setLoading(true);
    try {
      let profile;
      if (mode === "login") {
        const { data, error: e } = await supabase.auth.signInWithPassword({ email: form.email, password: form.password });
        if (e) throw new Error(e.message);
        const { data: p } = await supabase.from("users").select("*").eq("id", data.user.id).maybeSingle();
        profile = p || { id: data.user.id, email: form.email, name: form.email.split("@")[0], role: type };
      } else {
        if (!form.name || !form.email || !form.password) { setError("Please fill all fields"); setLoading(false); return; }
        const { data, error: e } = await supabase.auth.signUp({ email: form.email, password: form.password });
        if (e) throw new Error(e.message);
        profile = { id: data.user.id, name: form.name, email: form.email, role: type, handle: `@${form.name.toLowerCase().replace(" ","")}`, category: form.category };
        await supabase.from("users").upsert(profile);
      }
      onAuth(profile);
    } catch (err) { setError(err.message); setLoading(false); }
  };

  return (
    <div style={{ minHeight: "100vh", background: C.black, display: "flex", fontFamily: FONT.body }}>
      <style>{GLOBAL_CSS}</style>

      {/* Left — Branding */}
      <div style={{ flex: 1, display: "none", background: `linear-gradient(135deg, ${C.redDark}, #1a0505)`, alignItems: "center", justifyContent: "center", flexDirection: "column", padding: 48, "@media(min-width:768px)": { display: "flex" } }} className="auth-left">
        <div style={{ fontFamily: FONT.display, fontSize: 72, color: C.white, letterSpacing: 4, marginBottom: 16 }}>PLAY</div>
        <div style={{ fontSize: 18, color: "rgba(255,255,255,0.7)", textAlign: "center", maxWidth: 280, lineHeight: 1.6 }}>Rwanda's Premier Live Streaming Platform</div>
      </div>

      {/* Right — Form */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: 24, minWidth: 320 }}>
        <div style={{ width: "100%", maxWidth: 400 }}>
          <div style={{ textAlign: "center", marginBottom: 36 }}>
            <div style={{ fontFamily: FONT.display, fontSize: 42, color: C.red, letterSpacing: 3, marginBottom: 8 }}>PLAY</div>
            <div style={{ fontSize: 14, color: C.textMuted }}>{type === "creator" ? "Creator Portal" : "Sign in to watch"}</div>
          </div>

          {/* Toggle */}
          <div style={{ display: "flex", background: C.surface, borderRadius: 8, padding: 4, marginBottom: 28, border: `1px solid ${C.border}` }}>
            {["login", "signup"].map(m => (
              <button key={m} onClick={() => { setMode(m); setError(""); }} style={{ flex: 1, background: mode === m ? C.red : "transparent", border: "none", borderRadius: 6, padding: "10px", color: mode === m ? C.white : C.textMuted, fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: FONT.body, transition: "all 0.2s" }}>
                {m === "login" ? "Sign In" : "Create Account"}
              </button>
            ))}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {mode === "signup" && (
              <div>
                <label style={{ fontSize: 11, color: C.textMuted, textTransform: "uppercase", letterSpacing: 1, display: "block", marginBottom: 6 }}>Full Name</label>
                <input style={{ width: "100%", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: "12px 16px", color: C.white, fontSize: 14, fontFamily: FONT.body, outline: "none" }} placeholder="e.g. Kalisa Brian" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
              </div>
            )}
            <div>
              <label style={{ fontSize: 11, color: C.textMuted, textTransform: "uppercase", letterSpacing: 1, display: "block", marginBottom: 6 }}>Email</label>
              <input style={{ width: "100%", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: "12px 16px", color: C.white, fontSize: 14, fontFamily: FONT.body, outline: "none" }} type="email" placeholder="you@example.com" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} onKeyDown={e => e.key === "Enter" && submit()} />
            </div>
            <div>
              <label style={{ fontSize: 11, color: C.textMuted, textTransform: "uppercase", letterSpacing: 1, display: "block", marginBottom: 6 }}>Password</label>
              <input style={{ width: "100%", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: "12px 16px", color: C.white, fontSize: 14, fontFamily: FONT.body, outline: "none" }} type="password" placeholder="••••••••" value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} onKeyDown={e => e.key === "Enter" && submit()} />
            </div>
            {error && <div style={{ background: "rgba(229,9,20,0.1)", border: "1px solid rgba(229,9,20,0.3)", borderRadius: 8, padding: "10px 14px", fontSize: 13, color: C.red }}>{error}</div>}
            <button onClick={submit} disabled={loading} style={{ width: "100%", background: C.red, border: "none", borderRadius: 8, padding: "13px", color: C.white, fontSize: 15, fontWeight: 700, cursor: "pointer", opacity: loading ? 0.7 : 1, fontFamily: FONT.body, marginTop: 4 }}>
              {loading ? "Please wait..." : mode === "login" ? "Sign In →" : "Create Account →"}
            </button>
            <button onClick={go} style={{ background: "transparent", border: "none", color: C.textMuted, cursor: "pointer", fontSize: 13, fontFamily: FONT.body, marginTop: 4 }}>← Back to Home</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── PAYMENT PAGE ───────────────────────────────────────────────────────────────
function PaymentPage({ stream: s, go, onSuccess, viewer }) {
  const [method, setMethod] = useState(null);
  const [phone, setPhone] = useState("");
  const [card, setCard] = useState({ number: "", expiry: "", cvv: "", name: "" });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const earn = s.price * (1 - s.cut / 100);

  const pay = async () => {
    if (!method) return;
    setLoading(true);
    await delay(2000);
    await supabase.from("transactions").insert({
      viewer_id: viewer?.id || "guest", creator_id: s.creator_id || "unknown",
      stream_id: s.id, stream: s.title, amount: s.price,
      currency: s.currency, earn, method: method.id, viewer: viewer?.name || "Guest"
    });
    setDone(true);
    setTimeout(() => onSuccess(), 100);
  };

  if (done) return (
    <div style={{ minHeight: "100vh", background: C.black, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: FONT.body }}>
      <style>{GLOBAL_CSS}</style>
      <div style={{ fontSize: 64, marginBottom: 16 }}>✅</div>
      <div style={{ fontFamily: FONT.display, fontSize: 32, color: C.white, letterSpacing: 2, marginBottom: 8 }}>PAYMENT SUCCESSFUL</div>
      <div style={{ color: C.textMuted, marginBottom: 24 }}>Joining stream...</div>
      <div style={{ background: C.card, borderRadius: 12, padding: "16px 28px", border: "1px solid rgba(74,222,128,0.3)", textAlign: "center" }}>
        <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 4 }}>Creator received</div>
        <div style={{ fontWeight: 800, color: "#4ade80", fontSize: 22 }}>{fmt(earn.toFixed(s.currency === "USD" ? 2 : 0), s.currency)}</div>
      </div>
    </div>
  );

  if (loading) return (
    <div style={{ minHeight: "100vh", background: C.black, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, fontFamily: FONT.body }}>
      <style>{GLOBAL_CSS}</style>
      <div style={{ display: "flex", gap: 8 }}>{[0,1,2].map(i => <div key={i} style={{ width: 12, height: 12, borderRadius: "50%", background: C.red, animation: `bounce 0.7s ${i*0.15}s ease-in-out infinite alternate` }} />)}</div>
      <div style={{ fontFamily: FONT.display, fontSize: 24, color: C.white, letterSpacing: 2 }}>PROCESSING...</div>
      {method?.id === "mtn" && <div style={{ background: "#FFCB0018", border: "1px solid #FFCB0044", borderRadius: 8, padding: "10px 20px", color: "#FFCB00", fontWeight: 600 }}>Check your MTN phone for prompt</div>}
      {method?.id === "airtel" && <div style={{ background: "rgba(229,9,20,0.1)", border: "1px solid rgba(229,9,20,0.3)", borderRadius: 8, padding: "10px 20px", color: C.red, fontWeight: 600 }}>Check your Airtel phone for prompt</div>}
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: C.black, fontFamily: FONT.body }}>
      <style>{GLOBAL_CSS}</style>

      {/* Nav */}
      <div style={{ background: "rgba(0,0,0,0.95)", borderBottom: `1px solid ${C.border}`, padding: "0 5%", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Logo onClick={go} />
        <span style={{ fontSize: 13, color: C.textMuted }}>🔒 Secure Checkout</span>
      </div>

      <div style={{ maxWidth: 500, margin: "0 auto", padding: "40px 20px" }}>
        <div style={{ fontFamily: FONT.display, fontSize: 28, color: C.white, letterSpacing: 2, marginBottom: 24 }}>COMPLETE PAYMENT</div>

        {/* Stream Preview */}
        <div style={{ background: C.card, borderRadius: 12, overflow: "hidden", marginBottom: 24, border: `1px solid ${C.border}` }}>
          <div style={{ height: 140, background: "linear-gradient(135deg, #1a0505, #0a0a0a)", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
            <div style={{ fontSize: 60, opacity: 0.4 }}>{s.emoji || "🎬"}</div>
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8 }}>
              <div style={{ fontSize: 28 }}>🔒</div>
              <div style={{ fontWeight: 700, fontSize: 14, color: C.white }}>Pay to unlock</div>
            </div>
            <div style={{ position: "absolute", top: 10, left: 12 }}><LiveBadge /></div>
            <div style={{ position: "absolute", bottom: 10, right: 12, background: C.red, borderRadius: 6, padding: "4px 12px", fontSize: 15, fontWeight: 800, color: C.white, fontFamily: FONT.display, letterSpacing: 1 }}>{fmt(s.price, s.currency)}</div>
          </div>
          <div style={{ padding: "14px 16px" }}>
            <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4, color: C.white }}>{s.title}</div>
            <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 12 }}>by {s.creator}</div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 4 }}>
              <span style={{ color: C.textMuted }}>Creator receives ({100 - s.cut}%)</span>
              <span style={{ fontWeight: 700, color: "#4ade80" }}>{fmt(earn.toFixed(s.currency === "USD" ? 2 : 0), s.currency)}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
              <span style={{ color: C.textMuted }}>Platform fee ({s.cut}%)</span>
              <span style={{ fontWeight: 700, color: C.red }}>{fmt((s.price * s.cut / 100).toFixed(s.currency === "USD" ? 2 : 0), s.currency)}</span>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div style={{ fontSize: 11, color: C.textMuted, textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 }}>Payment Method</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
          {PAY_METHODS.map(pm => (
            <div className="pay-card" key={pm.id} onClick={() => setMethod(pm)} style={{ background: method?.id === pm.id ? `${pm.color}15` : C.card, border: `1.5px solid ${method?.id === pm.id ? pm.color : C.border}`, borderRadius: 10, padding: "14px 16px", display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 44, height: 28, borderRadius: 6, background: pm.color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                {pm.id === "mtn" && <span style={{ fontSize: 10, fontWeight: 800, color: "#000" }}>MTN</span>}
                {pm.id === "airtel" && <span style={{ fontSize: 9, fontWeight: 800, color: "#fff" }}>AIRTEL</span>}
                {pm.id === "visa" && <div style={{ display: "flex" }}><div style={{ width: 14, height: 14, borderRadius: "50%", background: "#EB001B" }} /><div style={{ width: 14, height: 14, borderRadius: "50%", background: "#F79E1B", marginLeft: -6 }} /></div>}
              </div>
              <div style={{ flex: 1, fontWeight: 600, fontSize: 14, color: C.white }}>{pm.name}</div>
              {method?.id === pm.id && <div style={{ color: pm.color, fontWeight: 800, fontSize: 18 }}>✓</div>}
            </div>
          ))}
        </div>

        {method?.field === "phone" && (
          <div style={{ background: C.card, borderRadius: 10, padding: "16px", marginBottom: 16, border: `1px solid ${C.border}` }}>
            <label style={{ fontSize: 11, color: C.textMuted, textTransform: "uppercase", letterSpacing: 1, display: "block", marginBottom: 8 }}>Phone Number</label>
            <input style={{ width: "100%", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: "12px 16px", color: C.white, fontSize: 16, fontFamily: FONT.body, outline: "none" }} type="tel" placeholder={method.ph} value={phone} onChange={e => setPhone(e.target.value)} />
          </div>
        )}
        {method?.field === "card" && (
          <div style={{ background: C.card, borderRadius: 10, padding: "16px", marginBottom: 16, border: `1px solid ${C.border}` }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div><label style={{ fontSize: 11, color: C.textMuted, textTransform: "uppercase", letterSpacing: 1, display: "block", marginBottom: 6 }}>Card Number</label><input style={{ width: "100%", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: "12px 16px", color: C.white, fontSize: 14, fontFamily: FONT.body, outline: "none" }} placeholder="1234 5678 9012 3456" value={card.number} onChange={e => setCard(p => ({ ...p, number: e.target.value }))} /></div>
              <div><label style={{ fontSize: 11, color: C.textMuted, textTransform: "uppercase", letterSpacing: 1, display: "block", marginBottom: 6 }}>Name on Card</label><input style={{ width: "100%", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: "12px 16px", color: C.white, fontSize: 14, fontFamily: FONT.body, outline: "none" }} placeholder="e.g. Kalisa Brian" value={card.name} onChange={e => setCard(p => ({ ...p, name: e.target.value }))} /></div>
              <div style={{ display: "flex", gap: 12 }}>
                <div style={{ flex: 1 }}><label style={{ fontSize: 11, color: C.textMuted, textTransform: "uppercase", letterSpacing: 1, display: "block", marginBottom: 6 }}>Expiry</label><input style={{ width: "100%", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: "12px 16px", color: C.white, fontSize: 14, fontFamily: FONT.body, outline: "none" }} placeholder="MM/YY" value={card.expiry} onChange={e => setCard(p => ({ ...p, expiry: e.target.value }))} /></div>
                <div style={{ flex: 1 }}><label style={{ fontSize: 11, color: C.textMuted, textTransform: "uppercase", letterSpacing: 1, display: "block", marginBottom: 6 }}>CVV</label><input style={{ width: "100%", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: "12px 16px", color: C.white, fontSize: 14, fontFamily: FONT.body, outline: "none" }} placeholder="123" value={card.cvv} onChange={e => setCard(p => ({ ...p, cvv: e.target.value }))} /></div>
              </div>
            </div>
          </div>
        )}

        <button onClick={pay} disabled={!method} style={{ width: "100%", background: method ? C.red : C.surface, border: "none", borderRadius: 10, padding: "14px", color: C.white, fontSize: 15, fontWeight: 700, cursor: method ? "pointer" : "not-allowed", opacity: method ? 1 : 0.5, fontFamily: FONT.body, fontFamily: FONT.display, letterSpacing: 1, fontSize: 16 }}>
          {method ? `UNLOCK STREAM · ${fmt(s.price, s.currency)}` : "SELECT PAYMENT METHOD"}
        </button>
        <div style={{ textAlign: "center", color: C.textMuted, fontSize: 12, marginTop: 10 }}>🔒 Secure · Instant access · No hidden fees</div>
      </div>
    </div>
  );
}

// ── SCHEDULE TAB ──────────────────────────────────────────────────────────────
function ScheduleTab({ creator, toast, inp }) {
  const [events, setEvents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", price: "", currency: "RWF", category: "Music", emoji: "🎤", event_date: "" });

  useEffect(() => {
    supabase.from("events").select("*").eq("creator_id", creator.id).order("event_date", { ascending: true })
      .then(({ data }) => { if (data) setEvents(data); });
  }, []);

  const createEvent = async () => {
    if (!form.title || !form.price || !form.event_date) { toast("Fill title, price and date!"); return; }
    setLoading(true);
    try {
      const { data, error: e } = await supabase.from("events").insert({
        creator_id: creator.id,
        creator: creator.name,
        handle: creator.handle || `@${creator.name?.toLowerCase()}`,
        title: form.title,
        description: form.description,
        price: Number(form.price),
        currency: form.currency,
        category: form.category,
        emoji: form.emoji,
        event_date: new Date(form.event_date).toISOString(),
        remind_count: 0,
      }).select().single();
      if (e) throw new Error(e.message);
      setEvents(p => [data, ...p]);
      setShowForm(false);
      setForm({ title: "", description: "", price: "", currency: "RWF", category: "Music", emoji: "🎤", event_date: "" });
      toast("Stream scheduled!");
    } catch (err) { toast("Error: " + err.message); }
    setLoading(false);
  };

  const deleteEvent = async (id) => {
    await supabase.from("events").delete().eq("id", id);
    setEvents(p => p.filter(e => e.id !== id));
    toast("Event deleted!");
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 4, height: 20, background: C.red, borderRadius: 2 }} />
          <span style={{ fontFamily: FONT.display, fontSize: 18, letterSpacing: 2 }}>SCHEDULE A STREAM</span>
        </div>
        <button className="btn-red" onClick={() => setShowForm(true)} style={{ background: C.red, border: "none", borderRadius: 8, padding: "10px 22px", color: C.white, fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: FONT.display, letterSpacing: 1 }}>+ SCHEDULE</button>
      </div>

      {events.length === 0 && !showForm
        ? <div style={{ textAlign: "center", padding: "60px 0" }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>📅</div>
            <div style={{ fontFamily: FONT.display, fontSize: 22, color: C.white, letterSpacing: 2, marginBottom: 10 }}>NO SCHEDULED STREAMS</div>
            <div style={{ color: C.textMuted, fontSize: 14, marginBottom: 20 }}>Let your fans know what's coming next!</div>
            <button className="btn-red" onClick={() => setShowForm(true)} style={{ background: C.red, border: "none", borderRadius: 8, padding: "12px 28px", color: C.white, fontWeight: 700, cursor: "pointer", fontFamily: FONT.display, letterSpacing: 1 }}>SCHEDULE YOUR FIRST STREAM</button>
          </div>
        : events.map(e => (
          <div key={e.id} className="stream-row" style={{ background: C.card, borderRadius: 10, border: `1px solid ${C.border}`, padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, marginBottom: 10 }}>
            <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
              <div style={{ fontSize: 28 }}>{e.emoji}</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>{e.title}</div>
                <div style={{ color: C.textMuted, fontSize: 13 }}>{new Date(e.event_date).toLocaleString()} · {fmt(e.price, e.currency)}</div>
                {e.description && <div style={{ color: C.textMuted, fontSize: 12, marginTop: 4 }}>{e.description}</div>}
              </div>
            </div>
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 11, color: C.textMuted }}>Interested</div>
                <div style={{ fontWeight: 700, color: "#a78bfa" }}>🔔 {e.remind_count || 0}</div>
              </div>
              <button onClick={() => deleteEvent(e.id)} className="btn-danger" style={{ background: "transparent", border: `1px solid rgba(229,9,20,0.3)`, color: C.red, borderRadius: 6, padding: "6px 14px", fontSize: 12, cursor: "pointer", fontFamily: FONT.body }}>Delete</button>
            </div>
          </div>
        ))
      }

      {/* Schedule Form Modal */}
      {showForm && (
        <div style={{ position: "fixed", inset: 0, background: C.overlay, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 16 }} onClick={() => setShowForm(false)}>
          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: "32px 28px", width: "100%", maxWidth: 480, animation: "fadeIn 0.3s ease" }} onClick={e => e.stopPropagation()}>
            <div style={{ fontFamily: FONT.display, fontSize: 22, color: C.white, letterSpacing: 2, marginBottom: 24 }}>SCHEDULE A STREAM</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <label style={{ fontSize: 11, color: C.textMuted, textTransform: "uppercase", letterSpacing: 1, display: "block", marginBottom: 8 }}>Stream Title *</label>
                <input style={inp} placeholder="e.g. Music Concert Night" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} />
              </div>
              <div>
                <label style={{ fontSize: 11, color: C.textMuted, textTransform: "uppercase", letterSpacing: 1, display: "block", marginBottom: 8 }}>Description (tell fans what to expect)</label>
                <textarea style={{ ...inp, height: 80, resize: "none" }} placeholder="e.g. Join me for an exclusive live music show..." value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} />
              </div>
              <div>
                <label style={{ fontSize: 11, color: C.textMuted, textTransform: "uppercase", letterSpacing: 1, display: "block", marginBottom: 8 }}>Date & Time *</label>
                <input style={inp} type="datetime-local" value={form.event_date} onChange={e => setForm(p => ({ ...p, event_date: e.target.value }))} />
              </div>
              <div style={{ display: "flex", gap: 12 }}>
                <div style={{ flex: 2 }}>
                  <label style={{ fontSize: 11, color: C.textMuted, textTransform: "uppercase", letterSpacing: 1, display: "block", marginBottom: 8 }}>Entry Price *</label>
                  <input style={inp} type="number" placeholder="e.g. 500" value={form.price} onChange={e => setForm(p => ({ ...p, price: e.target.value }))} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: 11, color: C.textMuted, textTransform: "uppercase", letterSpacing: 1, display: "block", marginBottom: 8 }}>Currency</label>
                  <select style={inp} value={form.currency} onChange={e => setForm(p => ({ ...p, currency: e.target.value }))}><option>RWF</option><option>USD</option></select>
                </div>
              </div>
              <div style={{ display: "flex", gap: 12 }}>
                <div style={{ flex: 2 }}>
                  <label style={{ fontSize: 11, color: C.textMuted, textTransform: "uppercase", letterSpacing: 1, display: "block", marginBottom: 8 }}>Category</label>
                  <select style={inp} value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}>
                    {CATS.filter(c => c !== "All").map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: 11, color: C.textMuted, textTransform: "uppercase", letterSpacing: 1, display: "block", marginBottom: 8 }}>Emoji</label>
                  <input style={inp} placeholder="🎤" value={form.emoji} onChange={e => setForm(p => ({ ...p, emoji: e.target.value }))} maxLength={2} />
                </div>
              </div>
              <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
                <button className="btn-red" onClick={createEvent} disabled={loading} style={{ flex: 1, background: C.red, border: "none", borderRadius: 10, padding: "13px", color: C.white, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: FONT.display, letterSpacing: 1, opacity: loading ? 0.7 : 1 }}>
                  {loading ? "SAVING..." : "SCHEDULE STREAM"}
                </button>
                <button className="btn-surface" onClick={() => setShowForm(false)} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, padding: "13px 20px", color: C.white, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: FONT.body }}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── CREATOR STUDIO ─────────────────────────────────────────────────────────────
function CreatorStudio({ creator, go, toast }) {
  const [tab, setTab] = useState("streams");
  const [streams, setStreams] = useState([]);
  const [txns, setTxns] = useState([]);
  const [showCreate, setShowCreate] = useState(false);
  const [hosting, setHosting] = useState(false);
  const [activeStream, setActiveStream] = useState(null);
  const [form, setForm] = useState({ title: "", price: "", currency: "RWF", cut: 15, category: creator.category || "Music", thumbnailFile: null, thumbnailPreview: null });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.from("streams").select("*").eq("creator_id", creator.id).then(({ data }) => { if (data) setStreams(data); });
  }, []);

  useEffect(() => {
    if (tab === "transactions") {
      supabase.from("transactions").select("*").eq("creator_id", creator.id).order("created_at", { ascending: false }).then(({ data }) => { if (data) setTxns(data); });
    }
  }, [tab]);

  const startLive = async () => {
    if (!form.title || !form.price) { toast("Please fill title and price!"); return; }
    setLoading(true);
    try {
      // Upload custom thumbnail if provided
      let thumbnailUrl = null;
      if (form.thumbnailFile) {
        const fileName = `custom-${creator.id}-${Date.now()}.jpg`;
        const { data } = await supabase.storage.from("thumbnails").upload(fileName, form.thumbnailFile, { upsert: true, contentType: form.thumbnailFile.type });
        if (data) {
          const { data: urlData } = supabase.storage.from("thumbnails").getPublicUrl(fileName);
          thumbnailUrl = urlData.publicUrl;
        }
      }

      const { data: s, error: e } = await supabase.from("streams").insert({
        creator_id: creator.id, creator: creator.name,
        handle: creator.handle || `@${creator.name?.toLowerCase()}`,
        title: form.title, category: form.category, price: Number(form.price),
        currency: form.currency, cut: Number(form.cut), emoji: "🎤",
        bio: "", viewers: 0, total_earned: 0, live: true, peer_id: null,
        thumbnail_url: thumbnailUrl,
      }).select().single();
      if (e) throw new Error(e.message);
      setActiveStream(s); setShowCreate(false); setHosting(true);
    } catch (err) { toast("Error: " + err.message); }
    setLoading(false);
  };

  if (hosting && activeStream) return <HostBroadcast stream={activeStream} toast={toast} onEnd={() => { setHosting(false); setActiveStream(null); setStreams(p => [activeStream, ...p]); }} />;

  const totalEarned = streams.reduce((s, st) => s + (st.total_earned || 0), 0);
  const totalViewers = streams.reduce((s, st) => s + (st.viewers || 0), 0);

  const inp = { width: "100%", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: "12px 16px", color: C.white, fontSize: 14, fontFamily: FONT.body, outline: "none" };

  return (
    <div style={{ minHeight: "100vh", background: C.black, color: C.white, fontFamily: FONT.body }}>
      <style>{GLOBAL_CSS}</style>

      {/* Nav */}
      <div style={{ background: "rgba(0,0,0,0.95)", borderBottom: `1px solid ${C.border}`, padding: "0 5%", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <Logo onClick={go} />
          <div style={{ width: 1, height: 20, background: C.border }} />
          <span style={{ fontFamily: FONT.display, fontSize: 16, color: C.textMuted, letterSpacing: 2 }}>CREATOR STUDIO</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Avatar name={creator.name} size={30} />
          <span style={{ fontSize: 13, fontWeight: 600 }}>{creator.name}</span>
          <button onClick={go} style={{ background: "transparent", border: `1px solid ${C.border}`, color: C.textMuted, borderRadius: 6, padding: "6px 14px", fontSize: 12, cursor: "pointer", fontFamily: FONT.body }}>Sign Out</button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ background: "rgba(0,0,0,0.8)", borderBottom: `1px solid ${C.border}`, padding: "0 5%", display: "flex", gap: 4 }}>
        {[{ id: "streams", label: "MY STREAMS" }, { id: "schedule", label: "SCHEDULE" }, { id: "transactions", label: "TRANSACTIONS" }, { id: "payout", label: "PAYOUT" }].map(tb => (
          <button key={tb.id} onClick={() => setTab(tb.id)} style={{ background: "transparent", border: "none", borderBottom: tab === tb.id ? `2px solid ${C.red}` : "2px solid transparent", color: tab === tb.id ? C.white : C.textMuted, fontWeight: 700, fontSize: 12, padding: "16px 18px", cursor: "pointer", fontFamily: FONT.display, letterSpacing: 1.5, transition: "all 0.2s" }}>
            {tb.label}
          </button>
        ))}
      </div>

      <div style={{ maxWidth: 960, margin: "0 auto", padding: "32px 5%" }}>

        {/* Stats */}
        <div style={{ display: "flex", gap: 16, marginBottom: 32, flexWrap: "wrap" }}>
          {[
            { label: "Total Streams", value: streams.length, icon: "🎬" },
            { label: "Total Viewers", value: totalViewers.toLocaleString(), icon: "👁" },
            { label: "Total Earned", value: `${Math.round(totalEarned).toLocaleString()} RWF`, icon: "💰" },
          ].map(stat => (
            <div key={stat.label} style={{ flex: 1, minWidth: 160, background: C.card, borderRadius: 12, padding: "20px 24px", border: `1px solid ${C.border}` }}>
              <div style={{ fontSize: 24, marginBottom: 8 }}>{stat.icon}</div>
              <div style={{ fontSize: 11, color: C.textMuted, textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>{stat.label}</div>
              <div style={{ fontFamily: FONT.display, fontSize: 26, color: C.white, letterSpacing: 1 }}>{stat.value}</div>
            </div>
          ))}
        </div>

        {tab === "streams" && <>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 4, height: 20, background: C.red, borderRadius: 2 }} />
              <span style={{ fontFamily: FONT.display, fontSize: 18, letterSpacing: 2 }}>MY STREAMS</span>
            </div>
            <button onClick={() => setShowCreate(true)} style={{ background: C.red, border: "none", borderRadius: 8, padding: "10px 22px", color: C.white, fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: FONT.display, letterSpacing: 1 }}>+ GO LIVE</button>
          </div>
          {streams.length === 0
            ? <div style={{ textAlign: "center", padding: "80px 0" }}>
                <div style={{ fontSize: 64, marginBottom: 16 }}>🎬</div>
                <div style={{ fontFamily: FONT.display, fontSize: 24, color: C.white, letterSpacing: 2, marginBottom: 12 }}>NO STREAMS YET</div>
                <button onClick={() => setShowCreate(true)} style={{ background: C.red, border: "none", borderRadius: 8, padding: "12px 28px", color: C.white, fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: FONT.display, letterSpacing: 1 }}>START YOUR FIRST LIVE</button>
              </div>
            : streams.map(s => (
              <div key={s.id} style={{ background: C.card, borderRadius: 10, border: `1px solid ${C.border}`, padding: "18px 22px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, marginBottom: 10 }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>{s.title}</div>
                  <div style={{ color: C.textMuted, fontSize: 13 }}>{s.category} · {fmt(s.price, s.currency)}/viewer</div>
                </div>
                <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
                  <div style={{ textAlign: "right" }}><div style={{ fontSize: 11, color: C.textMuted }}>Viewers</div><div style={{ fontWeight: 700 }}>👁 {s.viewers || 0}</div></div>
                  <div style={{ textAlign: "right" }}><div style={{ fontSize: 11, color: C.textMuted }}>Earned</div><div style={{ fontWeight: 800, color: "#4ade80", fontSize: 16 }}>{fmt(s.total_earned || 0, s.currency)}</div></div>
                  {s.live && <LiveBadge />}
                </div>
              </div>
            ))
          }
        </>}

        {tab === "schedule" && <ScheduleTab creator={creator} toast={toast} inp={inp} />}

        {tab === "transactions" && <>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
            <div style={{ width: 4, height: 20, background: C.red, borderRadius: 2 }} />
            <span style={{ fontFamily: FONT.display, fontSize: 18, letterSpacing: 2 }}>TRANSACTIONS</span>
          </div>
          {txns.length === 0
            ? <div style={{ textAlign: "center", padding: "60px 0", color: C.textMuted }}><div style={{ fontSize: 48, marginBottom: 12 }}>💳</div><div style={{ fontFamily: FONT.display, fontSize: 20, letterSpacing: 2 }}>NO TRANSACTIONS YET</div></div>
            : <div style={{ background: C.card, borderRadius: 12, border: `1px solid ${C.border}`, overflow: "hidden" }}>
                {txns.map((tx, i) => (
                  <div key={tx.id} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 18px", borderBottom: i < txns.length - 1 ? `1px solid ${C.border}` : "none" }}>
                    <Avatar name={tx.viewer || "?"} size={36} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>{tx.viewer || "Viewer"}</div>
                      <div style={{ fontSize: 12, color: C.textMuted }}>{new Date(tx.created_at).toLocaleString()}</div>
                    </div>
                    <div style={{ fontWeight: 800, color: "#4ade80", fontSize: 15 }}>+{fmt(tx.earn || 0, tx.currency)}</div>
                  </div>
                ))}
              </div>
          }
        </>}

        {tab === "payout" && <>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
            <div style={{ width: 4, height: 20, background: C.red, borderRadius: 2 }} />
            <span style={{ fontFamily: FONT.display, fontSize: 18, letterSpacing: 2 }}>PAYOUT SETTINGS</span>
          </div>
          {[{ key: "mtn", label: "MTN Mobile Money", color: "#FFCB00", tc: "#000", ph: "078 000 0000" }, { key: "airtel", label: "Airtel Money", color: C.red, tc: "#fff", ph: "073 000 0000" }].map(pm => (
            <div key={pm.key} style={{ background: C.card, borderRadius: 12, padding: "20px", border: `1px solid ${C.border}`, marginBottom: 14 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
                <div style={{ width: 44, height: 28, borderRadius: 6, background: pm.color, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ fontSize: 10, fontWeight: 800, color: pm.tc }}>{pm.key === "mtn" ? "MTN" : "AIRTEL"}</span>
                </div>
                <span style={{ fontWeight: 700, fontSize: 15 }}>{pm.label}</span>
              </div>
              <input style={inp} type="tel" placeholder={pm.ph} />
            </div>
          ))}
          <button onClick={() => toast("Payout settings saved!")} style={{ background: C.red, border: "none", borderRadius: 10, padding: "14px", color: C.white, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: FONT.display, letterSpacing: 1, width: "100%" }}>SAVE SETTINGS</button>
        </>}
      </div>

      {/* Go Live Modal */}
      {showCreate && (
        <div style={{ position: "fixed", inset: 0, background: C.overlay, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 16 }} onClick={() => setShowCreate(false)}>
          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: "28px 24px", width: "100%", maxWidth: 480, animation: "fadeIn 0.3s ease", maxHeight: "90vh", overflowY: "auto" }} onClick={e => e.stopPropagation()}>
            <div style={{ fontFamily: FONT.display, fontSize: 24, color: C.white, letterSpacing: 2, marginBottom: 24 }}>START A LIVE STREAM</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <label style={{ fontSize: 11, color: C.textMuted, textTransform: "uppercase", letterSpacing: 1, display: "block", marginBottom: 8 }}>Stream Title</label>
                <input style={inp} placeholder="e.g. Music Night Live" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} />
              </div>
              <div style={{ display: "flex", gap: 12 }}>
                <div style={{ flex: 2 }}>
                  <label style={{ fontSize: 11, color: C.textMuted, textTransform: "uppercase", letterSpacing: 1, display: "block", marginBottom: 8 }}>Entry Price</label>
                  <input style={inp} type="number" placeholder="e.g. 500" value={form.price} onChange={e => setForm(p => ({ ...p, price: e.target.value }))} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: 11, color: C.textMuted, textTransform: "uppercase", letterSpacing: 1, display: "block", marginBottom: 8 }}>Currency</label>
                  <select style={{ ...inp }} value={form.currency} onChange={e => setForm(p => ({ ...p, currency: e.target.value }))}><option>RWF</option><option>USD</option></select>
                </div>
              </div>
              <div>
                <label style={{ fontSize: 11, color: C.textMuted, textTransform: "uppercase", letterSpacing: 1, display: "block", marginBottom: 8 }}>Category</label>
                <select style={inp} value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}>
                  {CATS.filter(c => c !== "All").map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: 11, color: C.textMuted, textTransform: "uppercase", letterSpacing: 1, display: "block", marginBottom: 8 }}>
                  Platform Fee — <span style={{ color: C.red }}>{form.cut}%</span> · You keep <span style={{ color: "#4ade80" }}>{100 - form.cut}%</span>
                </label>
                <input type="range" min={5} max={30} value={form.cut} onChange={e => setForm(p => ({ ...p, cut: Number(e.target.value) }))} style={{ width: "100%", accentColor: C.red }} />
              </div>
              {/* Thumbnail Upload */}
              <div>
                <label style={{ fontSize: 11, color: C.textMuted, textTransform: "uppercase", letterSpacing: 1, display: "block", marginBottom: 8 }}>Thumbnail (optional)</label>
                <div onClick={() => document.getElementById("thumb-upload").click()} style={{ border: `1px dashed ${C.border}`, borderRadius: 8, overflow: "hidden", cursor: "pointer", background: C.surface, minHeight: 80, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {form.thumbnailPreview
                    ? <img src={form.thumbnailPreview} alt="thumb" style={{ width: "100%", height: 120, objectFit: "cover" }} />
                    : <div style={{ textAlign: "center", padding: 16 }}>
                        <div style={{ fontSize: 24, marginBottom: 4 }}>🖼️</div>
                        <div style={{ color: C.textMuted, fontSize: 12 }}>Click to upload · If skipped, auto-captured from camera</div>
                      </div>
                  }
                  <input id="thumb-upload" type="file" accept="image/*" style={{ display: "none" }} onChange={e => {
                    const file = e.target.files[0];
                    if (file) setForm(p => ({ ...p, thumbnailFile: file, thumbnailPreview: URL.createObjectURL(file) }));
                  }} />
                </div>
              </div>
              <button onClick={startLive} disabled={loading} style={{ background: C.red, border: "none", borderRadius: 10, padding: "14px", color: C.white, fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: FONT.display, letterSpacing: 1, opacity: loading ? 0.7 : 1 }}>
                {loading ? "STARTING..." : "GO LIVE NOW"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── MAIN APP ───────────────────────────────────────────────────────────────────
export default function App() {
  const [splash, setSplash] = useState(true);
  const [screen, setScreen] = useState("home");
  const [viewer, setViewer] = useState(null);
  const [creator, setCreator] = useState(null);
  const [selected, setSelected] = useState(null);
  const [paid, setPaid] = useState(false);
  const [toastMsg, setToastMsg] = useState(null);
  const [streams, setStreams] = useState([]);
  const [loadingStreams, setLoadingStreams] = useState(true);

  const go = () => { setScreen("home"); setSelected(null); setPaid(false); };
  const toast = msg => setToastMsg(msg);

  // ✅ Auto login — restore session on page load
  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        const { data: profile } = await supabase.from("users").select("*").eq("id", session.user.id).maybeSingle();
        if (profile) {
          if (profile.role === "creator") {
            setCreator(profile);
          } else {
            setViewer(profile);
          }
        } else {
          // Basic profile from auth
          setViewer({ id: session.user.id, name: session.user.email?.split("@")[0], email: session.user.email, role: "viewer" });
        }
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_OUT") {
        setViewer(null);
        setCreator(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    supabase.from("streams").select("*").eq("live", true).order("created_at", { ascending: false })
      .then(({ data }) => { setStreams(data || []); setLoadingStreams(false); })
      .catch(() => { setStreams([]); setLoadingStreams(false); });
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setViewer(null);
    setCreator(null);
    setScreen("home");
  };

  if (splash) return <SplashScreen onDone={() => setSplash(false)} />;

  if (screen === "creatorAuth") return <AuthPage type="creator" go={go} onAuth={c => { setCreator(c); setScreen("creatorStudio"); }} />;
  if (screen === "creatorStudio" && creator) return <CreatorStudio creator={creator} go={go} toast={toast} />;
  if (screen === "viewerAuth") return <AuthPage type="viewer" go={go} onAuth={u => { setViewer(u); setScreen("payment"); }} />;
  if (screen === "payment" && selected) return <PaymentPage stream={selected} go={go} viewer={viewer} onSuccess={() => { setPaid(true); setScreen("live"); }} />;
  if (screen === "live" && paid && selected) return <LiveRoom stream={selected} user={viewer || { name: "Guest" }} go={go} toast={toast} />;

  return (
    <>
      <style>{GLOBAL_CSS}</style>
      {toastMsg && <Toast msg={toastMsg} onClose={() => setToastMsg(null)} />}
      <HomePage
        streams={streams}
        loadingStreams={loadingStreams}
        user={viewer}
        onLogin={() => setScreen("viewerAuth")}
        onLogout={handleLogout}
        onGoLive={() => setScreen("creatorAuth")}
        onWatch={s => { setSelected(s); viewer ? setScreen("payment") : setScreen("viewerAuth"); }}
      />
    </>
  );
}