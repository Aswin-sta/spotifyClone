import { getData, refreshAccessToken } from "./get.js";
import { userDataPromise } from "./profile.js";
const userData = await userDataPromise;

await refreshAccessToken(localStorage.getItem("refresh_token"));
const id = new URLSearchParams(window.location.search).get("playlist_id");
const playlistItemPromise = getData(
  `https://api.spotify.com/v1/playlists/${id}`
);

playlistItemPromise.then((playlistItem) => {
  console.log(playlistItem);
  const playlistImage = document.getElementById("playlistPhoto");
  if (playlistItem.images && playlistItem.images.length > 0) {
    playlistImage.src = playlistItem.images[0].url;
  } else {
    playlistImage.src = "./assets/imgs/music-icon.png";
  }
  const playlistName = document.getElementById("playlistName");
  playlistName.textContent = playlistItem.name;
  const profilePicture = document.getElementById("profilePicture");
  profilePicture.src = userData.images[0].url;
  const profileName = document.getElementById("profileName");
  profileName.textContent = userData.display_name;
  playlistItem.tracks.items.forEach((song, songNumber) => {
    console.log(song);
    createSongElement(song, songNumber);
    songNumber++;
  });
});

function createSongElement(song, songNumber) {
  const playlistTracksList = document.getElementById("playlistTracksList");

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
  albumImage.src = song.track.album.images[2].url;
  const songName = document.createElement("h3");
  songName.classList.add("songName");
  songName.textContent = song.track.name;

  const artists = document.createElement("a");
  artists.href = "#";
  artists.classList.add(
    "artistName",
    "d-none",
    "d-md-inline-block",
    "text-truncate"
  );
  artists.textContent = song.track.artists
    .map((artist) => artist.name)
    .join(", ");

  const detailsLeft = document.createElement("div");
  detailsLeft.classList.add("nameAndArtists", "col-5");
  detailsLeft.append(songName);
  detailsLeft.append(artists);

  const albumName = document.createElement("div");
  albumName.classList.add(
    "albumName",
    "col-3",
    "d-none",
    "d-md-inline-block",
    "text-truncate"
  );
  const album = document.createElement("a");
  album.href = "#";
  album.textContent = song.track.album.name;

  albumName.append(album);

  const duration = document.createElement("span");
  duration.classList.add("col-2");
  duration.textContent = formatDuration(song.track.duration_ms);

  songRow.append(number);
  songRow.append(albumImage);
  songRow.append(detailsLeft);
  songRow.append(albumName);
  songRow.append(duration);

  songBootstrapContainer.append(songRow);

  songContainer.append(songBootstrapContainer);

  playlistTracksList.append(songContainer);
}

function formatDuration(durationInMs) {
  const minutes = Math.floor(durationInMs / 60000);
  const seconds = ((durationInMs % 60000) / 1000).toFixed(0);
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
}
