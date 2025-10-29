const OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1/chat/completions";

const parseRecommendations = (content) => {
  const clothingRecommendations = [];
  const activitySuggestions = [];
  const lines = content.split("\n");
  let currentSection = null;

  for (const line of lines) {
    let trimmedLine = line.trim();

    if (trimmedLine.toUpperCase().includes("CLOTHING")) {
      currentSection = "clothing";
      continue;
    } else if (trimmedLine.toUpperCase().includes("ACTIVIT")) {
      currentSection = "activities";
      continue;
    }

    const match = trimmedLine.match(/^[\d\-*•][\.\)\s]+(.+)/);
    if (match && match[1]) {
      let item = match[1].trim();
      item = item.replace(/^[*_•\s]+|[*_•\s]+$/g, "");

      if (item.length > 0) {
        if (
          currentSection === "clothing" &&
          clothingRecommendations.length < 5
        ) {
          clothingRecommendations.push(item);
        } else if (
          currentSection === "activities" &&
          activitySuggestions.length < 4
        ) {
          activitySuggestions.push(item);
        }
      }
    }
  }

  return { clothingRecommendations, activitySuggestions };
};

export const getClothingAndActivityRecommendations = async (weatherData) => {
  const apiKey = import.meta.env.VITE_REACT_APP_OPENROUTERAPIKEY;

  if (!apiKey || apiKey === "YOUR_OPENROUTER_API_KEY") {
    throw new Error(
      "Please set REACT_APP_OPENROUTER_API_KEY in your .env file"
    );
  }

  const prompt = `
Based on the current weather in ${weatherData.name}, ${weatherData.country}:
- Temperature: ${weatherData.temp}°C (feels like ${weatherData.feelsLike}°C)
- Weather: ${weatherData.weatherDescription}
- Humidity: ${weatherData.humidity}%
- Wind Speed: ${weatherData.windSpeed} m/s

Please provide 5 realistic and culturally appropriate clothing recommendations and 3-4 enjoyable outdoor activity ideas, referencing local culture and customs in this city/country.

Format your response as follows:
CLOTHING:
1. [item]
2. [item]
3. [item]
4. [item]
5. [item]

ACTIVITIES:
1. [activity]
2. [activity]
3. [activity]
4. [activity]
`;

  try {
    const response = await fetch(OPENROUTER_BASE_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error(
          "Invalid OpenRouter API key. Please check your API key."
        );
      } else if (response.status === 429) {
        throw new Error("Rate limit exceeded. Please try again later.");
      } else {
        throw new Error(
          `Failed to get recommendations: ${response.statusText}`
        );
      }
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "";
    return parseRecommendations(content);
  } catch (error) {
    if (error.message.includes("Failed to fetch")) {
      throw new Error("Network error. Please check your internet connection.");
    }
    throw error;
  }
};
