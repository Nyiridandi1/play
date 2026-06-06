// tokenServer.js — Play Rwanda 🇷🇼
// This runs separately to generate Agora tokens
const express = require("express");
const cors    = require("cors");
const { RtcTokenBuilder, RtcRole } = require("agora-token");

const app = express();
app.use(cors());
app.use(express.json());

const APP_ID          = "82bf24ab308b4d349a067cbf42946213";
const APP_CERTIFICATE = "6918083f4ed14f9cac16b315d8384e74";

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