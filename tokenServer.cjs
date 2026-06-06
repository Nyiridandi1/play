// tokenServer.js — Play Rwanda 🇷🇼
// This runs separately to generate Agora tokens
const express = require("express");
const cors    = require("cors");
const { RtcTokenBuilder, RtcRole } = require("agora-token");

const app = express();
app.use(cors());
app.use(express.json());

const APP_ID          = "dd24568816184afb8610ad600a211078";
const APP_CERTIFICATE = "ad9f04efcfc645b49e7f17192d2581fc";

app.get("/token", (req, res) => {
  const channelName = req.query.channel;
  const uid         = Number(req.query.uid) || 0;
  const expireTime  = Math.floor(Date.now() / 1000) + 3600;

  const token = RtcTokenBuilder.buildTokenWithUid(
    APP_ID, APP_CERTIFICATE, channelName,
    uid, RtcRole.PUBLISHER, expireTime, expireTime
  );

  console.log("✅ Token generated for channel:", channelName);
  res.json({ token });
});

app.listen(3001, () => {
  console.log("🔴 Play Rwanda Token Server running on http://localhost:3001");
});