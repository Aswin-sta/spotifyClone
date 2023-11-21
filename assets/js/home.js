import { getData, refreshAccessToken } from "./get.js";

const clientId = "3123b1eded6c47ab91bf1fd765a537b6";
const clientSecret = "98598afa94de4a93b71b39e1efd13a80";

const apiEndpoints = {
  newRelease: "https://api.spotify.com/v1/browse/new-releases",
  featured: "https://api.spotify.com/v1/browse/featured-playlists",
  romantic: "https://api.spotify.com/v1/browse/categories/romance/playlists",
  albums:
    "https://api.spotify.com/v1/albums?ids=382ObEPsp2rxGrnsizN5TX%2C1A2GTWGtFfWp7KSQTwWOyo%2C2noRn2Aes5aoNVsU6iWThc&market=IN",
  shows:
    "https://api.spotify.com/v1/shows?ids=5CfCWKI5pZ28U0uOzXkDHe%2C5as3aKmN2k11yfDDDSrvaZ",
  indiantop:
    "https://api.spotify.com/v1/artists/4YRxDV8wJFPHPTeXepOstw/top-tracks?market=IN",
  anirudh: "https://api.spotify.com/v1/artists/4zCH9qm4R2DADamUHMCa6O/albums",
};

// Refresh Access Token
await refreshAccessToken(localStorage.getItem("refresh_token"));

// Function to create item tiles
function createItemTile(container, data, onClickHandler) {
  const itemTile = document.createElement("div");
  itemTile.classList.add("itemTile");

  const albumImageWrapper = document.createElement("div");
  albumImageWrapper.classList.add("albumImageWrapper");

  const albumImage = document.createElement("img");
  albumImage.classList.add("albumImage");
  albumImage.src = data.images[0].url;

  const albumTitle = document.createElement("h4");
  albumTitle.classList.add("songTitle");
  albumTitle.textContent = data.name;

  const playButton = document.createElement("img");
  playButton.src = "./assets/imgs/spotify-play-button.png";
  playButton.alt = "Play";
  playButton.classList.add("spotify-play-button");

  albumImageWrapper.append(albumImage, playButton);
  itemTile.append(albumImageWrapper, albumTitle);

  if (onClickHandler) {
    itemTile.onclick = onClickHandler;
  }

  container.append(itemTile);
}

// Fetch and render new releases
const newReleasesPromise = getData(apiEndpoints.newRelease);
newReleasesPromise.then((data) => {
  console.log(data);
  const newReleaseContainer = document.querySelector(".newReleases");

  data.albums.items.forEach((album) => {
    createItemTile(newReleaseContainer, album, () => {
      window.location.href = `musiclist.html?id=${album.id}&type=${album.type}`;
    });
  });
});

// Fetch and render romantic playlists
const romanticPromise = getData(apiEndpoints.romantic);
romanticPromise.then((data) => {
  console.log(data);
  const romanticContainer = document.querySelector(".romantic");

  data.playlists.items.forEach((playlist) => {
    createItemTile(romanticContainer, playlist, () => {
      window.location.href = `musiclist.html?id=${playlist.id}&type=${playlist.type}`;
    });
  });
});

// Fetch and render top Indian songs
const indiantopPromise = getData(apiEndpoints.indiantop);
indiantopPromise.then((data) => {
  console.log(data);
  const top10Container = document.querySelector(".topTen");

  data.tracks.forEach((track) => {
    createItemTile(top10Container, track.album, () => {
      window.location.href = `musiclist.html?id=${track.album.id}&type=${track.album.type}`;
    });
  });
});

const anirudhAlbumsPromise = getData(apiEndpoints.anirudh);
anirudhAlbumsPromise.then((data) => {
  console.log(data);
  const anirudhContainer = document.querySelector(".anirudhMania");

  data.items.forEach((album) => {
    createItemTile(anirudhContainer, album, () => {
      window.location.href = `musiclist.html?id=${album.id}&type=${album.type}`;
    });
  });
});

export { refreshAccessToken };

// import { getData, refreshAccessToken } from "./get";

// const clientId: string = "3123b1eded6c47ab91bf1fd765a537b6";
// const clientSecret: string = "98598afa94de4a93b71b39e1efd13a80";

