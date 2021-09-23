import fetcher from "./utils/fetcher";
import renderHtml from "./utils/render-html";
import switchShowInformation from "./utils/show-more-informations";
import "./utils/handlebars-helpers";
import "./store";
import "./style.css";

const getData = async () =>
  fetcher("https://5dc588200bbd050014fb8ae1.mockapi.io/assessment");

const initializeEventListeners = () => {
  document.addEventListener("click", (event) => {
    if (event.target && event.target.id == "switchShowInformationButton") {
      switchShowInformation();
    }
  });
};

const initialize = async () => {
  initializeEventListeners();

  window["cs-exercise-1"].data = await getData();
  window["cs-exercise-1"].filteredData = JSON.parse(
    JSON.stringify(window["cs-exercise-1"].data)
  ).map((item) => {
    delete item.id;
    delete item.createdAt;

    return { ...item };
  });

  renderHtml(window["cs-exercise-1"].filteredData);
};

initialize();
