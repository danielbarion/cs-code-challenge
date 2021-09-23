export default async (url) =>
  fetch(url).then(function (response) {
    return response.json();
  });
