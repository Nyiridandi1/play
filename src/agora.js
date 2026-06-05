import AgoraRTC from "agora-rtc-sdk-ng";

const APP_ID = "48c5d032b29b4dddb3a2f6cffffeffbe";

export const createAgoraClient = () => {
  const client = AgoraRTC.createClient({ mode: "live", codec: "vp8" });
  return client;
};

export const joinAsHost = async (client, channelName) => {
  await client.setClientRole("host");
  const localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
  const localVideoTrack = await AgoraRTC.createCameraVideoTrack();
  await client.join(APP_ID, channelName, null, null);
  await client.publish([localAudioTrack, localVideoTrack]);
  return { localAudioTrack, localVideoTrack };
};

export const joinAsViewer = async (client, channelName) => {
  await client.setClientRole("audience");
  await client.join(APP_ID, channelName, null, null);
};

export const leaveChannel = async (client, tracks = []) => {
  tracks.forEach(track => { track.stop(); track.close(); });
  await client.leave();
};