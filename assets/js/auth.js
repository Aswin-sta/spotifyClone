const clientId = "3123b1eded6c47ab91bf1fd765a537b6";
const clientSecret = "98598afa94de4a93b71b39e1efd13a80";
const redirectUri = "http://127.0.0.1:5500/main.html";
const scope =
  "user-read-private user-read-email user-top-read user-library-read user-library-modify streaming playlist-read-private playlist-modify-public playlist-modify-private";

function getAuthorizationCode() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("code");
}
function exchangeCodeForTokens(authorizationCode) {
  const tokenUrl = "https://accounts.spotify.com/api/token";
  const data = new URLSearchParams();
  data.append("grant_type", "authorization_code");
  data.append("code", authorizationCode);
  data.append("redirect_uri", redirectUri);

  const authBase64 = btoa(`${clientId}:${clientSecret}`);

  return fetch(tokenUrl, {
    method: "POST",
    body: data,
    headers: {
      Authorization: `Basic ${authBase64}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(
          `Token exchange failed with status: ${response.status}`
        );
      }
      return response.json();
    })
    .then((data) => {
      const accessToken = data.access_token;
      const refreshToken = data.refresh_token;
      if (!accessToken || !refreshToken) {
        throw new Error("Invalid response format from token endpoint");
      }
      localStorage.setItem("access_token", accessToken);
      localStorage.setItem("refresh_token", refreshToken);
      window.location.href = redirectUri;
      return { accessToken, refreshToken };
    })
    .catch((error) => {
      console.error("Error exchanging code for tokens:", error);
      throw error; // Propagate the error
    });
}

async function main() {
  const authorizationCode = getAuthorizationCode();

  if (!authorizationCode) {
    const authorizationUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=code`;
    window.location.href = authorizationUrl;
  } else {
    try {
      const tokens = await exchangeCodeForTokens(authorizationCode);
      if (!tokens) {
        throw new Error("Failed to get auth token");
      }
      console.log("Access Token:", tokens.accessToken);
      console.log("Refresh Token:", tokens.refreshToken);
    } catch (error) {
      console.error("Error:", error);
    }
  }
}

main();
