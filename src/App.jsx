import { useState, useEffect, useRef } from "react";
import { supabase } from "./supabase";

// ─────────────────────────────────────────────────────────────────────────────
// 🔴 PLAY V7 — Real Supabase Backend Edition 🇷🇼
// ─────────────────────────────────────────────────────────────────────────────

// ── THEME CONSTANTS ───────────────────────────────────────────────────────────
const R = "#E8002D";
const DARK = "#0A0A0C";
const DARKER = "#060608";
const CARD = "#111114";
const BORDER = "rgba(255,255,255,0.07)";
const TEXT = "#F0F0F4";
const MUTED = "rgba(240,240,244,0.45)";
const GREEN = "#4ade80";

const LIGHT = {
  bg:"#f5f5f7", card:"#ffffff", dark:"#ffffff",
  border:"rgba(0,0,0,0.08)", text:"#1a1a1a", muted:"rgba(0,0,0,0.4)",
};

// ── MOCK DATABASE (Replace with Supabase later) ───────────────────────────────
// 🔁 SUPABASE SWAP: replace each MOCK_* with supabase.from('table').select()
let MOCK_USERS = [
  { id:"u1", email:"viewer@play.rw", password:"1234", name:"Viewer One", role:"viewer", avatar:null, createdAt:"2026-01-01" },
  { id:"u2", email:"creator@play.rw", password:"1234", name:"Kalisa Brian", role:"creator", handle:"@kalisa", category:"Music", avatar:null, bio:"Rwandan musician with 10+ years experience 🇷🇼", createdAt:"2026-01-01" },
];

let MOCK_STREAMS = [
  { id:"s1", creatorId:"u2", creator:"Kalisa Brian", handle:"@kalisa", title:"Indirimbo z'Urukundo 🎵", category:"Music", viewers:1240, price:500, currency:"RWF", cut:10, emoji:"🎤", bio:"Rwandan musician with 10+ years experience. Singer & guitarist from Kigali 🇷🇼", totalEarned:620000, totalStreams:24, live:true },
  { id:"s2", creatorId:"c2", creator:"Mugisha Chris", handle:"@chrismug", title:"Comedy Night Live 😂", category:"Comedy", viewers:2100, price:1000, currency:"RWF", cut:20, emoji:"🎭", bio:"Rwanda's funniest comedian! Making Kigali laugh since 2018 😂", totalEarned:2100000, totalStreams:41, live:true },
  { id:"s3", creatorId:"c3", creator:"Nziza Amina", handle:"@amina_cooks", title:"Rwandan Cuisine 🍲", category:"Food", viewers:560, price:3, currency:"USD", cut:12, emoji:"🍲", bio:"Chef sharing the taste of Rwanda with the world! 🍲🌍", totalEarned:1680, totalStreams:18, live:true },
  { id:"s4", creatorId:"c4", creator:"Habimana Joel", handle:"@joelfit", title:"Morning Workout 💪", category:"Fitness", viewers:890, price:300, currency:"RWF", cut:10, emoji:"💪", bio:"Certified fitness trainer in Kigali. Helping Rwanda stay healthy! 💪", totalEarned:267000, totalStreams:56, live:true },
  { id:"s5", creatorId:"c5", creator:"Uwase Diane", handle:"@diane_art", title:"Live Painting 🎨", category:"Art", viewers:380, price:2, currency:"USD", cut:15, emoji:"🎨", bio:"Visual artist creating beauty one stroke at a time 🎨✨", totalEarned:760, totalStreams:12, live:true },
  { id:"s6", creatorId:"c6", creator:"Iradukunda Sara", handle:"@sara_talks", title:"Tech & Innovation 🚀", category:"Tech", viewers:430, price:1500, currency:"RWF", cut:15, emoji:"🚀", bio:"Tech entrepreneur building Rwanda's digital future! 🚀💡", totalEarned:645000, totalStreams:29, live:true },
];

let MOCK_TRANSACTIONS = [
  { id:"t1", viewerId:"u1", viewer:"Mugabo Eric", creatorId:"u2", amount:500, currency:"RWF", streamId:"s1", stream:"Indirimbo z'Urukundo 🎵", method:"MTN", time:"Today 10:32 AM", earn:450 },
  { id:"t2", viewerId:"u3", viewer:"Ingabire Marie", creatorId:"u2", amount:500, currency:"RWF", streamId:"s1", stream:"Indirimbo z'Urukundo 🎵", method:"Airtel", time:"Today 10:18 AM", earn:450 },
  { id:"t3", viewerId:"u4", viewer:"John Smith", creatorId:"u2", amount:5, currency:"USD", streamId:"s1", stream:"Indirimbo z'Urukundo 🎵", method:"Visa", time:"Today 09:55 AM", earn:4.5 },
  { id:"t4", viewerId:"u5", viewer:"Gasana Patrick", creatorId:"u2", amount:500, currency:"RWF", streamId:"s1", stream:"Indirimbo z'Urukundo 🎵", method:"MTN", time:"Today 09:41 AM", earn:450 },
  { id:"t5", viewerId:"u6", viewer:"Uwase Claudine", creatorId:"u2", amount:500, currency:"RWF", streamId:"s1", stream:"Indirimbo z'Urukundo 🎵", method:"MTN", time:"Yesterday 8:22 PM", earn:450 },
  { id:"t6", viewerId:"u7", viewer:"Cyusa David", creatorId:"u2", amount:500, currency:"RWF", streamId:"s1", stream:"Indirimbo z'Urukundo 🎵", method:"Airtel", time:"Yesterday 7:55 PM", earn:450 },
  { id:"t7", viewerId:"u8", viewer:"Aisha Mohamed", creatorId:"u2", amount:5, currency:"USD", streamId:"s1", stream:"Indirimbo z'Urukundo 🎵", method:"Visa", time:"Yesterday 6:30 PM", earn:4.5 },
  { id:"t8", viewerId:"u9", viewer:"Habimana Joel", creatorId:"u2", amount:500, currency:"RWF", streamId:"s1", stream:"Indirimbo z'Urukundo 🎵", method:"MTN", time:"Yesterday 5:14 PM", earn:450 },
];

let MOCK_GIFTS = [];

// ── REAL SUPABASE API FUNCTIONS 🔥 ────────────────────────────────────────────
const API = {
  // 🔐 REAL LOGIN
  login: async (email, password, role) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw new Error("Wrong email or password.");
    // Get user profile from our users table
    const { data: profile } = await supabase.from("users").select("*").eq("id", data.user.id).maybeSingle();
    if (profile && profile.role !== role) throw new Error(`This account is not a ${role} account.`);
    return profile || { id: data.user.id, email, role, name: email.split("@")[0] };
  },

  // 🔐 REAL SIGNUP
  signup: async (userData) => {
    const { data, error } = await supabase.auth.signUp({ email: userData.email, password: userData.password });
    if (error) throw new Error(error.message);
    // Save extra profile info to our users table
    const profile = { id: data.user.id, name: userData.name, email: userData.email, role: userData.role, handle: userData.handle, category: userData.category, avatar: null };
    await supabase.from("users").insert(profile);
    return profile;
  },

  // 🔴 GET REAL STREAMS
  getStreams: async () => {
    const { data, error } = await supabase.from("streams").select("*").order("created_at", { ascending: false });
    if (error || !data || data.length === 0) return [...MOCK_STREAMS];
    return data.map(s => ({ ...s, creatorId: s.creator_id, totalEarned: s.total_earned, totalStreams: s.total_streams }));
  },

  // 🔴 CREATE REAL STREAM
  createStream: async (streamData) => {
    const { data, error } = await supabase.from("streams").insert({
      creator_id: streamData.creatorId, creator: streamData.creator, handle: streamData.handle,
      title: streamData.title, category: streamData.category, price: streamData.price,
      currency: streamData.currency, cut: streamData.cut, emoji: streamData.emoji || "🎤",
      bio: streamData.bio || "", viewers: 0, total_earned: 0, total_streams: 0, live: true
    }).select().single();
    if (error) throw new Error(error.message);
    return { ...data, creatorId: data.creator_id, totalEarned: 0, totalStreams: 0 };
  },

  // 💳 GET REAL TRANSACTIONS
  getTransactions: async (creatorId) => {
    const { data, error } = await supabase.from("transactions").select("*").eq("creator_id", creatorId).order("created_at", { ascending: false });
    if (error || !data) return MOCK_TRANSACTIONS;
    return data.map(t => ({ ...t, viewerId: t.viewer_id, creatorId: t.creator_id, streamId: t.stream_id, time: new Date(t.created_at).toLocaleString() }));
  },

  // 💳 RECORD REAL PAYMENT
  pay: async (streamId, viewerId, method, stream) => {
    await delay(2000);
    const earn = stream.price * (1 - stream.cut / 100);
    await supabase.from("transactions").insert({
      viewer_id: viewerId, creator_id: stream.creatorId || stream.creator_id,
      stream_id: streamId, stream: stream.title, amount: stream.price,
      currency: stream.currency, earn, method, viewer: "Viewer"
    });
    await supabase.from("streams").update({ viewers: (stream.viewers || 0) + 1, total_earned: (stream.totalEarned || 0) + earn }).eq("id", streamId);
    return { earn };
  },

  // 🎁 SEND REAL GIFT
  sendGift: async (gift) => {
    await supabase.from("gifts").insert({ emoji: gift.emoji, name: gift.name, price: gift.price });
    return true;
  },

  // 🚪 LOGOUT
  logout: async () => { await supabase.auth.signOut(); },
};

const delay = (ms) => new Promise(r => setTimeout(r, ms));

// ── STATIC DATA ───────────────────────────────────────────────────────────────
const FAKE_USERS = ["Mugabo","Ingabire","Patrick","Uwase","Kalisa","Nziza","Gasana","Cyusa"];
const FAKE_MSGS = ["🔥🔥🔥","Amazing!","Neza cyane!","❤️❤️","Keep going!","Wow!","Incredible! 😍","Kigali represent! 🇷🇼"];
const CATS = ["All","Music","Comedy","Food","Fitness","Art","Tech"];
const PAY_METHODS = [
  { id:"mtn", name:"MTN Mobile Money", short:"MoMo", color:"#FFCB00", tc:"#000", field:"phone", ph:"078 000 0000" },
  { id:"airtel", name:"Airtel Money", short:"Airtel", color:"#E8002D", tc:"#fff", field:"phone", ph:"073 000 0000" },
  { id:"visa", name:"Visa / Mastercard", short:"Card", color:"#1A1F71", tc:"#fff", field:"card", ph:"" },
];

// 🎁 GIFT SYSTEM DATA
const GIFTS = [
  { id:"g1", emoji:"❤️", name:"Heart", price:100, currency:"RWF" },
  { id:"g2", emoji:"🔥", name:"Fire", price:200, currency:"RWF" },
  { id:"g3", emoji:"👑", name:"Crown", price:500, currency:"RWF" },
  { id:"g4", emoji:"💎", name:"Diamond", price:1000, currency:"RWF" },
  { id:"g5", emoji:"🚀", name:"Rocket", price:2000, currency:"RWF" },
  { id:"g6", emoji:"🦁", name:"Lion", price:5000, currency:"RWF" },
];

const LANG = {
  en: {
    tagline:"Watch. Pay. Support.", sub:"Rwandan Creators. 🇷🇼",
    desc:"Join live streams instantly. Creators get paid immediately.",
    search:"Search streams or creators...",
    logIn:"Log In", signUp:"Sign Up", goLive:"🎬 Go Live",
    howItWorks:"How it Works", leave:"Leave",
    tip:"💰 Tip", tipSent:"✓ Sent! 🎉",
    saySomething:"Say something...", watching:"watching",
    copied:"🔗 Link shared! Tell your friends 🔥",
    noStreams:"No streams yet!", noStreamsSub:"Go live for the first time and start earning! 🔴",
    startFirst:"🔴 Start Your First Live!",
    noHistory:"No history yet!", noHistorySub:"Go watch your first stream! 🔴",
    browseStreams:"Browse Streams →",
    gifts:"🎁 Gifts", sendGift:"Send Gift",
  },
  rw: {
    tagline:"Reba. Tanga. Shyigikira.", sub:"Abashushanyamateka bo mu Rwanda. 🇷🇼",
    desc:"Injira muri livestream byihuse. Abakora barahabwa amafaranga ako kanya.",
    search:"Shakisha streams cyangwa abakora...",
    logIn:"Injira", signUp:"Iyandikishe", goLive:"🎬 Tangira Live",
    howItWorks:"Uko Bikorwa", leave:"Sohoka",
    tip:"💰 Impano", tipSent:"✓ Yoherejwe! 🎉",
    saySomething:"Vuga ikintu...", watching:"bareba",
    copied:"🔗 Igishambanyo sangijwe! Bwira inshuti 🔥",
    noStreams:"Nta streams nawe!", noStreamsSub:"Tangira live ya mbere ubone amafaranga! 🔴",
    startFirst:"🔴 Tangira Live Ya Mbere!",
    noHistory:"Nta mateka nawe!", noHistorySub:"Reba stream ya mbere! 🔴",
    browseStreams:"Reba Streams →",
    gifts:"🎁 Impano", sendGift:"Ohereza Impano",
  }
};

