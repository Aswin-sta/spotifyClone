var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var _a, _b, _c;
import { getData } from '../js/get.js';
import { changeIframeContent } from "../js/changeIframeContent.js";
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        // Display the loading skeleton while waiting for data
        const skeletonContainer = document.querySelector('.skeletonContainer');
        if (skeletonContainer)
            skeletonContainer.style.display = 'block';
        try {
            const data = yield getData('https://api.spotify.com/v1/browse/categories?country=IN');
            const categoryData = data.categories.items;
            const searchSection = document.querySelector('section.searchDisplay');
            if (searchSection) {
                const loadImagePromises = [];
                categoryData.forEach((element) => {
                    const searchContainer = document.createElement('div');
                    searchContainer.classList.add('col-5', 'col-sm-5', 'col-md-4', 'col-lg-3', 'searchBlock', 'd-inline-flex', 'mb-5', 'ml-3', 'overflow-hidden');
                    const title = document.createElement('h2');
                    title.classList.add('fw-bolder', 'p-2', 'text-sm', 'text-md', 'text-lg');
                    title.textContent = element.name;
                    const imageElement = document.createElement('img');
                    imageElement.classList.add('img-thumbnail', 'position-absolute', 'img-fluid');
                    imageElement.src = element.icons[0].url;
                    const loadImagePromise = new Promise((resolve) => {
                        const handleLoad = () => {
                            resolve();
                        };
                        // In case of an error loading the image
                        const handleError = () => {
                            resolve();
                        };
                        imageElement.addEventListener('load', handleLoad);
                        imageElement.addEventListener('error', handleError);
                    });
                    loadImagePromises.push(loadImagePromise);
                    searchContainer.append(title, imageElement);
                    searchContainer.classList.add('clickable');
                    searchContainer.onclick = () => {
                        document.location.href = "specificGenre-1.html";
                        sessionStorage.setItem("id", element.id);
                    };
                    const randomColor = getRandomColor();
                    searchContainer.style.backgroundColor = randomColor;
                    searchSection.appendChild(searchContainer);
                });
                // Wait for all images to load before hiding the skeleton container
                yield Promise.all(loadImagePromises);
            }
        }
        catch (error) {
            console.error('Error fetching data:', error);
        }
        finally {
            // Hide the loading skeleton after data is loaded
            if (skeletonContainer)
                skeletonContainer.style.display = 'none';
        }
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
            document.location.href = "searchList-1.html";
            sessionStorage.setItem("searchQuery", searchBar.value);
        }
    });
}
main();
(_a = document.querySelector("#loginLink")) === null || _a === void 0 ? void 0 : _a.addEventListener('click', () => {
    changeIframeContent("profile-1.html");
});
(_b = document.querySelector("#navHomeButton")) === null || _b === void 0 ? void 0 : _b.addEventListener('click', () => {
    changeIframeContent("home-1.html");
});
(_c = document.querySelector("#navSearchButton")) === null || _c === void 0 ? void 0 : _c.addEventListener('click', () => {
    changeIframeContent("searchpage-1.html");
});
