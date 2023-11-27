import { getData } from "./get.js";
import { changeIframeContent } from "./changeIframeContent.js";

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
    playlistItem.addEventListener("click", () => {
      sessionStorage.setItem("id", playlist.id);
      document.getElementById("heroSection").src = "myplaylist-1.html";
    });

    playlistWrapper.append(playlistItem);
  });
});
document.getElementById("sidebarSearch").addEventListener("click", () => {
  console.log("cloc");
  changeIframeContent("searchpage-1.html");
});

// Sidebar Home click event
document.getElementById("sidebarHome").addEventListener("click", () => {
  changeIframeContent("home-1.html");
});
