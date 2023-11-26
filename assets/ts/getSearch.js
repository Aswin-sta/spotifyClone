var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
import { getData } from "../js/get.js";
function main() {
  return __awaiter(this, void 0, void 0, function* () {
    const searchCategoryPromise = getData(
      "https://api.spotify.com/v1/browse/categories?country=IN"
    );
    searchCategoryPromise.then((data) => {
      const categoryData = data.categories.items;
      //console.log(categoryData);
      const searchSection = document.querySelector("section.searchDisplay");
      if (searchSection) {
        categoryData.forEach((element) => {
          const searchContainer = document.createElement("div");
          searchContainer.classList.add(
            "col-5",
            "col-sm-5",
            "col-md-4",
            "col-lg-3",
            "searchBlock",
            "d-inline-flex",
            "mb-5",
            "ml-3",
            "overflow-hidden"
          );
          const title = document.createElement("h2");
          title.classList.add(
            "fw-bolder",
            "p-2",
            "text-sm",
            "text-md",
            "text-lg"
          );
          title.textContent = element.name;
          let imageElement = document.createElement("img");
          imageElement.classList.add(
            "img-thumbnail",
            "position-absolute",
            "img-fluid"
          );
          imageElement.src = element.icons[0].url;
          searchContainer.append(title, imageElement);
          searchContainer.classList.add("clickable");
          searchContainer.onclick = () => {
            document.location.href = "specificGenre-1.html";
            sessionStorage.setItem("id", element.id);
          };
          const randomColor = getRandomColor();
          searchContainer.style.backgroundColor = randomColor;
          searchSection.appendChild(searchContainer);
        });
      }
    });
  });
}
// Function to generate random colours
function getRandomColor() {
  const red = Math.floor(Math.random() * 256);
  const green = Math.floor(Math.random() * 256);
  const blue = Math.floor(Math.random() * 256);
  return `rgb(${red}, ${green}, ${blue})`;
}
const searchBar = document.querySelector(".searchInput");
if (searchBar) {
  searchBar.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      document.location.href = "searchList-1.html";
      sessionStorage.setItem("value", searchBar.value);
    }
  });
}
main();
