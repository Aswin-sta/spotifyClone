import { getData, refreshAccessToken } from '../js/get.js';
import { specificGenreResponseType } from '../types/specificGenreResponse.js';
(async () => {
  await refreshAccessToken(localStorage.getItem('refresh_token'));

  const categoryId = new URLSearchParams(window.location.search).get('id');
  const genreUrl = `https://api.spotify.com/v1/browse/categories/${categoryId}`;
  console.log(genreUrl);

  
  const [genreData, playlistData] = await Promise.all([
    getData(genreUrl),
    getData(genreUrl + '/playlists'), 
  ]);

  console.log(playlistData);

  const genreTitleElement = document.querySelector('#genreTitleElement') as HTMLHeadingElement;
  // genreTitleElement.classList.add('mr-10')
  if (genreTitleElement) {
    genreTitleElement.innerHTML = genreData.name;
  }

  const mainContainer = document.getElementById('mainContainer') as HTMLDivElement;
  mainContainer.classList.add(
    'container-fluid',
    'd-flex',
    'flex-wrap',
    'gap-2',
    'align-items-start',
    'justify-content-start',
    'mx-2',
    'text-white'
  );
  if (mainContainer) {
    playlistData.playlists.items.forEach((playlist: specificGenreResponseType[0]) => {
      const playlistCard: HTMLDivElement = document.createElement('div');
      playlistCard.classList.add(
        'p-3',
        'mb-3',
        'rounded',
        'bg-secondary',
        'shadow-sm',
        'w-5',
        'h-5'

      );
      const imgContainer: HTMLDivElement = document.createElement('div');
      imgContainer.classList.add('imgContainer', 'position-relative');

      const imgElement: HTMLImageElement = document.createElement('img');
      imgElement.classList.add('imgElement', 'img-fluid', 'rounded-lg');
      imgElement.src = playlist.images[0].url;

      const playButton: HTMLImageElement = document.createElement('img');
      playButton.src = './assets/imgs/spotify-play-button.png';
      playButton.alt = 'Play';
      playButton.classList.add(
        'spotifyPlayButton',
        'mt-3',
        'img-fluid',
        'rounded-circle',
        'position-absolute'
      );
      imgContainer.appendChild(imgElement);
      imgContainer.appendChild(playButton);

      const playlistTitleElement: HTMLHeadingElement = document.createElement('h3');
      playlistTitleElement.className = 'playlistTitleElement';
      playlistTitleElement.innerHTML = playlist.name;

      const descriptionElement: HTMLParagraphElement = document.createElement('p');
      descriptionElement.classList.add('dscriptionElement');
      descriptionElement.innerHTML = playlist.description;

      playlistCard.append(imgContainer, playlistTitleElement, descriptionElement);
      mainContainer.appendChild(playlistCard);

      playlistCard.onclick = () => {
        window.location.href = `musiclist.html?id=${playlist.id}&type=${playlist.type}`;
      };
    });
  }
})();
