import { getData, refreshAccessToken } from "./get.js";
import { changeSource } from "./player.js";

await refreshAccessToken(localStorage.getItem("refresh_token"));

const id = new URLSearchParams(window.location.search).get("id");
const type = new URLSearchParams(window.location.search).get("type");

const newReleasesPromise = getData(
  "https://api.spotify.com/v1/" + type + "s/" + id
);
console.log(newReleasesPromise);

function timeConvertion(duration_ms) {
  const totalSeconds = Math.floor(duration_ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const remainingSeconds = totalSeconds % 60;
  const formattedSeconds =
    remainingSeconds < 10 ? `0${remainingSeconds}` : `${remainingSeconds}`;
  return `${minutes}:${formattedSeconds}`;
}

newReleasesPromise.then((data) => {
  console.log(data);
  //bannerImage
  const bannerImage = document.querySelector(".banner-img img");
  bannerImage.src = data.images[0].url;
  //banner Title
  const bannerTitle = document.querySelector(".banner-header h1");
  bannerTitle.textContent = data.name;
  //banner description
  const bannerDescription = document.querySelector(".banner-header-desc");
  bannerDescription.textContent = data.description;

  const musicDataList = data.tracks.items;

  const albumSongList = document.querySelector(".album-song-list");
  if (type == "album") {
    for (let i = 0; i < data.tracks.items.length; i++) {
      const songListTrack = document.createElement("div");
      songListTrack.className = "song-list-track";
      songListTrack.id = `Track-${Number(i + 1)}`;
      const trackNo = document.createElement("p");
      trackNo.className = "title-hash";
      trackNo.textContent = `${Number(i + 1)}`;
      const trackName = document.createElement("p");
      trackName.className = "title-title-name";
      trackName.textContent = musicDataList[i].name;

      const trackDuration = document.createElement("p");
      trackDuration.className = "title-spotify-duration";
      trackDuration.textContent = timeConvertion(musicDataList[i].duration_ms);
      songListTrack.append(trackNo);
      songListTrack.append(trackName);

      songListTrack.append(trackDuration);
      songListTrack.onclick = () => {
        changeSource(
          musicDataList[i].preview_url,
          musicDataList[i].name,
          data.name,
          data.images[0].url
        );
      };
      albumSongList.append(songListTrack);
    }
  } else if (type == "playlist") {
    for (let i = 0; i < data.tracks.items.length; i++) {
      const playList = musicDataList[i].track;

      const songListTrack = document.createElement("div");
      songListTrack.className = "song-list-track";
      songListTrack.id = `Track-${Number(i + 1)}`;
      const trackNo = document.createElement("p");
      trackNo.className = "title-hash";
      trackNo.textContent = `${Number(i + 1)}`;
      const trackName = document.createElement("p");
      trackName.className = "title-title-name";
      trackName.textContent = playList.name;

      const trackDuration = document.createElement("p");
      trackDuration.className = "title-spotify-duration";
      trackDuration.textContent = timeConvertion(playList.duration_ms);
      songListTrack.append(trackNo);
      songListTrack.append(trackName);

      songListTrack.append(trackDuration);
      songListTrack.onclick = () => {
        changeSource(
          playList.preview_url,
          playList.name,
          data.name,
          data.images[0].url
        );
      };
      albumSongList.append(songListTrack);
    }
  }
});
