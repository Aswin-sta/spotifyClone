const setupPlayer = () => {
  const token = localStorage.getItem("access_token");
  window.onSpotifyWebPlaybackSDKReady = () => {
    const player = new Spotify.Player({
      name: "Web Playback SDK Quick Start Player",
      getOAuthToken: (cb) => {
        cb(token);
      },
      volume: 0.5,
    });

    player.addListener("ready", ({ device_id }) => {
      console.log("Ready with Device ID", device_id);
      localStorage.setItem("spotifyDeviceId", device_id);
    });

    player.connect();
  };
};
window.onload = setupPlayer();

export { setupPlayer };