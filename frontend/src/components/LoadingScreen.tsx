import React from "react";

function LoadingScreen() {
  return (
    <div className="container">
      <div className="loading-container">
        <div className="loading-animation">
          <div className="loading-spinner">🏺</div>
          <div className="loading-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
        <h2>Loading Your Artisan Dashboard</h2>
        <p>Connecting to backend server...</p>
        <div className="loading-progress">
          <div className="progress-bar">
            <div className="progress-fill"></div>
          </div>
          <p className="loading-tip">This usually takes just a few seconds</p>
        </div>
      </div>
    </div>
  );
}

export default LoadingScreen;