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
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: ${C.black}; color: ${C.white}; font-family: ${FONT.body}; }
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: ${C.border}; border-radius: 4px; }
  @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
  @keyframes bounce { from{opacity:0.3;transform:translateY(0)} to{opacity:1;transform:translateY(-8px)} }
  @keyframes fadeIn { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
  @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
  @keyframes shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
  @keyframes slideUp { from{transform:translateY(100%);opacity:0} to{transform:translateY(0);opacity:1} }
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
    "linear-gradient(135deg, #1a0a0a, #2d0a0a)",
    "linear-gradient(135deg, #0a0a1a, #0a1a2d)",
    "linear-gradient(135deg, #0a1a0a, #1a2d0a)",
    "linear-gradient(135deg, #1a1a0a, #2d2a0a)",
    "linear-gradient(135deg, #1a0a1a, #2a0a2d)",
    "linear-gradient(135deg, #0a1a1a, #0a2d2a)",
  ];
  const grad = gradients[parseInt(s.id?.slice(-1) || 0) % gradients.length];

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ borderRadius: 8, overflow: "hidden", cursor: "pointer", transform: hovered ? "scale(1.03)" : "scale(1)", transition: "transform 0.2s ease", background: C.card }}
    >
      {/* Thumbnail */}
      <div style={{ position: "relative", height: 160, background: grad, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ fontSize: 52, filter: hovered ? "brightness(1.2)" : "brightness(0.9)", transition: "filter 0.2s" }}>{s.emoji || "🎬"}</div>
        <div style={{ position: "absolute", inset: 0, background: hovered ? "rgba(0,0,0,0.2)" : "rgba(0,0,0,0.4)", transition: "background 0.2s" }} />
        <div style={{ position: "absolute", top: 10, left: 10 }}><LiveBadge /></div>
        <div style={{ position: "absolute", top: 10, right: 10, background: "rgba(0,0,0,0.75)", borderRadius: 4, padding: "3px 8px", fontSize: 12, fontWeight: 700, color: C.white, fontFamily: FONT.body }}>{fmt(s.price, s.currency)}</div>
        <div style={{ position: "absolute", bottom: 10, left: 10, display: "flex", alignItems: "center", gap: 4, background: "rgba(0,0,0,0.75)", borderRadius: 4, padding: "3px 8px" }}>
          <span style={{ fontSize: 10, color: C.textMuted }}>👁</span>
          <span style={{ fontSize: 11, fontWeight: 600, color: C.white, fontFamily: FONT.body }}>{s.viewers?.toLocaleString()}</span>
        </div>
        {/* Category tag */}
        <div style={{ position: "absolute", bottom: 10, right: 10, background: C.surface, borderRadius: 4, padding: "3px 8px", fontSize: 10, fontWeight: 600, color: C.textMuted, fontFamily: FONT.body }}>{s.category}</div>
      </div>
      {/* Info */}
      <div style={{ padding: "12px 14px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
          <Avatar name={s.creator} size={28} />
          <div>
            <div style={{ fontWeight: 600, fontSize: 13, color: C.white, fontFamily: FONT.body }}>{s.creator}</div>
            <div style={{ fontSize: 11, color: C.textMuted, fontFamily: FONT.body }}>{s.handle}</div>
          </div>
        </div>
        <div style={{ fontWeight: 600, fontSize: 14, color: C.white, marginBottom: 4, fontFamily: FONT.body, lineHeight: 1.3 }}>{s.title}</div>
      </div>
    </div>
  );
}

