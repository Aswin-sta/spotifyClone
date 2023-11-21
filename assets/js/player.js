const musicPlayer = document.getElementById("musicPlayer");
const playPauseButton = document.getElementById("playPause");
const playPauseDiv = document.getElementById("playPauseDiv");
const progress = document.querySelector(".progress");

const playerSongTitle = document.querySelector("#playerSongTitle");
const playerSongAlbum = document.querySelector("#playerSongAlbum");
const playerAlbumArt = document.querySelector("#playerAlbumArt");

playPauseDiv.addEventListener("click", togglePlayPause);

function togglePlayPause() {
  if (musicPlayer.paused) {
    musicPlayer.play();
    playPauseButton.innerHTML = '<i class="fas fa-pause"></i>';
  } else {
    musicPlayer.pause();
    playPauseButton.innerHTML = '<i class="fas fa-play"></i>';
  }
}

function updateProgress() {
  const percent = (musicPlayer.currentTime / musicPlayer.duration) * 100;
  progress.style.width = percent + "%";
  sessionStorage.setItem("music_timestamp", musicPlayer.currentTime.toString());
}

musicPlayer.addEventListener("timeupdate", updateProgress);

function changeSource(newSource, trackName, trackAlbum, trackImage) {
  const audioSource = document.getElementById("audioSource");
  audioSource.src = newSource;
  musicPlayer.load(); // Reload the audio element to apply the new source
  musicPlayer.play(); // Start playing the new source
  playPauseButton.innerHTML = '<i class="fas fa-pause"></i>';
  playerSongTitle.innerHTML = trackName;
  playerSongAlbum.innerHTML = trackAlbum;
  playerAlbumArt.src = trackImage;
  sessionStorage.setItem("music_name", trackName);
  sessionStorage.setItem("music_album", trackAlbum);
  sessionStorage.setItem("music_image", trackImage);
  sessionStorage.setItem("music_src", newSource);
}

function playOnLoad() {
  const storedMusicSrc = sessionStorage.getItem("music_src");
  const storedImage = sessionStorage.getItem("music_image");
  const storedName = sessionStorage.getItem("music_name");
  const storedAlbum = sessionStorage.getItem("music_album");
  const storedTimestamp =
    parseFloat(sessionStorage.getItem("music_timestamp")) || 0;

  const audioSource = document.getElementById("audioSource");
  audioSource.src = storedMusicSrc;
  playerSongAlbum.innerHTML = storedAlbum;
  playerAlbumArt.src = storedImage;
  playerSongTitle.innerHTML = storedName;
  musicPlayer.load();
  musicPlayer.currentTime = storedTimestamp;
  musicPlayer.play();
  playPauseButton.innerHTML = '<i class="fas fa-pause"></i>';
}

window.addEventListener("load", playOnLoad);

export { changeSource };
