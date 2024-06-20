import CurrentLocation from "./CurrentLocation.js";
import {
  addSpinner,
  displayError,
  updateScreenReaderConfirmation,
} from "./domFunctions.js";
import { setLocationObject, getHomeLocation } from "./dataFunctions.js";

const currentLoc = new CurrentLocation();

const initApp = () => {
  // Add Listener
  const geoButton = document.getElementById("geoLocation");
  geoButton.addEventListener("click", getGeoWeather);
  const homeButton = document.getElementById("home");
  homeButton.addEventListener("click", loadWeather);
  const saveButton = document.getElementById("saveLocation");
  saveButton.addEventListener("click", saveLocation);

  // buttons = document.querySelectorAll(".button");

  ///setup

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

const updateDataAndDisplay = async (locationObj) => {
  console.log(locationObj);
  // const weatherJson = await getWeatherFromCoords(locationObj);
  // weatherJson && updateDataAndDisplay(weatherJson, locationObj);
};
