import { getData, refreshAccessToken } from "./get.js";

await refreshAccessToken(localStorage.getItem("refresh_token"));
const userDataPromise = getData("https://api.spotify.com/v1/me");
console.log(userDataPromise);

try {
  const userData = await userDataPromise;
  console.log(userData.display_name);
  console.log(userData.images[1].url);
  document.getElementById("username").innerHTML = userData.display_name;
  document.getElementById("profile").src = userData.images[1].url;
} catch (error) {
  console.error("Error fetching user data:", error);
}
