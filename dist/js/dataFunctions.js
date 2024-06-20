const WEATHER_API_KEY = "2c8a828b65008ce642d7380eb7380a03";

export const setLocationObject = (locationObj, coordsObj) => {
  const { lat, lon, name, unit } = coordsObj;

  locationObj.setLat(lat);
  locationObj.setLon(lon);
  locationObj.setName(name);
  unit && locationObj.setUnit(unit);
};

export const getHomeLocation = () =>
  localStorage.getItem("defaultWeatherLocation");

export const getWeatherFromCoords = async (locationObj) => {
  const lat = locationObj.getLat();
  const lon = locationObj.getLon();
  const units = locationObj.getUnit();
  const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=${units}&appid=${WEATHER_API_KEY}`;
  try {
    const weatherStream = await fetch(url);
    const weatherJson = await weatherStream.json();
    return weatherJson;
  } catch (err) {
    console.error(err);
  }
  // this function should be replace by a serveless function
};

export const getCoordsFromApi = async (entryText, units) => {
  const regex = /^\d+$/g;
  const flag = regex.test(entryText) ? "zip" : "q";
  const url = `http://api.openweathermap.org/data/2.5/weather?${flag}=${entryText}&units=${units}id=524901&appid=${WEATHER_API_KEY}`;
  const encodedUrl = encodeURI(url);
  try {
    const dataStream = await fetch(encodedUrl);
    const jsonData = await dataStream.json();
    console.log(jsonData);
    return jsonData;
  } catch (err) {
    console.error(err.stack);
  }
};

export const cleantText = (text) => text.replaceAll(/ {2,}/g, " ").trim();
