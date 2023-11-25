import { getData } from "../js/get.js";
import { changeSource } from "../js/player.js";

(async () => {
function isPlaylistTrack(track: any): track is spotifyDataPlaylist {
  return 'track' in track && typeof track.track.preview_url === 'string';
}

function isAlbumTrack(track: any): track is spotifyDataAlbumList {
  return typeof track.preview_url === 'string';
}

//url search parameters
const id = new URLSearchParams(window.location.search).get("id");
const type = new URLSearchParams(window.location.search).get("type");

//musiclist api
const newReleasesPromise:any = getData(
  "https://api.spotify.com/v1/" + type + "s/" + id
);

//function to convert ms to min:sec format
function timeConvertion(duration_ms:number):string {
  const totalSeconds = Math.floor(duration_ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const remainingSeconds = totalSeconds % 60;
  const formattedSeconds =
    remainingSeconds < 10 ? `0${remainingSeconds}` : `${remainingSeconds}`;
  return `${minutes}:${formattedSeconds}`;
}

interface spotifyDataImg{
  url:string;
}

interface spotifyDataPlaylist{
  track:{
    duration_ms:number;
    name:string;
    preview_url:string;
  }
}

interface spotifyDataAlbumList{
    duration_ms:number;
    name:string;
    preview_url:string;
}

interface spotifyData{
  name:string;
  description:string | null;
  images:spotifyDataImg[];
  type:string;
  tracks:{ items:spotifyDataPlaylist[] | spotifyDataAlbumList[];}
}

newReleasesPromise.then((data:spotifyData) => {
  console.log("data");
  console.log(data);

  //bannerImage
  const bannerImage:HTMLImageElement = document.createElement("img");
  bannerImage.className = "bannerImgImg";
  const bannerImageSection = document.getElementById("playListHeaderBanner") as HTMLDivElement;
  bannerImageSection.append(bannerImage);
  bannerImage.src = data.images[0].url;
  //bannerImage.src = data.images[0].url as string;

  //banner Title
  const bannerTitle :HTMLHeadElement= document.createElement("h1");
  bannerTitle.textContent = data.name;
  const htmlBannerTitle = document.getElementById("playListHeaderTitle") as HTMLDivElement;
  htmlBannerTitle.append(bannerTitle);

  //banner description
  const bannerDescription:HTMLHeadElement = document.createElement("h6");
  bannerDescription.textContent = data.description;
  const bannerDescriptionHtml = document.getElementById("playListHeaderDesc") as HTMLDivElement;
  bannerDescriptionHtml.append(bannerDescription);

  const musicDataList = data.tracks.items as spotifyDataPlaylist[] | spotifyDataAlbumList[];;
  const albumSongList = document.getElementById("playListTrackLists") as HTMLDivElement;

  musicDataList.forEach((track:spotifyDataPlaylist | spotifyDataAlbumList, index:number) => {
    const songListTrack:HTMLDivElement = document.createElement("div");
    songListTrack.className = "songListTrack row";
    songListTrack.id = `Track-${Number(index + 1)}`;

    const trackNo:HTMLParagraphElement = document.createElement("p");
    trackNo.className = "titleHash col-1 ";
    trackNo.textContent = `${Number(index + 1)}`;


    let playlistTrack: spotifyDataPlaylist | undefined;
    let albumTrack: spotifyDataAlbumList | undefined;

    const trackName:HTMLParagraphElement= document.createElement("p");
    trackName.className ="titleTitleName col-lg-10 col-md-10 col-xl-10 col-xxl-10 col-sm-10 col-8";
    if ('track' in track) {
      playlistTrack = track as spotifyDataPlaylist;
      trackName.textContent = type === "playlist" ? playlistTrack.track.name : "";
    } else {
      albumTrack = track as spotifyDataAlbumList;
      trackName.textContent = albumTrack.name || "";
    }
    // trackName.textContent = type === "playlist" ? track.track.name : track.name;
    

    const trackDuration:HTMLParagraphElement = document.createElement("p");
    trackDuration.className = "titleSpotifyDuration col-1";
    trackDuration.textContent = timeConvertion(
      type === "playlist" ? playlistTrack?.track.duration_ms || 0 : albumTrack?.duration_ms || 0
    );
    // trackDuration.textContent = timeConvertion(
    //   type === "playlist" ? track.track.duration_ms : track.duration_ms
    // );

    
    
    

    songListTrack.append(trackNo, trackName, trackDuration);

    songListTrack.onclick = () => {
      let sourceUrl: string | undefined;
      let sourceName: string | undefined;
    
      if ('track' in track) {
        const playlistTrack = track as spotifyDataPlaylist;
        sourceUrl = type === "playlist" ? playlistTrack.track.preview_url : undefined;
        sourceName = type === "playlist" ? playlistTrack.track.name : undefined;
      } else {
        const albumTrack = track as spotifyDataAlbumList;
        sourceUrl = track.preview_url;
        sourceName = track.name;
      }
    
      if (sourceUrl && sourceName) {
        changeSource(sourceUrl, sourceName, data.name, data.images[0]?.url || "");
      }
    };
    
    

    
    // songListTrack.onclick = () => {
    //   const sourceUrl =
    //     type === "playlist" ? track.track.preview_url : track.preview_url;
    //   const sourceName = type === "playlist" ? track.track.name : track.name;
    //   changeSource(sourceUrl, sourceName, data.name, data.images[0].url);
    // };
    

    

    albumSongList.append(songListTrack);
  });
});
})();
