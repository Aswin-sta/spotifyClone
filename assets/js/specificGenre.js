import { getData, refreshAccessToken } from './get.js';

await refreshAccessToken(localStorage.getItem('refresh_token'));

const id = new URLSearchParams(window.location.search).get('id');
const url = `https://api.spotify.com/v1/browse/categories/${id}`;

console.log(url);
const genreData = await getData(url);
const playlistData = await getData(url + '/playlists');
console.log(playlistData);

const genreTitle = document.querySelector('#genre-title');
genreTitle.innerHTML = genreData.name;

const mainContainer = document.getElementById('main-container');

playlistData.playlists.items.forEach(playlist => {
  const playlist_card = document.createElement('div');
  playlist_card.className = 'playlist-card';

  const img_container = document.createElement('div');
  img_container.classList.add('img-container');

  const img_element = document.createElement('img');
  img_element.classList.add('img_element');
  img_element.src = playlist.images[0].url;

  const playButton = document.createElement('img');
  playButton.src = './assets/imgs/spotify-play-button.png';
  playButton.alt = 'Play';
  playButton.classList.add('spotify-play-button');

  img_container.appendChild(img_element);
  img_container.appendChild(playButton);

  const playlist_title = document.createElement('h3');
  playlist_title.className = 'playlist-title';
  playlist_title.innerHTML = playlist.name;

  const description = document.createElement('p');
  description.classList.add('description');
  description.innerHTML = playlist.description;

  playlist_card.append(img_container, playlist_title, description);
  mainContainer.appendChild(playlist_card);

  playlist_card.onclick = () => {
    window.location.href = `musiclist.html?id=${playlist.id}`;
  };
});
