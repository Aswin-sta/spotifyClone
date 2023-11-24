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
    // genreTitleElement.classList.add('mr-10')
    if (genreTitleElement) {
        genreTitleElement.innerHTML = genreData.name;
    }
    const mainContainer = document.getElementById('mainContainer');
    mainContainer.classList.add('container-fluid', 'd-flex', 'flex-wrap', 'gap-2', 'align-items-start', 'justify-content-start', 'mx-2', 'text-white');
    if (mainContainer) {
        playlistData.playlists.items.forEach((playlist) => {
            const playlistCard = document.createElement('div');
            playlistCard.classList.add('p-3', 'mb-3', 'rounded', 'bg-secondary', 'shadow-sm', 'w-5', 'h-5');
            const imgContainer = document.createElement('div');
            imgContainer.classList.add('imgContainer', 'position-relative');
            const imgElement = document.createElement('img');
            imgElement.classList.add('imgElement', 'img-fluid', 'rounded-lg');
            imgElement.src = playlist.images[0].url;
            const playButton = document.createElement('img');
            playButton.src = './assets/imgs/spotify-play-button.png';
            playButton.alt = 'Play';
            playButton.classList.add('spotifyPlayButton', 'mt-3', 'img-fluid', 'rounded-circle', 'position-absolute');
            imgContainer.appendChild(imgElement);
            imgContainer.appendChild(playButton);
            const playlistTitleElement = document.createElement('h3');
            playlistTitleElement.className = 'playlistTitleElement';
            playlistTitleElement.innerHTML = playlist.name;
            const descriptionElement = document.createElement('p');
            descriptionElement.classList.add('dscriptionElement');
            descriptionElement.innerHTML = playlist.description;
            playlistCard.append(imgContainer, playlistTitleElement, descriptionElement);
            mainContainer.appendChild(playlistCard);
            playlistCard.onclick = () => {
                window.location.href = `musiclist.html?id=${playlist.id}&type=${playlist.type}`;
            };
        });
    }
}))();
