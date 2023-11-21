import { getData, refreshAccessToken } from "./get.js";

await refreshAccessToken(localStorage.getItem("refresh_token"));
const topTracksPromise = getData("https://api.spotify.com/v1/me/top/tracks");
console.log(topTracksPromise);

topTracksPromise.then((data) => {
  data.items.forEach((track, songNumber) => {
    console.log(track);
    createSongElement(track, songNumber);
    songNumber++;
  });
});

function createSongElement(track, songNumber) {
  const topTracksList = document.getElementById("topTracksList");

  const songContainer = document.createElement("div");
  songContainer.classList.add("song");

  const number = document.createElement("p");
  number.classList.add("songNumber");
  number.textContent = `${songNumber + 1}`;

  const albumImage = document.createElement("img");
  albumImage.src = track.album.images[2].url;
  albumImage.alt = "Album Cover";

  const songDetails = document.createElement("div");
  songDetails.classList.add("songDetails");

  const songName = document.createElement("h3");
  songName.textContent = track.name;

  const artists = document.createElement("a");
  artists.href = "#";
  artists.textContent = truncateText(
    track.artists.map((artist) => artist.name).join(", "),
    50
  );

  const detailsLeft = document.createElement("div");
  detailsLeft.classList.add("nameAndArtists");
  detailsLeft.appendChild(songName);
  detailsLeft.appendChild(artists);

  const albumName = document.createElement("div");
  albumName.classList.add("albumName");

  const album = document.createElement("a");
  album.href = "#";
  album.textContent = truncateText(track.album.name, 30);

  albumName.appendChild(album);

  const duration = document.createElement("span");
  duration.textContent = formatDuration(track.duration_ms);

  songDetails.appendChild(detailsLeft);
  songDetails.appendChild(albumName);
  songDetails.appendChild(duration);

  songContainer.appendChild(number);
  songContainer.appendChild(albumImage);
  songContainer.appendChild(songDetails);

  topTracksList.appendChild(songContainer);
}

function formatDuration(durationInMs) {
  const minutes = Math.floor(durationInMs / 60000);
  const seconds = ((durationInMs % 60000) / 1000).toFixed(0);
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
}

function truncateText(text, maxLength) {
  if (text.length > maxLength) {
    return text.substring(0, maxLength - 3) + "...";
  }
  return text;
}
