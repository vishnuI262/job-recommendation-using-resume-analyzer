import React from 'react';
import './LoadingPage.css'; // Import CSS

function LoadingPage() {
    return (
        <div className="loading-page">
            <div className="loading-spinner"></div>
            <p>Analyzing your resume...</p>
        </div>
    );
}

export default LoadingPage;
