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
      return data;
    } else {
      throw new Error("Failed to make authorized request");
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

export { getData };
