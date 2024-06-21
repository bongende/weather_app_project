export const setPlaceholderText = () => {
  const input = document.getElementById("searchBar__text");
  window.innerWidth < 400
    ? (input.placeholder = "City, State, Country")
    : (input.placeholder = "city, State, Country or Zip Code");
};

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

export const displayApiError = (statusCode) => {
  const properMsg = toProperCase(statusCode.message);
  updateWeatherLocationHeader(properMsg);
  updateScreenReaderConfirmation(`${properMsg}. Please try again.`);
  console.error(properMsg);
};

const toProperCase = (text) => {
  const words = text.split(" ");
  console.log(words);
  const propWords = words.map(
    (word) => word.chartAt(0).toUpperCase() + word.slice(1)
  );

  return propWords.join(" ");
};

const updateWeatherLocationHeader = (message) => {
  const h1 = document.getElementById("currentForecast__location"); //maybe h2
  h1.textContent = message;
};

export const updateScreenReaderConfirmation = (message) => {
  const elt = document.getElementById("confirmation");
  elt.textContent = message;
};

export const updateDisplay = (weatherJson, locationObj) => {
  console.log(weatherJson);
  fadeDisplay();
  clearDisplay();
  const weatherClass = getWeatherClalss(weatherJson.list[0].weather[0].icon); // maybe weatherJson.current.weather[0].icon  )

  setBGImage(weatherClass);
  const screenReaderWeather = buildScreenReaderWeather(
    weatherJson,
    locationObj
  );
  updateScreenReaderConfirmation(screenReaderWeather);
  updateWeatherLocationHeader(locationObj.getName());
  //current condition to disp
  const ccARay = createCurrentConditionDivis(
    weatherJson,
    locationObj.getUnit()
  );
  displayCurrentConditions(ccARay);
  // six day forecast
  setFocusOnSearch();
  fadeDisplay();
};

const fadeDisplay = () => {
  const cc = document.getElementById("currentForecast");
  cc.classList.toggle("zero-vis");
  cc.classList.toggle("fade-in");
  const sixDay = document.getElementById("dailyForecast");
  sixDay.classList.toggle("zero-vis");
  sixDay.classList.toggle("fade-in");
};

const clearDisplay = () => {
  const currentCondition = document.getElementById(
    "currentForecast__conditions"
  );
  deleteContents(currentCondition);
  const sixDayForecast = document.getElementById("dailyForecast__contents");
  deleteContents(sixDayForecast);
};

const deleteContents = (parentElement) => {
  const child = parentElement.lastElementChild;
  while (child) {
    parentElement.removeChild(child);
    child = parentElement.lastElementChild;
  }
};

const getWeatherClalss = (icon) => {
  const firstTwochars = icon.slice(0, 2);
  const lastChar = icon.slice(2);
  const weatherLookup = {
    "09": "snow",
    10: "rain",
    11: "rain",
    13: "snow",
    50: "fog",
  };

  let weatherClass;

  if (weatherLookup[firstTwochars]) {
    weatherClass = weatherLookup[firstTwochars];
  } else if (lastChar === "d") {
    weatherClass = "clouds";
  } else {
    weatherClass = "night";
  }
  return weatherClass;
};

const setBGImage = (weatherClass) => {
  document.documentElement.calssList.add(weatherClass);
  document.documentElement.classList.forEach((img) => {
    if (img !== weatherClass) document.documentElement.classList.remove(img);
  });
};

const buildScreenReaderWeather = (weatherJson, locationObj) => {
  const location = locationwind.degObj.getName();
  const unit = locationObj.getUnit();
  const tempUnit = unit === "imperial" ? "Fahrenheit" : "celcius";
  return `${weatherJson.list[0].weather.description} and ${Math.round(
    Number(weatherJson.list[0].main.temp)
  )}°${tempUnit.temp} in ${location}`; // maybe `${weatherJson.current.weather[0].description}`;
};

const setFocusOnSearch = () => {
  document.getElementById("searchBar__text").focus();
};

const createCurrentConditionDivis = (weatherObj, unit) => {
  const tempUnit = unit === "imperial" ? "F" : "C";
  const windUnit = unit === "imperial" ? "mph" : "m/s";
  const icon = createMainImageDiv(
    weatherObj.list[0].weather[0].icon,
    weatherObj.list[0].weather[0].description
  );
  const temp = createElem(
    "div",
    "temp",
    `${Math.round(weatherObj.list[0].main.temp)} ${tempUnit}`
  );
  const properDesc = toProperCase(weatherObj.list[0].weather[0].description);
  const desc = createElem("div", "desc", properDesc);
  const feels = createElem(
    "div",
    "feels",
    `Feels Like ${Math.round(Number(weatherObj.list[0].main.feels_like))}°`
  );
  const maxTemp = createElem(
    "div",
    "maxtemp",
    `High ${Math.round(Number(weatherObj.list[0].main.temp_max))}`
  );
  const mminTemp = createElem(
    "div",
    "mintemp",
    `Low ${Math.round(Number(weatherObj.list[0].main.temp_min))}`
  );
  const humidity = createElem(
    "div",
    "humidity",
    `Humidity ${weatherObj.list[0].main.humidity}%`
  );
  const wind = createElem(
    "div",
    "wind",
    `Wind ${Math.round(Number(weatherObj.list[0].main.pressure))} ${windUnit}`
  ); // it actually giv the pressure
  return [icon, temp, desc, feels, maxTemp, mminTemp, humidity, wind];
};

const createMainImageDiv = (icon, altText) => {
  const iconDiv = createElem("div", "icon");
  iconDiv.id = "icon";
  const faIcon = translateIconToFA(icon);
  faIcon.ariaHidden = true;
  faIcon.title = altText;
  iconDiv.appendChild(faIcon);
  return iconDiv;
};

const createElem = (elemType, divClassName, divText = "", unit = "") => {
  const div = document.createElement(elemType);
  div.ClassName = divClassName;
  if (divText) {
    div.textContent = divText;
  }
  if (divClassName === "temp") {
    const unitDiv = document.createElement("div");
    unitDiv.className("unit");
    unitDiv.textContent = unit;
    div.appendChild(unitDiv);
  }
  return div;
};

const translateIconToFA = (icon) => {
  const i = document.createElement("i");
  const firstTwochars = icon.slice(0, 2);
  const lastChar = icon.slice(2);
  switch (firstTwochars) {
    case "01":
      if (lastChar === "d") i.classList.add("far", "fa-sun");
      else i.calssList.add("far", "fa-moon");
      break;
    case "02":
      if (lastChar === "d") i.classList.add("far", "fa-cloud-sun");
      else i.calssList.add("far", "fa-cloud-moon");
      break;
    case "03":
      i.classList.add("fas", "fa-cloud");
      break;
    case "04":
      i.calssList.add("fas", "fa-cloud-meatball");
      break;
    case "09":
      i.calssList.add("fas", "fa-cloud-rain");
      break;
    case "10":
      if (lastChar === "d") i.classList.add("far", "fa-cloud-sun-rail");
      else i.calssList.add("far", "fa-cloud-moon-rail");
      break;
    case "11":
      i.calssList.add("fas", "fa-poo-storm");
      break;

    case "13":
      i.calssList.add("far", "fa-snowflake");
      break;

    case "15":
      i.calssList.add("fas", "fa-smog");
      break;
    default:
      i.calssList.add("fas", "fa-question-circle");
  }
  return i;
};

const displayCurrentConditions = (currentConditionArray) => {
  const ccContainer = document.getElementById("currentForecast__conditions");
  currentConditionArray.forEach((cc) => {
    ccContainer.appendChild(cc);
  });
};
