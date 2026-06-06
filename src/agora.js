// ─────────────────────────────────────────────────────────────────────────────
// agora.js — Play Rwanda 🇷🇼
// Location: src/agora.js
// ─────────────────────────────────────────────────────────────────────────────
import AgoraRTC from "agora-rtc-sdk-ng";
import { RtcTokenBuilder, RtcRole } from "agora-token";

// ── YOUR CREDENTIALS ──────────────────────────────────────────────────────────
const APP_ID          = "48c5d032b29b4dddb3a2f6cffffeffbe";
const APP_CERTIFICATE = "ad9f04efcfc645b49e7f17192d2581fc";

// Show Agora logs in browser console (helps debug)
AgoraRTC.setLogLevel(1);

// ── Generate token in the browser (no server needed!) ─────────────────────────
const makeToken = (channelName, uid) => {
  const expireTime = Math.floor(Date.now() / 1000) + 3600; // 1 hour from now
  return RtcTokenBuilder.buildTokenWithUid(
    APP_ID,
    APP_CERTIFICATE,
    channelName,
    uid,
    RtcRole.PUBLISHER,
    expireTime,
    expireTime
  );
};

// ── Create a fresh Agora client ───────────────────────────────────────────────
export const createAgoraClient = () =>
  AgoraRTC.createClient({ mode: "live", codec: "vp8" });

// ── HOST: Creator goes live ───────────────────────────────────────────────────
export const joinAsHost = async (client, channelName) => {
  const uid   = Math.floor(Math.random() * 100000);
  const token = makeToken(channelName, uid);

  await client.setClientRole("host");
  await client.join(APP_ID, channelName, token, uid);
  console.log("✅ Host joined channel:", channelName);

  const [localAudioTrack, localVideoTrack] =
    await AgoraRTC.createMicrophoneAndCameraTracks(
      { encoderConfig: "music_standard" },
      { encoderConfig: "720p_1" }
    );

  await client.publish([localAudioTrack, localVideoTrack]);
  console.log("✅ You are LIVE! 🔴🇷🇼");

  return { client, localVideoTrack, localAudioTrack };
};

// ── VIEWER: Joins a live stream ───────────────────────────────────────────────
export const joinAsViewer = async (client, channelName) => {
  const uid   = Math.floor(Math.random() * 100000);
  const token = makeToken(channelName, uid);

  await client.setClientRole("audience");
  await client.join(APP_ID, channelName, token, uid);
  console.log("✅ Viewer joined channel:", channelName);

  return { client };
};

// ── LEAVE: Clean up everything ────────────────────────────────────────────────
export const leaveChannel = async (client, localVideoTrack, localAudioTrack) => {
  try {
    if (localAudioTrack) { localAudioTrack.stop(); localAudioTrack.close(); }
    if (localVideoTrack) { localVideoTrack.stop(); localVideoTrack.close(); }
    if (client)          { await client.leave(); }
    console.log("✅ Left channel cleanly");
  } catch (e) {
    console.warn("Leave error (safe to ignore):", e.message);
  }
};