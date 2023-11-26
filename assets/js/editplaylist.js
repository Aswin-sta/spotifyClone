import { getData } from "./get.js";

const id = new URLSearchParams(window.location.search).get("playlist_id");
const playlistItemPromise = getData(
  `https://api.spotify.com/v1/playlists/${id}`
);
const accessToken = localStorage.getItem("access_token");

playlistItemPromise.then((playlistItem) => {
  console.log(playlistItem);
  const playlistImage = document.getElementById("playlistImage");
  if (playlistItem.images && playlistItem.images.length > 0) {
    playlistImage.src = playlistItem.images[0].url;
  } else {
    playlistImage.src = "./assets/imgs/music-icon.png";
  }
  document.getElementById("name").value = playlistItem.name;
  document.getElementById("desc").value = playlistItem.description;
});

const playlistEditModal = document.getElementById("playlistEdit");
const overlay = document.getElementById("overlay");

const editPlaylistAction = document.getElementById("playlistName");

editPlaylistAction.addEventListener("click", () => {
  playlistEditModal.style.display = "block";
  overlay.style.display = "block";
  document.body.style.overflow = "hidden";
});

overlay.addEventListener("click", () => {
  {
    playlistEditModal.style.display = "none";
    overlay.style.display = "none";
  }
});

const changeDetails = document.getElementById("save");
changeDetails.addEventListener("click", () => {
  const url = `https://api.spotify.com/v1/playlists/${id}`;

  const changePlaylistName = document.getElementById("name").value;
  const changeDescription = document.getElementById("desc").value;

  const updatedData = {
    name: changePlaylistName,
    description: changeDescription,
  };

  fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(updatedData),
  })
    .then((response) => {
      if (!response.ok) {
        console.log("Raw Response:", response);
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      console.log("Resource updated successfully:", data);
    })
    .catch((error) => {
      console.error("Error updating resource:", error);
    });
  playlistEditModal.style.display = "none";
  overlay.style.display = "none";
});
