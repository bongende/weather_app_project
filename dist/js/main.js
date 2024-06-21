import CurrentLocation from "./CurrentLocation.js";
import {
  setPlaceholderText,
  addSpinner,
  displayError,
  displayApiError,
  updateScreenReaderConfirmation,
  updateDisplay,
} from "./domFunctions.js";
import {
  setLocationObject,
  getHomeLocation,
  getWeatherFromCoords,
  cleantText,
  getCoordsFromApi,
} from "./dataFunctions.js";

const currentLoc = new CurrentLocation();

const initApp = () => {
  // Add Listener
  const geoButton = document.getElementById("geoLocation");
  geoButton.addEventListener("click", getGeoWeather);
  const homeButton = document.getElementById("home");
  homeButton.addEventListener("click", loadWeather);
  const saveButton = document.getElementById("saveLocation");
  saveButton.addEventListener("click", saveLocation);
  const unitButton = document.getElementById("unit");
  unitButton.addEventListener("click", setUnitPref);
  const refreshButton = document.getElementById("refresh");
  refreshButton.addEventListener("click", refreshWeather);
  const locationEntry = document.getElementById("searchBar__form");
  locationEntry.addEventListener("submit", submitNewLocation);

  ///setup
  setPlaceholderText();
  // load Weather
  loadWeather();
};

document.addEventListener("DOMContentLoaded", initApp);

const getGeoWeather = (event) => {
  if (event) {
    if (event.type === "click") {
      // add spinner
      const mapIcon = document.querySelector(".fa-map-marker-alt");
      addSpinner(mapIcon);
    }
  }

  if (!navigator.geolocation) return geoError();
  navigator.geolocation.getCurrentPosition(geoSuccess, geoError);
};

const geoError = (errObj) => {
  const errMsg = errObj.message ? errObj.message : "Geolocation not Supported";
  displayError(errMsg, errMsg);
};

const geoSuccess = (position) => {
  const myCoordsObj = {
    lat: position.coords.latitude,
    lon: position.coords.longitude,
    name: `Lat:${position.coords.latitude} Lon:${position.coords.longitude} `,
  };
  // Set location object
  setLocationObject(currentLoc, myCoordsObj);
  // update data and display
  updateDataAndDisplay(currentLoc);
};

const loadWeather = (event) => {
  const savedLocation = getHomeLocation();
  if (!savedLocation && !event) return getGeoWeather();
  if (!savedLocation && event.type === "click")
    displayError(
      "Sorry. Please save your home locoation first",
      "No Home Location Saved."
    );
  else if (savedLocation && !event) displayHomeLocationWeather(savedLocation);
  else {
    const homeButton = document.querySelector(".fa-home");
    addSpinner(homeButton);
    displayHomeLocationWeather(savedLocation);
  }
};

const displayHomeLocationWeather = (home) => {
  if (typeof home === "string") {
    const locationJson = JSON.parse(home);
    const myCoordsObj = {
      lat: locationJson.lat,
      lon: locationJson.lon,
      name: locationJson.name,
      unit: locationJson.unit,
    };
    setLocationObject(currentLoc, myCoordsObj);
    updateDataAndDisplay(currentLoc);
  }
};

const saveLocation = () => {
  if (currentLoc.getLat() && currentLoc.getLon()) {
    const saveIcon = document.querySelector(".fa-save");
    addSpinner(saveIcon);
    const location = {
      name: currentLoc.getName(),
      lat: currentLoc.getLat(),
      lon: currentLoc.getLon(),
      unit: currentLoc.getUnit(),
    };
    localStorage.setItem("defaultWeatherLocation", JSON.stringify(location));
    updateScreenReaderConfirmation(
      `Saved ${currentLoc.getName()} as home location`
    );
    console.log(`Saved ${currentLoc.getName()} as home location`);
  }
};

const setUnitPref = () => {
  const unitIcon = document.querySelector(".fa-chart-bar");
  addSpinner(unitIcon);
  currentLoc.toggleUnit();
  updateDataAndDisplay(currentLoc);
};

const refreshWeather = () => {
  const refreshIcon = document.querySelector(".fa-sync-alt");
  addSpinner(refreshIcon);
  updateDataAndDisplay(currentLoc);
};

const submitNewLocation = async (event) => {
  event.preventDefault();
  const text = document.getElementById("searchBar__text").value;
  const entryText = cleantText(text);
  if (!entryText.length) return;
  const locationIcon = document.querySelector(".fa-sharp");
  addSpinner(locationIcon);
  const coordsData = await getCoordsFromApi(entryText, currentLoc.getUnit());
  if (coordsData)
    if (coordsData.cod === 200) {
      const myCoordsObj = {
        lat: coordsData.coord.lat,
        lon: coordsData.coord.lon,
        name: coordsData.sys.country
          ? `${coordsData.name}, ${coordsData.sys.country}`
          : coordsData.name,
      };
      //console.log("currnet location", currentLoc);
      setLocationObject(currentLoc, myCoordsObj);
      updateDataAndDisplay(currentLoc);
    } else displayApiError(coordsData);
  else displayError("connection Error", "Connection Error");
};

const updateDataAndDisplay = async (locationObj) => {
  if (locationObj instanceof CurrentLocation) {
    const weatherJson = await getWeatherFromCoords(locationObj);
    if (weatherJson) updateDisplay(weatherJson, locationObj);
  } else {
    const loc = new CurrentLocation();
    loc.setLat(locationObj.city.coord.lat);
    loc.setLon(locationObj.city.coord.lon);
    loc.setName(`Lat:${loc.getLat()} Lon:${loc.getLon()}`);
    const weatherJson = await getWeatherFromCoords(loc);
    if (weatherJson) updateDisplay(weatherJson, loc);
  }
};
