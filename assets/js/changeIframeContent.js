function changeIframeContent(newSrc) {
  // Get the iframe element by its id
  const iframe = parent.document.getElementById("heroSection");

  // Change the src attribute to the new source
  iframe.src = newSrc;
}

export { changeIframeContent };
