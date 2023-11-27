import { getDataFromCache } from "../js/get.js";
import { changeIframeContent } from "../js/changeIframeContent.js";
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
    itemTile.classList.add('itemTile', 'col-2m','mr-3','d-md-block' ,'d-block');
   
    const albumImageWrapper = document.createElement("div") as HTMLDivElement;
    albumImageWrapper.classList.add('albumImageWrapper','position-relative');
   
    const albumImage = document.createElement("img") as HTMLImageElement;
    albumImage.classList.add('albumImage','w-100','h-100','d-block');
    albumImage.src = data.images[0].url;
   
    const albumTitle = document.createElement("h4") as HTMLHeadingElement;
    albumTitle.classList.add('songTitle','d-none', 'd-md-block');
    albumTitle.textContent = data.name;
   
    const playButton = document.createElement("img") as HTMLImageElement;
    playButton.src = "./assets/imgs/spotify-play-button.png";
    playButton.alt = "Play";
    playButton.classList.add('spotify-play-button','position-absolute');
   
    albumImageWrapper.append(albumImage, playButton);
   
    const artistTitle = document.createElement("p") as HTMLParagraphElement;
    artistTitle.classList.add('albumTitle','d-none', 'd-md-block');
   
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
  const skeletonContainer: HTMLElement | null = document.querySelector('.skeletonContainer');
  if (skeletonContainer) skeletonContainer.style.display = 'block';
  const homeContainer: HTMLElement | null = document.querySelector('#homeContainer');
  if (homeContainer) homeContainer.style.display = 'none';
 
  (async ()=>{

 
  const newReleasesPromise:Promise<{ albums: { items: SpotifyData[] } }> = getDataFromCache(apiEndpoints.newRelease,"newReleasesPromise",36000);
  const newReleasesData:{ albums: { items: SpotifyData[] } } = await newReleasesPromise;
  console.log(newReleasesData);
  const newReleaseContainer:HTMLDivElement = document.querySelector(".newReleases")!;
 
  newReleasesData.albums.items.forEach((album) => {
    createItemTile(newReleaseContainer, album, () => {
      document.location.href = "musiclist-1.html"
      sessionStorage.setItem("id",album.id);
      sessionStorage.setItem("type",album.type);
    });
  });
 
  // Fetch and render romantic playlists
  const romanticPromise:Promise<{ playlists:{ items: SpotifyData[] } } >  = getDataFromCache(apiEndpoints.romantic,"newRomanticPromise",36000);
  const romanticData:{ playlists:{ items: SpotifyData[] } }  = await romanticPromise;
  console.log(romanticData);
  const romanticContainer:HTMLDivElement = document.querySelector(".romantic")!;
 
  romanticData.playlists.items.forEach((playlist) => {
    createItemTile(romanticContainer, playlist, () => {
      document.location.href = "musiclist-1.html"
      sessionStorage.setItem("id",playlist.id);
      sessionStorage.setItem("type",playlist.type);
    });
  });
 
  // Fetch and render top Indian songs
  const indiantopPromise:Promise<{ tracks: {album:SpotifyData}[] }  > = getDataFromCache(apiEndpoints.indiantop,"indianTopPromise",36000);
  const indiantopData:{ tracks:{album: SpotifyData}[] } = await indiantopPromise;
  console.log(indiantopData);
  const top10Container:HTMLDivElement = document.querySelector(".topTen")!;
 
  indiantopData.tracks.forEach((track) => {
    const album:SpotifyData = track.album;
    createItemTile(top10Container, album, () => {
      document.location.href = "musiclist-1.html"
      sessionStorage.setItem("id",album.id);
      sessionStorage.setItem("type",album.type);
    });
  });
 
  // Fetch and render Anirudh's albums
  const anirudhAlbumsPromise:Promise<{ items: SpotifyData[] }> = getDataFromCache(apiEndpoints.anirudh,"newAnirudhPromise",36000);
  const anirudhData:{ items: SpotifyData[] }  = await anirudhAlbumsPromise;
  console.log(anirudhData);
  const anirudhContainer:HTMLDivElement= document.querySelector(".anirudhMania")!;
 
  anirudhData.items.forEach((album) => {
    createItemTile(anirudhContainer, album, () => {
      document.location.href = "musiclist-1.html"
      sessionStorage.setItem("id",album.id);
      sessionStorage.setItem("type",album.type);
    });
  });
  const skeletonContainer: HTMLElement | null = document.querySelector('.skeletonContainer');
  if (skeletonContainer) skeletonContainer.style.display = 'none';
  const homeContainer: HTMLElement | null = document.querySelector('#homeContainer');
  if (homeContainer) homeContainer.style.display = 'block';
  })();

  document.querySelector("#loginLink")?.addEventListener('click',()=>{
    changeIframeContent("profile-1.html")
  })

   document.querySelector("#navHomeButton")?.addEventListener('click',()=>{
    changeIframeContent("home-1.html")
  })

  document.querySelector("#navSearchButton")?.addEventListener('click',()=>{
    changeIframeContent("searchpage-1.html")
  })
