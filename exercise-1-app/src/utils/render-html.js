import Handlebars from "handlebars";

const source = document.getElementById("entry-template").innerHTML;
const template = Handlebars.compile(source);

const renderHtml = (data) => {
  const html = template({ people: data });
  const appElement = document.querySelector("#app");
  appElement.innerHTML = html;
};

export default renderHtml;
