import { getData, refreshAccessToken } from "./get.js";

await refreshAccessToken(localStorage.getItem("refresh_token"));
const q = new URLSearchParams(window.location.search).get("q");
const searchResultPromise = getData(
  `https://api.spotify.com/v1/search?query=${q}&type=track&locale=en-US%2Cen%3Bq%3D0.9&offset=0&limit=20`
);
searchResultPromise.then((data) => {
  if (data.tracks && data.tracks.items.length > 0) {
    data.tracks.items.forEach((track) => {
      createSongElement(track);
    });
  } else {
    searchList.innerHTML = "<p>No tracks found.</p>";
  }
});
function createSongElement(track) {
  const searchList = document.getElementById("searchList");

  const songContainer = document.createElement("div");
  songContainer.classList.add("song");

  const albumImage = document.createElement("img");
  albumImage.src = track.album.images[2].url;
  albumImage.alt = "Album Cover";

  const songDetails = document.createElement("div");
  songDetails.classList.add("songDetails");

  const songName = document.createElement("h3");
  songName.textContent = track.name;

  const artists = document.createElement("p");
  artists.textContent = track.artists.map((artist) => artist.name).join(", ");

  const detailsLeft = document.createElement("div");
  detailsLeft.appendChild(songName);
  detailsLeft.appendChild(artists);

  const duration = document.createElement("span");
  duration.textContent = formatDuration(track.duration_ms);

  songDetails.appendChild(detailsLeft);
  songDetails.appendChild(duration);

  songContainer.appendChild(albumImage);
  songContainer.appendChild(songDetails);

  searchList.appendChild(songContainer);
}

function formatDuration(durationInMs) {
  const minutes = Math.floor(durationInMs / 60000);
  const seconds = ((durationInMs % 60000) / 1000).toFixed(0);
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
}
