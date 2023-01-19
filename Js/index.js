// console.log("hello world");

const characterSection = document.querySelector(".character-section");
const movieDetail = document.querySelector(".movie-detail");
const form = document.getElementById("form");

// 1> Get the value of the Search Field

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  characterSection.innerHTML = document.querySelector(".comics").innerHTML = "";

  const inputField = document.querySelector(".input-field").value;

  document.querySelector(".input-field").value = "";

  await marvelApi(inputField.toLowerCase());

  console.log(inputField);
});

// Fetch data from marvel api

const marvelApi = async (name) => {
  try {
    const res = await fetch(
      `https://gateway.marvel.com:443/v1/public/characters?name=${name}&limit=60&apikey=d405829ff0871721459fd4cd5a7adfd4`
    );

    // console.log(res);
    if (!res.ok) throw new Error("something went wrong 😖😖😖 ");

    const { data } = await res.json();

    const results = data.results;

    // console.log(data);

    // Returning the data . So we can make take neccessary component of it.
    return dataObj(...results);
  } catch (err) {
    console.log(err);
  }
};

const dataObj = async function (data) {
  const obj = await {
    name: data.name,
    description: data.description,
    thumbnail: data.thumbnail,
    urls: data.urls,
    events: data.events.items,
  };
  // console.log(obj);

  await getId(obj.events);
  return renderHtml(obj);
};

const getId = function (data) {
  // const obj = data.splice
  // console.log(data.splice(2), data.lenght);
  data
    .splice(2)
    .map((el, i) => {
      return el.resourceURI;
    })
    .forEach((el, i) => {
      // console.log(el, i);
      const data = el.slice(-3);

      if (data.startsWith("/")) return;

      return characterRelatedDetails(data);
    });
};

const characterRelatedDetails = async (id) => {
  try {
    const res = await fetch(
      `https://gateway.marvel.com:443/v1/public/events/${id}?apikey=d405829ff0871721459fd4cd5a7adfd4`
    );

    if (!res.ok) throw new Error("something went wrong 😖😖😖 ");

    const { data } = await res.json();

    const results = data.results;
    renderDetail(...results);
  } catch (err) {
    console.log(err, 'something went wrong 😖😖😖 "');
  }
};

const renderDetail = function (data) {
  const thumbnail = data.thumbnail;
  // console.log(thumbnail);
  const path = `${thumbnail.path + "." + thumbnail.extension}?`;

  const html = `
            <img src="${path}" alt="${data.name}"/>

      `;
  document.querySelector(".comics").insertAdjacentHTML("afterbegin", html);
};

const renderHtml = function (data) {
  const html = `<div class="character-img">
                      <img src="${
                        data.thumbnail.path + "." + data.thumbnail.extension
                      }" alt="${data.name}" />
                    </div>
                    <div class="character-description">
                      <h1 class="character-name">${data.name}</h1>
                      <p>
                       ${data.description}
                      </p>
                      <a class="btn primary-btn" href="${
                        data.urls[1].url
                      }">learn more</a>
                  </div>

    `;

  // character__section.insertAdjacentHTML("afterbegin", html);
  document
    .querySelector(".character-section")
    .insertAdjacentHTML("afterbegin", html);
};
