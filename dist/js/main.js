import CurrentLocation from "./CurrentLocation.js";
import { addSpinner } from "./domFunctions.js";

const currnetLoc = new CurrentLocation();

const initApp = () => {
  // Add Listener
  const geoButton = document.getElementById("geoLocation");
  geoButton.addEventListener("click", getGeoWeather);

  // buttons = document.querySelectorAll(".button");

  ///setup

  // load Weather
};

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
  const errMsg = errObj.message || "Geolocation not Supported";
};

document.addEventListener("DOMContentLoaded", initApp);
