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
import { getData } from "../js/get.js";
import { playSong } from "../js/player.js";
import { changeIframeContent } from "../js/changeIframeContent.js";
(() => __awaiter(void 0, void 0, void 0, function* () {
    function isPlaylistTrack(track) {
        return 'track' in track && typeof track.track.uri === 'string';
    }
    function isAlbumTrack(track) {
        return typeof track.uri === 'string';
    }
    //session storage search parameters
    const id = sessionStorage.getItem("id");
    const type = sessionStorage.getItem("type");
    //musiclist api  
    const newReleasesPromise = getData("https://api.spotify.com/v1/" + type + "s/" + id);
    //function to convert ms to min:sec format
    function timeConvertion(duration_ms) {
        const totalSeconds = Math.floor(duration_ms / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const remainingSeconds = totalSeconds % 60;
        const formattedSeconds = remainingSeconds < 10 ? `0${remainingSeconds}` : `${remainingSeconds}`;
        return `${minutes}:${formattedSeconds}`;
    }
    newReleasesPromise.then((data) => {
        //bannerImage
        const bannerImage = document.createElement("img");
        bannerImage.className = "bannerImgImg";
        const bannerImageSection = document.getElementById("playListHeaderBanner");
        bannerImageSection.append(bannerImage);
        bannerImage.src = data.images[0].url;
        //bannerImage.src = data.images[0].url as string;
        //banner Title
        const bannerTitle = document.createElement("h1");
        bannerTitle.textContent = data.name;
        const htmlBannerTitle = document.getElementById("playListHeaderTitle");
        htmlBannerTitle.append(bannerTitle);
        //banner description
        const bannerDescription = document.createElement("h6");
        bannerDescription.textContent = data.description;
        const bannerDescriptionHtml = document.getElementById("playListHeaderDesc");
        bannerDescriptionHtml.append(bannerDescription);
        const musicDataList = data.tracks.items;
        ;
        const albumSongList = document.getElementById("playListTrackLists");
        musicDataList.forEach((track, index) => {
            const songListTrack = document.createElement("div");
            songListTrack.className = "songListTrack row";
            songListTrack.id = `Track-${Number(index + 1)}`;
            const trackNo = document.createElement("p");
            trackNo.className = "titleHash col-1 ";
            trackNo.textContent = `${Number(index + 1)}`;
            let playlistTrack;
            let albumTrack;
            const trackName = document.createElement("p");
            trackName.className = "titleTitleName col-lg-9 col-md-9 col-xl-9 col-xxl-9 col-sm-9 col-6";
            if ('track' in track) {
                playlistTrack = track;
                trackName.textContent = type === "playlist" ? playlistTrack.track.name : "";
            }
            else {
                albumTrack = track;
                trackName.textContent = albumTrack.name || "";
            }
            const trackOptions = document.createElement('p');
            trackOptions.innerHTML = "⋮";
            trackOptions.className = "titleSpotifyMoreOptions col-1";
            const trackDuration = document.createElement("p");
            trackDuration.className = "titleSpotifyDuration col-1";
            trackDuration.textContent = timeConvertion(type === "playlist" ? (playlistTrack === null || playlistTrack === void 0 ? void 0 : playlistTrack.track.duration_ms) || 0 : (albumTrack === null || albumTrack === void 0 ? void 0 : albumTrack.duration_ms) || 0);
            const submenu = document.createElement("div");
            submenu.className = "submenu";
            const innerDiv1 = document.createElement("div");
            innerDiv1.className = "submenu-inner";
            const paragraph1 = document.createElement("p");
            paragraph1.textContent = "Add to Queue";
            paragraph1.classList.add("addToQueue");
            innerDiv1.append(paragraph1);
            const innerDiv2 = document.createElement("div");
            innerDiv2.className = "submenu-inner";
            const paragraph2 = document.createElement("p");
            paragraph2.textContent = "  Save to Playlist";
            paragraph2.classList.add("SaveToPlaylist");
            innerDiv2.append(paragraph2);
            if ('track' in track) {
                playlistTrack = track;
                innerDiv1.id = type === "playlist" ? playlistTrack.track.id : "";
                innerDiv2.id = type === "playlist" ? playlistTrack.track.id : "";
            }
            else {
                albumTrack = track;
                innerDiv1.id = albumTrack.id || "";
                innerDiv2.id = albumTrack.id || "";
            }
            submenu.append(innerDiv1, innerDiv2);
            songListTrack.append(trackNo, trackName, trackOptions, submenu, trackDuration);
            let submenuTimeout;
            trackOptions.addEventListener("click", function (event) {
                event.stopPropagation(); // Prevent the click event from reaching the document click event listener
                // Hide all other submenus
                const allSubmenus = document.querySelectorAll('.submenu');
                allSubmenus.forEach((otherSubmenu) => {
                    if (otherSubmenu !== submenu) {
                        otherSubmenu.style.display = 'none';
                        otherSubmenu.style.opacity = '0';
                    }
                });
                submenu.style.display = "block";
                submenu.style.opacity = '1';
                submenuTimeout = setTimeout(() => {
                    submenu.style.display = 'none';
                }, 3000);
            });
            // Event listener to clear the timeout when the mouse enters the submenu
            submenu.addEventListener("mouseenter", function () {
                clearTimeout(submenuTimeout);
            });
            // Event listener to hide the submenu when the mouse leaves
            submenu.addEventListener("mouseleave", function () {
                submenu.style.display = 'none';
            });
            //add to queue
            function addItemToPlaybackQueue(trackId) {
                const uris = [`spotify:track:${trackId}`];
                const deviceId = localStorage.getItem('spotifyDeviceId');
                const accessToken = localStorage.getItem('access_token');
                const trackdata = {
                    uris: uris
                };
                if (deviceId) {
                    trackdata.device_id = deviceId;
                }
                console.log('Track Data:', trackdata); // Log the trackdata before making the request
                fetch('https://api.spotify.com/v1/me/player/queue', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(trackdata)
                })
                    .then(response => {
                    console.log('Response Status:', response.status); // Log the response status
                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                    return response.json();
                })
                    .then(queueData => {
                    console.log('Success:', queueData);
                })
                    .catch(error => {
                    console.error('Error:', error);
                });
            }
            innerDiv1.addEventListener('click', function () {
                console.log("inner Div 1 pressed");
                const trackId = innerDiv1.id;
                addItemToPlaybackQueue(trackId);
            });
            //add to favourite playlist:POST method
            const playlistId = '4OC3L8EvBkI5sROoAICgQw';
            const apiUrl = `https://api.spotify.com/v1/playlists/${playlistId}/tracks`;
            function addTrackToPlaylist(trackId) {
                const uris = [`spotify:track:${trackId}`];
                const position = 0;
                const accessToken = localStorage.getItem('access_token');
                const trackdata = {
                    uris: uris,
                    position: position
                };
                fetch(apiUrl, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(trackdata)
                })
                    .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                    return response.json();
                })
                    .then(trackdata => {
                    console.log('Success:', trackdata);
                })
                    .catch(error => {
                    console.error('Error:', error);
                });
            }
            innerDiv2.addEventListener('click', function () {
                console.log("inner Div 2 pressed");
                const trackId = innerDiv2.id;
                addTrackToPlaylist(trackId);
            });
            //play the song
            songListTrack.onclick = () => {
                var _a;
                let sourceUrl;
                let sourceName;
                if ('track' in track) {
                    const playlistTrack = track;
                    sourceUrl = type === "playlist" ? playlistTrack.track.uri : undefined;
                    sourceName = type === "playlist" ? playlistTrack.track.name : undefined;
                }
                else {
                    const albumTrack = track;
                    sourceUrl = track.uri;
                    sourceName = track.name;
                }
                if (sourceUrl && sourceName) {
                    console.log("played");
                    playSong(sourceUrl, sourceName, data.name, ((_a = data.images[0]) === null || _a === void 0 ? void 0 : _a.url) || "");
                }
            };
            albumSongList.append(songListTrack);
        });
    });
}))();
(_a = document.querySelector("#loginLink")) === null || _a === void 0 ? void 0 : _a.addEventListener('click', () => {
    changeIframeContent("profile-1.html");
});
(_b = document.querySelector("#navHomeButton")) === null || _b === void 0 ? void 0 : _b.addEventListener('click', () => {
    changeIframeContent("home-1.html");
});
(_c = document.querySelector("#navSearchButton")) === null || _c === void 0 ? void 0 : _c.addEventListener('click', () => {
    changeIframeContent("searchpage-1.html");
});
