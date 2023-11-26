const navigate = (direction) => {
  if (direction === "backward" && !isSamePage()) {
    history.back();
    console.log(`${direction}`);
    console.log(`${history.back}`);
  } else if (direction === "forward") {
    history.forward();
    console.log(`${direction}`);
    console.log(`${history.forward}`);
  }
};

const isSamePage = () => {
  const currentURL = window.location.href;
  const previousPageURL = document.referrer;
  return currentURL === previousPageURL;
};
