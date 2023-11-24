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
  if (playlistItem.image) {
    playlistImage.src = playlistItem.image.url;
  } else {
    playlistImage.src = "./assets/imgs/music-icon.png";
  }
  const playlistName = document.getElementById("playlistName");
  playlistName.textContent = playlistItem.name;
  const profilePicture = document.getElementById("profilePicture");
  profilePicture.src = userData.images[0].url;
  const profileName = document.getElementById("profileName");
  profileName.textContent = userData.display_name;
});
