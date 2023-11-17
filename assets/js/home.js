import { getData, refreshAccessToken } from "./get.js";

const clientId = "3123b1eded6c47ab91bf1fd765a537b6";
const clientSecret = "98598afa94de4a93b71b39e1efd13a80";
const newRelease = "https://api.spotify.com/v1/browse/new-releases";
const featured = "https://api.spotify.com/v1/browse/featured-playlists";
const romantic =
  "https://api.spotify.com/v1/browse/categories/romance/playlists";
const albums =
  "https://api.spotify.com/v1/albums?ids=382ObEPsp2rxGrnsizN5TX%2C1A2GTWGtFfWp7KSQTwWOyo%2C2noRn2Aes5aoNVsU6iWThc&market=IN";
const shows =
  "https://api.spotify.com/v1/shows?ids=5CfCWKI5pZ28U0uOzXkDHe%2C5as3aKmN2k11yfDDDSrvaZ";

const indiantop =
  "https://api.spotify.com/v1/artists/4YRxDV8wJFPHPTeXepOstw/top-tracks?market=IN";

const anirudh =
  "https://api.spotify.com/v1/artists/4zCH9qm4R2DADamUHMCa6O/albums";

await refreshAccessToken(localStorage.getItem("refresh_token"));

const newReleasesPromise = getData(newRelease);

newReleasesPromise.then((data) => {
  console.log(data);
  const newAlbums = [...data.albums.items];
  newAlbums.forEach((albums) => {
    let newReleaseContainer = document.querySelector(".newReleases");
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
    itemTile.onclick = () => {
      loadPage("musiclist", albums.id);
    };
    newReleaseContainer.append(itemTile);
  });
});

const romanticPromise = getData(romantic);

romanticPromise.then((data) => {
  console.log(data);

  const newRomantic = [...data.playlists.items];
  newRomantic.forEach((playlists) => {
    // console.log(playlists);
    let newReleaseContainer = document.querySelector(".romantic");
    let itemTile = document.createElement("div");
    itemTile.classList.add("itemTile");

    let albumImage = document.createElement("img");
    albumImage.classList.add("albumImage");
    albumImage.src = playlists.images[0].url; // Assuming you want to use the first image
    let albumTitle = document.createElement("h4");
    albumTitle.classList.add("songTitle");
    albumTitle.textContent = playlists.name;
    let artistTitle = document.createElement("p");
    artistTitle.classList.add("albumTitle");
    // Assuming you want to display the first artist's name
    artistTitle.textContent = playlists.description;

    itemTile.append(albumImage, albumTitle, artistTitle);
    newReleaseContainer.append(itemTile);
  });
});

const episodes = getData(indiantop);
episodes.then((data) => {
  console.log(data);

  const topSongs = [...data.tracks];
  topSongs.forEach((playlists) => {
    // console.log(playlists);
    let top10Container = document.querySelector(".topTen");
    let itemTile = document.createElement("div");
    itemTile.classList.add("itemTile");

    let albumImage = document.createElement("img");
    albumImage.classList.add("albumImage");
    albumImage.src = playlists.album.images[0].url; // Assuming you want to use the first image
    let albumTitle = document.createElement("h4");
    albumTitle.classList.add("songTitle");
    albumTitle.textContent = playlists.album.name;
    itemTile.append(albumImage, albumTitle);
    itemTile.onclick = () => {
      window.location.href = `musiclist.html?id=${playlists.album.href}`;
    };

    top10Container.append(itemTile);
  });
});

const anirudhAlbums = getData(anirudh);
anirudhAlbums.then((data, index) => {
  // console.log(data);
  const anirudhAlbums = [...data.items];
  anirudhAlbums.forEach((playlists) => {
    // console.log(playlists);
    let anirudhContainer = document.querySelector(".anirudhMania");
    let itemTile = document.createElement("div");
    itemTile.classList.add("itemTile");
    let albumImage = document.createElement("img");
    albumImage.classList.add("albumImage");
    albumImage.src = playlists.images[0].url;
    let albumTitle = document.createElement("h4");
    albumTitle.classList.add("songTitle");
    albumTitle.textContent = playlists.name;
    itemTile.append(albumImage, albumTitle);
    anirudhContainer.append(itemTile);
  });
});

export { refreshAccessToken };
