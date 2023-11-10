// Replace with the specific Spotify API endpoint you want to access
const apiEndpoint = "https://api.spotify.com/v1/browse/new-releases";
// const apiEndpoint = "https://api.spotify.com/v1/browse/featured-playlists";

// const apiEndpoint =
//   "https://api.spotify.com/v1/browse/categories/romance/playlists";

const clientId = "3123b1eded6c47ab91bf1fd765a537b6";
const clientSecret = "98598afa94de4a93b71b39e1efd13a80";
const redirectUri = "http://127.0.0.1:5500/home.html";
const scope = "user-read-private user-read-email";

async function refreshAccessToken(refreshToken) {
  const tokenUrl = "https://accounts.spotify.com/api/token";
  const data = new URLSearchParams();
  data.append("grant_type", "refresh_token");
  data.append("refresh_token", refreshToken);
  const authBase64 = btoa(`${clientId}:${clientSecret}`);
  const response = await fetch(tokenUrl, {
    method: "POST",
    body: data,
    headers: {
      Authorization: `Basic ${authBase64}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });
  if (response.ok) {
    const tokenData = await response.json();
    console.log(tokenData.access_token);
    localStorage.setItem("access_token", tokenData.access_token);
    localStorage.setItem(
      "refresh_token",
      tokenData.refresh_token || refreshToken
    );
    return {
      accessToken: tokenData.access_token,
      // Note: The refresh token might be the same or a new one
      refreshToken: tokenData.refresh_token || refreshToken,
    };
  } else {
    throw new Error("Failed to refresh access token");
  }
}

await refreshAccessToken(localStorage.getItem("refresh_token"));

async function getData(apiEndpoint) {
  const apiHeaders = {
    Authorization: `Bearer ${localStorage.getItem("access_token")}`,
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
      return data;
    } else {
      throw new Error("Failed to make authorized request");
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

getData(apiEndpoint);
