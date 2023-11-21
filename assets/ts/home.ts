import { getData,refreshAccessToken } from "../js/get.js";
 
const clientId: string = "3123b1eded6c47ab91bf1fd765a537b6";
const clientSecret: string = "98598afa94de4a93b71b39e1efd13a80";
 
interface SpotifyData {
  images: Array<{ url: string }>;
  name: string;
  id: string;
  type: string;
  artists?: Array<{ name: string }>;
  description?: string;
}


 
const apiEndpoints: Record<string, string> = {
  newRelease: "https://api.spotify.com/v1/browse/new-releases",
  featured: "https://api.spotify.com/v1/browse/featured-playlists",
  romantic: "https://api.spotify.com/v1/browse/categories/romance/playlists",
  albums:
    "https://api.spotify.com/v1/albums?ids=382ObEPsp2rxGrnsizN5TX%2C1A2GTWGtFfWp7KSQTwWOyo%2C2noRn2Aes5aoNVsU6iWThc&market=IN",
  shows: "https://api.spotify.com/v1/shows?ids=5CfCWKI5pZ28U0uOzXkDHe%2C5as3aKmN2k11yfDDDSrvaZ",
  indiantop: "https://api.spotify.com/v1/artists/4YRxDV8wJFPHPTeXepOstw/top-tracks?market=IN",
  anirudh: "https://api.spotify.com/v1/artists/4zCH9qm4R2DADamUHMCa6O/albums",
};
 
 
 
 
  // Function to create item tiles
  function createItemTile(
    container: HTMLElement,
    data: SpotifyData,
    onClickHandler?: () => void
  ): void {
    const itemTile = document.createElement("div") as HTMLDivElement;
    itemTile.classList.add("itemTile");
   
    const albumImageWrapper = document.createElement("div") as HTMLDivElement;
    albumImageWrapper.classList.add("albumImageWrapper");
   
    const albumImage = document.createElement("img") as HTMLImageElement;
    albumImage.classList.add("albumImage");
    albumImage.src = data.images[0].url;
   
    const albumTitle = document.createElement("h4") as HTMLHeadingElement;
    albumTitle.classList.add("songTitle");
    albumTitle.textContent = data.name;
   
    const playButton = document.createElement("img") as HTMLImageElement;
    playButton.src = "./assets/imgs/spotify-play-button.png";
    playButton.alt = "Play";
    playButton.classList.add("spotify-play-button");
   
    albumImageWrapper.append(albumImage, playButton);
   
    const artistTitle = document.createElement("p") as HTMLParagraphElement;
    artistTitle.classList.add("albumTitle");
   
    if (data.artists && data.artists.length > 0) {
      artistTitle.textContent = data.artists[0].name;
    } else if (data.description) {
      artistTitle.textContent = data.description;
    }
   
    itemTile.append(albumImageWrapper, albumTitle, artistTitle);
   
    if (onClickHandler) {
      itemTile.onclick = onClickHandler;
    }
   
    container.append(itemTile);
  }
 
  // Fetch and render new releases
 
  (async ()=>{
 
  // Refresh Access Token
  await refreshAccessToken(localStorage.getItem("refresh_token")!);
 
  const newReleasesPromise:Promise<{ albums: { items: SpotifyData[] } }> = getData(apiEndpoints.newRelease);
  const newReleasesData:{ albums: { items: SpotifyData[] } } = await newReleasesPromise;
  console.log(newReleasesData);
  const newReleaseContainer:HTMLDivElement = document.querySelector(".newReleases")!;
 
  newReleasesData.albums.items.forEach((album) => {
    createItemTile(newReleaseContainer, album, () => {
      window.location.href = `musiclist.html?id=${album.id}&type=${album.type}`;
    });
  });
 
  // Fetch and render romantic playlists
  const romanticPromise:Promise<{ playlists:{ items: SpotifyData[] } } >  = getData(apiEndpoints.romantic);
  const romanticData:{ playlists:{ items: SpotifyData[] } }  = await romanticPromise;
  console.log(romanticData);
  const romanticContainer:HTMLDivElement = document.querySelector(".romantic")!;
 
  romanticData.playlists.items.forEach((playlist) => {
    createItemTile(romanticContainer, playlist, () => {
      window.location.href = `musiclist.html?id=${playlist.id}&type=${playlist.type}`;
    });
  });
 
  // Fetch and render top Indian songs
  const indiantopPromise:Promise<{ tracks: {album:SpotifyData}[] }  > = getData(apiEndpoints.indiantop);
  const indiantopData:{ tracks:{album: SpotifyData}[] } = await indiantopPromise;
  console.log(indiantopData);
  const top10Container:HTMLDivElement = document.querySelector(".topTen")!;
 
  indiantopData.tracks.forEach((track) => {
    const album:SpotifyData = track.album;
    createItemTile(top10Container, album, () => {
      window.location.href = `musiclist.html?id=${album.id}&type=${album.type}`;
    });
  });
 
  // Fetch and render Anirudh's albums
  const anirudhAlbumsPromise:Promise<{ items: SpotifyData[] }> = getData(apiEndpoints.anirudh);
  const anirudhData:{ items: SpotifyData[] }  = await anirudhAlbumsPromise;
  console.log(anirudhData);
  const anirudhContainer:HTMLDivElement= document.querySelector(".anirudhMania")!;
 
  anirudhData.items.forEach((album) => {
    createItemTile(anirudhContainer, album, () => {
      window.location.href = `musiclist.html?id=${album.id}&type=${album.type}`;
    });
  });
  })();