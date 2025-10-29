import React, { useState } from "react";
import "./App.css";
import SearchBar from "./components/SearchBar";
import ErrorMessage from "./components/ErrorMessage";
import WeatherCard from "./components/WeatherCard";
import Recommendations from "./components/Recommendations";


function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState(null);
  const [loadingRecs, setLoadingRecs] = useState(false);

  return (
    <div className="container">
      <header className="header">
        <h1 className="header-title">Weather Forecast</h1>
        <p className="header-subtitle">Your personal weather companion</p>
      </header>

      <div className="content">
        <SearchBar
          setWeatherData={setWeatherData}
          setError={setError}
          setLoading={setLoading}
          setRecommendations={setRecommendations}
        />

        <ErrorMessage error={error} />

        {weatherData && (
          <WeatherCard
            weatherData={weatherData}
            setRecommendations={setRecommendations}
            setLoadingRecs={setLoadingRecs}
            setError={setError}
          />
        )}

        {recommendations && (
          <Recommendations recommendations={recommendations} />
        )}
      </div>
    </div>
  );
}

export default App;
