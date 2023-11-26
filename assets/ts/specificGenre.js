var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { getData } from '../js/get.js';
(() => __awaiter(void 0, void 0, void 0, function* () {
    const categoryId = sessionStorage.getItem("id");
    const genreUrl = `https://api.spotify.com/v1/browse/categories/${categoryId}`;
    console.log(genreUrl);
    const [genreData, playlistData] = yield Promise.all([
        getData(genreUrl),
        getData(genreUrl + '/playlists'),
    ]);
    console.log(playlistData);
    const genreTitleElement = document.querySelector('#genreTitleElement');
    genreTitleElement.classList.add('mt-5', 'mb-3');
    if (genreTitleElement) {
        genreTitleElement.innerHTML = genreData.name;
    }
    const mainContainer = document.getElementById('mainContainer');
    mainContainer.classList.add('container', 'd-md-flex', 'd-sm-block', 'flex-wrap', 'text-white', 'justify-content-start');
    if (mainContainer) {
        playlistData.playlists.items.forEach((playlist) => {
            const playlistCard = document.createElement('div');
            playlistCard.classList.add('playlistCard', 'col-md-2m', 'col-sm-12', 'mb-4', 'rounded', 'mr-md-4', 'mr-sm-4', 'shadow', 'p-3');
            const imgContainer = document.createElement('div');
            imgContainer.classList.add('imgContainer', 'position-relative', 'rounded', 'overflow-hidden');
            const imgElement = document.createElement('img');
            imgElement.classList.add('imgElement', 'rounded', 'h-100', 'w-100');
            imgElement.src = playlist.images[0].url;
            const playButton = document.createElement('img');
            playButton.src = './assets/imgs/spotify-play-button.png';
            playButton.alt = 'Play';
            playButton.classList.add('spotifyPlayButton', 'position-absolute');
            imgContainer.appendChild(imgElement);
            imgContainer.appendChild(playButton);
            const playlistTitleElement = document.createElement('h6');
            playlistTitleElement.classList.add('playlistTitleElement', 'text-truncate', 'mt-3', 'font-weight-bold');
            playlistTitleElement.innerHTML = playlist.name;
            const descriptionElement = document.createElement('p');
            descriptionElement.classList.add('decriptionElement', 'small', 'mb-0', 'text-truncate');
            descriptionElement.innerHTML = playlist.description;
            playlistCard.append(imgContainer, playlistTitleElement, descriptionElement);
            mainContainer.appendChild(playlistCard);
            playlistCard.onclick = () => {
                window.location.href = `musiclist.html?id=${playlist.id}&type=${playlist.type}`;
            };
        });
    }
}))();
