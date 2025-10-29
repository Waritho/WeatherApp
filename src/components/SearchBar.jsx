import React, { useState, useEffect } from "react";
import { fetchWeatherByCity, fetchCoordsByCity } from "../services/weatherServices";


const SearchBar = ({
  setWeatherData,
  setError,
  setLoading,
  setRecommendations,
}) => {
  const [cityInput, setCityInput] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (cityInput.length < 2) {
        setShowSuggestions(false);
        return;
      }
      try {
        const cities = await fetchCoordsByCity(cityInput);
        setSuggestions(cities);
        setShowSuggestions(true);
      } catch {
        setShowSuggestions(false);
      }
    };

    const timeoutId = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(timeoutId);
  }, [cityInput]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!cityInput.trim()) return;

    setSearching(true);
    setLoading(true);
    setError(null);
    setRecommendations(null);
    setShowSuggestions(false);

    try {
      const data = await fetchWeatherByCity(cityInput);
      setWeatherData(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      setWeatherData(null);
    } finally {
      setSearching(false);
      setLoading(false);
    }
  };

  const handleSuggestionClick = async (cityName) => {
    setCityInput(cityName);
    setShowSuggestions(false);

    setSearching(true);
    setLoading(true);
    setError(null);
    setRecommendations(null);

    try {
      const data = await fetchWeatherByCity(cityName);
      setWeatherData(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      setWeatherData(null);
    } finally {
      setSearching(false);
      setLoading(false);
    }
  };

  return (
    <div className="search-section">
      <form onSubmit={handleSearch} className="search-form" autoComplete="off">
        <div className="search-wrapper">
          <svg
            className="search-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
          <input
            type="text"
            value={cityInput}
            onChange={(e) => setCityInput(e.target.value)}
            className="search-input"
            placeholder="Search for a city..."
            required
          />
          <button type="submit" className="search-btn" disabled={searching}>
            <span className="btn-text">
              {searching ? "Searching..." : "Search"}
            </span>
            {searching && <span className="btn-spinner"></span>}
          </button>
          {showSuggestions && suggestions.length > 0 && (
            <div className="suggestions">
              {suggestions.map((city, idx) => (
                <div
                  key={idx}
                  className="suggestion-item"
                  onClick={() => handleSuggestionClick(city.name)}
                >
                  {city.name}, {city.country}
                </div>
              ))}
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default SearchBar;