// interface SpotifyData {
//   images: Array<{ url: string }>;
//   name: string;
//   id: string;
//   type: string;
// }

// const apiEndpoints: Record<string, string> = {
//   newRelease: "https://api.spotify.com/v1/browse/new-releases",
//   featured: "https://api.spotify.com/v1/browse/featured-playlists",
//   romantic: "https://api.spotify.com/v1/browse/categories/romance/playlists",
//   albums:
//     "https://api.spotify.com/v1/albums?ids=382ObEPsp2rxGrnsizN5TX%2C1A2GTWGtFfWp7KSQTwWOyo%2C2noRn2Aes5aoNVsU6iWThc&market=IN",
//   shows: "https://api.spotify.com/v1/shows?ids=5CfCWKI5pZ28U0uOzXkDHe%2C5as3aKmN2k11yfDDDSrvaZ",
//   indiantop: "https://api.spotify.com/v1/artists/4YRxDV8wJFPHPTeXepOstw/top-tracks?market=IN",
//   anirudh: "https://api.spotify.com/v1/artists/4zCH9qm4R2DADamUHMCa6O/albums",
// };

// // Refresh Access Token
// await refreshAccessToken(localStorage.getItem("refresh_token"));

// // Function to create item tiles
// function createItemTile(
//   container: HTMLElement,
//   data: SpotifyData,
//   onClickHandler?: () => void
// ): void {
//   const itemTile = document.createElement("div");
//   itemTile.classList.add("itemTile");

//   const albumImageWrapper = document.createElement("div");
//   albumImageWrapper.classList.add("albumImageWrapper");

//   const albumImage = document.createElement("img");
//   albumImage.classList.add("albumImage");
//   albumImage.src = data.images[0].url;

//   const albumTitle = document.createElement("h4");
//   albumTitle.classList.add("songTitle");
//   albumTitle.textContent = data.name;

//   const playButton = document.createElement("img");
//   playButton.src = "./assets/imgs/spotify-play-button.png";
//   playButton.alt = "Play";
//   playButton.classList.add("spotify-play-button");

//   albumImageWrapper.append(albumImage, playButton);
//   itemTile.append(albumImageWrapper, albumTitle);

//   if (onClickHandler) {
//     itemTile.onclick = onClickHandler;
//   }

//   container.append(itemTile);
// }

// // Fetch and render new releases
// const newReleasesPromise = getData(apiEndpoints.newRelease);
// newReleasesPromise.then((data: { albums: { items: SpotifyData[] } }) => {
//   console.log(data);
//   const newReleaseContainer = document.querySelector(".newReleases");

//   data.albums.items.forEach((album) => {
//     createItemTile(newReleaseContainer, album, () => {
//       window.location.href = `musiclist.html?id=${album.id}&type=${album.type}`;
//     });
//   });
// });

// // Fetch and render romantic playlists
// const romanticPromise = getData(apiEndpoints.romantic);
// romanticPromise.then((data: { playlists: { items: SpotifyData[] } }) => {
//   console.log(data);
//   const romanticContainer = document.querySelector(".romantic");

//   data.playlists.items.forEach((playlist) => {
//     createItemTile(romanticContainer, playlist, () => {
//       window.location.href = `musiclist.html?id=${playlist.id}&type=${playlist.type}`;
//     });
//   });
// });

// // Fetch and render top Indian songs
// const indiantopPromise = getData(apiEndpoints.indiantop);
// indiantopPromise.then((data: { tracks: { album: SpotifyData }[] }) => {
//   console.log(data);
//   const top10Container = document.querySelector(".topTen");

//   data.tracks.forEach((track) => {
//     createItemTile(top10Container, track.album, () => {
//       window.location.href = `musiclist.html?id=${track.album.id}&type=${track.album.type}`;
//     });
//   });
// });

// // Fetch and render Anirudh's albums
// const anirudhAlbumsPromise = getData(apiEndpoints.anirudh);
// anirudhAlbumsPromise.then((data: { items: SpotifyData[] }) => {
//   console.log(data);
//   const anirudhContainer = document.querySelector(".anirudhMania");

//   data.items.forEach((album) => {
//     createItemTile(anirudhContainer, album, () => {
//       window.location.href = `musiclist.html?id=${album.id}&type=${album.type}`;
//     });
//   });
// });

// export { refreshAccessToken };
