import { getData, refreshAccessToken } from "./get.js";
import { changeSource } from "./player.js";

await refreshAccessToken(localStorage.getItem("refresh_token"));

//url search parameters
const id = new URLSearchParams(window.location.search).get("id");
const type = new URLSearchParams(window.location.search).get("type");

//musiclist api
const newReleasesPromise = getData(
  "https://api.spotify.com/v1/" + type + "s/" + id
);

//function to convert ms to min:sec format
function timeConvertion(duration_ms) {
  const totalSeconds = Math.floor(duration_ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const remainingSeconds = totalSeconds % 60;
  const formattedSeconds =
    remainingSeconds < 10 ? `0${remainingSeconds}` : `${remainingSeconds}`;
  return `${minutes}:${formattedSeconds}`;
}

newReleasesPromise.then((data) => {
  //bannerImage
  const bannerImage = document.createElement("img");
  bannerImage.className = "bannerImgImg skeleton";
  const bannerImageSection = document.querySelector(".bannerImg");
  bannerImageSection.append(bannerImage);
  bannerImage.src = data.images[0].url;

  //banner Title
  const bannerTitle = document.querySelector(".bannerHeader h1");
  bannerTitle.textContent = data.name;

  //banner description
  const bannerDescription = document.querySelector(".bannerHeaderDesc");
  bannerDescription.textContent = data.description;

  const musicDataList = data.tracks.items;
  const albumSongList = document.querySelector(".albumSongList");

  musicDataList.forEach((track, index) => {
    const songListTrack = document.createElement("div");
    songListTrack.className = "songListTrack";
    songListTrack.id = `Track-${Number(index + 1)}`;

    const trackNo = document.createElement("p");
    trackNo.className = "titleHash";
    trackNo.textContent = `${Number(index + 1)}`;

    const trackName = document.createElement("p");
    trackName.className = "titleTitleName";
    trackName.textContent = type === "playlist" ? track.track.name : track.name;

    const trackDuration = document.createElement("p");
    trackDuration.className = "titleSpotifyDuration";
    trackDuration.textContent = timeConvertion(
      type === "playlist" ? track.track.duration_ms : track.duration_ms
    );

    songListTrack.append(trackNo, trackName, trackDuration);

    songListTrack.onclick = () => {
      const sourceUrl =
        type === "playlist" ? track.track.preview_url : track.preview_url;
      const sourceName = type === "playlist" ? track.track.name : track.name;
      changeSource(sourceUrl, sourceName, data.name, data.images[0].url);
    };

    albumSongList.append(songListTrack);
  });
});
