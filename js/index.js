// Enter your city in header
const headerCityButton = document.querySelector(".header__city-button");

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
