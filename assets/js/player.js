const token = localStorage.getItem("access_token");
let spotifyDeviceId;
let shuffleState = false;
let isPlaying = false; // Initialize the playback state
document.getElementById("shuffle").addEventListener("click", toggleShuffle);
document.getElementById("skipBackward").addEventListener("click", skipBackward);
document.getElementById("playPause").addEventListener("click", togglePlayPause);
document.getElementById("skipForward").addEventListener("click", skipForward);
document.getElementById("repeat").addEventListener("click", toggleRepeat);

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

async function handleApiResponse(response) {
  if (!response.ok) {
    console.error(`Error: ${response.statusText}`);
    throw new Error(`API request failed with status: ${response.status}`);
  }
  return response.json();
}

function togglePlayPause() {
  if (isPlaying) {
    pauseSong();
  } else {
    playSong(); // You can pass the trackUri if needed
  }
}
function toggleRepeat() {
  // Implement repeat logic using the Spotify Web Playback SDK
}

async function playSong(trackUri) {
  if (!spotifyDeviceId) {
    console.error("No valid Spotify device ID available");
    return;
  }

  try {
    if (!trackUri) {
      console.log(
        "No track URI provided. Trying to play from recommendations..."
      );

      // Fetch a list of recommended tracks
      const recommendationsResponse = await fetch(
        "https://api.spotify.com/v1/me/player/recently-played",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const recommendationsData = await recommendationsResponse.json();
      console.log(recommendationsData);

      if (recommendationsData && recommendationsData.items.length > 0) {
        // Get the URI of the first recommended track
        const recommendedTrackUri = recommendationsData.items[0].track.uri;

        // Play the recommended track
        await playSong(recommendedTrackUri);
        return; // Exit the function after playing the recommended track
      } else {
        console.error("No recommendations available");
        return;
      }
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

    await handleApiResponse(response);
    console.log("Song played successfully");
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

// Add a delay function if needed
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
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
