# WeatherApp

A simple React app that shows weather information and provides AI-powered clothing and activity recommendations based on the current weather.

## Features

- Search weather by city name.
- Display current weather details, temperature, humidity, wind speed, and weather icon.
- AI-generated clothing and outdoor activity recommendations.
- Error handling with clear messages.
- Loading states for data fetching.

## Installation

1. Clone the repo:

2. Navigate to the project directory:

3. Install dependencies:

4. Create a `.env` file at the root of the project and add your API key:

5. Start the development server:


## Usage

- Enter a city name in the search bar to get current weather info.
- Click "Get AI Recommendations" for clothing and activity suggestions based on the weather.

## Project Structure

- `src/components` — React components like SearchBar, WeatherCard, Recommendations.
- `src/services` — API service calls for weather data and AI recommendations.
- `App.jsx` — Main application component.
- `.env` — Environment variables for API keys (not included in GitHub).

## Technologies Used

- React
- Vite
- OpenMeteo API for weather data
- OpenRouter AI for recommendations

## Notes

- Keep your API key secret; do not commit `.env` to version control.
- This project is for learning and demonstration purposes.

---

Feel free to customize the README with your GitHub repo URL and API key instructions.
