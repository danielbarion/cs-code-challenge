import Handlebars from "handlebars";

Handlebars.registerHelper("newDate", function (aString) {
  return new Date(aString).toLocaleString();
});
