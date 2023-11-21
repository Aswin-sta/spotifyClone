import { getData, refreshAccessToken } from "./get.js";

await refreshAccessToken(localStorage.getItem("refresh_token"));
const playlist = "https://api.spotify.com/v1/me/playlists";

const playlistPromise = getData(playlist);
console.log(playlistPromise);
playlistPromise.then((data) => {
  if (data) {
    const playlistItemPlaceholder = document.querySelector(
      "#playlistItemPlaceholder"
    );
    playlistItemPlaceholder.style.display = "none";
  }
  data.items.forEach((playlist) => {
    console.log(playlist);
    const playlistWrapper = document.querySelector("#playlistWrapper");
    const playlistItem = document.createElement("div");
    playlistItem.classList.add("playlistItem");
    const playlistImage = document.createElement("img");
    playlistImage.src = "./assets/imgs/music-icon.svg";
    const playlistTextWrapper = document.createElement("div");
    const playlistName = document.createElement("h4");
    playlistName.textContent = playlist.name;
    const playlistOwner = document.createElement("p");
    playlistOwner.textContent = `By ${playlist.owner.display_name}`;
    playlistTextWrapper.append(playlistName, playlistOwner);
    playlistItem.append(playlistImage, playlistTextWrapper);
    playlistWrapper.append(playlistItem);
  });
});