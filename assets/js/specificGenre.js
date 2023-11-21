import { getData, refreshAccessToken } from './get.js';

await refreshAccessToken(localStorage.getItem('refresh_token'));

const categoryId = new URLSearchParams(window.location.search).get('id');
const genreUrl = `https://api.spotify.com/v1/browse/categories/${categoryId}`;
console.log(genreUrl);

const genreData = await getData(genreUrl);
const playlistData = await getData(genreUrl + '/playlists');
console.log(playlistData);

const genreTitleElement = document.querySelector('#genreTitleElement');
genreTitleElement.innerHTML = genreData.name;

const mainContainer = document.getElementById('mainContainer');

playlistData.playlists.items.forEach(playlist => {
  const playlistCard = document.createElement('div');
  playlistCard.className = 'playlistCard';

  const imgContainer = document.createElement('div');
  imgContainer.classList.add('imgContainer');

  const imgElement = document.createElement('img');
  imgElement.classList.add('imgElement');
  imgElement.src = playlist.images[0].url;

  const playButton = document.createElement('img');
  playButton.src = './assets/imgs/spotify-play-button.png';
  playButton.alt = 'Play';
  playButton.classList.add('spotifyPlayButton');

  imgContainer.appendChild(imgElement);
  imgContainer.appendChild(playButton);

  const playlistTitleElement = document.createElement('h3');
  playlistTitleElement.className = 'playlistTitleElement';
  playlistTitleElement.innerHTML = playlist.name;

  const descriptionElement = document.createElement('p');
  descriptionElement.classList.add('descriptionElement');
  descriptionElement.innerHTML = playlist.description;

  playlistCard.append(imgContainer, playlistTitleElement, descriptionElement);
  mainContainer.appendChild(playlistCard);

  playlistCard.onclick = () => {
    window.location.href = `musiclist.html?id=${playlist.id}&type=${playlist.type}`;
  };
});
