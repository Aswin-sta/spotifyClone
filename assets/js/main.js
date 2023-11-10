import { getData } from "./get.js";

// Replace with the specific Spotify API endpoint you want to access
const apiEndpoint = "https://api.spotify.com/v1/browse/new-releases";
// const apiEndpoint = "https://api.spotify.com/v1/browse/featured-playlists";

// const apiEndpoint =
//   "https://api.spotify.com/v1/browse/categories/romance/playlists";

const clientId = "3123b1eded6c47ab91bf1fd765a537b6";
const clientSecret = "98598afa94de4a93b71b39e1efd13a80";
const redirectUri = "http://127.0.0.1:5500/home.html";
const scope = "user-read-private user-read-email";

async function refreshAccessToken(refreshToken) {
  const tokenUrl = "https://accounts.spotify.com/api/token";
  const data = new URLSearchParams();
  data.append("grant_type", "refresh_token");
  data.append("refresh_token", refreshToken);
  const authBase64 = btoa(`${clientId}:${clientSecret}`);
  const response = await fetch(tokenUrl, {
    method: "POST",
    body: data,
    headers: {
      Authorization: `Basic ${authBase64}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });
  if (response.ok) {
    const tokenData = await response.json();
    console.log(tokenData.access_token);
    localStorage.setItem("access_token", tokenData.access_token);
    localStorage.setItem(
      "refresh_token",
      tokenData.refresh_token || refreshToken
    );
    return {
      accessToken: tokenData.access_token,
      // Note: The refresh token might be the same or a new one
      refreshToken: tokenData.refresh_token || refreshToken,
    };
  } else {
    throw new Error("Failed to refresh access token");
  }
}

await refreshAccessToken(localStorage.getItem("refresh_token"));

const newReleasesPromise = getData(apiEndpoint);

newReleasesPromise.then((data) => {
  console.log(data);
  const newAlbums = [...data.albums.items];
  newAlbums.forEach((albums) => {
    let newReleaseContainer = document.querySelector(".spotifyOriginals");
    let itemTile = document.createElement("div");
    itemTile.classList.add("itemTile");

    let albumImage = document.createElement("img");
    albumImage.classList.add("albumImage");
    albumImage.src = albums.images[0].url; // Assuming you want to use the first image
    let albumTitle = document.createElement("h4");
    albumTitle.classList.add("songTitle");
    albumTitle.textContent = albums.name;

    let artistTitle = document.createElement("p");
    artistTitle.classList.add("albumTitle");
    // Assuming you want to display the first artist's name
    artistTitle.textContent = albums.artists[0].name;

    itemTile.append(albumImage, albumTitle, artistTitle);
    newReleaseContainer.append(itemTile);
  });
});

const navigate = (destination) => {
  console.log("click");

  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4 && xhr.status == 200) {
      document.querySelector(".homeWrapper").innerHTML = xhr.responseText;
    }
  };
  xhr.open("GET", `http://127.0.0.1:5500/${destination}.html`, true);
  xhr.send();
};
