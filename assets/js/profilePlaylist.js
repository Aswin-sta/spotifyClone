import { getData, refreshAccessToken } from "./get.js";

await refreshAccessToken(localStorage.getItem("refresh_token"));
const playlistPromise = getData("https://api.spotify.com/v1/me/playlists");
console.log(playlistPromise);

playlistPromise.then((data) => {
  data.items.forEach((playlist) => {
    console.log(playlist);
    const playlistTile = document.getElementById("playlistTile");
    const playlistImageDiv = document.createElement("div");
    const playlistImage = document.createElement("img");
    playlistImage.src = "./assets/imgs/music-icon.svg";
    playlistImageDiv.append(playlistImage);
    const playlistName = document.createElement("h4");
    playlistName.textContent = playlist.name;
    const playlistOwner = document.createElement("p");
    playlistOwner.textContent = `By ${playlist.owner.display_name}`;
    playlistTile.append(playlistImageDiv, playlistName, playlistOwner);
  });
});
