import React from 'react';

function WelcomeScreen() {
  return (
    <div className="welcome" id="welcome-box">
      <img src="images/clear.png" alt="Welcome" className="welcome-icon" style={{ width: '100px' }} />
      <h2>Welcome to the Weather App</h2>
      <p>Search for any city above ☝️ to view its current weather!</p>
    </div>
  );
}

export default WelcomeScreen;
