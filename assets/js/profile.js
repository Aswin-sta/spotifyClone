import { getData, refreshAccessToken } from "./get.js";

await refreshAccessToken(localStorage.getItem("refresh_token"));
const userDataPromise = getData("https://api.spotify.com/v1/me");
console.log(userDataPromise);

try {
  const userData = await userDataPromise;
  console.log(userData.display_name);
  console.log(userData.images[1].url);
  document.getElementById("username").innerHTML = userData.display_name;
  document.getElementById("profile").src = userData.images[1].url;
} catch (error) {
  console.error("Error fetching user data:", error);
}

const playlistPromise = getData("https://api.spotify.com/v1/me/playlists");
console.log(playlistPromise);

playlistPromise.then((data) => {
  data.items.forEach((playlist) => {
    console.log(playlist);
    const playlistTileList = document.getElementById("playlistTileList");
    const playlistTile = document.createElement("div");
    playlistTile.classList.add("playlistTile");
    const playlistImageDiv = document.createElement("div");
    const playlistImage = document.createElement("img");
    if (playlist.image) {
      playlistImage.src = playlist.image.url;
    } else {
      playlistImage.src = "./assets/imgs/music-icon.png";
    }
    playlistImageDiv.append(playlistImage);
    const playlistName = document.createElement("h4");
    playlistName.textContent = playlist.name;
    const playlistOwner = document.createElement("p");
    playlistOwner.textContent = `By ${playlist.owner.display_name}`;
    playlistTile.append(playlistImageDiv, playlistName, playlistOwner);
    playlistTile.onclick = () => {
      window.location.href = `myplaylist.html?playlist_id=${playlist.id}`;
    };
    playlistTileList.append(playlistTile);
  });
});

export { userDataPromise };
