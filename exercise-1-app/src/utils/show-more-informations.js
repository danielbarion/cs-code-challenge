import renderHtml from "./render-html";

const switchShowInformation = () => {
  window["cs-exercise-1"].canShowMoreInformation =
    !window["cs-exercise-1"].canShowMoreInformation;

  if (window["cs-exercise-1"].canShowMoreInformation) {
    renderHtml(window["cs-exercise-1"].data);
  } else {
    renderHtml(window["cs-exercise-1"].filteredData);
  }
};

export default switchShowInformation;
