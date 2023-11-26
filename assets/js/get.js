import { setupPlayer } from "../js/main.js";

const clientId = "3123b1eded6c47ab91bf1fd765a537b6";
const clientSecret = "98598afa94de4a93b71b39e1efd13a80";

async function getDataFromCache(
  apiEndpoint,
  cacheKey,
  cacheDuration = 600000 /* 10 minutes in milliseconds */
) {
  // Check if cached data is still valid
  const cachedData = localStorage.getItem(cacheKey);

  if (cachedData) {
    const { data, timestamp } = JSON.parse(cachedData);
    const currentTime = new Date().getTime();

    if (currentTime - timestamp < cacheDuration) {
      console.log(`Using cached data for ${apiEndpoint}`);
      return data;
    }
  }

  // Fetch fresh data from the API
  const freshData = await getData(apiEndpoint);

  // Cache the fresh data with a timestamp
  const dataToCache = { data: freshData, timestamp: new Date().getTime() };
  localStorage.setItem(cacheKey, JSON.stringify(dataToCache));

  console.log(`Fetched and cached data for ${apiEndpoint}`);
  return freshData;
}

async function getData(apiEndpoint) {
  const accessToken = await refreshAccessToken(); // Call refreshAccessToken to get the access token
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
      return data;
    } else {
      throw new Error("Failed to make authorized request");
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

async function refreshAccessToken() {
  const tokenExpireIn =
    parseInt(localStorage.getItem("token_expires_in"), 10) || 0;
  const currentTime = new Date().getTime();
  const accessToken = localStorage.getItem("access_token");

  if (accessToken && tokenExpireIn > currentTime) {
    console.log("Using existing access token");
    return accessToken;
  } else {
    const tokenUrl = "https://accounts.spotify.com/api/token";
    const refresh_token = localStorage.getItem("refresh_token");
    const data = new URLSearchParams();
    data.append("grant_type", "refresh_token");
    data.append("refresh_token", refresh_token);
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
        tokenData.refresh_token || refresh_token
      );
      localStorage.setItem(
        "token_expires_in",
        new Date().getTime() + tokenData.expires_in * 1000
      );
      setupPlayer();
      return tokenData.access_token;
    } else {
      throw new Error("Failed to refresh access token");
    }
  }
}

export { getData, getDataFromCache };

// const clientId = "3123b1eded6c47ab91bf1fd765a537b6";
// const clientSecret = "98598afa94de4a93b71b39e1efd13a80";

// async function getDataFromCache(
//   apiEndpoint,
//   cacheKey,
//   cacheDuration = 600000 /* 10 minutes in milliseconds */
// ) {
//   // Check if cached data is still valid
//   const cachedData = localStorage.getItem(cacheKey);

//   if (cachedData) {
//     const { data, timestamp } = JSON.parse(cachedData);
//     const currentTime = new Date().getTime();

//     if (currentTime - timestamp < cacheDuration) {
//       console.log(`Using cached data for ${apiEndpoint}`);
//       return data;
//     }
//   }

//   // Fetch fresh data from the API
//   const freshData = await getData(apiEndpoint);

//   // Cache the fresh data with a timestamp
//   const dataToCache = { data: freshData, timestamp: new Date().getTime() };
//   localStorage.setItem(cacheKey, JSON.stringify(dataToCache));

//   console.log(`Fetched and cached data for ${apiEndpoint}`);
//   return freshData;
// }

// async function getData(apiEndpoint) {
//   const apiHeaders = {
//     Authorization: `Bearer ${localStorage.getItem("access_token")}`,
//   };
//   console.log(apiHeaders);

//   try {
//     const response = await fetch(apiEndpoint, {
//       method: "GET",
//       headers: apiHeaders,
//     });

//     if (response.ok) {
//       const data = await response.json();
//       return data;
//     } else {
//       throw new Error("Failed to make authorized request");
//     }
//   } catch (error) {
//     console.error("Error:", error);
//   }
// }

// async function refreshAccessToken(refreshToken) {
//   const tokenExpireIn =
//     parseInt(localStorage.getItem("token_expiry_time"), 10) || 0;
//   const currentTime = new Date().getTime();
//   if (accessToken && tokenExpireIn > currentTime) {
//     console.log("Using existing access token");
//   } else {
//     const tokenUrl = "https://accounts.spotify.com/api/token";
//     const data = new URLSearchParams();
//     data.append("grant_type", "refresh_token");
//     data.append("refresh_token", refreshToken);
//     const authBase64 = btoa(`${clientId}:${clientSecret}`);
//     const response = await fetch(tokenUrl, {
//       method: "POST",
//       body: data,
//       headers: {
//         Authorization: `Basic ${authBase64}`,
//         "Content-Type": "application/x-www-form-urlencoded",
//       },
//     });
//     if (response.ok) {
//       const tokenData = await response.json();
//       console.log(tokenData.access_token);
//       localStorage.setItem("access_token", tokenData.access_token);
//       localStorage.setItem(
//         "refresh_token",
//         tokenData.refresh_token || refreshToken
//       );
//       localStorage.setItem(
//         "token_expires_in",
//         new Date().getTime() + tokenData.expires_in * 1000
//       );
//     } else {
//       throw new Error("Failed to refresh access token");
//     }
//   }
// }
// export { getData, refreshAccessToken, getDataFromCache };
