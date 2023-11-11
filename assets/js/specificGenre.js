import { getData } from './get.js';

// Replace with the specific Spotify API endpoint you want to access
const apiEndpoint = 'https://api.spotify.com/v1/browse/new-releases';
// const apiEndpoint = "https://api.spotify.com/v1/browse/featured-playlists";

// const apiEndpoint =
//   "https://api.spotify.com/v1/browse/categories/romance/playlists";

const clientId = '3123b1eded6c47ab91bf1fd765a537b6';
const clientSecret = '98598afa94de4a93b71b39e1efd13a80';
const redirectUri = 'http://127.0.0.1:5500/home.html';
const scope = 'user-read-private user-read-email';

async function refreshAccessToken(refreshToken) {
  const tokenUrl = 'https://accounts.spotify.com/api/token';
  const data = new URLSearchParams();
  data.append('grant_type', 'refresh_token');
  data.append('refresh_token', refreshToken);
  const authBase64 = btoa(`${clientId}:${clientSecret}`);
  const response = await fetch(tokenUrl, {
    method: 'POST',
    body: data,
    headers: {
      Authorization: `Basic ${authBase64}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
  if (response.ok) {
    const tokenData = await response.json();
    console.log(tokenData.access_token);
    localStorage.setItem('access_token', tokenData.access_token);
    localStorage.setItem(
      'refresh_token',
      tokenData.refresh_token || refreshToken
    );
    return {
      accessToken: tokenData.access_token,
      // Note: The refresh token might be the same or a new one
      refreshToken: tokenData.refresh_token || refreshToken,
    };
  } else {
    throw new Error('Failed to refresh access token');
  }
}

await refreshAccessToken(localStorage.getItem('refresh_token'));

const specificGenre = getData(apiEndpoint);

//to display
let specificGenreContainer = document.querySelector('.spotify-playlists');
const listDiv = document.createElement('div');
// document.getElementById('genreTitle').textContent = 'Tamil';
listDiv.classList.add('list');
specificGenre.then(data => {
  console.log(data);
  const genre = [...data.albums.items];
  //   genreTitle.classList.add('genreTitle');
  //   genreTitle.textContent = genre[0].album_type;

  genre.forEach(tracks => {
    const dynamicDiv = document.createElement('div');
    dynamicDiv.classList.add('item');

    let imgElement = document.createElement('img');
    imgElement.src = tracks.images[0].url; // Assuming you want to use the first image

    // const playDiv = document.createElement('div');
    // playDiv.classList.add('play');
    // const playSpan = document.createElement('span');
    // playSpan.classList.add('fa', 'fa-play');

    let trackTitle = document.createElement('h4');
    trackTitle.classList.add('songTitle');
    trackTitle.textContent = tracks.name;

    let tarckInfo = document.createElement('p');
    tarckInfo.textContent = tracks.artists[0].name;

    // playDiv.appendChild(playSpan);
    dynamicDiv.append(imgElement, trackTitle, tarckInfo);
    listDiv.appendChild(dynamicDiv);
    specificGenreContainer.append(listDiv);
  });
});

const navigate = destination => {
  console.log('click');

  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4 && xhr.status == 200) {
      document.querySelector('.homeWrapper').innerHTML = xhr.responseText;
    }
  };
  xhr.open('GET', `http://127.0.0.1:5500/${destination}.html`, true);
  xhr.send();
};