// ── HOME PAGE ──────────────────────────────────────────────────────────────────
function HomePage({ streams, onWatch, onGoLive, user, onLogin, onLogout, loadingStreams }) {
  const [cat, setCat] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = streams.filter(s => {
    const mc = cat === "All" || s.category === cat;
    const ms = !search || s.title?.toLowerCase().includes(search.toLowerCase()) || s.creator?.toLowerCase().includes(search.toLowerCase());
    return mc && ms;
  });

  const featured = filtered[0];

  return (
    <div style={{ minHeight: "100vh", background: C.black, fontFamily: FONT.body }}>
      <style>{GLOBAL_CSS}</style>

      {/* Navbar */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, background: "linear-gradient(to bottom, rgba(0,0,0,0.95), rgba(0,0,0,0))", padding: "0 5%" }}>
        <div style={{ height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
            <Logo />
            <div style={{ display: "flex", gap: 20, display: "none" }}>
              {["Home", "Browse", "Top Creators"].map(item => (
                <span key={item} style={{ fontSize: 14, fontWeight: 500, color: C.textMuted, cursor: "pointer", transition: "color 0.2s" }}>{item}</span>
              ))}
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {user
              ? <>
                <Avatar name={user.name} size={32} />
                <span style={{ fontSize: 13, fontWeight: 600, color: C.white }}>{user.name}</span>
                <button onClick={onLogout} style={{ background: "transparent", border: `1px solid ${C.border}`, color: C.textMuted, borderRadius: 6, padding: "6px 14px", fontSize: 13, cursor: "pointer", fontFamily: FONT.body }}>Sign Out</button>
              </>
              : <button onClick={onLogin} style={{ background: "transparent", border: `1px solid ${C.border}`, color: C.white, borderRadius: 6, padding: "6px 16px", fontSize: 13, cursor: "pointer", fontFamily: FONT.body, fontWeight: 500 }}>Sign In</button>
            }
            <button onClick={onGoLive} style={{ background: C.red, border: "none", borderRadius: 6, color: C.white, fontWeight: 700, padding: "8px 20px", cursor: "pointer", fontSize: 13, fontFamily: FONT.body, letterSpacing: 0.5 }}>Go Live</button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      {featured && (
        <div style={{ position: "relative", height: "60vh", minHeight: 400, background: "linear-gradient(135deg, #1a0505, #0a0a0a)", display: "flex", alignItems: "flex-end", paddingBottom: 60, paddingLeft: "5%" }}>
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 120, opacity: 0.15 }}>{featured.emoji}</div>
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(0,0,0,0.9) 40%, transparent), linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 60%)" }} />
          <div style={{ position: "relative", zIndex: 2, maxWidth: 520, animation: "fadeIn 0.6s ease" }}>
            <LiveBadge />
            <div style={{ fontFamily: FONT.display, fontSize: 52, color: C.white, letterSpacing: 2, marginTop: 12, marginBottom: 8, lineHeight: 1 }}>{featured.title.toUpperCase()}</div>
            <div style={{ fontSize: 14, color: C.textMuted, marginBottom: 6 }}>{featured.creator} · {featured.viewers?.toLocaleString()} watching</div>
            <div style={{ fontSize: 13, color: C.textMuted, marginBottom: 20 }}>{featured.category} · {fmt(featured.price, featured.currency)} to join</div>
            <div style={{ display: "flex", gap: 12 }}>
              <button onClick={() => onWatch(featured)} style={{ background: C.white, border: "none", borderRadius: 6, color: C.black, fontWeight: 700, padding: "12px 28px", cursor: "pointer", fontSize: 15, fontFamily: FONT.body, display: "flex", alignItems: "center", gap: 8 }}>
                ▶ Watch Now
              </button>
              <button style={{ background: "rgba(255,255,255,0.1)", border: `1px solid ${C.border}`, borderRadius: 6, color: C.white, fontWeight: 600, padding: "12px 20px", cursor: "pointer", fontSize: 14, fontFamily: FONT.body }}>
                + More Info
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div style={{ padding: "32px 5% 60px", marginTop: featured ? 0 : 80 }}>

        {/* Search + Filter */}
        <div style={{ display: "flex", gap: 12, marginBottom: 28, flexWrap: "wrap", alignItems: "center" }}>
          <div style={{ position: "relative", flex: "1 1 280px", maxWidth: 400 }}>
            <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", fontSize: 15, color: C.textMuted }}>🔍</span>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search streams or creators..."
              style={{ width: "100%", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: "10px 16px 10px 40px", color: C.white, fontSize: 14, fontFamily: FONT.body, outline: "none" }}
            />
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {CATS.map(c => (
              <button key={c} onClick={() => setCat(c)} style={{ background: cat === c ? C.red : C.surface, border: `1px solid ${cat === c ? C.red : C.border}`, color: cat === c ? C.white : C.textMuted, borderRadius: 6, padding: "8px 16px", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: FONT.body, transition: "all 0.2s" }}>
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Section Title */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
          <div style={{ width: 4, height: 24, background: C.red, borderRadius: 2 }} />
          <span style={{ fontFamily: FONT.display, fontSize: 22, color: C.white, letterSpacing: 2 }}>LIVE NOW</span>
          <div style={{ flex: 1, height: 1, background: C.border }} />
          <span style={{ fontSize: 13, color: C.textMuted }}>{filtered.length} streams</span>
        </div>

        {/* Stream Grid */}
        {loadingStreams
          ? <div style={{ display: "flex", gap: 10, justifyContent: "center", padding: "60px 0" }}>
              {[0,1,2].map(i => <div key={i} style={{ width: 10, height: 10, borderRadius: "50%", background: C.red, animation: `bounce 0.7s ${i*0.15}s ease-in-out infinite alternate` }} />)}
            </div>
          : <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 16 }}>
              {filtered.map(s => <StreamCard key={s.id} stream={s} onClick={() => onWatch(s)} />)}
            </div>
        }
      </div>
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
    await supabase.from("streams").update({ live: false, peer_id: null }).eq("id", s.id);
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
          <button onClick={endStream} style={{ background: C.red, border: "none", borderRadius: 6, color: C.white, fontWeight: 700, padding: "8px 20px", cursor: "pointer", fontSize: 13, fontFamily: FONT.body }}>End Stream</button>
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
              <button onClick={toggleMic} style={{ background: micMuted ? C.red : "rgba(0,0,0,0.7)", border: `1px solid ${micMuted ? C.red : C.border}`, borderRadius: 50, width: 56, height: 56, fontSize: 22, cursor: "pointer", color: C.white, backdropFilter: "blur(10px)" }}>
                {micMuted ? "🔇" : "🎤"}
              </button>
              <button onClick={toggleVid} style={{ background: vidOff ? C.red : "rgba(0,0,0,0.7)", border: `1px solid ${vidOff ? C.red : C.border}`, borderRadius: 50, width: 56, height: 56, fontSize: 22, cursor: "pointer", color: C.white, backdropFilter: "blur(10px)" }}>
                {vidOff ? "📷" : "📹"}
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
                <div key={g.id} onClick={() => { onGiftSent(g); setShowGifts(false); }} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: "16px 8px", textAlign: "center", cursor: "pointer", transition: "all 0.2s" }}>
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
            <div key={pm.id} onClick={() => setMethod(pm)} style={{ background: method?.id === pm.id ? `${pm.color}15` : C.card, border: `1.5px solid ${method?.id === pm.id ? pm.color : C.border}`, borderRadius: 10, padding: "14px 16px", display: "flex", alignItems: "center", gap: 12, cursor: "pointer", transition: "all 0.2s" }}>
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

