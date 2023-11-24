import { getData } from "./get.js";
import { changeSource } from "./player.js";

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
  console.log("hi");
  console.log(data);
  //bannerImage
  const bannerImage = document.createElement("img");
  bannerImage.className = "bannerImgImg";
  const bannerImageSection = document.getElementById("playListHeaderBanner");
  bannerImageSection.append(bannerImage);
  bannerImage.src = data.images[0].url;

  //banner Title
  const bannerTitle = document.createElement("h1");
  bannerTitle.textContent = data.name;
  const htmlBannerTitle = document.getElementById("playListHeaderTitle");
  htmlBannerTitle.append(bannerTitle);

  //banner description
  const bannerDescription = document.createElement("h6");
  bannerDescription.textContent = data.description;
  const bannerDescriptionHtml = document.getElementById("playListHeaderDesc");
  bannerDescriptionHtml.append(bannerDescription);

  const musicDataList = data.tracks.items;
  const albumSongList = document.getElementById("playListTrackLists");

  musicDataList.forEach((track, index) => {
    const songListTrack = document.createElement("div");
    songListTrack.className = "songListTrack row";
    songListTrack.id = `Track-${Number(index + 1)}`;

    const trackNo = document.createElement("p");
    trackNo.className = "titleHash col-1 ";
    trackNo.textContent = `${Number(index + 1)}`;

    const trackName = document.createElement("p");
    trackName.className =
      "titleTitleName col-lg-10 col-md-10 col-xl-10 col-xxl-10 col-sm-10 col-8";
    trackName.textContent = type === "playlist" ? track.track.name : track.name;

    const trackDuration = document.createElement("p");
    trackDuration.className = "titleSpotifyDuration col-1";
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
