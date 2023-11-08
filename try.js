// const clientID = "3123b1eded6c47ab91bf1fd765a537b6";
// const clientSecret = "98598afa94de4a93b71b39e1efd13a80";
// const authBase64 = btoa(`${clientID}:${clientSecret}`);
// const authURL = "https://accounts.spotify.com/api/token";

// const data = new URLSearchParams();
// data.append("grant_type", "client_credentials");

// async function getToken() {
//   try {
//     const response = await fetch(authURL, {
//       method: "POST",
//       body: data,
//       headers: {
//         Authorization: `Basic ${authBase64}`,
//         "Content-Type": "application/x-www-form-urlencoded",
//       },
//     });
//     if (!response.ok) {
//       throw new console.error("Network response failed");
//     }

//     const token = await response.json();
//     return token;
//   } catch {
//     console.log("fetch operation failed");
//   }
// }

// // const data1 = await getToken();
// // console.log(data1.access_token);
// Define your Spotify Developer App credentials

async function getProfileData() {
  const accessToken = await getToken();
  console.log(accessToken);

  // Replace with the specific Spotify API endpoint you want to access
  const apiEndpoint = "https://api.spotify.com/v1/me";

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

const clientId = "3123b1eded6c47ab91bf1fd765a537b6";
const clientSecret = "98598afa94de4a93b71b39e1efd13a80";
const redirectUri = "http://127.0.0.1:5500/index.html";
const scope = "user-read-private user-read-email"; // Add the scopes you need

// Function to build the Spotify authorization URL
function buildAuthorizationUrl() {
  const authorizationUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=code`;
  window.location.href = authorizationUrl;
}

// Function to extract the authorization code from the URL
function getAuthorizationCode() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("code");
}

// Function to exchange authorization code for access and refresh tokens
async function exchangeCodeForTokens(authorizationCode) {
  const tokenUrl = "https://accounts.spotify.com/api/token";
  const data = new URLSearchParams();
  data.append("grant_type", "authorization_code");
  data.append("code", authorizationCode);
  data.append("redirect_uri", redirectUri);

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
    return {
      accessToken: tokenData.access_token,
      refreshToken: tokenData.refresh_token,
    };
  } else {
    throw new Error("Failed to make authorized request");
  }
}

// Function to obtain and return the access token
async function getToken() {
  // Build the authorization URL and retrieve the authorization code
  //
  const authorizationCode = getAuthorizationCode();
  if (authorizationCode) {
    // You have the authorization code, proceed to exchange it for tokens
    const tokens = await exchangeCodeForTokens(authorizationCode);
    console.log("Access Token:", tokens.accessToken);
    console.log("Refresh Token:", tokens.refreshToken);
    return tokens.accessToken;
  } else {
    // The user may have denied access or there was an error.
    console.error("Authorization code not found.");
  }
}

// Entry point of your application
async function main() {
  buildAuthorizationUrl();
  const res = await getToken();
  console.log(res);
  // getProfileData(res);
  // Continue with your application logic
}

main();
