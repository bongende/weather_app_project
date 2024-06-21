const fetch = require("node-fetch");
const WEATHER_API_KEY = process.env;

exports.handler = async (event, context) => {
  const params = JSON.parse(event.body);
  const { text, unit } = params;

  const regex = /^\d+$/g;
  const flag = regex.test(text) ? "zip" : "q";

  const url = `http://api.openweathermap.org/data/2.5/weather?${flag}=${entryText}&units=${unit}id=524901&appid=${WEATHER_API_KEY}`;
  const encodedUrl = encodeURI(url);
  try {
    const dataStream = await fetch(encodedUrl);
    const jsonData = await dataStream.json();
    return {
      statusCode: 200,
      body: JSON.stringify(jsonData),
    };
  } catch (err) {
    return {
      satusCode: 402,
      body: err.stack,
    };
  }
};
