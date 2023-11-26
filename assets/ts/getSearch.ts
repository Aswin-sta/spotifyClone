import { getData, refreshAccessToken } from '../js/get.js';
import { CategoryResponseType } from '../type/getSearchResponse.js';
async function main() {
  await refreshAccessToken(localStorage.getItem('refresh_token'));
  const searchCategoryPromise = getData(
    'https://api.spotify.com/v1/browse/categories?country=IN'
  );
 
  searchCategoryPromise.then((data: CategoryResponseType) => {
    const categoryData = data.categories.items;
    //console.log(categoryData);
 
    const searchSection: HTMLElement | null = document.querySelector('section.searchDisplay');
    if (searchSection) {
      categoryData.forEach((element) => {
        const searchList = document.getElementById("searchList") as HTMLElement;
        searchList.classList.add('ml-3');
        const searchContainerWrapper: HTMLDivElement = document.createElement('div');
        const searchContainer: HTMLDivElement = document.createElement('div');
         searchContainerWrapper.classList.add('col-6',
         'col-sm-6',
         'col-md-4',
         'col-lg-3','searchBlock','mb-4'
         ,'overflow-hidden');

         searchContainer.classList.add('searchBlockTile','overflow-hidden','position-relative')

        const title: HTMLHeadingElement = document.createElement('h2');
        title.classList.add('fw-bolder','p-2');
        title.textContent = element.name;
 
        let imageElement: HTMLImageElement = document.createElement('img');
        imageElement.classList.add('img-thumbnail','position-absolute','img-fluid');
        imageElement.src = element.icons[0].url;
 
        searchContainer.append(title, imageElement);
        
        searchContainer.classList.add('clickable');
        searchContainer.onclick = () => {
          window.location.href = `specificGenre.html?id=${element.id}`;
        };
        const randomColor: string = getRandomColor();
        searchContainer.style.backgroundColor = randomColor;
        searchContainerWrapper.append(searchContainer)
        searchList.appendChild(searchContainerWrapper);
      });
    }
  });
}
// Function to generate random colours
function getRandomColor(): string {
  const red: number = Math.floor(Math.random() * 256);
  const green: number = Math.floor(Math.random() * 256);
  const blue: number = Math.floor(Math.random() * 256);
  return `rgb(${red}, ${green}, ${blue})`;
}
 
const searchBar: HTMLInputElement | null = document.querySelector('.searchInput');
if (searchBar) {
  searchBar.addEventListener('keydown', (event: KeyboardEvent) => {
    if (event.key === 'Enter') {
      window.location.href = `searchList.html?searchItem=${searchBar.value}`;
    }
  });
}
 
main();