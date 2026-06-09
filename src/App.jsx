import { useState, useEffect, useRef } from "react";
import { supabase } from "./supabase";

// ─────────────────────────────────────────────────────────────────────────────
// 🔴 PLAY RWANDA — Real Video with LiveKit 🇷🇼
// ─────────────────────────────────────────────────────────────────────────────

const R = "#E8002D";
const DARK = "#0A0A0C";
const DARKER = "#060608";
const CARD = "#111114";
const BORDER = "rgba(255,255,255,0.07)";
const TEXT = "#F0F0F4";
const MUTED = "rgba(240,240,244,0.45)";
const GREEN = "#4ade80";
const LIGHT = {
  bg: "#f5f5f7", card: "#ffffff", dark: "#ffffff",
  border: "rgba(0,0,0,0.08)", text: "#1a1a1a", muted: "rgba(0,0,0,0.4)"
};



function useTheme(dm) {
  return {
    bg: dm ? DARKER : LIGHT.bg,
    card: dm ? CARD : LIGHT.card,
    header: dm ? DARK : LIGHT.dark,
    border: dm ? BORDER : LIGHT.border,
    text: dm ? TEXT : LIGHT.text,
    muted: dm ? MUTED : LIGHT.muted,
    inp: {
      width: "100%", background: dm ? "#0D0D10" : LIGHT.bg,
      border: `1.5px solid ${dm ? BORDER : LIGHT.border}`,
      borderRadius: 12, padding: "12px 15px",
      color: dm ? TEXT : LIGHT.text, fontSize: 14,
      fontFamily: "sans-serif", outline: "none", boxSizing: "border-box"
    }
  };
}

const CATS = ["All", "Music", "Comedy", "Food", "Fitness", "Art", "Tech"];
const PAY_METHODS = [
  { id: "mtn", name: "MTN Mobile Money", color: "#FFCB00", tc: "#000", field: "phone", ph: "078 000 0000" },
  { id: "airtel", name: "Airtel Money", color: "#E8002D", tc: "#fff", field: "phone", ph: "073 000 0000" },
  { id: "visa", name: "Visa / Mastercard", color: "#1A1F71", tc: "#fff", field: "card", ph: "" },
];
const GIFTS = [
  { id: "g1", emoji: "❤️", name: "Heart", price: 100 },
  { id: "g2", emoji: "🔥", name: "Fire", price: 200 },
  { id: "g3", emoji: "👑", name: "Crown", price: 500 },
  { id: "g4", emoji: "💎", name: "Diamond", price: 1000 },
  { id: "g5", emoji: "🚀", name: "Rocket", price: 2000 },
  { id: "g6", emoji: "🦁", name: "Lion", price: 5000 },
];
const FAKE_USERS = ["Mugabo", "Ingabire", "Patrick", "Uwase", "Kalisa", "Nziza", "Gasana", "Cyusa"];
const FAKE_MSGS = ["🔥🔥🔥", "Amazing!", "Neza cyane!", "❤️❤️", "Keep going!", "Incredible! 😍", "Kigali represent! 🇷🇼"];
const MOCK_STREAMS = [
  { id: "s1", creator: "Kalisa Brian", handle: "@kalisa", title: "Indirimbo z'Urukundo 🎵", category: "Music", viewers: 1240, price: 500, currency: "RWF", cut: 10, emoji: "🎤", totalEarned: 620000, totalStreams: 24, live: true },
  { id: "s2", creator: "Mugisha Chris", handle: "@chrismug", title: "Comedy Night Live 😂", category: "Comedy", viewers: 2100, price: 1000, currency: "RWF", cut: 20, emoji: "🎭", totalEarned: 2100000, totalStreams: 41, live: true },
  { id: "s3", creator: "Nziza Amina", handle: "@amina_cooks", title: "Rwandan Cuisine 🍲", category: "Food", viewers: 560, price: 3, currency: "USD", cut: 12, emoji: "🍲", totalEarned: 1680, totalStreams: 18, live: true },
  { id: "s4", creator: "Habimana Joel", handle: "@joelfit", title: "Morning Workout 💪", category: "Fitness", viewers: 890, price: 300, currency: "RWF", cut: 10, emoji: "💪", totalEarned: 267000, totalStreams: 56, live: true },
  { id: "s5", creator: "Uwase Diane", handle: "@diane_art", title: "Live Painting 🎨", category: "Art", viewers: 380, price: 2, currency: "USD", cut: 15, emoji: "🎨", totalEarned: 760, totalStreams: 12, live: true },
  { id: "s6", creator: "Iradukunda Sara", handle: "@sara_talks", title: "Tech & Innovation 🚀", category: "Tech", viewers: 430, price: 1500, currency: "RWF", cut: 15, emoji: "🚀", totalEarned: 645000, totalStreams: 29, live: true },
];
const LANG = {
  en: {
    tagline: "Watch. Pay. Support.", sub: "Rwandan Creators. 🇷🇼",
    desc: "Join live streams instantly. Creators get paid immediately.",
    search: "Search streams or creators...", logIn: "Log In", signUp: "Sign Up",
    goLive: "🎬 Go Live", howItWorks: "How it Works", leave: "Leave",
    watching: "watching", copied: "🔗 Link shared! Tell your friends 🔥",
    gifts: "🎁 Gifts", sendGift: "Send Gift"
  },
  rw: {
    tagline: "Reba. Tanga. Shyigikira.", sub: "Abashushanyamateka bo mu Rwanda. 🇷🇼",
    desc: "Injira muri livestream byihuse. Abakora barahabwa amafaranga ako kanya.",
    search: "Shakisha streams cyangwa abakora...", logIn: "Injira", signUp: "Iyandikishe",
    goLive: "🎬 Tangira Live", howItWorks: "Uko Bikorwa", leave: "Sohoka",
    watching: "bareba", copied: "🔗 Sangijwe! Bwira inshuti 🔥",
    gifts: "🎁 Impano", sendGift: "Ohereza Impano"
  },
};
const fmt = (n, cur) => cur === "RWF" ? `${Number(n).toLocaleString()} RWF` : `$${Number(n).toFixed(2)}`;
const delay = ms => new Promise(r => setTimeout(r, ms));

