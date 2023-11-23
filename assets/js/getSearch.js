import { getData, refreshAccessToken } from './get.js';
// Function to fetch data 
async function fetchData() {
  await refreshAccessToken(localStorage.getItem('refresh_token'));
  const data = await getData('https://api.spotify.com/v1/browse/categories?country=IN');
  return data.categories.items.map((element) => ({
    name: element.name,
    imageUrl: element.icons[0].url,
    id: element.id,
  }));
}

// Function to generate random colours
const getRandomColor = () => `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`;

// Function to create search container
function createSearchContainer(element) {
  const searchContainer = document.createElement('div');
  searchContainer.classList.add('searchBlock');

  const title = document.createElement('h2');
  title.textContent = element.name;

  const imageElement = document.createElement('img');
  imageElement.src = element.imageUrl;
  imageElement.alt = 'Category Cover';

  searchContainer.append(title, imageElement);

  searchContainer.onclick = () => {
    window.location.href = `specificGenre.html?id=${element.id}`;
  };

  const randomColor = getRandomColor();
  searchContainer.style.backgroundColor = randomColor;

  return searchContainer;
}

// Entry point 
async function main() {
  try {
    const categoryData = await fetchData();

    console.log(categoryData);

    const searchSection = document.querySelector('section.searchDisplay');

    categoryData.forEach((element) => {
      const searchContainer = createSearchContainer(element);
      searchSection.appendChild(searchContainer);
    });
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Event listener for search input
const searchBar = document.querySelector('.searchInput');
searchBar.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    window.location.href = `searchList.html?q=${searchBar.value}`;
  }
});


main();
