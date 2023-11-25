import { getData} from '../js/get.js';
import { CategoryResponseType } from '../type/getSearchResponse.js';
async function main() {
  const searchCategoryPromise = getData(
    'https://api.spotify.com/v1/browse/categories?country=IN'
  );
 
  searchCategoryPromise.then((data: CategoryResponseType) => {
    const categoryData = data.categories.items;
    //console.log(categoryData);
 
    const searchSection: HTMLElement | null = document.querySelector('section.searchDisplay');
    if (searchSection) {
      categoryData.forEach((element) => {
        const searchContainer: HTMLDivElement = document.createElement('div');
         searchContainer.classList.add('col-5','col-sm-5', 'col-md-4', 'col-lg-3','searchBlock','d-inline-flex','mb-5','ml-3','overflow-hidden');


        const title: HTMLHeadingElement = document.createElement('h2');
        title.classList.add('fw-bolder','p-2','text-sm', 'text-md', 'text-lg');
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
        searchSection.appendChild(searchContainer);
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
      window.location.href = `searchList.html?q=${searchBar.value}`;
    }
  });
}
 
main();