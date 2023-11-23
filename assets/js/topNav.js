var no_box = document.querySelector(".no-box");

var i = 1;

function prev() {
  // Start position
  if (i == 1) {
    // Add disabled attribute on
    // prev button
    document.getElementsByClassName("prev").disabled = true;

    // Remove disabled attribute
    // from next button
    document.getElementsByClassName("next").disabled = false;
  } else {
    i--;
    return setNo();
  }
}

function next() {
  // End position
  if (i == 5) {
    // Add disabled attribute on
    // next button
    document.getElementsByClassName("next").disabled = true;

    // Remove disabled attribute
    // from prev button
    document.getElementsByClassName("prev").disabled = false;
  } else {
    i++;
    return setNo();
  }
}

function setNo() {
  // Change innerhtml
  return (no_box.innerHTML = i);
}
