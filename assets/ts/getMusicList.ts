import { getData } from "../js/get.js";
import { playSong } from "../js/player.js";
import { changeIframeContent } from "../js/changeIframeContent.js";

(async () => {
function isPlaylistTrack(track: any): track is spotifyDataPlaylist {
  return 'track' in track && typeof track.track.uri === 'string';
}

function isAlbumTrack(track: any): track is spotifyDataAlbumList {
  return typeof track.uri === 'string';
}

//session storage search parameters
const id = sessionStorage.getItem("id");
const type = sessionStorage.getItem("type");

//musiclist api  
const newReleasesPromise:any = getData(
  "https://api.spotify.com/v1/" + type + "s/" + id
);

//function to convert ms to min:sec format
function timeConvertion(duration_ms:number):string {
  const totalSeconds = Math.floor(duration_ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const remainingSeconds = totalSeconds % 60;
  const formattedSeconds =
    remainingSeconds < 10 ? `0${remainingSeconds}` : `${remainingSeconds}`;
  return `${minutes}:${formattedSeconds}`;
}


//interfaces for ts convertion

interface spotifyDataImg{
  url:string;
}

interface spotifyDataPlaylist{
  track:{
    duration_ms:number;
    name:string;
    uri:string;
    id:string;
  }
}

interface spotifyDataAlbumList{
    duration_ms:number;
    name:string;
    uri:string;
    id:string;
}

interface spotifyData{
  name:string;
  description:string | null;
  images:spotifyDataImg[];
  type:string;
  tracks:{ items:spotifyDataPlaylist[] | spotifyDataAlbumList[];}
}

newReleasesPromise.then((data:spotifyData) => {
  

  //bannerImage
  const bannerImage:HTMLImageElement = document.createElement("img");
  bannerImage.className = "bannerImgImg";
  const bannerImageSection = document.getElementById("playListHeaderBanner") as HTMLDivElement;
  bannerImageSection.append(bannerImage);
  bannerImage.src = data.images[0].url;
  //bannerImage.src = data.images[0].url as string;

  //banner Title
  const bannerTitle :HTMLHeadElement= document.createElement("h1");
  bannerTitle.textContent = data.name;
  const htmlBannerTitle = document.getElementById("playListHeaderTitle") as HTMLDivElement;
  htmlBannerTitle.append(bannerTitle);

  //banner description
  const bannerDescription:HTMLHeadElement = document.createElement("h6");
  bannerDescription.textContent = data.description;
  const bannerDescriptionHtml = document.getElementById("playListHeaderDesc") as HTMLDivElement;
  bannerDescriptionHtml.append(bannerDescription);

  const musicDataList = data.tracks.items as spotifyDataPlaylist[] | spotifyDataAlbumList[];;
  const albumSongList = document.getElementById("playListTrackLists") as HTMLDivElement;

  musicDataList.forEach((track:spotifyDataPlaylist | spotifyDataAlbumList, index:number) => {
    const songListTrack:HTMLDivElement = document.createElement("div");
    songListTrack.className = "songListTrack row";
    songListTrack.id = `Track-${Number(index + 1)}`;


    const trackNo:HTMLParagraphElement = document.createElement("p");
    trackNo.className = "titleHash col-1 ";
    trackNo.textContent = `${Number(index + 1)}`;


    let playlistTrack: spotifyDataPlaylist | undefined;
    let albumTrack: spotifyDataAlbumList | undefined;

    const trackName:HTMLParagraphElement= document.createElement("p");
    trackName.className ="titleTitleName col-lg-9 col-md-9 col-xl-9 col-xxl-9 col-sm-9 col-6";

    if ('track' in track) {
      playlistTrack = track as spotifyDataPlaylist;
      trackName.textContent = type === "playlist" ? playlistTrack.track.name : "";
    } else {
      albumTrack = track as spotifyDataAlbumList;
      trackName.textContent = albumTrack.name || "";
    }


    const trackOptions:HTMLParagraphElement=document.createElement('p');
    trackOptions.innerHTML="⋮";
    trackOptions.className="titleSpotifyMoreOptions col-1";
    

    const trackDuration:HTMLParagraphElement = document.createElement("p");
    trackDuration.className = "titleSpotifyDuration col-1";
    trackDuration.textContent = timeConvertion(
      type === "playlist" ? playlistTrack?.track.duration_ms || 0 : albumTrack?.duration_ms || 0
    );

   

    const submenu: HTMLDivElement = document.createElement("div");
    submenu.className = "submenu";
    
    const innerDiv1: HTMLDivElement = document.createElement("div");
    innerDiv1.className = "submenu-inner";
    
    
    
    const paragraph1: HTMLParagraphElement = document.createElement("p");
    paragraph1.textContent = "Add to Queue";
    paragraph1.classList.add("addToQueue");
    
    innerDiv1.append(paragraph1);
    
    const innerDiv2: HTMLDivElement = document.createElement("div");
    innerDiv2.className = "submenu-inner"; 
    
    const paragraph2: HTMLParagraphElement = document.createElement("p");
    paragraph2.textContent = "  Save to Playlist";
    paragraph2.classList.add("SaveToPlaylist"); 
    
    innerDiv2.append(paragraph2);

    if ('track' in track) {
      playlistTrack = track as spotifyDataPlaylist;
      innerDiv1.id=type === "playlist" ? playlistTrack.track.id : "";
      innerDiv2.id=type === "playlist" ? playlistTrack.track.id : "";
    } else {
      albumTrack = track as spotifyDataAlbumList;
      innerDiv1.id= albumTrack.id || "";
      innerDiv2.id= albumTrack.id || "";
    }
    
    submenu.append(innerDiv1, innerDiv2);
    

    
    

    songListTrack.append(trackNo, trackName, trackOptions,submenu,trackDuration);


    let submenuTimeout:number;

    trackOptions.addEventListener("click", function (event) {
      event.stopPropagation(); // Prevent the click event from reaching the document click event listener
    
      // Hide all other submenus
      const allSubmenus = document.querySelectorAll('.submenu') as NodeListOf<HTMLDivElement>;
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
    function addItemToPlaybackQueue(trackId: string): void {
      const uris: string[] = [`spotify:track:${trackId}`];
      const deviceId: string | null = localStorage.getItem('spotifyDeviceId');
      const accessToken: string = localStorage.getItem('access_token')!;
    
      const trackdata: any = {
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
    
    innerDiv1.addEventListener('click', function() {
      console.log("inner Div 1 pressed");
      const trackId: string = innerDiv1.id;
      addItemToPlaybackQueue(trackId);
    });
    


    //add to favourite playlist:POST method
    const playlistId: string = '4OC3L8EvBkI5sROoAICgQw';
    const apiUrl: string = `https://api.spotify.com/v1/playlists/${playlistId}/tracks`;

    function addTrackToPlaylist(trackId: string):void {
      const uris: string[] = [`spotify:track:${trackId}`];
      const position: number = 0;
      const accessToken: string = localStorage.getItem('access_token')!;

      const trackdata: any = {
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
    
    innerDiv2.addEventListener('click', function() {
      console.log("inner Div 2 pressed");
      const trackId :string= innerDiv2.id;
      addTrackToPlaylist(trackId);
    });




  //play the song
    songListTrack.onclick = () => {
      let sourceUrl: string | undefined;
      let sourceName: string | undefined;
    
      if ('track' in track) {
        const playlistTrack = track as spotifyDataPlaylist;
        sourceUrl = type === "playlist" ? playlistTrack.track.uri : undefined;
        sourceName = type === "playlist" ? playlistTrack.track.name : undefined;
      } else {
        const albumTrack = track as spotifyDataAlbumList;
        sourceUrl = track.uri;
        sourceName = track.name;
      }
    
      if (sourceUrl && sourceName) {
        console.log("played");
        playSong(sourceUrl, sourceName, data.name, data.images[0]?.url || "");
      }
    };
        

    albumSongList.append(songListTrack);
  });
});
})();

  document.querySelector("#loginLink")?.addEventListener('click',()=>{
    changeIframeContent("profile-1.html")
  })

   document.querySelector("#navHomeButton")?.addEventListener('click',()=>{
    changeIframeContent("home-1.html")
  })

  document.querySelector("#navSearchButton")?.addEventListener('click',()=>{
    changeIframeContent("searchpage-1.html")
  })