// ── UI PRIMITIVES ─────────────────────────────────────────────────────────────
function Av({ name = "?", size = 40, photo = null }) {
  const hue = ((name.charCodeAt(0) || 65) * 37 + (name.charCodeAt(1) || 65) * 13) % 360;
  if (photo) return <img src={photo} alt={name} style={{ width: size, height: size, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }} />;
  return <div style={{ width: size, height: size, borderRadius: "50%", background: `hsl(${hue},60%,38%)`, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: size * 0.38, flexShrink: 0 }}>{name[0]}</div>;
}
function Logo({ go }) {
  return <div onClick={go} style={{ fontSize: 26, fontWeight: 800, color: R, cursor: "pointer", letterSpacing: "-1px" }}>play</div>;
}
function Toast({ msg, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t); }, []);
  return <div style={{ position: "fixed", bottom: 28, left: "50%", transform: "translateX(-50%)", zIndex: 9999, background: "#166534", color: "#fff", borderRadius: 14, padding: "13px 24px", fontWeight: 700, fontSize: 14, whiteSpace: "nowrap" }}>{msg}</div>;
}
function SplashScreen({ onDone }) {
  const [fade, setFade] = useState(false);
  useEffect(() => {
    const t1 = setTimeout(() => setFade(true), 1800);
    const t2 = setTimeout(() => onDone(), 2400);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);
  return (
    <div style={{ position: "fixed", inset: 0, background: DARKER, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", zIndex: 9999, transition: "opacity 0.6s", opacity: fade ? 0 : 1 }}>
      <div style={{ fontSize: 72, fontWeight: 800, color: R, letterSpacing: "-3px", marginBottom: 16 }}>play</div>
      <div style={{ color: MUTED, fontSize: 14, letterSpacing: "3px", textTransform: "uppercase", marginBottom: 40 }}>Rwanda 🇷🇼</div>
      <div style={{ display: "flex", gap: 10 }}>
        {[0, 1, 2].map(i => <div key={i} style={{ width: 9, height: 9, borderRadius: "50%", background: R, animation: `dotBounce 0.8s ${i * 0.18}s ease-in-out infinite alternate` }} />)}
      </div>
      <style>{`@keyframes dotBounce{from{opacity:0.3;transform:translateY(0)}to{opacity:1;transform:translateY(-8px)}}`}</style>
    </div>
  );
}

// ── 🎬 HOST BROADCAST — LiveKit ─────────────────────────────────────────────────
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
        // Get token from our API
        const res = await fetch(`/api/livekit-token?room=${s.id}&username=host-${s.id}&isHost=true`);
        const { token } = await res.json();

        // Dynamically import LiveKit
        const { Room, RoomEvent, createLocalTracks } = await import("livekit-client");

        // Create local tracks (camera + mic)
        const tracks = await createLocalTracks({ audio: true, video: { width: 1280, height: 720 } });

        // Show local preview
        const videoTrack = tracks.find(t => t.kind === "video");
        if (videoTrack && videoRef.current) {
          videoTrack.attach(videoRef.current);
        }

        // Connect to LiveKit room
        const room = new Room();
        roomRef.current = room;

        room.on(RoomEvent.ParticipantConnected, () => {
          if (mounted) setViewers(v => v + 1);
        });
        room.on(RoomEvent.ParticipantDisconnected, () => {
          if (mounted) setViewers(v => Math.max(0, v - 1));
        });

        await room.connect("wss://play-rw-psye6scu.livekit.cloud", token);

        // Publish tracks
        for (const track of tracks) {
          await room.localParticipant.publishTrack(track);
        }

        if (mounted) {
          setStatus("live");
          toast("🔴 You are LIVE! Viewers can see you! 🇷🇼");
          await supabase.from("streams").update({ live: true, peer_id: room.name }).eq("id", s.id);
          tIv = setInterval(() => setSeconds(d => d + 1), 1000);
          vIv = setInterval(() => {
            setEarnings(e => e + s.price * (1 - s.cut / 100));
          }, 4000);
        }

      } catch (err) {
        console.error("LiveKit error:", err);
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

  const toggleMic = async () => {
    if (roomRef.current) {
      await roomRef.current.localParticipant.setMicrophoneEnabled(micMuted);
      setMicMuted(m => !m);
    }
  };
  const toggleVid = async () => {
    if (roomRef.current) {
      await roomRef.current.localParticipant.setCameraEnabled(vidOff);
      setVidOff(v => !v);
    }
  };
  const endStream = async () => {
    if (roomRef.current) roomRef.current.disconnect();
    await supabase.from("streams").update({ live: false, peer_id: null }).eq("id", s.id);
    toast(`✅ Stream ended! Earned ~${Math.round(earnings).toLocaleString()} RWF 💚`);
    onEnd();
  };

  const dur = (() => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s2 = seconds % 60;
    return h > 0 ? `${h}:${String(m).padStart(2, "0")}:${String(s2).padStart(2, "0")}` : `${m}:${String(s2).padStart(2, "0")}`;
  })();

  return (
    <div style={{ position: "fixed", inset: 0, background: DARKER, display: "flex", flexDirection: "column", fontFamily: "sans-serif" }}>
      <div style={{ background: DARK, borderBottom: `1px solid ${BORDER}`, padding: "0 16px", height: 54, display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {status === "live" && <><div style={{ width: 8, height: 8, borderRadius: "50%", background: R, animation: "pulseDot 1.4s infinite" }} /><span style={{ fontSize: 11, fontWeight: 800, color: R }}>LIVE</span></>}
          <div style={{ fontSize: 13, fontWeight: 700, color: TEXT }}>{s.title}</div>
          {status === "live" && <div style={{ background: "rgba(255,255,255,0.08)", borderRadius: 8, padding: "2px 10px", fontSize: 11, color: MUTED }}>{dur}</div>}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ textAlign: "center" }}><div style={{ fontSize: 9, color: MUTED }}>Viewers</div><div style={{ fontWeight: 800, color: TEXT, fontSize: 14 }}>👁 {viewers}</div></div>
          <div style={{ textAlign: "center" }}><div style={{ fontSize: 9, color: MUTED }}>Earned</div><div style={{ fontWeight: 800, color: GREEN, fontSize: 14 }}>{Math.round(earnings).toLocaleString()} RWF</div></div>
          <button onClick={endStream} style={{ background: R, border: "none", borderRadius: 8, color: "#fff", fontWeight: 800, padding: "8px 18px", cursor: "pointer", fontSize: 13 }}>⏹ End</button>
        </div>
      </div>

      <div style={{ flex: 1, position: "relative", background: "#000" }}>
        {status === "starting" && (
          <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14, background: "#060608" }}>
            <div style={{ display: "flex", gap: 8 }}>{[0, 1, 2].map(i => <div key={i} style={{ width: 10, height: 10, borderRadius: "50%", background: R, animation: `dotBounce 0.7s ${i * 0.15}s ease-in-out infinite alternate` }} />)}</div>
            <div style={{ color: TEXT, fontWeight: 700, fontSize: 15 }}>Starting camera...</div>
            <div style={{ color: MUTED, fontSize: 13 }}>Please click Allow when browser asks! 📷🎤</div>
          </div>
        )}
        {status === "error" && (
          <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14, padding: 24 }}>
            <div style={{ fontSize: 48 }}>⚠️</div>
            <div style={{ color: R, fontWeight: 800, fontSize: 18 }}>Camera failed</div>
            <div style={{ color: MUTED, fontSize: 13, maxWidth: 300, textAlign: "center", lineHeight: 1.7 }}>{errMsg}</div>
            <button onClick={onEnd} style={{ background: "rgba(255,255,255,0.1)", border: `1px solid ${BORDER}`, borderRadius: 10, padding: "9px 20px", color: TEXT, fontWeight: 700, cursor: "pointer" }}>← Go Back</button>
          </div>
        )}
        {status === "live" && (
          <>
            <video ref={videoRef} autoPlay muted playsInline style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", display: vidOff ? "none" : "block" }} />
            {vidOff && <div style={{ position: "absolute", inset: 0, background: "#111", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 8 }}><div style={{ fontSize: 48 }}>📷</div><div style={{ color: MUTED, fontSize: 14 }}>Camera is off</div></div>}
            <div style={{ position: "absolute", top: 12, left: 14, background: "rgba(0,0,0,0.7)", borderRadius: 8, padding: "4px 12px", fontSize: 11, color: "#fff", fontWeight: 700 }}>📡 Broadcasting via LiveKit</div>
            <div style={{ position: "absolute", top: 12, right: 14, display: "flex", gap: 8 }}>
              <div style={{ background: micMuted ? "rgba(232,0,45,0.85)" : "rgba(0,0,0,0.7)", borderRadius: 8, padding: "4px 10px", fontSize: 11, color: "#fff", fontWeight: 700 }}>{micMuted ? "🔇 Muted" : "🎤 Live"}</div>
              <div style={{ background: vidOff ? "rgba(232,0,45,0.85)" : "rgba(0,0,0,0.7)", borderRadius: 8, padding: "4px 10px", fontSize: 11, color: "#fff", fontWeight: 700 }}>{vidOff ? "📷 Off" : "📹 On"}</div>
            </div>
            <div style={{ position: "absolute", bottom: 24, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 12 }}>
              <button onClick={toggleMic} style={{ background: micMuted ? "rgba(232,0,45,0.9)" : "rgba(0,0,0,0.75)", border: "none", borderRadius: 99, width: 56, height: 56, fontSize: 24, cursor: "pointer", color: "#fff" }}>{micMuted ? "🔇" : "🎤"}</button>
              <button onClick={toggleVid} style={{ background: vidOff ? "rgba(232,0,45,0.9)" : "rgba(0,0,0,0.75)", border: "none", borderRadius: 99, width: 56, height: 56, fontSize: 24, cursor: "pointer", color: "#fff" }}>{vidOff ? "📷" : "📹"}</button>
            </div>
          </>
        )}
      </div>
      <style>{`@keyframes pulseDot{0%,100%{opacity:1}50%{opacity:0.3}}@keyframes dotBounce{from{opacity:0.3;transform:translateY(0)}to{opacity:1;transform:translateY(-8px)}}`}</style>
    </div>
  );
}

