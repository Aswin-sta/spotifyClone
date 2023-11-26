import { getData } from "./get.js";
async function main() {
  try {
 

    const searchQuery = sessionStorage.getItem("searchQuery");
    const searchResultPromise = getData(
      `https://api.spotify.com/v1/search?query=${searchQuery}&type=track&locale=en-US%2Cen%3Bq%3D0.9&offset=0&limit=20`
    );

    const data = await searchResultPromise;
    console.log(data);
    const searchList = document.getElementById("searchList");

    if (data.tracks && data.tracks.items.length > 0) {
      data.tracks.items.forEach((track) => {
        const songContainer = createSongElement(track);
        searchList.appendChild(songContainer);
      });
    } else {
      searchList.innerHTML = "<p>No tracks found.</p>";
    }
  } catch (error) {
    console.error("Error fetching search results:", error);
  }
}
let currentlyPlayingAudio = null;
function createSongElement(track) {
  const { album, name, artists, duration_ms, preview_url } = track;

  const songContainer = document.createElement("div");
  songContainer.classList.add("song");

  const albumImage = document.createElement("img");
  albumImage.src = album.images[2].url;
  albumImage.alt = "Album Cover";

  const songDetails = document.createElement("div");
  songDetails.classList.add("songDetails");

  const detailsLeft = document.createElement("div");

  const songName = document.createElement("h3");
  songName.textContent = name;

  const artistNames = artists.map((artist) => artist.name).join(", ");

  const artistsPara = document.createElement("p");
  artistsPara.textContent = artistNames;

  detailsLeft.appendChild(songName);
  detailsLeft.appendChild(artistsPara);

  const detailsRight = document.createElement("div");
  const duration = document.createElement("span");
  duration.textContent = formatDuration(duration_ms);
  duration.classList.add("duration");

  const playIcon = document.createElement("i");
  playIcon.classList.add("fas", "fa-headphones-alt","previewIcon",'p-2'); 

  detailsRight.append(playIcon,duration)
  songDetails.appendChild(detailsLeft);
  songDetails.appendChild(detailsRight);

  songContainer.appendChild(albumImage);
  songContainer.appendChild(songDetails);

  playIcon.addEventListener("mouseenter", () => {
    playPreview(preview_url);
  });

  playIcon.addEventListener("mouseleave", () => {
    if (currentlyPlayingAudio) {
      currentlyPlayingAudio.pause();
      currentlyPlayingAudio.currentTime = 0;
      currentlyPlayingAudio = null;
    }
  });
  return songContainer;
}
function playPreview(previewUrl) {
  if (previewUrl) {
    if (currentlyPlayingAudio && !currentlyPlayingAudio.paused) {
      currentlyPlayingAudio.pause();
      currentlyPlayingAudio.currentTime = 0;
    }

    const audio = new Audio(previewUrl);
    audio.play();
    currentlyPlayingAudio = audio;
  } else {
    console.log("No preview available for this track.");
  }
}

function formatDuration(durationInMs) {
  const minutes = Math.floor(durationInMs / 60000);
  const seconds = ((durationInMs % 60000) / 1000).toFixed(0);
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
}
document.querySelector("#loginLink")?.addEventListener("click", () => {
  changeIframeContent("profile-1.html");
});

document.querySelector("#navHomeButton")?.addEventListener("click", () => {
  changeIframeContent("home-1.html");
});

document.querySelector("#navSearchButton")?.addEventListener("click", () => {
  changeIframeContent("searchpage-1.html");
});
main();
