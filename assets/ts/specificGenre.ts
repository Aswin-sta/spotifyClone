import { getData } from '../js/get.js';
import { specificGenreResponseType } from '../type/specificGenreResponse.js';
import { changeIframeContent } from "../js/changeIframeContent.js";

(async () => {
  const categoryId = sessionStorage.getItem("id");
  const genreUrl = `https://api.spotify.com/v1/browse/categories/${categoryId}`;
  console.log(genreUrl);

  const skeletonContainer: HTMLElement | null = document.querySelector('.skeletonContainer');
  let playlistData: any;

  const genreTitleElement = document.querySelector('#genreTitleElement') as HTMLHeadingElement;
  const mainContainer = document.getElementById('mainContainer') as HTMLDivElement;
  try {
    // Display the skeleton container while waiting for data
    if (skeletonContainer) skeletonContainer.style.display = 'block';

    const [genreData, loadedPlaylistData] = await Promise.all([
      getData(genreUrl),
      getData(`${genreUrl}/playlists`),
    ]);

    console.log(loadedPlaylistData);


    // Ensure genreData and playlistData are available
    if (genreData && loadedPlaylistData) {
      playlistData = loadedPlaylistData;

      // Wait for the genre title to load
      genreTitleElement.addEventListener('load', checkAllResourcesLoaded);
      genreTitleElement.classList.add('mt-5', 'mb-3');
      genreTitleElement.innerHTML = genreData.name;

      mainContainer?.classList.add(
        'container',
        'd-md-flex',
        'd-sm-block',
        'flex-wrap',
        'text-white',
        'justify-content-start'
      );

      mainContainer.style.display = 'none'; // Initially hide the main container

      playlistData.playlists.items.forEach((playlist: specificGenreResponseType[0]) => {
        const playlistCard: HTMLDivElement = document.createElement('div');
        playlistCard.classList.add(
          'playlistCard',
          'col-md-2m',
          'col-sm-12',
          'mb-4',
          'rounded',
          'mr-md-4',
          'mr-sm-4',
          'shadow',
          'p-3'
        );

        const imgContainer: HTMLDivElement = document.createElement('div');
        imgContainer.classList.add('imgContainer', 'position-relative', 'rounded', 'overflow-hidden');

        const imgElement: HTMLImageElement = document.createElement('img');
        imgElement.classList.add('imgElement', 'rounded', 'h-100', 'w-100');
        imgElement.src = playlist.images[0].url;

        const playButton: HTMLImageElement = document.createElement('img');
        playButton.src = './assets/imgs/spotify-play-button.png';
        playButton.alt = 'Play';
        playButton.classList.add('spotifyPlayButton', 'position-absolute');

        imgContainer.appendChild(imgElement);
        imgContainer.appendChild(playButton);

        const playlistTitleElement: HTMLHeadingElement = document.createElement('h6');
        playlistTitleElement.classList.add('playlistTitleElement', 'text-truncate', 'mt-3', 'font-weight-bold');
        playlistTitleElement.innerHTML = playlist.name;
        playlistTitleElement.addEventListener('load', checkAllResourcesLoaded);

        const descriptionElement: HTMLParagraphElement = document.createElement('p');
        descriptionElement.classList.add('decriptionElement', 'small', 'mb-0', 'text-truncate');
        descriptionElement.innerHTML = playlist.description;

        playlistCard.append(imgContainer, playlistTitleElement, descriptionElement);
        mainContainer.appendChild(playlistCard);

        // Wait for the image to load
        imgElement.addEventListener('load', checkAllResourcesLoaded);

        // Wait for the description to load
        descriptionElement.addEventListener('load', checkAllResourcesLoaded);

        playlistCard.onclick = () => {
          document.location.href = "musiclist-1.html";
          sessionStorage.setItem("id", playlist.id);
          sessionStorage.setItem("type", playlist.type);
        };
      });
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    if (skeletonContainer) skeletonContainer.style.display = 'none';
  }

  function checkAllResourcesLoaded() {
    const allNamesLoaded = document.querySelectorAll('.playlistTitleElement').length === playlistData.playlists.items.length;
    const allImagesLoaded = document.querySelectorAll('.imgElement').length === playlistData.playlists.items.length;
    const allDescriptionsLoaded = document.querySelectorAll('.decriptionElement').length === playlistData.playlists.items.length;

    // Check if all images and descriptions are loaded
    if (allImagesLoaded && allDescriptionsLoaded && allNamesLoaded) {
      // Hide the skeleton container when all resources are loaded
      if (skeletonContainer) skeletonContainer.style.display = 'none';
      mainContainer.style.display = 'block'; // Show the main container when everything is loaded
    }
  }
})();

document.querySelector("#loginLink")?.addEventListener('click', () => changeIframeContent("profile-1.html"));
document.querySelector("#navHomeButton")?.addEventListener('click', () => changeIframeContent("home-1.html"));
document.querySelector("#navSearchButton")?.addEventListener('click', () => changeIframeContent("searchpage-1.html"));
