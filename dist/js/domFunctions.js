export const addSpinner = (element) => {
  animateButton(element);
  setTimeout(animateButton, 1000, element);
};

const animateButton = (elt) => {
  elt.classList.toggle("none");
  elt.nextElementSibling.classList.toggle("block");
  elt.nextElementSibling.classList.toggle("none");
};

export const displayError = (headerMsg, srMsg) => {
  updateWeatherLocationHeader(headerMsg);
  updateScreenReaderConfirmation(srMsg);
};

const updateWeatherLocationHeader = (message) => {
  const h1 = document.getElementById("currentForecast__location"); //maybe h2
  h1.textContent = message;
};

export const updateScreenReaderConfirmation = (message) => {
  const elt = document.getElementById("confirmation");
  elt.textContent = message;
};
