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
  const propWords = words.map(
    (word) => word.charAt(0).toUpperCase() + word.slice(1)
  );

  return propWords.join(" ");
};

const updateWeatherLocationHeader = (message) => {
  const h1 = document.getElementById("currentForecast__location"); //maybe h2
  if (message.indexOf("Lat:") !== -1 && message.indexOf("Lon:") !== -1) {
    const msgARray = message.split(" ");
    const mapArray = msgARray.map((msg) => {
      return msg.replace(":", ": ");
    });
    const lat =
      mapArray[0].indexOf("-") === "-1"
        ? mapArray[0].slice(0, 10)
        : mapArray[0].slice(0, 11);

    const lon =
      mapArray[1].indexOf("-") === "-1"
        ? mapArray[1].slice(0, 10)
        : mapArray[1].slice(0, 11);
    h1.textContent = `${lat} • ${lon}`;
  } else {
    h1.textContent = message;
  }
};

export const updateScreenReaderConfirmation = (message) => {
  const elt = document.getElementById("confirmation");
  elt.textContent = message;
};

export const updateDisplay = (weatherJson, locationObj) => {
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
  displaySixDaysForecast(weatherJson);
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
  let child = parentElement.lastElementChild;
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
  document.documentElement.classList.add(weatherClass);
  document.documentElement.classList.forEach((img) => {
    if (img !== weatherClass) document.documentElement.classList.remove(img);
  });
};

const buildScreenReaderWeather = (weatherJson, locationObj) => {
  const location = locationObj.getName();
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
    `${Math.round(weatherObj.list[0].main.temp)}°`,
    tempUnit
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
    `High ${Math.round(Number(weatherObj.list[0].main.temp_max))}°`
  );
  const mminTemp = createElem(
    "div",
    "mintemp",
    `Low ${Math.round(Number(weatherObj.list[0].main.temp_min))}°`
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
  div.className = divClassName;
  if (divText) {
    div.textContent = divText;
  }
  if (divClassName === "temp") {
    const unitDiv = document.createElement("div");
    unitDiv.className = "unit";
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
      else i.classList.add("far", "fa-moon");
      break;
    case "02":
      if (lastChar === "d") i.classList.add("far", "fa-cloud-sun");
      else i.classList.add("far", "fa-cloud-moon");
      break;
    case "03":
      i.classList.add("fas", "fa-cloud");
      break;
    case "04":
      i.classList.add("fas", "fa-cloud-meatball");
      break;
    case "09":
      i.classList.add("fas", "fa-cloud-rain");
      break;
    case "10":
      if (lastChar === "d") i.classList.add("far", "fa-cloud-sun-rain");
      else i.classList.add("far", "fa-cloud-moon-rain");
      break;
    case "11":
      i.classList.add("fas", "fa-poo-storm");
      break;

    case "13":
      i.classList.add("far", "fa-snowflake");
      break;

    case "15":
      i.classList.add("fas", "fa-smog");
      break;
    default:
      i.classList.add("fas", "fa-question-circle");
  }
  return i;
};

const displayCurrentConditions = (currentConditionArray) => {
  const ccContainer = document.getElementById("currentForecast__conditions");
  currentConditionArray.forEach((cc) => {
    ccContainer.appendChild(cc);
  });
};

const displaySixDaysForecast = (weatherJson) => {
  for (let i = 1; i <= 6; ++i) {
    const dfArr = createDailyForecastDivs(weatherJson.list[i * 5]); // to make longs intervalles between hours
    displayDailyForecast(dfArr);
  }
};

const createDailyForecastDivs = (dayWeather) => {
  const dayAbreviationText = getDayAbreviation(dayWeather.dt);
  const dayAbreviation = createElem("p", "dayAbreviation", dayAbreviationText);
  const dayIcon = createDailyForecastIcon(
    dayWeather.weather[0].icon,
    dayWeather.weather[0].description
  );
  const dayHight = createElem(
    "p",
    "dayHigh",
    `${Math.round(Number(dayWeather.main.temp_max))}°`
  );
  const dayLow = createElem(
    "p",
    "dayLow",
    `${Math.round(Number(dayWeather.main.temp_min))}°`
  );
  return [dayAbreviation, dayIcon, dayHight, dayLow];
};

const getDayAbreviation = (data) => {
  const dateObj = new Date(data * 1000);
  const utcString = dateObj.toUTCString();
  return utcString.slice(0, 3).toUpperCase();
};

const createDailyForecastIcon = (icon, altText) => {
  const img = document.createElement("img");
  if (window.innerWidth < 768 || window.innerHeight < 1025)
    img.src = `https://openweathermap.org/img/wn/${icon}.png`;
  else img.src = `https://openweathermap.org/img/wn/${icon}@2x.png`;
  img.alt = altText;
  return img;
};

const displayDailyForecast = (dfArr) => {
  const dayDiv = createElem("div", "forecastDay");
  dfArr.forEach((el) => {
    dayDiv.appendChild(el);
  });
  const dailyForecastContainer = document.getElementById(
    "dailyForecast__contents"
  );
  dailyForecastContainer.appendChild(dayDiv);
};
