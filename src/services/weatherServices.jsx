const GEOCODING_URL = "https://geocoding-api.open-meteo.com/v1/search";
const OPENMETEO_BASE_URL = "https://api.open-meteo.com/v1/forecast";

const mapWeatherCodeToDescription = (code) => {
  const mapping = {
    0: "Clear sky",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Fog",
    48: "Depositing rime fog",
    51: "Light drizzle",
    53: "Moderate drizzle",
    55: "Dense drizzle",
    56: "Light freezing drizzle",
    57: "Dense freezing drizzle",
    61: "Slight rain",
    63: "Moderate rain",
    65: "Heavy rain",
    66: "Light freezing rain",
    67: "Heavy freezing rain",
    71: "Slight snow fall",
    73: "Moderate snow fall",
    75: "Heavy snow fall",
    77: "Snow grains",
    80: "Slight rain showers",
    81: "Moderate rain showers",
    82: "Violent rain showers",
    85: "Slight snow showers",
    86: "Heavy snow showers",
    95: "Thunderstorm",
    96: "Thunderstorm with slight hail",
    99: "Thunderstorm with heavy hail",
  };
  return mapping[code] || "Unknown weather";
};

const mapWeatherCodeToIconURL = (code) => {
  const base =
    "https://raw.githubusercontent.com/erikflowers/weather-icons/master/svg/";
  const codeMap = {
    0: base + "wi-day-sunny.svg",
    1: base + "wi-day-cloudy.svg",
    2: base + "wi-cloud.svg",
    3: base + "wi-cloudy.svg",
    45: base + "wi-fog.svg",
    48: base + "wi-fog.svg",
    51: base + "wi-sprinkle.svg",
    53: base + "wi-sprinkle.svg",
    55: base + "wi-sprinkle.svg",
    56: base + "wi-rain-mix.svg",
    57: base + "wi-rain-mix.svg",
    61: base + "wi-rain.svg",
    63: base + "wi-rain.svg",
    65: base + "wi-rain.svg",
    66: base + "wi-rain-mix.svg",
    67: base + "wi-rain-mix.svg",
    71: base + "wi-snow.svg",
    73: base + "wi-snow.svg",
    75: base + "wi-snow.svg",
    77: base + "wi-snow.svg",
    80: base + "wi-showers.svg",
    81: base + "wi-showers.svg",
    82: base + "wi-showers.svg",
    85: base + "wi-snow.svg",
    86: base + "wi-snow.svg",
    95: base + "wi-thunderstorm.svg",
    96: base + "wi-storm-showers.svg",
    99: base + "wi-storm-showers.svg",
  };
  return codeMap[code] || base + "wi-na.svg";
};

export const fetchCoordsByCity = async (cityName) => {
  const url = `${GEOCODING_URL}?name=${encodeURIComponent(cityName)}&count=5`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to fetch geocoding data");
  }

  const data = await response.json();
  if (!data.results || data.results.length === 0) {
    throw new Error(`City "${cityName}" not found`);
  }

  return data.results;
};

export const fetchWeatherByCity = async (cityName) => {
  const location = await fetchCoordsByCity(cityName);
  const primaryLocation = location[0];
  const { latitude: lat, longitude: lon } = primaryLocation;

  const url = `${OPENMETEO_BASE_URL}?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=relative_humidity_2m`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to fetch weather data");
  }

  const data = await response.json();
  const weather = data.current_weather;

  let humidity = null;
  if (
    data.hourly &&
    data.hourly.time &&
    data.hourly.relative_humidity_2m &&
    Array.isArray(data.hourly.time)
  ) {
    const now = new Date(weather.time);
    const hours = data.hourly.time.map((t) => new Date(t));
    let minDiff = Infinity,
      minIdx = 0;

    for (let i = 0; i < hours.length; i++) {
      const diff = Math.abs(hours[i] - now);
      if (diff < minDiff) {
        minDiff = diff;
        minIdx = i;
      }
    }
    humidity = data.hourly.relative_humidity_2m[minIdx];
  }

  return {
    name: primaryLocation.name,
    country: primaryLocation.country,
    temp: Math.round(weather.temperature),
    feelsLike: Math.round(weather.temperature),
    humidity: humidity !== null ? Math.round(humidity) : "N/A",
    weatherMain: weather.weathercode,
    weatherDescription: mapWeatherCodeToDescription(weather.weathercode),
    weatherIcon: mapWeatherCodeToIconURL(weather.weathercode),
    windSpeed: weather.windspeed,
  };
};