// ── 🔴 LIVE ROOM — LiveKit Viewer ──────────────────────────────────────────────
function LiveRoom({ stream: s, user, go, toast, lang }) {
  const t = LANG[lang];
  const roomRef = useRef(null);
  const videoRef = useRef(null);
  const [status, setStatus] = useState("connecting");
  const [errMsg, setErrMsg] = useState("");
  const [messages, setMessages] = useState([
    { user: "Mugabo", text: "🔥🔥🔥 Amazing!", me: false },
    { user: "Ingabire", text: "Neza cyane! ❤️", me: false },
    { user: user.name, text: "Just joined! 🎉", me: true },
  ]);
  const [msg, setMsg] = useState("");
  const [viewers, setViewers] = useState((s.viewers || 100) + 1);
  const [showChat, setShowChat] = useState(true);
  const [showGifts, setShowGifts] = useState(false);
  const [giftNotif, setGiftNotif] = useState(null);
  const chatRef = useRef(null);

  useEffect(() => {
    let mounted = true;
    let chatIv = null;

    const connect = async () => {
      try {
        // Get viewer token
        const res = await fetch(`/api/livekit-token?room=${s.id}&username=${user.name}-${Date.now()}&isHost=false`);
        const { token } = await res.json();

        const { Room, RoomEvent, Track } = await import("livekit-client");

        const room = new Room();
        roomRef.current = room;

        // When host publishes video, show it
        room.on(RoomEvent.TrackSubscribed, (track, publication, participant) => {
          if (!mounted) return;
          if (track.kind === Track.Kind.Video) {
            track.attach(videoRef.current);
            setStatus("live");
          }
        });

        room.on(RoomEvent.TrackUnsubscribed, (track) => {
          if (track.kind === "video") {
            if (mounted) setStatus("ended");
          }
        });

        room.on(RoomEvent.ParticipantConnected, () => {
          if (mounted) setViewers(v => v + 1);
        });

        room.on(RoomEvent.Disconnected, () => {
          if (mounted) setStatus("ended");
        });

        await room.connect("wss://play-rw-psye6scu.livekit.cloud", token);

        // Check if host is already publishing
        room.remoteParticipants.forEach(participant => {
          participant.trackPublications.forEach(publication => {
            if (publication.track && publication.track.kind === "video") {
              publication.track.attach(videoRef.current);
              if (mounted) setStatus("live");
            }
          });
        });

        // Timeout — if no stream after 15s
        setTimeout(() => {
          if (mounted && status === "connecting") {
            setStatus("error");
            setErrMsg("Host is not live yet. Try again in a moment!");
          }
        }, 15000);

        chatIv = setInterval(() => {
          setViewers(v => v + Math.floor(Math.random() * 2));
          const u = FAKE_USERS[Math.floor(Math.random() * FAKE_USERS.length)];
          const m = FAKE_MSGS[Math.floor(Math.random() * FAKE_MSGS.length)];
          setMessages(p => [...p.slice(-40), { user: u, text: m, me: false }]);
        }, 2500);

      } catch (err) {
        console.error("LiveKit viewer error:", err);
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
    toast(`${gift.emoji} Gift sent! 💚`);
  };
  const share = () => { window.open(`https://wa.me/?text=${encodeURIComponent(`I'm watching ${s.creator} live on Play Rwanda! 🔴🇷🇼`)}`, "_blank"); toast(t.copied); };

  return (
    <div style={{ position: "fixed", inset: 0, background: DARKER, display: "flex", flexDirection: "column", fontFamily: "sans-serif" }}>
      {giftNotif && <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", zIndex: 500, textAlign: "center", pointerEvents: "none" }}><div style={{ fontSize: 80 }}>{giftNotif.emoji}</div><div style={{ color: "#fff", fontWeight: 800, fontSize: 18 }}>{giftNotif.name}!</div></div>}

      <div style={{ background: DARK, borderBottom: `1px solid ${BORDER}`, padding: "0 16px", height: 54, display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0, gap: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Av name={s.creator} size={32} />
          <div><div style={{ fontWeight: 800, fontSize: 13, color: TEXT }}>{s.creator}</div><div style={{ fontSize: 10, color: MUTED }}>{s.title}</div></div>
          <div style={{ display: "flex", alignItems: "center", gap: 4, marginLeft: 6 }}><div style={{ width: 6, height: 6, borderRadius: "50%", background: R, animation: "pulseDot 1.4s infinite" }} /><span style={{ fontSize: 9, fontWeight: 800, color: R }}>LIVE</span></div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ background: status === "live" ? "rgba(74,222,128,0.15)" : "rgba(232,0,45,0.15)", border: `1px solid ${status === "live" ? "rgba(74,222,128,0.4)" : "rgba(232,0,45,0.4)"}`, borderRadius: 8, padding: "3px 10px", fontSize: 10, color: status === "live" ? GREEN : R, fontWeight: 700 }}>
            {status === "connecting" ? "📡 Connecting..." : status === "live" ? "🟢 Live" : status === "ended" ? "⭕ Ended" : "⚠️ Error"}
          </div>
          <div style={{ textAlign: "center" }}><div style={{ fontSize: 9, color: MUTED }}>{t.watching}</div><div style={{ fontWeight: 800, color: TEXT, fontSize: 13 }}>👁 {viewers.toLocaleString()}</div></div>
          <button onClick={share} style={{ background: "#25D36622", border: "1px solid #25D36644", borderRadius: 8, color: "#25D366", padding: "5px 10px", cursor: "pointer", fontSize: 12, fontWeight: 700 }}>📤</button>
          <button onClick={() => setShowGifts(true)} style={{ background: "linear-gradient(135deg,#f59e0b,#ef4444)", border: "none", borderRadius: 8, color: "#fff", fontWeight: 800, padding: "6px 12px", cursor: "pointer", fontSize: 12 }}>🎁</button>
          <button onClick={() => setShowChat(c => !c)} style={{ background: "rgba(255,255,255,0.08)", border: "none", borderRadius: 8, color: MUTED, padding: "5px 10px", cursor: "pointer", fontSize: 12 }}>💬</button>
          <button onClick={leave} style={{ background: "rgba(232,0,45,0.12)", border: "1px solid rgba(232,0,45,0.3)", color: R, borderRadius: 8, padding: "5px 12px", fontWeight: 700, cursor: "pointer", fontSize: 12 }}>{t.leave}</button>
        </div>
      </div>

      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
        <div style={{ flex: 1, position: "relative", background: "#000" }}>
          {status === "error" && (
            <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12, background: "#0a0002", padding: 24 }}>
              <div style={{ fontSize: 48 }}>⚠️</div>
              <div style={{ color: R, fontWeight: 800, fontSize: 18 }}>Connection Error</div>
              <div style={{ color: MUTED, fontSize: 13, maxWidth: 300, textAlign: "center", lineHeight: 1.7 }}>{errMsg}</div>
              <button onClick={go} style={{ background: R, border: "none", borderRadius: 12, padding: "11px 24px", color: "#fff", fontWeight: 800, cursor: "pointer" }}>← Home</button>
            </div>
          )}
          {status === "ended" && (
            <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12, background: "#060608" }}>
              <div style={{ fontSize: 60 }}>📴</div>
              <div style={{ color: TEXT, fontWeight: 800, fontSize: 20 }}>Stream ended</div>
              <button onClick={go} style={{ background: R, border: "none", borderRadius: 12, padding: "11px 24px", color: "#fff", fontWeight: 800, cursor: "pointer" }}>← Home</button>
            </div>
          )}
          {status === "connecting" && (
            <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14, background: "radial-gradient(circle,#1a0507,#060608)" }}>
              <div style={{ fontSize: 70, animation: "floatEmoji 3s ease-in-out infinite" }}>{s.emoji || "🎬"}</div>
              <div style={{ color: TEXT, fontWeight: 800, fontSize: 16 }}>Connecting to {s.creator}...</div>
              <div style={{ display: "flex", gap: 8 }}>{[0, 1, 2].map(i => <div key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: R, animation: `dotBounce 0.7s ${i * 0.15}s ease-in-out infinite alternate` }} />)}</div>
              <div style={{ color: MUTED, fontSize: 12, marginTop: 8 }}>Powered by LiveKit 🚀</div>
            </div>
          )}
          <video ref={videoRef} autoPlay playsInline style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", display: status === "live" ? "block" : "none" }} />
          {status === "live" && (
            <>
              <div style={{ position: "absolute", top: 12, left: 14, display: "flex", alignItems: "center", gap: 5, background: "rgba(0,0,0,0.65)", borderRadius: 8, padding: "4px 10px" }}>
                <div style={{ width: 7, height: 7, borderRadius: "50%", background: R, animation: "pulseDot 1.4s infinite" }} />
                <span style={{ fontSize: 10, fontWeight: 800, color: R }}>LIVE</span>
              </div>
              <div style={{ position: "absolute", bottom: 16, left: 16, background: "rgba(0,0,0,0.75)", borderRadius: 10, padding: "10px 14px", border: `1px solid ${BORDER}` }}>
                <div style={{ fontSize: 10, color: MUTED, marginBottom: 2 }}>✅ Access granted</div>
                <div style={{ fontWeight: 800, color: TEXT, fontSize: 12 }}>Paid · {fmt(s.price, s.currency)}</div>
              </div>
            </>
          )}
        </div>

        {showChat && (
          <div style={{ width: 260, borderLeft: `1px solid ${BORDER}`, display: "flex", flexDirection: "column", background: DARK }}>
            <div style={{ padding: "11px 14px", borderBottom: `1px solid ${BORDER}`, fontSize: 12, fontWeight: 700, color: MUTED }}>💬 {viewers.toLocaleString()} {t.watching}</div>
            <div ref={chatRef} style={{ flex: 1, overflowY: "auto", padding: "8px 12px", display: "flex", flexDirection: "column", gap: 8 }}>
              {messages.map((m, i) => (
                <div key={i} style={{ display: "flex", gap: 7, alignItems: "flex-start" }}>
                  <Av name={m.user} size={22} />
                  <div>
                    <span style={{ fontSize: 10, fontWeight: 800, color: m.me ? R : m.isGift ? "#f59e0b" : MUTED }}>{m.user} </span>
                    <span style={{ fontSize: 12, color: m.isGift ? "#f59e0b" : TEXT }}>{m.text}</span>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ padding: "10px", borderTop: `1px solid ${BORDER}`, display: "flex", gap: 7 }}>
              <input value={msg} onChange={e => setMsg(e.target.value)} onKeyDown={e => e.key === "Enter" && sendMsg()} placeholder="Say something..." style={{ flex: 1, background: "#0A0A0C", border: `1px solid ${BORDER}`, borderRadius: 8, padding: "8px 10px", color: TEXT, fontSize: 12, fontFamily: "sans-serif", outline: "none" }} />
              <button onClick={sendMsg} style={{ background: R, border: "none", borderRadius: 8, color: "#fff", fontWeight: 800, padding: "8px 12px", cursor: "pointer", fontSize: 13 }}>→</button>
            </div>
          </div>
        )}
      </div>

      {showGifts && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", display: "flex", alignItems: "flex-end", justifyContent: "center", zIndex: 1000, padding: 16 }} onClick={() => setShowGifts(false)}>
          <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: "24px 24px 16px 16px", padding: "24px 20px", width: "100%", maxWidth: 460, marginBottom: 8 }} onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
              <div style={{ fontWeight: 800, fontSize: 16, color: TEXT }}>{t.gifts}</div>
              <button onClick={() => setShowGifts(false)} style={{ background: "transparent", border: "none", color: MUTED, fontSize: 22, cursor: "pointer" }}>×</button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, marginBottom: 18 }}>
              {GIFTS.map(g => (
                <div key={g.id} onClick={() => { onGiftSent(g); setShowGifts(false); }} style={{ background: DARKER, border: `1.5px solid ${BORDER}`, borderRadius: 14, padding: "12px 8px", textAlign: "center", cursor: "pointer" }}>
                  <div style={{ fontSize: 32, marginBottom: 4 }}>{g.emoji}</div>
                  <div style={{ fontWeight: 700, fontSize: 12, color: TEXT }}>{g.name}</div>
                  <div style={{ color: R, fontSize: 11, fontWeight: 800, marginTop: 2 }}>{fmt(g.price, "RWF")}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes pulseDot{0%,100%{opacity:1}50%{opacity:0.3}}
        @keyframes floatEmoji{0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)}}
        @keyframes dotBounce{from{opacity:0.3;transform:translateY(0)}to{opacity:1;transform:translateY(-8px)}}
      `}</style>
    </div>
  );
}
  const t = LANG[lang];
  const peerRef = useRef(null);
  const videoRef = useRef(null);
  const [status, setStatus] = useState("connecting");
  const [errMsg, setErrMsg] = useState("");
  const [messages, setMessages] = useState([
    { user: "Mugabo", text: "🔥🔥🔥 Amazing!", me: false },
    { user: "Ingabire", text: "Neza cyane! ❤️", me: false },
    { user: user.name, text: "Just joined! 🎉", me: true },
  ]);
  const [msg, setMsg] = useState("");
  const [viewers, setViewers] = useState((s.viewers || 100) + 1);
  const [showChat, setShowChat] = useState(true);
  const [showGifts, setShowGifts] = useState(false);
  const [giftNotif, setGiftNotif] = useState(null);
  const chatRef = useRef(null);

  useEffect(() => {
    let mounted = true;
    let chatIv = null;

    const connect = async () => {
      try {
        // Get peer ID from Supabase
        const { data } = await supabase.from("streams").select("peer_id").eq("id", s.id).single();
        const hostPeerId = data?.peer_id || `playRW-${s.id}`;

        // ✅ FIX 3: Use same signaling server as host + ICE_CONFIG
        const peer = new Peer(undefined, {
          host: "0.peerjs.com",
          port: 443,
          path: "/",
          secure: true,
          config: ICE_CONFIG,
        });
        peerRef.current = peer;

        peer.on("open", () => {
          // ✅ FIX 4: Pass empty MediaStream instead of null
          // null causes PeerJS to reject the call entirely
          const call = peer.call(hostPeerId, new MediaStream());

          if (!call) {
            if (mounted) { setStatus("error"); setErrMsg("Host is not live yet. Try again in a moment!"); }
            return;
          }

          call.on("stream", (remoteStream) => {
            if (!mounted) return;
            if (videoRef.current) {
              videoRef.current.srcObject = remoteStream;
              videoRef.current.play().catch(err => console.warn("Autoplay blocked:", err));
            }
            setStatus("live");
          });

          call.on("error", (err) => {
            console.error("Call error:", err);
            if (mounted) { setStatus("error"); setErrMsg(err.message); }
          });

          call.on("close", () => {
            if (mounted) setStatus("ended");
          });

          // ✅ FIX 5: Timeout — if no stream after 15s, show error
          setTimeout(() => {
            if (mounted && status === "connecting") {
              setStatus("error");
              setErrMsg("Could not connect to stream. The host may not be live yet, or the connection was blocked. Try again!");
            }
          }, 15000);
        });

        peer.on("error", (err) => {
          console.error("Viewer peer error:", err);
          if (mounted) { setStatus("error"); setErrMsg("Could not connect to stream. The host may not be live yet!"); }
        });

        chatIv = setInterval(() => {
          setViewers(v => v + Math.floor(Math.random() * 3));
          const u = FAKE_USERS[Math.floor(Math.random() * FAKE_USERS.length)];
          const m = FAKE_MSGS[Math.floor(Math.random() * FAKE_MSGS.length)];
          setMessages(p => [...p.slice(-40), { user: u, text: m, me: false }]);
        }, 2500);

      } catch (err) {
        console.error("Connect error:", err);
        if (mounted) { setStatus("error"); setErrMsg("Could not connect to stream!"); }
      }
    };

    connect();
    return () => {
      mounted = false;
      clearInterval(chatIv);
      if (peerRef.current) peerRef.current.destroy();
    };
  }, []);

  useEffect(() => { if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight; }, [messages]);
  const sendMsg = () => { if (!msg.trim()) return; setMessages(p => [...p, { user: user.name, text: msg, me: true }]); setMsg(""); };
  const leave = () => { if (peerRef.current) peerRef.current.destroy(); go(); };
  const onGiftSent = gift => {
    setGiftNotif(gift);
    setMessages(p => [...p, { user: user.name, text: `${gift.emoji} Sent a ${gift.name}!`, me: true, isGift: true }]);
    setTimeout(() => setGiftNotif(null), 3000);
    toast(`${gift.emoji} Gift sent! 💚`);
  };
  const share = () => { window.open(`https://wa.me/?text=${encodeURIComponent(`I'm watching ${s.creator} live on Play Rwanda! 🔴🇷🇼`)}`, "_blank"); toast(t.copied); };

  return (
    <div style={{ position: "fixed", inset: 0, background: DARKER, display: "flex", flexDirection: "column", fontFamily: "sans-serif" }}>
      {giftNotif && <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", zIndex: 500, textAlign: "center", pointerEvents: "none" }}><div style={{ fontSize: 80 }}>{giftNotif.emoji}</div><div style={{ color: "#fff", fontWeight: 800, fontSize: 18 }}>{giftNotif.name}!</div></div>}

      <div style={{ background: DARK, borderBottom: `1px solid ${BORDER}`, padding: "0 16px", height: 54, display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0, gap: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Av name={s.creator} size={32} />
          <div><div style={{ fontWeight: 800, fontSize: 13, color: TEXT }}>{s.creator}</div><div style={{ fontSize: 10, color: MUTED }}>{s.title}</div></div>
          <div style={{ display: "flex", alignItems: "center", gap: 4, marginLeft: 6 }}><div style={{ width: 6, height: 6, borderRadius: "50%", background: R, animation: "pulseDot 1.4s infinite" }} /><span style={{ fontSize: 9, fontWeight: 800, color: R }}>LIVE</span></div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ background: status === "live" ? "rgba(74,222,128,0.15)" : "rgba(232,0,45,0.15)", border: `1px solid ${status === "live" ? "rgba(74,222,128,0.4)" : "rgba(232,0,45,0.4)"}`, borderRadius: 8, padding: "3px 10px", fontSize: 10, color: status === "live" ? GREEN : R, fontWeight: 700 }}>
            {status === "connecting" ? "📡 Connecting..." : status === "live" ? "🟢 Live" : status === "ended" ? "⭕ Ended" : "⚠️ Error"}
          </div>
          <div style={{ textAlign: "center" }}><div style={{ fontSize: 9, color: MUTED }}>{t.watching}</div><div style={{ fontWeight: 800, color: TEXT, fontSize: 13 }}>👁 {viewers.toLocaleString()}</div></div>
          <button onClick={share} style={{ background: "#25D36622", border: "1px solid #25D36644", borderRadius: 8, color: "#25D366", padding: "5px 10px", cursor: "pointer", fontSize: 12, fontWeight: 700 }}>📤</button>
          <button onClick={() => setShowGifts(true)} style={{ background: "linear-gradient(135deg,#f59e0b,#ef4444)", border: "none", borderRadius: 8, color: "#fff", fontWeight: 800, padding: "6px 12px", cursor: "pointer", fontSize: 12 }}>🎁</button>
          <button onClick={() => setShowChat(c => !c)} style={{ background: "rgba(255,255,255,0.08)", border: "none", borderRadius: 8, color: MUTED, padding: "5px 10px", cursor: "pointer", fontSize: 12 }}>💬</button>
          <button onClick={leave} style={{ background: "rgba(232,0,45,0.12)", border: "1px solid rgba(232,0,45,0.3)", color: R, borderRadius: 8, padding: "5px 12px", fontWeight: 700, cursor: "pointer", fontSize: 12 }}>{t.leave}</button>
        </div>
      </div>

      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
        <div style={{ flex: 1, position: "relative", background: "#000" }}>
          {status === "error" && (
            <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12, background: "#0a0002", padding: 24 }}>
              <div style={{ fontSize: 48 }}>⚠️</div>
              <div style={{ color: R, fontWeight: 800, fontSize: 18 }}>Connection Error</div>
              <div style={{ color: MUTED, fontSize: 13, maxWidth: 300, textAlign: "center", lineHeight: 1.7 }}>{errMsg}</div>
              <button onClick={go} style={{ background: R, border: "none", borderRadius: 12, padding: "11px 24px", color: "#fff", fontWeight: 800, cursor: "pointer" }}>← Home</button>
            </div>
          )}
          {status === "ended" && (
            <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12, background: "#060608" }}>
              <div style={{ fontSize: 60 }}>📴</div>
              <div style={{ color: TEXT, fontWeight: 800, fontSize: 20 }}>Stream ended</div>
              <button onClick={go} style={{ background: R, border: "none", borderRadius: 12, padding: "11px 24px", color: "#fff", fontWeight: 800, cursor: "pointer" }}>← Home</button>
            </div>
          )}
          {status === "connecting" && (
            <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14, background: "radial-gradient(circle,#1a0507,#060608)" }}>
              <div style={{ fontSize: 70, animation: "floatEmoji 3s ease-in-out infinite" }}>{s.emoji || "🎬"}</div>
              <div style={{ color: TEXT, fontWeight: 800, fontSize: 16 }}>Connecting to {s.creator}...</div>
              <div style={{ display: "flex", gap: 8 }}>{[0, 1, 2].map(i => <div key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: R, animation: `dotBounce 0.7s ${i * 0.15}s ease-in-out infinite alternate` }} />)}</div>
              <div style={{ color: MUTED, fontSize: 12, marginTop: 8 }}>This may take up to 15 seconds...</div>
            </div>
          )}
          {status === "live" && (
            <>
              <video ref={videoRef} autoPlay playsInline style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
              <div style={{ position: "absolute", top: 12, left: 14, display: "flex", alignItems: "center", gap: 5, background: "rgba(0,0,0,0.65)", borderRadius: 8, padding: "4px 10px" }}>
                <div style={{ width: 7, height: 7, borderRadius: "50%", background: R, animation: "pulseDot 1.4s infinite" }} />
                <span style={{ fontSize: 10, fontWeight: 800, color: R }}>LIVE</span>
              </div>
              <div style={{ position: "absolute", bottom: 16, left: 16, background: "rgba(0,0,0,0.75)", borderRadius: 10, padding: "10px 14px", border: `1px solid ${BORDER}` }}>
                <div style={{ fontSize: 10, color: MUTED, marginBottom: 2 }}>✅ Access granted</div>
                <div style={{ fontWeight: 800, color: TEXT, fontSize: 12 }}>Paid · {fmt(s.price, s.currency)}</div>
              </div>
            </>
          )}
        </div>

        {showChat && (
          <div style={{ width: 260, borderLeft: `1px solid ${BORDER}`, display: "flex", flexDirection: "column", background: DARK }}>
            <div style={{ padding: "11px 14px", borderBottom: `1px solid ${BORDER}`, fontSize: 12, fontWeight: 700, color: MUTED }}>💬 {viewers.toLocaleString()} {t.watching}</div>
            <div ref={chatRef} style={{ flex: 1, overflowY: "auto", padding: "8px 12px", display: "flex", flexDirection: "column", gap: 8 }}>
              {messages.map((m, i) => (
                <div key={i} style={{ display: "flex", gap: 7, alignItems: "flex-start" }}>
                  <Av name={m.user} size={22} />
                  <div>
                    <span style={{ fontSize: 10, fontWeight: 800, color: m.me ? R : m.isGift ? "#f59e0b" : MUTED }}>{m.user} </span>
                    <span style={{ fontSize: 12, color: m.isGift ? "#f59e0b" : TEXT }}>{m.text}</span>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ padding: "10px", borderTop: `1px solid ${BORDER}`, display: "flex", gap: 7 }}>
              <input value={msg} onChange={e => setMsg(e.target.value)} onKeyDown={e => e.key === "Enter" && sendMsg()} placeholder="Say something..." style={{ flex: 1, background: "#0A0A0C", border: `1px solid ${BORDER}`, borderRadius: 8, padding: "8px 10px", color: TEXT, fontSize: 12, fontFamily: "sans-serif", outline: "none" }} />
              <button onClick={sendMsg} style={{ background: R, border: "none", borderRadius: 8, color: "#fff", fontWeight: 800, padding: "8px 12px", cursor: "pointer", fontSize: 13 }}>→</button>
            </div>
          </div>
        )}
      </div>

      {showGifts && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", display: "flex", alignItems: "flex-end", justifyContent: "center", zIndex: 1000, padding: 16 }} onClick={() => setShowGifts(false)}>
          <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: "24px 24px 16px 16px", padding: "24px 20px", width: "100%", maxWidth: 460, marginBottom: 8 }} onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
              <div style={{ fontWeight: 800, fontSize: 16, color: TEXT }}>{t.gifts}</div>
              <button onClick={() => setShowGifts(false)} style={{ background: "transparent", border: "none", color: MUTED, fontSize: 22, cursor: "pointer" }}>×</button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, marginBottom: 18 }}>
              {GIFTS.map(g => (
                <div key={g.id} onClick={() => { onGiftSent(g); setShowGifts(false); }} style={{ background: DARKER, border: `1.5px solid ${BORDER}`, borderRadius: 14, padding: "12px 8px", textAlign: "center", cursor: "pointer" }}>
                  <div style={{ fontSize: 32, marginBottom: 4 }}>{g.emoji}</div>
                  <div style={{ fontWeight: 700, fontSize: 12, color: TEXT }}>{g.name}</div>
                  <div style={{ color: R, fontSize: 11, fontWeight: 800, marginTop: 2 }}>{fmt(g.price, "RWF")}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes pulseDot{0%,100%{opacity:1}50%{opacity:0.3}}
        @keyframes floatEmoji{0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)}}
        @keyframes dotBounce{from{opacity:0.3;transform:translateY(0)}to{opacity:1;transform:translateY(-8px)}}
      `}</style>
    </div>
  );
}

// ── AUTH ──────────────────────────────────────────────────────────────────────
function AuthPage({ onAuth, type, go, th, lang }) {
  const t = LANG[lang];
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
        if (!form.name || !form.email || !form.password) { setError("Fill all fields!"); setLoading(false); return; }
        const { data, error: e } = await supabase.auth.signUp({ email: form.email, password: form.password });
        if (e) throw new Error(e.message);
        profile = { id: data.user.id, name: form.name, email: form.email, role: type, handle: `@${form.name.toLowerCase().replace(" ", "")}`, category: form.category };
        await supabase.from("users").upsert(profile);
      }
      onAuth(profile);
    } catch (err) { setError(err.message); setLoading(false); }
  };

  return (
    <div style={{ minHeight: "100vh", background: th.bg, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "sans-serif", padding: 24 }}>
      <div style={{ width: "100%", maxWidth: 420 }}>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <Logo go={go} />
          <div style={{ color: th.muted, fontSize: 13, marginTop: 6, letterSpacing: "2px", textTransform: "uppercase" }}>{type === "creator" ? "Creator Portal 🎬" : "Join to Watch 👁"}</div>
        </div>
        <div style={{ background: th.card, border: `1px solid ${th.border}`, borderRadius: 24, padding: "28px 24px" }}>
          <div style={{ display: "flex", background: th.bg, borderRadius: 12, padding: 4, marginBottom: 22 }}>
            {["login", "signup"].map(m => (
              <button key={m} onClick={() => { setMode(m); setError(""); }} style={{ flex: 1, background: mode === m ? R : "transparent", border: "none", borderRadius: 9, padding: "9px", color: mode === m ? "#fff" : th.muted, fontWeight: 800, fontSize: 13, cursor: "pointer", fontFamily: "sans-serif" }}>
                {m === "login" ? t.logIn : t.signUp}
              </button>
            ))}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {mode === "signup" && <div><label style={{ fontSize: 11, color: th.muted, textTransform: "uppercase", letterSpacing: "0.7px", display: "block", marginBottom: 6 }}>Full Name</label><input style={th.inp} placeholder="e.g. Kalisa Brian" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} /></div>}
            <div><label style={{ fontSize: 11, color: th.muted, textTransform: "uppercase", letterSpacing: "0.7px", display: "block", marginBottom: 6 }}>Email</label><input style={th.inp} type="email" placeholder="you@example.com" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} onKeyDown={e => e.key === "Enter" && submit()} /></div>
            <div><label style={{ fontSize: 11, color: th.muted, textTransform: "uppercase", letterSpacing: "0.7px", display: "block", marginBottom: 6 }}>Password</label><input style={th.inp} type="password" placeholder="••••••••" value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} onKeyDown={e => e.key === "Enter" && submit()} /></div>
            {error && <div style={{ background: "rgba(232,0,45,0.1)", border: "1px solid rgba(232,0,45,0.3)", borderRadius: 10, padding: "10px 14px", fontSize: 13, color: R }}>⚠️ {error}</div>}
            <button onClick={submit} disabled={loading} style={{ width: "100%", background: R, border: "none", borderRadius: 12, padding: "13px", color: "#fff", fontSize: 15, fontWeight: 800, cursor: "pointer", opacity: loading ? 0.7 : 1, fontFamily: "sans-serif" }}>{loading ? "Please wait..." : mode === "login" ? `${t.logIn} →` : `${t.signUp} →`}</button>
            <button onClick={go} style={{ background: "transparent", border: "none", color: th.muted, cursor: "pointer", fontSize: 13, fontFamily: "sans-serif" }}>← Back to Home</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── PAYMENT ───────────────────────────────────────────────────────────────────
function PaymentPage({ stream: s, go, onSuccess, th, viewer }) {
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
      viewer_id: viewer?.id || "guest", creator_id: s.creatorId || s.creator_id || "unknown",
      stream_id: s.id, stream: s.title, amount: s.price,
      currency: s.currency, earn, method: method.id, viewer: viewer?.name || "Guest"
    });
    setDone(true);
    setTimeout(() => onSuccess(), 100);
  };

  if (done) return (
    <div style={{ minHeight: "100vh", background: th.bg, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: "sans-serif", color: th.text }}>
      <div style={{ fontSize: 70, marginBottom: 14 }}>🎉</div>
      <div style={{ fontSize: 22, fontWeight: 800 }}>Payment Successful!</div>
      <div style={{ color: MUTED, marginTop: 6 }}>Joining stream...</div>
      <div style={{ marginTop: 18, background: th.card, borderRadius: 14, padding: "14px 24px", border: "1px solid rgba(74,222,128,0.3)", textAlign: "center" }}>
        <div style={{ fontSize: 12, color: MUTED, marginBottom: 4 }}>Creator received 💚</div>
        <div style={{ fontWeight: 800, color: GREEN, fontSize: 20 }}>{fmt(earn.toFixed(s.currency === "USD" ? 2 : 0), s.currency)}</div>
      </div>
    </div>
  );

  if (loading) return (
    <div style={{ minHeight: "100vh", background: th.bg, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: "sans-serif", color: th.text, gap: 14 }}>
      <div style={{ fontSize: 48 }}>⏳</div>
      <div style={{ fontSize: 20, fontWeight: 800 }}>Processing...</div>
      {method?.id === "mtn" && <div style={{ background: "#FFCB0022", border: "1px solid #FFCB0044", borderRadius: 12, padding: "12px 20px", color: "#FFCB00", fontWeight: 700 }}>📱 Check MTN for prompt!</div>}
      {method?.id === "airtel" && <div style={{ background: "rgba(232,0,45,0.1)", border: "1px solid rgba(232,0,45,0.3)", borderRadius: 12, padding: "12px 20px", color: R, fontWeight: 700 }}>📲 Check Airtel for prompt!</div>}
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: th.bg, fontFamily: "sans-serif", color: th.text }}>
      <div style={{ background: th.header, borderBottom: `1px solid ${th.border}`, padding: "0 16px", height: 54, display: "flex", alignItems: "center", gap: 12 }}>
        <button onClick={go} style={{ background: "transparent", border: `1px solid ${th.border}`, color: th.muted, borderRadius: 8, padding: "6px 12px", fontSize: 13, cursor: "pointer" }}>← Home</button>
        <Logo go={go} />
        <div style={{ marginLeft: "auto", fontSize: 12, color: th.muted }}>🔒 Secure Checkout</div>
      </div>
      <div style={{ maxWidth: 460, margin: "0 auto", padding: "24px 16px" }}>
        <div style={{ fontSize: 20, fontWeight: 800, marginBottom: 18 }}>Complete Payment</div>
        <div style={{ background: th.card, borderRadius: 16, overflow: "hidden", marginBottom: 16, border: `1px solid ${th.border}` }}>
          <div style={{ position: "relative", height: 160, background: "linear-gradient(135deg,#1a0507,#0e0e14)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ fontSize: 80, filter: "blur(4px)", opacity: 0.5 }}>{s.emoji || "🎬"}</div>
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6 }}>
              <div style={{ fontSize: 32 }}>🔒</div>
              <div style={{ fontWeight: 800, fontSize: 15, color: "#fff" }}>Pay to unlock!</div>
            </div>
            <div style={{ position: "absolute", top: 10, left: 12, display: "flex", alignItems: "center", gap: 4 }}>
              <div style={{ width: 7, height: 7, borderRadius: "50%", background: R, animation: "pulseDot 1.4s infinite" }} />
              <span style={{ fontSize: 10, fontWeight: 800, color: R }}>LIVE</span>
            </div>
            <div style={{ position: "absolute", bottom: 12, right: 12, background: R, borderRadius: 8, padding: "4px 12px", fontSize: 14, fontWeight: 800, color: "#fff" }}>{fmt(s.price, s.currency)}</div>
          </div>
          <div style={{ padding: "12px 16px" }}>
            <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 2 }}>{s.title}</div>
            <div style={{ fontSize: 12, color: th.muted, marginBottom: 10 }}>by {s.creator}</div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 4 }}><span style={{ color: th.muted }}>Creator gets ({100 - s.cut}%)</span><span style={{ fontWeight: 700, color: GREEN }}>{fmt(earn.toFixed(s.currency === "USD" ? 2 : 0), s.currency)}</span></div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}><span style={{ color: th.muted }}>Play gets ({s.cut}%)</span><span style={{ fontWeight: 700, color: R }}>{fmt((s.price * s.cut / 100).toFixed(s.currency === "USD" ? 2 : 0), s.currency)}</span></div>
          </div>
        </div>
        <div style={{ fontSize: 11, color: th.muted, textTransform: "uppercase", letterSpacing: "0.7px", marginBottom: 10 }}>Payment Method</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
          {PAY_METHODS.map(pm => (
            <div key={pm.id} onClick={() => setMethod(pm)} style={{ background: method?.id === pm.id ? `${pm.color}18` : th.card, border: `1.5px solid ${method?.id === pm.id ? pm.color : th.border}`, borderRadius: 12, padding: "12px 14px", display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }}>
              <div style={{ width: 40, height: 26, borderRadius: 6, background: pm.color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                {pm.id === "mtn" && <span style={{ fontSize: 10, fontWeight: 800, color: "#000" }}>MTN</span>}
                {pm.id === "airtel" && <span style={{ fontSize: 9, fontWeight: 800, color: "#fff" }}>AIRTEL</span>}
                {pm.id === "visa" && <div style={{ display: "flex" }}><div style={{ width: 13, height: 13, borderRadius: "50%", background: "#EB001B" }} /><div style={{ width: 13, height: 13, borderRadius: "50%", background: "#F79E1B", marginLeft: -5 }} /></div>}
              </div>
              <div style={{ flex: 1, fontWeight: 700, fontSize: 13, color: th.text }}>{pm.name}</div>
              {method?.id === pm.id && <div style={{ color: pm.color, fontWeight: 800 }}>✓</div>}
            </div>
          ))}
        </div>
        {method && method.field === "phone" && (
          <div style={{ background: th.card, borderRadius: 14, padding: "16px", marginBottom: 14, border: `1px solid ${th.border}` }}>
            <label style={{ fontSize: 11, color: th.muted, textTransform: "uppercase", letterSpacing: "0.7px", display: "block", marginBottom: 8 }}>Phone Number</label>
            <input style={{ ...th.inp, fontSize: 16 }} type="tel" placeholder={method.ph} value={phone} onChange={e => setPhone(e.target.value)} />
            <div style={{ fontSize: 12, color: th.muted, marginTop: 6 }}>You'll get a prompt on your phone</div>
          </div>
        )}
        {method && method.field === "card" && (
          <div style={{ background: th.card, borderRadius: 14, padding: "16px", marginBottom: 14, border: `1px solid ${th.border}` }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div><label style={{ fontSize: 11, color: th.muted, textTransform: "uppercase", letterSpacing: "0.7px", display: "block", marginBottom: 6 }}>Card Number</label><input style={th.inp} placeholder="1234 5678 9012 3456" value={card.number} onChange={e => setCard(p => ({ ...p, number: e.target.value }))} /></div>
              <div><label style={{ fontSize: 11, color: th.muted, textTransform: "uppercase", letterSpacing: "0.7px", display: "block", marginBottom: 6 }}>Name on Card</label><input style={th.inp} placeholder="e.g. Kalisa Brian" value={card.name} onChange={e => setCard(p => ({ ...p, name: e.target.value }))} /></div>
              <div style={{ display: "flex", gap: 10 }}>
                <div style={{ flex: 1 }}><label style={{ fontSize: 11, color: th.muted, textTransform: "uppercase", letterSpacing: "0.7px", display: "block", marginBottom: 6 }}>Expiry</label><input style={th.inp} placeholder="MM/YY" value={card.expiry} onChange={e => setCard(p => ({ ...p, expiry: e.target.value }))} /></div>
                <div style={{ flex: 1 }}><label style={{ fontSize: 11, color: th.muted, textTransform: "uppercase", letterSpacing: "0.7px", display: "block", marginBottom: 6 }}>CVV</label><input style={th.inp} placeholder="123" value={card.cvv} onChange={e => setCard(p => ({ ...p, cvv: e.target.value }))} /></div>
              </div>
            </div>
          </div>
        )}
        <button onClick={pay} disabled={!method} style={{ width: "100%", background: method ? R : "#333", border: "none", borderRadius: 12, padding: "14px", color: "#fff", fontSize: 15, fontWeight: 800, cursor: method ? "pointer" : "not-allowed", opacity: method ? 1 : 0.5, fontFamily: "sans-serif" }}>
          {method ? `🔓 Pay ${fmt(s.price, s.currency)} & Watch Live!` : "Select a payment method"}
        </button>
        <div style={{ textAlign: "center", color: th.muted, fontSize: 12, marginTop: 8 }}>🔒 Secure · Instant access · No hidden fees</div>
      </div>
      <style>{`@keyframes pulseDot{0%,100%{opacity:1}50%{opacity:0.3}}`}</style>
    </div>
  );
}

// ── CREATOR STUDIO ────────────────────────────────────────────────────────────
function CreatorStudio({ creator, go, th, toast, lang }) {
  const [tab, setTab] = useState("streams");
  const [streams, setStreams] = useState([]);
  const [txns, setTxns] = useState([]);
  const [showCreate, setShowCreate] = useState(false);
  const [hosting, setHosting] = useState(false);
  const [activeStream, setActiveStream] = useState(null);
  const [form, setForm] = useState({ title: "", price: "", currency: "RWF", cut: 15, category: creator.category || "Music" });
  const [payout, setPayout] = useState({ mtn: "", airtel: "" });
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
        bio: creator.bio || "", viewers: 0, total_earned: 0, live: true, peer_id: null
      }).select().single();
      if (e) throw new Error(e.message);
      setActiveStream(s); setShowCreate(false); setHosting(true);
    } catch (err) { toast("Error: " + err.message); }
    setLoading(false);
  };

  if (hosting && activeStream) return <HostBroadcast stream={activeStream} toast={toast} onEnd={() => { setHosting(false); setActiveStream(null); setStreams(p => [activeStream, ...p]); }} />;

  const totalEarned = streams.reduce((s, st) => s + (st.total_earned || 0), 0);
  const totalViewers = streams.reduce((s, st) => s + (st.viewers || 0), 0);

  return (
    <div style={{ minHeight: "100vh", background: th.bg, color: th.text, fontFamily: "sans-serif" }}>
      <div style={{ background: th.header, padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: `1px solid ${th.border}`, flexWrap: "wrap", gap: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}><Logo go={go} /><button onClick={go} style={{ background: "transparent", border: `1px solid ${th.border}`, color: th.muted, borderRadius: 8, padding: "6px 12px", fontSize: 13, cursor: "pointer" }}>← Home</button></div>
        <div style={{ fontSize: 13, fontWeight: 700, color: th.muted }}>🎬 Creator Studio</div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Av name={creator.name} size={32} />
          <div><div style={{ fontSize: 13, fontWeight: 700 }}>{creator.name}</div><div style={{ fontSize: 11, color: th.muted }}>{creator.handle || creator.email}</div></div>
          <button onClick={go} style={{ background: "transparent", border: `1px solid ${th.border}`, color: th.muted, borderRadius: 8, padding: "5px 12px", fontSize: 12, cursor: "pointer" }}>Log out</button>
        </div>
      </div>
      <div style={{ background: th.header, borderBottom: `1px solid ${th.border}`, padding: "0 16px", display: "flex", gap: 4, overflowX: "auto" }}>
        {[{ id: "streams", label: "🔴 My Streams" }, { id: "transactions", label: "💳 Transactions" }, { id: "payout", label: "💰 Payout" }].map(tb => (
          <button key={tb.id} onClick={() => setTab(tb.id)} style={{ background: "transparent", border: "none", borderBottom: tab === tb.id ? `2px solid ${R}` : "2px solid transparent", color: tab === tb.id ? R : th.muted, fontWeight: 700, fontSize: 13, padding: "14px 16px", cursor: "pointer", fontFamily: "sans-serif", whiteSpace: "nowrap" }}>{tb.label}</button>
        ))}
      </div>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "24px 16px" }}>
        <div style={{ display: "flex", gap: 12, marginBottom: 24, flexWrap: "wrap" }}>
          {[{ label: "Total Streams", value: streams.length }, { label: "Total Viewers", value: totalViewers.toLocaleString() }, { label: "Total Earned", value: `${Math.round(totalEarned).toLocaleString()} RWF` }].map(stat => (
            <div key={stat.label} style={{ flex: 1, minWidth: 130, background: th.card, borderRadius: 16, padding: "18px 20px", border: `1px solid ${th.border}` }}>
              <div style={{ fontSize: 11, color: th.muted, textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 6 }}>{stat.label}</div>
              <div style={{ fontSize: 22, fontWeight: 800 }}>{stat.value}</div>
            </div>
          ))}
        </div>

        {tab === "streams" && <>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: th.muted }}>My Streams</div>
            <button onClick={() => setShowCreate(true)} style={{ background: R, border: "none", borderRadius: 12, padding: "10px 20px", color: "#fff", fontWeight: 800, fontSize: 14, cursor: "pointer", fontFamily: "sans-serif" }}>🔴 Go Live</button>
          </div>
          {streams.length === 0
            ? <div style={{ textAlign: "center", padding: "60px 0", color: th.muted }}><div style={{ fontSize: 64, marginBottom: 16 }}>🎬</div><div style={{ fontSize: 18, fontWeight: 800, color: th.text, marginBottom: 8 }}>No streams yet!</div><button onClick={() => setShowCreate(true)} style={{ background: R, border: "none", borderRadius: 12, padding: "13px 28px", color: "#fff", fontWeight: 800, fontSize: 15, cursor: "pointer", fontFamily: "sans-serif" }}>🔴 Start Your First Live!</button></div>
            : streams.map(s => (
              <div key={s.id} style={{ background: th.card, borderRadius: 14, border: `1px solid ${th.border}`, padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, marginBottom: 10 }}>
                <div><div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>{s.title}</div><div style={{ color: th.muted, fontSize: 13 }}>{s.category} · {fmt(s.price, s.currency)}/viewer · Play takes {s.cut}%</div></div>
                <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
                  <div style={{ textAlign: "right" }}><div style={{ fontSize: 11, color: th.muted }}>Viewers</div><div style={{ fontWeight: 700 }}>👁 {s.viewers || 0}</div></div>
                  <div style={{ textAlign: "right" }}><div style={{ fontSize: 11, color: th.muted }}>Earned</div><div style={{ fontWeight: 800, color: GREEN, fontSize: 16 }}>{fmt(s.total_earned || 0, s.currency)}</div></div>
                  {s.live && <div style={{ display: "flex", alignItems: "center", gap: 5 }}><div style={{ width: 6, height: 6, borderRadius: "50%", background: R, animation: "pulseDot 1.4s infinite" }} /><span style={{ fontSize: 10, fontWeight: 800, color: R }}>LIVE</span></div>}
                </div>
              </div>
            ))
          }
        </>}

        {tab === "transactions" && <>
          <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 20 }}>💳 Transaction History</div>
          {txns.length === 0
            ? <div style={{ textAlign: "center", padding: "40px 0", color: th.muted }}><div style={{ fontSize: 48, marginBottom: 12 }}>💳</div><div style={{ fontSize: 16, fontWeight: 700 }}>No transactions yet</div></div>
            : <div style={{ background: th.card, borderRadius: 16, border: `1px solid ${th.border}`, overflow: "hidden" }}>
              {txns.map((tx, i) => (
                <div key={tx.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "13px 16px", borderBottom: i < txns.length - 1 ? `1px solid ${th.border}` : "none" }}>
                  <Av name={tx.viewer || "?"} size={32} />
                  <div style={{ flex: 1 }}><div style={{ fontWeight: 700, fontSize: 13 }}>{tx.viewer || "Viewer"}</div><div style={{ fontSize: 11, color: th.muted }}>{new Date(tx.created_at).toLocaleString()}</div></div>
                  <div style={{ fontWeight: 800, color: GREEN, fontSize: 14 }}>+{fmt(tx.earn || 0, tx.currency)}</div>
                </div>
              ))}
            </div>
          }
        </>}

        {tab === "payout" && <>
          <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 6 }}>Where to send your money? 💸</div>
          <div style={{ color: th.muted, fontSize: 14, marginBottom: 20 }}>Add your payout method below.</div>
          {[{ key: "mtn", label: "MTN Mobile Money", color: "#FFCB00", tc: "#000", ph: "078 000 0000" }, { key: "airtel", label: "Airtel Money", color: R, tc: "#fff", ph: "073 000 0000" }].map(pm => (
            <div key={pm.key} style={{ background: th.card, borderRadius: 16, padding: "18px", border: `1px solid ${payout[pm.key] ? `${pm.color}44` : th.border}`, marginBottom: 14 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                <div style={{ width: 40, height: 26, borderRadius: 6, background: pm.color, display: "flex", alignItems: "center", justifyContent: "center" }}><span style={{ fontSize: 10, fontWeight: 800, color: pm.tc }}>{pm.key === "mtn" ? "MTN" : "AIRTEL"}</span></div>
                <div style={{ fontWeight: 800, fontSize: 14, color: th.text }}>{pm.label}</div>
                {payout[pm.key] && <div style={{ marginLeft: "auto", background: "rgba(74,222,128,0.15)", border: "1px solid rgba(74,222,128,0.3)", borderRadius: 8, padding: "3px 10px", fontSize: 11, color: GREEN, fontWeight: 700 }}>✓ Added</div>}
              </div>
              <input style={th.inp} type="tel" placeholder={pm.ph} value={payout[pm.key]} onChange={e => setPayout(p => ({ ...p, [pm.key]: e.target.value }))} />
            </div>
          ))}
          <button onClick={() => toast("✅ Payout settings saved!")} style={{ width: "100%", background: R, border: "none", borderRadius: 12, padding: "14px", color: "#fff", fontSize: 15, fontWeight: 800, cursor: "pointer", fontFamily: "sans-serif" }}>Save Payout Settings 💾</button>
        </>}
      </div>

      {showCreate && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 16 }} onClick={() => setShowCreate(false)}>
          <div style={{ background: th.card, border: `1px solid ${th.border}`, borderRadius: 24, padding: "28px 24px", width: "100%", maxWidth: 420 }} onClick={e => e.stopPropagation()}>
            <div style={{ fontSize: 20, fontWeight: 800, marginBottom: 20, color: th.text }}>🔴 Start a New Live</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
              <div><label style={{ fontSize: 11, color: th.muted, textTransform: "uppercase", letterSpacing: "0.7px", display: "block", marginBottom: 6 }}>Stream Title</label><input style={th.inp} placeholder="e.g. Music Night Live 🎵" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} /></div>
              <div style={{ display: "flex", gap: 10 }}>
                <div style={{ flex: 2 }}><label style={{ fontSize: 11, color: th.muted, textTransform: "uppercase", letterSpacing: "0.7px", display: "block", marginBottom: 6 }}>Entry Price</label><input style={th.inp} type="number" placeholder="e.g. 500" value={form.price} onChange={e => setForm(p => ({ ...p, price: e.target.value }))} /></div>
                <div style={{ flex: 1 }}><label style={{ fontSize: 11, color: th.muted, textTransform: "uppercase", letterSpacing: "0.7px", display: "block", marginBottom: 6 }}>Currency</label><select style={{ ...th.inp }} value={form.currency} onChange={e => setForm(p => ({ ...p, currency: e.target.value }))}><option>RWF</option><option>USD</option></select></div>
              </div>
              <div><label style={{ fontSize: 11, color: th.muted, textTransform: "uppercase", letterSpacing: "0.7px", display: "block", marginBottom: 6 }}>Category</label><select style={{ ...th.inp }} value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}>{CATS.filter(c => c !== "All").map(c => <option key={c}>{c}</option>)}</select></div>
              <div>
                <label style={{ fontSize: 11, color: th.muted, textTransform: "uppercase", letterSpacing: "0.7px", display: "block", marginBottom: 8 }}>Play Cut — <span style={{ color: R }}>{form.cut}%</span> · You keep <span style={{ color: GREEN }}>{100 - form.cut}%</span></label>
                <input type="range" min={5} max={30} value={form.cut} onChange={e => setForm(p => ({ ...p, cut: Number(e.target.value) }))} style={{ width: "100%", accentColor: R }} />
              </div>
              <div style={{ background: "rgba(74,222,128,0.07)", border: "1px solid rgba(74,222,128,0.2)", borderRadius: 10, padding: "10px 14px", fontSize: 12, color: GREEN, lineHeight: 1.6 }}>
                📡 Uses PeerJS with STUN + TURN servers for reliable connections! 🌍
              </div>
              <button onClick={startLive} disabled={loading} style={{ width: "100%", background: R, border: "none", borderRadius: 12, padding: "13px", color: "#fff", fontSize: 15, fontWeight: 800, cursor: "pointer", fontFamily: "sans-serif", opacity: loading ? 0.7 : 1 }}>{loading ? "Starting..." : "🔴 Go Live Now!"}</button>
            </div>
          </div>
        </div>
      )}
      <style>{`@keyframes pulseDot{0%,100%{opacity:1}50%{opacity:0.3}}`}</style>
    </div>
  );
}

// ── LEADERBOARD ───────────────────────────────────────────────────────────────
function Leaderboard({ go, th, streams }) {
  const sorted = [...streams].sort((a, b) => (b.totalEarned || b.total_earned || 0) - (a.totalEarned || a.total_earned || 0));
  const medals = ["🥇", "🥈", "🥉"];
  return (
    <div style={{ minHeight: "100vh", background: th.bg, color: th.text, fontFamily: "sans-serif" }}>
      <div style={{ background: th.header, padding: "12px 16px", display: "flex", alignItems: "center", gap: 12, borderBottom: `1px solid ${th.border}` }}>
        <button onClick={go} style={{ background: "transparent", border: `1px solid ${th.border}`, color: th.muted, borderRadius: 8, padding: "6px 12px", fontSize: 13, cursor: "pointer" }}>← Home</button>
        <Logo go={go} />
        <div style={{ color: th.muted, fontSize: 14 }}>🏆 Leaderboard</div>
      </div>
      <div style={{ maxWidth: 600, margin: "0 auto", padding: "28px 24px" }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}><div style={{ fontSize: 38 }}>🏆</div><div style={{ fontSize: 20, fontWeight: 800, marginBottom: 4 }}>Top Creators</div><div style={{ color: th.muted, fontSize: 14 }}>Ranked by earnings on Play 🇷🇼</div></div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {sorted.map((s, i) => (
            <div key={s.id} style={{ background: th.card, borderRadius: 14, border: `1px solid ${i < 3 ? "rgba(232,0,45,0.2)" : th.border}`, padding: "13px 16px", display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ fontSize: 16, width: 26, textAlign: "center", flexShrink: 0 }}>{i < 3 ? medals[i] : `#${i + 1}`}</div>
              <div style={{ fontSize: 24, flexShrink: 0 }}>{s.emoji || "🎤"}</div>
              <div style={{ flex: 1 }}><div style={{ fontWeight: 700, fontSize: 13 }}>{s.creator}</div><div style={{ color: th.muted, fontSize: 11 }}>{s.category}</div></div>
              <div style={{ textAlign: "right" }}><div style={{ fontWeight: 800, color: GREEN, fontSize: 14 }}>{fmt(s.totalEarned || s.total_earned || 0, s.currency || "RWF")}</div></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── ABOUT ─────────────────────────────────────────────────────────────────────
function AboutPage({ go, th }) {
  return (
    <div style={{ minHeight: "100vh", background: th.bg, color: th.text, fontFamily: "sans-serif" }}>
      <div style={{ background: th.header, padding: "12px 16px", display: "flex", alignItems: "center", gap: 12, borderBottom: `1px solid ${th.border}` }}>
        <button onClick={go} style={{ background: "transparent", border: `1px solid ${th.border}`, color: th.muted, borderRadius: 8, padding: "6px 12px", fontSize: 13, cursor: "pointer" }}>← Home</button>
        <Logo go={go} />
      </div>
      <div style={{ maxWidth: 700, margin: "0 auto", padding: "40px 24px" }}>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{ fontSize: 44, fontWeight: 800, color: R, marginBottom: 8 }}>play</div>
          <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 12 }}>Rwanda's First Live Streaming Pay-Per-View Platform 🇷🇼</div>
        </div>
        {[
          { emoji: "👁", title: "Browse for free", desc: "See all live streams!" },
          { emoji: "💳", title: "Pay to join", desc: "Pay with MTN MoMo, Airtel Money or Visa." },
          { emoji: "🎬", title: "Watch & Chat", desc: "Enjoy the stream and chat with viewers!" },
          { emoji: "🎁", title: "Send Gifts", desc: "Send gifts to your favorite creators live!" },
          { emoji: "💰", title: "Creators get paid", desc: "Up to 95% of every payment goes to you!" },
        ].map((s, i) => (
          <div key={i} style={{ background: th.card, borderRadius: 14, padding: "18px 20px", border: `1px solid ${th.border}`, display: "flex", gap: 14, marginBottom: 12 }}>
            <div style={{ fontSize: 32, flexShrink: 0 }}>{s.emoji}</div>
            <div><div style={{ fontWeight: 800, fontSize: 15, marginBottom: 4 }}>{s.title}</div><div style={{ color: th.muted, fontSize: 14, lineHeight: 1.6 }}>{s.desc}</div></div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── FOOTER ────────────────────────────────────────────────────────────────────
function Footer({ go, th, onAbout, onLeaderboard }) {
  return (
    <div style={{ background: th.header, borderTop: `1px solid ${th.border}`, padding: "32px 24px", marginTop: 48 }}>
      <div style={{ maxWidth: 960, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 24, marginBottom: 24 }}>
          <div>
            <Logo go={go} />
            <div style={{ color: th.muted, fontSize: 13, maxWidth: 220, marginTop: 6 }}>Rwanda's first live streaming pay-per-view platform. Built for Rwandan creators. 🇷🇼</div>
          </div>
          <div style={{ display: "flex", gap: 40, flexWrap: "wrap" }}>
            <div>
              <div style={{ fontSize: 11, color: th.muted, textTransform: "uppercase", letterSpacing: "1px", marginBottom: 12 }}>Platform</div>
              <div onClick={onLeaderboard} style={{ color: th.muted, fontSize: 13, marginBottom: 8, cursor: "pointer" }}>🏆 Leaderboard</div>
              <div onClick={onAbout} style={{ color: th.muted, fontSize: 13, cursor: "pointer" }}>How it Works</div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: th.muted, textTransform: "uppercase", letterSpacing: "1px", marginBottom: 12 }}>Contact</div>
              <div style={{ color: th.muted, fontSize: 13, marginBottom: 6 }}>hello@play.rw</div>
              <div style={{ color: th.muted, fontSize: 13, marginBottom: 10 }}>Kigali, Rwanda 🇷🇼</div>
              <div style={{ display: "flex", gap: 8 }}>
                {["Twitter", "Instagram", "TikTok"].map(s => (
                  <div key={s} style={{ background: th.card, border: `1px solid ${th.border}`, borderRadius: 8, padding: "4px 10px", fontSize: 11, color: th.muted, cursor: "pointer" }}>{s}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div style={{ borderTop: `1px solid ${th.border}`, paddingTop: 18, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
          <div style={{ fontSize: 12, color: th.muted }}>© 2026 Play Rwanda. All rights reserved.</div>
          <div style={{ fontSize: 12, color: th.muted }}>Made with ❤️ in Kigali 🇷🇼</div>
        </div>
      </div>
    </div>
  );
}

// ── MAIN APP ──────────────────────────────────────────────────────────────────
export default function App() {
  const [splash, setSplash] = useState(true);
  const [screen, setScreen] = useState("home");
  const [viewer, setViewer] = useState(null);
  const [creator, setCreator] = useState(null);
  const [selected, setSelected] = useState(null);
  const [paid, setPaid] = useState(false);
  const [cat, setCat] = useState("All");
  const [search, setSearch] = useState("");
  const [dm, setDm] = useState(true);
  const [lang, setLang] = useState("en");
  const [toastMsg, setToastMsg] = useState(null);
  const [streams, setStreams] = useState([]);
  const [loadingStreams, setLoadingStreams] = useState(true);

  const t = LANG[lang];
  const th = useTheme(dm);
  const go = () => { setScreen("home"); setSelected(null); setPaid(false); };
  const toast = msg => setToastMsg(msg);

  useEffect(() => {
    supabase.from("streams").select("*").order("created_at", { ascending: false })
      .then(({ data }) => { setStreams(data && data.length > 0 ? data : MOCK_STREAMS); setLoadingStreams(false); })
      .catch(() => { setStreams(MOCK_STREAMS); setLoadingStreams(false); });
  }, []);

  if (splash) return <SplashScreen onDone={() => setSplash(false)} />;
  if (screen === "creatorAuth") return <AuthPage type="creator" go={go} th={th} lang={lang} onAuth={c => { setCreator(c); setScreen("creatorStudio"); }} />;
  if (screen === "creatorStudio") return <CreatorStudio creator={creator} go={go} th={th} toast={toast} lang={lang} />;
  if (screen === "viewerAuth") return <AuthPage type="viewer" go={go} th={th} lang={lang} onAuth={u => { setViewer(u); setScreen("payment"); }} />;
  if (screen === "leaderboard") return <Leaderboard go={go} th={th} streams={streams} />;
  if (screen === "about") return <AboutPage go={go} th={th} />;
  if (screen === "payment" && selected) return <PaymentPage stream={selected} go={go} th={th} viewer={viewer} onSuccess={() => { setPaid(true); setScreen("live"); }} />;
  if (screen === "live" && paid && selected) return <LiveRoom stream={selected} user={viewer || { name: "Guest" }} go={go} toast={toast} lang={lang} />;

  const filtered = streams.filter(s => {
    const mc = cat === "All" || s.category === cat;
    const ms = search === "" || s.title?.toLowerCase().includes(search.toLowerCase()) || s.creator?.toLowerCase().includes(search.toLowerCase());
    return mc && ms;
  });

  return (
    <div style={{ minHeight: "100vh", background: th.bg, color: th.text, fontFamily: "sans-serif" }}>
      {toastMsg && <Toast msg={toastMsg} onClose={() => setToastMsg(null)} />}

      <div style={{ background: th.header, padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: `1px solid ${th.border}`, flexWrap: "wrap", gap: 10 }}>
        <Logo go={go} />
        <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
          <button onClick={() => setDm(d => !d)} style={{ background: "transparent", border: `1px solid ${th.border}`, color: th.muted, borderRadius: 8, padding: "6px 10px", fontSize: 16, cursor: "pointer" }}>{dm ? "☀️" : "🌙"}</button>
          <button onClick={() => setLang(l => l === "en" ? "rw" : "en")} style={{ background: "transparent", border: `1px solid ${th.border}`, color: th.muted, borderRadius: 8, padding: "6px 10px", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>{lang === "en" ? "🇷🇼 RW" : "🇬🇧 EN"}</button>
          <button onClick={() => setScreen("leaderboard")} style={{ background: "transparent", border: `1px solid ${th.border}`, color: th.muted, borderRadius: 8, padding: "6px 12px", fontSize: 12, cursor: "pointer" }}>🏆</button>
          <button onClick={() => setScreen("about")} style={{ background: "transparent", border: `1px solid ${th.border}`, color: th.muted, borderRadius: 8, padding: "6px 12px", fontSize: 12, cursor: "pointer" }}>{t.howItWorks}</button>
          {viewer
            ? <><Av name={viewer.name} size={28} /><span style={{ fontSize: 13, fontWeight: 700, color: th.text }}>{viewer.name}</span><button onClick={() => setViewer(null)} style={{ background: "transparent", border: `1px solid ${th.border}`, color: th.muted, borderRadius: 8, padding: "4px 10px", fontSize: 12, cursor: "pointer" }}>Out</button></>
            : <button onClick={() => setScreen("viewerAuth")} style={{ background: "transparent", border: `1px solid ${th.border}`, color: th.muted, borderRadius: 8, padding: "6px 12px", fontSize: 13, cursor: "pointer" }}>{t.logIn}</button>
          }
          <button onClick={() => setScreen("creatorAuth")} style={{ background: R, border: "none", borderRadius: 8, padding: "6px 14px", color: "#fff", fontWeight: 800, fontSize: 13, cursor: "pointer" }}>{t.goLive}</button>
        </div>
      </div>

      <div style={{ padding: "24px 16px", maxWidth: 960, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{ fontSize: 28, fontWeight: 800, marginBottom: 6 }}>{t.tagline}<br /><span style={{ color: R }}>{t.sub}</span></div>
          <div style={{ color: th.muted, fontSize: 15 }}>{t.desc}</div>
        </div>

        <div style={{ marginBottom: 12, position: "relative" }}>
          <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", fontSize: 16 }}>🔍</span>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder={t.search} style={{ width: "100%", background: th.card, border: `1.5px solid ${th.border}`, borderRadius: 12, padding: "12px 16px 12px 42px", color: th.text, fontSize: 14, fontFamily: "sans-serif", outline: "none", boxSizing: "border-box" }} />
          {search && <button onClick={() => setSearch("")} style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "transparent", border: "none", color: th.muted, cursor: "pointer", fontSize: 18 }}>×</button>}
        </div>

        <div style={{ display: "flex", gap: 8, marginBottom: 20, overflowX: "auto", paddingBottom: 4 }}>
          {CATS.map(c => <button key={c} onClick={() => setCat(c)} style={{ background: cat === c ? R : th.card, border: `1px solid ${cat === c ? R : th.border}`, color: cat === c ? "#fff" : th.muted, borderRadius: 99, padding: "7px 16px", fontSize: 13, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0 }}>{c}</button>)}
        </div>

        {loadingStreams
          ? <div style={{ textAlign: "center", padding: "60px 0" }}>
            <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 12 }}>{[0, 1, 2].map(i => <div key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: R, animation: `dotBounce 0.7s ${i * 0.15}s ease-in-out infinite alternate` }} />)}</div>
            <div style={{ color: th.muted }}>Loading streams...</div>
          </div>
          : <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 14 }}>
            {filtered.map(s => (
              <div key={s.id} style={{ background: th.card, borderRadius: 16, overflow: "hidden", border: `1px solid ${th.border}` }}>
                <div onClick={() => { setSelected(s); viewer ? setScreen("payment") : setScreen("viewerAuth"); }} style={{ height: 130, background: "linear-gradient(135deg,#1a0507,#0e0e14)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 55, position: "relative", cursor: "pointer" }}>
                  {s.emoji || "🎬"}
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom,transparent 50%,rgba(0,0,0,0.5))" }} />
                  <div style={{ position: "absolute", top: 8, left: 10, display: "flex", alignItems: "center", gap: 4 }}>
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: R, animation: "pulseDot 1.4s infinite" }} />
                    <span style={{ fontSize: 9, fontWeight: 800, color: R }}>LIVE</span>
                  </div>
                  <div style={{ position: "absolute", bottom: 8, right: 10, background: R, borderRadius: 7, padding: "2px 8px", fontSize: 12, fontWeight: 800, color: "#fff" }}>{fmt(s.price, s.currency)}</div>
                </div>
                <div style={{ padding: "12px 14px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 6 }}>
                    <Av name={s.creator || "?"} size={26} />
                    <div style={{ fontSize: 12, fontWeight: 700, color: th.text }}>{s.creator}</div>
                  </div>
                  <div onClick={() => { setSelected(s); viewer ? setScreen("payment") : setScreen("viewerAuth"); }} style={{ cursor: "pointer" }}>
                    <div style={{ fontWeight: 700, marginBottom: 3, fontSize: 14, color: th.text }}>{s.title}</div>
                    <div style={{ color: th.muted, fontSize: 11, marginBottom: 10 }}>👁 {(s.viewers || 0).toLocaleString()} {t.watching}</div>
                  </div>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button onClick={() => { window.open(`https://wa.me/?text=${encodeURIComponent(`Watch ${s.creator} live on Play Rwanda! 🔴🇷🇼`)}`, "_blank"); toast(t.copied); }} style={{ flex: 1, background: "#25D36618", border: "1px solid #25D36633", borderRadius: 8, padding: "5px", color: "#25D366", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>📤 WhatsApp</button>
                    <button onClick={() => { window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Watch ${s.creator} live on Play Rwanda! 🔴🇷🇼`)}`, "_blank"); toast(t.copied); }} style={{ flex: 1, background: "#1DA1F218", border: "1px solid #1DA1F233", borderRadius: 8, padding: "5px", color: "#1DA1F2", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>🐦 Tweet</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        }
      </div>

      <Footer go={go} th={th} onAbout={() => setScreen("about")} onLeaderboard={() => setScreen("leaderboard")} />

      <style>{`
        @keyframes splashPulse{from{opacity:0.7;transform:scale(0.96)}to{opacity:1;transform:scale(1)}}
        @keyframes dotBounce{from{opacity:0.3;transform:translateY(0)}to{opacity:1;transform:translateY(-8px)}}
        @keyframes toastIn{from{opacity:0;transform:translateX(-50%) translateY(20px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}
        @keyframes pulseDot{0%,100%{opacity:1}50%{opacity:0.3}}
        @keyframes floatEmoji{0%,100%{transform:translateY(0) scale(1)}50%{transform:translateY(-12px) scale(1.08)}}
      `}</style>
    </div>
  );
}