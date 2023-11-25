var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { getData, refreshAccessToken } from "../js/get.js";
import { changeSource } from "../js/player.js";
(() => __awaiter(void 0, void 0, void 0, function* () {
    yield refreshAccessToken(localStorage.getItem("refresh_token"));
    function isPlaylistTrack(track) {
        return 'track' in track && typeof track.track.preview_url === 'string';
    }
    function isAlbumTrack(track) {
        return typeof track.preview_url === 'string';
    }
    //url search parameters
    const id = new URLSearchParams(window.location.search).get("id");
    const type = new URLSearchParams(window.location.search).get("type");
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
        console.log("data");
        console.log(data);
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
            trackName.className = "titleTitleName col-lg-10 col-md-10 col-xl-10 col-xxl-10 col-sm-10 col-8";
            if ('track' in track) {
                playlistTrack = track;
                trackName.textContent = type === "playlist" ? playlistTrack.track.name : "";
            }
            else {
                albumTrack = track;
                trackName.textContent = albumTrack.name || "";
            }
            // trackName.textContent = type === "playlist" ? track.track.name : track.name;
            const trackDuration = document.createElement("p");
            trackDuration.className = "titleSpotifyDuration col-1";
            trackDuration.textContent = timeConvertion(type === "playlist" ? (playlistTrack === null || playlistTrack === void 0 ? void 0 : playlistTrack.track.duration_ms) || 0 : (albumTrack === null || albumTrack === void 0 ? void 0 : albumTrack.duration_ms) || 0);
            // trackDuration.textContent = timeConvertion(
            //   type === "playlist" ? track.track.duration_ms : track.duration_ms
            // );
            songListTrack.append(trackNo, trackName, trackDuration);
            songListTrack.onclick = () => {
                var _a;
                let sourceUrl;
                let sourceName;
                if ('track' in track) {
                    const playlistTrack = track;
                    sourceUrl = type === "playlist" ? playlistTrack.track.preview_url : undefined;
                    sourceName = type === "playlist" ? playlistTrack.track.name : undefined;
                }
                else {
                    const albumTrack = track;
                    sourceUrl = track.preview_url;
                    sourceName = track.name;
                }
                if (sourceUrl && sourceName) {
                    changeSource(sourceUrl, sourceName, data.name, ((_a = data.images[0]) === null || _a === void 0 ? void 0 : _a.url) || "");
                }
            };
            // songListTrack.onclick = () => {
            //   const sourceUrl =
            //     type === "playlist" ? track.track.preview_url : track.preview_url;
            //   const sourceName = type === "playlist" ? track.track.name : track.name;
            //   changeSource(sourceUrl, sourceName, data.name, data.images[0].url);
            // };
            albumSongList.append(songListTrack);
        });
    });
}))();
