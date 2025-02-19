import React from 'react';
import { useLocation } from 'react-router-dom';
import './ResultsPage.css';

function ResultsPage() {
  const location = useLocation();
  const { recommendations } = location.state || { recommendations: [] };

  return (
    <div className="results-page">
      <h1>Recommended Jobs</h1>
      {recommendations.length > 0 ? (
        <ul>
          {recommendations.map((job, index) => (
            <li key={index}>{job}</li>
          ))}
        </ul>
      ) : (
        <p>No recommendations found.</p>
      )}
    </div>
  );
}

export default ResultsPage;
