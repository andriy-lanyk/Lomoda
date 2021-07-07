// Enter your city in header
const headerCityButton = document.querySelector(".header__city-button");

let hash = location.hash.substring(1);

headerCityButton.textContent = localStorage.getItem("lomoda-location")
  ? `Your city: ${localStorage.getItem("lomoda-location")}`
  : "Enter your city";

headerCityButton.addEventListener("click", enterCity);

function enterCity() {
  const city = prompt("Enter your city");
  headerCityButton.textContent = `Your city: ${city}`;
  localStorage.setItem("lomoda-location", city);
}

// Open modal window and block scroll
const subHeaderCart = document.querySelector(".subheader__cart");
const cartOverlay = document.querySelector(".cart-overlay");

subHeaderCart.addEventListener("click", modalOpen);

cartOverlay.addEventListener("click", closeModal);

function modalOpen() {
  cartOverlay.classList.add("cart-overlay-open");
  document.addEventListener("keydown", closeModal);
  disableScroll();
}

function closeModal(e) {
  const target = e.target;

  if (
    target.matches(".cart__btn-close") ||
    target.matches(".cart-overlay") ||
    e.code === "Escape"
  ) {
    cartOverlay.classList.remove("cart-overlay-open");
    document.removeEventListener("keydown", closeModal);
    enableScroll();
  }
}

function disableScroll() {
  const widthScroll = window.innerWidth - document.body.offsetWidth;

  document.body.dbScrollY = window.scrollY;

  document.body.style.cssText = `
    position: fixed;
    top: ${-window.scrollY}px;
    left: 0;
    width: 100%;
    height: 100vh;
    overflow: hidden;
    padding-right: ${widthScroll}px;
    `;
}

function enableScroll() {
  document.body.style.cssText = "";
  window.scroll({
    top: document.body.dbScrollY,
  });
}

// Fetch from DataBase
async function getData() {
  const data = await fetch("db.json");

  if (data.ok) {
    return data.json();
  } else {
    throw new Error(
      `Данные не были получены, ошибка ${data.status} ${data.statusText}`
    );
  }
}

function getGoods(callback, value) {
  const goodsTitle = document.querySelector(".goods__title");
  getData()
    .then((data) => {
      if (value) {
        callback(data.filter((item) => item.category === value));
        if (value === "men") {
          goodsTitle.textContent = "Мужчинам";
        } else if (value === "women") {
          goodsTitle.textContent = "Женщинам";
        } else {
          goodsTitle.textContent = "Детям";
        }
      } else {
        callback(data);
      }
    })
    .catch((err) => {
      console.log("err: ", err);
    });
}

try {
  const goodsList = document.querySelector(".goods__list");

  if (!goodsList) {
    throw "This is not a goods page!";
  }

  function createCard({ id, preview, cost, brand, name, sizes }) {
    const li = document.createElement("li");
    li.classList.add("goods__item");
    li.innerHTML = `
    <article class="good">
    <a class="good__link-img" href="card-good.html#${id}">
    <img class="good__img" src="goods-image/${preview}" alt="">
    </a>
    <div class="good__description">
    <p class="good__price">${cost} &#8381;</p>
    <h3 class="good__title">${brand} <span class="good__title__grey">/ ${name}</span></h3>
    ${
      sizes
        ? `<p class="good__sizes">Размеры (RUS): <span class="good__sizes-list">${sizes.join(
            " "
          )}</span></p>`
        : ""
    }
    <a class="good__link" href="card-good.html#${id}">Подробнее</a>
    </div>
    </article>
    `;

    return li;
  }

  function renderGoodsList(data) {
    goodsList.textContent = "";

    data.forEach((item) => {
      const card = createCard(item);
      goodsList.append(card);
    });
  }

  window.addEventListener("hashchange", renderPageOnCategoryClick);

  function renderPageOnCategoryClick() {
    hash = location.hash.substring(1);
    getGoods(renderGoodsList, hash);
  }

  getGoods(renderGoodsList, hash);
} catch (err) {
  console.warn(err);
}
