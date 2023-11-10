const searchSection = document.querySelector('section.searchDisplay');
for(i =0; i< 30; i++){
    const searchContainer = document.createElement("div");
    searchContainer.classList.add("search-block");

    const title = document.createElement("h2");
    title.textContent = "Pop";

    let dynamicImage = document.createElement('img');
    dynamicImage.src = "https://www.adobe.com/express/create/cover/media_1bcba2af87ed5daee44370e652ca6b5ec254d399a.jpeg?width=750&format=jpeg&optimize=medium"

    searchContainer.append(title, dynamicImage);
    searchSection.appendChild(searchContainer);

    const randomColor = getRandomColor();
    searchContainer.style.backgroundColor = randomColor;

}
function getRandomColor() {
    const red = Math.floor(Math.random() * 256);
    const green = Math.floor(Math.random() * 256);
    const blue = Math.floor(Math.random() * 256);
    return `rgb(${red}, ${green}, ${blue})`;
}

//Media player
const spotifyPlayer = document.getElementsByClassName('spotify-player');
const coverImageDiv = document.getElementById('albumDetails');

const imgElement = document.createElement('img');
imgElement.src = albumData.imgSrc;
imgElement.alt = 'Album Cover';

const ulElement = document.createElement('ul');

const liTitleElement = document.createElement('li');
const h3Element = document.createElement('h3');
h3Element.textContent = albumData.songTitle;
liTitleElement.appendChild(h3Element);

const liArtistElement = document.createElement('li');
const pElement = document.createElement('p');
pElement.textContent = albumData.artistName;
liArtistElement.appendChild(pElement);

ulElement.appendChild(liTitleElement);
ulElement.appendChild(liArtistElement);

coverImageDiv.appendChild(imgElement);
coverImageDiv.appendChild(ulElement);

spotifyPlayer.appendChild(coverImageDiv);