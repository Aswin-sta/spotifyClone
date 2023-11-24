var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { getDataFromCache } from "../js/get.js";
const clientId = "3123b1eded6c47ab91bf1fd765a537b6";
const clientSecret = "98598afa94de4a93b71b39e1efd13a80";
const apiEndpoints = {
    newRelease: "https://api.spotify.com/v1/browse/new-releases",
    featured: "https://api.spotify.com/v1/browse/featured-playlists",
    romantic: "https://api.spotify.com/v1/browse/categories/romance/playlists",
    albums: "https://api.spotify.com/v1/albums?ids=382ObEPsp2rxGrnsizN5TX%2C1A2GTWGtFfWp7KSQTwWOyo%2C2noRn2Aes5aoNVsU6iWThc&market=IN",
    shows: "https://api.spotify.com/v1/shows?ids=5CfCWKI5pZ28U0uOzXkDHe%2C5as3aKmN2k11yfDDDSrvaZ",
    indiantop: "https://api.spotify.com/v1/artists/4YRxDV8wJFPHPTeXepOstw/top-tracks?market=IN",
    anirudh: "https://api.spotify.com/v1/artists/4zCH9qm4R2DADamUHMCa6O/albums",
};
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
    const artistTitle = document.createElement("p");
    artistTitle.classList.add("albumTitle");
    if (data.artists && data.artists.length > 0) {
        artistTitle.textContent = data.artists[0].name;
    }
    else if (data.description) {
        artistTitle.textContent = data.description;
    }
    itemTile.append(albumImageWrapper, albumTitle, artistTitle);
    if (onClickHandler) {
        itemTile.onclick = onClickHandler;
    }
    container.append(itemTile);
}
// Fetch and render new releases
(() => __awaiter(void 0, void 0, void 0, function* () {
    // Refresh Access Token
    const newReleasesPromise = getDataFromCache(apiEndpoints.newRelease, "newReleasesPromise", 36000);
    const newReleasesData = yield newReleasesPromise;
    console.log(newReleasesData);
    const newReleaseContainer = document.querySelector(".newReleases");
    newReleasesData.albums.items.forEach((album) => {
        createItemTile(newReleaseContainer, album, () => {
            window.location.href = `musiclist.html?id=${album.id}&type=${album.type}`;
        });
    });
    // Fetch and render romantic playlists
    const romanticPromise = getDataFromCache(apiEndpoints.romantic, "newRomanticPromise", 36000);
    const romanticData = yield romanticPromise;
    console.log(romanticData);
    const romanticContainer = document.querySelector(".romantic");
    romanticData.playlists.items.forEach((playlist) => {
        createItemTile(romanticContainer, playlist, () => {
            window.location.href = `musiclist.html?id=${playlist.id}&type=${playlist.type}`;
        });
    });
    // Fetch and render top Indian songs
    const indiantopPromise = getDataFromCache(apiEndpoints.indiantop, "indianTopPromise", 36000);
    const indiantopData = yield indiantopPromise;
    console.log(indiantopData);
    const top10Container = document.querySelector(".topTen");
    indiantopData.tracks.forEach((track) => {
        const album = track.album;
        createItemTile(top10Container, album, () => {
            window.location.href = `musiclist.html?id=${album.id}&type=${album.type}`;
        });
    });
    // Fetch and render Anirudh's albums
    const anirudhAlbumsPromise = getDataFromCache(apiEndpoints.anirudh, "newAnirudhPromise", 36000);
    const anirudhData = yield anirudhAlbumsPromise;
    console.log(anirudhData);
    const anirudhContainer = document.querySelector(".anirudhMania");
    anirudhData.items.forEach((album) => {
        createItemTile(anirudhContainer, album, () => {
            window.location.href = `musiclist.html?id=${album.id}&type=${album.type}`;
        });
    });
}))();
