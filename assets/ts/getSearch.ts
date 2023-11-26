import { getData } from '../js/get.js';
import { CategoryResponseType } from '../type/getSearchResponse.js';
import { changeIframeContent } from "../js/changeIframeContent.js";

async function main() {
  // Display the loading skeleton while waiting for data
  const skeletonContainer: HTMLElement | null = document.querySelector('.skeletonContainer');
  if (skeletonContainer) skeletonContainer.style.display = 'block';

  try {
    const data = await getData('https://api.spotify.com/v1/browse/categories?country=IN');
    const categoryData = (data as CategoryResponseType).categories.items;

    const searchSection: HTMLElement | null = document.querySelector('section.searchDisplay');
    if (searchSection) {
      const loadImagePromises: Promise<void>[] = [];

      categoryData.forEach((element) => {
        const searchContainer: HTMLDivElement = document.createElement('div');
        searchContainer.classList.add('col-5', 'col-sm-5', 'col-md-4', 'col-lg-3', 'searchBlock', 'd-inline-flex', 'mb-5', 'ml-3', 'overflow-hidden');

        const title: HTMLHeadingElement = document.createElement('h2');
        title.classList.add('fw-bolder', 'p-2', 'text-sm', 'text-md', 'text-lg');
        title.textContent = element.name;

        const imageElement: HTMLImageElement = document.createElement('img');
        imageElement.classList.add('img-thumbnail', 'position-absolute', 'img-fluid');
        imageElement.src = element.icons[0].url;

        const loadImagePromise = new Promise<void>((resolve) => {
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
        const randomColor: string = getRandomColor();
        searchContainer.style.backgroundColor = randomColor;
        searchSection.appendChild(searchContainer);
      });

      // Wait for all images to load before hiding the skeleton container
      await Promise.all(loadImagePromises);
    }
  } catch (error) {
    console.error('Error fetching data:', error);
  } finally {
    // Hide the loading skeleton after data is loaded
    if (skeletonContainer) skeletonContainer.style.display = 'none';
  }
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
      document.location.href = "searchList-1.html";
      sessionStorage.setItem("searchQuery", searchBar.value);
    }
  });
}

main();

document.querySelector("#loginLink")?.addEventListener('click', () => {
  changeIframeContent("profile-1.html");
});

document.querySelector("#navHomeButton")?.addEventListener('click', () => {
  changeIframeContent("home-1.html");
});

document.querySelector("#navSearchButton")?.addEventListener('click', () => {
  changeIframeContent("searchpage-1.html");
});
