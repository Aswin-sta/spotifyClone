// Replace with the specific Spotify API endpoint you want to access
// const apiEndpoint = "https://api.spotify.com/v1/browse/new-releases";
// const apiEndpoint = "https://api.spotify.com/v1/browse/featured-playlists";
const apiEndpoint =
  "https://api.spotify.com/v1/browse/categories/romance/playlists";

const clientId = "3123b1eded6c47ab91bf1fd765a537b6";
const clientSecret = "98598afa94de4a93b71b39e1efd13a80";
const redirectUri = "http://127.0.0.1:5500/home.html";
const scope = "user-read-private user-read-email";

async function getData(apiEndpoint, accessToken) {
  console.log(accessToken);

  const apiHeaders = {
    Authorization: `Bearer ${accessToken}`,
  };
  console.log(apiHeaders);

  try {
    const response = await fetch(apiEndpoint, {
      method: "GET",
      headers: apiHeaders,
    });

    if (response.ok) {
      const data = await response.json();
      console.log(data);
      // You can process the data from the Spotify API here
    } else {
      throw new Error("Failed to make authorized request");
    }
  } catch (error) {
    console.error("Error:", error);
  }
}
const accestoken = localStorage.getItem("accessToken");
getData(apiEndpoint, accestoken);
