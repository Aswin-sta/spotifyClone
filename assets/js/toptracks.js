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

  const songBootstrapContainer = document.createElement("div");
  songBootstrapContainer.classList.add("container-fluid");

  const songRow = document.createElement("div");
  songRow.classList.add("row");

  const number = document.createElement("p");
  number.classList.add("songNumber", "col-1");
  number.textContent = `${songNumber + 1}`;

  const albumImage = document.createElement("img");
  albumImage.classList.add("col-1", "d-none", "d-sm-inline-block");
  albumImage.src = track.album.images[2].url;
  albumImage.alt = "Album Cover";

  const songName = document.createElement("h3");
  songName.classList.add("songName");
  songName.textContent = track.name;

  const artists = document.createElement("a");
  artists.href = "#";
  artists.classList.add("artistName", "d-none", "d-md-inline-block");
  artists.textContent = truncateText(
    track.artists.map((artist) => artist.name).join(", "),
    50
  );

  const detailsLeft = document.createElement("div");
  detailsLeft.classList.add("nameAndArtists", "col-5");
  detailsLeft.append(songName);
  detailsLeft.append(artists);

  const albumName = document.createElement("div");
  albumName.classList.add("albumName", "col-3", "d-none", "d-md-inline-block");

  const album = document.createElement("a");
  album.href = "#";
  album.textContent = truncateText(track.album.name, 30);

  albumName.append(album);

  const duration = document.createElement("span");
  duration.classList.add("col-2", "text-right");
  duration.textContent = formatDuration(track.duration_ms);

  songRow.append(number);
  songRow.append(albumImage);
  songRow.append(detailsLeft);
  songRow.append(albumName);
  songRow.append(duration);

  songBootstrapContainer.append(songRow);

  songContainer.append(songBootstrapContainer);

  topTracksList.append(songContainer);
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
