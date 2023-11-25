var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { getData, refreshAccessToken } from '../js/get.js';
(() => __awaiter(void 0, void 0, void 0, function* () {
    yield refreshAccessToken(localStorage.getItem('refresh_token'));
    const categoryId = new URLSearchParams(window.location.search).get('id');
    const genreUrl = `https://api.spotify.com/v1/browse/categories/${categoryId}`;
    console.log(genreUrl);
    const [genreData, playlistData] = yield Promise.all([
        getData(genreUrl),
        getData(genreUrl + '/playlists'),
    ]);
    console.log(playlistData);
    const genreTitleElement = document.querySelector('#genreTitleElement');
    genreTitleElement.classList.add('mt-4', 'mb-3');
    if (genreTitleElement) {
        genreTitleElement.innerHTML = genreData.name;
    }
    const mainContainer = document.getElementById('mainContainer');
    mainContainer.classList.add('container-fluid', 'row', 'd-flex', 'flex-wrap', 'justify-content-evenly', 'text-white');
    if (mainContainer) {
        playlistData.playlists.items.forEach((playlist) => {
            const playlistCard = document.createElement('div');
            playlistCard.classList.add('playlistCard', 'col-sm-6', 'col-lg-2', 'col-md-4', 'md-mr-0', 'mb-4', 'rounded', 'mr-4', 'shadow', 'p-3');
            const imgContainer = document.createElement('div');
            imgContainer.classList.add('imgContainer', 'position-relative', 'rounded', 'overflow-hidden');
            const imgElement = document.createElement('img');
            imgElement.classList.add('imgElement', 'rounded', 'w-100', 'h-50');
            imgElement.src = playlist.images[0].url;
            const playButton = document.createElement('img');
            playButton.src = './assets/imgs/spotify-play-button.png';
            playButton.alt = 'Play';
            playButton.classList.add('spotifyPlayButton', 'img-fluid', 'rounded-circle', 'position-absolute', 'top-50', 'start-50', 'translate-middle');
            imgContainer.appendChild(imgElement);
            imgContainer.appendChild(playButton);
            const playlistTitleElement = document.createElement('h3');
            playlistTitleElement.classList.add('playlistTitleElement', 'text-truncate', 'mt-3', 'fw-bold');
            playlistTitleElement.innerHTML = playlist.name;
            const descriptionElement = document.createElement('p');
            descriptionElement.classList.add('decriptionElement', 'small', 'mb-0');
            descriptionElement.innerHTML = playlist.description;
            playlistCard.append(imgContainer, playlistTitleElement, descriptionElement);
            mainContainer.appendChild(playlistCard);
            playlistCard.onclick = () => {
                window.location.href = `musiclist.html?id=${playlist.id}&type=${playlist.type}`;
            };
        });
    }
}))();
