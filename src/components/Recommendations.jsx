import React from "react";

const Recommendations = ({ recommendations }) => {
  if (!recommendations) return null;

  return (
    <div className="recommendations-section">
      <div className="section-header">
        <h2 className="section-title">AI Recommendations</h2>
      </div>

      <div className="recommendations-layout">
        <div className="rec-card">
          <div className="rec-header">
            <svg className="rec-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4Z" />
            </svg>
            <h4 className="rec-title">What to Wear</h4>
          </div>
          <ul className="rec-list">
            {recommendations.clothingRecommendations.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="rec-card">
          <div className="rec-header">
            <svg className="rec-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12C20,14.4 19,16.5 17.3,18C15.9,16.7 14,16 12,16C10,16 8.1,16.7 6.7,18C5,16.5 4,14.4 4,12A8,8 0 0,1 12,4Z" />
            </svg>
            <h4 className="rec-title">Things to Do</h4>
          </div>
          <ul className="rec-list">
            {recommendations.activitySuggestions.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Recommendations;
