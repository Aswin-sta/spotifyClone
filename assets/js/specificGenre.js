import { getData } from './get.js';
import { refreshAccessToken } from './main.js';

await refreshAccessToken(localStorage.getItem('refresh_token'));

const id = new URLSearchParams(window.location.search).get('id');
const url = `https://api.spotify.com/v1/browse/categories/${id}`;

console.log(url);
const genreData = await getData(url);
const playlistData = await getData(url + '/playlists');

const genreTitle = document.querySelector('#genre-title');
genreTitle.innerHTML = genreData.name;

const mainContainer = document.getElementById('main-container');
const container = document.createElement('div');
container.className = 'playlist-container';
// const playlistsData = [...playlistData.playlists.items];
// console.log(playlistsData);

playlistData.playlists.items.forEach(playlist => {
  console.log(playlist);
  const playlistLink = document.createElement('a');
  const playlistUrl = `musiclist.html?id=${playlist.id}`;

  playlistLink.setAttribute('href', playlistUrl);

  const playlist_card = document.createElement('div');
  playlist_card.className = 'playlist-card';

  const interdata = getData(playlist.href);
  console.log(interdata);

  const image_card_maindiv = document.createElement('div');
  const image_div = document.createElement('div');
  image_div.className = 'image_div';

  const img_element = document.createElement('img');
  img_element.classList.add('img_element');
  img_element.src = playlist.images[0].url;

  const playlist_title = document.createElement('h3');
  playlist_title.className = 'playlist_title';
  playlist_title.innerHTML = playlist.name;

  const description = document.createElement('p');
  description.classList.add('description');
  description.innerHTML = playlist.description;

  image_card_maindiv.append(image_div, img_element, description);
  playlist_card.append(img_element, playlist_title, description);
  playlistLink.appendChild(playlist_card);
  mainContainer.appendChild(playlistLink);
});
