const token = localStorage.getItem("access_token");
let spotifyDeviceId;
let shuffleState = false;
let isPlaying = false; // Initialize the playback state
document.getElementById("shuffle").addEventListener("click", toggleShuffle);
document.getElementById("skipBackward").addEventListener("click", skipBackward);
const playPauseButton = document.querySelector("#playPause");
document.getElementById("skipForward").addEventListener("click", skipForward);
document.getElementById("repeat").addEventListener("click", toggleRepeat);

const playerSongTitle = document.querySelector("#playerSongTitle");
const playerSongAlbum = document.querySelector("#playerSongAlbum");
const playerAlbumArt = document.querySelector("#playerAlbumArt");

playPauseButton.addEventListener("click", togglePlayPause);

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
    spotifyDeviceId = device_id;
  });

  player.connect();
};

function togglePlayPause() {
  if (isPlaying) {
    pauseSong();
    console.log("paused");
  } else {
    resumePlayback();
  }
}
function toggleRepeat() {
  // Implement repeat logic using the Spotify Web Playback SDK
}

async function playSong(trackUri, trackName, trackAlbum, trackImage) {
  try {
    if (!spotifyDeviceId) {
      console.error("No valid Spotify device ID available");
      return;
    }

    // If trackUri is present, proceed to play the provided track
    const response = await fetch(
      `https://api.spotify.com/v1/me/player/play?device_id=${spotifyDeviceId}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ uris: [trackUri] }),
      }
    );
    sessionStorage.setItem("nowPlaying", trackUri);
    sessionStorage.setItem("music_name", trackName);
    sessionStorage.setItem("music_album", trackAlbum);
    sessionStorage.setItem("music_image", trackImage);

    console.log("Song played successfully");
    playerSongAlbum.innerHTML = trackAlbum;
    playerAlbumArt.src = trackImage;
    playerSongTitle.innerHTML = trackName;
    playPauseButton.innerHTML = '<i class="fas fa-pause"></i>';
    isPlaying = true;
    console.log(playPauseButton);
  } catch (error) {
    console.error("Error playing song", error.message);

    if (error.status === 502) {
      console.log(
        "Retrying to play the original track after 502 Bad Gateway..."
      );

      // Retry playing the original track after a delay or implement your retry logic
      // await delay(3000); // Add a delay if needed
      // await playSong(trackUri);
    }
  }
}

async function resumePlayback() {
  try {
    if (!spotifyDeviceId) {
      console.error("No valid Spotify device ID available");
      return;
    }

    const response = await fetch(
      `https://api.spotify.com/v1/me/player/play?device_id=${spotifyDeviceId}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    isPlaying = true;
    playPauseButton.innerHTML = '<i class="fas fa-pause"></i>'; // Change to pause icon
    await handleApiResponse(response);
    console.log("Playback resumed successfully");

    // Assuming playPauseButton is correctly referencing your button element
  } catch (error) {
    console.error("Error resuming playback", error.message);
  }
}

async function skipForward() {
  try {
    const response = await fetch(
      `https://api.spotify.com/v1/me/player/next?device_id=${spotifyDeviceId}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    await handleApiResponse(response);
    resumePlayback();
  } catch (error) {
    console.error("Error skipping forward", error.message);
  }
}

async function skipBackward() {
  try {
    const response = await fetch(
      `https://api.spotify.com/v1/me/player/previous?device_id=${spotifyDeviceId}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    resumePlayback();
    await handleApiResponse(response);
  } catch (error) {
    console.error("Error skipping backward", error.message);
  }
}

async function toggleShuffle() {
  try {
    const response = await fetch(
      `https://api.spotify.com/v1/me/player/shuffle?state=${!shuffleState}&device_id=${spotifyDeviceId}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    await handleApiResponse(response);

    shuffleState = !shuffleState;
    console.log(`Shuffle state: ${shuffleState ? "enabled" : "disabled"}`);
  } catch (error) {
    console.error("Error toggling shuffle", error.message);
  }
}

async function pauseSong() {
  try {
    if (!spotifyDeviceId) {
      console.error("No valid Spotify device ID available");
      return;
    }

    const response = await fetch(
      `https://api.spotify.com/v1/me/player/pause?device_id=${spotifyDeviceId}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    playPauseButton.innerHTML = '<i class="fas fa-play"></i>'; // Change to play icon
    isPlaying = false;
    await handleApiResponse(response);
    console.log("Song paused successfully");

    // Assuming playPauseButton is correctly referencing your button element
  } catch (error) {
    console.error("Error pausing song", error.message);
  }
}

async function playNextInQueueOrAlbum() {
  try {
    if (!spotifyDeviceId) {
      console.error("No valid Spotify device ID available");
      return;
    }
    const albumUri = new URLSearchParams(window.location.search).get("id");
    const type = new URLSearchParams(window.location.search).get("type");
    const requestBody = albumUri
      ? { command: "next", context_uri: albumUri }
      : { command: "next" };

    const response = await fetch(
      `https://api.spotify.com/v1/me/player/play?device_id=${spotifyDeviceId}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      }
    );

    await handleApiResponse(response);

    if (albumUri) {
      console.log(`Switched to the next song in the album and started playing`);
    } else {
      console.log(
        `Switched to the next track in the queue and started playing`
      );
    }
  } catch (error) {
    console.error("Error playing the next song", error.message);
  }
}

async function handleApiResponse(response) {
  if (response.ok || response.status === 204) {
    // If the response status is OK (200-299) or No Content (204), everything is fine
    console.log("API request successful");
  } else {
    // If the response status is not OK, handle the error
    const errorData = await response.json(); // Assuming the error response is in JSON format
    console.error(
      `API request failed with status ${response.status}:`,
      errorData
    );
    throw new Error(errorMessage);
  }
}

// function LoadCurrentSongDetails() {
//   playerSongAlbum.innerHTML = sessionStorage.getItem("music_album");
//   playerAlbumArt.src = sessionStorage.getItem("music_image");
//   playerSongTitle.innerHTML = sessionStorage.getItem("music_name");
// }

export { playSong };
