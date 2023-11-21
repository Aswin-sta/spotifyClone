import { getData, refreshAccessToken } from './get.js';

try {
  // Refresh access token
  await refreshAccessToken(localStorage.getItem('refresh_token'));

  // Get category ID from URL
  const categoryId = new URLSearchParams(window.location.search).get('id');
  const genreUrl = `https://api.spotify.com/v1/browse/categories/${categoryId}`;

  console.log(genreUrl);

  // Fetch genre data and playlist data concurrently
  const [genreData, playlistData] = await Promise.all([
    getData(genreUrl),
    getData(`${genreUrl}/playlists`),
  ]);

  console.log(playlistData);

  // Update genre title element
  const genreTitleElement = document.querySelector('#genreTitleElement');
  genreTitleElement.innerHTML = genreData.name;

  // Get main container element
  const mainContainer = document.getElementById('mainContainer');

  // Iterate through playlist items
  playlistData.playlists.items.forEach(playlist => {
    // Create playlist card element
    const playlistCard = document.createElement('div');
    playlistCard.className = 'playlistCard';

    // Create image container
    const imgContainer = document.createElement('div');
    imgContainer.classList.add('imgContainer');

    // Create image element
    const imgElement = document.createElement('img');
    imgElement.classList.add('imgElement');
    imgElement.src = playlist.images[0]?.url || ''; // Use optional chaining to avoid errors

    // Create play button element
    const playButton = document.createElement('img');
    playButton.src = './assets/imgs/spotify-play-button.png';
    playButton.alt = 'Play';
    playButton.classList.add('spotifyPlayButton');

    // Append image and play button to image container
    imgContainer.append(imgElement, playButton);

    // Create playlist title element
    const playlistTitleElement = document.createElement('h3');
    playlistTitleElement.className = 'playlistTitleElement';
    playlistTitleElement.innerHTML = playlist.name;

    // Create description element
    const descriptionElement = document.createElement('p');
    descriptionElement.classList.add('descriptionElement');
    descriptionElement.innerHTML = playlist.description;

    // Append elements to playlist card
    playlistCard.append(imgContainer, playlistTitleElement, descriptionElement);

    // Append playlist card to main container
    mainContainer.appendChild(playlistCard);

    // Add click event to navigate to musiclist.html
    playlistCard.onclick = () => {
      window.location.href = `musiclist.html?id=${playlist.id}&type=${playlist.type}`;
    };
  });
} catch (error) {
  console.error('An error occurred:', error.message);
  // Handle the error as needed, e.g., show a user-friendly message.
}
