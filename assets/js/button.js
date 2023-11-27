const navigate = (direction) => {
  if (direction === "backward" && !isSamePage()) {
    history.back();
  } else if (direction === "forward") {
    history.forward();
  }
};

const isSamePage = () => {
  const currentURL = window.location.href;
  const previousPageURL = document.referrer;
  return currentURL === previousPageURL;
};
