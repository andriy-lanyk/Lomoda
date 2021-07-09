const headerCityButton = document.querySelector(".header__city-button");
const cartListGoods = document.querySelector(".cart__list-goods");
const cartTotalCost = document.querySelector(".cart__total-cost");

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

function getLocalStorage() {
  return JSON?.parse(localStorage.getItem("cart-lomoda")) || [];
}
function setLocalStorage(data) {
  localStorage.setItem("cart-lomoda", JSON.stringify(data));
}

function renderCart() {
  cartListGoods.textContent = "";

  const cartItems = getLocalStorage();

  let totalPrice = 0;

  if (cartItems) {
    cartItems.forEach((item, i) => {
      const tr = document.createElement("tr");

      tr.innerHTML = `
    <td>${i + 1}</td>
    <td>${item.brand} ${item.name}</td>
    ${item.color ? `<td>${item.color}</td>` : `<td>-</td>`}
    ${item.size ? `<td>${item.size}</td>` : `<td>-</td>`}
    <td>${item.cost} &#8381;</td>
    <td><button class="btn-delete" data-id="${item.id}">&times;</button></td>
    `;

      totalPrice += item.cost;

      cartListGoods.append(tr);
    });
  }

  cartTotalCost.textContent = totalPrice + " ₽";
}

function deleteItemCart(id) {
  const cartItems = getLocalStorage();
  const newCartItems = cartItems.filter((item) => item.id !== id);
  setLocalStorage(newCartItems);
}

cartListGoods.addEventListener("click", deleteGoodFromCart);

function deleteGoodFromCart(e) {
  if (e.target.matches(".btn-delete")) {
    deleteItemCart(e.target.dataset.id);
    renderCart();
  }
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
  renderCart();
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

function getGoods(callback, prop, value) {
  const goodsTitle = document.querySelector(".goods__title");
  getData()
    .then((data) => {
      if (value) {
        callback(data.filter((item) => item[prop] === value));
        if (value === "men") {
          goodsTitle.textContent = "Мужчинам";
        } else if (value === "women") {
          goodsTitle.textContent = "Женщинам";
        } else if (value === "kids") {
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

// Goods category
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
    getGoods(renderGoodsList, "category", hash);
  }

  getGoods(renderGoodsList, "category", hash);
} catch (err) {
  console.warn(err);
}

// Page good
try {
  if (!document.querySelector(".card-good")) {
    throw "This is not a card-good page";
  }

  const cardGoodImage = document.querySelector(".card-good__image");
  const cardGoodTitle = document.querySelector(".card-good__title");
  const cardGoodBrand = document.querySelector(".card-good__brand");
  const cardGoodPrice = document.querySelector(".card-good__price");
  const cardGoodColor = document.querySelector(".card-good__color");
  const cardGoodSelectWrapper = document.querySelectorAll(
    ".card-good__select__wrapper"
  );
  const cardGoodSizes = document.querySelector(".card-good__sizes");
  const cardGoodColorList = document.querySelector(".card-good__color-list");
  const cardGoodSizesList = document.querySelector(".card-good__sizes-list");
  const cardGoodBuy = document.querySelector(".card-good__buy");

  function generateList(data) {
    return data.reduce(
      (html, item, i) =>
        html + `<li class="card-good__select-item" data-id="${i}">${item}</li>`,
      ""
    );
  }

  function renderCardGood([{ id, brand, name, cost, color, sizes, photo }]) {
    const data = { brand, name, cost, id };

    cardGoodImage.src = `goods-image/${photo}`;
    cardGoodImage.alt = `${brand} ${name}`;
    cardGoodBrand.textContent = brand;
    cardGoodTitle.textContent = name;
    cardGoodPrice.textContent = `${cost} ₽`;

    if (color) {
      cardGoodColor.textContent = color[0];
      cardGoodColor.dataset.id = 0;
      cardGoodColorList.innerHTML = generateList(color);
    } else {
      cardGoodColor.style.display = "none";
    }

    if (sizes) {
      cardGoodSizes.textContent = sizes[0];
      cardGoodSizes.dataset.id = 0;
      cardGoodSizesList.innerHTML = generateList(sizes);
    } else {
      cardGoodSizes.style.display = "none";
    }

    if (getLocalStorage().some((item) => item.id === id)) {
      cardGoodBuy.classList.add("delete");
      cardGoodBuy.textContent = "Удалить из корзины";
    }

    cardGoodBuy.addEventListener("click", createCard);

    function createCard() {
      if (cardGoodBuy.classList.contains("delete")) {
        deleteItemCart(id);
        cardGoodBuy.classList.remove("delete");
        cardGoodBuy.textContent = "Добавить в корзину";
        return;
      }

      if (color) data.color = cardGoodColor.textContent;
      if (sizes) data.size = cardGoodSizes.textContent;

      cardGoodBuy.classList.add("delete");
      cardGoodBuy.textContent = "Удалить из корзины";

      const cardData = getLocalStorage();
      cardData.push(data);
      setLocalStorage(cardData);
    }
  }

  cardGoodSelectWrapper.forEach((item) => {
    item.addEventListener("click", (e) => {
      const target = e.target;

      if (target.closest(".card-good__select")) {
        target.classList.toggle("card-good__select__open");
      }

      if (target.closest(".card-good__select-item")) {
        const cardGoodSelect = item.querySelector(".card-good__select");
        cardGoodSelect.textContent = target.textContent;
        cardGoodSelect.dataset.id = target.dataset.id;
        cardGoodSelect.classList.remove("card-good__select__open");
      }
    });
  });

  getGoods(renderCardGood, "id", hash);
} catch (err) {
  console.log(err);
}
