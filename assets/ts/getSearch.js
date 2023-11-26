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
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        yield refreshAccessToken(localStorage.getItem('refresh_token'));
        const searchCategoryPromise = getData('https://api.spotify.com/v1/browse/categories?country=IN');
        searchCategoryPromise.then((data) => {
            const categoryData = data.categories.items;
            //console.log(categoryData);
            const searchSection = document.querySelector('section.searchDisplay');
            if (searchSection) {
                categoryData.forEach((element) => {
                    const searchList = document.getElementById("searchList");
                    searchList.classList.add('ml-3');
                    const searchContainerWrapper = document.createElement('div');
                    const searchContainer = document.createElement('div');
                    searchContainerWrapper.classList.add('col-6', 'col-sm-6', 'col-md-4', 'col-lg-3', 'searchBlock', 'mb-4', 'overflow-hidden');
                    searchContainer.classList.add('searchBlockTile', 'overflow-hidden', 'position-relative');
                    const title = document.createElement('h2');
                    title.classList.add('fw-bolder', 'p-2');
                    title.textContent = element.name;
                    let imageElement = document.createElement('img');
                    imageElement.classList.add('img-thumbnail', 'position-absolute', 'img-fluid');
                    imageElement.src = element.icons[0].url;
                    searchContainer.append(title, imageElement);
                    searchContainer.classList.add('clickable');
                    searchContainer.onclick = () => {
                        window.location.href = `specificGenre.html?id=${element.id}`;
                    };
                    const randomColor = getRandomColor();
                    searchContainer.style.backgroundColor = randomColor;
                    searchContainerWrapper.append(searchContainer);
                    searchList.appendChild(searchContainerWrapper);
                });
            }
        });
    });
}
// Function to generate random colours
function getRandomColor() {
    const red = Math.floor(Math.random() * 256);
    const green = Math.floor(Math.random() * 256);
    const blue = Math.floor(Math.random() * 256);
    return `rgb(${red}, ${green}, ${blue})`;
}
const searchBar = document.querySelector('.searchInput');
if (searchBar) {
    searchBar.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            window.location.href = `searchList.html?q=${searchBar.value}`;
        }
    });
}
main();
