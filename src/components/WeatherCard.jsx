import React, { useState } from "react";
import { getClothingAndActivityRecommendations } from "../services/llmService";

const WeatherCard = ({
  weatherData,
  setRecommendations,
  setLoadingRecs,
  setError,
}) => {
  const [loading, setLoading] = useState(false);

  const handleGetRecommendations = async () => {
    setLoading(true);
    setLoadingRecs(true);
    setError(null);

    try {
      const recs = await getClothingAndActivityRecommendations(weatherData);
      setRecommendations(recs);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setLoadingRecs(false);
    }
  };

  return (
    <div className="weather-section">
      <div className="weather-card main-card">
        <div className="weather-main">
          <div className="location-info">
            <h2 className="city-name">
              {weatherData.name}, {weatherData.country}
            </h2>
            <p className="weather-desc">{weatherData.weatherDescription}</p>
          </div>
          <img
            src={weatherData.weatherIcon}
            alt={weatherData.weatherDescription}
            className="weather-icon-lg"
          />
        </div>

        <div className="temperature-display">
          <span className="temp-value">{weatherData.temp}</span>
          <span className="temp-unit">°C</span>
        </div>

        <p className="feels-like">Feels like {weatherData.feelsLike}°C</p>

        <div className="weather-grid">
          <div className="weather-item">
            <svg
              className="weather-item-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path>
            </svg>
            <div>
              <p className="weather-item-label">Humidity</p>
              <p className="weather-item-value">{weatherData.humidity}%</p>
            </div>
          </div>

          <div className="weather-item">
            <svg
              className="weather-item-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2"></path>
            </svg>
            <div>
              <p className="weather-item-label">Wind Speed</p>
              <p className="weather-item-value">{weatherData.windSpeed} m/s</p>
            </div>
          </div>
        </div>

        <button
          className="btn-primary"
          onClick={handleGetRecommendations}
          disabled={loading}
        >
          <span className="btn-text">
            {loading ? "Loading..." : "Get AI Recommendations"}
          </span>
          {loading && <span className="btn-spinner"></span>}
        </button>
      </div>
    </div>
  );
};

export default WeatherCard;
