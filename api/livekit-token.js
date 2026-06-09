import { AccessToken } from "livekit-server-sdk";

const LIVEKIT_API_KEY = "APImf6u8kGk6xeX";
const LIVEKIT_API_SECRET = "zVSSWqPsveyNsbUtxOrTHtwmqADrwVDeFAuOEOizTcR";

export default async function handler(req, res) {
  // Allow all origins (CORS)
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const { room, username, isHost } = req.query;

  if (!room || !username) {
    return res.status(400).json({ error: "room and username are required" });
  }

  try {
    const at = new AccessToken(LIVEKIT_API_KEY, LIVEKIT_API_SECRET, {
      identity: username,
      ttl: "4h", // token valid for 4 hours
    });

    at.addGrant({
      roomJoin: true,
      room: room,
      canPublish: isHost === "true", // only host can publish video
      canSubscribe: true, // everyone can watch
    });

    const token = await at.toJwt();
    return res.status(200).json({ token });
  } catch (err) {
    console.error("Token error:", err);
    return res.status(500).json({ error: "Failed to generate token" });
  }
}