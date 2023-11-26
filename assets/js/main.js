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

document.getElementById("sidebarSearch").addEventListener("click", () => {
  changeIframeContent("searchpage-1.html");
});

// Sidebar Home click event
document.getElementById("sidebarHome").addEventListener("click", () => {
  changeIframeContent("home-1.html");
});

function changeIframeContent(newSrc) {
  // Get the iframe element by its id
  const iframe = document.getElementById("heroSection");

  // Change the src attribute to the new source
  iframe.src = newSrc;
}
