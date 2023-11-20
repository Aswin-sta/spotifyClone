import { getData, refreshAccessToken } from './get.js';

await refreshAccessToken(localStorage.getItem('refresh_token'));

// const id = new URLSearchParams(window.location.search).get('id');
const id = new URLSearchParams(window.location.search).get('id');
const url = `https://api.spotify.com/v1/browse/categories/tracks${id}`;

const newReleasesPromise = getData(id);

function timeConvertion(duration_ms) {
  const totalSeconds = Math.floor(duration_ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const remainingSeconds = totalSeconds % 60;
  const formattedSeconds =
    remainingSeconds < 10 ? `0${remainingSeconds}` : `${remainingSeconds}`;
  return `${minutes}:${formattedSeconds}`;
}

// function convertISOStringToCustomFormat(isoString) {
//   const date = new Date(isoString);
//   const year = date.getFullYear();
//   const month = (date.getMonth() + 1).toString().padStart(2, "0");
//   const day = date.getDate().toString().padStart(2, "0");
//   return `${year}:${month}:${day}`;
// }

newReleasesPromise.then(data => {
  console.log(data);
  //bannerImage
  const bannerImage = document.querySelector('.banner-img img');
  bannerImage.src = data.images[0].url;
  //banner Title
  const bannerTitle = document.querySelector('.banner-header h1');
  bannerTitle.textContent = data.name;
  //banner description
  const bannerDescription = document.querySelector('.banner-header-desc');
  bannerDescription.textContent = data.description;
  //iteratable objects of array
  const musicDataList = data.tracks.items;
  const albumSongList = document.querySelector('.album-song-list');
  for (let i = 0; i < data.tracks.items.length; i++) {
    const songListTrack = document.createElement('div');
    songListTrack.className = 'song-list-track';
    songListTrack.id = `Track-${Number(i + 1)}`;
    const trackNo = document.createElement('p');
    trackNo.className = 'title-hash';
    trackNo.textContent = `${Number(i + 1)}`;

    const trackName = document.createElement('p');
    trackName.className = 'title-title-name';
    trackName.textContent = musicDataList[i].name;
    // const trackAlbum = document.createElement("p");
    // trackAlbum.className = "title-album";
    // trackAlbum.textContent = musicDataList[i].track.name;
    // const trackDateAdded = document.createElement("p");
    // trackDateAdded.className = "title-date";
    // trackDateAdded.textContent = convertISOStringToCustomFormat(
    //   musicDataList[i].added_at
    // );
    const trackDuration = document.createElement('p');
    trackDuration.className = 'title-spotify-duration';
    trackDuration.textContent = timeConvertion(musicDataList[i].duration_ms);
    songListTrack.append(trackNo);
    songListTrack.append(trackName);

    // songListTrack.append(trackAlbum);
    // songListTrack.append(trackDateAdded);

    console.log(songListTrack);
    songListTrack.append(trackDuration);
    albumSongList.append(songListTrack);
  }
});