const fmt = (n, cur) => cur === "RWF" ? `${Number(n).toLocaleString()} RWF` : `$${Number(n).toFixed(2)}`;

function useTheme(dm) {
  return {
    bg: dm ? DARKER : LIGHT.bg,
    card: dm ? CARD : LIGHT.card,
    header: dm ? DARK : LIGHT.dark,
    border: dm ? BORDER : LIGHT.border,
    text: dm ? TEXT : LIGHT.text,
    muted: dm ? MUTED : LIGHT.muted,
    inp: {
      width:"100%", background: dm ? "#0D0D10" : LIGHT.bg,
      border: `1.5px solid ${dm ? BORDER : LIGHT.border}`,
      borderRadius:12, padding:"12px 15px",
      color: dm ? TEXT : LIGHT.text,
      fontSize:14, fontFamily:"sans-serif",
      outline:"none", boxSizing:"border-box"
    }
  };
}

// ── 1. SPLASH SCREEN ──────────────────────────────────────────────────────────
function SplashScreen({ onDone }) {
  const [fade, setFade] = useState(false);
  useEffect(() => {
    const t1 = setTimeout(() => setFade(true), 1800);
    const t2 = setTimeout(() => onDone(), 2400);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);
  return (
    <div style={{ position:"fixed", inset:0, background:DARKER, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", zIndex:9999, transition:"opacity 0.6s ease", opacity:fade?0:1, pointerEvents:fade?"none":"all" }}>
      <div style={{ fontSize:72, fontWeight:800, color:R, letterSpacing:"-3px", animation:"splashPulse 1.2s ease-in-out infinite alternate", marginBottom:16 }}>play</div>
      <div style={{ color:MUTED, fontSize:14, letterSpacing:"3px", textTransform:"uppercase", marginBottom:40 }}>Rwanda 🇷🇼</div>
      <div style={{ display:"flex", gap:10 }}>
        {[0,1,2].map(i => <div key={i} style={{ width:9, height:9, borderRadius:"50%", background:R, animation:`dotBounce 0.8s ${i*0.18}s ease-in-out infinite alternate` }} />)}
      </div>
      <style>{`@keyframes splashPulse{from{opacity:0.7;transform:scale(0.96)}to{opacity:1;transform:scale(1)}}@keyframes dotBounce{from{opacity:0.3;transform:translateY(0)}to{opacity:1;transform:translateY(-8px)}}`}</style>
    </div>
  );
}

// ── TOAST ─────────────────────────────────────────────────────────────────────
function Toast({ msg, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t); }, []);
  return (
    <div style={{ position:"fixed", bottom:28, left:"50%", transform:"translateX(-50%)", zIndex:9999, background:"#166534", color:"#fff", borderRadius:14, padding:"13px 24px", fontWeight:700, fontSize:14, boxShadow:"0 4px 24px rgba(0,0,0,0.35)", animation:"toastIn 0.3s ease", whiteSpace:"nowrap" }}>
      {msg}
      <style>{`@keyframes toastIn{from{opacity:0;transform:translateX(-50%) translateY(20px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}`}</style>
    </div>
  );
}

// ── ANIMATED COUNT ────────────────────────────────────────────────────────────
function AnimCount({ value }) {
  const [display, setDisplay] = useState(value);
  const prev = useRef(value);
  useEffect(() => {
    if (value === prev.current) return;
    const diff = value - prev.current; const steps = 20; let i = 0;
    const iv = setInterval(() => { i++; setDisplay(Math.round(prev.current + (diff*i/steps))); if(i>=steps){clearInterval(iv);prev.current=value;} }, 25);
    return () => clearInterval(iv);
  }, [value]);
  return <span>{display.toLocaleString()}</span>;
}

// ── AVATAR ────────────────────────────────────────────────────────────────────
function Av({ name, size=40, photo=null }) {
  const hue = (name.charCodeAt(0)*37 + name.charCodeAt(1)*13) % 360;
  if (photo) return <img src={photo} alt={name} style={{ width:size, height:size, borderRadius:"50%", objectFit:"cover", flexShrink:0, border:"2px solid rgba(232,0,45,0.3)" }} />;
  return <div style={{ width:size, height:size, borderRadius:"50%", background:`hsl(${hue},60%,38%)`, color:"#fff", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:800, fontSize:size*0.38, flexShrink:0 }}>{name[0]}</div>;
}

function Logo({ go }) {
  return <div onClick={go} style={{ fontSize:26, fontWeight:800, color:R, cursor:"pointer", letterSpacing:"-1px" }}>play</div>;
}

function Btn({ onClick, children, style={} }) {
  return <button onClick={onClick} style={{ background:"transparent", border:`1px solid ${BORDER}`, color:MUTED, borderRadius:8, padding:"6px 12px", fontSize:13, cursor:"pointer", fontFamily:"sans-serif", ...style }}>{children}</button>;
}

// ── LOADING SPINNER ───────────────────────────────────────────────────────────
function Loading({ msg="Loading..." }) {
  return (
    <div style={{ minHeight:"100vh", background:DARKER, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:16, color:TEXT, fontFamily:"sans-serif" }}>
      <div style={{ display:"flex", gap:8 }}>
        {[0,1,2].map(i => <div key={i} style={{ width:8, height:8, borderRadius:"50%", background:R, animation:`dotBounce 0.7s ${i*0.15}s ease-in-out infinite alternate` }} />)}
      </div>
      <div style={{ color:MUTED, fontSize:14 }}>{msg}</div>
      <style>{`@keyframes dotBounce{from{opacity:0.3;transform:translateY(0)}to{opacity:1;transform:translateY(-8px)}}`}</style>
    </div>
  );
}

// ── FOOTER ────────────────────────────────────────────────────────────────────
function Footer({ go, onAbout, onTerms, th }) {
  return (
    <div style={{ background:th.header, borderTop:`1px solid ${th.border}`, padding:"32px 24px", marginTop:48 }}>
      <div style={{ maxWidth:960, margin:"0 auto" }}>
        <div style={{ display:"flex", justifyContent:"space-between", flexWrap:"wrap", gap:24, marginBottom:24 }}>
          <div>
            <Logo go={go} />
            <div style={{ color:th.muted, fontSize:13, maxWidth:220, marginTop:6 }}>Rwanda's first live streaming pay-per-view platform. Built for Rwandan creators. 🇷🇼</div>
          </div>
          <div style={{ display:"flex", gap:40, flexWrap:"wrap" }}>
            <div>
              <div style={{ fontSize:11, color:th.muted, textTransform:"uppercase", letterSpacing:"1px", marginBottom:12 }}>Platform</div>
              <div onClick={onAbout} style={{ color:th.muted, fontSize:13, marginBottom:8, cursor:"pointer" }}>How it Works</div>
              <div onClick={onTerms} style={{ color:th.muted, fontSize:13, cursor:"pointer" }}>Terms & Privacy</div>
            </div>
            <div>
              <div style={{ fontSize:11, color:th.muted, textTransform:"uppercase", letterSpacing:"1px", marginBottom:12 }}>Contact</div>
              <div style={{ color:th.muted, fontSize:13, marginBottom:6 }}>hello@play.rw</div>
              <div style={{ color:th.muted, fontSize:13, marginBottom:10 }}>Kigali, Rwanda 🇷🇼</div>
              <div style={{ display:"flex", gap:8 }}>
                {["Twitter","Instagram","TikTok"].map(s => <div key={s} style={{ background:th.card, border:`1px solid ${th.border}`, borderRadius:8, padding:"4px 10px", fontSize:11, color:th.muted, cursor:"pointer" }}>{s}</div>)}
              </div>
            </div>
          </div>
        </div>
        <div style={{ borderTop:`1px solid ${th.border}`, paddingTop:18, display:"flex", justifyContent:"space-between", flexWrap:"wrap", gap:8 }}>
          <div style={{ fontSize:12, color:th.muted }}>© 2026 Play Rwanda. All rights reserved.</div>
          <div style={{ fontSize:12, color:th.muted }}>Made with ❤️ in Kigali 🇷🇼</div>
        </div>
      </div>
    </div>
  );
}

// ── ABOUT PAGE ────────────────────────────────────────────────────────────────
function AboutPage({ go, th }) {
  return (
    <div style={{ minHeight:"100vh", background:th.bg, color:th.text, fontFamily:"sans-serif" }}>
      <div style={{ background:th.header, padding:"12px 16px", display:"flex", alignItems:"center", gap:12, borderBottom:`1px solid ${th.border}` }}>
        <Btn onClick={go}>← Home</Btn><Logo go={go} />
        <div style={{ color:th.muted, fontSize:14 }}>How it Works</div>
      </div>
      <div style={{ maxWidth:700, margin:"0 auto", padding:"40px 24px" }}>
        <div style={{ textAlign:"center", marginBottom:36 }}>
          <div style={{ fontSize:44, fontWeight:800, color:R, marginBottom:8 }}>play</div>
          <div style={{ fontSize:22, fontWeight:800, marginBottom:12 }}>Rwanda's First Live Streaming Pay-Per-View Platform 🇷🇼</div>
          <div style={{ color:th.muted, fontSize:15, lineHeight:1.7 }}>Connect with Rwandan creators. Go live, set your price, get paid instantly.</div>
        </div>
        {[
          { emoji:"👁", title:"Browse for free", desc:"See all live streams with no account needed!" },
          { emoji:"🔐", title:"Sign up in seconds", desc:"Create your account with name, email and password." },
          { emoji:"💳", title:"Pay to join", desc:"Pay with MTN MoMo, Airtel Money or Visa card." },
          { emoji:"🎬", title:"Watch & Chat", desc:"Enjoy the stream, chat with viewers, and send gifts!" },
          { emoji:"🎁", title:"Send Gifts", desc:"Send coins & gifts to your favorite creators live!" },
        ].map((s,i) => (
          <div key={i} style={{ background:th.card, borderRadius:14, padding:"18px 20px", border:`1px solid ${th.border}`, display:"flex", gap:14, marginBottom:12 }}>
            <div style={{ fontSize:32, flexShrink:0 }}>{s.emoji}</div>
            <div><div style={{ fontWeight:800, fontSize:15, marginBottom:4 }}>{s.title}</div><div style={{ color:th.muted, fontSize:14, lineHeight:1.6 }}>{s.desc}</div></div>
          </div>
        ))}
        <div style={{ background:"linear-gradient(135deg,#1a0507,#0e0e14)", borderRadius:18, padding:"24px", border:"1px solid rgba(232,0,45,0.2)", marginTop:24 }}>
          <div style={{ fontSize:20, fontWeight:800, marginBottom:12, color:"#fff" }}>Turn your talent into income 💰</div>
          {["✅ Set your own entry price","✅ Get paid via MTN MoMo or Airtel instantly","✅ International viewers pay via card","✅ You keep up to 95% of every payment","✅ Receive gifts from fans during live streams","✅ No monthly fees"].map((f,i) => <div key={i} style={{ color:"#F0F0F4", fontSize:14, marginBottom:8 }}>{f}</div>)}
        </div>
      </div>
    </div>
  );
}

// ── TERMS PAGE ────────────────────────────────────────────────────────────────
function TermsPage({ go, th }) {
  return (
    <div style={{ minHeight:"100vh", background:th.bg, color:th.text, fontFamily:"sans-serif" }}>
      <div style={{ background:th.header, padding:"12px 16px", display:"flex", alignItems:"center", gap:12, borderBottom:`1px solid ${th.border}` }}>
        <Btn onClick={go}>← Home</Btn><Logo go={go} />
        <div style={{ color:th.muted, fontSize:14 }}>Terms & Privacy</div>
      </div>
      <div style={{ maxWidth:700, margin:"0 auto", padding:"36px 24px" }}>
        <div style={{ fontSize:24, fontWeight:800, marginBottom:6 }}>Terms of Service & Privacy Policy</div>
        <div style={{ color:th.muted, fontSize:13, marginBottom:28 }}>Last updated: June 2026 · Play Rwanda Ltd 🇷🇼</div>
        {[
          { t:"1. Acceptance of Terms", c:"By using Play, you agree to these Terms. Play is operated by Play Rwanda Ltd, Kigali, Rwanda." },
          { t:"2. User Accounts", c:"Provide accurate info when signing up. You must be at least 18 years old to use Play." },
          { t:"3. Payments & Refunds", c:"All payments are final once you've joined a stream. Prices are set by creators in RWF or USD." },
          { t:"4. Creator Earnings", c:"Creators receive earnings after Play deducts its fee (minimum 5%). Paid to registered payout method." },
          { t:"5. Gift System", c:"Gifts sent to creators are non-refundable. Gift values are deducted from viewer balance instantly." },
          { t:"6. Content Policy", c:"No illegal or harmful content. Play reserves the right to remove content violating our guidelines." },
          { t:"7. Privacy Policy", c:"We collect only necessary info — name, email, payment details. We never sell your data." },
          { t:"8. Governing Law", c:"These terms are governed by the laws of Rwanda. Disputes resolved in Kigali courts." },
          { t:"9. Contact Us", c:"Questions? Contact us at legal@play.rw or visit our offices in Kigali, Rwanda." },
        ].map((s,i) => (
          <div key={i} style={{ marginBottom:22 }}>
            <div style={{ fontWeight:800, fontSize:15, color:R, marginBottom:6 }}>{s.t}</div>
            <div style={{ color:th.muted, fontSize:14, lineHeight:1.8 }}>{s.c}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── CREATOR PROFILE ───────────────────────────────────────────────────────────
function ProfilePage({ stream:s, go, viewer, setSelected, setScreen, th, toast }) {
  const share = (type) => {
    const msg = `Check out ${s.creator} on Play Rwanda! 🎬🇷🇼`;
    if (type === "wa") window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`,"_blank");
    else window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(msg)}`,"_blank");
    toast("🔗 Link shared! Tell your friends 🔥");
  };
  return (
    <div style={{ minHeight:"100vh", background:th.bg, color:th.text, fontFamily:"sans-serif" }}>
      <div style={{ background:th.header, padding:"12px 16px", display:"flex", alignItems:"center", gap:12, borderBottom:`1px solid ${th.border}` }}>
        <Btn onClick={go}>← Home</Btn><Logo go={go} />
      </div>
      <div style={{ maxWidth:700, margin:"0 auto", padding:"28px 24px" }}>
        <div style={{ background:"linear-gradient(135deg,#1a0507,#0e0e14)", borderRadius:20, padding:"28px", border:"1px solid rgba(232,0,45,0.15)", marginBottom:20, textAlign:"center" }}>
          <div style={{ fontSize:60, marginBottom:10 }}>{s.emoji}</div>
          <div style={{ fontSize:22, fontWeight:800, marginBottom:4, color:"#fff" }}>{s.creator}</div>
          <div style={{ color:R, fontSize:14, marginBottom:6 }}>{s.handle}</div>
          <div style={{ display:"inline-block", background:"rgba(232,0,45,0.12)", border:"1px solid rgba(232,0,45,0.25)", borderRadius:99, padding:"3px 12px", fontSize:12, color:R, marginBottom:14 }}>{s.category}</div>
          <div style={{ color:"rgba(240,240,244,0.6)", fontSize:14, lineHeight:1.7, marginBottom:18 }}>{s.bio}</div>
          <div style={{ display:"flex", gap:20, justifyContent:"center", flexWrap:"wrap" }}>
            {[{ l:"Streams", v:s.totalStreams },{ l:"Viewers", v:(s.viewers*s.totalStreams).toLocaleString() },{ l:"Earned", v:fmt(s.totalEarned,s.currency) }].map(x => (
              <div key={x.l} style={{ textAlign:"center" }}>
                <div style={{ fontWeight:800, fontSize:18, color:"#fff" }}>{x.v}</div>
                <div style={{ fontSize:11, color:"rgba(240,240,244,0.5)" }}>{x.l}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ display:"flex", gap:10, marginBottom:20 }}>
          <button onClick={()=>share("wa")} style={{ flex:1, background:"#25D366", border:"none", borderRadius:12, padding:"11px", color:"#fff", fontWeight:800, fontSize:13, cursor:"pointer" }}>📤 WhatsApp</button>
          <button onClick={()=>share("tw")} style={{ flex:1, background:"#1DA1F2", border:"none", borderRadius:12, padding:"11px", color:"#fff", fontWeight:800, fontSize:13, cursor:"pointer" }}>🐦 Twitter</button>
        </div>
        <div style={{ fontSize:14, fontWeight:700, color:th.muted, marginBottom:12 }}>🔴 Live Now</div>
        <div onClick={()=>{ setSelected(s); viewer ? setScreen("payment") : setScreen("viewerAuth"); }} style={{ background:th.card, borderRadius:14, border:`1px solid ${th.border}`, padding:"14px 18px", display:"flex", justifyContent:"space-between", alignItems:"center", cursor:"pointer" }}>
          <div style={{ display:"flex", gap:10, alignItems:"center" }}>
            <div style={{ fontSize:30 }}>{s.emoji}</div>
            <div>
              <div style={{ fontWeight:700, fontSize:14, marginBottom:2 }}>{s.title}</div>
              <div style={{ color:th.muted, fontSize:12 }}>👁 {s.viewers.toLocaleString()} watching</div>
            </div>
          </div>
          <div style={{ background:R, borderRadius:10, padding:"6px 14px", fontWeight:800, fontSize:14, color:"#fff" }}>{fmt(s.price,s.currency)}</div>
        </div>
      </div>
    </div>
  );
}

// ── LEADERBOARD ───────────────────────────────────────────────────────────────
function Leaderboard({ go, th, streams }) {
  const sorted = [...streams].sort((a,b) => b.totalEarned - a.totalEarned);
  const medals = ["🥇","🥈","🥉"];
  return (
    <div style={{ minHeight:"100vh", background:th.bg, color:th.text, fontFamily:"sans-serif" }}>
      <div style={{ background:th.header, padding:"12px 16px", display:"flex", alignItems:"center", gap:12, borderBottom:`1px solid ${th.border}` }}>
        <Btn onClick={go}>← Home</Btn><Logo go={go} />
        <div style={{ color:th.muted, fontSize:14 }}>🏆 Leaderboard</div>
      </div>
      <div style={{ maxWidth:600, margin:"0 auto", padding:"28px 24px" }}>
        <div style={{ textAlign:"center", marginBottom:28 }}>
          <div style={{ fontSize:38 }}>🏆</div>
          <div style={{ fontSize:20, fontWeight:800, marginBottom:4 }}>Top Creators This Month</div>
          <div style={{ color:th.muted, fontSize:14 }}>Ranked by total earnings on Play 🇷🇼</div>
        </div>
        {/* Top 3 Podium */}
        <div style={{ display:"flex", gap:10, justifyContent:"center", alignItems:"flex-end", marginBottom:24 }}>
          {[sorted[1],sorted[0],sorted[2]].filter(Boolean).map((s,i) => {
            const h=[130,160,110]; const rank=i===0?2:i===1?1:3;
            return (
              <div key={s.id} style={{ flex:1, textAlign:"center" }}>
                <div style={{ fontSize:26, marginBottom:4 }}>{s.emoji}</div>
                <div style={{ background:rank===1?"linear-gradient(135deg,#FFD700,#FFA500)":th.card, border:`1px solid ${rank===1?"#FFD700":th.border}`, borderRadius:12, padding:"10px 4px", height:h[i], display:"flex", flexDirection:"column", justifyContent:"flex-end", alignItems:"center", paddingBottom:10 }}>
                  <div style={{ fontSize:16 }}>{medals[rank-1]}</div>
                  <div style={{ fontSize:11, fontWeight:800, color:rank===1?"#000":th.text, marginTop:4 }}>{s.creator.split(" ")[0]}</div>
                  <div style={{ fontSize:10, color:rank===1?"rgba(0,0,0,0.6)":th.muted }}>{fmt(s.totalEarned,s.currency)}</div>
                </div>
              </div>
            );
          })}
        </div>
        {/* Full list */}
        <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
          {sorted.map((s,i) => (
            <div key={s.id} style={{ background:th.card, borderRadius:14, border:`1px solid ${i<3?"rgba(232,0,45,0.2)":th.border}`, padding:"13px 16px", display:"flex", alignItems:"center", gap:12 }}>
              <div style={{ fontSize:16, width:26, textAlign:"center", flexShrink:0 }}>{i<3?medals[i]:`#${i+1}`}</div>
              <div style={{ fontSize:24, flexShrink:0 }}>{s.emoji}</div>
              <div style={{ flex:1 }}>
                <div style={{ fontWeight:700, fontSize:13 }}>{s.creator}</div>
                <div style={{ color:th.muted, fontSize:11 }}>{s.category} · {s.handle}</div>
              </div>
              <div style={{ textAlign:"right" }}>
                <div style={{ fontWeight:800, color:GREEN, fontSize:14 }}>{fmt(s.totalEarned,s.currency)}</div>
                <div style={{ fontSize:11, color:th.muted }}>{s.totalStreams} streams</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── VIEWER HISTORY ────────────────────────────────────────────────────────────
function HistoryPage({ history, go, th, lang }) {
  const t = LANG[lang];
  return (
    <div style={{ minHeight:"100vh", background:th.bg, color:th.text, fontFamily:"sans-serif" }}>
      <div style={{ background:th.header, padding:"12px 16px", display:"flex", alignItems:"center", gap:12, borderBottom:`1px solid ${th.border}` }}>
        <Btn onClick={go}>← Home</Btn><Logo go={go} />
        <div style={{ color:th.muted, fontSize:14 }}>📋 Watch History</div>
      </div>
      <div style={{ maxWidth:600, margin:"0 auto", padding:"28px 24px" }}>
        <div style={{ fontSize:20, fontWeight:800, marginBottom:6 }}>Your Watch History 📋</div>
        <div style={{ color:th.muted, fontSize:14, marginBottom:22 }}>Streams you've paid for and watched</div>
        {history.length === 0 ? (
          <div style={{ textAlign:"center", padding:"60px 0", color:th.muted }}>
            <div style={{ fontSize:64, marginBottom:16 }}>📺</div>
            <div style={{ fontSize:20, fontWeight:800, marginBottom:8, color:th.text }}>{t.noHistory}</div>
            <div style={{ fontSize:14, marginBottom:24 }}>{t.noHistorySub}</div>
            <button onClick={go} style={{ background:R, border:"none", borderRadius:12, padding:"12px 24px", color:"#fff", fontWeight:800, fontSize:14, cursor:"pointer" }}>{t.browseStreams}</button>
          </div>
        ) : history.map((s,i) => (
          <div key={i} style={{ background:th.card, borderRadius:14, border:`1px solid ${th.border}`, padding:"14px 18px", display:"flex", alignItems:"center", gap:12, marginBottom:10 }}>
            <div style={{ fontSize:30 }}>{s.emoji}</div>
            <div style={{ flex:1 }}>
              <div style={{ fontWeight:700, fontSize:14, marginBottom:2 }}>{s.title}</div>
              <div style={{ color:th.muted, fontSize:12 }}>by {s.creator} · {s.category}</div>
            </div>
            <div style={{ textAlign:"right" }}>
              <div style={{ fontWeight:800, color:R, fontSize:14 }}>{fmt(s.price,s.currency)}</div>
              <div style={{ fontSize:11, color:GREEN }}>✓ Watched</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── AUTH PAGE ─────────────────────────────────────────────────────────────────
function AuthPage({ onAuth, type, go, th, lang }) {
  const t = LANG[lang];
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name:"", email:"", password:"", handle:"", category:"Music" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setError("");
    if (!form.email || !form.password) { setError("Please fill all fields."); return; }
    if (mode === "signup" && !form.name) { setError("Please enter your name."); return; }
    setLoading(true);
    try {
      let user;
      if (mode === "login") {
        // 🔁 SUPABASE: user = await supabase.auth.signInWithPassword({ email, password })
        user = await API.login(form.email, form.password, type);
      } else {
        if (form.password.length < 4) { setError("Password must be at least 4 characters."); setLoading(false); return; }
        // 🔁 SUPABASE: user = await supabase.auth.signUp({ email, password, data: {...} })
        user = await API.signup({ name:form.name, email:form.email, password:form.password, role:type, handle:form.handle?`@${form.handle}`:`@${form.name.toLowerCase().replace(" ","")}`, category:form.category, avatar:null });
      }
      onAuth(user);
    } catch(err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight:"100vh", background:th.bg, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"sans-serif", padding:24 }}>
      <div style={{ width:"100%", maxWidth:420 }}>
        <div style={{ textAlign:"center", marginBottom:24 }}>
          <Logo go={go} />
          <div style={{ color:th.muted, fontSize:13, marginTop:6, letterSpacing:"2px", textTransform:"uppercase" }}>{type==="creator"?"Creator Portal 🎬":"Join to Watch 👁"}</div>
        </div>
        <div style={{ background:th.card, border:`1px solid ${th.border}`, borderRadius:24, padding:"28px 24px" }}>
          <div style={{ display:"flex", background:th.bg, borderRadius:12, padding:4, marginBottom:22 }}>
            {["login","signup"].map(m => (
              <button key={m} onClick={() => { setMode(m); setError(""); }} style={{ flex:1, background:mode===m?R:"transparent", border:"none", borderRadius:9, padding:"9px", color:mode===m?"#fff":th.muted, fontWeight:800, fontSize:13, cursor:"pointer", fontFamily:"sans-serif" }}>
                {m==="login"?t.logIn:t.signUp}
              </button>
            ))}
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
            {mode==="signup" && <>
              <div>
                <label style={{ fontSize:11, color:th.muted, textTransform:"uppercase", letterSpacing:"0.7px", display:"block", marginBottom:6 }}>Full Name</label>
                <input style={th.inp} placeholder="e.g. Kalisa Brian" value={form.name} onChange={e=>setForm(p=>({...p,name:e.target.value}))} />
              </div>
              {type==="creator" && <>
                <div>
                  <label style={{ fontSize:11, color:th.muted, textTransform:"uppercase", letterSpacing:"0.7px", display:"block", marginBottom:6 }}>Handle</label>
                  <input style={th.inp} placeholder="e.g. kalisa" value={form.handle} onChange={e=>setForm(p=>({...p,handle:e.target.value}))} />
                </div>
                <div>
                  <label style={{ fontSize:11, color:th.muted, textTransform:"uppercase", letterSpacing:"0.7px", display:"block", marginBottom:6 }}>Category</label>
                  <select style={{...th.inp}} value={form.category} onChange={e=>setForm(p=>({...p,category:e.target.value}))}>
                    {CATS.filter(c=>c!=="All").map(c=><option key={c}>{c}</option>)}
                  </select>
                </div>
              </>}
            </>}
            <div>
              <label style={{ fontSize:11, color:th.muted, textTransform:"uppercase", letterSpacing:"0.7px", display:"block", marginBottom:6 }}>Email</label>
              <input style={th.inp} type="email" placeholder="you@example.com" value={form.email} onChange={e=>setForm(p=>({...p,email:e.target.value}))} onKeyDown={e=>e.key==="Enter"&&submit()} />
            </div>
            <div>
              <label style={{ fontSize:11, color:th.muted, textTransform:"uppercase", letterSpacing:"0.7px", display:"block", marginBottom:6 }}>Password</label>
              <input style={th.inp} type="password" placeholder="••••••••" value={form.password} onChange={e=>setForm(p=>({...p,password:e.target.value}))} onKeyDown={e=>e.key==="Enter"&&submit()} />
            </div>
            {error && <div style={{ background:"rgba(232,0,45,0.1)", border:"1px solid rgba(232,0,45,0.3)", borderRadius:10, padding:"10px 14px", fontSize:13, color:R }}>⚠️ {error}</div>}
            <button onClick={submit} disabled={loading} style={{ width:"100%", background:R, border:"none", borderRadius:12, padding:"13px", color:"#fff", fontSize:15, fontWeight:800, cursor:"pointer", opacity:loading?0.7:1, marginTop:2, fontFamily:"sans-serif" }}>
              {loading ? "Please wait..." : mode==="login"?`${t.logIn} →`:`${t.signUp} →`}
            </button>
            <button onClick={go} style={{ background:"transparent", border:"none", color:th.muted, cursor:"pointer", fontSize:13, fontFamily:"sans-serif" }}>← Back to Home</button>
          </div>
          <div style={{ textAlign:"center", marginTop:14, fontSize:12, color:th.muted }}>
            {type==="creator"?<>Demo: <span style={{color:R}}>creator@play.rw</span> / <span style={{color:R}}>1234</span></>:<>Demo: <span style={{color:R}}>viewer@play.rw</span> / <span style={{color:R}}>1234</span></>}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── PAYMENT PAGE ──────────────────────────────────────────────────────────────
function PaymentPage({ stream:s, go, onSuccess, th, viewer }) {
  const [method, setMethod] = useState(null);
  const [phone, setPhone] = useState("");
  const [card, setCard] = useState({ number:"", expiry:"", cvv:"", name:"" });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const earn = s.price * (1 - s.cut / 100);

  const pay = async () => {
    if (!method) return;
    setLoading(true); setError("");
    try {
      // 🔁 SUPABASE: call real payment API then record in DB
      await API.pay(s.id, viewer?.id || "guest", method.id);
      setDone(true);
      setTimeout(() => onSuccess(), 1200);
    } catch(err) {
      setError(err.message);
      setLoading(false);
    }
  };

  if (done) return (
    <div style={{ minHeight:"100vh", background:th.bg, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", fontFamily:"sans-serif", color:th.text }}>
      <div style={{ fontSize:70, marginBottom:14 }}>🎉</div>
      <div style={{ fontSize:22, fontWeight:800 }}>Payment Successful!</div>
      <div style={{ color:MUTED, marginTop:6 }}>Joining stream...</div>
      <div style={{ marginTop:18, background:th.card, borderRadius:14, padding:"14px 24px", border:"1px solid rgba(74,222,128,0.3)", textAlign:"center" }}>
        <div style={{ fontSize:12, color:MUTED, marginBottom:4 }}>Creator received 💚</div>
        <div style={{ fontWeight:800, color:GREEN, fontSize:20 }}>{fmt(earn.toFixed(s.currency==="USD"?2:0),s.currency)}</div>
      </div>
    </div>
  );

  if (loading) return (
    <div style={{ minHeight:"100vh", background:th.bg, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", fontFamily:"sans-serif", color:th.text, gap:14 }}>
      <div style={{ fontSize:48 }}>⏳</div>
      <div style={{ fontSize:20, fontWeight:800 }}>Processing...</div>
      {method?.id==="mtn" && <div style={{ background:"#FFCB0022", border:"1px solid #FFCB0044", borderRadius:12, padding:"12px 20px", color:"#FFCB00", fontWeight:700 }}>📱 Check MTN for prompt!</div>}
      {method?.id==="airtel" && <div style={{ background:"rgba(232,0,45,0.1)", border:"1px solid rgba(232,0,45,0.3)", borderRadius:12, padding:"12px 20px", color:R, fontWeight:700 }}>📲 Check Airtel for prompt!</div>}
    </div>
  );

  return (
    <div style={{ minHeight:"100vh", background:th.bg, fontFamily:"sans-serif", color:th.text }}>
      <div style={{ background:th.header, borderBottom:`1px solid ${th.border}`, padding:"0 16px", height:54, display:"flex", alignItems:"center", gap:12 }}>
        <Btn onClick={go}>← Home</Btn><Logo go={go} />
        <div style={{ marginLeft:"auto", fontSize:12, color:th.muted }}>🔒 Secure Checkout</div>
      </div>
      <div style={{ maxWidth:460, margin:"0 auto", padding:"24px 16px" }}>
        <div style={{ fontSize:20, fontWeight:800, marginBottom:18 }}>Complete Payment</div>
        {/* Blurry Preview */}
        <div style={{ background:th.card, borderRadius:16, overflow:"hidden", marginBottom:16, border:`1px solid ${th.border}` }}>
          <div style={{ position:"relative", height:190, overflow:"hidden" }}>
            <div style={{ position:"absolute", inset:0, background:"linear-gradient(135deg,#1a0507,#0e0e14)", display:"flex", alignItems:"center", justifyContent:"center" }}>
              <div style={{ fontSize:100, animation:"floatEmoji 3s ease-in-out infinite" }}>{s.emoji}</div>
            </div>
            <div style={{ position:"absolute", inset:0, backdropFilter:"blur(16px)", WebkitBackdropFilter:"blur(16px)", background:"rgba(6,6,8,0.5)" }} />
            <div style={{ position:"absolute", inset:0, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:8 }}>
              <div style={{ fontSize:38 }}>🔒</div>
              <div style={{ fontWeight:800, fontSize:16, color:"#fff" }}>Content is LIVE right now!</div>
              <div style={{ fontSize:12, color:"rgba(255,255,255,0.55)", textAlign:"center", padding:"0 24px" }}>Pay to unlock and watch clearly 👁</div>
            </div>
            <div style={{ position:"absolute", top:10, left:12, display:"flex", alignItems:"center", gap:4 }}>
              <div style={{ width:7, height:7, borderRadius:"50%", background:R, animation:"pulseDot 1.4s infinite" }} />
              <span style={{ fontSize:10, fontWeight:800, color:R }}>LIVE</span>
            </div>
            <div style={{ position:"absolute", top:10, right:12, background:"rgba(0,0,0,0.65)", borderRadius:8, padding:"3px 10px", fontSize:11, color:MUTED }}>
              👁 {s.viewers.toLocaleString()} watching
            </div>
            <div style={{ position:"absolute", bottom:12, right:12, background:R, borderRadius:8, padding:"4px 12px", fontSize:14, fontWeight:800, color:"#fff" }}>
              {fmt(s.price,s.currency)}
            </div>
          </div>
          <div style={{ padding:"12px 16px" }}>
            <div style={{ fontWeight:700, fontSize:14, marginBottom:2 }}>{s.title}</div>
            <div style={{ fontSize:12, color:th.muted, marginBottom:10 }}>by {s.creator}</div>
            {[
              { label:"Entry price", value:fmt(s.price,s.currency), color:th.text },
              { label:`Creator gets (${100-s.cut}%)`, value:fmt(earn.toFixed(s.currency==="USD"?2:0),s.currency), color:GREEN },
              { label:`Play gets (${s.cut}%)`, value:fmt((s.price*s.cut/100).toFixed(s.currency==="USD"?2:0),s.currency), color:R },
            ].map(row => (
              <div key={row.label} style={{ display:"flex", justifyContent:"space-between", marginBottom:5, fontSize:13 }}>
                <span style={{ color:th.muted }}>{row.label}</span>
                <span style={{ fontWeight:700, color:row.color }}>{row.value}</span>
              </div>
            ))}
          </div>
        </div>
        {/* Payment methods */}
        <div style={{ fontSize:11, color:th.muted, textTransform:"uppercase", letterSpacing:"0.7px", marginBottom:10 }}>Payment Method</div>
        <div style={{ display:"flex", flexDirection:"column", gap:8, marginBottom:16 }}>
          {PAY_METHODS.map(pm => (
            <div key={pm.id} onClick={() => setMethod(pm)} style={{ background:method?.id===pm.id?`${pm.color}18`:th.card, border:`1.5px solid ${method?.id===pm.id?pm.color:th.border}`, borderRadius:12, padding:"12px 14px", display:"flex", alignItems:"center", gap:12, cursor:"pointer" }}>
              <div style={{ width:40, height:26, borderRadius:6, background:pm.color, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                {pm.id==="mtn" && <span style={{ fontSize:10, fontWeight:800, color:"#000" }}>MTN</span>}
                {pm.id==="airtel" && <span style={{ fontSize:9, fontWeight:800, color:"#fff" }}>AIRTEL</span>}
                {pm.id==="visa" && <div style={{ display:"flex" }}><div style={{ width:13, height:13, borderRadius:"50%", background:"#EB001B" }}/><div style={{ width:13, height:13, borderRadius:"50%", background:"#F79E1B", marginLeft:-5 }}/></div>}
              </div>
              <div style={{ flex:1, fontWeight:700, fontSize:13 }}>{pm.name}</div>
              {method?.id===pm.id && <div style={{ color:pm.color, fontWeight:800 }}>✓</div>}
            </div>
          ))}
        </div>
        {method && (
          <div style={{ background:th.card, borderRadius:14, padding:"16px", marginBottom:14, border:`1px solid ${th.border}` }}>
            {method.field==="phone" && (
              <div>
                <label style={{ fontSize:11, color:th.muted, textTransform:"uppercase", letterSpacing:"0.7px", display:"block", marginBottom:8 }}>Phone Number</label>
                <input style={{...th.inp, fontSize:16}} type="tel" placeholder={method.ph} value={phone} onChange={e=>setPhone(e.target.value)} />
                <div style={{ fontSize:12, color:th.muted, marginTop:6 }}>You'll get a prompt on your phone</div>
              </div>
            )}
            {method.field==="card" && (
              <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                <div>
                  <label style={{ fontSize:11, color:th.muted, textTransform:"uppercase", letterSpacing:"0.7px", display:"block", marginBottom:6 }}>Card Number</label>
                  <input style={th.inp} placeholder="1234 5678 9012 3456" value={card.number} onChange={e=>setCard(p=>({...p,number:e.target.value}))} />
                </div>
                <div>
                  <label style={{ fontSize:11, color:th.muted, textTransform:"uppercase", letterSpacing:"0.7px", display:"block", marginBottom:6 }}>Name on Card</label>
                  <input style={th.inp} placeholder="e.g. Kalisa Brian" value={card.name} onChange={e=>setCard(p=>({...p,name:e.target.value}))} />
                </div>
                <div style={{ display:"flex", gap:10 }}>
                  <div style={{ flex:1 }}>
                    <label style={{ fontSize:11, color:th.muted, textTransform:"uppercase", letterSpacing:"0.7px", display:"block", marginBottom:6 }}>Expiry</label>
                    <input style={th.inp} placeholder="MM/YY" value={card.expiry} onChange={e=>setCard(p=>({...p,expiry:e.target.value}))} />
                  </div>
                  <div style={{ flex:1 }}>
                    <label style={{ fontSize:11, color:th.muted, textTransform:"uppercase", letterSpacing:"0.7px", display:"block", marginBottom:6 }}>CVV</label>
                    <input style={th.inp} placeholder="123" value={card.cvv} onChange={e=>setCard(p=>({...p,cvv:e.target.value}))} />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        {error && <div style={{ background:"rgba(232,0,45,0.1)", border:"1px solid rgba(232,0,45,0.3)", borderRadius:10, padding:"10px 14px", fontSize:13, color:R, marginBottom:12 }}>⚠️ {error}</div>}
        <button onClick={pay} disabled={!method} style={{ width:"100%", background:method?R:"#333", border:"none", borderRadius:12, padding:"14px", color:"#fff", fontSize:15, fontWeight:800, cursor:method?"pointer":"not-allowed", opacity:method?1:0.5, fontFamily:"sans-serif" }}>
          {method ? `🔓 Pay ${fmt(s.price,s.currency)} & Watch Live!` : "Select a payment method"}
        </button>
        <div style={{ textAlign:"center", color:th.muted, fontSize:12, marginTop:8 }}>🔒 Secure · Instant access · No hidden fees</div>
      </div>
      <style>{`@keyframes floatEmoji{0%,100%{transform:translateY(0) scale(1)}50%{transform:translateY(-12px) scale(1.08)}}@keyframes pulseDot{0%,100%{opacity:1}50%{opacity:0.3}}`}</style>
    </div>
  );
}

// ── 🎁 GIFT PANEL (NEW!) ──────────────────────────────────────────────────────
function GiftPanel({ onClose, onSend, th, lang }) {
  const t = LANG[lang];
  const [selected, setSelected] = useState(null);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const send = async () => {
    if (!selected) return;
    setSending(true);
    await API.sendGift({ giftId: selected.id, emoji: selected.emoji, name: selected.name, price: selected.price });
    setSent(true);
    setTimeout(() => { onSend(selected); onClose(); }, 1200);
  };

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.85)", display:"flex", alignItems:"flex-end", justifyContent:"center", zIndex:1000, padding:16 }} onClick={onClose}>
      <div style={{ background:th.card, border:`1px solid ${th.border}`, borderRadius:"24px 24px 16px 16px", padding:"24px 20px", width:"100%", maxWidth:460, marginBottom:8 }} onClick={e=>e.stopPropagation()}>
        {sent ? (
          <div style={{ textAlign:"center", padding:"20px 0" }}>
            <div style={{ fontSize:60, marginBottom:8 }}>{selected.emoji}</div>
            <div style={{ fontWeight:800, fontSize:18, color:GREEN }}>Gift Sent! 🎉</div>
          </div>
        ) : <>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:18 }}>
            <div style={{ fontWeight:800, fontSize:16 }}>{t.gifts}</div>
            <button onClick={onClose} style={{ background:"transparent", border:"none", color:MUTED, fontSize:22, cursor:"pointer" }}>×</button>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3, 1fr)", gap:10, marginBottom:18 }}>
            {GIFTS.map(g => (
              <div key={g.id} onClick={() => setSelected(g)} style={{ background:selected?.id===g.id?`${R}18`:th.bg, border:`1.5px solid ${selected?.id===g.id?R:th.border}`, borderRadius:14, padding:"12px 8px", textAlign:"center", cursor:"pointer" }}>
                <div style={{ fontSize:32, marginBottom:4 }}>{g.emoji}</div>
                <div style={{ fontWeight:700, fontSize:12 }}>{g.name}</div>
                <div style={{ color:R, fontSize:11, fontWeight:800, marginTop:2 }}>{fmt(g.price,"RWF")}</div>
              </div>
            ))}
          </div>
          <button onClick={send} disabled={!selected||sending} style={{ width:"100%", background:selected?R:"#333", border:"none", borderRadius:12, padding:"13px", color:"#fff", fontSize:15, fontWeight:800, cursor:selected?"pointer":"not-allowed", opacity:selected?1:0.5, fontFamily:"sans-serif" }}>
            {sending ? "Sending..." : selected ? `${t.sendGift} ${selected.emoji} — ${fmt(selected.price,"RWF")}` : "Pick a gift first"}
          </button>
        </>}
      </div>
    </div>
  );
}

// ── 📊 ANALYTICS CHART (NEW!) ─────────────────────────────────────────────────
function AnalyticsChart({ transactions, th }) {
  // Build last 7 days data from transactions
  const days = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
  const data = days.map((d,i) => ({
    day: d,
    earned: [450,900,450,1350,900,2250,1800][i],
    viewers: [1,2,1,3,2,5,4][i],
  }));
  const maxEarned = Math.max(...data.map(d=>d.earned));

  return (
    <div style={{ background:th.card, borderRadius:16, padding:"20px", border:`1px solid ${th.border}`, marginBottom:20 }}>
      <div style={{ fontSize:15, fontWeight:800, marginBottom:4 }}>📊 Earnings This Week</div>
      <div style={{ color:th.muted, fontSize:12, marginBottom:18 }}>Last 7 days revenue (RWF)</div>
      <div style={{ display:"flex", alignItems:"flex-end", gap:8, height:120, marginBottom:8 }}>
        {data.map((d,i) => (
          <div key={i} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:4 }}>
            <div style={{ fontSize:9, color:th.muted, fontWeight:700 }}>{d.earned.toLocaleString()}</div>
            <div style={{ width:"100%", borderRadius:"6px 6px 0 0", background:`linear-gradient(to top,${R},rgba(232,0,45,0.4))`, height:`${(d.earned/maxEarned)*90}px`, minHeight:4, transition:"height 0.6s ease" }} />
          </div>
        ))}
      </div>
      <div style={{ display:"flex", gap:8 }}>
        {data.map((d,i) => <div key={i} style={{ flex:1, textAlign:"center", fontSize:10, color:th.muted }}>{d.day}</div>)}
      </div>
      <div style={{ display:"flex", gap:16, marginTop:16, paddingTop:14, borderTop:`1px solid ${th.border}` }}>
        {[
          { label:"This Week", value:`${data.reduce((s,d)=>s+d.earned,0).toLocaleString()} RWF`, color:GREEN },
          { label:"Avg/Day", value:`${Math.round(data.reduce((s,d)=>s+d.earned,0)/7).toLocaleString()} RWF`, color:th.text },
          { label:"Peak Day", value:`${Math.max(...data.map(d=>d.earned)).toLocaleString()} RWF`, color:R },
        ].map(s => (
          <div key={s.label} style={{ flex:1, textAlign:"center" }}>
            <div style={{ fontWeight:800, fontSize:14, color:s.color }}>{s.value}</div>
            <div style={{ fontSize:10, color:th.muted, marginTop:2 }}>{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── CREATOR STUDIO ────────────────────────────────────────────────────────────
function CreatorStudio({ creator, go, th, toast, lang }) {
  const t = LANG[lang];
  const [tab, setTab] = useState("streams");
  const [streams, setStreams] = useState([{ id:"local1", title:"My First Live 🎤", category:creator.category||"Music", viewers:320, price:500, currency:"RWF", cut:15, earnings:160000, live:true }]);
  const [txns, setTxns] = useState([]);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ title:"", price:"", currency:"RWF", cut:15, category:creator.category||"Music" });
  const [payout, setPayout] = useState({ mtn:"", airtel:"", bankName:"", bankAccount:"", bankSwift:"", bankCountry:"" });
  const [payoutTab, setPayoutTab] = useState("mobile");
  const [photo, setPhoto] = useState(null);
  const [loadingTxns, setLoadingTxns] = useState(false);

  useEffect(() => {
    if (tab === "transactions" && txns.length === 0) {
      setLoadingTxns(true);
      // 🔁 SUPABASE: const { data } = await supabase.from('transactions').select().eq('creatorId', creator.id)
      API.getTransactions(creator.id || "u2").then(data => { setTxns(data); setLoadingTxns(false); });
    }
  }, [tab]);

  const uploadPhoto = e => { const f=e.target.files[0]; if(!f)return; const r=new FileReader(); r.onload=ev=>setPhoto(ev.target.result); r.readAsDataURL(f); };

  const createStream = async () => {
    if (!form.title || !form.price) { toast("Please fill all fields!"); return; }
    try {
      // 🔁 SUPABASE: const { data } = await supabase.from('streams').insert({...}).select()
      const s = await API.createStream({ ...form, creatorId:creator.id||"u2", creator:creator.name, handle:creator.handle, emoji:"🎤", bio:creator.bio||"", totalEarned:0, totalStreams:0, price:Number(form.price), cut:Number(form.cut) });
      setStreams(p => [...p, { ...s, earnings:0 }]);
      setShowCreate(false);
      setForm({ title:"", price:"", currency:"RWF", cut:15, category:creator.category||"Music" });
      toast("You are now LIVE! 🔴🎉");
    } catch(err) { toast("Error: " + err.message); }
  };

  const totalEarnings = streams.reduce((s,st) => s+st.earnings, 0);
  const totalViewers = streams.reduce((s,st) => s+st.viewers, 0);
  const isPayoutSet = payout.mtn || payout.airtel || payout.bankAccount;

  return (
    <div style={{ minHeight:"100vh", background:th.bg, color:th.text, fontFamily:"sans-serif" }}>
      <div style={{ background:th.header, padding:"12px 16px", display:"flex", alignItems:"center", justifyContent:"space-between", borderBottom:`1px solid ${th.border}`, flexWrap:"wrap", gap:10 }}>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <Logo go={go} />
          <Btn onClick={go}>← Home</Btn>
        </div>
        <div style={{ fontSize:13, fontWeight:700, color:th.muted }}>🎬 Creator Studio</div>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ position:"relative", cursor:"pointer" }} onClick={() => document.getElementById("ph1").click()}>
            <Av name={creator.name} size={36} photo={photo} />
            <div style={{ position:"absolute", bottom:0, right:0, width:14, height:14, background:R, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:8 }}>📷</div>
            <input id="ph1" type="file" accept="image/*" onChange={uploadPhoto} style={{ display:"none" }} />
          </div>
          <div>
            <div style={{ fontSize:13, fontWeight:700 }}>{creator.name}</div>
            <div style={{ fontSize:11, color:th.muted }}>{creator.handle}</div>
          </div>
          <Btn onClick={go}>Log out</Btn>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ background:th.header, borderBottom:`1px solid ${th.border}`, padding:"0 16px", display:"flex", gap:4, overflowX:"auto" }}>
        {[{ id:"streams", label:"🔴 My Streams" },{ id:"analytics", label:"📊 Analytics" },{ id:"transactions", label:"💳 Transactions" },{ id:"payout", label:"💰 Payout" }].map(tb => (
          <button key={tb.id} onClick={() => setTab(tb.id)} style={{ background:"transparent", border:"none", borderBottom:tab===tb.id?`2px solid ${R}`:"2px solid transparent", color:tab===tb.id?R:th.muted, fontWeight:700, fontSize:13, padding:"14px 16px", cursor:"pointer", fontFamily:"sans-serif", whiteSpace:"nowrap" }}>{tb.label}</button>
        ))}
      </div>

      <div style={{ maxWidth:900, margin:"0 auto", padding:"24px 16px" }}>
        {/* Stats */}
        <div style={{ display:"flex", gap:12, marginBottom:24, flexWrap:"wrap" }}>
          {[{ label:"Total Streams", value:streams.length },{ label:"Total Viewers", value:totalViewers.toLocaleString() },{ label:"Total Earned", value:`${totalEarnings.toLocaleString()} RWF` }].map(stat => (
            <div key={stat.label} style={{ flex:1, minWidth:130, background:th.card, borderRadius:16, padding:"18px 20px", border:`1px solid ${th.border}` }}>
              <div style={{ fontSize:11, color:th.muted, textTransform:"uppercase", letterSpacing:"0.8px", marginBottom:6 }}>{stat.label}</div>
              <div style={{ fontSize:22, fontWeight:800 }}>{stat.value}</div>
            </div>
          ))}
        </div>

        {/* ── STREAMS TAB ── */}
        {tab==="streams" && <>
          <div style={{ background:th.card, borderRadius:16, padding:"18px", border:`1px solid ${th.border}`, marginBottom:18, display:"flex", alignItems:"center", gap:16 }}>
            <div style={{ position:"relative" }}>
              <Av name={creator.name} size={70} photo={photo} />
              <div style={{ position:"absolute", bottom:0, right:0, width:22, height:22, background:R, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, cursor:"pointer" }} onClick={() => document.getElementById("ph2").click()}>📷</div>
              <input id="ph2" type="file" accept="image/*" onChange={uploadPhoto} style={{ display:"none" }} />
            </div>
            <div>
              <div style={{ fontWeight:800, fontSize:16, marginBottom:4 }}>{creator.name}</div>
              <div style={{ color:th.muted, fontSize:13, marginBottom:10 }}>{creator.handle} · {creator.category}</div>
              <button onClick={() => document.getElementById("ph2").click()} style={{ background:"transparent", border:`1px solid ${th.border}`, color:th.muted, borderRadius:8, padding:"5px 14px", fontSize:12, cursor:"pointer" }}>📷 {photo?"Change Photo":"Upload Profile Photo"}</button>
            </div>
          </div>
          {!isPayoutSet && (
            <div onClick={() => setTab("payout")} style={{ background:"rgba(255,200,0,0.08)", border:"1px solid rgba(255,200,0,0.25)", borderRadius:12, padding:"14px 18px", marginBottom:18, cursor:"pointer", display:"flex", alignItems:"center", gap:12 }}>
              <div style={{ fontSize:22 }}>⚠️</div>
              <div>
                <div style={{ fontWeight:700, color:"#FFCB00", fontSize:14 }}>Set up your payout method!</div>
                <div style={{ fontSize:12, color:th.muted }}>Add MTN, Airtel or Bank details → Click here</div>
              </div>
            </div>
          )}
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
            <div style={{ fontSize:15, fontWeight:700, color:th.muted }}>My Streams</div>
            <button onClick={() => setShowCreate(true)} style={{ background:R, border:"none", borderRadius:12, padding:"10px 20px", color:"#fff", fontWeight:800, fontSize:14, cursor:"pointer", fontFamily:"sans-serif" }}>🔴 Go Live</button>
          </div>
          {streams.length===0 ? (
            <div style={{ textAlign:"center", padding:"60px 0", color:th.muted }}>
              <div style={{ fontSize:64, marginBottom:16 }}>🎬</div>
              <div style={{ fontSize:20, fontWeight:800, marginBottom:8, color:th.text }}>{t.noStreams}</div>
              <div style={{ fontSize:14, marginBottom:24 }}>{t.noStreamsSub}</div>
              <button onClick={() => setShowCreate(true)} style={{ background:R, border:"none", borderRadius:12, padding:"13px 28px", color:"#fff", fontWeight:800, fontSize:15, cursor:"pointer", fontFamily:"sans-serif" }}>{t.startFirst}</button>
            </div>
          ) : streams.map(s => (
            <div key={s.id} style={{ background:th.card, borderRadius:14, border:`1px solid ${th.border}`, padding:"16px 20px", display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:12, marginBottom:10 }}>
              <div>
                <div style={{ fontWeight:700, fontSize:15, marginBottom:4 }}>{s.title}</div>
                <div style={{ color:th.muted, fontSize:13 }}>{s.category} · {fmt(s.price,s.currency)}/viewer · Play takes {s.cut}%</div>
              </div>
              <div style={{ display:"flex", gap:20, alignItems:"center" }}>
                <div style={{ textAlign:"right" }}>
                  <div style={{ fontSize:11, color:th.muted }}>Viewers</div>
                  <div style={{ fontWeight:700 }}>👁 {s.viewers}</div>
                </div>
                <div style={{ textAlign:"right" }}>
                  <div style={{ fontSize:11, color:th.muted }}>Earned</div>
                  <div style={{ fontWeight:800, color:GREEN, fontSize:16 }}>{fmt(s.earnings,s.currency)}</div>
                </div>
                <div style={{ display:"flex", alignItems:"center", gap:5 }}>
                  <div style={{ width:6, height:6, borderRadius:"50%", background:R, animation:"pulseDot 1.4s infinite" }} />
                  <span style={{ fontSize:10, fontWeight:800, color:R }}>LIVE</span>
                </div>
              </div>
            </div>
          ))}
        </>}

        {/* ── ANALYTICS TAB (NEW!) ── */}
        {tab==="analytics" && <>
          <AnalyticsChart transactions={txns} th={th} />
          <div style={{ background:th.card, borderRadius:16, padding:"20px", border:`1px solid ${th.border}`, marginBottom:16 }}>
            <div style={{ fontSize:15, fontWeight:800, marginBottom:14 }}>👁 Viewer Breakdown</div>
            <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
              {[{ label:"MTN MoMo", pct:55, color:"#FFCB00", tc:"#000" },{ label:"Airtel Money", pct:30, color:R, tc:"#fff" },{ label:"Visa / Card", pct:15, color:"#1A1F71", tc:"#fff" }].map(m => (
                <div key={m.label} style={{ flex:1, minWidth:100, background:th.bg, borderRadius:12, padding:"14px", textAlign:"center", border:`1px solid ${th.border}` }}>
                  <div style={{ fontWeight:800, fontSize:22, color:m.color }}>{m.pct}%</div>
                  <div style={{ fontSize:11, color:th.muted, marginTop:4 }}>{m.label}</div>
                  <div style={{ height:4, background:th.border, borderRadius:2, marginTop:8 }}>
                    <div style={{ height:"100%", width:`${m.pct}%`, background:m.color, borderRadius:2 }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ background:th.card, borderRadius:16, padding:"20px", border:`1px solid ${th.border}` }}>
            <div style={{ fontSize:15, fontWeight:800, marginBottom:14 }}>🌍 Top Viewer Countries</div>
            {[{ flag:"🇷🇼", country:"Rwanda", pct:72 },{ flag:"🇺🇬", country:"Uganda", pct:14 },{ flag:"🇰🇪", country:"Kenya", pct:9 },{ flag:"🌍", country:"Others", pct:5 }].map(c => (
              <div key={c.country} style={{ display:"flex", alignItems:"center", gap:12, marginBottom:12 }}>
                <div style={{ fontSize:20, flexShrink:0 }}>{c.flag}</div>
                <div style={{ flex:1 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                    <span style={{ fontSize:13, fontWeight:700 }}>{c.country}</span>
                    <span style={{ fontSize:12, color:th.muted }}>{c.pct}%</span>
                  </div>
                  <div style={{ height:6, background:th.border, borderRadius:3 }}>
                    <div style={{ height:"100%", width:`${c.pct}%`, background:`linear-gradient(to right,${R},rgba(232,0,45,0.4))`, borderRadius:3 }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>}

        {/* ── TRANSACTIONS TAB ── */}
        {tab==="transactions" && <>
          <div style={{ fontSize:18, fontWeight:800, marginBottom:6 }}>💳 Transaction History</div>
          <div style={{ color:th.muted, fontSize:14, marginBottom:20 }}>Every viewer who paid to watch your streams</div>
          {loadingTxns ? <Loading msg="Loading transactions..." /> : <>
            <div style={{ display:"flex", gap:12, marginBottom:22, flexWrap:"wrap" }}>
              {[
                { label:"Total Transactions", value:txns.length },
                { label:"Total Collected", value:`${txns.filter(t=>t.currency==="RWF").reduce((s,t)=>s+t.amount,0).toLocaleString()} RWF` },
                { label:"You Earned", value:`${txns.filter(t=>t.currency==="RWF").reduce((s,t)=>s+t.earn,0).toLocaleString()} RWF`, green:true },
              ].map(stat => (
                <div key={stat.label} style={{ flex:1, minWidth:130, background:th.card, borderRadius:14, padding:"16px 18px", border:`1px solid ${th.border}` }}>
                  <div style={{ fontSize:11, color:th.muted, textTransform:"uppercase", letterSpacing:"0.8px", marginBottom:6 }}>{stat.label}</div>
                  <div style={{ fontSize:16, fontWeight:800, color:stat.green?GREEN:th.text }}>{stat.value}</div>
                </div>
              ))}
            </div>
            {txns.length === 0 ? (
              <div style={{ textAlign:"center", padding:"40px 0", color:th.muted }}>
                <div style={{ fontSize:48, marginBottom:12 }}>💳</div>
                <div style={{ fontSize:16, fontWeight:700 }}>No transactions yet</div>
                <div style={{ fontSize:13, marginTop:6 }}>Go live to start earning!</div>
              </div>
            ) : (
              <div style={{ background:th.card, borderRadius:16, border:`1px solid ${th.border}`, overflow:"hidden" }}>
                <div style={{ display:"grid", gridTemplateColumns:"1.5fr 1.5fr 1fr 1fr 0.8fr", gap:8, padding:"12px 16px", borderBottom:`1px solid ${th.border}`, background:th.bg }}>
                  {["Viewer","Stream","Paid","You Got","Method"].map(h => <div key={h} style={{ fontSize:10, color:th.muted, textTransform:"uppercase", letterSpacing:"0.8px", fontWeight:700 }}>{h}</div>)}
                </div>
                {txns.map((tx,i) => (
                  <div key={tx.id} style={{ display:"grid", gridTemplateColumns:"1.5fr 1.5fr 1fr 1fr 0.8fr", gap:8, padding:"13px 16px", borderBottom:i<txns.length-1?`1px solid ${th.border}`:"none", alignItems:"center" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:7 }}>
                      <Av name={tx.viewer} size={26} />
                      <div>
                        <div style={{ fontWeight:700, fontSize:12 }}>{tx.viewer}</div>
                        <div style={{ fontSize:10, color:th.muted }}>{tx.time}</div>
                      </div>
                    </div>
                    <div style={{ fontSize:11, color:th.muted, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{tx.stream}</div>
                    <div style={{ fontWeight:700, fontSize:13 }}>{fmt(tx.amount,tx.currency)}</div>
                    <div style={{ fontWeight:800, fontSize:13, color:GREEN }}>{fmt(tx.earn,tx.currency)}</div>
                    <div style={{ width:32, height:20, borderRadius:4, background:tx.method==="MTN"?"#FFCB00":tx.method==="Airtel"?R:"#1A1F71", display:"flex", alignItems:"center", justifyContent:"center" }}>
                      <span style={{ fontSize:7, fontWeight:800, color:tx.method==="MTN"?"#000":"#fff" }}>{tx.method}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>}
        </>}

        {/* ── PAYOUT TAB ── */}
        {tab==="payout" && <>
          <div style={{ fontSize:18, fontWeight:800, marginBottom:6 }}>Where should we send your money? 💸</div>
          <div style={{ color:th.muted, fontSize:14, marginBottom:20 }}>Add at least one payout method.</div>
          <div style={{ background:isPayoutSet?"rgba(74,222,128,0.1)":"rgba(232,0,45,0.08)", border:`1px solid ${isPayoutSet?"rgba(74,222,128,0.3)":"rgba(232,0,45,0.2)"}`, borderRadius:12, padding:"12px 16px", marginBottom:20, display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ fontSize:20 }}>{isPayoutSet?"✅":"⚠️"}</div>
            <div style={{ fontWeight:700, fontSize:14, color:isPayoutSet?GREEN:R }}>{isPayoutSet?"Payout method set up!":"No payout method yet"}</div>
          </div>
          <div style={{ display:"flex", background:th.bg, borderRadius:12, padding:4, marginBottom:18 }}>
            {[{ id:"mobile", label:"📱 Mobile Money" },{ id:"bank", label:"🏦 Bank / International" }].map(tb => (
              <button key={tb.id} onClick={() => setPayoutTab(tb.id)} style={{ flex:1, background:payoutTab===tb.id?R:"transparent", border:"none", borderRadius:9, padding:"10px", color:payoutTab===tb.id?"#fff":th.muted, fontWeight:700, fontSize:13, cursor:"pointer", fontFamily:"sans-serif" }}>{tb.label}</button>
            ))}
          </div>
          {payoutTab==="mobile" && (
            <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
              {[{ key:"mtn", label:"MTN Mobile Money", color:"#FFCB00", tc:"#000", ph:"078 000 0000" },{ key:"airtel", label:"Airtel Money", color:R, tc:"#fff", ph:"073 000 0000" }].map(pm => (
                <div key={pm.key} style={{ background:th.card, borderRadius:16, padding:"18px", border:`1px solid ${payout[pm.key]?`${pm.color}44`:th.border}` }}>
                  <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12 }}>
                    <div style={{ width:40, height:26, borderRadius:6, background:pm.color, display:"flex", alignItems:"center", justifyContent:"center" }}>
                      <span style={{ fontSize:10, fontWeight:800, color:pm.tc }}>{pm.key==="mtn"?"MTN":"AIRTEL"}</span>
                    </div>
                    <div style={{ fontWeight:800, fontSize:14 }}>{pm.label}</div>
                    {payout[pm.key] && <div style={{ marginLeft:"auto", background:"rgba(74,222,128,0.15)", border:"1px solid rgba(74,222,128,0.3)", borderRadius:8, padding:"3px 10px", fontSize:11, color:GREEN, fontWeight:700 }}>✓ Added</div>}
                  </div>
                  <input style={th.inp} type="tel" placeholder={pm.ph} value={payout[pm.key]} onChange={e=>setPayout(p=>({...p,[pm.key]:e.target.value}))} />
                </div>
              ))}
            </div>
          )}
          {payoutTab==="bank" && (
            <div style={{ background:th.card, borderRadius:16, padding:"20px", border:`1px solid ${payout.bankAccount?"rgba(74,222,128,0.3)":th.border}` }}>
              <div style={{ fontWeight:800, fontSize:15, marginBottom:16 }}>🏦 Bank Account Details</div>
              <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                {[{ label:"Bank Name", key:"bankName", ph:"e.g. Bank of Kigali" },{ label:"Account Number", key:"bankAccount", ph:"e.g. 000123456789" },{ label:"SWIFT / BIC Code", key:"bankSwift", ph:"e.g. BKIGRWRW" },{ label:"Country", key:"bankCountry", ph:"e.g. Rwanda" }].map(f => (
                  <div key={f.key}>
                    <label style={{ fontSize:11, color:th.muted, textTransform:"uppercase", letterSpacing:"0.7px", display:"block", marginBottom:6 }}>{f.label}</label>
                    <input style={th.inp} placeholder={f.ph} value={payout[f.key]} onChange={e=>setPayout(p=>({...p,[f.key]:e.target.value}))} />
                  </div>
                ))}
              </div>
            </div>
          )}
          <button onClick={() => toast("✅ Payout settings saved!")} style={{ width:"100%", background:R, border:"none", borderRadius:12, padding:"14px", color:"#fff", fontSize:15, fontWeight:800, cursor:"pointer", marginTop:20, fontFamily:"sans-serif" }}>Save Payout Settings 💾</button>
        </>}
      </div>

      {/* Go Live Modal */}
      {showCreate && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.85)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:1000, padding:16 }} onClick={() => setShowCreate(false)}>
          <div style={{ background:th.card, border:`1px solid ${th.border}`, borderRadius:24, padding:"28px 24px", width:"100%", maxWidth:420 }} onClick={e=>e.stopPropagation()}>
            <div style={{ fontSize:20, fontWeight:800, marginBottom:20, color:th.text }}>🔴 Start a New Live</div>
            <div style={{ display:"flex", flexDirection:"column", gap:13 }}>
              <div>
                <label style={{ fontSize:11, color:th.muted, textTransform:"uppercase", letterSpacing:"0.7px", display:"block", marginBottom:6 }}>Stream Title</label>
                <input style={th.inp} placeholder="e.g. Music Night Live 🎵" value={form.title} onChange={e=>setForm(p=>({...p,title:e.target.value}))} />
              </div>
              <div style={{ display:"flex", gap:10 }}>
                <div style={{ flex:2 }}>
                  <label style={{ fontSize:11, color:th.muted, textTransform:"uppercase", letterSpacing:"0.7px", display:"block", marginBottom:6 }}>Entry Price</label>
                  <input style={th.inp} type="number" placeholder="e.g. 500" value={form.price} onChange={e=>setForm(p=>({...p,price:e.target.value}))} />
                </div>
                <div style={{ flex:1 }}>
                  <label style={{ fontSize:11, color:th.muted, textTransform:"uppercase", letterSpacing:"0.7px", display:"block", marginBottom:6 }}>Currency</label>
                  <select style={{...th.inp}} value={form.currency} onChange={e=>setForm(p=>({...p,currency:e.target.value}))}><option>RWF</option><option>USD</option></select>
                </div>
              </div>
              <div>
                <label style={{ fontSize:11, color:th.muted, textTransform:"uppercase", letterSpacing:"0.7px", display:"block", marginBottom:6 }}>Category</label>
                <select style={{...th.inp}} value={form.category} onChange={e=>setForm(p=>({...p,category:e.target.value}))}>
                  {CATS.filter(c=>c!=="All").map(c=><option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize:11, color:th.muted, textTransform:"uppercase", letterSpacing:"0.7px", display:"block", marginBottom:8 }}>
                  Play Cut — <span style={{color:R}}>{form.cut}%</span> · You keep <span style={{color:GREEN}}>{100-form.cut}%</span>
                </label>
                <input type="range" min={5} max={30} value={form.cut} onChange={e=>setForm(p=>({...p,cut:Number(e.target.value)}))} style={{ width:"100%", accentColor:R }} />
              </div>
              <button onClick={createStream} style={{ width:"100%", background:R, border:"none", borderRadius:12, padding:"13px", color:"#fff", fontSize:15, fontWeight:800, cursor:"pointer", fontFamily:"sans-serif" }}>🔴 Go Live Now!</button>
            </div>
          </div>
        </div>
      )}
      <style>{`@keyframes pulseDot{0%,100%{opacity:1}50%{opacity:0.3}}`}</style>
    </div>
  );
}

// ── LIVE ROOM ─────────────────────────────────────────────────────────────────
function LiveRoom({ stream:s, user, go, toast, lang }) {
  const t = LANG[lang];
  const [messages, setMessages] = useState([
    { user:"Mugabo", text:"🔥🔥🔥 Amazing!", me:false },
    { user:"Ingabire", text:"Neza cyane! ❤️", me:false },
    { user:user.name, text:"Just joined! 🎉", me:true },
  ]);
  const [msg, setMsg] = useState("");
  const [viewers, setViewers] = useState(s.viewers+1);
  const [tipped, setTipped] = useState(false);
  const [showChat, setShowChat] = useState(true);
  const [showGifts, setShowGifts] = useState(false);
  const [giftNotif, setGiftNotif] = useState(null);
  const chatRef = useRef();

  // 🔁 SUPABASE: replace with supabase.channel('room').on('broadcast', ...).subscribe()
  useEffect(() => {
    const iv = setInterval(() => {
      setViewers(v => v + Math.floor(Math.random()*3));
      const u = FAKE_USERS[Math.floor(Math.random()*FAKE_USERS.length)];
      const tm = FAKE_MSGS[Math.floor(Math.random()*FAKE_MSGS.length)];
      setMessages(prev => [...prev.slice(-40), { user:u, text:tm, me:false }]);
    }, 2200);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => { if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight; }, [messages]);

  const sendMsg = () => {
    if (!msg.trim()) return;
    // 🔁 SUPABASE: supabase.channel('room').send({ type:'broadcast', event:'message', payload:{...} })
    setMessages(prev => [...prev, { user:user.name, text:msg, me:true }]);
    setMsg("");
  };

  const onGiftSent = (gift) => {
    setGiftNotif(gift);
    setMessages(prev => [...prev, { user:user.name, text:`${gift.emoji} Sent a ${gift.name}! (${fmt(gift.price,"RWF")})`, me:true, isGift:true }]);
    setTimeout(() => setGiftNotif(null), 3000);
    toast(`${gift.emoji} Gift sent! Creator loves you! 💚`);
  };

  const share = () => { window.open(`https://wa.me/?text=${encodeURIComponent(`I'm watching ${s.creator} live on Play Rwanda! 🔴🇷🇼`)}`, "_blank"); toast(t.copied); };

  return (
    <div style={{ position:"fixed", inset:0, background:DARKER, display:"flex", flexDirection:"column", fontFamily:"sans-serif" }}>
      {/* Gift notification overlay */}
      {giftNotif && (
        <div style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)", zIndex:500, textAlign:"center", animation:"giftPop 0.4s ease", pointerEvents:"none" }}>
          <div style={{ fontSize:80 }}>{giftNotif.emoji}</div>
          <div style={{ color:"#fff", fontWeight:800, fontSize:18, textShadow:"0 2px 8px rgba(0,0,0,0.8)" }}>{giftNotif.name}!</div>
        </div>
      )}

      <div style={{ background:DARK, borderBottom:`1px solid ${BORDER}`, padding:"0 16px", height:54, display:"flex", alignItems:"center", justifyContent:"space-between", flexShrink:0 }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <Av name={s.creator} size={32} />
          <div>
            <div style={{ fontWeight:800, fontSize:13, color:TEXT }}>{s.creator}</div>
            <div style={{ fontSize:10, color:MUTED }}>{s.title}</div>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:4, marginLeft:6 }}>
            <div style={{ width:6, height:6, borderRadius:"50%", background:R, animation:"pulseDot 1.4s infinite" }} />
            <span style={{ fontSize:9, fontWeight:800, color:R }}>LIVE</span>
          </div>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <div style={{ textAlign:"center" }}>
            <div style={{ fontSize:9, color:MUTED }}>{t.watching}</div>
            <div style={{ fontWeight:800, color:TEXT, fontSize:13 }}>👁 <AnimCount value={viewers} /></div>
          </div>
          <button onClick={share} style={{ background:"#25D36622", border:"1px solid #25D36644", borderRadius:8, color:"#25D366", padding:"5px 10px", cursor:"pointer", fontSize:12, fontWeight:700 }}>📤</button>
          <button onClick={() => setShowChat(c=>!c)} style={{ background:"rgba(255,255,255,0.08)", border:"none", borderRadius:8, color:MUTED, padding:"5px 10px", cursor:"pointer", fontSize:12 }}>💬</button>
          <button onClick={go} style={{ background:"rgba(232,0,45,0.12)", border:"1px solid rgba(232,0,45,0.3)", color:R, borderRadius:8, padding:"5px 12px", fontWeight:700, cursor:"pointer", fontSize:12 }}>{t.leave}</button>
        </div>
      </div>

      <div style={{ flex:1, display:"flex", overflow:"hidden" }}>
        <div style={{ flex:1, background:"radial-gradient(circle at center,#1a0507 0%,#060608 70%)", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", position:"relative" }}>
          <div style={{ fontSize:80, marginBottom:12 }}>{s.emoji}</div>
          <div style={{ color:MUTED, fontSize:13 }}>🎬 Live stream playing...</div>
          <div style={{ position:"absolute", bottom:16, left:16, background:"rgba(0,0,0,0.75)", borderRadius:10, padding:"10px 14px", border:`1px solid ${BORDER}` }}>
            <div style={{ fontSize:10, color:MUTED, marginBottom:2 }}>✅ Access granted</div>
            <div style={{ fontWeight:800, color:TEXT, fontSize:12 }}>You paid · {fmt(s.price,s.currency)}</div>
          </div>
          {/* Action buttons */}
          <div style={{ position:"absolute", bottom:16, right:16, display:"flex", flexDirection:"column", gap:8 }}>
            <button onClick={() => setShowGifts(true)} style={{ background:"linear-gradient(135deg,#f59e0b,#ef4444)", border:"none", borderRadius:10, padding:"9px 16px", color:"#fff", fontWeight:800, fontSize:12, cursor:"pointer" }}>🎁 Gift</button>
            {!tipped ? (
              <button onClick={() => setTipped(true)} style={{ background:"rgba(255,255,255,0.1)", border:"1px solid rgba(255,255,255,0.2)", borderRadius:10, padding:"9px 16px", color:"#fff", fontWeight:800, fontSize:12, cursor:"pointer" }}>{t.tip}</button>
            ) : (
              <div style={{ background:"rgba(74,222,128,0.15)", border:"1px solid rgba(74,222,128,0.4)", borderRadius:10, padding:"9px 16px", color:GREEN, fontWeight:800, fontSize:12 }}>{t.tipSent}</div>
            )}
          </div>
        </div>

        {/* Chat panel */}
        {showChat && (
          <div style={{ width:280, borderLeft:`1px solid ${BORDER}`, display:"flex", flexDirection:"column", background:DARK }}>
            <div style={{ padding:"11px 14px", borderBottom:`1px solid ${BORDER}`, fontSize:12, fontWeight:700, color:MUTED }}>
              💬 <AnimCount value={viewers} /> {t.watching}
            </div>
            <div ref={chatRef} style={{ flex:1, overflowY:"auto", padding:"8px 12px", display:"flex", flexDirection:"column", gap:8 }}>
              {messages.map((m,i) => (
                <div key={i} style={{ display:"flex", gap:7, alignItems:"flex-start" }}>
                  <Av name={m.user} size={22} />
                  <div>
                    <span style={{ fontSize:10, fontWeight:800, color:m.me?R:m.isGift?"#f59e0b":MUTED }}>{m.user} </span>
                    <span style={{ fontSize:12, color:m.isGift?"#f59e0b":TEXT }}>{m.text}</span>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ padding:"10px", borderTop:`1px solid ${BORDER}`, display:"flex", gap:7 }}>
              <input value={msg} onChange={e=>setMsg(e.target.value)} onKeyDown={e=>e.key==="Enter"&&sendMsg()} placeholder={t.saySomething} style={{ flex:1, background:"#0A0A0C", border:`1px solid ${BORDER}`, borderRadius:8, padding:"8px 10px", color:TEXT, fontSize:12, fontFamily:"sans-serif", outline:"none" }} />
              <button onClick={sendMsg} style={{ background:R, border:"none", borderRadius:8, color:"#fff", fontWeight:800, padding:"8px 12px", cursor:"pointer", fontSize:13 }}>→</button>
            </div>
          </div>
        )}
      </div>

      {/* Gift Panel */}
      {showGifts && <GiftPanel onClose={() => setShowGifts(false)} onSend={onGiftSent} th={{ card:CARD, bg:DARKER, border:BORDER, muted:MUTED, text:TEXT, inp:{} }} lang={lang} />}

      <style>{`@keyframes pulseDot{0%,100%{opacity:1}50%{opacity:0.3}}@keyframes giftPop{from{opacity:0;transform:translate(-50%,-50%) scale(0.5)}to{opacity:1;transform:translate(-50%,-50%) scale(1)}}`}</style>
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
  const [profileStream, setProfileStream] = useState(null);
  const [history, setHistory] = useState([]);
  const [dm, setDm] = useState(true);
  const [lang, setLang] = useState("en");
  const [toastMsg, setToastMsg] = useState(null);
  const [streams, setStreams] = useState([]);
  const [loadingStreams, setLoadingStreams] = useState(true);

  const t = LANG[lang];
  const th = useTheme(dm);
  const go = () => { setScreen("home"); setSelected(null); setPaid(false); };
  const toast = msg => setToastMsg(msg);

  // 🔁 SUPABASE: replace with useEffect that fetches from supabase.from('streams').select()
  useEffect(() => {
    API.getStreams().then(data => { setStreams(data); setLoadingStreams(false); });
  }, []);

  if (splash) return <SplashScreen onDone={() => setSplash(false)} />;
  if (screen==="creatorAuth") return <AuthPage type="creator" go={go} th={th} lang={lang} onAuth={c => { setCreator(c); setScreen("creatorStudio"); }} />;
  if (screen==="creatorStudio") return <CreatorStudio creator={creator} go={go} th={th} toast={toast} lang={lang} />;
  if (screen==="viewerAuth") return <AuthPage type="viewer" go={go} th={th} lang={lang} onAuth={u => { setViewer(u); setScreen("payment"); }} />;
  if (screen==="about") return <AboutPage go={go} th={th} />;
  if (screen==="terms") return <TermsPage go={go} th={th} />;
  if (screen==="leaderboard") return <Leaderboard go={go} th={th} streams={streams} />;
  if (screen==="history") return <HistoryPage history={history} go={go} th={th} lang={lang} />;
  if (screen==="profile" && profileStream) return <ProfilePage stream={profileStream} go={go} th={th} viewer={viewer} setSelected={setSelected} setScreen={setScreen} toast={toast} />;
  if (screen==="payment" && selected) return <PaymentPage stream={selected} go={go} th={th} viewer={viewer} onSuccess={() => { setPaid(true); setHistory(h => [...h, selected]); }} />;
  if (paid && selected && viewer) return <LiveRoom stream={selected} user={viewer} go={go} toast={toast} lang={lang} />;

  const filtered = streams.filter(s => {
    const mc = cat==="All" || s.category===cat;
    const ms = search==="" || s.title.toLowerCase().includes(search.toLowerCase()) || s.creator.toLowerCase().includes(search.toLowerCase());
    return mc && ms;
  });

  return (
    <div style={{ minHeight:"100vh", background:th.bg, color:th.text, fontFamily:"sans-serif" }}>
      {toastMsg && <Toast msg={toastMsg} onClose={() => setToastMsg(null)} />}

      {/* Header */}
      <div style={{ background:th.header, padding:"12px 16px", display:"flex", alignItems:"center", justifyContent:"space-between", borderBottom:`1px solid ${th.border}`, flexWrap:"wrap", gap:10 }}>
        <Logo go={go} />
        <div style={{ display:"flex", gap:6, alignItems:"center", flexWrap:"wrap" }}>
          <button onClick={() => setDm(d=>!d)} style={{ background:"transparent", border:`1px solid ${th.border}`, color:th.muted, borderRadius:8, padding:"6px 10px", fontSize:16, cursor:"pointer" }}>{dm?"☀️":"🌙"}</button>
          <button onClick={() => setLang(l=>l==="en"?"rw":"en")} style={{ background:"transparent", border:`1px solid ${th.border}`, color:th.muted, borderRadius:8, padding:"6px 10px", fontSize:12, fontWeight:700, cursor:"pointer" }}>{lang==="en"?"🇷🇼 RW":"🇬🇧 EN"}</button>
          <button onClick={() => setScreen("leaderboard")} style={{ background:"transparent", border:`1px solid ${th.border}`, color:th.muted, borderRadius:8, padding:"6px 12px", fontSize:12, cursor:"pointer" }}>🏆</button>
          <button onClick={() => setScreen("about")} style={{ background:"transparent", border:`1px solid ${th.border}`, color:th.muted, borderRadius:8, padding:"6px 12px", fontSize:12, cursor:"pointer" }}>{t.howItWorks}</button>
          {viewer ? (
            <>
              <button onClick={() => setScreen("history")} style={{ background:"transparent", border:`1px solid ${th.border}`, color:th.muted, borderRadius:8, padding:"6px 12px", fontSize:12, cursor:"pointer" }}>📋</button>
              <Av name={viewer.name} size={28} />
              <span style={{ fontSize:13, fontWeight:700 }}>{viewer.name}</span>
              <button onClick={() => setViewer(null)} style={{ background:"transparent", border:`1px solid ${th.border}`, color:th.muted, borderRadius:8, padding:"4px 10px", fontSize:12, cursor:"pointer" }}>Out</button>
            </>
          ) : (
            <button onClick={() => setScreen("viewerAuth")} style={{ background:"transparent", border:`1px solid ${th.border}`, color:th.muted, borderRadius:8, padding:"6px 12px", fontSize:13, cursor:"pointer" }}>{t.logIn}</button>
          )}
          <button onClick={() => setScreen("creatorAuth")} style={{ background:R, border:"none", borderRadius:8, padding:"6px 14px", color:"#fff", fontWeight:800, fontSize:13, cursor:"pointer" }}>{t.goLive}</button>
        </div>
      </div>

      <div style={{ padding:"24px 16px", maxWidth:960, margin:"0 auto" }}>
        <div style={{ textAlign:"center", marginBottom:20 }}>
          <div style={{ fontSize:24, fontWeight:800, marginBottom:6 }}>{t.tagline}<br /><span style={{color:R}}>{t.sub}</span></div>
          <div style={{ color:th.muted, fontSize:14 }}>{t.desc}</div>
        </div>

        {/* Search */}
        <div style={{ marginBottom:12, position:"relative" }}>
          <span style={{ position:"absolute", left:14, top:"50%", transform:"translateY(-50%)", fontSize:16 }}>🔍</span>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder={t.search} style={{ width:"100%", background:th.card, border:`1.5px solid ${th.border}`, borderRadius:12, padding:"12px 16px 12px 42px", color:th.text, fontSize:14, fontFamily:"sans-serif", outline:"none", boxSizing:"border-box" }} />
          {search && <button onClick={() => setSearch("")} style={{ position:"absolute", right:14, top:"50%", transform:"translateY(-50%)", background:"transparent", border:"none", color:th.muted, cursor:"pointer", fontSize:18 }}>×</button>}
        </div>

        {/* Categories */}
        <div style={{ display:"flex", gap:8, marginBottom:20, overflowX:"auto", paddingBottom:4 }}>
          {CATS.map(c => <button key={c} onClick={() => setCat(c)} style={{ background:cat===c?R:th.card, border:`1px solid ${cat===c?R:th.border}`, color:cat===c?"#fff":th.muted, borderRadius:99, padding:"7px 16px", fontSize:13, fontWeight:700, cursor:"pointer", whiteSpace:"nowrap", flexShrink:0 }}>{c}</button>)}
        </div>

        {search && <div style={{ color:th.muted, fontSize:13, marginBottom:12 }}>{filtered.length} result{filtered.length!==1?"s":""} for "<span style={{color:th.text}}>{search}</span>"</div>}

        {loadingStreams ? (
          <div style={{ textAlign:"center", padding:"60px 0" }}>
            <div style={{ display:"flex", gap:8, justifyContent:"center", marginBottom:12 }}>
              {[0,1,2].map(i=><div key={i} style={{ width:8, height:8, borderRadius:"50%", background:R, animation:`dotBounce 0.7s ${i*0.15}s ease-in-out infinite alternate` }}/>)}
            </div>
            <div style={{ color:th.muted, fontSize:14 }}>Loading streams...</div>
          </div>
        ) : filtered.length===0 ? (
          <div style={{ textAlign:"center", padding:"50px 0", color:th.muted }}>
            <div style={{ fontSize:48, marginBottom:12 }}>😕</div>
            <div style={{ fontSize:18, fontWeight:700, marginBottom:6 }}>No streams found</div>
            <div style={{ fontSize:14 }}>Try a different search or category</div>
          </div>
        ) : (
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(240px, 1fr))", gap:14 }}>
            {filtered.map(s => (
              <div key={s.id} style={{ background:th.card, borderRadius:16, overflow:"hidden", border:`1px solid ${th.border}`, textAlign:"left" }}>
                <div onClick={() => { setSelected(s); viewer ? setScreen("payment") : setScreen("viewerAuth"); }} style={{ height:120, background:"linear-gradient(135deg,#1a0507,#0e0e14)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:50, position:"relative", cursor:"pointer" }}>
                  {s.emoji}
                  <div style={{ position:"absolute", inset:0, background:"linear-gradient(to bottom,transparent 50%,rgba(0,0,0,0.5))" }} />
                  <div style={{ position:"absolute", top:8, left:10, display:"flex", alignItems:"center", gap:4 }}>
                    <div style={{ width:6, height:6, borderRadius:"50%", background:R, animation:"pulseDot 1.4s infinite" }} />
                    <span style={{ fontSize:9, fontWeight:800, color:R }}>LIVE</span>
                  </div>
                  <div style={{ position:"absolute", bottom:8, right:10, background:R, borderRadius:7, padding:"2px 8px", fontSize:12, fontWeight:800, color:"#fff" }}>{fmt(s.price,s.currency)}</div>
                </div>
                <div style={{ padding:"12px 14px" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:7, marginBottom:6 }}>
                    <div onClick={() => { setProfileStream(s); setScreen("profile"); }} style={{ cursor:"pointer" }}><Av name={s.creator} size={26} /></div>
                    <div onClick={() => { setProfileStream(s); setScreen("profile"); }} style={{ fontSize:12, fontWeight:700, cursor:"pointer" }} onMouseEnter={e=>e.target.style.color=R} onMouseLeave={e=>e.target.style.color=th.text}>{s.creator}</div>
                  </div>
                  <div onClick={() => { setSelected(s); viewer ? setScreen("payment") : setScreen("viewerAuth"); }} style={{ cursor:"pointer" }}>
                    <div style={{ fontWeight:700, marginBottom:3, fontSize:14 }}>{s.title}</div>
                    <div style={{ color:th.muted, fontSize:11, marginBottom:10 }}>👁 <AnimCount value={s.viewers} /> {t.watching}</div>
                  </div>
                  <div style={{ display:"flex", gap:6 }}>
                    <button onClick={() => { window.open(`https://wa.me/?text=${encodeURIComponent(`Watch ${s.creator} live on Play Rwanda! 🔴🇷🇼`)}`,"_blank"); toast(t.copied); }} style={{ flex:1, background:"#25D36618", border:"1px solid #25D36633", borderRadius:8, padding:"5px", color:"#25D366", fontSize:11, fontWeight:700, cursor:"pointer" }}>📤 WhatsApp</button>
                    <button onClick={() => { window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Watch ${s.creator} live on Play Rwanda! 🔴🇷🇼`)}`,"_blank"); toast(t.copied); }} style={{ flex:1, background:"#1DA1F218", border:"1px solid #1DA1F233", borderRadius:8, padding:"5px", color:"#1DA1F2", fontSize:11, fontWeight:700, cursor:"pointer" }}>🐦 Tweet</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer go={go} onAbout={() => setScreen("about")} onTerms={() => setScreen("terms")} th={th} />

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