// ── CREATOR STUDIO ─────────────────────────────────────────────────────────────
function CreatorStudio({ creator, go, toast }) {
  const [tab, setTab] = useState("streams");
  const [streams, setStreams] = useState([]);
  const [txns, setTxns] = useState([]);
  const [showCreate, setShowCreate] = useState(false);
  const [hosting, setHosting] = useState(false);
  const [activeStream, setActiveStream] = useState(null);
  const [form, setForm] = useState({ title: "", price: "", currency: "RWF", cut: 15, category: creator.category || "Music" });
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
      const { data: s, error: e } = await supabase.from("streams").insert({
        creator_id: creator.id, creator: creator.name,
        handle: creator.handle || `@${creator.name?.toLowerCase()}`,
        title: form.title, category: form.category, price: Number(form.price),
        currency: form.currency, cut: Number(form.cut), emoji: "🎤",
        bio: "", viewers: 0, total_earned: 0, live: true, peer_id: null
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
        {[{ id: "streams", label: "MY STREAMS" }, { id: "transactions", label: "TRANSACTIONS" }, { id: "payout", label: "PAYOUT" }].map(tb => (
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
          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: "32px 28px", width: "100%", maxWidth: 440, animation: "fadeIn 0.3s ease" }} onClick={e => e.stopPropagation()}>
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

  useEffect(() => {
    supabase.from("streams").select("*").order("created_at", { ascending: false })
      .then(({ data }) => { setStreams(data?.length > 0 ? data : MOCK_STREAMS); setLoadingStreams(false); })
      .catch(() => { setStreams(MOCK_STREAMS); setLoadingStreams(false); });
  }, []);

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
        onLogout={() => setViewer(null)}
        onGoLive={() => setScreen("creatorAuth")}
        onWatch={s => { setSelected(s); viewer ? setScreen("payment") : setScreen("viewerAuth"); }}
      />
    </>
  );
}