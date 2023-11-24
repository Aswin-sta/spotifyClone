import { getData, refreshAccessToken } from './get.js';

await refreshAccessToken(localStorage.getItem('refresh_token'));
const searchCateogoryPromise = getData(
  'https://api.spotify.com/v1/browse/categories?country=IN'
);

// searchCateogoryPromise.then(data => {
//   const categoryData = [...data.categories.items];
//   console.log(categoryData);
//   const searchSection = document.querySelector('section.searchDisplay');
//   categoryData.forEach(elements => {
//     const searchContainer = document.createElement('div');
//     searchContainer.classList.add('searchBlock');

//     const title = document.createElement('h2');
//     title.textContent = elements.name;

//     let imageElement = document.createElement('img');
//     imageElement.src = elements.icons[0].url;

//     searchContainer.append(title, imageElement);
//     searchSection.appendChild(searchContainer);

//     searchContainer.onclick = () => {
//       window.location.href = `specificGenre.html?id=${elements.id}`;
//     }

//     const randomColor = getRandomColor();
//     searchContainer.style.backgroundColor = randomColor;
//   });
// });
searchCateogoryPromise.then(data => {
  const categoryData = [...data.categories.items];
  console.log(categoryData);
  const searchSection = document.querySelector('section.searchDisplay');
  categoryData.forEach(elements => {
    // Create a Bootstrap card element
    const searchContainer = document.createElement('div');
    searchContainer.classList.add('searchBlock','d-inline-flex','card','ml-3','overflow-hidden');

    const cardBody = document.createElement('div');
    cardBody.classList.add('card-body');

    // Use Bootstrap card-title class for the title
    const title = document.createElement('h2');
    title.classList.add('card-title','fw-bolder');
    title.textContent = elements.name;

    // Use Bootstrap img-thumbnail class for the image
    let imageElement = document.createElement('img');
    imageElement.classList.add('img-thumbnail','position-absolute');
    imageElement.src = elements.icons[0].url;

    cardBody.append(title, imageElement);
    searchContainer.appendChild(cardBody);

    // Use Bootstrap clickable class for the container
    searchContainer.classList.add('clickable');
    searchContainer.onclick = () => {
      window.location.href = `specificGenre.html?id=${elements.id}`;
    }

    // Use Bootstrap background color utility class
    const randomColor = getRandomColor();
    searchContainer.style.backgroundColor = randomColor;

    // Append the Bootstrap-styled container to the search section
    searchSection.appendChild(searchContainer);
  });
});

//Function to generate random colours
function getRandomColor() {
  const red = Math.floor(Math.random() * 256);
  const green = Math.floor(Math.random() * 256);
  const blue = Math.floor(Math.random() * 256);
  return `rgb(${red}, ${green}, ${blue})`;
}

const searchBar = document.querySelector('.searchInput');
searchBar.addEventListener('keydown', event => {
  if (event.key === 'Enter') {
    window.location.href = `searchList.html?q=${searchBar.value}`;
  }
});
